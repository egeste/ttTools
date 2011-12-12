ttTools.portability = {

  init : function () {
    this.views.import.render();
  },

  isSupported : function () {
    return $('<div/>').draggable ? true : false;
  },

  importProcess : {
    operations : [],
    completed  : 0,
    timeout    : null
  },

  importPlaylist : function (playlist) {
    if (playlist.length == 0) { return this.views.import.update(); }
    
    LOG("I'm using ttTools to import a playlist, but it's really slow because your api only allows adding one song at a time and has rate limiting. Can we work together to solve this? https://github.com/egeste/ttTools");
    
    if (ttTools.database.isSupported()) { turntable.playlist.addSong = turntable.playlist.addSongFunc; }
    
    this.importProcess.operations = [];
    this.importProcess.completed = 0;

    $(playlist).each(function (index, song) {
      if ($.inArray(song.fileId, Object.keys(turntable.playlist.songsByFid)) > -1) { return; }

      var operation = function (count) {
        count = (count == undefined) ? 1 : count;

        if (count > 3) {
          ttTools.portability.importOperations.splice(ttTools.portability.importProcess.completed, 1);
          ttTools.portability.views.import.update();
        }

        var deferredRetry = function () { operation(count++); }
        ttTools.portability.importProcess.timeout = setTimeout(deferredRetry, 10000);

        var apiCallback = function (response) {
          clearTimeout(ttTools.portability.importProcess.timeout);
          if (!response.success) { return operation(count++); }
          ttTools.portability.importProcess.completed++;
          ttTools.portability.views.import.update();
          turntable.playlist.files.push(song);
          turntable.playlist.songsByFid[song.fileId] = song;
          turntable.playlist.updatePlaylist();
          if (ttTools.database.isSupported() && song.tags) {
            ttTools.tags.getTagsForFid(song.fileId, function (tx, result) {
              var tags = [];
              for (var i=0; i<result.rows.length; i++) { tags.push(result.rows.item(i).tag); }
              $(song.tags).each(function (index, tag) {
                if ($.inArray(tag, tags) < 0) {
                  ttTools.tags.addTag(song.fileId, tag, function (tx, result) {
                    ttTools.tags.updateQueue();
                  });
                }
              });
            })
          }
          if (ttTools.portability.importProcess.operations[ttTools.portability.importProcess.completed]) {
            ttTools.portability.importProcess.operations[ttTools.portability.importProcess.completed]();
          }
        }
        var deferredOperation = function () { ttTools.portability.importSong(song, apiCallback); }
        setTimeout(deferredOperation, 1500); // Offset to avoid getting nailed by the rate limiting
      }
      ttTools.portability.importProcess.operations.push(operation);
    });
    if (this.importProcess.operations.length == 0) { return this.views.import.update(); }
    this.importProcess.operations[0]();
  },

  importSong : function (song, callback) {
    var messageId = turntable.messageId;
    turntable.messageId++;
    turntable.whenSocketConnected(function() {
      turntable.socket.send(JSON.stringify({
        msgid         : messageId,
        clientid      : turntable.clientId,
        userid        : turntable.user.id,
        userauth      : turntable.user.auth,
        api           : 'playlist.add',
        playlist_name : 'default',
        index         : turntable.playlist.files.length + 1,
        song_dict     : {
          fileid: song.fileId
        }
      }));
      turntable.socketKeepAlive(true);
      turntable.pendingCalls.push({
        msgid    : messageId,
        deferred : $.Deferred(),
        time     : util.now(),
        handler  : callback
      });
    });
  },

  exportSongs : function () {
    if (!ttTools.database.isSupported()) {
      return window.open('data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files));
    }
    ttTools.tags.getAll(function (tx, result) {
      var songsByFid = turntable.playlist.songsByFid;
      for (var i=0; i<result.rows.length; i++) {
        if (!songsByFid[result.rows.item(i).fid]) { continue; }
        if (songsByFid[result.rows.item(i).fid].tags) {
          songsByFid[result.rows.item(i).fid].tags.push(result.rows.item(i).tag)
        } else {
          songsByFid[result.rows.item(i).fid].tags = [result.rows.item(i).tag];
        }
      }
      var playlist = [];
      for (song in songsByFid) { playlist.push(songsByFid[song]); }
      return window.open('data:text/json;charset=utf-8,' + JSON.stringify(playlist));
    }, function (tx, result) {
      turntable.showAlert("Attempted to export your tags with your songs, but it failed. Sorry :/ Here's a regular export.");
      return window.open('data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files));
    });
  },

  exportSongsWithTags : function (tags) {
    if (tags.length < 2 && tags[0] == '') {
      return turntable.showAlert('No tags specified', ttTools.views.settings.render);
    }
    util.hideOverlay();
    ttTools.tags.getAll(function (tx, result) {
      var tagsByFid = {},
          matchFids = [];
      for (var i=0; i<result.rows.length; i++) {
        if (tagsByFid[result.rows.item(i).fid]) {
          tagsByFid[result.rows.item(i).fid].push(result.rows.item(i).tag);
        } else {
          tagsByFid[result.rows.item(i).fid] = [result.rows.item(i).tag];
        }
        if ($.inArray(result.rows.item(i).tag, tags) > -1) {
          matchFids.push(result.rows.item(i).fid);
        }
      }
      var playlist = [];
      $(turntable.playlist.files).each(function (index, file) {
        if ($.inArray(file.fileId, matchFids) > -1) {
          file.tags = tagsByFid[file.fileId];
          playlist.push(file);
        }
      });
      if (playlist.length < 1) {
        return turntable.showAlert("You have no music tagged with " + tags.join(', '));
      }
      return window.open('data:text/json;charset=utf-8,' + JSON.stringify(playlist));
    });
  }
}
