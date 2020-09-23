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
<div align="center"><a href="#usage"><b>Usage</b></a></div>

# How it works

| Diagram | Explanation |
| :-- | :-- |
| **Source files** ![Source](https://github.com/MarshallCB/componit/blob/master/docs/source-files.png) | Source files export an SSR-friendly string as the default. Additional named exports can be used for customization. <br/><br/> [Example component](#Writing-components) |
| **Build command** ![Build](https://github.com/MarshallCB/componit/blob/master/docs/npx-componit.png) | The `componit` CLI will build browser-friendly files based on `componit.config.js`. <br/><br/> [Example config file](#Config-file) |
| **Browser files** ![Output](https://github.com/MarshallCB/componit/blob/master/docs/browser-files.png) | The browser files are importable from the browser for saturation, client-side rendering, etc. The exported files are based on the settings in the config file. <br/><br/> [Client-side strategies](#Client-side strategies) |

# Usage

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

### CLI
```bash
# Build components based on `componit.config.js` and watch for changes
componit -w 
# Build components without watching for changes
componit
```

## Motivation
Coming soon

## Development
Coming soon

## References
Coming soon