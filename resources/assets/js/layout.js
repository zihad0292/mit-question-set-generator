import React, { Component } from "react";
import { render } from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import PrivateRoute from "./privateRoute";
import TopBar from "./components/topBar";
import Sidebar from "./components/sidebar";
import Landing from "./pages/landing";
import About from "./pages/about";
import Office from "./pages/office";
import Users from "./pages/users";
import DBConfig from "./pages/dbConfig";
import IndexRelation from "./pages/indexRelations";
import CreateIndexRelation from "./pages/indexRelations/create";
import UpdateIndexRelation from "./pages/indexRelations/update";
import Stats from "./pages/stats";
import Crawler from "./pages/crawler";
import Search from "./pages/search";
import DataTypes from "./pages/dataTypes/all";
import Credentials from "./pages/dataTypes/credentials";
import NotFound from "./pages/notfound";

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
    const { fetched, isLoggedIn } = this.props;
    if (!fetched && !isLoggedIn) {
      this.props.retrieveSessionInfo();
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
            <PrivateRoute exact path='/dashboard/' component={Landing} />
            <PrivateRoute path='/dashboard/home' component={Landing} />
            <PrivateRoute path='/dashboard/office' component={Office} />
            <PrivateRoute path='/dashboard/users' component={Users} />
            <PrivateRoute path='/dashboard/database' component={DBConfig} />
            <PrivateRoute
              path='/dashboard/index_relation/:dbConfig/new'
              component={CreateIndexRelation}
            />
            <PrivateRoute
              path='/dashboard/index_relation/:index/edit'
              component={UpdateIndexRelation}
            />
            <PrivateRoute
              path='/dashboard/index_relation'
              component={IndexRelation}
            />
            <PrivateRoute path='/dashboard/stats/indexes' component={Stats} />
            <PrivateRoute path='/dashboard/stats/crawler' component={Crawler} />
            <PrivateRoute path='/dashboard/search' component={Search} />
            <PrivateRoute path='/dashboard/about' component={About} />
            <PrivateRoute
              path='/dashboard/data-types/all'
              component={DataTypes}
            />
            <PrivateRoute
              path='/dashboard/data-types/credentials'
              component={Credentials}
            />
            <PrivateRoute component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Layout);
