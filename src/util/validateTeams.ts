import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

let teamCount = 10;

const loadTeamFile = (): any => {
  try {
    const doc = yaml.load(
      fs.readFileSync(path.resolve(__dirname, "../../teams.yaml"), "utf8"),
    );
    return doc;
  } catch (e) {
    console.error(e);
  }
};

export const validateTeams = async () => {
  // read the teams.yaml file
  // parse the file as a list of teams

  const teams = await loadTeamFile();

  // if the number of teams is not equal to teamCount, throw an error
  if (teams.length !== teamCount) {
    throw new Error(`Expected ${teamCount} teams, got ${teams.length}`);
  } else {
    // check to see if each team has an id, and that the id is unique, and that it has an array of keywords
    const teamIds = new Set();
    for (const team of teams) {
      if (!team.id) {
        throw new Error("Team is missing an id");
      }
      if (teamIds.has(team.id)) {
        throw new Error(`Team id ${team.id} is not unique`);
      }
      teamIds.add(team.id);
      if (!team.keywords) {
        throw new Error(`Team ${team.id} is missing keywords`);
      }
    }
  }
};

validateTeams();

// if (teams.length !== teamCount) {
//   throw new Error(`Expected ${teamCount} teams, got ${teams.length}`);
// } else {
//   // check to see if each team has an id, and that the id is unique, and that it has an array of keywords
//   const teamIds = new Set();
//   for (const team of teams) {
//     if (!team.id) {
//       throw new Error("Team is missing an id");
//     }
//     if (teamIds.has(team.id)) {
//       throw new Error(`Team id ${team.id} is not unique`);
//     }
//     teamIds.add(team.id);
//     if (!team.keywords) {
//       throw new Error(`Team ${team.id} is missing keywords`);
//     }
//   }
// }
