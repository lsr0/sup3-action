#!/bin/bash

set -x

sup3_path="$1"

cp -r $USERPROFILE/.aws ~/
ls -l ~/.aws
ln -s $PWD/$sup3_path/sup3 /usr/bin/
ls /usr/bin/sup3 -l
echo done
