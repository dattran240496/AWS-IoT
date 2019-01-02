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
    AppState
} from "react-native";
import {connect} from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
// import {BoxShadow} from 'react-native-shadow'
import Header from "../../components/Header";
import styles from './styles'
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {updateDeviceStatus, updateAWSStatus, updateSwitchDeviceStatus} from '../../actions/awsIoT'
import {MESSAGE_TOPIC, DISCONNECT_TOPIC, STATUS_TOPIC, CONNECT_TOPIC} from '../../constants/topics'
import {
    allDevicesStatusOn,
    allDevicesStatusOff, deviceModeSensor, deviceElements, allRoom,
} from '../../constants/devices';

const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";
const {width, height} = Dimensions.get("window")

class AWSIoT extends Component {
    constructor(props) {
        super(props);
        this.handleMqttStatusChange = this.handleMqttStatusChange.bind(this)
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

    isJSON = str => {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    };

    isInt = number => {
        try {
            parseInt(number)
        } catch (e) {
            return false
        }
        return true
    }

    handleMessage = (message) => {
        if (this.isJSON(message)) {
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
        if (this.isInt(message)) {
            const {deviceStatus} = this.props;
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
            const newDeviceStatus = parseInt(message);
            if (newDeviceStatus) {
                const deviceStatusKeys = Object.keys(deviceStatus);
                const changedDevice = _.find(deviceStatusKeys, key => {
                    if (allDevicesStatusOff.indexOf(newDeviceStatus) >= 0) {
                        return deviceStatus[key] === newDeviceStatus - 1
                    }
                    if (allDevicesStatusOn.indexOf(newDeviceStatus) >= 0) {
                        return deviceStatus[key] === newDeviceStatus + 1

                    }
                });
                if (changedDevice) {
                    this.props.onUpdateDeviceStatus({
                        [changedDevice]: newDeviceStatus
                    })
                }
            }
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        if (!this.props.awsiot.connected) {
            if (isIOS) {
                this.connectionStatus = AWSMqttEvents.addListener(
                    "connectionStatus",
                    this.handleMqttStatusChange
                );
                this.message = AWSMqttEvents.addListener("message", this.handleMessage);
                NativeModules.AWSMqtt.setupAAWSMQTT();//implemented in AWSMqtt.swift
                setTimeout(() => {
                    NativeModules.AWSMqtt.connectToAWSMQTT();//implemented in AWSMqtt.swift
                }, 1000);
            } else {
                DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
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

    _onPress = id => {
        const {devices, deviceStatus} = this.props;

        if (id === "switch") {
            publish(MESSAGE_TOPIC, deviceStatus[id] === -1 ? "ON" : "OFF")
        } else {
            let status = null;
            const deviceOnIdx = allDevicesStatusOn.indexOf(deviceStatus[id]);
            if (deviceOnIdx >= 0) {
                status = deviceStatus[id] + 1
            }
            const deviceOffIdx = allDevicesStatusOff.indexOf(deviceStatus[id]);
            if (deviceOffIdx >= 0) {
                status = deviceStatus[id] - 1
            }
            publish(MESSAGE_TOPIC, status.toString())
        }
    }

    _renderDevice = (data) => {
        const {deviceStatus, devicesMode} = this.props;
        const currentMode = devicesMode[data.id];
        const isMode = deviceModeSensor.indexOf(currentMode) >= 0;
        const shadowOpt = {
            width: width / 2 - 30,
            height: width / 2 - 30,
            color: "#000",
            border: 2,
            radius: 3,
            opacity: 0.2,
            x: 0,
            y: 3,
            style: {marginVertical: 5}
        }
        return (
            <View style={styles.item}>
                <View style={styles.controlDevice}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            this._onPress(data.id)
                        }}
                        disabled={!(this.props.awsiot.connected)}
                    >
                        <Image style={styles.image} source={data.image}/>
                        <Text style={styles.itemName}>{data.name}</Text>
                        {/*{*/}
                        {/*allDevicesStatusOff.indexOf(deviceStatus[data.id]) >= 0*/}
                        {/*|| data.id === "switch" && deviceStatus[data.id] === -1*/}
                        {/*? <View style={styles.inactiveDevice}/>*/}
                        {/*: null*/}
                        {/*}*/}
                    </TouchableOpacity>
                </View>
                {/*{*/}
                {/*data.isMode ?*/}
                {/*<Switch*/}
                {/*style={styles.switch}*/}
                {/*value={isMode}*/}
                {/*/>*/}
                {/*: null*/}
                {/*}*/}
            </View>
        )
    }

    render() {
        const {devices} = this.props;
        let allDevices = 0;
        Object.values(deviceElements).forEach(item => allDevices += item.length);
        return (
            <View style={styles.container}>
                <Header title={"My Home"}/>
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
                    />
                </View>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(AWSIoT)
