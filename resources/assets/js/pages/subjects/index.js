/**
 * Created by Zihad Ul Islam Mahdi on 16/2/2020.
 */

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

import { fetchSubjectList, deleteSubject } from "../../actions/subjectActions";
import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

import AddNewForm from "./addNewForm";

const styles = theme => ({
  root: {
    width: "100%"
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
    height: 30
  }
});

class AllSubjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdate: false,
      selected: null,
      confirm: false,
      message: "",
      showMessage: false
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    if (this.props.subjects.length == 0) {
      this.props.fetchSubjectList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message.length > 0) {
      this.setState({
        message: nextProps.message
        // showMessage: true
      });
    }

    if (this.props.deleted != nextProps.deleted && nextProps.deleted) {
      this.props.fetchSubjectList();
      this.setState({
        deleted: true
      });
    }
  }

  onDeleteClick(selectedIndex) {
    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteSubmit() {
    const { subjects } = this.props;
    const { selected } = this.state;

    this.props.deleteSubject(selected);

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

  renderSubjectsTable() {
    const { subjects, classes } = this.props;

    const columns = [
      {
        title: "All Subjects",
        field: "subject",
        cellStyle: rowData => ({
          textTransform: "capitalize"
        }),
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
        icon: "delete",
        tooltip: "Delete Index",
        onClick: (event, rowData) => {
          this.onDeleteClick(rowData._id);
        }
      }
    ];

    const options = {
      search: false,
      showTitle: false,
      actionsColumnIndex: -1,
      searchFieldStyle: {
        color: "#fff"
      }
    };

    return (
      <MaterialTable
        title='Subject List'
        columns={columns}
        data={subjects}
        actions={actions}
        options={options}
        components={components}
        style={{ overflow: "hidden" }}
      />
    );
  }

  render() {
    const { classes, fetching, deleting, subjects } = this.props;
    const { showMessage, message } = this.state;

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant='h4'
              color='textPrimary'
              className={classes.subjectTitle}
            >
              All Subjects
            </Typography>
            {this.renderSubjectsTable()}
            <FullBodyLoader active={fetching || deleting} />
          </Grid>
          <Divider className={classes.root} />
          <Grid item xs={12} sm={4}>
            <WidgetTitle>Add New Subject</WidgetTitle>
            <AddNewForm />
          </Grid>
        </Grid>
        <ConfirmDialog
          title='Confirm Delete?'
          description="Do You Really Want to Delete this Office? This means all of the users from this office won't be able to log in and do activity in future."
          active={this.state.confirm}
          onClose={this.onModalClose}
          onSubmit={this.onDeleteSubmit}
        />

        <MessagePopUp
          visible={showMessage}
          variant='success'
          onClose={this.handleMessageClose}
          message={message}
        />
      </PageContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.subjectsInfo,
    subjects: store.subjectsInfo.subjects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchSubjectList, deleteSubject }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AllSubjects));
