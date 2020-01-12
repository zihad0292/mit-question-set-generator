import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import DeleteIcon from "@material-ui/icons/Delete";

import {
  fetchQuestions,
  deleteQuestion
} from "../../actions/questionBankActions";

import {
  PageContainer,
  CustomSmallPaper,
  WidgetTitle,
  FullBodyLoader,
  ConfirmDialog
} from "../../components/utils";

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
    height: "auto",
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
  subjectTitle: {
    textTransform: "uppercase"
  },
  questionContainer: {
    marginTop: "20px"
  },
  questionWrapper: {
    width: "100%"
  }
});

class QuestionBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      questions: [],
      selected: null,
      confirm: false
    };

    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
  }

  componentDidMount() {
    const subject = this.props.match.params.subject;
    this.setState({
      subject: subject
    });

    // Fetch questions only if respective question state is empty
    if (subject === "english" && this.props.englishQuestions.length === 0) {
      this.props.fetchQuestions(subject);
    } else if (subject === "math" && this.props.mathQuestions.length === 0) {
      this.props.fetchQuestions(subject);
    } else if (
      subject === "physics" &&
      this.props.physicsQuestions.length === 0
    ) {
      this.props.fetchQuestions(subject);
    } else if (
      subject === "chemistry" &&
      this.props.chemistryQuestions.length === 0
    ) {
      this.props.fetchQuestions(subject);
    }
  }

  onDeleteClick(selectedIndex) {
    this.setState({
      selected: selectedIndex,
      confirm: true
    });
  }

  onDeleteSubmit() {
    const { selected } = this.state;

    this.props.deleteQuestion(selected._id);

    this.setState({
      confirm: false
    });
  }

  onEditClick(selectedIndex) {
    console.log("Redirect to edit page");
    alert("Redirect to edit page");
  }

  renderQuestions() {
    const { classes } = this.props;

    const subject = this.state.subject;
    let questionsToRender = [];

    if (subject === "english") {
      questionsToRender = this.props.englishQuestions;
    } else if (subject === "math") {
      questionsToRender = this.props.mathQuestions;
    } else if (subject === "physics") {
      questionsToRender = this.props.physicsQuestions;
    } else {
      questionsToRender = this.props.chemistryQuestions;
    }
    console.log("From renderQuestion function" + questionsToRender);
  }

  render() {
    const { classes, fetching, deleting } = this.props;
    const { selected, subject } = this.state;

    return (
      <PageContainer maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} className={classes.relativeContainer}>
            <Typography
              variant="h5"
              color="primary"
              className={classes.subjectTitle}
            >
              {subject} Questions
            </Typography>
            {this.renderQuestions()}
            {/* <FullBodyLoader active={fetching || deleting} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.questionContainer}>
          <CustomSmallPaper className={classes.questionWrapper}>
            <CardContent className={classes.cardContent}>
              <List className={classes.root}>
                <ListItem alignItems="flex-start">
                  This is a question
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem alignItems="flex-start">
                  This is a question
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem alignItems="flex-start">
                  This is a question
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </CustomSmallPaper>
        </Grid>
        {/* <ConfirmDialog
          title="Confirm Delete?"
          description="Do You Really Want to Delete this Database Config. This means database info will be lost and cannot be connected in future."
          active={this.state.confirm}
          onClose={this.onModalClose}
          onSubmit={this.onDeleteSubmit}
        /> */}
      </PageContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    fetched: store.questionBankInfo.fetched,
    fetching: store.questionBankInfo.fetching,
    deleting: store.questionBankInfo.deleting,
    questions: store.questionBankInfo.questions,
    englishQuestions: store.questionBankInfo.englishQuestions,
    countEnglishQuestions: store.questionBankInfo.countEnglishQuestions,
    mathQuestions: store.questionBankInfo.mathQuestions,
    countMathQuestions: store.questionBankInfo.countMathQuestions,
    physicsQuestions: store.questionBankInfo.physicsQuestions,
    countPhysicsQuestions: store.questionBankInfo.countPhysicsQuestions,
    chemistryQuestions: store.questionBankInfo.chemistryQuestions,
    countChemistryQuestions: store.questionBankInfo.countChemistryQuestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchQuestions, deleteQuestion }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QuestionBank));
