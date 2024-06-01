"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTeams = void 0;
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const path = __importStar(require("path"));
let teamCount = 10;
const loadTeamFile = () => {
    try {
        const doc = yaml.load(fs.readFileSync(path.resolve(__dirname, "../../teams.yaml"), "utf8"));
        return doc;
    }
    catch (e) {
        console.error(e);
    }
};
const validateTeams = async () => {
    // read the teams.yaml file
    // parse the file as a list of teams
    const teams = await loadTeamFile();
    // if the number of teams is not equal to teamCount, throw an error
    if (teams.length !== teamCount) {
        throw new Error(`Expected ${teamCount} teams, got ${teams.length}`);
    }
    else {
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
exports.validateTeams = validateTeams;
(0, exports.validateTeams)();
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
//# sourceMappingURL=validateTeams.js.map