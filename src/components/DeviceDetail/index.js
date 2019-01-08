import React from 'react'
import {
    Image,
    TouchableOpacity,
    View,
    Text,
    NativeModules,
    DeviceEventEmitter,
    Platform,
    NativeEventEmitter,
    Switch,
    AsyncStorage
} from 'react-native'
import {connect} from 'react-redux'
import _ from "lodash";
import moment from 'moment'
import Button from "../Button";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
    updateAWSStatus,
    updateDeviceStatus,
    updateSwitchDeviceStatus,
    updateDeviceMode
} from "../../actions/awsIoT";
import {publish, subscribe, unsubscribe, onChangeStatus} from 'utils/mqttFunc';
import {
    allDevices,
    allDevicesStatusOff,
    allDevicesStatusOn,
    allRoom, deviceButtonMode,
    deviceSensorMode,
    modeConst
} from "../../constants/devices";
import {MESSAGE_TOPIC, STATUS_TOPIC} from '../../constants/topics'
import {DATE_TIMER_FORMAT, isInt, isJSON} from '../../constants/common'
const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios
import styles from './styles'
const isIOS = Platform.OS === "ios";

class DeviceDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceId: props.navigation.getParam('deviceId'),
            deviceDetail: allDevices[props.navigation.getParam('deviceId')],
            isDatePickerVisible: false,
            dateTimer: moment().format(DATE_TIMER_FORMAT),
            isSwitchOn: false
        }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({
            dateTimer: moment(date).format(DATE_TIMER_FORMAT)
        }, () => {
            this._hideDateTimePicker();
        })
    };

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

    // onChangeStatus = (id) => {
    //     const {devices, deviceStatus} = this.props;
    //
    //     if (id === "switch") {
    //         publish(MESSAGE_TOPIC, deviceStatus[id] === -1 ? "ON" : "OFF")
    //     } else {
    //         let status = null;
    //         const deviceOnIdx = allDevicesStatusOn.indexOf(deviceStatus[id]);
    //         if (deviceOnIdx >= 0) {
    //             status = deviceStatus[id] + 1
    //         }
    //         const deviceOffIdx = allDevicesStatusOff.indexOf(deviceStatus[id]);
    //         if (deviceOffIdx >= 0) {
    //             status = deviceStatus[id] - 1
    //         }
    //         if (status) {
    //             publish(MESSAGE_TOPIC, status.toString())
    //         }
    //     }
    // };

    onChangeMode = (id, mode) => {
        const {devicesMode} = this.props
        let newMode = null
        const deviceSensorModeIdx = deviceSensorMode[id] === devicesMode[id];
        if (deviceSensorModeIdx && mode === 'button') {
            newMode = devicesMode[id] + 1
        }
        const deviceButtonModeIdx = deviceButtonMode[id] === devicesMode[id];
        if (deviceButtonModeIdx && mode === 'sensor') {
            newMode = devicesMode[id] - 1
        }
        if (newMode) {
            publish(MESSAGE_TOPIC, newMode.toString())
        }

    }

    onTimerChangeStatus = value => {
        this.setState({isSwitchOn: value})
    }

    renderMode = () => {
        const {devicesMode} = this.props;
        return (
            <View style={styles.mode_wrapper}>
                <Text style={styles.mode_left_content}>Mode</Text>
                <View style={styles.mode_right_content}>
                    {this.state.deviceDetail.mode.map((item, index) => {
                        const isSensorMode = deviceSensorMode[this.state.deviceId] === devicesMode[this.state.deviceId]
                            && item === 'sensor'
                        const isButtonMode = deviceButtonMode[this.state.deviceId] === devicesMode[this.state.deviceId]
                            && item === 'button'
                        return (
                            <Button
                                key={index}
                                onPress={() => {
                                    this.onChangeMode(this.state.deviceId, item)
                                }}
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
        const isDeviceOn = allDevicesStatusOn[this.state.deviceId] === deviceStatus[this.state.deviceId]
        if (this.state.deviceDetail.name.includes('Lamp')) {
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
                            onChangeStatus(this.state.deviceId, deviceStatus)
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    onChangeStatus(this.state.deviceId, deviceStatus)
                }}>
                    <Image style={styles.image} source={image} resizeMode='contain'/>
                </TouchableOpacity>
                {this.state.deviceDetail.isMode && this.renderMode()}
                {false && (
                    <View style={styles.mode_wrapper}>
                        <Text style={styles.mode_left_content}>Timer</Text>
                        <View style={styles.mode_right_content}>
                            <TouchableOpacity style={{flex: 2}} onPress={this._showDateTimePicker}>
                                <Text>{this.state.dateTimer}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                mode={'datetime'}
                                titleIOS={'Timer'}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                is24Hour={false}
                            />
                            <Switch
                                minimumDate={new Date()}
                                style={{marginLeft: 15, flex: 1}}
                                onValueChange={value => this.onTimerChangeStatus(value)}
                                value={this.state.isSwitchOn}
                            />
                        </View>
                    </View>
                )}
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
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetail)
