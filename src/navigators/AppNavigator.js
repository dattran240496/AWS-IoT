import {createStackNavigator, createAppContainer} from 'react-navigation';
import TabBarNavigator from "./TabBarNavigator";
import RoomDetail from '../components/RoomDetail'

const RootStack = createStackNavigator(
    {
        HomeStack: {
            screen: TabBarNavigator,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        initialRouteName: 'HomeStack',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: true,
        },
    },
)

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
