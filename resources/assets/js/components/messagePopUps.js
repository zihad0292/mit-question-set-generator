import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

export function MessagePopUp(props) {
  const classes = useStyles1();
  const { visible, message, onClose, variant } = props;
  const MessageIcon = variantIcon[variant];

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={visible}
      autoHideDuration={10000}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes[variant]}
        message={
          <span id='client-snackbar' className={classes.message}>
            <MessageIcon className={classes.iconVariant} />
            {message}
          </span>
        }
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
}

MessagePopUp.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
};
