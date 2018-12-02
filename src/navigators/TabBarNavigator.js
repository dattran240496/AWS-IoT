import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import AWSIoT from "../Screens/AWSIoT";
import SmartConfig from "../Screens/SmartConfig";

export default createBottomTabNavigator({
    AWSIoT: {
        screen: AWSIoT
    },
    SmartConfig: {
        screen: SmartConfig
    }
})
