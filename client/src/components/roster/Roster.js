import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRaiders } from "../../actions/raiderActions";
import axios from "axios";

import { makeStyles } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";

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
      this.setState({ raiders: this.props.raider });
      this.assignBasedOffRole();
    });
  }

  getCharacterBust = async (characterName) => {
    let characterBust = "";
    await axios
      .get("/api/blizzard/getCharacterBust/" + characterName.toLowerCase())
      .then((res) => {
        if (res.data === "CBNF") {
          return "";
        } else {
          let retrievedData = res.data;
          let bust_url = retrievedData.bust_url;
          if (bust_url !== undefined) {
            characterBust = bust_url;
          } else {
            console.log(retrievedData.assets[1].value);
            retrievedData = retrievedData.assets;
            characterBust = retrievedData[1].value;
          }
        }
      });
    return Promise.resolve(characterBust);
  };

  createCharacter(character, characterBust) {
    let characterNew = {
      characterName: character.characterName,
      characterClass: character.class,
      role: character.role,
      spec: character.spec,
      avatarImg: characterBust,
    };
    return characterNew;
  }

  async assignBasedOffRole() {
    let tanks = [];
    let dps = [];
    let healers = [];
    this.state.raiders.forEach(async (character) => {
      if (character.role === "Tank") {
        this.getCharacterBust(character.characterName).then((characterBust) => {
          let characterNew = this.createCharacter(character, characterBust);
          tanks.push(characterNew);
          this.setState({ tanks: tanks });
        });
      } else if (character.role === "DPS") {
        this.getCharacterBust(character.characterName).then((characterBust) => {
          let characterNew = this.createCharacter(character, characterBust);
          dps.push(characterNew);
          this.setState({ dps: dps });
        });
      } else {
        this.getCharacterBust(character.characterName).then((characterBust) => {
          let characterNew = this.createCharacter(character, characterBust);
          healers.push(characterNew);
          this.setState({ healers: healers });
        });
      }
    });
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
                  backgroundColor: this.getColorForCard(
                    character.characterClass
                  ),
                  display: "flex",
                  alignItems: "center",
                }}
                elevation={4}
              >
                <CardMedia
                  component="img"
                  alt="CharacterBust"
                  title="CharacterBust"
                  image={character.avatarImg}
                  style={{ width: "40%" }}
                />
                <div style={{ marginLeft: "20%" }}>
                  <CardContent>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Name: {character.characterName}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Class: {character.characterClass}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Spec: {character.spec}</strong>
                    </Typography>
                  </CardContent>
                </div>
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
                  backgroundColor: this.getColorForCard(
                    character.characterClass
                  ),
                  display: "flex",
                  alignItems: "center",
                }}
                elevation={4}
              >
                <CardMedia
                  component="img"
                  alt="CharacterBust"
                  title="CharacterBust"
                  image={character.avatarImg}
                  style={{ width: "40%" }}
                />
                <div style={{ marginLeft: "20%" }}>
                  <CardContent>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Name: {character.characterName}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Class: {character.characterClass}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Spec: {character.spec}</strong>
                    </Typography>
                  </CardContent>
                </div>
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
                  backgroundColor: this.getColorForCard(
                    character.characterClass
                  ),
                  display: "flex",
                  alignItems: "center",
                }}
                elevation={4}
              >
                <CardMedia
                  component="img"
                  alt="CharacterBust"
                  title="CharacterBust"
                  image={character.avatarImg}
                  style={{ width: "40%" }}
                />
                <div style={{ marginLeft: "20%" }}>
                  <CardContent>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Name: {character.characterName}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Class: {character.characterClass}</strong>
                    </Typography>
                    <Typography style={{ textAlign: "left" }}>
                      <strong>Spec: {character.spec}</strong>
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Roster.propTypes = {
  raider: PropTypes.objectOf(PropTypes.array).isRequired,
  getRaiders: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  raider: state.raider.raiders,
});

export default connect(mapStateToProps, { getRaiders })(Roster);
