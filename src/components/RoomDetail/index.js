import React from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    NativeModules,
    NativeEventEmitter,
    Platform, DeviceEventEmitter
} from 'react-native'
import {connect} from "react-redux";
import navigator from 'navigators/CustomNavigator'
import {publish, onChangeStatus} from 'utils/mqttFunc';
import {
    allRoom,
    deviceElements,
    allDevices,
    deviceSensorMode,
    deviceButtonMode,
    allDevicesStatusOn,
    allDevicesStatusOff
} from "../../constants/devices";
import LinearGradient from "react-native-linear-gradient";
import Button from "../Button";
const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios
import styles from './styles'
import {MESSAGE_TOPIC, STATUS_TOPIC} from "../../constants/topics";
import {isInt, isJSON} from "../../constants/common";
import _ from "lodash";
import {updateAWSStatus, updateDeviceMode, updateDeviceStatus, updateSwitchDeviceStatus} from "../../actions/awsIoT";
const isIOS = Platform.OS === "ios";
const {width, height} = Dimensions.get("window")

class RoomDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: props.navigation.getParam('roomId')
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

    _turnOnAllDevices = () => {
        deviceElements[this.state.roomId].forEach(item => {
            publish(MESSAGE_TOPIC, allDevicesStatusOn[item.id].toString())
        })
    }

    _turnOffAllDevices = () => {
        deviceElements[this.state.roomId].forEach(item => {
            publish(MESSAGE_TOPIC, allDevicesStatusOff[item.id].toString())
        })
    }

    _renderDevice = (item) => {
        const {devicesMode, deviceStatus} = this.props
        const device = allDevices[item.id]
        const isSensorMode = deviceSensorMode[item.id] && deviceSensorMode[item.id] === devicesMode[item.id]
        const isButtonMode = deviceButtonMode[item.id] && deviceButtonMode[item.id] === devicesMode[item.id]
        const sensorModeColors = ['#A569BD', '#8E44AD', '#6C3483'];
        const buttonModeColors = ['#7C81EA', '#2F38EA', '#121DED'];
        const isOn = allDevicesStatusOn[item.id] === deviceStatus[item.id]
        let image = device.image;
        if (!isOn) {
            image = device.imageOff ? device.imageOff : device.image
        }
        return (
            <View style={styles.deviceWrapper}>
                {isSensorMode || isButtonMode ?
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={isSensorMode ? sensorModeColors : buttonModeColors}
                        style={[styles.modeWrapper, {
                            shadowColor: isSensorMode ? '#A569BD' : '#7C81EA',
                        }]}
                    >
                        {/*<View style={styles.modeWrapper} />*/}
                    </LinearGradient>
                    : null}

                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        navigator.navigate("DeviceDetail", {
                            deviceId: device.id
                        })
                    }}
                >
                    <Image style={styles.image} source={image}/>
                    <Text style={styles.itemName}>{device.name}</Text>
                    {/*{*/}
                    {/*allDevicesStatusOff.indexOf(deviceStatus[data.id]) >= 0*/}
                    {/*|| data.id === "switch" && deviceStatus[data.id] === -1*/}
                    {/*? <View style={styles.inactiveDevice}/>*/}
                    {/*: null*/}
                    {/*}*/}
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const room = allRoom[this.state.roomId];
        if (!room) return null;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.arrowLeftBtn}
                                  onPress={() => this.props.navigation.pop()}>
                    <Image
                        style={styles.arrowLeftImg}
                        source={require('assets/icons/arrow_left.png')}
                        resizeMode='contain'/>
                </TouchableOpacity>
                <View style={styles.roomAvatarWrapper}>
                    <Image style={styles.roomAvatar}
                           source={room.image}
                           resizeMode='contain'/>
                </View>
                <Text style={styles.roomName}>{room.name}</Text>
                <View style={styles.groupButton}>
                    <Button onPress={() => this._turnOnAllDevices()}
                            buttonStyle={styles.statusButton}
                            title='ON'/>
                    <Button onPress={() => this._turnOffAllDevices()}
                            colors={['#CACFD2', '#BDC3C7', '#909497']}
                            buttonStyle={[styles.statusButton, {marginLeft: 10, backgroundColor: '#e1e1e1'}]}
                            title='OFF'/>
                </View>
                <FlatList
                    extraData={this.props}
                    renderItem={({item, index}) => this._renderDevice(item)}
                    data={deviceElements[this.state.roomId]}
                    keyExtractor={(item, index) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        padding: 20,
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
        devicesMode: state.awsiot.devicesMode,
        deviceStatus: state.awsiot.deviceStatus
    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetail)
