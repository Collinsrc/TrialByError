import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getUserInfo } from "../../actions/userInfoActions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      color: "inherit",
      textDecoration: "none",
    },
    navBar: {
      color: theme.palette.primary,
    },
  },
}));

const NavTheme = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Trial By Error
            </Link>
          </Typography>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/roster" className={classes.link}>
              Guild Roster
            </Link>
          </Button>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/register" className={classes.link}>
              Apply
            </Link>
          </Button>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/login" className={classes.link}>
              Login
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const NavThemeLoggedIn = (props) => {
  const onLogoutClick = (e) => {
    e.preventDefault();
    props.logoutUser();
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Trial By Error
            </Link>
          </Typography>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/roster" className={classes.link}>
              Guild Roster
            </Link>
          </Button>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/forums" className={classes.link}>
              Forums
            </Link>
          </Button>
          <Button
            color="inherit"
            style={{ outline: 0 }}
            onClick={onLogoutClick}
          >
            <Link to="/login" className={classes.link}>
              Logout
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const NavThemeLoggedInAdmin = (props) => {
  const onLogoutClick = (e) => {
    e.preventDefault();
    props.logoutUser();
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Trial By Error
            </Link>
          </Typography>
          <Button color="inherit" style={{ outline: 0 }}>
            Administration
          </Button>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/roster" className={classes.link}>
              Guild Roster
            </Link>
          </Button>
          <Button color="inherit" style={{ outline: 0 }}>
            <Link to="/forums" className={classes.link}>
              Forums
            </Link>
          </Button>
          <Button
            color="inherit"
            style={{ outline: 0 }}
            onClick={onLogoutClick}
          >
            <Link to="/login" className={classes.link}>
              Logout
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

class Navbar extends Component {
  componentDidMount = () => {
    const { user } = this.props.auth;
    this.props.getUserInfo(user.username);
  };

  render() {
    if (this.props.auth.isAuthenticated === false) {
      return <NavTheme></NavTheme>;
    } else {
      if (this.props.userInfo.isAdmin) {
        return (
          <NavThemeLoggedInAdmin
            logoutUser={this.props.logoutUser}
          ></NavThemeLoggedInAdmin>
        );
      } else {
        return (
          <NavThemeLoggedIn
            logoutUser={this.props.logoutUser}
          ></NavThemeLoggedIn>
        );
      }
    }
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userInfo: state.userInfo.userData,
});

export default connect(mapStateToProps, { logoutUser, getUserInfo })(Navbar);
