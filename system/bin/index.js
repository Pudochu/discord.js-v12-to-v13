const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { converter, files, convertTime } = require('../functions');
const prettier = require('prettier');

let input = yargs.argv.input;
let output = yargs.argv.output;
let pretty = isYes(yargs.argv.pretty);
let log = isYes(yargs.argv.log);

if (yargs.argv.h || !input) {
  console.log(`
  discord.js v12 to v13 code converter
  ----------------------------------
  --input <dir>  input for discord.js v12 project folder
  --output [dir] output path for discord.js v13 project folder
  --pretty       pretty your project codes using prettier, optional.
  --log          enable|disable send logs to the console (default: enabled)
  ${
    chalk.bold.green(`----------------codded by----------------`)
  }\n${
    chalk.bold.yellow(`@ali ghamdan=> https://github.com/alighamdan`)
  }
  \n${
    chalk.bold.green(
      `@Pudochu => https://github.com/pudochu | https://discord.gg/cortex`
    )
    }
  `);
  process.exit(0);
}

if (yargs.argv.version) {
  console.log(require('../package.json').version);
  process.exit(0);
}


if(!fs.existsSync(input)) {
  console.error(
    `🔍 ${chalk.bold.red("No such File or Directory With This directory!")}`
  );
  process.exit(1);
}


let inputPath = path.resolve(input);
let outputPath =
  output ??
  `${input.replace(
    inputPath.split(/\\/)[inputPath.split("\\").length - 1],
    "extracted-v13"
  )}`;

if(!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}
outputPath = path.resolve(outputPath);
let FF = files(inputPath, outputPath);

let inputFiles = FF.map((i) => path.resolve(inputPath, i));

let outputFiles = FF.map((f) => {
  return path.resolve(outputPath, f);
});

if(log) {
  console.info(chalk.bold.grey(`ℹ converting ...`));
}

let startTime = Date.now();

let r = inputFiles.reduce((u, file, i) => {
  let outputFile = outputFiles[i];
  if(!outputFile) return;
  let code = fs.readFileSync(file, "utf-8");

  if(log) {
    console.info(
      chalk.bold.grey(`ℹ converting "${file.replace(inputPath, "")}"`)
    );
  }

  let converted = converter(code);

  if(pretty) {
    try {
      converted = prettier.format(converted, {
        parser: path.extname(file) === "ts" ? "babel-ts" : "babel",
      });
    } catch (e) {}
  }
  if(log) {
    console.info(
      chalk.bold.grey(
        `ℹ converted "${file.replace(inputPath, "")}" in ${Date.now() -
          startTime}ms`
      )
    );
  }
  fs.writeFileSync(outputFile, converted);
  u.push({
    input: file,
    output: outputFile,
    code,
    converted,
  })
  return u;
}, [])

if (log) {
  console.info(
    chalk.bold.grey(
      `ℹ converted ${r.length} files in ${convertTime(Date.now() - startTime)}ms`
    )
  );
}

function isYes(str) {
  return [
    "yes",
    "on",
    "true",
    "enable",
    "run",
    "1",
    "start",
    "y",
    "ye"
  ].includes(String(str).toLowerCase())
}