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

import { fetchQuestionPaper } from "../../actions/questionPaperActions";

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
    marginBottom: "20px"
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
  },
  fullWidthContent: {
    width: "100%"
  }
});

export class viewQuestionPaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionPaper: []
    };
    this.export2Doc = this.export2Doc.bind(this);
  }

  componentDidMount() {
    const { fetchQuestionPaper, singleQuestionSet } = this.props;
    var str = this.props.match.params.paper;
    var res = str.split("-");
    this.setState({
      questionSetIndex: res[0]
    });

    const paper = res[1];
    if (paper == "1") {
      fetchQuestionPaper(singleQuestionSet.questionPaper1);
    } else if (paper == "2") {
      fetchQuestionPaper(singleQuestionSet.questionPaper2);
    } else if (paper == "3") {
      fetchQuestionPaper(singleQuestionSet.questionPaper3);
    } else if (paper == "4") {
      fetchQuestionPaper(singleQuestionSet.questionPaper4);
    }
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

  renderSubjects() {
    const { baseQuestionDetails, classes } = this.props;
    return (
      <Grid item xs={12}>
        <h3 className={classes.subjectTitle}>
          All subjects in this question{" "}
          <small style={{ fontWeight: "normal" }}>
            (according to the order)
          </small>
        </h3>
        <p className={classes.questionContainer}>
          {/* {baseQuestionDetails.selectedSubjects.map((subject, index) => {
            return (
              <span style={{ textTransform: "capitalize" }} key={`${index}-s`}>
                {index + 1}. {subject}&nbsp;&nbsp;&nbsp;
              </span>
            );
          })} */}
        </p>
      </Grid>
    );
  }

  renderQuestions() {
    const {
      classes,
      questionPaper,
      baseQuestionDetails,
      questionSets,
      singleQuestionSet
    } = this.props;

    // const { questionSetIndex } = this.state;

    // console.log(singleQuestionSet.subjectOrder);

    var questionsToRender = [];

    for (var i = 0; i < singleQuestionSet.subjectOrder.length; i++) {
      for (var j = 0; j < questionPaper.length; j++) {
        if (questionPaper[j].subject == singleQuestionSet.subjectOrder[i]) {
          questionsToRender.push(questionPaper[j]);
        }
      }
    }

    console.log(questionsToRender);

    if (questionsToRender && questionsToRender.length > 0) {
      var i = 1;
      return questionsToRender.map((question, index) => {
        return (
          <Grid item xs={12} key={`${index}-q`}>
            <p className={classes.questionContainer}>
              {i++}.&nbsp;{question.question}
            </p>
            <p className={classes.optionsContainer}>
              {question.options &&
                question.options.map((option, i) => {
                  return (
                    <Fragment key={`${i}-o`}>
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
      });
    }
  }

  renderAnswers() {
    const { classes, questionPaper, singleQuestionSet } = this.props;

    var questionsToRender = [];

    for (var i = 0; i < singleQuestionSet.subjectOrder.length; i++) {
      for (var j = 0; j < questionPaper.length; j++) {
        if (questionPaper[j].subject == singleQuestionSet.subjectOrder[i]) {
          questionsToRender.push(questionPaper[j]);
        }
      }
    }

    if (questionsToRender && questionsToRender.length > 0) {
      return questionsToRender.map((question, index) => {
        return (
          <Grid item xs={12} key={`${index}-a`}>
            <p className={classes.optionsContainer}>
              {index + 1}.&nbsp;
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
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <PageContainer maxWidth="lg">
        {/* <FullBodyLoader active={fetching || deleting} /> */}
        {/* <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.fullWidthContent}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                {this.renderSubjects()}
              </Grid>
            </CardContent>
          </CustomSmallPaper>
        </Grid> */}

        <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                <p id="downloadQuestions" className={classes.textRight}>
                  <IconButton
                    color="primary"
                    aria-label="Download"
                    className={classes.buttonBg}
                    onClick={() =>
                      this.export2Doc("questionDownload", "BaseQuestion")
                    }
                  >
                    <GetAppIcon />
                  </IconButton>
                </p>
                <div id="questionDownload">{this.renderQuestions()}</div>
              </Grid>
            </CardContent>
          </CustomSmallPaper>
        </Grid>
        <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                <p id="downloadQuestions" className={classes.textRight}>
                  <IconButton
                    color="primary"
                    aria-label="Download"
                    className={classes.buttonBg}
                    onClick={() =>
                      this.export2Doc("answerDownload", "answerSheet")
                    }
                  >
                    <GetAppIcon />
                  </IconButton>
                </p>
                <div id="answerDownload">
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
    ...store.questionSetInfo,
    singleQuestionSet: store.questionSetInfo.singleQuestionSet,
    questionSets: store.questionSetInfo.questionSets,
    questionPaper: store.questionPaperInfo.questionPaper
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchQuestionPaper }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(viewQuestionPaper));
