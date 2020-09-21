import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json'
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import fs from 'fs'

import commonjs from '@rollup/plugin-commonjs';

export default [{
	input: 'src/ssr.js',
	output: [{
		format: 'esm',
		file: pkg.module,
		sourcemap: false,
	}, {
		format: 'cjs',
		file: pkg.main,
		sourcemap: false,
	}, {
		name: pkg['umd:name'] || pkg.name,
		format: 'umd',
		file: "min.js",
		sourcemap: false,
		plugins: [
			terser()
		]
	}],
	external: [
		...require('module').builtinModules,
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [
		resolve(),
		commonjs(),
		json()
	]
}, {
	input: 'src/bundler.js',
	output: [{
		format: 'esm',
		file: 'dist/bundler.js',
		sourcemap: false
	}],
	external: [
		...require('module').builtinModules,
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [
		resolve(),
		replace({
			__virtual_componit__: fs.readFileSync('./src/browser.js')
		})
	]
}]
