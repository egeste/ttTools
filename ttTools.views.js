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
      $('div.settingsOverlay.modal').append(ttTools.constants.donateButton);

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
div#idleIndicatorDisplay, div#autoDJDisplay, div#autoVoteDisplay { text-align:center; }\
      "}).appendTo($('div.settingsOverlay.modal'));

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
        min   : 0,
        max   : 5 * ttTools.constants.time.seconds,
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
        ['div', {}, 'Released: ' + (new Date(ttTools.release)).toGMTString()],
        ['br'],
        ['div.fields', {},
          ['div.field.settings', {},
            ['div', {}, 'Idle Indicator Threshold'],
            ['div#idleIndicatorThreshold', {}],
            ['div#idleIndicatorDisplay', {}, (ttTools.idleIndicator.threshold() / ttTools.constants.time.minutes) + 'm'],
            ['br'],
            ['div', {}, 'Auto DJ Delay'],
            ['div#autoDJDelay', {}],
            ['div#autoDJDisplay', {}, (ttTools.autoDJ.delay() / ttTools.constants.time.seconds) + 's'],
            ['br'],
            ['div', {}, 'Auto Vote Delay'],
            ['div#autoVoteDelay', {}],
            ['div#autoVoteDisplay', {}, (ttTools.autoVote.delay() / ttTools.constants.time.seconds) + 's']
          ],
        ]
      ];
    }
  },

  info : {
    render : function () {
      turntable.showAlert();
      $('<style/>', {
        type : 'text/css',
        text : "div.modal ul li {\
          font-size:16px;\
          text-align:left;\
        }\
      "}).appendTo($('div.modal'));
      $('div.modal div:first')
        .html('')
        .append(ttTools.constants.whatsNew)
        .append(ttTools.constants.donateButton);
    }
  },

  // UI stuff
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
div#playlistTools {\
  left:0;\
  right:0;\
  top:65px;\
  height:2em;\
  padding:2px 0;\
  position:absolute;\
}\
div#playlistTools label { font-size:5px; }\
div#playlistTools button { width:auto; height:auto; }\
div#playlistTools button .ui-button-text { padding:.6em; }\
div#playlistTools button .custom-icons { background:url(https://github.com/egeste/ttTools/raw/master/images/custom-icons.png); }\
div#playlistTools button .custom-icons.youtube { background-position:0 0; }\
div#playlistTools button .custom-icons.dice { background-position:17px 0; }\
div#playlistTools button .custom-icons.soundcloud { background-position:34px 0; }\
div#playlistTools div, #playlistTools button { float:left; }\
div#switches { margin:0 3px; }\
div#switches ui-button-text { padding:0.6em 1em; }\
      "}).appendTo(document.head);

      $(util.buildTree(this.tree())).insertAfter(
        $('form.playlistSearch')
      );

      $('div#switches').buttonset();

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

      $('button#youtube').button({
        text  : false,
        icons : {
          primary: 'custom-icons youtube'
        }
      }).click(function (e) {
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
        ['div#switches', {},
          ['input#autoAwesome', { type : 'checkbox' }],
          ['label', { 'for' : 'autoAwesome' },
            ['span.ui-icon.ui-icon-circle-arrow-n', { title: 'Automatically upvote songs' }],
          ],
          ['input#autoLame', { type : 'checkbox' }],
          ['label', { 'for' : 'autoLame' },
            ['span.ui-icon.ui-icon-circle-arrow-s', { title: 'Automatically downvote songs' }],
          ],
          ['input#autoDJ', { type : 'checkbox' }],
          ['label', { 'for' : 'autoDJ' },
            ['span.ui-icon.ui-icon-person', { title: 'Attempt to get the next DJ spot' }],
          ],
          ['input#animations', { type : 'checkbox' }],
          ['label', { 'for' : 'animations' },
            ['span.ui-icon.ui-icon-video', { title: 'Toggle animations on/off' }]
          ],
        ],
        ['button#youtube', { title: 'Search YouTube' }],
        ['button#soundcloud', { title: 'Search SoundCloud' }],
        ['button#casinoRoll', { title: 'Roll for a spot (casino mode)' }],
        ['button#showTheLove', { title: 'Show The Love' }],
        ['button#importExport', { title: 'Import/Export' }]
      ];
    },

    update : function () {
      $('#autoDJ').prop('checked', ttTools.autoDJ.enabled()).button('refresh');
      $('#autoAwesome').prop('checked', ttTools.autoVote.enabled() === 'up').button('refresh');
      $('#autoLame').prop('checked', ttTools.autoVote.enabled() === 'down').button('refresh');
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
      $('<div/>', { id : 'voteCount' }).appendTo($('div.chatHeader'));
      ttObjects.room.updateGuestList();
      this.update();
      $('<div/>', { id : 'guestDialog' }).appendTo(document.body);
      this.setupDialog();
    },

    setupDialog : function () {
      $('div#guestDialog')
        .dialog({
          width : 265,
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

    update : function () {
      ttTools.views.users.updateVoteCount();
      $('div.guests .guest').each(function (index, element) {
        ttTools.views.users.updateUser(element.id);
      });
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
  }
}
