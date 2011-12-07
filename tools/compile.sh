#!/bin/bash
# https://github.com/douglascrockford/JSMin
if [ ! -e 'ttTools.js' ]; then exit 1; fi
jsmin=`which jsmin`
if [ -z $jsmin ]; then exit 1; fi
if [ -z $1 ] ; then echo 'No option specified'; exit 1; fi
if [ $1 == 'test' ]; then
  cat ttTools.js ttTools.views.js ttTools.database.js ttTools.tags.js ttTools.tags.views.js
  echo 'ttTools.init();'
elif [ $1 == 'release' ]; then
  epoch=`date +%s`
  mkdir releases/$epoch
  cat ttTools.js ttTools.views.js ttTools.database.js ttTools.tags.js ttTools.tags.views.js > releases/$epoch/ttTools.js
  echo 'ttTools.init();' >> releases/$epoch/ttTools.js
  $jsmin < releases/$epoch/ttTools.js > releases/$epoch/ttTools.min.js
  cp releases/$epoch/ttTools.min.js releases/$epoch/ttTools.js releases/latest/
else
  echo "Unknown action $1"
fi