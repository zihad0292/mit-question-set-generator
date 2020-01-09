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
import Chip from "@material-ui/core/Chip";
import { MessagePopUp } from "../../../components/messagePopUps";

import {
  fetchDataTypes,
  deleteDataType
} from "../../../actions/dataTypesActions";
import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog
} from "../../../components/utils";

import AddNewDataType from "./addNewDataType";
import UpdateDataType from "./updateDataType";

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
  iconWidth: {
    width: "24px"
  }
});

class DataTypes extends Component {
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
    if (this.props.dataTypes.length == 0) {
      this.props.fetchDataTypes();
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
      this.props.fetchDataTypes();
    }
  }

  onDeleteClick(selectedIndex, dataTypeId = null) {
    if (dataTypeId) {
      const { dataTypes } = this.props;
      selectedIndex = dataTypes.findIndex(x => x._id === dataTypeId);
    }

    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteSubmit() {
    const { dataTypes } = this.props;
    const { selected } = this.state;
    console.log(selected);

    this.props.deleteDataType(dataTypes[selected]._id);

    this.setState({
      confirm: false
    });
  }

  onEditClick(selectedIndex, dataTypeId = null) {
    if (dataTypeId) {
      const { dataTypes } = this.props;
      selectedIndex = dataTypes.findIndex(x => x._id === dataTypeId);
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

  renderDataTypeTable() {
    const { dataTypes, classes } = this.props;

    const columns = [
      {
        title: "Data Type",
        field: "dataType",
        sorting: false
      },
      {
        title: "Enabled",
        field: "enabled",
        sorting: false,
        render: rowData => {
          return (
            <Chip
              variant='outlined'
              color={rowData.enabled ? "secondary" : "default"}
              label={rowData.enabled ? "Enabled" : "Disabled"}
              size='small'
              icon={
                <Icon className={classes.iconWidth}>fiber_manual_record</Icon>
              }
            />
          );
        }
      },
      {
        title: "Has Credentials",
        field: "hasCredentials",
        sorting: false,
        render: rowData => {
          return (
            <Chip
              variant='outlined'
              color={rowData.hasCredentials ? "secondary" : "default"}
              label={rowData.hasCredentials ? "Yes" : "No"}
              size='small'
              icon={
                <Icon className={classes.iconWidth}>fiber_manual_record</Icon>
              }
            />
          );
        }
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
      },
      Action: props => {
        if (props.action.icon === "edit") {
          return (
            <IconButton
              aria-label='delete'
              size='small'
              disabled={
                props.data.dataType.toLowerCase() === "html" ||
                props.data.dataType.toLowerCase() === "plain" ||
                props.data.dataType.toLowerCase() === "base64" ||
                props.data.dataType.toLowerCase() === "encryption" ||
                props.data.dataType.toLowerCase() === "ftp" ||
                props.data.dataType.toLowerCase() === "sftp"
              }
              onClick={event => props.action.onClick(event, props.data)}
            >
              <Icon>edit</Icon>
            </IconButton>
          );
        } else {
          return (
            <IconButton
              aria-label='delete'
              size='small'
              disabled={
                props.data.dataType.toLowerCase() === "html" ||
                props.data.dataType.toLowerCase() === "plain" ||
                props.data.dataType.toLowerCase() === "base64" ||
                props.data.dataType.toLowerCase() === "encryption" ||
                props.data.dataType.toLowerCase() === "ftp" ||
                props.data.dataType.toLowerCase() === "sftp"
              }
              onClick={event => props.action.onClick(event, props.data)}
            >
              <Icon>delete</Icon>
            </IconButton>
          );
        }
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
        title='Created Index List'
        columns={columns}
        data={dataTypes}
        actions={actions}
        options={options}
        components={components}
        style={{ overflow: "hidden" }}
      />
    );
  }

  render() {
    const { classes, fetching, deleting, dataTypes } = this.props;
    const { selected, showMessage, message } = this.state;

    return (
      <PageContainer maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <WidgetTitle>All Data Types List</WidgetTitle>
            {this.renderDataTypeTable()}
            <FullBodyLoader active={fetching || deleting} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <WidgetTitle>Add New Data Type</WidgetTitle>
            <AddNewDataType />
          </Grid>
        </Grid>
        <Modal
          aria-labelledby='dataType-edit-modal'
          aria-describedby='dataType-edit-modal'
          disableAutoFocus={true}
          open={this.state.showUpdate}
          onClose={this.onModalClose}
        >
          <UpdateDataType
            selectedDataType={dataTypes[selected]}
            onUpdateComplete={this.onModalClose}
          />
        </Modal>
        <ConfirmDialog
          title='Confirm Delete?'
          description="Do You Really Want to Delete this Data Type? This means all of the users from this Data Type won't be able to log in and do activity in future."
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
    ...store.dataTypesInfo,
    userType: store.userInfo.type,
    dataTypes: store.dataTypesInfo.dataTypes
  };
}

function mapDispatchToProps(dispatch) {
  // return bindActionCreators({ fetchDBConfigList, setDBConfigToken, deleteDBConfig, fetchDataTypes }, dispatch)
  return bindActionCreators({ fetchDataTypes, deleteDataType }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DataTypes));
