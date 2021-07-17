"use strict";
const fs = require('fs');
const dayjs = require('dayjs');
/* const userKeys = [
  'Start Time',
  'End Time',
  'Start counting lines for',
  'Name',
  'Type',
  'Version',
  'Memory',
  'Size',
  'Found directory at',
]; */
const splitDataToArr = (filePath) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const inputFile = fs.readFileSync(filePath, 'utf-8');
    const textByLine = inputFile.split('\n');
    return textByLine;
};
const addCPU = (arr, separator) => {
    const cpuMakers = ['intel', 'amd'];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(separator)) {
            continue;
        }
        for (let j = 0; j < cpuMakers.length; j++) {
            if (arr[i].toLocaleLowerCase().includes(cpuMakers[j])) {
                return `CPU${separator} ${arr[i]}`;
            }
        }
    }
};
const findDataType = (value) => {
    if (typeof value === 'number') {
        return 'number';
    }
    if (dayjs(value).isValid()) {
        return 'timestamp';
    }
    return 'string';
};
const addUserKeyValue = (arr, userInput, separator) => {
    const output = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < userInput.length; j++) {
            if (arr[i].toLocaleLowerCase().includes(`${userInput[j]}${separator}`)) {
                continue;
            }
            if (arr[i].toLocaleLowerCase().includes(userInput[j].toLocaleLowerCase())) {
                const newKeyValue = arr[i].replace(userInput[j], `${userInput[j]}${separator}`);
                output.push(newKeyValue);
            }
        }
    }
    return output;
};
const basicKeyValueSplit = (arr, separator, whitelist, userInput) => {
    const input = [...arr];
    // Adding custom line to input array for cpu maker
    const CPU = addCPU(input, separator);
    if (CPU) {
        input.push(CPU);
    }
    // Adding custom lines to input array for user selected keys
    const userKeyValues = addUserKeyValue(input, userInput, separator);
    if (userKeyValues.length > 0) {
        userKeyValues.forEach((value) => input.push(value));
    }
    const output = {};
    const specialCharRegExList = `[&/\\,+()$~%.#'":*?<>{}-]`;
    const getSpecialCharRegEx = (string, whitelist) => {
        const whitelistArr = whitelist.split('');
        let output = string;
        for (let i = 0; i < whitelistArr.length; i++) {
            output = output.replace(whitelistArr[i], '');
        }
        return output;
    };
    // eslint-disable-next-line security/detect-non-literal-regexp
    const specialCharRegEx = new RegExp(getSpecialCharRegEx(specialCharRegExList, whitelist), 'g');
    for (let i = 0; i < input.length; i++) {
        if (input[i].includes(separator)) {
            const result = input[i].split(separator);
            // splice only in 1 substring and then join back the second part of the
            // value to avoid splitting multiple time in the same line if the
            // separator is present again before line break
            const keyValue = result.splice(0, 1);
            keyValue.push(result.join(separator));
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
            if (typeof value === 'string' && !Number.isNaN(Number(value))) {
                output[key] = +value;
                continue;
            }
            if (dayjs(value).isValid()) {
                output[key] = dayjs(value).$d;
                continue;
            }
            else {
                output[key] = value;
                continue;
            }
        }
        if (arr[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '') !== '') {
            output[`DEFAULT_${i}`] = arr[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '');
        }
    }
    return output;
};
const createRules = (parsedObj) => {
    const output = [];
    Object.keys(parsedObj).forEach((key) => {
        const rule = { key, dataType: 'string', visualize: true };
        if (key.startsWith('DEFAULT_')) {
            rule.visualize = false;
        }
        rule.dataType = findDataType(parsedObj[key]);
        output.push(rule);
    });
    return output;
};
const parseFunction = (filePath, separator, whitelist = '', userInput = []) => {
    const splittedData = splitDataToArr(filePath);
    const keyValueObject = basicKeyValueSplit(splittedData, separator, whitelist, userInput);
    const parseKeys = createRules(keyValueObject);
    return { result: keyValueObject, parseKeys };
};
// console.log(parseFunction(filePath, ':', '#', userKeys));
// const test = parseFunction(filePath, ':', '#');
// console.log(test);
module.exports = parseFunction;