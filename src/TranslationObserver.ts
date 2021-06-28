#!/usr/local/bin/node

//
//  USAGE: $(npm bin)/observe {DIRECTORY TO WATCH} {PATH TO CONFIG} [--autoSync]
//

import {AxiosError} from "axios";
import {Message} from "./interfaces/Message";

console.log('\n\n\n\n\n> Initiating translation observer B)');

const fs = require('fs');
const path = require('path');

const { getMessagesFromFile, createKeyFromString, readFileJSON, writeFileJSON } = require(path.resolve(__dirname, './util.js'));
const { sync, init } = require("./translation-io");

const args = process.argv.slice(2);

const directory: string = args[0];
console.log(`> Observe directory ${directory}`);

const configPath: string = args[1];
const autoSync: boolean = args[2] === '--autoSync';

if (!directory || !configPath) {
  throw `Missing required arguments. Directory path: ${directory}. Config path: ${configPath}`;
}

const config = readFileJSON(configPath);
const messagesPath = config.messages;
sync(config, {})
  .then(() => console.log('> Sync finished'))
  .catch((err: AxiosError) => {
    console.log('caught sync error');
    if (err && err.response && err.response.data) {
      if (err.response.data.error === "This project has not been initialized yet. Can't sync.") {
        init(config);
      }
    }
  });



const flatten = (lists: any[]) => lists.reduce((a, b) => a.concat(b), []);

const getDirectories = (srcPath:string) => {
  return fs.readdirSync(srcPath)
    .map((file: string) => path.join(srcPath, file))
    .filter((p: string) => fs.statSync(p).isDirectory());
};

const getDirectoriesRecursive = (src: string) => {
  return [src, ...flatten(getDirectories(src).map(getDirectoriesRecursive))];
};

const addMessages = (messages: Message[]) => {
  if (messages === undefined) return;
  const jsonMessages: Message[] = readFileJSON(messagesPath);
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
        .then(() => console.log('> auto sync finished'))
        .catch((err: AxiosError) => {
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
      fs.watch(item, (eventType: "rename"|"change", filename: string) => {
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
