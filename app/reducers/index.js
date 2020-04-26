import { combineReducers } from 'redux';
import navReducer from './navReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import loadingReducer from './spinnerReducer';
import searchReducer from "./searchReducer";
import platformReducer from "./platformReducer";
import userPlatformReducer from "./userPlatformReducer";
import groupReducer from "./groupReducer";
import friendReducer from "./friendReducer";
import notificationReducer from "./notificationReducer";
import requestReducer from "./requestReducer";

const AppReducer = combineReducers({
    nav: navReducer,
    auth: authReducer,
    user: userReducer,
    spinner: loadingReducer,
    search: searchReducer,
    platform: platformReducer,
    user_platform: userPlatformReducer,
    group: groupReducer,
    friend: friendReducer,
    notification: notificationReducer,
    request: requestReducer

});

export default AppReducer;