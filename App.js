import React, { Component } from 'react';
import { View, Text, NetInfo } from 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import logger from 'redux-logger';

import { COLOR, ThemeProvider } from 'react-native-material-ui';
import AppReducer from './app/reducers';
import AppWithNavigationState from './app/navigators/AppNavigator';
import { middleware } from './app/utils/redux';
import {COLOR_SECONDARY} from "./app/styles/common";

console.ignoredYellowBox = ['Warning:'];

const store = createStore(
    AppReducer,
    applyMiddleware(thunk, middleware, logger),
);

const uiTheme = {
    palette: {
        primaryColor: COLOR_SECONDARY,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

type Props = {};
export default class App extends Component<Props> {
    state = {
      isConnected: true
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }

    _handleConnectionChange = (isConnected) => {
        this.setState({ isConnected })
    };

  render() {
    return (
        <Provider store={store}>
            <ThemeProvider uiTheme={uiTheme}>
                <AppWithNavigationState />
            </ThemeProvider>
                {/*{ !this.state.isConnected &&*/}
                    {/*<View style={ {*/}
                        {/*backgroundColor: 'rgba(0,0,0,0.8)',*/}
                        {/*height: 50,*/}
                        {/*position: 'absolute',*/}
                        {/*bottom: 0,*/}
                        {/*left: 0,*/}
                        {/*right: 0,*/}
                        {/*paddingHorizontal: 20,*/}
                        {/*justifyContent: 'center'*/}
                    {/*} }>*/}
                        {/*<Text style={{ color: '#fff'}}>No Connection</Text>*/}
                    {/*</View>*/}
                {/*}*/}

        </Provider>
    );
  }
}

