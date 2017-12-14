#!/bin/bash
find ./delivery-stylesheet -type f -name '*.min.min.css' | xargs rm -f
printf "\n\033[36m CLEAN OK \n"
