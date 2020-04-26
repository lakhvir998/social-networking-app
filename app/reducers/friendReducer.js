import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    friends: [],

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FRIEND_REQUEST_SENT:
            return { ...state, ...INITIAL_STATE };
        case types.FRIEND_FETCHED:
            return { ...state, ...INITIAL_STATE, friends: action.friends };
        default:
            return state;
    }
}