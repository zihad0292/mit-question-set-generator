/**
 * Created by Rajesh on 6/15/19. Modified by Zihad Ul Islam Mahdi by 9/19/19
 */

const initialState = {
    dbConfigs   : [],
    token       : null,
    fetching    : false,
    fetched     : false,
    adding      : false,
    added       : false,
    error       : null,
    connecting  : false,
    connected   : false,
    updating    : false,
    updated     : false,
    deleting    : false,
    deleted     : false,
    message     : ''
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "SET_DB_CONFIG_TOKEN":
            return {
                ...state,
                token: action.payload
            };
        case "FETCHING_DB_CONFIG_LIST":
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null,
                message: '',
            };
        case "FETCHING_DB_CONFIG_FULFILLED":
            return {
                ...state,
                dbConfigs: action.payload,
                fetching: false,
                fetched: true,
                error: null
            };
        case "ADDING_NEW_DB_CONFIG":
            return {
                ...state,
                adding      : true,
                added       : false,
            };
        case "ADDING_DB_CONFIG_FULFILLED":
            return {
                ...state,
                adding      : false,
                added       : true,
                error       : null,
                message     : action.payload
            };
        case "DB_CONFIG_ERROR":
            return {
                ...state,
                fetching: false,
                fetched: false,
                adding : false,
                added  : false,
                connecting  : false,
                connected   : false,
                updating    : false,
                updated     : false,
                deleting    : false,
                deleted     : false,
                error: action.payload
            };
        case "REMOVE_DB_CONFIG_ERROR":
            return {
                ...state,
                error: null
            };
        case "CONNECTING_DB_CONFIG":
            return {
                ...state,
                connecting: true,
                connected: false
            };
        case "CONNECTING_DB_CONFIG_FULFILLED":
            return {
                ...state,
                connecting: false,
                connected : true,
                error     : null
            };
        case "UPDATING_DB_CONFIG":
            return {
                ...state,
                updating    : true,
                updated     : false,
            };
        case "UPDATING_DB_CONFIG_FULFILLED":
            return {
                ...state,
                updating    : false,
                updated     : true,
                error       : null,
                message     : action.payload
            };
        case "DELETING_DB_CONFIG":
            return {
                ...state,
                deleting    : true,
                deleted     : false
            };
        case "DELETING_DB_CONFIG_FULFILLED":
            return {
                ...state,
                deleting    : false,
                deleted     : true,
                message     : action.payload
            };
        case "CLEAR_DB_CONFIG_INFO":
            return initialState;
        default:
            return state
    }
}