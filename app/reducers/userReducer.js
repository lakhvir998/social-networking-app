import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.USER_REGISTERED:
            return { ...state, ...INITIAL_STATE  };
        case types.REGISTER_FAILED:
            return { ...state, ...INITIAL_STATE,  errorFlag: true, errors: action.errors };
        case types.USER_REGISTERING:
            return { ...state, ...INITIAL_STATE };
        default:
            return state;
    }
};