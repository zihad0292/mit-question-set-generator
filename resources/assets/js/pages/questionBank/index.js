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
import { retrieveStats } from "../../actions/statsActions";

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
    // const {
    //   offices,
    //   dbConfigs,
    //   totalIndex,
    //   type,
    //   office_id,
    //   fetchOfficeList
    // } = this.props;
    // if (offices.length == 0) {
    //   if (type == "admin") {
    //     fetchOfficeList(office_id);
    //   } else {
    //     fetchOfficeList();
    //   }
    // }
  }

  render() {
    const { classes, history } = this.props;

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
          <Grid item xs={12} sm={6}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/question-bank/english")}
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  English
                </Typography>
                <Typography variant='subtitle1'>54 Questions</Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/question-bank/math")}
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Math
                </Typography>
                <Typography variant='subtitle1'>54 Questions</Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/question-bank/physics")}
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Physics
                </Typography>
                <Typography variant='subtitle1'>54 Questions</Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSmallPaper
              className={`${classes.homeWidget} ${classes.alignItemsCenter}`}
              onClick={() => history.push("/dashboard/question-bank/chemistry")}
            >
              <CardContent className={classes.cardContent}>
                <Typography color='primary' variant='h5'>
                  Chemistry
                </Typography>
                <Typography variant='subtitle1'>54 Questions</Typography>
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
    fetched: store.statsInfo.fetched
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ retrieveStats }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(QuestionBank)));
