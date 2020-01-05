/**
 * Created by Rajesh on 5/28/19.
 */

const initialState = {
    user        : null,
    type        : null,
    userKey     : null,
    totalIndex  : 0,
    isLoggedIn  : false,
    office      : null,
    office_id   : null,
    message     : null,
    fetching    : false,
    fetched     : false,
    error       : null
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "AUTHENTICATING_USER":
            return{
                ...state,
                fetching: true,
                fetched: false,
                message: null
            };

        case "REMOVE_USER_ERROR":
            return {
                ...state,
                fetching: false,
                fetched : false,
                message : null,
                error   : null,
            };
        case "AUTHENTICATING_USER_FULFILLED":
            return {
                ...state,
                user        : action.payload.user,
                type        : action.payload.type,
                userKey     : action.payload.userKey,
                isLoggedIn  : action.payload.isLoggedIn,
                office      : action.payload.office,
                office_id   : action.payload.office_id,
                message     : action.payload.message,
                fetching    : false,
                fetched     : true
            };
        case "AUTHENTICATING_USER_FAILED":
            console.log(action.payload)
            return {
                ...state,
                fetching: false,
                fetched : true,
                message : action.payload,
                error   : action.payload,
            };
        case "RETRIEVING_USER_INFO":
            return {
                ...state,
                fetching: true,
                fetched: false
            };
        case "FETCHING_USER_INDEX_COUNT_FULFILLED":
            return {
                ...state,
                totalIndex: action.payload
            };
        case "LOGGING_OUT_USER":
            return{
                ...state,
                fetching: true,
                fetched: false,
                message: null
            };
        case "USER_LOGGED_OUT":
            return initialState;

        default:
            return state;
    }
}
