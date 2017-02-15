#!/usr/bin/env bash -e

mkdir -p .build-tmp

cat $(find src -name '*.js') $(find 'test' -name '*.js') \
  > .build-tmp/test.js

jasmine .build-tmp/test.js

./resolve_includes.rb < src/index.html.template > index.html
