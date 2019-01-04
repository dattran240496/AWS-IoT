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
import {allDevices, allDevicesStatusOff, allDevicesStatusOn, allRoom} from "../../constants/devices";
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
                        buttonStyle={isDeviceOn ? {} : {backgroundColor: '#e1e1e1'}}
                        title={isDeviceOn ? 'ON' : 'OFF'}
                        onPress={() => {
                            this.onChangeStatus(this.state.deviceId)
                        }}
                    />
                </View>
                <Image style={styles.image} source={image} resizeMode='contain'/>
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
