/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
    FlatList,
    Image,
    AppState,
    AsyncStorage,
    ScrollView,
    TextInput,
    Platform,
    Text,
    View,
    TouchableOpacity,
    Switch,
    Dimensions,
} from "react-native";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import styles from './styles'
import {publish, subscribe, unsubscribe, onChangeStatus} from 'utils/mqttFunc';
import {updateDeviceStatus, updateAWSStatus, updateSwitchDeviceStatus, updateDeviceMode} from '../../actions/awsIoT'
import {
    allDevicesStatusOn,
    allDevicesStatusOff,
    deviceSensorMode,
    deviceElements,
    allRoom,
    allDevices, deviceButtonMode
} from '../../constants/devices';
import Modal from "react-native-modal";
import Button from "../Button";
import {isInt, isJSON} from "../../constants/common";
import {STATUS_TOPIC} from "../../constants/topics";

const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";
const {width, height} = Dimensions.get("window")

class CreateScript extends Component {

    static propTypes = {
        isOpen: PropTypes.bool,
        onCloseModal: PropTypes.func,
    };

    static defaultProps = {
        isOpen: false,
        onCloseModal: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isModal: false,
            allDevices: deviceElements,
            selectedDevice: [],
            scriptName: ''
        }
        this.handleMessage = this.handleMessage.bind(this)
    }

    componentWillUnmount() {
    }

    componentWillUpdate(prevProps) {
        if (prevProps.awsiot !== this.props.awsiot) {
            if (prevProps.awsiot.connected) {
                if (isIOS) {
                    this.message = AWSMqttEvents.addListener("message", this.handleMessage);
                } else {
                    DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
                }
            }
        }
    }

    componentDidMount() {
        if (this.props.awsiot.connected) {
            if (isIOS) {
                this.message = AWSMqttEvents.addListener("message", this.handleMessage);
            } else {
                DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
            }
        }
    }

    handleMessage = (message) => {
        console.log('zzz mess', message)
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
                    if (Object.values(allDevicesStatusOff).indexOf(newStatus) >= 0) {
                        return deviceStatus[key] === newStatus - 1
                    }
                    if (Object.values(allDevicesStatusOn).indexOf(newStatus) >= 0) {
                        return deviceStatus[key] === newStatus + 1
                    }
                });
                const deviceModeKeys = Object.keys(devicesMode);
                const changedMode = _.find(deviceModeKeys, key => {
                    const deviceSensorModeIdx = deviceSensorMode.indexOf(devicesMode[key]);
                    if (deviceSensorModeIdx >= 0) {
                        return devicesMode[key] === newStatus - 1
                    }
                    const deviceButtonModeIdx = deviceButtonMode.indexOf(devicesMode[key]);
                    if (deviceButtonModeIdx >= 0) {
                        return devicesMode[key] === newStatus + 1
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

    _closeModal = () => {
        this.props.onCloseModal()
    }

    _createScript = async () => {
        try {
            const value = await AsyncStorage.getItem('scriptList');
            if (value !== null) {
                // We have data!!
                console.log(value);
            } else {

            }
        } catch (error) {
            // Error retrieving data
        }
    }

    _renderDevice = (device, isDeleteItem = false, parent = null) => {
        const isChecked = _.find(this.state.selectedDevice, o => o.id === device.id)
        return (
            <View key={device.id} style={styles.deviceItem}>
                <TouchableOpacity
                    style={styles.checkBox}
                    onPress={() => {
                        const currentSelectedDevices = this.state.selectedDevice;
                        const currentAllDevices = this.state.allDevices;
                        if (isChecked) {
                            _.remove(currentSelectedDevices, o => o.id === device.id)
                        } else {
                            currentSelectedDevices.push(device)
                        }

                        // _.remove(currentAllDevices[parent], o => o.id === device.id)

                        this.setState({
                            selectedDevice: currentSelectedDevices,
                            allDevices: currentAllDevices
                        })
                        // const currentAllDevices = this.state.allDevices;
                        // const currentSelectedDevices = this.state.selectedDevice;
                        // _.remove(currentSelectedDevices, o => o.id === device.id);
                        // if (!currentAllDevices[device.roomId]) {
                        //     currentAllDevices[device.roomId] = [];
                        // }
                        // currentAllDevices[device.roomId].push({
                        //     id: device.id,
                        //     parentId: device.roomId
                        // });
                        // this.setState({
                        //     selectedDevice: currentSelectedDevices,
                        //     allDevices: currentAllDevices
                        // })
                    }}
                >
                    {isChecked &&
                    <Image
                        style={styles.iconCheck}
                        source={require('assets/icons/check.png')}
                        resizeMode={'contain'}
                    />}
                </TouchableOpacity>
                <Text style={styles.itemName}>{device.name}</Text>
            </View>
        )
    }

    _renderSelectedDevices = (device, isDeleteItem = false, parent = null) => {
        return (
            <View key={device.id} style={styles.deviceItem}>
                {isDeleteItem && (
                    <TouchableOpacity style={styles.closeBtn}
                                      onPress={() => {
                                          const currentAllDevices = this.state.allDevices;
                                          const currentSelectedDevices = this.state.selectedDevice;
                                          _.remove(currentSelectedDevices, o => o.id === device.id);
                                          if (!currentAllDevices[device.roomId]) {
                                              currentAllDevices[device.roomId] = [];
                                          }
                                          currentAllDevices[device.roomId].push({
                                              id: device.id,
                                              parentId: device.roomId
                                          });
                                          this.setState({
                                              selectedDevice: currentSelectedDevices,
                                              allDevices: currentAllDevices
                                          })
                                      }}
                    >
                        <Icon name='times-circle' color={'#e1e1e1'} size={24}/>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        // navigator.navigate("DeviceDetail", {
                        //     deviceId: device.id
                        // })
                        if (!isDeleteItem) {
                            const currentSelectedDevices = this.state.selectedDevice;
                            const currentAllDevices = this.state.allDevices;
                            _.remove(currentAllDevices[parent], o => o.id === device.id)
                            currentSelectedDevices.push(device)
                            this.setState({
                                selectedDevice: currentSelectedDevices,
                                allDevices: currentAllDevices
                            })
                        }


                    }}
                >
                    <Image style={styles.image} source={device.image}/>
                    <Text style={styles.itemName}>{device.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {deviceStatus} = this.props;
        // let allDevices = 0;
        // Object.values(deviceElements).forEach(item => allDevicesModal += item.length);
        // let allDevicesModal = [];
        return (
            <View style={styles.modal}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => {
                        // this._closeModal()
                        this.props.navigation.goBack()
                    }}>
                        <Image source={require('assets/icons/arrow_left.png')}
                               style={styles.modal_close}
                               resizeMode={'contain'}/>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.scriptName}
                        onChangeText={(text) => this.setState({scriptName: text})}
                        value={this.state.scriptName}
                        placeholder={"Script name..."}
                    />

                    <View style={styles.modal_content}>
                        <View style={{flex: 1}}>
                            <ScrollView>
                                {Object.keys(this.state.allDevices).map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <Text style={styles.roomName}>{allRoom[item].name}</Text>
                                            <View style={styles.device}>
                                                {this.state.allDevices[item].map((deviceId, idx) => {
                                                    return this._renderDevice(allDevices[deviceId.id], false, item)
                                                })}
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.controlBtnWrapper}>
                        <Button
                            buttonStyle={styles.controlBtn}
                            title='Create'
                            onPress={() => {
                                // this.state.selectedDevice.forEach(item => {
                                //     onChangeStatus(item.id, deviceStatus)
                                // })

                            }}
                        />
                        {/*<Button buttonStyle={[styles.controlBtn, {marginLeft: 5}]} title='OFF' />*/}
                    </View>
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
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateScript)
