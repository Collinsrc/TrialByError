import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForums } from "../../actions/forumActions";
import compose from "recompose/compose";
import MaterialTable from "material-table";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MUIRichTextEditor from "mui-rte";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";

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
      maxHeight: 600,
      height: 550,
      width: "50%",
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
  };
};

const categories = ["General", "Raiding", "UI"];

class Forums extends Component {
  constructor() {
    super();

    this.state = {
      forums: [],
      open: false,
      categorySelection: "",
      forumTitle: "",
      initialText: "",
    };
  }

  componentDidMount() {
    this.getAllForums().then(() => {
      this.setState({ forums: this.props.forums });
    });
    this.ref = createRef(null);
  }

  async getAllForums() {
    await this.props.getForums();
    return Promise.resolve();
  }

  rowClick(rowData) {
    window.location.href = "./forums/:" + rowData.title;
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeCategory = (e) => {
    this.setState({ categorySelection: e.target.value });
  };

  handleChangeForumTitle = (e) => {
    this.setState({ forumTitle: e.target.value });
  };

  handleChangeText = (data) => {
    this.setState({ initialText: data });
  };

  onSave = (data) => {
    this.setState({ initialText: data });
  };

  onSubmit = async () => {
    await this.ref.current.save();
    const { user } = this.props.auth;
    const newForum = {
      title: this.state.forumTitle,
      category: this.state.categorySelection,
      author: user.username,
      initialText: this.state.initialText,
    };
    console.log(newForum);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          style={{ margin: 10, outline: 0, marginBottom: 20 }}
          className={classes.button}
          startIcon={<Icon>add</Icon>}
          onClick={this.handleOpen}
        >
          Create Forum
        </Button>
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
                  <MUIRichTextEditor
                    label="Forum Text"
                    ref={this.ref}
                    onSave={this.onSave}
                    customControls={[
                      {
                        name: "upload-image",
                        icon: <Icon>Backup</Icon>,
                        type: "callback",
                      },
                    ]}
                  />
                </div>
                <div className={classes.textField}>
                  <Button
                    variant="contained"
                    className={classes.submitForumButton}
                    onClick={this.onSubmit}
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
  forums: PropTypes.objectOf(PropTypes.array).isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  forums: state.forums.forumData,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getForums }),
  withStyles(styles, {
    name: "Forums",
  })
)(Forums);
