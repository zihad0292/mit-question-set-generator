/**
 * Created by Rajesh on 6/15/19.
 */

import axios from 'axios';

const baseUrl = '/api/dbconfig/';

export function fetchDBConfigList(token=null) {
    return function (dispatch) {
        dispatch({type: "FETCHING_DB_CONFIG_LIST"});

        const fetchUrl = `${baseUrl}list${token ? '?token=' + token : ''}`;
        axios.get(fetchUrl)
            .then((response) =>{
                const d = response.data;

                dispatch({
                    type: "FETCHING_DB_CONFIG_FULFILLED",
                    payload: d.results
                })
            })
            .catch((err) => {
                dispatch({type: "DB_CONFIG_ERROR", payload: err});
            })
    }
}

export function addNewDBConfig(name, host, port, user, pass, dbName, token, enable, freq) {
    return function (dispatch) {
        dispatch({type: "ADDING_NEW_DB_CONFIG"});
        const createUrl = `${baseUrl}new?n=${name}&h=${host}&p=${port}&user=${user}&pass=${pass}&db=${dbName}&tkn=${token}&e=${enable}&f=${freq}`;
        axios.put(createUrl)
            .then((resp) => {
                const d = resp.data;

                if(d.success){
                    dispatch({type: "ADDING_DB_CONFIG_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "DB_CONFIG_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "DB_CONFIG_ERROR", payload: err});
            })
    }
}

export function updateDBConfig(id, name, host, port, user, pass, dbName, token, enable, freq) {
    return function (dispatch) {
        dispatch({type: "UPDATING_DB_CONFIG"});
        const updateUrl = `${baseUrl}update?id=${id}&n=${name}&h=${host}&p=${port}&user=${user}&pass=${pass}&db=${dbName}&tkn=${token}&e=${enable}&f=${freq}`;
        axios.post(updateUrl)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "UPDATING_DB_CONFIG_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "DB_CONFIG_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "DB_CONFIG_ERROR", payload: err});
            })
    }
}

export function deleteDBConfig(id) {
    return function (dispatch) {
        dispatch({type: "DELETING_DB_CONFIG"});
        axios.delete(`${baseUrl}delete?id=${id}`)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "DELETING_DB_CONFIG_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "DB_CONFIG_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "DB_CONFIG_ERROR", payload: err});
            })
    }
}

export function setDBConfigToken(token) {
    return function (dispatch) {
        dispatch({type: "SET_DB_CONFIG_TOKEN", payload: token});
    }
}

const connectionBase = '/api/connection/';

export function setDBConfigToSession(config, host, port, user, pass, dbName) {
    return function (dispatch) {
        const newConn = `${connectionBase}create?n=${config}&h=${host}&p=${port}&user=${user}&pass=${pass}&db=${dbName}`;
        dispatch({type: "CONNECTING_DB_CONFIG"});
        axios.post(newConn)
            .then((resp) => {
                dispatch({type: "CONNECTING_DB_CONFIG_FULFILLED"});
            })
            .catch((err) => {
                dispatch({type: "DB_CONFIG_ERROR", payload: err.message});
            })
    }
}

export function checkDbConfigConnection(host, port, user, pass, dbName) {
    return postResponseToAPI(`${connectionBase}check?host=${host}&port=${port}&user=${user}&pass=${pass}&db=${dbName}`);
}

function postResponseToAPI(url) {
    return axios.post(url)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            return err;
        });
}