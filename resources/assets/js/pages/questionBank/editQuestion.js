import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";

import Paper from "@material-ui/core/Paper";
// import { WidgetTitle, FullBodyLoader } from "../../../components/utils";

import CreateQuestion from "./createQuestion";

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 400,
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: theme.spacing(2)
  },
  wrapper: {
    position: "relative"
  },
  closeIcon: {
    cursor: "pointer",
    position: "absolute",
    top: "30px",
    right: "25px",
    zIndex: "1"
  }
});

class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedQuestion: null
    };
  }

  componentDidMount() {
    if (this.props.selectedQuestion) {
      this.setState({
        loading: false,
        selectedQuestion: this.props.selectedQuestion
      });
    }
  }
  render() {
    const { loading, selectedQuestion } = this.state;
    const { classes } = this.props;
    if (loading) {
      return "Loading...";
    }

    return (
      <div className={classes.wrapper}>
        <CloseIcon
          color='secondary'
          fontSize='large'
          className={classes.closeIcon}
          onClick={this.props.onEditClose}
        />
        <CreateQuestion
          type='edit'
          selectedQuestion={selectedQuestion}
          onEditClose={this.props.onEditClose}
        />
      </div>
    );
  }
}

EditQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditQuestion);
