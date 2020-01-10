import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const drawerWidth = 240;

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: {
    backgroundColor: "#fafafa",
    borderRight: "1px solid rgba(0, 0, 0, 0.05)"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  selectedItem: {
    backgroundColor: theme.palette.grey[300]
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  fontSize: {
    fontSize: ".8em!important"
  }
});

const Pages = [
  {
    title: "Home",
    url: "/home",
    icon: "home"
  },
  {
    title: "Question Bank",
    url: "/question-bank",
    icon: "collections_icon"
  },
  {
    title: "Question Sets",
    url: "/question-sets",
    icon: "filter_none_icon"
  }
];
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.onLinkClick = this.onLinkClick.bind(this);
  }

  onLinkClick(url) {
    if (url === "/home") {
      this.props.history.push("/dashboard/");
    } else this.props.history.push("/dashboard" + url + "/");
  }

  render() {
    const { classes, isOpen } = this.props;
    const currentPath = this.props.location.pathname;

    const menuItems = Pages.map((page, index) => {
      return (
        <ListItem
          button
          key={index}
          link={page.url}
          className={currentPath.includes(page.url) ? classes.selectedItem : ""}
          onClick={e => {
            page.url ? this.onLinkClick(page.url) : null;
          }}
        >
          {page.icon && (
            <ListItemIcon>
              <Icon>{page.icon}</Icon>
            </ListItemIcon>
          )}
          <ListItemText inset={page.inset} primary={page.title} />
        </ListItem>
      );
    });

    return (
      <Drawer
        variant='permanent'
        className={`${classes.drawer} ${
          isOpen ? classes.drawerOpen : classes.drawerClose
        }`}
        classes={{
          paper: `${isOpen ? classes.drawerOpen : classes.drawerClose} ${
            classes.drawerPaper
          }`
        }}
      >
        <div className={classes.toolbar} />
        <List>{menuItems}</List>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool
};

export default withRouter(withStyles(styles)(Sidebar));
