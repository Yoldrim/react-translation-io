module.exports = (availableLocales) => {
  for (let locale of navigator.languages) {
    if (availableLocales.find((l) => l === locale.substr(0, 2))) {
      return locale.substr(0, 2);
    }
  }

  return undefined;
};
