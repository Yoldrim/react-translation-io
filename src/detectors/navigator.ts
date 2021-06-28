module.exports = (availableLocales: string[]) => {
  for (let locale of navigator.languages) {
    if (availableLocales.find((l: string) => l === locale.substr(0, 2))) {
      return locale.substr(0, 2);
    }
  }

  return undefined;
};
