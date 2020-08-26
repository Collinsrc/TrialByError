import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForums } from "../../actions/forumActions";
import MaterialTable from "material-table";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

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
  },
}));

function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const ButtonTheme = () => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      style={{ margin: 10, outline: 0, marginBottom: 20 }}
      className={classes.button}
      startIcon={<Icon>add</Icon>}
      onClick={openModal()}
    >
      Create Forum
    </Button>
  );
};

const openModal = () => {
  TransitionsModal().handleOpen();
};

class Forums extends Component {
  constructor() {
    super();

    this.state = {
      forums: [],
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

  render() {
    return (
      <div>
        <ButtonTheme />
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
      </div>
    );
  }
}

Forums.propTypes = {
  getForums: PropTypes.func.isRequired,
  forums: PropTypes.objectOf(PropTypes.array).isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  forums: state.forums.forumData,
  auth: state.auth,
});

export default connect(mapStateToProps, { getForums })(Forums);
