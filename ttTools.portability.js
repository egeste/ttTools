ttTools.portability = {

  init : function () {
    this.views.import.render();
  },

  importProcess : {
    operations : [],
    completed  : 0,
    timeout    : null
  },

  importPlaylist : function (playlist) {
    if (playlist.length == 0) { return this.views.import.update(); }

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
        var deferredOperation = function () {
          ttObjects.api({
            api           : 'playlist.add',
            playlist_name : 'default',
            index         : turntable.playlist.files.length + 1,
            song_dict     : { fileid: song.fileId }
          }, apiCallback);
        }
        setTimeout(deferredOperation, 1500); // Offset to avoid getting nailed by the rate limiting
      }
      ttTools.portability.importProcess.operations.push(operation);
    });
    if (this.importProcess.operations.length == 0) { return this.views.import.update(); }
    this.importProcess.operations[0]();
  },

  exportPlaylist : function (tags) {
    if (!ttTools.database.isSupported() || (tags.length < 2 && tags[0] == '')) {
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files);
    }
    
    ttTools.tags.getAll(function (tx, result) {
      var tagsByFid = {}, matchFids = [];
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
        if ($.inArray(file.fileId, matchFids) > -1) playlist.push(file);
      });

      if (playlist.length < 1) {
        return turntable.showAlert("You have no music tagged with " + tags.join(', '));
      }

      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(playlist);
    });
  }
}
