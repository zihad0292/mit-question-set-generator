import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MaterialTable, { MTableToolbar } from "material-table";
import { MessagePopUp } from "../../components/messagePopUps";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";

import {
  fetchBaseQuestions,
  deleteBaseQuestion
} from "../../actions/baseQuestionActions";

import { fetchQuestions } from "../../actions/questionBankActions";

import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog,
  FlatButton
} from "../../components/utils";

import ViewBaseQuestion from "./viewBaseQuestion";

const styles = theme => ({
  root: {
    width: "100%"
  },
  titleRow: {
    marginBottom: theme.spacing(3)
  },
  tableTitle: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  relativeContainer: {
    position: "relative"
  },
  media: {
    height: 260
  },
  title: {
    position: "absolute",
    bottom: 125,
    padding: theme.spacing(2),
    width: "60%",
    color: theme.palette.primary.dark
  },
  dbCardRow: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0)
  },
  dbRowImage: {
    width: 40
  },
  cardContent: {
    height: 120,
    overflow: "hidden"
  },
  enableText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  enableIcon: {
    position: "relative",
    top: -1,
    marginRight: theme.spacing(0.5)
  },
  cardButton: {
    margin: theme.spacing(0.5)
  },
  toolbarStyle: {
    backgroundImage: "url('/images/banner.jpg')",
    minHeight: 140,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  buttonStyles: {
    padding: "8px 15px 6px",
    marginLeft: "10px"
  },
  buttonIcon: {
    position: "relative",
    top: "-3px"
  }
});

class BaseQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseQuestions: [],
      showUpdate: false,
      selected: null,
      confirm: false,
      message: "",
      showMessage: false,
      viewBaseQuestion: false,
      baseQuestionDetails: null
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.onViewClick = this.onViewClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    const { fetchBaseQuestions, baseQuestions } = this.props;
    // Fetch question set only if respective BaseQuestion state is empty
    if (baseQuestions.length === 0) {
      fetchBaseQuestions();
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.message && nextProps.message.length > 0) {
    //   this.setState({
    //     message: nextProps.message,
    //     showMessage: true
    //   });
    // }
    // if (this.props.deleted != nextProps.deleted && nextProps.deleted) {
    //   this.props.fetchOfficeList();
    //   this.setState({
    //     deleted: true
    //   });
    // }
  }

  onViewClick(selectedIndex) {
    this.setState({
      baseQuestionDetails: selectedIndex,
      viewBaseQuestion: true
    });
  }

  onDeleteClick(selectedIndex) {
    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteSubmit() {
    const { selected } = this.state;

    this.props.deleteBaseQuestion(selected);

    this.setState({
      confirm: false
    });
  }

  onModalClose() {
    this.setState({
      showUpdate: false,
      confirm: false
    });
  }

  handleMessageClose() {
    this.setState({
      showMessage: false
    });
  }

  renderBaseQuestions() {
    const { baseQuestions, classes } = this.props;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let baseQuestionsToRender = [];

    if (baseQuestions.length > 0) {
      baseQuestionsToRender = baseQuestions.map(baseQuestion => {
        let d = new Date(baseQuestion.created_at);
        return {
          ...baseQuestion,
          date: `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
        };
      });
    }

    const columns = [
      {
        title: "Name",
        field: "baseQuestionName",
        sorting: false
      },
      {
        title: "Created on",
        field: "date",
        sorting: false
      }
    ];

    const components = {
      Toolbar: props => (
        <div className={classes.toolbarStyle}>
          <MTableToolbar {...props} />
        </div>
      ),
      Container: props => {
        return (
          <CustomSmallPaper style={props.style}>
            {props.children}
          </CustomSmallPaper>
        );
      }
    };

    const actions = [
      {
        icon: "visibility",
        tooltip: "View",
        onClick: (event, rowData) => {
          this.onViewClick(rowData);
        }
      },
      {
        icon: "delete",
        tooltip: "Delete this Base Question",
        onClick: (event, rowData) => {
          this.onDeleteClick(rowData._id);
        }
      }
    ];

    const options = {
      showTitle: false,
      actionsColumnIndex: -1,
      searchFieldStyle: {
        color: "#fff"
      }
    };

    return (
      <MaterialTable
        title="Base Questions"
        columns={columns}
        data={baseQuestionsToRender}
        actions={actions}
        options={options}
        components={components}
        style={{ overflow: "hidden" }}
      />
    );
  }

  render() {
    const { classes, fetching, deleting, baseQuestions, history } = this.props;
    const { selected, showMessage, message, viewBaseQuestion } = this.state;

    return (
      <Fragment>
        {!viewBaseQuestion && (
          <PageContainer maxWidth="lg">
            <Grid container spacing={3} className={classes.titleRow}>
              <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                <Typography
                  variant="h4"
                  color="textPrimary"
                  className={classes.subjectTitle}
                >
                  All Base Questions
                  <FlatButton
                    variant="contained"
                    color="primary"
                    className={classes.buttonStyles}
                    size="medium"
                    onClick={() =>
                      history.push("/dashboard/base-questions/create-new")
                    }
                  >
                    Create New
                    <AddIcon className={classes.buttonIcon} />
                  </FlatButton>
                </Typography>
              </Grid>
              <Divider className={classes.root} />
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={10} className={classes.relativeContainer}>
                {this.renderBaseQuestions()}
                {/* <FullBodyLoader active={fetching || deleting} /> */}
              </Grid>
            </Grid>
            <ConfirmDialog
              title="Confirm Delete?"
              description="Do You Really Want to Delete this Base Question?"
              active={this.state.confirm}
              onClose={this.onModalClose}
              onSubmit={this.onDeleteSubmit}
            />

            {/* <MessagePopUp
          visible={showMessage}
          variant='success'
          onClose={this.handleMessageClose}
          message={message}
        /> */}
          </PageContainer>
        )}
        {viewBaseQuestion && (
          <ViewBaseQuestion
            baseQuestionDetails={this.state.baseQuestionDetails}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.baseQuestionInfo,
    baseQuestions: store.baseQuestionInfo.baseQuestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchQuestions, fetchBaseQuestions, deleteBaseQuestion },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BaseQuestion));
