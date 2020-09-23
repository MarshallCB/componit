var path = require('path')
const p = path.join

module.exports = () => {
  let cwd = process.cwd()
  let config = require(p(cwd, '/componit.config.js')).default
  let source = p(cwd, config.source || "components")
  let destination = p(cwd, config.destination || "www-components")
  let builds = config.builds || [{transports: "default", extension: ".js"}]
  let server_runtime_path = p(source, "/_server.js")
  let browser_runtime_path = p(source, "/_browser.js")

  return {
    source, destination, server_runtime_path, browser_runtime_path, builds
  };
}