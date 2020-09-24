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
.example('source public/components -w -l')
.option('-w, --watch', 'Watch source directory and rebuild on changes')
.option('--long, -l', 'Disable minification', false)
.action((input, output, opts) => {
  let source = path.join(process.cwd(), input)
  let destination = path.join(process.cwd(), output)
  let builds = [
    {
      transports: "default",
      extension: "render.js"
    },
    {
      transports: "handler",
      extension: "handler.js"
    },
    {
      transports: "*", // todo: custom runtimes for each build type
      extension: "it.js"
    },
    {
      transports: "*", // todo: include saturater in file
      extension: "element.js"
    }
  ]
  let componit = new Componit(source, destination, builds, opts.l)
  if(opts.watch){
    componit.watch()
  } else {
    componit.build()
  }
  // Program handler
})
.parse(process.argv);