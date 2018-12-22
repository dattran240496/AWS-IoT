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
import _ from 'lodash'
import Header from "../../components/Header";
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {updateDeviceStatus, updateAWSStatus, updateSwitchDeviceStatus} from '../../actions/awsIoT'
import {MESSAGE_TOPIC, DISCONNECT_TOPIC, STATUS_TOPIC, CONNECT_TOPIC} from '../../constants/topics'
import {
    allDevicesStatusOn,
    allDevicesStatusOff,
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
        const data = JSON.parse(message);
        if (data.eventType) {
            if (data.eventType === "disconnected") {
                this.props.onUpdateSwitchDeviceStatus(false);
                this.props.onUpdateDeviceStatus({switch: 0})
            } else if (data.eventType === "connected") {
                this.props.onUpdateSwitchDeviceStatus(true);
                publish(STATUS_TOPIC, "STATUS")
            }
        }
        if (this.isInt(message)) {
            const {deviceStatus} = this.props;
            // switch (message) {
            //     case "ON":
            //         this.props.onUpdateDeviceStatus({switch: 1});
            //         return;
            //     case "OFF":
            //         this.props.onUpdateDeviceStatus({switch: 0});
            //         return
            //     case "Device connec;ted!":
            //         this.props.onUpdateSwitchDeviceStatus(true);
            //         return;
            //     default:
            //         return
            // }
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
        // const params = {}
        // params[data.id] = deviceStatus[data.id] === 0 ? 1 : 0;
        // if (id === "switch") {
        //     publish(MESSAGE_TOPIC, deviceStatus[id] === 0 ? "ON" : "OFF")
        // }
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

    _renderDevice = (data) => {
        const {deviceStatus} = this.props;
        return (
            <View style={styles.item}>
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
                    <Text>{data.name}</Text>
                    {
                        allDevicesStatusOff.indexOf(deviceStatus[data.id]) >= 0
                            ? <View style={styles.inactiveDevice}/>
                            : null
                    }
                </TouchableOpacity>
            </View>
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
    }
});
