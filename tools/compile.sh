#!/bin/bash
# https://github.com/douglascrockford/JSMin
if [ ! -e 'ttTools.js' ]; then echo 'Script needs to run from the project root directory'; exit 1; fi
jsmin=`which jsmin`
if [ -z $jsmin ]; then echo 'jsmin not found'; exit 1; fi
if [ -z $1 ]; then echo 'No option specified'; exit 1; fi

jsFiles=(
  'ttTools.js'
  'ttTools.views.js'
  'ttTools.portability.js'
  'ttTools.portability.views.js'
  'ttTools.database.js'
  'ttTools.tags.js'
  'ttTools.tags.views.js'
)

for file in ${jsFiles[@]}; do
  jsList="${jsList}${file} "
done

epoch=`date +%s`

if [ $1 == 'test' ]; then
  cat $jsList > ../ttTools.js
  echo "ttTools.load(0);" >> ../ttTools.js
  echo "ttTools.release = '${epoch}-test';" >> ../ttTools.js
elif [ $1 == 'release' ]; then
  mkdir releases/${epoch}
  cat $jsList > releases/${epoch}/ttTools.js
  echo "ttTools.load(0);" >> releases/${epoch}/ttTools.js
  echo "ttTools.release = '$epoch';" >> releases/${epoch}/ttTools.js
  $jsmin < releases/${epoch}/ttTools.js > releases/${epoch}/ttTools.min.js
  cp releases/${epoch}/* releases/latest
elif [ $1 == 'extension' ]; then
  zip -r ../ttTools-loader.zip extension/*
else
  echo "Unknown action ${1}"
fi