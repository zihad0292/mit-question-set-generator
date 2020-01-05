/**
 * Created by Zihad Ul Islam Mahdi on 9/4/19. Modified on 9/15/19
 */

const initialState = {
    credentials : [],
    tempCredentials : [],
    encryptions : [],
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
    message     : '',
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "FETCHING_CREDENTIAL_LIST":
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };
        case "FETCHING_ENCRYPTIONS_FULFILLED":
            return {
                ...state,
                encryptions: action.payload,
                fetching: false,
                fetched: true,
                error: null
            };
        case "FETCHING_CREDENTIAL_FULFILLED":
            return {
                ...state,
                credentials: action.payload,
                fetching: false,
                fetched: true,
                error: null,
                message: ''
            };
        case "FETCHING_TEMP_CREDENTIAL_FULFILLED":
            return {
                ...state,
                tempCredentials: action.payload,
                fetching: false,
                fetched: true,
                error: null
            };
        case "ADDING_NEW_CREDENTIAL":
            return {
                ...state,
                adding      : true,
                added       : false,
            };
        case "ADDING_CREDENTIAL_FULFILLED":
            return {
                ...state,
                adding      : false,
                added       : true,
                error       : null,
                message     : action.payload
            };
        case "CREDENTIAL_ERROR":
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
        case "REMOVE_CREDENTIAL_ERROR":
            return {
                ...state,
                error: null
            };
        case "UPDATING_CREDENTIAL":
            return {
                ...state,
                updating    : true,
                updated     : false,
            };
        case "UPDATING_CREDENTIAL_FULFILLED":
            return {
                ...state,
                updating    : false,
                updated     : true,
                error       : null,
                message     : action.payload
            };
        case "DELETING_CREDENTIAL":
            return {
                ...state,
                deleting    : true,
                deleted     : false
            };
        case "DELETING_CREDENTIAL_FULFILLED":
            return {
                ...state,
                deleting    : false,
                deleted     : true,
                message     : action.payload
            };
        case "CLEAR_CREDENTIAL_INFO":
            return initialState;
        default:
            return state
    }
}