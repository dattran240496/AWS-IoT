/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    AsyncStorage,
    DeviceEventEmitter,
    Dimensions,
    Image,
    NativeEventEmitter,
    NativeModules,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styles from './styles'
import {onChangeStatus, publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {
    updateAWSStatus,
    updateDeviceMode,
    updateDeviceStatus,
    updateScript,
    updateSwitchDeviceStatus
} from '../../actions/awsIoT'
import {
    allDevices,
    allDevicesStatusOff,
    allDevicesStatusOn,
    allRoom,
    deviceButtonMode,
    deviceElements,
    deviceSensorMode
} from '../../constants/devices';
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
            scriptName: '',
            allDevicesStatusSelected: this.allDevicesStatusSelectedDefault()
        }
    }

    allDevicesStatusSelectedDefault = () => {
        const data = JSON.parse(JSON.stringify(allDevices));
        Object.keys(allDevices).forEach(item => {
            data[item] = false
        })
        return data;
    }

    _closeModal = () => {
        this.props.onCloseModal()
    }

    onSetStatusChange = (status, deviceId) => {
        const currentStatus = this.state.allDevicesStatusSelected;
        currentStatus[deviceId] = status;
        this.setState({
            allDevicesStatusSelected: currentStatus
        })
    }

    _createScript = async () => {
        try {
            const value = await AsyncStorage.getItem('scriptList');
            if (value !== null) {
                // We have data!!
                if (this.state.scriptName !== '') {
                    var script = JSON.parse(value)
                }
            } else {
                if (this.state.scriptName !== '') {
                    var script = {};
                }
            }
            const currentSelectedDevices = JSON.parse(JSON.stringify(this.state.selectedDevice))
            this.state.selectedDevice.forEach((item, index) => {
                currentSelectedDevices[index] = Object.assign({isOn: this.state.allDevicesStatusSelected[item.id]},
                    currentSelectedDevices[index])
            })
            const param = {[this.state.scriptName]: currentSelectedDevices}
            this.props.onUpdateScript(param);
            const newScript = Object.assign(param, script)
            await AsyncStorage.setItem('scriptList', JSON.stringify(newScript));
            this.props.navigation.pop()
        } catch (error) {
            // Error retrieving data
            console.log(error)
        }
    }

    _renderDevice = (device, isDeleteItem = false, parent = null) => {
        const isChecked = _.find(this.state.selectedDevice, o => o.id === device.id)
        const isSetOn = this.state.allDevicesStatusSelected[device.id]
        return (
            <View key={device.id} style={styles.deviceItem}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        style={styles.itemImage}
                        source={device.image}
                        resizeMode='contain'
                    />
                    <Text style={styles.itemName}>{device.name}</Text>
                </View>
                <View style={styles.rightContent}>
                    {
                        isChecked &&
                        <Switch value={isSetOn}
                                onValueChange={status => {
                                    this.onSetStatusChange(status, device.id)
                                }}/>
                    }
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

                            this.setState({
                                selectedDevice: currentSelectedDevices,
                                allDevices: currentAllDevices
                            })
                        }}
                    >
                        {isChecked &&
                        <Image
                            style={styles.iconCheck}
                            source={require('assets/icons/check.png')}
                            resizeMode={'contain'}
                        />}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.modal}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => {
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
                                this._createScript()
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
    onUpdateScript: params => dispatch(updateScript(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateScript)
