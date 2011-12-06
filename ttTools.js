Array.prototype.shuffle = function() {
  var len = this.length;
  var i = len;
   while (i--) {
    var p = parseInt(Math.random()*len);
    var t = this[i];
    this[i] = this[p];
    this[p] = t;
  }
};

ttTools = {
  autoDJ      : false,
  autoDJDelay : 2000,
  
  autoAwesome      : false,
  autoAwesomeDelay : 30000,

  init : function() {
    $('<link/>', {
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/sunny/jquery-ui.css'
    }).appendTo(document.head);
    
    $.getScript('https://raw.github.com/egeste/ttTools/master/ttTools.views.js', function() {
      if (window.openDatabase) {
        $.getScript('https://raw.github.com/egeste/ttTools/master/ttTools.database.js', function() {
          $.getScript('https://raw.github.com/egeste/ttTools/master/ttTools.tags.js', function() {
            ttTools.tags.init();
          });
        });
      }
      ttTools.views.menu.render();
      ttTools.views.toolbar.render();
      ttTools.views.download_button.render();
    });

    this.idleTimeOverride();
    this.fuckTheDMCA();

    //this.reloadPageOverride();
    this.removeDjOverride();
    this.setCurrentSongOverride();

    var form = $('div.chat-container form');
    form.find('input').val('I <3 ttTools! https://github.com/egeste/ttTools');
  },

  getRoom : function() {
    for (var memberName in turntable) {
      var member = eval('turntable.'+memberName);
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if ('setupRoom' in member) {
        return member;
      }
      return false;
    }
  },

  getCore : function(room) {
    for (var memberName in room) {
      var member = eval('room.'+memberName);
      if (member == null) { continue; }
      if (typeof member != 'object') { continue; }
      if ('blackswan' in member) {
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

  fuckTheDMCA : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    clearTimeout(room.timers.dmcaMute);
    room.timers.dmcaMute = null;
    room.dmcaMute = function(){
      this.showRoomTip("Fuck the DMCA");
    };
    turntablePlayer.setDmcaMute(false);
  },

  reloadPageOverride : function () {
    turntable.reloadPageFunc = turntable.reloadPage;
    turntable.reloadPage = function (a) {
      this.reloadPageFunc(a);
      $(document).ready(ttTools.init);
    }
  },

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

  setCurrentSongOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    room.setCurrentSongFunc = room.setCurrentSong;
    room.setCurrentSong = function (roomState) {
      this.setCurrentSongFunc(roomState);
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

  importPlaylist : function () {
    // TODO
  },

  exportPlaylist : function () {
    var fids = [];
    for (var i=0; i<turntable.playlist.files.length; i++) {
      fids.push(turntable.playlist.files[i].fileId);
    }
    window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(fids) + ';';
  }
};
ttTools.init();