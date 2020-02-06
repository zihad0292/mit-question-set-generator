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
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

import AvroInput from "../../avro/AvroInput";
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
  },
  avroInputWrapper: {
    position: "relative"
  },
  toggleButtonHolder: {
    position: "absolute",
    top: "10px",
    zIndex: "100",
    right: "2px"
  }
});

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldSubject: "",
      subject: "",
      question: "",
      bn: true,
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
      optionsReorder: true,
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
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.onSubjectSelect = this.onSubjectSelect.bind(this);
    this.toggleInputLanguage = this.toggleInputLanguage.bind(this);
    this.renderToggleButton = this.renderToggleButton.bind(this);
  }

  componentDidMount() {
    const { type, history } = this.props;
    if (type == "edit") {
      this.populateStateVal();
    } else {
      this.setState({
        subject: this.props.match.params.subject
      });
    }
  }

  populateStateVal() {
    const { selectedQuestion } = this.props;
    this.setState({
      oldSubject: selectedQuestion.subject,
      subject: selectedQuestion.subject,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
      optionsReorder: selectedQuestion.optionsReorder,
      optionsCount: selectedQuestion.options.length
    });
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

  handleQuestionChange(question) {
    this.setState({
      question: question
    });
  }

  handleOptionChange(index, option) {
    let oldOptions = this.state.options;
    oldOptions[index].option = option;
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

  handleCheckboxChange(event) {
    console.log("object");
    this.setState({
      optionsReorder: !this.state.optionsReorder
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
    const {
      question,
      options,
      subject,
      oldSubject,
      optionsReorder
    } = this.state;
    const { type, selectedQuestion, addNewQuestion, editQuestion } = this.props;

    if (question.length > 0) {
      if (type == "edit") {
        editQuestion(
          selectedQuestion._id,
          subject,
          oldSubject,
          question,
          JSON.stringify(options),
          optionsReorder
        );
        this.props.onEditClose();
      } else {
        addNewQuestion(
          subject,
          question,
          JSON.stringify(options),
          optionsReorder
        );
      }
    }
  }

  toggleInputLanguage() {
    this.setState({
      bn: !this.state.bn
    });
  }

  renderToggleButton() {
    return (
      <div className={this.props.classes.toggleButtonHolder}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color='primary'
                checked={this.state.bn}
                onChange={this.toggleInputLanguage}
                value='bn'
              />
            }
            label='BN'
          />
        </FormGroup>
      </div>
    );
  }

  render() {
    const { classes, type } = this.props;
    const {
      subject,
      question,
      options,
      optionsReorder,
      optionsCount
    } = this.state;

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

            <div className={classes.avroInputWrapper}>
              <AvroInput
                required
                id={"option-" + index}
                name={"option-" + index}
                label='Option'
                value={options[index].option}
                type='textarea'
                placeholder='Option'
                className='form-control avroInput'
                rows='1'
                enabled={this.state.bn}
                onChange={option => this.handleOptionChange(index, option)}
              />
            </div>
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
              {type === "edit" ? "Edit" : "Add New"} Question
            </Typography>
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <CustomSmallPaper>
          <div className={classes.cardContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.capitalizeWord}>
                {subject !== "" ? (
                  <IntegrationReactSelect
                    suggestions={subjectList}
                    label='Form'
                    selected={selectedSubj}
                    onChange={this.onSubjectSelect}
                    placeholder='Select Subject'
                  />
                ) : (
                  <IntegrationReactSelect
                    suggestions={subjectList}
                    label='Form'
                    onChange={this.onSubjectSelect}
                    placeholder='Select Subject'
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <div className={classes.avroInputWrapper}>
                  <AvroInput
                    required
                    id='question'
                    name='question'
                    type='textarea'
                    placeholder='Question'
                    value={question}
                    className='form-control avroInput'
                    rows='4'
                    enabled={this.state.bn}
                    onChange={question => this.handleQuestionChange(question)}
                  />
                  {this.renderToggleButton()}
                </div>
              </Grid>
            </Grid>
            {optionsToPrint}

            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                    label='Options can be rearranged when question set is generated?'
                  />
                </FormGroup>
              </Grid>
            </Grid>
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
              {type === "edit" ? "Update" : "Save"} Question
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
