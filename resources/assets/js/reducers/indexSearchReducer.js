/**
 * Created by talha on 7/16/19.
 */

const initialState = {
    dbConfig    : null,
    indexRelation: null,
    fetching    : false,
    fetched     : false,
    results     : {},
    total       : 0,
    error       : null
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case "SET_INDEX_SEARCH_DB_CONFIG_ID":
            return {
                ...state,
                dbConfig: action.payload,
                indexRelation: null
            };
        case "SET_INDEX_SEARCH_INDEX_RELATION":
            return {
                ...state,
                indexRelation: action.payload,
                fetched      : false,
                results      : {},
                total        : 0,
            };
        case "FETCHING_INDEX_SEARCH_RESULT":
            return{
                ...state,
                fetching    : true,
                fetched     : false,
                results     : {}
            };
        case "FETCHING_INDEX_SEARCH_RESULT_FULFILLED":
            return{
                ...state,
                fetching    : false,
                fetched     : true,
                total       : action.payload.total,
                results     : action.payload.results,
                error       : null
            };
        case "INDEX_SEARCH_ERROR":
            return{
                ...state,
                fetching: false,
                fetched: false,
                error: action.payload
            };
        default:
            return state;
    }
}
