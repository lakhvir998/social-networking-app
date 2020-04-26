import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner';
import {ToastAndroid} from "react-native";

export const getNotifications = (token) => dispatch => {
    dispatch(spinner(true));
    return (Api.get(`/notifications?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            dispatch({ type: types.NOTIFICATIONS_FETCHED, notifications: resp.notifications });
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const markNotification = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.patch(`/notifications/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                ToastAndroid.show('Notification marked as read', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const getNotificationCount = (token) => dispatch => {
    Api.get(`/notifications/count?authorization_token=${token}`)
        .then(resp => {

            dispatch({type: types.NOTIFICATION_COUNT_FETCHED, count: resp.notifications.count})
        })
};