import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import Select from "@material-ui/core/Select";

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
  selections: {
    margin: 10,
    width: "50%",
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

/*
const ClassSpecSelection = () => {
  const classes = useStyles();

  const Classes = [
    { value: "Warrior", label: "Warrior" },
    { value: "Priest", label: "Priest" },
    { value: "Rogue", label: "Rogue" },
    { value: "Shaman", label: "Shaman" },
    { value: "Warlock", label: "Warlock" },
    { value: "Paladin", label: "Paladin" },
    { value: "Monk", label: "Monk" },
    { value: "Mage", label: "Mage" },
    { value: "Hunter", label: "Hunter" },
    { value: "Druid", label: "Druid" },
    { value: "Demon Hunter", label: "Demon Hunter" },
    { value: "Death Knight", label: "Death Knight" },
  ];
  ["Protection", "Arms", "Fury"]
  ["Discipline", "Holy", "Shadow"]
  ["Assassination", "Outlaw", "Subtlety"]
  ["Elemental", "Enhancement", "Restoration"]
  ["Affliction", "Demonology", "Destruction"]
  ["Holy", "Protection", "Retribution"]
  ["Brewmaster", "Mistweaver", "Windwalker"]
  ["Arcane", "Fire", "Frost"]
  ["Beast Mastery", "Marksmanship", "Survival"]
  ["Balance", "Feral", "Guardian", "Restoration"]
  ["Havoc", "Vengenance"]
  ["Blood", "Frost", "Unholy"]

  return (
    <div>
      <Select
        className={classes.selections}
        variant="outlined"
        native
        label="Class"
        name="class"
        id="class"
        helperText="Choose a class"
      >
        {Classes.map(({ value, label }, index) => (
          <option value={value}>{label}</option>
        ))}
      </Select>
      <br />
      <Select
        className={classes.selections}
        variant="outlined"
        native
        label="Class"
        name="class"
        id="class"
        helperText="Choose a class"
      >
        <option value={"Warrior"}>Warrior</option>
        <option value={"Paladin"}>Paladin</option>
        <option value={"Hunter"}>Hunter</option>
        <option value={"Rogue"}>Rogue</option>
        <option value={"Priest"}>Priest</option>
        <option value={"Shaman"}>Shaman</option>
        <option value={"Mage"}>Mage</option>
        <option value={"Warlock"}>Warlock</option>
        <option value={"Monk"}>Monk</option>
        <option value={"Druid"}>Druid</option>
        <option value={"DemonHunter"}>Demon Hunter</option>
        <option value={"DeathKnight"}>Death Knight</option>
      </Select>
    </div>
  );
};
*/

const DividerStyle = () => {
  const classes = useStyles();
  return <Divider className={classes.dividers} />;
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
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onSubmit = (values) => {
    const newUser = {
      username: values.username,
      email: values.email,
      password: values.password,
      password2: values.password2,
      characterName: values.characterName,
      realID: values.realID,
      experience: values.experience,
      about: values.about,
    };
    this.props.registerUser(newUser, this.props.history);
    //console.log(newUser);
  };

  render() {
    //const { errors } = this.state;
    return (
      <div>
        <Typography variant="h4">Joining the Team? Fill this out!</Typography>
        <div>
          <DividerStyle />
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
                    Times
                    <br />
                    <strong>Raid Rules:</strong>
                    <br />
                    Rules
                    <br />
                    <strong>Expectations:</strong>
                    <br />
                    Expectations
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
                  {/* <ClassSpecSelection />
                  <br /> */}
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
                <ButtonTheme />
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));

//export default Register;
