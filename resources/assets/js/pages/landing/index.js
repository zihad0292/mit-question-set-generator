import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

// utils
import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle
} from "../../components/utils";

// Actions
import { fetchSubjectList } from "../../actions/subjectActions";
import { fetchQuestions } from "../../actions/questionBankActions";
import {
  retrieveStats,
  retrieveQuestionSetStats
} from "../../actions/statsActions";

const styles = theme => ({
  root: {
    width: "100%"
  },
  media: {
    height: "100%"
  },
  homeWidget: {
    height: 150,
    cursor: "pointer"
  },
  cardContent: {
    position: "relative"
  },
  questionSetCard: {
    height: 180
  },
  titleStyle: {
    fontSize: "2.3rem",
    textTransform: "uppercase",
    marginBottom: theme.spacing(5)
  },
  smallWidgetStyle: {
    height: 250 - theme.spacing(1),
    overflow: "hidden"
  },
  statTitleStyle: {
    fontSize: "3.5rem",
    marginBottom: theme.spacing(0.5)
  },
  statFirstRow: {
    marginBottom: theme.spacing(3),
    overflow: "hidden"
  },
  alignItemsCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  }
});

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      fetchSubjectList,
      retrieveStats,
      retrieveQuestionSetStats,
      fetchQuestions,
      subjects
    } = this.props;
    if (subjects.length === 0) {
      fetchSubjectList();
    }
    retrieveStats();
    retrieveQuestionSetStats();
  }

  render() {
    const { classes, history, countSetStat, countStat, subjects } = this.props;
    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3} className={classes.statFirstRow}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              Overview
            </Typography>
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <Grid container spacing={2} className={classes.statFirstRow}>
          <Grid item xs={12} sm={4}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.questionSetCard} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/subjects")}
            >
              <CardContent className={classes.cardContent}>
                <div>
                  <Typography variant='h4' color='primary'>
                    {subjects.length > 1
                      ? `${subjects.length} Subjects`
                      : `${subjects.length} Subject`}
                  </Typography>
                </div>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.questionSetCard} ${classes.alignItemsCenter}`}
              onClick={() =>
                history.push("/dashboard/question-bank/allsubjects/")
              }
            >
              <CardContent className={classes.cardContent}>
                <div>
                  <Typography variant='h4' color='primary'>
                    {countStat > 1
                      ? `${countStat} Questions`
                      : `${countStat} Question`}
                  </Typography>
                </div>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.questionSetCard} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/question-sets")}
            >
              <CardContent className={classes.cardContent}>
                <div>
                  <Typography variant='h4' color='primary'>
                    {countSetStat > 1
                      ? `${countSetStat} Sets`
                      : `${countSetStat} Set`}
                  </Typography>
                </div>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
        </Grid>
      </PageContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    subjects: store.subjectsInfo.subjects,
    statFetched: store.statsInfo.statFetched,
    countStat: store.statsInfo.countStat,
    countSetStat: store.statsInfo.countSetStat
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      retrieveStats,
      retrieveQuestionSetStats,
      fetchSubjectList,
      fetchQuestions
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Landing)));
