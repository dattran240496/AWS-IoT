import {createStackNavigator, createAppContainer} from 'react-navigation';
import TabBarNavigator from "./TabBarNavigator";
import RoomDetail from '../components/RoomDetail'
import AWSIoT from "../Screens/AWSIoT";
import CreateScript from "../components/CreateScript";
import ScriptList from "../components/Script/ScriptList";
const Script = createStackNavigator(
    {
        ScriptList: {
            screen: ScriptList,
            navigationOptions: {
                header: null,
            },
        },
        CreateScript: {
            screen: CreateScript,
            navigationOptions: {
                header: null,
            },
        },
    }
)
const RootStack = createStackNavigator(
    {
        HomeStack: {
            screen: TabBarNavigator,
            navigationOptions: {
                header: null,
            },
        },
        Script: {
            screen: Script,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        initialRouteName: 'HomeStack',
        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            gesturesEnabled: true,
        },
    },
)

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
