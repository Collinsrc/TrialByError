import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export default class SelectClassSpec extends Component {
  constructor() {
    super();
    this.state = {
      classSelection: "",
      specSelection: "",
    };
  }

  handleChangeClass = (e) => {
    this.setState({ classSelection: e.target.value });
    this.props.callbackClass(e.target.value);
  };

  handleChangeSpec = (e) => {
    this.setState({ specSelection: e.target.value });
    this.props.callbackSpec(e.target.value);
  };
  render() {
    const classesAndSpecs = [
      {
        classname: "Death Knight",
        spec: ["Blood", "Frost", "Unholy"],
      },
      {
        classname: "Demon Hunter",
        spec: ["Havoc", "Vengeance"],
      },
      {
        classname: "Druid",
        spec: ["Balance", "Feral", "Guardian", "Restoration"],
      },
      {
        classname: "Hunter",
        spec: ["Beast Mastery", "Marksmanship", "Survival"],
      },
      {
        classname: "Mage",
        spec: ["Arcane", "Frost", "Fire"],
      },
      {
        classname: "Monk",
        spec: ["Brewmaster", "Mistweaver", "Windwalker"],
      },
      {
        classname: "Paladin",
        spec: ["Holy", "Protection", "Retribution"],
      },
      {
        classname: "Priest",
        spec: ["Discipline", "Holy", "Shadow"],
      },
      {
        classname: "Rogue",
        spec: ["Assassination", "Outlaw", "Subtlety"],
      },
      {
        classname: "Shaman",
        spec: ["Elemental", "Enhancement", "Restoration"],
      },
      {
        classname: "Warlock",
        spec: ["Affliction", "Demonology", "Destruction"],
      },
      {
        classname: "Warrior",
        spec: ["Arms", "Fury", "Protection"],
      },
    ];
    return (
      <div>
        <TextField
          select
          required
          label="Class"
          value={this.state.classSelection}
          onChange={this.handleChangeClass}
          variant="outlined"
          helperText="Select a class"
          style={{ margin: 10, width: "50%" }}
          id="classSelection"
          name="classSelection"
        >
          {classesAndSpecs.map((option) => (
            <MenuItem key={option.classname} value={option.classname}>
              {option.classname}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <TextField
          select
          required
          label="Spec"
          value={this.state.specSelection}
          onChange={this.handleChangeSpec}
          variant="outlined"
          helperText="Select a spec"
          style={{ margin: 10, width: "50%" }}
          id="specSelection"
          name="specSelection"
        >
          {classesAndSpecs
            .filter(
              (classname) => classname.classname === this.state.classSelection
            )
            .map((filteredClassName) =>
              filteredClassName.spec.map((specOption) => (
                <MenuItem key={specOption} value={specOption}>
                  {specOption}
                </MenuItem>
              ))
            )}
        </TextField>
      </div>
    );
  }
}
