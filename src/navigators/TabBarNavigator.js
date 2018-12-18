import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import AWSIoT from "../Screens/AWSIoT";
import SmartConfig from "../Screens/SmartConfig";

export default createBottomTabNavigator({
    AWSIoT: {
        screen: AWSIoT,
        navigationOptions: {
            header: null,
        },
    },
    SmartConfig: {
        screen: SmartConfig,
        navigationOptions: {
            header: null,
        },
    }
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    initialRouteName: 'AWSIoT',
    tabBarOptions: {
        activeTintColor: '#5887D9',
        inactiveTintColor: '#E1E1E1',
        showLabel: true,
        inactiveBackgroundColor: "#fff",
        activeBackgroundColor: "#fff"
    },
})
