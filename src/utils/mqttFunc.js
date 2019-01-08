import {NativeEventEmitter, NativeModules, Platform} from "react-native";
import {MESSAGE_TOPIC, STATUS_TOPIC} from "../constants/topics";
import {allDevicesStatusOff, allDevicesStatusOn, deviceButtonMode, deviceSensorMode} from "../constants/devices";
import {isInt, isJSON} from "../constants/common";
import _ from "lodash";
const isIOS = Platform.OS === "ios"
const { IoTModule } = NativeModules;//For android
const AWSMqttEvents = new NativeEventEmitter(NativeModules.AWSMqtt);//for ios

export const publish = (topic, message) => {
    if (isIOS) {
        return NativeModules.AWSMqtt.publishToAWSMQTT(topic, message)
    } else {
        return IoTModule.publish(topic, message);
    }
};

export const subscribe = (topic) => {
    if (isIOS) {
        return NativeModules.AWSMqtt.subscribeFromAwsMqtt(topic)
    } else {
        return IoTModule.subscribe(topic);
    }
}

export const unsubscribeAllTopic = () => {
    if (isIOS) {
        return NativeModules.AWSMqtt.unsubscribeAllTopics()
    } else {
        // return IoTModule.subscribe(topic);
    }
}

export const onChangeStatus = (id, deviceStatus) => {
    if (id === "switch") {
        publish(MESSAGE_TOPIC, deviceStatus[id] === -1 ? "ON" : "OFF")
    } else {
        let status = null;
        const deviceOnIdx = allDevicesStatusOn[id] === deviceStatus[id];
        if (deviceOnIdx) {
            status = deviceStatus[id] + 1
        }
        const deviceOffIdx = allDevicesStatusOff[id] === deviceStatus[id];
        if (deviceOffIdx) {
            status = deviceStatus[id] - 1
        }
        if (status) {
            publish(MESSAGE_TOPIC, status.toString())
        }
    }
};
