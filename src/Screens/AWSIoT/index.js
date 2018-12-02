/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {NativeModules, NativeEventEmitter, DeviceEventEmitter} from "react-native";

const { IoTModule } = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
const isIOS = Platform.OS === "ios"
export default class AWSIoT extends Component {
    handleMqttStatusChange = (params) => {
        console.log("Connection Status", params);
        if (params.status === 2) {
            if (isIOS) {
                NativeModules.AWSMqtt.subscribeFromAwsMqtt("helloTopic")
            }
        }
    }

    handleMessage = (message) => {
        console.log(message);
    }

    componentDidMount() {
        if (isIOS) {
            AWSMqttEvents.addListener(
                "connectionStatus",
                this.handleMqttStatusChange
            );
            AWSMqttEvents.addListener("message", this.handleMessage);
            NativeModules.AWSMqtt.setupAAWSMQTT();//implemented in AWSMqtt.swift
            setTimeout(() => {
                NativeModules.AWSMqtt.connectToAWSMQTT();//implemented in AWSMqtt.swift
            }, 500);
        } else {
            DeviceEventEmitter.addListener("Status", this.handleMqttStatusChange);
            //DeviceEventEmitter.addListener("subscribe", this.handleDriverData);

            setTimeout(() => {
                IoTModule.initializeAWSMqtt();
            }, 1500);
            setTimeout(() => {
                IoTModule.connectAWSMqtt();
            }, 3000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
                <TouchableOpacity onPress={() => {
                    if (isIOS) {
                        NativeModules.AWSMqtt.publishToAWSMQTT("MESSAGE", "OFF")
                    } else {
                        IoTModule.publish("helloTopic", "helloTopic");
                    }
                }}>
                    <Text>Publish</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
