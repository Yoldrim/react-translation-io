var _a = require('./translation-io'), sync = _a.sync, init = _a.init, extract = _a.extract;
var _b = require('./localization.ts'), t = _b.t, ct = _b.ct, findTranslations = _b.findTranslations, setTranslations = _b.setTranslations, setTranslationsWithContext = _b.setTranslationsWithContext;
var detectors = require('./detectors').detectors;
module.exports = {
    sync: sync,
    init: init,
    extract: extract,
    t: t,
    ct: ct,
    findTranslations: findTranslations,
    setTranslationsWithContext: setTranslationsWithContext,
    setTranslations: setTranslations,
    detectors: detectors
};
