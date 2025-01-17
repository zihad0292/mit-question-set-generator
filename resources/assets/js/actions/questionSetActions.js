import axios from "axios";
import { fetchQuestions } from "./questionBankActions";
import { retrieveStats } from "./statsActions";

const baseUrl = "/api/question-set/";

export function fetchQuestionSets() {
  return function(dispatch) {
    dispatch({ type: "FETCHING_QUESTION_SETS" });
    const fetchURL = `${baseUrl}list`;
    axios
      .get(fetchURL)
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({ type: "REMOVE_QUESTION_SETS_ERROR" });
          dispatch({
            type: "FETCHING_QUESTION_SETS_FULFILLED",
            payload: d
          });
        } else {
          dispatch({ type: "QUESTION_SET_ERROR", payload: d.message });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_QUESTION_SETS_FAILED", payload: err });
      });
  };
}

export function generateQuestionSet(questionSetName, questionSet) {
  return function(dispatch) {
    dispatch({ type: "GENERATING_QUESTION_SET" });

    axios
      .post(
        `${baseUrl}generate?questionSetName=${questionSetName}&questionSet=${questionSet}`
      )
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "GENERATING_QUESTION_SET_FULFILLED",
            payload: d.message
          });
          dispatch(fetchQuestionSets());
          dispatch(retrieveStats());
        } else {
          dispatch({ type: "FETCHING_QUESTION_SETS_FAILED", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_QUESTION_SETS_FAILED", payload: err });
      });
  };
}

export function fetchQuestionSet(id) {
  return function(dispatch) {
    console.log("Fetch question set");
    dispatch({ type: "FETCHING_QUESTION_SETS" });

    axios
      .get(`${baseUrl}questionset?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "FETCH_SINGLE_QUESTION_SET_FULFILLED",
            payload: d
          });
        } else {
          dispatch({ type: "FETCHING_QUESTION_SETS_FAILED", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({
          type: "FETCHING_QUESTION_SETS_FAILED",
          payload: err.message
        });
      });
  };
}
export function deleteQuestionSet(id) {
  return function(dispatch) {
    dispatch({ type: "DELETE_QUESTION_SET" });

    axios
      .delete(`${baseUrl}delete?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "DELETE_QUESTION_SET_FULFILLED",
            payload: d.message
          });
          dispatch(fetchQuestionSets());
          dispatch(retrieveStats());
        } else {
          dispatch({ type: "FETCHING_QUESTION_SETS_FAILED", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({
          type: "FETCHING_QUESTION_SETS_FAILED",
          payload: err.message
        });
      });
  };
}
