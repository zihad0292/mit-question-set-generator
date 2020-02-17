const initialState = {
  allQuestions: [],
  englishQuestions: [],
  mathQuestions: [],
  physicsQuestions: [],
  chemistryQuestions: [],
  fetching: false,
  fetched: false,
  adding: false,
  added: false,
  updating: false,
  updated: false,
  deleting: false,
  deleted: false,
  error: null,
  message: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_QUESTIONS":
      return {
        ...state,
        fetching: true,
        fetched: false
      };
    case "FETCHING_ALL_QUESTIONS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        allQuestions: action.payload.questions,
        message: ""
      };
    case "FETCHING_QUESTIONS_FULFILLED":
      let tempQuestions = { ...state.allQuestions };
      tempQuestions.push(action.payload);
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        allQuestions: tempQuestions,
        message: ""
      };
    case "QUESTION_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case "ADDING_NEW_QUESTION":
      return {
        ...state,
        adding: true,
        added: false
      };
    case "ADDING_NEW_QUESTION_FULFILLED":
      return {
        ...state,
        adding: false,
        added: true,
        message: action.payload
      };
    case "REMOVE_QUESTION_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        error: null
      };
    case "UPDATING_QUESTION":
      return {
        ...state,
        updating: true,
        updated: false
      };
    case "UPDATING_QUESTION_FULFILLED":
      return {
        ...state,
        updating: false,
        updated: true,
        error: null,
        message: action.payload
      };
    case "QUESTION_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        updating: false,
        updated: false,
        deleting: false,
        deleted: false,
        error: action.payload
      };
    case "DELETE_QUESTION":
      return {
        ...state,
        deleting: true,
        deleted: false
      };
    case "DELETE_QUESTION_FULFILLED":
      return {
        ...state,
        deleting: false,
        deleted: true,
        error: null,
        message: action.payload
      };
    case "CLEAR_QUESTION_LIST":
      return initialState;
    default:
      return state;
  }
}
