"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.warn = exports.success = exports.info = exports.verbose = void 0;

let _args = _interopRequireDefault(require("./args"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debugEnabled = () => {
  const env = process.env.TRANSLATION_IO_DEBUG;

  if (env == null) {
    return false;
  }

  return env !== 'false' && env !== '0';
};

const shouldPrint = () => !_args.default.quiet && (_args.default.verbose > 0 || debugEnabled());
const verbose = (...str) => shouldPrint && _args.default.verbose > 1 ? console.log(...str) : undefined;
// const info = (...str) => shouldPrint() ? console.log(...str) : undefined;
const info = (...str) => console.log(...str);

const print = fn => (str) => _args.default.quiet ? undefined : console.log(str);

const success = print();
const warn = print();
const error = print();

exports.success = success;
exports.warn = warn;
exports.error = error;
exports.verbose = verbose;
exports.info = info;
