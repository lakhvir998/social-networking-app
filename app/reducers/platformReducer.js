import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    platforms: [],

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.PLATFORMS_FETCHED:
            return { ...state, ...INITIAL_STATE, platforms: action.platforms };
        default:
            return state;
    }
}