const initialState = {
  subjects: [],
  fetching: false,
  fetched: false,
  adding: false,
  added: false,
  deleting: false,
  deleted: false,
  error: null,
  message: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_SUBJECTS":
      return {
        ...state,
        fetching: true,
        fetched: false
      };
    case "FETCHING_ALL_SUBJECTS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        subjects: action.payload,
        message: ""
      };
    case "SUBJECT_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case "ADDING_NEW_SUBJECT":
      return {
        ...state,
        adding: true,
        added: false
      };
    case "ADDING_NEW_SUBJECT_FULFILLED":
      return {
        ...state,
        adding: false,
        added: true,
        message: action.payload
      };
    case "REMOVE_SUBJECT_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        error: null
      };
    case "SUBJECTS_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        deleting: false,
        deleted: false,
        error: action.payload
      };
    case "DELETE_SUBJECTS":
      return {
        ...state,
        deleting: true,
        deleted: false
      };
    case "DELETE_SUBJECT_FULFILLED":
      return {
        ...state,
        deleting: false,
        deleted: true,
        error: null,
        message: action.payload
      };
    case "CLEAR_SUBJECT_LIST":
      return initialState;
    default:
      return state;
  }
}
