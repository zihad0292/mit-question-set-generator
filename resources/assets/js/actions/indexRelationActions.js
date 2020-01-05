/**
 * Created by Rajesh on 5/19/19.
 */

import axios from 'axios';

const baseUrl = '/api/tables/';

export function getAllTablesList() {
    return getResponseFromAPI(`${baseUrl}list`);
}

export function getAllColumns(tableName) {
    return getResponseFromAPI(`${baseUrl}columns?table=${tableName}`);
}

export function executeSqlQuery(query) {
    return getResponseFromAPI(`${baseUrl}query?query=${query}`);
}

function getResponseFromAPI(url) {
    return axios.get(url)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            return err;
        });
}

const indexBase = '/api/index/';

export function fetchIndexRelations(dbConfigID) {

    return function (dispatch) {
        dispatch({type: "SET_DB_CONFIG_ID", payload: dbConfigID});
        dispatch({type: "FETCHING_INDEX_LIST"});
        axios.get(`${indexBase}list?db=${dbConfigID}`)
            .then((response) =>{
                const d = response.data;
                if(d.success) {
                    dispatch({type: "REMOVE_INDEX_ERROR"});
                    dispatch({
                        type: "FETCHING_INDEX_LIST_FULFILLED",
                        payload: d.results
                    });
                }else{
                    dispatch({type: "INDEX_RELATION_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "INDEX_RELATION_ERROR", payload: err});
            });
    }    
}

export function addNewIndex(name, enabled, query, db, indexes) {

    return function (dispatch) {
        dispatch({type: "ADDING_NEW_INDEX"});
        const newIndex = `${indexBase}new?n=${name}&e=${enabled}&q=${query}&db=${db}&idx=${indexes}`;

        axios.put(newIndex)
            .then((resp) => {
                const d = resp.data;
                dispatch({type: "REMOVE_INDEX_ERROR"});

                if(d.success){
                    dispatch({type: "ADDING_NEW_INDEX_FULFILLED", payload: d.message});
                }else{
                    dispatch({type: "INDEX_RELATION_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "INDEX_RELATION_ERROR", payload: err});
            });
    }
}

export function findIndexById(id) {

    return function (dispatch) {
        dispatch({type: "FINDING_INDEX_BY_ID"});
        axios.get(`${indexBase}find?id=${id}`)
            .then((resp) => {
                const d = resp.data;
                dispatch({type: "REMOVE_INDEX_ERROR"});

                if(d.success){
                    dispatch({type: "INDEX_BY_ID_FOUND", payload: d.results})
                }else{
                    dispatch({type: "INDEX_RELATION_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "INDEX_RELATION_ERROR", payload: err});
            });
    }

}

export function updateIndexRelation(id, name, enabled, query, db, indexes) {
    return function (dispatch) {
        dispatch({type: "UPDATING_INDEX_RELATION"});
        const updateIndex = `${indexBase}update?id=${id}&n=${name}&e=${enabled}&q=${query}&db=${db}&idx=${indexes}`;

        axios.post(updateIndex)
            .then((resp) => {
                const d = resp.data;
                dispatch({type: "REMOVE_INDEX_ERROR"});

                if (d.success) {
                    dispatch({type: "UPDATING_INDEX_RELATION_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "INDEX_RELATION_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "INDEX_RELATION_ERROR", payload: err});
            });
    }
}

export function deleteIndexRelation(id) {
    return function (dispatch) {
        dispatch({type: "DELETING_INDEX_RELATION"});

        axios.delete(`${indexBase}delete?id=${id}`)
            .then((resp) => {
                const d = resp.data;

                if (d.success) {
                    dispatch({type: "DELETING_INDEX_RELATION_FULFILLED", payload: d.message});
                } else {
                    dispatch({type: "INDEX_RELATION_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "INDEX_RELATION_ERROR", payload: err});
            });
    }
}

export function clearIndexRelationMessage() {
    return function (dispatch) {
        dispatch({type: "CLEARED_INDEX_RELATION_MESSAGE"});
    }
}