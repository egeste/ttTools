ttTools = {

  init : function() {
    var form = $('div.chat-container form');
    form.find('input').val('I <3 ttTools! https://github.com/egeste/ttTools');

    $('<link/>', {
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/sunny/jquery-ui.css'
    }).appendTo(document.head);
    
    this.idleTimeOverride();
    this.removeDjOverride();
    this.setCurrentSongOverride();

    this.populateActivityLog();
    this.showChatMessageOverride();
    this.updateVotesOverride();
    this.removeUserOverride();
    this.addUserOverride();

    if (window.openDatabase) {
      this.tags.init();
    }
    
    this.views.menu.render();
    this.views.users.render();
    this.views.import.render();
    this.views.toolbar.render();
  },

  getRoom : function() {
    for (var memberName in turntable) {
      var member = turntable[memberName];
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if (member.hasOwnProperty('setupRoom')) {
        return member;
      }
    }
  },

  getRoomManager : function(room) {
    var room = room ? room : this.getRoom();
    for (var memberName in room) {
      var member = room[memberName];
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if (member.hasOwnProperty('blackswan')) {
        return member;
      }
    }
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

  autoAwesome      : false,
  autoAwesomeDelay : 30000,
  setCurrentSongOverride : function () {
    var room = this.getRoom();
    room.setCurrentSongFunc = room.setCurrentSong;
    room.setCurrentSong = function (roomState) {
      this.setCurrentSongFunc(roomState);
      ttTools.upvotes = room.upvoters.length;
      ttTools.downvotes = 0;
      ttTools.downvoters = [];
      if (ttTools.autoAwesome) {
        setTimeout(function() {
          turntable.whenSocketConnected(function() {
            room.connectRoomSocket('up');
          });
        }, ttTools.autoAwesomeDelay);
      }
    };
  },

  userActivityLog : {},
  populateActivityLog : function () {
    var users = Object.keys(this.getRoom().users);
    $(users).each(function (index, uid) {
      ttTools.userActivityLog[uid] = {
        message : util.now(),
        vote    : util.now()
      }
    });
  },

  showChatMessageOverride : function () {
    var room = this.getRoom();
    room.showChatMessageFunc = room.showChatMessage;
    room.showChatMessage = function (uid, name, msg) {
      this.showChatMessageFunc(uid, name, msg);
      ttTools.userActivityLog[uid].message = util.now();
    }
  },

  upvotes : 0,
  downvotes : 0,
  updateVotesOverride : function () {
    var room = this.getRoom();
    if (!room.downvoters) { room.downvoters = []; }
    this.upvotes = room.upvoters.length;
    room.updateVotesFunc = room.updateVotes;
    room.updateVotes = function (votes, g) {
      this.updateVotesFunc(votes, g);
      ttTools.upvotes   = votes.upvotes;
      ttTools.downvotes = votes.downvotes;
      if (!this.downvoters) { this.downvoters = []; }
      $(votes.votelog).each(function (index, vote) {
        if (vote[0] != '') {
          ttTools.userActivityLog[vote[0]].vote = util.now();
          if (vote[1] == 'up') {
            var downIndex = $.inArray(vote[0], room.downvoters);
            if (downIndex > -1) { room.downvoters.splice(downIndex, 1); }
          } else {
            room.downvoters.push(vote[0]);
          }
        }
      });
    }
  },

  removeUserOverride : function () {
    var room = this.getRoom();
    room.removeUserFunc = room.removeUser;
    room.removeUser = function (uid) {
      this.removeUserFunc(uid);
      delete ttTools.userActivityLog[uid];
    }
  },

  addUserOverride : function (user) {
    var room = this.getRoom();
    room.addUserFunc = room.addUser;
    room.addUser = function (user) {
      this.addUserFunc(user);
      ttTools.userActivityLog[user.userid] = {
        message : util.now(),
        vote    : util.now()
      }
    }
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
