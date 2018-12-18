import {NativeEventEmitter, NativeModules, Platform} from "react-native";
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
