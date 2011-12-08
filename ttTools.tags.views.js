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
