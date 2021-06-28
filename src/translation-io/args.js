'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const increaseVerbosity = (v, total) => total + 1;

// const res = _commander.default.version(1, '-v, --version').option('-V, --verbose', 'Enable verbose mode', increaseVerbosity, 0).option('-q, --quiet', 'Disable all output').option('-c, --config', 'The config file to use').command('sync', 'Sync translations').option('-p, --purge', 'Purge when syncing keys').option('-r, --readonly', 'Only pull translations (do not push local translations)').command('init', 'Init the translation.io project').command('extract', 'Extract translations from your local files').parse(process.argv);

const res = {command: 'yeet'};
const args = {
  command: res.command,
  config: res.config || null,
  purge: res.purge || false,
  quiet: res.quiet || false,
  readonly: res.readonly || false,
  verbose: res.verbose || 0,
};
exports.default = args;
