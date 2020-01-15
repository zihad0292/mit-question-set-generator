export default function generateActionString(subject) {
  let ACTION_STRING = "";
  if (subject === "english") {
    ACTION_STRING = "FETCHING_ENGLISH_QUESTIONS_FULFILLED";
  } else if (subject === "math") {
    ACTION_STRING = "FETCHING_MATH_QUESTIONS_FULFILLED";
  } else if (subject === "physics") {
    ACTION_STRING = "FETCHING_PHYSICS_QUESTIONS_FULFILLED";
  } else {
    ACTION_STRING = "FETCHING_CHEMISTRY_QUESTIONS_FULFILLED";
  }
  return ACTION_STRING;
}
