import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
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
  },
}));

const ButtonTheme = () => {
  const classes = useStyles();
  return (
    <Button
      type="submit"
      variant="contained"
      style={{ margin: 10, outline: 0 }}
      className={classes.button}
    >
      Submit
    </Button>
  );
};

const DividerStyle = () => {
  const classes = useStyles();
  return <Divider className={classes.dividers} />;
};

const RegisterSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, "Needs to be 5 characters or more!")
    .max(50, "Must be below 50 characters!")
    .required("Required"),
  email: Yup.string()
    .required("Required")
    .email("Must be a valid email")
    .max(100, "Cannot be more than 100 characters"),
});



class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      open: false,
    };
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    this.setState({open: false});
  };
  
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  async onSubmit(values) {
    const userData = {
      email: values.email,
      password: values.password,
    };
    await this.props.loginUser(userData);
    this.checkForErrors();
  };

  checkForErrors() {
    if(this.props.errors.emailnotfound || this.props.errors.passwordincorrect) {
      this.setState({open: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  render() {
    return (
      <div>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        disableWindowBlurListener={false}
        onClose={this.handleClose}
        message="Incorrect username or password"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={this.handleClose}>
              CLOSE
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
        <Typography variant="h4">Login</Typography>
        <div>
          <DividerStyle />
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
              this.onSubmit(values);
            }}
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                <div>
                  <br />
                  <Typography variant="h6">
                    Don't have an account?{" "}
                    <Link to="/register">Register/Apply</Link>
                  </Typography>
                  <br />
                  <TextField
                    name="email"
                    id="email"
                    label="Email"
                    helperText={
                      errors.email && touched.email
                        ? errors.email
                        : "Enter an email address"
                    }
                    error={errors.email && touched.email ? true : false}
                    variant="outlined"
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                  <br />
                  <TextField
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    helperText={
                      errors.password && touched.password
                        ? errors.password
                        : "Enter a password"
                    }
                    error={errors.password && touched.password ? true : false}
                    variant="outlined"
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                </div>
                <ButtonTheme />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(Login);

//export default Login;
