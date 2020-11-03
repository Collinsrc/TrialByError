import React, { Component, createRef, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getUserInfo } from "../../actions/userInfoActions";
import {
  getAllMainData,
  createPost,
  deletePost,
} from "../../actions/mainDataActions";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MUIRichTextEditor from "mui-rte";
import Pagination from "@material-ui/lab/Pagination";
import { storage } from "../../firebase";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import BackupIcon from "@material-ui/icons/Backup";
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = (theme) => {
  return {
    dividers: {
      variant: "middle",
      orientation: "horizontal",
      height: 2,
      margin: 10,
      marginBottom: 20,
    },
    link: {
      textDecoration: "none",
      color: "blue",
      "&:hover": {
        color: "inherit",
        textDecoration: "none",
      },
    },
    buttonHidden: {
      display: "none",
    },
    addButtonDisplays: {
      color: "blue",
    },
    pagination: {
      marginTop: 10,
    },
    card: {
      backgroundColor: "#fafafa",
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
      maxHeight: 900,
      height: 800,
      width: "80%",
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
    modalTitle: {
      display: "flex",
      justifyContent: "center",
    },
    textField: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    submitPostButton: {
      justifyContent: "flex-center",
      display: "flex",
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      marginBottom: 10,
    },
    postTitle: {
      width: "50%",
      justifyContent: "center",
    },
    cardDiv: {},
    removePostButton: {
      textAlign: "right",
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
        width: 1680,
        height: 945,
        alignment: "center", // or "center", "right"
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

class MainPageComponent extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: {},
      mainData: [],
      page: 1,
      count: 1,
      pageSize: 5,
      currentIndex: -1,
      openCreatePost: false,
      uploadedImages: [],
      initalText: "",
      anchor: null,
      postTitle: "",
      openSnackbar: false,
      errorText: "",
      openConfirmDialog: false,
      postToRemove: {},
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const { user } = this.props.auth;
    if (this.props.auth.isAuthenticated === true) {
      this.getUserInfo(user.username).then(() => {
        this.setState({ currentUser: this.props.userInfo });
      });
    }
    this.getAllMainData().then(() => {
      this.setState({ mainData: this.props.mainData });
      let newCount = this.props.mainData.length / this.state.pageSize;
      newCount = Math.floor(newCount);
      if (newCount === 0) {
        newCount = 1;
      } else if (this.props.mainData.length % this.state.pageSize !== 0) {
        newCount += 1;
      }
      this.setState({ count: newCount });
    });

    this.ref = createRef(null);
  }

  async getAllMainData() {
    await this.props.getAllMainData();
    return Promise.resolve();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getUserInfo(username) {
    await this.props.getUserInfo(username);
    return Promise.resolve();
  }

  sortByDate(a, b) {
    var dateA = new Date(a.dateCreated),
      dateB = new Date(b.dateCreated);
    return dateA - dateB;
  }

  handlePageChange(event, value) {
    this.setState({ page: value });
    let allPosts = this.state.mainData;
    allPosts.sort(this.sortByDate);
    this.setState({ mainData: allPosts });
  }

  handleOpenCreatePost = () => {
    this.setState({ openCreatePost: true });
  };

  handleCloseCreatePost = () => {
    deleteUploadedImages(this.state.uploadedImages);
    this.setState({ uploadedImages: [] });
    this.setState({ openCreatePost: false });
  };

  onSave = async (data) => {
    this.setState({ initialText: data });
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

  onSubmit = async () => {
    await this.ref.current.save();
    const newPost = {
      title: this.state.postTitle,
      author: this.state.currentUser.username,
      initialText: this.state.initialText,
      uploadedImages: this.state.uploadedImages,
    };
    this.attemptPostSubmit(newPost).then(() => {
      if (this._isMounted) {
        this.checkForErrors();
      }
    });
  };

  checkForErrors() {
    if (this.props.errors.post) {
      if (this.props.errors.post === "TPAE") {
        this.setState({ errorText: "Title of post already exists" });
      } else if (this.props.errors.post === "CAP") {
        this.setState({
          errorText: "Couldn't add post to database",
        });
      }
      this.setState({ openSnackbar: true });
    } else {
      window.location.reload();
    }
  }

  async attemptPostSubmit(newPost) {
    await this.props.createPost(newPost);
    return Promise.resolve();
  }

  handleChangePostTitle = (e) => {
    this.setState({ postTitle: e.target.value });
  };

  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  handleConfirmDialog = (postData) => {
    this.setState({ openConfirmDialog: true, postToRemove: postData });
  };

  closeConfirmDialog = () => {
    this.setState({ openConfirmDialog: false });
  };

  initiateDeletePost = async () => {
    this.props.deletePost(this.state.postToRemove);
    await deleteUploadedImages(this.state.postToRemove.uploadedImages).then(
      () => {
        window.location.reload();
      }
    );
  };

  getUTCDate(date) {
    let newDate = new Date(date);
    return newDate.toUTCString();
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
            {"Are you sure you want to delete the post?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is not reversable. Any photos that were uploaded to the post
              will be deleted forever.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.initiateDeletePost} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          disableWindowBlurListener={false}
          onClose={this.handleSnackClose}
          message={this.state.errorText}
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
        <Typography variant="h2">
          Welcome to the Trial By Error Guild Website!
        </Typography>
        <br />
        <Typography>
          Trial By Error is a semi hardcore WoW raiding guild on the US Server
          Area-52. The goal of the guild is to have a dedicated and competent
          raid team to clear mythic level content whilst having fun and being
          laid back. We're not a hardcore guild thats attempting server or world
          first raid clears, however, we do expect to hit AOTC (Ahead of the
          Curve) and expect raiders to take raiding seriously. When we're not
          killing bosses, we want to have an open and mature group experience
          where we can relax and have fun.
        </Typography>
        <br />
        <Typography>
          Anyone is welcome to apply to join the guild casually (or participate
          in Mythic+ runs)! However, we are looking for the following classes
          and specs:
        </Typography>
        <br />
        <Typography>
          <strong>Currently Recruiting</strong>
        </Typography>
        <Typography>
          <strong>Tanks: </strong> All but Blood DK
        </Typography>
        <Typography>
          <strong>Healers: </strong> All but Resto Shaman
        </Typography>
        <Typography>
          <strong>DPS: </strong> All
        </Typography>
        <div>
          <Button
            className={
              this.props.auth.isAuthenticated ? classes.buttonHidden : ""
            }
          >
            <Link to="/roster" className={classes.link}>
              View the Team
            </Link>
          </Button>
          <Button
            className={
              this.props.auth.isAuthenticated ? classes.buttonHidden : ""
            }
          >
            <Link to="/register" className={classes.link}>
              Create an Account
            </Link>
          </Button>
          <Button
            className={
              this.props.auth.isAuthenticated ? classes.buttonHidden : ""
            }
          >
            <Link to="/login" className={classes.link}>
              Login
            </Link>
          </Button>
          <Button
            className={
              this.state.currentUser.isAdmin && this.props.auth.isAuthenticated
                ? classes.addButtonDisplays
                : classes.buttonHidden
            }
            onClick={this.handleOpenCreatePost}
          >
            Add Main Page Item
          </Button>
        </div>
        <br />
        <Divider className={classes.dividers} />
        <div>
          {this.state.mainData
            .slice(
              (this.state.page - 1) * this.state.pageSize,
              (this.state.page - 1) * this.state.pageSize +
                this.state.pageSize <
                this.state.mainData.length
                ? (this.state.page - 1) * this.state.pageSize +
                    this.state.pageSize
                : this.state.mainData.length
            )
            .map((postData, index) => (
              <Card className={classes.card} key={index}>
                <CardContent>
                  <div className={classes.cardDiv}>
                    <Typography variant="h3">{postData.title}</Typography>
                    <div className={classes.removePostButton}>
                      <Typography>
                        {this.getUTCDate(postData.dateCreated)}
                      </Typography>
                    </div>
                    <div className={classes.cardDiv}>
                      <MUIRichTextEditor
                        label="MainData"
                        defaultValue={postData.initialText}
                        toolbar={false}
                        readOnly={true}
                      ></MUIRichTextEditor>
                    </div>
                    <div className={classes.removePostButton}>
                      <Button
                        aria-label="delete"
                        onClick={(event) => this.handleConfirmDialog(postData)}
                        className={
                          this.state.currentUser.isAdmin &&
                          this.props.auth.isAuthenticated
                            ? ""
                            : classes.buttonHidden
                        }
                      >
                        Remove Post
                      </Button>
                    </div>
                  </div>
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
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.openCreatePost}
            onClose={this.handleCloseCreatePost}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={this.state.openCreatePost}>
              <div className={classes.paper}>
                <form className={classes.form}>
                  <Typography variant="h2" className={classes.modalTitle}>
                    Add Post
                  </Typography>
                  <div className={classes.textField}>
                    <TextField
                      required
                      helperText="Enter a Post Title"
                      id="postTitle"
                      label="Post Title"
                      variant="outlined"
                      value={this.state.postTitle}
                      onChange={this.handleChangePostTitle}
                      className={classes.postTitle}
                    />
                  </div>
                  <div className={classes.textField}>
                    <MUIRichTextEditor
                      label="Post Text"
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
                  <div className={classes.textField}>
                    <Button
                      //type="submit"
                      variant="contained"
                      className={classes.submitPostButton}
                      onClick={this.onSubmit}
                      disabled={this.state.postTitle === ""}
                    >
                      Add Post
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

MainPageComponent.propTypes = {
  auth: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  mainData: PropTypes.array.isRequired,
  getAllMainData: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userInfo: state.userInfo.userData,
  mainData: state.mainData.mainData,
  errors: state.errors,
});

export default compose(
  connect(mapStateToProps, {
    getUserInfo,
    getAllMainData,
    createPost,
    deletePost,
  }),
  withStyles(styles, {
    name: "MainPageComponent",
  })
)(MainPageComponent);
