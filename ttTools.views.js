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
