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
        if (ttTools.database.isSupported()) ttTools.tags.updateQueue();
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
