const initialState = {
  allQuestionsCount: {
    english: 0,
    math: 0,
    physics: 0,
    chemistry: 0
  },
  statFetching: false,
  statFetched: false,
  error: null,
  message: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCHING_QUESTIONS_COUNT":
      return {
        ...state,
        statFetching: true,
        statFetched: false
      };
    case "FETCHING_ALL_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        statFetching: false,
        statFetched: true,
        error: null,
        allQuestionsCount: action.payload,
        message: ""
      };
    case "QUESTION_COUNT_ERROR":
      return {
        ...state,
        statFetching: false,
        statFetched: false,
        error: action.payload
      };
    case "CLEAR_QUESTION_COUNT":
      return initialState;
    default:
      return state;
  }
}
