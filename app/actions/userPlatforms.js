import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner'
import {ToastAndroid} from "react-native";

export const addUserPlatform = (data,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/user-platforms?authorization_token=${token}`, data)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status === 'success'){
                dispatch({ type: types.USER_PLATFORM_FETCHED, user_platforms: resp.user_platforms })
            } else {
                ToastAndroid.show('There was an error in adding platform', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const getUserPlatforms = (token) => dispatch => {
    Api.get(`/user-platforms?authorization_token=${token}`)
        .then(resp => {
            dispatch({ type: types.USER_PLATFORM_FETCHED, user_platforms: resp.user_platforms })
        })
        .catch(err => {

        })
};

export const deleteUserPlatform = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.delete(`/user-platforms/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
           return resp;
        }).catch(err => {
            dispatch(spinner(false));
        }))
};

export const updateUserPlatform = (data, visibilty, token) => dispatch => {
    dispatch(spinner(true));
    return(
        Api.patch(`/user-platforms/${data.id}?authorization_token=${token}`, {
            user_platform: {
                id: data.id,
                visibility: visibilty,
                platform: data.platform_name,
                url: data.url
            }
        }).then(resp => {
            dispatch(spinner(false));
            return resp;
        }).catch(err => {
            dispatch(spinner(false));
        })
    );
};