<div align="center">
  <img src="https://github.com/marshallcb/componit/raw/master/componit.png" alt="componit" width="100" />
</div>

<h1 align="center">Componit</h1>
<div align="center">
  <a href="https://npmjs.org/package/componit">
    <img src="https://badgen.now.sh/npm/v/componit" alt="version" />
  </a>
</div>

<div align="center">Isomorphic component builder with lightweight delivery options</div>

# Note: this is still a work in progress

## Usage

### Writing components

```js
import { render } from 'componit'

export default render({
  tag: 'div',
  attributes: {
    className: "test"
  },
  inner(){
    return this.html`
      <h1>Hello from inside</h1>
    `
  }
})

export handler = {
  onClick: {}
}

export style = /* css */`
  .test{
    background: #faa;
  }
  .test>h1{
    color: #a30;
  }
`

```

### CLI
```bash
  # Build components based on `componit.config.js` and watch for changes
  componit -w -c componit.config.js
```

### Config file

```js

export default {
  source: "components",
  destination: "public/components",
  runtime: {
    browser: '/components/_browser.js',
    server: '/components/_server.js'
  },
  formats: [
    {
      transports: 'default',
      minify: true,
      extension:".js"
    },
    {
      transports: 'handler',
      minify: true,
      extension:".augm-it.js"
    },
    {
      transports: "style",
      minify: true,
      extension: ".css"
    },
    {
      transports: "*",
      minify: true,
      extension: ".ce.min.js"
    },
    {
      transports: "*",
      minify: false,
      extension: ".ce.js"
    }
  ]
}

```

## Acknowledgements
- 