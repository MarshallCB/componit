#!/usr/bin/env node

require = require("esm")(module)
const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Componit = require('./src/builder.js');

sade('componit', true)
.version(pkg.version)
.describe(pkg.description)
.example('componit')
.example('componit -w')
.option('-w, --watch', 'Watch source directory and rebuild on changes')
.action((opts) => {
  let componit = new Componit()
  if(opts.watch){
    componit.watch()
  } else {
    componit.build()
  }
  // Program handler
})
.parse(process.argv);