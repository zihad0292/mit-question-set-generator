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

// import {
//   fetchDBConfigList,
//   setDBConfigToken
// } from "../../actions/dbConfigActions";
// import { fetchOfficeList } from "../../actions/officeActions";
// import { fetchIndexRelationCount } from "../../actions/userActions";

// Actions
import { fetchQuestions } from "../../actions/questionBankActions";
import { retrieveStats } from "../../actions/statsActions";
import { fetchSubjectList } from "../../actions/subjectActions";

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
    marginBottom: theme.spacing(3)
  },
  alignItemsCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  }
});

class QuestionBank extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      statFetched,
      countStat,
      fetchQuestions,
      subjects,
      allQuestions
    } = this.props;
    if (subjects.length === 0) {
      this.props.fetchSubjectList();
    }
    if (allQuestions.length === 0) {
      for (var i = 0; i < subjects.length; i++) {
        fetchQuestions(`${subjects[i].subject}`);
      }
    }
  }

  render() {
    const { classes, history, countStat, subjects } = this.props;

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3} className={classes.statFirstRow}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              All Subjects
            </Typography>
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <Grid container spacing={2}>
          {subjects.map(subject => {
            return (
              <Grid item xs={12} sm={3} key={subject._id}>
                <CustomSmallPaper
                  className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
                  onClick={() =>
                    history.push(
                      `/dashboard/question-bank/allsubjects/${subject.subject}`
                    )
                  }
                >
                  <CardContent className={classes.cardContent}>
                    <Typography color='primary' variant='h5'>
                      {subject.subject}
                    </Typography>
                  </CardContent>
                </CustomSmallPaper>
              </Grid>
            );
          })}
        </Grid>
      </PageContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    allQuestions: store.questionBankInfo.allQuestions,
    subjects: store.subjectsInfo.subjects,
    statFetched: store.statsInfo.statFetched,
    countStat: store.statsInfo.countStat
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { retrieveStats, fetchSubjectList, fetchQuestions },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(QuestionBank)));
