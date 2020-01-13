import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

// import {
//   addNewDataType,
//   fetchDataTypes,
//   updateDataType
// } from "../../../actions/dataTypesActions";
import {
  PageContainer,
  CustomSmallPaper,
  FlatButton
} from "../../components/utils";

const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
    width: "100%"
  },
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
  },
  addIcon: {
    position: "relative",
    top: "-2px"
  },
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      options: [
        {
          option: "",
          is_correct: false
        }
      ],
      optionsCount: 1
    };
    this.populateStateVal = this.populateStateVal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    // const { type } = this.props;

    // if (type == "update") {
    //   this.populateStateVal();
    // }
    console.log("Create question component");
  }

  populateStateVal() {
    const { selectedDataType } = this.props;

    this.setState({
      dataType: selectedDataType.dataType,
      is_correct: selectedDataType.is_correct,
      hasCredentials: selectedDataType.hasCredentials
    });
  }

  componentWillReceiveProps(nextProps) {
    // if (
    //   (this.props.added != nextProps.added && nextProps.added) ||
    //   (this.props.updated != nextProps.updated && nextProps.updated)
    // ) {
    //   this.props.fetchDataTypes();
    //   // console.log(nextProps);
    //   this.setState({
    //     dataType: "",
    //     is_correct: false
    //   });
    // }
    // if (this.props.onComplete) {
    //   this.props.onComplete();
    // }
  }

  handleAddOption() {
    if (this.state.optionsCount === 5) {
      alert("Sorry, you can't take more than 5 options.");
    } else {
      let oldOptions = this.state.options;
      oldOptions.push({
        option: "",
        is_correct: false
      });
      this.setState({
        options: oldOptions,
        optionsCount: this.state.optionsCount + 1
      });
    }
  }

  handleChange(index, event) {
    let oldOptions = this.state.options;
    oldOptions[index].option = event.target.value;
    console.log(index);
    console.log(this.state.options);
    console.log(event.target.value);
    this.setState({
      options: oldOptions
    });
  }

  handleCheckboxChange(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleSubmit() {
    // const { dataType, is_correct, hasCredentials } = this.state;
    // const {
    //   type,
    //   selectedDataType,
    //   addNewDataType,
    //   updateDataType
    // } = this.props;
    // if (dataType.length > 0) {
    //   if (type == "update") {
    //     updateDataType(selectedDataType._id, dataType, is_correct, hasCredentials);
    //   } else {
    //     addNewDataType(dataType, is_correct, hasCredentials);
    //   }
    // }
  }

  render() {
    const { classes } = this.props;
    const { question, options, optionsCount } = this.state;

    const optionsToPrint = options.map((option, index) => {
      return (
        <Grid container spacing={3} key={index}>
          <Grid item xs={10}>
            <TextField
              required
              id={"option-" + index}
              name={"option-" + index}
              label='Option'
              value={options[index].option}
              margin='normal'
              variant='outlined'
              fullWidth
              onChange={event => this.handleChange(index, event)}
            />
          </Grid>
          <Grid item xs={2} className={classes.alignCenter}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={"is-correct-" + index}
                    checked={options[index].is_correct}
                    onChange={this.handleCheckboxChange}
                    value={options[index].is_correct}
                  />
                }
                label='Is Correct?'
              />
            </FormGroup>
          </Grid>
        </Grid>
      );
    });

    return (
      <PageContainer>
        <CustomSmallPaper>
          <div className={classes.cardContent}>
            {optionsToPrint}
            <FlatButton
              variant='contained'
              color='default'
              className={classes.submitButton}
              size='small'
              onClick={this.handleAddOption}
            >
              Add New Option
              <Icon className={`${classes.rightIcon} ${classes.addIcon}`}>
                add
              </Icon>
            </FlatButton>
            <Divider className={classes.root} />
            <FlatButton
              variant='contained'
              color='primary'
              className={classes.submitButton}
              size='large'
              fullWidth
              onClick={this.handleSubmit}
            >
              Save Question
              <Icon className={classes.rightIcon}>save</Icon>
            </FlatButton>
          </div>
        </CustomSmallPaper>
      </PageContainer>
    );
  }
}

CreateQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

// function mapStateToProps(store) {
//   return {
//     added: store.dataTypesInfo.added,
//     adding: store.dataTypesInfo.adding,
//     updating: store.dataTypesInfo.updating,
//     updated: store.dataTypesInfo.updated,
//     dataTypes: store.dataTypesInfo.dataTypes,
//     userType: store.userInfo.type,
//     office: store.userInfo.office_id
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     { addNewDataType, fetchDataTypes, updateDataType },
//     dispatch
//   );
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withStyles(styles)(CreateQuestion));

export default withStyles(styles)(CreateQuestion);
