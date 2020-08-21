import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForums } from "../../actions/forumActions";
import MaterialTable from "material-table";

import Typography from "@material-ui/core/Typography";

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
    //console.log(rowData.title);
    window.location.href = "./forums/:" + rowData.title;
  }
  render() {
    return (
      <div>
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
};
const mapStateToProps = (state) => ({
  forums: state.forums.forumData,
});

export default connect(mapStateToProps, { getForums })(Forums);
