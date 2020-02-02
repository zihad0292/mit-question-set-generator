import axios from "axios";

const baseUrl = "/api/question-bank/";

export function retrieveStats() {
  return function(dispatch) {
    dispatch({ type: "FETCHING_QUESTIONS_COUNT" });

    console.log("statFetsrfswrfdsfched");
    axios
      .get(`${baseUrl}stats`)
      .then(response => {
        const d = response.data;
        if (d.success) {
          console.log("000");
          dispatch({
            type: "FETCHING_ALL_QUESTIONS_COUNT_FULFILLED",
            payload: d.results
          });
        } else {
          dispatch({ type: "QUESTION_COUNT_ERROR", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({ type: "QUESTION_COUNT_ERROR", payload: err });
      });
  };
}

export function clearstats() {
  //   return function(dispatch) {
  //     dispatch({ type: "CLEARED_STATS" });
  //   };
}
