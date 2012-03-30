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
      "}).appendTo($('div.tagsOverlay.modal'));

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
