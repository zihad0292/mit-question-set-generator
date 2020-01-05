/**
 * Created by Rajesh on 7/19/19.
 */

const initialState = {
    dataTypes    : [],
    fetching    : false,
    fetched     : false,
    adding      : false,
    added       : false,
    updating    : false,
    updated     : false,
    deleting    : false,
    deleted     : false,
    error       : null,
    message     : '',
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case "FETCHING_FIELD_DATA_TYPE":
            return{
                ...state,
                fetching  : true,
                fetched   : false
            };
        case "FETCHING_FIELD_DATA_TYPE_FULFILLED":
            return{
                ...state,
                fetching  : false,
                fetched   : true,
                error     : null,
                dataTypes : action.payload,
                message     : '',
            };
        case "FIELD_DATA_TYPE_ERROR":
            return{
                ...state,
                fetching: false,
                fetched: false,
                error: action.payload
            };
        case "ADDING_NEW_FIELD_DATA_TYPE":
            return {
                ...state,
                adding: true,
                added: false
            };
        case "ADDING_NEW_FIELD_DATA_TYPE_FULFILLED":
            return {
                ...state,
                adding: false,
                added: true,
                message: action.payload
            };
        case "REMOVE_FIELD_DATA_TYPE_ERROR":
            return {
                ...state,
                fetching: false,
                fetched: false,
                adding : false,
                added  : false,
                error: null
            };
        case "UPDATING_FIELD_DATA_TYPE":
            return {
                ...state,
                updating    : true,
                updated     : false,
            };
        case "UPDATING_FIELD_DATA_TYPE_FULFILLED":
            return {
                ...state,
                updating    : false,
                updated     : true,
                error       : null,
                message: action.payload
            };
        case "FIELD_DATA_TYPE_ERROR":
            return {
                ...state,
                fetching    : false,
                fetched     : false,
                adding      : false,
                added       : false,
                updating    : false,
                updated     : false,
                deleting    : false,
                deleted     : false,
                error: action.payload
            };
        case "DELETE_FIELD_DATA_TYPE":
            return {
                ...state,
                deleting    : true,
                deleted     : false,
            };
        case "DELETE_FIELD_DATA_TYPE_FULFILLED":
            return {
                ...state,
                deleting    : false,
                deleted     : true,
                error       : null,
                message: action.payload
            };
        case "CLEAR_FIELD_DATA_TYPE_LIST":
            return initialState;
        default:
            return state
    }
}