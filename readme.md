<div align="center">
  <img src="https://github.com/marshallcb/componit/raw/main/componit.png" alt="componit" width="100" />
</div>

<h1 align="center">componit</h1>
<div align="center">
  <a href="https://npmjs.org/package/componit">
    <img src="https://badgen.now.sh/npm/v/componit" alt="version" />
  </a>
</div>

<div align="center">Isomorphic component builder with lightweight delivery options</div>
<h3 align="center">:construction: Work in progress :construction:</h3>
<div align="center">
  <a href="#Usage"><b>Usage</b></a> | 
  <a href="#Strategies"><b>Strategies</b></a> | 
  <a href="#Motivation"><b>Motivation</b></a> | 
  <a href="#About"><b>About</b></a>
</div>

---

# Concept

Write components definitions that export an SSR string and build to a collection of browser-importable files for different loading strategies. This gives you the ability to use components in the most performant way for your website. Built to pair with [augm-it](https://github.com/augm-dev/augm-it).

**Strategies**: [SSR Saturation](#SSR-Saturation) | [On-site Render](#On-site-Render) | [External](#External)

### Outputs
- `it.json` : a manifest of the exported files
- `styles.css` : a minified aggregation of each component's style
- Per component:
  - `render.js` : Client-side render function and handler | `default, handler`
  - `element.js` : All exports of the component definition | `default, handler, style, *`
  - `handler.js` : Saturation / Custom-Element-ish handler for SSR pages | `handler`

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

### CLI

**Usage**
```
$ componit [input] [output] [options]
```

**Options**
```
-w, --watch      Watch source directory and rebuild on changes
-d, --debug      Debug mode - disable minification  (default false)
-v, --version    Displays current version
-h, --help       Displays this message
```

**Examples**
```
$ componit components www/components
$ componit source public/components --watch
$ componit source public/components -w -d
```

# Strategies
Coming Soon

## SSR Saturation

## On-site Render

## External

### Single component

### Component collection

# Motivation
Coming soon

# About

## Development
Coming soon

## References
Coming soon