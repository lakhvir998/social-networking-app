import React from 'react';
import {  TabNavigator} from "react-navigation";

import * as CommonStyle from '../styles/common';
import Friends from "../screens/friends";
import Groups from "../screens/groups";

export default FriendsTab = TabNavigator({
        Friends: {
            screen: Friends,
            navigationOptions: {
                title: 'Friends',
            }
        },
        Groups: {
            screen: Groups,
            navigationOptions: {
                title: "Lists",
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