#!/usr/bin/env bash

me=$(realpath "$0")
dist=$(realpath $(dirname "$me")/../dist)

gjs -I "$dist" "$dist/polydock.js"
