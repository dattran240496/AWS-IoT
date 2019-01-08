import React from 'react'
import {
    AsyncStorage,
    Image,
    TouchableOpacity,
    View,
    FlatList,
    Text,

} from 'react-native'
import {connect} from 'react-redux'
import {
    updateAWSStatus,
    updateDeviceMode,
    updateDeviceStatus,
    updateSwitchDeviceStatus,
    updateScript
} from "../../../actions/awsIoT";
import styles from './styles'
import Button from "../../Button";
import navigator from 'navigators/CustomNavigator'

class ScriptList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        this._getScriptList()
    }

    _getScriptList = async () => {
        try {
            const value = await AsyncStorage.getItem('scriptList');
            if (value !== null) {
                this.props.onUpdateScript(JSON.parse(value))
            } else {

            }
        } catch (error) {
            // Error retrieving data
        }
    }

    _renderScript = (scriptName, idx) => {
        return (
            <TouchableOpacity
                key={scriptName}
                style={[styles.scriptItem,
                    idx === 0 && {borderTopColor: '#e1e1e1', borderTopWidth: 1}]}
                onPress={() => {
                    navigator.navigate('ScriptDetail', {scriptId: scriptName})
                }}
            >
                <Text style={styles.scriptName}>{scriptName}</Text>
            </TouchableOpacity>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptList)
