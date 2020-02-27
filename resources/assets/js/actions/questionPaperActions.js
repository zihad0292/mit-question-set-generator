import axios from "axios";

const baseUrl = "/api/base-question/";

export function fetchQuestionPaper(allQuestions) {
  return function(dispatch) {
    dispatch({ type: "FETCHING_QUESTION_PAPER" });
    axios
      .get(
        `${baseUrl}baseQuestion?allQuestions=${JSON.stringify(allQuestions)}`
      )
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "FETCHING_QUESTION_PAPER_FULFILLED",
            payload: d
          });
        } else {
          dispatch({
            type: "QUESTION_PAPER_ERROR",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "QUESTION_PAPER_ERROR",
          payload: err.message
        });
      });
  };
}
