const fs2 = require('fs')
const dayjs = require('dayjs')

interface Results {
  [x: string]: string | number
}

interface Rule {
  key: string
  dataType: string
  visualize: boolean
}

const splitDataToArr = (filePath: string) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const inputFile = fs2.readFileSync(filePath, 'utf-8')
  const textByLine = inputFile.split('\n')
  return textByLine
}
const addCPU = (arr: string[], separator: string) => {
  const cpuMakers = ['intel', 'amd']
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes(separator)) {
      continue
    }
    for (let j = 0; j < cpuMakers.length; j++) {
      if (arr[i].toLocaleLowerCase().includes(cpuMakers[j])) {
        const output = [...arr]
        output[i] = `CPU${separator} ${arr[i]}`
        return output
      }
    }
  }
}

const findValueWithMeasureUnit = (str: string) => {
  const res = str.match(/^(-?[\d.]+)([a-z%]*)$/i)
  if (res === null) return 'Invalid input'
  if (Number.isNaN(Number(res[1])) || !res[2]) return 'string'

  return 'number_um'
}

const findDataType = (value: string | number) => {
  if (typeof value === 'number') {
    return 'number'
  }
  if (dayjs(value).isValid()) {
    return 'timestamp'
  }
  if (findValueWithMeasureUnit(value) === 'number_um') {
    return 'number_um'
  }
  return 'string'
}

const findAndReplaceCustomRules = (
  str: string,
  find: string,
  separator: string
) => {
  // looks for a match in a string 'case-insensitive-
  var reg = new RegExp(`(${find})`, 'gi')
  // $1 returns the first match in a RegExp
  return str.replace(reg, `$1${separator}`)
}

const addUserKeyValue = (
  arr: string[],
  userInput: string[],
  separator: string
) => {
  const output = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < userInput.length; j++) {
      if (arr[i].toLocaleLowerCase().includes(`${userInput[j]}${separator}`)) {
        continue
      }
      if (
        arr[i].toLocaleLowerCase().includes(userInput[j].toLocaleLowerCase())
      ) {
        const newKeyValue = findAndReplaceCustomRules(
          arr[i],
          userInput[j],
          separator
        )
        output.push(newKeyValue)
      }
    }
  }
  return output
}

const basicKeyValueSplit = (
  arr: string[],
  separator: string,
  whitelist: string,
  userInput: string[]
) => {
  const inputWithCpu = addCPU(arr, separator)
  const input = inputWithCpu ? [...inputWithCpu] : [...arr]

  const userKeyValues = addUserKeyValue(input, userInput, separator)
  if (userKeyValues.length > 0) {
    userKeyValues.forEach((value) => input.unshift(value))
  }
  const output: Results = {}
  const specialCharRegExList = `[&/\\,+()$~%.#'":*?<>{}-]`
  const getSpecialCharRegEx = (string: string, whitelist: string) => {
    const whitelistArr = whitelist.split('')
    let output = string
    for (let i = 0; i < whitelistArr.length; i++) {
      output = output.replace(whitelistArr[i], '')
    }
    return output
  }
  // eslint-disable-next-line security/detect-non-literal-regexp
  const specialCharRegEx = new RegExp(
    getSpecialCharRegEx(specialCharRegExList, whitelist),
    'g'
  )
  for (let i = 0; i < input.length; i++) {
    if (input[i].includes(separator)) {
      const result = input[i].split(separator)
      // splice only in 1 substring and then join back the second part of the
      // value to avoid splitting multiple time in the same line if the
      // separator is present again before line break
      const keyValue = result.splice(0, 1)
      keyValue.push(result.join(separator))

      const key = keyValue[0]
        // remove all symbols except the whitelisted
        .replace(specialCharRegEx, '')
        // remove all extra spaces
        .replace(/^\s+|\s+$/g, '')
        // TEMPORARY SOLUTION TO DEAL WITH '# OF' IN THE LOG FILE
        // .replace('# of', 'number of')
        .replace(/\s+/g, '_')
        .toLocaleUpperCase()

      const value: string = keyValue[1].replace(
        /^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm,
        ''
      )
      if (value === '') {
        continue
      }
      if (typeof value === 'string' && !Number.isNaN(Number(value))) {
        output[key] = +value
        continue
      }
      if (dayjs(value).isValid()) {
        output[key] = dayjs(value).$d
        continue
      } else {
        output[key] = value
        continue
      }
    }

    if (input[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, '') !== '') {
      output[`DEFAULT_${i}`] = input[i].replace(
        /^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm,
        ''
      )
    }
  }

  return output
}

const createRules = (parsedObj: Results) => {
  const output: Rule[] = []
  Object.keys(parsedObj).forEach((key) => {
    const rule: Rule = { key, dataType: 'string', visualize: true }
    if (key.startsWith('DEFAULT_')) {
      rule.visualize = false
    }
    rule.dataType = findDataType(parsedObj[key])
    output.push(rule)
  })
  return output
}

const parseFunction = (
  filePath: string,
  separator: string,
  whitelist: string = '',
  userInput: string[] = []
) => {
  const splittedData = splitDataToArr(filePath)
  const keyValueObject = basicKeyValueSplit(
    splittedData,
    separator,
    whitelist,
    userInput
  )
  const parseKeys = createRules(keyValueObject)
  return { result: keyValueObject, parseKeys }
}

module.exports = parseFunction
