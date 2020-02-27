const initialState = {
  questionPaper: [],
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
    case "FETCHING_QUESTION_PAPER":
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      };
    case "FETCHING_QUESTION_PAPER_FULFILLED":
      return {
        ...state,
        questionPaper: action.payload.results,
        fetching: false,
        fetched: true,
        error: null,
        message: ""
      };
    case "FETCHING_QUESTION_PAPER_FAILED":
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
    case "QUESTION_PAPER_ERROR":
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
    default:
      return state;
  }
}
