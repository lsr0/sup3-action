#!/bin/bash

set -x

sup3_path="$1"

cp -r $USERPROFILE/.aws ~/
ln -s $PWD/$sup3_path /usr/bin/
echo done
