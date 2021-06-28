var fs = require('fs');
var _path = require('path');
var getMessagesFromFile = function (filePath) {
    var file = fs.readFileSync(filePath, 'utf8');
    var fileSplit = file.split('\n');
    var translationRegex = /[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/;
    var translationLineIndices = [];
    fileSplit.forEach(function (line, index) {
        // messy, matches all t('') and ct('') instances with additional checks
        var regex = new RegExp(translationRegex, 'g');
        if (line.match(regex)) {
            // console.log(`Found line match at ${index + 1}. Line: ${line}`);
            translationLineIndices.push(index);
        }
    });
    var messages = [];
    translationLineIndices.forEach(function (indice) {
        var regMatch = fileSplit[indice].match(/[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/g);
        if (regMatch[0][1] === 'c') {
            var stringSplit = fileSplit[indice].split(/['"`]/);
            messages.push({
                id: createKeyWithContextString(stringSplit[1], stringSplit[3]),
                defaultMessage: stringSplit[3]
            });
        }
        else {
            var message = fileSplit[indice].split(/['"`]/)[1].split(/['"`]/)[0];
            messages.push({
                id: createKeyFromString(message),
                defaultMessage: message
            });
        }
    });
    return messages;
};
var keyifyString = function (s) { return (s.trim() // remove starting/trailing whitespaces
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // replace non word characters except whitespace
    .substring(0, 48) // grab first 48 characters
    .trim() // remove trailing whitespaces
    .replace(/\s/g, '_') // replace whitespace with _
); };
var createKeyWithContextString = function (ctx, s) {
    ctx = keyifyString(ctx);
    s = keyifyString(s);
    return ctx + "." + s;
};
var createKeyFromString = function (s) { return keyifyString(s); };
var readFileJSON = function (path) {
    var file = undefined;
    try {
        file = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    catch (e) {
        console.log(e);
        throw "Could not read file from location " + (process.cwd() + path) + ".\nTry changing the configPath.";
    }
    return file;
};
var writeFileJSON = function (path, content) {
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
};
module.exports = { getMessagesFromFile: getMessagesFromFile, createKeyFromString: createKeyFromString, createKeyWithContextString: createKeyWithContextString, readFileJSON: readFileJSON, writeFileJSON: writeFileJSON };
