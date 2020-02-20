import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";

import IntegrationReactSelect from "../../components/IntegrationReactSelect";

import { fetchQuestions } from "../../actions/questionBankActions";
import { generateBaseQuestion } from "../../actions/baseQuestionActions";
import { fetchSubjectList } from "../../actions/subjectActions";

import {
  PageContainer,
  CustomSmallPaper,
  FlatButton
} from "../../components/utils";

import { shuffleArray } from "../../utilityFunctions";
import { numberToAlphabet } from "../../utilityFunctions";

const styles = theme => ({
  root: {
    width: "100%"
  },
  titleRow: {
    marginBottom: theme.spacing(3)
  },
  tableTitle: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  cardContent: {
    padding: theme.spacing(0, 2)
  },
  noQuestionsToDisplay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px"
  },
  submitButton: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1.5)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  buttonContainer: {
    padding: "20px 0px"
  },
  doneButton: {
    marginRight: "10px"
  },
  submitButton: {
    marginBottom: "15px"
  },
  selectedSubjects: {
    padding: "30px 10px"
  },
  dividerSpacing: {
    marginTop: "10px",
    marginBottom: "20px"
  },
  noTopMargin: {
    marginTop: "0"
  }
});

class CreateBaseQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseQuestionName: "",
      showMessage: false,
      subject: "",
      allSubjectsAdded: false,
      subjectList: [],
      questionsToRender: [],
      selectedSubjects: [],
      tempSelectedQuestions: [],
      finalArray: [],
      count: 0
    };
    this.onSubjectSelect = this.onSubjectSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleQuestionSelect = this.handleQuestionSelect.bind(this);
  }

  componentDidMount() {
    const {
      fetchQuestions,
      generateBaseQuestion,
      fetchSubjectList,
      subjects,
      allQuestions
    } = this.props;

    if (subjects.length === 0) {
      this.props.fetchSubjectList();
    }

    if (allQuestions.length === 0) {
      for (var i = 0; i < subjects.length; i++) {
        fetchQuestions(`${subjects[i].subject}`);
      }
    }
  }

  onSubjectSelect(val) {
    const { allQuestions } = this.props;
    const { selectedSubjects } = this.state;

    let questionsToRender = [];
    for (let i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].subject === val.value) {
        for (let j = 0; j < allQuestions[i].questions.length; j++) {
          questionsToRender.push(allQuestions[i].questions[j]);
        }
      }
    }

    this.setState({
      subject: val.value,
      questionsToRender: questionsToRender
    });
  }

  handleQuestionSelect(id, event) {
    const { tempSelectedQuestions } = this.state;

    let temp = tempSelectedQuestions;
    let filtered = [];
    if (event.target.checked) {
      temp.push(id);
      this.setState(
        {
          tempSelectedQuestions: temp
        },
        () => console.log(this.state)
      );
    } else {
      filtered = temp.filter(function(value, index, arr) {
        return value !== id;
      });
      this.setState(
        {
          tempSelectedQuestions: filtered
        },
        () => console.log(this.state)
      );
    }
  }

  handleCheckboxChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.checked
      },
      () => console.log(this.state)
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleDone() {
    const {
      selectedSubjects,
      tempSelectedQuestions,
      finalArray,
      subject
    } = this.state;

    let tempSelectedSubjects = selectedSubjects;
    tempSelectedSubjects.push(subject);

    let tempFinalArray = finalArray;
    tempFinalArray.push({
      subject: subject,
      questions: tempSelectedQuestions
    });

    this.setState({
      selectedSubjects: tempSelectedSubjects,
      finalArray: tempFinalArray
    });

    // if (questionSetName === "") {
    //   alert("Please give a name to the question set");
    // }

    // generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  handleCancel() {
    const { baseQuestionName } = this.state;
    const {} = this.props;

    // if (questionSetName === "") {
    //   alert("Please give a name to the question set");
    // }

    // generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  handleRefresh() {
    const { baseQuestionName } = this.state;
    const {} = this.props;

    // if (questionSetName === "") {
    //   alert("Please give a name to the question set");
    // }

    // generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  handleSubmit() {
    const { baseQuestionName } = this.state;
    const {} = this.props;

    // if (questionSetName === "") {
    //   alert("Please give a name to the question set");
    // }

    // generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  renderSelectedSubjects() {
    if (this.state.selectedSubjects.length === 0) {
      return <p>No subjects added yet.</p>;
    }
    return this.state.selectedSubjects.map((subject, index) => {
      return (
        <p key={`${subject}+${index}`}>
          {index + 1}. {subject}
        </p>
      );
    });
  }

  renderQuestions() {
    const { classes } = this.props;
    const { questionsToRender } = this.state;

    if (questionsToRender.length === 0) {
      return (
        <Grid container spacing={3} className={classes.noQuestionsToDisplay}>
          <Typography
            variant='h5'
            color='textPrimary'
            className={classes.subjectTitle}
          >
            Sorry, there are no questions to display.
          </Typography>
        </Grid>
      );
    }
    return questionsToRender.map((question, index) => {
      return (
        <Grid item xs={10} key={question._id}>
          <p className={classes.noBottomSpacing}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={event =>
                    this.handleQuestionSelect(question._id, event)
                  }
                />
              }
            />
            {index + 1}.&nbsp;{question.question}
          </p>
          <p className={classes.optionsContainer}>
            {question.options.map((option, idx) => {
              return (
                <Fragment key={idx}>
                  <span className={classes.singleOption}>
                    ({numberToAlphabet(idx)}) {option.option}
                  </span>
                </Fragment>
              );
            })}
          </p>
        </Grid>
      );
    });
  }

  render() {
    const {
      classes,
      generating,
      subjects,
      allQuestions,
      selectedSubjects
    } = this.props;
    const { baseQuestionName, allSubjectsAdded } = this.state;

    const subjectList = subjects.map(subject => {
      return {
        value: subject.subject,
        label: subject.subject
      };
    });

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3} className={classes.titleRow}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              Generate New Base Question
            </Typography>
          </Grid>
          <Divider className={classes.root} />
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              required
              id='baseQuestionName'
              name='baseQuestionName'
              label='Base Question Name'
              value={this.state.baseQuestionName}
              margin='normal'
              className={classes.noTopMargin}
              variant='outlined'
              fullWidth
              onChange={this.handleChange}
            />
            <IntegrationReactSelect
              suggestions={subjectList}
              label='Form'
              onChange={this.onSubjectSelect}
              placeholder='Select Subject'
            />
          </Grid>

          <Grid item xs={4}>
            <CustomSmallPaper>
              <div
                className={`${classes.cardContent} ${classes.selectedSubjects}`}
              >
                <Typography
                  variant='h5'
                  color='textPrimary'
                  className={classes.subjectTitle}
                >
                  Selected Subjects
                </Typography>
                <Divider
                  className={`${classes.root} ${classes.dividerSpacing}`}
                />
                {this.renderSelectedSubjects()}
                <FlatButton
                  variant='contained'
                  color='primary'
                  disabled={!allSubjectsAdded}
                  className={classes.submitButton}
                  size='large'
                  fullWidth
                  onClick={this.handleSubmit}
                >
                  Submit Base Question
                </FlatButton>
                <FlatButton
                  variant='contained'
                  color='secondary'
                  disabled={this.state.selectedSubjects.length === 0}
                  size='large'
                  fullWidth
                  onClick={this.handleRefresh}
                >
                  Start Again
                </FlatButton>
              </div>
            </CustomSmallPaper>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomSmallPaper>
              <div className={classes.cardContent}>
                {this.state.subject !== "" ? (
                  <div style={{ margin: "10px 0 20px 0", color: "green" }}>
                    {this.state.count > 0
                      ? `${this.state.count} selected`
                      : "0 selected"}
                  </div>
                ) : (
                  ""
                )}
                {this.renderQuestions()}
                {this.state.subject !== "" ? (
                  <div className={classes.buttonContainer}>
                    <FlatButton
                      variant='contained'
                      color='primary'
                      disabled={generating}
                      className={classes.doneButton}
                      size='large'
                      onClick={this.handleDone}
                    >
                      Done
                    </FlatButton>
                    <FlatButton
                      variant='contained'
                      color='primary'
                      disabled={generating}
                      className={classes.cancelButton}
                      size='large'
                      onClick={this.handleCancel}
                    >
                      Cancel
                    </FlatButton>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </CustomSmallPaper>
          </Grid>
        </Grid>
      </PageContainer>
    );
  }
}

// CreateQuestionSet.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onComplete: PropTypes.func
// };

function mapStateToProps(store) {
  return {
    allQuestions: store.questionBankInfo.allQuestions,
    subjects: store.subjectsInfo.subjects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchQuestions, generateBaseQuestion, fetchSubjectList },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateBaseQuestion));
