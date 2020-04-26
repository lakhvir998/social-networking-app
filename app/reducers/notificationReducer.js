import * as types from '../actions/types';

const INITIAL_STATE = {
    errors: [],
    errorFlag: false,
    notifications: [],
    count: 0


};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.NOTIFICATIONS_FETCHED:
            return { ...state,  notifications: action.notifications };
        case types.NOTIFICATION_COUNT_FETCHED:
            return { ...state,  count: action.count };
        default:
            return state;
    }
}