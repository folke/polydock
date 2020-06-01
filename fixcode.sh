#!/bin/bash

[ -d dist ] || mkdir dist
for file in lib/*.js; do
		cp -fv $file dist/
		file=dist/$(basename $file)
		sed -i \
			-e 's#export function#function#g' \
			-e 's#export var#var#g' \
			-e 's#export const#var#g' \
			-e 's#Object.defineProperty(exports, "__esModule", { value: true });#var exports = {};#g' \
			"${file}"; \
		sed -i -E 's/console.log\(/log(/g' "${file}"; \
		sed -i -E 's/export class (\w+)/var \1 = class \1/g' "${file}"; \
		sed -i -E 's/import \* as (\w+) from "\.\/types\/?(\w+)-.*"/const \1 = imports.gi.\2/g' "${file}"; \
		sed -i -E 's/import \* as (\w+) from "\.?\/?(\w+)"/const \1 = imports.\2/g' "${file}"; \
	done