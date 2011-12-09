ttTools = {

  init : function() {
    $('<link/>', {
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/sunny/jquery-ui.css'
    }).appendTo(document.head);
    
    ttTools.views.menu.render();
    ttTools.views.users.render();
    ttTools.views.import.render();
    ttTools.views.toolbar.render();

    this.idleTimeOverride();
    this.removeDjOverride();
    this.updateVotesOverride();
    this.setCurrentSongOverride();

    if (window.openDatabase) {
      ttTools.tags.init();
    }

    var form = $('div.chat-container form');
    form.find('input').val('I <3 ttTools! https://github.com/egeste/ttTools');
  },

  getRoom : function() {
    for (var memberName in turntable) {
      var member = turntable[memberName];
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if (member.hasOwnProperty('setupRoom')) {
        return member;
      }
      return false;
    }
  },

  getRoomManager : function(room) {
    var room = room ? room : this.getRoom();
    if (!room) { return false; }
    for (var memberName in room) {
      var member = room[memberName];
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if (member.hasOwnProperty('blackswan')) {
        return member;
      }
    }
    return false;
  },

  idleTimeOverride : function () {
    turntable.idleTime = function () {
      return 0;
    };
  },

  autoDJ      : false,
  autoDJDelay : 2000,
  removeDjOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    room.removeDjFunc = room.removeDj;
    room.removeDj = function (userId) {
      if (userId != this.selfId && !this.isDj() && ttTools.autoDJ) {
        setTimeout(function() {
          room.becomeDj();
          ttTools.autoDJ = false;
          $('#autoDJ').prop('checked', false).button('refresh');
        }, ttTools.autoDJDelay);
      }
      this.removeDjFunc(userId);
    };
  },

  upvotes   : 0,
  downvotes : 0,
  updateVotesOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    if (!room.downvoters) { room.downvoters = []; }
    this.upvotes = room.upvoters.length;
    room.updateVotesFunc = room.updateVotes;
    room.updateVotes = function (votes, g) {
      this.updateVotesFunc(votes, g);
      if (!this.downvoters) { this.downvoters = []; }
      for (var i=0; i<votes.votelog.length; i++) {
        ttTools.upvotes   = votes.upvotes;
        ttTools.downvotes = votes.downvotes;
        var log = votes.votelog[i];
        if (log[1] == 'up') {
          var downIndex = $.inArray(log[0], this.downvoters);
          if (downIndex > -1) { this.downvoters.splice(downIndex, 1); }
        } else {
          if (log[0] != '') {
            this.downvoters.push(log[0]);
          }
        }
      }
      ttTools.views.users.update();
    }
  },

  autoAwesome      : false,
  autoAwesomeDelay : 30000,
  setCurrentSongOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    room.setCurrentSongFunc = room.setCurrentSong;
    room.setCurrentSong = function (roomState) {
      this.setCurrentSongFunc(roomState);
      ttTools.upvotes = room.upvoters.length;
      ttTools.downvotes = 0;
      ttTools.downvoters = [];
      ttTools.views.users.update();
      if (ttTools.autoAwesome) {
        setTimeout(function() {
          turntable.whenSocketConnected(function() {
            room.connectRoomSocket('up');
          });
        }, ttTools.autoAwesomeDelay);
      }
    };
  },

  importOperations : [],
  importOperationsCompleted : 0,
  importOperationsTimeout : null,
  importPlaylist : function (playlist) {
    if (playlist.length == 0) { return this.views.import.update(); }
    LOG("I'm using ttTools to import a playlist, but it's really slow because your api only allows adding one song at a time and has rate limiting. Can we work together to solve this? https://github.com/egeste/ttTools");
    if (window.openDatabase) { turntable.playlist.addSong = turntable.playlist.addSongFunc; }
    ttTools.importOperations = [];
    ttTools.importOperationsCompleted = 0;
    $(playlist).each(function (index, song) {
      if ($.inArray(song.fileId, Object.keys(turntable.playlist.songsByFid)) > -1) { return; }
      var operation = function (count) {
        count = (count == undefined) ? 1 : count;
        if (count > 3) {
          ttTools.importOperations.splice(ttTools.importOperationsCompleted, 1);
          ttTools.views.import.update();
        }
        ttTools.importOperationsTimeout = setTimeout(operation, 5000, count++);
        ttTools.importSong(song, function (response) {
          clearTimeout(ttTools.importOperationsTimeout);
          if (!response.success) { return operation(count++); }
          ttTools.importOperationsCompleted++;
          ttTools.views.import.update();
          turntable.playlist.files.push(song);
          turntable.playlist.songsByFid[song.fileId] = song;
          turntable.playlist.updatePlaylist();
          if (ttTools.importOperations[ttTools.importOperationsCompleted]) {
            ttTools.importOperations[ttTools.importOperationsCompleted]();
          }
        });
      }
      ttTools.importOperations.push(operation);
    });
    if (ttTools.importOperations.length == 0) { return this.views.import.update(); }
    ttTools.importOperations[0]();
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
        index         : turntable.playlist.files.length+1,
        song_dict     : {
          fileid: song.fileId
        }
      }));
      turntable.socketKeepAlive(true);
      turntable.pendingCalls.push({
        msgid    : messageId,
        deferred : $.Deferred(), // Why?
        time     : util.now(),
        handler  : callback
      });
    });
  },

  exportPlaylist : function () {
    var data = JSON.stringify(turntable.playlist.files);
    window.open('data:text/json;charset=utf-8,' + data);
  },

  shuffle : function (array) {
    var len = array.length;
    var i = len;
     while (i--) {
      var p = parseInt(Math.random()*len);
      var t = array[i];
      array[i] = array[p];
      array[p] = t;
    }
    return array;
  }
};
