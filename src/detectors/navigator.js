module.exports = function (availableLocales) {
    var _loop_1 = function (locale) {
        if (availableLocales.find(function (l) { return l === locale.substr(0, 2); })) {
            return { value: locale.substr(0, 2) };
        }
    };
    for (var _i = 0, _a = navigator.languages; _i < _a.length; _i++) {
        var locale = _a[_i];
        var state_1 = _loop_1(locale);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return undefined;
};
