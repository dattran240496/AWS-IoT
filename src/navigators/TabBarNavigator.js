import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import AWSIoT from "../Screens/AWSIoT";
import SmartConfig from "../Screens/SmartConfig";
import Icon from 'react-native-vector-icons/FontAwesome'
export default createBottomTabNavigator({
    Home: {
        screen: AWSIoT,
    },
    SmartConfig: {
        screen: SmartConfig,
    }
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => {
        const { routeName } = navigation.state;
        let tabBarLabel = ''
        let iconName
        switch (routeName) {
            case 'Home':
                tabBarLabel = 'Home'
                iconName = 'home'
                break
            case 'SmartConfig':
                tabBarLabel = 'Smart Config'
                iconName = 'cog'
                break
            default:
                tabBarLabel = 'Home'
                iconName = 'home'
                break
        }
        return {
            header: null,
            tabBarLabel,
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={iconName} size={28} color={tintColor} />
            },
        }
    },
    tabBarOptions: {
        activeTintColor: '#5A3A91',
        inactiveTintColor: '#808B96',
        showLabel: true,
        inactiveBackgroundColor: "transparent",
        activeBackgroundColor: "transparent"
    },
})
