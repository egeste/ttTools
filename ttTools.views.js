ttTools.views = {

  menu : {
    render : function () {
      $('<div class="menuItem">ttTools Settings</div>').click(function (e) {
        ttTools.views.settings.render();
      }).insertBefore($('div#menuh').children().last());
    }
  },

  toolbar : {
    render : function() {
      turntable.playlist.setPlaylistHeightFunc = turntable.playlist.setPlaylistHeight;
      turntable.playlist.setPlaylistHeight = function (a) {
        a = this.setPlaylistHeightFunc(a);
        $(turntable.playlist.nodes.root).find(".queueView .songlist").css({
            height: Math.max(a - 120, 55)
        });
        return a;
      }

      ttTools.views.addStyle("\
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
          left:5px;\
          right:2px;\
          top:65px;\
          height:2em;\
          padding:2px 0;\
          text-align:right;\
          position:absolute;\
        }\
        #playlistTools #switches {\
          float:left;\
        }\
        #playlistTools label {\
          font-size:10px;\
          text-shadow:none;\
        }\
        #playlistTools button {\
          width:22px;\
          margin:0 3px 0 0;\
        }\
        #playlistTools button .ui-button-text {\
          padding:11px;\
        }\
      ");

      $(util.buildTree(ttTools.views.toolbar.tree())).insertAfter(
        $('form.playlistSearch')
      );

      $('#switches').buttonset();

      $('#autoDJ').click(function() {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        ttTools.autoDJ = !ttTools.autoDJ;
        if(ttTools.autoDJ && !room.isDj() && room.djIds.length < room.maxDjs) {
          room.becomeDj();
        }
      }).prop('checked', ttTools.autoDJ).button('refresh');

      $('#autoAwesome').click(function() {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        ttTools.autoAwesome = !ttTools.autoAwesome;
        if(ttTools.autoAwesome) {
          turntable.whenSocketConnected(function() {
            room.connectRoomSocket('up');
          });
        }
      }).prop('checked', ttTools.autoAwesome).button('refresh');

      $('#showTheLove').button({
        text : false,
        icons: {
          primary: 'ui-icon-heart'
        }
      }).click(function(){
        var room = ttTools.getRoom();
        if (!room) { return false; }
        var core = ttTools.getCore(room);
        if (!core) { return false; }
        for (user in room.users) {
          core.show_heart(user);
        }
      });

      $('#playlistInvert').button({
        text : false,
        icons: {
          primary: 'ui-icon-transfer-e-w'
        }
      }).click(function(e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        if (room.currentDj == room.selfId) {
          turntable.showAlert("Sorry, can't sort queue while DJing.");
          return false;
        }
        turntable.playlist.files.reverse();
        turntable.playlist.updatePlaylist();
      });

      $('#playlistRandomize').button({
        text : false,
        icons: {
          primary: 'ui-icon-shuffle'
        }
      }).click(function(e) {
        var room = ttTools.getRoom();
        if (!room) { return false; }
        if (room.currentDj == room.selfId) {
          turntable.showAlert("Sorry, can't sort queue while DJing.");
          return false;
        }
        turntable.playlist.files.shuffle();
        turntable.playlist.updatePlaylist();
      });

      $('#hackSettings').button({
        text : false,
        icons: {
          primary: 'ui-icon-wrench'
        }
      }).click(ttTools.views.settings.render);
    },

    tree : function() {
      return ['div#playlistTools', {},
        ['div#switches', {},
          ['input#autoDJ.ui-icon.ui-icon-person', { type : 'checkbox', title: 'Auto DJ' }],
          ['label', { 'for' : 'autoDJ' }, 'DJ Next'],
          ['input#autoAwesome', { type : 'checkbox', title: 'Auto Awesome' }],
          ['label', { 'for' : 'autoAwesome' }, 'Up-Vote'],
        ],
        ['button#showTheLove', { title: 'Show The Love' }],
        ['button#playlistInvert', { title : 'Flip Playlist' }],
        ['button#playlistRandomize', { title : 'Shuffle Playlist' }],
        ['button#hackSettings', { title : 'Hack Settings' }],
      ];
    }
  },

  download_button : {
    render : function () {
      $('div.btn.rdio').remove();
      ttTools.views.addStyle("\
        #download_song {\
          float:left;\
          margin:7px;\
          width:48px;\
          height:48px;\
          cursor:pointer;\
          background-position:left top;\
          background-image:url(http://iconlet.com/download_48x48_/crystalsvg/48x48/download_manager.png);\
        }\
        #download_song:hover {\
          text-decoration:none;\
        }\
      ");
      $('<a/>', {
        id     : 'download_song',
        href   : ttTools.views.getDownloadUrl(),
        target : '_blank'
      }).click(function() {
        $(this).attr('href', ttTools.views.getDownloadUrl());
      }).appendTo($('#songboard_add'));
    }
  },

  settings : {
    render : function () {
      util.showOverlay(util.buildTree(ttTools.views.settings.tree()));
      ttTools.views.addStyle("\
        div.field.settings {\
          padding:10px 20px;\
        }\
        div.field.settings .ui-slider {\
          height:0.5em;\
          margin:10px 0 3px;\
        }\
        div.field.settings .ui-slider .ui-slider-handle {\
          width:0.9em;\
          height:0.9em;\
        }\
        #autoDJDisplay, #autoAwesomeDisplay { text-align:center; }\
      ");

      $('#autoDJDelay').slider({
        max   : 5000,
        min   : 0,
        step  : 100,
        value : ttTools.autoDJDelay,
        slide : function(event, ui) {
          ttTools.autoDJDelay = ui.value;
          $('#autoDJDisplay').text(ui.value/1000 + ' s');
        }
      });
      $('#autoAwesomeDelay').slider({
        max   : 60000,
        min   : 0,
        step  : 1000,
        value : ttTools.autoAwesomeDelay,
        slide : function(event, ui) {
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
        ['h1', 'egeste@egeste.net'],
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

  addStyle : function (style) {
    $('<style/>', {
      type : 'text/css',
      text : style
    }).appendTo(document.head);
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

  import : {
    render : function () {
      util.showOverlay(util.buildTree(ttTools.views.settings.tree()));
      $('#importDropZone').bind('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }).bind('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          console.dir(e.dataTransfer.files[i]);
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
        ['div#importDropZone', {}, 'Drag drag playlist file here to import']
      ];
    }
  }

}