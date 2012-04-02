/*

	jQuery Tags Input Plugin 1.3.3
	
	Copyright (c) 2011 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/

(function($) {

	var delimiter = new Array();
	var tags_callbacks = new Array();
	$.fn.doAutosize = function(o){
	    var minWidth = $(this).data('minwidth'),
	        maxWidth = $(this).data('maxwidth'),
	        val = '',
	        input = $(this),
	        testSubject = $('#'+$(this).data('tester_id'));
	
	    if (val === (val = input.val())) {return;}
	
	    // Enter new content into testSubject
	    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    testSubject.html(escaped);
	    // Calculate new width + whether to change
	    var testerWidth = testSubject.width(),
	        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
	        currentWidth = input.width(),
	        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
	                             || (newWidth > minWidth && newWidth < maxWidth);
	
	    // Animate width
	    if (isValidWidthChange) {
	        input.width(newWidth);
	    }


  };
  $.fn.resetAutosize = function(options){
    // alert(JSON.stringify(options));
    var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width(),
        maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id')+'_autosize_tester';
    if(! $('#'+testerId).length > 0){
      testSubject.attr('id', testerId);
      testSubject.appendTo('body');
    }

    input.data('minwidth', minWidth);
    input.data('maxwidth', maxWidth);
    input.data('tester_id', testerId);
    input.css('width', minWidth);
  };
  
	$.fn.addTag = function(value,options) {
			options = jQuery.extend({focus:false,callback:true},options);
			this.each(function() { 
				var id = $(this).attr('id');

				var tagslist = $(this).val().split(delimiter[id]);
				if (tagslist[0] == '') { 
					tagslist = new Array();
				}

				value = jQuery.trim(value);
		
				if (options.unique) {
					var skipTag = $(tagslist).tagExist(value);
					if(skipTag == true) {
					    //Marks fake input as not_valid to let styling it
    				    $('#'+id+'_tag').addClass('not_valid');
    				}
				} else {
					var skipTag = false; 
				}
				
				if (value !='' && skipTag != true) { 
                    $('<span>').addClass('tag').append(
                        $('<span>').text(value).append('&nbsp;&nbsp;'),
                        $('<a>', {
                            href  : '#',
                            title : 'Removing tag',
                            text  : 'x'
                        }).click(function () {
                            return $('#' + id).removeTag(escape(value));
                        })
                    ).insertBefore('#' + id + '_addTag');

					tagslist.push(value);
				
					$('#'+id+'_tag').val('');
					if (options.focus) {
						$('#'+id+'_tag').focus();
					} else {		
						$('#'+id+'_tag').blur();
					}
					
					$.fn.tagsInput.updateTagsField(this,tagslist);
					
					if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
						var f = tags_callbacks[id]['onAddTag'];
						f.call(this, value);
					}
					if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
					{
						var i = tagslist.length;
						var f = tags_callbacks[id]['onChange'];
						f.call(this, $(this), tagslist[i-1]);
					}					
				}
		
			});		
			
			return false;
		};
		
	$.fn.removeTag = function(value) { 
			value = unescape(value);
			this.each(function() { 
				var id = $(this).attr('id');
	
				var old = $(this).val().split(delimiter[id]);
					
				$('#'+id+'_tagsinput .tag').remove();
				str = '';
				for (i=0; i< old.length; i++) { 
					if (old[i]!=value) { 
						str = str + delimiter[id] +old[i];
					}
				}
				
				$.fn.tagsInput.importTags(this,str);

				if (tags_callbacks[id] && tags_callbacks[id]['onRemoveTag']) {
					var f = tags_callbacks[id]['onRemoveTag'];
					f.call(this, value);
				}
			});
					
			return false;
		};
	
	$.fn.tagExist = function(val) {
		return (jQuery.inArray(val, $(this)) >= 0); //true when tag exists, false when not
	};
	
	// clear all existing tags and import new ones from a string
	$.fn.importTags = function(str) {
                id = $(this).attr('id');
		$('#'+id+'_tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this,str);
	}
		
	$.fn.tagsInput = function(options) { 
    var settings = jQuery.extend({
      interactive:true,
      defaultText:'add a tag',
      minChars:0,
      width:'300px',
      height:'100px',
      autocomplete: {selectFirst: false },
      'hide':true,
      'delimiter':',',
      'unique':true,
      removeWithBackspace:true,
      placeholderColor:'#666666',
      autosize: true,
      comfortZone: 20,
      inputPadding: 6*2
    },options);

		this.each(function() { 
			if (settings.hide) { 
				$(this).hide();				
			}
				
			var id = $(this).attr('id')
			
			var data = jQuery.extend({
				pid:id,
				real_input: '#'+id,
				holder: '#'+id+'_tagsinput',
				input_wrapper: '#'+id+'_addTag',
				fake_input: '#'+id+'_tag'
			},settings);
	
			delimiter[id] = data.delimiter;
			
			if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
				tags_callbacks[id] = new Array();
				tags_callbacks[id]['onAddTag'] = settings.onAddTag;
				tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				tags_callbacks[id]['onChange'] = settings.onChange;
			}
	
			var markup = '<div id="'+id+'_tagsinput" class="tagsinput"><div id="'+id+'_addTag">';
			
			if (settings.interactive) {
				markup = markup + '<input id="'+id+'_tag" value="" data-default="'+settings.defaultText+'" />';
			}
			
			markup = markup + '</div><div class="tags_clear"></div></div>';
			
			$(markup).insertAfter(this);

			$(data.holder).css('width',settings.width);
			$(data.holder).css('height',settings.height);
	
			if ($(data.real_input).val()!='') { 
				$.fn.tagsInput.importTags($(data.real_input),$(data.real_input).val());
			}		
			if (settings.interactive) { 
				$(data.fake_input).val($(data.fake_input).attr('data-default'));
				$(data.fake_input).css('color',settings.placeholderColor);
		        $(data.fake_input).resetAutosize(settings);
		
				$(data.holder).bind('click',data,function(event) {
					$(event.data.fake_input).focus();
				});
			
				$(data.fake_input).bind('focus',data,function(event) {
					if ($(event.data.fake_input).val()==$(event.data.fake_input).attr('data-default')) { 
						$(event.data.fake_input).val('');
					}
					$(event.data.fake_input).css('color','#000000');		
				});
						
				if (settings.autocomplete_url != undefined) {
					autocomplete_options = {source: settings.autocomplete_url};
					for (attrname in settings.autocomplete) { 
						autocomplete_options[attrname] = settings.autocomplete[attrname]; 
					}
				
					if (jQuery.Autocompleter !== undefined) {
						$(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
						$(data.fake_input).bind('result',data,function(event,data,formatted) {
							if (data) {
								$('#'+id).addTag(data[0] + "",{focus:true,unique:(settings.unique)});
							}
					  	});
					} else if (jQuery.ui.autocomplete !== undefined) {
						$(data.fake_input).autocomplete(autocomplete_options);
						$(data.fake_input).bind('autocompleteselect',data,function(event,ui) {
							$(event.data.real_input).addTag(ui.item.value,{focus:true,unique:(settings.unique)});
							return false;
						});
					}
				
					
				} else {
						// if a user tabs out of the field, create a new tag
						// this is only available if autocomplete is not used.
						$(data.fake_input).bind('blur',data,function(event) { 
							var d = $(this).attr('data-default');
							if ($(event.data.fake_input).val()!='' && $(event.data.fake_input).val()!=d) { 
								if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
									$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)});
							} else {
								$(event.data.fake_input).val($(event.data.fake_input).attr('data-default'));
								$(event.data.fake_input).css('color',settings.placeholderColor);
							}
							return false;
						});
				
				}
				// if user types a comma, create a new tag
				$(data.fake_input).bind('keypress',data,function(event) {
					if (event.which==event.data.delimiter.charCodeAt(0) || event.which==13 ) {
					    event.preventDefault();
						if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
							$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)});
					  	$(event.data.fake_input).resetAutosize(settings);
						return false;
					} else if (event.data.autosize) {
			            $(event.data.fake_input).doAutosize(settings);
            
          			}
				});
				//Delete last tag on backspace
				data.removeWithBackspace && $(data.fake_input).bind('keydown', function(event)
				{
					if(event.keyCode == 8 && $(this).val() == '')
					{
						 event.preventDefault();
						 var last_tag = $(this).closest('.tagsinput').find('.tag:last').text();
						 var id = $(this).attr('id').replace(/_tag$/, '');
						 last_tag = last_tag.replace(/[\s]+x$/, '');
						 $('#' + id).removeTag(escape(last_tag));
						 $(this).trigger('focus');
					}
				});
				$(data.fake_input).blur();
				
				//Removes the not_valid class when user changes the value of the fake input
				if(data.unique) {
				    $(data.fake_input).keydown(function(event){
				        if(event.keyCode == 8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) {
				            $(this).removeClass('not_valid');
				        }
				    });
				}
			} // if settings.interactive
			return false;
		});
			
		return this;
	
	};
	
	$.fn.tagsInput.updateTagsField = function(obj,tagslist) { 
		var id = $(obj).attr('id');
		$(obj).val(tagslist.join(delimiter[id]));
	};
	
	$.fn.tagsInput.importTags = function(obj,val) {			
		$(obj).val('');
		var id = $(obj).attr('id');
		var tags = val.split(delimiter[id]);
		for (i=0; i<tags.length; i++) { 
			$(obj).addTag(tags[i],{focus:false,callback:false});
		}
		if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
		{
			var f = tags_callbacks[id]['onChange'];
			f.call(obj, obj, tags[i]);
		}
	};

})(jQuery);
ttObjects = {
  room : null,
  getRoom : function() {
    for (var memberName in turntable) {
      var member = turntable[memberName];
      if (typeof member !== 'object' || member === null) continue;
      if (typeof member.setupRoom !== 'undefined') {
        ttObjects.room = member;
        return member;
      }
    }
    return false;
  },

  manager : null,
  getManager : function() {
    for (var memberName in ttObjects.getRoom()) {
      var member = ttObjects.room[memberName];
      if (typeof member !== 'object' || member === null) continue;
      if (typeof member.blackswan !== 'undefined') {
        ttObjects.manager = member;
        return member;
      }
    }
    return false;
  },

  api : null,
  getApi: function () {
    var apiRegex = / Preparing message /i;
    for (var memberName in turntable) {
      var member = turntable[memberName];
      if (typeof member !== 'function') continue;
      member.toString = Function.prototype.toString;
      if (apiRegex.test(member.toString())) {
        ttObjects.api = member;
        return member;
      }
    }
    return false;
  }
};ttTools = {

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
        $('form.playlistSearch')
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
          ['button#youtube', { title: 'Search YouTube' }],
          ['button#soundcloud', { title: 'Search SoundCloud' }],
          ['button#casinoRoll', { title: 'Roll for a spot (casino mode)' }],
          ['button#showTheLove', { title: 'Show The Love' }],
          ['button#importExport', { title: 'Import/Export' }]
        ]
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

  playlistLoaded : function () {
    var defer = $.Deferred();
    var resolveWhenReady = function () {
      if (turntable && turntable.playlist && turntable.playlist.files)
        return defer.resolve();
      setTimeout(resolveWhenReady, 500);
    }
    resolveWhenReady();
    return defer.promise();
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
      "}).appendTo(document.head);
    this.createTable();
    this.views.playlist.render();
    this.defaults();
  },

  defaults : function () {
    this.views.playlist.update();
    this.override_filterQueue();
  },

  override_filterQueue : function () {
    // turntable.playlist.addSong.toString = Function.prototype.toString;
    if (!turntable.playlist.filterQueue_ttTools)
      turntable.playlist.filterQueue_ttTools = turntable.playlist.filterQueue;
    turntable.playlist.filterQueue = function (filter) {
      turntable.playlist.filterQueue_ttTools(filter);
      if (filter.length > 0) {
        ttTools.tags.getFidsForTagLike(filter, function (tx, result) {
          var fids = [];
          for (var i=0; i<result.rows.length; i++) { fids.push(result.rows.item(i).fid); }
          $('div.queue div.song:hidden').each(function(index, element) {
            var element = $(element);
            var fid = element.data('songData').fileId;
            if ($.inArray(fid, fids) > -1)
              element.closest('.song').show().addClass('filtered');
          });
        });
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
    this.views.playlist.update();
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

  playlist : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
div.song div.ui-icon-tag {\
  margin: 0;\
  top: 24px;\
  right: 5px;\
  width: 16px;\
  height: 16px;\
  cursor: pointer;\
  position: absolute;\
}\
      "}).appendTo(document.head);
    },

    update : function () {
      $('div.song div.ui-icon-tag').remove();
      var elements = $('div.song')
        .unbind('click')
        .on('click', function(e) {
          ttTools.tags.views.add.render($(this).closest('.song').data('songData'));
        });
      ttTools.tags.getFids(function (tx, result) {
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
    }
  },

  add : {
    render : function (file) {
      util.showOverlay(util.buildTree(this.tree(file)));

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
        file.fileId,
        function (tx, result) {
          for (var i=0; i<result.rows.length; i++) {
            $('#tags').addTag(result.rows.item(i).tag, {
              callback : false
            });
          }
        }
      );
    },

    tree : function (file) {
      return ['div.tagsOverlay.modal', {},
        ['div.close-x', {
          event : {
            click : function () {
              util.hideOverlay();
              ttTools.tags.views.playlist.update();
            }
          }
        }],
        ['br'],
        ['h1', file.metadata.song],
        ['div', {}, file.metadata.artist],
        ['br'],
        ['input#tags', { type : 'text' }]
      ];
    }
  }
}
ttTools.portability = {

  init : function () {
    this.views.import.render();
  },

  importProcess : {
    operations : [],
    completed  : 0,
    timeout    : null
  },

  importPlaylist : function (playlist) {
    if (playlist.length == 0) { return this.views.import.update(); }

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
                    ttTools.tags.views.playlist.update();
                  });
                }
              });
            })
          }
          if (ttTools.portability.importProcess.operations[ttTools.portability.importProcess.completed]) {
            ttTools.portability.importProcess.operations[ttTools.portability.importProcess.completed]();
          }
        }
        var deferredOperation = function () {
          ttObjects.api({
            api           : 'playlist.add',
            playlist_name : 'default',
            index         : turntable.playlist.files.length + 1,
            song_dict     : { fileid: song.fileId }
          }, apiCallback);
        }
        setTimeout(deferredOperation, 1500); // Offset to avoid getting nailed by the rate limiting
      }
      ttTools.portability.importProcess.operations.push(operation);
    });
    if (this.importProcess.operations.length == 0) { return this.views.import.update(); }
    this.importProcess.operations[0]();
  },

  exportPlaylist : function (tags) {
    if (!ttTools.database.isSupported() || (tags.length < 2 && tags[0] == '')) {
      return window.location.href = 'data:text/json;charset=utf-8,' + JSON.stringify(turntable.playlist.files);
    }
    
    ttTools.tags.getAll(function (tx, result) {
      var tagsByFid = {}, matchFids = [];
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
        if ($.inArray(file.fileId, matchFids) > -1) playlist.push(file);
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
div#importProgress {\
  top:0;\
  left:0;\
  color:#fff;\
  width:400px;\
  padding:20px;\
  z-index:1000;\
  text-align:center;\
  position:absolute;\
  background-color:#888;\
  border:13px solid #fbd863;\
  text-shadow:1px 1px 1px black;\
}\
      "}).appendTo(document.head);

      $(util.buildTree(this.tree()))
        .appendTo(document.body)
        .draggable()
        .hide()
        .find('div#importProgressBar')
        .progressbar();
    },

    update : function () {
      var total = ttTools.portability.importProcess.operations.length;
      var completed = ttTools.portability.importProcess.completed;
      $('span#importTotal').html(total);
      $('span#importCount').html(completed);
      $('div#importProgressBar').progressbar('option', 'value', (completed / total) * 100);
      if (completed == total) {
        if (ttTools.database.isSupported()) ttTools.tags.views.playlist.update();
        $('div#importProgress').hide();
      }
    },

    tree : function () {
      return ['div#importProgress', {},
        ['span#status', {}, 'Processing...'],
        ['div#importProgressBar', {}],
        ['span#importCount', {}, '0'],
        ['span', {}, ' of '],
        ['span#importTotal', {}, '0'],
        ['div', {}, 'Please be patient, this process is slow. Feel free to drag this dialog out of the way.']
      ];
    }
  },

  modal : {
    render : function () {
      util.showOverlay(util.buildTree(this.tree()));
      
      $('<style/>', {
        type : 'text/css',
        text : "\
div.portability.modal.dropzone { border-style:dotted; }\
div.portability.modal.dropzone * { visibility: hidden; }\
div.portability.modal ul { text-align: left; }\
div.portability.modal div.rightAlign { text-align: right; }\
      "}).appendTo($('div.portability.modal'));

      ttTools.tags.getAll(function (tx, result) {
        var tags = {};
        for (var i=0; i<result.rows.length; i++) { tags[result.rows.item(i).tag] = 1; }
        var tags = Object.keys(tags);
        $('input#tagExport').tagsInput({
          width            : '100%',
          defaultText      : 'Export tags',
          autocomplete_url : false,
          autocomplete     : {
            source : tags
          }
        });
      });

      $('button#tagExportButton').button().click(function (e) {
        var tags = $('input#tagExport').val().split(',');
        util.hideOverlay();
        ttTools.portability.exportPlaylist(tags);
      });

      $('div.portability.modal')
        .on('dragenter', function (e) {
          $(this).addClass('dropzone');
        })
        .on('dragleave', function (e) {
          $(this).removeClass('dropzone');
        })
        .on('dragover', function (e) {
          e.preventDefault();
        })
        .on('drop', function (e) {
          e = e.originalEvent;
          util.hideOverlay();
          for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file = e.dataTransfer.files[i];
            var reader = new FileReader();
            reader.onload = function () {
              $('div#importProgress')
                .show()
                .find('span#status')
                .html('Processing: '+file.name);
              try {
                ttTools.portability.importPlaylist(JSON.parse(this.result));
              } catch (err) {
                $('div#importProgress').hide();
                alert(file.name+' cannot be imported as a playlist.');
              }
            }
            reader.readAsText(file, 'utf-8');
          }
        });
    },

    tree : function () {
      return ['div.portability.modal', {},
        ['div.close-x', {
          event : {
            click : util.hideOverlay
          }
        }],
        ['h1', 'Import/Export'],
        ['br'],
        ['ul', {},
          ['li', {}, 'To import a playlist, simply drag & drop the file on this dialog'],
          ['li', {}, 'To export your entire playlist, just click export.'],
          ['li', {}, 'To only export songs with specific tags, enter them in the field below, then click export.']
        ],
        ['input#tagExport', { type : 'text' }],
        ['br'],
        ['div.rightAlign', {},
          ['button#tagExportButton', 'Export'],
        ],
      ];
    }
  }
}
ttTools.constants = {
  whatsNew : function () {
    return "\
<h2>What's New in ttTools?</h2>\
<br />\
<h3>" +
  ttTools.constants.months[ttTools.release.getMonth()] + " " +
  ttTools.release.getDate() + ", " +
  ttTools.release.getFullYear() +
"</h3>\
<ul>\
  <li>ttTools is now persistent when you change rooms via the 'List Rooms' or 'Random Room' buttons</li>\
  <li>Images are pre-loaded as b64 blobs instead of downloading from github (hoping this fixes the \"missing bottom button\" issue)</li>\
</ul>\
<br/>";
  },

  donateButton : function () {
    return "\
<h3>Do you &lt;3 ttTools?</h3>\
<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>\
<input type='hidden' name='cmd' value='_s-xclick'>\
<input type='hidden' name='hosted_button_id' value='ZNTHAXPNKMKBN'>\
<input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!'>\
<img alt='' border='0' src='https://www.paypalobjects.com/en_US/i/scr/pixel.gif' width='1' height='1'>\
</form>\
<br />";
  },

  submitIssue : function () {
    return "\
<h3>Found a bug? Want a feature?</h3>\
<p>\
  It's impossible to keep track of bugs and feature requests unless they're centralized.<br/>\
  <a href='https://github.com/egeste/ttTools/issues' target='_blank'>Please submit all bugs and feature requests here.</a>\
</p>\
<br/>";
  },

  time : {
    seconds : 1000,
    minutes : 60 * 1000,
    hours   : 60 * 60 * 1000,
    days    : 24 * 60 * 60 * 1000,
    weeks   : 7 * 24 * 60 * 60 * 1000,
    months  : 30 * 7 * 24 * 60 * 60 * 1000,
    years   : 365 * 30 * 7 * 24 * 60 * 60 * 1000
  },

  months : [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  hackers : [
    '4deadb0f4fe7d013dc0555f1', // @alain_gilbert
    '4e10fde04fe7d074cd0d8b95', // Axe_
    '4e42c21b4fe7d02e6107b1ff', // chrisinajar
    '4e55144e4fe7d02a3f2c486a', // Egeste
    '4dee9d454fe7d0589304d644', // Frick
    '4e6498184fe7d042db021e95', // Inumedia
    '4e0b4de14fe7d076b205e657', // Jake.Smith
    '4e596d44a3f7517501058e25', // overra
    '4e09dc63a3f7517d140c300d', // Starburst
    '4ddb2be9e8a6c45f6f000125', // SubFuze
    '4dee6cd24fe7d05893018656', // vin
    '4e0ff328a3f751670a084ba6', // YayRamen
  ]
}
ttTools.resources = {
  customIcons : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAQCAYAAAC7mUeyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABv9JREFUeNq0lmtsFNcZht+Z2dn17vqy9taXmCguwVcaF1PbtCSgIgRIBREH0uLKaqRWqqX+KAhISyu1KVRtpcqtmorwI7+QWimRaFOThmAkiErtiqaUuIqxbC5xsB1qbGNj731ndi6n7xl8oVbyzxzp7MyeObfnfO/3fUcRQmDr1q2QJRwOd6qq+oaiKEdZT7muG5PtfMenlfPnz2O1yqFDhzpbW1u/qeu6xpInC/cTfPDgQfrGjRu3xsfHh+Lx+MDY2Njl/v7+1MrxksMnX7hpryGbzX6RG485jrOXE/3a5/PlsZPxWTCrWRobG1/gpre3t7djw4YNS+3JZBLNzc0bg8EgBgcHna6urm+w+eynzeHBmKaJheffCPITbr6bJ/Qq3zex/pRQrfwcZL3E2ve4gOQ+crnc/7UREN3d3Whra8PVq1c19sl91ngPZmJqCj6ePiGu+/3+Ddz899j8Iq3yLz53sV3ls5i1QPY3aFJnlUGi0WgeTx2UmPc/nU4jFotJtaC+vh7T09Ne2/r16zuqq6u/ZFmWKCwsFLZtpwj5lsTwYCpZR3giFNP9oGV9rPp8MzwhqS1HSJ/hk9XOEcJk3eHXUbaw6GoVHmJQgkjLDA8PI5FIgG6DyspKtLS04N69eygoKMC6des6qBpkMhnPlwmFI0eO6Jzitx7MPyufQO/cA/xyLib+QfqKvLzUXVdU2sJdm69pf0jbdjutVFQd8P/pVEE+vqYHofsDy843dQvCNqD4OF0oAmHMQaSmoEbr4M4ONjo33nzZHbvUBk031UjNO/qOUz9CtG7evf4OlOKnoFa1gmoIy7kmJydhGIbnN0VFRd78lDpqamq8Ksv8/DwYqDyr3bx5E7ROYElmoIq+qutVz0SLm7qjJee2a9r2K5lMwgCmW4NBY8BxRi1FSTSFgk9tBjbHU+l+RdVyxSuPV6rRygbE5IfPiuTkk87sR4b73/f38v8WxNIRqBrc6b5OS/lZhW/nb54XmXko0bWLowvlJiVIWVkZLl++jGvXruHw4cMoLS31gHp6erznzp07PQtKoLm5OQnjLsFYhtGWiJb+RfH7tZe4oJqI49ulZVBCYSRLP/fil8M8NC7gVFXBqa1FoKfngtXX28Whf/e2wTHQA7RODu6dvhfE+PvPwbHCws6GhJHMR0axkCEoF4cogDv43l4n8NpuJVz+b/jDswsWiU9MTMiNeZuUYAMDA568JEwqlcKZM2e89oaGBlRUVHh9t2zZIgOE8wiMeTD8yiuavmcP7KEhON/tRCadAfIop+8fRPKHP4Ayx1OcuAft7l34amt3YD42vAgjsvECMTncLCTA6AebRCpeQpgQHNuPnFmEtOtH+qHzLfzAufLGWww5CXrLCXVX3evnzp1rZ/5oph9UMd9858CBAzUbN25EXV2d1z8/Px/79+/HXa4fiUS8tlAoJH1N+o5YlllhfsT9+XGo7GT//ndIf2UTFCuHQDKFwuIiTO/ejfz3LsF+7lkI6jjUf01TYnNLTuP2/vGgm5xtQC7jQyYWIQRBLD9X0GCZIZgWYZRFjodAwgwSPui83dXl2/Xy62fPnr3FD7LixIkTTzLP1TQ1NS0pWAYHCbPoMzI3so+Xh+R5LsEofi0ohA7BNdRoCcpe+hYEB5i9vVAJVPH8XmThItD4DHyfXwvz+oeqOzO9HM5Shl/JOD5YLqufccNnKK7O+G3rsBxKjFBJylp9NPny3bShBAqSK12PIXhW+o6MZo8W6S+yXfqL/CatIiUpz3NZZnwVrAHy2ayCAdmlTzlc0KGDuY7NlBmC9kQlch+PwLo/A9cwlxZRd3S+KsaHm0QmWaJYZr4wMnkwUiFYuSAnDmBsqEFMzTXAp7vLO7NVpWjdvLb/x79YCUMrzN65cwcXL17Etm3bIC0kAWRSlTCy8JrjWYj5SUIuw6RzdlbkbC/FZy0HQRK71Khp2aTXie2H7fKgr1yBwbjuZA3hpDJu6SJMbUsctS29q5VzmDvmZZ7p63t42ViU2+nTp72gcPToUYyOjno5hlYc5n3tXW8f8ieRs2ZS3HiKySrJiGLOzCLHE0h+8glMOr5jO7j/9l9hF0UQqq5BfHQsFzdz6cd1rZmamhohjHXs2DHsYVCSmV/6SHFxsfcuIxxvAdJKyZMnTx5krhnxhCtvmx/UN36dnf8saEaGZyY9w7uFqtSlWLi30URStFSNgN+n9ea5zq/Wj41cWi2AlZfZjo6OPQy/m5k469asWfM0w3Ml/0cpQV32lf5z/PjxQxcuXHht8dbswfyn7guaYdkdFF6jUFTqylUXZlfY62G0UFWXJFKciZJs5kx5MnGrLBUXjwvm0bJv374SHnYFHb6Ktb68vLzx9u3bHw0NDXVRbs4izP8EGAAhk5qy4vQAxAAAAABJRU5ErkJggg==",
  bottomButton : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExODhDNkVBNURFMTFBNjMxNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGOEY5RTg3NDcxNzcxMUUxOTZFQkQwNDQ5QUJBNzAwNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGOEY5RTg3MzcxNzcxMUUxOTZFQkQwNDQ5QUJBNzAwNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4QzE0RjFDOUZFMkU2MUFDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY3N0YxMTc0MDcyMDY4MTE4OEM2RUE1REUxMUE2MzE3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aPVoDAAAArNJREFUeNrslktvUkEUx2fuvTx1QwmG2l3lG5CwYCMadMmiCca4M32QmuBrUfoRrC58JW3oI+7USOKCpRDFDQvi/QbYbYmEslHe945n2nOT0TRleFWbcJKTO8zc+c/vnhkmf8oYIzLxftGzqVKyqlCp14kJsgYjW7f36vdk3teIZDg0krzoUOZsKon1Y+Gf1jVI9mfbTMrqU9mK8PiUnHEBTEFTSYieAtEzSAkgIjdfHzYnAsIjf9/ru+CgRU0hgZPGeyYp/2qzcPRVrTqI7sAgPD4/8AbcdlpUFeIT+w2TVBsdFr7+slYeVHMoEB5fHnpDAFOAw+vCw9kEiMi1F7XSMHpDg/D4+sgbc9roR95uddnC1ee17LBaI4EgzGN4qADxbBSdkUHGFf8PSGnNm4LnE8gZyLrkvBVID+QGZBAyDrk+CogyxBwOkBZ+8/b8qBURQXJ4MX7DxawvP8T+HC5oQfAqpoSKfBD6GabVlxK0La2c0P4DZAO3x4NiQVyUl9y60blwAtvrOEeHzEDewgU5/BXUCqIWEebw+VF+SUPewHZcBMnjGamjQBT7M8J4sE+F+fg+Zh0ho8K4LpzDvHgmRZA4VsODE/JCP0FBvQ+Ijts3jzpBQUf6jFjnYR9LqGMZrT0nWP46iltnJIOwOdyqbcjvqKXL/pvO34V25+mlTUUlq1TSoXFZ0yBbb9d+jNehaXaadLjpnKLRGJGwaGaPZdsNNhmHtpT2u+xuWlBVGiKnWDTDYKVOg0V2E5XJObTlHb/P7lKKsE0nOjTYjnKnaYZ3liuTd2gru/6AzXkE4/sLotptmeHtpcrZObTE3mzI5qQFqhw7NGaSZrfFIunFg7N3aIk3szGb/dihdTtsIX334N85NIA5cmgAMXVoYw0t+e7y1KFNHdrUoZ1Lh/ZbgAEA9opWGtX4ApQAAAAASUVORK5CYII=",
}
ttTools.release = new Date(1333399882000);
$.when(ttTools.roomLoaded()).then($.proxy(ttTools.init, ttTools));
