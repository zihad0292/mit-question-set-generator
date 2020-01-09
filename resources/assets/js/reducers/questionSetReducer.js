const initialState = {
  offices: [],
  message: "",
  fetching: false,
  fetched: false,
  adding: false,
  added: false,
  updating: false,
  updated: false,
  deleting: false,
  deleted: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_OFFICE_LIST":
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      };
    case "FETCHING_OFFICE_LIST_FULFILLED":
      return {
        ...state,
        offices: action.payload.results,
        fetching: false,
        fetched: true,
        error: null,
        message: ""
      };
    case "FETCHING_OFFICE_LIST_FAILED":
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
    case "ADDING_NEW_OFFICE":
      return {
        ...state,
        adding: true,
        added: false
      };
    case "ADDING_NEW_OFFICE_FULFILLED":
      return {
        ...state,
        adding: false,
        added: true,
        message: action.payload
      };
    case "REMOVE_OFFICE_LIST_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        error: null
      };
    case "UPDATING_OFFICE_INFO":
      return {
        ...state,
        updating: true,
        updated: false
      };
    case "UPDATING_OFFICE_INFO_FULFILLED":
      return {
        ...state,
        updating: false,
        updated: true,
        error: null,
        message: action.payload
      };
    case "OFFICE_INFO_ERROR":
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
    case "DELETE_OFFICE_INFO":
      return {
        ...state,
        deleting: true,
        deleted: false
      };
    case "DELETE_OFFICE_INFO_FULFILLED":
      return {
        ...state,
        deleting: false,
        deleted: true,
        error: null,
        message: action.payload
      };
    case "CLEAR_OFFICE_LIST":
      return initialState;
    default:
      return state;
  }
}
