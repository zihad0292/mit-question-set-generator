import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import GetAppIcon from "@material-ui/icons/GetApp";

import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FlatButton,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

import { fetchQuestionSet } from "../../actions/questionSetActions";

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
    margin: "0 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd"
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
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  addIcon: {
    position: "relative",
    top: "-2px"
  },
  viewButton: {
    marginLeft: "40px"
  },
  buttonBg: {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
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
    this.props.fetchQuestionSet(this.props.match.params.id);
  }

  renderQuestionPapers() {
    const { classes, singleQuestionSet } = this.props;
    const repeater = [1, 2, 3, 4];
    return (
      <Fragment>
        <h3>{singleQuestionSet.setName}</h3>
        <Grid item xs={12}>
          {repeater.map(item => {
            return (
              <p className={classes.questionContainer} key={item}>
                {item}. Question Paper {item}
                <FlatButton
                  variant="contained"
                  color="primary"
                  className={classes.viewButton}
                  size="small"
                  onClick={() =>
                    this.props.history.push(
                      `/dashboard/question-sets/view-question-paper/paper${item}`
                    )
                  }
                >
                  View
                  <Icon className={`${classes.rightIcon} ${classes.addIcon}`}>
                    visibility
                  </Icon>
                </FlatButton>
              </p>
            );
          })}
        </Grid>
      </Fragment>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <PageContainer maxWidth="lg">
        {/* <FullBodyLoader active={fetching || deleting} /> */}
        <Grid container spacing={2} className={classes.mainContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <Grid container className={classes.root}>
                {this.renderQuestionPapers()}
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
    singleQuestionSet: store.questionSetInfo.singleQuestionSet
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchQuestionSet }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(viewQuestionSet));
