ttTools.tags = {

  dbTable : 'tags',

  playlistLoaded : function () {
    var defer = $.Deferred();
    if(this.isSupported()){
        var resolveWhenReady = function () {
            if (turntable && turntable.playlist && turntable.playlist.files)
                return defer.resolve();
            setTimeout(resolveWhenReady, 500);
        }
        resolveWhenReady();
    }
    return defer.promise();
  },
  isSupported : function () {
        return ttTools.database.isSupported()
  },
  init : function () {
    if(this.isSupported()){
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
      "}).appendTo(document.head);
        this.createTable();
        this.views.playlist.render();
        this.defaults();
    }
  },

  defaults : function () {
    this.views.playlist.update();
    this.override_filterQueue();
  },

  override_filterQueue : function () {
    // turntable.playlist.addSong.toString = Function.prototype.toString;
    if (!turntable.playlist.filterQueue_ttTools)
      turntable.playlist.filterQueue_ttTools = turntable.playlist.filterQueue;
    turntable.playlist.filterQueue = function (filter) {
      turntable.playlist.filterQueue_ttTools(filter);
      if (filter.length > 0) {
        ttTools.tags.getFidsForTagLike(filter, function (tx, result) {
          var fids = [];
          for (var i=0; i<result.rows.length; i++) { fids.push(result.rows.item(i).fid); }
          $('div.queue div.song:hidden').each(function(index, element) {
            var element = $(element);
            var fid = element.data('songData').fileId;
            if ($.inArray(fid, fids) > -1)
              element.closest('.song').show().addClass('filtered');
          });
        });
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
    this.views.playlist.update();
  },

  getAll : function (success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT fid, tag FROM ' + this.dbTable + ';',
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

  getFidsForTag : function (tag, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT fid FROM ' + this.dbTable + ' WHERE tag="' + tag + '";',
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

  getTagsForFid : function (fid, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT tag FROM ' + this.dbTable + ' WHERE fid="' + fid + '";',
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
