import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    results: [],
    searchedTerm:''

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SEARCHED_USER:
            return { ...state, ...INITIAL_STATE, results: action.results, searchedTerm: action.term };
        default:
            return state;
    }
}