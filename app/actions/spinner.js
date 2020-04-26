import * as types from './types';

export const spinner = (yes = true) => {
    return {
        type: types.SET_LOADING,
        payload: yes
    }
};