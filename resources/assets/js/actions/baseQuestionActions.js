import axios from "axios";
import { fetchQuestions } from "./questionBankActions";
import { retrieveStats } from "./statsActions";

const baseUrl = "/api/base-question/";

export function fetchBaseQuestions() {
  return function(dispatch) {
    dispatch({ type: "FETCHING_BASE_QUESTIONS" });
    const fetchURL = `${baseUrl}list`;
    axios
      .get(fetchURL)
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({ type: "REMOVE_BASE_QUESTIONS_ERROR" });
          dispatch({
            type: "FETCHING_BASE_QUESTIONS_FULFILLED",
            payload: d
          });
        } else {
          dispatch({ type: "BASE_QUESTION_ERROR", payload: d.message });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_BASE_QUESTIONS_FAILED", payload: err });
      });
  };
}

export function generateBaseQuestion(baseQuestionName, allQuestions) {
  return function(dispatch) {
    dispatch({ type: "GENERATING_BASE_QUESTION" });

    axios
      .post(
        `${baseUrl}generate?baseQuestionName=${baseQuestionName}&allQuestions=${allQuestions}`
      )
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "GENERATING_BASE_QUESTION_FULFILLED",
            payload: d.message
          });
          dispatch(fetchBaseQuestions());
          dispatch(retrieveStats());
        } else {
          dispatch({
            type: "FETCHING_BASE_QUESTIONS_FAILED",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_BASE_QUESTIONS_FAILED", payload: err });
      });
  };
}

export function fetchBaseQuestion(id) {
  return function(dispatch) {
    dispatch({ type: "FETCHING_BASE_QUESTIONS" });

    axios
      .get(`${baseUrl}baseQuestion?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "FETCH_SINGLE_BASE_QUESTION_FULFILLED",
            payload: d
          });
        } else {
          dispatch({
            type: "FETCHING_BASE_QUESTIONS_FAILED",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "FETCHING_BASE_QUESTIONS_FAILED",
          payload: err.message
        });
      });
  };
}

export function deleteBaseQuestion(id) {
  return function(dispatch) {
    dispatch({ type: "DELETE_BASE_QUESTION" });

    axios
      .delete(`${baseUrl}delete?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "DELETE_BASE_QUESTION_FULFILLED",
            payload: d.message
          });
          dispatch(fetchBaseQuestions());
          dispatch(retrieveStats());
        } else {
          dispatch({
            type: "FETCHING_BASE_QUESTIONS_FAILED",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "FETCHING_BASE_QUESTIONS_FAILED",
          payload: err.message
        });
      });
  };
}