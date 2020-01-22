const initialState = {
  questionSets: [
    {
      question_set_name: "Set 1",
      created_at: "2 January 2020"
    },
    {
      question_set_name: "Set 2",
      created_at: "6 January 2019"
    }
  ],
  message: "",
  fetching: false,
  fetched: false,
  adding: false,
  added: false,
  deleting: false,
  deleted: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_QUESTION_SETS":
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      };
    case "FETCHING_QUESTION_SETS_FULFILLED":
      return {
        ...state,
        questionSets: action.payload.results,
        fetching: false,
        fetched: true,
        error: null,
        message: ""
      };
    case "FETCHING_QUESTION_SETS_FAILED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        adding: false,
        added: false,
        deleting: false,
        deleted: false,
        error: action.payload
      };
    case "ADDING_QUESTION_SET":
      return {
        ...state,
        adding: true,
        added: false
      };
    case "ADDING_QUESTION_SET_FULFILLED":
      return {
        ...state,
        adding: false,
        added: true,
        message: action.payload
      };
    case "REMOVE_QUESTION_SETS_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        error: null
      };
    case "QUESTION_SET_ERROR":
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
    case "DELETE_QUESTION_SET":
      return {
        ...state,
        deleting: true,
        deleted: false
      };
    case "DELETE_QUESTION_SET_FULFILLED":
      return {
        ...state,
        deleting: false,
        deleted: true,
        error: null,
        message: action.payload
      };
    case "CLEAR_QUESTION_SETS":
      return initialState;
    default:
      return state;
  }
}
