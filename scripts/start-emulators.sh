#!/bin/bash

# this is in a script file because escaping this stuff in package.json is a pain
pnpm exec firebase emulators:start --import emulator_data --export-on-exit --only functions,auth,ui,firestore "$@" 2> >(grep -Ev 'lsof|Output information may be incomplete|assuming "dev=.*" from mount table' >&2)
