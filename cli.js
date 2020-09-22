#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Componit = require('./index.js');
require = require("esm")(module)

sade('componit', true)
.version(pkg.version)
.describe(pkg.description)
.example('componit -c custom.config.js')
.example('componit -w')
.option('-w, --watch', 'Watch source directories and rebuild on changes')
.option('-c, --config', 'Provide path to custom config file', 'componit.config.js')
.option('-i, --input', 'Input directory', 'components')
.option('-o --output', 'Output directory', 'public/components')
.action((opts) => {
  let configPath = path.join(process.cwd(), opts.config)
  let config = {
    source: opts.i,
    destination: opts.o
  }
  try {
    config = { ...config, ...require(configPath).default }
  } catch(e){

  }
  let componit = new Componit({ cwd: process.cwd(), ...config })
  if(opts.watch){
    componit.watch()
  } else {
    componit.build()
  }
  // Program handler
})
.parse(process.argv);