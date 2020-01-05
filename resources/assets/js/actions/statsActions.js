/**
 * Created by Rajesh on 7/2/19.
 */

import axios from 'axios';

const baseUrl = '/api/stats/index/';

export function fetchIndexStats(key=null) {
    return function (dispatch) {
        dispatch({type: "FETCHING_STATS"});
        const fetchURL = `${baseUrl}list?key=${key}`;
        axios.get(fetchURL)
            .then((response) => {
                const d = response.data;
                if(d.success) {
                    dispatch({
                        type: "FETCHING_STATS_FULFILLED",
                        payload: d.results
                    });
                }else{
                    dispatch({type: "FETCHING_STATS_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "FETCHING_STATS_ERROR", payload: err});
            })
    }
}
