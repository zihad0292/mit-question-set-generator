import axios from "axios";

const baseUrl = "/api/stats/";

export function retrieveStats() {
  return function(dispatch) {
    console.log("Trying to retrieve stats from the actions");
    dispatch({ type: "TEST_FETCHING_FULFILLED" });

    // axios
    //   .get(`${indexBase}list?db=${dbConfigID}`)
    //   .then(response => {
    //     const d = response.data;
    //     if (d.success) {
    //       dispatch({ type: "REMOVE_INDEX_ERROR" });
    //       dispatch({
    //         type: "FETCHING_INDEX_LIST_FULFILLED",
    //         payload: d.results
    //       });
    //     } else {
    //       dispatch({ type: "INDEX_RELATION_ERROR", payload: d.error });
    //     }
    //   })
    //   .catch(err => {
    //     dispatch({ type: "INDEX_RELATION_ERROR", payload: err });
    //   });
  };
}

export function clearstats() {
  //   return function(dispatch) {
  //     dispatch({ type: "CLEARED_STATS" });
  //   };
}
