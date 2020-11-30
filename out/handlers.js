//m4r.sh/*
import { defineAsync, upgrade } from 'wicked-elements'

import('./componit.js')

const loaded = new Set;

function register(itList){
  Object.keys(itList).forEach(it => {
    defineAsync(`.${it},${it},[is="${it}"]`, () => {
      return import(itList[it]).then(mod => {
        return mod;
      }).catch((e) => {
        console.log(e)
        console.log("No component found for " + it);
      });
     });
  });
}

window.upgrade = upgrade;
window.register = register;

register(JSON.parse({"Example":"/Example.js","Super":"/Nested/Double/Super.js","Sub":"/Nested/Sub.js","Second":"/Second.js"}))