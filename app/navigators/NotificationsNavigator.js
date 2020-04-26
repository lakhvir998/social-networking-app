import React from 'react';
import {  TabNavigator} from "react-navigation";

import Notification from "../screens/notifications/notification";
import Requests from "../screens/notifications/requests";
import * as CommonStyle from "../styles/common";

export default FriendsTab = TabNavigator({
        Requests: {
            screen: Requests,
            navigationOptions: {
                title: "Requests",
            }
        },
        Notification: {
            screen: Notification,
            navigationOptions: {
                title: 'Notifications',
            }
        },

    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: CommonStyle.COLOR_SECONDARY
            },
            activeTintColor: '#fff',
            inactiveTintColor: '#f2f3f4',
            indicatorStyle: {
                backgroundColor: '#fff',
            },
        },
        headerMode: "screens",
    }
);