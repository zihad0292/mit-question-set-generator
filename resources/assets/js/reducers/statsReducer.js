/**
 * Created by Rajesh on 7/2/19.
 */

const initialState = {
    dbConfigs    : [],
    indexStats   : {},
    fetching    : false,
    fetched     : false,
    error       : null,
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "FETCHING_STATS":
            return {
                ...state,
                fetching    : true,
                fetched     : false,
            };
        case "FETCHING_STATS_FULFILLED":
            return {
                ...state,
                indexStats: action.payload,
                fetching  : false,
                fetched   : true,
                error     : null,
            };
        case "FETCHING_STATS_ERROR":
            return {
                ...state,
                fetching    : false,
                fetched     : false,
                error       : action.payload,
            };
        case "CLEAR_STATS":
            return initialState;
        default:
            return state;
    }
}