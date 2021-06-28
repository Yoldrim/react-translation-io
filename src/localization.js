const { createKeyFromString, createKeyWithContextString } = require('./util');

let translations;
const valueMarker = /%{\w*}/;

// Make sure object key can never return undefined, only ''
const noUndefinedTranslations = (target) => new Proxy(target, {
  get: (obj, prop) => obj[prop] ? obj[prop] : '',
});

const setTranslations = (ts) => {
  translations = noUndefinedTranslations(ts);
};

const setTranslationsWithContext = (ts, context) => {
  translations = noUndefinedTranslations(ts);
};

const findTranslations = (detector, config, locales) => {
  const locale = detector(config.targetLocales) || config.sourceLocale;
  return locales[locale];
}

const populateWithValues = (string, values) => {
  let result, indices = [];
  const regex = new RegExp(valueMarker, 'gi');
  while ((result = regex.exec(string))) {
    indices.push(result.index);
  }

  if (indices.length !== values.length) {
    throw new Error(`Got wrong amount of values for string "${string}". Indices: ${indices.length}. Values: ${values.length}.`);
  }

  for (let i in indices) {
    string = string.replace(valueMarker, values[i]);
  }
  return string;
}

const ct = (context, key, ...values) => {
  if (translations) {
    let message = translations[createKeyWithContextString(context, key)];
    if (message === undefined) {
      console.log(`Missing context translation for ${createKeyWithContextString(context, key)}, returning empty string`);
      return '';
    }
    return values.length === 0 ? message : populateWithValues(message, values);
  }
  return '';
};

const t = (key, ...values) => {
  if (translations) {
    let message = translations[key] || translations[createKeyFromString(key)];
    if (message === undefined) {
      console.log(`Missing translation for ${createKeyFromString(key)}, returning empty string`);
      return '';
    }
    return values.length === 0 ? message : populateWithValues(message, values);
  }
  return '';
};

module.exports =  { t, ct, setTranslations, setTranslationsWithContext, findTranslations };
