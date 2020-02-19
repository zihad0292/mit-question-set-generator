const initialState = {
  singleBaseQuestion: [],
  baseQuestions: [],
  message: "",
  fetching: false,
  fetched: false,
  generating: false,
  generated: false,
  deleting: false,
  deleted: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_BASE_QUESTIONS":
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      };
    case "FETCHING_BASE_QUESTIONS_FULFILLED":
      return {
        ...state,
        baseQuestions: action.payload.results,
        fetching: false,
        fetched: true,
        error: null,
        message: ""
      };
    case "FETCH_SINGLE_BASE_QUESTION_FULFILLED":
      return {
        ...state,
        singleBaseQuestion: action.payload.results,
        fetching: false,
        fetched: true,
        error: null,
        message: ""
      };
    case "FETCHING_BASE_QUESTIONS_FAILED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        generating: false,
        generated: false,
        deleting: false,
        deleted: false,
        error: action.payload
      };
    case "GENERATING_BASE_QUESTION":
      return {
        ...state,
        generating: true,
        generated: false
      };
    case "GENERATING_BASE_QUESTION_FULFILLED":
      return {
        ...state,
        generating: false,
        generated: true,
        message: action.payload
      };
    case "REMOVE_BASE_QUESTIONS_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        generating: false,
        generated: false,
        error: null
      };
    case "BASE_QUESTION_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        generating: false,
        generated: false,
        deleting: false,
        deleted: false,
        error: action.payload
      };
    case "DELETE_BASE_QUESTION":
      return {
        ...state,
        deleting: true,
        deleted: false
      };
    case "DELETE_BASE_QUESTION_FULFILLED":
      return {
        ...state,
        deleting: false,
        deleted: true,
        error: null,
        message: action.payload
      };
    case "CLEAR_BASE_QUESTIONS":
      return initialState;
    default:
      return state;
  }
}
