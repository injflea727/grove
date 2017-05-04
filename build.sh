#!/usr/bin/env bash -e

which jasmine || npm install --global jasmine

mkdir -p .build-tmp

cat $(\
    find src -name '*.js' \
    | grep -v 'main.js' \
    | grep -v 'worker-main.js' \
  ) $(find 'test' -name '*.js') \
  > .build-tmp/test.js

jasmine .build-tmp/test.js

./resolve_includes.rb < src/index.template.html > index.html
