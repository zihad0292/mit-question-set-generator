import React, { Component } from "react";
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

import { fetchQuestions } from "../../actions/questionBankActions";
import { generateQuestionSet } from "../../actions/questionSetActions";
import { fetchBaseQuestions } from "../../actions/baseQuestionActions";
import {
  PageContainer,
  CustomSmallPaper,
  FlatButton
} from "../../components/utils";

import IntegrationReactSelect from "../../components/IntegrationReactSelect";

import { shuffleArray } from "../../utilityFunctions";

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
  submitButton: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1.5)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  subjectOrder: {
    display: "inline-block",
    margin: "0 0 0 10px"
  }
});

class CreateQuestionSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSetName: "",
      optionsReorder: false,
      baseQuestionIndex: null,
      showMessage: false,
      selectedSubjects: null,
      subjectOrder: [],
      availablePos: [],
      takenPositions: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.onBaseQuestionSelect = this.onBaseQuestionSelect.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleSubjectOrderChange = this.handleSubjectOrderChange.bind(this);
  }

  componentDidMount() {
    const { fetchBaseQuestions, baseQuestions } = this.props;
    if (baseQuestions.length === 0) {
      fetchBaseQuestions();
    }
  }

  handleSubjectOrderChange(event, subject) {
    console.log(event);
    console.log(subject);

    // var tempArray = [...this.state.subjectOrder];
    // var newPosition = event.target.value - 1;
    // if (tempArray[newPosition] !== "" || newPosition === -1) {
    //   if (tempArray.indexOf(event.target.name) !== -1) {
    //     var oldPosition = tempArray.indexOf(event.target.name);
    //     tempArray[oldPosition] = "";
    //     this.setState({
    //       subjectOrder: tempArray
    //     });
    //   }
    //   alert("Please select a different position");
    //   return;
    // }
    // if (tempArray.indexOf(event.target.name) !== -1) {
    //   var oldPosition = tempArray.indexOf(event.target.name);
    //   tempArray[oldPosition] = "";
    //   tempArray[newPosition] = event.target.name;
    // } else {
    //   tempArray[newPosition] = event.target.name;
    // }
    // console.log(tempArray);
    // this.setState({
    //   subjectOrder: tempArray
    // });
  }

  onBaseQuestionSelect(index) {
    let availablePos = this.props.baseQuestions[
      index.value
    ].selectedSubjects.map((item, index) => {
      return index + 1;
    });
    let subjectOrder = this.props.baseQuestions[
      index.value
    ].selectedSubjects.map((item, index) => {
      return "";
    });
    this.setState({
      baseQuestionIndex: index.value,
      availablePos: availablePos,
      subjectOrder: subjectOrder,
      selectedSubjects: this.props.baseQuestions[index.value].selectedSubjects
    });
  }

  handleCheckboxChange(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit() {
    const {
      questionSetName,
      optionsReorder,
      baseQuestionIndex,
      subjectOrder,
      selectedSubjects
    } = this.state;
    const { generateQuestionSet, baseQuestions } = this.props;

    if (questionSetName === "") {
      alert("Please give a name to the question set");
      return;
    }

    if (subjectOrder.indexOf("") !== -1) {
      alert("Please select subject order properly");
      return;
    }

    let allQuestions = baseQuestions[baseQuestionIndex].allQuestions;

    let finalArray = [[], [], [], []];
    var trackStartPosition = 0;
    for (var i = 0; i < selectedSubjects.length; i++) {
      let questionCount = selectedSubjects[i].count;
      var arrayToShuffle = allQuestions.slice(
        trackStartPosition,
        trackStartPosition + questionCount
      );

      trackStartPosition = questionCount;
      for (var j = 0; j < 4; j++) {
        var shuffledArray = shuffleArray(arrayToShuffle);
        finalArray[j] = finalArray[j].concat(shuffledArray);
      }
    }

    generateQuestionSet(
      questionSetName,
      JSON.stringify(finalArray[0]),
      JSON.stringify(finalArray[1]),
      JSON.stringify(finalArray[2]),
      JSON.stringify(finalArray[3]),
      JSON.stringify(subjectOrder),
      JSON.stringify(optionsReorder)
    );
  }

  render() {
    const { classes, generating, updating, type, baseQuestions } = this.props;
    const {
      questionSetName,
      optionsReorder,
      baseQuestionIndex,
      availablePos
    } = this.state;

    const selectBaseQuestion = baseQuestions.map((item, index) => {
      return {
        value: index,
        label: item.baseQuestionName
      };
    });

    const selectSubjectOrder = availablePos.map(item => {
      return {
        value: item,
        label: item
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
              Generate New Question Set
            </Typography>
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <CustomSmallPaper>
              <div className={classes.cardContent}>
                <Grid container spacing={3}>
                  <Grid item sm={12}>
                    <TextField
                      required
                      id='questionSetName'
                      name='questionSetName'
                      label='Question Set Name'
                      value={questionSetName}
                      margin='normal'
                      variant='outlined'
                      fullWidth
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <IntegrationReactSelect
                      suggestions={selectBaseQuestion}
                      label='Form'
                      onChange={this.onBaseQuestionSelect}
                      placeholder='Select Base Question'
                    />
                  </Grid>
                  {baseQuestionIndex !== null ? (
                    <Grid item sm={12}>
                      <Typography variant='h5' color='textPrimary'>
                        Select Subjects order
                      </Typography>
                      {baseQuestions[baseQuestionIndex].selectedSubjects.map(
                        subject => {
                          return (
                            <div
                              style={{
                                display: "inline-block",
                                width: "100%",
                                maxWidth: "200px",
                                margin: "20px 10px 0 0",
                                textTransform: "capitalize"
                              }}
                              key={subject._id}
                            >
                              {subject.subject}
                              <IntegrationReactSelect
                                suggestions={selectSubjectOrder}
                                label={subject.subject}
                                name={subject.subject}
                                // onChange={val =>
                                //   this.handleSubjectOrderChange(val)
                                // }
                                onChange={this.handleSubjectOrderChange.bind(
                                  this,
                                  subject.subject
                                )}
                                placeholder='Select order'
                                className={classes.subjectOrder}
                              />
                              {/* <select
                                id='subjectOrder'
                                name={subject.subject}
                                onChange={this.handleSubjectOrderChange}
                                className={classes.subjectOrder}
                              >
                                <option value=''>0</option>
                                {availablePos.map(item => {
                                  return (
                                    <option value={item} key={item}>
                                      {item}
                                    </option>
                                  );
                                })}
                              </select> */}
                            </div>
                          );
                        }
                      )}
                    </Grid>
                  ) : (
                    ""
                  )}

                  <Grid item sm={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name='optionsReorder'
                            checked={optionsReorder}
                            onChange={this.handleCheckboxChange}
                            value={optionsReorder}
                          />
                        }
                        label='Should the Options be rearranged?'
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <FlatButton
                  variant='contained'
                  color='primary'
                  disabled={generating}
                  className={classes.submitButton}
                  size='large'
                  fullWidth
                  onClick={this.handleSubmit}
                >
                  Generate
                  <Icon className={classes.rightIcon}>casino</Icon>
                </FlatButton>
              </div>
            </CustomSmallPaper>
          </Grid>
        </Grid>
      </PageContainer>
    );
  }
}

CreateQuestionSet.propTypes = {
  classes: PropTypes.object.isRequired,
  onComplete: PropTypes.func
};

function mapStateToProps(store) {
  return {
    questionSets: store.questionSetInfo.questionSets,
    baseQuestions: store.baseQuestionInfo.baseQuestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchQuestions, generateQuestionSet, fetchBaseQuestions },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateQuestionSet));
