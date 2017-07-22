#!/usr/bin/env bash -e

which jasmine || npm install --global jasmine

mkdir -p .build-tmp

cat $(find src  -name '*.js' | grep -v 'main.js') \
    $(find test -name '*.js') \
  > .build-tmp/test.js

jasmine .build-tmp/test.js

cat $(find src/ui     -name '*.js') > .build-tmp/ui.js
cat $(find src/worker -name '*.js') > .build-tmp/worker.js

./resolve_includes.rb < src/grove.html.template > grove.html
