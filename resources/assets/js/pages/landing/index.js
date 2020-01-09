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
  media: {
    height: "100%"
  },
  homeWidget: {
    height: 500
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    marginBottom: theme.spacing(5)
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
  }
});

class Landing extends Component {
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <CustomSmallPaper className={classes.homeWidget}>
              <CardMedia
                className={classes.media}
                image='/images/welcome.png'
                title='welcome'
              />
              <CardContent className={classes.cardContent}>
                <WidgetTitle color='primary' className={classes.titleStyle}>
                  Welcome
                </WidgetTitle>
                <Typography variant='subtitle1'>Placeholder</Typography>
                <Typography variant='subtitle2'>Placeholder</Typography>
              </CardContent>
            </CustomSmallPaper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2} direction='column'>
              <Grid item>
                <CustomSmallPaper className={classes.smallWidgetStyle}>
                  <Grid
                    container
                    direction='column'
                    justify='center'
                    alignItems='center'
                    style={{ height: "100%" }}
                  >
                    <WidgetTitle
                      color='primary'
                      className={classes.statTitleStyle}
                      align='center'
                    >
                      Placeholder
                    </WidgetTitle>
                    <WidgetTitle small align='center'>
                      Database Configs
                    </WidgetTitle>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        history.push("/dashboard/database/");
                      }}
                    >
                      View More
                    </Button>
                  </Grid>
                </CustomSmallPaper>
              </Grid>
              <Grid item>
                <CustomSmallPaper className={classes.smallWidgetStyle}>
                  <Grid
                    container
                    direction='column'
                    justify='center'
                    alignItems='center'
                    style={{ height: "100%" }}
                  >
                    <WidgetTitle
                      color='primary'
                      className={classes.statTitleStyle}
                      align='center'
                    >
                      Placeholder
                    </WidgetTitle>
                    <WidgetTitle small align='center'>
                      Total Index Relation
                    </WidgetTitle>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        history.push("/dashboard/index_relation/");
                      }}
                    >
                      View More
                    </Button>
                  </Grid>
                </CustomSmallPaper>
              </Grid>
            </Grid>
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
)(withRouter(withStyles(styles)(Landing)));
