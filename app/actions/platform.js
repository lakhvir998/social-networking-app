import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner'
import {ToastAndroid} from "react-native";

export const getPlatforms = (token) => dispatch => {
    dispatch(spinner(true));
    return (Api.get(`/platforms?authorization_token=${token}`)
        .then(resp => {

            dispatch(spinner(false));
            dispatch({ type: types.PLATFORMS_FETCHED, platforms: resp })
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const platformPermission = (data, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/requests/user-platform?authorization_token=${token}`, {dab_request: data})
        .then(resp => {
            dispatch(spinner(false));
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const cancelPlatformPermission = (data, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.delete(`/requests/user-platform?authorization_token=${token}`, {dab_request: data})
        .then(resp => {
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            dispatch(spinner(false));
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};