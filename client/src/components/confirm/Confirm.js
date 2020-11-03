import React, { Component } from "react";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { confirmEmail } from "../../actions/email";

const styles = (theme) => {
  return {
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    message: {
      marginBottom: 10,
    },
  };
};

class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      tempUserID: "",
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    let tempUserID = decodeURIComponent(window.location.pathname);
    tempUserID = tempUserID.substr(9);
    this.verifyEmail(tempUserID);
  }

  async verifyEmail(tempUserID) {
    this.props.confirmEmail(tempUserID);
    return Promise.resolve();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h2">Email Confirmation</Typography>
        <Divider className={classes.dividers} />
        <Typography variant="h4" className={classes.message}>
          {this.props.emailMessage}
        </Typography>
        <Typography variant="h6">
          <Link to="/login">Click Here to Login</Link>
        </Typography>
      </div>
    );
  }
}

Confirm.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  confirmEmail: PropTypes.func.isRequired,
  emailMessage: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  emailMessage: state.email.message,
});
export default compose(
  connect(mapStateToProps, { confirmEmail }),
  withStyles(styles, {
    name: "Confirm",
  })
)(Confirm);
