import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import * as types from '../actions/types';

// Start with two routes: The Main screen, with the Login screen on top.
const initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init(), null);

export default navReducer = (state = initialNavState, action) => {
    let nextState;
    switch (action.type) {
        case types.USER_LOGGED_IN:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'SignedIn' }),
                state
            );
            break;
        case types.USER_LOGGED_OUT:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'SignedOut' }),
                state
            );
            break;
        case  types.USER_REGISTER:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'Register', params: { token: action.token }}),
                state
            );
            break;
        case  types.USER_REGISTERED:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'SignedIn' }),
                state
            );
            break;
        case  types.FRIEND_PROFILE:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'FriendProfile', params: { profile_id: action.profile_id }}),
                state
            );
            break;
        case  types.SCAN_QR:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'ScanQR' }),
                state
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};