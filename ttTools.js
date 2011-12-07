ttTools = {

  init : function() {
    $('<link/>', {
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/sunny/jquery-ui.css'
    }).appendTo(document.head);
    
    ttTools.views.menu.render();
    ttTools.views.users.render();
    ttTools.views.toolbar.render();
    ttTools.views.download_button.render();

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

  getCore : function(room) {
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

  upvotes : 0,
  downvotes : 0,
  updateVotesOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    if (!room.downvoters) { room.downvoters = []; }
    room.updateVotesFunc = room.updateVotes;
    room.updateVotes = function (votes, g) {
      this.updateVotesFunc(votes, g);
      if (!this.downvoters) { this.downvoters = []; }
      ttTools.upvotes = votes.upvotes;
      ttTools.downvotes = votes.downvotes;
      for (var i=0; i<votes.votelog.length; i++) {
        var log = votes.votelog[i];
        if (log[1] == 'up') {
          var downIndex = $.inArray(log[0], this.downvoters);
          if (downIndex > -1) { this.downvoters.splice(downIndex, 1); }
        } else {
          this.downvoters.push(log[0]);
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
      for (var timerName in room.timers) {
        if (room.hasOwnProperty(timerName)) {
          clearTimeout(room.timers[timerName]);
          room.timers[timerName] = null;
          room[timerName] = function () { /* your move */ }
          break;
        }
      }
      if (ttTools.autoAwesome) {
        setTimeout(function() {
          turntable.whenSocketConnected(function() {
            room.connectRoomSocket('up');
          });
        }, ttTools.autoAwesomeDelay);
      }
    };
  },

  getDownloadUrl : function () {
    var room = ttTools.getRoom();
    if (!room) { return false; }
    if (room.currentSong == null) { return 'javascript:void(0);'; }
    return window.location.protocol + "//" + MEDIA_HOST +
        "/getfile/?roomid=" + room.roomId +
        "&rand=" + Math.random() +
        "&fileid=" + room.currentSong._id +
        "&downloadKey=" + $.sha1(room.roomId + room.currentSong._id) +
        "&userid=" + turntable.user.id +
        "&client=web";
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
  },

  importPlaylist : function (playlist) {
    for (var i=0; i<playlist.length; i++) {
      if ($.inArray(playlist[i], turntable.playlist.files) < 0) { // Not in array
        turntable.playlist.addSong(playlist[i]);
      }
    }
    var room = ttTools.getRoom();
    if (!room) { return; }
    room.showRoomTip('It may take some time for your queue to update on the server. Please stay on this page for a while to allow time for your playlist to propagate.');
  },

  exportPlaylist : function () {
    var data = JSON.stringify(turntable.playlist.files;
    window.open('data:text/json;charset=utf-8,' + data);
  }
};
