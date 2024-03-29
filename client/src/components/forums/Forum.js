import React, { Component, createRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForum } from "../../actions/forumActions";
import compose from "recompose/compose";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { getUserInfo } from "../../actions/userInfoActions";
import {
  addResponse,
  deleteResponse,
  deleteForum,
} from "../../actions/forumActions";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import BackupIcon from "@material-ui/icons/Backup";
import Backdrop from "@material-ui/core/Backdrop";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { storage } from "../../firebase";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReCAPTCHA from "react-google-recaptcha";
import recaptcha from "../../config/recaptchaV2";
import { validateRecaptchaV2 } from "../../actions/recaptchaActions";

const styles = (theme) => {
  return {
    avatar: {
      width: "25%",
      marginLeft: 45,
    },
    cardTextEditor: {
      width: "46%",
    },
    card: {
      backgroundColor: "#fafafa",
    },
    avatarImage: {
      height: 100,
      width: 100,
    },
    button: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
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
    form: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
    },
    submitForumButton: {
      justifyContent: "flex-center",
      display: "flex",
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 10,
    },
    category: {
      width: "50%",
      justifyContent: "center",
    },
    textField: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      marginBottom: 10,
    },
    modalTitle: {
      display: "flex",
      justifyContent: "center",
    },
    playerName: {
      marginTop: 10,
    },
    postDate: {
      width: "24%",
    },
    date: {
      textAlign: "right",
    },
    pagination: {
      marginTop: 10,
    },
    playerNameDiv: {
      width: 200,
      justifyContent: "center",
      marginLeft: -50,
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        color: "inherit",
        textDecoration: "none",
      },
    },
    buttonNotVisible: {
      display: "none",
    },
    deleteButton: {
      float: "right",
    },
    linkToProfile: {
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        color: "blue",
        textDecoration: "none",
      },
    },
    recaptcha: {
      display: "flex",
      justifyContent: "center",
      marginTop: 50,
      marginBottom: 10,
    },
  };
};

const uploadImageToServer = (file) => {
  return new Promise((resolve) => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            resolve(url);
          });
      }
    );
  });
};

const uploadImage = (file) => {
  return new Promise(async (resolve, reject) => {
    const url = await uploadImageToServer(file);
    if (!url) {
      reject();
      return;
    }
    resolve({
      data: {
        url: url,
        width: 300,
        height: 200,
        alignment: "left", // or "center", "right"
        type: "image", // or "video"
      },
    });
  });
};

const deleteUploadedImages = (images) => {
  for (let i = 0; i < images.length; i++) {
    storage.ref(`images/${images[i]}`).delete();
  }
  return Promise.resolve();
};

const cardPopverStyles = makeStyles({
  root: {
    padding: 10,
    maxWidth: 350,
  },
  textField: {
    width: "100%",
  },
  input: {
    display: "none",
  },
});

const UploadImagePopover = (props) => {
  const classes = cardPopverStyles(props);
  const [state, setState] = useState({
    anchor: null,
    isCancelled: false,
  });
  const [data, setData] = useState({});

  useEffect(() => {
    setState({
      anchor: props.anchor,
      isCancelled: false,
    });
    setData({
      file: undefined,
    });
  }, [props.anchor]);

  return (
    <Popover
      anchorEl={state.anchor}
      open={state.anchor !== null}
      onExited={() => {
        props.onSubmit(data, !state.isCancelled);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={10}>
          <TextField
            className={classes.textField}
            disabled
            value={data.file?.name || ""}
            placeholder="Click icon to attach image"
          />
        </Grid>
        <Grid item xs={2}>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={(event) => {
              setData({
                ...data,
                file: event.target.files[0],
              });
            }}
          />
          <label htmlFor="contained-button-file">
            <IconButton
              color="primary"
              aria-label="upload image"
              component="span"
            >
              <AttachFileIcon />
            </IconButton>
          </label>
        </Grid>
        <Grid item container xs={12} justify="flex-end">
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: true,
              });
            }}
          >
            <CloseIcon />
          </Button>
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: false,
              });
            }}
          >
            <DoneIcon />
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
};

class Forum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forum: {},
      forumResponses: [],
      completeForum: [],
      open: false,
      characters: [],
      raidingCharacters: [],
      anchor: null,
      uploadedImages: [],
      author: "",
      responseText: "",
      baseForum: {},
      page: 1,
      count: 1,
      pageSize: 5,
      currentIndex: -1,
      openConfirmDialog: false,
      deletedForumRequest: {},
      deleteRequestWasResponse: false,
      captchaIsValid: false,
    };
  }

  componentDidMount() {
    const { user } = this.props.auth;
    this.getUserInfo(user.username).then(() => {
      this.setState({ characters: this.props.userInfo.characters });
      let raidingCharacters = [];
      for (const character of this.state.characters) {
        if (character.isRaider) {
          raidingCharacters.push(character);
        }
      }
      this.setState({ raidingCharacters: raidingCharacters });
    });
    let forumTitle = decodeURIComponent(window.location.pathname);
    forumTitle = forumTitle.substr(9);
    this.getForum(forumTitle).then(() => {
      this.setState({ forum: this.props.forum });
      this.setState({ forumResponses: this.state.forum.threadResponses });
      this.combineAllForumInformation();
    });
    this.ref = createRef(null);
  }

  async getUserInfo(username) {
    await this.props.getUserInfo(username);
    return Promise.resolve();
  }

  sortByDate(a, b) {
    var dateA = new Date(a.uneditedDate),
      dateB = new Date(b.uneditedDate);
    return dateA - dateB;
  }

  async combineAllForumInformation() {
    let forum = [];

    this.getCharacterAvatar(this.state.forum.author).then((characterAvatar) => {
      let date = new Date(this.state.forum.dateCreated);
      let entry = {
        author: "",
        responseText: "",
        avatarURL: "",
        date: null,
        uploadedImages: [],
        title: "",
        authorUsername: "",
      };
      entry.author = this.state.forum.author;
      entry.responseText = this.state.forum.initialText;
      entry.avatarURL = characterAvatar;
      entry.date = date.toUTCString();
      entry.uploadedImages = this.state.forum.uploadedImages;
      entry.title = this.state.forum.title;
      entry.authorUsername = this.state.forum.authorUsername;
      this.setState({ baseForum: entry });
      this.setState({ count: 1 });
    });
    this.state.forumResponses.forEach(async (response) => {
      this.getCharacterAvatar(response.author).then((characterAvatar) => {
        let date = new Date(response.date);
        let entry = {
          author: "",
          responseText: "",
          avatarURL: "",
          date: null,
          uneditedDate: null,
          uploadedImages: [],
          title: "",
          authorUsername: "",
        };
        entry.author = response.author;
        entry.responseText = response.responseText;
        entry.avatarURL = characterAvatar;
        entry.date = date.toUTCString();
        entry.uneditedDate = response.date;
        entry.uploadedImages = response.uploadedImages;
        entry.title = this.state.forum.title;
        entry.authorUsername = response.authorUsername;
        forum.sort(this.sortByDate);
        forum.push(entry);
        this.setState({ completeForum: forum });
        let newCount = forum.length / this.state.pageSize;
        newCount = Math.floor(newCount);
        if (newCount === 0) {
          newCount = 1;
        } else if (forum.length % this.state.pageSize !== 0) {
          newCount += 1;
        }
        this.setState({ count: newCount });
      });
    });
  }

  async getForum(forumTitle) {
    await this.props.getForum(forumTitle);
    return Promise.resolve();
  }

  getCharacterAvatar = async (characterName) => {
    let characterAvatar = "";
    await axios
      .get("/api/blizzard/getCharacterBust/" + characterName.toLowerCase())
      .then((res) => {
        if (res.data === "CBNF") {
          return "";
        } else {
          let retrievedData = res.data;
          let avatar_url = retrievedData.avatar_url;
          if (avatar_url !== undefined) {
            characterAvatar = avatar_url;
          } else {
            retrievedData = retrievedData.assets;
            characterAvatar = retrievedData[0].value;
          }
        }
      });
    return Promise.resolve(characterAvatar);
  };

  handleFileUpload = (file) => {
    let didUpload = false;
    this.ref.current.insertAtomicBlockAsync(
      "IMAGE",
      (didUpload = uploadImage(file)),
      "Uploading now..."
    );
    if (didUpload) {
      let uploadedImages = this.state.uploadedImages;
      uploadedImages.push(file.name);
      this.setState({ uploadedImages: uploadedImages });
    }
  };

  handleClose = () => {
    deleteUploadedImages(this.state.uploadedImages);
    this.setState({ uploadedImages: [], open: false, captchaIsValid: false });
  };

  handleChangePostAs = (e) => {
    this.setState({ author: e.target.value });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  onSave = async (data) => {
    this.setState({ responseText: data });
  };

  handlePageChange(event, value) {
    this.setState({ page: value });
    let forum = this.state.completeForum;
    forum.sort(this.sortByDate);
    this.setState({ completeForum: forum });
  }

  onSubmit = async () => {
    await this.ref.current.save();
    const newResponse = {
      title: this.state.forum.title,
      author: this.state.author,
      responseText: this.state.responseText,
      uploadedImages: this.state.uploadedImages,
      authorUsername: this.props.userInfo.username,
    };
    this.props.addResponse(newResponse);
  };

  deleteForum = async () => {
    this.setState({ openConfirmDialog: false });
    this.props.deleteForum(this.state.deletedForumRequest);
    await deleteUploadedImages(
      this.state.deletedForumRequest.uploadedImages
    ).then(() => {
      window.location.href = "/forums";
    });
  };

  deleteForumResponse = async () => {
    this.setState({ openConfirmDialog: false });
    this.props.deleteResponse(this.state.deletedForumRequest);
    await deleteUploadedImages(
      this.state.deletedForumRequest.uploadedImages
    ).then(() => {
      window.location.reload();
    });
  };

  handleConfirmDialog = (response, isResponse) => {
    this.setState({ deleteRequestWasResponse: isResponse });
    this.setState({ deletedForumRequest: response });
    this.setState({ openConfirmDialog: true });
  };

  closeConfirmDialog = () => {
    this.setState({ deletedForumRequest: {} });
    this.setState({ openConfirmDialog: false });
  };

  checkIfUserHasCharacter = (characterName) => {
    if (this.props.userIsAdmin) {
      return true;
    }
    for (let i = 0; i < this.state.raidingCharacters.length; i++) {
      if (this.state.raidingCharacters[i].characterName === characterName) {
        return true;
      }
    }
    return false;
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.openConfirmDialog}
          onClose={this.closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete the forum/response?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is not reversable. Any photos that were uploaded to the
              response/forum will be permanently deleted forever.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={
                this.state.deleteRequestWasResponse
                  ? this.deleteForumResponse
                  : this.deleteForum
              }
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Card className={classes.card}>
          <CardContent>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item className={classes.avatar}>
                <Avatar
                  className={classes.avatarImage}
                  alt={this.state.baseForum.author}
                  src={this.state.baseForum.avatarURL}
                ></Avatar>
                <div className={classes.playerNameDiv}>
                  <Typography variant="h6" className={classes.playerName}>
                    <Link
                      to={"/profile/:" + this.state.baseForum.authorUsername}
                      className={classes.linkToProfile}
                    >
                      {this.state.baseForum.author}
                    </Link>
                  </Typography>
                </div>
              </Grid>
              <Grid item className={classes.cardTextEditor}>
                <div>
                  <MUIRichTextEditor
                    label="Forum"
                    defaultValue={this.state.baseForum.responseText}
                    toolbar={false}
                    readOnly={true}
                  ></MUIRichTextEditor>
                </div>
              </Grid>
              <Grid item className={classes.postDate}>
                <Typography variant="subtitle1" className={classes.date}>
                  <strong>{this.state.baseForum.date}</strong>
                </Typography>
                <Typography variant="subtitle1" className={classes.date}>
                  <strong>Original Post</strong>
                </Typography>
                <div>
                  <IconButton
                    aria-label="delete"
                    onClick={(event) =>
                      this.handleConfirmDialog(this.state.baseForum, false)
                    }
                    className={
                      this.checkIfUserHasCharacter(this.state.baseForum.author)
                        ? classes.deleteButton
                        : classes.buttonNotVisible
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <div>
          {this.state.completeForum
            .slice(
              (this.state.page - 1) * this.state.pageSize,
              (this.state.page - 1) * this.state.pageSize +
                this.state.pageSize <
                this.state.completeForum.length
                ? (this.state.page - 1) * this.state.pageSize +
                    this.state.pageSize
                : this.state.completeForum.length
            )
            .map((forumData, index) => (
              <Card className={classes.card} key={index}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item className={classes.avatar}>
                      <Avatar
                        className={classes.avatarImage}
                        alt={forumData.author}
                        src={forumData.avatarURL}
                      ></Avatar>
                      <div className={classes.playerNameDiv}>
                        <Typography variant="h6" className={classes.playerName}>
                          <Link
                            to={"/profile/:" + forumData.authorUsername}
                            className={classes.linkToProfile}
                          >
                            {forumData.author}
                          </Link>
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item className={classes.cardTextEditor}>
                      <div>
                        <MUIRichTextEditor
                          label="Forum"
                          defaultValue={forumData.responseText}
                          toolbar={false}
                          readOnly={true}
                        ></MUIRichTextEditor>
                      </div>
                    </Grid>
                    <Grid item className={classes.postDate}>
                      <Typography variant="subtitle1" className={classes.date}>
                        <strong>{forumData.date}</strong>
                      </Typography>
                      <div>
                        <IconButton
                          aria-label="delete"
                          onClick={(event) =>
                            this.handleConfirmDialog(forumData, true)
                          }
                          className={
                            this.checkIfUserHasCharacter(forumData.author)
                              ? classes.deleteButton
                              : classes.buttonNotVisible
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
        </div>
        <div>
          <Pagination
            className={classes.pagination}
            count={this.state.count}
            page={this.state.page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => this.handlePageChange(event, value)}
          />
        </div>
        <div>
          <Button
            variant="contained"
            style={{ margin: 10, outline: 0, marginBottom: 20 }}
            className={classes.button}
            startIcon={<Icon>add</Icon>}
            onClick={this.handleOpen}
            disabled={this.state.raidingCharacters.length < 1}
          >
            Reply
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            style={{ margin: 10, outline: 0, marginBottom: 20 }}
          >
            <Link to="/forums" className={classes.link}>
              Forums
            </Link>
          </Button>
        </div>
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.open}
            onClose={this.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={this.state.open}>
              <div className={classes.paper}>
                <form className={classes.form}>
                  <Typography variant="h2" className={classes.modalTitle}>
                    Forum Response
                  </Typography>
                  <Divider className={classes.dividers} />
                  <div className={classes.textField}>
                    <TextField
                      select
                      required
                      helperText="Select a raider to post as"
                      id="raider"
                      name="raider"
                      label="Post As..."
                      variant="outlined"
                      className={classes.category}
                      onChange={this.handleChangePostAs}
                      value={this.state.author}
                    >
                      {this.state.raidingCharacters.map((option) => (
                        <MenuItem
                          key={option.characterName}
                          value={option.characterName}
                        >
                          {option.characterName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className={classes.textField}>
                    <MUIRichTextEditor
                      label="Forum Text"
                      ref={this.ref}
                      onSave={this.onSave}
                      controls={[
                        "title",
                        "bold",
                        "italic",
                        "strikethrough",
                        "numberList",
                        "bulletList",
                        "quote",
                        "code",
                        "highlight",
                        "link",
                        "underline",
                        "media",
                        "upload-image",
                      ]}
                      inlineToolbar={true}
                      customControls={[
                        {
                          name: "upload-image",
                          icon: <BackupIcon />,
                          type: "callback",
                          onClick: (_editorState, _name, anchor) => {
                            this.setState({ anchor: anchor });
                          },
                        },
                      ]}
                    />
                  </div>
                  <div className={classes.recaptcha}>
                    <ReCAPTCHA
                      sitekey={recaptcha.siteKey}
                      onChange={this.recaptchaClicked}
                    />
                  </div>
                  <div className={classes.textField}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.submitForumButton}
                      onClick={this.onSubmit}
                      disabled={
                        this.state.author === "" ||
                        (this.state.captchaIsValid ? false : true)
                      }
                    >
                      Add Response
                    </Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
          <UploadImagePopover
            anchor={this.state.anchor}
            onSubmit={(data, insert) => {
              if (insert && data.file) {
                this.handleFileUpload(data.file);
              }
              this.setState({ anchor: null });
            }}
          />
        </div>
      </div>
    );
  }
}

Forum.propTypes = {
  getForum: PropTypes.func.isRequired,
  forum: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  addResponse: PropTypes.func.isRequired,
  deleteResponse: PropTypes.func.isRequired,
  validateRecaptchaV2: PropTypes.func.isRequired,
  recaptcha: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  forum: state.forums.forumData,
  userInfo: state.userInfo.userData,
  auth: state.auth,
  userIsAdmin: state.userInfo.userIsAdmin,
  recaptcha: state.recaptcha.isValidRecaptcha,
});

export default compose(
  connect(mapStateToProps, {
    getForum,
    getUserInfo,
    addResponse,
    deleteResponse,
    deleteForum,
    validateRecaptchaV2,
  }),
  withStyles(styles, {
    name: "Forum",
  })
)(Forum);
