const initialState = {
  allQuestions: [],
  englishQuestions: [
    {
      id: "1",
      question:
        "Educating people and asking them ... beware ... the erratic traffic and the signboards. Appropriate fillers for the gaps are",
      options: [
        { option: "be, At", is_correct: "Yes" },
        { option: "for, Of", is_correct: "No" },
        { option: "to, Of", is_correct: "No" },
        { option: "for, Against", is_correct: "No" },
        { option: "for, From", is_correct: "No" }
      ],
      subject: "english",
      is_locked: true
    },
    {
      id: "2",
      question:
        "Educating people and asking them ... beware ...  the erratic traffic and the signboards. Appropriate fillers for the gaps are",
      options: [
        { option: "be, At", is_correct: "No" },
        { option: "for, Of", is_correct: "Yes" },
        { option: "to, Of", is_correct: "No" },
        { option: "for, Against", is_correct: "Yes" },
        { option: "for, From", is_correct: "No" }
      ],
      subject: "english",
      is_locked: true
    },
    {
      id: "3",
      question:
        "Educating people and asking them ... beware ... the erratic traffic and the signboards. Appropriate fillers for the gaps are",
      options: [
        { option: "be, At", is_correct: "No" },
        { option: "for, Of", is_correct: "Yes" },
        { option: "to, Of", is_correct: "No" },
        { option: "for, Against", is_correct: "No" },
        { option: "for, From", is_correct: "No" }
      ],
      subject: "english",
      is_locked: true
    }
  ],
  countEnglishQuestions: 0,
  mathQuestions: [],
  countMathQuestions: 0,
  physicsQuestions: [],
  countPhysicsQuestions: 0,
  chemistryQuestions: [],
  countChemistryQuestions: 0,
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
    case "FETCHING_ENGLISH_QUESTIONS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        englishQuestions: action.payload.questions,
        countEnglishQuestions: action.payload.count,
        message: ""
      };
    case "FETCHING_MATH_QUESTIONS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        mathQuestions: action.payload.questions,
        countMathQuestions: action.payload.count,
        message: ""
      };
    case "FETCHING_PHYSICS_QUESTIONS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        physicsQuestions: action.payload.questions,
        countPhysicsQuestions: action.payload.count,
        message: ""
      };
    case "FETCHING_CHEMISTRY_QUESTIONS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        chemistryQuestions: action.payload.questions,
        countChemistryQuestions: action.payload.count,
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
