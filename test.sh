#!/bin/bash

# Install lcov for genhtml utility

rm -rf ./cov_profile ./coverage
deno test --coverage=coverage/profile
deno coverage coverage/profile --lcov --output=coverage/profile.lcov
genhtml -o ./coverage/html ./coverage/profile.lcov
