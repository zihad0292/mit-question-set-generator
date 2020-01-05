/**
 * Created by Rajesh on 6/18/19.
 */

const initialState = {
    users       : [],
    fetching    : false,
    fetched     : false,
    adding      : false,
    added       : false,
    updating    : false,
    updated     : false,
    deleting    : false,
    deleted     : false,
    error       : null,
    message     : ''
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "FETCHING_USER_LIST":
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };
        case "FETCHING_USER_LIST_FULFILLED":
            return {
                ...state,
                users: action.payload,
                fetching: false,
                fetched: true,
                message: '',
            };
        case "FETCHING_USER_LIST_FAILED":
            return {
                ...state,
                fetching: false,
                fetched: true,
                adding : false,
                added  : false,
                deleting : false,
                deleted : false,
                error: action.payload
            };
        case "ADDING_NEW_USER":
            return {
                ...state,
                adding: true,
                added: false
            };
        case "ADDING_NEW_USER_FULFILLED":
            return {
                ...state,
                adding: false,
                added: true,
                message: action.payload
            };
        case "REMOVE_USER_LIST_ERROR":
            return {
                ...state,
                fetching: false,
                fetched: false,
                adding : false,
                added  : false,
                error: null
            };
        case "DELETING_USER_INFO":
            return {
                ...state,
                deleting: true,
                deleted: false
            };
        case "DELETING_USER_INFO_FULFILLED":
            return {
                ...state,
                deleting: false,
                deleted: true,
                error: null,
                message: action.payload
            };
        default:
            return state
    }
}
