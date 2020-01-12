import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";

const customStyling = makeStyles(theme => ({
  flatButtonClass: {
    boxShadow: theme.shadows[0]
  },
  customPaper: {
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden"
  },
  pageContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    position: "relative"
  },
  contentPaper: {
    overflow: "hidden",
    position: "relative"
  },
  widgetTitle: {
    fontFamily: '"Helvetica 85 Heavy", "Helvetica", sans-serif',
    fontSize: "1.8rem",
    fontWeight: "900",
    marginBottom: "0.5em"
  },
  smallWidgetTitle: {
    fontSize: "1.5rem"
  },
  progressContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    backgroundColor: "#ffffff66"
  },
  progressGrid: {
    height: "100%"
  },
  progressHidden: {
    display: "none"
  }
}));

export function PageContainer(props) {
  const classes = customStyling();
  const { children, className, ...rest } = props;

  return (
    <Container {...rest} className={`${classes.pageContainer} ${className}`}>
      {children}
    </Container>
  );
}

export function FlatButton(props) {
  const classes = customStyling();
  const { children, className, ...rest } = props;

  return (
    <Button {...rest} className={`${classes.flatButtonClass} ${className}`}>
      {children}
    </Button>
  );
}

export function CustomPaper(props) {
  const classes = customStyling();
  const { children, className, ...rest } = props;

  return (
    <Paper
      className={`${classes.customPaper} ${className}`}
      elevation={10}
      {...rest}
    >
      {children}
    </Paper>
  );
}

export function CustomSmallPaper(props) {
  const classes = customStyling();
  const { children, className, elevation, ...rest } = props;

  return (
    <Paper
      className={`${classes.contentPaper} ${className}`}
      elevation={elevation ? elevation : 3}
      {...rest}
    >
      {children}
    </Paper>
  );
}

export function WidgetTitle(props) {
  const classes = customStyling();
  const { children, className, small, ...rest } = props;

  return (
    <Typography
      variant='h4'
      className={`${classes.widgetTitle} ${
        small ? classes.smallWidgetTitle : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Typography>
  );
}

WidgetTitle.propTypes = {
  small: PropTypes.bool
};

export function FullBodyLoader(props) {
  const classes = customStyling();
  const { className, active, ...rest } = props;

  return (
    <div
      className={`${classes.progressContainer} ${
        active ? "" : classes.progressHidden
      }`}
      {...rest}
    >
      <Grid
        container
        className={classes.progressGrid}
        direction='row'
        justify='center'
        alignItems='center'
      >
        <CircularProgress className={classes.progress} color='secondary' />
      </Grid>
    </div>
  );
}

FullBodyLoader.propTypes = {
  active: PropTypes.bool
};

export function ConfirmDialog(props) {
  const { title, description, active, onClose, onSubmit } = props;

  return (
    <Dialog
      open={active}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onSubmit} color='primary' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export function numberToAlphabet(index) {
  const alphabets = "ABCDEF";

  return alphabets[index];
}

numberToAlphabet.propTypes = {
  index: PropTypes.number
};
