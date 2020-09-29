#!/usr/bin/env node

require = require("esm")(module)
const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Componit = require('./src/builder.js');

sade('componit [input] [output]', true)
.version(pkg.version)
.describe(pkg.description)
.example('components www/components --watch')
.example('source public/components -w -d')
.option('-w, --watch', 'Watch source directory and rebuild on changes')
.option('--debug, -d', 'Debug mode - disable minification', false)
.action((input, output, opts) => {
  let componit = new Componit(input, output, opts.debug)
  if(opts.watch){
    componit.watch()
  } else {
    componit.build()
  }
  // Program handler
})
.parse(process.argv);