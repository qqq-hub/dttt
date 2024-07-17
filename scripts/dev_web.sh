#!/bin/bash
FILE=".git/hooks/post-commit"

if [ ! -f "$FILE" ]; then 
  cd ./scripts
  (exec ./install_git_hooks.sh)
  cd ../
fi


./node_modules/.bin/nodemon src/app.ts 
