import React, { Component } from "react";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { storage } from "../../firebase";
import Divider from "@material-ui/core/Divider";
import { getUserInfo, getAllUsers } from "../../actions/userInfoActions";
import { getAllForumData } from "../../actions/forumActions";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  deleteCharacter,
  modifyCharacter,
  modifyUser,
  deleteUser,
} from "../../actions/administrativeActions";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { logoutUser } from "../../actions/authActions";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      marginBottom: 10,
    },
    gridItemCharacters: {
      width: "80%",
    },
    gridItemInformation: {
      width: "20%",
    },
    characterInformation: {
      display: "flex",
    },
    characterName: {
      width: "20%",
    },
    characterClass: {
      width: "20%",
    },
    characterRole: {
      width: "10%",
    },
    characterSpec: {
      width: "20%",
    },
    characterIsRaider: {
      width: "10%",
    },
    characterButtons: {
      width: "20%",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: 600,
      height: 550,
      width: "50%",
      overflow: "auto",
      display: "flex",
      outline: "none",
    },
    changeCharacterSpecDiv: {
      width: "100%",
    },
    characterInformationPane: {
      textAlign: "center",
      marginTop: 50,
      marginBottom: 50,
    },
    button: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 16,
      marginLeft: 10,
    },
    detailTextField: {
      margin: 10,
      width: "100%",
    },
    accountInformationText: {
      margin: 20,
    },
    detailForumDiv: {
      display: "flex",
      width: "100%",
    },
    detailForum: {
      width: "100%",
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

const ModifyUserSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, "Needs to be 5 characters or more!")
    .max(50, "Must be below 50 characters!"),
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

const deleteUploadedImages = async (images) => {
  await deleteImages(images).then(() => {
    return Promise.resolve(1);
  });
};

const deleteImages = async (images) => {
  for (let i = 0; i < images.length; i++) {
    storage.ref(`images/${images[i]}`).delete();
  }
  return Promise.resolve(1);
};

class Administration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      forumData: [],
      openConfirmDialog: false,
      characterToDelete: {},
      characterToModify: {},
      imagesToRemove: [],
      editCharModalOpen: false,
      specSelection: "",
      roleSelection: "",
      classSelection: "",
      checkBoxChecked: false,
      userToModifyData: {},
      userModifyIsAdmin: false,
      editDetailModalOpen: false,
      openErrorSnackbar: false,
      errorMessage: "",
      openConfirmDeleteUserDialog: false,
      userToDelete: {},
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    //Verify that user is indeed an admin as a safety precaution
    const { user } = this.props.auth;
    this.getUserInfo(user.username).then(() => {
      if (this.props.userIsAdmin === false) {
        //redirect to main page
        window.location.href = "/";
      }
    });
    this.getAllUsers().then(() => {
      this.setState({ userData: this.props.userData });
    });
    this.getAllForumData().then(() => {
      this.setState({ forumData: this.props.forumData });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getUserInfo(username) {
    await this.props.getUserInfo(username);
    return Promise.resolve();
  }

  async getAllUsers() {
    await this.props.getAllUsers();
    return Promise.resolve();
  }

  async getAllForumData() {
    await this.props.getAllForumData();
    return Promise.resolve();
  }

  closeConfirmDialog = () => {
    this.setState({ openConfirmDialog: false });
    this.setState({ characterToDelete: {} });
  };

  closeConfirmDeleteUserDialog = () => {
    this.setState({ openConfirmDeleteUserDialog: false });
    this.setState({ userToDelete: {} });
  };

  deleteCharacter = async () => {
    this.deleteCharacterFromDatabase().then(async () => {
      this.setState({ imagesToRemove: this.props.administrationImageData });
      await deleteUploadedImages(this.state.imagesToRemove).then(() => {
        window.location.reload();
      });
    });
  };

  deleteUser = () => {
    //Dont delete the main user or admins
    if (
      this.state.userToDelete.username === "ordeumgarran" ||
      this.state.userToDelete.isAdmin
    ) {
      this.closeConfirmDeleteUserDialog();
      return;
    }
    this.deleteUserFromDatabase().then(async () => {
      this.setState({ imagesToRemove: this.props.administrationImageData });
      await deleteUploadedImages(this.state.imagesToRemove).then(() => {
        window.location.reload();
      });
    });
  };

  async deleteUserFromDatabase() {
    await this.props.deleteUser(this.state.userToDelete);
    return Promise.resolve();
  }

  async deleteCharacterFromDatabase() {
    await this.props.deleteCharacter(this.state.characterToDelete);
    return Promise.resolve();
  }

  initiateDeleteCharacter = (event, character) => {
    this.setState({ openConfirmDialog: true });
    this.setState({ characterToDelete: character });
  };

  initiateDeleteUser = (event, userData) => {
    this.setState({ openConfirmDeleteUserDialog: true });
    this.setState({ userToDelete: userData });
  };

  modifyCharacter = (event, character, rowData) => {
    this.setState({
      characterToModify: character,
      editCharModalOpen: true,
      classSelection: character.class,
      specSelection: character.spec,
      roleSelection: character.role,
      checkBoxChecked: character.isRaider,
    });
  };

  closeEditCharacterModal = () => {
    this.setState({
      editCharModalOpen: false,
      classSelection: "",
      specSelection: "",
      roleSelection: "",
      characterToModify: {},
      checkBoxChecked: false,
    });
  };

  handleChangeSpec = (e) => {
    this.setState({ specSelection: e.target.value });
  };

  handleChangeRole = (e) => {
    this.setState({ roleSelection: e.target.value });
  };

  handleChangeClass = (e) => {
    this.setState({ classSelection: e.target.value });
  };

  openEditCharacterModal = () => {
    this.setState({ editCharModalOpen: true });
  };

  checkBoxPushed = () => {
    if (this.state.checkBoxChecked) {
      this.setState({ checkBoxChecked: false });
    } else {
      this.setState({ checkBoxChecked: true });
    }
  };

  onCharacterModifySubmit = () => {
    let updatedCharacter = {
      characterName: this.state.characterToModify.characterName,
      class: this.state.classSelection,
      spec: this.state.specSelection,
      role: this.state.roleSelection,
      isRaider: this.state.checkBoxChecked,
    };
    this.modifyCharacterOnDatabase(updatedCharacter).then(() => {
      window.location.reload();
    });
  };

  async modifyCharacterOnDatabase(character) {
    this.props.modifyCharacter(character);
    return Promise.resolve(1);
  }

  modifyUser = (event, userData) => {
    this.setState({
      userToModifyData: userData,
      editDetailModalOpen: true,
      userModifyIsAdmin: userData.isAdmin,
    });
  };

  closeEditDetailModal = () => {
    this.setState({
      editDetailModalOpen: false,
      userToModifyData: {},
      userModifyIsAdmin: false,
    });
  };

  onUserDetailModifySubmit = (values) => {
    let emailChanged = false;
    let passwordChanged = false;
    if (values.email !== this.state.userToModifyData.email) {
      emailChanged = true;
    }
    if (values.password !== "") {
      passwordChanged = true;
    }
    const userUpdate = {
      initialEmail: this.state.userToModifyData.email,
      username: this.state.userToModifyData.username,
      email: values.email,
      password: values.password,
      password2: values.password2,
      realID: values.realID,
      experience: values.experience,
      about: values.about,
      isAdmin: this.state.userModifyIsAdmin,
      emailChanged: emailChanged,
    };
    this.attemptModifyUser(userUpdate).then(() => {
      if (this._isMounted) {
        this.checkForDetailErrors(emailChanged, passwordChanged);
      }
    });
  };

  isAdminCheckBoxPushed = () => {
    if (this.state.userModifyIsAdmin) {
      this.setState({ userModifyIsAdmin: false });
    } else {
      this.setState({ userModifyIsAdmin: true });
    }
  };

  checkForDetailErrors(emailChanged, passwordChanged) {
    if (this.props.errors.detailUpdate) {
      if (this.props.errors.detailUpdate === "EAE") {
        this.setState({ errorMessage: "Email already exists in database!" });
      }
      this.setState({ openErrorSnackbar: true });
    } else if (
      (emailChanged || passwordChanged) &&
      this.props.currentUserData.username ===
        this.state.userToModifyData.username
    ) {
      this.props.logoutUser();
      window.location.href = "/login";
    } else {
      window.location.reload();
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openErrorSnackbar: false });
  };

  async attemptModifyUser(userUpdate) {
    await this.props.modifyUser(userUpdate);
    return Promise.resolve();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.openConfirmDeleteUserDialog}
          onClose={this.closeConfirmDeleteUserDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete the user " +
              this.state.userToDelete.username +
              "?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will permanently remove the user and all of their characters
              from the database. Any forums that the user had posted or created
              will be deleted as well.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDeleteUserDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteUser} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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
                    password: "",
                    password2: "",
                    email: this.state.userToModifyData.email,
                    experience: this.state.userToModifyData.experience,
                    about: this.state.userToModifyData.about,
                    realID: this.state.userToModifyData.realID,
                  }}
                  validationSchema={ModifyUserSchema}
                  onSubmit={(values) => {
                    this.onUserDetailModifySubmit(values);
                  }}
                >
                  {({ errors, touched, handleChange }) => (
                    <Form className={classes.detailForum}>
                      <div>
                        <Typography variant="h6">Edit User Details</Typography>
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
                          defaultValue={this.state.userToModifyData.email}
                          className={classes.detailTextField}
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
                          defaultValue={this.state.userToModifyData.realID}
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
                          defaultValue={this.state.userToModifyData.experience}
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
                          defaultValue={this.state.userToModifyData.about}
                          error={errors.about && touched.about ? true : false}
                          onChange={handleChange}
                          className={classes.detailTextField}
                        />
                        <div>
                          <Checkbox
                            checked={this.state.userModifyIsAdmin}
                            inputProps={{ "aria-label": "primary checkbox" }}
                            onClick={() => this.isAdminCheckBoxPushed()}
                          />
                          <Typography
                            style={{ display: "inline-block", padding: 15 }}
                          >
                            Set as an admin
                          </Typography>
                        </div>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          className={classes.button}
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
                <Typography variant="h6">Modify Character</Typography>
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
                    <MenuItem key={option.classname} value={option.classname}>
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
                        classname.classname === this.state.classSelection
                    )
                    .map((filteredClassName) =>
                      filteredClassName.spec.map((specOption) => (
                        <MenuItem key={specOption} value={specOption}>
                          {specOption}
                        </MenuItem>
                      ))
                    )}
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
                <div>
                  <Checkbox
                    checked={this.state.checkBoxChecked}
                    inputProps={{ "aria-label": "primary checkbox" }}
                    onClick={() => this.checkBoxPushed()}
                  />
                  <Typography style={{ display: "inline-block", padding: 15 }}>
                    Set as a raider
                  </Typography>
                </div>
                <div className={classes.characterInformationPane}>
                  <Typography variant="h6">
                    {this.state.characterToModify.characterName}
                  </Typography>
                  <Typography variant="h6">
                    {this.state.specSelection !== ""
                      ? this.state.specSelection
                      : this.state.characterToModify.spec}{" "}
                    {this.state.classSelection !== ""
                      ? this.state.classSelection
                      : this.state.characterToModify.class}
                  </Typography>
                  <Typography variant="h6">
                    {this.state.roleSelection !== ""
                      ? this.state.roleSelection
                      : this.state.characterToModify.role}
                  </Typography>
                </div>
                <div className={classes.characterInformationPane}>
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                    onClick={this.onCharacterModifySubmit}
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
        <Dialog
          open={this.state.openConfirmDialog}
          onClose={this.closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete " +
              this.state.characterToDelete.characterName +
              "?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will remove all remnants of the character and delete any
              forums and forum responses that the character has been tied to.
              Are you sure you want to do this?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteCharacter} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h2">Administration</Typography>
        <Divider className={classes.dividers} />
        <MaterialTable
          columns={[
            { title: "Is Admin", field: "isAdmin" },
            { title: "Username", field: "username" },
            { title: "Email", field: "email" },
            { title: "RealID", field: "realID" },
          ]}
          data={this.state.userData}
          title={<Typography variant="h4">User Data</Typography>}
          detailPanel={(rowData) => {
            return (
              <div>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="flex-start"
                >
                  <Grid item className={classes.gridItemInformation}>
                    <div className={classes.accountInformationText}>
                      <div>
                        <Typography variant="h6">
                          <strong>Experience: </strong>
                        </Typography>{" "}
                        {rowData.experience}
                      </div>
                      <div>
                        <Typography variant="h6">
                          <strong>About: </strong>
                        </Typography>{" "}
                        {rowData.about}
                      </div>
                      <Button
                        onClick={(event) => this.modifyUser(event, rowData)}
                      >
                        Modify User
                      </Button>
                      <Button
                        onClick={(event) =>
                          this.initiateDeleteUser(event, rowData)
                        }
                      >
                        Delete User
                      </Button>
                    </div>
                  </Grid>
                  <Grid item className={classes.gridItemCharacters}>
                    <Typography variant="h6">
                      <strong>Characters: </strong>{" "}
                    </Typography>
                    {rowData.characters.map((character) => (
                      <div
                        className={classes.characterInformation}
                        key={character.characterName}
                      >
                        <Grid
                          container
                          direction="row"
                          justify="space-evenly"
                          alignItems="flex-start"
                        >
                          <Grid item className={classes.characterName}>
                            <Typography>
                              <strong>Name: </strong>
                              {character.characterName}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.characterClass}>
                            <Typography>
                              <strong>Class: </strong>
                              {character.class}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.characterSpec}>
                            <Typography>
                              <strong>Spec: </strong>
                              {character.spec}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.characterRole}>
                            <Typography>
                              <strong>Role: </strong>
                              {character.role}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.characterIsRaider}>
                            <Typography>
                              <strong>Is Raider: </strong>
                              {character.isRaider.toString()}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.characterButtons}>
                            <Button
                              onClick={(event) =>
                                this.modifyCharacter(event, character)
                              }
                            >
                              Modify
                            </Button>
                            <Button
                              onClick={(event) =>
                                this.initiateDeleteCharacter(event, character)
                              }
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </div>
            );
          }}
        />
        <br />
        <MaterialTable
          columns={[
            { title: "Forum Name", field: "title" },
            { title: "Category", field: "category" },
            { title: "Author", field: "author" },
            { title: "Author Username", field: "authorUsername" },
          ]}
          data={this.state.forumData}
          title={<Typography variant="h4">Forum Data</Typography>}
        />
      </div>
    );
  }
}

Administration.propTypes = {
  getUserInfo: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getAllForumData: PropTypes.func.isRequired,
  deleteCharacter: PropTypes.func.isRequired,
  administrationImageData: PropTypes.array.isRequired,
  modifyCharacter: PropTypes.func.isRequired,
  currentUserData: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  modifyUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  userIsAdmin: state.userInfo.userIsAdmin,
  currentUserData: state.userInfo.userData,
  userData: state.userInfo.allUserData,
  forumData: state.forums.forumData,
  administrationImageData: state.administration.imageData,
});

export default compose(
  connect(mapStateToProps, {
    getUserInfo,
    getAllUsers,
    getAllForumData,
    deleteCharacter,
    modifyCharacter,
    logoutUser,
    modifyUser,
    deleteUser,
  }),
  withStyles(styles, { name: "Administration" })
)(Administration);
