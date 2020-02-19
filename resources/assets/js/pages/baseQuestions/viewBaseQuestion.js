import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import GetAppIcon from "@material-ui/icons/GetApp";

import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FlatButton,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

import { fetchBaseQuestion } from "../../actions/baseQuestionActions";

import { numberToAlphabet } from "../../utilityFunctions";
import { func } from "prop-types";

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
    marginTop: 0
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
    width: "100%",
    display: "block",
    textTransform: "uppercase",
    marginBottom: "10px"
  },
  mainContainer: {
    marginTop: "20px"
  },
  questionContainer: {
    margin: "0"
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
  },
  textRight: {
    textAlign: "right",
    width: "100%",
    marginRight: "50px"
  },
  buttonBg: {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  }
});

export class viewBaseQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseQuestion: []
    };
    this.export2Doc = this.export2Doc.bind(this);
  }

  componentDidMount() {
    this.props.fetchBaseQuestion(this.props.baseQuestionId);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
  }

  export2Doc(element, filename = "") {
    var downloadLink = document.createElement("a");

    function initiateDownload(callback) {
      var preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";
      var html =
        preHtml + document.getElementById(element).innerHTML + postHtml;

      var url =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(html);

      filename = filename ? filename + ".docx" : "document.docx";
      downloadLink.href = url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      callback();
    }

    function removeDownloadLink() {
      document.body.removeChild(downloadLink);
    }

    initiateDownload(removeDownloadLink);
  }

  renderQuestions() {
    const { classes, singleBaseQuestion } = this.props;
    if (
      singleBaseQuestion.allQuestions &&
      singleBaseQuestion.allQuestions.length > 0
    ) {
      var i = 1;
      return singleBaseQuestion.allQuestions.map((subject, index) => {
        return (
          <Fragment>
            {/* <h3 className={classes.subjectTitle}>{subject.subject}</h3> */}
            {subject.questions.map((question, idx) => {
              return (
                <Grid item xs={12} key={index + 100}>
                  <p className={classes.questionContainer}>
                    {i++}.&nbsp;{question.question}
                  </p>
                  <p className={classes.optionsContainer}>
                    {question.options &&
                      question.options.map((option, i) => {
                        return (
                          <Fragment key={i}>
                            <span>
                              ({numberToAlphabet(i)})&nbsp;
                              {option.option}
                            </span>
                            &nbsp; &nbsp; &nbsp;
                          </Fragment>
                        );
                      })}
                  </p>
                </Grid>
              );
            })}
          </Fragment>
        );
      });
    }
  }

  renderAnswers() {
    const { classes, singleBaseQuestion } = this.props;
    if (
      singleBaseQuestion.allQuestions &&
      singleBaseQuestion.allQuestions.length > 0
    ) {
      var i = 1;
      return singleBaseQuestion.allQuestions.map((subject, index) => {
        return (
          <Fragment>
            {subject.questions.map((question, idx) => {
              return (
                <Grid item xs={12} key={index + 100}>
                  <p className={classes.optionsContainer}>
                    {i++}.&nbsp;
                    {question.options &&
                      question.options.map((option, i) => {
                        return (
                          <Fragment key={i}>
                            <span>
                              {option.is_correct ? (
                                <Fragment>{numberToAlphabet(i)}&nbsp;</Fragment>
                              ) : (
                                ""
                              )}
                            </span>
                          </Fragment>
                        );
                      })}
                  </p>
                </Grid>
              );
            })}
          </Fragment>
        );
      });
    }
  }
  render() {
    const { classes } = this.props;

    return (
      <PageContainer maxWidth='lg'>
        {/* <FullBodyLoader active={fetching || deleting} /> */}
        <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                <p id='downloadQuestions' className={classes.textRight}>
                  <IconButton
                    color='primary'
                    aria-label='Download'
                    className={classes.buttonBg}
                    onClick={() =>
                      this.export2Doc("questionDownload", "BaseQuestion")
                    }
                  >
                    <GetAppIcon />
                  </IconButton>
                </p>
                <div id='questionDownload'>{this.renderQuestions()}</div>
              </Grid>
            </CardContent>
          </CustomSmallPaper>
        </Grid>
        <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                <p id='downloadQuestions' className={classes.textRight}>
                  <IconButton
                    color='primary'
                    aria-label='Download'
                    className={classes.buttonBg}
                    onClick={() =>
                      this.export2Doc("answerDownload", "answerSheet")
                    }
                  >
                    <GetAppIcon />
                  </IconButton>
                </p>
                <div id='answerDownload'>
                  <h3 className={classes.subjectTitle}>Answers</h3>
                  {this.renderAnswers()}
                </div>
              </Grid>
            </CardContent>
          </CustomSmallPaper>
        </Grid>
      </PageContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.baseQuestionInfo,
    singleBaseQuestion: store.baseQuestionInfo.singleBaseQuestion
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchBaseQuestion }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(viewBaseQuestion));
