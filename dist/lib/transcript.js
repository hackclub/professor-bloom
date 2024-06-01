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
exports.transcript = void 0;
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const path = __importStar(require("path"));
const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
const loadTranscript = () => {
    try {
        const doc = yaml.load(fs.readFileSync(path.resolve(__dirname, "../../transcript.yaml"), "utf8"));
        return doc;
    }
    catch (e) {
        console.error(e);
    }
};
const recurseTranscript = (searchArr, transcriptObj) => {
    const searchCursor = searchArr.shift();
    const targetObj = transcriptObj[searchCursor];
    if (!targetObj) {
        throw new Error(transcript("errors.transcript"));
    }
    if (searchArr.length > 0) {
        return recurseTranscript(searchArr, targetObj);
    }
    else {
        if (Array.isArray(targetObj)) {
            return sample(targetObj);
        }
        else {
            return targetObj;
        }
    }
};
const replaceErrors = (key, value) => {
    // from https://stackoverflow.com/a/18391400
    if (value instanceof Error) {
        const error = {};
        Object.getOwnPropertyNames(value).forEach((key) => {
            error[key] = value[key];
        });
        return error;
    }
    return value;
};
const transcript = (search, vars) => {
    // if (vars) {
    //   console.log(
    //     colors.blue(
    //       `I'm searching for words in my yaml file under "${search}". These variables are set: ${JSON.stringify(
    //         vars,
    //         replaceErrors
    //       )}`
    //     )
    //   );
    // } else {
    //   console.log(`I'm searching for words in my yaml file under "${search}"`);
    // }
    const searchArr = search.split(".");
    const transcriptObj = loadTranscript();
    let dehydratedTarget;
    try {
        dehydratedTarget = recurseTranscript(searchArr, transcriptObj);
    }
    catch (e) {
        console.log(e);
        dehydratedTarget = search;
    }
    return hydrateObj(dehydratedTarget, vars);
};
exports.transcript = transcript;
const hydrateObj = (obj, vars = {}) => {
    if (obj == null) {
        return null;
    }
    if (typeof obj === "string") {
        return evalTranscript(obj, vars);
    }
    if (Array.isArray(obj)) {
        return obj.map((o) => hydrateObj(o, vars));
    }
    if (typeof obj === "object") {
        Object.keys(obj).forEach((key) => {
            obj[key] = hydrateObj(obj[key], vars);
        });
        return obj;
    }
};
const evalTranscript = (target, vars = {}) => function () {
    return eval("`" + target + "`");
}.call({
    ...vars,
    t: transcript,
});
//# sourceMappingURL=transcript.js.map