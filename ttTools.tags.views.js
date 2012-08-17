ttTools.tags.views = {

  playlist : {
    render : function () {
    if(ttTools.tags.isSupported()){
        $('<style/>', {
            type : 'text/css',
            text : "\
            li.song div.ui-icon-tag {\
              margin: 0;\
              top: 24px;\
              right: 5px;\
              width: 16px;\
              height: 16px;\
              cursor: pointer;\
              position: absolute;\
            }\
      "}).appendTo(document.head);

    }

    },

    update : function () {
      if(ttTools.tags.isSupported()){
          $('li.song div.ui-icon-tag').remove();
          var elements = $('li.song')
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
