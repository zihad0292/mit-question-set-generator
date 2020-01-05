/**
 * Created by Rajesh on 6/16/19.
 */

const initialState = {
    dbConfig    : null,
    indexRelations: [],
    selected    : null,
    fetching    : false,
    fetched     : false,
    adding      : false,
    added       : false,
    finding     : false,
    found       : false,
    updating    : false,
    updated     : false,
    error       : null,
    deleting    : false,
    deleted     : false,
    message     : '',
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case "SET_DB_CONFIG_ID":
            return {
                ...state,
                dbConfig: action.payload,
                indexRelations: [],
                fetched: false,
            };
        case "FETCHING_INDEX_LIST":
            return {
                ...state,
                fetching: true,
                fetched: false,
            };
        case "FETCHING_INDEX_LIST_FULFILLED":
            return {
                ...state,
                indexRelations: action.payload,
                fetching: false,
                fetched: true,
                message: ''
            };
        case "ADDING_NEW_INDEX":
            return {
                ...state,
                adding: true,
                added: false
            };
        case "ADDING_NEW_INDEX_FULFILLED":
            return {
                ...state,
                adding: false,
                added: true,
                message: action.payload
            };
        case "FINDING_INDEX_BY_ID":
            return{
                ...state,
                finding : true,
                found   : false,
                selected: null
            };
        case "INDEX_BY_ID_FOUND":
            return{
                ...state,
                finding : false,
                found   : true,
                selected: action.payload
            };
        case "UPDATING_INDEX_RELATION":
            return {
                ...state,
                updating: true,
                updated: false
            };
        case "UPDATING_INDEX_RELATION_FULFILLED":
            return {
                ...state,
                updating: false,
                updated: true,
                message: action.payload
            };
        case "INDEX_RELATION_ERROR":
            return {
                ...state,
                fetching: false,
                fetched: false,
                adding : false,
                added  : false,
                finding: false,
                found  : false,
                updating: false,
                updated : false,
                deleting    : false,
                deleted     : false,
                error: action.payload
            };
        case "REMOVE_INDEX_ERROR":
            return {
                ...state,
                error: null
            };
        case "DELETING_INDEX_RELATION":
            return {
                ...state,
                deleting    : true,
                deleted     : false,
            };
        case "DELETING_INDEX_RELATION_FULFILLED":
            return {
                ...state,
                deleting    : false,
                deleted     : true,
                error       : null,
                message     : action.payload
            };
        case "CLEARED_INDEX_RELATION_MESSAGE":
            return {
                ...state,
                message     : ''
            };
        case "CLEAR_INDEX_RELATION_INFO":
            return initialState;
        default:
            return state;
    }
}
