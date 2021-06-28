"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('./util'), createKeyFromString = _a.createKeyFromString, createKeyWithContextString = _a.createKeyWithContextString;
var translations;
var valueMarker = /%{\w*}/;
var setTranslations = function (ts) {
    translations = ts;
};
var setTranslationsWithContext = function (ts, context) {
    translations = ts;
};
var findTranslations = function (detector, config, locales) {
    var locale = detector(config.targetLocales) || config.sourceLocale;
    return locales[locale];
};
var populateWithValues = function (message, values) {
    var result, indices = [];
    var regex = new RegExp(valueMarker, 'gi');
    while ((result = regex.exec(message))) {
        indices.push(result.index);
    }
    if (indices.length !== values.length) {
        throw new Error("Got wrong amount of values for string \"" + message + "\". Indices: " + indices.length + ". Values: " + values.length + ".");
    }
    for (var i in indices) {
        message = message.replace(valueMarker, values[i]);
    }
    return message;
};
var ct = function (context, key) {
    var values = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        values[_i - 2] = arguments[_i];
    }
    if (translations) {
        var message = translations[createKeyWithContextString(context, key)];
        if (message === undefined) {
            console.log("Missing context translation for " + createKeyWithContextString(context, key) + ", returning empty string");
            return '';
        }
        return values.length === 0 ? message : populateWithValues(message, values);
    }
    return '';
};
var t = function (key) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    if (translations) {
        var message = translations[key] || translations[createKeyFromString(key)];
        if (message === undefined) {
            console.log("Missing translation for " + createKeyFromString(key) + ", returning empty string");
            return '';
        }
        return values.length === 0 ? message : populateWithValues(message, values);
    }
    return '';
};
module.exports = { t: t, ct: ct, setTranslations: setTranslations, setTranslationsWithContext: setTranslationsWithContext, findTranslations: findTranslations };
