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
// import QuestionBank from "./pages/questionBank";
// import CreateQuestion from "./pages/questionBank/createQuestion";
// import EditQuestion from "./pages/questionBank/editQuestion";
// import QuestionSets from "./pages/questionSets";
// import CreateQuestionSet from "./pages/questionSets/createQuestionSet";
import NotFound from "./pages/notfound";

// Actions
import { retrieveStats } from "./actions/statsActions";

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
      fetching: true,
      openMenu: true
    };
  }

  componentWillReceiveProps(nextProps) {
    const { fetched } = nextProps;

    if (fetched) {
      this.setState({
        fetching: false
      });
    }
  }

  componentDidMount() {
    const { fetched } = this.props;
    if (!fetched) {
      this.props.retrieveStats();
    } else {
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
            {/* <Route path='/question-bank' component={QuestionBank} />
            <Route path='/question-bank/create' component={CreateQuestion} />
            <Route
              path='/question-bank/edit/:question_id'
              component={EditQuestion}
            /> */}
            {/* <Route path='/question-sets' component={QuestionSets} />
            <Route path='/question-sets/create' component={CreateQuestionSet} /> */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
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
)(withStyles(styles)(Layout));
