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

import { fetchOfficeList, deleteOfficeInfo } from "../../actions/officeActions";
import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

import AddNewForm from "./addNewForm";
import UpdateOffice from "./updateOffice";

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
  }
});

class Office extends Component {
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
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    if (this.props.offices.length == 0) {
      this.props.fetchOfficeList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message.length > 0) {
      this.setState({
        message: nextProps.message,
        showMessage: true
      });
    }

    if (this.props.deleted != nextProps.deleted && nextProps.deleted) {
      this.props.fetchOfficeList();
      this.setState({
        deleted: true
      });
    }
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

  onEditClick(selectedIndex, officeId = null) {
    if (officeId) {
      const { offices } = this.props;
      selectedIndex = offices.findIndex(x => x._id === officeId);
    }

    this.setState({
      selected: selectedIndex,
      showUpdate: true
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

  renderOfficeRow() {
    const { offices, classes } = this.props;

    if (offices.length > 0) {
      return offices.map((office, idx) => {
        return (
          <CustomSmallPaper
            key={"office-item-" + idx}
            elevation={2}
            className={classes.dbCardRow}
          >
            <Grid
              container
              direction='row'
              justify='space-between'
              alignItems='center'
            >
              <Grid item xs={1}>
                <img
                  src='/images/database.png'
                  className={classes.dbRowImage}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body1'>{office.name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant='caption'>{office.location}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Grid container direction='row' justify='flex-end'>
                  <IconButton
                    aria-label='edit'
                    size='small'
                    onClick={() => this.onEditClick(idx)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    size='small'
                    onClick={() => this.onDeleteClick(idx)}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </CustomSmallPaper>
        );
      });
    }
  }

  renderOfficeTable() {
    const { offices, classes } = this.props;

    const columns = [
      {
        title: "Name",
        field: "name",
        sorting: false
      },
      {
        title: "Location",
        field: "location",
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
        icon: "edit",
        tooltip: "Edit Index",
        onClick: (event, rowData) => {
          //history.push('/dashboard/index_relation/' + rowData._id + "/edit");
          this.onEditClick(null, rowData._id);
        }
      },
      {
        icon: "delete",
        tooltip: "Delete Index",
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
        title='Created Office List'
        columns={columns}
        data={offices}
        actions={actions}
        options={options}
        components={components}
        style={{ overflow: "hidden" }}
      />
    );
  }

  render() {
    const { classes, fetching, deleting, offices } = this.props;
    const { selected, showMessage, message } = this.state;

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <WidgetTitle>All Office List</WidgetTitle>
            {this.renderOfficeTable()}
            <FullBodyLoader active={fetching || deleting} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <WidgetTitle>Add New Office</WidgetTitle>
            <AddNewForm />
          </Grid>
        </Grid>
        <Modal
          aria-labelledby='office-edit-modal'
          aria-describedby='office-edit-modal'
          disableAutoFocus={true}
          open={this.state.showUpdate}
          onClose={this.onModalClose}
        >
          <UpdateOffice
            selectedOffice={offices[selected]}
            onUpdateComplete={this.onModalClose}
          />
        </Modal>
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
    ...store.officeInfo,
    userType: store.userInfo.type,
    offices: store.officeInfo.offices,
    office: store.userInfo.office_id
  };
}

function mapDispatchToProps(dispatch) {
  // return bindActionCreators({ fetchDBConfigList, setDBConfigToken, deleteDBConfig, fetchOfficeList }, dispatch)
  return bindActionCreators({ fetchOfficeList, deleteOfficeInfo }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Office));
