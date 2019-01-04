import React from 'react';
import {Root} from 'native-base';
import AppNavigator from './navigators/AppNavigator';
import navigator from './navigators/CustomNavigator';
import {Provider} from 'react-redux';
import configureStore from './store'
const {store} = configureStore();
export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Root>
                    <AppNavigator
                        ref={(navigatorRef) => {
                            navigator.setContainer(navigatorRef)
                        }}
                    />
                </Root>
            </Provider>
        )
    }
}
