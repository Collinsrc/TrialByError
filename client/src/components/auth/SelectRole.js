import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const roles = [
  {
    value: "Tank",
    label: "Tank",
  },
  {
    value: "Healer",
    label: "Healer",
  },
  {
    value: "DPS",
    label: "DPS",
  },
];

export default class SelectRole extends Component {
  constructor() {
    super();
    this.state = {
      roleSelection: "",
    };
  }

  handleChange = (e) => {
    this.setState({ roleSelection: e.target.value });
    this.props.callback(e.target.value);
  };

  render() {
    return (
      <div>
        <TextField
          select
          required
          label="Role"
          value={this.state.roleSelection}
          onChange={this.handleChange}
          variant="outlined"
          helperText="Select a role"
          style={{ margin: 10, width: "50%" }}
          id="roleSelection"
          name="roleSelection"
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  }
}
