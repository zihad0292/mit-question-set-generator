import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import questionBankInfo from "./questionBankReducer";
import questionSetInfo from "./questionSetReducer";
import baseQuestionInfo from "./baseQuestionReducer";
import subjectsInfo from "./subjectsReducer";
import statsInfo from "./statsReducer";

export default combineReducers({
  subjectsInfo,
  questionBankInfo,
  questionSetInfo,
  baseQuestionInfo,
  statsInfo,
  routing: routerReducer
});
