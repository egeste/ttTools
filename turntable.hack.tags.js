turntable.hack.tags = {
  dbTable : 'tags',

  init : function () {
    $.getScript('http://dl.dropbox.com/u/40584302/Source/tt.fm/turntable.hack.tags.views.js', function() {
      $('<link/>', {
        type : 'text/css',
        rel  : 'stylesheet',
        href : 'http://dl.dropbox.com/u/40584302/Source/jQuery-Tags-Input/jquery.tagsinput.css'
      }).appendTo(document.head);
      $.getScript('http://dl.dropbox.com/u/40584302/Source/jQuery-Tags-Input/jquery.tagsinput.js', function() {
        turntable.hack.tags.createTable();
        turntable.hack.tags.addClickEvent();
        turntable.hack.tags.addSongOverride();
        turntable.hack.tags.filterQueueOverride();
        turntable.hack.tags.settingsTreeOverride();
        turntable.hack.tags.settingsClickOverride();
      });
    });
  },

  createTable : function () {
    turntable.hack.database.execute(
      'CREATE TABLE IF NOT EXISTS ' +
      this.dbTable + '(' +
      'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
      'fid TEXT NOT NULL,' +
      'tag TEXT NOT NULL' +
      ');'
    );
  },

  addClickEvent : function () {
    $('div.song').unbind(
      'click'
    ).click(function(e) {
      turntable.hack.tags.views.add.file = $(this).closest('.song').data('songData');
      turntable.hack.tags.views.add.render();
    });
  },

  addSongOverride : function () {
    turntable.playlist.addSongFunc = turntable.playlist.addSong;
    turntable.playlist.addSong = function (b, a) {
      turntable.playlist.addSongFunc(b, a);
      turntable.hack.tags.addClickEvent();
    }
  },

  filterQueueOverride : function () {
    turntable.playlist.filterQueueFunc = turntable.playlist.filterQueue;
    turntable.playlist.filterQueue = function (filter) {
      turntable.playlist.filterQueueFunc(filter);
      if (filter.length > 0) {
        turntable.hack.tags.getFidsForTagLike(
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

  settingsTreeOverride : function () {
    var func = turntable.hack.views.settings.tree;
    turntable.hack.views.settings.tree = function () {
      var tree = func();
      tree.push(['button#resetTags', 'Reset Tags']);
      return tree;
    }
  },

  settingsClickOverride : function () {
    var func = turntable.hack.views.settings.render;
    turntable.hack.views.settings.render = function () {
      func();
      $('#resetTags').button().click(function() {
        if (!confirm('Are you sure? This will delete your entire tags database.')) { return false; }
        turntable.hack.tags.resetData();
      });
    }
    $('#hackSettings').unbind('click').click(turntable.hack.views.settings.render);
  },

  resetData : function () {
    turntable.hack.database.execute('DROP TABLE IF EXISTS ' + this.dbTable + ';');
    this.createTable();
    this.addTag('4dd6c222e8a6c404330002c5', 'trololo');
  },

  getTagsForFid : function (fid, success, failure) {
    return turntable.hack.database.execute(
      'SELECT DISTINCT tag FROM ' + this.dbTable + ' WHERE fid="' + fid + '";',
      success,
      failure
    );
  },

  getFidsForTagLike : function (tag, success, failure) {
    return turntable.hack.database.execute(
      'SELECT DISTINCT fid FROM ' + this.dbTable + ' WHERE tag LIKE "%' + tag + '%";',
      success,
      failure
    );
  },

  addTag : function (fid, tag, success, failure) {
    return turntable.hack.database.execute(
      'INSERT OR ABORT INTO ' + this.dbTable + ' (fid,tag) VALUES("' + fid + '", "' + tag + '");',
      success,
      failure
    );
  },

  removeTag : function (fid, tag, success, failure) {
    return turntable.hack.database.execute(
      'DELETE FROM ' + this.dbTable + ' WHERE fid="' + fid + '" AND tag="' + tag + '";',
      success,
      failure
    );
  }
}