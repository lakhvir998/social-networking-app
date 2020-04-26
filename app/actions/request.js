import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner';
import {ToastAndroid} from "react-native";

export const getRequests = (token) => dispatch => {
    return (Api.get(`/requests?authorization_token=${token}`)
        .then(resp => {
            dispatch({ type: types.REQUESTS_FETCHED, requests: resp.requests });
            return resp;
        })
        .catch(err => {
        }));
};

export const acceptRequest = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/requests/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            dispatch({ type: types.REQUESTS_ACCEPTED, requests: resp.requests });
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false))
        }));
};

export const declineRequest = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.delete(`/requests/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            dispatch({ type: types.REQUESTS_DECLINED, requests: resp.requests });
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false))
        }));
};




