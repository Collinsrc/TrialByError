import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { getProfileInfo } from "../../actions/userInfoActions";
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

const styles = (theme) => {
  return {
    button: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 16,
      marginLeft: 16,
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
      maxHeight: 600,
      height: 550,
      width: "50%",
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
  username: Yup.string()
    .min(3, "Needs to be 3 characters or more!")
    .max(50, "Must be below 50 characters!")
    .required("Required"),
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

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      characters: [],
      editCharModalOpen: false,
      editDetailModalOpen: false,
      addCharModalOpen: false,
    };
  }

  componentDidMount() {
    let username = decodeURIComponent(window.location.pathname);
    username = username.substr(10);
    this.getProfileInfo(username).then(() => {
      this.setState({ characters: this.props.profileInfo.characters });
      this.getCharacterBustsAndRecreateCharacterList();
    });
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
        console.log(this.state.characters);
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
          characterBust = retrievedData.bust_url;
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
    this.setState({ addCharModalOpen: false });
  };

  closeEditCharacterModal = () => {
    this.setState({ editCharModalOpen: false });
  };

  closeEditDetailModal = () => {
    this.setState({ editDetailModalOpen: false });
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

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    return (
      <div>
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
              <Typography>Char Add Modal</Typography>
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
              <Typography>Char Edit Modal</Typography>
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
                    username: "",
                    password: "",
                    password2: "",
                    email: "",
                    experience: "",
                    about: "",
                    realID: "",
                  }}
                  validationSchema={EditDetailModalSchema}
                  onSubmit={(values) => {
                    this.onSubmit(values);
                  }}
                >
                  {({ errors, touched, handleChange }) => (
                    <Form className={classes.detailForum}>
                      <div>
                        <Typography variant="h6">Edit Details</Typography>
                        <br />
                        <TextField
                          name="username"
                          id="username"
                          label="Username"
                          helperText={
                            errors.username && touched.username
                              ? errors.username
                              : "Enter a username"
                          }
                          error={
                            errors.username && touched.username ? true : false
                          }
                          variant="outlined"
                          onChange={handleChange}
                          defaultValue={this.props.profileInfo.username}
                          className={classes.detailTextField}
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
                          defaultValue={this.props.profileInfo.email}
                          className={classes.detailTextField}
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
                          label="Verify Password"
                          type="password"
                          helperText={
                            errors.password2 && touched.password2
                              ? errors.password2
                              : "Enter password verification"
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
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button variant="contained" className={classes.button}>
                          Save Changes
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
                  Edit Character
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
  classes: PropTypes.object.isRequired,
  getProfileInfo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profileInfo: state.userInfo.profileData,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, {
    getProfileInfo,
  }),
  withStyles(styles, {
    name: "Profile",
  })
)(Profile);