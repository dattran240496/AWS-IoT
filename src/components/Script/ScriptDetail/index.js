import React from 'react'
import {
    Image,
    TouchableOpacity,
    View,
    FlatList,
    Text,
    Switch, DeviceEventEmitter, NativeModules, NativeEventEmitter, Platform
} from 'react-native'
import {connect} from 'react-redux'
import styles from "./styles";
import {
    updateAWSStatus,
    updateDeviceStatus,
    updateSwitchDeviceStatus
} from "actions/awsIoT";
import {allDevicesStatusOff, allDevicesStatusOn, deviceButtonMode, deviceSensorMode} from "../../../constants/devices";
import {publish, subscribe, unsubscribe, onChangeStatus} from 'utils/mqttFunc';
import {isInt, isJSON} from "../../../constants/common";
import {STATUS_TOPIC} from "../../../constants/topics";
import _ from "lodash";
const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";
class ScriptDetail extends React.Component {

    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            scriptId: props.navigation.getParam('scriptId')
        }
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

    _renderScriptDetail = (item, idx) => {
        const {deviceStatus} = this.props;
        const isOn = deviceStatus[item.id] === allDevicesStatusOn[item.id]
        return (
            <View style={[styles.scriptItem,
                idx === 0 && {borderTopColor: '#e1e1e1', borderTopWidth: 1}]}
            >
                <Text style={styles.name}>{item.name}</Text>
                <Switch
                    style={styles.switch}
                    value={isOn}
                    onValueChange={() => {
                        onChangeStatus(item.id, deviceStatus)
                    }}
                />
            </View>
        )
    }

    render() {
        const {scriptList} = this.props;
        const data = scriptList[this.state.scriptId]
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.btnClose}
                    onPress={() => {
                        this.props.navigation.pop()
                    }}>
                    <Image source={require('assets/icons/arrow_left.png')}
                           style={styles.imgClose}
                           resizeMode={'contain'}/>
                </TouchableOpacity>
                <Text style={styles.title}>{this.state.scriptId}</Text>
                <FlatList
                    data={data}
                    extraData={this.state}
                    renderItem={({item, index}) => this._renderScriptDetail(item, index)}
                    keyExtractor={(item, index) => item.id}
                    contentContainerStyle={{
                        marginTop: 15
                    }}
                />
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
        scriptList: state.awsiot.scriptList
    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptDetail)
