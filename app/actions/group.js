import Api from '../lib/api';
import * as types from "./types";
import { spinner } from './spinner';
import {ToastAndroid} from "react-native";

export const getGroups = (token) => dispatch => {
    dispatch(spinner(true));
    return (Api.get(`/groups?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            dispatch({ type: types.GROUPS_FETCHED, groups: resp.groups });
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const getGroupMembers = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.get(`/groups/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status) {
                dispatch({ type: types.GROUP_MEMBERS_FETCHED, group_members: resp.members });
            }

            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const addGroup = (data,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/groups?authorization_token=${token}`, data)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                dispatch({ type: types.USER_PLATFORM_FETCHED, user_platforms: resp.user_platforms })
            } else {
                ToastAndroid.show('There was an error in adding group', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const deleteGroup = (id, token) => dispatch => {
    dispatch(spinner(true));
    return (Api.delete(`/groups/${id}?authorization_token=${token}`)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                ToastAndroid.show('List removed', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in sending friend request', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};

export const addGroupMember = (data,token) => dispatch => {
    dispatch(spinner(true));
    return (Api.post(`/group-members?authorization_token=${token}`, data)
        .then(resp => {
            dispatch(spinner(false));
            if(resp.status){
                ToastAndroid.show('Friend added to list', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('There was an error in adding group', 1000);
            }
            return resp;
        })
        .catch(err => {
            dispatch(spinner(false));
        }));
};


