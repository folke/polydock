#!/usr/bin/env bash

me=$(realpath "$0")
dist=$(dirname "$me")/../dist

gjs -I "$dist" "$dist/index.js"
