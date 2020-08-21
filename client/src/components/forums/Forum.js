import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForum } from "../../actions/forumActions";

import Typography from "@material-ui/core/Typography";

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

export default connect(mapStateToProps, { getForum })(Forum);
