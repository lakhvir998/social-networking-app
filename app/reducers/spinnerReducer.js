import * as types from '../actions/types';

const INITIAL_STATE = {
    show: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SET_LOADING:
            return { ...state, ...INITIAL_STATE, show: action.payload  };
        default:
            return state;
    }
};