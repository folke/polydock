#!/bin/bash
set -e
version=$(awk -F\" '/"version":/ {print $4}' package.json)

dist/bin/polydock --dump-config >dist/config/settings.ini
dist/bin/polydock --dump-config >config/settings.ini

cd dist
zip -r -X "polydock-bin-${version}.zip" . -x "*.zip"
