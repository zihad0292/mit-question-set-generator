/**
 * Created by Zihad Ul Islam Mahdi on 9/3/19. Modified on 9/15/19
 */

import axios from 'axios';

const baseUrl = '/api/credentials/';

export function fetchCredentials() {
    return function (dispatch) {
        dispatch({type: "FETCHING_CREDENTIAL_LIST"});
        let fetchUrl = `${baseUrl}list`;  
        axios.get(fetchUrl)
            .then((response) =>{
                const d = response.data;
                dispatch({
                    type: "FETCHING_CREDENTIAL_FULFILLED",
                    payload: d.results
                })
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function fetchCredentialsByType(type) {
    return function (dispatch) {
        dispatch({type: "FETCHING_CREDENTIAL_LIST"});
        let fetchUrl = '';
        if(type){
            fetchUrl = `${baseUrl}list?type=${type}`;
        } else{
            fetchUrl = `${baseUrl}list`;           
        }       

        axios.get(fetchUrl)
            .then((response) =>{
                const d = response.data;

                dispatch({
                    type: "FETCHING_TEMP_CREDENTIAL_FULFILLED",
                    payload: d.results
                })
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function addNewCredential(form, name, selectedDataType, server, port, user, pass, enable, sftpKey, sftpFileName, homedirectory=null) {
    return function (dispatch) {
        dispatch({type: "ADDING_NEW_CREDENTIAL"});
        let createUrl = '';
        if(form === 'ftp'){
            createUrl = `${baseUrl}new?name=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&server=${server}&port=${port}&user=${user}&pass=${pass}&enable=${enable}&homeDirectory=${homeDirectory}&type=ftp`;
        }else{
            createUrl = `${baseUrl}new?name=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&server=${server}&port=${port}&user=${user}&enable=${enable}&sftpKey=${sftpKey}&sftpFileName=${sftpFileName}&homeDirectory=${homeDirectory}`;
        }
        axios.put(createUrl)
            .then((resp) => {
                const d = resp.data;

                if(d.success){
                    dispatch({type: "ADDING_CREDENTIAL_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function updateCredential(id, form, name, selectedDataType, server, port, user, pass, enable, sftpKey, sftpFileName, homedirectory=null) {
    return function (dispatch) {
        dispatch({type: "UPDATING_CREDENTIAL"});
        let updateUrl = '';
        if(form === 'ftp'){
            updateUrl = `${baseUrl}update?id=${id}&name=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&server=${server}&port=${port}&user=${user}&pass=${pass}&enable=${enable}&homeDirectory=${homeDirectory}&type=ftp`;
        }else{
            updateUrl = `${baseUrl}update?id=${id}&name=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&server=${server}&port=${port}&user=${user}&pass=${pass}&enable=${enable}&sftpKey=${sftpKey}&sftpFileName=${sftpFileName}&homeDirectory=${homeDirectory}`;
        }

        axios.post(updateUrl)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "UPDATING_CREDENTIAL_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function deleteCredential(id) {
    return function (dispatch) {
        dispatch({type: "DELETING_CREDENTIAL"});
        axios.delete(`${baseUrl}delete?id=${id}`)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "DELETING_CREDENTIAL_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}


export function fetchEncryptions() {
    return function (dispatch) {
        dispatch({type: "FETCHING_CREDENTIAL_LIST"});

        const fetchUrl = `${baseUrl}list?type=encryption`;
        axios.get(fetchUrl)
            .then((response) =>{
                const d = response.data;
                dispatch({
                    type: "FETCHING_ENCRYPTIONS_FULFILLED",
                    payload: d.results
                })
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function addNewEncryption(name, selectedDataType, enable) {
    return function (dispatch) {
        dispatch({type: "ADDING_NEW_CREDENTIAL"});

        let createUrl = `${baseUrl}new?n=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&e=${enable}&type=encryption`;

        axios.put(createUrl)
            .then((resp) => {
                const d = resp.data;

                if(d.success){
                    dispatch({type: "ADDING_CREDENTIAL_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function updateEncryption(id, name, selectedDataType, enable) {
    return function (dispatch) {
        dispatch({type: "UPDATING_CREDENTIAL"});
        let updateUrl = `${baseUrl}update?id=${id}&n=${name}&selectedDataType=${selectedDataType.label}&selectedDataTypeId=${selectedDataType.value}&e=${enable}&type=encryption`;

        axios.post(updateUrl)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "UPDATING_CREDENTIAL_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}

export function deleteEncryption(id) {
    return function (dispatch) {
        dispatch({type: "DELETING_CREDENTIAL"});
        axios.delete(`${baseUrl}delete?id=${id}`)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "DELETING_CREDENTIAL_FULFILLED"});
                } else {
                    dispatch({type: "CREDENTIAL_ERROR", payload: err});
                }
            })
            .catch((err) => {
                dispatch({type: "CREDENTIAL_ERROR", payload: err});
            })
    }
}


