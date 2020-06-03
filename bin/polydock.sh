#!/usr/bin/env bash

me=$(realpath "$0")
dist=$(realpath $(dirname "$me")/../dist)

echo "startings"
exitCode=0
while true; do
  gjs "$dist/polydock.js" $@
  exitCode=$?
  [ $exitCode -ne 139 ] && break
  echo "[restarting]"
done

exit $exitCode