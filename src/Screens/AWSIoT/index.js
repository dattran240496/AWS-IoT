/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
    FlatList,
    Image,
    AppState
} from "react-native";
import {connect} from 'react-redux'
import Header from "../../components/Header";
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {updateDeviceStatus, updateAWSStatus, updateSwitchDeviceStatus} from '../../actions/awsIoT'
import {MESSAGE_TOPIC, DISCONNECT_TOPIC, STATUS_TOPIC, CONNECT_TOPIC} from '../../constants/topics'

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
            this.props.onUpdateAWSStatus(true)
            subscribe(MESSAGE_TOPIC)
            subscribe(CONNECT_TOPIC)
            subscribe(DISCONNECT_TOPIC)
            subscribe(STATUS_TOPIC)
            publish(STATUS_TOPIC, "STATUS")
        }
    }

    isJSON = str => {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    }

    handleMessage = (message) => {
        console.log('mess', message)
        if (this.isJSON(message)) {
            const data = JSON.parse(message)
            if (data.eventType) {
                if (data.eventType === "disconnected") {
                    this.props.onUpdateSwitchDeviceStatus(false)
                    this.props.onUpdateDeviceStatus({switch: 0})
                } else if (data.eventType === "connected") {
                    this.props.onUpdateSwitchDeviceStatus(true)
                    publish(STATUS_TOPIC, "STATUS")
                }
            }
        } else {
            switch (message) {
                case "ON":
                    this.props.onUpdateDeviceStatus({switch: 1})
                    return
                case "OFF":
                    this.props.onUpdateDeviceStatus({switch: 0})
                    return
                case "Device connected!":
                    this.props.onUpdateSwitchDeviceStatus(true)
                    return
                default:
                    return
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

    _renderDevice = (data) => {
        const {deviceStatus} = this.props;
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    // const params = {}
                    // params[data.id] = deviceStatus[data.id] === 0 ? 1 : 0;
                    if (data.id === "switch") {
                        publish(MESSAGE_TOPIC, deviceStatus[data.id] === 0 ? "ON" : "OFF")
                    }
                }}
                disabled={!(this.props.awsiot.connected && this.props.awsiot.switchStatus)}
            >
                <Image style={styles.image} source={data.image}/>
                <Text>{data.name}</Text>
                {
                    deviceStatus[data.id] === 0
                        ? <View style={styles.inactiveDevice}/>
                        : null
                }
            </TouchableOpacity>
        )
    }

    render() {
        const {devices} = this.props;
        return (
            <View style={styles.container}>
                <Header title={"AWS IoT"}/>
                <View style={styles.content}>
                    <FlatList
                        extraData={this.props}
                        renderItem={({item, index}) => this._renderDevice(item)}
                        data={devices}
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
        deviceStatus: state.awsiot.deviceStatus
    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AWSIoT)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        width: width / 2,
        height: width / 2
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain"
    },
    inactiveDevice: {
        backgroundColor: "#e1e1e1",
        opacity: 0.8,
        width: 120,
        height: 120,
        position: "absolute",
        top: (width / 2 - 120) / 2,
        left: (width / 2 - 120) / 2,
    }
});
