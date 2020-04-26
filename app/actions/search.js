import Api from '../lib/api';
import * as types from "./types";

export const search = (text, token) => dispatch => {
    Api.post(`/users/search?authorization_token=${token}`, { user: {  term: text } })
        .then(resp => {
            if(resp.status) {
                dispatch({ type: types.SEARCHED_USER, results: resp.users, term: text })
            }
        })
};