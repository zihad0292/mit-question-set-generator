/**
 * Created by Rajesh on 8/1/19.
 */

const initialState = {
    dbConfig    : null,
    crawlerStats : [],
    total        : 0,
    currentPage  : 0,
    fetching    : false,
    fetched     : false,
    error       : null,
};

export default function reducer(state=initialState, action) {
    switch (action.type){
        case "SET_CRAWLER_STATS_DB_CONFIG":
            return {
                ...state,
                dbConfig: action.payload
            };
        case "FETCHING_CRAWLER_STATS":
            return {
                ...state,
                fetching    : true,
                fetched     : false,
            };
        case "FETCHING_CRAWLER_STATS_FULFILLED":
            return {
                ...state,
                fetching    : false,
                fetched     : true,
                crawlerStats: action.payload.stats,
                total       : action.payload.total,
            };
        case "FETCHING_CRAWLER_STATS_ERROR":
            return {
                ...state,
                fetching    : false,
                fetched     : false,
                error       : action.payload,
            };
        case "CLEAR_CRAWLER_STATS":
            return initialState;
        default:
            return state;
    }
}


