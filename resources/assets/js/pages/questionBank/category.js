import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";

import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";

import {
  fetchQuestions,
  deleteQuestion
} from "../../actions/questionBankActions";

import { fetchSubjectList } from "../../actions/subjectActions";

import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FlatButton,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

import { numberToAlphabet } from "../../utilityFunctions";

import EditQuestion from "./editQuestion";

const styles = theme => ({
  root: {
    width: "100%"
  },
  tableTitle: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  relativeContainer: {
    position: "relative"
  },
  media: {
    height: 260
  },
  title: {
    position: "absolute",
    bottom: 125,
    padding: theme.spacing(2),
    width: "60%",
    color: theme.palette.primary.dark
  },
  dbCardRow: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0)
  },
  dbRowImage: {
    width: 40
  },
  cardContent: {
    height: "auto",
    overflow: "hidden"
  },
  noQuestionsToDisplay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px"
  },
  enableIcon: {
    position: "relative",
    top: -1,
    marginRight: theme.spacing(0.5)
  },
  noBottomSpacing: {
    marginBottom: 0
  },
  optionsContainer: {
    fontSize: ".8em",
    lineHeight: "1.7",
    marginTop: 0,
    marginBottom: 0
  },
  singleOption: {
    marginRight: "10px"
  },
  correctAnswer: {
    color: "green",
    position: "relative",
    top: "7px"
  },
  cardButton: {
    margin: theme.spacing(0.5)
  },
  toolbarStyle: {
    backgroundImage: "url('/images/index-relation-banner.png')",
    minHeight: 140,
    backgroundSize: "cover"
  },
  subjectTitle: {
    textTransform: "capitalize"
  },
  questionContainer: {
    marginTop: "20px"
  },
  questionWrapper: {
    width: "100%",
    minHeight: "300px"
  },
  bottomSpacing: {
    marginBottom: theme.spacing(3)
  },
  buttonStyles: {
    padding: "8px 15px 6px",
    marginLeft: "10px"
  },
  buttonIcon: {
    position: "relative",
    top: "-3px"
  }
});

class QuestionBankCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      redirect: false,
      questions: [],
      selected: null,
      confirm: false,
      editQuestionComponent: false
    };

    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
    this.handleCloseComponent = this.handleCloseComponent.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  componentDidMount() {
    const {
      fetchQuestions,
      subjects,
      allQuestions,
      fetchSubjectList
    } = this.props;

    if (subjects.length === 0) {
      fetchSubjectList();
    }

    this.setState({
      subject: this.props.match.params.subject
    });

    if (allQuestions.length === 0) {
      for (var i = 0; i < subjects.length; i++) {
        fetchQuestions(`${subjects[i].subject}`);
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }

  // renderRedirect = () => {
  //   if (this.state.redirect) {
  //     return <Redirect to='/dashboard/question-bank/allsubjects/' />;
  //   }
  // };

  onDeleteClick(selectedIndex) {
    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onModalClose() {
    this.setState({
      confirm: false
    });
  }

  handleCloseComponent() {
    this.setState({
      editQuestionComponent: false
    });
  }

  onDeleteSubmit() {
    const { selected, subject } = this.state;

    this.props.deleteQuestion(selected, subject);

    this.setState({
      confirm: false
    });
  }

  onEditClick(selectedQuestion) {
    this.setState({
      selected: selectedQuestion,
      editQuestionComponent: true
    });
  }

  renderQuestions() {
    const { classes, allQuestions } = this.props;
    const subject = this.props.match.params.subject;

    let questionsToRender = [];
    for (let i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].subject === subject) {
        for (let j = 0; j < allQuestions[i].questions.length; j++) {
          questionsToRender.push(allQuestions[i].questions[j]);
        }
      }
    }

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
        <Fragment key={index + 100}>
          <Grid item xs={10}>
            <p className={classes.noBottomSpacing}>
              {index + 1}.&nbsp;{question.question}
            </p>
            <p className={classes.optionsContainer}>
              {question.options.map((option, idx) => {
                return (
                  <Fragment key={idx}>
                    <span className={classes.singleOption}>
                      {option.is_correct === true ? (
                        <DoneIcon className={classes.correctAnswer} />
                      ) : (
                        ""
                      )}
                      ({numberToAlphabet(idx)}) {option.option}
                    </span>
                  </Fragment>
                );
              })}
            </p>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              edge='end'
              aria-label='edit'
              onClick={() => this.onEditClick(question)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge='end'
              aria-label='delete'
              onClick={() => this.onDeleteClick(question._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Fragment>
      );
    });
  }

  render() {
    const { classes, fetching, deleting, history } = this.props;
    const { selected, subject, editQuestionComponent } = this.state;

    return (
      <Fragment>
        {!editQuestionComponent && (
          <PageContainer maxWidth='lg'>
            {/* {this.renderRedirect()} */}
            <Grid container spacing={3} className={classes.bottomSpacing}>
              <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                <Typography
                  variant='h4'
                  color='textPrimary'
                  className={classes.subjectTitle}
                >
                  {subject} Questions
                  <FlatButton
                    variant='contained'
                    color='primary'
                    className={classes.buttonStyles}
                    size='medium'
                    onClick={() =>
                      history.push(`/dashboard/question-bank/create/${subject}`)
                    }
                  >
                    Add New
                    <AddIcon className={classes.buttonIcon} />
                  </FlatButton>
                </Typography>

                {/* <FullBodyLoader active={fetching || deleting} /> */}
              </Grid>
              <Divider className={classes.root} />
            </Grid>
            <Grid container spacing={2} className={classes.questionContainer}>
              <CustomSmallPaper className={classes.questionWrapper}>
                <CardContent className={classes.cardContent}>
                  <Grid container className={classes.root}>
                    {this.renderQuestions()}
                  </Grid>
                </CardContent>
              </CustomSmallPaper>
            </Grid>
            <ConfirmDialog
              title='Confirm Delete?'
              description='Do You Really Want to Delete this Question?'
              active={this.state.confirm}
              onClose={this.onModalClose}
              onSubmit={this.onDeleteSubmit}
            />
          </PageContainer>
        )}
        {editQuestionComponent && (
          <EditQuestion
            selectedQuestion={selected}
            onEditClose={this.handleCloseComponent}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    subjects: store.subjectsInfo.subjects,
    allQuestions: store.questionBankInfo.allQuestions,
    fetched: store.questionBankInfo.fetched,
    fetching: store.questionBankInfo.fetching,
    deleting: store.questionBankInfo.deleting,
    deleted: store.questionBankInfo.deleted,
    questions: store.questionBankInfo.questions,
    message: store.questionBankInfo.message
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchQuestions, deleteQuestion, fetchSubjectList },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(QuestionBankCategory)));
