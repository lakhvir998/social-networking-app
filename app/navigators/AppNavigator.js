import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { BackHandler } from "react-native";
import { addNavigationHelpers, SwitchNavigator, StackNavigator, NavigationActions } from 'react-navigation';

import SignedOut from './SignedOut';
import SignedIn from './SignedIn';
import AuthLoading from '../screens/authLoading';
import ScanQR from '../screens/scanQR';
import FriendProfile from '../screens/friendProfile';
import { addListener } from '../utils/redux';

import {COLOR_SECONDARY} from "../styles/common";

export const AppNavigator = SwitchNavigator({
        AuthLoading: { screen: AuthLoading },
        SignedOut: {
            screen: SignedOut,
            navigationOptions: {
                gesturesEnabled: false
            }
        },
        SignedIn: StackNavigator ({
                Tabs: {
                    screen: SignedIn
                },
                ScanQR: {
                    screen: ScanQR,
                    navigationOptions: {
                        title: 'Profile',
                    }
                },
                FriendProfile: {
                    screen: FriendProfile
                }
            },
            {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: COLOR_SECONDARY,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                },

            }),

    },
    {
        initialRouteName: "AuthLoading"
    }
);


class AppWithNavigationState extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired,
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };


    render() {
        const { dispatch, nav } = this.props;
        return (
                <AppNavigator
                    navigation={addNavigationHelpers({
                        dispatch,
                        state: nav,
                        addListener,
                    })}
                />
        );
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);