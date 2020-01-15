import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";

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
    const selectedQuestion = JSON.parse(this.props.match.params.question);
    if (selectedQuestion) {
      this.setState({
        loading: false,
        selectedQuestion: selectedQuestion
      });
    }
  }
  render() {
    const { loading, selectedQuestion } = this.state;
    if (loading) {
      return "Loading...";
    }

    return <CreateQuestion type='edit' selectedQuestion={selectedQuestion} />;
  }
}

EditQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditQuestion);
