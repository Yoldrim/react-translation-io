const fs = require('fs');
const _path = require('path');

interface Message {
  id: string,
  defaultMessage: string
}

const getMessagesFromFile = (filePath: string) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const fileSplit = file.split('\n');
  const translationRegex = /[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/;
  let translationLineIndices: number[] = [];

  fileSplit.forEach((line: string, index: number) => {
    // messy, matches all t('') and ct('') instances with additional checks
    const regex = new RegExp(translationRegex, 'g');
    if (line.match(regex)) {
      // console.log(`Found line match at ${index + 1}. Line: ${line}`);
      translationLineIndices.push(index);
    }
  });

  const messages: Message[] = [];
  translationLineIndices.forEach((indice) => {
    const regMatch = fileSplit[indice].match(/[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/g)
    if (regMatch[0][1] === 'c') {
      const stringSplit = fileSplit[indice].split(/['"`]/);
      messages.push({
        id: createKeyWithContextString(stringSplit[1], stringSplit[3]),
        defaultMessage: stringSplit[3]
      })
    } else {
      const message = fileSplit[indice].split(/['"`]/)[1].split(/['"`]/)[0];
      messages.push({
        id: createKeyFromString(message),
        defaultMessage: message
      });
    }
  });
  return messages;
};

const keyifyString = (s: string) => (
  s.trim() // remove starting/trailing whitespaces
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // replace non word characters except whitespace
    .substring(0, 48) // grab first 48 characters
    .trim() // remove trailing whitespaces
    .replace(/\s/g, '_') // replace whitespace with _
)

const createKeyWithContextString = (ctx: string, s: string) => {
  ctx = keyifyString(ctx);
  s = keyifyString(s);

  return `${ctx}.${s}`;
}

const createKeyFromString = (s: string) => keyifyString(s)

const readFileJSON = (path: string) => {
  let file = undefined;
  try {
    file = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(e);
    throw `Could not read file from location ${process.cwd() + path}.\nTry changing the configPath.`;
  }
  return file;
};

const writeFileJSON = (path: string, content: string) => {
  fs.writeFileSync(path, JSON.stringify(content, null, 2));
};


module.exports = {getMessagesFromFile, createKeyFromString, createKeyWithContextString, readFileJSON, writeFileJSON};
