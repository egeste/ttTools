#!/bin/bash
if [ ! -e 'ttTools.js' ]; then echo 'Script needs to run from the project root directory'; exit 1; fi

# https://github.com/douglascrockford/JSMin
jsmin=`which jsmin`
if [ -z $jsmin ]; then echo 'jsmin not found'; exit 1; fi

if [ -z $1 ]; then echo 'No option specified'; exit 1; fi

ttTools_files=(
  'jquery-tags/jquery.tagsinput.js'
  'ttObjects/ttObjects.js'
  'ttTools.js'
  'ttTools.constants.js'
  'ttTools.views.js'
  'ttTools.database.js'
  'ttTools.tags.js'
  'ttTools.tags.views.js'
)

for file in ${ttTools_files[@]}; do
  ttTools_fileList="${ttTools_fileList}${file} "
done

if [ $1 == 'test' ]; then
  mkdir -p releases/test
  cat $ttTools_fileList > releases/test/ttTools.js
  echo "ttTools.release = 540374400000;" >> releases/test/ttTools.js
  echo "ttTools.load(0);" >> releases/test/ttTools.js
elif [ $1 == 'release' ]; then
  epoch=`date +%s`
  mkdir -p releases/latest
  cat $ttTools_fileList > releases/latest/ttTools.js
  echo "ttTools.release = $epoch;" >> releases/latest/ttTools.js
  echo "ttTools.load(0);" >> releases/latest/ttTools.js
  $jsmin < releases/latest/ttTools.js > releases/latest/ttTools.min.js
elif [ $1 == 'portability' ]; then
  extras_files=('ttTools.portability.js' 'ttTools.portability.views.js')
  for file in ${extras_files[@]}; do
    extras_fileList="${extras_fileList}${file} "
  done
  mkdir -p releases/extras
  cat $extras_fileList > releases/extras/ttTools.portability.js
  $jsmin < releases/extras/ttTools.portability.js > releases/extras/ttTools.portability.min.js
elif [ $1 == 'extension' ]; then
  zip -r ../ttTools-loader.zip extension/*
else
  echo "Unknown action ${1}"
fi