#!/usr/local/bin/node

//
//  USAGE: $(npm bin)/observe {DIRECTORY TO WATCH} {PATH TO CONFIG} [--autoSync]
//


console.log('\n\n\n\n\n> Initiating translation observer B)');

const fs = require('fs');
const path = require('path');

const { getMessagesFromFile, createKeyFromString, readFileJSON, writeFileJSON } = require(path.resolve(__dirname, './util.js'));
const { sync, init } = require("./translation-io");

const args = process.argv.slice(2);

const directory = args[0];
console.log(`> Observe directory ${directory}`);

const configPath = args[1];
const autoSync = args[2] === '--autoSync';

if (!directory || !configPath) {
  throw `Missing required arguments. Directory path: ${directory}. Config path: ${configPath}`;
}

const config = readFileJSON(configPath);
const messagesPath = config.messages;
sync(config, {})
  .then(() => console.log('sync finished'))
  .catch((err) => {
    console.log('caught sync error');
    if (err && err.response && err.response.data) {
      if (err.response.data.error === "This project has not been initialized yet. Can't sync.") {
        init(config);
      }
    }
  });



const flatten = (lists) => lists.reduce((a, b) => a.concat(b), []);

const getDirectories = (src_path) => {
  return fs.readdirSync(src_path)
    .map(file => path.join(src_path, file))
    .filter(p => fs.statSync(p).isDirectory());
};

const getDirectoriesRecursive = (src) => {
  return [src, ...flatten(getDirectories(src).map(getDirectoriesRecursive))];
};

const addMessages = (messages) => {
  if (messages === undefined) return;
  const jsonMessages = readFileJSON(messagesPath);
  const newMessages = [];

  for (let message of messages) {
    if (jsonMessages.find((obj) => obj.id === message.id) === undefined) {
      newMessages.push(message);
    }
  }

  if (newMessages.length > 0) {
    console.log(`Writing new messages to file: ${JSON.stringify(newMessages)}`);
    writeFileJSON(messagesPath, [...newMessages, ...jsonMessages]);
    if (autoSync) {
      sync(config, {})
        .then(() => console.log('sync finished'))
        .catch((err) => {
          console.log('caught sync error');
          console.log(err);
        });
    }
  }
};

const directoryWatchers = getDirectoriesRecursive(directory).map((item) => {
  return {
    dir: item,
    watcher: () => {
      console.log(`Starting watcher for directory ${item}`);
      fs.watch(item, (eventType, filename) => {
        console.log(`Change in file ${item}/${filename}, scanning for translation changes`);
        addMessages(getMessagesFromFile(`${item}/${filename}`));
      });
    },
    state: 'idle',
  };
});

directoryWatchers.forEach((item) => {
  item.state = 'started';
  item.watcher();
});
