import React from 'react'
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import AWSIoT from "../Screens/AWSIoT";
import SmartConfig from "../Screens/SmartConfig";
import Icon from 'react-native-vector-icons/FontAwesome'
import RoomDetail from "../components/RoomDetail";
import DeviceDetail from "../components/DeviceDetail/index";

const HomeStack = createStackNavigator({
    Home: {
        screen: AWSIoT,
        navigationOptions: {
            header: null,
        },
    },
    RoomDetail: {
        screen: RoomDetail,
        navigationOptions: {
            header: null,
        },
    },
    DeviceDetail: {
        screen: DeviceDetail,
        navigationOptions: {
            header: null,
        },
    }
});

export default createBottomTabNavigator({
    Home: {
        screen: HomeStack,
    },
    SmartConfig: {
        screen: SmartConfig,
    },
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
