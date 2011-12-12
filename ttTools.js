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

    this.views.menu.render();
    this.views.users.render();
    this.views.toolbar.render();

    if (this.database.isSupported()) { this.tags.init(); }
    if (this.portability.isSupported()) { this.portability.init(); }
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
      room.downvoters = [];
      ttTools.upvotes = room.upvoters.length;
      ttTools.downvotes = 0;
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
}
