/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    Text,
    View,
    TouchableOpacity,
    Switch, Dimensions
} from 'react-native';
import {
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
    FlatList,
    Image,
    AppState,
    AsyncStorage,
    ScrollView
} from "react-native";
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import Header from "../../components/Header";
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {
    updateDeviceStatus,
    updateAWSStatus,
    updateSwitchDeviceStatus,
    updateDeviceMode,
    updateScript
} from '../../actions/awsIoT'
import {MESSAGE_TOPIC, DISCONNECT_TOPIC, STATUS_TOPIC, CONNECT_TOPIC} from '../../constants/topics'
import {
    deviceSensorMode,
    deviceElements,
    allRoom,
    allDevices, allDevicesStatusOff, allDevicesStatusOn, deviceButtonMode
} from '../../constants/devices';
import navigator from 'navigators/CustomNavigator'
import styles from './styles'
import {isInt, isJSON} from "../../constants/common";
import _ from "lodash";

const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";
const {width, height} = Dimensions.get("window")

class AWSIoT extends Component {
    constructor(props) {
        super(props);
        this.handleMqttStatusChange = this.handleMqttStatusChange.bind(this)
        this.state = {
            isModal: false,
            allDevices: allDevices,
            selectedDevice: []
        }
    }

    handleMqttStatusChange = (params) => {
        if (params.status === 2) {
            this.props.onUpdateAWSStatus(true);
            subscribe(MESSAGE_TOPIC);
            subscribe(CONNECT_TOPIC);
            subscribe(DISCONNECT_TOPIC);
            subscribe(STATUS_TOPIC);
            publish(STATUS_TOPIC, "STATUS")
        }
    };

    _getScriptList = async () => {
        try {
            const value = await AsyncStorage.getItem('scriptList');
            if (value !== null) {
                this.props.onUpdateScript(JSON.parse(value))
            } else {

            }
        } catch (error) {
            // Error retrieving data
        }
    }


    componentWillUpdate(prevProps) {
        if (prevProps.awsiot !== this.props.awsiot && prevProps.awsiot.connected !== this.props.awsiot.connected) {
            if (isIOS) {
                AWSMqttEvents.addListener("message", this.handleMessage);
            } else {
                DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
            }
        }
        // if (!this.props.awsiot.connected) {
        //     if (isIOS) {
        //         AWSMqttEvents.removeAllListeners("message");
        //     } else {
        //         DeviceEventEmitter.removeAllListeners("Status");
        //     }
        // }
    }

    componentDidMount() {
        this._getScriptList()

        if (!this.props.awsiot.connected) {
            if (isIOS) {
                this.connectionStatus = AWSMqttEvents.addListener(
                    "connectionStatus",
                    this.handleMqttStatusChange
                );
                NativeModules.AWSMqtt.setupAAWSMQTT();//implemented in AWSMqtt.swift
                setTimeout(() => {
                    NativeModules.AWSMqtt.connectToAWSMQTT();//implemented in AWSMqtt.swift
                }, 1000);
            } else {
                DeviceEventEmitter.addListener("subscribe", this.handleSubscribe);
                setTimeout(() => {
                    IoTModule.initializeAWSMqtt();
                }, 1500);
                setTimeout(() => {
                    IoTModule.connectAWSMqtt();
                }, 3000);
            }
        }
    }

    handleMessage = (message) => {
        if (isJSON(message)) {
            const data = JSON.parse(message);
            if (data.eventType) {
                if (data.eventType === "disconnected") {
                    this.props.onUpdateSwitchDeviceStatus(false);
                    this.props.onUpdateDeviceStatus({switch: -1})
                } else if (data.eventType === "connected") {
                    this.props.onUpdateSwitchDeviceStatus(true);
                    publish(STATUS_TOPIC, "STATUS")
                }
            }
        }
        if (isInt(message)) {
            const {deviceStatus, devicesMode} = this.props;
            switch (message) {
                case "ON":
                    this.props.onUpdateDeviceStatus({switch: 0});
                    break;
                case "OFF":
                    this.props.onUpdateDeviceStatus({switch: -1});
                    break;
                case "Device connected!":
                    this.props.onUpdateSwitchDeviceStatus(true);
                    break;
                default:
                    break
            }
            const newStatus = parseInt(message);
            if (newStatus) {
                const deviceStatusKeys = Object.keys(deviceStatus);
                const changedDevice = _.find(deviceStatusKeys, key => {
                    if (allDevicesStatusOff[key] === newStatus) {
                        return allDevicesStatusOff[key] === newStatus
                    }
                    if (allDevicesStatusOn[key] === newStatus) {
                        return allDevicesStatusOn[key] === newStatus
                    }
                });
                const deviceModeKeys = Object.keys(devicesMode);
                const changedMode = _.find(deviceModeKeys, key => {
                    const deviceSensorModeIdx = deviceSensorMode[key] === newStatus;
                    if (deviceSensorModeIdx) {
                        return deviceSensorModeIdx
                    }
                    const deviceButtonModeIdx = deviceButtonMode[key] === newStatus;
                    if (deviceButtonModeIdx) {
                        return deviceButtonModeIdx
                    }
                })
                if (changedDevice) {
                    this.props.onUpdateDeviceStatus({
                        [changedDevice]: newStatus
                    })
                }
                if (changedMode) {
                    this.props.onUpdateDeviceMode({
                        [changedMode]: newStatus
                    })
                }
            }
        }
    }

    _onPress = id => {
        navigator.navigate("RoomDetail", {
            roomId: id
        })
    }

    _renderDevice = (data) => {
        const {deviceStatus, devicesMode} = this.props;
        const shadowOpt = {
            width: width / 2 - 20,
            height: width / 2 - 20,
            color: "#7F8C8D",
            // border: 4,
            radius: 0,
            opacity: 0.2,
            x: 0,
            y: 0,
            style: {
                justifyContent: 'center',
                alignItems: 'center',
            }
        }
        const deviceCount = deviceElements[data.id].length === 1
            ? `${deviceElements[data.id].length} device`
            : `${deviceElements[data.id].length} devices`
        return (
            <React.Fragment>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        this._onPress(data.id)
                    }}
                    //disabled={!(this.props.awsiot.connected)}
                >
                    <Image style={styles.image} source={data.image}/>
                    <Text style={styles.itemName}>{data.name}</Text>
                    <Text style={styles.itemDevicesCount}>{deviceCount}</Text>
                </TouchableOpacity>
            </React.Fragment>
        )
    }

    render() {
        const {devices} = this.props;
        let allDevices = 0;
        Object.values(deviceElements).forEach(item => allDevices += item.length);
        return (
            <View style={styles.container}>
                <Header title="My Home"
                        onClick={() => {this.props.navigation.navigate('ScriptList')}}/>
                <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 0}} colors={['#7D3C98', '#8E44AD', '#BB8FCE']}
                                style={styles.intro}>
                    <View style={styles.intro_child}>
                        <Icon name='home' size={60} color={'#fff'}/>
                    </View>
                    <View style={styles.intro_child}>
                        <View style={styles.intro_right_child_border}/>
                        <Text style={styles.all_device_title}>All Devices</Text>
                        <Text style={styles.all_devices_val}>{allDevices} devices</Text>
                    </View>
                </LinearGradient>
                <View style={styles.content}>
                    <FlatList
                        extraData={this.props}
                        renderItem={({item, index}) => this._renderDevice(item)}
                        data={Object.values(allRoom)}
                        keyExtractor={(item, index) => item.id}
                        numColumns={2}
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 5
                        }}
                    />
                </View>
                {/*<CreateScript*/}
                    {/*isOpen={this.state.isModal}*/}
                    {/*onCloseModal={() => this._closeModal()}*/}
                {/*/>*/}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        awsiot: state.awsiot,
        devices: state.awsiot.devices,
        deviceStatus: state.awsiot.deviceStatus,
        devicesMode: state.awsiot.devicesMode,
    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
    onUpdateScript: params => dispatch(updateScript(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(AWSIoT)
