import axios from "axios";

const baseUrl = "/api/subjects/";

export function fetchSubjectList() {
  return function(dispatch) {
    dispatch({ type: "FETCHING_SUBJECTS" });
    axios
      .get(`${baseUrl}list`)
      .then(resp => {
        const d = resp.data;
        if (d.success) {
          dispatch({
            type: "FETCHING_ALL_SUBJECTS_FULFILLED",
            payload: d.results
          });
        } else {
          dispatch({ type: "SUBJECT_ERROR", payload: d.message });
        }
      })
      .catch(err => {
        dispatch({ type: "SUBJECT_ERROR", payload: err });
      });
  };
}

export function addNewSubject(subject) {
  return function(dispatch) {
    dispatch({ type: "ADDING_NEW_SUBJECT" });

    axios
      .post(`${baseUrl}create?subject=${subject}`)
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "ADDING_NEW_SUBJECT_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({
            type: "SUBJECT_ERROR",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({ type: "SUBJECT_ERROR", payload: err });
      });
  };
}

export function deleteSubject(id) {
  return function(dispatch) {
    dispatch({ type: "DELETE_SUBJECT" });
    axios
      .delete(`${baseUrl}delete?id=${id}`)
      .then(resp => {
        const d = resp.data;
        if (d.success) {
          dispatch({
            type: "DELETE_SUBJECT_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({
            type: "SUBJECT_ERROR",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "SUBJECT_ERROR",
          payload: err.message
        });
      });
  };
}
