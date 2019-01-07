import React from 'react'
import {Image, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {updateAWSStatus, updateDeviceMode, updateDeviceStatus, updateSwitchDeviceStatus} from "../../../actions/awsIoT";
import styles from './styles'
import Button from "../../Button";
import navigator from 'navigators/CustomNavigator'

class ScriptList extends React.Component {
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
                <View style={{flex: 1}}>
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
    }
}

const mapDispatchToProps = dispatch => ({
    onUpdateDeviceStatus: params => dispatch(updateDeviceStatus(params)),
    onUpdateAWSStatus: params => dispatch(updateAWSStatus(params)),
    onUpdateSwitchDeviceStatus: params => dispatch(updateSwitchDeviceStatus(params)),
    onUpdateDeviceMode: params => dispatch(updateDeviceMode(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptList)
