import React from 'react'
import {
    Image,
    TouchableOpacity,
    View,
    FlatList,
    Text,
    Switch, DeviceEventEmitter, NativeModules, NativeEventEmitter, Platform, AsyncStorage, Alert, TextInput, ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import Swipeout from 'react-native-swipeout';
import {
    updateAWSStatus,
    updateDeviceStatus,
    updateSwitchDeviceStatus
} from "actions/awsIoT";
import {
    allDevices,
    allDevicesStatusOff,
    allDevicesStatusOn,
    allRoom,
    deviceButtonMode, deviceElements,
    deviceSensorMode
} from "../../../constants/devices";
import {publish, subscribe, unsubscribe, onChangeStatus} from 'utils/mqttFunc';
import {isInt, isJSON} from "../../../constants/common";
import {STATUS_TOPIC} from "../../../constants/topics";
import _ from "lodash";
import styles from "./styles";
import {updateScript} from "../../../actions/awsIoT";
import Button from "../../Button";

const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";

class ScriptDetail extends React.Component {

    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            scriptId: props.navigation.getParam('scriptId'),
            allDevices: deviceElements,
            selectedDevice: props.scriptList[props.navigation.getParam('scriptId')],
            scriptName: '',
            allDevicesStatusSelected: this.allDevicesStatusSelectedDefault(props.navigation.getParam('scriptId'))
        }
    }

    allDevicesStatusSelectedDefault = (scriptId) => {
        const {scriptList} = this.props;
        const script = scriptList[scriptId]
        const data = JSON.parse(JSON.stringify(allDevices));
        Object.keys(allDevices).forEach(item => {
            const device = _.find(script, o => o.id === item)
            data[item] = device && device.isOn !== null ? device.isOn : false
        });
        return data;
    }

    _removeScript = async device => {
        const {scriptList} = this.props;
        const currentScript = scriptList[this.state.scriptId];
        _.remove(currentScript, o => o.id === device.id)
        this.props.onUpdateScript({[this.state.scriptId]: currentScript});
        let newScriptList = scriptList;
        newScriptList[this.state.scriptId] = currentScript
        await AsyncStorage.setItem('scriptList', JSON.stringify(newScriptList));
    };

    _alertConfirm = (device) => {
        Alert.alert(
            'Delete',
            `Do you want to delete ${device.name}?`,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () => this._removeScript(device)},
            ],
            {cancelable: false}
        )
    }


    onSetStatusChange = (status, deviceId) => {
        const currentStatus = this.state.allDevicesStatusSelected;
        currentStatus[deviceId] = status;
        this.setState({
            allDevicesStatusSelected: currentStatus
        })
    }

    _updateScript = async () => {
        try {
            const {scriptList} = this.props;
            const currentSelectedDevices = JSON.parse(JSON.stringify(this.state.selectedDevice))
            this.state.selectedDevice.forEach((item, index) => {
                currentSelectedDevices[index] = Object.assign({isOn: this.state.allDevicesStatusSelected[item.id]},
                    currentSelectedDevices[index])
            })
            const param = {[this.state.scriptId]: currentSelectedDevices}
            this.props.onUpdateScript(param);
            const newScript = Object.assign(param, scriptList)
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
        const {scriptList} = this.props;
        const data = scriptList[this.state.scriptId]
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

                    <Text style={styles.title}>{this.state.scriptId}</Text>

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
                            title='Update'
                            onPress={() => {
                                // this.state.selectedDevice.forEach(item => {
                                //     onChangeStatus(item.id, deviceStatus)
                                // })
                                this._updateScript()
                            }}
                        />
                        {/*<Button buttonStyle={[styles.controlBtn, {marginLeft: 5}]} title='OFF' />*/}
                    </View>
                </View>
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
    onUpdateScript: params => dispatch(updateScript(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptDetail)
