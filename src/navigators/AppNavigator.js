import {createStackNavigator, createAppContainer} from 'react-navigation';
import TabBarNavigator from "./TabBarNavigator";

const RootStack = createStackNavigator(
    {
        TabNavigator: {
            screen: TabBarNavigator
        }
    },
    {
        initialRouteName: 'TabNavigator',
        headerMode: 'screen',
        navigationOptions: {
            gesturesEnabled: true,
        },
    },
)

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
