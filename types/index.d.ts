// declare const sync: any, init: any, extract: any;
import {Config} from "../src/interfaces/Config";
import {Translations} from "../src/interfaces/Translations";

// declare const detectors: any;

declare const sync: (config: Config, args: any[]) => void;
declare const init: (config: Config) => void;
declare const extract: (config: Config) => void;

declare const t: (key: string, ...values: any[]) => string;
declare const ct: (context: string, key: string, ...values: any[]) => string;
declare const findTranslations: (
  detector: (l: string[]|undefined) => string,
  config: Config,
  locales: {[key: string]: Translations}
) => Translations;
declare const setTranslations: (ts: Translations) => void;
declare const setTranslationsWithContext: (ts: Translations) => void;

declare const detectors: { detectors: {[name: string]: (l: string[]|undefined) => string}}

declare module 'react-translation-io';
