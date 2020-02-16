/**
 * Created by Zihad Ul Islam Mahdi on 16/2/2020.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";

import { addNewSubject, fetchSubjectList } from "../../actions/subjectActions";
import { CustomSmallPaper, FlatButton } from "../../components/utils";

const styles = theme => ({
  tableTitle: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  cardContent: {
    padding: theme.spacing(0, 2)
  },
  submitButton: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1.5)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
});

class AddNewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { type } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.added != nextProps.added && nextProps.added) ||
      (this.props.updated != nextProps.updated && nextProps.updated)
    ) {
      this.props.fetchSubjectList();
      // console.log(nextProps);
      this.setState({
        name: "",
        location: ""
      });
    }
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit() {
    const { subject } = this.state;
    const { addNewSubject } = this.props;

    if (subject.length > 0) {
      addNewSubject(subject);
    }
  }

  render() {
    const { classes, adding, updating } = this.props;

    return (
      <CustomSmallPaper>
        <div className={classes.cardContent}>
          <TextField
            required
            id='subject'
            name='subject'
            label='Subject'
            value={this.state.subject}
            margin='normal'
            variant='outlined'
            fullWidth
            onChange={this.handleChange}
          />
          <FlatButton
            variant='contained'
            color='primary'
            disabled={adding || updating}
            className={classes.submitButton}
            minH
            size='large'
            fullWidth
            onClick={this.handleSubmit}
          >
            Save
            <Icon className={classes.rightIcon}>save</Icon>
          </FlatButton>
        </div>
      </CustomSmallPaper>
    );
  }
}

AddNewForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onComplete: PropTypes.func
};

function mapStateToProps(store) {
  return {
    added: store.subjectsInfo.added,
    adding: store.subjectsInfo.adding,
    subjects: store.subjectsInfo.subjects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNewSubject, fetchSubjectList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddNewForm));
