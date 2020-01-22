import axios from "axios";

const baseUrl = "/api/question-set/";

export function fetchQuestionSets() {
  return function(dispatch) {
    console.log("Fetching question sets");
    // dispatch({ type: "FETCHING_OFFICE_LIST" });
    // const fetchURL = office ? `${baseUrl}list?oid=${office}` : `${baseUrl}list`;
    // axios
    //   .get(fetchURL)
    //   .then(response => {
    //     const d = response.data;
    //     dispatch({ type: "REMOVE_OFFICE_LIST_ERROR" });
    //     dispatch({
    //       type: "FETCHING_OFFICE_LIST_FULFILLED",
    //       payload: d
    //     });
    //   })
    //   .catch(err => {
    //     dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err });
    //   });
  };
}

export function generateQuestionSet(name, location) {
  console.log("Generating new question set");
  // return function(dispatch) {
  //   dispatch({ type: "ADDING_NEW_OFFICE" });

  //   axios
  //     .post(`${baseUrl}new?n=${name}&l=${location}`)
  //     .then(response => {
  //       const d = response.data;

  //       if (d.success) {
  //         dispatch({ type: "ADDING_NEW_OFFICE_FULFILLED", payload: d.message });
  //       } else {
  //         dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: d.error });
  //       }
  //     })
  //     .catch(err => {
  //       dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err });
  //     });
  // };
}

export function deleteQuestionSet(id) {
  return function(dispatch) {
    console.log("Delete question set");
    // dispatch({ type: "DELETE_OFFICE_INFO" });

    // axios
    //   .delete(`${baseUrl}delete?id=${id}`)
    //   .then(resp => {
    //     const d = resp.data;

    //     if (d.success) {
    //       dispatch(fetchDBConfigList());
    //       dispatch(fetchUserList());
    //       dispatch({
    //         type: "DELETE_OFFICE_INFO_FULFILLED",
    //         payload: d.message
    //       });
    //     } else {
    //       dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: d.error });
    //     }
    //   })
    //   .catch(err => {
    //     dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err.message });
    //   });
  };
}
