import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserInfo } from "../../actions/userInfoActions";

class Roster extends Component {
  render() {
    return (
      <div>
        <Typography>Roster Page</Typography>
      </div>
    );
  }
}

Roster.propTypes = {
  getUserInfo: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userInfo: state.userInfo.userData,
});

export default connect(mapStateToProps, { getUserInfo })(Roster);
