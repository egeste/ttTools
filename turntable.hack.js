/**
 * egeste@egeste.net
 * http://www.egeste.net/
 * http://www.linkedin.com/in/egeste
 *
 * FEATURES:
 * [x] Disable idle timer
 * [x] Auto DJ w/ switch & adjustable delay
 * [x] Auto Awesome w/ switch & adjustable delay
 *
 * [x] Playlist song tagging
 * [x] Playlist filter on tags
 * [x] Playlist invert, shuffle
 *
 * [x] Download songs
 * [x] Disable DMCA Mute when DJing solo
 *
 * [ ] Persistent between rooms (maybe time for a chrome extension?)
 *
 * BOOKMARKLET:
 * javascript:(function(){$.getScript('http://dl.dropbox.com/u/40584302/Source/tt.fm/turntable.hack.js');})();
 */

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

turntable.hack = {
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
    
    $.getScript('http://dl.dropbox.com/u/40584302/Source/tt.fm/turntable.hack.views.js', function() {
      if (window.openDatabase) {
        $.getScript('http://dl.dropbox.com/u/40584302/Source/tt.fm/turntable.hack.database.js', function() {
          $.getScript('http://dl.dropbox.com/u/40584302/Source/tt.fm/turntable.hack.tags.js', function() {
            turntable.hack.tags.init();
          });
        });
      }
      turntable.hack.views.toolbar.render();
      turntable.hack.views.download_button.render();
    });

    this.idleTimeOverride();
    this.fuckTheDMCA();

    //this.reloadPageOverride();
    this.removeDjOverride();
    this.setCurrentSongOverride();
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
      $(document).ready(turntable.hack.init);
    }
  },

  removeDjOverride : function () {
    var room = this.getRoom();
    if (!room) { return false; }
    room.removeDjFunc = room.removeDj;
    room.removeDj = function (userId) {
      if (userId != this.selfId && !this.isDj() && turntable.hack.autoDJ) {
        setTimeout(function() {
          room.becomeDj();
          if (room.isDj()) {
            turntable.hack.autoDJ = false;
            $('#autoDJ').prop('checked', false).button('refresh');
          }
        }, turntable.hack.autoDJDelay);
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
      if (turntable.hack.autoAwesome) {
        setTimeout(function() {
          turntable.whenSocketConnected(function() {
            room.connectRoomSocket('up');
          });
        }, turntable.hack.autoAwesomeDelay);
      }
    };
  }
};
turntable.hack.init();