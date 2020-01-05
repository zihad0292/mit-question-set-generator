/**
 * Created by Rajesh on 5/28/19.
 */

import axios from 'axios';

const baseUrl = '/api/login/';

export function submitLoginInfo(user, pass) {

    return function(dispatch){
        dispatch({type: "AUTHENTICATING_USER"});
        axios.get(`${baseUrl}?u=${user}&p=${pass}`)
            .then((response) => {
                const d = response.data;
                if(d.success) {
                    dispatch({type: "REMOVE_USER_ERROR"});
                    dispatch({
                        type: "AUTHENTICATING_USER_FULFILLED",
                        payload: {
                            user: d.data.user,
                            type: d.data.type,
                            userKey : d.data.key,
                            isLoggedIn: d.data.isLoggedIn,
                            office      : d.data.office,
                            office_id   : d.data.office_id,
                            message: d.message,
                        }
                    });
                }else{
                    dispatch({type: "AUTHENTICATING_USER_FAILED", payload: d.message});
                }
            })
            .catch((err) => {
                dispatch({type: "AUTHENTICATING_USER_FAILED", payload: err});
            })
    }
}

export function fetchIndexRelationCount(dbConfigList) {
    return function (dispatch) {
        const listStr = dbConfigList.join(',');
        axios.get(`/api/index/count?dblist=${listStr}`)
            .then((response) => {
                const d = response.data;
                dispatch({type: "FETCHING_USER_INDEX_COUNT_FULFILLED", payload: d.total_index});
            })
    }
}

export function retrieveSessionInfo() {
    return function (dispatch) {
        dispatch({type: "RETRIEVING_USER_INFO"});
        axios.get(`${baseUrl}session`)
            .then((response) => {
                const d = response.data;
                if(d.success) {
                    dispatch({
                        type: "AUTHENTICATING_USER_FULFILLED",
                        payload: {
                            user: d.data.user,
                            type: d.data.type,
                            userKey : d.data.key,
                            isLoggedIn: d.data.isLoggedIn,
                            office      : d.data.office,
                            office_id   : d.data.office_id,
                            message: d.message,
                        }
                    });
                }else{
                    dispatch({type: "AUTHENTICATING_USER_FAILED", payload: d.message});
                }
            })
            .catch((err) => {
                dispatch({type: "AUTHENTICATING_USER_FAILED", payload: err});
            })
    }
}

export function logOutUser() {
    return function (dispatch) {
        dispatch({type: "LOGGING_OUT_USER"});
        axios.get(`${baseUrl}logout`)
            .then((response) => {
                const d = response.data;
                if(d.success){
                    dispatch({type: "CLEAR_OFFICE_LIST"});
                    dispatch({type: "CLEAR_DB_CONFIG_INFO"});
                    dispatch({type: "CLEAR_INDEX_RELATION_INFO"});
                    dispatch({type: "CLEAR_STATS"});
                    dispatch({type: "CLEAR_CRAWLER_STATS"});
                    dispatch({type: "USER_LOGGED_OUT"});
                }else{
                    dispatch({type: "AUTHENTICATING_USER_FAILED", payload: d});
                }
            })
            .catch((err) => {
                dispatch({type: "AUTHENTICATING_USER_FAILED", payload: err});
            })
    }

}
