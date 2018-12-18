import {createStackNavigator, createAppContainer} from 'react-navigation';
import TabBarNavigator from "./TabBarNavigator";
import HomeDrawer from './HomeDrawer'

const RootStack = createStackNavigator(
    {
        HomeDrawer: {
            screen: HomeDrawer,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        initialRouteName: 'HomeDrawer',
        headerMode: 'screen',
        navigationOptions: {
            gesturesEnabled: true,
        },
    },
)

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
