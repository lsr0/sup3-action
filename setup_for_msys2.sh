#!/bin/bash

set -x

sup3_path="$1"

cp -r $USERPROFILE/.aws ~/
echo "export PATH=\"\$PATH:$sup3_path\"" >> ~/.bashrc
