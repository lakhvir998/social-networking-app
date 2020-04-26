import * as AuthActions from './auth';
import * as UserActions from './users';
import * as PlatformActions from './platform';
import * as UserPlatformActions from './userPlatforms';
import * as GroupActions from './group';
import * as FriendActions from './friend';
import * as NotificationActions from './notification';
import * as RequestActions from './request';

export const ActionCreators = Object.assign({},
    AuthActions,
    UserActions,
    PlatformActions,
    UserPlatformActions,
    GroupActions,
    FriendActions,
    NotificationActions,
    RequestActions

);