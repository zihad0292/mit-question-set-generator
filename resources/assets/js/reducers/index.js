import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import questionBankInfo from "./questionBankReducer";
import questionSetInfo from "./questionSetReducer";
import statsInfo from "./statsReducer";

export default combineReducers({
  questionBankInfo,
  questionSetInfo,
  statsInfo,
  routing: routerReducer
});
