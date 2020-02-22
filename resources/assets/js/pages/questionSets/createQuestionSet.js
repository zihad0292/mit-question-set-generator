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
  }
});

class CreateQuestionSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSetName: "",
      optionsReorder: false,
      baseQuestionIndex: null,
      showMessage: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onBaseQuestionSelect = this.onBaseQuestionSelect.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { fetchQuestions } = this.props;
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

  onBaseQuestionSelect(index) {
    this.setState({
      baseQuestionIndex: index.value
    });
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

  handleSubmit() {
    const { questionSetName, subjectsReorder, optionsReorder } = this.state;
    const { generateQuestionSet } = this.props;

    if (questionSetName === "") {
      alert("Please give a name to the question set");
    }

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
    console.log(JSON.stringify(finalArray));
    generateQuestionSet(questionSetName, JSON.stringify(finalArray));
  }

  render() {
    const { classes, generating, updating, type, baseQuestions } = this.props;
    const { questionSetName, optionsReorder, baseQuestionIndex } = this.state;

    const selectBaseQuestion = baseQuestions.map((item, index) => {
      return {
        value: index,
        label: item.baseQuestionName
      };
    });

    return (
      <PageContainer maxWidth="lg">
        <Grid container spacing={3} className={classes.titleRow}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant="h4"
              color="textPrimary"
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
                      id="questionSetName"
                      name="questionSetName"
                      label="Question Set Name"
                      value={this.state.questionSetName}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <IntegrationReactSelect
                      suggestions={selectBaseQuestion}
                      label="Form"
                      onChange={this.onBaseQuestionSelect}
                      placeholder="Select Base Question"
                    />
                  </Grid>
                  {baseQuestionIndex !== null
                    ? baseQuestions[baseQuestionIndex].selectedSubjects.map(
                        subject => {
                          return <p>{subject}</p>;
                        }
                      )
                    : ""}
                  <Grid item sm={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="optionsReorder"
                            checked={optionsReorder}
                            onChange={this.handleCheckboxChange}
                            value={optionsReorder}
                          />
                        }
                        label="Should the Options be rearranged?"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <FlatButton
                  variant="contained"
                  color="primary"
                  disabled={generating}
                  className={classes.submitButton}
                  size="large"
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
  return bindActionCreators({ fetchQuestions, generateQuestionSet }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateQuestionSet));
