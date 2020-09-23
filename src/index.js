require = require("esm")(module)
const load_config = require('./config.js')

module.exports = function(){
  let { server_runtime_path } = load_config()
  try{
    let runtime = require(server_runtime_path).default
    return runtime.apply(null, arguments)
  } catch(e){
    console.log(e)
  }
}