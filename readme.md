<div align="center">
  <img src="https://github.com/marshallcb/componit/raw/master/componit.png" alt="componit" width="100" />
</div>

<h1 align="center">Componit (Work in Progress)</h1>
<div align="center">
  <a href="https://npmjs.org/package/componit">
    <img src="https://badgen.now.sh/npm/v/componit" alt="version" />
  </a>
</div>

<div align="center">Isomorphic component builder with lightweight delivery options</div>

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

### Build API

```js
import bundler from 'componit/bundler'

let b = bundler('components')
let render = await b({

})
let saturation = await 

```

### Config file

```js

export default {
  source: "/components",
  destination: "/public/components",
  formats: [
    {
      transports: 'default',
      componit: js`__virtual_componit__`.toString(),
      minify: true,
      extension:".js"
    },
    {
      transports: 'handler',
      minify: true,
      external(id,parent){
        if(id.startsWith('.') && parent.includes(path.join(process.cwd(), '/components'))){
          return true;
        }
        return false;
      },
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
      extension: ".ce.js"
    }
  ]
}

```

## Acknowledgements
- 