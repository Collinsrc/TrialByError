import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import compose from "recompose/compose";
import SelectRole from "./SelectRole";
import SelectClassSpec from "./SelectClassSpec";
import ReCAPTCHA from "react-google-recaptcha";
import recaptcha from "../../config/recaptchaV2";
import { validateRecaptchaV2 } from "../../actions/recaptchaActions";
import { verifyCharacterExists } from "../../actions/blizzardActions";
import { getGuildInformation } from "../../actions/guildInformationActions";

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
    },
    recaptcha: {
      display: "flex",
      justifyContent: "center",
    },
    hidden: {
      display: "none",
    },
  };
};

function equalTo(ref, msg) {
  return this.test({
    name: "equalTo",
    exclusive: false,
    message: "Passwords must match!",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}

Yup.addMethod(Yup.string, "equalTo", equalTo);

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Needs to be 3 characters or more!")
    .max(50, "Must be below 50 characters!")
    .required("Required"),
  password: Yup.string()
    .min(5, "Needs to be 5 characters or more!")
    .max(50, "Must be below 50 characters!")
    .required("Required"),
  password2: Yup.string().equalTo(Yup.ref("password")),
  email: Yup.string()
    .required("Required")
    .email("Must be a valid email")
    .max(100, "Cannot be more than 100 characters"),
  characterName: Yup.string()
    .required("Required")
    .max(25, "Cannot be more than 25 characters"),
  experience: Yup.string()
    .max(500, "Cannot be more than 500 characters")
    .required("Required"),
  about: Yup.string().max(500, "Cannot be more than 500 characters"),
  realID: Yup.string().max(50, "Cannot be more than 50 characters"),
});

class Register extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      characterName: "",
      realID: "",
      experience: "",
      about: "",
      roleSelection: "",
      classSelection: "",
      specSelection: "",
      errors: {},
      errorMessage: "",
      characterExists: false,
      raidRules: [],
    };
    this._isMounted = false;
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.getGuildInformation().then(() => {
      let rules = this.props.guildInformation.raidRules.split("/");
      this.setState({ raidRules: rules });
    });
    // If logged in and user navigates to Register page, should redirect them to landing
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onSubmit = (values) => {
    //verify character exists first
    this.verifyCharacterExists(values.characterName).then(() => {
      this.setState({ characterExists: this.props.characterExists });
      if (!this.state.characterExists) {
        this.setState({
          open: true,
          errorMessage: "According to Blizzard, that character does not exist!",
        });
      } else {
        const newUser = {
          username: values.username,
          email: values.email,
          password: values.password,
          password2: values.password2,
          characterName: values.characterName,
          role: this.state.roleSelection,
          class: this.state.classSelection,
          spec: this.state.specSelection,
          realID: values.realID,
          experience: values.experience,
          about: values.about,
          captchaIsValid: false,
        };
        this.attemptRegistration(newUser).then(() => {
          if (this._isMounted) {
            this.checkForErrors();
          }
        });
      }
    });
  };

  async attemptRegistration(newUser) {
    await this.props.registerUser(newUser, this.props.history);
    return Promise.resolve();
  }

  checkForErrors() {
    if (this.props.errors.email) {
      this.setState({
        open: true,
        errorMessage: "Email already exists in database!",
      });
    } else if (this.props.errors.register) {
      if (this.props.errors.register === "CAE") {
        this.setState({
          open: true,
          errorMessage: "Character already exists in database!",
        });
      } else if (this.props.errors.register === "UAE") {
        this.setState({
          open: true,
          errorMessage: "Username already exists in database!",
        });
      }
    }
  }

  getSelectedRole = (data) => {
    this.setState({ roleSelection: data });
  };

  getSelectedClass = (data) => {
    this.setState({ classSelection: data });
  };

  getSelectedSpec = (data) => {
    this.setState({ specSelection: data });
  };

  recaptchaClicked = (value) => {
    this.verifyRecaptcha(value).then(() => {
      this.setState({ captchaIsValid: this.props.recaptcha });
    });
  };

  async verifyRecaptcha(token) {
    await this.props.validateRecaptchaV2(token);
    return Promise.resolve();
  }

  async verifyCharacterExists(characterName) {
    await this.props.verifyCharacterExists(characterName);
    return Promise.resolve();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.open}
          autoHideDuration={6000}
          disableWindowBlurListener={false}
          onClose={this.handleClose}
          message={this.state.errorMessage}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={this.handleClose}>
                CLOSE
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Typography variant="h4">Joining the Team? Fill this out!</Typography>
        <div>
          <Divider className={classes.dividers} />
          <Formik
            initialValues={{
              username: "",
              password: "",
              password2: "",
              email: "",
              characterName: "",
              experience: "",
              about: "",
              realID: "",
              roleSelection: "",
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
                    Already a member? <Link to="/login">Login</Link>
                  </Typography>
                  <br />
                  <Typography variant="h6">Raiding Information</Typography>
                  <Typography>
                    <strong>Raid Times:</strong>
                    <br />
                    <br />
                    {this.props.guildInformation.raidTimes}
                    <br />
                    <br />
                    <strong>Raid Rules:</strong>
                    <br />
                    {this.state.raidRules.map((rule) => (
                      <p key={rule}>{rule}</p>
                    ))}
                    <strong>Expectations:</strong>
                    <br />
                    <br />
                    {this.props.guildInformation.raidExpectations}
                    <br />
                    <br />
                  </Typography>
                  <Typography variant="h6">Login/Account Creation</Typography>
                  <TextField
                    name="username"
                    id="username"
                    label="Username"
                    helperText={
                      errors.username && touched.username
                        ? errors.username
                        : "Enter a username"
                    }
                    error={errors.username && touched.username ? true : false}
                    variant="outlined"
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
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
                  <br />
                  <TextField
                    name="password2"
                    id="password2"
                    label="Verify Password"
                    type="password"
                    helperText={
                      errors.password2 && touched.password2
                        ? errors.password2
                        : "Enter password verification"
                    }
                    error={errors.password2 && touched.password2 ? true : false}
                    variant="outlined"
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                </div>
                <div>
                  <Typography variant="h6">
                    Profile/Character Information
                  </Typography>
                  <TextField
                    name="characterName"
                    id="characterName"
                    label="Character Name"
                    helperText={
                      errors.characterName && touched.characterName
                        ? errors.characterName
                        : "Enter a character name"
                    }
                    error={
                      errors.characterName && touched.characterName
                        ? true
                        : false
                    }
                    variant="outlined"
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                  <br />
                  <SelectRole callback={this.getSelectedRole} />
                  <SelectClassSpec
                    callbackClass={this.getSelectedClass}
                    callbackSpec={this.getSelectedSpec}
                  />
                  <TextField
                    name="realID"
                    id="realID"
                    label="BattleTag/RealID"
                    variant="outlined"
                    helperText={
                      errors.realID && touched.realID
                        ? errors.realID
                        : "Optional: Enter your BattleTag/RealId"
                    }
                    error={errors.realID && touched.realID ? true : false}
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                  <br />
                  <TextField
                    id="experience"
                    label="Experience"
                    multiline
                    rows={5}
                    variant="outlined"
                    helperText={
                      errors.experience && touched.experience
                        ? errors.experience
                        : "Enter your raid experience"
                    }
                    error={
                      errors.experience && touched.experience ? true : false
                    }
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                  <TextField
                    id="about"
                    label="About You"
                    multiline
                    rows={5}
                    variant="outlined"
                    helperText={
                      errors.about && touched.about
                        ? errors.about
                        : "Optional: Tell us about yourself"
                    }
                    error={errors.about && touched.about ? true : false}
                    onChange={handleChange}
                    style={{ margin: 10, width: "50%" }}
                  />
                </div>
                <br />
                <Typography variant="h6">
                  <strong>
                    You MUST verify your email prior to logging in! Check your
                    email after submitting your application!
                  </strong>
                </Typography>
                <br />
                <div className={classes.recaptcha}>
                  <ReCAPTCHA
                    sitekey={recaptcha.siteKey}
                    onChange={this.recaptchaClicked}
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ margin: 10, outline: 0 }}
                  className={classes.button}
                  disabled={this.state.captchaIsValid ? false : true}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  validateRecaptchaV2: PropTypes.func.isRequired,
  recaptcha: PropTypes.bool.isRequired,
  characterExists: PropTypes.bool.isRequired,
  verifyCharacterExists: PropTypes.func.isRequired,
  getGuildInformation: PropTypes.func.isRequired,
  guildInformation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  recaptcha: state.recaptcha.isValidRecaptcha,
  characterExists: state.blizzard.characterExists,
  guildInformation: state.guildInfo.guildInformation,
});

export default compose(
  connect(mapStateToProps, {
    registerUser,
    validateRecaptchaV2,
    verifyCharacterExists,
    getGuildInformation,
  }),
  withStyles(styles, {
    name: "Register",
  })
)(withRouter(Register));
