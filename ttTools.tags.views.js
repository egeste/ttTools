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
