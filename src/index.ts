const {sync, init, extract} = require('./translation-io');
const { t, ct, findTranslations, setTranslations, setTranslationsWithContext } = require('./localization.ts');
const { detectors } = require('./detectors');

module.exports = {
  sync,
  init,
  extract,
  t,
  ct,
  findTranslations,
  setTranslationsWithContext,
  setTranslations,
  detectors
}
