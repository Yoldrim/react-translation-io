#!/usr/local/bin/node
"use strict";
//
//  USAGE: $(npm bin)/observe {DIRECTORY TO WATCH} {PATH TO CONFIG} [--autoSync]
//
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('\n\n\n\n\n> Initiating translation observer B)');
var fs = require('fs');
var path = require('path');
var _a = require(path.resolve(__dirname, './util.js')), getMessagesFromFile = _a.getMessagesFromFile, createKeyFromString = _a.createKeyFromString, readFileJSON = _a.readFileJSON, writeFileJSON = _a.writeFileJSON;
var _b = require("./translation-io"), sync = _b.sync, init = _b.init;
var args = process.argv.slice(2);
var directory = args[0];
console.log("> Observe directory " + directory);
var configPath = args[1];
var autoSync = args[2] === '--autoSync';
if (!directory || !configPath) {
    throw "Missing required arguments. Directory path: " + directory + ". Config path: " + configPath;
}
var config = readFileJSON(configPath);
var messagesPath = config.messages;
sync(config, {})
    .then(function () { return console.log('> Sync finished'); })
    .catch(function (err) {
    console.log('caught sync error');
    if (err && err.response && err.response.data) {
        if (err.response.data.error === "This project has not been initialized yet. Can't sync.") {
            init(config);
        }
    }
});
var flatten = function (lists) { return lists.reduce(function (a, b) { return a.concat(b); }, []); };
var getDirectories = function (srcPath) {
    return fs.readdirSync(srcPath)
        .map(function (file) { return path.join(srcPath, file); })
        .filter(function (p) { return fs.statSync(p).isDirectory(); });
};
var getDirectoriesRecursive = function (src) {
    return __spreadArrays([src], flatten(getDirectories(src).map(getDirectoriesRecursive)));
};
var addMessages = function (messages) {
    if (messages === undefined)
        return;
    var jsonMessages = readFileJSON(messagesPath);
    var newMessages = [];
    var _loop_1 = function (message) {
        if (jsonMessages.find(function (obj) { return obj.id === message.id; }) === undefined) {
            newMessages.push(message);
        }
    };
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        _loop_1(message);
    }
    if (newMessages.length > 0) {
        console.log("Writing new messages to file: " + JSON.stringify(newMessages));
        writeFileJSON(messagesPath, __spreadArrays(newMessages, jsonMessages));
        if (autoSync) {
            sync(config, {})
                .then(function () { return console.log('> auto sync finished'); })
                .catch(function (err) {
                console.log('caught sync error');
                console.log(err);
            });
        }
    }
};
var directoryWatchers = getDirectoriesRecursive(directory).map(function (item) {
    return {
        dir: item,
        watcher: function () {
            console.log("Starting watcher for directory " + item);
            fs.watch(item, function (eventType, filename) {
                console.log("Change in file " + item + "/" + filename + ", scanning for translation changes");
                addMessages(getMessagesFromFile(item + "/" + filename));
            });
        },
        state: 'idle',
    };
});
directoryWatchers.forEach(function (item) {
    item.state = 'started';
    item.watcher();
});
