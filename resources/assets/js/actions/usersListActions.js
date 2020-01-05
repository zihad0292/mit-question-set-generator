/**
 * Created by Rajesh on 6/18/19. Modified by Zihad Ul Islam Mahdi on 9/2/19. Added param oid to fetchuserList
 */

import axios from 'axios';

const baseUrl = '/api/user/';

export function fetchUserList(oid=null) {
    return function (dispatch) {
        dispatch({type: "FETCHING_USER_LIST"});
        const fetchURL = oid ? `${baseUrl}list?oid=${oid}` : `${baseUrl}list`;
        axios.get(fetchURL)
            .then((response) =>{
                const d = response.data;
                dispatch({type: "REMOVE_USER_LIST_ERROR"});
                dispatch({
                    type: "FETCHING_USER_LIST_FULFILLED",
                    payload: d.results
                })
            })
            .catch((err) => {
                dispatch({type: "FETCHING_USER_LIST_FAILED", payload: err});
            })
    };
}


export function addNewUser(email, pass, type, officeName, officeId) {
    return function (dispatch) {
        dispatch({type: "ADDING_NEW_USER"});

        axios.put(`${baseUrl}new?m=${email}&p=${pass}&t=${type}&oid=${officeId}&oname=${officeName}`)
            .then((response) => {
                const d = response.data;

                dispatch({type: "REMOVE_USER_LIST_ERROR"});
                if(d.success){
                    dispatch({type: "ADDING_NEW_USER_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "FETCHING_USER_LIST_FAILED", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "FETCHING_USER_LIST_FAILED", payload: err});
            });
    };
}


export function deleteUserInfo(id) {
    return function (dispatch) {
        dispatch({type: "DELETING_USER_INFO"});

        axios.delete(`${baseUrl}delete?id=${id}`)
            .then((resp) => {
                const d = resp.data;

                if(d.success){
                    dispatch({type: "DELETING_USER_INFO_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "FETCHING_USER_LIST_FAILED", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "FETCHING_USER_LIST_FAILED", payload: err.message});
            })
    }
}
