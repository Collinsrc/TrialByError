import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getForums } from "../../actions/forumActions";

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

  render() {
    return (
      <div>
        <p>Forums Page</p>
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
