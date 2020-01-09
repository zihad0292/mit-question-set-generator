import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import { WidgetTitle, FullBodyLoader } from "../../../components/utils";

import AddNewDataType from "./addNewDataType";

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 400,
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: theme.spacing(2)
  }
});

class UpdateDataType extends Component {
  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
  }

  onComplete() {
    this.props.onUpdateComplete();
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <WidgetTitle>Update Data Type Info</WidgetTitle>
        <AddNewDataType
          type='update'
          selectedDataType={this.props.selectedDataType}
          onComplete={this.onComplete}
        />
      </Paper>
    );
  }
}

UpdateDataType.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedDataType: PropTypes.object.isRequired,
  onUpdateComplete: PropTypes.func.isRequired
};

export default withStyles(styles)(UpdateDataType);
