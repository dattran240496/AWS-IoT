import React from 'react';
import { Root } from 'native-base';
import AppNavigator from './navigators/AppNavigator';
import navigator from './navigators/CustomNavigator';

export default class App extends React.Component {
    render() {
        return (
            <Root>
                <AppNavigator
                    onNavigationStateChange={null}
                    ref={(navigatorRef) => {
                        navigator.setContainer(navigatorRef)
                    }}
                />
            </Root>
        )
    }
}
