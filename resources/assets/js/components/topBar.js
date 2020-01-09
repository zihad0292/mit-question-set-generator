import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, onToggleClick } = this.props;

    return (
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='Menu'
            disabled
            onClick={onToggleClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Admission Question Set Generator
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  onToggleClick: PropTypes.func
};

export default withStyles(styles)(TopBar);
