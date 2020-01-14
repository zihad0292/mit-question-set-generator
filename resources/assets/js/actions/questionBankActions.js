import axios from "axios";

const baseUrl = "/api/question-bank/";

export function fetchQuestions(subject) {
  if (subject === "english") {
    const ACTION_STRING = "FETCHING_ENGLISH_QUESTIONS_FULFILLED";
  } else if (subject === "math") {
    const ACTION_STRING = "FETCHING_MATH_QUESTIONS_FULFILLED";
  } else if (subject === "physics") {
    const ACTION_STRING = "FETCHING_PHYSICS_QUESTIONS_FULFILLED";
  } else if (subject === "chemistry") {
    const ACTION_STRING = "FETCHING_CHEMISTRY_QUESTIONS_FULFILLED";
  }

  return function(dispatch) {
    dispatch({ type: "FETCHING_QUESTIONS" });

    axios
      .get(`${baseUrl}list?subject=${subject}`)
      .then(resp => {
        const d = resp.data;
        if (d.success) {
          console.log("mairala");
          dispatch({
            type: ACTION_STRING,
            payload: d.results
          });
        } else {
          dispatch({ type: "QUESTION_ERROR", payload: d.message });
        }
      })
      .catch(err => {
        dispatch({ type: "QUESTION_ERROR", payload: err });
      });
  };
}

export function addNewQuestion(subject, question, options) {
  return function(dispatch) {
    dispatch({ type: "ADDING_NEW_QUESTION" });

    axios
      .post(
        `${baseUrl}create?subject=${subject}&question=${question}&options=${options}`
      )
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "ADDING_NEW_QUESTION_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({
            type: "QUESTION_ERROR",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({ type: "QUESTION_ERROR", payload: err });
      });
  };
}

export function editQuestion(id, data_type, enabled, hasCredentials) {
  return function(dispatch) {
    dispatch({ type: "UPDATING_FIELD_DATA_TYPE" });
    const updateUrl = `${baseUrl}update?id=${id}&d=${data_type}&e=${enabled}&h=${hasCredentials}`;
    axios
      .post(updateUrl)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "UPDATING_FIELD_DATA_TYPE_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({ type: "FIELD_DATA_TYPE_ERROR", payload: err });
        }
      })
      .catch(err => {
        dispatch({ type: "FIELD_DATA_TYPE_ERROR", payload: err });
      });
  };
}

export function deleteQuestion(id) {
  return function(dispatch) {
    console.log("Deleting question");
    // dispatch({ type: "DELETE_FIELD_DATA_TYPE" });

    // axios
    //   .delete(`${baseUrl}delete?id=${id}`)
    //   .then(resp => {
    //     const d = resp.data;

    //     if (d.success) {
    //       dispatch({
    //         type: "DELETE_FIELD_DATA_TYPE_FULFILLED",
    //         payload: d.message
    //       });
    //     } else {
    //       dispatch({
    //         type: "FETCHING_FIELD_DATA_TYPE_FAILED",
    //         payload: d.error
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     dispatch({
    //       type: "FETCHING_FIELD_DATA_TYPE_FAILED",
    //       payload: err.message
    //     });
    //   });
  };
}
