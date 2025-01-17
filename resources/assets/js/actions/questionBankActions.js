import axios from "axios";
import { retrieveStats } from "./statsActions";

const baseUrl = "/api/question-bank/";

export function fetchQuestions(subject) {
  return function(dispatch) {
    dispatch({ type: "FETCHING_QUESTIONS" });
    axios
      .get(`${baseUrl}list?subject=${subject}`)
      .then(resp => {
        const d = resp.data;
        if (d.success) {
          dispatch({
            type: "FETCHING_QUESTIONS_FULFILLED",
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

export function addNewQuestion(subject, question, options, optionsReorder) {
  return function(dispatch) {
    dispatch({ type: "ADDING_NEW_QUESTION" });

    axios
      .post(
        `${baseUrl}create?subject=${subject}&question=${question}&options=${options}&optionsReorder=${optionsReorder}`
      )
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({
            type: "ADDING_NEW_QUESTION_FULFILLED",
            payload: d.message
          });
          dispatch(fetchQuestions(subject));
          dispatch(retrieveStats());
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

export function editQuestion(
  id,
  subject,
  oldSubject,
  question,
  options,
  optionsReorder
) {
  return function(dispatch) {
    dispatch({ type: "UPDATING_QUESTION" });
    const updateUrl = `${baseUrl}edit?id=${id}&subject=${subject}&question=${question}&options=${options}&optionsReorder=${optionsReorder}`;
    axios
      .post(updateUrl)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "UPDATING_QUESTION_FULFILLED",
            payload: d.message
          });
          dispatch(fetchQuestions(subject));
          dispatch(retrieveStats());
          if (subject !== oldSubject) {
            dispatch(fetchQuestions(oldSubject));
          }
        } else {
          dispatch({ type: "QUESTION_ERROR", payload: err });
        }
      })
      .catch(err => {
        dispatch({ type: "QUESTION_ERROR", payload: err });
      });
  };
}

export function deleteQuestion(id, subject) {
  return function(dispatch) {
    dispatch({ type: "DELETE_QUESTION" });

    axios
      .delete(`${baseUrl}delete?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "DELETE_QUESTION_FULFILLED",
            payload: d.message
          });
          dispatch(fetchQuestions(subject));
          dispatch(retrieveStats());
        } else {
          dispatch({
            type: "QUESTION_ERROR",
            payload: d.error
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "QUESTION_ERROR",
          payload: err.message
        });
      });
  };
}
