import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForum } from "../../actions/forumActions";
import compose from "recompose/compose";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const styles = (theme) => {
  return {
    root: {
      margin: theme.spacing(3),
      width: 345,
    },
    media: {
      height: 140,
    },
    title: {
      color: theme.palette.primary.main,
    },
    button: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
    },
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      marginBottom: 10,
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: 600,
      height: 550,
      width: "50%",
      overflow: "auto",
      display: "flex",
      outline: "none",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
    },
    submitForumButton: {
      justifyContent: "flex-center",
      display: "flex",
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 10,
    },
    modalTitle: {
      display: "flex",
      justifyContent: "center",
    },
    forumTitle: {
      width: "50%",
      justifyContent: "center",
    },
    category: {
      width: "50%",
      justifyContent: "center",
    },
    textField: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
  };
};

class Forum extends Component {
  constructor() {
    super();

    this.state = {
      forum: {},
      forumResponses: [],
    };
  }

  componentDidMount() {
    let forumTitle = window.location.pathname;
    forumTitle = forumTitle.substr(9);
    this.getForum(forumTitle).then(() => {
      this.setState({ forum: this.props.forum });
      this.setState({ forumResponses: this.state.forum.threadResponses });
    });
  }

  async getForum(forumTitle) {
    await this.props.getForum(forumTitle);
    return Promise.resolve();
  }

  render() {
    return (
      <div>
        Made it to forum! FilePath: {window.location.pathname.substr(9)}
      </div>
    );
  }
}

Forum.propTypes = {
  getForum: PropTypes.func.isRequired,
  forum: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  forum: state.forums.forumData,
});

export default compose(
  connect(mapStateToProps, { getForum }),
  withStyles(styles, {
    name: "Forum",
  })
)(Forum);
