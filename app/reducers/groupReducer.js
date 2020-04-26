import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    groups: [],
    group_members: []

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.GROUPS_FETCHED:
            return { ...state, ...INITIAL_STATE, groups: action.groups };
        case types.GROUP_MEMBERS_FETCHED:
            return { ...state,  group_members: action.group_members };
        default:
            return state;
    }
}