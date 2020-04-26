import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner';
import {ToastAndroid} from "react-native";

export const getFriends = (token) => dispatch => {
    return (Api.get(`/friends?authorization_token=${token}`)
        .then(resp => {
            dispatch({ type: types.FRIEND_FETCHED, friends: resp.friends });
            return resp;
        })
        .catch(err => {
        }));
};

export const sendFriendRequest = (data,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/friends/request?authorization_token=${token}`, data)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                dispatch({ type: types.FRIEND_REQUEST_SENT });
                ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const cancelFriendRequest = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.delete(`/friends/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const acceptFriendRequest = (id,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.patch(`/friends/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                dispatch({ type: types.FRIEND_ADDED });
                ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const changeNickname = (data,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.patch(`/friends/nickname?authorization_token=${token}`, { friend: data })
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                dispatch({ type: types.FRIEND_ADDED });
                ToastAndroid.show('Nickname changed', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};


