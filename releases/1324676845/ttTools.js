ttTools = {

  loadRetry : 30,
  load : function (retry) {
    if (!turntable
      || !ttTools.getRoom()
    ) {
      if (retry > ttTools.loadRetry) { return alert('Could not load ttTools.'); }
      var callback = function () { ttTools.load(retry++); }
      return setTimeout(callback, 1000);
    }
    ttTools.init();
  },

  init : function() {
    var form = $('div.chat-container form');
    form.find('input').val('I <3 ttTools! http://tttools.egeste.net/');

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
    this.views.toolbar.render();
    this.views.users.render();
    this.views.chat.render();

    if (this.database.isSupported()) { this.tags.load(0); }
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
    return false;
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
      ttTools.views.chat.update();
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

  showTheLove : function () {
    var room = this.getRoom();
    var roomManager = this.getRoomManager(room);
    var maxOffset = 200 * Object.keys(room.users).length;
    for (user in room.users) {
      setTimeout(function (user) {
        roomManager.show_heart(user);
      }, Math.round(Math.random() * maxOffset), user);
    }
  },

  resetPlayer : function () {
    var room = this.getRoom();
    if (!room.currentSong) { return; }
    turntablePlayer.playSong(
      room.roomId,
      room.currentSong._id,
      room.currentSong.starttime + turntable.clientTimeDelta + 2
    );
  },

  donateButton : function () {
    return "<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>\
      <input type='hidden' name='cmd' value='_s-xclick'>\
      <input type='hidden' name='hosted_button_id' value='ZNTHAXPNKMKBN'>\
      <input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!'>\
      <img alt='' border='0' src='https://www.paypalobjects.com/en_US/i/scr/pixel.gif' width='1' height='1'>\
      </form>";
  }
}
ttTools.views = {

  menu : {
    render : function () {
      $('<div class="menuItem">ttTools</div>').click(function (e) {
        ttTools.views.settings.render();
      }).insertBefore($('div#menuh').children().last());
    }
  },

  settings : {
    render : function () {
      util.showOverlay(util.buildTree(this.tree()));
      $('div.settingsOverlay.modal').append(ttTools.donateButton());

      $('<style/>', {
        type : 'text/css',
        text : "\
        div.field.settings { padding:10px 20px; }\
        div.field.settings .ui-slider {\
          height:0.5em;\
          margin:10px 0 3px;\
        }\
        div.field.settings .ui-slider .ui-slider-handle {\
          width:0.9em;\
          height:0.9em;\
        }\
        #autoDJDisplay, #autoAwesomeDisplay { text-align:center; }\
      "}).appendTo($('div.settingsOverlay.modal'));

      $('#autoDJDelay').slider({
        max   : 5000,
        min   : 0,
        step  : 100,
        value : ttTools.autoDJDelay,
        slide : function (event, ui) {
          ttTools.autoDJDelay = ui.value;
          $('#autoDJDisplay').text(ui.value/1000 + ' s');
        }
      });
      $('#autoAwesomeDelay').slider({
        max   : 60000,
        min   : 0,
        step  : 1000,
        value : ttTools.autoAwesomeDelay,
        slide : function (event, ui) {
          ttTools.autoAwesomeDelay = ui.value;
          $('#autoAwesomeDisplay').text(ui.value/1000 + ' s');
        }
      });
    },

    tree : function () {
      return ['div.settingsOverlay.modal', {},
        ['div.close-x', {
          event : {
            click : util.hideOverlay
          }
        }],
        ['h1', 'ttTools'],
        ['div', {}, ttTools.release],
        ['br'],
        ['div.fields', {},
          ['div.field.settings', {},
            ['div', {}, 'Auto DJ Delay'],
            ['div#autoDJDelay', {}],
            ['div#autoDJDisplay', {}, ttTools.autoDJDelay/1000 + ' s'],
            ['br'],
            ['div', {}, 'Auto Awesome Delay'],
            ['div#autoAwesomeDelay', {}],
            ['div#autoAwesomeDisplay', {}, ttTools.autoAwesomeDelay/1000 + ' s']
          ],
        ]
      ];
    }
  },

  toolbar : {
    render : function () {
      turntable.playlist.setPlaylistHeightFunc = turntable.playlist.setPlaylistHeight;
      turntable.playlist.setPlaylistHeight = function (a) {
        var a = this.setPlaylistHeightFunc(a);
        $(turntable.playlist.nodes.root).find(".queueView .songlist").css({
            height: Math.max(a - 120, 55)
        });
        return a;
      }
      turntable.playlist.setPlaylistHeight($('div.chat-container').css('top').replace('px', ''));

      $('<style/>', {
        type : 'text/css',
        text : "\
        div.resultsLabel {\
          top:65px !important;\
          height:20px !important;\
          padding-top:7px !important;\
          background-color:#CCC !important;\
        }\
        div.songlist {\
          font-size:0.5em;\
          top:95px !important;\
        }\
        #playlistTools {\
          left:0;\
          right:0;\
          top:65px;\
          height:2em;\
          padding:2px 0;\
          position:absolute;\
        }\
        #playlistTools label {\
          font-size:10px;\
          text-shadow:none;\
        }\
        #playlistTools button { width:20px; }\
        #playlistTools button .ui-button-text { padding:11px; }\
        #playlistTools div, #playlistTools button { float:left; }\
        #switches { margin:0 5px; }\
        #switches ui-button-text { padding:.4em; }\
      "}).appendTo(document.head);

      $(util.buildTree(this.tree())).insertAfter(
        $('form.playlistSearch')
      );

      $('#switches').buttonset();

      $('#autoDJ').click(function (e) {
        var room = ttTools.getRoom();
        ttTools.autoDJ = !ttTools.autoDJ;
        if(ttTools.autoDJ && !room.isDj() && room.djIds.length < room.maxDjs) {
          room.becomeDj();
        }
      }).prop('checked', ttTools.autoDJ).button('refresh');

      $('#autoAwesome').click(function (e) {
        ttTools.autoAwesome = !ttTools.autoAwesome;
        if(ttTools.autoAwesome) {
          turntable.whenSocketConnected(function () {
            ttTools.getRoom().connectRoomSocket('up');
          });
        }
      }).prop('checked', ttTools.autoAwesome).button('refresh');

      $('#userList').button({
        text  : false,
        icons : {
          primary : 'ui-icon-person'
        }
      }).click(function (e) {
        var userDialog = $('#usersDialog');
        if (userDialog.dialog('isOpen')) {
          userDialog.dialog('close');
        } else {
          userDialog.dialog('open');
        }
      });

      $('#showTheLove').button({
        text  : false,
        icons : {
          primary: 'ui-icon-heart'
        }
      }).click(function (e) {
        ttTools.showTheLove();
      });

      $('#resetPlayer').button({
        text  : false,
        icons : {
          primary: 'ui-icon-refresh'
        }
      }).click(function (e) {
        ttTools.resetPlayer();
      });

      $('#exportQueue').button({
        text  : false,
        icons : {
          primary : 'ui-icon-disk'
        }
      }).click(function (e) {
        util.hideOverlay();
        ttTools.portability.exportSongs();
      });
    },

    tree : function () {
      return ['div#playlistTools', {},
        ['div#switches', {},
          ['input#autoDJ.ui-icon.ui-icon-person', { type : 'checkbox', title: 'Auto DJ' }],
          ['label', { 'for' : 'autoDJ' }, 'DJ Next'],
          ['input#autoAwesome', { type : 'checkbox', title: 'Auto Awesome' }],
          ['label', { 'for' : 'autoAwesome' }, 'Up-Vote'],
        ],
        ['button#userList', { title: 'User List' }],
        ['button#showTheLove', { title: 'Show The Love' }],
        ['button#resetPlayer', { title: 'Reset Player' }],
        ['button#exportQueue', { title : 'Export Playlist' }]
      ];
    }
  },

  users : {
    render : function () {
      $('<div/>', {
        id : 'usersDialog'
      }).append(
        $('<table/>', {
          id      : 'usersList',
          'class' : 'ui-widget ui-widget-content'
        })
      ).appendTo(document.body);

      $('#usersDialog').dialog({
        autoOpen      : false,
        closeOnEscape : true,
        title         : 'Users',
        width         : '500',
        height        : '300',
        open          : ttTools.views.users.update,
        show          : 'slide'
      });
      
      $('<style/>', {
        type : 'text/css',
        text : "\
        #usersList {\
          width:100%;\
          text-shadow:none;\
          font-size:14px;\
        }\
        #usersList .time { text-align: right; }\
        #usersList .upvoter { background-color:#aea; }\
        #usersList .downvoter { background-color:#eaa; }\
        #usersList .currentDj { background-color:#ccf; }\
        #usersList .user { font-weight: bold; cursor: pointer; }\
        #usersList .user .ui-icon { display:inline-block; }\
        #ui-dialog-title-usersDialog { width:100%; text-align:right; }\
        #ui-dialog-title-usersDialog .ui-icon { display:inline-block; }\
        #ui-dialog-title-usersDialog .vote { float:left; }\
        #ui-dialog-title-usersDialog .vote.up { color:#aea; padding-right:10px; }\
        #ui-dialog-title-usersDialog .vote.down { color:#eaa; }\
      "}).appendTo($('div.#usersDialog'));
    },

    update : function () {
      var usersDialog = $('#usersDialog');
      if (!usersDialog.dialog('isOpen')) { return; }
      setTimeout(ttTools.views.users.update, 1000);

      var room = ttTools.getRoom();

      usersDialog.dialog(
        'option',
        'title',
        "<span class='usercount'>" + Object.keys(room.users).length + "</span>\
        <span class='usercount ui-icon ui-icon-person'></span>\
        <span class='vote ui-icon ui-icon-triangle-1-n'></span>\
        <span class='vote up'>" + ttTools.upvotes + "</span>\
        <span class='vote ui-icon ui-icon-triangle-1-s'></span>\
        <span class='vote down'>" + ttTools.downvotes + "</span>"
      );
      $('#ui-dialog-title-usersDialog').parent().css('padding', '5px 30px 0 10px');

      var usersList = $('#usersList').html(
        '<tbody><tr>' +
        '<th>Name</th>' +
        '<th>Message</th>' +
        '<th>Vote</th>' +
        '</tr></tbody>'
      );

      var nameAlpha = function (a, b) {
        if (!room.users[a]) { return 1; }
        if (!room.users[b]) { return -1; }
        a = room.users[a].name.toLowerCase();
        b = room.users[b].name.toLowerCase();
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      };

      if (room.currentDj) {
        usersList.find('tbody').append(
          $(util.buildTree(ttTools.views.users.rowForUser(room.users[room.currentDj])))
        );
      }

      room.upvoters.sort(nameAlpha);
      $(room.upvoters).each(function (index, uid) {
        if (room.users[uid]) {
          usersList.find('tbody').append(
            $(util.buildTree(ttTools.views.users.rowForUser(room.users[uid])))
          );
        }
      });

      room.downvoters.sort(nameAlpha);
      $(room.downvoters).each(function (index, uid) {
        if (room.users[uid]) {
          usersList.find('tbody').append(
            $(util.buildTree(ttTools.views.users.rowForUser(room.users[uid])))
          );
        }
      });

      var users = Object.keys(room.users).sort(nameAlpha);
      $(users).each(function (index, uid) {
        var currentDj = uid == room.currentDj;
        var upvoter = $.inArray(uid, room.upvoters) > -1;
        var downvoter = $.inArray(uid, room.downvoters) > -1;
        if (!currentDj && !upvoter && !downvoter) {
          usersList.find('tbody').append(
            $(util.buildTree(ttTools.views.users.rowForUser(room.users[uid])))
          );
        }
      });
    },

    rowForUser : function (user) {
      var room = ttTools.getRoom();
      var dj = $.inArray(user.userid, room.djIds) > -1 ? ['div', { 'class':'ui-icon ui-icon-volume-on' }] : null;
      var mod = $.inArray(user.userid, room.moderators) > -1 ? ['div', { 'class':'ui-icon ui-icon-alert' }] : null;
      var state = user.userid == room.currentDj ? 'currentDj' : '';
      state += $.inArray(user.userid, room.upvoters) > -1 ? 'upvoter' : '';
      state += $.inArray(user.userid, room.downvoters) > -1 ? 'downvoter' : '';
      return ['tr', { 'class' : state },
        ['td', {
          'class' : 'user',
          event : {
            click : function (e) {
              ttTools.getRoomManager().toggle_listener(user.userid)
            }
          }
        }, mod, dj, user.name],
        ['td', { 'class' : 'time' }, this.timestamp(ttTools.userActivityLog[user.userid].message)],
        ['td', { 'class' : 'time' }, this.timestamp(ttTools.userActivityLog[user.userid].vote)]
      ];
    },

    timestamp : function (time) {
      var date = new Date(util.now() - time);
      var mins = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
      var secs = date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds();
      return date.getUTCHours() + ':' + mins + ':' + secs;
    }
  },

  chat : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
        .message.marker {\
          border-bottom:1px solid #00f;\
          background-color:#D2E6FC !important;\
        }\
      "}).appendTo($(document.head));
      this.update();
    },

    update : function () {
      $('.messages .message').unbind('click').click(function (e) {
        var element = $(this);
        element.toggleClass('marker');
      });
    }
  }
}
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
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files);
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
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(playlist);
    }, function (tx, result) {
      turntable.showAlert("Attempted to export your tags with your songs, but it failed. Sorry :/ Here's a regular export.");
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files);
    });
  },

  exportSongsWithTags : function (tags) {
    if (tags.length < 2 && tags[0] == '') {
      return turntable.showAlert('No tags specified', ttTools.views.settings.render);
    }
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
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(playlist);
    });
  }
}
ttTools.portability.views = {

  import : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
        .mainPane.noBG { background-color:transparent; }\
        .import {\
          top:0;\
          left:0;\
          right:0;\
          bottom:0;\
          color:#fff;\
          text-align:center;\
          padding:30px 10px;\
          position:absolute;\
          background-color:#000;\
          border:2px dashed #fff;\
          opacity:0.8;\
          filter:Alpha(Opacity=80);\
        }\
      "}).appendTo($(document.body));

      var playlist = $('#playlist');
      var dropZone = $('<div/>', {
        id      : 'importDropZone',
        'class' : 'import'
      }).html(
        'Drop ttTools playlist file here to import.'
      );
      var dropZoneContainer = $('<div/>', {
        id      : 'dropZoneContainer',
        'class' : 'mainPane noBG'
      }).append(
        dropZone
      ).hide().appendTo(playlist);
      var importProgressContainer = $('<div/>', {
        id      : 'importProgressContainer',
        'class' : 'mainPane noBG'
      }).append(
        $('<div/>', {
          id      : 'importProgress',
          'class' : 'import'
        }).html(
          "Processing..."
        ).append(
          $('<div/>', {
            id : 'importProgressBar'
          }).progressbar()
        ).append(
          '<span id="importCount">0</span> of <span id="importTotal">0</span>'
        ).append(
          '<br/><br/>Yep, it\'s super slow. Want to help make it faster? Click the ? feedback icon above your DJ queue and send the message:<br /><br/>"I <3 ttTools! Please add batch fid support for the playlist.add API method!"'
        )
      ).hide().appendTo(playlist);

      playlist.get(0).addEventListener('dragenter', function (e) {
        dropZoneContainer.show();
      });
      dropZone.get(0).addEventListener('dragleave', function (e) {
        dropZoneContainer.hide();
      });
      dropZone.get(0).addEventListener('dragover', function (e) {
        e.preventDefault();
      });
      dropZone.get(0).addEventListener('drop', function (e) {
        dropZoneContainer.hide();
        importProgressContainer.show();
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          var reader = new FileReader();
          reader.onload = function () {
            ttTools.portability.importPlaylist(JSON.parse(this.result));
          }
          reader.readAsText(e.dataTransfer.files[i], 'utf-8');
        }
      });
    },

    update : function () {
      var total = ttTools.portability.importProcess.operations.length;
      var completed = ttTools.portability.importProcess.completed;
      $('#importTotal').html(total);
      $('#importCount').html(completed);
      $('#importProgressBar').progressbar('option', 'value', (completed / total) * 100);
      if (completed == total) {
        if (ttTools.database.isSupported()) {
          ttTools.tags.updateQueue();
          ttTools.tags.addSongOverride();
        }
        $('#importProgressContainer').hide();
      }
    }
  }
  
}
ttTools.database = {

  dbName        : 'ttTools.database',
  dbDisplayName : 'ttTools Database',
  dbVersion     : '1.0',
  dbMaxSize     : 10000000,
  dbHandle      : false,

  isSupported : function () {
    return window.openDatabase ? true : false;
  },

  getDatabase : function () {
    if (this.dbHandle) { return this.dbHandle; }
    this.dbHandle = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbMaxSize);
    return this.dbHandle;
  },

  execute : function (query, success, failure) {
    console.log(query);
    this.getDatabase().transaction(  
      function (transaction) {
        transaction.executeSql(query, [], success, failure);
      }
    );
  }
}
ttTools.tags = {

  dbTable : 'tags',

  loadRetry : 30,
  load : function (retry) {
    if (!turntable.playlist
      || turntable.playlist.files == 0
    ) {
      if (retry > ttTools.tags.loadRetry) { return alert('Could not load ttTools tagging.'); }
      var callback = function () { ttTools.tags.load(retry++); }
      return setTimeout(callback, 1000);
    }
    ttTools.tags.init();
  },

  init : function () {
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
      div.song div.ui-icon-tag {\
        top: 24px;\
        right: 5px;\
        width: 16px;\
        height: 16px;\
        cursor: pointer;\
        position: absolute;\
      }\
    "}).appendTo(document.head);
    $.getScript('https://raw.github.com/xoxco/jQuery-Tags-Input/master/jquery.tagsinput.min.js', function() {
      ttTools.tags.createTable();
      ttTools.tags.updateQueue();
      ttTools.tags.addSongOverride();
      ttTools.tags.filterQueueOverride();
      ttTools.tags.views.menu.render();
    });
  },

  updateQueue : function () {
    var elements = $('div.song').unbind(
      'click'
    ).click(function(e) {
      ttTools.tags.views.add.file = $(this).closest('.song').data('songData');
      ttTools.tags.views.add.render();
    });
    $('div.song div.ui-icon-tag').remove();
    this.getFids(function (tx, result) {
      var fids = [];
      for (var i=0; i<result.rows.length; i++) {
        fids.push(result.rows.item(i).fid);
      }
      elements.each(function (index, element) {
        element = $(element);
        var fid = element.closest('.song').data('songData').fileId;
        if ($.inArray(fid, fids) > -1) {
          $('<div/>', {
            'class' : 'ui-icon ui-icon-tag',
            title   : 'This song is ttTagged'
          }).appendTo(element);
        }
      });
    });
  },

  addSongOverride : function () {
    turntable.playlist.addSongFunc = turntable.playlist.addSong;
    turntable.playlist.addSong = function (b, a) {
      turntable.playlist.addSongFunc(b, a);
      ttTools.tags.updateQueue();
    }
  },

  filterQueueOverride : function () {
    turntable.playlist.filterQueueFunc = turntable.playlist.filterQueue;
    turntable.playlist.filterQueue = function (filter) {
      turntable.playlist.filterQueueFunc(filter);
      if (filter.length > 0) {
        ttTools.tags.getFidsForTagLike(
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
    ttTools.tags.updateQueue();
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
ttTools.tags.views = {

  add : {
    file : null,

    render : function () {
      util.showOverlay(util.buildTree(this.tree()));
      var file = this.file;

      ttTools.tags.getAll(function (tx, result) {
        var tags = {};
        for (var i=0; i<result.rows.length; i++) { tags[result.rows.item(i).tag] = 1; }
        var tags = Object.keys(tags);
        $('#tags').tagsInput({
          width            : '100%',
          onAddTag         : function (tag) {
            ttTools.tags.addTag(file.fileId, tag);
          },
          onRemoveTag      : function (tag) {
            ttTools.tags.removeTag(file.fileId, tag);
          },
          autocomplete_url : false,
          autocomplete     : {
            source : tags
          }
        });
      });

      ttTools.tags.getTagsForFid(
        this.file.fileId,
        function (tx, result) {
          for (var i=0; i<result.rows.length; i++) {
            $('#tags').addTag(result.rows.item(i).tag, {
              callback : false
            });
          }
        }
      );
    },

    tree : function () {
      return ['div.settingsOverlay.modal', {},
        ['div.close-x', {
          event : {
            click : function () {
              util.hideOverlay();
              ttTools.tags.updateQueue();
            }
          }
        }],
        ['br'],
        ['h1', this.file.metadata.song],
        ['div', {}, this.file.metadata.artist],
        ['br'],
        ['input#tags', { type : 'text' }]
      ];
    }
  },

  menu : {
    render : function () {
      $('<div class="menuItem">Tagging & Export</div>').click(function (e) {
        ttTools.tags.views.settings.render();
      }).insertBefore($('div#menuh').children().last());
    }
  },

  settings : {
    render : function () {
      util.showOverlay(util.buildTree(this.tree()));

      $('<style/>', {
        type : 'text/css',
        text : "div.field.tagexport { padding-right:20px; }"
      }).appendTo($('div.tagsOverlay.modal'));
      
      ttTools.tags.getAll(function (tx, result) {
        var tags = {};
        for (var i=0; i<result.rows.length; i++) { tags[result.rows.item(i).tag] = 1; }
        var tags = Object.keys(tags);
        $('#tagExport').tagsInput({
          width            : '100%',
          autocomplete_url : false,
          autocomplete     : {
            source : tags
          }
        });
      });

      $('#tagExportButton').button().click(function (e) {
        var tags = $('#tagExport').val().split(',');
        ttTools.portability.exportSongsWithTags(tags);
      });

      $('#resetTags').click(function() {
        if (!confirm('Are you sure? This will delete your entire tags database.')) { return false; }
        ttTools.tags.resetData();
      });
    },

    tree : function () {
      return ['div.tagsOverlay.modal', {},
        ['div.close-x', {
          event : {
            click : util.hideOverlay
          }
        }],
        ['h1', 'Tags & Export'],
        ['br'],
        ['div.fields', {},
          ['div.field.tagexport', {},
            ['div', {}, 'Export songs with specific tags:'],
            ['input#tagExport', { type : 'text' }],
            ['button#tagExportButton', 'Export']
          ]
        ],
        ['a#resetTags', { href : 'javascript:void(0);' }, 'Reset Tags Database']
      ];
    }
  }
}
ttTools.load(0);
ttTools.release = '1324676845';
