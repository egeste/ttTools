ttTools.portability.views = {

  import : {
    render : function () {
      $('<style/>', {
        type : 'text/css',
        text : "\
        .mainPane.noBG { background-color:transparent; }\
        .import {\
          top:0;\
          left:0;\
          right:0;\
          bottom:0;\
          color:#fff;\
          text-align:center;\
          padding:30px 10px;\
          position:absolute;\
          background-color:#000;\
          border:2px dashed #fff;\
          opacity:0.8;\
          filter:Alpha(Opacity=80);\
        }\
      "}).appendTo($(document.body));

      var playlist = $('#playlist');
      var dropZone = $('<div/>', {
        id      : 'importDropZone',
        'class' : 'import'
      }).html(
        'Drop ttTools playlist file here to import.'
      );
      var dropZoneContainer = $('<div/>', {
        id      : 'dropZoneContainer',
        'class' : 'mainPane noBG'
      }).append(
        dropZone
      ).hide().appendTo(playlist);
      var importProgressContainer = $('<div/>', {
        id      : 'importProgressContainer',
        'class' : 'mainPane noBG'
      }).append(
        $('<div/>', {
          id      : 'importProgress',
          'class' : 'import'
        }).html(
          "Processing..."
        ).append(
          $('<div/>', {
            id : 'importProgressBar'
          }).progressbar()
        ).append(
          '<span id="importCount">0</span> of <span id="importTotal">0</span>'
        ).append(
          '<br/><br/>Yep, it\'s super slow. Want to help make it faster? Click the ? feedback icon above your DJ queue and send the message:<br /><br/>"I <3 ttTools! Please add batch fid support for the playlist.add API method!"'
        )
      ).hide().appendTo(playlist);

      playlist.get(0).addEventListener('dragenter', function (e) {
        dropZoneContainer.show();
      });
      dropZone.get(0).addEventListener('dragleave', function (e) {
        dropZoneContainer.hide();
      });
      dropZone.get(0).addEventListener('dragover', function (e) {
        e.preventDefault();
      });
      dropZone.get(0).addEventListener('drop', function (e) {
        dropZoneContainer.hide();
        importProgressContainer.show();
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          var reader = new FileReader();
          reader.onload = function () {
            ttTools.portability.importPlaylist(JSON.parse(this.result));
          }
          reader.readAsText(e.dataTransfer.files[i], 'utf-8');
        }
      });
    },

    update : function () {
      var total = ttTools.portability.importProcess.operations.length;
      var completed = ttTools.portability.importProcess.completed;
      $('#importTotal').html(total);
      $('#importCount').html(completed);
      $('#importProgressBar').progressbar('option', 'value', (completed / total) * 100);
      if (completed == total) {
        if (ttTools.database.isSupported()) {
          ttTools.tags.updateQueue();
          ttTools.tags.addSongOverride();
        }
        $('#importProgressContainer').hide();
      }
    }
  }

  // menu : {
  //   render : function () {
  //     $('<div class="menuItem">Tagging & Export</div>').click(function (e) {
  //       ttTools.tags.views.settings.render();
  //     }).insertBefore($('div#menuh').children().last());
  //   }
  // },

  // settings : {
  //   render : function () {
  //     util.showOverlay(util.buildTree(this.tree()));

  //     $('<style/>', {
  //       type : 'text/css',
  //       text : "div.field.tagexport { padding-right:20px; }"
  //     }).appendTo($('div.tagsOverlay.modal'));
      
  //     ttTools.tags.getAll(function (tx, result) {
  //       var tags = {};
  //       for (var i=0; i<result.rows.length; i++) { tags[result.rows.item(i).tag] = 1; }
  //       var tags = Object.keys(tags);
  //       $('#tagExport').tagsInput({
  //         width            : '100%',
  //         autocomplete_url : false,
  //         autocomplete     : {
  //           source : tags
  //         }
  //       });
  //     });

  //     $('#tagExportButton').button().click(function (e) {
  //       var tags = $('#tagExport').val().split(',');
  //       ttTools.portability.exportSongsWithTags(tags);
  //     });

  //     $('#resetTags').click(function() {
  //       if (!confirm('Are you sure? This will delete your entire tags database.')) { return false; }
  //       ttTools.tags.resetData();
  //     });
  //   },

  //   tree : function () {
  //     return ['div.tagsOverlay.modal', {},
  //       ['div.close-x', {
  //         event : {
  //           click : util.hideOverlay
  //         }
  //       }],
  //       ['h1', 'Tags & Export'],
  //       ['br'],
  //       ['div.fields', {},
  //         ['div.field.tagexport', {},
  //           ['div', {}, 'Export songs with specific tags:'],
  //           ['input#tagExport', { type : 'text' }],
  //           ['button#tagExportButton', 'Export']
  //         ]
  //       ],
  //       ['a#resetTags', { href : 'javascript:void(0);' }, 'Reset Tags Database']
  //     ];
  //   }
  // }
  
}
