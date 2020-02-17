import React, { Component } from "react";
import { render } from "react-dom";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

// Layout components
import TopBar from "./components/topBar";
import Sidebar from "./components/sidebar";

// Page components
import Landing from "./pages/landing";
import AllSubjects from "./pages/subjects/";
import QuestionBank from "./pages/questionBank/";
import QuestionBankCategory from "./pages/questionBank/category";
import CreateQuestion from "./pages/questionBank/createQuestion";
// import EditQuestion from "./pages/questionBank/editQuestion";
import QuestionSets from "./pages/questionSets";
import CreateQuestionSet from "./pages/questionSets/createQuestionSet";
import NotFound from "./pages/notfound";

// Actions
import { fetchSubjectList } from "./actions/subjectActions";
import {
  retrieveStats,
  retrieveQuestionSetStats
} from "./actions/statsActions";

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  routeContainer: {
    paddingLeft: 240
  }
});

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // fetching: true,
      openMenu: true
    };
  }

  componentDidMount() {
    const { statFetched, retrieveStats, subjects } = this.props;
    if (subjects.length === 0) {
      console.log("once");
      this.props.fetchSubjectList();
    }
    retrieveStats();
    retrieveQuestionSetStats();
    console.log(subjects);
  }

  componentWillReceiveProps(nextProps) {
    const { statFetched } = nextProps;

    if (statFetched) {
      this.setState({
        fetching: false
      });
    }
  }
  render() {
    const { fetching, openMenu } = this.state;
    const { classes } = this.props;

    if (fetching) {
      return (
        <Grid
          container
          spacing={0}
          direction='column'
          alignItems='center'
          justify='center'
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <img src='/images/preloader.gif' />
          </Grid>
        </Grid>
      );
    }

    return (
      <div>
        <TopBar onToggleClick={() => this.setState({ openMenu: !openMenu })} />
        <div className={classes.toolbar} />
        <Sidebar isOpen={openMenu} />
        <div className={classes.routeContainer}>
          <Switch>
            <Route exact path='/dashboard' component={Landing} />
            <Route
              exact
              path='/dashboard/question-bank/allsubjects'
              component={QuestionBank}
            />
            <Route exact path='/dashboard/subjects' component={AllSubjects} />
            {/* <Route
              exact
              path='/dashboard/base-questions'
              component={BaseQuestions}
            /> */}
            <Route
              path='/dashboard/question-bank/allsubjects/:subject'
              component={QuestionBankCategory}
            />
            <Route
              path='/dashboard/question-bank/create/:subject'
              component={CreateQuestion}
            />
            {/* <Route
              path='/dashboard/question-bank/edit'
              component={EditQuestion}
            /> */}
            <Route
              exact
              path='/dashboard/question-sets'
              component={QuestionSets}
            />
            <Route
              path='/dashboard/question-sets/generate-new'
              component={CreateQuestionSet}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    subjects: store.subjectsInfo.subjects,
    statFetched: store.statsInfo.statFetched
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { retrieveStats, retrieveQuestionSetStats, fetchSubjectList },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
