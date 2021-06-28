import {Config} from "./interfaces/Config";
import {Translations} from "./interfaces/Translations";

const { createKeyFromString, createKeyWithContextString } = require('./util');

let translations: Translations;
const valueMarker = /%{\w*}/;

const setTranslations = (ts: Translations) => {
  translations = ts;
};

const setTranslationsWithContext = (ts: Translations, context: string) => {
  translations = ts;
};

const findTranslations = (
    detector: (l: string[]|undefined) => string,
    config: Config,
    locales: {[key: string]: Translations}
  ): Translations => {
  const locale = detector(config.targetLocales) || config.sourceLocale;
  return locales[locale];
}

const populateWithValues = (message: string, values: any[]) => {
  let result, indices: number[] = [];
  const regex = new RegExp(valueMarker, 'gi');
  while ((result = regex.exec(message))) {
    indices.push(result.index);
  }

  if (indices.length !== values.length) {
    throw new Error(`Got wrong amount of values for string "${message}". Indices: ${indices.length}. Values: ${values.length}.`);
  }

  for (let i in indices) {
    message = message.replace(valueMarker, values[i]);
  }
  return message;
}

const ct = (context: string, key: string, ...values: any[]) => {
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

const t = (key: string, ...values: any[]) => {
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
