import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRaiders } from "../../actions/raiderActions";

import { makeStyles } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

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
  dividers: {
    variant: "middle",
    orientation: "horizontal",
    height: 2,
  },
}));

const DividerStyle = () => {
  const classes = useStyles();
  return <Divider className={classes.dividers} />;
};

class Roster extends Component {
  constructor() {
    super();

    this.state = {
      raiders: [],
      tanks: [],
      dps: [],
      healers: [],
    };
  }

  componentDidMount() {
    this.getRaiderInformation().then(() => {
      //console.log(this.props.raider);
      this.setState({ raiders: this.props.raider });
      this.assignBasedOffRole();
    });
  }

  assignBasedOffRole() {
    let tanks = [];
    let dps = [];
    let healers = [];
    this.state.raiders.forEach((character) => {
      if (character.role === "Tank") {
        tanks.push(character);
      } else if (character.role === "DPS") {
        dps.push(character);
      } else {
        healers.push(character);
      }
    });
    this.setState({ tanks: tanks });
    this.setState({ dps: dps });
    this.setState({ healers: healers });
  }

  getColorForCard(characterClass) {
    switch (characterClass) {
      case "Death Knight":
        return "#CE375F";
      case "Demon Hunter":
        return "#A330C9";
      case "Druid":
        return "#F07C23";
      case "Hunter":
        return "#9BC075";
      case "Mage":
        return "#8BDEFB";
      case "Monk":
        return "#37A587";
      case "Paladin":
        return "#F58CBA";
      case "Priest":
        return "#FFFFFF";
      case "Rogue":
        return "#FFEF70";
      case "Warrior":
        return "#AF9074";
      case "Shaman":
        return "#2686DF";
      case "Warlock":
        return "#9860B7";
      default:
        return "#FFFFFF";
    }
  }

  async getRaiderInformation() {
    await this.props.getRaiders();
    return Promise.resolve();
  }

  render() {
    return (
      <div>
        <Typography variant="h4">The Team</Typography>
        <DividerStyle />
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <Grid item style={{ width: "33%" }}>
            <Typography variant="h6">Tanks</Typography>
            <DividerStyle />
            {this.state.tanks.map((character) => (
              <Card
                key={character.name}
                style={{
                  marginTop: "10px",
                  backgroundColor: this.getColorForCard(character.class),
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography>
                    <strong>Name: {character.characterName}</strong>
                  </Typography>
                  <Typography>
                    <strong>Class: {character.class}</strong>
                  </Typography>
                  <Typography>
                    <strong>Spec: {character.spec}</strong>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item style={{ width: "33%" }}>
            <Typography variant="h6">DPS</Typography>
            <DividerStyle />
            {this.state.dps.map((character) => (
              <Card
                key={character.name}
                style={{
                  marginTop: "10px",
                  backgroundColor: this.getColorForCard(character.class),
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography>
                    <strong>Name: {character.characterName}</strong>
                  </Typography>
                  <Typography>
                    <strong>Class: {character.class}</strong>
                  </Typography>
                  <Typography>
                    <strong>Spec: {character.spec}</strong>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item style={{ width: "33%" }}>
            <Typography variant="h6">Healers</Typography>
            <DividerStyle />
            {this.state.healers.map((character) => (
              <Card
                key={character.name}
                style={{
                  marginTop: "10px",
                  backgroundColor: this.getColorForCard(character.class),
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography>
                    <strong>Name: {character.characterName}</strong>
                  </Typography>
                  <Typography>
                    <strong>Class: {character.class}</strong>
                  </Typography>
                  <Typography>
                    <strong>Spec: {character.spec}</strong>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Roster.propTypes = {
  raider: PropTypes.object.isRequired,
  getRaiders: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  raider: state.raider.raiders,
});

export default connect(mapStateToProps, { getRaiders })(Roster);
