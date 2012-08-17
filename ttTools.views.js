ttTools.views = {

  // Dialogs
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
      $('div.settingsOverlay.modal')
        .append(ttTools.constants.submitIssue())
        .append(ttTools.constants.donateButton());

      $('<style/>', {
        type : 'text/css',
        text : "\
div.settingsOverlay {\
  width:400px !important;\
  margin-top:15px !important;\
  padding:20px 20px 0 !important;\
}\
div.settingsOverlay .ui-slider {\
  height:0.5em;\
  margin:10px 0 3px;\
}\
div.settingsOverlay .ui-slider .ui-slider-handle {\
  width:0.9em;\
  height:0.9em;\
}\
div#idleIndicatorDisplay, div#autoDJDisplay, div#autoVoteDisplay { text-align:center; }\
      "}).appendTo($('div.settingsOverlay.modal'));

      $('div#autoSongDrop').slider({
        min   : 0,
        max   : 20,
        step  : 1,
        value : ttTools.autoSongDrop.threshold(),
        slide : function (event, ui) {
          ttTools.autoSongDrop.setThreshold(ui.value);
          $('div#autoSongDropDisplay').text(ui.value + ' songs');
        }
      });

      $('div#idleIndicatorThreshold').slider({
        min   : 10 * ttTools.constants.time.minutes,
        max   : 60 * ttTools.constants.time.minutes,
        step  : ttTools.constants.time.minutes,
        value : ttTools.idleIndicator.threshold(),
        slide : function (event, ui) {
          ttTools.idleIndicator.setThreshold(ui.value);
          $('div#idleIndicatorDisplay').text((ui.value / ttTools.constants.time.minutes) + 'm');
        }
      });

      $('div#autoDJDelay').slider({
        min   : 0.5 * ttTools.constants.time.seconds,
        max   : 25 * ttTools.constants.time.seconds,
        step  : ttTools.constants.time.seconds / 10, // Tenths of a second
        value : ttTools.autoDJ.delay(),
        slide : function (event, ui) {
          ttTools.autoDJ.setDelay(ui.value)
          $('div#autoDJDisplay').text((ui.value / ttTools.constants.time.seconds) + 's');
        }
      });

      $('div#autoVoteDelay').slider({
        min   : 0,
        max   : 60 * ttTools.constants.time.seconds,
        step  : ttTools.constants.time.seconds,
        value : ttTools.autoVote.delay(),
        slide : function (event, ui) {
          ttTools.autoVote.setDelay(ui.value);
          $('div#autoVoteDisplay').text((ui.value / ttTools.constants.time.seconds) + 's');
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
        ['div', {}, 'Released: ' + ttTools.release.toUTCString()],
        ['br'],
        ['div', {},
          ['span', {}, 'Auto Song-Drop Threshold '],
          ['a', { href: 'http://tttools.egeste.net/features/extras#auto-drop-song', target: '_blank' }, '[?]']
        ],
        ['div#autoSongDrop', {}],
        ['div#autoSongDropDisplay', {}, ttTools.autoSongDrop.threshold() + ' songs'],
        ['br'],
        ['div', {},
          ['span', {}, 'Idle Indicator Threshold '],
          ['a', { href: 'http://tttools.egeste.net/tutorials/understanding-the-idle-indicators', target: '_blank' }, '   [?]']
        ],
        ['div#idleIndicatorThreshold', {}],
        ['div#idleIndicatorDisplay', {}, (ttTools.idleIndicator.threshold() / ttTools.constants.time.minutes) + 'm'],
        ['br'],
        ['div', {}, 'Auto DJ Delay'],
        ['div#autoDJDelay', {}],
        ['div#autoDJDisplay', {}, (ttTools.autoDJ.delay() / ttTools.constants.time.seconds) + 's'],
        ['br'],
        ['div', {}, 'Auto Vote Delay'],
        ['div#autoVoteDelay', {}],
        ['div#autoVoteDisplay', {}, (ttTools.autoVote.delay() / ttTools.constants.time.seconds) + 's'],
        ['br'],
      ];
    }
  },

  info : {
    render : function () {
      turntable.showAlert();
      $('<style/>', {
        type : 'text/css',
        text : "\
div.modal { margin-top:15px !important; }\
div.modal ul li {\
  font-size:16px;\
  text-align:left;\
}\
      "}).appendTo($('div.modal'));
      $('div.modal div:first')
        .html('')
        .append(ttTools.constants.whatsNew())
        .append(ttTools.constants.submitIssue())
        .append(ttTools.constants.donateButton());
    }
  },

  // UI stuff
  toolbar : {
    render : function () {
      turntable.playlist.setPlaylistHeight($('div.chat-container').css('top').replace('px', ''));

      $('<style/>', {
        type : 'text/css',
        text : "\
div.queueView div.songlist { top:95px !important; }\
div.queueView div.resultsLabel {\
  top:65px !important;\
  height:20px !important;\
  padding-top:7px !important;\
  background-color:#CCC !important;\
}\
div#playlistTools {\
  left:0;\
  right:0;\
  top:65px;\
  height:2em;\
  padding:2px 0;\
  position:absolute;\
}\
div#playlistTools div { float:left; }\
div#playlistTools label { font-size:5px; }\
div#playlistTools div#buttons { margin:0 12px; }\
div#playlistTools div#buttons .ui-button-text { padding:2px 3px; }\
div#playlistTools div#buttons button { width:auto; height:auto; margin-right:-1px; }\
div#playlistTools div#buttons button .ui-button-text { padding:10px 11px; }\
div#playlistTools .custom-icons { background:url(" + ttTools.resources.customIcons + "); }\
div#playlistTools .custom-icons.youtube { background-position:0 0; }\
div#playlistTools .custom-icons.dice { background-position:17px 0; }\
div#playlistTools .custom-icons.soundcloud { background-position:34px 0; }\
      "}).appendTo(document.head);

      $(util.buildTree(this.tree())).insertAfter(
        $('form.song-search')
      );

      $('div#buttons').buttonset();

      $('input#autoAwesome').click(function (e) {
        if (ttTools.autoVote.enabled() !== 'up') ttTools.autoVote.setEnabled('up');
        else ttTools.autoVote.setEnabled('false');
        ttTools.views.toolbar.update();
        ttTools.autoVote.execute();
      }).prop('checked', ttTools.autoVote.enabled() === 'up').button('refresh');

      $('input#autoLame').click(function (e) {
        if (ttTools.autoVote.enabled() !== 'down') ttTools.autoVote.setEnabled('down');
        else ttTools.autoVote.setEnabled('false');
        ttTools.views.toolbar.update();
        ttTools.autoVote.execute();
      }).prop('checked', ttTools.autoVote.enabled() === 'down').button('refresh');

      $('input#autoDJ').click(function (e) {
        ttTools.autoDJ.setEnabled(!ttTools.autoDJ.enabled());
        ttTools.autoDJ.execute();
      }).prop('checked', ttTools.autoDJ.enabled()).button('refresh');

      $('input#animations').click(function (e) {
        ttTools.animations.setEnabled(!ttTools.animations.enabled());
      }).prop('checked', ttTools.animations.enabled()).button('refresh');      

      $('button#youtube')
        .button({
          text  : false,
          icons : {
            primary: 'custom-icons youtube'
          }
        })
        .click(function (e) {
          if (!ttObjects.room.currentSong) return;
          var metadata = ttObjects.room.currentSong.metadata;
          var uri = 'http://www.youtube.com/results?search_query=';
          uri += encodeURIComponent(metadata.artist + ' - ' + metadata.song);
          window.open(uri, '_blank');
        });

      $('button#soundcloud').button({
        text  : false,
        icons : {
          primary: 'custom-icons soundcloud'
        }
      }).click(function (e) {
        if (!ttObjects.room.currentSong) return;
        var metadata = ttObjects.room.currentSong.metadata;
        var uri = 'http://soundcloud.com/search?q[fulltext]=';
        uri += encodeURIComponent(metadata.artist + ' - ' + metadata.song);
        window.open(uri, '_blank');
      });

      $('button#casinoRoll').button({
        text  : false,
        icons : {
          primary: 'custom-icons dice'
        }
      }).click(function (e) {
        $('div.chat-container form input')
          .val('roll')
          .parent()
          .submit();
      });

      $('button#showTheLove').button({
        text  : false,
        icons : {
          primary: 'ui-icon-heart'
        }
      }).click(function (e) {
        var maxOffset = 200 * Object.keys(ttObjects.room.users).length;
        for (user in ttObjects.room.users) {
          setTimeout(function (user) {
            ttObjects.manager.show_heart(user);
          }, Math.round(Math.random() * maxOffset), user);
        }
      });

      $('button#importExport').button({
        text  : false,
        icons : {
          primary : 'ui-icon-transferthick-e-w'
        }
      }).click(function (e) {
        ttTools.portability.views.modal.render();
      });
    },

    tree : function () {
      return ['div#playlistTools', {},
        ['div#buttons', {},
          ['input#autoAwesome', { type : 'checkbox' }],
          ['label', { 'for' : 'autoAwesome' },
            ['span.ui-icon.ui-icon-circle-arrow-n', { title: 'Automatically upvote songs' }],
          ],
          /*['input#autoLame', { type : 'checkbox' }],
          ['label', { 'for' : 'autoLame' },
            ['span.ui-icon.ui-icon-circle-arrow-s', { title: 'Automatically downvote songs' }],
          ],*/
          ['input#autoDJ', { type : 'checkbox' }],
          ['label', { 'for' : 'autoDJ' },
            ['span.ui-icon.ui-icon-person', { title: 'Attempt to get the next DJ spot' }],
          ],/*
          ['input#animations', { type : 'checkbox' }],
          ['label', { 'for' : 'animations' },
            ['span.ui-icon.ui-icon-video', { title: 'Toggle animations on/off' }]
          ],*/
          /*['button#youtube', { title: 'Search YouTube' }],
          ['button#soundcloud', { title: 'Search SoundCloud' }],
          */
          ['button#casinoRoll', { title: 'Roll for a spot (casino mode)' }],
          /*['button#showTheLove', { title: 'Show The Love' }],
          */
          ['button#importExport', { title: 'Import/Export' }]
        ]
      ];
    },

    update : function () {
      $('#autoDJ').prop('checked', ttTools.autoDJ.enabled()).button('refresh');
      $('#autoAwesome').prop('checked', ttTools.autoVote.enabled() === 'up').button('refresh');
      //$('#autoLame').prop('checked', ttTools.autoVote.enabled() === 'down').button('refresh');
    }
  },

  users : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
div.guest.upvoter { background-color:#aea !important;}\
div.guest.upvoter:hover { background-color:#cec !important; }\
div.guest.downvoter { background-color:#eaa !important; }\
div.guest.downvoter:hover { background-color:#ecc !important; }\
div.guest.current_dj { background-color:#ccf !important; }\
div.guest.current_dj:hover { background-color:#ddf !important; }\
div.guestName .emoji { padding:3px 0; margin-left:3px; }\
div.guestName .status {\
  padding:0 7px;\
  margin:0 3px 0 -3px;\
  background-image:url('https://s3.amazonaws.com/static.turntable.fm/images/pm/status_indicators_depth.png');\
}\
div.guestName .status.green { background-position:0 0; }\
div.guestName .status.yellow { background-position:0 -13px; }\
div.guestName .status.grey { background-position:0 -26px; }\
div.guestName .status.red { background-position:0 -39px; }\
div#voteCount {\
  position:absolute;\
  top:3px;\
  right:20px;\
  font-size:12px;\
  text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;\
}\
div#voteCount span.up { color:#aea; }\
div#voteCount span.down { color:#eaa; }\
div.guestButton {\
  width: 35px;\
  height: 36px;\
  cursor: pointer;\
  background:none;\
  position: absolute;\
  border: 0;\
  border-left: 1px solid #D0D0D0;\
  border-right: 1px solid #7B7B7B;\
}\
div.guestButton.popout { left: 36px; }\
div.ui-icon { margin:10px; }\
div.guestListSize {\
  left:73px !important;\
  width:157px !important;\
  font-size:11px !important;\
}\
div#guestDialog { padding:0; }\
div#guestDialog div.guest-list-container {\
  top:auto !important;\
  height:auto !important;\
  position:relative;\
}\
div#guestDialog div.guest-list-container div.guests {\
  top:0;\
  height:auto !important;\
  overflow:hidden;\
  background:none;\
  position:relative;\
}\
      "}).appendTo(document.head);
      $('<div/>', { id : 'guestDialog' }).appendTo(document.body);
      this.setupDialog();
    },

    setupDialog : function () {
      $('div#guestDialog')
        .dialog({
          width : 285,
          height : 350,
          title : ' people are in this room',
          autoOpen : false,
          open : function (e, ui) {
            $('div.chat-container div.guestListButton').hide();
            $('div.chat-container div.guestButton').show();
            $('div.guest-list-container').appendTo(this);
            $('div.guest-list-container div.chatBar').hide();
            $('div.guest-list-container div.chatHeader').hide();
            $('div#guestDialog')
              .prev()
              .find('span:first')
              .prepend($('span#totalUsers'));
          },
          close : function (e, ui) {
            $('div.chat-container div.guestListButton').show();
            $('div.chat-container div.guestButton').hide();
            $('div.guest-list-container').appendTo($('div#right-panel'));
            $('div.guest-list-container div.chatBar').show();
            $('div.guest-list-container div.chatHeader').show();
            $('span#totalUsers').prependTo('div.guestListSize');
          }
        });
    },

    update : function () {
      ttTools.views.users.updateVoteCount();
      $('div.guests .guest').each(function (index, element) {
        ttTools.views.users.updateUser(element.id);
      });
    },

    modifyContainer : function () {
      $('<div/>', { id : 'voteCount' }).appendTo($('div.chatHeader'));
      $('div.guest-list-container div.guestListButton')
        .after($('<div/>', { 'class' : 'guestButton ui-state-default popout' })
            .append($('<div/>', { 'class' : 'ui-icon ui-icon-newwin' }))
            .bind('click', function (e) {
              $('div#guestDialog').dialog('open');
            })
        );
      $('div.chat-container div.guestListButton')
        .after($('<div/>', { 'class' : 'guestButton ui-state-default', style : 'border-left:0;' })
            .hide()
            .append($('<div/>', { 'class' : 'ui-icon ui-icon-pin-w' }))
            .bind('click', function (e) {
              $('div#guestDialog').dialog('close');
            })
        );
    },

    updateVoteCount : function () {
      $('div#voteCount')
        .html('')
        .append(util.emojify(':thumbsup:'))
        .append($('<span/>', { 'class':'up' }).html(ttObjects.room.upvoters.length))
        .append('&nbsp;&nbsp;&nbsp;')
        .append(util.emojify(':thumbsdown:'))
        .append($('<span/>', { 'class':'down' }).html(ttTools.downVotes.downvotes))
    },

    updateUser : function (uid) {
      var guest = $('div#' + uid);
      var guestName = guest.find('div.guestName');
      var user = ttObjects.room.users[uid];

      guest.find('span').remove();
      guest.attr('class', 'guest');

      if (uid === ttObjects.room.currentDj) guest.addClass('current_dj');
      if ($.inArray(uid, ttObjects.room.upvoters) > -1) guest.addClass('upvoter');
      if ($.inArray(uid, ttTools.downVotes.downvoters) > -1) guest.addClass('downvoter');

      guestName.prepend(
        $('<span/>')
          .addClass('status')
          .addClass(ttTools.views.users.userStatus(uid))
          .hover(function (e) {
            var title = 'Last spoke ' + ttTools.timestamp(ttTools.userActivityLog.message(uid)) + ' ago';
            title += "\n";
            title += 'Last voted ' + ttTools.timestamp(ttTools.userActivityLog.vote(uid)) + ' ago';
            $(this)
              .attr('title', title)
              .attr('class', 'status')
              .addClass(ttTools.views.users.userStatus(uid));
          })
      );

      if (user.verified)
        guestName
          .append(
            $(util.emojify(':tophat:'))
              .attr('title', 'Verified ' + user.verified)
          );

      if ($.inArray(uid, ttTools.constants.hackers) > -1)
        guestName
          .append(
            $(util.emojify(':octocat:'))
              .attr('title', 'turntable.fm hacker')
          );

      if ($.inArray(uid, ttObjects.room.djIds) > -1)
        guestName
          .append(
            $(util.emojify(':notes:'))
              .attr('title', 'Is on the decks')
          );
    },

    userStatus : function (uid) {
      var averageActivity = ttTools.userActivityLog.averageActivity(uid);
      var threshold = ttTools.idleIndicator.threshold();
      if (averageActivity > threshold) return 'red';
      if (averageActivity > (threshold / 2)) return 'yellow';
      return 'green';
    }
  },

  playlist : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
.playlist-container .song .goTop {\
  top:2px !important;\
  left:10px !important;\
}\
.playlist-container .song .goBottom {\
  top:22px;\
  left:0px;\
  width:34px;\
  height:17px;\
  cursor:pointer;\
  position:absolute;\
  background-position:0 17px !important;\
  background:url(" + ttTools.resources.bottomButton + ");\
}\
.playlist-container .song .goBottom:hover { background-position:0 0 !important; }\
.playlist-container .song.topSong .goBottom { display:none; }\
      "}).appendTo(document.head);
    },

    update : function () {
      $('div.realPlaylist div.song div.goBottom').remove();
      $('<div class="goBottom"/>')
        .on('click', function (e) {
          e.stopPropagation();
          var song = $(this).closest('.song').data('songData');
          ttTools.moveSongToBottom(song.fileId);
        })
        .appendTo($('div.realPlaylist div.song'))
    }
  }
}
