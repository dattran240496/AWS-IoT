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
import _ from 'lodash'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import Header from "../../components/Header";
import CreateScript from "../../components/CreateScript";
import styles from './styles'
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {updateDeviceStatus, updateAWSStatus, updateSwitchDeviceStatus} from '../../actions/awsIoT'
import {MESSAGE_TOPIC, DISCONNECT_TOPIC, STATUS_TOPIC, CONNECT_TOPIC} from '../../constants/topics'
import {
    allDevicesStatusOn,
    allDevicesStatusOff,
    deviceSensorMode,
    deviceElements,
    allRoom,
    allDevices
} from '../../constants/devices';
import navigator from 'navigators/CustomNavigator'


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
        console.log('params', params)
        if (params.status === 2) {
            this.props.onUpdateAWSStatus(true);
            subscribe(MESSAGE_TOPIC);
            subscribe(CONNECT_TOPIC);
            subscribe(DISCONNECT_TOPIC);
            subscribe(STATUS_TOPIC);
            publish(STATUS_TOPIC, "STATUS")
        }
    };


    componentWillUnmount() {
    }

    componentDidMount() {

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

    _onPress = id => {
        navigator.navigate("RoomDetail", {
            roomId: id
        })
    }

    _openModal = () => {
        this.setState({isModal: true})
    }

    _closeModal = () => {
        this.setState({isModal: false})
    }

    _renderDevice = (data) => {
        const {deviceStatus, devicesMode} = this.props;
        const currentMode = devicesMode[data.id];
        const isMode = deviceSensorMode.indexOf(currentMode) >= 0;
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
                        onClick={() => {this._openModal()}}/>
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
                <CreateScript
                    isOpen={this.state.isModal}
                    onCloseModal={() => this._closeModal()}
                />
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
