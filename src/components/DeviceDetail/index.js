import React from 'react'
import {
    Image,
    TouchableOpacity,
    View,
    Text,
    NativeModules,
    DeviceEventEmitter,
    Platform,
    NativeEventEmitter
} from 'react-native'
import {connect} from 'react-redux'
import _ from "lodash";
import Button from "../Button";
import {updateAWSStatus, updateDeviceStatus, updateSwitchDeviceStatus} from "../../actions/awsIoT";
import {publish, subscribe, unsubscribe} from 'utils/mqttFunc';
import {
    allDevices,
    allDevicesStatusOff,
    allDevicesStatusOn,
    allRoom, deviceModeButton,
    deviceModeSensor,
    modeConst
} from "../../constants/devices";
import {MESSAGE_TOPIC, STATUS_TOPIC} from '../../constants/topics'
const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios
import styles from './styles'
const isIOS = Platform.OS === "ios";

class DeviceDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceId: props.navigation.getParam('deviceId'),
            deviceDetail: allDevices[props.navigation.getParam('deviceId')]
        }
    }

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
        console.log('zzz message', message)
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

    componentDidMount() {
        if (this.props.awsiot.connected) {
            if (isIOS) {
                this.message = AWSMqttEvents.addListener("message", this.handleMessage);
            } else {
                DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
            }
        }
    }

    _renderHeader = () => {
        return (
            <TouchableOpacity style={styles.arrowLeftBtn}
                              onPress={() => this.props.navigation.pop()}>
                <Image
                    style={styles.arrowLeftImg}
                    source={require('assets/icons/arrow_left.png')}
                    resizeMode='contain'/>
            </TouchableOpacity>
        )
    }

    onChangeStatus = (id) => {
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
    };

    renderMode = () => {
        const {devicesMode} = this.props;
        return (
            <View style={styles.mode_wrapper}>
                <Text style={styles.mode_left_content}>Mode</Text>
                <View style={styles.mode_right_content}>
                    {this.state.deviceDetail.mode.map((item, index) => {
                        const isSensorMode = deviceModeSensor.indexOf(devicesMode[this.state.deviceId]) >= 0 && item === 'sensor'
                        const isButtonMode = deviceModeButton.indexOf(devicesMode[this.state.deviceId]) >= 0 && item === 'button'
                        return (
                            <TouchableOpacity key={index}>
                                <Button
                                    colors={isSensorMode ? null : isButtonMode ? ['#7C81EA', '#2F38EA', '#121DED'] : ['#CACFD2', '#BDC3C7', '#909497']}
                                    title={modeConst[item].name}
                                    buttonStyle={{
                                        marginRight: 20,
                                        borderRadius: 20,
                                        height: 35,
                                        width: null,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    render() {
        if (!this.state.deviceDetail) {
            return (
                <View style={styles.container}>
                    {this._renderHeader()}
                </View>
            )
        }
        const {deviceStatus} = this.props;
        let image = this.state.deviceDetail.image;
        const isDeviceOn = allDevicesStatusOn.indexOf(deviceStatus[this.state.deviceId]) >= 0
        if (this.state.deviceDetail.name === 'Lamp') {
            if (isDeviceOn) {
                image = this.state.deviceDetail.detailImageOn
            } else image = this.state.deviceDetail.detailImageOff
        }
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                <Text style={styles.headerTitle}>{this.state.deviceDetail.name}</Text>
                <View style={styles.statusWrapper}>
                    <Text style={styles.room_device}>
                        {allRoom[this.state.deviceDetail.roomId].name} {this.state.deviceDetail.name}
                    </Text>
                    <Button
                        colors={isDeviceOn ? null : ['#CACFD2', '#BDC3C7', '#909497']}
                        buttonStyle={isDeviceOn ? {} : {backgroundColor: '#e1e1e1'}}
                        title={isDeviceOn ? 'ON' : 'OFF'}
                        onPress={() => {
                            this.onChangeStatus(this.state.deviceId)
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    this.onChangeStatus(this.state.deviceId)
                }}>
                    <Image style={styles.image} source={image} resizeMode='contain'/>
                </TouchableOpacity>
                {this.state.deviceDetail.isMode && this.renderMode()}
            </View>
        )
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
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetail)
