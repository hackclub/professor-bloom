import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

const sample = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const loadTranscript = (): any => {
  try {
    const doc = yaml.load(
      fs.readFileSync(path.resolve(__dirname, "../../transcript.yaml"), "utf8")
    );
    return doc;
  } catch (e) {
    console.error(e);
  }
};

const recurseTranscript = (searchArr: string[], transcriptObj: any): any => {
  const searchCursor = searchArr.shift();
  const targetObj = transcriptObj[searchCursor!];

  if (!targetObj) {
    throw new Error(transcript("errors.transcript"));
  }
  if (searchArr.length > 0) {
    return recurseTranscript(searchArr, targetObj);
  } else {
    if (Array.isArray(targetObj)) {
      return sample(targetObj);
    } else {
      return targetObj;
    }
  }
};

const replaceErrors = (key: string, value: any): any => {
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

const transcript = (search: string, vars?: any): any => {
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
  } catch (e) {
    console.log(e);
    dehydratedTarget = search;
  }
  return hydrateObj(dehydratedTarget, vars);
};

export { transcript };

const hydrateObj = (obj: any, vars: any = {}): any => {
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

const evalTranscript = (target: string, vars: any = {}): any =>
  function () {
    return eval("`" + target + "`");
  }.call({
    ...vars,
    t: transcript,
  });
