#!/bin/bash
# https://github.com/douglascrockford/JSMin
if [ ! -e 'ttTools.js' ]; then echo 'Script needs to run from the project root directory'; exit 1; fi

# Stage jsmin in a folder in your $PATH
jsmin=`which jsmin`
if [ -z $jsmin ]; then echo 'jsmin not found'; exit 1; fi

if [ ! -f '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ]; then
  echo 'Could not find chrome for packaging'
  exit 1
fi

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
  cat $jsList
  echo "ttTools.load(0);"
  echo "ttTools.release = '${epoch}-test';"
elif [ $1 == 'release' ]; then
  mkdir releases/${epoch}
  cat $jsList > releases/${epoch}/ttTools.js
  echo "ttTools.load(0);" >> releases/${epoch}/ttTools.js
  echo "ttTools.release = '$epoch';" >> releases/${epoch}/ttTools.js
  $jsmin < releases/${epoch}/ttTools.js > releases/${epoch}/ttTools.min.js
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=extension --pack-extension-key=${HOME}/.chrome/ttTools.pem
  mv extension.crx releases/${epoch}/ttTools.crx
  cp releases/${epoch}/* releases/latest
else
  echo "Unknown action ${1}"
fi