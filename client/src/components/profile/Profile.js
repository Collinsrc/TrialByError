import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {
  getProfileInfo,
  updateUser,
  updateCharacter,
  addCharacter,
} from "../../actions/userInfoActions";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { logoutUser } from "../../actions/authActions";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MenuItem from "@material-ui/core/MenuItem";
import ReCAPTCHA from "react-google-recaptcha";
import recaptcha from "../../config/recaptchaV2";
import { validateRecaptchaV2 } from "../../actions/recaptchaActions";

const classesAndSpecs = [
  {
    classname: "Death Knight",
    spec: ["Blood", "Frost", "Unholy"],
  },
  {
    classname: "Demon Hunter",
    spec: ["Havoc", "Vengeance"],
  },
  {
    classname: "Druid",
    spec: ["Balance", "Feral", "Guardian", "Restoration"],
  },
  {
    classname: "Hunter",
    spec: ["Beast Mastery", "Marksmanship", "Survival"],
  },
  {
    classname: "Mage",
    spec: ["Arcane", "Frost", "Fire"],
  },
  {
    classname: "Monk",
    spec: ["Brewmaster", "Mistweaver", "Windwalker"],
  },
  {
    classname: "Paladin",
    spec: ["Holy", "Protection", "Retribution"],
  },
  {
    classname: "Priest",
    spec: ["Discipline", "Holy", "Shadow"],
  },
  {
    classname: "Rogue",
    spec: ["Assassination", "Outlaw", "Subtlety"],
  },
  {
    classname: "Shaman",
    spec: ["Elemental", "Enhancement", "Restoration"],
  },
  {
    classname: "Warlock",
    spec: ["Affliction", "Demonology", "Destruction"],
  },
  {
    classname: "Warrior",
    spec: ["Arms", "Fury", "Protection"],
  },
];

const roles = [
  {
    value: "Tank",
    label: "Tank",
  },
  {
    value: "Healer",
    label: "Healer",
  },
  {
    value: "DPS",
    label: "DPS",
  },
];

const styles = (theme) => {
  return {
    button: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 16,
      marginLeft: 10,
    },
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      margin: 10,
      marginBottom: 20,
    },
    gridItemDetails: {
      width: "35%",
    },
    gridItemCharacters: {
      width: "65%",
    },
    nonDisplay: {
      display: "none",
    },
    userDetail: {
      margin: 20,
      textAlign: "left",
    },
    userInfoDiv: {
      display: "inline-block",
      justifyContent: "center",
    },
    card: {
      display: "inline-flex",
      width: "50%",
    },
    cardMedia: {
      width: "40%",
    },
    cardContentTypography: {
      textAlign: "left",
    },
    cardContent: {
      flex: "1 0 auto",
    },
    contentDiv: {
      marginRight: "auto",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: 800,
      height: 800,
      width: "70%",
      overflow: "auto",
      display: "flex",
      outline: "none",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    detailForum: {
      width: "100%",
    },
    detailForumDiv: {
      display: "flex",
      width: "100%",
    },
    detailTextField: {
      margin: 10,
      width: "100%",
    },
    changeCharacterSpecDiv: {
      width: "100%",
    },
    characterInformationPane: {
      textAlign: "center",
      marginTop: 50,
      marginBottom: 50,
    },
    recaptcha: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 10,
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

const EditDetailModalSchema = Yup.object().shape({
  passwordEnabled: Yup.boolean(),
  currPassword: Yup.string().when("passwordEnabled", {
    is: true,
    then: Yup.string()
      .required("Required")
      .min(5, "Needs to be 5 characters or more!")
      .max(50, "Must be below 50 characters!"),
    otherwise: Yup.string()
      .min(5, "Needs to be 5 characters or more!")
      .max(50, "Must be below 50 characters!"),
  }),
  password: Yup.string().when("passwordEnabled", {
    is: true,
    then: Yup.string()
      .required("Required")
      .min(5, "Needs to be 5 characters or more!")
      .max(50, "Must be below 50 characters!"),
    otherwise: Yup.string()
      .min(5, "Needs to be 5 characters or more!")
      .max(50, "Must be below 50 characters!"),
  }),
  password2: Yup.string().equalTo(Yup.ref("password")),
  email: Yup.string()
    .required("Required")
    .email("Must be a valid email")
    .max(100, "Cannot be more than 100 characters"),
  experience: Yup.string()
    .max(500, "Cannot be more than 500 characters")
    .required("Required"),
  about: Yup.string().max(500, "Cannot be more than 500 characters"),
  realID: Yup.string().max(50, "Cannot be more than 50 characters"),
});

const AddCharacterModalSchema = Yup.object().shape({
  characterName: Yup.string()
    .required("Required")
    .max(25, "Cannot be more than 25 characters"),
});

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      characters: [],
      editCharModalOpen: false,
      editDetailModalOpen: false,
      addCharModalOpen: false,
      checkBoxChecked: false,
      errorMessage: "",
      openErrorSnackbar: false,
      characterSelected: "",
      specSelection: "",
      characterDetails: {},
      roleSelection: "",
      classSelection: "",
      captchaIsValid: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    let username = decodeURIComponent(window.location.pathname);
    username = username.substr(10);
    this.getProfileInfo(username).then(() => {
      this.setState({ characters: this.props.profileInfo.characters });
      this.getCharacterBustsAndRecreateCharacterList();
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getCharacterBustsAndRecreateCharacterList = () => {
    let characters = [];
    this.state.characters.forEach(async (character) => {
      this.getCharacterBust(character.characterName).then((characterBust) => {
        let characterNew = {
          characterName: character.characterName,
          characterClass: character.class,
          role: character.role,
          spec: character.spec,
          avatarImg: characterBust,
          isRaider: character.isRaider,
        };
        characters.push(characterNew);
        this.setState({ characters: characters });
      });
    });
  };

  getCharacterBust = async (characterName) => {
    let characterBust = "";
    await axios
      .get("/api/blizzard/getCharacterBust/" + characterName.toLowerCase())
      .then((res) => {
        if (res.data === "CBNF") {
          return "";
        } else {
          let retrievedData = res.data;
          let bust_url = retrievedData.bust_url;
          if (bust_url !== undefined) {
            characterBust = bust_url;
          } else {
            console.log(retrievedData.assets[1].value);
            retrievedData = retrievedData.assets;
            characterBust = retrievedData[1].value;
          }
        }
      });
    return Promise.resolve(characterBust);
  };

  async getProfileInfo(username) {
    await this.props.getProfileInfo(username);
    return Promise.resolve();
  }
  openAddCharacterModal = () => {
    this.setState({ addCharModalOpen: true });
  };

  openEditCharacterModal = () => {
    this.setState({ editCharModalOpen: true });
  };

  openEditDetailModal = () => {
    this.setState({ editDetailModalOpen: true });
  };

  closeAddCharacterModal = () => {
    this.setState({
      addCharModalOpen: false,
      classSelection: "",
      specSelection: "",
      roleSelection: "",
      captchaIsValid: false,
    });
  };

  closeEditCharacterModal = () => {
    this.setState({
      editCharModalOpen: false,
      classSelection: "",
      specSelection: "",
      roleSelection: "",
      captchaIsValid: false,
    });
  };

  closeEditDetailModal = () => {
    this.setState({ editDetailModalOpen: false, captchaIsValid: false });
  };

  handleChangeSelectCharacter = (e) => {
    this.setState({ characterSelected: e.target.value }, () => {
      var character = this.state.characters.find((character) => {
        return character.characterName === e.target.value;
      });
      this.setState({ characterDetails: character });
    });
  };

  handleChangeSpec = (e) => {
    this.setState({ specSelection: e.target.value });
  };

  handleChangeRole = (e) => {
    this.setState({ roleSelection: e.target.value });
  };

  handleChangeName = (e) => {
    this.setState({ characterName: e.target.value });
  };

  handleChangeClass = (e) => {
    this.setState({ classSelection: e.target.value });
  };

  checkBoxPushed = (setFieldValue) => {
    if (this.state.checkBoxChecked) {
      this.setState({ checkBoxChecked: false });
      setFieldValue("passwordEnabled", false);
    } else {
      this.setState({ checkBoxChecked: true });
      setFieldValue("passwordEnabled", true);
    }
  };

  onDetailSubmit = (values) => {
    let emailChanged = false;
    let passwordChanged = false;
    if (values.email !== this.props.profileInfo.email) {
      emailChanged = true;
    }
    if (values.currPassword !== "") {
      passwordChanged = true;
    }
    const userUpdate = {
      initialEmail: this.props.profileInfo.email,
      username: this.props.profileInfo.username,
      email: values.email,
      currPassword: values.currPassword,
      password: values.password,
      password2: values.password2,
      realID: values.realID,
      experience: values.experience,
      about: values.about,
      emailChanged: emailChanged,
    };
    this.attemptUserUpdate(userUpdate).then(() => {
      if (this._isMounted) {
        this.checkForDetailErrors(emailChanged, passwordChanged, false);
      }
    });
  };

  onCharacterUpdateSubmit = () => {
    let updatedCharacter = {
      username: this.props.profileInfo.username,
      characterName: this.state.characterSelected,
      spec: this.state.specSelection,
      role: this.state.roleSelection,
    };
    console.log(updatedCharacter);
    this.props.updateCharacter(updatedCharacter).then(() => {
      window.location.reload();
    });
  };

  onCharacterAddSubmit = (values) => {
    let newCharacter = {
      username: this.props.profileInfo.username,
      characterName: values.characterName,
      spec: this.state.specSelection,
      role: this.state.roleSelection,
      class: this.state.classSelection,
    };
    this.attemptCharacterAdd(newCharacter).then(() => {
      if (this._isMounted) {
        this.checkForDetailErrors(false, false, true);
      }
    });
  };

  async attemptUserUpdate(userUpdate) {
    await this.props.updateUser(userUpdate);
    return Promise.resolve();
  }

  async attemptCharacterAdd(newCharacter) {
    await this.props.addCharacter(newCharacter);
    return Promise.resolve();
  }

  checkForDetailErrors(emailChanged, passwordChanged, characterAdded) {
    if (this.props.errors.detailUpdate) {
      if (this.props.errors.detailUpdate === "PDNM") {
        this.setState({ errorMessage: "Current password does not match!" });
      } else if (this.props.errors.detailUpdate === "EAE") {
        this.setState({ errorMessage: "Email already exists in database!" });
      } else if (this.props.errors.detailUpdate === "CAE") {
        this.setState({
          errorMessage: "Character already exists in database!",
        });
      }
      this.setState({ openErrorSnackbar: true });
    } else if (emailChanged || passwordChanged) {
      this.props.logoutUser();
      window.location.href = "/login";
    } else if (characterAdded) {
      window.location.reload();
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openErrorSnackbar: false });
  };

  getColorForCard(characterClass) {
    switch (characterClass) {
      case "Death Knight":
        return "#CE375F";
      case "Demon Hunter":
        return "#A330C9";
      case "Druid":
        return "#F07C23";
      case "Hunter":
        return "#9BC075";
      case "Mage":
        return "#8BDEFB";
      case "Monk":
        return "#37A587";
      case "Paladin":
        return "#F58CBA";
      case "Priest":
        return "#FFFFFF";
      case "Rogue":
        return "#FFEF70";
      case "Warrior":
        return "#AF9074";
      case "Shaman":
        return "#2686DF";
      case "Warlock":
        return "#9860B7";
      default:
        return "#FFFFFF";
    }
  }

  recaptchaClicked = (value) => {
    this.verifyRecaptcha(value).then(() => {
      this.setState({ captchaIsValid: this.props.recaptcha });
    });
  };

  async verifyRecaptcha(token) {
    await this.props.validateRecaptchaV2(token);
    return Promise.resolve();
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.openErrorSnackbar}
          autoHideDuration={6000}
          disableWindowBlurListener={false}
          onClose={this.handleSnackbarClose}
          message={this.state.errorMessage}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackbarClose}
              >
                CLOSE
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.editCharModalOpen}
          onClose={this.closeEditCharacterModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.editCharModalOpen}>
            <div className={classes.paper}>
              <div className={classes.changeCharacterSpecDiv}>
                <Typography variant="h6">Edit Character Spec</Typography>
                <br />
                <TextField
                  select
                  required
                  helperText="Select a character"
                  id="character"
                  name="character"
                  label="Character selection..."
                  variant="outlined"
                  className={classes.detailTextField}
                  onChange={this.handleChangeSelectCharacter}
                  value={this.state.characterSelected}
                >
                  {this.state.characters.map((option) => (
                    <MenuItem
                      key={option.characterName}
                      value={option.characterName}
                    >
                      {option.characterName}
                    </MenuItem>
                  ))}
                </TextField>
                <br />
                <TextField
                  select
                  required
                  label="Role"
                  value={this.state.roleSelection}
                  onChange={this.handleChangeRole}
                  variant="outlined"
                  helperText="Select a role"
                  className={classes.detailTextField}
                  id="roleSelection"
                  name="roleSelection"
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <br />
                <TextField
                  select
                  required
                  label="Spec"
                  value={this.state.specSelection}
                  onChange={this.handleChangeSpec}
                  variant="outlined"
                  helperText="Select a spec"
                  className={classes.detailTextField}
                  id="specSelection"
                  name="specSelection"
                >
                  {classesAndSpecs
                    .filter(
                      (classname) =>
                        classname.classname ===
                        this.state.characterDetails.characterClass
                    )
                    .map((filteredClassName) =>
                      filteredClassName.spec.map((specOption) => (
                        <MenuItem key={specOption} value={specOption}>
                          {specOption}
                        </MenuItem>
                      ))
                    )}
                </TextField>
                <div className={classes.characterInformationPane}>
                  <Typography variant="h6">
                    {this.state.characterSelected}
                  </Typography>
                  <Typography variant="h6">
                    {this.state.specSelection !== ""
                      ? this.state.specSelection
                      : this.state.characterDetails.spec}{" "}
                    {this.state.characterDetails.characterClass}
                  </Typography>
                  <Typography variant="h6">
                    {this.state.roleSelection !== ""
                      ? this.state.roleSelection
                      : this.state.characterDetails.role}
                  </Typography>
                </div>
                <div className={classes.recaptcha}>
                  <ReCAPTCHA
                    sitekey={recaptcha.siteKey}
                    onChange={this.recaptchaClicked}
                  />
                </div>
                <div className={classes.characterInformationPane}>
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                    onClick={this.onCharacterUpdateSubmit}
                    disabled={this.state.captchaIsValid ? false : true}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.closeEditCharacterModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.addCharModalOpen}
          onClose={this.closeAddCharacterModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.addCharModalOpen}>
            <div className={classes.paper}>
              <div className={classes.detailForumDiv}>
                <Formik
                  initialValues={{
                    characterName: "",
                  }}
                  validationSchema={AddCharacterModalSchema}
                  onSubmit={(values) => {
                    this.onCharacterAddSubmit(values);
                  }}
                >
                  {({ errors, touched, handleChange }) => (
                    <Form className={classes.detailForum}>
                      <div>
                        <Typography variant="h6">Add Character</Typography>
                        <br />
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
                          className={classes.detailTextField}
                        />
                        <br />
                        <TextField
                          select
                          required
                          label="Role"
                          value={this.state.roleSelection}
                          onChange={this.handleChangeRole}
                          variant="outlined"
                          helperText="Select a role"
                          className={classes.detailTextField}
                          id="roleSelection"
                          name="roleSelection"
                        >
                          {roles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <br />
                        <TextField
                          select
                          required
                          label="Class"
                          value={this.state.classSelection}
                          onChange={this.handleChangeClass}
                          variant="outlined"
                          helperText="Select a class"
                          className={classes.detailTextField}
                          id="classSelection"
                          name="classSelection"
                        >
                          {classesAndSpecs.map((option) => (
                            <MenuItem
                              key={option.classname}
                              value={option.classname}
                            >
                              {option.classname}
                            </MenuItem>
                          ))}
                        </TextField>
                        <br />
                        <TextField
                          select
                          required
                          label="Spec"
                          value={this.state.specSelection}
                          onChange={this.handleChangeSpec}
                          variant="outlined"
                          helperText="Select a spec"
                          className={classes.detailTextField}
                          id="specSelection"
                          name="specSelection"
                        >
                          {classesAndSpecs
                            .filter(
                              (classname) =>
                                classname.classname ===
                                this.state.classSelection
                            )
                            .map((filteredClassName) =>
                              filteredClassName.spec.map((specOption) => (
                                <MenuItem key={specOption} value={specOption}>
                                  {specOption}
                                </MenuItem>
                              ))
                            )}
                        </TextField>
                      </div>
                      <div className={classes.recaptcha}>
                        <ReCAPTCHA
                          sitekey={recaptcha.siteKey}
                          onChange={this.recaptchaClicked}
                        />
                      </div>
                      <div className={classes.characterInformationPane}>
                        <Button
                          type="submit"
                          variant="contained"
                          className={classes.button}
                          disabled={this.state.captchaIsValid ? false : true}
                        >
                          Add Character
                        </Button>
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={this.closeAddCharacterModal}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.editDetailModalOpen}
          onClose={this.closeEditDetailModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.editDetailModalOpen}>
            <div className={classes.paper}>
              <div className={classes.detailForumDiv}>
                <Formik
                  initialValues={{
                    currPassword: "",
                    password: "",
                    password2: "",
                    email: this.props.profileInfo.email,
                    experience: this.props.profileInfo.experience,
                    about: this.props.profileInfo.about,
                    realID: this.props.profileInfo.realID,
                  }}
                  validationSchema={EditDetailModalSchema}
                  onSubmit={(values) => {
                    this.onDetailSubmit(values);
                  }}
                >
                  {({ errors, touched, handleChange, setFieldValue }) => (
                    <Form className={classes.detailForum}>
                      <div>
                        <Typography variant="h6">Edit Details</Typography>
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
                          defaultValue={this.props.profileInfo.email}
                          className={classes.detailTextField}
                        />
                        <div>
                          <Checkbox
                            checked={this.state.checkBoxChecked}
                            inputProps={{ "aria-label": "primary checkbox" }}
                            onClick={() => this.checkBoxPushed(setFieldValue)}
                          />
                          <Typography
                            style={{ display: "inline-block", padding: 15 }}
                          >
                            Check to enable password changes
                          </Typography>
                        </div>
                        <TextField
                          name="currPassword"
                          id="currPassword"
                          label="Current Password"
                          type="password"
                          helperText={
                            errors.currPassword && touched.currPassword
                              ? errors.currPassword
                              : "Enter your current password"
                          }
                          error={
                            errors.currPassword && touched.currPassword
                              ? true
                              : false
                          }
                          variant="outlined"
                          onChange={handleChange}
                          className={classes.detailTextField}
                          disabled={!this.state.checkBoxChecked}
                        />
                        <br />
                        <TextField
                          name="password"
                          id="password"
                          label="New Password"
                          type="password"
                          helperText={
                            errors.password && touched.password
                              ? errors.password
                              : "Enter a new password"
                          }
                          error={
                            errors.password && touched.password ? true : false
                          }
                          variant="outlined"
                          onChange={handleChange}
                          className={classes.detailTextField}
                          disabled={!this.state.checkBoxChecked}
                        />
                        <br />
                        <TextField
                          name="password2"
                          id="password2"
                          label="Verify New Password"
                          type="password"
                          helperText={
                            errors.password2 && touched.password2
                              ? errors.password2
                              : "Enter new password verification"
                          }
                          error={
                            errors.password2 && touched.password2 ? true : false
                          }
                          variant="outlined"
                          onChange={handleChange}
                          className={classes.detailTextField}
                          disabled={!this.state.checkBoxChecked}
                        />
                        <br />
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
                          defaultValue={this.props.profileInfo.realID}
                          className={classes.detailTextField}
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
                            errors.experience && touched.experience
                              ? true
                              : false
                          }
                          onChange={handleChange}
                          defaultValue={this.props.profileInfo.experience}
                          className={classes.detailTextField}
                        />
                        <br />
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
                          defaultValue={this.props.profileInfo.about}
                          error={errors.about && touched.about ? true : false}
                          onChange={handleChange}
                          className={classes.detailTextField}
                        />
                      </div>
                      <div className={classes.recaptcha}>
                        <ReCAPTCHA
                          sitekey={recaptcha.siteKey}
                          onChange={this.recaptchaClicked}
                        />
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          className={classes.button}
                          disabled={this.state.captchaIsValid ? false : true}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={this.closeEditDetailModal}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Fade>
        </Modal>
        <Typography variant="h2">
          {this.props.profileInfo.username}'s Profile
        </Typography>
        <Divider className={classes.dividers}></Divider>
        <div>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="flex-start"
          >
            <Grid item className={classes.gridItemDetails}>
              <Typography variant="h4">
                <strong>Account/User Detail</strong>
              </Typography>
              <div className={classes.userInfoDiv}>
                <Typography variant="h6" className={classes.userDetail}>
                  <strong>Username: </strong>
                  {this.props.profileInfo.username}
                </Typography>
                <Typography
                  variant="h6"
                  className={
                    this.props.profileInfo.realID !== ""
                      ? classes.userDetail
                      : classes.nonDisplay
                  }
                >
                  <strong>RealID: </strong>
                  {this.props.profileInfo.realID}
                </Typography>
                <Typography
                  variant="h6"
                  className={
                    user.username === this.props.profileInfo.username
                      ? classes.userDetail
                      : classes.nonDisplay
                  }
                >
                  <strong>Email: </strong>
                  {this.props.profileInfo.email}
                </Typography>
                <Typography variant="h6" className={classes.userDetail}>
                  <strong>About: </strong>
                  {this.props.profileInfo.about !== ""
                    ? this.props.profileInfo.about
                    : "None"}
                </Typography>
                <Typography variant="h6" className={classes.userDetail}>
                  <strong>Experience: </strong>
                  {this.props.profileInfo.experience}
                </Typography>
                <Button
                  variant="contained"
                  className={
                    user.username === this.props.profileInfo.username
                      ? classes.button
                      : classes.nonDisplay
                  }
                  onClick={this.openEditDetailModal}
                >
                  Edit Details
                </Button>
                <Button
                  variant="contained"
                  className={
                    user.username === this.props.profileInfo.username
                      ? classes.button
                      : classes.nonDisplay
                  }
                  onClick={this.openEditCharacterModal}
                >
                  Edit Character's Spec
                </Button>
                <Button
                  variant="contained"
                  className={
                    user.username === this.props.profileInfo.username
                      ? classes.button
                      : classes.nonDisplay
                  }
                  onClick={this.openAddCharacterModal}
                >
                  Add Character
                </Button>
              </div>
            </Grid>
            <Grid item className={classes.gridItemCharacters}>
              <Typography variant="h4">
                <strong>Characters</strong>
              </Typography>
              <div>
                {this.state.characters.map((character) => (
                  <Card
                    key={character.name}
                    style={{
                      backgroundColor: this.getColorForCard(
                        character.characterClass
                      ),
                    }}
                    className={classes.card}
                    elevation={4}
                  >
                    <div style={{ marginRight: "auto", marginTop: 10 }}>
                      <CardContent className={classes.content}>
                        <Typography className={classes.cardContentTypography}>
                          <strong>Name: {character.characterName}</strong>
                        </Typography>
                        <Typography className={classes.cardContentTypography}>
                          <strong>Class: {character.characterClass}</strong>
                        </Typography>
                        <Typography className={classes.cardContentTypography}>
                          <strong>Spec: {character.spec}</strong>
                        </Typography>
                        <Typography className={classes.cardContentTypography}>
                          <strong>
                            Raider: {character.isRaider ? "Yes" : "No"}
                          </strong>
                        </Typography>
                      </CardContent>
                    </div>
                    <div>
                      <CardMedia
                        component="img"
                        alt="CharacterBust"
                        title="CharacterBust"
                        image={character.avatarImg}
                        style={{ height: 146, width: 270 }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  getProfileInfo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  recaptcha: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  profileInfo: state.userInfo.profileData,
  auth: state.auth,
  errors: state.errors,
  recaptcha: state.recaptcha.isValidRecaptcha,
});

export default compose(
  connect(mapStateToProps, {
    getProfileInfo,
    updateUser,
    logoutUser,
    updateCharacter,
    addCharacter,
    validateRecaptchaV2,
  }),
  withStyles(styles, {
    name: "Profile",
  })
)(Profile);
