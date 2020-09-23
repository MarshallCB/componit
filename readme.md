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
<h3 align="center">:construction: Work in progress :construction:</h3>
<div align="center">[Usage](#usage) [How it works](#How-it-works)</div>

## How it works

| Diagram | Explanation |
| --- | --- |
| ![Source](https://github.com/MarshallCB/componit/blob/master/docs/slice1.png) | Source files are importable within the source code as an SSR string [example](#Writing-components) |
| ![Source](https://github.com/MarshallCB/componit/blob/master/docs/slice2.png) | The `componit` CLI will build browser-friendly files based on `componit.config.js` [example](#Config-file) |
| ![Source](https://github.com/MarshallCB/componit/blob/master/docs/slice3.png) | The browser files are importable from the browser for saturation, client-side rendering, etc. [example](#Writing-components) |



## Usage

### Writing components

```js
import componit from 'componit'

export default componit({
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
  onClick: {
    console.log("Clicked!")
  }
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
componit -w 
# Build components without watching for changes
componit
```

### Config file

```js

export default {
  source: "components",
  destination: "www",
  builds: [
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
      extension: ".css.js"
    },
    {
      transports: '*',
      minify: false,
      extension: ".ce.js"
    }
  ]
}

```

## Acknowledgements
- 