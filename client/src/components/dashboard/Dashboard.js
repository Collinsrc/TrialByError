import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getUserInfo } from "../../actions/userInfoActions";

class Dashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  async componentDidMount() {
    const { user } = this.props.auth;
    this.props.getUserInfo(user.username);
  }

  render() {
    const { user } = this.props.auth;
    let adminTrue = "False";
    if (this.props.userInfo.isAdmin === true) {
      adminTrue = "True";
    }
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.username} Is Admin:
              {adminTrue}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a full-stack{" "}
                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userInfo: state.userInfo.userData,
});
export default connect(mapStateToProps, { logoutUser, getUserInfo })(Dashboard);
