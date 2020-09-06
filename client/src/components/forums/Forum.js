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
import { addResponse } from "../../actions/forumActions";
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
      let entry = { author: "", text: "", avatarURL: "", date: null };
      entry.author = this.state.forum.author;
      entry.text = this.state.forum.initialText;
      entry.avatarURL = characterAvatar;
      entry.date = date.toUTCString();
      this.setState({ baseForum: entry });
      this.setState({ count: 1 });
    });
    this.state.forumResponses.forEach(async (response) => {
      this.getCharacterAvatar(response.author).then((characterAvatar) => {
        let date = new Date(response.date);
        let entry = {
          author: "",
          text: "",
          avatarURL: "",
          date: null,
          uneditedDate: null,
        };
        entry.author = response.author;
        entry.text = response.responseText;
        entry.avatarURL = characterAvatar;
        entry.date = date.toUTCString();
        entry.uneditedDate = response.date;
        forum.sort(this.sortByDate);
        forum.push(entry);
        this.setState({ completeForum: forum });
        let newCount = forum.length / this.state.pageSize;
        newCount = Math.floor(newCount);
        if (newCount === 0) {
          newCount = 1;
        }
        if (forum.length % this.state.pageSize !== 0) {
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
          characterAvatar = retrievedData.avatar_url;
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
      console.log(this.state.uploadedImages);
    }
  };

  handleClose = () => {
    deleteUploadedImages(this.state.uploadedImages);
    this.setState({ uploadedImages: [] });
    this.setState({ open: false });
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
    };
    this.props.addResponse(newResponse);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
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
                    {this.state.baseForum.author}
                  </Typography>
                </div>
              </Grid>
              <Grid item className={classes.cardTextEditor}>
                <div>
                  <MUIRichTextEditor
                    label="Forum"
                    defaultValue={this.state.baseForum.text}
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
                          {forumData.author}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item className={classes.cardTextEditor}>
                      <div>
                        <MUIRichTextEditor
                          label="Forum"
                          defaultValue={forumData.text}
                          toolbar={false}
                          readOnly={true}
                        ></MUIRichTextEditor>
                      </div>
                    </Grid>
                    <Grid item className={classes.postDate}>
                      <Typography variant="subtitle1" className={classes.date}>
                        <strong>{forumData.date}</strong>
                      </Typography>
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
                  <div className={classes.textField}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.submitForumButton}
                      onClick={this.onSubmit}
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
};
const mapStateToProps = (state) => ({
  forum: state.forums.forumData,
  userInfo: state.userInfo.userData,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getForum, getUserInfo, addResponse }),
  withStyles(styles, {
    name: "Forum",
  })
)(Forum);
