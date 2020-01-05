/**
 * Created by Rajesh on 7/16/19.
 */

import axios from 'axios';

const baseUrl = '/api/index-search/';

export function setDbConfig(dbConfig) {
    return function (dispatch) {
        dispatch({type: "SET_INDEX_SEARCH_DB_CONFIG_ID", payload: dbConfig});
    }
}

export function setIndexRelation(indexRelation) {
    return function (dispatch) {
        dispatch({type: "SET_INDEX_SEARCH_INDEX_RELATION", payload: indexRelation});
    }
}

export function searchToApi(indexId, query) {
    return function (dispatch) {
        dispatch({type: "FETCHING_INDEX_SEARCH_RESULT"});

        axios.get(`${baseUrl}query?index=${indexId}&q=${query}`)
            .then((resp) => {
                const d = resp.data;

                dispatch({
                    type: "FETCHING_INDEX_SEARCH_RESULT_FULFILLED",
                    payload: {
                        total   : d.results.Num_of_doc,
                        results : d.results.search_result
                    }
                });
            })
            .catch((err) => {
                dispatch({type: "INDEX_SEARCH_ERROR", payload: err});
            })
    }
}

export function paramsToApi(indexId, paramObject) {
    return function (dispatch) {
        dispatch({type: "FETCHING_INDEX_SEARCH_RESULT"});

        axios.get(`${baseUrl}params?index=${indexId}&p=${JSON.stringify(paramObject)}`)
            .then((resp) => {
                const d = resp.data;

                dispatch({
                    type: "FETCHING_INDEX_SEARCH_RESULT_FULFILLED",
                    payload: {
                        total   : d.results.Num_of_doc,
                        results : d.results.search_result
                    }
                });
            })
            .catch((err) => {
                dispatch({type: "INDEX_SEARCH_ERROR", payload: err});
            })
    }
}
