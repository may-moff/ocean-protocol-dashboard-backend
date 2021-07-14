var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var fs = require('fs');
var dayjs = require('dayjs');
var filePath = 'public/algorithm.log';
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
var splitDataToArr = function (filePath) {
    var inputFile = fs.readFileSync(filePath, 'utf-8');
    var textByLine = inputFile.split('\n');
    return textByLine;
};
var addCPU = function (arr, separator) {
    var cpuMakers = ['intel', 'amd'];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].includes(separator)) {
            continue;
        }
        for (var j = 0; j < cpuMakers.length; j++) {
            if (arr[i].toLocaleLowerCase().includes(cpuMakers[j])) {
                return "CPU" + separator + " " + arr[i];
            }
        }
    }
    return;
};
var findDataType = function (value) {
    if (typeof value === 'number') {
        return 'number';
    }
    if (dayjs(value).isValid()) {
        return 'timestamp';
    }
    return 'string';
};
var addUserKeyValue = function (arr, userInput, separator) {
    var output = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < userInput.length; j++) {
            if (arr[i].toLocaleLowerCase().includes("" + userInput[j] + separator)) {
                continue;
            }
            if (arr[i].toLocaleLowerCase().includes(userInput[j].toLocaleLowerCase())) {
                var newKeyValue = arr[i].replace(userInput[j], "" + userInput[j] + separator);
                output.push(newKeyValue);
            }
        }
    }
    return output;
};
var basicKeyValueSplit = function (arr, separator, whitelist, userInput) {
    var input = __spreadArray([], arr);
    // Adding custom line to input array for cpu maker
    var CPU = addCPU(input, separator);
    if (CPU) {
        input.push(CPU);
    }
    // Adding custom lines to input array for user selected keys
    var userKeyValues = addUserKeyValue(input, userInput, separator);
    if (userKeyValues.length > 0) {
        userKeyValues.forEach(function (value) { return input.push(value); });
    }
    var output = {};
    var specialCharRegExList = "[&/\\,+()$~%.#'\":*?<>{}-]";
    var getSpecialCharRegEx = function (string, whitelist) {
        var whitelistArr = whitelist.split('');
        var output = string;
        for (var i = 0; i < whitelistArr.length; i++) {
            output = output.replace(whitelistArr[i], '');
        }
        return output;
    };
    var specialCharRegEx = new RegExp(getSpecialCharRegEx(specialCharRegExList, whitelist), 'g');
    for (var i = 0; i < input.length; i++) {
        if (input[i].includes(separator)) {
            var result = input[i].split(separator);
            // splice only in 1 substring and then join back the second part of the
            // value to avoid splitting multiple time in the same line if the
            // separator is present again before line break
            var keyValue = result.splice(0, 1);
            keyValue.push(result.join(separator));
            var key = keyValue[0]
                // remove all symbols except the whitelisted
                .replace(specialCharRegEx, '')
                // remove all extra spaces
                .replace(/^\s+|\s+$/g, '')
                // TEMPORARY SOLUTION TO DEAL WITH '# OF' IN THE LOG FILE
                .replace('# of', 'number of')
                .replace(/\s+/g, '_')
                .toLocaleUpperCase();
            var value = keyValue[1].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '');
            if (value === '') {
                continue;
            }
            if (typeof value === 'string' && !Number.isNaN(Number(value))) {
                output[key] = +value;
                continue;
            }
            if (dayjs(value).isValid()) {
                output[key] = dayjs(value)['$d'];
                continue;
            }
            else {
                output[key] = value;
                continue;
            }
        }
        if (arr[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '') !== '') {
            output["DEFAULT_" + i] = arr[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '');
        }
    }
    return output;
};
var createRules = function (parsedObj) {
    var output = [];
    Object.keys(parsedObj).forEach(function (key) {
        var rule = { key: key, dataType: 'string', visualize: true };
        if (key.startsWith('DEFAULT_')) {
            rule.visualize = false;
        }
        rule.dataType = findDataType(parsedObj[key]);
        output.push(rule);
    });
    return output;
};
var parseFunction = function (filePath, separator, whitelist, userInput) {
    if (whitelist === void 0) { whitelist = ''; }
    if (userInput === void 0) { userInput = []; }
    var splittedData = splitDataToArr(filePath);
    var keyValueObject = basicKeyValueSplit(splittedData, separator, whitelist, userInput);
    var parseKeys = createRules(keyValueObject);
    return { result: keyValueObject, parseKeys: parseKeys };
};
// console.log(parseFunction(filePath, ':', '#', userKeys));
// const test = parseFunction(filePath, ':', '#');
// console.log(test);
var parseKeys = {
    key: '',
    dataType: '',
    visualize: true
};
module.exports = parseFunction;
