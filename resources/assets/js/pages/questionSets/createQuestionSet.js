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
import {
  PageContainer,
  CustomSmallPaper,
  FlatButton
} from "../../components/utils";

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
  }
});

class CreateQuestionSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSetName: "",
      optionsReorder: false,
      subjectsReorder: false,
      showMessage: false
    };
    this.populateStateVal = this.populateStateVal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      englishQuestions,
      mathQuestions,
      physicsQuestions,
      chemistryQuestions,
      fetchQuestions
    } = this.props;

    // Fetch questions only if respective question state is empty
    if (englishQuestions.length === 0) {
      fetchQuestions("english");
    }
    if (mathQuestions.length === 0) {
      fetchQuestions("math");
    }
    if (physicsQuestions.length === 0) {
      fetchQuestions("physics");
    }
    if (chemistryQuestions.length === 0) {
      fetchQuestions("chemistry");
    }
  }

  populateStateVal() {
    const { selectedOffice } = this.props;

    this.setState({
      name: selectedOffice.name,
      location: selectedOffice.location,
      showMessage: true
    });
  }

  componentWillReceiveProps(nextProps) {
    // if (
    //   (this.props.generated != nextProps.generated && nextProps.generated) ||
    //   (this.props.updated != nextProps.updated && nextProps.updated)
    // ) {
    //   this.props.fetchOfficeList();
    //   // console.log(nextProps);
    //   this.setState({
    //     name: "",
    //     location: ""
    //   });
    // }
    // if (this.props.onComplete) {
    //   this.props.onComplete();
    // }
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
    const { questionSetName, subjectsReorder, optionsReorder } = this.state;
    const {
      englishQuestions,
      mathQuestions,
      physicsQuestions,
      chemistryQuestions,
      generateQuestionSet
    } = this.props;

    if (questionSetName === "") {
      alert("Please give a name to the question set");
    }

    let randomEnglishQuestions = shuffleArray(englishQuestions);
    randomEnglishQuestions.splice(10);
    let randomMathQuestions = shuffleArray(mathQuestions);
    randomMathQuestions.splice(20);
    let randomPhysicsQuestions = shuffleArray(physicsQuestions);
    randomPhysicsQuestions.splice(20);
    let randomChemistryQuestions = shuffleArray(chemistryQuestions);
    randomChemistryQuestions.splice(20);

    let finalArray = [
      {
        subject: "english",
        questions: randomEnglishQuestions
      },
      {
        subject: "math",
        questions: randomMathQuestions
      },
      {
        subject: "physics",
        questions: randomPhysicsQuestions
      },
      {
        subject: "chemistry",
        questions: randomChemistryQuestions
      }
    ];

    if (subjectsReorder) {
      finalArray = shuffleArray(finalArray);
    }

    if (optionsReorder) {
      finalArray = finalArray.map(item => {
        return {
          subject: item.subject,
          questions: item.questions.map(subitem => {
            return {
              question: subitem.question,
              options: subitem.optionsReorder
                ? shuffleArray(subitem.options)
                : subitem.options
            };
          })
        };
      });
    }
    generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  render() {
    const { classes, generating, updating, type } = this.props;
    const { questionSetName, optionsReorder, subjectsReorder } = this.state;

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
                      value={this.state.questionSetName}
                      margin='normal'
                      variant='outlined'
                      fullWidth
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name='subjectsReorder'
                            checked={subjectsReorder}
                            onChange={this.handleCheckboxChange}
                            value={subjectsReorder}
                          />
                        }
                        label='Change the Subjects order?'
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item sm={6}>
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
    generating: store.questionSetInfo.generating,
    generated: store.questionSetInfo.generated,
    deleting: store.questionSetInfo.deleting,
    deleted: store.questionSetInfo.deleted,
    englishQuestions: store.questionBankInfo.englishQuestions,
    mathQuestions: store.questionBankInfo.mathQuestions,
    physicsQuestions: store.questionBankInfo.physicsQuestions,
    chemistryQuestions: store.questionBankInfo.chemistryQuestions,
    questionSets: store.questionSetInfo.questionSets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchQuestions, generateQuestionSet }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateQuestionSet));
