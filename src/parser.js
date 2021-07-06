const fs = require('fs');
const dayjs = require('dayjs');
const filePath = '/Users/Mac/Desktop/algorithm.log';

const userKeys = [
  'Start Time',
  'End Time',
  'Start counting lines for',
  'Name',
  'Type',
  'Version',
  'Memory',
  'Size',
  'Found directory at',
];

const splitDataToArr = (filePath) => {
  const inputFile = fs.readFileSync(filePath, 'utf-8');
  const textByLine = inputFile.split('\n');
  return textByLine;
};
const addCPU = (arr, divider) => {
  const cpuMakers = ['intel', 'amd'];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes(divider)) {
      continue;
    }
    for (let j = 0; j < cpuMakers.length; j++) {
      if (arr[i].toLocaleLowerCase().includes(cpuMakers[j])) {
        return `CPU${divider} ${arr[i]}`;
      }
    }
  }
  return;
};

const addUserKeyValue = (arr, userKeys, divider) => {
  const output = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < userKeys.length; j++) {
      if (arr[i].toLocaleLowerCase().includes(`${userKeys[j]}${divider}`)) {
        continue;
      }
      if (
        arr[i].toLocaleLowerCase().includes(userKeys[j].toLocaleLowerCase())
      ) {
        const newKeyValue = arr[i].replace(
          userKeys[j],
          `${userKeys[j]}${divider}`
        );
        output.push(newKeyValue);
      }
    }
  }
  return output;
};

const basicKeyValueSplit = (arr, divider, whitelist) => {
  const input = [...arr];
  // Adding custom line to input array for cpu maker
  const CPU = addCPU(input, divider);
  if (CPU) {
    input.push(CPU);
  }
  // Adding custom lines to input array for user selected keys
  const userKeyValues = addUserKeyValue(input, userKeys, divider);
  if (userKeyValues.length > 0) {
    userKeyValues.forEach((value) => input.push(value));
  }
  const output = {};
  const specialCharRegExList = `[&\/\\,+()$~%.#'":*?<>{}\-]`;
  const getSpecialCharRegEx = (string, whitelist) => {
    const whitelistArr = whitelist.split('');
    let output = string;
    for (let i = 0; i < whitelistArr.length; i++) {
      output = output.replace(whitelistArr[i], '');
    }
    return output;
  };
  const specialCharRegEx = new RegExp(
    getSpecialCharRegEx(specialCharRegExList, whitelist),
    'g'
  );
  for (let i = 0; i < input.length; i++) {
    if (input[i].includes(divider)) {
      const result = input[i].split(divider);
      // splice only in 1 substring and then join back the second part of the
      // value to avoid splitting multiple time in the same line if the
      // divider is present again before line break
      const keyValue = result.splice(0, 1);
      keyValue.push(result.join(divider));

      const key = keyValue[0]
        // remove all symbols except the whitelisted
        .replace(specialCharRegEx, '')
        // remove all extra spaces
        .replace(/^\s+|\s+$/g, '')
        // TEMPORARY SOLUTION TO DEAL WITH '# OF' IN THE LOG FILE
        .replace('# of', 'number of')
        .replace(/\s+/g, '_')
        .toLocaleUpperCase();

      const value = keyValue[1].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '');
      if (value === '') {
        continue;
      }
      if (!isNaN(value)) {
        output[key] = +value;
        continue;
      }
      if (dayjs(value).isValid()) {
        output[key] = dayjs(value)['$d'];
        continue;
      } else {
        output[key] = value;
        continue;
      }
    }

    if (arr[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '') !== '') {
      output[`DEFAULT_${i}`] = arr[i].replace(
        /^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm,
        ''
      );
    }
  }

  return output;
};

const parseFunction = (filePath, divider, whitelist = '') => {
  const splittedData = splitDataToArr(filePath);
  const keyValueObject = basicKeyValueSplit(splittedData, divider, whitelist);
  return keyValueObject;
};
// console.log(parseFunction(filePath, ':', '#'));

const test = parseFunction(filePath, ':', '#');
console.log(test);
