const initialState = {
  countAllQuestions: 0,
  countEnglishQuestions: 0,
  countMathQuestions: 0,
  countPhysicsQuestions: 0,
  countChemistryQuestions: 0,
  fetching: false,
  fetched: false,
  error: null,
  message: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // remove this later
    case "TEST_FETCHING_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true
      };
    case "FETCHING_QUESTIONS_COUNT":
      return {
        ...state,
        fetching: true,
        fetched: false
      };
    case "FETCHING_ALL_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        countAllQuestions: action.payload,
        message: ""
      };
    case "FETCHING_ENGLISH_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        countEnglishQuestions: action.payload,
        message: ""
      };
    case "FETCHING_MATH_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        countMathQuestions: action.payload,
        message: ""
      };
    case "FETCHING_PHYSICS_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        countPhysicsQuestions: action.payload,
        message: ""
      };
    case "FETCHING_CHEMISTRY_QUESTIONS_COUNT_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        countChemistryQuestions: action.payload,
        message: ""
      };
    case "QUESTION_COUNT_ERROR":
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case "CLEAR_QUESTION_COUNT":
      return initialState;
    default:
      return state;
  }
}
