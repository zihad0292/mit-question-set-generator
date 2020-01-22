import React, { Component } from "react";
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
  fetchQuestionSets,
  deleteQuestionSet
} from "../../actions/questionSetActions";
import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog,
  FlatButton
} from "../../components/utils";

// import AddNewForm from "./addNewForm";

const styles = theme => ({
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
    backgroundImage: "url('/images/index-relation-banner.png')",
    minHeight: 140,
    backgroundSize: "cover"
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

class QuestionSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSets: [],
      showUpdate: false,
      selected: null,
      confirm: false,
      message: "",
      showMessage: false
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.onViewClick = this.onViewClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    // if (this.props.offices.length == 0) {
    //   this.props.fetchOfficeList();
    // }
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

  onViewClick(selectedIndex, officeId = null) {
    if (officeId) {
      const { offices } = this.props;
      selectedIndex = offices.findIndex(x => x._id === officeId);
    }

    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteClick(selectedIndex, officeId = null) {
    if (officeId) {
      const { offices } = this.props;
      selectedIndex = offices.findIndex(x => x._id === officeId);
    }

    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteSubmit() {
    const { offices } = this.props;
    const { selected } = this.state;

    this.props.deleteOfficeInfo(offices[selected]._id);

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

  renderQuestionSets() {
    const { questionSets, classes } = this.props;

    const columns = [
      {
        title: "Name",
        field: "question_set_name",
        sorting: false
      },
      {
        title: "Created on",
        field: "created_at",
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
          this.onViewClick(null, rowData._id);
        }
      },
      {
        icon: "delete",
        tooltip: "Delete this Set",
        onClick: (event, rowData) => {
          this.onDeleteClick(null, rowData._id);
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
        title='Question sets'
        columns={columns}
        data={questionSets}
        actions={actions}
        options={options}
        components={components}
        style={{ overflow: "hidden" }}
      />
    );
  }

  render() {
    const { classes, fetching, deleting, questionSets } = this.props;
    const { selected, showMessage, message } = this.state;

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3} className={classes.statFirstRow}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              All Question Sets
              <FlatButton
                variant='contained'
                color='primary'
                className={classes.buttonStyles}
                size='medium'
                onClick={() =>
                  history.push("/dashboard/question-sets/generate-new")
                }
              >
                Generate New
                <AddIcon className={classes.buttonIcon} />
              </FlatButton>
            </Typography>
          </Grid>
          <Divider className={classes.root} />
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={10} className={classes.relativeContainer}>
            {this.renderQuestionSets()}
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
        </Grid>
        <ConfirmDialog
          title='Confirm Delete?'
          description='Do You Really Want to Delete this Question Set?'
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
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.questionSetInfo,
    questionSets: store.questionSetInfo.questionSets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchQuestionSets, deleteQuestionSet }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QuestionSet));
