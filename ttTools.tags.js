ttTools.tags = {
  dbTable : 'tags',

  init : function () {
    $('<style/>', {
      type : 'text/css',
      text : "\
      div.tagsinput { border:1px solid #CCC; background: #FFF; padding:5px; width:300px; height:100px; overflow-y: auto;}\
      div.tagsinput span.tag { border: 1px solid #a5d24a; -moz-border-radius:2px; -webkit-border-radius:2px; display: block; float: left; padding: 5px; text-decoration:none; background: #cde69c; color: #638421; margin-right: 5px; margin-bottom:5px;font-family: helvetica;  font-size:13px;}\
      div.tagsinput span.tag a { font-weight: bold; color: #82ad2b; text-decoration:none; font-size: 11px;  }\
      div.tagsinput input { width:80px; margin:0px; font-family: helvetica; font-size: 13px; border:1px solid transparent; padding:5px; background: transparent; color: #000; outline:0px;  margin-right:5px; margin-bottom:5px; }\
      div.tagsinput div { display:block; float: left; }\
      .tags_clear { clear: both; width: 100%; height: 0px; }\
      .not_valid {background: #FBD8DB !important; color: #90111A !important;}\
      div.song div.ui-icon-tag {\
        top: 24px;\
        right: 5px;\
        width: 16px;\
        height: 16px;\
        cursor: pointer;\
        position: absolute;\
      }\
    "}).appendTo(document.head);
    $.getScript('https://raw.github.com/xoxco/jQuery-Tags-Input/73c60604f83f7a713d3e79cfb3bd43de95553d23/jquery.tagsinput.min.js', function() {
      ttTools.tags.createTable();
      ttTools.tags.updateQueue();
      ttTools.tags.addSongOverride();
      ttTools.tags.filterQueueOverride();
    });
  },

  updateQueue : function () {
    var elements = $('div.song').unbind(
      'click'
    ).click(function(e) {
      ttTools.tags.views.add.file = $(this).closest('.song').data('songData');
      ttTools.tags.views.add.render();
    });
    $('div.song div.ui-icon-tag').remove();
    this.getFids(function (tx, result) {
      var fids = [];
      for (var i=0; i<result.rows.length; i++) {
        fids.push(result.rows.item(i).fid);
      }
      elements.each(function (index, element) {
        element = $(element);
        var fid = element.closest('.song').data('songData').fileId;
        if ($.inArray(fid, fids) > -1) {
          $('<div/>', {
            'class' : 'ui-icon ui-icon-tag',
            title   : 'This song is ttTagged'
          }).appendTo(element);
        }
      });
    });
  },

  addSongOverride : function () {
    turntable.playlist.addSongFunc = turntable.playlist.addSong;
    turntable.playlist.addSong = function (b, a) {
      turntable.playlist.addSongFunc(b, a);
      ttTools.tags.updateQueue();
    }
  },

  filterQueueOverride : function () {
    turntable.playlist.filterQueueFunc = turntable.playlist.filterQueue;
    turntable.playlist.filterQueue = function (filter) {
      turntable.playlist.filterQueueFunc(filter);
      if (filter.length > 0) {
        ttTools.tags.getFidsForTagLike(
          filter,
          function (tx, result) {
            var fids = [];
            for (var i=0; i<result.rows.length; i++) {
              fids.push(result.rows.item(i).fid);
            }
            $('div.queue div.song:hidden').each(function(index, value) {
              var element = $(value);
              var fid = element.data('songData').fileId;
              if ($.inArray(fid, fids) > -1) {
                element.closest('.song').show().addClass('filtered');
              }
            });
          }
        );
      }
    }
  },

  createTable : function () {
    ttTools.database.execute(
      'CREATE TABLE IF NOT EXISTS ' +
      this.dbTable + '(' +
      'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
      'fid TEXT NOT NULL,' +
      'tag TEXT NOT NULL' +
      ');'
    );
  },

  resetData : function () {
    ttTools.database.execute('DROP TABLE IF EXISTS ' + this.dbTable + ';');
    this.createTable();
    this.addTag('4dd6c222e8a6c404330002c5', 'trololo');
  },

  getTagsForFid : function (fid, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT tag FROM ' + this.dbTable + ' WHERE fid="' + fid + '";',
      success,
      failure
    );
  },

  getFids : function (success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT fid FROM ' + this.dbTable + ';',
      success,
      failure
    );
  },

  getFidsForTagLike : function (tag, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT fid FROM ' + this.dbTable + ' WHERE tag LIKE "%' + tag + '%";',
      success,
      failure
    );
  },

  addTag : function (fid, tag, success, failure) {
    return ttTools.database.execute(
      'INSERT INTO ' + this.dbTable + ' (fid,tag) VALUES("' + fid + '", "' + tag + '");',
      success,
      failure
    );
  },

  removeTag : function (fid, tag, success, failure) {
    return ttTools.database.execute(
      'DELETE FROM ' + this.dbTable + ' WHERE fid="' + fid + '" AND tag="' + tag + '";',
      success,
      failure
    );
  }
}
