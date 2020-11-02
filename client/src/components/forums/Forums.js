import React, { Component, createRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForums, createForum } from "../../actions/forumActions";
import compose from "recompose/compose";
import MaterialTable from "material-table";

import Button from "@material-ui/core/Button";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MUIRichTextEditor from "mui-rte";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import BackupIcon from "@material-ui/icons/Backup";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Snackbar from "@material-ui/core/Snackbar";

import { storage } from "../../firebase";
import { getUserInfo } from "../../actions/userInfoActions";
import ReCAPTCHA from "react-google-recaptcha";
import recaptcha from "../../config/recaptchaV2";
import { validateRecaptchaV2 } from "../../actions/recaptchaActions";

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
      marginBottom: 10,
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
      maxHeight: 800,
      height: 800,
      width: "70%",
      overflow: "auto",
      display: "flex",
      outline: "none",
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
    modalTitle: {
      display: "flex",
      justifyContent: "center",
    },
    forumTitle: {
      width: "50%",
      justifyContent: "center",
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
    recaptcha: {
      display: "flex",
      justifyContent: "center",
      marginTop: 50,
      marginBottom: 10,
    },
  };
};

const categories = ["General", "Raiding", "UI"];

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

class Forums extends Component {
  constructor() {
    super();

    this.state = {
      forums: [],
      open: false,
      categorySelection: "",
      forumTitle: "",
      initialText: "",
      anchor: null,
      uploadedImages: [],
      openSnackbar: false,
      characters: [],
      raidingCharacters: [],
      author: "",
      captchaIsValid: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
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
    this.getAllForums().then(() => {
      this.setState({ forums: this.props.forums });
    });
    this.ref = createRef(null);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getAllForums() {
    await this.props.getForums();
    return Promise.resolve();
  }

  async getUserInfo(username) {
    await this.props.getUserInfo(username);
    return Promise.resolve();
  }

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

  rowClick(rowData) {
    this.props.history.push("./forums/:" + rowData.title);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    deleteUploadedImages(this.state.uploadedImages);
    this.setState({ uploadedImages: [], open: false, captchaIsValid: false });
  };

  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  handleChangeCategory = (e) => {
    this.setState({ categorySelection: e.target.value });
  };

  handleChangePostAs = (e) => {
    this.setState({ author: e.target.value });
  };

  handleChangeForumTitle = (e) => {
    this.setState({ forumTitle: e.target.value });
  };

  onSave = async (data) => {
    this.setState({ initialText: data });
  };

  onSubmit = async () => {
    await this.ref.current.save();
    const newForum = {
      title: this.state.forumTitle,
      category: this.state.categorySelection,
      author: this.state.author,
      initialText: this.state.initialText,
      uploadedImages: this.state.uploadedImages,
      authorUsername: this.props.userInfo.username,
    };
    this.attemptForumSubmit(newForum).then(() => {
      if (this._isMounted) {
        this.checkForErrors(newForum);
      }
    });
  };

  async attemptForumSubmit(newForum) {
    await this.props.createForum(newForum);
    return Promise.resolve();
  }

  checkForErrors(newForum) {
    if (this.props.errors.forum) {
      this.setState({ openSnackbar: true });
      return;
    }
    this.props.history.push("./forums/:" + newForum.title);
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
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          disableWindowBlurListener={false}
          onClose={this.handleSnackClose}
          message="Forum already exists or could not add forum"
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackClose}
              >
                CLOSE
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <div>
          <Typography variant="h6">
            Contribute to the conversation as a raider!
          </Typography>
          <Button
            variant="contained"
            style={{ margin: 10, outline: 0, marginBottom: 20 }}
            className={classes.button}
            startIcon={<Icon>add</Icon>}
            onClick={this.handleOpen}
            disabled={this.state.raidingCharacters.length < 1}
          >
            Create Forum
          </Button>
        </div>
        <MaterialTable
          columns={[
            { title: "Forum Name", field: "title" },
            { title: "Category", field: "category" },
            { title: "Author", field: "author" },
            { title: "Date Created", field: "dateString" },
            { title: "Replies", field: "replies", type: "numeric" },
          ]}
          data={this.state.forums}
          title={<Typography variant="h4">Guild Forums</Typography>}
          onRowClick={(event, rowData) => this.rowClick(rowData)}
        />
        <UploadImagePopover
          anchor={this.state.anchor}
          onSubmit={(data, insert) => {
            if (insert && data.file) {
              this.handleFileUpload(data.file);
            }
            this.setState({ anchor: null });
          }}
        />
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
                  Create Forum
                </Typography>
                <Divider className={classes.dividers} />
                <div className={classes.textField}>
                  <TextField
                    required
                    helperText="Enter a Forum Title"
                    id="forumTitle"
                    label="Forum Title"
                    variant="outlined"
                    value={this.state.forumTitle}
                    onChange={this.handleChangeForumTitle}
                    className={classes.forumTitle}
                  />
                </div>
                <div className={classes.textField}>
                  <TextField
                    select
                    required
                    helperText="Select a category"
                    id="category"
                    name="category"
                    label="Category"
                    variant="outlined"
                    className={classes.category}
                    onChange={this.handleChangeCategory}
                    value={this.state.categorySelection}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
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
                    variant="contained"
                    className={classes.submitForumButton}
                    onClick={this.onSubmit}
                    disabled={
                      this.state.forumTitle === "" ||
                      this.state.categorySelection === "" ||
                      this.state.author === "" ||
                      (this.state.captchaIsValid ? false : true)
                    }
                  >
                    Submit Forum
                  </Button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

Forums.propTypes = {
  getForums: PropTypes.func.isRequired,
  createForum: PropTypes.func.isRequired,
  forums: PropTypes.objectOf(PropTypes.array).isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  validateRecaptchaV2: PropTypes.func.isRequired,
  recaptcha: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  forums: state.forums.forumData,
  auth: state.auth,
  errors: state.errors,
  userInfo: state.userInfo.userData,
  recaptcha: state.recaptcha.isValidRecaptcha,
});

export default compose(
  connect(mapStateToProps, {
    getForums,
    createForum,
    getUserInfo,
    validateRecaptchaV2,
  }),
  withStyles(styles, {
    name: "Forums",
  })
)(Forums);
