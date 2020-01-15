import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

import {
  addNewQuestion,
  editQuestion
} from "../../actions/questionBankActions";
import {
  PageContainer,
  CustomSmallPaper,
  FlatButton
} from "../../components/utils";

import IntegrationReactSelect from "../../components/IntegrationReactSelect";

const styles = theme => ({
  root: {
    width: "100%"
  },
  relativeContainer: {
    position: "relative"
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
  addIcon: {
    position: "relative",
    top: "-2px"
  },
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  removeIcon: {
    position: "absolute",
    right: "20px",
    top: "50%",
    marginTop: "-14px",
    zIndex: "1",
    cursor: "pointer"
  },
  bottomSpacing: {
    marginBottom: theme.spacing(3)
  },
  bottomDivider: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  capitalizeWord: {
    textTransform: "capitalize"
  }
});

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldSubject: "",
      subject: "",
      question: "",
      options: [
        {
          option: "",
          is_correct: false
        },
        {
          option: "",
          is_correct: false
        },
        {
          option: "",
          is_correct: false
        }
      ],
      optionsCount: 3
    };
    this.populateStateVal = this.populateStateVal.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleOptionCheckboxChange = this.handleOptionCheckboxChange.bind(
      this
    );
    this.onSubjectSelect = this.onSubjectSelect.bind(this);
  }

  componentDidMount() {
    const { type } = this.props;
    if (type == "edit") {
      this.populateStateVal();
    }
  }

  populateStateVal() {
    const { selectedQuestion } = this.props;
    console.log(selectedQuestion);
    this.setState(
      {
        oldSubject: selectedQuestion.subject,
        subject: selectedQuestion.subject,
        question: selectedQuestion.question,
        options: selectedQuestion.options,
        optionsCount: selectedQuestion.options.length
      },
      () => console.log(this.state)
    );
  }

  componentWillReceiveProps(nextProps) {
    // if (
    //   (this.props.added != nextProps.added && nextProps.added) ||
    //   (this.props.updated != nextProps.updated && nextProps.updated)
    // ) {
    //   this.props.fetchDataTypes();
    //   // console.log(nextProps);
    //   this.setState({
    //     dataType: "",
    //     is_correct: false
    //   });
    // }
    // if (this.props.onComplete) {
    //   this.props.onComplete();
    // }
  }
  onSubjectSelect(val) {
    this.setState({
      subject: val.value
    });
  }

  handleQuestionChange(event) {
    this.setState({
      [event.target.name]: [event.target.value]
    });
  }

  handleOptionChange(index, event) {
    let oldOptions = this.state.options;
    oldOptions[index].option = event.target.value;
    this.setState({
      options: oldOptions
    });
  }

  handleOptionCheckboxChange(index, event) {
    let oldOptions = this.state.options;
    oldOptions[index].is_correct = !oldOptions[index].is_correct;
    this.setState({
      options: oldOptions
    });
  }
  handleAddOption() {
    let oldOptions = this.state.options;
    oldOptions.push({
      option: "",
      is_correct: false
    });
    this.setState({
      options: oldOptions,
      optionsCount: this.state.optionsCount + 1
    });
  }

  handleRemoveOption(index) {
    let oldOptions = this.state.options;
    oldOptions.splice(index, 1);
    this.setState({
      options: oldOptions,
      optionsCount: this.state.optionsCount - 1
    });
  }

  handleSubmit() {
    const { question, options, subject, oldSubject } = this.state;
    const { type, selectedQuestion, addNewQuestion, editQuestion } = this.props;
    if (question.length > 0) {
      if (type == "edit") {
        editQuestion(
          selectedQuestion._id,
          subject,
          oldSubject,
          question,
          JSON.stringify(options)
        );
      } else {
        addNewQuestion(subject, question, JSON.stringify(options));
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { subject, question, options, optionsCount } = this.state;

    const subjectList = [
      { value: "english", label: "english" },
      { value: "math", label: "math" },
      { value: "physics", label: "physics" },
      { value: "chemistry", label: "chemistry" }
    ];

    var selectedSubj = { value: `${subject}`, label: `${subject}` };

    const optionsToPrint = options.map((option, index) => {
      return (
        <Grid container spacing={3} key={index}>
          <Grid item xs={10} className={classes.relativeContainer}>
            {index > 2 ? (
              <IndeterminateCheckBoxIcon
                color='secondary'
                fontSize='large'
                className={classes.removeIcon}
                onClick={() => this.handleRemoveOption(index)}
              />
            ) : (
              ""
            )}
            <TextField
              required
              id={"option-" + index}
              name={"option-" + index}
              label='Option'
              value={options[index].option}
              margin='normal'
              variant='outlined'
              fullWidth
              onChange={event => this.handleOptionChange(index, event)}
            />
          </Grid>
          <Grid item xs={2} className={classes.alignCenter}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={"is-correct-" + index}
                    checked={options[index].is_correct}
                    onChange={event =>
                      this.handleOptionCheckboxChange(index, event)
                    }
                    value={options[index].is_correct}
                  />
                }
                label='Is Correct?'
              />
            </FormGroup>
          </Grid>
        </Grid>
      );
    });

    return (
      <PageContainer>
        <Grid container spacing={3} className={classes.bottomSpacing}>
          <Grid item xs={12} sm={8}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              Add New Question
            </Typography>
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <CustomSmallPaper>
          <div className={classes.cardContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.capitalizeWord}>
                <IntegrationReactSelect
                  suggestions={subjectList}
                  label='Form'
                  selected={selectedSubj}
                  onChange={this.onSubjectSelect}
                  placeholder='Select Subject'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id='question'
                  name='question'
                  label='Question'
                  value={question}
                  multiline={true}
                  rows='3'
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={this.handleQuestionChange}
                />
              </Grid>
            </Grid>
            {optionsToPrint}
            {optionsCount < 5 ? (
              <FlatButton
                variant='contained'
                color='default'
                className={classes.submitButton}
                size='small'
                onClick={this.handleAddOption}
              >
                Add New Option
                <Icon className={`${classes.rightIcon} ${classes.addIcon}`}>
                  add
                </Icon>
              </FlatButton>
            ) : (
              ""
            )}

            <Divider className={classes.bottomDivider} />
            <FlatButton
              variant='contained'
              color='primary'
              className={classes.submitButton}
              size='large'
              fullWidth
              onClick={this.handleSubmit}
            >
              Save Question
              <Icon className={classes.rightIcon}>save</Icon>
            </FlatButton>
          </div>
        </CustomSmallPaper>
      </PageContainer>
    );
  }
}

CreateQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(store) {
  return {
    added: store.questionBankInfo.added,
    adding: store.questionBankInfo.adding,
    updating: store.questionBankInfo.updating,
    updated: store.questionBankInfo.updated
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNewQuestion, editQuestion }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateQuestion));
