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
    const { statFetched, retrieveStats, subjects } = this.props;
    if (subjects.length === 0) {
      console.log("again");
      this.props.fetchSubjectList();
    }
    retrieveStats();
    retrieveQuestionSetStats();
  }

  render() {
    const { classes, history, countSetStat } = this.props;
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
              onClick={() => history.push("/dashboard/question-sets")}
            >
              <CardContent className={classes.cardContent}>
                <div>
                  <Typography variant='h4' color='primary'>
                    Question Sets
                  </Typography>
                  <Typography variant='h5'>
                    {countSetStat > 1
                      ? `${countSetStat} Sets`
                      : `${countSetStat} Set`}
                  </Typography>
                </div>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() =>
                history.push("/dashboard/question-bank/allsubjects/english")
              }
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  English
                </Typography>
                <Typography variant='subtitle1'>
                  {countSetStat > 1
                    ? `${countSetStat} Questions`
                    : `${countSetStat} Question`}
                </Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() =>
                history.push("/dashboard/question-bank/allsubjects/math")
              }
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Math
                </Typography>
                <Typography variant='subtitle1'>
                  {countSetStat > 1
                    ? `${countSetStat} Questions`
                    : `${countSetStat} Question`}
                </Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() =>
                history.push("/dashboard/question-bank/allsubjects/physics")
              }
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Physics
                </Typography>
                <Typography variant='subtitle1'>
                  {countSetStat > 1
                    ? `${countSetStat} Questions`
                    : `${countSetStat} Question`}
                </Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() =>
                history.push("/dashboard/question-bank/allsubjects/chemistry")
              }
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Chemistry
                </Typography>
                <Typography variant='subtitle1'>
                  {countSetStat > 1
                    ? `${countSetStat} Questions`
                    : `${countSetStat} Question`}
                </Typography>
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
    countSetStat: store.statsInfo.countSetStat
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ retrieveStats, fetchSubjectList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Landing)));
