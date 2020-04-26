import React from 'react';
import {  TabNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';

import { TAB_BUTTON_COLOR } from "../styles/common";
import MyToolbar from '../components/MyToolbar';
import Profile from "../screens/profile";
import FriendsNavigator from "./FriendsNavigator";
import NotificationsNavigator from "./NotificationsNavigator";
import NotificationIcon from '../components/NotificationIcon';

export default SignedIn = TabNavigator({

        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Profile',
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Icon name="user" size={25} color={tintColor} />;
                },
            }
        },
        FriendsTabs: {
            screen: FriendsNavigator,
            navigationOptions: {
                title: 'Friends & Groups',
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Icon name="users" size={25} color={tintColor} />;
                },
            }
        },

        Notifications: {
            screen: NotificationsNavigator,
            navigationOptions: {
                title: "Notifications",
                tabBarIcon: ({ focused, tintColor }) => {
                    return <NotificationIcon iconColor={tintColor} />;
                },
            }
        }
    },
    {
        navigationOptions: ({ navigation }) => {
            return {
                header: <MyToolbar navigation={navigation} />,
            }
        },
        tabBarOptions: {
            showLabel: false,
            showIcon: true,
            style: {
                backgroundColor: 'white',
            },
            activeTintColor: TAB_BUTTON_COLOR,
            inactiveTintColor: '#969495',
            indicatorStyle: {
                backgroundColor: TAB_BUTTON_COLOR,
            },
        },
        tabBarPosition: 'bottom',
        headerMode: "screen",
    }
);