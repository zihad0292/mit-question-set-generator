import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IntegrationReactSelect from "../../../components/IntegrationReactSelect";

import {
  addNewDataType,
  fetchDataTypes,
  updateDataType
} from "../../../actions/dataTypesActions";
import { CustomSmallPaper, FlatButton } from "../../../components/utils";

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
      dataType: "",
      enabled: false,
      hasCredentials: false
    };
    this.populateStateVal = this.populateStateVal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    const { type } = this.props;

    if (type == "update") {
      this.populateStateVal();
    }
  }

  populateStateVal() {
    const { selectedDataType } = this.props;

    this.setState({
      dataType: selectedDataType.dataType,
      enabled: selectedDataType.enabled,
      hasCredentials: selectedDataType.hasCredentials
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.added != nextProps.added && nextProps.added) ||
      (this.props.updated != nextProps.updated && nextProps.updated)
    ) {
      this.props.fetchDataTypes();
      // console.log(nextProps);
      this.setState({
        dataType: "",
        enabled: false
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

  handleCheckboxChange(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleSubmit() {
    const { dataType, enabled, hasCredentials } = this.state;
    const {
      type,
      selectedDataType,
      addNewDataType,
      updateDataType
    } = this.props;

    if (dataType.length > 0) {
      if (type == "update") {
        updateDataType(selectedDataType._id, dataType, enabled, hasCredentials);
      } else {
        addNewDataType(dataType, enabled, hasCredentials);
      }
    }
  }

  render() {
    const { classes, adding, updating, type } = this.props;
    return (
      <CustomSmallPaper>
        <div className={classes.cardContent}>
          <TextField
            required
            id='data-type'
            name='dataType'
            label='Data Type'
            value={this.state.dataType}
            margin='normal'
            variant='outlined'
            fullWidth
            onChange={this.handleChange}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name='enabled'
                  checked={this.state.enabled}
                  onChange={this.handleCheckboxChange}
                  value={this.state.enabled}
                />
              }
              label='Enabled'
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name='hasCredentials'
                  checked={this.state.hasCredentials}
                  onChange={this.handleCheckboxChange}
                  value={this.state.hasCredentials}
                />
              }
              label='Has Credentials'
            />
          </FormGroup>
          <FlatButton
            variant='contained'
            color='primary'
            disabled={adding || updating}
            className={classes.submitButton}
            size='large'
            fullWidth
            onClick={this.handleSubmit}
          >
            {type === "update" ? "Update" : "Save"}
            <Icon className={classes.rightIcon}>save</Icon>
          </FlatButton>
        </div>
      </CustomSmallPaper>
    );
  }
}

AddNewForm.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["add", "update"]),
  selecteddataType: PropTypes.object,
  onComplete: PropTypes.func
};

function mapStateToProps(store) {
  return {
    added: store.dataTypesInfo.added,
    adding: store.dataTypesInfo.adding,
    updating: store.dataTypesInfo.updating,
    updated: store.dataTypesInfo.updated,
    dataTypes: store.dataTypesInfo.dataTypes,
    userType: store.userInfo.type,
    office: store.userInfo.office_id
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { addNewDataType, fetchDataTypes, updateDataType },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddNewForm));
