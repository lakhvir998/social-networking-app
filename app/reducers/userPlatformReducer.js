import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    user_platforms: [],

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.USER_PLATFORM_FETCHED:
            return { ...state, ...INITIAL_STATE, user_platforms: action.user_platforms };
        default:
            return state;
    }
}