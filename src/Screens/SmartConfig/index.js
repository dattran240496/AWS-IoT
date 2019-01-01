import React from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import styles from './styles'
import WifiManager from 'react-native-wifi';
import {NetworkInfo} from 'react-native-network-info';
import Smartconfig from 'react-native-smartconfig';

export default class SmartConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ssid: '',
            password: '',
            bssid: '',
            btnTitle: 'Connect'
        }
    }

    componentDidMount() {
        // WifiManager.getCurrentWifiSSID()
        //     .then((ssid) => {
        //         console.log("WifiManager:" + ssid)
        //     }, () => {
        //         console.log('Cannot get current SSID!')
        //     });
        NetworkInfo.getSSID(ssid => {
            console.log("SSID:" + ssid);
            this.setState({ssid: ssid})
        });
        NetworkInfo.getBSSID(ssid => {
            console.log('BSSID:' + ssid);
            this.setState({bssid: ssid})
        });
    }

    connectSmartConfig = () => {
        if (this.state.btnTitle === 'Connect') {
            Smartconfig.start({
                type: 'esptouch', //or airkiss, now doesn't not effect
                ssid: this.state.ssid,
                bssid: this.state.bssid, //"" if not need to filter (don't use null)
                password: this.state.password,
                timeout: 50000 //now doesn't not effect
            }).then(function(results){
                //Array of device success do smartconfig
                console.log('rs', results);
            }).catch(function(error) {
                Smartconfig.stop(); //interrupt task
                console.log('e', error)
            });
            this.setState({btnTitle: 'Cancel'}, () => {
                setTimeout(() => {
                    Smartconfig.stop();
                    this.setState({btnTitle: 'Connect'})
                }, 5000);
            })
        } else if (this.state.btnTitle === 'Cancel') {
            Smartconfig.stop();
            this.setState({btnTitle: 'Connect'})
        }

    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Smart Config
                </Text>
                <TextInput style={[styles.txtIpt, styles.ssidTxtIpt]}
                           placeholder='SSID'
                           value={this.state.ssid}/>
                <TextInput style={[styles.txtIpt, styles.passwordTxtIpt]}
                           placeholder='Password'
                           onChangeText={txt => this.setState({password: txt})}
                           value={this.state.password}/>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => this.connectSmartConfig()}>
                    <Text style={styles.btn_title}>
                        {this.state.btnTitle}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
