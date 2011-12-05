turntable.hack.tags.views = {
  add : {
    file : null,

    render : function () {
      util.showOverlay(util.buildTree(this.tree()));
      var file = this.file;
      $('#tags').tagsInput({
        width       : '100%',
        onAddTag    : function (tag) {
          turntable.hack.tags.addTag(file.fileId, tag);
        },
        onRemoveTag : function (tag) {
          turntable.hack.tags.removeTag(file.fileId, tag);
        }
      });

      turntable.hack.database.execute(
        'SELECT DISTINCT ' +
        'tag ' +
        'FROM ' +
        turntable.hack.tags.dbTable + ' ' +
        'WHERE ' +
        'fid = "' + this.file.fileId + '";',
        function (tx, result) {
          for (var i=0; i<result.rows.length; i++) {
            $('#tags').addTag(result.rows.item(i).tag);
          }
        }
      );
    },

    tree : function () {
      return ['div.settingsOverlay.modal', {},
        ['div.close-x', {
          event : {
            click : util.hideOverlay
          }
        }],
        ['br'],
        ['h1', this.file.metadata.song],
        ['div', {}, this.file.metadata.artist],
        ['br'],
        ['input#tags', { type : 'text' }]
      ];
    }
  }
}