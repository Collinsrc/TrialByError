import React, { Component } from "react";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { setUserAdminStatus } from "./actions/userInfoActions";

import { Provider } from "react-redux";
import store from "./store";

import theme from "./theme/customTheme";

import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Landing from "./components/layout/Landing";
import Roster from "./components/roster/Roster";
import Forums from "./components/forums/Forums";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,

    marginRight: "10%",
    marginLeft: "10%",
  },
}));

const GridArea = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs>
          <Paper className={classes.paper}>
            <Route path="/" exact component={Landing} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/roster" component={Roster} />
            <Route path="/forums" component={Forums} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

if (localStorage.loggedInUserIsAdmin) {
  store.dispatch(setUserAdminStatus(localStorage.loggedInUserIsAdmin));
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <GridArea />
            </ThemeProvider>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
