import React from 'react'
import {
    AsyncStorage,
    Image,
    TouchableOpacity,
    View,
    FlatList,
    Text,
    Alert, DeviceEventEmitter, NativeModules, NativeEventEmitter, Platform
} from 'react-native'
import {connect} from 'react-redux'
import {
    updateAWSStatus,
    updateDeviceMode,
    updateDeviceStatus,
    updateSwitchDeviceStatus,
    updateScript,
    deleteScript
} from "../../../actions/awsIoT";
import {publish} from 'utils/mqttFunc';
import styles from './styles'
import Button from "../../Button";
import navigator from 'navigators/CustomNavigator'
import Swipeout from "react-native-swipeout";
import {isInt, isJSON} from "../../../constants/common";
import {MESSAGE_TOPIC, STATUS_TOPIC} from "../../../constants/topics";
import _ from "lodash";
const {IoTModule} = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

const isIOS = Platform.OS === "ios";
import {allDevicesStatusOff, allDevicesStatusOn, deviceButtonMode, deviceSensorMode} from "../../../constants/devices";

class ScriptList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    _removeScript = async scriptName => {
        const {scriptList} = this.props;
        this.props.onDeleteScript(scriptName);
        const currentScript = scriptList;
        delete  currentScript[scriptName]
        await AsyncStorage.setItem('scriptList', JSON.stringify(currentScript));
    };

    _alertConfirm = (scriptName) => {
        Alert.alert(
            'Delete',
            `Do you want to delete ${scriptName}?`,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () => this._removeScript(scriptName)},
            ],
            { cancelable: false }
        )
    }

    _onPressScript = (scriptId) => {
        this.props.scriptList[scriptId].forEach(item => {

            const isOn = item.isOn;
            let status = null
            if (isOn) {
                status = allDevicesStatusOn[item.id]
            } else {
                status = allDevicesStatusOff[item.id]
            }
            console.log('item', item)
            console.log('status', status)
            publish(MESSAGE_TOPIC, status.toString())

        })
    }

    _renderScript = (scriptName, idx) => {
        return (
            <Swipeout
                backgroundColor={'#fff'}
                right={[{
                    text: 'Delete',
                    backgroundColor: 'red',
                    onPress: () => {
                        this._alertConfirm(scriptName)
                    }
                }]}>
                <TouchableOpacity
                    key={scriptName}
                    style={[styles.scriptItem,
                        idx === 0 && {borderTopColor: '#e1e1e1', borderTopWidth: 1}]}
                    onPress={() => {
                        this._onPressScript(scriptName)
                    }}
                    onLongPress={() => {
                        navigator.navigate('ScriptDetail', {scriptId: scriptName})
                    }}
                >
                    <Text style={styles.scriptName}>{scriptName}</Text>
                </TouchableOpacity>
            </Swipeout>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.pop()
                }}>
                    <Image source={require('assets/icons/close.png')}
                           style={styles.modal_close}
                           resizeMode={'contain'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Script</Text>
                <View style={{flex: 1}}>
                    <FlatList
                        data={Object.keys(this.props.scriptList)}
                        extraData={this.props}
                        renderItem={({item, index}) => this._renderScript(item, index)}
                        keyExtractor={(item, index) => item}
                        contentContainerStyle={{
                            marginTop: 15
                        }}
                    />
                </View>
                <View style={{alignItems: 'flex-end', marginBottom: 5}}>
                    <Button
                        onPress={() => navigator.navigate('CreateScript')}
                        title={'+'}
                        buttonStyle={styles.btnAdd}
                        titleStyle={styles.titleAddBtn}
                    />
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
        scriptList: state.awsiot.scriptList,

    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
    onUpdateScript: params => dispatch(updateScript(params)),
    onDeleteScript: params => dispatch(deleteScript(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptList)
