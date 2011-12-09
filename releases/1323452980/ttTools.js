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
ttTools.views = {

  menu : {
    render : function () {
      $('<div class="menuItem">ttTools Settings</div>').click(function (e) {
        ttTools.views.settings.render();
      }).insertBefore($('div#menuh').children().last());
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
          height:20px !important;\
          padding-top:7px !important;\
          background-color:#CCC !important;\
        }\
        div.songlist {\
          font-size:0.5em;\
          top:95px !important;\
        }\
        #playlistTools {\
          left:4px;\
          top:65px;\
          height:2em;\
          padding:2px 0;\
          position:absolute;\
        }\
        #playlistTools label {\
          font-size:10px;\
          text-shadow:none;\
        }\
        #playlistTools div, #playlistTools button { float:left; }\
        #playlistTools button { width:20px; }\
        #playlistTools button .ui-button-text { padding:11px; }\
        #playlistTools #switches ui-button-text { padding:.4em; }\
      "}).appendTo(document.head);

      $(util.buildTree(this.tree())).insertAfter(
        $('form.playlistSearch')
      );

      $('#switches').buttonset();

      $('#autoDJ').click(function (e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        ttTools.autoDJ = !ttTools.autoDJ;
        if(ttTools.autoDJ && !room.isDj() && room.djIds.length < room.maxDjs) {
          room.becomeDj();
        }
      }).prop('checked', ttTools.autoDJ).button('refresh');

      $('#autoAwesome').click(function (e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        ttTools.autoAwesome = !ttTools.autoAwesome;
        if(ttTools.autoAwesome) {
          turntable.whenSocketConnected(function () {
            room.connectRoomSocket('up');
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
      }).click(function (e){
        var room = ttTools.getRoom();
        if (!room) { return false; }
        var roomManager = ttTools.getRoomManager(room);
        if (!roomManager) { return false; }
        var maxOffset = 200 * Object.keys(room.users).length;
        for (user in room.users) {
          setTimeout(function (user) {
            roomManager.show_heart(user);
          }, Math.round(Math.random() * maxOffset), user)
        }
      });

      $('#playlistInvert').button({
        text  : false,
        icons : {
          primary: 'ui-icon-transfer-e-w'
        }
      }).click(function (e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        if (room.currentDj == room.selfId) {
          turntable.showAlert("Sorry, can't sort queue while DJing.");
          return false;
        }
        turntable.playlist.updatePlaylist(turntable.playlist.files.reverse());
        turntable.playlist.updateTopSongClass();
      });

      $('#playlistRandomize').button({
        text  : false,
        icons : {
          primary: 'ui-icon-shuffle'
        }
      }).click(function (e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        if (room.currentDj == room.selfId) {
          turntable.showAlert("Sorry, can't sort queue while DJing.");
          return false;
        }
        turntable.playlist.updatePlaylist(ttTools.shuffle(turntable.playlist.files), false);
        turntable.playlist.updateTopSongClass();
      });

      $('#exportQueue').button({
        text  : false,
        icons : {
          primary : 'ui-icon-arrowthick-1-s'
        }
      }).click(function (e) {
        util.hideOverlay();
        ttTools.exportPlaylist();
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
        ['button#playlistInvert', { title : 'Flip Playlist' }],
        ['button#playlistRandomize', { title : 'Shuffle Playlist' }],
        ['button#exportQueue', { title : 'Export Playlist' }]
      ];
    }
  },

  settings : {
    render : function () {
      util.showOverlay(util.buildTree(this.tree()));

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
        ['h1', 'ttTools Settings'],
        ['div', {}, ttTools.version],
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
            ttTools.importPlaylist(JSON.parse(this.result));
          }
          reader.readAsText(e.dataTransfer.files[i], 'utf-8');
        }
      });
    },

    update : function () {
      var total = ttTools.importOperations.length;
      var completed = ttTools.importOperationsCompleted;
      $('#importTotal').html(total);
      $('#importCount').html(completed);
      $('#importProgressBar').progressbar('option', 'value', (completed / total) * 100);
      if (completed == total) {
        if (window.openDatabase) {
          ttTools.tags.updateQueue();
          ttTools.tags.addSongOverride();
        }
        $('#importProgressContainer').hide();
      }
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
        #usersList .upvoter { background-color:#aea; }\
        #usersList .downvoter { background-color:#eaa; }\
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

      var room = ttTools.getRoom();
      if (!room) { return; }

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

      var usersList = $('#usersList').html($('<tbody/>'));

      $(room.upvoters).each(function (index, uid) {
        $('<tr/>').addClass('upvoter').append(
          $('<td/>').html(room.users[uid].name)
        ).appendTo(usersList.find('tbody'));
      });

      $(room.downvoters).each(function (index, uid) {
        if (room.users[uid]) {
          $('<tr/>').addClass('downvoter').append(
             $('<td/>').html(room.users[uid].name)
          ).appendTo(usersList.find('tbody'));
        } else {
          console.dir('Could not find user ' + uid);
        }
      });

      for (var user in room.users) {
        user = room.users[user];
        var upvoter = $.inArray(user.userid, room.upvoters) > -1;
        var downvoter = $.inArray(user.userid, room.downvoters) > -1;
        if (!upvoter && !downvoter) {
          $('<tr/>').append(
            $('<td/>', {
              id : user.userid
            }).html(user.name)
          ).appendTo(usersList.find('tbody'));
        }
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
    $.getScript('https://raw.github.com/xoxco/jQuery-Tags-Input/73c60604f83f7a713d3e79cfb3bd43de95553d23/jquery.tagsinput.min.js', function() {
      ttTools.tags.createTable();
      ttTools.tags.updateQueue();
      ttTools.tags.addSongOverride();
      ttTools.tags.filterQueueOverride();
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
  },

  getTagsForFid : function (fid, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT tag FROM ' + this.dbTable + ' WHERE fid="' + fid + '";',
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

  getFidsForTagLike : function (tag, success, failure) {
    return ttTools.database.execute(
      'SELECT DISTINCT fid FROM ' + this.dbTable + ' WHERE tag LIKE "%' + tag + '%";',
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
      $('#tags').tagsInput({
        width       : '100%',
        onAddTag    : function (tag) {
          ttTools.tags.addTag(file.fileId, tag);
        },
        onRemoveTag : function (tag) {
          ttTools.tags.removeTag(file.fileId, tag);
        }
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

      $('#resetTags').click(function() {
        if (!confirm('Are you sure? This will delete your entire tags database.')) { return false; }
        ttTools.tags.resetData();
      });
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
        ['input#tags', { type : 'text' }],
        ['br'],
        ['a#resetTags', { href : 'javascript:void(0);' }, 'Reset Tags Database']
      ];
    }
  }
}
ttTools.init();
ttTools.version = 1323452980;
