require = require("esm")(module)
var fs = require('fs')
var { promisify } = require('util')
var path = require('path')
var {mkdir} = require('mk-dirs/sync')
const rollupStream = require('@rollup/stream');
var brotliSize = require('brotli-size');

const writeFileAsync = promisify(fs.writeFile)
export const readFile = promisify(fs.readFile)
export async function writeFile(p, data){
  // ensure dir exists
  p = path.join(process.cwd(), p)
  mkdir(path.dirname(p))
  await writeFileAsync(p, data)
}

export function freshRequire(p){
  p = path.join(process.cwd(), p)
  // console.log("BEFORE ---- ")
  // delete require.cache[p]
  return require(p)
}

/**
 * Get relative depth to access root directory
 * /some --> ./
 * /some/path --> ../
 * /some/path/deep --> ../../
 */
export function pathDepth(id){
  let chunks = id.split('/').filter(s=>s.length)
  return chunks.length === 1
    ? './'
    : chunks.slice(1).reduce((acc) => acc + '../')
}

export function rollup(options){
  return new Promise((res, rej) => {
    const stream = rollupStream({
      ...options,
      onwarn: ()=>{}
    })
    let bundle = ''
    stream.on('data', data=>(bundle = bundle+data))
    stream.on('end', () => res(bundle))
  })
}

export function bytesize(content){
  return formatBytes(brotliSize.sync(content))
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// From https://github.com/WebReflection/stringified-handler/blob/master/esm/index.js
/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {stringify} = JSON;
const {defineProperty, getOwnPropertyDescriptor, keys} = Object;

export const parseObject = (handler) => (
  '{' + keys(handler).map(key => {
    const {get, set, value} = getOwnPropertyDescriptor(handler, key);
    if (get && set)
      key = get + ',' + set;
    else if (get)
      key = '' + get;
    else if (set)
      key = '' + set;
    else
      key = stringify(key) + ':' + parseValue(value, key);
    return key;
  }).join(',') + '}'
);

const parseValue = (value, key) => {
  const type = typeof value;
  if (type === 'function')
    return value.toString().replace(
      new RegExp('^(\\*|async )?\\s*' + key + '[^(]*?\\('),
      (_, $1) => $1 === '*' ? 'function* (' : (($1 || '') + 'function (')
    );
  if (type === 'object' && value)
    return isArray(value) ?
            parseArray(value) :
            parseObject(value);
  return stringify(value);
};

const parseArray = array => ('[' + array.map(parseValue).join(',') + ']');