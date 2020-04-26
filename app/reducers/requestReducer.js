import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    requests: [],

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.REQUESTS_FETCHED:
            return { ...state, ...INITIAL_STATE, requests: action.requests };
        default:
            return state;
    }
}