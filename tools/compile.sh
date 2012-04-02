#!/bin/bash
if [ ! -e 'ttTools.js' ]; then echo 'Script needs to run from the project root directory'; exit 1; fi

# https://github.com/douglascrockford/JSMin
jsmin=`which jsmin`
if [ -z $jsmin ]; then echo 'jsmin not found'; exit 1; fi

if [ -z $1 ]; then echo 'No option specified'; exit 1; fi

if [ $1 == 'extension' ]; then
  zip -r ../ttTools-loader.zip extension/*
  exit 0
elif [ $1 == 'test' ]; then
  target="releases/test"
  epoch=540374400
elif [ $1 == 'release' ]; then
  target="releases/latest"
  epoch=$2
  if [ -z $epoch ]; then epoch=`date +%s`; fi
else
  echo "Unknown action ${1}"
  exit 1
fi

jsFiles=(
  'jquery-tags/jquery.tagsinput.js'
  'ttObjects/ttObjects.js'
  'ttTools.js'
  'ttTools.views.js'
  'ttTools.database.js'
  'ttTools.tags.js'
  'ttTools.tags.views.js'
  'ttTools.portability.js'
  'ttTools.portability.views.js'
  'ttTools.constants.js'
)
for file in ${jsFiles[@]}; do jsFileList="${jsFileList}${file} "; done

customIcons=$(openssl enc -base64 -in images/custom-icons.png | tr -d '\n')
bottomButton=$(openssl enc -base64 -in images/bottom.png | tr -d '\n')

mkdir -p $target
cat $jsFileList > "${target}/ttTools.js"
echo "ttTools.resources = {" >> "${target}/ttTools.js"
echo "  customIcons : \"data:image/png;base64,${customIcons}\"," >> "${target}/ttTools.js"
echo "  bottomButton : \"data:image/png;base64,${bottomButton}\"," >> "${target}/ttTools.js"
echo "}" >> "${target}/ttTools.js"
echo "ttTools.release = new Date(${epoch}000);" >> "${target}/ttTools.js"
echo "$.when(ttTools.roomLoaded()).then($.proxy(ttTools.init, ttTools));" >> "${target}/ttTools.js"
$jsmin < "${target}/ttTools.js" > "${target}/ttTools.min.js"