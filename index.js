const {sync, init, extract} = require('./src/translation-io/index.js');
const { t, ct, findTranslations, setTranslations, setTranslationsWithContext } = require('./src/localization.js');
const { detectors } = require('./src/detectors/index.js');

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
