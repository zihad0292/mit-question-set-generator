import React, { Component } from "react";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
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

export class viewQuestionSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSet: []
    };
  }

  componentDidMount() {
    console.log("component mounted");
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
  }

  renderQuestions() {
    const { classes } = this.props;

    return this.state.questionSet.map((question, index) => {
      return (
        <Fragment key={index + 100}>
          <Grid item xs={12}>
            <p className={classes.noBottomSpacing}>
              {index + 1}.&nbsp;{question.question}
            </p>
            <p className={classes.optionsContainer}>
              {question.options.map((option, idx) => {
                return (
                  <Fragment key={idx}>
                    <span>
                      {option.is_correct === true ? (
                        <DoneIcon className={classes.correctAnswer} />
                      ) : (
                        ""
                      )}
                      ({numberToAlphabet(idx)})&nbsp;
                      {option.option}
                    </span>
                    &nbsp; &nbsp; &nbsp;
                  </Fragment>
                );
              })}
            </p>
          </Grid>
        </Fragment>
      );
    });
  }

  render() {
    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={2} className={classes.questionContainer}>
          {/* <FullBodyLoader active={fetching || deleting} /> */}
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                {this.renderQuestions()}
              </Grid>
            </CardContent>
          </CustomSmallPaper>
        </Grid>
      </PageContainer>
    );
  }
}

export default withStyles(styles)(viewQuestionSet);
