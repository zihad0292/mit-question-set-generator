/**
 * Created by Rajesh on 7/3/19.
 */

import axios from 'axios';

const baseUrl = '/api/stats/crawler/';

export function fetchCrawlerStats(dbConfigID, offset=0) {
    return function (dispatch) {
        dispatch({type: "SET_CRAWLER_STATS_DB_CONFIG", payload: dbConfigID});
        dispatch({type: "FETCHING_CRAWLER_STATS"});

        axios.get(`${baseUrl}list?db=${dbConfigID}&offset=${offset}`)
            .then((response) => {
                const d = response.data;
                if(d.success) {
                    dispatch({
                        type: "FETCHING_CRAWLER_STATS_FULFILLED",
                        payload:  {
                            stats: d.results,
                            total: d.total
                        }
                    });
                }else{
                    dispatch({type: "FETCHING_CRAWLER_STATS_ERROR", payload: d.error});
                }
            })
            .catch((err) => {
                dispatch({type: "FETCHING_CRAWLER_STATS_ERROR", payload: err});
            })
    }
}

