import {
    ToastAndroid
} from 'react-native';
import * as types from './types'
import Api from "../lib/api";
import { spinner } from './spinner';
import RNAccountKit from "react-native-facebook-account-kit";

export const registerWithPhone = (data) => dispatch => {
    dispatch(spinner(true));
    Api.post('/users/account-kit-register', data ).then(resp => {
        dispatch(spinner(false));
        if(resp.status === 'failed') {
            let error = resp.errors[0];
            RNAccountKit.logout()
                .then(() => {
                    ToastAndroid.show(error, 1000);
                });
            dispatch({ type: types.REGISTER_FAILED, errors: resp.errors })
        } else{
            dispatch({ type: types.USER_REGISTERED });
            dispatch({ type: types.USER_LOGGED_IN, user: resp.user, token: resp.token })
        }
    });
};

export const removeAvatar = (token) => dispatch =>
    Api.delete(`/users/avatar?authorization_token=${token}`)
        .catch(err => {
            dispatch(spinner(false));
            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
        });


export const updateAvatar = (data, token) => dispatch => (
    Api.patch(`/users/avatar?authorization_token=${token}`, { user: data })
        .catch(err => {
            dispatch(spinner(false));
            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
        })
);

export const updateName = (data,token) => dispatch => {
    dispatch(spinner(true));
    Api.patch(`/users/?authorization_token=${token}`, {user: data})
        .then(resp => {
            dispatch(spinner(false));
            if (resp.status) {
                dispatch({type: types.SET_USER, user: resp.user, token: resp.token});
                ToastAndroid.show('Name updates successfully', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("There was some error, please try again", ToastAndroid.SHORT);
            }
        })
        .catch(err => {
            dispatch(spinner(false));
            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
        })
};

export const updateUsername = (data, token) => dispatch => {
    dispatch(spinner(true));
    Api.post(`/users/username?authorization_token=${token}`, data)
        .then(resp => {
            if (resp.user.availability) {
                Api.patch(`/users?authorization_token=${token}`, data)
                    .then(resp => {
                        dispatch(spinner(false));
                        if (resp.status) {
                            dispatch({type: types.SET_USER, user: resp.user, token: resp.token});
                            ToastAndroid.show('Username updated successfully', ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
                        }

                    })
                    .catch(err => {
                        dispatch(spinner(false));
                        ToastAndroid.show('There was some error', ToastAndroid.SHORT);
                    })
            } else {
                dispatch(spinner(false));
                ToastAndroid.show('Username not available. Please try another one', ToastAndroid.SHORT);
            }

        })
        .catch(err => {
            dispatch(spinner(false));
            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
        })
};
