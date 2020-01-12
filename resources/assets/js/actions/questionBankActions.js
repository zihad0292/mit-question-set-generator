import axios from "axios";

const baseUrl = "/api/question-bank/";

export function fetchQuestions(subject) {
  return function(dispatch) {
    console.log("Fetching all questions");
    dispatch({ type: "FETCHING_ALL_QUESTIONS_FULFILLED", payload: ["a", "b"] });
    //   dispatch({ type: "FETCHING_FIELD_DATA_TYPE" });

    //   axios
    //     .get(`${baseUrl}list`)
    //     .then(resp => {
    //       const d = resp.data;
    //       if (d.success) {
    //         dispatch({
    //           type: "FETCHING_FIELD_DATA_TYPE_FULFILLED",
    //           payload: d.results
    //         });
    //       } else {
    //         dispatch({ type: "FIELD_DATA_TYPE_ERROR", payload: d.message });
    //       }
    //     })
    //     .catch(err => {
    //       dispatch({ type: "FIELD_DATA_TYPE_ERROR", payload: err });
    //     });
  };
}

export function addNewDataType(data_type, enabled, hasCredentials) {
  return function(dispatch) {
    dispatch({ type: "ADDING_NEW_FIELD_DATA_TYPE" });

    axios
      .post(`${baseUrl}new?d=${data_type}&e=${enabled}&h=${hasCredentials}`)
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "ADDING_NEW_FIELD_DATA_TYPE_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({
            type: "FETCHING_FIELD_DATA_TYPE_FAILED",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_FIELD_DATA_TYPE_FAILED", payload: err });
      });
  };
}

export function updateDataType(id, data_type, enabled, hasCredentials) {
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
