import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner';
import RNAccountKit from "react-native-facebook-account-kit";
import {ToastAndroid} from "react-native";

export const userLoggedIn = (user, token) => ({
    type: types.USER_LOGGED_IN,
    user,
    token
});

export const login = (data) => dispatch => {
    dispatch(spinner(true));
    Api.post('/users/account-kit-phone', data).then(resp => {
        dispatch(spinner(false));
        if(resp.status === 'failed') {
            let errorKeys = Object.keys(resp.errors);
            let k = errorKeys[0];
            RNAccountKit.logout()
                .then(() => {
                    ToastAndroid.show(resp.errors[k], 1000);
                });
            dispatch({ type: types.USER_LOGIN_FAILED, errors: resp.errors })
        } else {
            dispatch(userLoggedIn(resp.user, resp.token))
        }
    })
};

export const checkGoogleAuth = (data) => dispatch => {
        dispatch(spinner(true));
    return (Api.post('/users/google-check',  data)
        .then(resp => {
                dispatch(spinner(false));
                return resp;
            }))
};

// export const googleAuth = (data) => dispatch => {
//     dispatch(spinner(true));
//     return (Api.post('/users/google-sign-in',  data)
//         .then(resp => {
//             dispatch(spinner(false));
//             return resp;
//         })
//         .catch(err => {
//             dispatch(spinner(false));
//             console.log(err);
//         }))
// };

export const accountkitLoginGoogle = (data) => dispatch => {
    dispatch(spinner(true));
    return (Api.post('/users/account-kit-google',  { user:  data.user, ak_access_token: data.ak_access_token })
        .then(resp => {
            dispatch(spinner(false));
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
            console.log(err);
        }))
};


export const facebookCheck = (data) => dispatch => {
        dispatch(spinner(true));
        return (Api.post('/users/facebook-check',  data)
            .then(resp => {
                dispatch(spinner(false));
                return resp;
            }))
};



// export const facebookAuth = (data) => dispatch => {
//     dispatch(spinner(true));
//     return (Api.post('/users/facebook-sign-in',  data)
//         .then(resp => {
//             dispatch(spinner(false));
//             return resp;
//         })
//         .catch(err => {
//             dispatch(spinner(false));
//             console.log(err);
//         }))
// };

export const accountkitLoginFB = (data) => dispatch => {
    dispatch(spinner(true));
    return (Api.post('/users/account-kit-fb', data)
        .then(resp => {
            dispatch(spinner(false));
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
            console.log(err);
        }))
};



