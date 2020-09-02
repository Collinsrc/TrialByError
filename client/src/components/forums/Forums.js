import React, { Component } from "react";
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
      height: 400,
      maxWidth: "60%",
      overflow: "auto",
    },
  };
};

class Forums extends Component {
  constructor() {
    super();

    this.state = {
      forums: [],
      open: false,
    };
  }

  componentDidMount() {
    this.getAllForums().then(() => {
      this.setState({ forums: this.props.forums });
    });
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
              <Typography variant="h2" style={{ textAlign: "center" }}>
                Create Forum
              </Typography>
              <br />
              <MUIRichTextEditor
                className={classes.textEditor}
                label="Forum Text"
              />
              <br />
              <Button
                variant="contained"
                style={{
                  marginTop: 20,
                  outline: 0,
                  marginLeft: "43%",
                }}
                className={classes.button}
              >
                Submit Forum
              </Button>
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
