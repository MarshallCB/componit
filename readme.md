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
import { ssr } from 'componit'

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
import build from 'componit/build'

```

## Acknowledgements
- 