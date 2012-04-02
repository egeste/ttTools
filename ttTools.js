ttTools = {

  roomLoaded : function () {
    var defer = $.Deferred();
    var resolveWhenReady = function () {
      if (turntable && ttObjects.getManager() && ttObjects.getApi())
        return defer.resolve();
      setTimeout(resolveWhenReady, 500);
    }
    resolveWhenReady();
    return defer.promise();
  },

  init : function() {
    $('<link/>', {
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/sunny/jquery-ui.css'
    }).appendTo(document.head);

    this.views.menu.render();
    this.views.users.render();
    this.views.toolbar.render();
    this.views.playlist.render();

    // TODO: Cloudify tags
    $.when(ttTools.tags.playlistLoaded())
      .then($.proxy(ttTools.tags.init, ttTools.tags))
    this.portability.init();

    // Register event listeners
    turntable.addEventListener('auth', $.proxy(this.authEvent, this));
    turntable.addEventListener('message', $.proxy(this.messageEvent, this));
    turntable.addEventListener('reconnect', $.proxy(this.reconnectEvent, this));
    turntable.addEventListener('userinfo', $.proxy(this.userInfoEvent, this));
    $('div#top-panel').next().find('a[id]').on('click', function (e) {
      clearTimeout(ttTools.autoVote.timeout);
    });

    this.defaults();
    this.checkVersion();
  },

  defaults : function () {
    // Cancel any timeouts
    clearTimeout(this.autoDJ.timeout);
    clearTimeout(this.autoVote.timeout);
    // Initialize state machines
    this.userActivityLog.init();
    this.autoDJ.setEnabled(false);
    this.autoVote.setEnabled(this.autoVote.enabled());
    this.autoVote.execute();
    this.animations.setEnabled(this.animations.enabled());
    this.downVotes.downvotes = 0;
    this.downVotes.downvoters = [];
    // Override internals
    this.override_idleTime();
    this.override_removeDj();
    this.override_guestListName();
    this.override_updateGuestList();
    this.override_setPlaylistHeight();
    // Update views
    this.views.playlist.update();
    this.views.users.modifyContainer();
    ttObjects.room.updateGuestList();
    // Call defaults for modules
    $.when(ttTools.tags.playlistLoaded())
      .then($.proxy(ttTools.tags.defaults, ttTools.tags));
  },

  // Event listeners
  authEvent : function (message) {
    console.warn(message);
  },

  messageEvent : function (message) {
    if (typeof message.msgid !== 'undefined') {
      if (typeof message.users !== 'undefined'
      && typeof message.room === 'object'
      && typeof message.room.metadata === 'object'
      && typeof message.room.metadata.songlog !== 'undefined') {
        return $.when(this.roomLoaded()).then($.proxy(this.roomChanged, this));
      }
      return;
    }

    switch (message.command) {
      case 'speak':
        return this.userSpoke(message);
      case 'update_votes':
        return this.votesUpdated(message);
      case 'deregistered':
        return this.userRemoved(message);
      case 'newsong':
        return this.songChanged(message);
      case 'add_dj':
        return this.djAdded(message);
      case 'booted_user':
        return this.userBooted(message);
      case 'rem_dj':
        return this.djRemoved(message);
      case 'playlist_complete':
        return this.playlistComplete(message);
      case 'search_complete':
        return this.searchComplete(message);
      case 'registered':
      case 'snagged':
      case 'update_user':
        return; // noop
      default:
        return console.warn(message);
    }
  },

  reconnectEvent : function (message) {
    console.warn(message);
  },

  userInfoEvent : function (message) {
    console.warn(message);
  },

  // Event handlers
  djAdded : function (message) {
    this.views.users.update();
  },

  djRemoved : function (message) {
    $(message.user).each(function (index, user) {
      ttTools.views.users.updateUser(user.userid);
    });
  },

  playlistComplete : function (message) {
    this.views.playlist.update();
    this.tags.views.playlist.update();
  },

  roomChanged : function () {
    this.defaults();
  },

  searchComplete : function (message) {
    this.tags.views.playlist.update();
  },

  songChanged : function (message) {
    this.downVotes.downvoters = [];
    this.downVotes.downvotes = 0;
    this.views.users.update();
    this.autoVote.execute();
    this.autoSongDrop.execute(message);
  },

  userBooted : function (message) {
    delete this.userActivityLog[message.userid];
  },

  userRemoved : function (message) {
    $(message.user).each(function (index, user) {
      delete this.userActivityLog[user.userid];
    });
  },

  userSpoke : function (message) {
    this.userActivityLog[message.userid].message = util.now();
    this.views.users.updateUser(message.userid);
  },

  votesUpdated : function (message) {
    this.downVotes.update(message.room.metadata);
    this.views.users.updateVoteCount();
  },

  // State machines
  autoVote : {
    timeout : null,
    enabled : function () {
      var enabled = $.cookie('ttTools_autoVote_enabled');
      if (enabled === null || enabled === 'false') return false;
      return enabled;
    },
    setEnabled : function (enabled) {
      $.cookie('ttTools_autoVote_enabled', enabled);
    },
    delay : function () {
      var delay = $.cookie('ttTools_autoVote_delay');
      return delay === null ? (30 * ttTools.constants.time.seconds) : parseInt(delay);
    },
    setDelay : function (delay) {
      $.cookie('ttTools_autoVote_delay', delay);
    },
    execute : function () {
      clearTimeout(this.timeout);
      var enabled = this.enabled();
      if (enabled) {
        this.timeout = setTimeout(function() {
          if (ttObjects.room.currentSong) {
            ttObjects.api({
              api: 'room.vote',
              roomid: ttObjects.room.roomId,
              val: enabled,
              vh: $.sha1(ttObjects.room.roomId + enabled + ttObjects.room.currentSong._id),
              th: $.sha1(Math.random() + ""),
              ph: $.sha1(Math.random() + "")
            });
          }
        }, this.delay());
      }
    }
  },

  autoDJ : {
    timeout : null,
    enabled : function () {
      var enabled = $.cookie('ttTools_autoDJ_enabled');
      return enabled === null ? false : enabled === 'true';
    },
    setEnabled : function (enabled) {
      $.cookie('ttTools_autoDJ_enabled', enabled);
    },
    delay : function () {
      var delay = $.cookie('ttTools_autoDJ_delay');
      return delay === null ? (2 * ttTools.constants.time.seconds) : parseInt(delay);
    },
    setDelay : function (delay) {
      $.cookie('ttTools_autoDJ_delay', delay);
    },
    execute : function (uid) {
      clearTimeout(this.timeout);
      if (this.enabled() && uid !== turntable.user.id && !ttObjects.room.isDj()) {
        this.timeout = setTimeout(function () {
          if (ttObjects.room.numDjs() < ttObjects.room.maxDjs) {
            ttObjects.api({
              api: "room.add_dj",
              roomid: ttObjects.room.roomId
            }, function (response) {
              if (!response.success && !ttObjects.room.isDj()) return;
              ttTools.autoDJ.setEnabled(false);
              ttTools.views.toolbar.update();
            });
          }
        }, this.delay());
      }
    }
  },

  animations : {
    enabled : function () {
      var enabled = $.cookie('ttTools_animations_enabled');
      return enabled === null ? true : enabled === 'true';
    },
    setEnabled : function (enabled) {
      $.cookie('ttTools_animations_enabled', enabled);
      enabled ? ttTools.animations.enable() : ttTools.animations.disable();
    },
    enable : function () {
      if (ttObjects.manager.add_animation_to_ttTools)
        ttObjects.manager.add_animation_to = ttObjects.manager.add_animation_to_ttTools;
      if (ttObjects.manager.speak_ttTools)
        ttObjects.manager.speak = ttObjects.manager.speak_ttTools;

      $(Object.keys(ttObjects.manager.djs_uid)).each(function (index, uid) {
        var dancer = ttObjects.manager.djs_uid[uid][0];
        if (uid === ttObjects.room.currentDj)
          return ttObjects.manager.add_animation_to(dancer, 'bob');
        if ($.inArray(uid, ttObjects.room.upvoters) > -1)
          return ttObjects.manager.add_animation_to(dancer, 'rock');
      });

      $(Object.keys(ttObjects.manager.listeners)).each(function (index, uid) {
        var dancer = ttObjects.manager.listeners[uid];
        if ($.inArray(uid, ttObjects.room.upvoters) > -1)
          return ttObjects.manager.add_animation_to(dancer, 'rock');
      });
    },
    disable : function () {
      ttObjects.manager.add_animation_to_ttTools = ttObjects.manager.add_animation_to;
      ttObjects.manager.add_animation_to = $.noop;
      ttObjects.manager.speak_ttTools = ttObjects.manager.speak;
      ttObjects.manager.speak = $.noop;
      $(Object.keys(ttObjects.manager.djs_uid)).each(function (index, uid) {
        ttObjects.manager.djs_uid[uid][0].stop();
      });
      $(Object.keys(ttObjects.manager.listeners)).each(function (index, uid) {
        ttObjects.manager.listeners[uid].stop();
      });
    }
  },

  idleIndicator : {
    threshold : function () {
      var threshold = $.cookie('ttTools_idleIndicator_threshold');
      return threshold === null ? (60 * ttTools.constants.time.minutes) : parseInt(threshold);
    },
    setThreshold : function (threshold) {
      $.cookie('ttTools_idleIndicator_threshold', threshold);
    }
  },

  autoSongDrop : {
    threshold : function () {
      var threshold = $.cookie('ttTools_autoSongDrop_threshold');
      return threshold === null ? 0 : parseInt(threshold);
    },
    setThreshold : function (threshold) {
      $.cookie('ttTools_autoSongDrop_threshold', threshold);
    },
    execute : function (message) {
      if (!ttObjects.room.isDj()) return;
      var currentSong = message.room.metadata.current_song;
      if (currentSong.djid === turntable.user.id) return;
      var files = turntable.playlist.files.slice(0, this.threshold());
      if (files.length === 0) return;
      $(files).each(function (index, file) {
        if (file.fileId !== currentSong._id) return;
        ttTools.moveSongToBottom(file.fileId);
        return false;
      });
    }
  },

  userActivityLog : {
    init : function () {
      var users = Object.keys(ttObjects.room.users);
      $(users).each(function (index, uid) {
        ttTools.userActivityLog.initUser(uid);
      });
    },
    initUser : function (uid) {
      if (typeof ttTools.userActivityLog[uid] === 'undefined') {
        ttTools.userActivityLog[uid] = {
          message : util.now(),
          vote    : util.now()
        }
      }
      return ttTools.userActivityLog[uid];
    },
    vote : function (uid) {
      var activity = ttTools.userActivityLog.initUser(uid);
      return activity.vote;
    },
    message : function (uid) {
      var activity = ttTools.userActivityLog.initUser(uid);
      return activity.message;
    },
    averageActivity : function (uid) {
      var activities = ttTools.userActivityLog.initUser(uid),
          keys = Object.keys(activities),
          total = 0;
      $(keys).each(function (index, activity) { total += activities[activity]; });
      return util.now() - (total / keys.length);
    }
  },

  downVotes : {
    downvotes : 0,
    downvoters : [],
    update : function (metadata) {
      this.downvotes = metadata.downvotes;
      $(metadata.votelog).each(function (index, vote) {
        if (vote[0] === '') return;
        ttTools.userActivityLog[vote[0]].vote = util.now();
        if (vote[1] === 'up') {
          var downIndex = $.inArray(vote[0], ttTools.downVotes.downvoters);
          if (downIndex > -1) { ttTools.downVotes.downvoters.splice(downIndex, 1); }
        } else {
          ttTools.downVotes.downvoters.push(vote[0]);
        }
        ttTools.views.users.updateUser(vote[0]);
      });
    }
  },

  // Overrides
  override_setPlaylistHeight : function () {
    if (!turntable.playlist.setPlaylistHeight_ttTools)
      turntable.playlist.setPlaylistHeight_ttTools = turntable.playlist.setPlaylistHeight;
    turntable.playlist.setPlaylistHeight = function (a) {
      var a = this.setPlaylistHeight_ttTools(a);
      $(turntable.playlist.nodes.root).find(".queueView .songlist").css({
          height: Math.max(a - 120, 55)
      });
      return a;
    }
  },
  override_guestListName : function () {
    if (!Room.layouts.guestListName_ttTools)
      Room.layouts.guestListName_ttTools = Room.layouts.guestListName;
    Room.layouts.guestListName = function (user, room, selected) {
      var tree = this.guestListName_ttTools(user, room, selected);
      var div = tree[0].split('.');
      div[0] += '#' + user.userid;
      tree[0] = div.join('.');
      return tree;
    }
  },
  override_updateGuestList : function () {
    if (!ttObjects.room.updateGuestList_ttTools)
      ttObjects.room.updateGuestList_ttTools = ttObjects.room.updateGuestList;
    ttObjects.room.updateGuestList = function () {
      this.updateGuestList_ttTools();
      ttTools.views.users.update();
    }
  },
  override_idleTime : function () {
    turntable.idleTime = function () {
      return 0;
    };
  },
  override_removeDj : function () {
    if (!ttObjects.room.removeDj_ttTools)
      ttObjects.room.removeDj_ttTools = ttObjects.room.removeDj;
    ttObjects.room.removeDj = function (uid) {
      ttTools.autoDJ.execute();
      this.removeDj_ttTools(uid);
    }
  },

  // Utility functions
  checkVersion : function () {
    if (parseInt($.cookie('ttTools_release')) !== ttTools.release.getTime()) {
      $.cookie('ttTools_release', ttTools.release.getTime());
      this.views.info.render();
    }
  },
  timestamp : function (millis) {
    millis = util.now() - millis;
    if (millis < ttTools.constants.time.minutes)
      return Math.round(millis / ttTools.constants.time.seconds) + 's';
    if (millis < ttTools.constants.time.hours)
      return Math.round(millis / ttTools.constants.time.minutes) + 'm';
    if (millis < ttTools.constants.time.days)
      return Math.round(100 * (millis / ttTools.constants.time.hours))/100 + 'h';
    return Math.round(1000 * (millis / ttTools.constants.time.days))/1000 + 'd';
  },
  moveSongToBottom : function (fid) {
    if ($.inArray(fid, Object.keys(turntable.playlist.songsByFid)) === -1) return;
    var maxIndex = turntable.playlist.files.length - 1;
    maxIndex += (ttObjects.room.currentDj === turntable.user.id) ? -1 : 0;
    $(turntable.playlist.files).each(function (index, file) {
      if (file.fileId !== fid) return;
      if (index === maxIndex) return false;
      turntable.playlist.files.splice(index, 1);
      turntable.playlist.files.splice(maxIndex, 0, file);
      turntable.playlist.updatePlaylist(null, true);
      ttObjects.api({
        api: "playlist.reorder",
        playlist_name: "default",
        index_from: index,
        index_to: maxIndex
      });
      return false;
    });
  }
}
