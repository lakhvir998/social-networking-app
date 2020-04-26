import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    isLoggedIn: false,
    user: {},
    token: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.USER_LOGGING_IN:
            return { ...state, ...INITIAL_STATE };
        case types.USER_LOGGED_IN:
            return { ...state, ...INITIAL_STATE, isLoggedIn: true, user: action.user, token: action.token };
        case types.USER_LOGIN_FAILED:
            return { ...state, ...INITIAL_STATE, errors: action.errors, errorFlag: true };
        case types.USER_LOGGED_OUT:
            return { ...state, ...INITIAL_STATE };
        case types.SET_USER:
            return { ...state, ...INITIAL_STATE,  user: action.user, token: action.token };
        default:
            return state;
    }
}

