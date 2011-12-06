(function () {
    var v = 0,
        q = [],
        o = {},
        s = {},
        A = {
            "<": "lt",
            ">": "gt",
            "&": "amp",
            '"': "quot",
            "'": "#39"
        },
        p = /[<>&\"\']/g,
        z, y = window.setTimeout,
        x = {},
        w;

    function t() {
        this.returnValue = false;
    }
    function r() {
        this.cancelBubble = true;
    }(function (e) {
        var d = e.split(/,/),
            c, a, b;
        for (c = 0; c < d.length; c += 2) {
            b = d[c + 1].split(/ /);
            for (a = 0; a < b.length; a++) {
                s[b[a]] = d[c];
            }
        }
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/vnd.rn-realvideo,rv,text/csv,csv,text/plain,asc txt text diff log,application/octet-stream,exe");
    var u = {
        VERSION: "1.4.3.2",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        IMAGE_FORMAT_ERROR: -700,
        IMAGE_MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: s,
        extend: function (a) {
            u.each(arguments, function (c, b) {
                if (b > 0) {
                    u.each(c, function (d, e) {
                        a[e] = d;
                    });
                }
            });
            return a;
        },
        cleanName: function (c) {
            var b, a;
            a = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
            for (b = 0; b < a.length; b += 2) {
                c = c.replace(a[b], a[b + 1]);
            }
            c = c.replace(/\s+/g, "_");
            c = c.replace(/[^a-z0-9_\-\.]+/gi, "");
            return c;
        },
        addRuntime: function (b, a) {
            a.name = b;
            q[b] = a;
            q.push(a);
            return a;
        },
        guid: function () {
            var b = new Date().getTime().toString(32),
                a;
            for (a = 0; a < 5; a++) {
                b += Math.floor(Math.random() * 65535).toString(32);
            }
            return (u.guidPrefix || "p") + b + (v++).toString(32);
        },
        buildUrl: function (b, c) {
            var a = "";
            u.each(c, function (d, e) {
                a += (a ? "&" : "") + encodeURIComponent(e) + "=" + encodeURIComponent(d);
            });
            if (a) {
                b += (b.indexOf("?") > 0 ? "&" : "?") + a;
            }
            return b;
        },
        each: function (b, a) {
            var c, d, e;
            if (b) {
                c = b.length;
                if (c === z) {
                    for (d in b) {
                        if (b.hasOwnProperty(d)) {
                            if (a(b[d], d) === false) {
                                return;
                            }
                        }
                    }
                } else {
                    for (e = 0; e < c; e++) {
                        if (a(b[e], e) === false) {
                            return;
                        }
                    }
                }
            }
        },
        formatSize: function (a) {
            if (a === z || /\D/.test(a)) {
                return u.translate("N/A");
            }
            if (a > 1073741824) {
                return Math.round(a / 1073741824, 1) + " GB";
            }
            if (a > 1048576) {
                return Math.round(a / 1048576, 1) + " MB";
            }
            if (a > 1024) {
                return Math.round(a / 1024, 1) + " KB";
            }
            return a + " b";
        },
        getPos: function (c, h) {
            var g = 0,
                j = 0,
                e, f = document,
                b, a;
            c = c;
            h = h || f.body;

            function d(n) {
                var k, E, m = 0,
                    l = 0;
                if (n) {
                    E = n.getBoundingClientRect();
                    k = f.compatMode === "CSS1Compat" ? f.documentElement : f.body;
                    m = E.left + k.scrollLeft;
                    l = E.top + k.scrollTop;
                }
                return {
                    x: m,
                    y: l
                };
            }
            if (c && c.getBoundingClientRect && (navigator.userAgent.indexOf("MSIE") > 0 && f.documentMode !== 8)) {
                b = d(c);
                a = d(h);
                return {
                    x: b.x - a.x,
                    y: b.y - a.y
                };
            }
            e = c;
            while (e && e != h && e.nodeType) {
                g += e.offsetLeft || 0;
                j += e.offsetTop || 0;
                e = e.offsetParent;
            }
            e = c.parentNode;
            while (e && e != h && e.nodeType) {
                g -= e.scrollLeft || 0;
                j -= e.scrollTop || 0;
                e = e.parentNode;
            }
            return {
                x: g,
                y: j
            };
        },
        getSize: function (a) {
            return {
                w: a.offsetWidth || a.clientWidth,
                h: a.offsetHeight || a.clientHeight
            };
        },
        parseSize: function (b) {
            var a;
            if (typeof (b) == "string") {
                b = /^([0-9]+)([mgk]?)$/.exec(b.toLowerCase().replace(/[^0-9mkg]/g, ""));
                a = b[2];
                b = +b[1];
                if (a == "g") {
                    b *= 1073741824;
                }
                if (a == "m") {
                    b *= 1048576;
                }
                if (a == "k") {
                    b *= 1024;
                }
            }
            return b;
        },
        xmlEncode: function (a) {
            return a ? ("" + a).replace(p, function (b) {
                return A[b] ? "&" + A[b] + ";" : b;
            }) : a;
        },
        toArray: function (a) {
            var b, c = [];
            for (b = 0; b < a.length; b++) {
                c[b] = a[b];
            }
            return c;
        },
        addI18n: function (a) {
            return u.extend(o, a);
        },
        translate: function (a) {
            return o[a] || a;
        },
        isEmptyObj: function (b) {
            if (b === z) {
                return true;
            }
            for (var a in b) {
                return false;
            }
            return true;
        },
        hasClass: function (a, b) {
            var c;
            if (a.className == "") {
                return false;
            }
            c = new RegExp("(^|\\s+)" + b + "(\\s+|$)");
            return c.test(a.className);
        },
        addClass: function (a, b) {
            if (!u.hasClass(a, b)) {
                a.className = a.className == "" ? b : a.className.replace(/\s+$/, "") + " " + b;
            }
        },
        removeClass: function (a, b) {
            var c = new RegExp("(^|\\s+)" + b + "(\\s+|$)");
            a.className = a.className.replace(c, function (e, f, d) {
                return f === " " && d === " " ? " " : "";
            });
        },
        getStyle: function (a, b) {
            if (a.currentStyle) {
                return a.currentStyle[b];
            } else {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(a, null)[b];
                }
            }
        },
        addEvent: function (b, g, a) {
            var c, d, e, f;
            f = arguments[3];
            g = g.toLowerCase();
            if (w === z) {
                w = "Plupload_" + u.guid();
            }
            if (b.addEventListener) {
                c = a;
                b.addEventListener(g, c, false);
            } else {
                if (b.attachEvent) {
                    c = function () {
                        var h = window.event;
                        if (!h.target) {
                            h.target = h.srcElement;
                        }
                        h.preventDefault = t;
                        h.stopPropagation = r;
                        a(h);
                    };
                    b.attachEvent("on" + g, c);
                }
            }
            if (b[w] === z) {
                b[w] = u.guid();
            }
            if (!x.hasOwnProperty(b[w])) {
                x[b[w]] = {};
            }
            d = x[b[w]];
            if (!d.hasOwnProperty(g)) {
                d[g] = [];
            }
            d[g].push({
                func: c,
                orig: a,
                key: f
            });
        },
        removeEvent: function (b, g) {
            var d, a, e;
            if (typeof (arguments[2]) == "function") {
                a = arguments[2];
            } else {
                e = arguments[2];
            }
            g = g.toLowerCase();
            if (b[w] && x[b[w]] && x[b[w]][g]) {
                d = x[b[w]][g];
            } else {
                return;
            }
            for (var f = d.length - 1; f >= 0; f--) {
                if (d[f].key === e || d[f].orig === a) {
                    if (b.detachEvent) {
                        b.detachEvent("on" + g, d[f].func);
                    } else {
                        if (b.removeEventListener) {
                            b.removeEventListener(g, d[f].func, false);
                        }
                    }
                    d[f].orig = null;
                    d[f].func = null;
                    d.splice(f, 1);
                    if (a !== z) {
                        break;
                    }
                }
            }
            if (!d.length) {
                delete x[b[w]][g];
            }
            if (u.isEmptyObj(x[b[w]])) {
                delete x[b[w]];
                try {
                    delete b[w];
                } catch (c) {
                    b[w] = z;
                }
            }
        },
        removeAllEvents: function (a) {
            var b = arguments[1];
            if (a[w] === z || !a[w]) {
                return;
            }
            u.each(x[a[w]], function (c, d) {
                u.removeEvent(a, d, b);
            });
        }
    };
    u.Uploader = function (d) {
        var f = {},
            a, b = [],
            e;
        a = new u.QueueProgress();
        d = u.extend({
            chunk_size: 0,
            multipart: true,
            multi_selection: true,
            file_data_name: "file",
            filters: []
        }, d);

        function c() {
            var j, h = 0,
                k;
            if (this.state == u.STARTED) {
                for (k = 0; k < b.length; k++) {
                    if (!j && b[k].status == u.QUEUED) {
                        j = b[k];
                        j.status = u.UPLOADING;
                        if (this.trigger("BeforeUpload", j)) {
                            this.trigger("UploadFile", j);
                        }
                    } else {
                        h++;
                    }
                }
                if (h == b.length) {
                    this.trigger("UploadComplete", b);
                    this.stop();
                }
            }
        }
        function g() {
            var h, j;
            a.reset();
            for (h = 0; h < b.length; h++) {
                j = b[h];
                if (j.size !== z) {
                    a.size += j.size;
                    a.loaded += j.loaded;
                } else {
                    a.size = z;
                }
                if (j.status == u.DONE) {
                    a.uploaded++;
                } else {
                    if (j.status == u.FAILED) {
                        a.failed++;
                    } else {
                        a.queued++;
                    }
                }
            }
            if (a.size === z) {
                a.percent = b.length > 0 ? Math.ceil(a.uploaded / b.length * 100) : 0;
            } else {
                a.bytesPerSec = Math.ceil(a.loaded / ((+new Date() - e || 1) / 1000));
                a.percent = a.size > 0 ? Math.ceil(a.loaded / a.size * 100) : 0;
            }
        }
        u.extend(this, {
            state: u.STOPPED,
            runtime: "",
            features: {},
            files: b,
            settings: d,
            total: a,
            id: u.guid(),
            init: function () {
                var j = this,
                    C, h, k, m = 0,
                    n;
                if (typeof (d.preinit) == "function") {
                    d.preinit(j);
                } else {
                    u.each(d.preinit, function (B, E) {
                        j.bind(E, B);
                    });
                }
                d.page_url = d.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/");
                if (!/^(\w+:\/\/|\/)/.test(d.url)) {
                    d.url = d.page_url + d.url;
                }
                d.chunk_size = u.parseSize(d.chunk_size);
                d.max_file_size = u.parseSize(d.max_file_size);
                j.bind("FilesAdded", function (O, L) {
                    var M, N, J = 0,
                        B, K = d.filters;
                    if (K && K.length) {
                        B = [];
                        u.each(K, function (D) {
                            u.each(D.extensions.split(/,/), function (E) {
                                if (/^\s*\*\s*$/.test(E)) {
                                    B.push("\\.*");
                                } else {
                                    B.push("\\." + E.replace(new RegExp("[" + ("/^$.*+?|()[]{}\\".replace(/./g, "\\$&")) + "]", "g"), "\\$&"));
                                }
                            });
                        });
                        B = new RegExp(B.join("|") + "$", "i");
                    }
                    for (M = 0; M < L.length; M++) {
                        N = L[M];
                        N.loaded = 0;
                        N.percent = 0;
                        N.status = u.QUEUED;
                        if (B && !B.test(N.name)) {
                            O.trigger("Error", {
                                code: u.FILE_EXTENSION_ERROR,
                                message: u.translate("File extension error."),
                                file: N
                            });
                            continue;
                        }
                        if (N.size !== z && N.size > d.max_file_size) {
                            O.trigger("Error", {
                                code: u.FILE_SIZE_ERROR,
                                message: u.translate("File size error."),
                                file: N
                            });
                            continue;
                        }
                        b.push(N);
                        J++;
                    }
                    if (J) {
                        y(function () {
                            j.trigger("QueueChanged");
                            j.refresh();
                        }, 1);
                    } else {
                        return false;
                    }
                });
                if (d.unique_names) {
                    j.bind("UploadFile", function (I, H) {
                        var B = H.name.match(/\.([^.]+)$/),
                            G = "tmp";
                        if (B) {
                            G = B[1];
                        }
                        H.target_name = H.id + "." + G;
                    });
                }
                j.bind("UploadProgress", function (E, B) {
                    B.percent = B.size > 0 ? Math.ceil(B.loaded / B.size * 100) : 100;
                    g();
                });
                j.bind("StateChanged", function (B) {
                    if (B.state == u.STARTED) {
                        e = (+new Date());
                    } else {
                        if (B.state == u.STOPPED) {
                            for (C = B.files.length - 1; C >= 0; C--) {
                                if (B.files[C].status == u.UPLOADING) {
                                    B.files[C].status = u.QUEUED;
                                    g();
                                }
                            }
                        }
                    }
                });
                j.bind("QueueChanged", g);
                j.bind("Error", function (E, B) {
                    if (B.file) {
                        B.file.status = u.FAILED;
                        g();
                        if (E.state == u.STARTED) {
                            y(function () {
                                c.call(j);
                            }, 1);
                        }
                    }
                });
                j.bind("FileUploaded", function (E, B) {
                    B.status = u.DONE;
                    B.loaded = B.size;
                    E.trigger("UploadProgress", B);
                    y(function () {
                        c.call(j);
                    }, 1);
                });
                if (d.runtimes) {
                    h = [];
                    n = d.runtimes.split(/\s?,\s?/);
                    for (C = 0; C < n.length; C++) {
                        if (q[n[C]]) {
                            h.push(q[n[C]]);
                        }
                    }
                } else {
                    h = q;
                }
                function l() {
                    var B = h[m++],
                        G, I, H;
                    if (B) {
                        G = B.getFeatures();
                        I = j.settings.required_features;
                        if (I) {
                            I = I.split(",");
                            for (H = 0; H < I.length; H++) {
                                if (!G[I[H]]) {
                                    l();
                                    return;
                                }
                            }
                        }
                        B.init(j, function (D) {
                            if (D && D.success) {
                                j.features = G;
                                j.runtime = B.name;
                                j.trigger("Init", {
                                    runtime: B.name
                                });
                                j.trigger("PostInit");
                                j.refresh();
                            } else {
                                l();
                            }
                        });
                    } else {
                        j.trigger("Error", {
                            code: u.INIT_ERROR,
                            message: u.translate("Init error.")
                        });
                    }
                }
                l();
                if (typeof (d.init) == "function") {
                    d.init(j);
                } else {
                    u.each(d.init, function (B, E) {
                        j.bind(E, B);
                    });
                }
            },
            refresh: function () {
                this.trigger("Refresh");
            },
            start: function () {
                if (this.state != u.STARTED) {
                    this.state = u.STARTED;
                    this.trigger("StateChanged");
                    c.call(this);
                }
            },
            stop: function () {
                if (this.state != u.STOPPED) {
                    this.state = u.STOPPED;
                    this.trigger("StateChanged");
                }
            },
            getFile: function (h) {
                var j;
                for (j = b.length - 1; j >= 0; j--) {
                    if (b[j].id === h) {
                        return b[j];
                    }
                }
            },
            removeFile: function (h) {
                var j;
                for (j = b.length - 1; j >= 0; j--) {
                    if (b[j].id === h.id) {
                        return this.splice(j, 1)[0];
                    }
                }
            },
            splice: function (h, k) {
                var j;
                j = b.splice(h === z ? 0 : h, k === z ? b.length : k);
                this.trigger("FilesRemoved", j);
                this.trigger("QueueChanged");
                return j;
            },
            trigger: function (j) {
                var l = f[j.toLowerCase()],
                    h, k;
                if (l) {
                    k = Array.prototype.slice.call(arguments);
                    k[0] = this;
                    for (h = 0; h < l.length; h++) {
                        if (l[h].func.apply(l[h].scope, k) === false) {
                            return false;
                        }
                    }
                }
                return true;
            },
            hasEventListener: function (h) {
                return !!f[h.toLowerCase()];
            },
            bind: function (k, h, j) {
                var l;
                k = k.toLowerCase();
                l = f[k] || [];
                l.push({
                    func: h,
                    scope: j || this
                });
                f[k] = l;
            },
            unbind: function (k) {
                k = k.toLowerCase();
                var l = f[k],
                    j, h = arguments[1];
                if (l) {
                    if (h !== z) {
                        for (j = l.length - 1; j >= 0; j--) {
                            if (l[j].func === h) {
                                l.splice(j, 1);
                                break;
                            }
                        }
                    } else {
                        l = [];
                    }
                    if (!l.length) {
                        delete f[k];
                    }
                }
            },
            unbindAll: function () {
                var h = this;
                u.each(f, function (j, k) {
                    h.unbind(k);
                });
            },
            destroy: function () {
                this.trigger("Destroy");
                this.unbindAll();
            }
        });
    };
    u.File = function (a, c, b) {
        var d = this;
        d.id = a;
        d.name = c;
        d.size = b;
        d.loaded = 0;
        d.percent = 0;
        d.status = 0;
    };
    u.Runtime = function () {
        this.getFeatures = function () {};
        this.init = function (b, a) {};
    };
    u.QueueProgress = function () {
        var a = this;
        a.size = 0;
        a.loaded = 0;
        a.uploaded = 0;
        a.failed = 0;
        a.queued = 0;
        a.percent = 0;
        a.bytesPerSec = 0;
        a.reset = function () {
            a.size = a.loaded = a.uploaded = a.failed = a.queued = a.percent = a.bytesPerSec = 0;
        };
    };
    u.runtimes = {};
    window.plupload = u;
})();
(function () {
    if (window.google && google.gears) {
        return;
    }
    var d = null;
    if (typeof GearsFactory != "undefined") {
        d = new GearsFactory();
    } else {
        try {
            d = new ActiveXObject("Gears.Factory");
            if (d.getBuildInfo().indexOf("ie_mobile") != -1) {
                d.privateSetGlobalObject(this);
            }
        } catch (c) {
            if ((typeof navigator.mimeTypes != "undefined") && navigator.mimeTypes["application/x-googlegears"]) {
                d = document.createElement("object");
                d.style.display = "none";
                d.width = 0;
                d.height = 0;
                d.type = "application/x-googlegears";
                document.documentElement.appendChild(d);
            }
        }
    }
    if (!d) {
        return;
    }
    if (!window.google) {
        window.google = {};
    }
    if (!google.gears) {
        google.gears = {
            factory: d
        };
    }
})();
(function (k, g, m, l) {
    var j = {};

    function h(e, c, a) {
        var f, d, b, p;
        d = google.gears.factory.create("beta.canvas");
        try {
            d.decode(e);
            if (!c.width) {
                c.width = d.width;
            }
            if (!c.height) {
                c.height = d.height;
            }
            p = Math.min(width / d.width, height / d.height);
            if (p < 1 || (p === 1 && a === "image/jpeg")) {
                d.resize(Math.round(d.width * p), Math.round(d.height * p));
                if (c.quality) {
                    return d.encode(a, {
                        quality: c.quality / 100
                    });
                }
                return d.encode(a);
            }
        } catch (q) {}
        return e;
    }
    m.runtimes.Gears = m.addRuntime("gears", {
        getFeatures: function () {
            return {
                dragdrop: true,
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            };
        },
        init: function (c, a) {
            var b;
            if (!k.google || !google.gears) {
                return a({
                    success: false
                });
            }
            try {
                b = google.gears.factory.create("beta.desktop");
            } catch (d) {
                return a({
                    success: false
                });
            }
            function e(t) {
                var u, f, s = [],
                    r;
                for (f = 0; f < t.length; f++) {
                    u = t[f];
                    r = m.guid();
                    j[r] = u.blob;
                    s.push(new m.File(r, u.name, u.blob.length));
                }
                c.trigger("FilesAdded", s);
            }
            c.bind("PostInit", function () {
                var o = c.settings,
                    f = g.getElementById(o.drop_element);
                if (f) {
                    m.addEvent(f, "dragover", function (n) {
                        b.setDropEffect(n, "copy");
                        n.preventDefault();
                    }, c.id);
                    m.addEvent(f, "drop", function (n) {
                        var q = b.getDragData(n, "application/x-gears-files");
                        if (q) {
                            e(q.files);
                        }
                        n.preventDefault();
                    }, c.id);
                    f = 0;
                }
                m.addEvent(g.getElementById(o.browse_button), "click", function (n) {
                    var t = [],
                        v, w, u;
                    n.preventDefault();
                    no_type_restriction: for (v = 0; v < o.filters.length; v++) {
                        u = o.filters[v].extensions.split(",");
                        for (w = 0; w < u.length; w++) {
                            if (u[w] === "*") {
                                t = [];
                                break no_type_restriction;
                            }
                            t.push("." + u[w]);
                        }
                    }
                    b.openFiles(e, {
                        singleFile: !o.multi_selection,
                        filter: t
                    });
                }, c.id);
            });
            c.bind("UploadFile", function (C, w) {
                var A = 0,
                    B, v, f = 0,
                    x = C.settings.resize,
                    z;
                if (x && /\.(png|jpg|jpeg)$/i.test(w.name)) {
                    j[w.id] = h(j[w.id], x, /\.png$/i.test(w.name) ? "image/png" : "image/jpeg");
                }
                w.size = j[w.id].length;
                v = C.settings.chunk_size;
                z = v > 0;
                B = Math.ceil(w.size / v);
                if (!z) {
                    v = w.size;
                    B = 1;
                }
                function y() {
                    var r, t, p = C.settings.multipart,
                        q = 0,
                        o = {
                            name: w.target_name || w.name
                        },
                        n = C.settings.url;

                    function s(N) {
                        var O, u = "----pluploadboundary" + m.guid(),
                            L = "--",
                            J = "\r\n",
                            M, K;
                        if (p) {
                            r.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + u);
                            O = google.gears.factory.create("beta.blobbuilder");
                            m.each(m.extend(o, C.settings.multipart_params), function (D, E) {
                                O.append(L + u + J + 'Content-Disposition: form-data; name="' + E + '"' + J + J);
                                O.append(D + J);
                            });
                            K = m.mimeTypes[w.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream";
                            O.append(L + u + J + 'Content-Disposition: form-data; name="' + C.settings.file_data_name + '"; filename="' + w.name + '"' + J + "Content-Type: " + K + J + J);
                            O.append(N);
                            O.append(J + L + u + L + J);
                            M = O.getAsBlob();
                            q = M.length - N.length;
                            N = M;
                        }
                        r.send(N);
                    }
                    if (w.status == m.DONE || w.status == m.FAILED || C.state == m.STOPPED) {
                        return;
                    }
                    if (z) {
                        o.chunk = A;
                        o.chunks = B;
                    }
                    t = Math.min(v, w.size - (A * v));
                    if (!p) {
                        n = m.buildUrl(C.settings.url, o);
                    }
                    r = google.gears.factory.create("beta.httprequest");
                    r.open("POST", n);
                    if (!p) {
                        r.setRequestHeader("Content-Disposition", 'attachment; filename="' + w.name + '"');
                        r.setRequestHeader("Content-Type", "application/octet-stream");
                    }
                    m.each(C.settings.headers, function (u, E) {
                        r.setRequestHeader(E, u);
                    });
                    r.upload.onprogress = function (u) {
                        w.loaded = f + u.loaded - q;
                        C.trigger("UploadProgress", w);
                    };
                    r.onreadystatechange = function () {
                        var u;
                        if (r.readyState == 4) {
                            if (r.status == 200) {
                                u = {
                                    chunk: A,
                                    chunks: B,
                                    response: r.responseText,
                                    status: r.status
                                };
                                C.trigger("ChunkUploaded", w, u);
                                if (u.cancelled) {
                                    w.status = m.FAILED;
                                    return;
                                }
                                f += t;
                                if (++A >= B) {
                                    w.status = m.DONE;
                                    C.trigger("FileUploaded", w, {
                                        response: r.responseText,
                                        status: r.status
                                    });
                                } else {
                                    y();
                                }
                            } else {
                                C.trigger("Error", {
                                    code: m.HTTP_ERROR,
                                    message: m.translate("HTTP Error."),
                                    file: w,
                                    chunk: A,
                                    chunks: B,
                                    status: r.status
                                });
                            }
                        }
                    };
                    if (A < B) {
                        s(j[w.id].slice(A * v, t));
                    }
                }
                y();
            });
            c.bind("Destroy", function (f) {
                var s, r, q = {
                    browseButton: f.settings.browse_button,
                    dropElm: f.settings.drop_element
                };
                for (s in q) {
                    r = g.getElementById(q[s]);
                    if (r) {
                        m.removeAllEvents(r, f.id);
                    }
                }
            });
            a({
                success: true
            });
        }
    });
})(window, document, plupload);
(function (m, j, p, o) {
    var k = {},
        l = {};

    function q(e) {
        var f, a = typeof e,
            d, b, c;
        if (a === "string") {
            f = "\bb\tt\nn\ff\rr\"\"''\\\\";
            return '"' + e.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g, function (g, h) {
                var s = f.indexOf(h);
                if (s + 1) {
                    return "\\" + f.charAt(s + 1);
                }
                g = h.charCodeAt().toString(16);
                return "\\u" + "0000".substring(g.length) + g;
            }) + '"';
        }
        if (a == "object") {
            d = e.length !== o;
            f = "";
            if (d) {
                for (b = 0; b < e.length; b++) {
                    if (f) {
                        f += ",";
                    }
                    f += q(e[b]);
                }
                f = "[" + f + "]";
            } else {
                for (c in e) {
                    if (e.hasOwnProperty(c)) {
                        if (f) {
                            f += ",";
                        }
                        f += q(c) + ":" + q(e[c]);
                    }
                }
                f = "{" + f + "}";
            }
            return f;
        }
        if (e === o) {
            return "null";
        }
        return "" + e;
    }
    function n(A) {
        var x = false,
            w = null,
            d = null,
            h, g, f, y, e, b = 0;
        try {
            try {
                d = new ActiveXObject("AgControl.AgControl");
                if (d.IsVersionSupported(A)) {
                    x = true;
                }
                d = null;
            } catch (a) {
                var c = navigator.plugins["Silverlight Plug-In"];
                if (c) {
                    h = c.description;
                    if (h === "1.0.30226.2") {
                        h = "2.0.30226.2";
                    }
                    g = h.split(".");
                    while (g.length > 3) {
                        g.pop();
                    }
                    while (g.length < 4) {
                        g.push(0);
                    }
                    f = A.split(".");
                    while (f.length > 4) {
                        f.pop();
                    }
                    do {
                        y = parseInt(f[b], 10);
                        e = parseInt(g[b], 10);
                        b++;
                    } while (b < f.length && y === e);
                    if (y <= e && !isNaN(y)) {
                        x = true;
                    }
                }
            }
        } catch (z) {
            x = false;
        }
        return x;
    }
    p.silverlight = {
        trigger: function (e, c) {
            var a = k[e],
                b, d;
            if (a) {
                d = p.toArray(arguments).slice(1);
                d[0] = "Silverlight:" + c;
                setTimeout(function () {
                    a.trigger.apply(a, d);
                }, 0);
            }
        }
    };
    p.runtimes.Silverlight = p.addRuntime("silverlight", {
        getFeatures: function () {
            return {
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            };
        },
        init: function (f, e) {
            var g, a = "",
                h = f.settings.filters,
                b, c = j.body;
            if (!n("2.0.31005.0") || (m.opera && m.opera.buildNumber)) {
                e({
                    success: false
                });
                return;
            }
            l[f.id] = false;
            k[f.id] = f;
            g = j.createElement("div");
            g.id = f.id + "_silverlight_container";
            p.extend(g.style, {
                position: "absolute",
                top: "0px",
                background: f.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100px",
                height: "100px",
                overflow: "hidden",
                opacity: f.settings.shim_bgcolor || j.documentMode > 8 ? "" : 0.01
            });
            g.className = "plupload silverlight";
            if (f.settings.container) {
                c = j.getElementById(f.settings.container);
                if (p.getStyle(c, "position") === "static") {
                    c.style.position = "relative";
                }
            }
            c.appendChild(g);
            for (b = 0; b < h.length; b++) {
                a += (a != "" ? "|" : "") + h[b].title + " | *." + h[b].extensions.replace(/,/g, ";*.");
            }
            g.innerHTML = '<object id="' + f.id + '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="' + f.settings.silverlight_xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id=' + f.id + ",filter=" + a + ",multiselect=" + f.settings.multi_selection + '"/></object>';

            function d() {
                return j.getElementById(f.id + "_silverlight").content.Upload;
            }
            f.bind("Silverlight:Init", function () {
                var u, t = {};
                if (l[f.id]) {
                    return;
                }
                l[f.id] = true;
                f.bind("Silverlight:StartSelectFiles", function (r) {
                    u = [];
                });
                f.bind("Silverlight:SelectFile", function (A, s, z, y) {
                    var r;
                    r = p.guid();
                    t[r] = s;
                    t[s] = r;
                    u.push(new p.File(r, z, y));
                });
                f.bind("Silverlight:SelectSuccessful", function () {
                    if (u.length) {
                        f.trigger("FilesAdded", u);
                    }
                });
                f.bind("Silverlight:UploadChunkError", function (A, s, z, r, y) {
                    f.trigger("Error", {
                        code: p.IO_ERROR,
                        message: "IO Error.",
                        details: y,
                        file: A.getFile(t[s])
                    });
                });
                f.bind("Silverlight:UploadFileProgress", function (A, r, z, s) {
                    var y = A.getFile(t[r]);
                    if (y.status != p.FAILED) {
                        y.size = s;
                        y.loaded = z;
                        A.trigger("UploadProgress", y);
                    }
                });
                f.bind("Refresh", function (y) {
                    var x, s, r;
                    x = j.getElementById(y.settings.browse_button);
                    if (x) {
                        s = p.getPos(x, j.getElementById(y.settings.container));
                        r = p.getSize(x);
                        p.extend(j.getElementById(y.id + "_silverlight_container").style, {
                            top: s.y + "px",
                            left: s.x + "px",
                            width: r.w + "px",
                            height: r.h + "px"
                        });
                    }
                });
                f.bind("Silverlight:UploadChunkSuccessful", function (C, s, B, D, E) {
                    var r, A = C.getFile(t[s]);
                    r = {
                        chunk: B,
                        chunks: D,
                        response: E
                    };
                    C.trigger("ChunkUploaded", A, r);
                    if (A.status != p.FAILED) {
                        d().UploadNextChunk();
                    }
                    if (B == D - 1) {
                        A.status = p.DONE;
                        C.trigger("FileUploaded", A, {
                            response: E
                        });
                    }
                });
                f.bind("Silverlight:UploadSuccessful", function (y, r, x) {
                    var s = y.getFile(t[r]);
                    s.status = p.DONE;
                    y.trigger("FileUploaded", s, {
                        response: x
                    });
                });
                f.bind("FilesRemoved", function (w, r) {
                    var s;
                    for (s = 0; s < r.length; s++) {
                        d().RemoveFile(t[r[s].id]);
                    }
                });
                f.bind("UploadFile", function (y, s) {
                    var r = y.settings,
                        x = r.resize || {};
                    d().UploadFile(t[s.id], y.settings.url, q({
                        name: s.target_name || s.name,
                        mime: p.mimeTypes[s.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: r.chunk_size,
                        image_width: x.width,
                        image_height: x.height,
                        image_quality: x.quality || 90,
                        multipart: !! r.multipart,
                        multipart_params: r.multipart_params || {},
                        file_data_name: r.file_data_name,
                        headers: r.headers
                    }));
                });
                f.bind("Silverlight:MouseEnter", function (w) {
                    var s, r;
                    s = j.getElementById(f.settings.browse_button);
                    r = w.settings.browse_button_hover;
                    if (s && r) {
                        p.addClass(s, r);
                    }
                });
                f.bind("Silverlight:MouseLeave", function (w) {
                    var s, r;
                    s = j.getElementById(f.settings.browse_button);
                    r = w.settings.browse_button_hover;
                    if (s && r) {
                        p.removeClass(s, r);
                    }
                });
                f.bind("Silverlight:MouseLeftButtonDown", function (w) {
                    var s, r;
                    s = j.getElementById(f.settings.browse_button);
                    r = w.settings.browse_button_active;
                    if (s && r) {
                        p.addClass(s, r);
                        p.addEvent(j.body, "mouseup", function () {
                            p.removeClass(s, r);
                        });
                    }
                });
                f.bind("Sliverlight:StartSelectFiles", function (w) {
                    var s, r;
                    s = j.getElementById(f.settings.browse_button);
                    r = w.settings.browse_button_active;
                    if (s && r) {
                        p.removeClass(s, r);
                    }
                });
                f.bind("Destroy", function (s) {
                    var r;
                    p.removeAllEvents(j.body, s.id);
                    delete l[s.id];
                    delete k[s.id];
                    r = j.getElementById(s.id + "_silverlight_container");
                    if (r) {
                        c.removeChild(r);
                    }
                });
                e({
                    success: true
                });
            });
        }
    });
})(window, document, plupload);
(function (l, h, n, m) {
    var j = {},
        k = {};

    function o() {
        var c;
        try {
            c = navigator.plugins["Shockwave Flash"];
            c = c.description;
        } catch (a) {
            try {
                c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
            } catch (b) {
                c = "0.0";
            }
        }
        c = c.match(/\d+/g);
        return parseFloat(c[0] + "." + c[1]);
    }
    n.flash = {
        trigger: function (a, c, b) {
            setTimeout(function () {
                var f = j[a],
                    d, e;
                if (f) {
                    f.trigger("Flash:" + c, b);
                }
            }, 0);
        }
    };
    n.runtimes.Flash = n.addRuntime("flash", {
        getFeatures: function () {
            return {
                jpgresize: true,
                pngresize: true,
                maxWidth: 8091,
                maxHeight: 8091,
                chunks: true,
                progress: true,
                multipart: true
            };
        },
        init: function (g, b) {
            var c, r, f, a = 0,
                s = h.body;
            if (o() < 10) {
                b({
                    success: false
                });
                return;
            }
            k[g.id] = false;
            j[g.id] = g;
            c = h.getElementById(g.settings.browse_button);
            r = h.createElement("div");
            r.id = g.id + "_flash_container";
            n.extend(r.style, {
                position: "absolute",
                top: "0px",
                background: g.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100%",
                height: "100%"
            });
            r.className = "plupload flash";
            if (g.settings.container) {
                s = h.getElementById(g.settings.container);
                if (n.getStyle(s, "position") === "static") {
                    s.style.position = "relative";
                }
            }
            s.appendChild(r);
            f = "id=" + escape(g.id);
            r.innerHTML = '<object id="' + g.id + '_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="' + g.settings.flash_swf_url + '"><param name="movie" value="' + g.settings.flash_swf_url + '" /><param name="flashvars" value="' + f + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';

            function d() {
                return h.getElementById(g.id + "_flash");
            }
            function e() {
                if (a++ > 5000) {
                    b({
                        success: false
                    });
                    return;
                }
                if (!k[g.id]) {
                    setTimeout(e, 1);
                }
            }
            e();
            c = r = null;
            g.bind("Flash:Init", function () {
                var p = {},
                    q;
                d().setFileFilters(g.settings.filters, g.settings.multi_selection);
                if (k[g.id]) {
                    return;
                }
                k[g.id] = true;
                g.bind("UploadFile", function (A, y) {
                    var x = A.settings,
                        z = g.settings.resize || {};
                    d().uploadFile(p[y.id], x.url, {
                        name: y.target_name || y.name,
                        mime: n.mimeTypes[y.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: x.chunk_size,
                        width: z.width,
                        height: z.height,
                        quality: z.quality,
                        multipart: x.multipart,
                        multipart_params: x.multipart_params || {},
                        file_data_name: x.file_data_name,
                        format: /\.(jpg|jpeg)$/i.test(y.name) ? "jpg" : "png",
                        headers: x.headers,
                        urlstream_upload: x.urlstream_upload
                    });
                });
                g.bind("Flash:UploadProcess", function (x, y) {
                    var w = x.getFile(p[y.id]);
                    if (w.status != n.FAILED) {
                        w.loaded = y.loaded;
                        w.size = y.size;
                        x.trigger("UploadProgress", w);
                    }
                });
                g.bind("Flash:UploadChunkComplete", function (A, y) {
                    var x, z = A.getFile(p[y.id]);
                    x = {
                        chunk: y.chunk,
                        chunks: y.chunks,
                        response: y.text
                    };
                    A.trigger("ChunkUploaded", z, x);
                    if (z.status != n.FAILED) {
                        d().uploadNextChunk();
                    }
                    if (y.chunk == y.chunks - 1) {
                        z.status = n.DONE;
                        A.trigger("FileUploaded", z, {
                            response: y.text
                        });
                    }
                });
                g.bind("Flash:SelectFiles", function (D, A) {
                    var B, C, z = [],
                        E;
                    for (C = 0; C < A.length; C++) {
                        B = A[C];
                        E = n.guid();
                        p[E] = B.id;
                        p[B.id] = E;
                        z.push(new n.File(E, B.name, B.size));
                    }
                    if (z.length) {
                        g.trigger("FilesAdded", z);
                    }
                });
                g.bind("Flash:SecurityError", function (w, v) {
                    g.trigger("Error", {
                        code: n.SECURITY_ERROR,
                        message: n.translate("Security error."),
                        details: v.message,
                        file: g.getFile(p[v.id])
                    });
                });
                g.bind("Flash:GenericError", function (w, v) {
                    g.trigger("Error", {
                        code: n.GENERIC_ERROR,
                        message: n.translate("Generic error."),
                        details: v.message,
                        file: g.getFile(p[v.id])
                    });
                });
                g.bind("Flash:IOError", function (w, v) {
                    g.trigger("Error", {
                        code: n.IO_ERROR,
                        message: n.translate("IO error."),
                        details: v.message,
                        file: g.getFile(p[v.id])
                    });
                });
                g.bind("Flash:ImageError", function (w, v) {
                    g.trigger("Error", {
                        code: parseInt(v.code, 10),
                        message: n.translate("Image error."),
                        file: g.getFile(p[v.id])
                    });
                });
                g.bind("Flash:StageEvent:rollOver", function (y) {
                    var x, w;
                    x = h.getElementById(g.settings.browse_button);
                    w = y.settings.browse_button_hover;
                    if (x && w) {
                        n.addClass(x, w);
                    }
                });
                g.bind("Flash:StageEvent:rollOut", function (y) {
                    var x, w;
                    x = h.getElementById(g.settings.browse_button);
                    w = y.settings.browse_button_hover;
                    if (x && w) {
                        n.removeClass(x, w);
                    }
                });
                g.bind("Flash:StageEvent:mouseDown", function (y) {
                    var x, w;
                    x = h.getElementById(g.settings.browse_button);
                    w = y.settings.browse_button_active;
                    if (x && w) {
                        n.addClass(x, w);
                        n.addEvent(h.body, "mouseup", function () {
                            n.removeClass(x, w);
                        }, y.id);
                    }
                });
                g.bind("Flash:StageEvent:mouseUp", function (y) {
                    var x, w;
                    x = h.getElementById(g.settings.browse_button);
                    w = y.settings.browse_button_active;
                    if (x && w) {
                        n.removeClass(x, w);
                    }
                });
                g.bind("Flash:ExifData", function (w, v) {
                    g.trigger("ExifData", g.getFile(p[v.id]), v.data);
                });
                g.bind("Flash:GpsData", function (w, v) {
                    g.trigger("GpsData", g.getFile(p[v.id]), v.data);
                });
                g.bind("QueueChanged", function (u) {
                    g.refresh();
                });
                g.bind("FilesRemoved", function (y, w) {
                    var x;
                    for (x = 0; x < w.length; x++) {
                        d().removeFile(p[w[x].id]);
                    }
                });
                g.bind("StateChanged", function (u) {
                    g.refresh();
                });
                g.bind("Refresh", function (A) {
                    var z, y, x;
                    d().setFileFilters(g.settings.filters, g.settings.multi_selection);
                    z = h.getElementById(A.settings.browse_button);
                    if (z) {
                        y = n.getPos(z, h.getElementById(A.settings.container));
                        x = n.getSize(z);
                        n.extend(h.getElementById(A.id + "_flash_container").style, {
                            top: y.y + "px",
                            left: y.x + "px",
                            width: x.w + "px",
                            height: x.h + "px"
                        });
                    }
                });
                g.bind("Destroy", function (w) {
                    var v;
                    n.removeAllEvents(h.body, w.id);
                    delete k[w.id];
                    delete j[w.id];
                    v = h.getElementById(w.id + "_flash_container");
                    if (v) {
                        s.removeChild(v);
                    }
                });
                b({
                    success: true
                });
            });
        }
    });
})(window, document, plupload);
(function (b) {
    b.runtimes.BrowserPlus = b.addRuntime("browserplus", {
        getFeatures: function () {
            return {
                dragdrop: true,
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            };
        },
        init: function (m, k) {
            var o = window.BrowserPlus,
                l = {},
                p = m.settings,
                q = p.resize;

            function n(g) {
                var h, c, e = [],
                    d, f;
                for (c = 0; c < g.length; c++) {
                    d = g[c];
                    f = b.guid();
                    l[f] = d;
                    e.push(new b.File(f, d.name, d.size));
                }
                if (c) {
                    m.trigger("FilesAdded", e);
                }
            }
            function a() {
                m.bind("PostInit", function () {
                    var j, d = p.drop_element,
                        g = m.id + "_droptarget",
                        e = document.getElementById(d),
                        c;

                    function f(t, u) {
                        o.DragAndDrop.AddDropTarget({
                            id: t
                        }, function (r) {
                            o.DragAndDrop.AttachCallbacks({
                                id: t,
                                hover: function (s) {
                                    if (!s && u) {
                                        u();
                                    }
                                },
                                drop: function (s) {
                                    if (u) {
                                        u();
                                    }
                                    n(s);
                                }
                            }, function () {});
                        });
                    }
                    function h() {
                        document.getElementById(g).style.top = "-1000px";
                    }
                    if (e) {
                        if (document.attachEvent && (/MSIE/gi).test(navigator.userAgent)) {
                            j = document.createElement("div");
                            j.setAttribute("id", g);
                            b.extend(j.style, {
                                position: "absolute",
                                top: "-1000px",
                                background: "red",
                                filter: "alpha(opacity=0)",
                                opacity: 0
                            });
                            document.body.appendChild(j);
                            b.addEvent(e, "dragenter", function (v) {
                                var w, u;
                                w = document.getElementById(d);
                                u = b.getPos(w);
                                b.extend(document.getElementById(g).style, {
                                    top: u.y + "px",
                                    left: u.x + "px",
                                    width: w.offsetWidth + "px",
                                    height: w.offsetHeight + "px"
                                });
                            });
                            f(g, h);
                        } else {
                            f(d);
                        }
                    }
                    b.addEvent(document.getElementById(p.browse_button), "click", function (x) {
                        var z = [],
                            B, C, y = p.filters,
                            A;
                        x.preventDefault();
                        no_type_restriction: for (B = 0; B < y.length; B++) {
                            A = y[B].extensions.split(",");
                            for (C = 0; C < A.length; C++) {
                                if (A[C] === "*") {
                                    z = [];
                                    break no_type_restriction;
                                }
                                z.push(b.mimeTypes[A[C]]);
                            }
                        }
                        o.FileBrowse.OpenBrowseDialog({
                            mimeTypes: z
                        }, function (r) {
                            if (r.success) {
                                n(r.value);
                            }
                        });
                    });
                    e = j = null;
                });
                m.bind("UploadFile", function (g, t) {
                    var h = l[t.id],
                        u = {},
                        j = g.settings.chunk_size,
                        f, e = [];

                    function c(w, r) {
                        var s;
                        if (t.status == b.FAILED) {
                            return;
                        }
                        u.name = t.target_name || t.name;
                        if (j) {
                            u.chunk = "" + w;
                            u.chunks = "" + r;
                        }
                        s = e.shift();
                        o.Uploader.upload({
                            url: g.settings.url,
                            files: {
                                file: s
                            },
                            cookies: document.cookies,
                            postvars: b.extend(u, g.settings.multipart_params),
                            progressCallback: function (A) {
                                var v, z = 0;
                                f[w] = parseInt(A.filePercent * s.size / 100, 10);
                                for (v = 0; v < f.length; v++) {
                                    z += f[v];
                                }
                                t.loaded = z;
                                g.trigger("UploadProgress", t);
                            }
                        }, function (v) {
                            var z, A;
                            if (v.success) {
                                z = v.value.statusCode;
                                if (j) {
                                    g.trigger("ChunkUploaded", t, {
                                        chunk: w,
                                        chunks: r,
                                        response: v.value.body,
                                        status: z
                                    });
                                }
                                if (e.length > 0) {
                                    c(++w, r);
                                } else {
                                    t.status = b.DONE;
                                    g.trigger("FileUploaded", t, {
                                        response: v.value.body,
                                        status: z
                                    });
                                    if (z >= 400) {
                                        g.trigger("Error", {
                                            code: b.HTTP_ERROR,
                                            message: b.translate("HTTP Error."),
                                            file: t,
                                            status: z
                                        });
                                    }
                                }
                            } else {
                                g.trigger("Error", {
                                    code: b.GENERIC_ERROR,
                                    message: b.translate("Generic Error."),
                                    file: t,
                                    details: v.error
                                });
                            }
                        });
                    }
                    function d(r) {
                        t.size = r.size;
                        if (j) {
                            o.FileAccess.chunk({
                                file: r,
                                chunkSize: j
                            }, function (y) {
                                if (y.success) {
                                    var s = y.value,
                                        A = s.length;
                                    f = Array(A);
                                    for (var z = 0; z < A; z++) {
                                        f[z] = 0;
                                        e.push(s[z]);
                                    }
                                    c(0, A);
                                }
                            });
                        } else {
                            f = Array(1);
                            e.push(r);
                            c(0, 1);
                        }
                    }
                    if (q && /\.(png|jpg|jpeg)$/i.test(t.name)) {
                        BrowserPlus.ImageAlter.transform({
                            file: h,
                            quality: q.quality || 90,
                            actions: [{
                                scale: {
                                    maxwidth: q.width,
                                    maxheight: q.height
                                }
                            }]
                        }, function (r) {
                            if (r.success) {
                                d(r.value.file);
                            }
                        });
                    } else {
                        d(h);
                    }
                });
                k({
                    success: true
                });
            }
            if (o) {
                o.init(function (c) {
                    var d = [{
                        service: "Uploader",
                        version: "3"
                    }, {
                        service: "DragAndDrop",
                        version: "1"
                    }, {
                        service: "FileBrowse",
                        version: "1"
                    }, {
                        service: "FileAccess",
                        version: "2"
                    }];
                    if (q) {
                        d.push({
                            service: "ImageAlter",
                            version: "4"
                        });
                    }
                    if (c.success) {
                        o.require({
                            services: d
                        }, function (e) {
                            if (e.success) {
                                a();
                            } else {
                                k();
                            }
                        });
                    } else {
                        k();
                    }
                });
            } else {
                k();
            }
        }
    });
})(plupload);
(function (r, p, q, u) {
    var w = {},
        s;

    function n(b, a) {
        var c;
        if ("FileReader" in r) {
            c = new FileReader();
            c.readAsDataURL(b);
            c.onload = function () {
                a(c.result);
            };
        } else {
            return a(b.getAsDataURL());
        }
    }
    function o(b, a) {
        var c;
        if ("FileReader" in r) {
            c = new FileReader();
            c.readAsBinaryString(b);
            c.onload = function () {
                a(c.result);
            };
        } else {
            return a(b.getAsBinary());
        }
    }
    function v(a, c, e, f) {
        var b, d, g, j, h = this;
        n(w[a.id], function (k) {
            b = p.createElement("canvas");
            b.style.display = "none";
            p.body.appendChild(b);
            d = b.getContext("2d");
            g = new Image();
            g.onerror = g.onabort = function () {
                f({
                    success: false
                });
            };
            g.onload = function () {
                var G, m, E, F, l;
                if (!c.width) {
                    c.width = g.width;
                }
                if (!c.height) {
                    c.height = g.height;
                }
                j = Math.min(c.width / g.width, c.height / g.height);
                if (j < 1 || (j === 1 && e === "image/jpeg")) {
                    G = Math.round(g.width * j);
                    m = Math.round(g.height * j);
                    b.width = G;
                    b.height = m;
                    d.drawImage(g, 0, 0, G, m);
                    if (e === "image/jpeg") {
                        F = new t(atob(k.substring(k.indexOf("base64,") + 7)));
                        if (F.headers && F.headers.length) {
                            l = new y();
                            if (l.init(F.get("exif")[0])) {
                                l.setExif("PixelXDimension", G);
                                l.setExif("PixelYDimension", m);
                                F.set("exif", l.getBinary());
                                if (h.hasEventListener("ExifData")) {
                                    h.trigger("ExifData", a, l.EXIF());
                                }
                                if (h.hasEventListener("GpsData")) {
                                    h.trigger("GpsData", a, l.GPS());
                                }
                            }
                        }
                        if (c.quality) {
                            try {
                                k = b.toDataURL(e, c.quality / 100);
                            } catch (D) {
                                k = b.toDataURL(e);
                            }
                        }
                    } else {
                        k = b.toDataURL(e);
                    }
                    k = k.substring(k.indexOf("base64,") + 7);
                    k = atob(k);
                    if (F && F.headers && F.headers.length) {
                        k = F.restore(k);
                        F.purge();
                    }
                    b.parentNode.removeChild(b);
                    f({
                        success: true,
                        data: k
                    });
                } else {
                    f({
                        success: false
                    });
                }
            };
            g.src = k;
        });
    }
    q.runtimes.Html5 = q.addRuntime("html5", {
        getFeatures: function () {
            var a, f, b, c, e, g, d = r;
            f = b = e = g = false;
            if (d.XMLHttpRequest) {
                a = new XMLHttpRequest();
                b = !! a.upload;
                f = !! (a.sendAsBinary || a.upload);
            }
            if (f) {
                c = !! (a.sendAsBinary || (r.Uint8Array && r.ArrayBuffer));
                e = !! (File && (File.prototype.getAsDataURL || d.FileReader) && c);
                g = !! (File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice));
            }
            s = navigator.userAgent.indexOf("Safari") > 0 && navigator.vendor.indexOf("Apple") !== -1;
            return {
                html5: f,
                dragdrop: d.mozInnerScreenX !== u || g || s,
                jpgresize: e,
                pngresize: e,
                multipart: e || !! d.FileReader || !! d.FormData,
                canSendBinary: c,
                cantSendBlobInFormData: !! (a && a.sendAsBinary && r.FormData && r.FileReader && !FileReader.prototype.readAsArrayBuffer),
                progress: b,
                chunks: g,
                triggerDialog: navigator.userAgent.indexOf("WebKit") !== -1
            };
        },
        init: function (b, a) {
            var d;

            function c(f) {
                var h, j, g = [],
                    e, k = {};
                for (j = 0; j < f.length; j++) {
                    h = f[j];
                    if (k[h.name]) {
                        continue;
                    }
                    k[h.name] = true;
                    e = q.guid();
                    w[e] = h;
                    g.push(new q.File(e, h.fileName || h.name, h.fileSize || h.size));
                }
                if (g.length) {
                    b.trigger("FilesAdded", g);
                }
            }
            d = this.getFeatures();
            if (!d.html5) {
                a({
                    success: false
                });
                return;
            }
            b.bind("Init", function (G) {
                var I, K, h = [],
                    H, g, L = G.settings.filters,
                    J, j, f = p.body,
                    e;
                I = p.createElement("div");
                I.id = G.id + "_html5_container";
                q.extend(I.style, {
                    position: "absolute",
                    background: b.settings.shim_bgcolor || "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: b.settings.shim_bgcolor ? "" : 0
                });
                I.className = "plupload html5";
                if (b.settings.container) {
                    f = p.getElementById(b.settings.container);
                    if (q.getStyle(f, "position") === "static") {
                        f.style.position = "relative";
                    }
                }
                f.appendChild(I);
                no_type_restriction: for (H = 0; H < L.length; H++) {
                    J = L[H].extensions.split(/,/);
                    for (g = 0; g < J.length; g++) {
                        if (J[g] === "*") {
                            h = [];
                            break no_type_restriction;
                        }
                        j = q.mimeTypes[J[g]];
                        if (j) {
                            h.push(j);
                        }
                    }
                }
                I.innerHTML = '<input id="' + b.id + '_html5" style="width:100%;height:100%;font-size:99px" type="file" accept="' + h.join(",") + '" ' + (b.settings.multi_selection ? 'multiple="multiple"' : "") + " />";
                e = p.getElementById(b.id + "_html5");
                e.onchange = function () {
                    c(this.files);
                    this.value = "";
                };
                K = p.getElementById(G.settings.browse_button);
                if (K) {
                    var l = G.settings.browse_button_hover,
                        k = G.settings.browse_button_active,
                        m = G.features.triggerDialog ? K : I;
                    if (l) {
                        q.addEvent(m, "mouseover", function () {
                            q.addClass(K, l);
                        }, G.id);
                        q.addEvent(m, "mouseout", function () {
                            q.removeClass(K, l);
                        }, G.id);
                    }
                    if (k) {
                        q.addEvent(m, "mousedown", function () {
                            q.addClass(K, k);
                        }, G.id);
                        q.addEvent(p.body, "mouseup", function () {
                            q.removeClass(K, k);
                        }, G.id);
                    }
                    if (G.features.triggerDialog) {
                        q.addEvent(K, "click", function (z) {
                            p.getElementById(G.id + "_html5").click();
                            z.preventDefault();
                        }, G.id);
                    }
                }
            });
            b.bind("PostInit", function () {
                var e = p.getElementById(b.settings.drop_element);
                if (e) {
                    if (s) {
                        q.addEvent(e, "dragenter", function (f) {
                            var g, j, h;
                            g = p.getElementById(b.id + "_drop");
                            if (!g) {
                                g = p.createElement("input");
                                g.setAttribute("type", "file");
                                g.setAttribute("id", b.id + "_drop");
                                g.setAttribute("multiple", "multiple");
                                q.addEvent(g, "change", function () {
                                    c(this.files);
                                    q.removeEvent(g, "change", b.id);
                                    g.parentNode.removeChild(g);
                                }, b.id);
                                e.appendChild(g);
                            }
                            j = q.getPos(e, p.getElementById(b.settings.container));
                            h = q.getSize(e);
                            if (q.getStyle(e, "position") === "static") {
                                q.extend(e.style, {
                                    position: "relative"
                                });
                            }
                            q.extend(g.style, {
                                position: "absolute",
                                display: "block",
                                top: 0,
                                left: 0,
                                width: h.w + "px",
                                height: h.h + "px",
                                opacity: 0
                            });
                        }, b.id);
                        return;
                    }
                    q.addEvent(e, "dragover", function (f) {
                        f.preventDefault();
                    }, b.id);
                    q.addEvent(e, "drop", function (f) {
                        var g = f.dataTransfer;
                        if (g && g.files) {
                            c(g.files);
                        }
                        f.preventDefault();
                    }, b.id);
                }
            });
            b.bind("Refresh", function (k) {
                var j, g, f, e, h;
                j = p.getElementById(b.settings.browse_button);
                if (j) {
                    g = q.getPos(j, p.getElementById(k.settings.container));
                    f = q.getSize(j);
                    e = p.getElementById(b.id + "_html5_container");
                    q.extend(e.style, {
                        top: g.y + "px",
                        left: g.x + "px",
                        width: f.w + "px",
                        height: f.h + "px"
                    });
                    if (b.features.triggerDialog) {
                        h = parseInt(j.parentNode.style.zIndex, 10);
                        if (isNaN(h)) {
                            h = 0;
                        }
                        q.extend(j.style, {
                            zIndex: h
                        });
                        if (q.getStyle(j, "position") === "static") {
                            q.extend(j.style, {
                                position: "relative"
                            });
                        }
                        q.extend(e.style, {
                            zIndex: h - 1
                        });
                    }
                }
            });
            b.bind("UploadFile", function (l, j) {
                var h = l.settings,
                    e, k;

                function f(E, D, G) {
                    var m;
                    if (File.prototype.slice) {
                        try {
                            E.slice();
                            return E.slice(D, G);
                        } catch (F) {
                            return E.slice(D, G - D);
                        }
                    } else {
                        if (m = File.prototype.webkitSlice || File.prototype.mozSlice) {
                            return m.call(E, D, G);
                        } else {
                            return null;
                        }
                    }
                }
                function g(K) {
                    var I = 0,
                        J = 0,
                        M = ("FileReader" in r ? new FileReader : null),
                        G = new XMLHttpRequest,
                        L = G.upload,
                        H = typeof (K) === "string";

                    function m() {
                        var D, z, B, A, E, C, P, Q = l.settings.url;

                        function F(N) {
                            var Y = 0,
                                ae = "----pluploadboundary" + q.guid(),
                                ad, ac = "--",
                                O = "\r\n",
                                aa = "";
                            if (L) {
                                L.onprogress = function (R) {
                                    j.loaded = Math.min(j.size, J + R.loaded - Y);
                                    l.trigger("UploadProgress", j);
                                };
                            }
                            G.onreadystatechange = function () {
                                var T, S;
                                if (G.readyState == 4) {
                                    try {
                                        T = G.status;
                                    } catch (R) {
                                        T = 0;
                                    }
                                    if (T >= 400) {
                                        l.trigger("Error", {
                                            code: q.HTTP_ERROR,
                                            message: q.translate("HTTP Error."),
                                            file: j,
                                            status: T
                                        });
                                    } else {
                                        if (B) {
                                            S = {
                                                chunk: I,
                                                chunks: B,
                                                response: G.responseText,
                                                status: T
                                            };
                                            l.trigger("ChunkUploaded", j, S);
                                            J += C;
                                            if (S.cancelled) {
                                                j.status = q.FAILED;
                                                return;
                                            }
                                            j.loaded = Math.min(j.size, (I + 1) * E);
                                        } else {
                                            j.loaded = j.size;
                                        }
                                        l.trigger("UploadProgress", j);
                                        N = D = ad = aa = null;
                                        if (!B || ++I >= B) {
                                            j.status = q.DONE;
                                            l.trigger("FileUploaded", j, {
                                                response: G.responseText,
                                                status: T
                                            });
                                        } else {
                                            m();
                                        }
                                    }
                                    G = null;
                                }
                            };
                            if (l.settings.multipart && d.multipart) {
                                A.name = j.target_name || j.name;
                                G.open("post", Q, true);
                                q.each(l.settings.headers, function (R, S) {
                                    G.setRequestHeader(S, R);
                                });
                                if (!H && !! r.FormData) {
                                    ad = new FormData();
                                    q.each(q.extend(A, l.settings.multipart_params), function (R, S) {
                                        ad.append(S, R);
                                    });
                                    ad.append(l.settings.file_data_name, N);
                                    G.send(ad);
                                    return;
                                }
                                if (H) {
                                    G.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + ae);
                                    q.each(q.extend(A, l.settings.multipart_params), function (R, S) {
                                        aa += ac + ae + O + 'Content-Disposition: form-data; name="' + S + '"' + O + O;
                                        aa += unescape(encodeURIComponent(R)) + O;
                                    });
                                    P = q.mimeTypes[j.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream";
                                    aa += ac + ae + O + 'Content-Disposition: form-data; name="' + l.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(j.name)) + '"' + O + "Content-Type: " + P + O + O + N + O + ac + ae + ac + O;
                                    Y = aa.length - N.length;
                                    N = aa;
                                    if (G.sendAsBinary) {
                                        G.sendAsBinary(N);
                                    } else {
                                        if (d.canSendBinary) {
                                            var Z = new Uint8Array(N.length);
                                            for (var ab = 0; ab < N.length; ab++) {
                                                Z[ab] = (N.charCodeAt(ab) & 255);
                                            }
                                            G.send(Z.buffer);
                                        }
                                    }
                                    return;
                                }
                            }
                            Q = q.buildUrl(l.settings.url, q.extend(A, l.settings.multipart_params));
                            G.open("post", Q, true);
                            G.setRequestHeader("Content-Type", "application/octet-stream");
                            q.each(l.settings.headers, function (R, S) {
                                G.setRequestHeader(S, R);
                            });
                            G.send(N);
                        }
                        if (j.status == q.DONE || j.status == q.FAILED || l.state == q.STOPPED) {
                            return;
                        }
                        A = {
                            name: j.target_name || j.name
                        };
                        if (h.chunk_size && j.size > h.chunk_size && (d.chunks || typeof (K) == "string")) {
                            E = h.chunk_size;
                            B = Math.ceil(j.size / E);
                            C = Math.min(E, j.size - (I * E));
                            if (typeof (K) == "string") {
                                D = K.substring(I * E, I * E + C);
                            } else {
                                D = f(K, I * E, I * E + C);
                            }
                            A.chunk = I;
                            A.chunks = B;
                        } else {
                            C = j.size;
                            D = K;
                        }
                        if (M && d.cantSendBlobInFormData && d.chunks && l.settings.chunk_size) {
                            M.onload = function () {
                                H = true;
                                F(M.result);
                            };
                            M.readAsBinaryString(D);
                        } else {
                            F(D);
                        }
                    }
                    m();
                }
                e = w[j.id];
                if (d.jpgresize && l.settings.resize && /\.(png|jpg|jpeg)$/i.test(j.name)) {
                    v.call(l, j, l.settings.resize, /\.png$/i.test(j.name) ? "image/png" : "image/jpeg", function (m) {
                        if (m.success) {
                            j.size = m.data.length;
                            g(m.data);
                        } else {
                            g(e);
                        }
                    });
                } else {
                    if (!d.chunks && d.jpgresize) {
                        o(e, g);
                    } else {
                        g(e);
                    }
                }
            });
            b.bind("Destroy", function (j) {
                var g, f, h = p.body,
                    e = {
                        inputContainer: j.id + "_html5_container",
                        inputFile: j.id + "_html5",
                        browseButton: j.settings.browse_button,
                        dropElm: j.settings.drop_element
                    };
                for (g in e) {
                    f = p.getElementById(e[g]);
                    if (f) {
                        q.removeAllEvents(f, j.id);
                    }
                }
                q.removeAllEvents(p.body, j.id);
                if (j.settings.container) {
                    h = p.getElementById(j.settings.container);
                }
                h.removeChild(p.getElementById(e.inputContainer));
            });
            a({
                success: true
            });
        }
    });

    function x() {
        var b = false,
            d;

        function a(j, g) {
            var k = b ? 0 : -8 * (g - 1),
                f = 0,
                h;
            for (h = 0; h < g; h++) {
                f |= (d.charCodeAt(j + h) << Math.abs(k + h * 8));
            }
            return f;
        }
        function e(f, h, g) {
            var g = arguments.length === 3 ? g : d.length - h - 1;
            d = d.substr(0, h) + f + d.substr(g + h);
        }
        function c(k, j, g) {
            var f = "",
                l = b ? 0 : -8 * (g - 1),
                h;
            for (h = 0; h < g; h++) {
                f += String.fromCharCode((j >> Math.abs(l + h * 8)) & 255);
            }
            e(f, k, g);
        }
        return {
            II: function (f) {
                if (f === u) {
                    return b;
                } else {
                    b = f;
                }
            },
            init: function (f) {
                b = false;
                d = f;
            },
            SEGMENT: function (h, f, g) {
                switch (arguments.length) {
                case 1:
                    return d.substr(h, d.length - h - 1);
                case 2:
                    return d.substr(h, f);
                case 3:
                    e(g, h, f);
                    break;
                default:
                    return d;
                }
            },
            BYTE: function (f) {
                return a(f, 1);
            },
            SHORT: function (f) {
                return a(f, 2);
            },
            LONG: function (g, f) {
                if (f === u) {
                    return a(g, 4);
                } else {
                    c(g, f, 4);
                }
            },
            SLONG: function (g) {
                var f = a(g, 4);
                return (f > 2147483647 ? f - 4294967296 : f);
            },
            STRING: function (h, g) {
                var f = "";
                for (g += h; h < g; h++) {
                    f += String.fromCharCode(a(h, 1));
                }
                return f;
            }
        };
    }
    function t(c) {
        var a = {
            65505: {
                app: "EXIF",
                name: "APP1",
                signature: "Exif\0"
            },
            65506: {
                app: "ICC",
                name: "APP2",
                signature: "ICC_PROFILE\0"
            },
            65517: {
                app: "IPTC",
                name: "APP13",
                signature: "Photoshop 3.0\0"
            }
        },
            b = [],
            d, h, f = u,
            e = 0,
            g;
        d = new x();
        d.init(c);
        if (d.SHORT(0) !== 65496) {
            return;
        }
        h = 2;
        g = Math.min(1048576, c.length);
        while (h <= g) {
            f = d.SHORT(h);
            if (f >= 65488 && f <= 65495) {
                h += 2;
                continue;
            }
            if (f === 65498 || f === 65497) {
                break;
            }
            e = d.SHORT(h + 2) + 2;
            if (a[f] && d.STRING(h + 4, a[f].signature.length) === a[f].signature) {
                b.push({
                    hex: f,
                    app: a[f].app.toUpperCase(),
                    name: a[f].name.toUpperCase(),
                    start: h,
                    length: e,
                    segment: d.SEGMENT(h, e)
                });
            }
            h += e;
        }
        d.init(null);
        return {
            headers: b,
            restore: function (A) {
                d.init(A);
                var k = new t(A);
                if (!k.headers) {
                    return false;
                }
                for (var j = k.headers.length; j > 0; j--) {
                    var m = k.headers[j - 1];
                    d.SEGMENT(m.start, m.length, "");
                }
                k.purge();
                h = d.SHORT(2) == 65504 ? 4 + d.SHORT(4) : 2;
                for (var j = 0, l = b.length; j < l; j++) {
                    d.SEGMENT(h, 0, b[j].segment);
                    h += b[j].length;
                }
                return d.SEGMENT();
            },
            get: function (j) {
                var m = [];
                for (var k = 0, l = b.length; k < l; k++) {
                    if (b[k].app === j.toUpperCase()) {
                        m.push(b[k].segment);
                    }
                }
                return m;
            },
            set: function (A, j) {
                var m = [];
                if (typeof (j) === "string") {
                    m.push(j);
                } else {
                    m = j;
                }
                for (var k = ii = 0, l = b.length; k < l; k++) {
                    if (b[k].app === A.toUpperCase()) {
                        b[k].segment = m[ii];
                        b[k].length = m[ii].length;
                        ii++;
                    }
                    if (ii >= m.length) {
                        break;
                    }
                }
            },
            purge: function () {
                b = [];
                d.init(null);
            }
        };
    }
    function y() {
        var d, g, f = {},
            a;
        d = new x();
        g = {
            tiff: {
                274: "Orientation",
                34665: "ExifIFDPointer",
                34853: "GPSInfoIFDPointer"
            },
            exif: {
                36864: "ExifVersion",
                40961: "ColorSpace",
                40962: "PixelXDimension",
                40963: "PixelYDimension",
                36867: "DateTimeOriginal",
                33434: "ExposureTime",
                33437: "FNumber",
                34855: "ISOSpeedRatings",
                37377: "ShutterSpeedValue",
                37378: "ApertureValue",
                37383: "MeteringMode",
                37384: "LightSource",
                37385: "Flash",
                41986: "ExposureMode",
                41987: "WhiteBalance",
                41990: "SceneCaptureType",
                41988: "DigitalZoomRatio",
                41992: "Contrast",
                41993: "Saturation",
                41994: "Sharpness"
            },
            gps: {
                0: "GPSVersionID",
                1: "GPSLatitudeRef",
                2: "GPSLatitude",
                3: "GPSLongitudeRef",
                4: "GPSLongitude"
            }
        };
        a = {
            ColorSpace: {
                1: "sRGB",
                0: "Uncalibrated"
            },
            MeteringMode: {
                0: "Unknown",
                1: "Average",
                2: "CenterWeightedAverage",
                3: "Spot",
                4: "MultiSpot",
                5: "Pattern",
                6: "Partial",
                255: "Other"
            },
            LightSource: {
                1: "Daylight",
                2: "Fliorescent",
                3: "Tungsten",
                4: "Flash",
                9: "Fine weather",
                10: "Cloudy weather",
                11: "Shade",
                12: "Daylight fluorescent (D 5700 - 7100K)",
                13: "Day white fluorescent (N 4600 -5400K)",
                14: "Cool white fluorescent (W 3900 - 4500K)",
                15: "White fluorescent (WW 3200 - 3700K)",
                17: "Standard light A",
                18: "Standard light B",
                19: "Standard light C",
                20: "D55",
                21: "D65",
                22: "D75",
                23: "D50",
                24: "ISO studio tungsten",
                255: "Other"
            },
            Flash: {
                0: "Flash did not fire.",
                1: "Flash fired.",
                5: "Strobe return light not detected.",
                7: "Strobe return light detected.",
                9: "Flash fired, compulsory flash mode",
                13: "Flash fired, compulsory flash mode, return light not detected",
                15: "Flash fired, compulsory flash mode, return light detected",
                16: "Flash did not fire, compulsory flash mode",
                24: "Flash did not fire, auto mode",
                25: "Flash fired, auto mode",
                29: "Flash fired, auto mode, return light not detected",
                31: "Flash fired, auto mode, return light detected",
                32: "No flash function",
                65: "Flash fired, red-eye reduction mode",
                69: "Flash fired, red-eye reduction mode, return light not detected",
                71: "Flash fired, red-eye reduction mode, return light detected",
                73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                89: "Flash fired, auto mode, red-eye reduction mode",
                93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
            },
            ExposureMode: {
                0: "Auto exposure",
                1: "Manual exposure",
                2: "Auto bracket"
            },
            WhiteBalance: {
                0: "Auto white balance",
                1: "Manual white balance"
            },
            SceneCaptureType: {
                0: "Standard",
                1: "Landscape",
                2: "Portrait",
                3: "Night scene"
            },
            Contrast: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            Saturation: {
                0: "Normal",
                1: "Low saturation",
                2: "High saturation"
            },
            Sharpness: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            GPSLatitudeRef: {
                N: "North latitude",
                S: "South latitude"
            },
            GPSLongitudeRef: {
                E: "East longitude",
                W: "West longitude"
            }
        };

        function e(M, j) {
            var J = d.SHORT(M),
                m, N, L, k, l, K, I, h, O = [],
                H = {};
            for (m = 0; m < J; m++) {
                I = K = M + 12 * m + 2;
                L = j[d.SHORT(I)];
                if (L === u) {
                    continue;
                }
                k = d.SHORT(I += 2);
                l = d.LONG(I += 2);
                I += 4;
                O = [];
                switch (k) {
                case 1:
                case 7:
                    if (l > 4) {
                        I = d.LONG(I) + f.tiffHeader;
                    }
                    for (N = 0; N < l; N++) {
                        O[N] = d.BYTE(I + N);
                    }
                    break;
                case 2:
                    if (l > 4) {
                        I = d.LONG(I) + f.tiffHeader;
                    }
                    H[L] = d.STRING(I, l - 1);
                    continue;
                case 3:
                    if (l > 2) {
                        I = d.LONG(I) + f.tiffHeader;
                    }
                    for (N = 0; N < l; N++) {
                        O[N] = d.SHORT(I + N * 2);
                    }
                    break;
                case 4:
                    if (l > 1) {
                        I = d.LONG(I) + f.tiffHeader;
                    }
                    for (N = 0; N < l; N++) {
                        O[N] = d.LONG(I + N * 4);
                    }
                    break;
                case 5:
                    I = d.LONG(I) + f.tiffHeader;
                    for (N = 0; N < l; N++) {
                        O[N] = d.LONG(I + N * 4) / d.LONG(I + N * 4 + 4);
                    }
                    break;
                case 9:
                    I = d.LONG(I) + f.tiffHeader;
                    for (N = 0; N < l; N++) {
                        O[N] = d.SLONG(I + N * 4);
                    }
                    break;
                case 10:
                    I = d.LONG(I) + f.tiffHeader;
                    for (N = 0; N < l; N++) {
                        O[N] = d.SLONG(I + N * 4) / d.SLONG(I + N * 4 + 4);
                    }
                    break;
                default:
                    continue;
                }
                h = (l == 1 ? O[0] : O);
                if (a.hasOwnProperty(L) && typeof h != "object") {
                    H[L] = a[L][h];
                } else {
                    H[L] = h;
                }
            }
            return H;
        }
        function b() {
            var h = u,
                j = f.tiffHeader;
            d.II(d.SHORT(j) == 18761);
            if (d.SHORT(j += 2) !== 42) {
                return false;
            }
            f.IFD0 = f.tiffHeader + d.LONG(j += 2);
            h = e(f.IFD0, g.tiff);
            f.exifIFD = ("ExifIFDPointer" in h ? f.tiffHeader + h.ExifIFDPointer : u);
            f.gpsIFD = ("GPSInfoIFDPointer" in h ? f.tiffHeader + h.GPSInfoIFDPointer : u);
            return true;
        }
        function c(k, m, C) {
            var E, D, j, h = 0;
            if (typeof (m) === "string") {
                var l = g[k.toLowerCase()];
                for (hex in l) {
                    if (l[hex] === m) {
                        m = hex;
                        break;
                    }
                }
            }
            E = f[k.toLowerCase() + "IFD"];
            D = d.SHORT(E);
            for (i = 0; i < D; i++) {
                j = E + 12 * i + 2;
                if (d.SHORT(j) == m) {
                    h = j + 8;
                    break;
                }
            }
            if (!h) {
                return false;
            }
            d.LONG(h, C);
            return true;
        }
        return {
            init: function (h) {
                f = {
                    tiffHeader: 10
                };
                if (h === u || !h.length) {
                    return false;
                }
                d.init(h);
                if (d.SHORT(0) === 65505 && d.STRING(4, 5).toUpperCase() === "EXIF\0") {
                    return b();
                }
                return false;
            },
            EXIF: function () {
                var h;
                h = e(f.exifIFD, g.exif);
                if (h.ExifVersion) {
                    h.ExifVersion = String.fromCharCode(h.ExifVersion[0], h.ExifVersion[1], h.ExifVersion[2], h.ExifVersion[3]);
                }
                return h;
            },
            GPS: function () {
                var h;
                h = e(f.gpsIFD, g.gps);
                if (h.GPSVersionID) {
                    h.GPSVersionID = h.GPSVersionID.join(".");
                }
                return h;
            },
            setExif: function (j, h) {
                if (j !== "PixelXDimension" && j !== "PixelYDimension") {
                    return false;
                }
                return c("exif", j, h);
            },
            getBinary: function () {
                return d.SEGMENT();
            }
        };
    }
})(window, document, plupload);
(function (j, g, f, k) {
    function h(a) {
        return g.getElementById(a);
    }
    f.runtimes.Html4 = f.addRuntime("html4", {
        getFeatures: function () {
            return {
                multipart: true,
                canOpenDialog: navigator.userAgent.indexOf("WebKit") !== -1
            };
        },
        init: function (b, a) {
            b.bind("Init", function (e) {
                var E = g.body,
                    A, F = "javascript",
                    D, H, d, G = [],
                    c = /MSIE/.test(navigator.userAgent),
                    L = [],
                    B = e.settings.filters,
                    y, C, M, I;
                no_type_restriction: for (y = 0; y < B.length; y++) {
                    C = B[y].extensions.split(/,/);
                    for (I = 0; I < C.length; I++) {
                        if (C[I] === "*") {
                            L = [];
                            break no_type_restriction;
                        }
                        M = f.mimeTypes[C[I]];
                        if (M) {
                            L.push(M);
                        }
                    }
                }
                L = L.join(",");

                function J() {
                    var m, l, o, n;
                    d = f.guid();
                    G.push(d);
                    m = g.createElement("form");
                    m.setAttribute("id", "form_" + d);
                    m.setAttribute("method", "post");
                    m.setAttribute("enctype", "multipart/form-data");
                    m.setAttribute("encoding", "multipart/form-data");
                    m.setAttribute("target", e.id + "_iframe");
                    m.style.position = "absolute";
                    l = g.createElement("input");
                    l.setAttribute("id", "input_" + d);
                    l.setAttribute("type", "file");
                    l.setAttribute("accept", L);
                    l.setAttribute("size", 1);
                    n = h(e.settings.browse_button);
                    if (e.features.canOpenDialog && n) {
                        f.addEvent(h(e.settings.browse_button), "click", function (p) {
                            l.click();
                            p.preventDefault();
                        }, e.id);
                    }
                    f.extend(l.style, {
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        fontSize: "99px"
                    });
                    f.extend(m.style, {
                        overflow: "hidden"
                    });
                    o = e.settings.shim_bgcolor;
                    if (o) {
                        m.style.background = o;
                    }
                    if (c) {
                        f.extend(l.style, {
                            filter: "alpha(opacity=0)"
                        });
                    }
                    f.addEvent(l, "change", function (q) {
                        var s = q.target,
                            t, r = [],
                            p;
                        if (s.value) {
                            h("form_" + d).style.top = -1048575 + "px";
                            t = s.value.replace(/\\/g, "/");
                            t = t.substring(t.length, t.lastIndexOf("/") + 1);
                            r.push(new f.File(d, t));
                            if (!e.features.canOpenDialog) {
                                f.removeAllEvents(m, e.id);
                            } else {
                                f.removeEvent(n, "click", e.id);
                            }
                            f.removeEvent(l, "change", e.id);
                            J();
                            if (r.length) {
                                b.trigger("FilesAdded", r);
                            }
                        }
                    }, e.id);
                    m.appendChild(l);
                    E.appendChild(m);
                    e.refresh();
                }
                function K() {
                    var l = g.createElement("div");
                    l.innerHTML = '<iframe id="' + e.id + '_iframe" name="' + e.id + '_iframe" src="' + F + ':&quot;&quot;" style="display:none"></iframe>';
                    A = l.firstChild;
                    E.appendChild(A);
                    f.addEvent(A, "load", function (o) {
                        var n = o.target,
                            p, m;
                        if (!D) {
                            return;
                        }
                        try {
                            p = n.contentWindow.document || n.contentDocument || j.frames[n.id].document;
                        } catch (q) {
                            e.trigger("Error", {
                                code: f.SECURITY_ERROR,
                                message: f.translate("Security error."),
                                file: D
                            });
                            return;
                        }
                        m = p.documentElement.innerText || p.documentElement.textContent;
                        if (m) {
                            D.status = f.DONE;
                            D.loaded = 1025;
                            D.percent = 100;
                            e.trigger("UploadProgress", D);
                            e.trigger("FileUploaded", D, {
                                response: m
                            });
                        }
                    }, e.id);
                }
                if (e.settings.container) {
                    E = h(e.settings.container);
                    if (f.getStyle(E, "position") === "static") {
                        E.style.position = "relative";
                    }
                }
                e.bind("UploadFile", function (o, n) {
                    var m, l;
                    if (n.status == f.DONE || n.status == f.FAILED || o.state == f.STOPPED) {
                        return;
                    }
                    m = h("form_" + n.id);
                    l = h("input_" + n.id);
                    l.setAttribute("name", o.settings.file_data_name);
                    m.setAttribute("action", o.settings.url);
                    f.each(f.extend({
                        name: n.target_name || n.name
                    }, o.settings.multipart_params), function (p, r) {
                        var q = g.createElement("input");
                        f.extend(q, {
                            type: "hidden",
                            name: r,
                            value: p
                        });
                        m.insertBefore(q, m.firstChild);
                    });
                    D = n;
                    h("form_" + d).style.top = -1048575 + "px";
                    m.submit();
                    m.parentNode.removeChild(m);
                });
                e.bind("FileUploaded", function (l) {
                    l.refresh();
                });
                e.bind("StateChanged", function (l) {
                    if (l.state == f.STARTED) {
                        K();
                    }
                    if (l.state == f.STOPPED) {
                        j.setTimeout(function () {
                            f.removeEvent(A, "load", l.id);
                            A.parentNode.removeChild(A);
                        }, 0);
                    }
                });
                e.bind("Refresh", function (n) {
                    var s, m, l, u, p, r, q, t, o;
                    s = h(n.settings.browse_button);
                    if (s) {
                        p = f.getPos(s, h(n.settings.container));
                        r = f.getSize(s);
                        q = h("form_" + d);
                        t = h("input_" + d);
                        f.extend(q.style, {
                            top: p.y + "px",
                            left: p.x + "px",
                            width: r.w + "px",
                            height: r.h + "px"
                        });
                        if (n.features.canOpenDialog) {
                            o = parseInt(s.parentNode.style.zIndex, 10);
                            if (isNaN(o)) {
                                o = 0;
                            }
                            f.extend(s.style, {
                                zIndex: o
                            });
                            if (f.getStyle(s, "position") === "static") {
                                f.extend(s.style, {
                                    position: "relative"
                                });
                            }
                            f.extend(q.style, {
                                zIndex: o - 1
                            });
                        }
                        l = n.settings.browse_button_hover;
                        u = n.settings.browse_button_active;
                        m = n.features.canOpenDialog ? s : q;
                        if (l) {
                            f.addEvent(m, "mouseover", function () {
                                f.addClass(s, l);
                            }, n.id);
                            f.addEvent(m, "mouseout", function () {
                                f.removeClass(s, l);
                            }, n.id);
                        }
                        if (u) {
                            f.addEvent(m, "mousedown", function () {
                                f.addClass(s, u);
                            }, n.id);
                            f.addEvent(g.body, "mouseup", function () {
                                f.removeClass(s, u);
                            }, n.id);
                        }
                    }
                });
                b.bind("FilesRemoved", function (o, n) {
                    var l, m;
                    for (l = 0; l < n.length; l++) {
                        m = h("form_" + n[l].id);
                        if (m) {
                            m.parentNode.removeChild(m);
                        }
                    }
                });
                b.bind("Destroy", function (p) {
                    var l, o, n, m = {
                        inputContainer: "form_" + d,
                        inputFile: "input_" + d,
                        browseButton: p.settings.browse_button
                    };
                    for (l in m) {
                        o = h(m[l]);
                        if (o) {
                            f.removeAllEvents(o, p.id);
                        }
                    }
                    f.removeAllEvents(g.body, p.id);
                    f.each(G, function (q, r) {
                        n = h("form_" + q);
                        if (n) {
                            E.removeChild(n);
                        }
                    });
                });
                J();
            });
            a({
                success: true
            });
        }
    });
})(window, document, plupload);
var io = this.io = {
    SOCKET_LOG: function (a) {
        if (window.turntable) {
            turntable.socketLog(String(a) == "[object Object]" ? "[]" : a);
        }
    },
    version: "0.6.3",
    setPath: function (a) {
        if (window.console && console.error) {
            console.error("io.setPath will be removed. Please set the variable WEB_SOCKET_SWF_LOCATION pointing to WebSocketMain.swf");
        }
        this.path = /\/$/.test(a) ? a : a + "/";
        WEB_SOCKET_SWF_LOCATION = a + "lib/vendor/web-socket-js/WebSocketMain.swf";
    }
};
if ("jQuery" in this) {
    jQuery.io = this.io;
}
if (typeof window != "undefined") {
    if (typeof WEB_SOCKET_SWF_LOCATION === "undefined") {
        WEB_SOCKET_SWF_LOCATION = "/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf";
    }
}(function () {
    var b = this.io,
        a = false;
    b.util = {
        load: function (c) {
            if (/loaded|complete/.test(document.readyState) || a) {
                return c();
            }
            if ("attachEvent" in window) {
                window.attachEvent("onload", c);
            } else {
                window.addEventListener("load", c, false);
            }
        },
        defer: function (c) {
            if (!b.util.webkit) {
                return c();
            }
            b.util.load(function () {
                setTimeout(c, 100);
            });
        },
        inherit: function (e, c) {
            for (var d in c.prototype) {
                e.prototype[d] = c.prototype[d];
            }
        },
        indexOf: function (c, f, g) {
            for (var d = c.length, e = (g < 0) ? Math.max(0, d + g) : g || 0; e < d; e++) {
                if (c[e] === f) {
                    return e;
                }
            }
            return -1;
        },
        isArray: function (c) {
            return Object.prototype.toString.call(c) === "[object Array]";
        },
        merge: function (e, c) {
            for (var d in c) {
                if (c.hasOwnProperty(d)) {
                    e[d] = c[d];
                }
            }
        }
    };
    b.util.webkit = /webkit/i.test(navigator.userAgent);
    b.util.load(function () {
        a = true;
    });
})();
(function () {
    var d = this.io,
        a = "~m~",
        c = function (f) {
            if (Object.prototype.toString.call(f) == "[object Object]") {
                if (!("JSON" in window)) {
                    var e = "Socket.IO Error: Trying to encode as JSON, but JSON.stringify is missing.";
                    if ("console" in window && console.error) {
                        console.error(e);
                    } else {
                        throw new Error(e);
                    }
                    return '{ "$error": "' + e + '" }';
                }
                return "~j~" + JSON.stringify(f);
            } else {
                return String(f);
            }
        },
        b = d.Transport = function (f, e) {
            this.base = f;
            this.options = {
                timeout: 15000
            };
            d.util.merge(this.options, e);
        };
    b.prototype.send = function () {
        throw new Error("Missing send() implementation");
    };
    b.prototype.connect = function () {
        throw new Error("Missing connect() implementation");
    };
    b.prototype.disconnect = function () {
        throw new Error("Missing disconnect() implementation");
    };
    b.prototype.encode = function (j) {
        var f = "",
            h;
        j = d.util.isArray(j) ? j : [j];
        for (var g = 0, e = j.length; g < e; g++) {
            h = j[g] === null || j[g] === undefined ? "" : c(j[g]);
            f += a + h.length + a + h;
        }
        return f;
    };
    b.prototype.decode = function (j) {
        var h = [],
            g, k;
        do {
            if (j.substr(0, 3) !== a) {
                return h;
            }
            j = j.substr(3);
            g = "", k = "";
            for (var f = 0, e = j.length; f < e; f++) {
                k = Number(j.substr(f, 1));
                if (j.substr(f, 1) == k) {
                    g += k;
                } else {
                    j = j.substr(g.length + a.length);
                    g = Number(g);
                    break;
                }
            }
            h.push(j.substr(0, g));
            j = j.substr(g);
        } while (j !== "");
        return h;
    };
    b.prototype.onData = function (h) {
        this.setTimeout();
        var g = this.decode(h);
        if (g && g.length) {
            for (var f = 0, e = g.length; f < e; f++) {
                this.onMessage(g[f]);
            }
        }
    };
    b.prototype.setTimeout = function () {
        var e = this;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function () {
            e.onTimeout();
        }, this.options.timeout);
    };
    b.prototype.onTimeout = function () {
        d.SOCKET_LOG("timeout");
        this.onDisconnect();
    };
    b.prototype.onMessage = function (e) {
        if (!this.sessionid) {
            this.sessionid = e;
            this.onConnect();
        } else {
            if (e.substr(0, 3) == "~h~") {
                this.onHeartbeat(e.substr(3));
            } else {
                if (e.substr(0, 3) == "~j~") {
                    this.base.onMessage(JSON.parse(e.substr(3)));
                } else {
                    this.base.onMessage(e);
                }
            }
        }
    }, b.prototype.onHeartbeat = function (e) {
        if (this.type == "websocket") {
            d.SOCKET_LOG(this.sockets[0].id + ":hb");
        }
        this.send("~h~" + e);
    };
    b.prototype.onConnect = function () {
        this.connected = true;
        this.connecting = false;
        this.base.onConnect();
        this.setTimeout();
    };
    b.prototype.onDisconnect = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.connecting = false;
        this.connected = false;
        this.sessionid = null;
        this.base.onDisconnect();
    };
    b.prototype.prepareUrl = function () {
        return (this.base.options.secure ? "https" : "http") + "://" + this.base.host + ":" + this.base.options.port + "/" + this.base.options.resource + "/" + this.type + (this.sessionid ? ("/" + this.sessionid) : "/");
    };
})();
(function () {
    var e = this.io,
        d = new Function,
        a = (function () {
            if (!("XMLHttpRequest" in window)) {
                return false;
            }
            var f = new XMLHttpRequest();
            return f.withCredentials != undefined;
        })(),
        c = function (h) {
            if ("XDomainRequest" in window && h) {
                return new XDomainRequest();
            }
            if ("XMLHttpRequest" in window && (!h || a)) {
                return new XMLHttpRequest();
            }
            if (!h) {
                try {
                    var g = new ActiveXObject("MSXML2.XMLHTTP");
                    return g;
                } catch (i) {}
                try {
                    var f = new ActiveXObject("Microsoft.XMLHTTP");
                    return f;
                } catch (i) {}
            }
            return false;
        },
        b = e.Transport.XHR = function () {
            e.Transport.apply(this, arguments);
            this.sendBuffer = [];
        };
    e.util.inherit(b, e.Transport);
    b.prototype.connect = function () {
        this.get();
        return this;
    };
    b.prototype.checkSend = function () {
        if (!this.posting && this.sendBuffer.length) {
            var f = this.encode(this.sendBuffer);
            this.sendBuffer = [];
            this.sendIORequest(f);
        }
    };
    b.prototype.send = function (f) {
        if (e.util.isArray(f)) {
            this.sendBuffer.push.apply(this.sendBuffer, f);
        } else {
            this.sendBuffer.push(f);
        }
        this.checkSend();
        return this;
    };
    b.prototype.sendIORequest = function (g) {
        var f = this;
        this.posting = true;
        this.sendXHR = this.request("send", "POST");
        this.sendXHR.onreadystatechange = function () {
            var h;
            if (f.sendXHR.readyState == 4) {
                f.sendXHR.onreadystatechange = d;
                try {
                    h = f.sendXHR.status;
                } catch (i) {}
                f.posting = false;
                if (h == 200) {
                    f.checkSend();
                } else {
                    f.onDisconnect();
                }
            }
        };
        this.sendXHR.send("data=" + encodeURIComponent(g));
    };
    b.prototype.disconnect = function () {
        this.onDisconnect();
        return this;
    };
    b.prototype.onDisconnect = function () {
        if (this.xhr) {
            this.xhr.onreadystatechange = d;
            try {
                this.xhr.abort();
            } catch (f) {}
            this.xhr = null;
        }
        if (this.sendXHR) {
            this.sendXHR.onreadystatechange = d;
            try {
                this.sendXHR.abort();
            } catch (f) {}
            this.sendXHR = null;
        }
        this.sendBuffer = [];
        e.Transport.prototype.onDisconnect.call(this);
    };
    b.prototype.request = function (g, i, f) {
        var h = c(this.base.isXDomain());
        if (f) {
            h.multipart = true;
        }
        h.open(i || "GET", this.prepareUrl() + (g ? "/" + g : ""));
        if (i == "POST" && "setRequestHeader" in h) {
            h.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        }
        return h;
    };
    b.check = function (f) {
        try {
            if (c(f)) {
                return true;
            }
        } catch (g) {}
        return false;
    };
    b.xdomainCheck = function () {
        return b.check(true);
    };
    b.request = c;
})();
(function () {
    var b = this.io,
        a = b.Transport.websocket = function () {
            b.Transport.apply(this, arguments);
        };
    b.util.inherit(a, b.Transport);
    a.prototype.type = "websocket";
    a.prototype.connect = function () {
        var d = this;
        if (!this.sockets) {
            this.sockets = [];
        }
        var c = new WebSocket(this.prepareUrl());
        this.sockets.unshift(c);
        b.socketsCreated = (b.socketsCreated || 0) + 1;
        c.id = "ws" + b.socketsCreated;
        b.SOCKET_LOG(c.id + ":create");
        c.onmessage = function (g) {
            if (!d.base.connected || d.base.connecting) {
                b.SOCKET_LOG(c.id + ":awake");
            }
            if (d.sockets.length > 1) {
                var e = $.inArray(c, d.sockets);
                if (e == -1) {
                    return;
                }
                d.sockets.splice(e, 1);
                for (var f = 0; f < d.sockets.length; f++) {
                    d.sockets[f].onmessage = null;
                    d.sockets[f].onclose = null;
                    d.sockets[f].onerror = null;
                    d.sockets[f].close();
                    b.SOCKET_LOG(d.sockets[f].id + ":kill");
                }
                d.sockets = [c];
            }
            d.onData(g.data);
        };
        c.onclose = function (f) {
            b.SOCKET_LOG(c.id + ":die");
            var e = $.inArray(c, d.sockets);
            if (e != -1) {
                d.sockets.splice(e, 1);
            }
            d.onDisconnect();
        };
        c.onerror = function (f) {
            d.onError(f);
        };
        return this;
    };
    a.prototype.send = function (c) {
        if (this.sockets.length) {
            this.sockets[0].send(this.encode(c));
        }
        return this;
    };
    a.prototype.disconnect = function () {
        if (this.sockets.length) {
            while (this.sockets.length) {
                var c = this.sockets.pop();
                c.onmessage = null;
                c.onclose = null;
                c.onerror = null;
                c.close();
            }
            this.onDisconnect();
        }
        return this;
    };
    a.prototype.onError = function (c) {
        this.base.emit("error", [c]);
    };
    a.prototype.prepareUrl = function () {
        return (this.base.options.secure ? "wss" : "ws") + "://" + this.base.host + ":" + this.base.options.port + "/" + this.base.options.resource + "/" + this.type + (this.sessionid ? ("/" + this.sessionid) : "");
    };
    a.check = function () {
        return "WebSocket" in window && WebSocket.prototype && (WebSocket.prototype.send && !! WebSocket.prototype.send.toString().match(/native/i)) && typeof WebSocket !== "undefined";
    };
    a.xdomainCheck = function () {
        return true;
    };
})();
(function () {
    var b = this.io,
        a = b.Transport.flashsocket = function () {
            b.Transport.websocket.apply(this, arguments);
        };
    b.util.inherit(a, b.Transport.websocket);
    a.prototype.type = "flashsocket";
    a.prototype.connect = function () {
        b.SOCKET_LOG("fsock:connect");
        var c = this,
            d = arguments;
        WebSocket.__addTask(function () {
            b.Transport.websocket.prototype.connect.apply(c, d);
        });
        return this;
    };
    a.prototype.send = function () {
        var c = this,
            d = arguments;
        WebSocket.__addTask(function () {
            b.Transport.websocket.prototype.send.apply(c, d);
        });
        return this;
    };
    a.check = function () {
        if (typeof WebSocket == "undefined" || !("__addTask" in WebSocket) || !swfobject) {
            return false;
        }
        return swfobject.hasFlashPlayerVersion("10.0.0");
    };
    a.xdomainCheck = function () {
        return true;
    };
})();
(function () {
    var b = this.io,
        a = b.Transport.htmlfile = function () {
            b.Transport.XHR.apply(this, arguments);
        };
    b.util.inherit(a, b.Transport.XHR);
    a.prototype.type = "htmlfile";
    a.prototype.get = function () {
        var c = this;
        this.open();
        window.attachEvent("onunload", function () {
            c.destroy();
        });
    };
    a.prototype.open = function () {
        this.doc = new ActiveXObject("htmlfile");
        this.doc.open();
        this.doc.write("<html></html>");
        this.doc.parentWindow.s = this;
        this.doc.close();
        var c = this.doc.createElement("div");
        this.doc.body.appendChild(c);
        this.iframe = this.doc.createElement("iframe");
        c.appendChild(this.iframe);
        this.iframe.src = this.prepareUrl() + "/" + (+new Date);
    };
    a.prototype._ = function (d, e) {
        this.onData(d);
        var c = e.getElementsByTagName("script")[0];
        c.parentNode.removeChild(c);
    };
    a.prototype.destroy = function () {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank";
            } catch (c) {}
            this.doc = null;
            CollectGarbage();
        }
    };
    a.prototype.disconnect = function () {
        this.destroy();
        return b.Transport.XHR.prototype.disconnect.call(this);
    };
    a.check = function () {
        if ("ActiveXObject" in window) {
            try {
                var c = new ActiveXObject("htmlfile");
                return c && b.Transport.XHR.check();
            } catch (d) {}
        }
        return false;
    };
    a.xdomainCheck = function () {
        return false;
    };
})();
(function () {
    var b = this.io,
        a = b.Transport["xhr-multipart"] = function () {
            b.Transport.XHR.apply(this, arguments);
        };
    b.util.inherit(a, b.Transport.XHR);
    a.prototype.type = "xhr-multipart";
    a.prototype.get = function () {
        var c = this;
        this.xhr = this.request("", "GET", true);
        this.xhr.onreadystatechange = function () {
            if (c.xhr.readyState == 4) {
                c.onData(c.xhr.responseText);
            }
        };
        this.xhr.send(null);
    };
    a.check = function () {
        return "XMLHttpRequest" in window && "prototype" in XMLHttpRequest && "multipart" in XMLHttpRequest.prototype;
    };
    a.xdomainCheck = function () {
        return true;
    };
})();
(function () {
    var c = this.io,
        a = new Function(),
        b = c.Transport["xhr-polling"] = function () {
            c.Transport.XHR.apply(this, arguments);
        };
    c.util.inherit(b, c.Transport.XHR);
    b.prototype.type = "xhr-polling";
    b.prototype.connect = function () {
        var d = this;
        c.util.defer(function () {
            c.Transport.XHR.prototype.connect.call(d);
        });
        return false;
    };
    b.prototype.get = function () {
        var d = this;
        this.xhr = this.request(+new Date, "GET");
        this.xhr.onreadystatechange = function () {
            var f;
            if (d.xhr.readyState == 4) {
                d.xhr.onreadystatechange = a;
                try {
                    f = d.xhr.status;
                } catch (g) {}
                if (f == 200) {
                    d.onData(d.xhr.responseText);
                    d.get();
                } else {
                    d.onDisconnect();
                }
            }
        };
        this.xhr.send(null);
    };
    b.check = function () {
        return c.Transport.XHR.check();
    };
    b.xdomainCheck = function () {
        return c.Transport.XHR.xdomainCheck();
    };
})();
(function () {
    var b = this.io,
        a = b.Transport["jsonp-polling"] = function () {
            b.Transport.XHR.apply(this, arguments);
            this.insertAt = document.getElementsByTagName("head")[0];
            this.index = b.JSONP.length;
            b.JSONP.push(this);
        };
    b.util.inherit(a, b.Transport["xhr-polling"]);
    b.JSONP = [];
    a.prototype.type = "jsonp-polling";
    a.prototype.sendIORequest = function (j) {
        var l = this;
        if (!("form" in this)) {
            var d = document.createElement("FORM"),
                f = document.createElement("TEXTAREA"),
                c = this.iframeId = "socket_io_iframe_" + this.index,
                i;
            d.style.position = "absolute";
            d.style.top = "-1000px";
            d.style.left = "-1000px";
            d.target = c;
            d.method = "POST";
            d.action = this.prepareUrl() + "/" + (+new Date) + "/" + this.index;
            f.name = "data";
            d.appendChild(f);
            this.insertAt.insertBefore(d, null);
            document.body.appendChild(d);
            this.form = d;
            this.area = f;
        }
        function g() {
            h();
            l.posting = false;
            l.checkSend();
        }
        function h() {
            if (l.iframe) {
                l.form.removeChild(l.iframe);
            }
            try {
                i = document.createElement('<iframe name="' + l.iframeId + '">');
            } catch (m) {
                i = document.createElement("iframe");
                i.name = l.iframeId;
            }
            i.id = l.iframeId;
            l.form.appendChild(i);
            l.iframe = i;
        }
        h();
        this.posting = true;
        this.area.value = j;
        try {
            this.form.submit();
        } catch (k) {}
        if (this.iframe.attachEvent) {
            i.onreadystatechange = function () {
                if (l.iframe.readyState == "complete") {
                    g();
                }
            };
        } else {
            this.iframe.onload = g;
        }
    };
    a.prototype.get = function () {
        var d = this,
            c = document.createElement("SCRIPT");
        if (this.script) {
            this.script.parentNode.removeChild(this.script);
            this.script = null;
        }
        c.async = true;
        c.src = this.prepareUrl() + "/" + (+new Date) + "/" + this.index;
        c.onerror = function () {
            d.onDisconnect();
        };
        this.insertAt.insertBefore(c, null);
        this.script = c;
    };
    a.prototype._ = function () {
        this.onData.apply(this, arguments);
        this.get();
        return this;
    };
    a.check = function () {
        return true;
    };
    a.xdomainCheck = function () {
        return true;
    };
})();
(function () {
    var b = this.io;
    var a = b.Socket = function (d, c) {
            this.host = d || document.domain;
            this.options = {
                secure: false,
                document: document,
                port: document.location.port || 80,
                resource: "socket.io",
                transports: ["websocket", "flashsocket", "htmlfile", "xhr-multipart", "xhr-polling", "jsonp-polling"],
                transportOptions: {
                    "xhr-polling": {
                        timeout: 25000
                    },
                    "jsonp-polling": {
                        timeout: 25000
                    }
                },
                connectTimeout: 5000,
                tryTransportsOnConnectTimeout: true,
                reconnect: true,
                reconnectionDelay: 500,
                maxReconnectionAttempts: 10,
                rememberTransport: true
            };
            b.util.merge(this.options, c);
            this.connected = false;
            this.connecting = false;
            this.reconnecting = false;
            this.events = {};
            this.transport = this.getTransport();
            if (!this.transport && "console" in window) {
                console.error("No transport available");
            }
        };
    a.prototype.getTransport = function (f) {
        var c = f || this.options.transports,
            d;
        if (this.options.rememberTransport && !f) {
            d = this.options.document.cookie.match("(?:^|;)\\s*socketio=([^;]*)");
            if (d) {
                this.rememberedTransport = true;
                c = [decodeURIComponent(d[1])];
            }
        }
        for (var e = 0, g; g = c[e]; e++) {
            if (b.Transport[g] && b.Transport[g].check() && (!this.isXDomain() || b.Transport[g].xdomainCheck())) {
                return new b.Transport[g](this, this.options.transportOptions[g] || {});
            }
        }
        return null;
    };
    a.prototype.connect = function (d) {
        if (this.transport && !this.connected) {
            if (this.connecting && this.transport.type != "websocket") {
                this.disconnect(true);
            }
            this.connecting = true;
            this.emit("connecting", [this.transport.type]);
            this.transport.connect();
            if (this.options.connectTimeout && !this.reconnecting) {
                var c = this;
                this.connectTimeoutTimer = setTimeout(function () {
                    if (!c.connected) {
                        c.disconnect(true);
                        if (c.options.tryTransportsOnConnectTimeout && !c.rememberedTransport) {
                            if (!c.remainingTransports) {
                                c.remainingTransports = c.options.transports.slice(0);
                            }
                            var e = c.remainingTransports;
                            while (e.length > 0 && e.splice(0, 1)[0] != c.transport.type) {}
                            if (e.length) {
                                c.transport = c.getTransport(e);
                                c.connect();
                            }
                        }
                        if (!c.remainingTransports || c.remainingTransports.length == 0) {
                            c.emit("connect_failed");
                        }
                    }
                    if (c.remainingTransports && c.remainingTransports.length == 0) {
                        delete c.remainingTransports;
                    }
                }, this.options.connectTimeout);
            }
        }
        if (d && typeof d == "function") {
            this.once("connect", d);
        }
        return this;
    };
    a.prototype.send = function (c) {
        if (!this.transport || !this.transport.connected) {
            return this.queue(c);
        }
        this.transport.send(c);
        return this;
    };
    a.prototype.disconnect = function (c) {
        if (this.connectTimeoutTimer) {
            clearTimeout(this.connectTimeoutTimer);
        }
        if (!c) {
            this.options.reconnect = false;
        }
        this.transport.disconnect();
        return this;
    };
    a.prototype.on = function (c, d) {
        if (!(c in this.events)) {
            this.events[c] = [];
        }
        this.events[c].push(d);
        return this;
    };
    a.prototype.once = function (d, f) {
        var c = this,
            e = function () {
                c.removeEvent(d, e);
                f.apply(c, arguments);
            };
        e.ref = f;
        c.on(d, e);
        return this;
    };
    a.prototype.emit = function (d, c) {
        if (d in this.events) {
            var f = this.events[d].concat();
            for (var e = 0, g = f.length; e < g; e++) {
                f[e].apply(this, c === undefined ? [] : c);
            }
        }
        return this;
    };
    a.prototype.removeEvent = function (e, f) {
        if (e in this.events) {
            for (var d = 0, c = this.events[e].length; d < c; d++) {
                if (this.events[e][d] == f || this.events[e][d].ref && this.events[e][d].ref == f) {
                    this.events[e].splice(d, 1);
                }
            }
        }
        return this;
    };
    a.prototype.queue = function (c) {
        if (!("queueStack" in this)) {
            this.queueStack = [];
        }
        this.queueStack.push(c);
        return this;
    };
    a.prototype.doQueue = function () {
        if (!("queueStack" in this) || !this.queueStack.length) {
            return this;
        }
        this.transport.send(this.queueStack);
        this.queueStack = [];
        return this;
    };
    a.prototype.isXDomain = function () {
        var c = window.location.port || 80;
        return this.host !== document.domain || this.options.port != c;
    };
    a.prototype.onConnect = function () {
        this.connected = true;
        this.connecting = false;
        this.doQueue();
        if (this.options.rememberTransport) {
            this.options.document.cookie = "socketio=" + encodeURIComponent(this.transport.type);
        }
        this.emit("connect");
    };
    a.prototype.onMessage = function (c) {
        this.emit("message", [c]);
    };
    a.prototype.onDisconnect = function () {
        var c = this.connected;
        this.connected = false;
        this.connecting = false;
        this.queueStack = [];
        if (c) {
            b.SOCKET_LOG("dc");
            this.emit("disconnect");
            if (this.options.reconnect && !this.reconnecting) {
                this.onReconnect();
            }
        }
    };
    a.prototype.onReconnect = function () {
        this.reconnecting = true;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options.reconnectionDelay;
        var c = this,
            e = this.options.tryTransportsOnConnectTimeout,
            g = this.options.rememberTransport;

        function d() {
            if (c.connected) {
                c.emit("reconnect", [c.transport.type, c.reconnectionAttempts]);
            }
            c.removeEvent("connect_failed", f).removeEvent("connect", f);
            c.reconnecting = false;
            delete c.reconnectionAttempts;
            delete c.reconnectionDelay;
            delete c.reconnectionTimer;
            delete c.redoTransports;
            c.options.tryTransportsOnConnectTimeout = e;
            c.options.rememberTransport = g;
            return;
        }
        function f() {
            if (!c.reconnecting) {
                return;
            }
            if (!c.connected) {
                var h = (!c.connecting || c.transport.type == "websocket");
                if (!h) {
                    return c.reconnectionTimer = setTimeout(f, 1000);
                }
                if (c.reconnectionAttempts++ >= c.options.maxReconnectionAttempts) {
                    if (!c.redoTransports) {
                        c.on("connect_failed", f);
                        c.options.tryTransportsOnConnectTimeout = true;
                        c.disconnect(true);
                        c.transport = c.getTransport(c.options.transports);
                        c.redoTransports = true;
                        c.connect();
                    } else {
                        c.emit("reconnect_failed");
                        d();
                    }
                } else {
                    c.reconnectionDelay *= 2;
                    c.connect();
                    c.emit("reconnecting", [c.reconnectionDelay, c.reconnectionAttempts]);
                    c.reconnectionTimer = setTimeout(f, c.reconnectionDelay);
                }
            } else {
                d();
            }
        }
        this.options.tryTransportsOnConnectTimeout = false;
        this.reconnectionTimer = setTimeout(f, this.reconnectionDelay);
        this.on("connect", f);
    };
    a.prototype.fire = a.prototype.emit;
    a.prototype.addListener = a.prototype.addEvent = a.prototype.addEventListener = a.prototype.on;
    a.prototype.removeListener = a.prototype.removeEventListener = a.prototype.removeEvent;
})();
var swfobject = function () {
        var aq = "undefined",
            aD = "object",
            ab = "Shockwave Flash",
            X = "ShockwaveFlash.ShockwaveFlash",
            aE = "application/x-shockwave-flash",
            ac = "SWFObjectExprInst",
            ax = "onreadystatechange",
            af = window,
            aL = document,
            aB = navigator,
            aa = false,
            Z = [aN],
            aG = [],
            ag = [],
            al = [],
            aJ, ad, ap, at, ak = false,
            aU = false,
            aH, an, aI = true,
            ah = function () {
                var a = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq,
                    e = aB.userAgent.toLowerCase(),
                    c = aB.platform.toLowerCase(),
                    h = c ? /win/.test(c) : /win/.test(e),
                    j = c ? /mac/.test(c) : /mac/.test(e),
                    g = /webkit/.test(e) ? parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                    d = !+"\v1",
                    f = [0, 0, 0],
                    k = null;
                if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
                    k = aB.plugins[ab].description;
                    if (k && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
                        aa = true;
                        d = false;
                        k = k.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                        f[0] = parseInt(k.replace(/^(.*)\..*$/, "$1"), 10);
                        f[1] = parseInt(k.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                        f[2] = /[a-zA-Z]/.test(k) ? parseInt(k.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                    }
                } else {
                    if (typeof af.ActiveXObject != aq) {
                        try {
                            var i = new ActiveXObject(X);
                            if (i) {
                                k = i.GetVariable("$version");
                                if (k) {
                                    d = true;
                                    k = k.split(" ")[1].split(",");
                                    f = [parseInt(k[0], 10), parseInt(k[1], 10), parseInt(k[2], 10)];
                                }
                            }
                        } catch (b) {}
                    }
                }
                return {
                    w3: a,
                    pv: f,
                    wk: g,
                    ie: d,
                    win: h,
                    mac: j
                };
            }(),
            aK = function () {
                if (!ah.w3) {
                    return;
                }
                if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
                    aP();
                }
                if (!ak) {
                    if (typeof aL.addEventListener != aq) {
                        aL.addEventListener("DOMContentLoaded", aP, false);
                    }
                    if (ah.ie && ah.win) {
                        aL.attachEvent(ax, function () {
                            if (aL.readyState == "complete") {
                                aL.detachEvent(ax, arguments.callee);
                                aP();
                            }
                        });
                        if (af == top) {
                            (function () {
                                if (ak) {
                                    return;
                                }
                                try {
                                    aL.documentElement.doScroll("left");
                                } catch (a) {
                                    setTimeout(arguments.callee, 0);
                                    return;
                                }
                                aP();
                            })();
                        }
                    }
                    if (ah.wk) {
                        (function () {
                            if (ak) {
                                return;
                            }
                            if (!/loaded|complete/.test(aL.readyState)) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            aP();
                        })();
                    }
                    aC(aP);
                }
            }();

        function aP() {
            if (ak) {
                return;
            }
            try {
                var b = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
                b.parentNode.removeChild(b);
            } catch (a) {
                return;
            }
            ak = true;
            var d = Z.length;
            for (var c = 0; c < d; c++) {
                Z[c]();
            }
        }
        function aj(a) {
            if (ak) {
                a();
            } else {
                Z[Z.length] = a;
            }
        }
        function aC(a) {
            if (typeof af.addEventListener != aq) {
                af.addEventListener("load", a, false);
            } else {
                if (typeof aL.addEventListener != aq) {
                    aL.addEventListener("load", a, false);
                } else {
                    if (typeof af.attachEvent != aq) {
                        aM(af, "onload", a);
                    } else {
                        if (typeof af.onload == "function") {
                            var b = af.onload;
                            af.onload = function () {
                                b();
                                a();
                            };
                        } else {
                            af.onload = a;
                        }
                    }
                }
            }
        }
        function aN() {
            if (aa) {
                Y();
            } else {
                am();
            }
        }
        function Y() {
            var d = aL.getElementsByTagName("body")[0];
            var b = ar(aD);
            b.setAttribute("type", aE);
            var a = d.appendChild(b);
            if (a) {
                var c = 0;
                (function () {
                    if (typeof a.GetVariable != aq) {
                        var e = a.GetVariable("$version");
                        if (e) {
                            e = e.split(" ")[1].split(",");
                            ah.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)];
                        }
                    } else {
                        if (c < 10) {
                            c++;
                            setTimeout(arguments.callee, 10);
                            return;
                        }
                    }
                    d.removeChild(b);
                    a = null;
                    am();
                })();
            } else {
                am();
            }
        }
        function am() {
            var g = aG.length;
            if (g > 0) {
                for (var h = 0; h < g; h++) {
                    var c = aG[h].id;
                    var l = aG[h].callbackFn;
                    var a = {
                        success: false,
                        id: c
                    };
                    if (ah.pv[0] > 0) {
                        var i = aS(c);
                        if (i) {
                            if (ao(aG[h].swfVersion) && !(ah.wk && ah.wk < 312)) {
                                ay(c, true);
                                if (l) {
                                    a.success = true;
                                    a.ref = av(c);
                                    l(a);
                                }
                            } else {
                                if (aG[h].expressInstall && au()) {
                                    var e = {};
                                    e.data = aG[h].expressInstall;
                                    e.width = i.getAttribute("width") || "0";
                                    e.height = i.getAttribute("height") || "0";
                                    if (i.getAttribute("class")) {
                                        e.styleclass = i.getAttribute("class");
                                    }
                                    if (i.getAttribute("align")) {
                                        e.align = i.getAttribute("align");
                                    }
                                    var f = {};
                                    var d = i.getElementsByTagName("param");
                                    var k = d.length;
                                    for (var j = 0; j < k; j++) {
                                        if (d[j].getAttribute("name").toLowerCase() != "movie") {
                                            f[d[j].getAttribute("name")] = d[j].getAttribute("value");
                                        }
                                    }
                                    ae(e, f, c, l);
                                } else {
                                    aF(i);
                                    if (l) {
                                        l(a);
                                    }
                                }
                            }
                        }
                    } else {
                        ay(c, true);
                        if (l) {
                            var b = av(c);
                            if (b && typeof b.SetVariable != aq) {
                                a.success = true;
                                a.ref = b;
                            }
                            l(a);
                        }
                    }
                }
            }
        }
        function av(b) {
            var d = null;
            var c = aS(b);
            if (c && c.nodeName == "OBJECT") {
                if (typeof c.SetVariable != aq) {
                    d = c;
                } else {
                    var a = c.getElementsByTagName(aD)[0];
                    if (a) {
                        d = a;
                    }
                }
            }
            return d;
        }
        function au() {
            return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312);
        }
        function ae(f, d, h, e) {
            aU = true;
            ap = e || null;
            at = {
                success: false,
                id: h
            };
            var a = aS(h);
            if (a) {
                if (a.nodeName == "OBJECT") {
                    aJ = aO(a);
                    ad = null;
                } else {
                    aJ = a;
                    ad = h;
                }
                f.id = ac;
                if (typeof f.width == aq || (!/%$/.test(f.width) && parseInt(f.width, 10) < 310)) {
                    f.width = "310";
                }
                if (typeof f.height == aq || (!/%$/.test(f.height) && parseInt(f.height, 10) < 137)) {
                    f.height = "137";
                }
                aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
                var b = ah.ie && ah.win ? "ActiveX" : "PlugIn",
                    c = "MMredirectURL=" + af.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + b + "&MMdoctitle=" + aL.title;
                if (typeof d.flashvars != aq) {
                    d.flashvars += "&" + c;
                } else {
                    d.flashvars = c;
                }
                if (ah.ie && ah.win && a.readyState != 4) {
                    var g = ar("div");
                    h += "SWFObjectNew";
                    g.setAttribute("id", h);
                    a.parentNode.insertBefore(g, a);
                    a.style.display = "none";
                    (function () {
                        if (a.readyState == 4) {
                            a.parentNode.removeChild(a);
                        } else {
                            setTimeout(arguments.callee, 10);
                        }
                    })();
                }
                aA(f, d, h);
            }
        }
        function aF(a) {
            if (ah.ie && ah.win && a.readyState != 4) {
                var b = ar("div");
                a.parentNode.insertBefore(b, a);
                b.parentNode.replaceChild(aO(a), b);
                a.style.display = "none";
                (function () {
                    if (a.readyState == 4) {
                        a.parentNode.removeChild(a);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                a.parentNode.replaceChild(aO(a), a);
            }
        }
        function aO(b) {
            var d = ar("div");
            if (ah.win && ah.ie) {
                d.innerHTML = b.innerHTML;
            } else {
                var e = b.getElementsByTagName(aD)[0];
                if (e) {
                    var a = e.childNodes;
                    if (a) {
                        var f = a.length;
                        for (var c = 0; c < f; c++) {
                            if (!(a[c].nodeType == 1 && a[c].nodeName == "PARAM") && !(a[c].nodeType == 8)) {
                                d.appendChild(a[c].cloneNode(true));
                            }
                        }
                    }
                }
            }
            return d;
        }
        function aA(e, g, c) {
            var d, a = aS(c);
            if (ah.wk && ah.wk < 312) {
                return d;
            }
            if (a) {
                if (typeof e.id == aq) {
                    e.id = c;
                }
                if (ah.ie && ah.win) {
                    var f = "";
                    for (var i in e) {
                        if (e[i] != Object.prototype[i]) {
                            if (i.toLowerCase() == "data") {
                                g.movie = e[i];
                            } else {
                                if (i.toLowerCase() == "styleclass") {
                                    f += ' class="' + e[i] + '"';
                                } else {
                                    if (i.toLowerCase() != "classid") {
                                        f += " " + i + '="' + e[i] + '"';
                                    }
                                }
                            }
                        }
                    }
                    var h = "";
                    for (var j in g) {
                        if (g[j] != Object.prototype[j]) {
                            h += '<param name="' + j + '" value="' + g[j] + '" />';
                        }
                    }
                    a.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>";
                    ag[ag.length] = e.id;
                    d = aS(e.id);
                } else {
                    var b = ar(aD);
                    b.setAttribute("type", aE);
                    for (var k in e) {
                        if (e[k] != Object.prototype[k]) {
                            if (k.toLowerCase() == "styleclass") {
                                b.setAttribute("class", e[k]);
                            } else {
                                if (k.toLowerCase() != "classid") {
                                    b.setAttribute(k, e[k]);
                                }
                            }
                        }
                    }
                    for (var l in g) {
                        if (g[l] != Object.prototype[l] && l.toLowerCase() != "movie") {
                            aQ(b, l, g[l]);
                        }
                    }
                    a.parentNode.replaceChild(b, a);
                    d = b;
                }
            }
            return d;
        }
        function aQ(b, d, c) {
            var a = ar("param");
            a.setAttribute("name", d);
            a.setAttribute("value", c);
            b.appendChild(a);
        }
        function aw(a) {
            var b = aS(a);
            if (b && b.nodeName == "OBJECT") {
                if (ah.ie && ah.win) {
                    b.style.display = "none";
                    (function () {
                        if (b.readyState == 4) {
                            aT(a);
                        } else {
                            setTimeout(arguments.callee, 10);
                        }
                    })();
                } else {
                    b.parentNode.removeChild(b);
                }
            }
        }
        function aT(a) {
            var b = aS(a);
            if (b) {
                for (var c in b) {
                    if (typeof b[c] == "function") {
                        b[c] = null;
                    }
                }
                b.parentNode.removeChild(b);
            }
        }
        function aS(a) {
            var c = null;
            try {
                c = aL.getElementById(a);
            } catch (b) {}
            return c;
        }
        function ar(a) {
            return aL.createElement(a);
        }
        function aM(a, c, b) {
            a.attachEvent(c, b);
            al[al.length] = [a, c, b];
        }
        function ao(a) {
            var b = ah.pv,
                c = a.split(".");
            c[0] = parseInt(c[0], 10);
            c[1] = parseInt(c[1], 10) || 0;
            c[2] = parseInt(c[2], 10) || 0;
            return (b[0] > c[0] || (b[0] == c[0] && b[1] > c[1]) || (b[0] == c[0] && b[1] == c[1] && b[2] >= c[2])) ? true : false;
        }
        function az(b, f, a, c) {
            if (ah.ie && ah.mac) {
                return;
            }
            var e = aL.getElementsByTagName("head")[0];
            if (!e) {
                return;
            }
            var g = (a && typeof a == "string") ? a : "screen";
            if (c) {
                aH = null;
                an = null;
            }
            if (!aH || an != g) {
                var d = ar("style");
                d.setAttribute("type", "text/css");
                d.setAttribute("media", g);
                aH = e.appendChild(d);
                if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
                    aH = aL.styleSheets[aL.styleSheets.length - 1];
                }
                an = g;
            }
            if (ah.ie && ah.win) {
                if (aH && typeof aH.addRule == aD) {
                    aH.addRule(b, f);
                }
            } else {
                if (aH && typeof aL.createTextNode != aq) {
                    aH.appendChild(aL.createTextNode(b + " {" + f + "}"));
                }
            }
        }
        function ay(a, c) {
            if (!aI) {
                return;
            }
            var b = c ? "visible" : "hidden";
            if (ak && aS(a)) {
                aS(a).style.visibility = b;
            } else {
                az("#" + a, "visibility:" + b);
            }
        }
        function ai(b) {
            var a = /[\\\"<>\.;]/;
            var c = a.exec(b) != null;
            return c && typeof encodeURIComponent != aq ? encodeURIComponent(b) : b;
        }
        var aR = function () {
                if (ah.ie && ah.win) {
                    window.attachEvent("onunload", function () {
                        var a = al.length;
                        for (var b = 0; b < a; b++) {
                            al[b][0].detachEvent(al[b][1], al[b][2]);
                        }
                        var d = ag.length;
                        for (var c = 0; c < d; c++) {
                            aw(ag[c]);
                        }
                        for (var e in ah) {
                            ah[e] = null;
                        }
                        ah = null;
                        for (var f in swfobject) {
                            swfobject[f] = null;
                        }
                        swfobject = null;
                    });
                }
            }();
        return {
            registerObject: function (a, e, c, b) {
                if (ah.w3 && a && e) {
                    var d = {};
                    d.id = a;
                    d.swfVersion = e;
                    d.expressInstall = c;
                    d.callbackFn = b;
                    aG[aG.length] = d;
                    ay(a, false);
                } else {
                    if (b) {
                        b({
                            success: false,
                            id: a
                        });
                    }
                }
            },
            getObjectById: function (a) {
                if (ah.w3) {
                    return av(a);
                }
            },
            embedSWF: function (k, e, h, f, c, a, b, i, g, j) {
                var d = {
                    success: false,
                    id: e
                };
                if (ah.w3 && !(ah.wk && ah.wk < 312) && k && e && h && f && c) {
                    ay(e, false);
                    aj(function () {
                        h += "";
                        f += "";
                        var q = {};
                        if (g && typeof g === aD) {
                            for (var o in g) {
                                q[o] = g[o];
                            }
                        }
                        q.data = k;
                        q.width = h;
                        q.height = f;
                        var n = {};
                        if (i && typeof i === aD) {
                            for (var p in i) {
                                n[p] = i[p];
                            }
                        }
                        if (b && typeof b === aD) {
                            for (var l in b) {
                                if (typeof n.flashvars != aq) {
                                    n.flashvars += "&" + l + "=" + b[l];
                                } else {
                                    n.flashvars = l + "=" + b[l];
                                }
                            }
                        }
                        if (ao(c)) {
                            var m = aA(q, n, e);
                            if (q.id == e) {
                                ay(e, true);
                            }
                            d.success = true;
                            d.ref = m;
                        } else {
                            if (a && au()) {
                                q.data = a;
                                ae(q, n, e, j);
                                return;
                            } else {
                                ay(e, true);
                            }
                        }
                        if (j) {
                            j(d);
                        }
                    });
                } else {
                    if (j) {
                        j(d);
                    }
                }
            },
            switchOffAutoHideShow: function () {
                aI = false;
            },
            ua: ah,
            getFlashPlayerVersion: function () {
                return {
                    major: ah.pv[0],
                    minor: ah.pv[1],
                    release: ah.pv[2]
                };
            },
            hasFlashPlayerVersion: ao,
            createSWF: function (a, b, c) {
                if (ah.w3) {
                    return aA(a, b, c);
                } else {
                    return undefined;
                }
            },
            showExpressInstall: function (b, a, d, c) {
                if (ah.w3 && au()) {
                    ae(b, a, d, c);
                }
            },
            removeSWF: function (a) {
                if (ah.w3) {
                    aw(a);
                }
            },
            createCSS: function (b, a, c, d) {
                if (ah.w3) {
                    az(b, a, c, d);
                }
            },
            addDomLoadEvent: aj,
            addLoadEvent: aC,
            getQueryParamValue: function (b) {
                var a = aL.location.search || aL.location.hash;
                if (a) {
                    if (/\?/.test(a)) {
                        a = a.split("?")[1];
                    }
                    if (b == null) {
                        return ai(a);
                    }
                    var c = a.split("&");
                    for (var d = 0; d < c.length; d++) {
                        if (c[d].substring(0, c[d].indexOf("=")) == b) {
                            return ai(c[d].substring((c[d].indexOf("=") + 1)));
                        }
                    }
                }
                return "";
            },
            expressInstallCallback: function () {
                if (aU) {
                    var a = aS(ac);
                    if (a && aJ) {
                        a.parentNode.replaceChild(aJ, a);
                        if (ad) {
                            ay(ad, true);
                            if (ah.ie && ah.win) {
                                aJ.style.display = "block";
                            }
                        }
                        if (ap) {
                            ap(at);
                        }
                    }
                    aU = false;
                }
            }
        };
    }();
(function () {
    if (window.WebSocket) {
        return;
    }
    var a = window.console;
    if (!a || !a.log || !a.error) {
        a = {
            log: function () {},
            error: function () {}
        };
    }
    if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
        a.error("Flash Player >= 10.0.0 is required.");
        return;
    }
    if (location.protocol == "file:") {
        a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://...");
    }
    WebSocket = function (d, e, c, g, f) {
        var b = this;
        b.__id = WebSocket.__nextId++;
        WebSocket.__instances[b.__id] = b;
        b.readyState = WebSocket.CONNECTING;
        b.bufferedAmount = 0;
        b.__events = {};
        if (!e) {
            e = [];
        } else {
            if (typeof e == "string") {
                e = [e];
            }
        }
        setTimeout(function () {
            WebSocket.__addTask(function () {
                WebSocket.__flash.create(b.__id, d, e, c || null, g || 0, f || null);
            });
        }, 0);
    };
    WebSocket.prototype.send = function (c) {
        if (this.readyState == WebSocket.CONNECTING) {
            throw "INVALID_STATE_ERR: Web Socket connection has not been established";
        }
        var b = WebSocket.__flash.send(this.__id, encodeURIComponent(c));
        if (b < 0) {
            return true;
        } else {
            this.bufferedAmount += b;
            return false;
        }
    };
    WebSocket.prototype.close = function () {
        if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
            return;
        }
        this.readyState = WebSocket.CLOSING;
        WebSocket.__flash.close(this.__id);
    };
    WebSocket.prototype.addEventListener = function (c, d, b) {
        if (!(c in this.__events)) {
            this.__events[c] = [];
        }
        this.__events[c].push(d);
    };
    WebSocket.prototype.removeEventListener = function (e, f, b) {
        if (!(e in this.__events)) {
            return;
        }
        var d = this.__events[e];
        for (var c = d.length - 1; c >= 0; --c) {
            if (d[c] === f) {
                d.splice(c, 1);
                break;
            }
        }
    };
    WebSocket.prototype.dispatchEvent = function (e) {
        var c = this.__events[e.type] || [];
        for (var b = 0; b < c.length; ++b) {
            c[b](e);
        }
        var d = this["on" + e.type];
        if (d) {
            d(e);
        }
    };
    WebSocket.prototype.__handleEvent = function (d) {
        if ("readyState" in d) {
            this.readyState = d.readyState;
        }
        if ("protocol" in d) {
            this.protocol = d.protocol;
        }
        var b;
        if (d.type == "open" || d.type == "error") {
            b = this.__createSimpleEvent(d.type);
        } else {
            if (d.type == "close") {
                b = this.__createSimpleEvent("close");
            } else {
                if (d.type == "message") {
                    var c = decodeURIComponent(d.message);
                    b = this.__createMessageEvent("message", c);
                } else {
                    throw "unknown event type: " + d.type;
                }
            }
        }
        this.dispatchEvent(b);
    };
    WebSocket.prototype.__createSimpleEvent = function (b) {
        if (document.createEvent && window.Event) {
            var c = document.createEvent("Event");
            c.initEvent(b, false, false);
            return c;
        } else {
            return {
                type: b,
                bubbles: false,
                cancelable: false
            };
        }
    };
    WebSocket.prototype.__createMessageEvent = function (b, d) {
        if (document.createEvent && window.MessageEvent && !window.opera) {
            var c = document.createEvent("MessageEvent");
            c.initMessageEvent("message", false, false, d, null, null, window, null);
            return c;
        } else {
            return {
                type: b,
                data: d,
                bubbles: false,
                cancelable: false
            };
        }
    };
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;
    WebSocket.__flash = null;
    WebSocket.__instances = {};
    WebSocket.__tasks = [];
    WebSocket.__nextId = 0;
    WebSocket.loadFlashPolicyFile = function (b) {
        WebSocket.__addTask(function () {
            WebSocket.__flash.loadManualPolicyFile(b);
        });
    };
    WebSocket.__initialize = function () {
        if (WebSocket.__flash) {
            return;
        }
        if (WebSocket.__swfLocation) {
            window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
        }
        if (!window.WEB_SOCKET_SWF_LOCATION) {
            a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
            return;
        }
        var b = document.createElement("div");
        b.id = "webSocketContainer";
        b.style.position = "absolute";
        if (WebSocket.__isFlashLite()) {
            b.style.left = "0px";
            b.style.top = "0px";
        } else {
            b.style.left = "-100px";
            b.style.top = "-100px";
        }
        var c = document.createElement("div");
        c.id = "webSocketFlash";
        b.appendChild(c);
        document.body.appendChild(b);
        swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
            hasPriority: true,
            swliveconnect: true,
            allowScriptAccess: "always"
        }, null, function (d) {
            if (!d.success) {
                a.error("[WebSocket] swfobject.embedSWF failed");
            }
        });
    };
    WebSocket.__onFlashInitialized = function () {
        setTimeout(function () {
            WebSocket.__flash = document.getElementById("webSocketFlash");
            WebSocket.__flash.setCallerUrl(location.href);
            WebSocket.__flash.setDebug( !! window.WEB_SOCKET_DEBUG);
            for (var b = 0; b < WebSocket.__tasks.length; ++b) {
                WebSocket.__tasks[b]();
            }
            WebSocket.__tasks = [];
        }, 0);
    };
    WebSocket.__onFlashEvent = function () {
        setTimeout(function () {
            try {
                var c = WebSocket.__flash.receiveEvents();
                for (var b = 0; b < c.length; ++b) {
                    WebSocket.__instances[c[b].webSocketId].__handleEvent(c[b]);
                }
            } catch (d) {
                a.error(d);
            }
        }, 0);
        return true;
    };
    WebSocket.__log = function (b) {
        a.log(decodeURIComponent(b));
    };
    WebSocket.__error = function (b) {
        a.error(decodeURIComponent(b));
    };
    WebSocket.__addTask = function (b) {
        if (WebSocket.__flash) {
            b();
        } else {
            WebSocket.__tasks.push(b);
        }
    };
    WebSocket.__isFlashLite = function () {
        if (!window.navigator || !window.navigator.mimeTypes) {
            return false;
        }
        var b = window.navigator.mimeTypes["application/x-shockwave-flash"];
        if (!b || !b.enabledPlugin || !b.enabledPlugin.filename) {
            return false;
        }
        return b.enabledPlugin.filename.match(/flashlite/i) ? true : false;
    };
    if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
        if (window.addEventListener) {
            window.addEventListener("load", function () {
                WebSocket.__initialize();
            }, false);
        } else {
            window.attachEvent("onload", function () {
                WebSocket.__initialize();
            });
        }
    }
})();
(function (c) {
    var b = null;

    function a(aC, O) {
        this.flashVersion = 8;
        this.debugMode = true;
        this.debugFlash = false;
        this.useConsole = true;
        this.consoleOnly = false;
        this.waitForWindowLoad = false;
        this.nullURL = "about:blank";
        this.allowPolling = true;
        this.useFastPolling = false;
        this.useMovieStar = true;
        this.bgColor = "#ffffff";
        this.useHighPerformance = false;
        this.flashPollingInterval = null;
        this.flashLoadTimeout = 1000;
        this.wmode = null;
        this.allowScriptAccess = "always";
        this.useFlashBlock = false;
        this.useHTML5Audio = false;
        this.html5Test = /^probably$/i;
        this.useGlobalHTML5Audio = true;
        this.requireFlash = false;
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: true
            },
            mp4: {
                related: ["aac", "m4a"],
                type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: true
            },
            ogg: {
                type: ["audio/ogg; codecs=vorbis"],
                required: false
            },
            wav: {
                type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
                required: false
            }
        };
        this.defaultOptions = {
            autoLoad: false,
            stream: true,
            autoPlay: false,
            loops: 1,
            onid3: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onstop: null,
            onfailure: null,
            onfinish: null,
            onbeforefinish: null,
            onbeforefinishtime: 5000,
            onbeforefinishcomplete: null,
            onjustbeforefinish: null,
            onjustbeforefinishtime: 200,
            multiShot: true,
            multiShotEvents: false,
            position: null,
            pan: 0,
            type: null,
            usePolicyFile: false,
            volume: 100
        };
        this.flash9Options = {
            isMovieStar: null,
            usePeakData: false,
            useWaveformData: false,
            useEQData: false,
            onbufferchange: null,
            ondataerror: null
        };
        this.movieStarOptions = {
            bufferTime: 3,
            serverURL: null,
            onconnect: null,
            duration: null
        };
        this.version = null;
        this.versionNumber = "V2.97a.20110424";
        this.movieURL = null;
        this.url = (aC || null);
        this.altURL = null;
        this.swfLoaded = false;
        this.enabled = false;
        this.o = null;
        this.movieID = "sm2-container";
        this.id = (O || "sm2movie");
        this.swfCSS = {
            swfBox: "sm2-object-box",
            swfDefault: "movieContainer",
            swfError: "swf_error",
            swfTimedout: "swf_timedout",
            swfLoaded: "swf_loaded",
            swfUnblocked: "swf_unblocked",
            sm2Debug: "sm2_debug",
            highPerf: "high_performance",
            flashDebug: "flash_debug"
        };
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.muted = false;
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.specialWmodeCase = false;
        this.didFlashBlock = false;
        this.filePattern = null;
        this.filePatterns = {
            flash8: /\.mp3(\?.*)?$/i,
            flash9: /\.mp3(\?.*)?$/i
        };
        this.baseMimeTypes = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.netStreamMimeTypes = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.netStreamTypes = ["aac", "flv", "mov", "mp4", "m4v", "f4v", "m4a", "mp4v", "3gp", "3g2"];
        this.netStreamPattern = new RegExp("\\.(" + this.netStreamTypes.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = this.baseMimeTypes;
        this.features = {
            buffering: false,
            peakData: false,
            waveformData: false,
            eqData: false,
            movieStar: false
        };
        this.sandbox = {
            type: null,
            types: {
                remote: "remote (domain-based) rules",
                localWithFile: "local with file access (no internet access)",
                localWithNetwork: "local with network (internet access only, no local access)",
                localTrusted: "local, trusted (local+internet access)"
            },
            description: null,
            noRemote: null,
            noLocal: null
        };
        this.hasHTML5 = null;
        this.html5 = {
            usingFlash: null
        };
        this.ignoreFlash = false;
        var R, aR = this,
            aA = "soundManager",
            ao = aA + "::",
            aF = "HTML5::",
            W, aa = navigator.userAgent,
            k = c,
            l = k.location.href.toString(),
            e = this.flashVersion,
            aD = document,
            ac, aw, aj = [],
            m = true,
            af, at = false,
            aK = false,
            aI = false,
            F = false,
            u = false,
            z, aG = 0,
            T, ai, aL, aP, ap, au, ah, t, J, aB, S, L, s, aM, ax, an, aH, ay, ak, V = ["log", "info", "warn", "error"],
            N = 8,
            U, am, h, o = null,
            aq = null,
            X, i, I, x, Z, w, d, ad, aS = false,
            C = false,
            y, q, v, Q, ag = null,
            ae, A, aQ = false,
            av, p, P, aO, r, j = Array.prototype.slice,
            aJ = false,
            g, aN, Y, ar = aa.match(/pre\//i),
            D = aa.match(/(ipad|iphone|ipod)/i),
            K = (aa.match(/mobile/i) || ar || D),
            f = aa.match(/msie/i),
            n = aa.match(/webkit/i),
            B = (aa.match(/safari/i) && !aa.match(/chrome/i)),
            H = (aa.match(/opera/i)),
            al = (!l.match(/usehtml5audio/i) && !l.match(/sm2\-ignorebadua/i) && B && aa.match(/OS X 10_6_([3-9])/i)),
            az = (typeof console !== "undefined" && typeof console.log !== "undefined"),
            aE = (typeof aD.hasFocus !== "undefined" ? aD.hasFocus() : null),
            ab = (typeof aD.hasFocus === "undefined" && B),
            G = !ab;
        this._use_maybe = (l.match(/sm2\-useHTML5Maybe\=1/i));
        this._overHTTP = (aD.location ? aD.location.protocol.match(/http/i) : null);
        this._http = (!this._overHTTP ? "http:" : "");
        this.useAltURL = !this._overHTTP;
        this._global_a = null;
        if (D || ar) {
            aR.useHTML5Audio = true;
            aR.ignoreFlash = true;
            if (aR.useGlobalHTML5Audio) {
                aJ = true;
            }
        }
        if (ar || this._use_maybe) {
            aR.html5Test = /^(probably|maybe)$/i;
        }(function () {
            var aV = "#sm2-usehtml5audio=",
                aU = l,
                aT = null;
            if (aU.indexOf(aV) !== -1) {
                aT = (aU.charAt(aU.indexOf(aV) + aV.length) === "1");
                if (typeof console !== "undefined" && typeof console.log !== "undefined") {
                    console.log((aT ? "Enabling " : "Disabling ") + "useHTML5Audio via URL parameter");
                }
                aR.useHTML5Audio = aT;
            }
        }());
        this.ok = function () {
            return (ag ? (aI && !F) : (aR.useHTML5Audio && aR.hasHTML5));
        };
        this.supported = this.ok;
        this.getMovie = function (aT) {
            return f ? k[aT] : (B ? W(aT) || aD[aT] : W(aT));
        };
        this.createSound = function (aV) {
            var aY = aA + ".createSound(): ",
                aX = null,
                aW = null,
                aU = null;
            if (!aI || !aR.ok()) {
                d(aY + X(!aI ? "notReady" : "notOK"));
                return false;
            }
            if (arguments.length === 2) {
                aV = {
                    id: arguments[0],
                    url: arguments[1]
                };
            }
            aX = ai(aV);
            aU = aX;
            if (aU.id.toString().charAt(0).match(/^[0-9]$/)) {
                aR._wD(aY + X("badID", aU.id), 2);
            }
            aR._wD(aY + aU.id + " (" + aU.url + ")", 1);
            if (ad(aU.id, true)) {
                aR._wD(aY + aU.id + " exists", 1);
                return aR.sounds[aU.id];
            }
            function aT() {
                aX = Z(aX);
                aR.sounds[aU.id] = new R(aU);
                aR.soundIDs.push(aU.id);
                return aR.sounds[aU.id];
            }
            if (A(aU)) {
                aW = aT();
                aR._wD("Loading sound " + aU.id + " via HTML5");
                aW._setup_html5(aU);
            } else {
                if (e > 8 && aR.useMovieStar) {
                    if (aU.isMovieStar === null) {
                        aU.isMovieStar = ((aU.serverURL || (aU.type ? aU.type.match(aR.netStreamPattern) : false) || aU.url.match(aR.netStreamPattern)) ? true : false);
                    }
                    if (aU.isMovieStar) {
                        aR._wD(aY + "using MovieStar handling");
                    }
                    if (aU.isMovieStar) {
                        if (aU.usePeakData) {
                            z("noPeak");
                            aU.usePeakData = false;
                        }
                        if (aU.loops > 1) {
                            z("noNSLoop");
                        }
                    }
                }
                aU = w(aU, aY);
                aW = aT();
                if (e === 8) {
                    aR.o._createSound(aU.id, aU.onjustbeforefinishtime, aU.loops || 1, aU.usePolicyFile);
                } else {
                    aR.o._createSound(aU.id, aU.url, aU.onjustbeforefinishtime, aU.usePeakData, aU.useWaveformData, aU.useEQData, aU.isMovieStar, (aU.isMovieStar ? aU.bufferTime : false), aU.loops || 1, aU.serverURL, aU.duration || null, aU.autoPlay, true, aU.autoLoad, aU.usePolicyFile);
                    if (!aU.serverURL) {
                        aW.connected = true;
                        if (aU.onconnect) {
                            aU.onconnect.apply(aW);
                        }
                    }
                }
                if ((aU.autoLoad || aU.autoPlay) && !aU.serverURL) {
                    aW.load(aU);
                }
            }
            if (aU.autoPlay && !aU.serverURL) {
                aW.play();
            }
            return aW;
        };
        this.destroySound = function (aT, aW) {
            if (!ad(aT)) {
                return false;
            }
            var aV = aR.sounds[aT],
                aU;
            aV._iO = {};
            aV.stop();
            aV.unload();
            for (aU = 0; aU < aR.soundIDs.length; aU++) {
                if (aR.soundIDs[aU] === aT) {
                    aR.soundIDs.splice(aU, 1);
                    break;
                }
            }
            if (!aW) {
                aV.destruct(true);
            }
            aV = null;
            delete aR.sounds[aT];
            return true;
        };
        this.load = function (aT, aU) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].load(aU);
        };
        this.unload = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].unload();
        };
        this.play = function (aT, aU) {
            var aV = aA + ".play(): ";
            if (!aI || !aR.ok()) {
                d(aV + X(!aI ? "notReady" : "notOK"));
                return false;
            }
            if (!ad(aT)) {
                if (!(aU instanceof Object)) {
                    aU = {
                        url: aU
                    };
                }
                if (aU && aU.url) {
                    aR._wD(aV + 'attempting to create "' + aT + '"', 1);
                    aU.id = aT;
                    return aR.createSound(aU).play();
                } else {
                    return false;
                }
            }
            return aR.sounds[aT].play(aU);
        };
        this.start = this.play;
        this.setPosition = function (aT, aU) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].setPosition(aU);
        };
        this.stop = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            aR._wD(aA + ".stop(" + aT + ")", 1);
            return aR.sounds[aT].stop();
        };
        this.stopAll = function () {
            aR._wD(aA + ".stopAll()", 1);
            for (var aT in aR.sounds) {
                if (aR.sounds[aT] instanceof R) {
                    aR.sounds[aT].stop();
                }
            }
        };
        this.pause = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].pause();
        };
        this.pauseAll = function () {
            for (var aT = aR.soundIDs.length; aT--;) {
                aR.sounds[aR.soundIDs[aT]].pause();
            }
        };
        this.resume = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].resume();
        };
        this.resumeAll = function () {
            for (var aT = aR.soundIDs.length; aT--;) {
                aR.sounds[aR.soundIDs[aT]].resume();
            }
        };
        this.togglePause = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].togglePause();
        };
        this.setPan = function (aT, aU) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].setPan(aU);
        };
        this.setVolume = function (aU, aT) {
            if (!ad(aU)) {
                return false;
            }
            return aR.sounds[aU].setVolume(aT);
        };
        this.mute = function (aT) {
            var aV = aA + ".mute(): ",
                aU = 0;
            if (typeof aT !== "string") {
                aT = null;
            }
            if (!aT) {
                aR._wD(aV + "Muting all sounds");
                for (aU = aR.soundIDs.length; aU--;) {
                    aR.sounds[aR.soundIDs[aU]].mute();
                }
                aR.muted = true;
            } else {
                if (!ad(aT)) {
                    return false;
                }
                aR._wD(aV + 'Muting "' + aT + '"');
                return aR.sounds[aT].mute();
            }
            return true;
        };
        this.muteAll = function () {
            aR.mute();
        };
        this.unmute = function (aT) {
            var aV = aA + ".unmute(): ",
                aU;
            if (typeof aT !== "string") {
                aT = null;
            }
            if (!aT) {
                aR._wD(aV + "Unmuting all sounds");
                for (aU = aR.soundIDs.length; aU--;) {
                    aR.sounds[aR.soundIDs[aU]].unmute();
                }
                aR.muted = false;
            } else {
                if (!ad(aT)) {
                    return false;
                }
                aR._wD(aV + 'Unmuting "' + aT + '"');
                return aR.sounds[aT].unmute();
            }
            return true;
        };
        this.unmuteAll = function () {
            aR.unmute();
        };
        this.toggleMute = function (aT) {
            if (!ad(aT)) {
                return false;
            }
            return aR.sounds[aT].toggleMute();
        };
        this.getMemoryUse = function () {
            if (e === 8) {
                return 0;
            }
            if (aR.o) {
                return parseInt(aR.o._getMemoryUse(), 10);
            }
        };
        this.disable = function (aU) {
            if (typeof aU === "undefined") {
                aU = false;
            }
            if (F) {
                return false;
            }
            F = true;
            z("shutdown", 1);
            for (var aT = aR.soundIDs.length; aT--;) {
                U(aR.sounds[aR.soundIDs[aT]]);
            }
            T(aU);
            r.remove(k, "load", ap);
            return true;
        };
        this.canPlayMIME = function (aU) {
            var aT;
            if (aR.hasHTML5) {
                aT = av({
                    type: aU
                });
            }
            if (!ag || aT) {
                return aT;
            } else {
                return (aU ? (aU.match(aR.mimePattern) ? true : false) : null);
            }
        };
        this.canPlayURL = function (aU) {
            var aT;
            if (aR.hasHTML5) {
                aT = av(aU);
            }
            if (!ag || aT) {
                return aT;
            } else {
                return (aU ? (aU.match(aR.filePattern) ? true : false) : null);
            }
        };
        this.canPlayLink = function (aT) {
            if (typeof aT.type !== "undefined" && aT.type) {
                if (aR.canPlayMIME(aT.type)) {
                    return true;
                }
            }
            return aR.canPlayURL(aT.href);
        };
        this.getSoundById = function (aU, aV) {
            if (!aU) {
                throw new Error(aA + ".getSoundById(): sID is null/undefined");
            }
            var aT = aR.sounds[aU];
            if (!aT && !aV) {
                aR._wD('"' + aU + '" is an invalid sound ID.', 2);
            }
            return aT;
        };
        this.onready = function (aU, aT) {
            var aV = "onready";
            if (aU && aU instanceof Function) {
                if (aI) {
                    z("queue", aV);
                }
                if (!aT) {
                    aT = k;
                }
                aL(aV, aU, aT);
                aP();
                return true;
            } else {
                throw X("needFunction", aV);
            }
        };
        this.ontimeout = function (aU, aT) {
            var aV = "ontimeout";
            if (aU && aU instanceof Function) {
                if (aI) {
                    z("queue");
                }
                if (!aT) {
                    aT = k;
                }
                aL(aV, aU, aT);
                aP({
                    type: aV
                });
                return true;
            } else {
                throw X("needFunction", aV);
            }
        };
        this.getMoviePercent = function () {
            return (aR.o && typeof aR.o.PercentLoaded !== "undefined" ? aR.o.PercentLoaded() : null);
        };
        this._writeDebug = function (aU, a0, aW) {
            var aZ = "soundmanager-debug",
                aY, aX, aT;
            if (!aR.debugMode) {
                return false;
            }
            if (typeof aW !== "undefined" && aW) {
                aU = aU + " | " + new Date().getTime();
            }
            if (az && aR.useConsole) {
                aT = V[a0];
                if (typeof console[aT] !== "undefined") {
                    console[aT](aU);
                } else {
                    console.log(aU);
                }
                if (aR.useConsoleOnly) {
                    return true;
                }
            }
            try {
                aY = W(aZ);
                if (!aY) {
                    return false;
                }
                aX = aD.createElement("div");
                if (++aG % 2 === 0) {
                    aX.className = "sm2-alt";
                }
                if (typeof a0 === "undefined") {
                    a0 = 0;
                } else {
                    a0 = parseInt(a0, 10);
                }
                aX.appendChild(aD.createTextNode(aU));
                if (a0) {
                    if (a0 >= 2) {
                        aX.style.fontWeight = "bold";
                    }
                    if (a0 === 3) {
                        aX.style.color = "#ff3333";
                    }
                }
                aY.insertBefore(aX, aY.firstChild);
            } catch (aV) {}
            aY = null;
            return true;
        };
        this._wD = this._writeDebug;
        this._debug = function () {
            z("currentObj", 1);
            for (var aU = 0, aT = aR.soundIDs.length; aU < aT; aU++) {
                aR.sounds[aR.soundIDs[aU]]._debug();
            }
        };
        this.reboot = function () {
            aR._wD(aA + ".reboot()");
            if (aR.soundIDs.length) {
                aR._wD("Destroying " + aR.soundIDs.length + " SMSound objects...");
            }
            var aU, aT;
            for (aU = aR.soundIDs.length; aU--;) {
                aR.sounds[aR.soundIDs[aU]].destruct();
            }
            try {
                if (f) {
                    aq = aR.o.innerHTML;
                }
                o = aR.o.parentNode.removeChild(aR.o);
                aR._wD("Flash movie removed.");
            } catch (aV) {
                z("badRemove", 2);
            }
            aq = o = null;
            aR.enabled = aI = aS = C = at = aK = F = aR.swfLoaded = false;
            aR.soundIDs = aR.sounds = [];
            aR.o = null;
            for (aU in aj) {
                if (aj.hasOwnProperty(aU)) {
                    for (aT = aj[aU].length; aT--;) {
                        aj[aU][aT].fired = false;
                    }
                }
            }
            aR._wD(aA + ": Rebooting...");
            k.setTimeout(function () {
                aR.beginDelayedInit();
            }, 20);
        };
        this.destruct = function () {
            aR._wD(aA + ".destruct()");
            aR.disable(true);
        };
        this.beginDelayedInit = function () {
            u = true;
            aM();
            setTimeout(S, 20);
            ah();
        };

        function M(aT) {
            return function (aU) {
                if (!this._t || !this._t._a) {
                    if (this._t && this._t.sID) {
                        aR._wD(aF + "ignoring " + aU.type + ": " + this._t.sID);
                    } else {
                        aR._wD(aF + "ignoring " + aU.type);
                    }
                    return null;
                } else {
                    return aT.call(this, aU);
                }
            };
        }
        this._html5_events = {
            abort: M(function (aT) {
                aR._wD(aF + "abort: " + this._t.sID);
            }),
            canplay: M(function (aV) {
                aR._wD(aF + "canplay: " + this._t.sID + ", " + this._t.url);
                this._t._onbufferchange(0);
                var aU = (!isNaN(this._t.position) ? this._t.position / 1000 : null);
                this._t._html5_canplay = true;
                if (this._t.position && this.currentTime !== aU) {
                    aR._wD(aF + "canplay: setting position to " + aU + "");
                    try {
                        this.currentTime = aU;
                    } catch (aT) {
                        aR._wD(aF + "setting position failed: " + aT.message, 2);
                    }
                }
            }),
            load: M(function (aT) {
                if (!this._t.loaded) {
                    this._t._onbufferchange(0);
                    this._t._whileloading(this._t.bytesTotal, this._t.bytesTotal, this._t._get_html5_duration());
                    this._t._onload(true);
                }
            }),
            emptied: M(function (aT) {
                aR._wD(aF + "emptied: " + this._t.sID);
            }),
            ended: M(function (aT) {
                aR._wD(aF + "ended: " + this._t.sID);
                this._t._onfinish();
            }),
            error: M(function (aT) {
                aR._wD(aF + "error: " + this.error.code);
                this._t._onload(false);
            }),
            loadeddata: M(function (aT) {
                aR._wD(aF + "loadeddata: " + this._t.sID);
            }),
            loadedmetadata: M(function (aT) {
                aR._wD(aF + "loadedmetadata: " + this._t.sID);
            }),
            loadstart: M(function (aT) {
                aR._wD(aF + "loadstart: " + this._t.sID);
                this._t._onbufferchange(1);
            }),
            play: M(function (aT) {
                aR._wD(aF + "play: " + this._t.sID + ", " + this._t.url);
                this._t._onbufferchange(0);
            }),
            playing: M(function (aT) {
                aR._wD(aF + "playing: " + this._t.sID + ", " + this._t.url);
                this._t._onbufferchange(0);
            }),
            progress: M(function (aY) {
                if (this._t.loaded) {
                    return false;
                }
                var aX, aV, aZ, a2 = 0,
                    aU = 0,
                    a1 = (aY.type === "progress"),
                    aT = aY.target.buffered,
                    aW = (aY.loaded || 0),
                    a0 = (aY.total || 1);
                if (aT && aT.length) {
                    for (aX = aT.length; aX--;) {
                        aU = (aT.end(aX) - aT.start(aX));
                    }
                    aW = aU / aY.target.duration;
                    if (a1 && aT.length > 1) {
                        aZ = [];
                        aV = aT.length;
                        for (aX = 0; aX < aV; aX++) {
                            aZ.push(aY.target.buffered.start(aX) + "-" + aY.target.buffered.end(aX));
                        }
                        aR._wD(aF + "progress: timeRanges: " + aZ.join(", "));
                    }
                    if (a1 && !isNaN(aW)) {
                        aR._wD(aF + "progress: " + this._t.sID + ": " + Math.floor(aW * 100) + "% loaded");
                    }
                }
                if (!isNaN(aW)) {
                    this._t._onbufferchange(0);
                    this._t._whileloading(aW, a0, this._t._get_html5_duration());
                    if (aW && a0 && aW === a0) {
                        aR._html5_events.load.call(this, aY);
                    }
                }
            }),
            ratechange: M(function (aT) {
                aR._wD(aF + "ratechange: " + this._t.sID);
            }),
            suspend: M(function (aT) {
                aR._wD(aF + "suspend: " + this._t.sID);
                aR._html5_events.progress.call(this, aT);
            }),
            stalled: M(function (aT) {
                aR._wD(aF + "stalled: " + this._t.sID);
            }),
            timeupdate: M(function (aT) {
                this._t._onTimer();
            }),
            waiting: M(function (aT) {
                aR._wD(aF + "waiting: " + this._t.sID);
                this._t._onbufferchange(1);
            })
        };
        R = function (aU) {
            var aW = this,
                aX, aV, aT;
            this.sID = aU.id;
            this.url = aU.url;
            this.options = ai(aU);
            this.instanceOptions = this.options;
            this._iO = this.instanceOptions;
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this._lastURL = null;
            this.isHTML5 = false;
            this._a = null;
            this.id3 = {};
            this._debug = function () {
                if (aR.debugMode) {
                    var a0 = null,
                        a2 = [],
                        aZ, a1, aY = 64;
                    for (a0 in aW.options) {
                        if (aW.options[a0] !== null) {
                            if (aW.options[a0] instanceof Function) {
                                aZ = aW.options[a0].toString();
                                aZ = aZ.replace(/\s\s+/g, " ");
                                a1 = aZ.indexOf("{");
                                a2.push(" " + a0 + ": {" + aZ.substr(a1 + 1, (Math.min(Math.max(aZ.indexOf("\n") - 1, aY), aY))).replace(/\n/g, "") + "... }");
                            } else {
                                a2.push(" " + a0 + ": " + aW.options[a0]);
                            }
                        }
                    }
                    aR._wD("SMSound() merged options: {\n" + a2.join(", \n") + "\n}");
                }
            };
            this._debug();
            this.load = function (aY) {
                var aZ = null;
                if (typeof aY !== "undefined") {
                    aW._iO = ai(aY, aW.options);
                    aW.instanceOptions = aW._iO;
                } else {
                    aY = aW.options;
                    aW._iO = aY;
                    aW.instanceOptions = aW._iO;
                    if (aW._lastURL && aW._lastURL !== aW.url) {
                        z("manURL");
                        aW._iO.url = aW.url;
                        aW.url = null;
                    }
                }
                if (!aW._iO.url) {
                    aW._iO.url = aW.url;
                }
                aR._wD("SMSound.load(): " + aW._iO.url, 1);
                if (aW._iO.url === aW.url && aW.readyState !== 0 && aW.readyState !== 2) {
                    z("onURL", 1);
                    return aW;
                }
                aW._lastURL = aW.url;
                aW.loaded = false;
                aW.readyState = 1;
                aW.playState = 0;
                if (A(aW._iO)) {
                    aZ = aW._setup_html5(aW._iO);
                    if (!aZ._called_load) {
                        aR._wD(aF + "load: " + aW.sID);
                        aZ.load();
                        aZ._called_load = true;
                        if (aW._iO.autoPlay) {
                            aW.play();
                        }
                    } else {
                        aR._wD("HTML5 ignoring request to load again: " + aW.sID);
                    }
                } else {
                    try {
                        aW.isHTML5 = false;
                        aW._iO = w(Z(aW._iO));
                        if (e === 8) {
                            aR.o._load(aW.sID, aW._iO.url, aW._iO.stream, aW._iO.autoPlay, (aW._iO.whileloading ? 1 : 0), aW._iO.loops || 1, aW._iO.usePolicyFile);
                        } else {
                            aR.o._load(aW.sID, aW._iO.url, aW._iO.stream ? true : false, aW._iO.autoPlay ? true : false, aW._iO.loops || 1, aW._iO.autoLoad ? true : false, aW._iO.usePolicyFile);
                        }
                    } catch (a0) {
                        z("smError", 2);
                        af("onload", false);
                        ay();
                    }
                }
                return aW;
            };
            this.unload = function () {
                if (aW.readyState !== 0) {
                    aR._wD('SMSound.unload(): "' + aW.sID + '"');
                    if (!aW.isHTML5) {
                        if (e === 8) {
                            aR.o._unload(aW.sID, aR.nullURL);
                        } else {
                            aR.o._unload(aW.sID);
                        }
                    } else {
                        aV();
                        if (aW._a) {
                            aW._a.pause();
                            aW._a.src = "";
                        }
                    }
                    aX();
                }
                return aW;
            };
            this.destruct = function (aY) {
                aR._wD('SMSound.destruct(): "' + aW.sID + '"');
                if (!aW.isHTML5) {
                    aW._iO.onfailure = null;
                    aR.o._destroySound(aW.sID);
                } else {
                    aV();
                    if (aW._a) {
                        aW._a.pause();
                        aW._a.src = "";
                        if (!aJ) {
                            aW._remove_html5_events();
                        }
                    }
                }
                if (!aY) {
                    aR.destroySound(aW.sID, true);
                }
            };
            this.play = function (a0, aZ) {
                var a1 = "SMSound.play(): ",
                    aY;
                aZ = aZ === undefined ? true : aZ;
                if (!a0) {
                    a0 = {};
                }
                aW._iO = ai(a0, aW._iO);
                aW._iO = ai(aW._iO, aW.options);
                aW.instanceOptions = aW._iO;
                if (aW._iO.serverURL) {
                    if (!aW.connected) {
                        if (!aW.getAutoPlay()) {
                            aR._wD(a1 + " Netstream not connected yet - setting autoPlay");
                            aW.setAutoPlay(true);
                        }
                        return aW;
                    }
                }
                if (A(aW._iO)) {
                    aW._setup_html5(aW._iO);
                    aT();
                }
                if (aW.playState === 1 && !aW.paused) {
                    aY = aW._iO.multiShot;
                    if (!aY) {
                        aR._wD(a1 + '"' + aW.sID + '" already playing (one-shot)', 1);
                        return aW;
                    } else {
                        aR._wD(a1 + '"' + aW.sID + '" already playing (multi-shot)', 1);
                        if (aW.isHTML5) {
                            aW.setPosition(aW._iO.position);
                        }
                    }
                }
                if (!aW.loaded) {
                    if (aW.readyState === 0) {
                        aR._wD(a1 + 'Attempting to load "' + aW.sID + '"', 1);
                        if (!aW.isHTML5) {
                            aW._iO.autoPlay = true;
                            aW.load(aW._iO);
                        } else {
                            aW.load(aW._iO);
                        }
                    } else {
                        if (aW.readyState === 2) {
                            aR._wD(a1 + 'Could not load "' + aW.sID + '" - exiting', 2);
                            return aW;
                        } else {
                            aR._wD(a1 + '"' + aW.sID + '" is loading - attempting to play..', 1);
                        }
                    }
                } else {
                    aR._wD(a1 + '"' + aW.sID + '"');
                }
                if (aW.paused && aW.position && aW.position > 0) {
                    aR._wD(a1 + '"' + aW.sID + '" is resuming from paused state', 1);
                    aW.resume();
                } else {
                    aR._wD(a1 + '"' + aW.sID + '" is starting to play');
                    aW.playState = 1;
                    aW.paused = false;
                    if (!aW.instanceCount || aW._iO.multiShotEvents || (e > 8 && !aW.isHTML5 && !aW.getAutoPlay())) {
                        aW.instanceCount++;
                    }
                    aW.position = (typeof aW._iO.position !== "undefined" && !isNaN(aW._iO.position) ? aW._iO.position : 0);
                    if (!aW.isHTML5) {
                        aW._iO = w(Z(aW._iO));
                    }
                    if (aW._iO.onplay && aZ) {
                        aW._iO.onplay.apply(aW);
                        aW._onplay_called = true;
                    }
                    aW.setVolume(aW._iO.volume, true);
                    aW.setPan(aW._iO.pan, true);
                    if (!aW.isHTML5) {
                        aR.o._start(aW.sID, aW._iO.loops || 1, (e === 9 ? aW.position : aW.position / 1000));
                    } else {
                        aT();
                        aW._setup_html5().play();
                    }
                }
                return aW;
            };
            this.start = this.play;
            this.stop = function (aY) {
                if (aW.playState === 1) {
                    aW._onbufferchange(0);
                    aW.resetOnPosition(0);
                    if (!aW.isHTML5) {
                        aW.playState = 0;
                    }
                    aW.paused = false;
                    if (aW._iO.onstop) {
                        aW._iO.onstop.apply(aW);
                    }
                    if (!aW.isHTML5) {
                        aR.o._stop(aW.sID, aY);
                        if (aW._iO.serverURL) {
                            aW.unload();
                        }
                    } else {
                        if (aW._a) {
                            aW.setPosition(0);
                            aW._a.pause();
                            aW.playState = 0;
                            aW._onTimer();
                            aV();
                            aW.unload();
                        }
                    }
                    aW.instanceCount = 0;
                    aW._iO = {};
                }
                return aW;
            };
            this.setAutoPlay = function (aY) {
                aR._wD("sound " + aW.sID + " turned autoplay " + (aY ? "on" : "off"));
                aW._iO.autoPlay = aY;
                if (aW.isHTML5) {
                    if (aW._a && aY) {
                        aW.play();
                    }
                } else {
                    aR.o._setAutoPlay(aW.sID, aY);
                }
                if (aY) {
                    if (!aW.instanceCount && aW.readyState === 1) {
                        aW.instanceCount++;
                        aR._wD("sound " + aW.sID + " incremented instance count to " + aW.instanceCount);
                    }
                }
            };
            this.getAutoPlay = function () {
                return aW._iO.autoPlay;
            };
            this.setPosition = function (a2, a1) {
                if (a2 === undefined) {
                    a2 = 0;
                }
                var a0, aY, aZ, a4 = (aW.isHTML5 ? Math.max(a2, 0) : Math.min(aW.duration || aW._iO.duration, Math.max(a2, 0)));
                a0 = aW.position;
                aW.position = a4;
                aZ = aW.position / 1000;
                aW.resetOnPosition(aW.position);
                aW._iO.position = a4;
                if (!aW.isHTML5) {
                    aY = e === 9 ? aW.position : aZ;
                    if (aW.readyState && aW.readyState !== 2) {
                        aR.o._setPosition(aW.sID, aY, (aW.paused || !aW.playState));
                    }
                } else {
                    if (aW._a) {
                        if (aW._html5_canplay) {
                            if (aW._a.currentTime !== aZ) {
                                aR._wD("setPosition(" + aZ + "): setting position");
                                try {
                                    aW._a.currentTime = aZ;
                                } catch (a3) {
                                    aR._wD("setPosition(" + aZ + "): setting position failed: " + a3.message, 2);
                                }
                            }
                        } else {
                            aR._wD("setPosition(" + aZ + "): delaying, sound not ready");
                        }
                    }
                }
                if (aW.isHTML5) {
                    if (aW.paused) {
                        aW._onTimer(true);
                    }
                }
                return aW;
            };
            this.pause = function (aY) {
                if (aW.paused || (aW.playState === 0 && aW.readyState !== 1)) {
                    return aW;
                }
                aR._wD("SMSound.pause()");
                aW.paused = true;
                if (!aW.isHTML5) {
                    if (aY || aY === undefined) {
                        aR.o._pause(aW.sID);
                    }
                } else {
                    aW._setup_html5().pause();
                    aV();
                }
                if (aW._iO.onpause) {
                    aW._iO.onpause.apply(aW);
                }
                return aW;
            };
            this.resume = function () {
                if (!aW.paused) {
                    return aW;
                }
                aR._wD("SMSound.resume()");
                aW.paused = false;
                aW.playState = 1;
                if (!aW.isHTML5) {
                    if (aW._iO.isMovieStar) {
                        aW.setPosition(aW.position);
                    }
                    aR.o._pause(aW.sID);
                } else {
                    aW._setup_html5().play();
                    aT();
                }
                if (!aW._onplay_called && aW._iO.onplay) {
                    aW._iO.onplay.apply(aW);
                    aW._onplay_called = true;
                } else {
                    if (aW._iO.onresume) {
                        aW._iO.onresume.apply(aW);
                    }
                }
                return aW;
            };
            this.togglePause = function () {
                aR._wD("SMSound.togglePause()");
                if (aW.playState === 0) {
                    aW.play({
                        position: (e === 9 && !aW.isHTML5 ? aW.position : aW.position / 1000)
                    });
                    return aW;
                }
                if (aW.paused) {
                    aW.resume();
                } else {
                    aW.pause();
                }
                return aW;
            };
            this.setPan = function (aZ, aY) {
                if (typeof aZ === "undefined") {
                    aZ = 0;
                }
                if (typeof aY === "undefined") {
                    aY = false;
                }
                if (!aW.isHTML5) {
                    aR.o._setPan(aW.sID, aZ);
                }
                aW._iO.pan = aZ;
                if (!aY) {
                    aW.pan = aZ;
                    aW.options.pan = aZ;
                }
                return aW;
            };
            this.setVolume = function (aY, aZ) {
                if (typeof aY === "undefined") {
                    aY = 100;
                }
                if (typeof aZ === "undefined") {
                    aZ = false;
                }
                if (!aW.isHTML5) {
                    aR.o._setVolume(aW.sID, (aR.muted && !aW.muted) || aW.muted ? 0 : aY);
                } else {
                    if (aW._a) {
                        aW._a.volume = Math.max(0, Math.min(1, aY / 100));
                    }
                }
                aW._iO.volume = aY;
                if (!aZ) {
                    aW.volume = aY;
                    aW.options.volume = aY;
                }
                return aW;
            };
            this.mute = function () {
                aW.muted = true;
                if (!aW.isHTML5) {
                    aR.o._setVolume(aW.sID, 0);
                } else {
                    if (aW._a) {
                        aW._a.muted = true;
                    }
                }
                return aW;
            };
            this.unmute = function () {
                aW.muted = false;
                var aY = typeof aW._iO.volume !== "undefined";
                if (!aW.isHTML5) {
                    aR.o._setVolume(aW.sID, aY ? aW._iO.volume : aW.options.volume);
                } else {
                    if (aW._a) {
                        aW._a.muted = false;
                    }
                }
                return aW;
            };
            this.toggleMute = function () {
                return (aW.muted ? aW.unmute() : aW.mute());
            };
            this.onposition = function (a0, aZ, aY) {
                aW._onPositionItems.push({
                    position: a0,
                    method: aZ,
                    scope: (typeof aY !== "undefined" ? aY : aW),
                    fired: false
                });
                return aW;
            };
            this.processOnPosition = function () {
                var aZ, a0, aY = aW._onPositionItems.length;
                if (!aY || !aW.playState || aW._onPositionFired >= aY) {
                    return false;
                }
                for (aZ = aY; aZ--;) {
                    a0 = aW._onPositionItems[aZ];
                    if (!a0.fired && aW.position >= a0.position) {
                        a0.method.apply(a0.scope, [a0.position]);
                        a0.fired = true;
                        aR._onPositionFired++;
                    }
                }
                return true;
            };
            this.resetOnPosition = function (aY) {
                var a0, a1, aZ = aW._onPositionItems.length;
                if (!aZ) {
                    return false;
                }
                for (a0 = aZ; a0--;) {
                    a1 = aW._onPositionItems[a0];
                    if (a1.fired && aY <= a1.position) {
                        a1.fired = false;
                        aR._onPositionFired--;
                    }
                }
                return true;
            };
            this._onTimer = function (aZ) {
                var a0, aY = {};
                if (aW._hasTimer || aZ) {
                    if (aW._a && (aZ || ((aW.playState > 0 || aW.readyState === 1) && !aW.paused))) {
                        aW.duration = aW._get_html5_duration();
                        aW.durationEstimate = aW.duration;
                        a0 = aW._a.currentTime ? aW._a.currentTime * 1000 : 0;
                        aW._whileplaying(a0, aY, aY, aY, aY);
                        return true;
                    } else {
                        aR._wD('_onTimer: Warn for "' + aW.sID + '": ' + (!aW._a ? "Could not find element. " : "") + (aW.playState === 0 ? "playState bad, 0?" : "playState = " + aW.playState + ", OK"));
                        return false;
                    }
                }
            };
            this._get_html5_duration = function () {
                var aY = (aW._a ? aW._a.duration * 1000 : (aW._iO ? aW._iO.duration : undefined));
                return (aY && !isNaN(aY) && aY !== Infinity ? aY : (aW._iO ? aW._iO.duration : null));
            };
            aT = function () {
                if (aW.isHTML5) {
                    v(aW);
                }
            };
            aV = function () {
                if (aW.isHTML5) {
                    Q(aW);
                }
            };
            aX = function (aY) {
                aW._onPositionItems = [];
                aW._onPositionFired = 0;
                aW._hasTimer = null;
                aW._onplay_called = false;
                aW._a = null;
                aW._html5_canplay = false;
                aW.bytesLoaded = null;
                aW.bytesTotal = null;
                aW.position = null;
                aW.duration = (aW._iO && aW._iO.duration ? aW._iO.duration : null);
                aW.durationEstimate = null;
                aW.failures = 0;
                aW.loaded = false;
                aW.playState = 0;
                aW.paused = false;
                aW.readyState = 0;
                aW.muted = false;
                aW.didBeforeFinish = false;
                aW.didJustBeforeFinish = false;
                aW.isBuffering = false;
                aW.instanceOptions = {};
                aW.instanceCount = 0;
                aW.peakData = {
                    left: 0,
                    right: 0
                };
                aW.waveformData = {
                    left: [],
                    right: []
                };
                aW.eqData = [];
                aW.eqData.left = [];
                aW.eqData.right = [];
            };
            aX();
            this._setup_html5 = function (a0) {
                var aZ = ai(aW._iO, a0),
                    a3 = decodeURI,
                    a1 = aJ ? aR._global_a : aW._a,
                    a2 = a3(aZ.url),
                    aY = (a1 && a1._t ? a1._t.instanceOptions : null);
                if (a1) {
                    if (a1._t && aY.url === aZ.url && (!aW._lastURL || (aW._lastURL === aY.url))) {
                        return a1;
                    }
                    aR._wD("setting new URL on existing object: " + a2 + (aW._lastURL ? ", old URL: " + aW._lastURL : ""));
                    if (aJ && a1._t && a1._t.playState && aZ.url !== aY.url) {
                        a1._t.stop();
                    }
                    aX();
                    a1.src = aZ.url;
                    aW.url = aZ.url;
                    aW._lastURL = aZ.url;
                    a1._called_load = false;
                } else {
                    aR._wD("creating HTML5 Audio() element with URL: " + a2);
                    a1 = new Audio(aZ.url);
                    a1._called_load = false;
                    if (aJ) {
                        aR._global_a = a1;
                    }
                }
                aW.isHTML5 = true;
                aW._a = a1;
                a1._t = aW;
                aW._add_html5_events();
                a1.loop = (aZ.loops > 1 ? "loop" : "");
                if (aZ.autoLoad || aZ.autoPlay) {
                    a1.autobuffer = "auto";
                    a1.preload = "auto";
                    aW.load();
                    a1._called_load = true;
                } else {
                    a1.autobuffer = false;
                    a1.preload = "none";
                }
                a1.loop = (aZ.loops > 1 ? "loop" : "");
                return a1;
            };
            this._add_html5_events = function () {
                if (aW._a._added_events) {
                    return false;
                }
                var aY;

                function aZ(a1, a0, a2) {
                    return aW._a ? aW._a.addEventListener(a1, a0, a2 || false) : null;
                }
                aR._wD(aF + "adding event listeners: " + aW.sID);
                aW._a._added_events = true;
                for (aY in aR._html5_events) {
                    if (aR._html5_events.hasOwnProperty(aY)) {
                        aZ(aY, aR._html5_events[aY]);
                    }
                }
                return true;
            };
            this._remove_html5_events = function () {
                function aY(a1, a0, a2) {
                    return (aW._a ? aW._a.removeEventListener(a1, a0, a2 || false) : null);
                }
                aR._wD(aF + "removing event listeners: " + aW.sID);
                aW._a._added_events = false;
                for (var aZ in aR._html5_events) {
                    if (aR._html5_events.hasOwnProperty(aZ)) {
                        aY(aZ, aR._html5_events[aZ]);
                    }
                }
            };
            this._whileloading = function (aY, aZ, a1, a0) {
                aW.bytesLoaded = aY;
                aW.bytesTotal = aZ;
                aW.duration = Math.floor(a1);
                aW.bufferLength = a0;
                if (!aW._iO.isMovieStar) {
                    if (aW._iO.duration) {
                        aW.durationEstimate = (aW.duration > aW._iO.duration) ? aW.duration : aW._iO.duration;
                    } else {
                        aW.durationEstimate = parseInt((aW.bytesTotal / aW.bytesLoaded) * aW.duration, 10);
                    }
                    if (aW.durationEstimate === undefined) {
                        aW.durationEstimate = aW.duration;
                    }
                    if (aW.readyState !== 3 && aW._iO.whileloading) {
                        aW._iO.whileloading.apply(aW);
                    }
                } else {
                    aW.durationEstimate = aW.duration;
                    if (aW.readyState !== 3 && aW._iO.whileloading) {
                        aW._iO.whileloading.apply(aW);
                    }
                }
            };
            this._onid3 = function (a1, aY) {
                aR._wD('SMSound._onid3(): "' + this.sID + '" ID3 data received.');
                var a2 = [],
                    a0, aZ;
                for (a0 = 0, aZ = a1.length; a0 < aZ; a0++) {
                    a2[a1[a0]] = aY[a0];
                }
                aW.id3 = ai(aW.id3, a2);
                if (aW._iO.onid3) {
                    aW._iO.onid3.apply(aW);
                }
            };
            this._whileplaying = function (a0, a1, a3, aZ, a2) {
                if (isNaN(a0) || a0 === null) {
                    return false;
                }
                if (aW.playState === 0 && a0 > 0) {
                    a0 = 0;
                }
                aW.position = a0;
                aW.processOnPosition();
                if (e > 8 && !aW.isHTML5) {
                    if (aW._iO.usePeakData && typeof a1 !== "undefined" && a1) {
                        aW.peakData = {
                            left: a1.leftPeak,
                            right: a1.rightPeak
                        };
                    }
                    if (aW._iO.useWaveformData && typeof a3 !== "undefined" && a3) {
                        aW.waveformData = {
                            left: a3.split(","),
                            right: aZ.split(",")
                        };
                    }
                    if (aW._iO.useEQData) {
                        if (typeof a2 !== "undefined" && a2 && a2.leftEQ) {
                            var aY = a2.leftEQ.split(",");
                            aW.eqData = aY;
                            aW.eqData.left = aY;
                            if (typeof a2.rightEQ !== "undefined" && a2.rightEQ) {
                                aW.eqData.right = a2.rightEQ.split(",");
                            }
                        }
                    }
                }
                if (aW.playState === 1) {
                    if (!aW.isHTML5 && aR.flashVersion === 8 && !aW.position && aW.isBuffering) {
                        aW._onbufferchange(0);
                    }
                    if (aW._iO.whileplaying) {
                        aW._iO.whileplaying.apply(aW);
                    }
                    if ((aW.loaded || (!aW.loaded && aW._iO.isMovieStar)) && aW._iO.onbeforefinish && aW._iO.onbeforefinishtime && !aW.didBeforeFinish && aW.duration - aW.position <= aW._iO.onbeforefinishtime) {
                        aW._onbeforefinish();
                    }
                }
                return true;
            };
            this._onconnect = function (aY) {
                var aZ = "SMSound._onconnect(): ";
                aY = (aY === 1);
                aR._wD(aZ + '"' + aW.sID + '"' + (aY ? " connected." : " failed to connect? - " + aW.url), (aY ? 1 : 2));
                aW.connected = aY;
                if (aY) {
                    aW.failures = 0;
                    if (ad(aW.sID)) {
                        if (aW.getAutoPlay()) {
                            aW.play(undefined, aW.getAutoPlay());
                        } else {
                            if (aW._iO.autoLoad) {
                                aW.load();
                            }
                        }
                    }
                    if (aW._iO.onconnect) {
                        aW._iO.onconnect.apply(aW, [aY]);
                    }
                }
            };
            this._onload = function (a0) {
                var aY = "SMSound._onload(): ",
                    aZ = (a0 ? true : false);
                aR._wD(aY + '"' + aW.sID + '"' + (aZ ? " loaded." : " failed to load? - " + aW.url), (aZ ? 1 : 2));
                if (!aZ && !aW.isHTML5) {
                    if (aR.sandbox.noRemote === true) {
                        aR._wD(aY + X("noNet"), 1);
                    }
                    if (aR.sandbox.noLocal === true) {
                        aR._wD(aY + X("noLocal"), 1);
                    }
                }
                aW.loaded = aZ;
                aW.readyState = aZ ? 3 : 2;
                aW._onbufferchange(0);
                if (aW._iO.onload) {
                    aW._iO.onload.apply(aW, [aZ]);
                }
                return true;
            };
            this._onfailure = function (aZ, a0, aY) {
                aW.failures++;
                aR._wD('SMSound._onfailure(): "' + aW.sID + '" count ' + aW.failures);
                if (aW._iO.onfailure && aW.failures === 1) {
                    aW._iO.onfailure(aW, aZ, a0, aY);
                } else {
                    aR._wD("SMSound._onfailure(): ignoring");
                }
            };
            this._onbeforefinish = function () {
                if (!aW.didBeforeFinish) {
                    aW.didBeforeFinish = true;
                    if (aW._iO.onbeforefinish) {
                        aR._wD('SMSound._onbeforefinish(): "' + aW.sID + '"');
                        aW._iO.onbeforefinish.apply(aW);
                    }
                }
            };
            this._onjustbeforefinish = function (aY) {
                if (!aW.didJustBeforeFinish) {
                    aW.didJustBeforeFinish = true;
                    if (aW._iO.onjustbeforefinish) {
                        aR._wD('SMSound._onjustbeforefinish(): "' + aW.sID + '"');
                        aW._iO.onjustbeforefinish.apply(aW);
                    }
                }
            };
            this._onfinish = function () {
                var aY = aW._iO.onfinish;
                aW._onbufferchange(0);
                aW.resetOnPosition(0);
                if (aW._iO.onbeforefinishcomplete) {
                    aW._iO.onbeforefinishcomplete.apply(aW);
                }
                aW.didBeforeFinish = false;
                aW.didJustBeforeFinish = false;
                if (aW.instanceCount) {
                    aW.instanceCount--;
                    if (!aW.instanceCount) {
                        aW.playState = 0;
                        aW.paused = false;
                        aW.instanceCount = 0;
                        aW.instanceOptions = {};
                        aW._iO = {};
                        aV();
                    }
                    if (!aW.instanceCount || aW._iO.multiShotEvents) {
                        if (aY) {
                            aR._wD('SMSound._onfinish(): "' + aW.sID + '"');
                            aY.apply(aW);
                        }
                    }
                }
            };
            this._onbufferchange = function (aY) {
                var aZ = "SMSound._onbufferchange()";
                if (aW.playState === 0) {
                    return false;
                }
                if ((aY && aW.isBuffering) || (!aY && !aW.isBuffering)) {
                    return false;
                }
                aW.isBuffering = (aY === 1);
                if (aW._iO.onbufferchange) {
                    aR._wD(aZ + ": " + aY);
                    aW._iO.onbufferchange.apply(aW);
                }
                return true;
            };
            this._ondataerror = function (aY) {
                if (aW.playState > 0) {
                    aR._wD("SMSound._ondataerror(): " + aY);
                    if (aW._iO.ondataerror) {
                        aW._iO.ondataerror.apply(aW);
                    }
                }
            };
        };
        an = function () {
            return (aD.body ? aD.body : (aD._docElement ? aD.documentElement : aD.getElementsByTagName("div")[0]));
        };
        W = function (aT) {
            return aD.getElementById(aT);
        };
        ai = function (aU, aT) {
            var aX = {},
                aV, aW, aY;
            for (aV in aU) {
                if (aU.hasOwnProperty(aV)) {
                    aX[aV] = aU[aV];
                }
            }
            aW = (typeof aT === "undefined" ? aR.defaultOptions : aT);
            for (aY in aW) {
                if (aW.hasOwnProperty(aY) && typeof aX[aY] === "undefined") {
                    aX[aY] = aW[aY];
                }
            }
            return aX;
        };
        r = (function () {
            var aV = (k.attachEvent),
                aU = {
                    add: (aV ? "attachEvent" : "addEventListener"),
                    remove: (aV ? "detachEvent" : "removeEventListener")
                };

            function aX(a1) {
                var a0 = j.call(a1),
                    aZ = a0.length;
                if (aV) {
                    a0[1] = "on" + a0[1];
                    if (aZ > 3) {
                        a0.pop();
                    }
                } else {
                    if (aZ === 3) {
                        a0.push(false);
                    }
                }
                return a0;
            }
            function aW(aZ, a2) {
                var a0 = aZ.shift(),
                    a1 = [aU[a2]];
                if (aV) {
                    a0[a1](aZ[0], aZ[1]);
                } else {
                    a0[a1].apply(a0, aZ);
                }
            }
            function aY() {
                aW(aX(arguments), "add");
            }
            function aT() {
                aW(aX(arguments), "remove");
            }
            return {
                add: aY,
                remove: aT
            };
        }());
        A = function (aT) {
            return (!aT.serverURL && (aT.type ? av({
                type: aT.type
            }) : av(aT.url) || aQ));
        };
        av = function (aY) {
            if (!aR.useHTML5Audio || !aR.hasHTML5) {
                return false;
            }
            var aT, aX, aZ, aV, aW, aU = aR.audioFormats;
            if (!p) {
                p = [];
                for (aW in aU) {
                    if (aU.hasOwnProperty(aW)) {
                        p.push(aW);
                        if (aU[aW].related) {
                            p = p.concat(aU[aW].related);
                        }
                    }
                }
                p = new RegExp("\\.(" + p.join("|") + ")", "i");
            }
            aX = (typeof aY.type !== "undefined" ? aY.type : null);
            aV = (typeof aY === "string" ? aY.toLowerCase().match(p) : null);
            if (!aV || !aV.length) {
                if (!aX) {
                    return false;
                } else {
                    aZ = aX.indexOf(";");
                    aV = (aZ !== -1 ? aX.substr(0, aZ) : aX).substr(6);
                }
            } else {
                aV = aV[0].substr(1);
            }
            if (aV && typeof aR.html5[aV] !== "undefined") {
                return aR.html5[aV];
            } else {
                if (!aX) {
                    if (aV && aR.html5[aV]) {
                        return aR.html5[aV];
                    } else {
                        aX = "audio/" + aV;
                    }
                }
                aT = aR.html5.canPlayType(aX);
                aR.html5[aV] = aT;
                return aT;
            }
        };
        aO = function () {
            if (!aR.useHTML5Audio || typeof Audio === "undefined") {
                return false;
            }
            var aU = (typeof Audio !== "undefined" ? (H ? new Audio(null) : new Audio()) : null),
                aZ, aY = {},
                aW, aX, aT = aN();

            function aV(a1) {
                var a3, a4, a2, a0 = false;
                if (!aU || typeof aU.canPlayType !== "function") {
                    return false;
                }
                if (a1 instanceof Array) {
                    for (a4 = 0, a2 = a1.length; a4 < a2 && !a0; a4++) {
                        if (aR.html5[a1[a4]] || aU.canPlayType(a1[a4]).match(aR.html5Test)) {
                            a0 = true;
                            aR.html5[a1[a4]] = true;
                        }
                    }
                    return a0;
                } else {
                    a3 = (aU && typeof aU.canPlayType === "function" ? aU.canPlayType(a1) : false);
                    return (a3 && (a3.match(aR.html5Test) ? true : false));
                }
            }
            aW = aR.audioFormats;
            for (aZ in aW) {
                if (aW.hasOwnProperty(aZ)) {
                    aY[aZ] = aV(aW[aZ].type);
                    if (aW[aZ] && aW[aZ].related) {
                        for (aX = aW[aZ].related.length; aX--;) {
                            aR.html5[aW[aZ].related[aX]] = aY[aZ];
                        }
                    }
                }
            }
            aY.canPlayType = (aU ? aV : null);
            aR.html5 = ai(aR.html5, aY);
            return true;
        };
        L = {
            notReady: "Not loaded yet - wait for soundManager.onload()/onready()",
            notOK: "Audio support is not available.",
            appXHTML: ao + "createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.",
            spcWmode: ao + "createMovie(): Removing wmode, preventing known SWF loading issue(s)",
            swf404: aA + ": Verify that %s is a valid path.",
            tryDebug: "Try " + aA + ".debugFlash = true for more security details (output goes to SWF.)",
            checkSWF: "See SWF output for more debug info.",
            localFail: aA + ": Non-HTTP page (" + aD.location.protocol + " URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
            waitFocus: aA + ": Special case: Waiting for focus-related event..",
            waitImpatient: aA + ": Getting impatient, still waiting for Flash%s...",
            waitForever: aA + ": Waiting indefinitely for Flash (will recover if unblocked)...",
            needFunction: aA + ": Function object expected for %s",
            badID: 'Warning: Sound ID "%s" should be a string, starting with a non-numeric character',
            noMS: "MovieStar mode not enabled. Exiting.",
            currentObj: "--- " + aA + "._debug(): Current sound objects ---",
            waitEI: ao + "initMovie(): Waiting for ExternalInterface call from Flash..",
            waitOnload: aA + ": Waiting for window.onload()",
            docLoaded: aA + ": Document already loaded",
            onload: ao + "initComplete(): calling soundManager.onload()",
            onloadOK: aA + ".onload() complete",
            init: "-- " + ao + "init() --",
            didInit: ao + "init(): Already called?",
            flashJS: aA + ": Attempting to call Flash from JS..",
            noPolling: aA + ": Polling (whileloading()/whileplaying() support) is disabled.",
            secNote: "Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
            badRemove: "Warning: Failed to remove flash movie.",
            noPeak: "Warning: peakData features unsupported for movieStar formats",
            shutdown: aA + ".disable(): Shutting down",
            queue: aA + ": Queueing %s handler",
            smFail: aA + ": Failed to initialise.",
            smError: "SMSound.load(): Exception: JS-Flash communication failed, or JS error.",
            fbTimeout: "No flash response, applying ." + aR.swfCSS.swfTimedout + " CSS..",
            fbLoaded: "Flash loaded",
            fbHandler: ao + "flashBlockHandler()",
            manURL: "SMSound.load(): Using manually-assigned URL",
            onURL: aA + ".load(): current URL already assigned.",
            badFV: aA + '.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
            as2loop: "Note: Setting stream:false so looping can work (flash 8 limitation)",
            noNSLoop: "Note: Looping not implemented for MovieStar formats",
            needfl9: "Note: Switching to flash 9, required for MP4 formats.",
            mfTimeout: "Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case",
            mfOn: "mobileFlash::enabling on-screen flash repositioning",
            policy: "Enabling usePolicyFile for data access"
        };
        X = function () {
            var aU = j.call(arguments),
                aX = aU.shift(),
                aW = (L && L[aX] ? L[aX] : ""),
                aV, aT;
            if (aW && aU && aU.length) {
                for (aV = 0, aT = aU.length; aV < aT; aV++) {
                    aW = aW.replace("%s", aU[aV]);
                }
            }
            return aW;
        };
        Z = function (aT) {
            if (e === 8 && aT.loops > 1 && aT.stream) {
                z("as2loop");
                aT.stream = false;
            }
            return aT;
        };
        w = function (aU, aT) {
            if (aU && !aU.usePolicyFile && (aU.onid3 || aU.usePeakData || aU.useWaveformData || aU.useEQData)) {
                aR._wD((aT ? aT + ":" : "") + X("policy"));
                aU.usePolicyFile = true;
            }
            return aU;
        };
        d = function (aT) {
            if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
                console.warn(aT);
            } else {
                aR._wD(aT);
            }
        };
        ac = function () {
            return false;
        };
        U = function (aU) {
            for (var aT in aU) {
                if (aU.hasOwnProperty(aT) && typeof aU[aT] === "function") {
                    aU[aT] = ac;
                }
            }
            aT = null;
        };
        am = function (aT) {
            if (typeof aT === "undefined") {
                aT = false;
            }
            if (F || aT) {
                z("smFail", 2);
                aR.disable(aT);
            }
        };
        h = function (aT) {
            var aU = null;
            if (aT) {
                if (aT.match(/\.swf(\?.*)?$/i)) {
                    aU = aT.substr(aT.toLowerCase().lastIndexOf(".swf?") + 4);
                    if (aU) {
                        return aT;
                    }
                } else {
                    if (aT.lastIndexOf("/") !== aT.length - 1) {
                        aT = aT + "/";
                    }
                }
            }
            return (aT && aT.lastIndexOf("/") !== -1 ? aT.substr(0, aT.lastIndexOf("/") + 1) : "./") + aR.movieURL;
        };
        J = function () {
            if (e !== 8 && e !== 9) {
                aR._wD(X("badFV", e, N));
                aR.flashVersion = N;
            }
            var aT = (aR.debugMode || aR.debugFlash ? "_debug.swf" : ".swf");
            if (aR.useHTML5Audio && !aQ && aR.audioFormats.mp4.required && aR.flashVersion < 9) {
                aR._wD(X("needfl9"));
                aR.flashVersion = 9;
            }
            e = aR.flashVersion;
            aR.version = aR.versionNumber + (aQ ? " (HTML5-only mode)" : (e === 9 ? " (AS3/Flash 9)" : " (AS2/Flash 8)"));
            if (e > 8) {
                aR.defaultOptions = ai(aR.defaultOptions, aR.flash9Options);
                aR.features.buffering = true;
            }
            if (e > 8 && aR.useMovieStar) {
                aR.defaultOptions = ai(aR.defaultOptions, aR.movieStarOptions);
                aR.filePatterns.flash9 = new RegExp("\\.(mp3|" + aR.netStreamTypes.join("|") + ")(\\?.*)?$", "i");
                aR.mimePattern = aR.netStreamMimeTypes;
                aR.features.movieStar = true;
            } else {
                aR.useMovieStar = false;
                aR.features.movieStar = false;
            }
            aR.filePattern = aR.filePatterns[(e !== 8 ? "flash9" : "flash8")];
            aR.movieURL = (e === 8 ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", aT);
            aR.features.peakData = aR.features.waveformData = aR.features.eqData = (e > 8);
        };
        ak = function (aT, aU) {
            if (!aR.o || !aR.allowPolling) {
                return false;
            }
            aR.o._setPolling(aT, aU);
        };

        function E() {
            if (aR.debugURLParam.test(l)) {
                aR.debugMode = true;
            }
            if (W(aR.debugID)) {
                return false;
            }
            var aY, aX, aT, aV, aU;
            if (aR.debugMode && !W(aR.debugID) && ((!az || !aR.useConsole) || (aR.useConsole && az && !aR.consoleOnly))) {
                aY = aD.createElement("div");
                aY.id = aR.debugID + "-toggle";
                aV = {
                    position: "fixed",
                    bottom: "0px",
                    right: "0px",
                    width: "1.2em",
                    height: "1.2em",
                    lineHeight: "1.2em",
                    margin: "2px",
                    textAlign: "center",
                    border: "1px solid #999",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#333",
                    zIndex: 10001
                };
                aY.appendChild(aD.createTextNode("-"));
                aY.onclick = x;
                aY.title = "Toggle SM2 debug console";
                if (aa.match(/msie 6/i)) {
                    aY.style.position = "absolute";
                    aY.style.cursor = "hand";
                }
                for (aU in aV) {
                    if (aV.hasOwnProperty(aU)) {
                        aY.style[aU] = aV[aU];
                    }
                }
                aX = aD.createElement("div");
                aX.id = aR.debugID;
                aX.style.display = (aR.debugMode ? "block" : "none");
                if (aR.debugMode && !W(aY.id)) {
                    try {
                        aT = an();
                        aT.appendChild(aY);
                    } catch (aW) {
                        throw new Error(X("appXHTML"));
                    }
                    aT.appendChild(aX);
                }
            }
            aT = null;
        }
        aH = function (a8, aX) {
            var a2 = null,
                a7 = (aX ? aX : aR.url),
                a1 = (aR.altURL ? aR.altURL : a7),
                ba, aY, a5 = an(),
                bb, a3, a0, a4 = I(),
                aZ, aV, bc, aT = "100%",
                aU = null,
                aW = aD.getElementsByTagName("html")[0];
            aU = (aW && aW.dir && aW.dir.match(/rtl/i));
            a8 = (typeof a8 === "undefined" ? aR.id : a8);
            if (at && aK) {
                return false;
            }
            function a6() {
                aR._wD("-- SoundManager 2 " + aR.version + (!aQ && aR.useHTML5Audio ? (aR.hasHTML5 ? " + HTML5 audio" : ", no HTML5 audio support") : "") + (!aQ ? (aR.useMovieStar ? ", MovieStar mode" : "") + (aR.useHighPerformance ? ", high performance mode, " : ", ") + ((aR.flashPollingInterval ? "custom (" + aR.flashPollingInterval + "ms)" : (aR.useFastPolling ? "fast" : "normal")) + " polling") + (aR.wmode ? ", wmode: " + aR.wmode : "") + (aR.debugFlash ? ", flash debug mode" : "") + (aR.useFlashBlock ? ", flashBlock mode" : "") : "") + " --", 1);
            }
            if (aQ) {
                J();
                a6();
                aR.oMC = W(aR.movieID);
                aw();
                at = true;
                aK = true;
                return false;
            }
            at = true;
            J();
            aR.url = h(aR._overHTTP ? a7 : a1);
            aX = aR.url;
            aR.wmode = (!aR.wmode && aR.useHighPerformance && !aR.useMovieStar ? "transparent" : aR.wmode);
            if (aR.wmode !== null && (aa.match(/msie 8/i) || (!f && !aR.useHighPerformance)) && navigator.platform.match(/win32|win64/i)) {
                aR.specialWmodeCase = true;
                z("spcWmode");
                aR.wmode = null;
            }
            ba = {
                name: a8,
                id: a8,
                src: aX,
                width: aT,
                height: aT,
                quality: "high",
                allowScriptAccess: aR.allowScriptAccess,
                bgcolor: aR.bgColor,
                pluginspage: aR._http + "//www.macromedia.com/go/getflashplayer",
                type: "application/x-shockwave-flash",
                wmode: aR.wmode,
                hasPriority: "true"
            };
            if (aR.debugFlash) {
                ba.FlashVars = "debug=1";
            }
            if (!aR.wmode) {
                delete ba.wmode;
            }
            if (f) {
                aY = aD.createElement("div");
                a3 = '<object id="' + a8 + '" data="' + aX + '" type="' + ba.type + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + aR._http + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="' + ba.width + '" height="' + ba.height + '"><param name="movie" value="' + aX + '" /><param name="AllowScriptAccess" value="' + aR.allowScriptAccess + '" /><param name="quality" value="' + ba.quality + '" />' + (aR.wmode ? '<param name="wmode" value="' + aR.wmode + '" /> ' : "") + '<param name="bgcolor" value="' + aR.bgColor + '" />' + (aR.debugFlash ? '<param name="FlashVars" value="' + ba.FlashVars + '" />' : "") + "</object>";
            } else {
                aY = aD.createElement("embed");
                for (bb in ba) {
                    if (ba.hasOwnProperty(bb)) {
                        aY.setAttribute(bb, ba[bb]);
                    }
                }
            }
            E();
            a4 = I();
            a5 = an();
            if (a5) {
                aR.oMC = W(aR.movieID) ? W(aR.movieID) : aD.createElement("div");
                if (!aR.oMC.id) {
                    aR.oMC.id = aR.movieID;
                    aR.oMC.className = aR.swfCSS.swfDefault + " " + a4;
                    aZ = null;
                    a0 = null;
                    if (!aR.useFlashBlock) {
                        if (aR.useHighPerformance) {
                            aZ = {
                                position: "fixed",
                                width: "8px",
                                height: "8px",
                                bottom: "0px",
                                left: "0px",
                                overflow: "hidden"
                            };
                        } else {
                            aZ = {
                                position: "absolute",
                                width: "6px",
                                height: "6px",
                                top: "-9999px",
                                left: "-9999px"
                            };
                            if (aU) {
                                aZ.left = Math.abs(parseInt(aZ.left, 10)) + "px";
                            }
                        }
                    }
                    if (n) {
                        aR.oMC.style.zIndex = 10000;
                    }
                    if (!aR.debugFlash) {
                        for (aV in aZ) {
                            if (aZ.hasOwnProperty(aV)) {
                                aR.oMC.style[aV] = aZ[aV];
                            }
                        }
                    }
                    try {
                        if (!f) {
                            aR.oMC.appendChild(aY);
                        }
                        a5.appendChild(aR.oMC);
                        if (f) {
                            a0 = aR.oMC.appendChild(aD.createElement("div"));
                            a0.className = aR.swfCSS.swfBox;
                            a0.innerHTML = a3;
                        }
                        aK = true;
                    } catch (a9) {
                        throw new Error(X("appXHTML"));
                    }
                } else {
                    bc = aR.oMC.className;
                    aR.oMC.className = (bc ? bc + " " : aR.swfCSS.swfDefault) + (a4 ? " " + a4 : "");
                    aR.oMC.appendChild(aY);
                    if (f) {
                        a0 = aR.oMC.appendChild(aD.createElement("div"));
                        a0.className = aR.swfCSS.swfBox;
                        a0.innerHTML = a3;
                    }
                    aK = true;
                }
            }
            if (a2) {
                aR._wD(a2);
            }
            a6();
            aR._wD(ao + "createMovie(): Trying to load " + aX + (!aR._overHTTP && aR.altURL ? " (alternate URL)" : ""), 1);
            return true;
        };
        ad = this.getSoundById;
        s = function () {
            if (aQ) {
                aH();
                return false;
            }
            if (aR.o) {
                return false;
            }
            aR.o = aR.getMovie(aR.id);
            if (!aR.o) {
                if (!o) {
                    aH(aR.id, aR.url);
                } else {
                    if (!f) {
                        aR.oMC.appendChild(o);
                    } else {
                        aR.oMC.innerHTML = aq;
                    }
                    o = null;
                    at = true;
                }
                aR.o = aR.getMovie(aR.id);
            }
            if (aR.o) {
                aR._wD(ao + "initMovie(): Got " + aR.o.nodeName + " element (" + (at ? "created via JS" : "static HTML") + ")");
                z("waitEI");
            }
            if (aR.oninitmovie instanceof Function) {
                setTimeout(aR.oninitmovie, 1);
            }
            return true;
        };
        au = function (aT) {
            if (aT) {
                aR.url = aT;
            }
            s();
        };
        ah = function () {
            setTimeout(t, 500);
        };
        t = function () {
            if (aS) {
                return false;
            }
            aS = true;
            r.remove(k, "load", ah);
            if (ab && !aE) {
                z("waitFocus");
                return false;
            }
            var aT;
            if (!aI) {
                aT = aR.getMoviePercent();
                aR._wD(X("waitImpatient", (aT === 100 ? " (SWF loaded)" : (aT > 0 ? " (SWF " + aT + "% loaded)" : ""))));
            }
            setTimeout(function () {
                aT = aR.getMoviePercent();
                if (!aI) {
                    aR._wD(aA + ": No Flash response within expected time.\nLikely causes: " + (aT === 0 ? "Loading " + aR.movieURL + " may have failed (and/or Flash " + e + "+ not present?), " : "") + "Flash blocked or JS-Flash security error." + (aR.debugFlash ? " " + X("checkSWF") : ""), 2);
                    if (!aR._overHTTP && aT) {
                        z("localFail", 2);
                        if (!aR.debugFlash) {
                            z("tryDebug", 2);
                        }
                    }
                    if (aT === 0) {
                        aR._wD(X("swf404", aR.url));
                    }
                    af("flashtojs", false, ": Timed out" + aR._overHTTP ? " (Check flash security or flash blockers)" : " (No plugin/missing SWF?)");
                }
                if (!aI && G) {
                    if (aT === null) {
                        if (aR.useFlashBlock || aR.flashLoadTimeout === 0) {
                            if (aR.useFlashBlock) {
                                i();
                            }
                            z("waitForever");
                        } else {
                            am(true);
                        }
                    } else {
                        if (aR.flashLoadTimeout === 0) {
                            z("waitForever");
                        } else {
                            am(true);
                        }
                    }
                }
            }, aR.flashLoadTimeout);
        };
        au = function (aT) {
            if (aT) {
                aR.url = aT;
            }
            s();
        };
        z = function (aU, aT) {
            if (!aU) {
                return "";
            } else {
                return aR._wD(X(aU), aT);
            }
        };
        if (l.indexOf("debug=alert") + 1 && aR.debugMode) {
            aR._wD = function (aT) {
                c.alert(aT);
            };
        }
        x = function () {
            var aU = W(aR.debugID),
                aT = W(aR.debugID + "-toggle");
            if (!aU) {
                return false;
            }
            if (m) {
                aT.innerHTML = "+";
                aU.style.display = "none";
            } else {
                aT.innerHTML = "-";
                aU.style.display = "block";
            }
            m = !m;
        };
        af = function (aW, aT, aU) {
            if (typeof sm2Debugger !== "undefined") {
                try {
                    sm2Debugger.handleEvent(aW, aT, aU);
                } catch (aV) {}
            }
            return true;
        };
        I = function () {
            var aT = [];
            if (aR.debugMode) {
                aT.push(aR.swfCSS.sm2Debug);
            }
            if (aR.debugFlash) {
                aT.push(aR.swfCSS.flashDebug);
            }
            if (aR.useHighPerformance) {
                aT.push(aR.swfCSS.highPerf);
            }
            return aT.join(" ");
        };
        i = function () {
            var aT = X("fbHandler"),
                aV = aR.getMoviePercent(),
                aU = aR.swfCSS;
            if (!aR.ok()) {
                if (ag) {
                    aR.oMC.className = I() + " " + aU.swfDefault + " " + (aV === null ? aU.swfTimedout : aU.swfError);
                    aR._wD(aT + ": " + X("fbTimeout") + (aV ? " (" + X("fbLoaded") + ")" : ""));
                }
                aR.didFlashBlock = true;
                aP({
                    type: "ontimeout",
                    ignoreInit: true
                });
                if (aR.onerror instanceof Function) {
                    aR.onerror.apply(k);
                }
            } else {
                if (aR.didFlashBlock) {
                    aR._wD(aT + ": Unblocked");
                }
                if (aR.oMC) {
                    aR.oMC.className = [I(), aU.swfDefault, aU.swfLoaded + (aR.didFlashBlock ? " " + aU.swfUnblocked : "")].join(" ");
                }
            }
        };
        aB = function () {
            function aT() {
                r.remove(k, "focus", aB);
                r.remove(k, "load", aB);
            }
            if (aE || !ab) {
                aT();
                return true;
            }
            G = true;
            aE = true;
            aR._wD(ao + "handleFocus()");
            if (B && ab) {
                r.remove(k, "mousemove", aB);
            }
            aS = false;
            aT();
            return true;
        };
        T = function (aU) {
            if (aI) {
                return false;
            }
            if (aQ) {
                aR._wD("-- SoundManager 2: loaded --");
                aI = true;
                aP();
                ap();
                return true;
            }
            var aV = aR.oMC.className,
                aT = (aR.useFlashBlock && aR.flashLoadTimeout && !aR.getMoviePercent());
            if (!aT) {
                aI = true;
            }
            aR._wD("-- SoundManager 2 " + (F ? "failed to load" : "loaded") + " (" + (F ? "security/load error" : "OK") + ") --", 1);
            if (F || aU) {
                if (aR.useFlashBlock) {
                    aR.oMC.className = I() + " " + (aR.getMoviePercent() === null ? aR.swfCSS.swfTimedout : aR.swfCSS.swfError);
                }
                aP({
                    type: "ontimeout"
                });
                af("onload", false);
                if (aR.onerror instanceof Function) {
                    aR.onerror.apply(k);
                }
                return false;
            } else {
                af("onload", true);
            }
            r.add(k, "unload", ac);
            if (aR.waitForWindowLoad && !u) {
                z("waitOnload");
                r.add(k, "load", ap);
                return false;
            } else {
                if (aR.waitForWindowLoad && u) {
                    z("docLoaded");
                }
                ap();
            }
            return true;
        };
        aL = function (aV, aU, aT) {
            if (typeof aj[aV] === "undefined") {
                aj[aV] = [];
            }
            aj[aV].push({
                method: aU,
                scope: (aT || null),
                fired: false
            });
        };
        aP = function (aY) {
            if (!aY) {
                aY = {
                    type: "onready"
                };
            }
            if (!aI && aY && !aY.ignoreInit) {
                return false;
            }
            var aV = {
                success: (aY && aY.ignoreInit ? aR.ok() : !F)
            },
                aU = (aY && aY.type ? aj[aY.type] || [] : []),
                aT = [],
                aZ, aX, aW = (ag && aR.useFlashBlock && !aR.ok());
            for (aZ = 0; aZ < aU.length; aZ++) {
                if (aU[aZ].fired !== true) {
                    aT.push(aU[aZ]);
                }
            }
            if (aT.length) {
                aR._wD(aA + ": Firing " + aT.length + " " + aY.type + "() item" + (aT.length === 1 ? "" : "s"));
                for (aZ = 0, aX = aT.length; aZ < aX; aZ++) {
                    if (aT[aZ].scope) {
                        aT[aZ].method.apply(aT[aZ].scope, [aV]);
                    } else {
                        aT[aZ].method(aV);
                    }
                    if (!aW) {
                        aT[aZ].fired = true;
                    }
                }
            }
            return true;
        };
        ap = function () {
            k.setTimeout(function () {
                if (aR.useFlashBlock) {
                    i();
                }
                aP();
                if (aR.onload instanceof Function) {
                    z("onload", 1);
                    aR.onload.apply(k);
                    z("onloadOK", 1);
                }
                if (aR.waitForWindowLoad) {
                    r.add(k, "load", ap);
                }
            }, 1);
        };
        aN = function () {
            if (g !== undefined) {
                return g;
            }
            var aT = false,
                a0 = navigator,
                aW = a0.plugins,
                aZ, aV, aU, aY = k.ActiveXObject;
            if (aW && aW.length) {
                aV = "application/x-shockwave-flash";
                aU = a0.mimeTypes;
                if (aU && aU[aV] && aU[aV].enabledPlugin && aU[aV].enabledPlugin.description) {
                    aT = true;
                }
            } else {
                if (typeof aY !== "undefined") {
                    try {
                        aZ = new aY("ShockwaveFlash.ShockwaveFlash");
                    } catch (aX) {}
                    aT = ( !! aZ);
                }
            }
            g = aT;
            return aT;
        };
        ae = function () {
            var aV, aU, aT = (aa.match(/iphone os (1|2|3_0|3_1)/i) ? true : false);
            if (aT) {
                aR.hasHTML5 = false;
                aQ = true;
                if (aR.oMC) {
                    aR.oMC.style.display = "none";
                }
                return false;
            }
            if (aR.useHTML5Audio) {
                if (!aR.html5 || !aR.html5.canPlayType) {
                    aR._wD("SoundManager: No HTML5 Audio() support detected.");
                    aR.hasHTML5 = false;
                    return true;
                } else {
                    aR.hasHTML5 = true;
                }
                if (al) {
                    aR._wD(ao + "Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - " + (!g ? " would use flash fallback for MP3/MP4, but none detected." : "will use flash fallback for MP3/MP4, if available"), 1);
                    if (aN()) {
                        return true;
                    }
                }
            } else {
                return true;
            }
            for (aU in aR.audioFormats) {
                if (aR.audioFormats.hasOwnProperty(aU) && aR.audioFormats[aU].required && !aR.html5.canPlayType(aR.audioFormats[aU].type)) {
                    aV = true;
                }
            }
            if (aR.ignoreFlash) {
                aV = false;
            }
            aQ = (aR.useHTML5Audio && aR.hasHTML5 && !aV && !aR.requireFlash);
            return (aN() && aV);
        };
        aw = function () {
            var aV, aU = [];
            z("init");
            if (aI) {
                z("didInit");
                return false;
            }
            function aT() {
                r.remove(k, "load", aR.beginDelayedInit);
            }
            if (aR.hasHTML5) {
                for (aV in aR.audioFormats) {
                    if (aR.audioFormats.hasOwnProperty(aV)) {
                        aU.push(aV + ": " + aR.html5[aV]);
                    }
                }
                aR._wD("-- SoundManager 2: HTML5 support tests (" + aR.html5Test + "): " + aU.join(", ") + " --", 1);
            }
            if (aQ) {
                if (!aI) {
                    aT();
                    aR.enabled = true;
                    T();
                }
                return true;
            }
            s();
            try {
                z("flashJS");
                aR.o._externalInterfaceTest(false);
                if (!aR.allowPolling) {
                    z("noPolling", 1);
                } else {
                    ak(true, aR.flashPollingInterval ? aR.flashPollingInterval : (aR.useFastPolling ? 10 : 50));
                }
                if (!aR.debugMode) {
                    aR.o._disableDebug();
                }
                aR.enabled = true;
                af("jstoflash", true);
            } catch (aW) {
                aR._wD("js/flash exception: " + aW.toString());
                af("jstoflash", false);
                am(true);
                T();
                return false;
            }
            T();
            aT();
            return true;
        };
        S = function () {
            if (C) {
                return false;
            }
            aH();
            s();
            C = true;
            return true;
        };
        aM = function () {
            if (ax) {
                return false;
            }
            ax = true;
            E();
            if (!aR.useHTML5Audio) {
                if (!aN()) {
                    aR._wD("SoundManager: No Flash detected, trying HTML5");
                    aR.useHTML5Audio = true;
                }
            }
            aO();
            aR.html5.usingFlash = ae();
            ag = aR.html5.usingFlash;
            ax = true;
            if (aD.removeEventListener) {
                aD.removeEventListener("DOMContentLoaded", aM, false);
            }
            au();
            return true;
        };
        v = function (aT) {
            if (!aT._hasTimer) {
                aT._hasTimer = true;
            }
        };
        Q = function (aT) {
            if (aT._hasTimer) {
                aT._hasTimer = false;
            }
        };
        ay = function () {
            if (aR.onerror instanceof Function) {
                aR.onerror();
            }
            aR.disable();
        };
        Y = function () {
            if (!al || !aN()) {
                return false;
            }
            var aT = aR.audioFormats,
                aU, aV;
            for (aV in aT) {
                if (aT.hasOwnProperty(aV)) {
                    if (aV === "mp3" || aV === "mp4") {
                        aR._wD(aA + ": Using flash fallback for " + aV + " format");
                        aR.html5[aV] = false;
                        if (aT[aV] && aT[aV].related) {
                            for (aU = aT[aV].related.length; aU--;) {
                                aR.html5[aT[aV].related[aU]] = false;
                            }
                        }
                    }
                }
            }
        };
        this._setSandboxType = function (aT) {
            var aU = aR.sandbox;
            aU.type = aT;
            aU.description = aU.types[(typeof aU.types[aT] !== "undefined" ? aT : "unknown")];
            aR._wD("Flash security sandbox type: " + aU.type);
            if (aU.type === "localWithFile") {
                aU.noRemote = true;
                aU.noLocal = false;
                z("secNote", 2);
            } else {
                if (aU.type === "localWithNetwork") {
                    aU.noRemote = false;
                    aU.noLocal = true;
                } else {
                    if (aU.type === "localTrusted") {
                        aU.noRemote = false;
                        aU.noLocal = false;
                    }
                }
            }
        };
        this._externalInterfaceOK = function (aT) {
            if (aR.swfLoaded) {
                return false;
            }
            var aU = new Date().getTime();
            aR._wD(ao + "externalInterfaceOK()" + (aT ? " (~" + (aU - aT) + " ms)" : ""));
            af("swf", true);
            af("flashtojs", true);
            aR.swfLoaded = true;
            ab = false;
            if (al) {
                Y();
            }
            if (f) {
                setTimeout(aw, 100);
            } else {
                aw();
            }
        };
        P = function () {
            if (aD.readyState === "complete") {
                aM();
                aD.detachEvent("onreadystatechange", P);
            }
            return true;
        };
        if (!aR.hasHTML5 || ag) {
            r.add(k, "focus", aB);
            r.add(k, "load", aB);
            r.add(k, "load", ah);
            if (B && ab) {
                r.add(k, "mousemove", aB);
            }
        }
        if (aD.addEventListener) {
            aD.addEventListener("DOMContentLoaded", aM, false);
        } else {
            if (aD.attachEvent) {
                aD.attachEvent("onreadystatechange", P);
            } else {
                af("onload", false);
                ay();
            }
        }
        if (aD.readyState === "complete") {
            setTimeout(aM, 100);
        }
    }
    if (typeof SM2_DEFER === "undefined" || !SM2_DEFER) {
        b = new a();
    }
    c.SoundManager = a;
    c.soundManager = b;
}(window));
jQuery.cookie = function (d, e, b) {
    if (arguments.length > 1 && String(e) !== "[object Object]") {
        b = jQuery.extend({}, b);
        if (e === null || e === undefined) {
            b.expires = -1;
        }
        if (typeof b.expires === "number") {
            var g = b.expires,
                c = b.expires = new Date();
            c.setDate(c.getDate() + g);
        }
        e = String(e);
        return (document.cookie = [encodeURIComponent(d), "=", b.raw ? e : encodeURIComponent(e), b.expires ? "; expires=" + b.expires.toUTCString() : "", b.path ? "; path=" + b.path : "", b.domain ? "; domain=" + b.domain : "", b.secure ? "; secure" : ""].join(""));
    }
    b = e || {};
    var a, f = b.raw ?
    function (h) {
        return h;
    } : decodeURIComponent;
    return (a = new RegExp("(?:^|; )" + encodeURIComponent(d) + "=([^;]*)").exec(document.cookie)) ? f(a[1]) : null;
};
(function (d) {
    var c = function (g, f) {
            return (g << f) | (g >>> (32 - f));
        };
    var b = function (j) {
            var f = "";
            var g;
            var k;
            var h;
            for (g = 0; g <= 6; g += 2) {
                k = (j >>> (g * 4 + 4)) & 15;
                h = (j >>> (g * 4)) & 15;
                f += k.toString(16) + h.toString(16);
            }
            return f;
        };
    var a = function (j) {
            var g = "";
            var h;
            var f;
            for (h = 7; h >= 0; h--) {
                f = (j >>> (h * 4)) & 15;
                g += f.toString(16);
            }
            return g;
        };
    var e = function (g) {
            g = g.replace(/\x0d\x0a/g, "\x0a");
            var f = "";
            for (var i = 0; i < g.length; i++) {
                var h = g.charCodeAt(i);
                if (h < 128) {
                    f += String.fromCharCode(h);
                } else {
                    if ((h > 127) && (h < 2048)) {
                        f += String.fromCharCode((h >> 6) | 192);
                        f += String.fromCharCode((h & 63) | 128);
                    } else {
                        f += String.fromCharCode((h >> 12) | 224);
                        f += String.fromCharCode(((h >> 6) & 63) | 128);
                        f += String.fromCharCode((h & 63) | 128);
                    }
                }
            }
            return f;
        };
    d.extend({
        sha1: function (f) {
            var l;
            var x, w;
            var g = new Array(80);
            var o = 1732584193;
            var n = 4023233417;
            var m = 2562383102;
            var k = 271733878;
            var h = 3285377520;
            var v, t, s, r, q;
            var y;
            f = e(f);
            var p = f.length;
            var u = new Array();
            for (x = 0; x < p - 3; x += 4) {
                w = f.charCodeAt(x) << 24 | f.charCodeAt(x + 1) << 16 | f.charCodeAt(x + 2) << 8 | f.charCodeAt(x + 3);
                u.push(w);
            }
            switch (p % 4) {
            case 0:
                x = 2147483648;
                break;
            case 1:
                x = f.charCodeAt(p - 1) << 24 | 8388608;
                break;
            case 2:
                x = f.charCodeAt(p - 2) << 24 | f.charCodeAt(p - 1) << 16 | 32768;
                break;
            case 3:
                x = f.charCodeAt(p - 3) << 24 | f.charCodeAt(p - 2) << 16 | f.charCodeAt(p - 1) << 8 | 128;
                break;
            }
            u.push(x);
            while ((u.length % 16) != 14) {
                u.push(0);
            }
            u.push(p >>> 29);
            u.push((p << 3) & 4294967295);
            for (l = 0; l < u.length; l += 16) {
                for (x = 0; x < 16; x++) {
                    g[x] = u[l + x];
                }
                for (x = 16; x <= 79; x++) {
                    g[x] = c(g[x - 3] ^ g[x - 8] ^ g[x - 14] ^ g[x - 16], 1);
                }
                v = o;
                t = n;
                s = m;
                r = k;
                q = h;
                for (x = 0; x <= 19; x++) {
                    y = (c(v, 5) + ((t & s) | (~t & r)) + q + g[x] + 1518500249) & 4294967295;
                    q = r;
                    r = s;
                    s = c(t, 30);
                    t = v;
                    v = y;
                }
                for (x = 20; x <= 39; x++) {
                    y = (c(v, 5) + (t ^ s ^ r) + q + g[x] + 1859775393) & 4294967295;
                    q = r;
                    r = s;
                    s = c(t, 30);
                    t = v;
                    v = y;
                }
                for (x = 40; x <= 59; x++) {
                    y = (c(v, 5) + ((t & s) | (t & r) | (s & r)) + q + g[x] + 2400959708) & 4294967295;
                    q = r;
                    r = s;
                    s = c(t, 30);
                    t = v;
                    v = y;
                }
                for (x = 60; x <= 79; x++) {
                    y = (c(v, 5) + (t ^ s ^ r) + q + g[x] + 3395469782) & 4294967295;
                    q = r;
                    r = s;
                    s = c(t, 30);
                    t = v;
                    v = y;
                }
                o = (o + v) & 4294967295;
                n = (n + t) & 4294967295;
                m = (m + s) & 4294967295;
                k = (k + r) & 4294967295;
                h = (h + q) & 4294967295;
            }
            var y = a(o) + a(n) + a(m) + a(k) + a(h);
            return y.toLowerCase();
        }
    });
})(jQuery);
$.fn.egrep = function (b) {
    var a = [];
    var c = function (e) {
            if (e.nodeType == Node.TEXT_NODE) {
                var d = typeof b == "string" ? e.nodeValue.indexOf(b) != -1 : b.test(e.nodeValue);
                if (d) {
                    a.push(e.parentNode);
                }
            } else {
                $.each(e.childNodes, function (g, f) {
                    c(f);
                });
            }
        };
    this.each(function () {
        c(this);
    });
    return a;
};
var EventHelpers = new function () {
        var me = this;
        var safariTimer;
        var isSafari = /WebKit/i.test(navigator.userAgent);
        var globalEvent;
        me.init = function () {
            if (me.hasPageLoadHappened(arguments)) {
                return;
            }
            if (document.createEventObject) {
                globalEvent = document.createEventObject();
            } else {
                if (document.createEvent) {
                    globalEvent = document.createEvent("HTMLEvents");
                }
            }
            me.docIsLoaded = true;
        };
        me.addEvent = function (obj, evType, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evType, fn, false);
            } else {
                if (obj.attachEvent) {
                    obj["e" + evType + fn] = fn;
                    obj[evType + fn] = function () {
                        obj["e" + evType + fn](self.event);
                    };
                    obj.attachEvent("on" + evType, obj[evType + fn]);
                }
            }
        };
        me.removeEvent = function (obj, evType, fn) {
            if (obj.removeEventListener) {
                obj.removeEventListener(evType, fn, false);
            } else {
                if (obj.detachEvent) {
                    try {
                        obj.detachEvent("on" + evType, obj[evType + fn]);
                        obj[evType + fn] = null;
                        obj["e" + evType + fn] = null;
                    } catch (ex) {}
                }
            }
        };

        function removeEventAttribute(obj, beginName) {
            var attributes = obj.attributes;
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var name = attribute.name;
                if (name.indexOf(beginName) == 0) {
                    attribute.specified = false;
                }
            }
        }
        me.addScrollWheelEvent = function (obj, fn) {
            if (obj.addEventListener) {
                obj.addEventListener("DOMMouseScroll", fn, true);
            }
            if (obj.attachEvent) {
                obj.attachEvent("onmousewheel", fn);
            }
        };
        me.removeScrollWheelEvent = function (obj, fn) {
            if (obj.removeEventListener) {
                obj.removeEventListener("DOMMouseScroll", fn, true);
            }
            if (obj.detachEvent) {
                obj.detatchEvent("onmousewheel", fn);
            }
        };
        me.getMouseX = function (e) {
            if (!e) {
                return;
            }
            if (e.pageX != null) {
                return e.pageX;
            } else {
                if (window.event != null && window.event.clientX != null && document.body != null && document.body.scrollLeft != null) {
                    return window.event.clientX + document.body.scrollLeft;
                } else {
                    if (e.clientX != null) {
                        return e.clientX;
                    } else {
                        return null;
                    }
                }
            }
        };
        me.getMouseY = function (e) {
            if (e.pageY != null) {
                return e.pageY;
            } else {
                if (window.event != null && window.event.clientY != null && document.body != null && document.body.scrollTop != null) {
                    return window.event.clientY + document.body.scrollTop;
                } else {
                    if (e.clientY != null) {
                        return e.clientY;
                    }
                }
            }
        };
        me.getScrollWheelDelta = function (e) {
            var delta = 0;
            if (!e) {
                e = window.event;
            }
            if (e.wheelDelta) {
                delta = e.wheelDelta / 120;
                if (window.opera) {
                    delta = -delta;
                }
            } else {
                if (e.detail) {
                    delta = -e.detail / 3;
                }
            }
            return delta;
        };
        me.addMouseEvent = function (func) {
            if (document.captureEvents) {
                document.captureEvents(Event.MOUSEMOVE);
            }
            document.onmousemove = func;
            window.onmousemove = func;
            window.onmouseover = func;
        };
        me.getEventTarget = function (e) {
            if (e.toElement) {
                return e.toElement;
            } else {
                if (e.currentTarget) {
                    return e.currentTarget;
                } else {
                    if (e.srcElement) {
                        return e.srcElement;
                    } else {
                        return null;
                    }
                }
            }
        };
        me.getKey = function (e) {
            if (e.keyCode) {
                return e.keyCode;
            } else {
                if (e.event && e.event.keyCode) {
                    return window.event.keyCode;
                } else {
                    if (e.which) {
                        return e.which;
                    }
                }
            }
        };
        me.addPageLoadEvent = function (funcName) {
            var func = eval(funcName); /*@cc_on @*/
/*@if (@_win32)
         pageLoadEventArray.push(func);
         return;
         /*@end @*/
            if (isSafari) {
                pageLoadEventArray.push(func);
                if (!safariTimer) {
                    safariTimer = setInterval(function () {
                        if (/loaded|complete/.test(document.readyState)) {
                            clearInterval(safariTimer);
                            me.runPageLoadEvents();
                            return;
                        }
                        set = true;
                    }, 10);
                }
            } else {
                if (document.addEventListener) {
                    var x = document.addEventListener("DOMContentLoaded", func, null);
                } else {
                    me.addEvent(window, "load", func);
                }
            }
        };
        var pageLoadEventArray = new Array();
        me.runPageLoadEvents = function (e) {
            if (isSafari || e.srcElement.readyState == "complete") {
                for (var i = 0; i < pageLoadEventArray.length; i++) {
                    pageLoadEventArray[i]();
                }
            }
        };
        me.hasPageLoadHappened = function (funcArgs) {
            if (funcArgs.callee.done) {
                return true;
            }
            funcArgs.callee.done = true;
        };
        me.preventDefault = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            try {
                e.returnValue = false;
            } catch (ex) {}
        };
        me.cancelBubble = function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            try {
                e.cancelBubble = true;
            } catch (ex) {}
        };
        me.fireEvent = function (element, event, options) {
            if (!element) {
                return;
            }
            if (document.createEventObject) {
                return element.fireEvent("on" + event, globalEvent);
                jslog.debug("ss");
            } else {
                globalEvent.initEvent(event, true, true);
                return !element.dispatchEvent(globalEvent);
            }
        };

        function init() { /*@cc_on @*/
/*@if (@_win32)
        
         document.write('<script id="__ie_onload" defer src="' +
        
         ((location.protocol == 'https:') ? '//0' : 'javascript:void(0)') + '"><\/script>');
        
         var script = document.getElementById("__ie_onload");
        
         me.addEvent(script, 'readystatechange', me.runPageLoadEvents);
        
         /*@end @*/
        }
        init();
    };
EventHelpers.addPageLoadEvent("EventHelpers.init");
eval(function (h, b, j, f, g, i) {
    g = function (a) {
        return (a < b ? "" : g(parseInt(a / b))) + ((a = a % b) > 35 ? String.fromCharCode(a + 29) : a.toString(36));
    };
    if (!"".replace(/^/, String)) {
        while (j--) {
            i[g(j)] = f[j] || g(j);
        }
        f = [function (a) {
            return i[a];
        }];
        g = function () {
            return "\\w+";
        };
        j = 1;
    }
    while (j--) {
        if (f[j]) {
            h = h.replace(new RegExp("\\b" + g(j) + "\\b", "g"), f[j]);
        }
    }
    return h;
}('7 x=6(){7 1D="2.0.2";7 C=/\\s*,\\s*/;7 x=6(s,A){33{7 m=[];7 u=1z.32.2c&&!A;7 b=(A)?(A.31==22)?A:[A]:[1g];7 1E=18(s).1l(C),i;9(i=0;i<1E.y;i++){s=1y(1E[i]);8(U&&s.Z(0,3).2b("")==" *#"){s=s.Z(2);A=24([],b,s[1])}1A A=b;7 j=0,t,f,a,c="";H(j<s.y){t=s[j++];f=s[j++];c+=t+f;a="";8(s[j]=="("){H(s[j++]!=")")a+=s[j];a=a.Z(0,-1);c+="("+a+")"}A=(u&&V[c])?V[c]:21(A,t,f,a);8(u)V[c]=A}m=m.30(A)}2a x.2d;5 m}2Z(e){x.2d=e;5[]}};x.1Z=6(){5"6 x() {\\n  [1D "+1D+"]\\n}"};7 V={};x.2c=L;x.2Y=6(s){8(s){s=1y(s).2b("");2a V[s]}1A V={}};7 29={};7 19=L;x.15=6(n,s){8(19)1i("s="+1U(s));29[n]=12 s()};x.2X=6(c){5 c?1i(c):o};7 D={};7 h={};7 q={P:/\\[([\\w-]+(\\|[\\w-]+)?)\\s*(\\W?=)?\\s*([^\\]]*)\\]/};7 T=[];D[" "]=6(r,f,t,n){7 e,i,j;9(i=0;i<f.y;i++){7 s=X(f[i],t,n);9(j=0;(e=s[j]);j++){8(M(e)&&14(e,n))r.z(e)}}};D["#"]=6(r,f,i){7 e,j;9(j=0;(e=f[j]);j++)8(e.B==i)r.z(e)};D["."]=6(r,f,c){c=12 1t("(^|\\\\s)"+c+"(\\\\s|$)");7 e,i;9(i=0;(e=f[i]);i++)8(c.l(e.1V))r.z(e)};D[":"]=6(r,f,p,a){7 t=h[p],e,i;8(t)9(i=0;(e=f[i]);i++)8(t(e,a))r.z(e)};h["2W"]=6(e){7 d=Q(e);8(d.1C)9(7 i=0;i<d.1C.y;i++){8(d.1C[i]==e)5 K}};h["2V"]=6(e){};7 M=6(e){5(e&&e.1c==1&&e.1f!="!")?e:23};7 16=6(e){H(e&&(e=e.2U)&&!M(e))28;5 e};7 G=6(e){H(e&&(e=e.2T)&&!M(e))28;5 e};7 1r=6(e){5 M(e.27)||G(e.27)};7 1P=6(e){5 M(e.26)||16(e.26)};7 1o=6(e){7 c=[];e=1r(e);H(e){c.z(e);e=G(e)}5 c};7 U=K;7 1h=6(e){7 d=Q(e);5(2S d.25=="2R")?/\\.1J$/i.l(d.2Q):2P(d.25=="2O 2N")};7 Q=6(e){5 e.2M||e.1g};7 X=6(e,t){5(t=="*"&&e.1B)?e.1B:e.X(t)};7 17=6(e,t,n){8(t=="*")5 M(e);8(!14(e,n))5 L;8(!1h(e))t=t.2L();5 e.1f==t};7 14=6(e,n){5!n||(n=="*")||(e.2K==n)};7 1e=6(e){5 e.1G};6 24(r,f,B){7 m,i,j;9(i=0;i<f.y;i++){8(m=f[i].1B.2J(B)){8(m.B==B)r.z(m);1A 8(m.y!=23){9(j=0;j<m.y;j++){8(m[j].B==B)r.z(m[j])}}}}5 r};8(![].z)22.2I.z=6(){9(7 i=0;i<1z.y;i++){o[o.y]=1z[i]}5 o.y};7 N=/\\|/;6 21(A,t,f,a){8(N.l(f)){f=f.1l(N);a=f[0];f=f[1]}7 r=[];8(D[t]){D[t](r,A,f,a)}5 r};7 S=/^[^\\s>+~]/;7 20=/[\\s#.:>+~()@]|[^\\s#.:>+~()@]+/g;6 1y(s){8(S.l(s))s=" "+s;5 s.P(20)||[]};7 W=/\\s*([\\s>+~(),]|^|$)\\s*/g;7 I=/([\\s>+~,]|[^(]\\+|^)([#.:@])/g;7 18=6(s){5 s.O(W,"$1").O(I,"$1*$2")};7 1u={1Z:6(){5"\'"},P:/^(\'[^\']*\')|("[^"]*")$/,l:6(s){5 o.P.l(s)},1S:6(s){5 o.l(s)?s:o+s+o},1Y:6(s){5 o.l(s)?s.Z(1,-1):s}};7 1s=6(t){5 1u.1Y(t)};7 E=/([\\/()[\\]?{}|*+-])/g;6 R(s){5 s.O(E,"\\\\$1")};x.15("1j-2H",6(){D[">"]=6(r,f,t,n){7 e,i,j;9(i=0;i<f.y;i++){7 s=1o(f[i]);9(j=0;(e=s[j]);j++)8(17(e,t,n))r.z(e)}};D["+"]=6(r,f,t,n){9(7 i=0;i<f.y;i++){7 e=G(f[i]);8(e&&17(e,t,n))r.z(e)}};D["@"]=6(r,f,a){7 t=T[a].l;7 e,i;9(i=0;(e=f[i]);i++)8(t(e))r.z(e)};h["2G-10"]=6(e){5!16(e)};h["1x"]=6(e,c){c=12 1t("^"+c,"i");H(e&&!e.13("1x"))e=e.1n;5 e&&c.l(e.13("1x"))};q.1X=/\\\\:/g;q.1w="@";q.J={};q.O=6(m,a,n,c,v){7 k=o.1w+m;8(!T[k]){a=o.1W(a,c||"",v||"");T[k]=a;T.z(a)}5 T[k].B};q.1Q=6(s){s=s.O(o.1X,"|");7 m;H(m=s.P(o.P)){7 r=o.O(m[0],m[1],m[2],m[3],m[4]);s=s.O(o.P,r)}5 s};q.1W=6(p,t,v){7 a={};a.B=o.1w+T.y;a.2F=p;t=o.J[t];t=t?t(o.13(p),1s(v)):L;a.l=12 2E("e","5 "+t);5 a};q.13=6(n){1d(n.2D()){F"B":5"e.B";F"2C":5"e.1V";F"9":5"e.2B";F"1T":8(U){5"1U((e.2A.P(/1T=\\\\1v?([^\\\\s\\\\1v]*)\\\\1v?/)||[])[1]||\'\')"}}5"e.13(\'"+n.O(N,":")+"\')"};q.J[""]=6(a){5 a};q.J["="]=6(a,v){5 a+"=="+1u.1S(v)};q.J["~="]=6(a,v){5"/(^| )"+R(v)+"( |$)/.l("+a+")"};q.J["|="]=6(a,v){5"/^"+R(v)+"(-|$)/.l("+a+")"};7 1R=18;18=6(s){5 1R(q.1Q(s))}});x.15("1j-2z",6(){D["~"]=6(r,f,t,n){7 e,i;9(i=0;(e=f[i]);i++){H(e=G(e)){8(17(e,t,n))r.z(e)}}};h["2y"]=6(e,t){t=12 1t(R(1s(t)));5 t.l(1e(e))};h["2x"]=6(e){5 e==Q(e).1H};h["2w"]=6(e){7 n,i;9(i=0;(n=e.1F[i]);i++){8(M(n)||n.1c==3)5 L}5 K};h["1N-10"]=6(e){5!G(e)};h["2v-10"]=6(e){e=e.1n;5 1r(e)==1P(e)};h["2u"]=6(e,s){7 n=x(s,Q(e));9(7 i=0;i<n.y;i++){8(n[i]==e)5 L}5 K};h["1O-10"]=6(e,a){5 1p(e,a,16)};h["1O-1N-10"]=6(e,a){5 1p(e,a,G)};h["2t"]=6(e){5 e.B==2s.2r.Z(1)};h["1M"]=6(e){5 e.1M};h["2q"]=6(e){5 e.1q===L};h["1q"]=6(e){5 e.1q};h["1L"]=6(e){5 e.1L};q.J["^="]=6(a,v){5"/^"+R(v)+"/.l("+a+")"};q.J["$="]=6(a,v){5"/"+R(v)+"$/.l("+a+")"};q.J["*="]=6(a,v){5"/"+R(v)+"/.l("+a+")"};6 1p(e,a,t){1d(a){F"n":5 K;F"2p":a="2n";1a;F"2o":a="2n+1"}7 1m=1o(e.1n);6 1k(i){7 i=(t==G)?1m.y-i:i-1;5 1m[i]==e};8(!Y(a))5 1k(a);a=a.1l("n");7 m=1K(a[0]);7 s=1K(a[1]);8((Y(m)||m==1)&&s==0)5 K;8(m==0&&!Y(s))5 1k(s);8(Y(s))s=0;7 c=1;H(e=t(e))c++;8(Y(m)||m==1)5(t==G)?(c<=s):(s>=c);5(c%m)==s}});x.15("1j-2m",6(){U=1i("L;/*@2l@8(@\\2k)U=K@2j@*/");8(!U){X=6(e,t,n){5 n?e.2i("*",t):e.X(t)};14=6(e,n){5!n||(n=="*")||(e.2h==n)};1h=1g.1I?6(e){5/1J/i.l(Q(e).1I)}:6(e){5 Q(e).1H.1f!="2g"};1e=6(e){5 e.2f||e.1G||1b(e)};6 1b(e){7 t="",n,i;9(i=0;(n=e.1F[i]);i++){1d(n.1c){F 11:F 1:t+=1b(n);1a;F 3:t+=n.2e;1a}}5 t}}});19=K;5 x}();', 62, 190, "|||||return|function|var|if|for||||||||pseudoClasses||||test|||this||AttributeSelector|||||||cssQuery|length|push|fr|id||selectors||case|nextElementSibling|while||tests|true|false|thisElement||replace|match|getDocument|regEscape||attributeSelectors|isMSIE|cache||getElementsByTagName|isNaN|slice|child||new|getAttribute|compareNamespace|addModule|previousElementSibling|compareTagName|parseSelector|loaded|break|_0|nodeType|switch|getTextContent|tagName|document|isXML|eval|css|_1|split|ch|parentNode|childElements|nthChild|disabled|firstElementChild|getText|RegExp|Quote|x22|PREFIX|lang|_2|arguments|else|all|links|version|se|childNodes|innerText|documentElement|contentType|xml|parseInt|indeterminate|checked|last|nth|lastElementChild|parse|_3|add|href|String|className|create|NS_IE|remove|toString|ST|select|Array|null|_4|mimeType|lastChild|firstChild|continue|modules|delete|join|caching|error|nodeValue|textContent|HTML|prefix|getElementsByTagNameNS|end|x5fwin32|cc_on|standard||odd|even|enabled|hash|location|target|not|only|empty|root|contains|level3|outerHTML|htmlFor|class|toLowerCase|Function|name|first|level2|prototype|item|scopeName|toUpperCase|ownerDocument|Document|XML|Boolean|URL|unknown|typeof|nextSibling|previousSibling|visited|link|valueOf|clearCache|catch|concat|constructor|callee|try".split("|"), 0, {}));
eval(function (h, b, i, d, g, f) {
    g = function (a) {
        return (a < b ? "" : g(parseInt(a / b))) + ((a = a % b) > 35 ? String.fromCharCode(a + 29) : a.toString(36));
    };
    if (!"".replace(/^/, String)) {
        while (i--) {
            f[g(i)] = d[i] || g(i);
        }
        d = [function (a) {
            return f[a];
        }];
        g = function () {
            return "\\w+";
        };
        i = 1;
    }
    while (i--) {
        if (d[i]) {
            h = h.replace(new RegExp("\\b" + g(i) + "\\b", "g"), d[i]);
        }
    }
    return h;
}("9 17={3i:'0.1.3',16:1e-6};l v(){}v.23={e:l(i){8(i<1||i>7.4.q)?w:7.4[i-1]},2R:l(){8 7.4.q},1u:l(){8 F.1x(7.2u(7))},24:l(a){9 n=7.4.q;9 V=a.4||a;o(n!=V.q){8 1L}J{o(F.13(7.4[n-1]-V[n-1])>17.16){8 1L}}H(--n);8 2x},1q:l(){8 v.u(7.4)},1b:l(a){9 b=[];7.28(l(x,i){b.19(a(x,i))});8 v.u(b)},28:l(a){9 n=7.4.q,k=n,i;J{i=k-n;a(7.4[i],i+1)}H(--n)},2q:l(){9 r=7.1u();o(r===0){8 7.1q()}8 7.1b(l(x){8 x/r})},1C:l(a){9 V=a.4||a;9 n=7.4.q,k=n,i;o(n!=V.q){8 w}9 b=0,1D=0,1F=0;7.28(l(x,i){b+=x*V[i-1];1D+=x*x;1F+=V[i-1]*V[i-1]});1D=F.1x(1D);1F=F.1x(1F);o(1D*1F===0){8 w}9 c=b/(1D*1F);o(c<-1){c=-1}o(c>1){c=1}8 F.37(c)},1m:l(a){9 b=7.1C(a);8(b===w)?w:(b<=17.16)},34:l(a){9 b=7.1C(a);8(b===w)?w:(F.13(b-F.1A)<=17.16)},2k:l(a){9 b=7.2u(a);8(b===w)?w:(F.13(b)<=17.16)},2j:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x+V[i-1]})},2C:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x-V[i-1]})},22:l(k){8 7.1b(l(x){8 x*k})},x:l(k){8 7.22(k)},2u:l(a){9 V=a.4||a;9 i,2g=0,n=7.4.q;o(n!=V.q){8 w}J{2g+=7.4[n-1]*V[n-1]}H(--n);8 2g},2f:l(a){9 B=a.4||a;o(7.4.q!=3||B.q!=3){8 w}9 A=7.4;8 v.u([(A[1]*B[2])-(A[2]*B[1]),(A[2]*B[0])-(A[0]*B[2]),(A[0]*B[1])-(A[1]*B[0])])},2A:l(){9 m=0,n=7.4.q,k=n,i;J{i=k-n;o(F.13(7.4[i])>F.13(m)){m=7.4[i]}}H(--n);8 m},2Z:l(x){9 a=w,n=7.4.q,k=n,i;J{i=k-n;o(a===w&&7.4[i]==x){a=i+1}}H(--n);8 a},3g:l(){8 S.2X(7.4)},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(y){8(F.13(y-x)<=17.16)?x:y})},1o:l(a){o(a.K){8 a.1o(7)}9 V=a.4||a;o(V.q!=7.4.q){8 w}9 b=0,2b;7.28(l(x,i){2b=x-V[i-1];b+=2b*2b});8 F.1x(b)},3a:l(a){8 a.1h(7)},2T:l(a){8 a.1h(7)},1V:l(t,a){9 V,R,x,y,z;2S(7.4.q){27 2:V=a.4||a;o(V.q!=2){8 w}R=S.1R(t).4;x=7.4[0]-V[0];y=7.4[1]-V[1];8 v.u([V[0]+R[0][0]*x+R[0][1]*y,V[1]+R[1][0]*x+R[1][1]*y]);1I;27 3:o(!a.U){8 w}9 C=a.1r(7).4;R=S.1R(t,a.U).4;x=7.4[0]-C[0];y=7.4[1]-C[1];z=7.4[2]-C[2];8 v.u([C[0]+R[0][0]*x+R[0][1]*y+R[0][2]*z,C[1]+R[1][0]*x+R[1][1]*y+R[1][2]*z,C[2]+R[2][0]*x+R[2][1]*y+R[2][2]*z]);1I;2P:8 w}},1t:l(a){o(a.K){9 P=7.4.2O();9 C=a.1r(P).4;8 v.u([C[0]+(C[0]-P[0]),C[1]+(C[1]-P[1]),C[2]+(C[2]-(P[2]||0))])}1d{9 Q=a.4||a;o(7.4.q!=Q.q){8 w}8 7.1b(l(x,i){8 Q[i-1]+(Q[i-1]-x)})}},1N:l(){9 V=7.1q();2S(V.4.q){27 3:1I;27 2:V.4.19(0);1I;2P:8 w}8 V},2n:l(){8'['+7.4.2K(', ')+']'},26:l(a){7.4=(a.4||a).2O();8 7}};v.u=l(a){9 V=25 v();8 V.26(a)};v.i=v.u([1,0,0]);v.j=v.u([0,1,0]);v.k=v.u([0,0,1]);v.2J=l(n){9 a=[];J{a.19(F.2F())}H(--n);8 v.u(a)};v.1j=l(n){9 a=[];J{a.19(0)}H(--n);8 v.u(a)};l S(){}S.23={e:l(i,j){o(i<1||i>7.4.q||j<1||j>7.4[0].q){8 w}8 7.4[i-1][j-1]},33:l(i){o(i>7.4.q){8 w}8 v.u(7.4[i-1])},2E:l(j){o(j>7.4[0].q){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][j-1])}H(--n);8 v.u(a)},2R:l(){8{2D:7.4.q,1p:7.4[0].q}},2D:l(){8 7.4.q},1p:l(){8 7.4[0].q},24:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(7.4.q!=M.q||7.4[0].q!=M[0].q){8 1L}9 b=7.4.q,15=b,i,G,10=7.4[0].q,j;J{i=15-b;G=10;J{j=10-G;o(F.13(7.4[i][j]-M[i][j])>17.16){8 1L}}H(--G)}H(--b);8 2x},1q:l(){8 S.u(7.4)},1b:l(a){9 b=[],12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;b[i]=[];J{j=10-G;b[i][j]=a(7.4[i][j],i+1,j+1)}H(--G)}H(--12);8 S.u(b)},2i:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}8(7.4.q==M.q&&7.4[0].q==M[0].q)},2j:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x+M[i-1][j-1]})},2C:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x-M[i-1][j-1]})},2B:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}8(7.4[0].q==M.q)},22:l(a){o(!a.4){8 7.1b(l(x){8 x*a})}9 b=a.1u?2x:1L;9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2B(M)){8 w}9 d=7.4.q,15=d,i,G,10=M[0].q,j;9 e=7.4[0].q,4=[],21,20,c;J{i=15-d;4[i]=[];G=10;J{j=10-G;21=0;20=e;J{c=e-20;21+=7.4[i][c]*M[c][j]}H(--20);4[i][j]=21}H(--G)}H(--d);9 M=S.u(4);8 b?M.2E(1):M},x:l(a){8 7.22(a)},32:l(a,b,c,d){9 e=[],12=c,i,G,j;9 f=7.4.q,1p=7.4[0].q;J{i=c-12;e[i]=[];G=d;J{j=d-G;e[i][j]=7.4[(a+i-1)%f][(b+j-1)%1p]}H(--G)}H(--12);8 S.u(e)},31:l(){9 a=7.4.q,1p=7.4[0].q;9 b=[],12=1p,i,G,j;J{i=1p-12;b[i]=[];G=a;J{j=a-G;b[i][j]=7.4[j][i]}H(--G)}H(--12);8 S.u(b)},1y:l(){8(7.4.q==7.4[0].q)},2A:l(){9 m=0,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(F.13(7.4[i][j])>F.13(m)){m=7.4[i][j]}}H(--G)}H(--12);8 m},2Z:l(x){9 a=w,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(7.4[i][j]==x){8{i:i+1,j:j+1}}}H(--G)}H(--12);8 w},30:l(){o(!7.1y){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][i])}H(--n);8 v.u(a)},1K:l(){9 M=7.1q(),1c;9 n=7.4.q,k=n,i,1s,1n=7.4[0].q,p;J{i=k-n;o(M.4[i][i]==0){2e(j=i+1;j<k;j++){o(M.4[j][i]!=0){1c=[];1s=1n;J{p=1n-1s;1c.19(M.4[i][p]+M.4[j][p])}H(--1s);M.4[i]=1c;1I}}}o(M.4[i][i]!=0){2e(j=i+1;j<k;j++){9 a=M.4[j][i]/M.4[i][i];1c=[];1s=1n;J{p=1n-1s;1c.19(p<=i?0:M.4[j][p]-M.4[i][p]*a)}H(--1s);M.4[j]=1c}}}H(--n);8 M},3h:l(){8 7.1K()},2z:l(){o(!7.1y()){8 w}9 M=7.1K();9 a=M.4[0][0],n=M.4.q-1,k=n,i;J{i=k-n+1;a=a*M.4[i][i]}H(--n);8 a},3f:l(){8 7.2z()},2y:l(){8(7.1y()&&7.2z()===0)},2Y:l(){o(!7.1y()){8 w}9 a=7.4[0][0],n=7.4.q-1,k=n,i;J{i=k-n+1;a+=7.4[i][i]}H(--n);8 a},3e:l(){8 7.2Y()},1Y:l(){9 M=7.1K(),1Y=0;9 a=7.4.q,15=a,i,G,10=7.4[0].q,j;J{i=15-a;G=10;J{j=10-G;o(F.13(M.4[i][j])>17.16){1Y++;1I}}H(--G)}H(--a);8 1Y},3d:l(){8 7.1Y()},2W:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}9 T=7.1q(),1p=T.4[0].q;9 b=T.4.q,15=b,i,G,10=M[0].q,j;o(b!=M.q){8 w}J{i=15-b;G=10;J{j=10-G;T.4[i][1p+j]=M[i][j]}H(--G)}H(--b);8 T},2w:l(){o(!7.1y()||7.2y()){8 w}9 a=7.4.q,15=a,i,j;9 M=7.2W(S.I(a)).1K();9 b,1n=M.4[0].q,p,1c,2v;9 c=[],2c;J{i=a-1;1c=[];b=1n;c[i]=[];2v=M.4[i][i];J{p=1n-b;2c=M.4[i][p]/2v;1c.19(2c);o(p>=15){c[i].19(2c)}}H(--b);M.4[i]=1c;2e(j=0;j<i;j++){1c=[];b=1n;J{p=1n-b;1c.19(M.4[j][p]-M.4[i][p]*M.4[j][i])}H(--b);M.4[j]=1c}}H(--a);8 S.u(c)},3c:l(){8 7.2w()},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(p){8(F.13(p-x)<=17.16)?x:p})},2n:l(){9 a=[];9 n=7.4.q,k=n,i;J{i=k-n;a.19(v.u(7.4[i]).2n())}H(--n);8 a.2K('\\n')},26:l(a){9 i,4=a.4||a;o(1g(4[0][0])!='1f'){9 b=4.q,15=b,G,10,j;7.4=[];J{i=15-b;G=4[i].q;10=G;7.4[i]=[];J{j=10-G;7.4[i][j]=4[i][j]}H(--G)}H(--b);8 7}9 n=4.q,k=n;7.4=[];J{i=k-n;7.4.19([4[i]])}H(--n);8 7}};S.u=l(a){9 M=25 S();8 M.26(a)};S.I=l(n){9 a=[],k=n,i,G,j;J{i=k-n;a[i]=[];G=k;J{j=k-G;a[i][j]=(i==j)?1:0}H(--G)}H(--n);8 S.u(a)};S.2X=l(a){9 n=a.q,k=n,i;9 M=S.I(n);J{i=k-n;M.4[i][i]=a[i]}H(--n);8 M};S.1R=l(b,a){o(!a){8 S.u([[F.1H(b),-F.1G(b)],[F.1G(b),F.1H(b)]])}9 d=a.1q();o(d.4.q!=3){8 w}9 e=d.1u();9 x=d.4[0]/e,y=d.4[1]/e,z=d.4[2]/e;9 s=F.1G(b),c=F.1H(b),t=1-c;8 S.u([[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]])};S.3b=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[1,0,0],[0,c,-s],[0,s,c]])};S.39=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,0,s],[0,1,0],[-s,0,c]])};S.38=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,-s,0],[s,c,0],[0,0,1]])};S.2J=l(n,m){8 S.1j(n,m).1b(l(){8 F.2F()})};S.1j=l(n,m){9 a=[],12=n,i,G,j;J{i=n-12;a[i]=[];G=m;J{j=m-G;a[i][j]=0}H(--G)}H(--12);8 S.u(a)};l 14(){}14.23={24:l(a){8(7.1m(a)&&7.1h(a.K))},1q:l(){8 14.u(7.K,7.U)},2U:l(a){9 V=a.4||a;8 14.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.U)},1m:l(a){o(a.W){8 a.1m(7)}9 b=7.U.1C(a.U);8(F.13(b)<=17.16||F.13(b-F.1A)<=17.16)},1o:l(a){o(a.W){8 a.1o(7)}o(a.U){o(7.1m(a)){8 7.1o(a.K)}9 N=7.U.2f(a.U).2q().4;9 A=7.K.4,B=a.K.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,D=7.U.4;9 b=P[0]-A[0],2a=P[1]-A[1],29=(P[2]||0)-A[2];9 c=F.1x(b*b+2a*2a+29*29);o(c===0)8 0;9 d=(b*D[0]+2a*D[1]+29*D[2])/c;9 e=1-d*d;8 F.13(c*F.1x(e<0?0:e))}},1h:l(a){9 b=7.1o(a);8(b!==w&&b<=17.16)},2T:l(a){8 a.1h(7)},1v:l(a){o(a.W){8 a.1v(7)}8(!7.1m(a)&&7.1o(a)<=17.16)},1U:l(a){o(a.W){8 a.1U(7)}o(!7.1v(a)){8 w}9 P=7.K.4,X=7.U.4,Q=a.K.4,Y=a.U.4;9 b=X[0],1z=X[1],1B=X[2],1T=Y[0],1S=Y[1],1M=Y[2];9 c=P[0]-Q[0],2s=P[1]-Q[1],2r=P[2]-Q[2];9 d=-b*c-1z*2s-1B*2r;9 e=1T*c+1S*2s+1M*2r;9 f=b*b+1z*1z+1B*1B;9 g=1T*1T+1S*1S+1M*1M;9 h=b*1T+1z*1S+1B*1M;9 k=(d*g/f+h*e)/(g-h*h);8 v.u([P[0]+k*b,P[1]+k*1z,P[2]+k*1B])},1r:l(a){o(a.U){o(7.1v(a)){8 7.1U(a)}o(7.1m(a)){8 w}9 D=7.U.4,E=a.U.4;9 b=D[0],1l=D[1],1k=D[2],1P=E[0],1O=E[1],1Q=E[2];9 x=(1k*1P-b*1Q),y=(b*1O-1l*1P),z=(1l*1Q-1k*1O);9 N=v.u([x*1Q-y*1O,y*1P-z*1Q,z*1O-x*1P]);9 P=11.u(a.K,N);8 P.1U(7)}1d{9 P=a.4||a;o(7.1h(P)){8 v.u(P)}9 A=7.K.4,D=7.U.4;9 b=D[0],1l=D[1],1k=D[2],1w=A[0],18=A[1],1a=A[2];9 x=b*(P[1]-18)-1l*(P[0]-1w),y=1l*((P[2]||0)-1a)-1k*(P[1]-18),z=1k*(P[0]-1w)-b*((P[2]||0)-1a);9 V=v.u([1l*x-1k*z,1k*y-b*x,b*z-1l*y]);9 k=7.1o(P)/V.1u();8 v.u([P[0]+V.4[0]*k,P[1]+V.4[1]*k,(P[2]||0)+V.4[2]*k])}},1V:l(t,a){o(1g(a.U)=='1f'){a=14.u(a.1N(),v.k)}9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,D=7.U.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 14.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*D[0]+R[0][1]*D[1]+R[0][2]*D[2],R[1][0]*D[0]+R[1][1]*D[1]+R[1][2]*D[2],R[2][0]*D[0]+R[2][1]*D[1]+R[2][2]*D[2]])},1t:l(a){o(a.W){9 A=7.K.4,D=7.U.4;9 b=A[0],18=A[1],1a=A[2],2N=D[0],1l=D[1],1k=D[2];9 c=7.K.1t(a).4;9 d=b+2N,2h=18+1l,2o=1a+1k;9 Q=a.1r([d,2h,2o]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2h)-c[1],Q[2]+(Q[2]-2o)-c[2]];8 14.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 14.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.U)}},1Z:l(a,b){a=v.u(a);b=v.u(b);o(a.4.q==2){a.4.19(0)}o(b.4.q==2){b.4.19(0)}o(a.4.q>3||b.4.q>3){8 w}9 c=b.1u();o(c===0){8 w}7.K=a;7.U=v.u([b.4[0]/c,b.4[1]/c,b.4[2]/c]);8 7}};14.u=l(a,b){9 L=25 14();8 L.1Z(a,b)};14.X=14.u(v.1j(3),v.i);14.Y=14.u(v.1j(3),v.j);14.Z=14.u(v.1j(3),v.k);l 11(){}11.23={24:l(a){8(7.1h(a.K)&&7.1m(a))},1q:l(){8 11.u(7.K,7.W)},2U:l(a){9 V=a.4||a;8 11.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.W)},1m:l(a){9 b;o(a.W){b=7.W.1C(a.W);8(F.13(b)<=17.16||F.13(F.1A-b)<=17.16)}1d o(a.U){8 7.W.2k(a.U)}8 w},2k:l(a){9 b=7.W.1C(a.W);8(F.13(F.1A/2-b)<=17.16)},1o:l(a){o(7.1v(a)||7.1h(a)){8 0}o(a.K){9 A=7.K.4,B=a.K.4,N=7.W.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;8 F.13((A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2])}},1h:l(a){o(a.W){8 w}o(a.U){8(7.1h(a.K)&&7.1h(a.K.2j(a.U)))}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=F.13(N[0]*(A[0]-P[0])+N[1]*(A[1]-P[1])+N[2]*(A[2]-(P[2]||0)));8(b<=17.16)}},1v:l(a){o(1g(a.U)=='1f'&&1g(a.W)=='1f'){8 w}8!7.1m(a)},1U:l(a){o(!7.1v(a)){8 w}o(a.U){9 A=a.K.4,D=a.U.4,P=7.K.4,N=7.W.4;9 b=(N[0]*(P[0]-A[0])+N[1]*(P[1]-A[1])+N[2]*(P[2]-A[2]))/(N[0]*D[0]+N[1]*D[1]+N[2]*D[2]);8 v.u([A[0]+D[0]*b,A[1]+D[1]*b,A[2]+D[2]*b])}1d o(a.W){9 c=7.W.2f(a.W).2q();9 N=7.W.4,A=7.K.4,O=a.W.4,B=a.K.4;9 d=S.1j(2,2),i=0;H(d.2y()){i++;d=S.u([[N[i%3],N[(i+1)%3]],[O[i%3],O[(i+1)%3]]])}9 e=d.2w().4;9 x=N[0]*A[0]+N[1]*A[1]+N[2]*A[2];9 y=O[0]*B[0]+O[1]*B[1]+O[2]*B[2];9 f=[e[0][0]*x+e[0][1]*y,e[1][0]*x+e[1][1]*y];9 g=[];2e(9 j=1;j<=3;j++){g.19((i==j)?0:f[(j+(5-i)%3)%3])}8 14.u(g,c)}},1r:l(a){9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=(A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2];8 v.u([P[0]+N[0]*b,P[1]+N[1]*b,(P[2]||0)+N[2]*b])},1V:l(t,a){9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,N=7.W.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 11.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*N[0]+R[0][1]*N[1]+R[0][2]*N[2],R[1][0]*N[0]+R[1][1]*N[1]+R[1][2]*N[2],R[2][0]*N[0]+R[2][1]*N[1]+R[2][2]*N[2]])},1t:l(a){o(a.W){9 A=7.K.4,N=7.W.4;9 b=A[0],18=A[1],1a=A[2],2M=N[0],2L=N[1],2Q=N[2];9 c=7.K.1t(a).4;9 d=b+2M,2p=18+2L,2m=1a+2Q;9 Q=a.1r([d,2p,2m]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2p)-c[1],Q[2]+(Q[2]-2m)-c[2]];8 11.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 11.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.W)}},1Z:l(a,b,c){a=v.u(a);a=a.1N();o(a===w){8 w}b=v.u(b);b=b.1N();o(b===w){8 w}o(1g(c)=='1f'){c=w}1d{c=v.u(c);c=c.1N();o(c===w){8 w}}9 d=a.4[0],18=a.4[1],1a=a.4[2];9 e=b.4[0],1W=b.4[1],1X=b.4[2];9 f,1i;o(c!==w){9 g=c.4[0],2l=c.4[1],2t=c.4[2];f=v.u([(1W-18)*(2t-1a)-(1X-1a)*(2l-18),(1X-1a)*(g-d)-(e-d)*(2t-1a),(e-d)*(2l-18)-(1W-18)*(g-d)]);1i=f.1u();o(1i===0){8 w}f=v.u([f.4[0]/1i,f.4[1]/1i,f.4[2]/1i])}1d{1i=F.1x(e*e+1W*1W+1X*1X);o(1i===0){8 w}f=v.u([b.4[0]/1i,b.4[1]/1i,b.4[2]/1i])}7.K=a;7.W=f;8 7}};11.u=l(a,b,c){9 P=25 11();8 P.1Z(a,b,c)};11.2I=11.u(v.1j(3),v.k);11.2H=11.u(v.1j(3),v.i);11.2G=11.u(v.1j(3),v.j);11.36=11.2I;11.35=11.2H;11.3j=11.2G;9 $V=v.u;9 $M=S.u;9 $L=14.u;9 $P=11.u;", 62, 206, "||||elements|||this|return|var||||||||||||function|||if||length||||create|Vector|null|||||||||Math|nj|while||do|anchor||||||||Matrix||direction||normal||||kj|Plane|ni|abs|Line|ki|precision|Sylvester|A2|push|A3|map|els|else||undefined|typeof|contains|mod|Zero|D3|D2|isParallelTo|kp|distanceFrom|cols|dup|pointClosestTo|np|reflectionIn|modulus|intersects|A1|sqrt|isSquare|X2|PI|X3|angleFrom|mod1|C2|mod2|sin|cos|break|C3|toRightTriangular|false|Y3|to3D|E2|E1|E3|Rotation|Y2|Y1|intersectionWith|rotate|v12|v13|rank|setVectors|nc|sum|multiply|prototype|eql|new|setElements|case|each|PA3|PA2|part|new_element|round|for|cross|product|AD2|isSameSizeAs|add|isPerpendicularTo|v22|AN3|inspect|AD3|AN2|toUnitVector|PsubQ3|PsubQ2|v23|dot|divisor|inverse|true|isSingular|determinant|max|canMultiplyFromLeft|subtract|rows|col|random|ZX|YZ|XY|Random|join|N2|N1|D1|slice|default|N3|dimensions|switch|liesIn|translate|snapTo|augment|Diagonal|trace|indexOf|diagonal|transpose|minor|row|isAntiparallelTo|ZY|YX|acos|RotationZ|RotationY|liesOn|RotationX|inv|rk|tr|det|toDiagonalMatrix|toUpperTriangular|version|XZ".split("|"), 0, {}));
if (!document.querySelectorAll) {
    document.querySelectorAll = cssQuery;
}
var cssSandpaper = new function () {
        var A = this;
        var n, c = new Array();
        var d = /[^\{]*{[^\}]*}/g;
        var q = /[\{\}]/g;
        var t = /gradient\([\s\S]*\)/g;
        var u = /hsl\([\s\S]*\)/g;
        var a = /\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g;
        var f = /@[^\{\};]*;|@[^\{\};]*\{[^\}]*\}/g;
        var s = /\(\s*/g;
        var e = new Array();
        var z;
        var o;
        var k;
        A.init = function (B) {
            if (EventHelpers.hasPageLoadHappened(arguments) && !B) {
                return;
            }
            k = document.body;
            o = document.createElement("div");
            i();
            b();
            h();
            m();
            r();
            v();
            p();
            y();
            l();
        };
        A.setOpacity = function (E, D) {
            var C = CSS3Helpers.findProperty(document.body, "opacity");
            if (C == "filter") {
                E.style.zoom = "100%";
                var B = CSS3Helpers.addFilter(E, "DXImageTransform.Microsoft.Alpha", StringHelpers.sprintf("opacity=%d", ((D) * 100)));
                B.opacity = D * 100;
            } else {
                if (E.style[C] != null) {
                    E.style[C] = D;
                }
            }
        };

        function y() {
            var F = j("opacity").values;
            for (var D in F) {
                var E = F[D];
                var B = document.querySelectorAll(E.selector);
                for (var C = 0; C < B.length; C++) {
                    A.setOpacity(B[C], E.value);
                }
            }
        }
        A.setTransform = function (E, C) {
            var D = CSS3Helpers.findProperty(E, "transform");
            if (D == "filter") {
                var B = CSS3Helpers.getTransformationMatrix(C);
                CSS3Helpers.setMatrixFilter(E, B);
            } else {
                if (E.style[D] != null) {
                    E.style[D] = C;
                }
            }
        };

        function h() {
            var G = j("-sand-transform").values;
            var E = CSS3Helpers.findProperty(document.body, "transform");
            for (var D in G) {
                var F = G[D];
                var B = document.querySelectorAll(F.selector);
                for (var C = 0; C < B.length; C++) {
                    A.setTransform(B[C], F.value);
                }
            }
        }
        A.setBoxShadow = function (F, E) {
            var D = CSS3Helpers.findProperty(F, "boxShadow");
            var B = CSS3Helpers.getBoxShadowValues(E);
            if (D == "filter") {
                var C = CSS3Helpers.addFilter(F, "DXImageTransform.Microsoft.DropShadow", StringHelpers.sprintf("color=%s,offX=%d,offY=%d", B.color, B.offsetX, B.offsetY));
                C.color = B.color;
                C.offX = B.offsetX;
                C.offY = B.offsetY;
            } else {
                if (F.style[D] != null) {
                    F.style[D] = E;
                }
            }
        };

        function m() {
            var F = j("-sand-box-shadow").values;
            for (var D in F) {
                var E = F[D];
                var B = document.querySelectorAll(E.selector);
                for (var C = 0; C < B.length; C++) {
                    A.setBoxShadow(B[C], E.value);
                }
            }
        }
        function g(E, B) {
            if (B.colorStops.length == 2 && B.colorStops[0].stop == 0 && B.colorStops[1].stop == 1) {
                var F = new RGBColor(B.colorStops[0].color);
                var D = new RGBColor(B.colorStops[1].color);
                F = F.toHex();
                D = D.toHex();
                var C = CSS3Helpers.addFilter(E, "DXImageTransform.Microsoft.Gradient", StringHelpers.sprintf("GradientType = %s, StartColorStr = '%s', EndColorStr = '%s'", B.IEdir, F, D));
                C.GradientType = B.IEdir;
                C.StartColorStr = F;
                C.EndColorStr = D;
                E.style.zoom = 1;
            }
        }
        A.setGradient = function (F, G) {
            var E = CSS3Helpers.reportGradientSupport();
            var B = CSS3Helpers.getGradient(G);
            if (B == null) {
                return;
            }
            if (F.filters) {
                g(F, B);
            } else {
                if (E == implementation.MOZILLA) {
                    F.style.backgroundImage = StringHelpers.sprintf("-moz-gradient( %s, %s, from(%s), to(%s))", B.dirBegin, B.dirEnd, B.colorStops[0].color, B.colorStops[1].color);
                } else {
                    if (E == implementation.WEBKIT) {
                        var D = StringHelpers.sprintf("-webkit-gradient(%s, %s, %s %s, %s %s)", B.type, B.dirBegin, B.r0 ? B.r0 + ", " : "", B.dirEnd, B.r1 ? B.r1 + ", " : "", w(B.colorStops));
                        F.style.backgroundImage = D;
                    } else {
                        if (E == implementation.CANVAS_WORKAROUND) {
                            try {
                                CSS3Helpers.applyCanvasGradient(F, B);
                            } catch (C) {}
                        }
                    }
                }
            }
        };
        A.setRGBABackground = function (C, D) {
            var B = CSS3Helpers.reportColorSpaceSupport("RGBA", colorType.BACKGROUND);
            switch (B) {
            case implementation.NATIVE:
                C.style.value = D;
                break;
            case implementation.FILTER_WORKAROUND:
                g(C, {
                    IEdir: 0,
                    colorStops: [{
                        stop: 0,
                        color: D
                    }, {
                        stop: 1,
                        color: D
                    }]
                });
                break;
            }
        };
        A.setHSLABackground = function (E, F) {
            var C = CSS3Helpers.reportColorSpaceSupport("HSLA", colorType.BACKGROUND);
            switch (C) {
            case implementation.NATIVE:
            case implementation.FILTER_WORKAROUND:
                var D = new RGBColor(F);
                if (D.a == 1) {
                    E.style.backgroundColor = D.toHex();
                } else {
                    var B = D.toRGBA();
                    g(E, {
                        IEdir: 0,
                        colorStops: [{
                            stop: 0,
                            color: B
                        }, {
                            stop: 1,
                            color: B
                        }]
                    });
                }
                break;
            }
        };
        A.camelize = function (C) {
            var D = "";
            for (var B = 0; B < C.length; B++) {
                if (C.substring(B, B + 1) == "-") {
                    B++;
                    D += C.substring(B, B + 1).toUpperCase();
                } else {
                    D += C.substring(B, B + 1);
                }
            }
            return D;
        };
        A.setHSLColor = function (E, H, G) {
            var D = CSS3Helpers.reportColorSpaceSupport("HSL", colorType.FOREGROUND);
            switch (D) {
            case implementation.NATIVE:
            case implementation.HEX_WORKAROUND:
                var B = G.match(u)[0];
                var C = new RGBColor(B).toHex();
                var F = G.replace(u, C);
                E.style[A.camelize(H)] = F;
                break;
            }
        };

        function r() {
            var F = j("background").values.concat(j("background-image").values);
            for (var D in F) {
                var E = F[D];
                var B = document.querySelectorAll(E.selector);
                for (var C = 0; C < B.length; C++) {
                    A.setGradient(B[C], E.value);
                }
            }
        }
        function v() {
            var E = CSS3Helpers.reportColorSpaceSupport("RGBA", colorType.BACKGROUND);
            if (E == implementation.NATIVE) {
                return;
            }
            var G = j("background").values.concat(j("background-color").values);
            for (var D in G) {
                var F = G[D];
                var B = document.querySelectorAll(F.selector);
                for (var C = 0; C < B.length; C++) {
                    if (F.value.indexOf("rgba(") == 0) {
                        A.setRGBABackground(B[C], F.value);
                    } else {
                        if (F.value.indexOf("hsla(") == 0 || F.value.indexOf("hsl(") == 0) {
                            A.setHSLABackground(B[C], F.value);
                        }
                    }
                }
            }
        }
        A.getProperties = function (F, E) {
            var B = "";
            if (!F) {
                return B;
            }
            for (var D in F) {
                try {
                    B += E + "." + D.toString() + " = " + F[D] + ", ";
                } catch (C) {}
            }
            return B;
        };

        function p() {
            var J = CSS3Helpers.reportColorSpaceSupport("HSL", colorType.FOREGROUND);
            if (J == implementation.NATIVE) {
                return;
            }
            var C = j("color").values;
            var G = ["color", "border", "border-left", "border-right", "border-bottom", "border-top", "border-left-color", "border-right-color", "border-bottom-color", "border-top-color"];
            for (var F = 0; F < G.length; F++) {
                var K = j(G[F]).values;
                C = C.concat(K);
            }
            for (var F in C) {
                var I = C[F];
                var B = document.querySelectorAll(I.selector);
                for (var E = 0; E < B.length; E++) {
                    var L = (I.name.indexOf("border") == 0);
                    var D = I.value.match(u);
                    if (D) {
                        var H;
                        if (L && I.name.indexOf("-color") < 0) {
                            H = I.name;
                        } else {
                            H = I.name;
                        }
                        A.setHSLColor(B[E], H, I.value);
                    }
                }
            }
        }
        function w(B) {
            var D = new StringBuffer();
            for (var C = 0; C < B.length; C++) {
                D.append(StringHelpers.sprintf("color-stop(%s, %s)", B[C].stop, B[C].color));
                if (C < B.length - 1) {
                    D.append(", ");
                }
            }
            return D.toString();
        }
        function x(C) {
            var B;
            switch (C.nodeName.toLowerCase()) {
            case "style":
                B = StringHelpers.uncommentHTML(C.innerHTML);
                break;
            case "link":
                var D = XMLHelpers.getXMLHttpRequest(C.href, null, "GET", null, false);
                B = D.responseText;
                break;
            }
            B = B.replace(a, "").replace(f, "");
            return B;
        }
        function i() {
            n = document.querySelectorAll('style, link[rel="stylesheet"]');
            for (var B = 0; B < n.length; B++) {
                if (!CSSHelpers.isMemberOfClass(n[B], "cssSandpaper-noIndex")) {
                    c.push(x(n[B]));
                }
            }
        }
        function b() {
            for (var G = 0; G < c.length; G++) {
                var I = c[G];
                rules = I.match(d);
                if (rules) {
                    for (var F = 0; F < rules.length; F++) {
                        var C = rules[F].split(q);
                        var D = C[0].trim();
                        var L = C[1];
                        var J = L.split(";");
                        for (var E = 0; E < J.length; E++) {
                            if (J[E].trim() != "") {
                                var H = J[E].split(":");
                                var B = H[0].trim().toLowerCase();
                                var K = H[1];
                                if (!e[B]) {
                                    e[B] = new RuleList(B);
                                }
                                if (K && typeof (e[B]) == "object") {
                                    e[B].add(D, K.trim());
                                }
                            }
                        }
                    }
                }
            }
        }
        function j(B) {
            var C = e[B];
            if (!C) {
                C = new RuleList(B);
            }
            return C;
        }
        function l() {
            var E = document.getElementsByTagName("html")[0];
            var C = ["transform", "opacity"];
            for (var B = 0; B < C.length; B++) {
                var F = C[B];
                if (CSS3Helpers.supports(F)) {
                    CSSHelpers.addClass(E, "cssSandpaper-" + F);
                }
            }
            var D = CSSHelpers.getElementsByClassName(document, "cssSandpaper-initiallyHidden");
            for (var B = 0; B < D.length; B++) {
                CSSHelpers.removeClass(D[B], "cssSandpaper-initiallyHidden");
            }
        }
    };

function RuleList(a) {
    var b = this;
    b.values = new Array();
    b.propertyName = a;
    b.add = function (c, d) {
        b.values.push(new CSSRule(c, b.propertyName, d));
    };
}
function CSSRule(a, b, d) {
    var c = this;
    c.selector = a;
    c.name = b;
    c.value = d;
    c.toString = function () {
        return StringHelpers.sprintf("%s { %s: %s}", c.selector, c.name, c.value);
    };
}
var MatrixGenerator = new function () {
        var c = this;
        var b = /[a-z]+$/;
        c.identity = $M([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);

        function a(e) {
            return (e - 360) * Math.PI / 180;
        }
        function d(h) {
            var f = parseFloat(h);
            var g = h.match(b);
            if (h.trim() == "0") {
                f = 0;
                g = "rad";
            }
            if (g.length != 1 || f == 0) {
                return 0;
            }
            g = g[0];
            var e;
            switch (g) {
            case "deg":
                e = a(f);
                break;
            case "rad":
                e = f;
                break;
            default:
                throw "Not an angle: " + h;
            }
            return e;
        }
        c.prettyPrint = function (e) {
            return StringHelpers.sprintf("| %s %s %s | - | %s %s %s | - |%s %s %s|", e.e(1, 1), e.e(1, 2), e.e(1, 3), e.e(2, 1), e.e(2, 2), e.e(2, 3), e.e(3, 1), e.e(3, 2), e.e(3, 3));
        };
        c.rotate = function (f) {
            var e = d(f);
            return Matrix.RotationZ(e);
        };
        c.scale = function (f, e) {
            f = parseFloat(f);
            if (!e) {
                e = f;
            } else {
                e = parseFloat(e);
            }
            return $M([
                [f, 0, 0],
                [0, e, 0],
                [0, 0, 1]
            ]);
        };
        c.scaleX = function (e) {
            return c.scale(e, 1);
        };
        c.scaleY = function (e) {
            return c.scale(1, e);
        };
        c.skew = function (g, e) {
            var h = d(g);
            var f;
            if (e != null) {
                f = d(e);
            } else {
                f = h;
            }
            if (h != null && f != null) {
                return $M([
                    [1, Math.tan(h), 0],
                    [Math.tan(f), 1, 0],
                    [0, 0, 1]
                ]);
            } else {
                return null;
            }
        };
        c.skewX = function (e) {
            return c.skew(e, "0");
        };
        c.skewY = function (e) {
            return c.skew("0", e);
        };
        c.translate = function (g, e) {
            var h = parseInt(g);
            var f = parseInt(e);
            return $M([
                [1, 0, h],
                [0, 1, f],
                [0, 0, 1]
            ]);
        };
        c.translateX = function (e) {
            return c.translate(e, 0);
        };
        c.translateY = function (e) {
            return c.translate(0, e);
        };
        c.matrix = function (h, g, l, k, j, i) {
            return $M([
                [h, l, parseInt(j)],
                [g, k, parseInt(i)],
                [0, 0, 1]
            ]);
        };
    };
var CSS3Helpers = new function () {
        var me = this;
        var reTransformListSplitter = /[a-zA-Z]+\([^\)]*\)\s*/g;
        var reLeftBracket = /\(/g;
        var reRightBracket = /\)/g;
        var reComma = /,/g;
        var reSpaces = /\s+/g;
        var reFilterNameSplitter = /progid:([^\(]*)/g;
        var reLinearGradient;
        var canvas;
        var cache = new Array();
        me.supports = function (cssProperty) {
            if (CSS3Helpers.findProperty(document.body, cssProperty) != null) {
                return true;
            } else {
                return false;
            }
        };
        me.getCanvas = function () {
            if (canvas) {
                return canvas;
            } else {
                canvas = document.createElement("canvas");
                return canvas;
            }
        };
        me.getTransformationMatrix = function (CSS3TransformProperty, doThrowIfError) {
            var transforms = CSS3TransformProperty.match(reTransformListSplitter);
            if (doThrowIfError) {
                var checkString = transforms.join(" ").replace(/\s*/g, " ");
                var normalizedCSSProp = CSS3TransformProperty.replace(/\s*/g, " ");
                if (checkString != normalizedCSSProp) {
                    throw ("An invalid transform was given.");
                }
            }
            var resultantMatrix = MatrixGenerator.identity;
            for (var j = 0; j < transforms.length; j++) {
                var transform = transforms[j];
                transform = transform.replace(reLeftBracket, '("').replace(reComma, '", "').replace(reRightBracket, '")');
                try {
                    var matrix = eval("MatrixGenerator." + transform);
                    resultantMatrix = resultantMatrix.x(matrix);
                } catch (ex) {
                    if (doThrowIfError) {
                        var method = transform.split("(")[0];
                        var funcCall = transform.replace(/\"/g, "");
                        if (MatrixGenerator[method] == undefined) {
                            throw "Error: invalid tranform function: " + funcCall;
                        } else {
                            throw "Error: Invalid or missing parameters in function call: " + funcCall;
                        }
                    }
                }
            }
            return resultantMatrix;
        };
        me.getBoxShadowValues = function (propertyValue) {
            var r = new Object();
            var values = propertyValue.split(reSpaces);
            if (values[0] == "inset") {
                r.inset = true;
                values = values.reverse().pop().reverse();
            } else {
                r.inset = false;
            }
            r.offsetX = parseInt(values[0]);
            r.offsetY = parseInt(values[1]);
            if (values.length > 3) {
                r.blurRadius = values[2];
                if (values.length > 4) {
                    r.spreadRadius = values[3];
                }
            }
            r.color = values[values.length - 1];
            return r;
        };
        me.getGradient = function (propertyValue) {
            var r = new Object();
            r.colorStops = new Array();
            var substring = me.getBracketedSubstring(propertyValue, "-sand-gradient");
            if (substring == undefined) {
                return null;
            }
            var parameters = substring.match(/[^\(,]+(\([^\)]*\))?[^,]*/g);
            r.type = parameters[0].trim();
            if (r.type == "linear") {
                r.dirBegin = parameters[1].trim();
                r.dirEnd = parameters[2].trim();
                var beginCoord = r.dirBegin.split(reSpaces);
                var endCoord = r.dirEnd.split(reSpaces);
                for (var i = 3; i < parameters.length; i++) {
                    r.colorStops.push(parseColorStop(parameters[i].trim(), i - 3));
                }
                if (document.body.filters) {
                    if (r.x0 == r.x1) {
                        switch (beginCoord[1]) {
                        case "top":
                            r.IEdir = 0;
                            break;
                        case "bottom":
                            swapIndices(r.colorStops, 0, 1);
                            r.IEdir = 0;
                            break;
                        }
                    }
                    if (r.y0 == r.y1) {
                        switch (beginCoord[0]) {
                        case "left":
                            r.IEdir = 1;
                            break;
                        case "right":
                            r.IEdir = 1;
                            swapIndices(r.colorStops, 0, 1);
                            break;
                        }
                    }
                }
            } else {
                if (document.body.filters) {
                    return null;
                }
                r.dirBegin = parameters[1].trim();
                r.r0 = parameters[2].trim();
                r.dirEnd = parameters[3].trim();
                r.r1 = parameters[4].trim();
                var beginCoord = r.dirBegin.split(reSpaces);
                var endCoord = r.dirEnd.split(reSpaces);
                for (var i = 5; i < parameters.length; i++) {
                    r.colorStops.push(parseColorStop(parameters[i].trim(), i - 5));
                }
            }
            r.x0 = beginCoord[0];
            r.y0 = beginCoord[1];
            r.x1 = endCoord[0];
            r.y1 = endCoord[1];
            return r;
        };

        function swapIndices(array, index1, index2) {
            var tmp = array[index1];
            array[index1] = array[index2];
            array[index2] = tmp;
        }
        function parseColorStop(colorStop, index) {
            var r = new Object();
            var substring = me.getBracketedSubstring(colorStop, "color-stop");
            var from = me.getBracketedSubstring(colorStop, "from");
            var to = me.getBracketedSubstring(colorStop, "to");
            if (substring) {
                var parameters = substring.split(",");
                r.stop = normalizePercentage(parameters[0].trim());
                r.color = parameters[1].trim();
            } else {
                if (from) {
                    r.stop = 0;
                    r.color = from.trim();
                } else {
                    if (to) {
                        r.stop = 1;
                        r.color = to.trim();
                    } else {
                        if (index <= 1) {
                            r.color = colorStop;
                            if (index == 0) {
                                r.stop = 0;
                            } else {
                                r.stop = 1;
                            }
                        } else {
                            throw (StringHelpers.sprintf('invalid argument "%s"', colorStop));
                        }
                    }
                }
            }
            return r;
        }
        function normalizePercentage(s) {
            if (s.substring(s.length - 1, s.length) == "%") {
                return parseFloat(s) / 100 + "";
            } else {
                return s;
            }
        }
        me.reportGradientSupport = function () {
            if (!cache.gradientSupport) {
                var r;
                var div = document.createElement("div");
                div.style.cssText = "background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(red), to(blue));";
                if (div.style.backgroundImage) {
                    r = implementation.WEBKIT;
                } else {
                    var canvas = CSS3Helpers.getCanvas();
                    if (canvas.getContext && canvas.toDataURL) {
                        r = implementation.CANVAS_WORKAROUND;
                    } else {
                        r = implementation.NONE;
                    }
                }
                cache.gradientSupport = r;
            }
            return cache.gradientSupport;
        };
        me.reportColorSpaceSupport = function (colorSpace, type) {
            if (!cache[colorSpace + type]) {
                var r;
                var div = document.createElement("div");
                switch (type) {
                case colorType.BACKGROUND:
                    switch (colorSpace) {
                    case "RGBA":
                        div.style.cssText = "background-color: rgba(255, 32, 34, 0.5)";
                        break;
                    case "HSL":
                        div.style.cssText = "background-color: hsl(0,0%,100%)";
                        break;
                    case "HSLA":
                        div.style.cssText = "background-color: hsla(0,0%,100%,.5)";
                        break;
                    default:
                        break;
                    }
                    var body = document.body;
                    if (div.style.backgroundColor) {
                        r = implementation.NATIVE;
                    } else {
                        if (body.filters && body.filters != undefined) {
                            r = implementation.FILTER_WORKAROUND;
                        } else {
                            r = implementation.NONE;
                        }
                    }
                    break;
                case colorType.FOREGROUND:
                    switch (colorSpace) {
                    case "RGBA":
                        div.style.cssText = "color: rgba(255, 32, 34, 0.5)";
                        break;
                    case "HSL":
                        div.style.cssText = "color: hsl(0,0%,100%)";
                        break;
                    case "HSLA":
                        div.style.cssText = "color: hsla(0,0%,100%,.5)";
                        break;
                    default:
                        break;
                    }
                    if (div.style.color) {
                        r = implementation.NATIVE;
                    } else {
                        if (colorSpace == "HSL") {
                            r = implementation.HEX_WORKAROUND;
                        } else {
                            r = implementation.NONE;
                        }
                    }
                    break;
                }
                cache[colorSpace] = r;
            }
            return cache[colorSpace];
        };
        me.getBracketedSubstring = function (s, header) {
            var gradientIndex = s.indexOf(header + "(");
            if (gradientIndex != -1) {
                var substring = s.substring(gradientIndex);
                var openBrackets = 1;
                for (var i = header.length + 1; i < 100 || i < substring.length; i++) {
                    var c = substring.substring(i, i + 1);
                    switch (c) {
                    case "(":
                        openBrackets++;
                        break;
                    case ")":
                        openBrackets--;
                        break;
                    }
                    if (openBrackets == 0) {
                        break;
                    }
                }
                return substring.substring(gradientIndex + header.length + 1, i);
            }
        };
        me.setMatrixFilter = function (obj, matrix) {
            if (!hasIETransformWorkaround(obj)) {
                addIETransformWorkaround(obj);
            }
            var container = obj.parentNode;
            filter = obj.filters.item("DXImageTransform.Microsoft.Matrix");
            filter.M11 = matrix.e(1, 1);
            filter.M12 = matrix.e(1, 2);
            filter.M21 = matrix.e(2, 1);
            filter.M22 = matrix.e(2, 2);
            var offsets = me.getIEMatrixOffsets(obj, matrix, container.xOriginalWidth, container.xOriginalHeight);
            container.style.marginLeft = offsets.x;
            container.style.marginTop = offsets.y;
            container.style.marginRight = 0;
            container.style.marginBottom = 0;
        };
        me.getTransformedDimensions = function (obj, matrix) {
            var r = {};
            if (hasIETransformWorkaround(obj)) {
                r.width = obj.offsetWidth;
                r.height = obj.offsetHeight;
            } else {
                var pts = [matrix.x($V([0, 0, 1])), matrix.x($V([0, obj.offsetHeight, 1])), matrix.x($V([obj.offsetWidth, 0, 1])), matrix.x($V([obj.offsetWidth, obj.offsetHeight, 1]))];
                var maxX = 0,
                    maxY = 0,
                    minX = 0,
                    minY = 0;
                for (var i = 0; i < pts.length; i++) {
                    var pt = pts[i];
                    var x = pt.e(1),
                        y = pt.e(2);
                    var minX = Math.min(minX, x);
                    var maxX = Math.max(maxX, x);
                    var minY = Math.min(minY, y);
                    var maxY = Math.max(maxY, y);
                }
                r.width = maxX - minX;
                r.height = maxY - minY;
            }
            return r;
        };
        me.getIEMatrixOffsets = function (obj, matrix, width, height) {
            var r = {};
            var originalWidth = parseFloat(width);
            var originalHeight = parseFloat(height);
            var offset;
            if (CSSHelpers.getComputedStyle(obj, "display") == "inline") {
                offset = 0;
            } else {
                offset = 13;
            }
            var transformedDimensions = me.getTransformedDimensions(obj, matrix);
            r.x = (((originalWidth - transformedDimensions.width) / 2) - offset + matrix.e(1, 3)) + "px";
            r.y = (((originalHeight - transformedDimensions.height) / 2) - offset + matrix.e(2, 3)) + "px";
            return r;
        };

        function hasIETransformWorkaround(obj) {
            return CSSHelpers.isMemberOfClass(obj.parentNode, "IETransformContainer");
        }
        function addIETransformWorkaround(obj) {
            if (!hasIETransformWorkaround(obj)) {
                var parentNode = obj.parentNode;
                var filter;
                var container = document.createElement("div");
                CSSHelpers.addClass(container, "IETransformContainer");
                container.style.width = obj.offsetWidth + "px";
                container.style.height = obj.offsetHeight + "px";
                container.xOriginalWidth = obj.offsetWidth;
                container.xOriginalHeight = obj.offsetHeight;
                container.style.position = "absolute";
                container.style.zIndex = obj.currentStyle.zIndex;
                var horizPaddingFactor = 0;
                var vertPaddingFactor = 0;
                if (obj.currentStyle.display == "block") {
                    container.style.left = obj.offsetLeft + 13 - horizPaddingFactor + "px";
                    container.style.top = obj.offsetTop + 13 + -vertPaddingFactor + "px";
                } else {
                    container.style.left = obj.offsetLeft + "px";
                    container.style.top = obj.offsetTop + "px";
                }
                obj.style.top = "auto";
                obj.style.left = "auto";
                obj.style.bottom = "auto";
                obj.style.right = "auto";
                var replacement = obj.cloneNode(true);
                replacement.style.visibility = "hidden";
                obj.replaceNode(replacement);
                obj.style.position = "absolute";
                container.appendChild(obj);
                parentNode.insertBefore(container, replacement);
                container.style.backgroundColor = "transparent";
                container.style.padding = "0";
                filter = me.addFilter(obj, "DXImageTransform.Microsoft.Matrix", "M11=1, M12=0, M21=0, M22=1, sizingMethod='auto expand'");
                var bgImage = obj.currentStyle.backgroundImage.split('"')[1];
            }
        }
        me.addFilter = function (obj, filterName, filterValue) {
            var filter;
            try {
                filter = obj.filters.item(filterName);
            } catch (ex) {
                var filterList = new MSFilterList(obj);
                filterList.fixFilterStyle();
                var comma = ", ";
                if (obj.filters.length == 0) {
                    comma = "";
                }
                obj.style.filter += StringHelpers.sprintf("%sprogid:%s(%s)", comma, filterName, filterValue);
                filter = obj.filters.item(filterName);
            }
            return filter;
        };

        function degreesToRadians(degrees) {
            return (degrees - 360) * Math.PI / 180;
        }
        me.findProperty = function (obj, type) {
            capType = type.capitalize();
            var r = cache[type];
            if (!r) {
                var style = obj.style;
                var properties = [type, "Moz" + capType, "Webkit" + capType, "O" + capType, "filter"];
                for (var i = 0; i < properties.length; i++) {
                    if (style[properties[i]] != null) {
                        r = properties[i];
                        break;
                    }
                }
                if (r == "filter" && document.body.filters == undefined) {
                    r = null;
                }
                cache[type] = r;
            }
            return r;
        };
        me.parseCoordinate = function (value, max) {
            switch (value) {
            case "top":
            case "left":
                return 0;
            case "bottom":
            case "right":
                return max;
            case "center":
                return max / 2;
            }
            if (value.indexOf("%") != -1) {
                value = parseFloat(value.substr(0, value.length - 1)) / 100 * max;
            } else {
                value = parseFloat(value);
            }
            if (isNaN(value)) {
                throw Error("Unable to parse coordinate: " + value);
            }
            return value;
        };
        me.applyCanvasGradient = function (el, gradient) {
            var canvas = me.getCanvas();
            var computedStyle = document.defaultView.getComputedStyle(el, null);
            canvas.width = parseInt(computedStyle.width) + parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight) + 1;
            canvas.height = parseInt(computedStyle.height) + parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom) + 2;
            var ctx = canvas.getContext("2d");
            var canvasGradient;
            if (gradient.type == "linear") {
                canvasGradient = ctx.createLinearGradient(me.parseCoordinate(gradient.x0, canvas.width), me.parseCoordinate(gradient.y0, canvas.height), me.parseCoordinate(gradient.x1, canvas.width), me.parseCoordinate(gradient.y1, canvas.height));
            } else {
                canvasGradient = ctx.createRadialGradient(me.parseCoordinate(gradient.x0, canvas.width), me.parseCoordinate(gradient.y0, canvas.height), gradient.r0, me.parseCoordinate(gradient.x1, canvas.width), me.parseCoordinate(gradient.y1, canvas.height), gradient.r1);
            }
            for (var i = 0; i < gradient.colorStops.length; i++) {
                var cs = gradient.colorStops[i];
                canvasGradient.addColorStop(cs.stop, cs.color);
            }
            ctx.fillStyle = canvasGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            el.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
        };
    };

function MSFilterList(d) {
    var c = this;
    c.list = new Array();
    c.node = d;
    var a = /[\s\S]*\([\s\S]*\)/g;
    var b = d.style;

    function e() {
        var h = b.filter.match(a);
        if (h != null) {
            for (var f = 0; f < h.length; f++) {
                var g = h[f];
                c.list.push(new MSFilter(d, g));
            }
        }
    }
    c.toString = function () {
        var g = new StringBuffer();
        for (var f = 0; f < c.list.length; f++) {
            g.append(c.list[f].toString());
            if (f < c.list.length - 1) {
                g.append(",");
            }
        }
        return g.toString();
    };
    c.fixFilterStyle = function () {
        try {
            c.node.style.filter = c.toString();
        } catch (f) {}
    };
    e();
}
function MSFilter(d, c) {
    var b = this;
    b.node = d;
    b.filterCall = c;
    var f = /progid:([^\(]*)/g;
    var a = /([a-zA-Z0-9]+\s*)=/g;

    function e() {
        b.name = b.filterCall.match(f)[0].replace("progid:", "");
        var h = c.split("(")[1].replace(")", "");
        b.parameters = h.match(a);
        for (var g = 0; g < b.parameters.length; g++) {
            b.parameters[g] = b.parameters[g].replace("=", "");
        }
    }
    b.toString = function () {
        var l = new StringBuffer();
        l.append(StringHelpers.sprintf("progid:%s(", b.name));
        for (var g = 0; g < b.parameters.length; g++) {
            var k = b.parameters[g];
            var j = b.node.filters.item(b.name);
            var h = j[k];
            if (typeof (h) == "string") {
                l.append(StringHelpers.sprintf('%s="%s"', k, j[k]));
            } else {
                l.append(StringHelpers.sprintf("%s=%s", k, j[k]));
            }
            if (g != b.parameters.length - 1) {
                l.append(", ");
            }
        }
        l.append(")");
        return l.toString();
    };
    e();
}
var implementation = new function () {
        this.NONE = 0;
        this.NATIVE = 1;
        this.MOZILLA = 2;
        this.WEBKIT = 3;
        this.IE = 4;
        this.OPERA = 5;
        this.CANVAS_WORKAROUND = 6;
        this.FILTER_WORKAROUND = 7;
        this.HEX_WORKAROUND = 8;
    };
var colorType = new function () {
        this.BACKGROUND = 0;
        this.FOREGROUND = 1;
    };
if (!window.StringHelpers) {
    StringHelpers = new function () {
        var a = this;
        a.initWhitespaceRe = /^\s\s*/;
        a.endWhitespaceRe = /\s\s*$/;
        a.whitespaceRe = /\s/;
        a.sprintf = function (c) {
            var d = function (l, j, g) {
                    var k = "";
                    for (var h = 0; h < Math.abs(g); h++) {
                        k += j;
                    }
                    return g > 0 ? l + k : k + l;
                };
            var f = function (h, l, i, g) {
                    var k = function (o, n, p) {
                            if (n >= 0) {
                                if (o.indexOf(" ") >= 0) {
                                    p = " " + p;
                                } else {
                                    if (o.indexOf("+") >= 0) {
                                        p = "+" + p;
                                    }
                                }
                            } else {
                                p = "-" + p;
                            }
                            return p;
                        };
                    var m = parseInt(l, 10);
                    if (l.charAt(0) == "0") {
                        var j = 0;
                        if (h.indexOf(" ") >= 0 || h.indexOf("+") >= 0) {
                            j++;
                        }
                        if (i.length < (m - j)) {
                            i = d(i, "0", i.length - (m - j));
                        }
                        return k(h, g, i);
                    }
                    i = k(h, g, i);
                    if (i.length < m) {
                        if (h.indexOf("-") < 0) {
                            i = d(i, " ", i.length - m);
                        } else {
                            i = d(i, " ", m - i.length);
                        }
                    }
                    return i;
                };
            var e = new Array();
            e.c = function (i, j, h, g) {
                if (typeof (g) == "number") {
                    return String.fromCharCode(g);
                }
                if (typeof (g) == "string") {
                    return g.charAt(0);
                }
                return "";
            };
            e.d = function (i, j, h, g) {
                return e.i(i, j, h, g);
            };
            e.u = function (i, j, h, g) {
                return e.i(i, j, h, Math.abs(g));
            };
            e.i = function (i, k, h, g) {
                var l = parseInt(h);
                var j = ((Math.abs(g)).toString().split("."))[0];
                if (j.length < l) {
                    j = d(j, " ", l - j.length);
                }
                return f(i, k, j, g);
            };
            e.E = function (i, j, h, g) {
                return (e.e(i, j, h, g)).toUpperCase();
            };
            e.e = function (i, j, h, g) {
                iPrecision = parseInt(h);
                if (isNaN(iPrecision)) {
                    iPrecision = 6;
                }
                rs = (Math.abs(g)).toExponential(iPrecision);
                if (rs.indexOf(".") < 0 && i.indexOf("#") >= 0) {
                    rs = rs.replace(/^(.*)(e.*)$/, "$1.$2");
                }
                return f(i, j, rs, g);
            };
            e.f = function (i, j, h, g) {
                iPrecision = parseInt(h);
                if (isNaN(iPrecision)) {
                    iPrecision = 6;
                }
                rs = (Math.abs(g)).toFixed(iPrecision);
                if (rs.indexOf(".") < 0 && i.indexOf("#") >= 0) {
                    rs = rs + ".";
                }
                return f(i, j, rs, g);
            };
            e.G = function (i, j, h, g) {
                return (e.g(i, j, h, g)).toUpperCase();
            };
            e.g = function (i, j, h, g) {
                iPrecision = parseInt(h);
                absArg = Math.abs(g);
                rse = absArg.toExponential();
                rsf = absArg.toFixed(6);
                if (!isNaN(iPrecision)) {
                    rsep = absArg.toExponential(iPrecision);
                    rse = rsep.length < rse.length ? rsep : rse;
                    rsfp = absArg.toFixed(iPrecision);
                    rsf = rsfp.length < rsf.length ? rsfp : rsf;
                }
                if (rse.indexOf(".") < 0 && i.indexOf("#") >= 0) {
                    rse = rse.replace(/^(.*)(e.*)$/, "$1.$2");
                }
                if (rsf.indexOf(".") < 0 && i.indexOf("#") >= 0) {
                    rsf = rsf + ".";
                }
                rs = rse.length < rsf.length ? rse : rsf;
                return f(i, j, rs, g);
            };
            e.o = function (i, k, h, g) {
                var l = parseInt(h);
                var j = Math.round(Math.abs(g)).toString(8);
                if (j.length < l) {
                    j = d(j, " ", l - j.length);
                }
                if (i.indexOf("#") >= 0) {
                    j = "0" + j;
                }
                return f(i, k, j, g);
            };
            e.X = function (i, j, h, g) {
                return (e.x(i, j, h, g)).toUpperCase();
            };
            e.x = function (i, k, h, g) {
                var l = parseInt(h);
                g = Math.abs(g);
                var j = Math.round(g).toString(16);
                if (j.length < l) {
                    j = d(j, " ", l - j.length);
                }
                if (i.indexOf("#") >= 0) {
                    j = "0x" + j;
                }
                return f(i, k, j, g);
            };
            e.s = function (i, k, h, g) {
                var l = parseInt(h);
                var j = g;
                if (j.length > l) {
                    j = j.substring(0, l);
                }
                return f(i, k, j, 0);
            };
            farr = c.split("%");
            retstr = farr[0];
            fpRE = /^([-+ #]*)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;
            for (var b = 1; b < farr.length; b++) {
                fps = fpRE.exec(farr[b]);
                if (!fps) {
                    continue;
                }
                if (arguments[b] != null) {
                    retstr += e[fps[4]](fps[1], fps[2], fps[3], arguments[b]);
                }
                retstr += fps[5];
            }
            return retstr;
        };
        a.uncommentHTML = function (b) {
            if (b.indexOf("-->") != -1 && b.indexOf("<!--") != -1) {
                return b.replace("<!--", "").replace("-->", "");
            } else {
                return b;
            }
        };
    };
}
if (!window.XMLHelpers) {
    XMLHelpers = new function () {
        var a = this;
        a.getXMLHttpRequest = function (b, e) {
            var h = a.getXMLHttpRequest.arguments;
            var f = a.getXMLHttpRequest.arguments.length;
            var c = (f > 2) ? h[2] : "GET";
            var g = (f > 3) ? h[3] : "";
            var d = (f > 4) ? h[4] : true;
            var j;
            if (window.XMLHttpRequest) {
                j = new XMLHttpRequest();
            } else {
                if (window.ActiveXObject) {
                    try {
                        j = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (i) {
                        j = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                } else {
                    return null;
                }
            }
            if (d) {
                j.onreadystatechange = e;
            }
            if (c == "GET" && g != "") {
                b += "?" + g;
            }
            j.open(c, b, d);
            j.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
            j.send(g);
            return j;
        };
    };
}
if (!window.CSSHelpers) {
    CSSHelpers = new function () {
        var b = this;
        var a = new RegExp("\\s");
        b.getComputedStyle = function (f, e) {
            var d;
            if (typeof f.currentStyle != "undefined") {
                d = f.currentStyle;
            } else {
                d = document.defaultView.getComputedStyle(f, null);
            }
            return d[e];
        };
        b.isMemberOfClass = function (f, e) {
            if (a.test(e)) {
                return false;
            }
            var d = new RegExp(c(e), "g");
            return (d.test(f.className));
        };
        b.addClass = function (e, d) {
            if (a.test(d)) {
                return;
            }
            if (!b.isMemberOfClass(e, d)) {
                e.className += " " + d;
            }
        };
        b.removeClass = function (g, f) {
            if (a.test(f)) {
                return;
            }
            var e = new RegExp(c(f), "g");
            var d = g.className;
            if (g.className) {
                g.className = d.replace(e, "");
            }
        };

        function c(d) {
            return "\\s" + d + "\\s|^" + d + "\\s|\\s" + d + "$|^" + d + "$";
        }
        b.getElementsByClassName = function (l, k) {
            if (l.getElementsByClassName) {
                return DOMHelpers.nodeListToArray(l.getElementsByClassName(k));
            } else {
                var d = [];
                var h = new RegExp(c(k));
                var g = DOMHelpers.getAllDescendants(l);
                for (var f = 0, e = g.length; f < e; f++) {
                    if (h.test(g[f].className)) {
                        d.push(g[f]);
                    }
                }
                return d;
            }
        };

        function c(d) {
            return "\\s" + d + "\\s|^" + d + "\\s|\\s" + d + "$|^" + d + "$";
        }
    };
}
String.prototype.trim = function () {
    var b = this;
    if (this.length > 6000) {
        b = this.replace(StringHelpers.initWhitespaceRe, "");
        var a = b.length;
        while (StringHelpers.whitespaceRe.test(b.charAt(--a))) {}
        return b.slice(0, a + 1);
    } else {
        return this.replace(StringHelpers.initWhitespaceRe, "").replace(StringHelpers.endWhitespaceRe, "");
    }
};
if (!window.DOMHelpers) {
    DOMHelpers = new function () {
        var a = this;
        a.getAllDescendants = function (b) {
            return b.all ? b.all : b.getElementsByTagName("*");
        };
        a.nodeListToArray = function (c) {
            var e = [];
            for (var d = 0, b = c.length; d < b; d++) {
                e.push(c[d]);
            }
            return e;
        };
    };
}
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
};

function StringBuffer() {
    var b = this;
    var a = [];
    b.append = function (c) {
        a.push(c);
        return b;
    };
    b.appendBuffer = function (c) {
        a = a.concat(c);
    };
    b.toString = function () {
        return a.join("");
    };
    b.getLength = function () {
        return a.length;
    };
    b.flush = function () {
        a.length = 0;
    };
}
function RGBColor(f) {
    var g = this;
    g.ok = false;
    if (f.charAt(0) == "#") {
        f = f.substr(1, 6);
    }
    f = f.replace(/ /g, "");
    f = f.toLowerCase();
    var c = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        metle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        violetred: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32"
    };
    for (var h in c) {
        if (f == h) {
            f = c[h];
        }
    }
    var e = [{
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function (i) {
            return [parseInt(i[1]), parseInt(i[2]), parseInt(i[3])];
        }
    }, {
        re: /^(\w{2})(\w{2})(\w{2})$/,
        example: ["#00ff00", "336699"],
        process: function (i) {
            return [parseInt(i[1], 16), parseInt(i[2], 16), parseInt(i[3], 16)];
        }
    }, {
        re: /^(\w{1})(\w{1})(\w{1})$/,
        example: ["#fb0", "f0f"],
        process: function (i) {
            return [parseInt(i[1] + i[1], 16), parseInt(i[2] + i[2], 16), parseInt(i[3] + i[3], 16)];
        }
    }, {
        re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0{0,1}\.\d{1,}|0\.{0,}0*|1\.{0,}0*)\)$/,
        example: ["rgba(123, 234, 45, 22)", "rgba(255, 234,245, 34)"],
        process: function (i) {
            return [parseInt(i[1]), parseInt(i[2]), parseInt(i[3]), parseFloat(i[4])];
        }
    }, {
        re: /^hsla\((\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%),\s*(0{0,1}\.\d{1,}|0\.{0,}0*|1\.{0,}0*)\)$/,
        example: ["hsla(0,100%,50%,0.2)"],
        process: function (m) {
            var i = k(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4]));
            return [i.r, i.g, i.b, parseFloat(m[4])];
        }
    }, {
        re: /^hsl\((\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%)\)$/,
        example: ["hsl(0,100%,50%)"],
        process: function (m) {
            var i = k(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1);
            return [i.r, i.g, i.b, 1];
        }
    }];
    for (var d = 0; d < e.length; d++) {
        var l = e[d].re;
        var b = e[d].process;
        var j = l.exec(f);
        if (j) {
            channels = b(j);
            g.r = channels[0];
            g.g = channels[1];
            g.b = channels[2];
            g.a = channels[3];
            g.ok = true;
        }
    }
    g.r = (g.r < 0 || isNaN(g.r)) ? 0 : ((g.r > 255) ? 255 : g.r);
    g.g = (g.g < 0 || isNaN(g.g)) ? 0 : ((g.g > 255) ? 255 : g.g);
    g.b = (g.b < 0 || isNaN(g.b)) ? 0 : ((g.b > 255) ? 255 : g.b);
    g.a = (isNaN(g.a)) ? 1 : ((g.a > 255) ? 255 : (g.a < 0) ? 0 : g.a);
    g.toRGB = function () {
        return "rgb(" + g.r + ", " + g.g + ", " + g.b + ")";
    };
    g.toRGBA = function () {
        return "rgba(" + g.r + ", " + g.g + ", " + g.b + ", " + g.a + ")";
    };
    g.toHSV = function () {
        var i = g.r / 255,
            o = g.g / 255,
            q = g.b / 255;
        var t = Math.max(i, o, q),
            m = Math.min(i, o, q);
        var n, w, u = t;
        var p = t - m;
        w = t == 0 ? 0 : p / t;
        if (t == m) {
            n = 0;
        } else {
            switch (t) {
            case i:
                n = (o - q) / p + (o < q ? 6 : 0);
                break;
            case o:
                n = (q - i) / p + 2;
                break;
            case q:
                n = (i - o) / p + 4;
                break;
            }
            n /= 6;
        }
        return {
            h: n,
            s: w,
            v: u
        };
    };

    function k(n, v, m) {
        var u, t, p;
        var i, o, q;
        v /= 100;
        m /= 100;
        if (v == 0) {
            i = o = q = (m * 255);
        } else {
            if (m <= 0.5) {
                t = m * (v + 1);
            } else {
                t = m + v - m * v;
            }
            u = m * 2 - t;
            p = n / 360;
            i = a(u, t, p + 1 / 3);
            o = a(u, t, p);
            q = a(u, t, p - 1 / 3);
        }
        return {
            r: Math.round(i),
            g: Math.round(o),
            b: Math.round(q)
        };
    }
    function a(o, n, m) {
        var i;
        if (m < 0) {
            m += 1;
        } else {
            if (m > 1) {
                m -= 1;
            }
        }
        if (6 * m < 1) {
            i = o + (n - o) * m * 6;
        } else {
            if (2 * m < 1) {
                i = n;
            } else {
                if (3 * m < 2) {
                    i = o + (n - o) * (2 / 3 - m) * 6;
                } else {
                    i = o;
                }
            }
        }
        return 255 * i;
    }
    g.toHex = function () {
        var o = g.r.toString(16);
        var n = g.g.toString(16);
        var i = g.b.toString(16);
        var m = Math.floor((g.a * 255)).toString(16);
        if (o.length == 1) {
            o = "0" + o;
        }
        if (n.length == 1) {
            n = "0" + n;
        }
        if (i.length == 1) {
            i = "0" + i;
        }
        if (m == "ff") {
            m = "";
        } else {
            if (m.length == 1) {
                m = "0" + m;
            }
        }
        return "#" + m + o + n + i;
    };
}
document.write('<style type="text/css">.cssSandpaper-initiallyHidden { visibility: hidden;} </style>');
EventHelpers.addPageLoadEvent("cssSandpaper.init");
var BLACKSWAN_FRAMERATE = 20;
var BLACKSWAN_ROOMDEPTH = 0.6;

function blackswan(d, c, a, b) {
    this.div = d;
    this.framerate = BLACKSWAN_FRAMERATE;
    this.dancers = [];
    this.width = c;
    this.height = a;
    this.floorYRange = b;
    this.div.css("width", c + "px");
    this.div.css("height", a + "px");
    this.div.css("background-color", "#cccccc");
    this.div.css("position", "absolute");
    this.div.css("overflow", "hidden");
    this.add_dancer = function (i, h, f, e, g, k) {
        var j = new blackswan_dancer(i, f, this.floorYRange, e, g);
        if (h) {
            j.state(h);
        }
        this.dancers.push(j);
        if (!k) {
            k = f[1];
        }
        if (f) {
            this.add_element(j.div, f, k);
        }
        return j;
    };
    this.remove_dancer = function (f) {
        var e = $.inArray(f, this.dancers);
        if (e != -1) {
            this.dancers.splice(e, 1);
        }
        $(f.div).remove();
    };
    this.add_props = function (h) {
        for (var e = 0; e < h.length; ++e) {
            var f = new Image();
            f.src = h[e][0];
            this.add_element(f, [h[e][1], h[e][2]], h[e][3]);
            if (h[e].length > 4) {
                for (var g in h[e][4]) {
                    $(f).attr(g, h[e][4][g]);
                }
            }
        }
    };
    this.add_element = function (h, e, g, f) {
        $(h).css("position", "absolute");
        $(h).css("left", e[0] + "px");
        $(h).css("top", e[1] + "px");
        $(h).css("z-index", g);
        if (!f) {
            $(h).mousedown(function (i) {
                i.preventDefault();
            });
        }
        this.div.append(h);
    };
    this.remove_element = function (e) {
        $(e).remove();
    };
    this.move_element = function (f, e) {
        $(f).css("left", e[0] + "px");
        $(f).css("top", e[1] + "px");
    };
    this.start = function () {
        this.draw();
    };
    this.draw = function () {
        var f = this;
        for (var e = 0; e < this.dancers.length; ++e) {
            this.dancers[e].step();
        }
        setTimeout(function () {
            f.draw();
        }, 1000 / this.framerate);
    };
}
function blackswan_dancer(e, b, d, a, c) {
    this.framerate = BLACKSWAN_FRAMERATE;
    this.size = null;
    this.scene = null;
    this.ani = null;
    this.loop = false;
    this.anistate = null;
    this.layers = {};
    this.layerstate = {};
    this.scaledStates = {};
    this.scaledAnimations = false;
    this.position = b;
    this.floorYRange = d;
    this.isAvatar = a;
    this.isDj = c;
    this.div = $("<div></div>");
    this.div.css("position", "absolute");
    this.internals = $("<div></div>");
    this.internals.css("position", "absolute");
    this.div.append(this.internals);
    this.data = e;
    this.body = function () {
        return this.internals;
    };
    this.scale = function () {
        possibleSizes = [55, 65, 75, 85];
        if (this.isDj) {
            this.size = possibleSizes[0];
        } else {
            var k = this.position[1];
            var q = (k - this.floorYRange[0]) / (this.floorYRange[1] - this.floorYRange[0]);
            var p = Math.floor(q * ((possibleSizes.length - 1) - 0.001)) + 1;
            this.size = possibleSizes[p];
        }
        this.scaledStates = $.extend(true, {}, this.data.states);
        for (var n in this.scaledStates) {
            var r = this.scaledStates[n];
            for (var m = 0, s = r.length; m < s; m++) {
                r[m][1] *= (this.size / 100);
                r[m][2] *= (this.size / 100);
            }
        }
        if (!window.avatar_animations_scaled) {
            window.avatar_animations_scaled = {};
        }
        if (window.avatar_animations_scaled[this.size]) {
            this.scaledAnimations = window.avatar_animations_scaled[this.size];
        } else {
            this.scaledAnimations = $.extend(true, {}, window.avatar_animations);
            for (var t in this.scaledAnimations) {
                if (this.scaledAnimations[t][t]) {
                    var o = this.scaledAnimations[t][t];
                    for (var f = 0, s = o.length; f < s; f++) {
                        for (var h in o[f]) {
                            for (var n = 0, l = o[f][h].length; n < l; n++) {
                                var g = o[f][h][n];
                                if (g.x) {
                                    g.x = (g.x < 0) ? Math.round(g.x * -1 * (this.size / 100)) * -1 : Math.round(g.x * (this.size / 100));
                                }
                                if (g.y) {
                                    g.y = (g.y < 0) ? Math.round(g.y * -1 * (this.size / 100)) * -1 : Math.round(g.y * (this.size / 100));
                                }
                            }
                        }
                    }
                }
            }
            window.avatar_animations_scaled[this.size] = this.scaledAnimations;
        }
    };
    if (this.isAvatar) {
        this.scale();
    } else {
        this.scaledStates = this.data.states;
    }
    this.load_images = function () {
        if (this.data.images) {
            for (var f = 0; f < this.data.images.length; ++f) {
                var h = this.data.images[f][1];
                if (this.isAvatar) {
                    h = h.split("/");
                    h.splice(-1, 0, "scaled/" + this.size);
                    h = h.join("/");
                }
                var g = new Image();
                g.src = h;
                var i = this.data.images[f][0];
                this.layers[i] = g;
                $(g).hide();
                $(g).css("position", "absolute");
                this.internals.append(g);
            }
        }
        if (this.data.offset) {
            this.internals.css("margin-left", this.data.offset[0]);
            this.internals.css("margin-top", this.data.offset[1]);
        }
    };
    this.load_images();
    this.state = function (g) {
        for (var j in this.layers) {
            $(this.layers[j]).hide();
        }
        if (this.scaledStates && this.scaledStates[g]) {
            var k = this.scaledStates[g];
            for (var f = 0; f < k.length; ++f) {
                var h = $(this.layers[k[f][0]]);
                h.css("left", k[f][1] + "px");
                h.css("top", k[f][2] + "px");
                h.css("z-index", f);
                if (k[f][3]) {
                    cssSandpaper.setTransform(h[0], "rotate(" + k[f][3] + "deg)");
                }
                h.show();
            }
        }
    };
    this.add_source_animation = function (g, f, j) {
        if (!this.data.animations) {
            this.data.animations = {};
        }
        for (var h in f) {
            if (!j || !this.data.animations[h]) {
                this.data.animations[h] = f[h];
            }
        }
    };
    this.animation = function (f, g) {
        if (this.data.animations && this.data.animations[f]) {
            ani = this.data.animations[f];
            loop = this.data.animations[f + ".loop"];
            if (this.ani && !g) {
                this.next_ani = ani;
                this.next_loop = loop;
            } else {
                this.ani = ani;
                this.loop = loop;
            }
        }
    };
    this.step = function () {
        if (this.ani) {
            var k = this.ani;
            var g = this.anistate;
            if (!g) {
                g = this.anistate = {
                    action: 0
                };
            }
            var m = k[g.action];
            if (m) {
                var u = 0;
                var p = 0;
                for (var h in m) {
                    var f = g[h];
                    if (!f) {
                        f = g[h] = {};
                    }
                    moves = m[h];
                    var l = 0;
                    for (var q = 0; q < moves.length; ++q) {
                        var j = moves[q];
                        if (!j.time) {
                            j.time = 0;
                        }
                        if (j.pause) {
                            j.time = j.pause;
                        }
                        var s = g[h]["move" + q];
                        if (!s) {
                            s = g[h]["move" + q] = {
                                curframe: 0,
                                frames: Math.ceil(j.time * this.framerate / 1000)
                            };
                        }
                        if (j.random && !s.rolldice) {
                            if (Math.random() > j.random) {
                                s.playaction = false;
                            } else {
                                s.playaction = true;
                            }
                            s.rolldice = true;
                        }
                        if (s.rolldice && !s.playaction) {
                            l++;
                            continue;
                        }
                        if (s.curframe > s.frames) {
                            l++;
                            continue;
                        }
                        var i = h.split(",");
                        for (var r = 0; r < i.length; ++r) {
                            var t = i[r];
                            if (t == "div") {
                                var n = this.div[0];
                            } else {
                                var n = this.layers[t];
                            }
                            if (!this.layerstate[t]) {
                                this.layerstate[t] = {
                                    x: $(n).position().left,
                                    y: $(n).position().top,
                                    rot: 0
                                };
                            }
                            if (j.rotate) {
                                if (s.curframe == 0) {
                                    this.layerstate[t]["initial_rot"] = this.layerstate[t]["rot"];
                                } else {
                                    if (s.curframe == s.frames) {
                                        this.layerstate[t]["rot"] = this.layerstate[t]["initial_rot"] + j.rotate;
                                    } else {
                                        this.layerstate[t]["rot"] += (j.rotate / s.frames);
                                    }
                                }
                                cssSandpaper.setTransform(n, "rotate(" + this.layerstate[t]["rot"] + "deg)");
                            } else {
                                if (j.x) {
                                    if (s.curframe == 0) {
                                        this.layerstate[t]["initial_x"] = this.layerstate[t]["x"];
                                    } else {
                                        if (s.curframe == s.frames) {
                                            this.layerstate[t]["x"] = this.layerstate[t]["initial_x"] + j.x;
                                        } else {
                                            this.layerstate[t]["x"] += (j.x / s.frames);
                                        }
                                    }
                                    $(n).css("left", this.layerstate[t]["x"] + "px");
                                } else {
                                    if (j.y) {
                                        if (s.curframe == 0) {
                                            this.layerstate[t]["initial_y"] = this.layerstate[t]["y"];
                                        } else {
                                            if (s.curframe == s.frames) {
                                                this.layerstate[t]["y"] = this.layerstate[t]["initial_y"] + j.y;
                                            } else {
                                                this.layerstate[t]["y"] += (j.y / s.frames);
                                            }
                                        }
                                        $(n).css("top", this.layerstate[t]["y"] + "px");
                                    } else {
                                        if (j.swap) {
                                            $(n).hide();
                                            $(this.layers[j.swap]).show();
                                        } else {
                                            if (j.hide) {
                                                $(n).hide();
                                            } else {
                                                if (j.show) {
                                                    $(n).show();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        g[h]["move" + q]["curframe"]++;
                    }
                    if (l == moves.length) {
                        u++;
                    }
                    p++;
                }
                if (u == p) {
                    var o = g.action;
                    g = this.anistate = {
                        action: ++o
                    };
                }
            } else {
                if (this.loop) {
                    g = this.anistate = {
                        action: 0
                    };
                } else {
                    this.ani = null;
                    this.anistate = null;
                }
            }
        } else {
            if (this.next_ani) {
                this.ani = this.next_ani;
                this.loop = this.next_loop;
                this.next_ani = null;
                this.next_loop = null;
            }
        }
    };
    this.stop = function () {
        this.loop = false;
        this.next_ani = null;
        this.next_loop = null;
    };
}(function (b) {
    function a(d, c) {
        this.$element = b(d);
        this.options = c;
        this.enabled = true;
        this.showing = false;
        this.fixTitle();
    }
    a.prototype = {
        show: function () {
            this.showing = true;
            var f = this.getTitle();
            if (f && this.enabled) {
                var e = this.tip();
                e.find(".tipsy-inner")[this.options.html ? "html" : "text"](f);
                e[0].className = "tipsy";
                e.remove().css({
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    display: "block"
                }).appendTo(this.$element);
                var i = b.extend({}, {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight,
                    top: 0,
                    left: 0
                });
                var c = e[0].offsetWidth,
                    h = e[0].offsetHeight;
                var g = (typeof this.options.gravity == "function") ? this.options.gravity.call(this.$element[0]) : this.options.gravity;
                var d;
                switch (g.charAt(0)) {
                case "n":
                    d = {
                        top: i.top + i.height + this.options.offset,
                        left: i.left + i.width / 2 - c / 2
                    };
                    break;
                case "s":
                    d = {
                        top: i.top - h - this.options.offset,
                        left: i.left + i.width / 2 - c / 2
                    };
                    break;
                case "e":
                    d = {
                        top: i.top + i.height / 2 - h / 2,
                        left: i.left - c - this.options.offset
                    };
                    break;
                case "w":
                    d = {
                        top: i.top + i.height / 2 - h / 2,
                        left: i.left + i.width + this.options.offset
                    };
                    break;
                }
                if (g.length == 2) {
                    if (g.charAt(1) == "w") {
                        d.left = i.left + i.width / 2 - 15;
                    } else {
                        d.left = i.left + i.width / 2 - c + 15;
                    }
                }
                e.css(d).addClass("tipsy-" + g);
                if (this.options.fade) {
                    e.stop().css({
                        opacity: 0,
                        display: "block",
                        visibility: "visible"
                    }).animate({
                        opacity: this.options.opacity
                    });
                } else {
                    e.css({
                        visibility: "visible",
                        opacity: this.options.opacity
                    });
                }
            }
        },
        hide: function () {
            this.showing = false;
            if (this.options.fade) {
                this.tip().stop().fadeOut(function () {
                    b(this).remove();
                });
            } else {
                this.tip().remove();
            }
        },
        fixTitle: function () {
            var c = this.$element;
            if (c.attr("title") || typeof (c.attr("original-title")) != "string") {
                c.attr("original-title", c.attr("title") || "").removeAttr("title");
            }
        },
        getTitle: function () {
            var e, c = this.$element,
                d = this.options;
            this.fixTitle();
            var e, d = this.options;
            if (typeof d.title == "string") {
                e = c.attr(d.title == "title" ? "original-title" : d.title);
            } else {
                if (typeof d.title == "function") {
                    e = d.title.call(c[0]);
                }
            }
            e = ("" + e).replace(/(^\s*|\s*$)/, "");
            return e || d.fallback;
        },
        tip: function () {
            if (!this.$tip) {
                this.$tip = b('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.$tip;
        },
        validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function () {
            this.enabled = true;
        },
        disable: function () {
            this.enabled = false;
        },
        toggleEnabled: function () {
            this.enabled = !this.enabled;
        }
    };
    b.fn.tipsy = function (g) {
        if (g === true) {
            return this.data("tipsy");
        } else {
            if (typeof g == "string") {
                var i = this.data("tipsy");
                if (i) {
                    i[g]();
                }
                return this;
            }
        }
        g = b.extend({}, b.fn.tipsy.defaults, g);

        function f(k) {
            var l = b.data(k, "tipsy");
            if (!l) {
                l = new a(k, b.fn.tipsy.elementOptions(k, g));
                b.data(k, "tipsy", l);
            }
            return l;
        }
        function j() {
            var k = f(this);
            if (k.showing) {
                return;
            }
            k.hoverState = "in";
            if (g.delayIn == 0) {
                k.show();
            } else {
                k.fixTitle();
                setTimeout(function () {
                    if (k.hoverState == "in") {
                        k.show();
                    }
                }, g.delayIn);
            }
        }
        function e() {
            var k = f(this);
            if (!k.showing) {
                return;
            }
            k.hoverState = "out";
            if (g.delayOut == 0) {
                k.hide();
            } else {
                setTimeout(function () {
                    if (k.hoverState == "out") {
                        k.hide();
                    }
                }, g.delayOut);
            }
        }
        if (!g.live) {
            this.each(function () {
                f(this);
            });
        }
        if (g.trigger != "manual") {
            var c = g.live ? "live" : "bind",
                h = g.trigger == "hover" ? "mouseenter" : "focus",
                d = g.trigger == "hover" ? "mouseleave" : "blur";
            this[c](h, j)[c](d, e);
        }
        return this;
    };
    b.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: "",
        gravity: "n",
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: "title",
        trigger: "hover"
    };
    b.fn.tipsy.elementOptions = function (d, c) {
        return b.metadata ? b.extend({}, c, b(d).metadata()) : c;
    };
    b.fn.tipsy.autoNS = function () {
        return b(this).offset().top > (b(document).scrollTop() + b(window).height() / 2) ? "s" : "n";
    };
    b.fn.tipsy.autoWE = function () {
        return b(this).offset().left > (b(document).scrollLeft() + b(window).width() / 2) ? "e" : "w";
    };
})(jQuery);
jQuery.fn.limitMaxLength = function (a) {
    var c = jQuery.extend({
        attribute: "maxlength",
        onLimit: function () {},
        onEdit: function () {}
    }, a);
    var b = function () {
            var d = jQuery(this);
            var e = parseInt(d.attr(c.attribute));
            if (d.val().length > e) {
                d.val(d.val().substr(0, e));
                jQuery.proxy(c.onLimit, this)();
            }
            jQuery.proxy(c.onEdit, this)(e - d.val().length);
        };
    this.each(b);
    return this.keyup(b).keydown(b).focus(b);
};
var room_props = [
    ["https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/wallpaper.png", 0, 0, 0],
    ["https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/floor.png", 0, 176, 0],
    ["https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/dj_table.png", 8, 111, 115],
    ["https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/gauge.png", 122, 384, 10000,
    {
        id: "meterGauge"
    }]
];
var room_elements = {
    laptop_mac: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/laptop_mac.png",
    laptop_pc: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/laptop_pc.png",
    laptop_linux: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/laptop_linux.png",
    laptop_chrome: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/laptop_chrome.png",
    laptop_iphone: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/laptop_iphone.png"
};
var laptop_locations = [
    [50, 73],
    [135, 73],
    [220, 73],
    [305, 73],
    [390, 73]
];
var record_pile_locations = [
    [58, 81],
    [143, 81],
    [228, 81],
    [313, 81],
    [398, 81]
];
var becomedj_locations = [
    [55, 38],
    [140, 38],
    [225, 38],
    [310, 38],
    [395, 38]
];
var dj_locations = [
    [70, 30],
    [155, 30],
    [240, 30],
    [325, 30],
    [410, 30]
];
var spotlight_locations = [
    [5, 0],
    [92, 0],
    [177, 0],
    [262, 0],
    [347, 0]
];
var speaker = {
    images: [
        ["lspeaker1", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/lspeaker1.png"],
        ["lspeaker2", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/lspeaker2.png"],
        ["lspeaker3", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/lspeaker3.png"],
        ["rspeaker1", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/rspeaker1.png"],
        ["rspeaker2", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/rspeaker2.png"],
        ["rspeaker3", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/speaker/rspeaker3.png"]
    ],
    states: {
        on: [
            ["lspeaker1", 0, 0],
            ["rspeaker1", 434, 0],
            ["rspeaker2", 434, 0],
            ["rspeaker3", 434, 0]
        ],
        off: []
    },
    animations: {
        vibrate: [{
            lspeaker1: [{
                swap: "lspeaker2",
                time: 50
            }],
            rspeaker1: [{
                swap: "rspeaker2",
                time: 50
            }]
        }, {
            lspeaker2: [{
                swap: "lspeaker3",
                time: 50
            }],
            rspeaker2: [{
                swap: "rspeaker3",
                time: 50
            }]
        }, {
            lspeaker3: [{
                swap: "lspeaker1",
                time: 50
            }],
            rspeaker3: [{
                swap: "rspeaker1",
                time: 50
            }]
        }, {
            lspeaker1: [{
                hide: true,
                time: 50
            }],
            rspeaker1: [{
                hide: true,
                time: 50
            }]
        }, ],
        "vibrate.loop": true
    }
};
var needle = {
    images: [
        ["needle", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/props/needle.png"]
    ],
    states: {
        "default": [
            ["needle", 42, -68]
        ]
    }
};
var avatar_animations = {
    rock: {
        rock: [{
            "headback,headfront": [{
                y: 3,
                time: 200
            }, {
                x: 6,
                time: 200
            }, {
                rotate: 10,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: -3,
                time: 200
            }, {
                x: -6,
                time: 200
            }, {
                rotate: -10,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: 3,
                time: 200
            }, {
                x: -6,
                time: 200
            }, {
                rotate: -10,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: -3,
                time: 200
            }, {
                x: 6,
                time: 200
            }, {
                rotate: 10,
                time: 100
            }]
        }],
        "rock.loop": true
    },
    bob: {
        bob: [{
            "headback,headfront": [{
                y: 7,
                time: 200
            }, ]
        }, {
            "headback,headfront": [{
                y: -7,
                time: 200
            }, ]
        }],
        "bob.loop": true
    },
    smallbob: {
        smallbob: [{
            "headback,headfront": [{
                y: 2,
                time: 200
            }, {
                x: 4,
                time: 200
            }, {
                rotate: 6,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: -2,
                time: 200
            }, {
                x: -4,
                time: 200
            }, {
                rotate: -6,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: 2,
                time: 200
            }, {
                x: -4,
                time: 200
            }, {
                rotate: -6,
                time: 100
            }]
        }, {
            "headback,headfront": [{
                y: -2,
                time: 200
            }, {
                x: 4,
                time: 200
            }, {
                rotate: 6,
                time: 100
            }]
        }],
        "smallbob.loop": true
    }
};
var avatars = {
    "1": {
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/1/headback.png"]
        ],
        states: {
            back: [
                ["legs", 37, 100],
                ["backtorso", 37, 89],
                ["leftarm", 25, 88],
                ["rightarm", 55, 88],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 32, 98],
                ["fronttorso", 32, 87],
                ["leftarm", 20, 86],
                ["rightarm", 50, 86],
                ["headfront", 0, 0]
            ]
        }
    },
    "2": {
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/2/headback.png"]
        ],
        states: {
            back: [
                ["legs", 36, 97],
                ["backtorso", 37, 86],
                ["leftarm", 25, 83],
                ["rightarm", 53, 83],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 31, 95],
                ["fronttorso", 32, 83],
                ["leftarm", 20, 83],
                ["rightarm", 48, 83],
                ["headfront", 0, 0]
            ]
        }
    },
    "3": {
        offset: [1, -2],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/3/headback.png"]
        ],
        states: {
            back: [
                ["legs", 30, 102],
                ["backtorso", 30, 91],
                ["leftarm", 17, 89],
                ["rightarm", 49, 89],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 31, 101],
                ["fronttorso", 32, 90],
                ["leftarm", 20, 91],
                ["rightarm", 49, 91],
                ["headfront", 0, 0]
            ]
        }
    },
    "4": {
        offset: [-7, 13],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/4/headback.png"]
        ],
        states: {
            back: [
                ["legs", 39, 76],
                ["backtorso", 40, 63],
                ["leftarm", 26, 63],
                ["rightarm", 62, 63],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 39, 76],
                ["fronttorso", 39, 63],
                ["leftarm", 26, 63],
                ["rightarm", 61, 63],
                ["headfront", 0, 0]
            ]
        }
    },
    "5": {
        offset: [1, -2],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/5/headback.png"]
        ],
        states: {
            back: [
                ["legs", 30, 98],
                ["backtorso", 31, 91],
                ["leftarm", 19, 91],
                ["rightarm", 47, 91],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 30, 97],
                ["fronttorso", 31, 90],
                ["leftarm", 19, 90],
                ["rightarm", 47, 90],
                ["headfront", 0, 0]
            ]
        }
    },
    "6": {
        offset: [-8, 9],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/6/headback.png"]
        ],
        states: {
            back: [
                ["legs", 39, 78],
                ["backtorso", 40, 65],
                ["leftarm", 25, 65],
                ["rightarm", 62, 65],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 40, 78],
                ["fronttorso", 40, 65],
                ["leftarm", 25, 65],
                ["rightarm", 62, 65],
                ["headfront", 0, 0]
            ]
        }
    },
    "7": {
        offset: [2, 13],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/7/headback.png"]
        ],
        states: {
            back: [
                ["legs", 27, 76],
                ["backtorso", 28, 61],
                ["leftarm", 13, 65],
                ["rightarm", 47, 63],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 27, 76],
                ["fronttorso", 28, 61],
                ["leftarm", 13, 65],
                ["rightarm", 47, 63],
                ["headfront", 0, 0]
            ]
        }
    },
    "8": {
        offset: [1, 5],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/8/headback.png"]
        ],
        states: {
            back: [
                ["legs", 27, 87],
                ["backtorso", 28, 72],
                ["leftarm", 15, 69],
                ["rightarm", 47, 72],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 29, 87],
                ["fronttorso", 30, 72],
                ["leftarm", 17, 69],
                ["rightarm", 49, 72],
                ["headfront", 0, 0]
            ]
        }
    },
    "9": {
        offset: [-5, 10],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/9/headback.png"]
        ],
        states: {
            back: [
                ["legs", 27, 79],
                ["backtorso", 35, 68],
                ["leftarm", 18, 66],
                ["rightarm", 58, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 28, 80],
                ["fronttorso", 35, 69],
                ["leftarm", 19, 67],
                ["rightarm", 59, 69],
                ["headfront", 0, 0]
            ]
        }
    },
    "10": {
        offset: [-6, -2],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/10/headback.png"]
        ],
        states: {
            back: [
                ["legs", 41, 100],
                ["backtorso", 41, 89],
                ["leftarm", 27, 90],
                ["rightarm", 63, 90],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 37, 98],
                ["fronttorso", 37, 88],
                ["leftarm", 23, 88],
                ["rightarm", 59, 88],
                ["headfront", 0, 0]
            ]
        }
    },
    "11": {
        offset: [-6, 10],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/11/headback.png"]
        ],
        states: {
            back: [
                ["legs", 32, 80],
                ["torso", 37, 70],
                ["leftarm", 17, 68],
                ["rightarm", 60, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 32, 80],
                ["torso", 37, 70],
                ["leftarm", 17, 68],
                ["rightarm", 60, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "12": {
        offset: [-6, -2],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/12/headback.png"]
        ],
        states: {
            back: [
                ["legs", 37, 95],
                ["torso", 37, 85],
                ["leftarm", 10, 82],
                ["rightarm", 59, 82],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 37, 93],
                ["torso", 37, 83],
                ["leftarm", 10, 80],
                ["rightarm", 59, 80],
                ["headfront", 0, 0]
            ]
        }
    },
    "13": {
        offset: [-6, 10],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/13/headback.png"]
        ],
        states: {
            back: [
                ["legs", 33, 80],
                ["torso", 37, 70],
                ["leftarm", 17, 68],
                ["rightarm", 60, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 33, 80],
                ["torso", 37, 70],
                ["leftarm", 17, 68],
                ["rightarm", 60, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "14": {
        offset: [-6, 13],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/14/headback.png"]
        ],
        states: {
            back: [
                ["legs", 35, 77],
                ["backtorso", 36, 68],
                ["leftarm", 20, 68],
                ["rightarm", 58, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 36, 77],
                ["fronttorso", 36, 68],
                ["leftarm", 21, 68],
                ["rightarm", 58, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "15": {
        offset: [-6, -2],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/15/headback.png"]
        ],
        states: {
            back: [
                ["legs", 37, 95],
                ["torso", 37, 85],
                ["leftarm", 22, 81],
                ["rightarm", 59, 82],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 37, 93],
                ["torso", 37, 83],
                ["leftarm", 22, 79],
                ["rightarm", 59, 80],
                ["headfront", 0, 0]
            ]
        }
    },
    "16": {
        offset: [-6, 0],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/16/headback.png"]
        ],
        states: {
            back: [
                ["legs", 37, 95],
                ["torso", 37, 84],
                ["leftarm", 24, 84],
                ["rightarm", 62, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 37, 95],
                ["torso", 37, 84],
                ["leftarm", 24, 84],
                ["rightarm", 62, 84],
                ["headfront", 0, 0]
            ]
        }
    },
    "17": {
        offset: [-6, 13],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/17/headback.png"]
        ],
        states: {
            back: [
                ["legs", 36, 77],
                ["backtorso", 36, 68],
                ["leftarm", 22, 68],
                ["rightarm", 58, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 35, 77],
                ["fronttorso", 36, 68],
                ["leftarm", 21, 68],
                ["rightarm", 58, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "18": {
        offset: [-16, -6],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/18/headback.png"]
        ],
        states: {
            back: [
                ["legs", 39, 95],
                ["torso", 60, 85],
                ["leftarm", 45, 85],
                ["rightarm", 73, 85],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 39, 95],
                ["torso", 60, 85],
                ["leftarm", 45, 85],
                ["rightarm", 73, 85],
                ["headfront", 0, 0]
            ]
        }
    },
    "19": {
        offset: [-16, -3],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/19/headback.png"]
        ],
        states: {
            back: [
                ["legs", 42, 95],
                ["torso", 60, 85],
                ["leftarm", 45, 85],
                ["rightarm", 73, 85],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 42, 95],
                ["torso", 60, 85],
                ["leftarm", 45, 85],
                ["rightarm", 73, 85],
                ["headfront", 0, 0]
            ]
        }
    },
    "20": {
        offset: [-24, -27],
        images: [
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/20/headback.png"]
        ],
        states: {
            back: [
                ["leftarm", 28, 135],
                ["rightarm", 93, 135],
                ["backtorso", 33, 135],
                ["headback", 0, 0]
            ],
            front: [
                ["leftarm", 28, 133],
                ["rightarm", 93, 133],
                ["fronttorso", 33, 133],
                ["headfront", 0, 0]
            ]
        }
    },
    "21": {
        offset: [-24, -27],
        images: [
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/21/headback.png"]
        ],
        states: {
            back: [
                ["leftarm", 31, 132],
                ["rightarm", 87, 132],
                ["backtorso", 33, 132],
                ["headback", 0, 0]
            ],
            front: [
                ["leftarm", 31, 132],
                ["rightarm", 87, 132],
                ["fronttorso", 33, 132],
                ["headfront", 0, 0]
            ]
        }
    },
    "22": {
        offset: [-22, -30],
        images: [
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/backtorso.png"],
            ["frontlegs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/frontlegs.png"],
            ["backlegs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/backlegs.png"],
            ["leftarm_back", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/leftarm_back.png"],
            ["rightarm_back", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/rightarm_back.png"],
            ["leftarm_front", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/leftarm_front.png"],
            ["rightarm_front", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/rightarm_front.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/22/headback.png"]
        ],
        states: {
            back: [
                ["leftarm_back", 42, 132],
                ["rightarm_back", 92, 132],
                ["backtorso", 62, 136],
                ["backlegs", 57, 150],
                ["headback", 0, 0]
            ],
            front: [
                ["leftarm_front", 43, 132],
                ["rightarm_front", 96, 132],
                ["fronttorso", 62, 136],
                ["frontlegs", 57, 150],
                ["headfront", 0, 0]
            ]
        }
    },
    "23": {
        offset: [10, -10],
        images: [
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/backtorso.png"],
            ["frontlegs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/frontlegs.png"],
            ["backlegs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/backlegs.png"],
            ["leftarm_back", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/leftarm_back.png"],
            ["rightarm_back", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/rightarm_back.png"],
            ["leftarm_front", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/leftarm_front.png"],
            ["rightarm_front", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/rightarm_front.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/23/headback.png"]
        ],
        states: {
            back: [
                ["leftarm_back", -117, 25],
                ["rightarm_back", 60, 30],
                ["backtorso", -68, 28],
                ["backlegs", -25, 140],
                ["headback", 0, 0]
            ],
            front: [
                ["leftarm_front", -108, 45],
                ["rightarm_front", 84, 45],
                ["fronttorso", -71, 28],
                ["frontlegs", -28, 139],
                ["headfront", 0, 0]
            ]
        }
    },
    "24": {
        offset: [-43, -35],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/24/headback.png"]
        ],
        states: {
            back: [
                ["legs", 98, 180],
                ["leftarm", 83, 153],
                ["rightarm", 138, 153],
                ["backtorso", 103, 153],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 98, 180],
                ["leftarm", 83, 153],
                ["rightarm", 138, 153],
                ["fronttorso", 103, 153],
                ["headfront", 0, 0]
            ]
        }
    },
    "25": {
        offset: [-43, -35],
        images: [
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/25/head.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/25/head.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/25/body.png"]
        ],
        states: {
            back: [
                ["backtorso", -12, 60],
                ["headback", 28, 8]
            ],
            front: [
                ["legs", 98, 180],
                ["leftarm", 83, 153],
                ["rightarm", 138, 153],
                ["fronttorso", 103, 153],
                ["headfront", 100, 100]
            ]
        }
    },
    "26": {
        offset: [-6, -7],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/legs.png"],
            ["torso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/torso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/26/headback.png"]
        ],
        states: {
            back: [
                ["legs", 39, 119],
                ["torso", 39, 97],
                ["leftarm", 25, 97],
                ["rightarm", 61, 97],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 39, 117],
                ["torso", 39, 95],
                ["leftarm", 25, 95],
                ["rightarm", 61, 95],
                ["headfront", 0, 0]
            ]
        }
    },
    "27": {
        offset: [0, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/27/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/27/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/27/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/27/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 7, 72],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 7, 74],
                ["headfront", 0, 0]
            ]
        }
    },
    "28": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/28/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/28/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/28/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/28/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 9, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 9, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "29": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/29/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/29/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/29/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/29/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", -7, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", -7, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "30": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/30/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/30/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/30/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/30/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 7, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 7, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "31": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/31/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/31/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/31/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/31/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 7, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 9, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "32": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/32/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/32/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/32/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/32/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 7, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 8, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "33": {
        offset: [-2, 2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/33/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/33/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/33/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/33/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 7, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 8, 73],
                ["headfront", 0, 0]
            ]
        }
    },
    "34": {
        offset: [1, -2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/34/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/34/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/34/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/34/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 15, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 13, 81],
                ["headfront", 0, 0]
            ]
        }
    },
    "35": {
        offset: [-6, -7],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/headfront.png"],
            ["headfrontplay", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/headfront_heart.png"],
            ["headfrontplay2", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/headfront_arrow.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 18, 95],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 18, 95],
                ["headfront", 0, 0]
            ],
            frontplay: [
                ["bodyfront", 18, 95],
                ["headfrontplay", 0, 0]
            ]
        },
        animations: {
            bob: [{
                "headback,headfront,headfrontplay": [{
                    swap: "headfrontplay"
                }, {
                    y: 7,
                    time: 200
                }]
            }, {
                "headback,headfront,headfrontplay": [{
                    y: -7,
                    time: 200
                }, {
                    swap: "headfront"
                }]
            }, {
                "headback,headfront,headfrontplay,headfrontplay2": [{
                    swap: "headfrontplay2"
                }, {
                    y: 7,
                    time: 200
                }]
            }, {
                "headback,headfront,headfrontplay,headfrontplay2": [{
                    y: -7,
                    time: 200
                }, {
                    swap: "headfront"
                }]
            }, {
                "headback,headfront": [{
                    swap: "headfront"
                }, {
                    y: 7,
                    time: 200
                }]
            }, {
                "headback,headfront": [{
                    y: -7,
                    time: 200
                }, {
                    swap: "headfront"
                }]
            }],
            "bob.loop": true
        }
    },
    "36": {
        offset: [-15, -15],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/36/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/36/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/36/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/36/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 40, 107],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 40, 107],
                ["headfront", 0, 0]
            ]
        }
    },
    "37": {
        offset: [-15, -15],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/37/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/37/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/37/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/37/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 40, 107],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 40, 107],
                ["headfront", 0, 0]
            ]
        }
    },
    "38": {
        offset: [-15, -12],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/38/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/38/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/38/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/38/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 40, 96],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 40, 96],
                ["headfront", 0, 0]
            ]
        }
    },
    "39": {
        offset: [-5, -12],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/39/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/39/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/39/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/39/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 5],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 5],
                ["headfront", 0, 0]
            ]
        }
    },
    "40": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/40/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/40/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/40/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/40/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "41": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/41/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/41/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/41/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/41/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "42": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/42/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/42/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/42/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/42/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "43": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/43/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/43/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/43/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/43/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "44": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/44/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/44/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/44/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/44/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "45": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/45/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/45/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/45/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/45/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "46": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/46/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/46/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/46/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/46/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "47": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/47/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/47/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/47/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/47/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "48": {
        offset: [-5, -8],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/48/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/48/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/48/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/48/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "49": {
        offset: [-8, -10],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/49/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/49/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/49/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/49/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "50": {
        offset: [-8, -10],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/50/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/50/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/50/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/50/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "51": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/51/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/51/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/51/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/51/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "52": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/52/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/52/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/52/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/52/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "53": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/53/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/53/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/53/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/53/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "54": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/54/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/54/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/54/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/54/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "55": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/55/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/55/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/55/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/55/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "56": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/56/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/56/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/56/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/56/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "57": {
        offset: [-8, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/57/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/57/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/57/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/57/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 1, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "58": {
        offset: [-5, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/58/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/58/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/58/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/58/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", -8, 0],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "59": {
        offset: [-11, -12],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/59/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/59/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/59/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/59/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 2, 3],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "60": {
        offset: [-9, -10],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/60/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/60/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/60/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/60/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", -3, 0],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 1, 3],
                ["headfront", 0, 0]
            ]
        }
    },
    "61": {
        offset: [-4, -3],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/61/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/61/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/61/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/61/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 5, 70],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 0, 75],
                ["headfront", 0, 0]
            ]
        }
    },
    "62": {
        offset: [1, -2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/62/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/62/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/62/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/62/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 15, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 13, 81],
                ["headfront", 0, 0]
            ]
        }
    },
    "63": {
        offset: [1, -6],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/63/headback.png"]
        ],
        states: {
            back: [
                ["legs", 30, 98],
                ["backtorso", 31, 91],
                ["leftarm", 19, 91],
                ["rightarm", 47, 91],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 30, 97],
                ["fronttorso", 31, 90],
                ["leftarm", 19, 90],
                ["rightarm", 47, 90],
                ["headfront", 0, 0]
            ]
        }
    },
    "64": {
        offset: [-2, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/64/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/64/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/64/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/64/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 23, 81],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 23, 81],
                ["headfront", 0, 0]
            ]
        }
    },
    "65": {
        offset: [-2, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/65/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/65/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/65/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/65/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 23, 81],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 23, 81],
                ["headfront", 0, 0]
            ]
        }
    },
    "66": {
        offset: [1, -3],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/66/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/66/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/66/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/66/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 15, 74],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 17, 74],
                ["headfront", 0, 0]
            ]
        }
    },
    "67": {
        offset: [3, -3],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/67/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/67/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/67/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/67/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 14, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 12, 84],
                ["headfront", 0, 0]
            ]
        }
    },
    "68": {
        offset: [1, 3],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/68/headback.png"]
        ],
        states: {
            back: [
                ["legs", 32, 81],
                ["backtorso", 32, 66],
                ["leftarm", 19, 69],
                ["rightarm", 53, 69],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 30, 81],
                ["fronttorso", 30, 66],
                ["leftarm", 19, 69],
                ["rightarm", 53, 69],
                ["headfront", 0, 0]
            ]
        }
    },
    "69": {
        offset: [-5, 3],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/69/headback.png"]
        ],
        states: {
            back: [
                ["legs", 39, 81],
                ["backtorso", 39, 66],
                ["leftarm", 27, 69],
                ["rightarm", 60, 69],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 37, 81],
                ["fronttorso", 37, 66],
                ["leftarm", 25, 69],
                ["rightarm", 60, 69],
                ["headfront", 0, 0]
            ]
        }
    },
    "70": {
        offset: [2, -1],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/70/headback.png"]
        ],
        states: {
            back: [
                ["legs", 29, 82],
                ["backtorso", 29, 69],
                ["leftarm", 16, 70],
                ["rightarm", 46, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 30, 83],
                ["fronttorso", 30, 68],
                ["leftarm", 17, 71],
                ["rightarm", 49, 69],
                ["headfront", 0, 0]
            ]
        }
    },
    "71": {
        offset: [2, 5],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/71/headback.png"]
        ],
        states: {
            back: [
                ["legs", 28, 72],
                ["backtorso", 29, 59],
                ["leftarm", 16, 60],
                ["rightarm", 46, 58],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 30, 73],
                ["fronttorso", 30, 58],
                ["leftarm", 17, 61],
                ["rightarm", 49, 59],
                ["headfront", 0, 0]
            ]
        }
    },
    "72": {
        offset: [-7, -5],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/72/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/72/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/72/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/72/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 30, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 28, 84],
                ["headfront", 0, 0]
            ]
        }
    },
    "73": {
        offset: [2, 0],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/73/headback.png"]
        ],
        states: {
            back: [
                ["legs", 28, 83],
                ["backtorso", 29, 71],
                ["leftarm", 17, 71],
                ["rightarm", 48, 73],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 31, 86],
                ["fronttorso", 32, 74],
                ["leftarm", 18, 70],
                ["rightarm", 51, 70],
                ["headfront", 0, 0]
            ]
        }
    },
    "74": {
        offset: [1, 0],
        images: [
            ["legs", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/legs.png"],
            ["fronttorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/fronttorso.png"],
            ["backtorso", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/backtorso.png"],
            ["leftarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/leftarm.png"],
            ["rightarm", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/rightarm.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/74/headback.png"]
        ],
        states: {
            back: [
                ["legs", 27, 87],
                ["backtorso", 28, 72],
                ["leftarm", 15, 69],
                ["rightarm", 47, 72],
                ["headback", 0, 0]
            ],
            front: [
                ["legs", 29, 87],
                ["fronttorso", 30, 72],
                ["leftarm", 17, 69],
                ["rightarm", 49, 72],
                ["headfront", 0, 0]
            ]
        }
    },
    "75": {
        offset: [-1, -6],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/75/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/75/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/75/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/75/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 9, 90],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 9, 90],
                ["headfront", 0, 0]
            ]
        }
    },
    "76": {
        offset: [-35, -18],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/76/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/76/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/76/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/76/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 0, 0],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 0, 0],
                ["headfront", 0, 0]
            ]
        }
    },
    "77": {
        offset: [2, 0],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/77/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/77/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/77/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/77/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 8, 70],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 8, 70],
                ["headfront", 0, 0]
            ]
        }
    },
    "78": {
        offset: [0, 4],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/78/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/78/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/78/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/78/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 16, 87],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 16, 87],
                ["headfront", 0, 0]
            ]
        }
    },
    "79": {
        offset: [0, -2],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/79/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/79/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/79/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/79/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 16, 87],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 16, 87],
                ["headfront", 0, 0]
            ]
        }
    },
    "80": {
        offset: [0, 4],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/80/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/80/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/80/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/80/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 18, 72],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 18, 72],
                ["headfront", 0, 0]
            ]
        }
    },
    "81": {
        offset: [-4, 3],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/81/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/81/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/81/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/81/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 25, 75],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 25, 75],
                ["headfront", 0, 0]
            ]
        }
    },
    "82": {
        offset: [-6, -1],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/82/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/82/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/82/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/82/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 25, 84],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 25, 84],
                ["headfront", 0, 0]
            ]
        }
    },
    "83": {
        offset: [-5, -1],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/83/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/83/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/83/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/83/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 25, 87],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 25, 87],
                ["headfront", 0, 0]
            ]
        }
    },
    "84": {
        offset: [-4, 7],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/84/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/84/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/84/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/84/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 26, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 26, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "85": {
        offset: [-4, 7],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/85/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/85/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/85/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/85/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 26, 68],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 26, 68],
                ["headfront", 0, 0]
            ]
        }
    },
    "86": {
        offset: [0, 0],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/86/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/86/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/86/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/86/headback.png"]
        ],
        states: {
            back: [
                ["headback", 0, 0],
                ["bodyback", -67, 0]
            ],
            front: [
                ["bodyfront", -67, 0],
                ["headfront", 0, 0]
            ]
        }
    },
    "87": {
        offset: [-10, -7],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/87/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/87/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/87/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/87/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 30, 82],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 30, 82],
                ["headfront", 0, 0]
            ]
        }
    },
    "88": {
        offset: [-2, -27],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/88/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/88/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/88/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/88/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 12, 98],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 12, 98],
                ["headfront", 0, 0]
            ]
        }
    },
    "89": {
        offset: [-4, -9],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/89/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/89/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/89/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/89/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 25, 94],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 25, 94],
                ["headfront", 0, 0]
            ]
        }
    },
    "90": {
        offset: [3, -13],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/90/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/90/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/90/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/90/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 13, 91],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 13, 91],
                ["headfront", 0, 0]
            ]
        }
    },
    "91": {
        offset: [-3, -9],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/91/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/91/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/91/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/91/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 25, 80],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 25, 80],
                ["headfront", 0, 0]
            ]
        }
    },
    "92": {
        offset: [5, -9],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/92/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/92/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/92/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/92/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 6, 79],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 6, 79],
                ["headfront", 0, 0]
            ]
        }
    },
    "93": {
        offset: [5, -7],
        images: [
            ["bodyback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/93/bodyback.png"],
            ["bodyfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/93/bodyfront.png"],
            ["headfront", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/93/headfront.png"],
            ["headback", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/93/headback.png"]
        ],
        states: {
            back: [
                ["bodyback", 6, 72],
                ["headback", 0, 0]
            ],
            front: [
                ["bodyfront", 6, 72],
                ["headfront", 0, 0]
            ]
        }
    }
};
var volume_control = '<div class="volume_container"><div class="volume_bar volume_bar1 group1"></div><div class="volume_bar volume_bar2 group1 group2"></div><div class="volume_bar volume_bar3 group1 group2 group3"></div><div class="volume_bar volume_bar4 group1 group2 group3 group4"></div></div>';
DppIOChBApLud = null;
ROOM_INTERVAL = null;
MARQUEE_INTERVALS = {};

function ulXJpdM(h, f, d, a, g, e) {
    DppIOChBApLud = this;
    this.div = h;
    this.dj_spots = f;
    this.width = d;
    this.height = a;
    this.callback = g;
    this.myuserid = e;
    this.floorRects = [{
        rect: [20, 325, 50, 180],
        weight: 0.25
    }, {
        rect: [20, 225, 450, 100],
        weight: 0.75
    }];
    var b = this.floorRects[1].rect[1];
    var c = this.floorRects[0].rect[1] + this.floorRects[0].rect[3];
    this.floorYRange = [b, c];
    this.blackswan = new blackswan(h, d, a, this.floorYRange);
    this.blackswan.add_props(room_props);
    this.blackswan.start();
    this.speaker = this.blackswan.add_dancer(speaker, false, [15, 194], false, false);
    this.listeners = {};
    this.djs = {};
    this.djs_uid = {};
    this.record_piles = {};
    this.become_dj = null;
    this.invite_dj = null;
    this.taken_dj_map = [-1, -1, -1, -1, -1];
    this.moderator = false;
    this.volume_bars = 4;
    this.last_volume_bars = this.volume_bars;
    this.marquee_texts = {};
    this.moderators = [];
    this.spotlight_index = -1;
    this.setup = function () {
        if (ROOM_INTERVAL) {
            clearInterval(ROOM_INTERVAL);
            ROOM_INTERVAL = null;
        }
        this.clear_marquees();
        for (var j = 0; j < f; ++j) {
            var k = $('<div class="record_pile"></div>');
            k.data("spot", j);
            if (j == 0) {
                k.hide();
            }
            this.record_piles[j] = k;
            this.blackswan.add_element(k, record_pile_locations[j], 116);
        }
        this.become_dj = $('<a class="mcOFZjcYVGNMkZ"></a>');
        this.become_dj.data("spot", 0);
        this.become_dj.click(function (l) {
            if (!(l.pageX && l.pageY)) {
                return;
            }
            DppIOChBApLud.callback("become_dj", $(this).data("spot"));
        });
        this.blackswan.add_element(this.become_dj, becomedj_locations[0], 116, true);
        this.invite_dj = $('<a class="invite_dj"></a>');
        this.invite_dj.click(function () {
            DppIOChBApLud.callback("invite_dj");
        });
        this.blackswan.add_element(this.invite_dj, becomedj_locations[0], 116, true);
        this.invite_dj.hide();
        var k = $('<a id="EhjnzWnZgvCHw"></a>');
        k.click(function (l) {
            if (l.pageX && l.pageY && turntable.idleTime() < 5000) {
                DppIOChBApLud.callback("upvote");
            }
        });
        this.blackswan.add_element(k, [370, 555], 10001, true);
        var k = $('<a id="BTIvCYGWk"></a>');
        k.click(function (l) {
            if (l.pageX && l.pageY && turntable.idleTime() < 5000) {
                DppIOChBApLud.callback("downvote");
            }
        });
        this.blackswan.add_element(k, [154, 555], 10001, true);
        this.setup_mute_volume();
        this.needle = this.blackswan.add_dancer(needle, "default", [274, 494], false, false, 10001);
        $(this.needle.div).attr("id", "meterNeedle");
        $(this.needle.div).css("width", "100px");
        $(this.needle.div).css("height", "100px");
        this.needle_pos = 0;
        this.songboard = $('<div id="songboard"><div id="songboard_artist"></div><div id="songboard_title"></div></div>');
        this.blackswan.add_element(this.songboard, [84, 147], 116, true);
        this.add_add_to();
    };
    this.add_moderator = function (j) {
        if (!j) {
            return;
        }
        this.moderators = j;
        this.moderator = true;
    };
    this.rem_moderator = function (j) {
        if (!j) {
            return;
        }
        this.moderators = j;
        this.moderator = false;
    };
    this.getRandFloorLocation = function (j) {
        if (!j) {
            j = Math;
        }
        var k = j.random();
        var m, l, o = false;
        for (i = 0, len = this.floorRects.length; i < len; i++) {
            m = l ? l : 0;
            l = m + this.floorRects[i].weight;
            if (k >= m && k < l) {
                o = this.floorRects[i].rect;
                break;
            }
        }
        if (!o) {
            o = this.floorRects[0].rect;
        }
        var p = Math.floor(j.random() * o[2]) + o[0];
        var n = Math.floor(j.random() * o[3]) + o[1];
        return [p, n];
    };
    this.getExistingAvatarById = function (j) {
        j = String(j);
        return avatars[j in avatars ? j : String(Math.floor(Math.random() * 8) + 1)];
    };
    this.add_listener = function (l, n) {
        var k = this.getExistingAvatarById(l.avatarid);
        var m = this.getRandFloorLocation(n);
        var o = this.blackswan.add_dancer(k, "back", m, true, false);
        this.add_tooltip(o.div, l);
        o.body().click(function () {
            DppIOChBApLud.callback("profile", l.userid);
        });
        o.body().css("cursor", "pointer");
        var j = l.userid;
        this.listeners[j] = o;
        if (this.myuserid == j) {
            var p = $("<div></div>");
            $(o.div).append(p);
            this.quick_tooltip(p, "you_marker", "YOU", -15);
        }
    };
    this.toggle_listener = function (j) {
        var k = this.get_user_div(j);
        if (k[0]) {
            var l = k[0];
            if (!l.find(".tipsy").length) {
                l.mouseover();
            } else {
                l.mouseout();
            }
        }
    };
    this.rem_listener = function (k) {
        var j = k.userid;
        var l = this.listeners[j];
        if (l) {
            this.blackswan.remove_dancer(l);
            delete this.listeners[j];
        }
    };
    this.get_user_div = function (k) {
        var m = this.listeners[k];
        var n = null;
        var l = false;
        if (m) {
            n = m.div;
        } else {
            var j = this.djs_uid[k];
            if (j) {
                n = j[1];
            }
            l = true;
        }
        return [n, l];
    };
    this.speak = function (k, o) {
        var j = k.userid;
        var l = this.get_user_div(j);
        var n = l[1];
        var p = l[0];
        if (!p) {
            return;
        }
        var m = $('<div class="speak_bubble"></div>');
        m.tipsy({
            fade: true,
            gravity: (n) ? "w" : "sw",
            offset: (n) ? 0 : -35,
            opacity: 0.9,
            html: true,
            trigger: "manual"
        });
        o = this.safeText(util.stripComboDiacritics(o));
        m.tipsy(true).tip().children(".tipsy-arrow").css("display", "block");
        m.tipsy(true).options.title = function () {
            return '<div class="tooltip_info">' + o + "</div>";
        };
        m.tipsy("show");
        $(document.body).append(m);
        m.css("left", p.offset().left + "px");
        m.css("top", (p.offset().top - 60 - (Math.floor(o.length / 20) * 10)) + "px");
        setTimeout(function () {
            m.tipsy("hide");
            setTimeout(function () {
                m.remove();
            }, 2000);
        }, 2000);
    };
    this.add_dj = function (l, n) {
        var k = l.userid;
        var j = this.getExistingAvatarById(l.avatarid);
        var m = $('<div class="avatar_laptop"><img src="' + room_elements["laptop_" + l.laptop] + '"></div>');
        this.blackswan.add_element(m, laptop_locations[n], 117);
        this.add_tooltip(m, l, true);
        var o = $('<div class="point_display"></div>');
        o.hide();
        m.append(o);
        var q = this.blackswan.add_dancer(j, "front", dj_locations[n], true, true);
        this.djs[n] = [k, q, m, o, l];
        this.djs_uid[k] = [q, m];
        q.body().click(function () {
            DppIOChBApLud.callback("profile", l.userid);
        });
        q.body().css("cursor", "pointer");
        this.shuffle_dj_spots(n, 1);
    };
    this.rem_dj = function (k) {
        var j = this.djs[k];
        if (j) {
            this.blackswan.remove_dancer(j[1]);
            this.blackswan.remove_element(j[2]);
            var l = this.djs[k];
            delete this.djs_uid[l[0]];
            delete this.djs[k];
            this.shuffle_dj_spots(k, -1);
        }
    };
    this.rightmost_spot = function () {
        for (var j = this.taken_dj_map.length; j >= 0; --j) {
            if (this.taken_dj_map[j] == 1) {
                return j;
            }
        }
        return -1;
    };
    this.shuffle_dj_spots = function (l, m) {
        this.taken_dj_map[l] = m;
        var k = this.rightmost_spot() + 1;
        this.become_dj.hide();
        this.invite_dj.hide();
        for (var j = 0; j < this.dj_spots; ++j) {
            this.record_piles[j].hide();
        }
        if (k < this.dj_spots) {
            for (var j = 0; j < this.dj_spots; ++j) {
                if (j > 0 && j != l) {
                    this.record_piles[j].show();
                }
            }
            if (this.djs_uid[this.myuserid]) {
                var n = this.invite_dj;
            } else {
                var n = this.become_dj;
            }
            n.show();
            n.data("spot", k);
            this.blackswan.move_element(n, becomedj_locations[k]);
            this.record_piles[k].hide();
        }
    };
    this.set_dj_points = function (j) {
        if (this.current_dj) {
            this.current_dj[3].show();
            this.current_dj[3].html(j + " points");
            this.current_dj[4].points = j;
        }
    };
    this.set_active_dj = function (k) {
        var j = this.djs[k];
        if (j) {
            var l = j[1];
            this.add_animation_to(l, "bob");
            this.current_dj = j;
            this.set_dj_points(j[4].points);
            if (this.spotlight_index != k) {
                if (this.spotlight) {
                    this.spotlight.attr("id", "").fadeOut(400, function () {
                        $(this).remove();
                    });
                }
                this.spotlight = $('<div id="spotlight"></div>');
                this.spotlight_index = k;
                this.blackswan.add_element(this.spotlight, spotlight_locations[k], 210);
                this.spotlight.hide();
                this.spotlight.fadeIn();
                this.add_tooltip(this.spotlight, this.djs[k][4], true, "spotlight_tip");
            }
        }
    };
    this.stop_active_dj = function () {
        if (this.current_dj) {
            this.current_dj[1].stop();
            this.current_dj[3].hide();
            if (this.spotlight) {
                this.spotlight.attr("id", "").fadeOut(400, function () {
                    $(this).remove();
                });
                this.spotlight = null;
                this.spotlight_index = -1;
            }
        }
    };
    this.loadingsong = function (j) {
        this.nosong();
        this.set_active_dj(j);
        $("#songboard_artist").html("Loading");
        msgs = ["the bits are breeding", "go ahead - hold your breath", "at least you're not on hold", "we're testing your patience", "as if you had any other choice", "don't think of purple hippos", "follow the white rabbit", "reticulating splines", "frobulating widgets", "pc load letter"];
        $("#songboard_title").html(msgs[Math.floor(Math.random() * msgs.length)]);
    };
    this.newsong = function (l, j, n, m) {
        j = util.cleanText(j);
        n = util.cleanText(n);
        this.speaker.state("on");
        this.speaker.animation("vibrate");
        this.set_active_dj(l);
        this.time_left = m;
        var k = function () {
                DppIOChBApLud.update_songboard(j, n);
                DppIOChBApLud.time_left -= 1;
            };
        k();
        if (ROOM_INTERVAL) {
            clearInterval(ROOM_INTERVAL);
        }
        ROOM_INTERVAL = setInterval(k, 1000);
    };
    this.nosong = function () {
        if (ROOM_INTERVAL) {
            clearInterval(ROOM_INTERVAL);
            ROOM_INTERVAL = null;
        }
        this.clear_marquees();
        this.speaker.state("off");
        this.speaker.stop();
        this.stop_active_dj();
        for (var j in this.listeners) {
            var l = this.listeners[j];
            if (l) {
                l.stop();
            }
        }
        for (var j in this.djs_uid) {
            var k = this.djs_uid[j];
            if (k) {
                k[0].stop();
            }
        }
        this.time_left = 0;
        $("#songboard_artist").html("");
        $("#songboard_title").html("");
    };
    this.update_vote = function (k, m) {
        var j = k.userid;
        var n = this.listeners[j];
        if (n) {
            if (m == "up") {
                this.add_animation_to(n, "rock");
            } else {
                n.stop();
            }
        }
        var l = this.djs_uid[j];
        if (l) {
            var n = l[0];
            if (m == "up") {
                this.add_animation_to(n, "smallbob");
            } else {
                n.stop();
            }
        }
    };
    this.move_needle = function (n) {
        var m = -55;
        var j = 110;
        var l = n * j + m;
        var k = l - this.needle_pos;
        var o = {
            div: [{
                rotate: k,
                time: 1000
            }]
        };
        if (this.needle.ani) {
            this.needle.ani.push(o);
        } else {
            this.needle.add_source_animation("move", {
                move: [o]
            });
        }
        this.needle.animation("move", true);
        this.needle_pos = l;
    };
    this.update_songboard = function (j, l) {
        if (this.time_left <= 0) {
            this.nosong();
            $("#songboard_artist").html("");
            $("#songboard_title").html("");
        } else {
            var k = this.format_time(this.time_left);
            this.marquee("songboard_artist", 800, 12, j);
            this.marquee("songboard_title", 200, 30, l + " - " + k);
        }
    };
    this.show_songboard_add = function () {
        if (DppIOChBApLud.time_left) {
            $("#songboard_add").fadeIn();
            $("#songboard_artist").fadeOut();
            $("#songboard_title").fadeOut();
        }
    };
    this.hide_songboard_add = function () {
        $("#songboard_add").fadeOut();
        $("#songboard_artist").fadeIn();
        $("#songboard_title").fadeIn();
    };
    this.show_heart = function (k) {
        $.fx.step.path = function (q) {
            var p = q.end.css(1 - q.pos);
            for (var o in p) {
                q.elem.style[o] = p[o];
            }
        };
        var n = function (p) {
                var o = $(p).position();
                this.css = function (v) {
                    var u = Math.sin(v * 10);
                    var q = o.left + (1 - v) * u * 20;
                    var r = o.top + (1 - v) * -150;
                    var w = v * 5 - 1;
                    return {
                        top: r + "px",
                        left: q + "px",
                        opacity: w
                    };
                };
            };
        if (!k) {
            return;
        }
        var l;
        if (k in this.listeners) {
            l = $(this.listeners[k].layers.headback);
        } else {
            if (k in this.djs_uid) {
                var m = this.djs_uid[k][0];
                if (m) {
                    l = $(m.layers.headfront);
                }
            } else {
                return;
            }
        }
        if (!l) {
            return;
        }
        var j = $("<img></img>");
        j.attr("src", "https://s3.amazonaws.com/static.turntable.fm/images/room/heart.png");
        j.css({
            position: "absolute",
            top: l.offset().top,
            left: l.offset().left + (l.width() / 3),
            height: 20,
            width: 25,
            "z-index": 2
        }).appendTo($("body"));
        j.animate({
            path: new n(j)
        }, 5000, function () {
            j.remove();
        });
    };
    this.add_add_to = function () {
        this.blackswan.add_element($('<div id="songboard_hotspot"><div id="songboard_add">Add song to:<br><div class="btn queue"></div><div class="btn amazon"></div><div class="btn itunes"></div><div class="btn lastfm"></div><div class="btn spotify"></div><div class="btn rdio"></div></div></div>'), [84, 147], 148, true);
        $("#songboard_hotspot").mouseenter(this.show_songboard_add);
        $("#songboard_hotspot").mouseleave(this.hide_songboard_add);
        $("#songboard_hotspot .queue").click(function () {
            DppIOChBApLud.callback("add_song_to", "queue");
        });
        $("#songboard_hotspot .amazon").click(function () {
            DppIOChBApLud.callback("add_song_to", "amazon");
        });
        $("#songboard_hotspot .itunes").click(function () {
            DppIOChBApLud.callback("add_song_to", "itunes");
        });
        $("#songboard_hotspot .lastfm").click(function () {
            DppIOChBApLud.callback("add_song_to", "lastfm");
        });
        $("#songboard_hotspot .spotify").click(function () {
            DppIOChBApLud.callback("add_song_to", "spotify");
        });
        $("#songboard_hotspot .rdio").click(function () {
            DppIOChBApLud.callback("add_song_to", "rdio");
        });
        this.tiny_tooltip($("#songboard_hotspot .queue"), "turntable queue");
        this.tiny_tooltip($("#songboard_hotspot .amazon"), "amazon");
        this.tiny_tooltip($("#songboard_hotspot .itunes"), "itunes");
        this.tiny_tooltip($("#songboard_hotspot .lastfm"), "lastfm");
        this.tiny_tooltip($("#songboard_hotspot .spotify"), "spotify");
        this.tiny_tooltip($("#songboard_hotspot .rdio"), "rdio");
    };
    this.tiny_tooltip = function (k, j) {
        $(k).tipsy({
            title: function () {
                return '<div class="tiny_tooltip">' + j + "</div>";
            },
            fade: true,
            gravity: "s",
            offset: -7,
            html: true,
            opacity: 0.9
        });
    };
    this.quick_tooltip = function (m, j, l, k) {
        m.tipsy({
            title: function () {
                return '<div class="' + j + '">' + l + "</div>";
            },
            fade: true,
            gravity: "sw",
            offset: (k ? k : 0),
            html: true,
            opacity: 0.9,
            delayOut: 200,
            trigger: "manual"
        });
        m.tipsy("show");
        setTimeout(function () {
            m.tipsy("hide");
        }, 3000);
    };
    this.hide_tip = function (j) {
        var k = this.get_user_div(j);
        if (k[0]) {
            k[0].tipsy("hide");
        }
    };
    this.add_tooltip = function (m, j, l, k) {
        m.tipsy({
            title: function () {
                var r = "<br>" + DppIOChBApLud.commafy(j.points) + " DJ point" + (j.points == 1 ? "" : "s") + "<br>" + DppIOChBApLud.commafy(j.fans || 0) + " fan" + (j.fans == 1 ? "" : "s");
                var s = "<a class=\"tooltip_info tooltip_btn gold\" href=\"javascript:DppIOChBApLud.callback('become_fan','" + j.userid + "')\">Become a Fan</a>";
                var p = "<a class=\"tooltip_info tooltip_btn gold\" href=\"javascript:DppIOChBApLud.callback('remove_fan','" + j.userid + "')\">Unfan</a>";
                var w = "<a class=\"tooltip_info tooltip_btn\" href=\"javascript:DppIOChBApLud.callback('remove_dj','" + j.userid + "')\">Remove DJ</a>";
                var o = "<a class=\"tooltip_info tooltip_btn\" href=\"javascript:DppIOChBApLud.callback('boot_user','" + j.userid + "')\">Boot User</a>";
                var t = "<a class=\"tooltip_info tooltip_btn\" href=\"javascript:DppIOChBApLud.callback('add_moderator','" + j.userid + "');DppIOChBApLud.hide_tip('" + j.userid + "')\">Make a Moderator</a>";
                var q = "<a class=\"tooltip_info tooltip_btn\" href=\"javascript:DppIOChBApLud.callback('rem_moderator','" + j.userid + "');DppIOChBApLud.hide_tip('" + j.userid + "')\">Remove Moderator</a>";
                var n = '<a class="tooltip_info tooltip_btn" href="javascript:DppIOChBApLud.callback(\'stop_song\')">Skip My Song</a>';
                var v = '<a class="tooltip_info tooltip_btn" href="javascript:DppIOChBApLud.callback(\'rem_dj\')">Quit DJing</a>';
                var u = "";
                u += r;
                u += "</a>";
                if (l) {
                    if (j.userid == DppIOChBApLud.myuserid) {
                        u += v;
                        if (DppIOChBApLud.current_dj && DppIOChBApLud.current_dj[0] == DppIOChBApLud.myuserid) {
                            u += n;
                        }
                    }
                }
                if (DppIOChBApLud.moderator && j.userid != DppIOChBApLud.myuserid) {
                    if (turntable.user.acl >= j.acl) {
                        u += o;
                        if ($.inArray(j.userid, DppIOChBApLud.moderators) >= 0) {
                            u += q;
                        } else {
                            u += t;
                        }
                    }
                    if (l) {
                        u += w;
                    }
                }
                if (j.userid != DppIOChBApLud.myuserid) {
                    if (j.fanof) {
                        u += p;
                    } else {
                        u += s;
                    }
                }
                return '<div class="' + ((k) ? k : "") + '"><a class="tooltip_info tooltip_btn blue" href="javascript:DppIOChBApLud.callback(\'profile\',\'' + j.userid + "')\"><b>" + DppIOChBApLud.safeText(j.name) + "</b>" + u + "</div>";
            },
            fade: true,
            gravity: (l) ? "w" : "sw",
            offset: (l) ? -80 : -20,
            html: true,
            opacity: 0.9,
            delayOut: 200
        });
        if (l) {
            m.mouseenter(function () {
                $(".avatar_laptop").css("z-index", 117);
                $(this).css("z-index", 200);
            });
        }
    };
    this.safeText = function (j) {
        return j.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
    this.add_animation_to = function (k, j) {
        if (k.scaledAnimations) {
            k.add_source_animation(j, k.scaledAnimations[j], true);
        } else {
            k.add_source_animation(j, avatar_animations[j], true);
        }
        k.animation(j);
    };
    this.format_time = function (m) {
        var k = Math.floor(m / (60 * 60));
        var o = m % (60 * 60);
        var l = Math.floor(o / 60);
        var j = o % 60;
        var p = Math.ceil(j);
        if (k && l < 10) {
            l = "0" + l;
        }
        if (p < 10) {
            p = "0" + p;
        }
        var n = "";
        if (k) {
            n += k + ":";
        }
        n += l + ":";
        n += p;
        return n;
    };
    this.setup_mute_volume = function () {
        function n() {
            $(".volume_container").css("visibility", "visible");
            $(".mv_container").show();
        }
        function o() {
            if (DppIOChBApLud.volume_bars) {
                $(".mv_container").hide();
            } else {
                $(".volume_container").css("visibility", "hidden");
            }
        }
        var k = this._mv_construct("left", n, o);
        var m = this._mv_construct("right", n, o);
        var l = $('<div id="left_speaker"></div>');
        l.mouseenter(n);
        l.mouseleave(o);
        this.blackswan.add_element(l, [0, 132], 117);
        var j = $('<div id="right_speaker"></div>');
        this.blackswan.add_element(j, [441, 132], 117);
        j.mouseenter(n);
        j.mouseleave(o);
    };
    this._mv_construct = function (j, s, n) {
        if (j == "left") {
            var o = [0, 130];
            var r = 0;
        } else {
            var o = [441, 130];
            var r = 1;
        }
        var l = $('<div class="mv_container"></div>');
        this.blackswan.add_element(l, o, 10001, true);
        var q = $(volume_control);
        l.append(q);
        l.mouseenter(s);
        l.mouseleave(n);

        function p(m, t) {
            $(".volume_bar" + m).mouseenter(function () {
                $(".group" + m).addClass("volume_bar_hover");
            });
            $(".volume_bar" + m).mouseleave(function () {
                $(".group" + m).removeClass("volume_bar_hover");
            });
            $($(".volume_bar" + m)[r]).click(function () {
                DppIOChBApLud.set_volume(t);
                DppIOChBApLud.callback("set_volume", t);
            });
        }
        p(1, 4);
        p(2, 3);
        p(3, 2);
        p(4, 1);
        var k = $('<a class="mute_btn"></a>');
        k.mouseenter(function () {
            $(".mute_btn").addClass("mute_btn_hover");
        });
        k.mouseleave(function () {
            $(".mute_btn").removeClass("mute_btn_hover");
        });
        k.click(function () {
            DppIOChBApLud.set_volume(DppIOChBApLud.volume_bars ? 0 : DppIOChBApLud.last_volume_bars);
            DppIOChBApLud.callback("set_volume", DppIOChBApLud.volume_bars);
        });
        l.append(k);
        if (j == "right") {
            q.css("margin-right", "20px");
            k.css("margin-left", "5px");
        }
        l.hide();
        return l;
    };
    this.set_volume = function (j) {
        $(".volume_bar").removeClass("volume_bar_empty");
        if (j <= 3) {
            $(".volume_bar1").addClass("volume_bar_empty");
        }
        if (j <= 2) {
            $(".volume_bar2").addClass("volume_bar_empty");
        }
        if (j <= 1) {
            $(".volume_bar3").addClass("volume_bar_empty");
        }
        if (j == 0) {
            $(".volume_bar4").addClass("volume_bar_empty");
        }
        this.last_volume_bars = this.volume_bars;
        this.volume_bars = j;
        if (DppIOChBApLud.time_left && j) {
            this.speaker.state("on");
            this.speaker.animation("vibrate");
        } else {
            DppIOChBApLud.speaker.state("off");
            DppIOChBApLud.speaker.stop();
        }
    };
    this.marquee = function (m, k, l, j) {
        this.marquee_texts[m] = j;
        this._marquee_helper(m, k, l);
    };
    this._marquee_helper = function (p, k, m) {
        var o = $("#" + p);
        var n = 0;
        var j = this;
        if (this.marquee_texts[p].length < m) {
            o.text(this.marquee_texts[p]);
            return;
        }
        if (MARQUEE_INTERVALS[p]) {
            return;
        }
        function l() {
            var r = true;
            var q = j.marquee_texts[p];
            while (q[n] == " " || r) {
                n += 1;
                var r = false;
            }
            if (n == q.length) {
                n = 0;
            }
            cur_text = q.substring(n) + " - " + q.substring(0, n - 1);
            o.text(cur_text);
        }
        MARQUEE_INTERVALS[p] = setInterval(l, k);
        l();
    };
    this.clear_marquees = function () {
        for (var j in MARQUEE_INTERVALS) {
            if (MARQUEE_INTERVALS[j]) {
                clearInterval(MARQUEE_INTERVALS[j]);
                MARQUEE_INTERVALS[j] = null;
            }
        }
    };
    this.commafy = function (k) {
        k += "";
        x = k.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
        var j = /(\d+)(\d{3})/;
        while (j.test(x1)) {
            x1 = x1.replace(j, "$1,$2");
        }
        return x1 + x2;
    };
    this.setup();
}(function () {
    var a = false,
        b = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    this.Class = function () {};
    Class.extend = function (g) {
        var f = this.prototype;
        a = true;
        var e = new this();
        a = false;
        for (var d in g) {
            e[d] = typeof g[d] == "function" && typeof f[d] == "function" && b.test(g[d]) ? (function (h, i) {
                return function () {
                    var k = this._super;
                    this._super = f[h];
                    var j = i.apply(this, arguments);
                    this._super = k;
                    return j;
                };
            })(d, g[d]) : g[d];
        }
        function c() {
            if (!a && this.init) {
                this.init.apply(this, arguments);
            }
        }
        c.prototype = e;
        c.constructor = c;
        c.extend = arguments.callee;
        return c;
    };
})();
var util = {
    applyAttributes: function (g, c, a) {
        for (var f in c) {
            if (f == "style") {
                var e = c[f];
                for (var h in e) {
                    $(g).css(h, e[h]);
                }
            } else {
                if (f == "data") {
                    var b = c[f];
                    for (var d in b) {
                        $(g).data(d, b[d]);
                    }
                } else {
                    if (f == "event") {
                        util.applyEvents(g, c[f], a);
                    } else {
                        $(g).attr(f, c[f]);
                    }
                }
            }
        }
    },
    applyEvents: function (f, b, a) {
        if ($.type(b) != "object") {
            LOG("WARNING: 'events' " + String(b) + " is not a dict");
            return;
        }
        for (var d in b) {
            var c = b[d];
            if ($.type(c) == "string") {
                if (!a) {
                    LOG("WARNING: no owner provided for event handler '" + c + "'");
                    continue;
                }
                var e = a[c];
                if (!e) {
                    LOG("WARNING: no event handler " + String(a) + "." + c);
                    continue;
                }
                c = e;
            }
            if (!c) {
                continue;
            }
            $(f).bind(d, util.eventHandlerDecorator(c));
        }
    },
    buildTree: function (g, c) {
        var k = $.type(g);
        if (k == "string" || k == "number") {
            return document.createTextNode(String(g));
        }
        if (k != "array") {
            return g;
        }
        var d = g[0];
        var a, b, j = [];
        if (d.indexOf(".") > -1) {
            d = d.split(".");
            a = d.slice(1);
            d = d[0];
        }
        if (d.indexOf("##") > -1) {
            d = d.split("##");
            j = (c ? d.slice(1) : []);
            d = d[0];
        }
        if (d.indexOf("#") > -1) {
            d = d.split("#");
            b = d[1];
            d = d[0];
        }
        var e = document.createElement(d);
        if (a) {
            e.className = a.join(" ");
        }
        for (var f = 0; f < j.length; f++) {
            c[j[f]] = e;
        }
        if (b) {
            e.id = b;
        }
        var f = 1;
        var h = g[f];
        if (h) {
            if (util.typeOf(h) == "object") {
                util.applyAttributes(e, h, c);
                if (d.toLowerCase() == "a" && !e.href) {
                    e.href = "#";
                }
                f = 2;
            }
            for (; f < g.length; f++) {
                if (g[f] !== null && g[f] !== undefined) {
                    e.appendChild(util.buildTree(g[f], c));
                }
            }
        }
        if (d == "input") {
            util.setupPlaceholders(e);
        }
        return e;
    },
    eventHandlerDecorator: function (a) {
        return function () {
            try {
                a.apply(this, arguments);
            } catch (b) {
                LOG("Exception in event handler: " + String(b));
            }
            return false;
        };
    },
    now: function () {
        return (new Date()).getTime();
    },
    nowStr: function () {
        return String(new Date()).substr(16, 8);
    },
    typeOf: function (a) {
        if (a == null) {
            return "null";
        }
        if (a.nodeName) {
            if (a.nodeType == 1) {
                return "element";
            }
            if (a.nodeType == 3) {
                return /\S/.test(a.nodeValue) ? "textnode" : "whitespace";
            }
        } else {
            if (typeof a.length == "number") {
                if (a.callee) {
                    return "arguments";
                }
            }
        }
        return $.type(a);
    },
    asciify: function (a) {
        return a.replace(/[\u00E0-\u00E5]/g, "a").replace(/[\u00E8-\u00EB\u0112-\u011B]/g, "e").replace(/[\u00EC-\u00EF]/g, "i").replace(/[\u00F1\u0143-\u014B]/g, "n").replace(/[\u00F2-\u00F6\u00F8\u014C-\u0151]/g, "o").replace(/[\u00D9-\u00DC\u00F9-\u00FC]/, "u").replace(/[\u00DD\u00FD\u00FF]/, "y");
    },
    normalize: function (a) {
        return a.replace(/\0.*/, "");
    },
    stripComboDiacritics: function (a) {
        return a.replace(/[\u0300-\u036F\u0483-\u0489\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g, "");
    },
    cleanText: function (a) {
        return util.asciify(util.normalize(util.stripComboDiacritics(a)));
    },
    linkify: function (d) {
        var c = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        var b = d.replace(c, '<a href="$1" target="_blank">$1</a>');
        var a = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
        var b = b.replace(a, '<a href="mailto:$1">$1</a>');
        return b;
    },
    safeText: function (a) {
        return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    brText: function (a) {
        return a.replace(/\n/g, "<br>");
    },
    title: function (a) {
        return a.replace(/(^|\s)([a-z])/g, function (b, d, c) {
            return d + c.toUpperCase();
        });
    },
    setupPlaceholders: function (b) {
        if ($.browser.webkit) {
            return;
        }
        var a = $(b);
        var c = a.attr("placeholder");
        if (!c) {
            return;
        }
        a.addClass("placeholder");
        a.attr("value", c);
        a.focus(function (d) {
            if (a.val() == c) {
                a.removeClass("placeholder");
                a.attr("value", "");
            }
        });
        a.blur(function (d) {
            if ($.trim(a.val()) == "") {
                a.addClass("placeholder");
                a.attr("value", c);
            }
        });
    },
    CWzdUjBgak: function (b) {
        if (b) {
            for (var a in b) {
                if (typeof b[a] == "function") {
                    b[a].toString = function () {};
                }
            }
        }
    },
    prettyDate: function (e) {
        var d = [
            [120, "1 minute ago", "1 minute from now"],
            [3600, "minutes", 60],
            [7200, "1 hour ago", "1 hour from now"],
            [86400, "hours", 3600],
            [172800, "yesterday", "tomorrow"],
            [604800, "days", 86400],
            [1209600, "last week", "next week"],
            [2419200, "weeks", 604800],
            [4838400, "last month", "next month"],
            [29030400, "months", 2419200],
            [58060800, "last year", "next year"],
            [2903040000, "years", 29030400],
            [5806080000, "last century", "next century"],
            [58060800000, "centuries", 2903040000]
        ];
        var g = util.now() / 1000 - e;
        var b = "ago";
        var f = 1;
        if (g < 0) {
            g = -g;
            b = "from now";
            f = 2;
        }
        if (g < 60) {
            return "just now";
        }
        for (var a = 0; a < d.length; a++) {
            var c = d[a];
            if (g < c[0]) {
                if (typeof c[2] == "string") {
                    return c[f];
                } else {
                    return Math.floor(g / c[2]) + " " + c[1] + " " + b;
                }
            }
        }
        return e;
    },
    showOverlay: function (a) {
        $("#overlay").empty().css("height", $(document).height()).show().append(a);
        var b = ($(window).height() - $(".modal").outerHeight()) / 2;
        $(".modal").css("margin-top", Math.max(b, 10));
    },
    hideOverlay: function () {
        $("#overlay").empty().hide();
    },
    getSetting: function (a) {
        var b = $.cookie("setting_" + a);
        util.setSetting(a, b);
        return b;
    },
    setSetting: function (a, b) {
        $.cookie("setting_" + a, b, {
            path: "/",
            expires: 365
        });
    },
    prepApiData: function (b, a) {
        if (!a && typeof (turntable) !== "undefined") {
            a = turntable.user;
        }
        if (typeof (a) !== "undefined" && a.id && !b.userid) {
            b.userid = a.id;
            b.userauth = a.auth;
        }
        b.decache = new Date().valueOf();
        return b;
    },
    apiGet: function (d, a, c, b) {
        d = this.prepApiData(d, b);
        if (!c) {
            c = this;
        }
        var f = d.api;
        delete d.api;
        var e = JSON.stringify(d);
        LOG(util.nowStr() + " Preparing API GET for " + f + ": " + e);
        return $.getJSON("/api/" + f, d, $.proxy(function (g) {
            LOG("Received API GET: " + JSON.stringify(g));
            $.proxy(a, this)(g);
        }, c));
    },
    apiPost: function (d, a, c, b) {
        d = this.prepApiData(d, b);
        if (!c) {
            c = this;
        }
        var f = d.api;
        delete d.api;
        var e = JSON.stringify(d);
        LOG(util.nowStr() + " Preparing API POST for " + f + ": " + e);
        return $.post("/api/" + f, d, $.proxy(function (g) {
            LOG("Received API POST: " + JSON.stringify(g));
            $.proxy(a, this)(g);
        }, c), "json");
    }
};

function LOG(b) {
    if (window.DEBUG_MODE) {
        try {
            console.log(b);
        } catch (a) {}
    }
}
function ASSERT(a, c) {
    if (!a) {
        c = "Failed assert: " + c;
        if (DEBUG_MODE) {
            alert(c);
        } else {
            var b = {
                api: "room.log",
                error: c,
                clientid: turntable.clientId
            };
            if (turntable.user.id) {
                b.userid = turntable.user.id;
                b.userauth = turntable.user.auth;
            }
            turntable.socket.send(JSON.stringify(b));
        }
        throw c;
    }
}
var dmca = {
    showPreview: function (c) {
        var a = [1, 2, 3];
        for (var b = 0; b < a.length; ++b) {
            if (c.metadata.labelid == a[b]) {
                return false;
            }
        }
        if (!c.metadata.mnid) {
            return false;
        }
        return true;
    }
};
var CHATSERVER_ADDRS = [
    ["chat2.turntable.fm", 80],
    ["chat3.turntable.fm", 80], null];
CHATSERVER_ADDRS.pop();
var STATIC_HOST = "static.turntable.fm";
var MEDIA_HOST = window.location.host;
UI_SOUND_URL = "https://s3.amazonaws.com/static.turntable.fm/web/sounds/";
UI_SOUND_CHAT = UI_SOUND_URL + "chat.mp3";
UI_SOUND_ENDSONG = UI_SOUND_URL + "endsong.mp3";
var thost = window.location.host;
if (thost == "dev.turntable.fm") {
    CHATSERVER_ADDRS = [
        ["dev.turntable.fm", 7500]
    ];
    STATIC_HOST = "static-dev.turntable.fm";
} else {
    if (thost == "dev2.turntable.fm") {
        CHATSERVER_ADDRS = [
            ["dev2.turntable.fm", 7002]
        ];
        STATIC_HOST = "static-billy.turntable.fm";
    } else {
        if (thost == "dev3.turntable.fm") {
            CHATSERVER_ADDRS = [
                ["dev3.turntable.fm", 7003]
            ];
            STATIC_HOST = "static-atomly.turntable.fm";
        } else {
            if (thost == "dev4.turntable.fm") {
                CHATSERVER_ADDRS = [
                    ["dev4.turntable.fm", 7004]
                ];
                STATIC_HOST = "static-yang.turntable.fm";
            } else {
                if (thost == "dev5.turntable.fm") {
                    CHATSERVER_ADDRS = [
                        ["dev5.turntable.fm", 7005]
                    ];
                    STATIC_HOST = "static-dan.turntable.fm";
                } else {
                    if (thost == "dev6.turntable.fm") {
                        CHATSERVER_ADDRS = [
                            ["dev6.turntable.fm", 7006]
                        ];
                        STATIC_HOST = "static-jonathan.turntable.fm";
                    } else {
                        if (thost == "dev8.turntable.fm") {
                            MEDIA_HOST = "turntable.fm";
                        }
                    }
                }
            }
        }
    }
}
DEBUG_MODE = (thost != "turntable.fm" || $.sha1(location.hash) == "47381f2767629f64daa0d70c79d91baaeb702835");
DEMO_MODE = (location.pathname != "/lobby" && $.sha1(location.hash) == "1309dbac26cf64a7f1671c206230a3bf31229006");
WEB_SOCKET_SWF_LOCATION = "/static/web-socket-js/WebSocketMain.swf";
soundManager.url = "/static/soundmanager2/swf/";
soundManager.audioFormats.mp4.required = false;
soundManager.consoleOnly = true;
soundManager.debugMode = false;
soundManager.debugFlash = false;
soundManager.flashVersion = 9;
soundManager.useFavIcon = false;
soundManager.useFlashBlock = true;
soundManager.useMovieStar = false;
if ($.browser.msie) {
    alert("Turntable.fm doesn't work too well in Internet Explorer right now.  Please use Firefox, Chrome or Safari web browsers.");
}
var turntable = {
    EPWNro: null,
    pendingCalls: [],
    deferreds: [],
    clientId: util.now() + "-" + Math.random(),
    clientTimeDelta: 0,
    eventListeners: {
        auth: [],
        avatarchange: [],
        message: [],
        messagefinish: [],
        reconnect: [],
        trackstart: [],
        trackfinish: [],
        unidle: [],
        userinfo: []
    },
    socket: null,
    socketVerbose: true,
    socketErrors: [],
    messageId: 0,
    currentSocketPort: 0,
    currentSocketServer: null,
    favorites: false,
    syncServerClock: function () {
        turntable.updatePresence();
    },
    main: function () {
        turntable.loadTime = util.now();
        var a = window.TURNTABLE_ROOMID || String(Math.random());
        turntable.setSocketAddr(turntable.getHashedAddr(a));
        LOG("Initializing Facebook...");
        FB.init({
            appId: "127146244018710",
            status: true,
            cookie: false,
            xfbml: true
        });
        turntable.user.init().done(function () {
            turntable.initFavorites();
            turntable.syncServerClock();
            turntable.playlist.init();
            $(window).bind("keydown", function (b) {
                if (b.keyCode == 8 && $.inArray(b.target.tagName.toLowerCase(), ["input", "textarea"]) == -1) {
                    b.preventDefault();
                }
            });
            if (window.history && window.history.pushState) {
                $(window).bind("popstate", function (b) {
                    if (util.now() - turntable.loadTime < 10 * 1000) {
                        return;
                    }
                    turntable.reloadPage(b.state || b.originalEvent.state || {
                        roomid: TURNTABLE_ROOMID
                    });
                });
            }
            turntable.reloadPage({
                roomid: TURNTABLE_ROOMID
            });
            turntable.initIdleChecker();
            turntable.trackPresence();
            turntable.initBuddyPresencePolling();
        });
        util.CWzdUjBgak(turntable);
        util.CWzdUjBgak(turntable.user);
    },
    socketsByPort: {},
    flushUnsentMessages: function () {
        for (var a = 0; a < turntable.unsentMessageCallbacks.length; a++) {
            turntable.unsentMessageCallbacks[a]();
        }
        turntable.unsentMessageCallbacks = [];
    },
    setSocketAddr: function (a) {
        LOG("Setting socket addr to " + a);
        if (a[0] == turntable.currentSocketServer && a[1] == turntable.currentSocketPort) {
            return;
        }
        turntable.socketKeepAlive(false);
        turntable.currentSocketServer = a[0];
        turntable.currentSocketPort = a[1];
        var b = function () {
                turntable.removeEventListener("messagefinish", b);
                if (turntable.socket) {
                    LOG("Disconnecting " + turntable.socket.host);
                    turntable.socket.removeListener("reconnect", turntable.socketReconnected);
                    turntable.socket.send("disconnect");
                    var c = turntable.socket;
                    setTimeout(function () {
                        c.disconnect();
                    }, 1000);
                }
                LOG("Switching to addr " + a);
                turntable.socket = new io.Socket(a[0], {
                    port: a[1],
                    transports: ["websocket", "flashsocket", "xhr-polling"],
                    rememberTransport: false,
                    connectTimeout: 5000
                });
                if (turntable.socket.transport.type == "websocket") {
                    turntable.socket.transport.options.timeout = 25000;
                }
                turntable.connectionTimeout = setTimeout(function () {
                    turntable.die("Could not connect to turntable. Please try again. If you still cannot connect, you might have a firewall blocking your connection. (" + a[1] + ")");
                    turntable.connectionTimeout = null;
                }, 30000);
                turntable.socket.connect();
                turntable.socket.on("connect", turntable.socketConnected);
                turntable.socket.on("message", turntable.messageReceived);
                turntable.socket.on("reconnect", turntable.socketReconnected);
            };
        if (turntable.socket && turntable.socket.connected && turntable.numRecentPendingCalls(15) > 0) {
            turntable.addEventListener("messagefinish", b);
            LOG("There are " + turntable.pendingCalls.length + " pending calls on old socket! Waiting...");
        } else {
            LOG("No pending calls on old socket... setting up new socket");
            b();
        }
    },
    socketConnected: function () {
        if (turntable.connectionTimeout) {
            clearTimeout(turntable.connectionTimeout);
            turntable.connectionTimeout = null;
        }
        turntable.resetPresenceThrottle();
        turntable.syncServerClock();
        turntable.flushUnsentMessages();
        turntable.socket.removeListener("connect", turntable.socketConnected);
    },
    socketKeepAlive: function (a) {
        if (turntable.socketKeepAliveTimer) {
            clearTimeout(turntable.socketKeepAliveTimer);
            turntable.socketKeepAliveTimer = null;
        }
        if (a) {
            turntable.socketKeepAliveTimer = setTimeout(turntable.syncServerClock, 20000);
        }
    },
    socketLog: function (a) {
        while (turntable.socketErrors.length && turntable.socketErrors[0].time + 60000 < util.now()) {
            turntable.socketErrors.shift();
        }
        turntable.socketErrors.push({
            time: util.now(),
            msg: a
        });
    },
    socketDumpLog: function () {
        while (turntable.socketErrors.length && turntable.socketErrors[0].time + 60000 < util.now()) {
            turntable.socketErrors.shift();
        }
        if (util.now() < turntable.socketDumpLogLast + 60000) {
            return;
        }
        turntable.socketDumpLogLast = util.now();
        if (turntable.socketErrors.length) {
            var c = "";
            for (var a = 0; a < turntable.socketErrors.length; a++) {
                var b = turntable.socketErrors[a];
                c += Math.round((util.now() - b.time) / 100) / 10 + ":" + b.msg + ",";
            }
            turntable.logMessage(c);
        }
    },
    isIdle: false,
    initIdleChecker: function () {
        $(window).bind("focus keydown mousemove", function () {
            turntable.lastMotionTime = util.now();
        });
        setTimeout(turntable.checkIdle, 1000);
        turntable.lastMotionTime = util.now();
    },
    idleTime: function () {
        return util.now() - turntable.lastMotionTime;
    },
    checkIdle: function () {
        var a = turntable.idleTime();
        var c = (a > 30 * 1000);
        if (!turntable.isIdle && c) {
            for (var d in turntable.idleTimers) {
                var b = turntable.idleTimers[d];
                b.timeout = setTimeout(b.callback, Number(d) * 1000 - a);
            }
        } else {
            if (turntable.isIdle && !c) {
                for (var d in turntable.idleTimers) {
                    clearTimeout(turntable.idleTimers[d].timeout);
                }
                turntable.dispatchEvent("unidle");
            }
        }
        turntable.isIdle = c;
        setTimeout(turntable.checkIdle, 1000);
    },
    currentStatus: function () {
        return turntable.isIdle ? "away" : "available";
    },
    presenceTimer: null,
    trackPresence: function () {
        if (turntable.presenceTimer) {
            return;
        }
        turntable.presenceTimer = setInterval(turntable.updatePresence, 10000);
    },
    updatePresence: function (a) {
        turntable.sendPresence(turntable.currentStatus(), a);
    },
    resetPresenceThrottle: function () {
        turntable.syncServerClockLast = 0;
    },
    sendPresence: function (b, c) {
        if (util.now() < turntable.syncServerClockLast + 10000) {
            return;
        }
        turntable.syncServerClockLast = util.now();
        var a = util.now();
        turntable.HRqMW({
            api: "presence.update",
            status: b
        }, function (e) {
            var d = util.now();
            turntable.clientTimeDelta = (d + a) / 2000 - e.now;
            if (c && typeof (c) == "function") {
                c(e);
            }
        });
    },
    buddyPresenceTimer: null,
    initBuddyPresencePolling: function () {
        if (buddyPresenceTimer) {
            return;
        }
        buddyPresenceTimer = setInterval(turntable.fetchBuddyPresence, 60000);
    },
    fetchBuddyPresence: function () {
        turntable.HRqMW({
            api: "presence.buddies"
        }, function (a) {
            LOG(a);
        });
    },
    pingTimer: null,
    numPings: 0,
    socketReconnected: function () {
        turntable.socketLog("rc");
        LOG("socket reconnected?");
        if (turntable.pingTimer) {
            return;
        }
        turntable.numPings = 0;
        turntable.pingTimer = setInterval(turntable.pingSocket, 5000);
        turntable.pingSocket();
    },
    pingSocket: function () {
        turntable.resetPresenceThrottle();
        turntable.updatePresence(function (a) {
            if (a && a.success && turntable.pingTimer) {
                turntable.numPings = 0;
                clearInterval(turntable.pingTimer);
                turntable.pingTimer = null;
                turntable.dispatchEvent("reconnect");
            }
        });
        turntable.numPings += 1;
        if (turntable.numPings > 5) {
            clearInterval(turntable.pingTimer);
            turntable.pingTimer = null;
        }
    },
    closeSocket: function () {
        turntable.socket.send('{"api":"room.deregister","userid":"' + turntable.user.id + '","userauth":"' + turntable.user.auth + '","roomid":"' + (turntable.EPWNro.roomId || "") + '"}');
    },
    addEventListener: function (b, c) {
        var a = turntable.eventListeners[b];
        ASSERT(a, "Unknown event '" + b + "'");
        if ($.inArray(c, a) == -1) {
            a.push(c);
        }
    },
    removeEventListener: function (c, d) {
        var b = turntable.eventListeners[c];
        ASSERT(b, "Unknown event " + c);
        var a = $.inArray(d, b);
        if (a != -1) {
            b.splice(a, 1);
        }
    },
    dispatchEvent: function (c) {
        args = [];
        for (var a = 1; a < arguments.length; a++) {
            args.push(arguments[a]);
        }
        var b = turntable.eventListeners[c];
        ASSERT(b, "Unknown event " + c);
        b = b.slice();
        for (var a = 0; a < b.length; a++) {
            b[a].apply(turntable, args);
        }
    },
    idleTimers: {},
    addIdleListener: function (a, c) {
        var b = turntable.idleTimers[String(a)];
        var d = a * 1000 - turntable.idleTime();
        if (!b) {
            b = {
                timeout: null,
                listeners: [c],
                callback: function () {
                    for (var e = 0; e < b.listeners.length; e++) {
                        b.listeners[e]();
                    }
                }
            };
            turntable.idleTimers[String(a)] = b;
            if (turntable.isIdle) {
                b.timeout = setTimeout(b.callback, d);
            }
        } else {
            if ($.inArray(c, b.listeners) == -1) {
                b.listeners.push(c);
                if (d <= 0) {
                    c();
                }
            }
        }
    },
    removeIdleListener: function (a, d) {
        var b = turntable.idleTimers[String(a)];
        var c = (b ? $.inArray(d, b.listeners) : -1);
        if (c != -1) {
            b.listeners.splice(c, 1);
        }
    },
    setPage: function (a, b) {
        var c = "/" + (a || b);
        if (window.history && window.history.pushState) {
            var d = {
                shortcut: a,
                roomid: b
            };
            window.history.pushState(d, c, c);
            this.reloadPage(d);
        } else {
            window.location.href = c;
        }
    },
    reloadPage: function (a) {
        if (turntable.EPWNro && turntable.EPWNro.cleanup) {
            turntable.EPWNro.cleanup();
        }
        $("#turntable").empty();
        LOG("Turntable page is empty");
        if (a && a.shortcut != "lobby" && a.roomid) {
            turntable.EPWNro = new Room(a.roomid);
        } else {
            welcome.init();
            turntable.EPWNro = welcome;
        }
        $("#turntable").append(turntable.EPWNro.view);
        if (turntable.EPWNro.onAddedToStage) {
            turntable.EPWNro.onAddedToStage();
        }
    },
    initFavorites: function () {
        turntable.HRqMW({
            api: "room.get_favorites"
        }, function (c) {
            if (c.success) {
                turntable.favorites = {};
                for (var b = 0, a = c.list.length; b < a; b++) {
                    turntable.favorites[c.list[b]] = true;
                }
                if (turntable.EPWNro && "roomId" in turntable.EPWNro && !turntable.EPWNro.hasLoadedFavorites) {
                    turntable.EPWNro.initFavorite();
                }
            }
        });
    },
    hashMod: function (e, b) {
        var d = $.sha1(e);
        var c = 0;
        for (var a = 0; a < d.length; a++) {
            c += d.charCodeAt(a);
        }
        return c % b;
    },
    getHashedAddr: function (a) {
        return CHATSERVER_ADDRS[turntable.hashMod(a, CHATSERVER_ADDRS.length)];
    },
    HRqMW: function (c, a) {
        if (c.api == "room.now") {
            return;
        }
        c.msgid = turntable.messageId;
        turntable.messageId += 1;
        c.clientid = turntable.clientId;
        if (turntable.user.id && !c.userid) {
            c.userid = turntable.user.id;
            c.userauth = turntable.user.auth;
        }
        var d = JSON.stringify(c);
        if (turntable.socketVerbose) {
            LOG(util.nowStr() + " Preparing message " + d);
        }
        var b = $.Deferred();
        turntable.whenSocketConnected(function () {
            if (turntable.socketVerbose) {
                LOG(util.nowStr() + " Sending message " + c.msgid + " to " + turntable.socket.host);
            }
            if (turntable.socket.transport.type == "websocket") {
                turntable.socketLog(turntable.socket.transport.sockets[0].id + ":<" + c.msgid);
            }
            turntable.socket.send(d);
            turntable.socketKeepAlive(true);
            turntable.pendingCalls.push({
                msgid: c.msgid,
                handler: a,
                deferred: b,
                time: util.now()
            });
        });
        return b.promise();
    },
    numRecentPendingCalls: function (a) {
        var c = util.now();
        var b = 0;
        for (var d = 0; d < turntable.pendingCalls.length; d++) {
            if (c - turntable.pendingCalls[d].time < a * 1000) {
                b += 1;
            }
        }
        return b;
    },
    unsentMessageCallbacks: [],
    whenSocketConnected: function (a) {
        if (turntable.socket.connected && turntable.socket.host == turntable.currentSocketServer && turntable.socket.options.port == turntable.currentSocketPort) {
            a();
        } else {
            turntable.unsentMessageCallbacks.push(a);
        }
    },
    messageReceived: function (d) {
        try {
            if (turntable.socketVerbose) {
                LOG(util.nowStr() + " Received: " + d);
            }
            if (d == "no_session") {
                return;
            } else {
                d = JSON.parse(d);
            }
            if (d.command == "killdashnine") {
                turntable.socket.disconnect();
                var b = d.msg || "This session has been disconnected because you signed on from another location. Refresh this page if you want to continue.";
                turntable.die(b);
                return;
            }
            turntable.dispatchEvent("message", d);
            if (turntable.socket.transport.type == "websocket") {
                turntable.socketLog(turntable.socket.transport.sockets[0].id + ":>" + (d.hasOwnProperty("msgid") ? d.msgid : (d.command || "?")));
            }
            if (d.hasOwnProperty("msgid")) {
                ASSERT(d.msgid < turntable.messageId, "Future msg " + JSON.stringify(d));
                var g = turntable.pendingCalls.length;
                var f = false;
                for (var e = 0; e < g; e++) {
                    var j = turntable.pendingCalls[e];
                    if (j.msgid == d.msgid) {
                        var h = j.handler;
                        var k = j.deferred;
                        if (h) {
                            h(d);
                        }(d.success ? k.resolve : k.reject)(d);
                        var a = util.now();
                        if (a - turntable.loadTime > 60 * 1000 && a - j.time > 10 * 1000) {
                            turntable.socketDumpLog();
                        }
                        turntable.pendingCalls.splice(e, 1);
                        f = true;
                        break;
                    }
                }
                if (!f) {
                    LOG("Unexpected msg " + JSON.stringify(d));
                } else {
                    if (turntable.pendingCalls.length == 0) {
                        turntable.dispatchEvent("messagefinish");
                    }
                }
            }
        } catch (c) {
            LOG("Exception in MessageReceived");
            LOG(c);
        }
    },
    logMessage: function (c) {
        if (turntable.pendingLogMessage) {
            turntable.pendingLogMessage = c;
            return;
        }
        var a = (turntable.lastLogPacket || 0) + 5000 - util.now();
        if (a <= 0) {
            var b = navigator.userAgent.substr(navigator.userAgent.lastIndexOf(")") + 2);
            turntable.HRqMW({
                api: "room.log",
                error: "v3 " + b + " " + c
            });
            turntable.lastLogPacket = util.now();
            return;
        }
        turntable.pendingLogMessage = c;
        setTimeout(function () {
            turntable.HRqMW({
                api: "room.log",
                error: turntable.pendingLogMessage
            });
            turntable.pendingLogMessage = null;
            turntable.lastLogPacket = util.now();
        }, a);
    },
    randomRoom: function () {
        turntable.HRqMW({
            api: "room.random_room"
        }, function (a) {
            turntable.setPage(a.room.shortcut, a.room.roomid);
        });
    },
    showWelcome: function () {
        var a = $.cookie("turntableShowWelcome");
        if (!a) {
            var b = util.buildTree(["div.modal.welcome-modal",
            {}, "Hi there and welcome to Turntable! Before you begin, here's how it works:", ["ul",
            {}, ["li", "Become a DJ to play songs for everyone in the room."],
                ["li", "Each DJ plays one song each turn."],
                ["li", 'Everyone can vote on the song. Too many "Lame" votes and the song is skipped.'],
                ["li", 'Vote "Awesome" during songs you like to reward the DJ with points.']
            ],
                ["div.ok-button.centered-button",
                {
                    event: {
                        click: util.hideOverlay
                    }
                }]
            ]);
            util.showOverlay($(b));
        }
        $.cookie("turntableShowWelcome", true, {
            path: "/",
            expires: 365
        });
    },
    die: function (a) {
        turntable.showAlert(a);
        $(".overlay .ok-button").hide();
    },
    showAlert: function (a, c) {
        var b = util.buildTree(["div.modal",
        {}, ["div",
        {},
        a, ["br"],
            ["br"]
        ],
            ["div.ok-button.centered-button",
            {
                event: {
                    click: util.hideOverlay
                }
            }]
        ]);
        if (c) {
            $(b).find(".ok-button").click(c);
        }
        util.showOverlay(b);
    },
    serverNow: function () {
        return util.now() / 1000 - turntable.clientTimeDelta;
    },
    seedPRNG: function (a) {
        return function () {
            var c = a;
            var b = 9001;
            return {
                random: function () {
                    if (b + 4 > c.length) {
                        c = $.sha1(c);
                        b = 0;
                    }
                    var d = c.substr(b, 4);
                    b += 4;
                    return (parseInt(d, 16) + 1) / 65537;
                }
            };
        }();
    }
};
var TrackStream = Class.extend({
    init: function (a, b, c) {
        this.fileId = a;
        this.soundId = "s" + String(Math.random()).substr(2, 9) + "_" + a;
        this.url = b;
        this.startTime = c;
        this.started = false;
        turntablePlayer.initDeferred.done($.proxy(this.loadUrl, this));
    },
    loadUrl: function () {
        if (!this.url) {
            return;
        }
        this.sound = soundManager.createSound({
            id: this.soundId,
            url: this.url
        });
        this.sound.setVolume(turntablePlayer.realVolume(turntablePlayer.previewSound ? 0 : turntablePlayer.volume));
        this.sound.load();
        this.synchronize();
    },
    synchronize: function (a) {
        if (!a) {
            a = 0;
        }
        this.syncTimer = setTimeout($.proxy(this.attemptSync, this), a);
    },
    attemptSync: function () {
        this.syncTimer = null;
        if (this.sound.position) {
            LOG("WARNING: attemptSync: position is " + this.sound.position);
            return;
        }
        var b = Number(this.sound.duration) / 1000;
        var a = util.now() / 1000 - this.startTime;
        if (a < -0.1) {
            this.synchronize(200);
        } else {
            if (a + 1 < b) {
                if (a < 1) {
                    a = 0;
                } else {
                    this.sound.setPosition(Math.round(a * 1000));
                    if (!this.started) {
                        this.sound.setVolume(turntablePlayer.realVolume(0));
                        turntablePlayer.fade(this.sound, turntablePlayer.volume, 0.5);
                    } else {
                        this.sound.setVolume(turntablePlayer.realVolume(turntablePlayer.volume));
                    }
                }
                this.sound.play();
                this.started = true;
            } else {
                if (this.sound.loaded) {
                    turntable.dispatchEvent("trackfinish", this);
                } else {
                    this.synchronize(200);
                }
            }
        }
    },
    onstart: function () {
        turntable.dispatchEvent("trackstart", this);
    },
    onfinish: function () {
        var c = this.sound.bytesLoaded / this.sound.bytesTotal;
        var d = this.sound[this.sound.loaded ? "duration" : "durationEstimate"] / 1000;
        var a = util.now() / 1000 - this.startTime;
        if (c > 0.5 && a + 20 > d) {
            turntable.dispatchEvent("trackfinish", this);
        } else {
            this.sound.setPosition(0);
            this.synchronize();
            var b = this;
            setTimeout(function () {
                var e = "ERROR: played " + a + " / " + d + " sec, ";
                e += (b.url && b.sound && b.sound.playState ? "RECOVERED" : "FATAL");
                turntable.logMessage(e);
            }, 1000);
        }
    },
    destroy: function () {
        this.url = null;
        if (this.sound) {
            if (this.sound.playState) {
                turntablePlayer.fade(this.sound, 0, 0.5).done(function (a) {
                    a.destruct();
                });
            } else {
                this.sound.destruct();
            }
            this.sound = null;
        }
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
            this.syncTimer = null;
        }
    }
});
var turntablePlayer = {
    initDeferred: $.Deferred(),
    tracks: [],
    currentFileId: null,
    volume: 3,
    ephemeralCache: {},
    dmcaMuted: false,
    retryLoadTimer: null,
    retryPenalty: 0,
    retryFailAlertTimer: null,
    init: function () {
        soundManager.defaultOptions.onplay = turntablePlayer.soundStarted;
        soundManager.defaultOptions.onfinish = turntablePlayer.soundFinished;
        turntablePlayer.initDeferred.resolve();
    },
    playSong: function (c, a, b) {
        turntablePlayer.stop();
        turntablePlayer.dmcaMuted = false;
        turntablePlayer.currentFileId = a;
        turntablePlayer.loadSong(c, a, b);
    },
    loadSong: function (f, b, e) {
        turntablePlayer.retryLoadTimer = null;
        if (turntablePlayer.retryPenalty >= 10) {
            if (!turntablePlayer.retryFailAlertTimer) {
                turntablePlayer.retryFailAlertTimer = setTimeout(turntablePlayer.showRetryFail, 5000);
            }
            return;
        }
        for (var d = 0; d < turntablePlayer.tracks.length; d++) {
            var a = turntablePlayer.tracks[d];
            if (a.sound && a.sound.bytesLoaded > 0) {
                return;
            }
        }
        turntablePlayer.retryPenalty += 1;
        var c = window.location.protocol + "//" + MEDIA_HOST + "/getfile/?roomid=" + f + "&rand=" + Math.random() + "&fileid=" + b + "&downloadKey=" + $.sha1(b + f) + "&userid=" + turntable.user.id + "&client=web";
        turntablePlayer.tracks.push(new TrackStream(b, c, e));
        if (turntablePlayer.tracks.length < 3) {
            turntablePlayer.retryLoadTimer = setTimeout(function () {
                if (!turntablePlayer.retryLoadTimer && b != turntablePlayer.currentFileId) {
                    return;
                }
                turntablePlayer.loadSong(f, b, e);
            }, 5000);
        }
    },
    stop: function () {
        for (var a = 0; a < turntablePlayer.tracks.length; a++) {
            turntablePlayer.tracks[a].destroy();
        }
        turntablePlayer.tracks = [];
        turntablePlayer.currentFileId = null;
        if (turntablePlayer.retryLoadTimer) {
            clearTimeout(turntablePlayer.retryLoadTimer);
            turntablePlayer.retryLoadTimer = null;
        }
        if (turntablePlayer.retryFailAlertTimer) {
            clearTimeout(turntablePlayer.retryFailAlertTimer);
            turntablePlayer.retryFailAlertTimer = null;
        }
    },
    showRetryFail: function () {
        turntablePlayer.retryFailAlertTimer = null;
        if (turntablePlayer.retryPenalty < 10 || turntablePlayer.tracks.length == 0 || (turntablePlayer.tracks[0].sound && turntablePlayer.tracks[0].sound.playState)) {
            return;
        }
        turntable.showAlert("The music doesn't seem to be loading. Please try refreshing the page.");
    },
    soundStarted: function () {
        var a;
        for (var b = 0; b < turntablePlayer.tracks.length; b++) {
            a = turntablePlayer.tracks[b];
            if (a.sound == this) {
                turntablePlayer.tracks.splice(b, 1);
                if (a.fileId == turntablePlayer.currentFileId) {
                    break;
                }
                a.destroy();
            }
            a = null;
        }
        if (a == null) {
            return;
        }
        if (turntablePlayer.retryLoadTimer) {
            clearTimeout(turntablePlayer.retryLoadTimer);
            turntablePlayer.retryLoadTimer = null;
        }
        if (turntablePlayer.retryFailAlertTimer) {
            clearTimeout(turntablePlayer.retryFailAlertTimer);
            turntablePlayer.retryFailAlertTimer = null;
        }
        turntablePlayer.retryPenalty = Math.max(0.9 * (turntablePlayer.retryPenalty - 1), 0);
        a.onstart();
        for (var b = 0; b < turntablePlayer.tracks.length; b++) {
            turntablePlayer.tracks[b].destroy();
        }
        turntablePlayer.tracks = [a];
    },
    soundFinished: function () {
        for (var a = 0; a < turntablePlayer.tracks.length; a++) {
            if (turntablePlayer.tracks[a].sound == this) {
                turntablePlayer.tracks[a].onfinish();
            }
        }
    },
    setDmcaMute: function (c) {
        turntablePlayer.dmcaMuted = c;
        var a = turntablePlayer.realVolume(turntablePlayer.calculatedBarsVolume());
        for (var b = 0; b < turntablePlayer.tracks.length; b++) {
            turntablePlayer.tracks[b].sound.setVolume(a);
        }
    },
    setVolume: function (b) {
        turntablePlayer.volume = b;
        var a = turntablePlayer.realVolume(turntablePlayer.calculatedBarsVolume());
        for (var c = 0; c < turntablePlayer.tracks.length; c++) {
            turntablePlayer.tracks[c].sound.setVolume(a);
        }
        if (turntablePlayer.previewSound && b) {
            turntablePlayer.previewSound.setVolume(turntablePlayer.realVolume(b));
        }
        if (b > 0) {
            util.setSetting("volume", b);
        }
    },
    realVolume: function (a) {
        return (a > 0 ? 100 * Math.pow(2, a - 4) : 0);
    },
    barsVolume: function (a) {
        return (a > 0 ? Math.max(0, Math.log(a / 100) / Math.LN2 + 4) : 0);
    },
    calculatedBarsVolume: function () {
        if (turntablePlayer.previewSound || turntablePlayer.dmcaMuted) {
            return 0;
        }
        return turntablePlayer.volume;
    },
    samplePlay: function (a, b) {
        if (turntablePlayer.previewTimer) {
            clearTimeout(turntablePlayer.previewTimer);
            clearInterval(turntablePlayer.previewProgressTimer);
            turntablePlayer.previewCallback("stop");
        }
        turntablePlayer.previewTimer = setTimeout(turntablePlayer.sampleStop, 30000);
        turntablePlayer.previewProgressTimer = setInterval(turntablePlayer.sampleUpdateProgress, 100);
        turntablePlayer.initDeferred.done(function () {
            for (var d = 0; d < turntablePlayer.tracks.length; d++) {
                turntablePlayer.fade(turntablePlayer.tracks[d].sound, 0);
            }
            if (turntablePlayer.previewSound) {
                turntablePlayer.fade(turntablePlayer.previewSound, 0).done(function (f) {
                    f.destruct();
                });
            }
            var c = window.location.protocol + "//" + MEDIA_HOST + "/previewfile/?fileid=" + a;
            turntablePlayer.previewSound = soundManager.createSound({
                id: "preview" + a,
                url: c
            });
            turntablePlayer.previewSound.play();
            var e = turntablePlayer.realVolume(turntablePlayer.volume || 3);
            turntablePlayer.previewSound.setVolume(e);
        });
        turntablePlayer.previewCallback = b;
    },
    sampleUpdateProgress: function () {
        try {
            var a = (Number(turntablePlayer.previewSound.position) / 27000 * 100) + "%";
            turntablePlayer.previewCallback("progress", a);
        } catch (b) {}
    },
    sampleStop: function () {
        if (turntablePlayer.previewTimer) {
            clearTimeout(turntablePlayer.previewTimer);
            clearInterval(turntablePlayer.previewProgressTimer);
            turntablePlayer.previewTimer = null;
            turntablePlayer.previewProgressTimer = null;
            if (turntablePlayer.previewSound) {
                turntablePlayer.fade(turntablePlayer.previewSound, 0).done(function (b) {
                    b.destruct();
                });
                turntablePlayer.previewSound = null;
            }
            for (var a = 0; a < turntablePlayer.tracks.length; a++) {
                turntablePlayer.fade(turntablePlayer.tracks[a].sound, turntablePlayer.calculatedBarsVolume());
            }
        }
        if (turntablePlayer.previewCallback) {
            turntablePlayer.previewCallback("stop");
            turntablePlayer.previewCallback = null;
        }
    },
    fade: function (g, a, f) {
        var b = $.Deferred();
        if (!f || typeof f != "number") {
            f = 1.5;
        }
        var e = turntablePlayer.barsVolume(g.volume);
        var d = a - e;
        var c = util.now();
        var h = setInterval(function () {
            var i = (util.now() - c) / (1000 * f);
            if (i < 1) {
                g.setVolume(turntablePlayer.realVolume(e + i * d));
            } else {
                g.setVolume(turntablePlayer.realVolume(a));
                clearInterval(h);
                b.resolve(g);
            }
        }, 100);
        return b.promise();
    },
    playEphemeral: function (b, a) {
        turntablePlayer.initDeferred.done(function () {
            turntablePlayer.loadEphemeralUrl(b, a);
        });
    },
    loadEphemeralUrl: function (b, a) {
        var d = null;
        if (a) {
            d = turntablePlayer.ephemeralCache[b];
        }
        if (d) {
            if (d.playState) {
                d.setPosition(0);
                return;
            }
        } else {
            var c = {
                id: "ephemeral" + util.now(),
                url: b
            };
            if (!a) {
                c.onfinish = function () {
                    this.destruct();
                };
            }
            d = soundManager.createSound(c);
            if (a) {
                turntablePlayer.ephemeralCache[b] = d;
            }
        }
        d.setVolume(turntablePlayer.realVolume(turntablePlayer.volume));
        d.play();
    }
};
$(document).ready(turntable.main);
soundManager.onready(turntablePlayer.init);
$(window).bind("beforeunload", turntable.closeSocket);
turntable.user = {
    djPoints: 0,
    acl: 0,
    fanOf: [],
    init: function () {
        var a = turntable.user.initAuth();
        a.done(turntable.user.updateDom, turntable.user.getUserInfo);
        return a;
    },
    initAuth: function () {
        LOG("Initializing user account...");
        var a = $.Deferred();
        turntable.user.id = $.cookie("turntableUserId");
        turntable.user.auth = $.cookie("turntableUserAuth");
        turntable.user.named = ($.cookie("turntableUserNamed") != "false");
        if (!turntable.user.id) {
            turntable.user.createGuest().done(a.resolve);
        } else {
            LOG("Authenticating user...");
            turntable.HRqMW({
                api: "user.authenticate"
            }, function (b) {
                if (b.success) {
                    a.resolve();
                } else {
                    turntable.user.createGuest().done(a.resolve);
                }
            });
        }
        return a.promise();
    },
    persistAuth: function (b, c, a) {
        $.cookie("turntableUserId", turntable.user.id = b, {
            path: "/",
            expires: 365
        });
        $.cookie("turntableUserAuth", turntable.user.auth = c, {
            path: "/",
            expires: 365
        });
        $.cookie("turntableUserNamed", String(turntable.user.named = a), {
            path: "/",
            expires: 365
        });
        turntable.dispatchEvent("auth");
    },
    createGuest: function () {
        LOG("Creating guest account...");
        var a = $.Deferred();
        turntable.HRqMW({
            api: "user.create"
        }, function (b) {
            turntable.user.persistAuth(b.userid, b.userauth, false);
            a.resolve();
        });
        return a.promise();
    },
    showFBLogin: function () {
        FB.login(turntable.user.fbDidLogin, {
            perms: "offline_access,email,user_about_me,user_birthday"
        });
    },
    fbDidLogin: function (a) {
        if (a.session && a.perms) {
            turntable.HRqMW({
                api: "user.facebook_login",
                fbtoken: a.session.access_token
            }, function (b) {
                if (b.success) {
                    turntable.user.persistAuth(b.userid, b.userauth, true);
                    turntable.user.updateDom();
                    turntable.user.getUserInfo();
                }
            });
        }
    },
    login: function (b, a) {
        turntable.HRqMW({
            api: "user.login",
            email: b,
            password: a
        }, function (c) {
            if (c.success) {
                turntable.user.persistAuth(c.userid, c.userauth, true);
                turntable.user.updateDom();
                turntable.user.getUserInfo();
            } else {
                alert(c.err);
            }
        });
    },
    signUp: function (a, c, b) {
        turntable.HRqMW({
            api: "user.create",
            name: a,
            email: c,
            password: b
        }, function (d) {
            if (d.success) {
                turntable.user.setDisplayName(a);
                turntable.user.persistAuth(d.userid, d.userauth, true);
                turntable.user.updateDom();
            }
        });
    },
    elements: {},
    view: null,
    updateDom: function () {
        turntable.user.elements = {};
        turntable.user.view = util.buildTree(turntable.user.layouts[turntable.user.named ? "signedIn" : "guest"], turntable.user.elements);
        $("#userauth").empty().append(turntable.user.view);
    },
    loginSubmit: function () {
        turntable.user.login(turntable.user.elements.loginEmail.value, turntable.user.elements.loginPasswd.value);
    },
    signUpSubmit: function () {
        var b = $.trim($("#userSignUpName")[0].value);
        var a = $.trim($("#userSignUpEmail")[0].value);
        var d = $("#userSignUpPasswd")[0].value;
        var c = $("#userSignUpPasswd2")[0].value;
        if (d != c) {
            alert("passwords do not match");
            return;
        }
        turntable.user.signUp(b, a, d);
    },
    getUserInfo: function () {
        turntable.HRqMW({
            api: "user.info"
        }, function (b) {
            turntable.user.setDisplayName(b.name);
            turntable.user.djPoints = b.points;
            turntable.user.avatarId = b.avatarid;
            turntable.user.acl = b.acl;
            turntable.HRqMW({
                api: "user.get_fan_of"
            }, function (c) {
                turntable.user.fanOf = c.fanof;
                turntable.dispatchEvent("userinfo");
            });
        });
        turntable.playlist.loadList();
        var a = "linux";
        if (navigator.userAgent.indexOf("Macintosh") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPad") != -1) {
            a = "mac";
        } else {
            if (navigator.userAgent.indexOf("Windows") != -1) {
                a = "pc";
            } else {
                if (navigator.userAgent.indexOf("CrOS") != -1) {
                    a = "chrome";
                }
            }
        }
        setTimeout(function () {
            turntable.HRqMW({
                api: "user.modify",
                laptop: a
            });
        }, 2000);
    },
    setDisplayName: function (a) {
        turntable.user.displayName = a;
        $(".bindUserName").text(a);
    },
    avatarsShow: function () {
        var a = {};
        util.showOverlay(util.buildTree(turntable.user.layouts.avatarsView(), a));
        turntable.HRqMW({
            api: "user.available_avatars"
        }, function (b) {
            ASSERT(b.success, "Failed to get available avatars");
            turntable.user.avatarsShowTiers(a.tiers, b.avatars);
        });
    },
    avatarsShowTiers: function (d, k) {
        for (var f = 0; f < k.length; f++) {
            var g = k[f];
            if (g.min >= 50000) {
                continue;
            }
            if (g.acl) {
                var l = "Superusers";
            } else {
                var l = g.min + (f + 2 < k.length ? "-" + (k[f + 1].min - 1) : "+") + " Points";
            }
            var h = util.buildTree(turntable.user.layouts.avatarTier(l));
            var a = $(h).find(".avatarList");
            var c = (turntable.user.djPoints >= g.min) && (turntable.user.acl >= (g.acl || 0));
            for (var e = 0; e < g.avatarids.length; e++) {
                var b = util.buildTree(turntable.user.layouts.avatarImg(g.avatarids[e], c));
                if (avatars && typeof (avatars[g.avatarids[e]]) !== "undefined") {
                    a.append(b);
                }
                if (g.avatarids[e] == turntable.user.avatarId) {
                    $(b).addClass("currentAvatar");
                }
            }
            $(d).append(h);
        }
    },
    avatarLoad: function () {
        var a = $(this).closest("div.avatar");
        a.css("width", this.width);
        a.css("height", this.height);
        $(this).addClass("shrink");
    },
    avatarShrink: function () {
        $(this).addClass("shrink");
    },
    avatarUnshrink: function () {
        $(this).removeClass("shrink");
    },
    avatarClick: function () {
        $(".avatar.currentAvatar").removeClass("currentAvatar");
        $(this).closest(".avatar").addClass("currentAvatar");
    },
    avatarClose: function () {
        var a = $(".avatar.currentAvatar").data("avatarId");
        if (a != turntable.user.avatarId) {
            turntable.user.avatarId = a;
            turntable.HRqMW({
                api: "user.set_avatar",
                avatarid: a
            }, function (b) {
                if (b.success) {
                    turntable.dispatchEvent("avatarchange");
                }
            });
        }
        util.hideOverlay();
    },
    settingsShow: function () {
        turntable.HRqMW({
            api: "user.get_profile"
        }, function (a) {
            util.showOverlay(util.buildTree(turntable.user.layouts.settingsView()));
            $("#displayNameField").val(turntable.user.displayName);
            $("#twitterField").val(a.twitter);
            $("#facebookField").val(a.facebook);
            $("#websiteField").val(a.website);
            $("#aboutField").val(a.about);
            $("#aboutField").limitMaxLength();
            $("#topArtistsField").val(a.topartists);
            $("#topArtistsField").limitMaxLength();
            $("#hangoutField").val(a.hangout);
            $("#hangoutField").limitMaxLength();
            $("#displayNameFieldWrapper").tipsy({
                gravity: "n",
                fade: true,
            });
        });
    },
    settingsSubmit: function () {
        var c = $("#displayNameField").val();
        var g = $("#twitterField").val();
        var b = $("#facebookField").val();
        var e = $("#websiteField").val();
        var f = $("#aboutField").val();
        var a = $("#topArtistsField").val();
        var d = $("#hangoutField").val();
        turntable.HRqMW({
            api: "user.modify_profile",
            name: c,
            twitter: g,
            facebook: b,
            website: e,
            about: f,
            topartists: a,
            hangout: d
        }, function (h) {
            if (!h.success) {
                turntable.showAlert("Sorry, " + h.err);
                return;
            } else {
                turntable.user.setDisplayName(c);
            }
        });
        util.hideOverlay();
    },
    ignoredShow: function () {
        util.showOverlay(util.buildTree(turntable.user.layouts.ignoredView()));
        var b = function (c) {
                if ($("#" + c).length > 0) {
                    return;
                }
                var d = function () {
                        var f = $(this).parent();
                        turntable.HRqMW({
                            api: "block.remove",
                            blockedid: f.attr("id")
                        }, function (g) {
                            if (g && g.success) {
                                f.hide("slow", function () {
                                    $(this).remove();
                                });
                            } else {
                                $("#addIgnoreFieldError").html("An error occurred when removing the user").show("slow");
                            }
                        });
                        return false;
                    };
                var e = util.buildTree(["li#" + c + ".ignored",
                {}, ["a.remove",
                {
                    event: {
                        click: d
                    }
                }],
                    ["span.name",
                    {}, "Loading..."]
                ]);
                turntable.HRqMW({
                    api: "user.get_profile",
                    userid: c
                }, function (f) {
                    $("#" + c + " span.name").html(f.name);
                });
                return e;
            };
        turntable.HRqMW({
            api: "block.list_all"
        }, function (c) {
            $.each(c.blocks, function () {
                var d = this.block;
                $("ul#ignoredUsers").append(b(d.blockedid));
            });
        });
        var a = "Enter a username...";
        $("div.addIgnore input").val(a).addClass("default");
        $("div.addIgnore input").focus(function () {
            if ($(this).val() == a) {
                $(this).val("").removeClass("default");
            }
        });
        $("div.addIgnore input").keyup(function (c) {
            if (c.keyCode == 13) {
                $("div.addIgnore button").click();
            }
        });
        $("div.addIgnore input").focus(function (c) {
            setTimeout(function () {
                $("#addIgnoreFieldError").hide("slow");
            }, 1000);
        });
        $("div.addIgnore button").click(function () {
            var c = $("#addIgnoreField").val();
            if ($.trim(c).length > 0) {
                turntable.HRqMW({
                    api: "user.get_id",
                    name: c
                }, function (d) {
                    if (d && d.success) {
                        turntable.HRqMW({
                            api: "block.add",
                            blockedid: d.userid
                        }, function (e) {
                            if (e.success) {
                                $("ul#ignoredUsers").append(b(d.userid));
                                $("#" + d.userid).hide().show("slow");
                                $("#addIgnoreField").val("");
                                $("#addIgnoreFieldError").html("").hide();
                            } else {
                                $("#addIgnoreFieldError").html(e.err).show("slow");
                            }
                        });
                    } else {
                        $("#addIgnoreFieldError").html(d.err).show("slow");
                    }
                });
            }
        });
    },
    logout: function () {
        $.cookie("turntableUserId", null, {
            path: "/",
            expires: 0
        });
        $.cookie("turntableUserAuth", null, {
            path: "/",
            expires: 0
        });
        $.cookie("turntableUserNamed", null, {
            path: "/",
            expires: 0
        });
        if (FB.getSession()) {
            FB.logout(function () {
                window.location.replace("/");
            });
        } else {
            window.location.replace("/");
        }
    }
};
turntable.user.layouts = {
    guest: ["div#menuh",
    {}, ["div.fbLogin",
    {
        event: {
            click: turntable.user.showFBLogin
        }
    }, ["span", "Login"]]],
    signedIn: ["div#menuh",
    {
        event: {
            mouseover: function () {
                $(".menuItem").addClass("hover");
            },
            mouseout: function () {
                $(".menuItem").removeClass("hover");
            }
        }
    }, ["div.menuItem.first",
    {}, ["div.settingsHead"],
        ["div.text", "Settings"],
        ["div.downArrow",
        {
            src: "https://s3.amazonaws.com/static.turntable.fm/images/down_arrow.png"
        }]
    ],
        ["div.menuItem",
        {
            event: {
                click: turntable.user.avatarsShow
            }
        }, "Change avatar"],
        ["div.menuItem",
        {
            event: {
                click: turntable.user.settingsShow
            }
        }, "Edit profile"],
        ["div.menuItem",
        {
            event: {
                click: turntable.user.ignoredShow
            }
        }, "Ignored users"],
        ["div.menuItem",
        {
            event: {
                click: turntable.user.logout
            }
        }, "Logout"]
    ],
    avatarsView: function () {
        return ["div.avatarsOverlay.modal", {}, ["div.close-x",
        {
            event: {
                click: turntable.user.avatarClose
            }
        }], ["h2", "Choose Avatar"], ["p.djPointsMsg", ["span.djName", "DJ ", ["span.bindUserName",
        {},
        turntable.user.displayName]], ", you have ", ["span.djPoints",
        {},
        turntable.user.djPoints], " points."], ["p.djPointsMsg", "Earn more points to unlock new avatars."], ["div##tiers.avatarTiers"]];
    },
    avatarTier: function (a) {
        return ["div.tier", {}, ["div.reqsHeader",
        {},
        a], ["div.avatarList"]];
    },
    avatarImg: function (b, a) {
        return ["div.avatar" + (a ? "" : ".locked"), {
            data: {
                avatarId: b
            }
        }, ["img.avatarImg",
        {
            src: "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/" + b + "/fullfront.png",
            event: {
                load: turntable.user.avatarLoad,
                mouseover: a && turntable.user.avatarUnshrink,
                mouseout: a && turntable.user.avatarShrink,
                click: a && turntable.user.avatarClick
            }
        }], (a ? null : ["img.lockedIcon",
        {
            src: "https://s3.amazonaws.com/static.turntable.fm/images/overlay/avatar_locked_icon.png"
        }]), ["div.djName",
        {}, "DJ " + turntable.user.displayName]];
    },
    settingsView: function () {
        return ["div.settingsOverlay.modal", {}, ["div.close-x",
        {
            event: {
                click: util.hideOverlay
            }
        }], ["h1", "Edit Profile"], ["br"], ["div.fields",
        {}, ["div.field.settings",
        {}, ["div#displayNameFieldWrapper",
        {
            title: "Can't be changed more than once every seven days"
        }, ["div",
        {}, "Display Name:"],
            ["input#displayNameField.text.name"]
        ],
            ["div",
            {}, "Twitter Name:"],
            ["input#twitterField.text.twitter",
            {
                maxlength: 15
            }],
            ["div",
            {}, "Facebook URL:"],
            ["input#facebookField.text.facebook"],
            ["div",
            {}, "Website:"],
            ["input#websiteField.text.website"],
            ["div",
            {}, "Write something about yourself:"],
            ["textarea#aboutField.textarea",
            {
                maxlength: 400
            }],
            ["div",
            {}, "Got some favorite artists?"],
            ["textarea#topArtistsField.textarea",
            {
                maxlength: 400
            }],
            ["div",
            {}, "Where do you usually hang out on turntable?"],
            ["textarea#hangoutField.textarea",
            {
                maxlength: 400
            }]
        ]], ["div.save-changes.centered-button",
        {
            event: {
                click: turntable.user.settingsSubmit
            }
        }], ["br"]];
    },
    ignoredView: function () {
        return ["div.ignoredOverlay.modal", {}, ["div.close-x",
        {
            event: {
                click: util.hideOverlay
            }
        }], ["h1", "Ignored Users List"], ["div.ignoredDescription", "Someone bothering you? Add a user to this list to block their incoming chat messages."], ["div.addIgnore", ["input#addIgnoreField",
        {
            size: "15"
        }],
            ["button",
            {}],
            ["div#addIgnoreFieldError",
            {}]
        ], ["ul#ignoredUsers",
        {}]];
    }
};
turntable.playlist = {
    files: [],
    songsByFid: {},
    currentSong: null,
    currentSongTimer: null,
    filesUploading: [],
    filesProcessed: 0,
    filesToProcess: 0,
    nodes: {},
    init: function () {
        $("#playlist").attr("id", "").replaceWith(util.buildTree(turntable.playlist.layouts.playlistView, turntable.playlist.nodes));
        $("#playlist .addSongsButton").click(function () {
            turntable.playlist.filterQueue("");
            $("#playlist .queueView").hide();
            $("#playlist .addSongsView").show();
            $("#plupload .plupload.html5").css("width", $("#pickfiles").css("width"));
            $("#plupload .plupload.html5").css("height", $("#pickfiles").css("height"));
        });
        $("#playlist .addSongsView .cancelButton").click(function () {
            $("#playlist .addSongsView").hide();
            $("#playlist .queueView").show();
        });
        $("#playlist .searchView .doneButton").click(turntable.playlist.searchDone);
        turntable.playlist.realQueue = $("#playlist .queue.realPlaylist");
        turntable.playlist.initUpload();
        turntable.addEventListener("message", turntable.playlist.messageReceived);
        util.CWzdUjBgak(this);
    },
    initUpload: function () {
        LOG("Initializing plupload...");
        var a = turntable.uploader = new plupload.Uploader({
            runtimes: "html5,flash,silverlight",
            browse_button: "pickfiles",
            browse_button_hover: "hover",
            browse_button_active: "active",
            container: "plupload",
            max_file_size: "30mb",
            url: "/upload/" + turntable.currentSocketServer,
            flash_swf_url: "/static/plupload/js/plupload.flash.swf",
            silverlight_xap_url: "/static/plupload/js/plupload.silverlight.xap",
            filters: [{
                title: "Music files",
                extensions: "mp3"
            }],
            multipart_params: {}
        });
        a.init();
        a.bind("FilesAdded", turntable.playlist.beginUpload);
        a.bind("UploadProgress", function (b, c) {
            $(".plFile-" + c.id + " .progress").css("width", c.percent + "%");
        });
        a.bind("FileUploaded", function (b, d, f) {
            LOG("file uploaded: " + f.response);
            var c = JSON.parse(f.response);
            turntable.playlist.endUpload(d);
            if (!c.success) {
                var e = "There was an error uploading " + c.filename + " \u2014 please check the song file.";
                turntable.playlist.messageReceived({
                    command: "upload_failed",
                    err: e
                });
            }
        });
    },
    loadList: function (c, d, a) {
        LOG("Loading user playlist...");
        var b = {
            api: "playlist.all",
            playlist_name: "default"
        };
        if (turntable.playlist.files.length && !a) {
            b.minimal = true;
        }
        turntable.HRqMW(b, function (h) {
            var g = [];
            if (b.minimal) {
                for (var f = 0; f < h.list.length; f++) {
                    var e = turntable.playlist.songsByFid[h.list[f]._id];
                    if (!e) {
                        turntable.playlist.loadList(c, d, true);
                        return;
                    }
                    g.push(e);
                }
            } else {
                for (var f = 0; f < h.list.length; f++) {
                    g.push({
                        fileId: h.list[f]._id,
                        metadata: h.list[f].metadata
                    });
                }
            }
            turntable.playlist.updatePlaylist(g, c);
            if (d) {
                turntable.playlist.queueAnimTask(d);
            }
        });
    },
    clearPlaylist: function () {
        turntable.playlist.updatePlaylist([], false);
    },
    setCurrentSong: function (b) {
        if (turntable.playlist.currentSong == null && b == null) {
            return;
        }
        turntable.playlist.previewStop();
        if (turntable.playlist.currentSongTimer) {
            clearInterval(turntable.playlist.currentSongTimer);
            turntable.playlist.currentSongTimer = null;
        }
        var a = function () {
                turntable.playlist.currentSong = (b ? {
                    fileId: b._id,
                    metadata: b.metadata
                } : null);
                turntable.playlist.updateTopSongClass();
                if (turntable.playlist.currentSong) {
                    var c = Math.max(500, 1000 * b.metadata.length / $("#playlist .queue").width());
                    turntable.playlist.currentSongTimer = setInterval(turntable.playlist.updateCurrentSongProgress, c);
                }
            };
        if (turntable.playlist.currentSong) {
            if (b) {
                turntable.playlist.setEditsLocked(true);
                turntable.playlist.loadList(750, a);
            } else {
                turntable.playlist.queueTask(function () {
                    a();
                    turntable.playlist.updatePlaylist(null, 750);
                });
            }
        } else {
            turntable.playlist.setEditsLocked(true);
            a();
            turntable.playlist.loadList(false);
        }
    },
    resetQueueView: function () {
        turntable.playlist.searchDone();
    },
    updateCurrentSongProgress: function () {
        try {
            var a = 0.1 * turntablePlayer.tracks[0].sound.position / turntable.playlist.currentSong.metadata.length;
            turntable.playlist.realQueue.find(".currentSong .progress").css("width", a + "%");
        } catch (b) {}
    },
    messageReceived: function (b) {
        if (b.command == "upload_complete") {
            turntable.playlist.filesProcessed += 1;
            if (turntable.playlist.filesProcessed >= turntable.playlist.filesToProcess) {
                turntable.playlist.filesProcessed = turntable.playlist.filesToProcess = 0;
            }
            turntable.playlist.updateProcessing();
            if (turntable.playlist.songsByFid.hasOwnProperty(b.fid)) {
                return;
            }
            turntable.playlist.addSong({
                fileId: b.fid,
                metadata: b.metadata
            });
        } else {
            if (b.command == "upload_failed") {
                var a = b.err || "Your upload failed. There may have been a problem with the file, or the song wasn't long enough.";
                if (turntable.EPWNro && turntable.EPWNro.showRoomTip) {
                    turntable.EPWNro.showRoomTip(a);
                }
                if (turntable.playlist.filesToProcess > 0) {
                    turntable.playlist.filesToProcess -= 1;
                    turntable.playlist.updateProcessing();
                }
            }
        }
    },
    editTask: null,
    resolvingEdits: false,
    setEditsLocked: function (a) {
        if (a) {
            if (turntable.playlist.editTask == null) {
                turntable.playlist.editTask = $.Deferred();
            }
        } else {
            if (turntable.playlist.editTask != null) {
                turntable.playlist.resolvingEdits = true;
                turntable.playlist.editTask.resolve();
                turntable.playlist.resolvingEdits = false;
                turntable.playlist.editTask = null;
            }
        }
        turntable.playlist.setSortableEnabled(!a);
    },
    queueTask: function (a) {
        (turntable.playlist.editTask ? turntable.playlist.editTask.done(a) : a());
    },
    animTask: null,
    beginAnimTask: function () {
        ASSERT(turntable.playlist.editTask != null, "Edits must be locked");
        ASSERT(turntable.playlist.animTask == null, "There are pending animations");
        turntable.playlist.animTask = $.Deferred();
    },
    endAnimTask: function () {
        turntable.playlist.animTask.resolve();
        turntable.playlist.animTask = null;
    },
    queueAnimTask: function (a) {
        (turntable.playlist.animTask ? turntable.playlist.animTask.done(a) : a());
    },
    beginUpload: function (f, b) {
        ASSERT(b.length, "beginUpload called with 0 files... intentional?");
        $("#playlist .addSongsView").hide();
        $("#playlist .queueView").show();
        turntable.playlist.filesToProcess += b.length;
        turntable.playlist.updateProcessing();
        var d = $("#playlist .queueView .songlist");
        var a = d.find(".uploads");
        for (var e = 0; e < b.length; e++) {
            var c = $(util.buildTree(turntable.playlist.layouts.uploadingView(b[e].name)));
            c.addClass("plFile-" + b[e].id);
            a.append(c);
        }
        d[0].scrollTop = turntable.playlist.realQueue.height();
        turntable.playlist.filesUploading = turntable.playlist.filesUploading.concat(b);
        turntable.uploader.settings.url = "/upload/" + turntable.currentSocketServer;
        turntable.uploader.settings.multipart_params.userid = turntable.user.id;
        turntable.uploader.settings.multipart_params.userauth = turntable.user.auth;
        turntable.uploader.settings.multipart_params.port = String(turntable.socket.options.port);
        f.start();
    },
    endUpload: function (a) {
        LOG(a.name + " finished uploading");
        var c = $.inArray(a, turntable.playlist.filesUploading);
        ASSERT(c != -1, "Never began uploading " + a.name);
        turntable.playlist.filesUploading.splice(c, 1);
        var b = a.id;
        $(".plFile-" + b).animate({
            height: 0,
            opacity: 0
        }, {
            duration: 400,
            complete: function () {
                $(this).remove();
            }
        });
        turntable.playlist.updateProcessing();
    },
    addSong: function (b, a) {
        turntable.playlist.queueTask(function () {
            var c = b.fileId;
            if (a === null || a === undefined) {
                a = turntable.playlist.files.length - (turntable.playlist.currentSong ? 1 : 0);
            }
            turntable.playlist.files.splice(a, 0, b);
            turntable.playlist.songsByFid[b.fileId] = b;
            turntable.playlist.updatePlaylist(null, true);
            turntable.HRqMW({
                api: "playlist.add",
                playlist_name: "default",
                song_dict: {
                    fileid: c
                },
                index: a
            }, function (d) {
                if (!d.success) {
                    turntable.playlist.loadList(false);
                }
            });
        });
    },
    removeFile: function (a) {
        turntable.playlist.queueTask(function () {
            var b = -1;
            for (var c = 0; c < turntable.playlist.files.length; c++) {
                if (turntable.playlist.files[c].fileId == a) {
                    b = c;
                    break;
                }
            }
            if (b == -1) {
                return;
            }
            if (turntable.playlist.currentSong && b == turntable.playlist.files.length - 1) {
                return;
            }
            turntable.playlist.files.splice(b, 1);
            delete turntable.playlist.songsByFid[a];
            turntable.playlist.updatePlaylist(null, 100);
            turntable.HRqMW({
                api: "playlist.remove",
                playlist_name: "default",
                index: b
            }, function (d) {
                ASSERT(d.success, "Song could not be removed");
            });
        });
    },
    removeSongClicked: function (a) {
        var b = $(this).closest(".song");
        ASSERT(!b.hasClass("currentSong"), "Can't remove current song");
        turntable.playlist.removeFile(b.data("songData").fileId);
    },
    searchKeyUp: function (d) {
        var a = $(this);
        var c = a.closest(".search");
        var b = c.find(".mag-glass");
        var e = a.val();
        if (e) {
            b.addClass("clearSearch");
        } else {
            b.removeClass("clearSearch");
        }
        if (c.hasClass("playlistSearch")) {
            turntable.playlist.filterQueue(e);
        }
    },
    searchClear: function (a) {
        var c = $(this);
        if (c.hasClass("clearSearch")) {
            c.removeClass("clearSearch");
            var d = c.closest(".search");
            var b = d.find("input");
            b.val("");
            b.focus();
            if (d.hasClass("playlistSearch")) {
                turntable.playlist.filterQueue("");
            }
        }
    },
    filterQueue: function (b) {
        if (b.length > 0) {
            filterEscaped = b.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            var a = $("div.realPlaylist").egrep(new RegExp(filterEscaped, "i"));
            $(".song").hide();
            $(a).closest(".song").show().addClass("filtered");
            turntable.playlist.setSortableEnabled(false);
            if (!$("#playlist .resultsLabel").is(":visible")) {
                var c = $("#playlist .songlist");
                c.css({
                    height: (c.height() - 20) + "px",
                    top: (c.position().top + 20) + "px"
                });
            }
            $("#playlist .resultsLabel").show().find(".searchTermLabel").text(b);
        } else {
            $(".song").show().removeClass("filtered");
            turntable.playlist.setSortableEnabled(true);
            var c = $("#playlist .songlist");
            if ($("#playlist .resultsLabel").is(":visible")) {
                c.css({
                    height: (c.height() + 20) + "px",
                    top: (c.position().top - 20) + "px"
                });
                $("#playlist .resultsLabel").hide();
            }
        }
    },
    submitSearchQuery: function (a, c) {
        var b = c ? $(c) : $(this);
        var d = $.trim(b.find("input").val());
        if (!d) {
            return;
        }
        if (a !== true) {
            a = false;
        }
        if (!a && "pendingSearchQuery" in turntable.playlist && turntable.playlist.pendingSearchQuery == d && turntable.playlist.appendSongSearch) {
            a = true;
        }
        $("#playlist .searchView .songSearch input").val(d);
        $(".queueView").hide();
        $(".addSongsView").hide();
        $(".searchView").show();
        if (!a) {
            turntable.playlist.appendSongSearch = false;
            turntable.HRqMW({
                api: "file.search",
                query: d
            }, function () {
                turntable.playlist.waitSearchResults(d);
            });
            turntable.playlist.searchPage = 1;
            turntable.playlist.previewStop();
            $(".searchView .searchingBlocker").fadeTo(100, 0.9);
        } else {
            turntable.playlist.appendSongSearch = true;
            if (!turntable.playlist.searchPage) {
                turntable.playlist.searchPage = 1;
            }
            turntable.HRqMW({
                api: "file.search",
                query: d,
                page: turntable.playlist.searchPage + 1
            }, function () {
                turntable.playlist.waitSearchResults(d);
            });
        }
    },
    waitSearchResults: function (a) {
        if (!turntable.playlist.pendingSearchQuery) {
            turntable.addEventListener("message", turntable.playlist.showSearchResults);
        }
        turntable.playlist.pendingSearchQuery = a;
    },
    showSearchResults: function (c) {
        var b = turntable.playlist.appendSongSearch;
        if ((c.command != "search_complete" && c.command != "search_failed") || (c.query != turntable.playlist.pendingSearchQuery) || (!b && c.page != 1) || (b && c.page != turntable.playlist.searchPage + 1)) {
            return;
        }
        turntable.playlist.pendingSearchQuery = null;
        turntable.removeEventListener("message", turntable.playlist.showSearchResults);
        if ($(".searchView").css("display") == "none") {
            return;
        }
        if (!b) {
            $(".searchView .searchingBlocker").fadeOut("fast");
            $(".searchView input").focus();
            $(".searchView .mag-glass").addClass("clearSearch");
            turntable.playlist.numFilesAdded = 0;
            $(".searchView .numFilesAdded").text("(0) Songs added");
            $(".searchView .queue").empty();
            $(".searchView .songlist")[0].scrollTop = 0;
        } else {
            turntable.playlist.searchPage++;
        }
        var e = null;
        if (!c.success) {
            e = (c.err ? "Error: " + c.err : "Sorry, the search failed. Please try again later.");
        } else {
            if (c.docs.length == 0 && !b) {
                e = "Sorry, no results could be found.";
            }
        }
        if (e) {
            $(".searchView .emptySearchResults").show().text(e);
            if (!b) {
                $(".searchView .separator").hide();
            }
            return;
        }
        $(".searchView .emptySearchResults").hide();
        var h = $(".searchView .externQueue");
        var j = $(".searchView .inMyQueue");
        for (var d = 0; d < c.docs.length; d++) {
            var g = c.docs[d];
            var f = (turntable.playlist.songsByFid.hasOwnProperty(g._id) ? j : h);
            var a = {
                fileId: g._id,
                metadata: g.metadata
            };
            f.append(util.buildTree(turntable.playlist.layouts.searchedSongView(a)));
        }
        $(".searchView .separator").css("display", j.children().length ? "block" : "none");
        if (c.docs.length >= 25) {
            $(".searchView .loadMoreSearchResults").show();
            turntable.playlist.bindSongSearchScroll();
        } else {
            $(".searchView .loadMoreSearchResults").hide();
            turntable.playlist.unbindSongSearchScroll();
        }
    },
    bindSongSearchScroll: function () {
        turntable.playlist.didScrollSearch = false;
        var b = $(".searchView .songlist");
        var c = $(".searchView .loadMoreSearchResults");
        var a = $(".chat-container");
        b.scroll(function () {
            turntable.playlist.didScrollSearch = true;
        });
        turntable.playlist.scrollSearchTimer = setInterval(function () {
            if (turntable.playlist.didScrollSearch) {
                turntable.playlist.didScrollSearch = false;
                if (c.css("display") == "none") {
                    return;
                }
                var e = c.offset().top;
                var d = a.offset().top;
                if (e < d) {
                    turntable.playlist.unbindSongSearchScroll();
                    turntable.playlist.submitSearchQuery(true, "form.input.songSearch");
                }
            }
        }, 250);
    },
    unbindSongSearchScroll: function () {
        $(".searchView .songlist").unbind("scroll");
        if ("scrollSearchTimer" in turntable.playlist) {
            clearInterval(turntable.playlist.scrollSearchTimer);
        }
    },
    addSearchResult: function () {
        var b = $(this).closest(".song");
        b.addClass("addedToQueue");
        b.find(".addSong").hide();
        b.find(".goTop").hide();
        b.find(".checkmark").show();
        var a = b.data("songData");
        if (b.closest(".queue").hasClass("externQueue")) {
            turntable.playlist.addSong(a, 0);
            turntable.playlist.numFilesAdded += 1;
            $(".searchView .numFilesAdded").text("(" + turntable.playlist.numFilesAdded + ") Songs added");
        } else {
            turntable.playlist.moveFileToTop(a.fileId);
            b.find(".addedToQueueTop").show().delay(1500).fadeOut(500);
        }
    },
    remSearchResult: function () {
        var a = $(this).closest(".song");
        if (a.closest(".queue").hasClass("externQueue")) {
            turntable.playlist.removeFile(a.data("songData").fileId);
            a.removeClass("addedToQueue");
            a.find(".addSong").show();
            a.find(".checkmark").hide();
            turntable.playlist.numFilesAdded -= 1;
            $(".searchView .numFilesAdded").text("(" + turntable.playlist.numFilesAdded + ") Songs added");
        }
    },
    searchDone: function (a) {
        turntable.playlist.previewStop();
        turntable.playlist.unbindSongSearchScroll();
        $("#playlist .search input").val("");
        $("#playlist .search .mag-glass").removeClass("clearSearch");
        $(".queueView").show();
        $(".addSongsView").hide();
        $(".searchView").hide();
    },
    buySong: function () {
        var c = $(this).closest(".song");
        var b = c.data("songData").fileId;
        var a = "itunes";
        window.open("/link/?fileid=" + b + "&site=" + a, a + b);
    },
    previewPlay: function () {
        var a = $(this).closest(".song");
        turntablePlayer.samplePlay(a.data("songData").fileId, turntable.playlist.previewCallback);
        a.addClass("currentPreview");
        a.find(".progress").css("width", "0%");
    },
    previewCallback: function (b, a) {
        if (b == "progress") {
            $(".playlist-container .song.currentPreview .progress").css({
                width: a
            });
        } else {
            if (b == "stop") {
                $(".playlist-container .song.currentPreview .progress").css({
                    width: "0%"
                });
                $(".playlist-container .song.currentPreview").removeClass("currentPreview");
            }
        }
    },
    previewStop: turntablePlayer.sampleStop,
    humanDuration: function (a) {
        return Math.floor(a / 60) + ":" + String(a % 60 + 100).substr(1);
    },
    updateProcessing: function () {
        var a = $(turntable.playlist.nodes.root).find(".processing");
        if (turntable.playlist.filesToProcess > 0) {
            a.find(".text").text("Processed " + turntable.playlist.filesProcessed + " of " + turntable.playlist.filesToProcess + " files");
            a.slideDown();
        } else {
            a.slideUp();
        }
        turntable.playlist.updateDjQueueDecoration();
    },
    moveSongToTopClicked: function (a) {
        var b = $(this).closest(".song");
        ASSERT(!b.hasClass("topSong"), "Cannot move top song to top");
        turntable.playlist.moveFileToTop(b.data("songData").fileId);
    },
    moveFileToTop: function (a) {
        turntable.playlist.queueTask(function () {
            var b;
            for (var b = 1; b < turntable.playlist.files.length; b++) {
                if (turntable.playlist.files[b].fileId == a) {
                    break;
                }
            }
            if (b == turntable.playlist.files.length) {
                return;
            }
            var c = turntable.playlist.files[b];
            LOG("Moving '" + c.metadata.song + "' to top");
            if (turntable.playlist.currentSong && c.fileId == turntable.playlist.currentSong.fileId) {
                LOG("Moving a currently-playing song to top is a no-op");
                return;
            }
            turntable.playlist.files.splice(b, 1);
            turntable.playlist.files.unshift(c);
            turntable.playlist.updatePlaylist(null, true);
            turntable.HRqMW({
                api: "playlist.reorder",
                playlist_name: "default",
                index_from: b,
                index_to: 0
            });
        });
    },
    updateSongsByFid: function () {
        turntable.playlist.songsByFid = {};
        for (var b = 0; b < turntable.playlist.files.length; b++) {
            var a = turntable.playlist.files[b];
            turntable.playlist.songsByFid[a.fileId] = a;
        }
    },
    updateTopSongClass: function () {
        var a = turntable.playlist.realQueue.find(".song");
        a.removeClass("topSong").removeClass("currentSong");
        a.first().addClass("topSong");
        if (turntable.playlist.currentSong) {
            for (var b = 0; b < a.length; b++) {
                ASSERT(a.eq(b).data("songData"), "updateTopSongClass: songDivs " + b + " has no songData");
                if (a.eq(b).data("songData").fileId == turntable.playlist.currentSong.fileId) {
                    var c = a.eq(b);
                    c.addClass("topSong").addClass("currentSong");
                    break;
                }
            }
        }
        turntable.playlist.updateDjQueueDecoration();
    },
    updateDjQueueDecoration: function () {
        var a = turntable.playlist.realQueue.find(".song");
        $("#playlist .queueView .topSongRecordIcon").css("display", a.length ? "block" : "none");
        var b = turntable.playlist.realQueue.find(".uploading");
        $("#playlist .queueView .emptyQueue").css("display", (a.length + b.length) ? "none" : "block");
    },
    updatePlaylist: function (b, a) {
        turntable.playlist.queueAnimTask(function () {
            turntable.playlist.updatePlaylistImmediately(b, a);
        });
    },
    updatePlaylistImmediately: function (d, c) {
        if (!d) {
            d = turntable.playlist.files;
        }
        if (c && turntable.playlist.animTask == null && !turntable.playlist.resolvingEdits && $(".queueView").css("display") != "none") {
            if (typeof (c) != "number") {
                c = 250;
            }
            turntable.playlist.setEditsLocked(true);
            turntable.playlist.beginAnimTask();
            var a = turntable.playlist.animateSetup(d);
            LOG("ANIMATIONS: ");
            LOG(a);
            var b = turntable.playlist.doAnimate(a, c);
            $.when.apply(null, b).then(function () {
                turntable.playlist.animateComplete();
                turntable.playlist.updateTopSongClass();
                turntable.playlist.endAnimTask();
                turntable.playlist.setEditsLocked(false);
            });
        } else {
            turntable.playlist.updateQueueSongs(d).done(function () {
                turntable.playlist.updateTopSongClass();
                turntable.playlist.setEditsLocked(false);
            });
        }
    },
    animateSetup: function (k) {
        if (turntable.playlist.currentSong) {
            k.unshift(k.pop());
        }
        var g = {};
        for (var f = 0; f < k.length; f++) {
            g[k[f].fileId] = f;
        }
        var b, d;
        var q = turntable.playlist.realQueue.find(".song");
        var p = [],
            c = [],
            o = [];
        var l = 0,
            m = 0,
            e = 0;
        for (var f = 0, j = q.length; f < j; f++) {
            var a = f;
            b = $(q[f]).data("songData").fileId;
            if (b in g) {
                var h = g[b];
                var n = h - a + e;
                if (n > 0) {
                    o.push([f, h]);
                    m = Math.max(Math.abs(h - f), m);
                } else {
                    if (n < 0) {
                        c.push([f, h]);
                        l = Math.max(Math.abs(h - f), l);
                    }
                }
                delete g[b];
            } else {
                p.push([f, "remove"]);
                e++;
            }
        }
        if (l >= m) {
            p = c.concat(p);
        } else {
            p = o.concat(p);
        }
        for (var f = 0; f < k.length; f++) {
            b = k[f].fileId;
            if (!(b in g)) {
                continue;
            }
            p.push(["insert", f, util.buildTree(turntable.playlist.layouts.songView(k[f]))]);
        }
        if (turntable.playlist.currentSong) {
            k.push(k.shift());
        }
        turntable.playlist.files = k;
        turntable.playlist.updateSongsByFid();
        return p;
    },
    doAnimate: function (b, e) {
        var c = [];
        for (var d = 0, a = b.length; d < a; d++) {
            var f = b[d];
            var g;
            if (f[0] == "insert" && f.length > 2) {
                g = turntable.playlist.animateInsert(f[1], f[2], e);
            } else {
                if (f[1] == "remove") {
                    g = turntable.playlist.animateRemove(f[0], e);
                } else {
                    g = turntable.playlist.animateMove(f[0], f[1], e);
                }
            }
            if (g) {
                c.push(g);
            }
        }
        return c;
    },
    animateInsert: function (c, a, b) {
        var g = $(".realPlaylist .song").not(".songAnimating");
        if (c > g.length) {
            return false;
        } else {
            var d = $(a).hide().addClass("songAnimating");
            if (g.length == 0) {
                $("div.realPlaylist").append(d);
            } else {
                if (c == g.length) {
                    var e = $(g[c - 1]);
                    e.after(d);
                } else {
                    var e = $(g[c]);
                    e.before(d);
                }
            }
            var f = d.slideDown(b, function () {
                $(this).removeClass("songAnimating");
            });
            return f;
        }
    },
    animateRemove: function (b, a) {
        var e = $(".realPlaylist .song").not(".songAnimating");
        if (b > e.length - 1) {
            return false;
        } else {
            var d = $(e[b]);
            var c = d.slideUp(a, function () {
                $(this).remove();
            });
            return c;
        }
    },
    animateMove: function (j, f, b) {
        var a = $(".realPlaylist .song").not(".songAnimating");
        if (j > a.length - 1 || f > a.length - 1) {
            return false;
        } else {
            var c = $(a[j]);
            var h = c.position();
            var d = $(a[f]);
            var e = d.position();
            var i = c.clone(true).hide().css({
                visibility: "hidden"
            }).addClass("songAnimating");
            if (f - j < 0) {
                d.before(i);
            } else {
                d.after(i);
            }
            var k = i.slideDown(b, function () {
                $(this).css({
                    visibility: "visible"
                }).removeClass("songAnimating");
            });
            var g = c.clone(false).addClass("songAnimating").css({
                position: "absolute",
                top: h.top + "px"
            }).appendTo(c.parent()).animate({
                top: e.top + "px"
            }, b, function () {
                $(this).remove();
            });
            c.css({
                visibility: "hidden"
            }).slideUp(b, function () {
                $(this).remove();
            });
            return k;
        }
    },
    animateComplete: function () {
        var a = turntable.playlist.realQueue;
        var b = a.find(".song");
        b.removeClass("nth-child-even").filter(":even").addClass("nth-child-even");
    },
    updateQueueSongs: function (e) {
        turntable.playlist.files = e;
        turntable.playlist.updateSongsByFid();
        if (turntable.playlist.currentSong) {
            e.unshift(e.pop());
            LOG(e[0].metadata.song + " is logically last, but visually first");
        }
        var a = turntable.playlist.realQueue;
        var b = a.find(".song");
        var c = $.Deferred();
        var d = 0;
        var f = function () {
                var k = 0;
                place_ith_node: for (; d < e.length; d++) {
                    if (k >= 20) {
                        setTimeout(f, 0);
                        return;
                    }
                    var l = e[d];
                    ASSERT(l, "list[" + d + "] is null");
                    var g;
                    for (var i = d; i < b.length; i++) {
                        g = b.eq(i);
                        var h = g.data("songData");
                        if (!h) {
                            turntable.showAlert("songDiv #" + i + " has no songData");
                            LOG("songDiv #" + i + " has no songData");
                            continue;
                        }
                        if (h.fileId == l.fileId) {
                            if (i == d) {
                                continue place_ith_node;
                            }
                            break;
                        }
                    }
                    if (i >= b.length) {
                        g = $(util.buildTree(turntable.playlist.layouts.songView(l)));
                    }
                    if (d == 0) {
                        a.prepend(g);
                    } else {
                        g.insertAfter(b.eq(d - 1));
                    }
                    b = b.add(g);
                    k += 1;
                }
                b.slice(d).remove();
                if (turntable.playlist.currentSong) {
                    e.push(e.shift());
                }
                b.removeClass("nth-child-even").filter(":even").addClass("nth-child-even");
                c.resolve();
            };
        f();
        return c.promise();
    },
    verifyQueue: function () {
        var e = turntable.playlist.files.slice(0);
        if (turntable.playlist.currentSong) {
            e.unshift(e.pop());
        }
        var h = turntable.playlist.realQueue.find(".song");
        var b = true;
        for (var d = 0, a = h.length; d < a; d++) {
            var c = d;
            var g = $(h[d]).data("songData").fileId;
            var f = e[d].fileId;
            if (g != f) {
                b = false;
            }
            if (!b) {
                LOG(d + ": " + g + " ?= " + f);
            }
        }
        if (!b) {
            LOG("Queue out of sync!");
        } else {
            LOG("Queue OK.");
        }
    },
    sortableEnabled: false,
    sortableEnableTimer: null,
    setSortableEnabled: function (a) {
        if (a) {
            if (turntable.playlist.sortableEnableTimer == null) {
                if (turntable.playlist.sortableEnabled) {
                    turntable.playlist.realQueue.sortable("destroy");
                }
                turntable.playlist.sortableEnableTimer = setTimeout(function () {
                    var b = {
                        axis: "y",
                        items: ".song:not(.currentSong)",
                        start: turntable.playlist.songSortStarted,
                        change: turntable.playlist.songSortChanged,
                        update: turntable.playlist.songSortUpdated
                    };
                    turntable.playlist.realQueue.sortable(b);
                    turntable.playlist.sortableEnableTimer = null;
                }, 100);
            }
        } else {
            if (turntable.playlist.sortableEnabled) {
                if (turntable.playlist.sortableEnableTimer) {
                    clearTimeout(turntable.playlist.sortableEnableTimer);
                    turntable.playlist.sortableEnableTimer = null;
                } else {
                    if ($(".song.ui-sortable-helper").length) {
                        turntable.playlist.sortableEnabled = false;
                        turntable.playlist.realQueue.sortable("cancel");
                    }
                    turntable.playlist.realQueue.sortable("destroy");
                }
            }
        }
        turntable.playlist.sortableEnabled = a;
    },
    songSortStarted: function (c, d) {
        var a = d.item.data("songData").fileId;
        for (var b = 0; b < turntable.playlist.files.length; b++) {
            if (turntable.playlist.files[b].fileId == a) {
                turntable.playlist.songSortSrcIndex = b;
                break;
            }
        }
    },
    songSortChanged: function () {
        turntable.playlist.updateTopSongClass();
    },
    songSortUpdated: function (b, d) {
        if (!turntable.playlist.sortableEnabled) {
            return;
        }
        turntable.playlist.songSortChanged();
        var a = turntable.playlist.songSortSrcIndex;
        var c = turntable.playlist.realQueue.find(".song").index(d.item);
        ASSERT(c >= 0, "Sortable song not found");
        if (turntable.playlist.currentSong) {
            ASSERT(c != 0, "Current song not sortable");
            c -= 1;
        }
        turntable.HRqMW({
            api: "playlist.reorder",
            playlist_name: "default",
            index_from: a,
            index_to: c
        }, function (f) {
            var e = turntable.playlist.files.splice(a, 1)[0];
            turntable.playlist.files.splice(c, 0, e);
        });
        setTimeout(function () {
            var e = turntable.playlist.realQueue.find(".song");
            e.removeClass("nth-child-even").filter(":even").addClass("nth-child-even");
        }, 0);
    },
    setPlaylistHeight: function (a) {
        if (a === null || a === undefined) {
            a = 351;
        } else {
            if (a < 25) {
                a = 25;
            }
        }
        $(turntable.playlist.nodes.root).css({
            height: a
        });
        $(turntable.playlist.nodes.root).find(".mainPane").css({
            height: a - 25
        });
        $(turntable.playlist.nodes.root).find(".queueView  .songlist").css({
            height: Math.max(a - 93, 55)
        });
        $(turntable.playlist.nodes.root).find(".searchView .songlist").css({
            height: Math.max(a - 95, 55)
        });
        return a;
    }
};
turntable.playlist.layouts = {
    playlistView: ["div#playlist##root.playlist-container",
    {}, ["div.black-right-header",
    {}, ["img.icon",
    {
        src: "https://s3.amazonaws.com/static.turntable.fm/images/room/music_icon.png"
    }],
        ["div.header-text",
        {}, "My DJ Queue"]
    ],
        ["div.queueView.mainPane",
        {}, ["div.addSongsButton"],
            ["form.search.playlistSearch",
            {
                event: {
                    submit: function () {
                        return false;
                    }
                }
            }, ["input",
            {
                type: "text",
                placeholder: "filter songs in queue",
                event: {
                    keyup: turntable.playlist.searchKeyUp
                }
            }],
                ["div.mag-glass",
                {
                    event: {
                        click: turntable.playlist.searchClear
                    }
                }]
            ],
            ["div.resultsLabel",
            {}, "Results for '", ["span.searchTermLabel"], "':"],
            ["div.songlist",
            {}, ["div.queue.realPlaylist"],
                ["div.uploads",
                {}, ["div.processing",
                {
                    style: {
                        display: "none"
                    }
                }, ["div.loader"],
                    ["div.text"]
                ]],
                ["div.emptyQueue",
                {
                    style: {
                        display: "none"
                    }
                }, ["div.text", "Search or upload music to create your DJ queue."],
                    ["div.text", "Click 'Play Music' and your topmost song will play during your turn."]
                ]
            ]
        ],
        ["div.addSongsView.mainPane",
        {
            style: {
                display: "none"
            }
        }, ["div.searchText", "Search Turntable music library"],
            ["form.search.songSearch",
            {
                event: {
                    submit: turntable.playlist.submitSearchQuery
                }
            }, ["input",
            {
                type: "text",
                placeholder: "track, artist, album name",
                event: {
                    keyup: turntable.playlist.searchKeyUp
                }
            }],
                ["div.mag-glass",
                {
                    event: {
                        click: turntable.playlist.searchClear
                    }
                }]
            ],
            ["div.orText", "\u2013 or \u2013"],
            ["div.upload-button", ["div#plupload", ["div#pickfiles"]]],
            ["div.cancelButton"],
            ["div.poweredBy"]
        ],
        ["div.searchView.mainPane",
        {
            style: {
                display: "none"
            }
        }, ["form.input.songSearch",
        {
            event: {
                submit: turntable.playlist.submitSearchQuery
            }
        }, ["div.search",
        {}, ["input",
        {
            type: "text",
            placeholder: "song, artist, or album",
            event: {
                keyup: turntable.playlist.searchKeyUp
            }
        }],
            ["div.mag-glass",
            {
                event: {
                    click: turntable.playlist.searchClear
                }
            }]
        ],
            ["div.searchHeader",
            {}, ["div.numFilesAdded"],
                ["div.doneButton"]
            ]
        ],
            ["div.songlist",
            {}, ["div.separator.separator-in-queue",
            {}, ["div.text", "Results from my queue"]],
                ["div.queue.inMyQueue"],
                ["div.separator.separator-in-library",
                {}, ["div.text", "Results from Turntable library"]],
                ["div.queue.externQueue"],
                ["div.emptySearchResults"],
                ["div.loadMoreSearchResults",
                {}, ["div.text",
                {}, "Loading more results..."]]
            ],
            ["div.searchingBlocker",
            {}, ["div.text", "searching..."],
                ["br"],
                ["img",
                {
                    src: "https://s3.amazonaws.com/static.turntable.fm/images/playlist/bigloader.gif"
                }]
            ]
        ]
    ],
    songView: function (b) {
        var a = b.metadata;
        return ["div.song" + (dmca.showPreview(b) ? "" : ".noPreview"), {
            data: {
                songData: b
            }
        }, ["div.progress"], ["div.goTop",
        {
            event: {
                click: turntable.playlist.moveSongToTopClicked
            }
        }], ["div.playSample",
        {
            event: {
                click: turntable.playlist.previewPlay
            }
        }], ["div.pauseSample",
        {
            event: {
                click: turntable.playlist.previewStop
            }
        }], ["div.title",
        {
            title: a.song
        }, ["div.titlediv",
        {},
        a.song],
            ["a.buy",
            {
                event: {
                    click: turntable.playlist.buySong
                }
            }]
        ], ["div.details",
        {
            title: a.artist + " - " + turntable.playlist.humanDuration(a.length)
        },
        a.artist + " - " + turntable.playlist.humanDuration(a.length)], ["div.remove",
        {
            event: {
                click: turntable.playlist.removeSongClicked
            }
        }]];
    },
    searchedSongView: function (b) {
        var a = b.metadata;
        return ["div.song", {
            data: {
                songData: b
            }
        }, ["div.progress"], ["div.addSong",
        {
            event: {
                click: turntable.playlist.addSearchResult
            }
        }], ["div.goTop",
        {
            event: {
                click: turntable.playlist.addSearchResult
            }
        }], ["div.checkmark",
        {
            event: {
                click: turntable.playlist.remSearchResult
            },
            style: {
                display: "none"
            }
        }], ["div.playSample",
        {
            style: {
                display: (dmca.showPreview(b) ? "block" : "none")
            },
            event: {
                click: turntable.playlist.previewPlay
            }
        }], ["div.pauseSample",
        {
            event: {
                click: turntable.playlist.previewStop
            }
        }], ["div.title",
        {
            title: a.song
        }, ["div.titlediv",
        {},
        a.song],
            ["a.buy",
            {
                event: {
                    click: turntable.playlist.buySong
                }
            }]
        ], ["div.details",
        {
            title: a.artist + " - " + turntable.playlist.humanDuration(a.length)
        },
        a.artist + " - " + turntable.playlist.humanDuration(a.length)], ["div.addedToQueueTop",
        {
            style: {
                display: "none"
            }
        }, ["div.text", "Added to top of queue"]]];
    },
    uploadingView: function (a) {
        return ["div.uploading", {}, ["div.progress"], ["div.text",
        {},
        a], ["div.details",
        {}, "Uploading..."]];
    }
};
var welcome = {
    elements: {},
    init: function () {
        welcome.view = util.buildTree(welcome.layouts.indexPage, welcome.elements);
        welcome.roomList = new RoomList();
        $(welcome.elements.roomListContainer).append(welcome.roomList.view);
        $(welcome.elements.userauth).append($("#userauth"));
        util.CWzdUjBgak(this);
    },
    createRoomShow: function () {
        util.showOverlay(util.buildTree(welcome.layouts.createRoomView));
        $("input.roomName").focus();
        $(".roomtype-option").click(function () {
            $(this).find(".radio-input").attr("checked", true);
            $(".roomtype-option").removeClass("roomtype-option-on");
            $(this).addClass("roomtype-option-on");
        });
    },
    createRoomSubmit: function () {
        var e = $(".createRoom");
        var b = $.trim(e.find(".roomName")[0].value);
        if (!b) {
            return;
        }
        var d = Number(e.find("select")[0].value);
        var c = {
            api: "room.create",
            room_name: b,
            max_djs: d
        };
        if (!e.find(".public")[0].checked) {
            c.privacy = "unlisted";
        }
        var a = e.find(".djThreshold").val();
        a = parseInt(a);
        if (a) {
            c.djthreshold = a;
        }
        turntable.HRqMW(c, welcome.createRoomDone);
        util.hideOverlay();
    },
    createRoomDone: function (a) {
        turntable.setPage(a.shortcut, a.roomid);
    },
    advancedOptions: function () {
        var a = $(".overlay div.advanced");
        if (a.css("display") == "none") {
            a.show();
            $(".overlay div.show-advanced").text("close advanced options");
        } else {
            a.hide();
            $(".overlay div.show-advanced").text("advanced options");
        }
    },
    cleanup: function () {
        $("#offstage").append($("#userauth"));
        welcome.roomList.cleanup();
        welcome.roomList = null;
    }
};
welcome.layouts = {
    indexPage: ["div",
    {}, ["div#header",
    {}, ["div##userauth.userauthContainer"]],
        ["div#content",
        {}, ["p.centeredImage",
        {}, ["img",
        {
            src: "https://s3.amazonaws.com/static.turntable.fm/images/logo.png"
        }]],
            ["h1",
            {}, "Play music together."],
            ["p.centeredButtons", ["a.create-btn",
            {
                event: {
                    click: welcome.createRoomShow
                }
            }],
                ["a.random-btn",
                {
                    event: {
                        click: turntable.randomRoom
                    }
                }]
            ],
            ["br"],
            ["br"],
            ["div##roomListContainer"]
        ]
    ],
    createRoomView: ["div.createRoom.modal",
    {}, ["div.close-x",
    {
        event: {
            click: util.hideOverlay
        }
    }],
        ["h1", "Create Room"],
        ["br"], "Room name:", ["br"],
        ["input.roomName.text"],
        ["br"],
        ["br"], "Set my room as:", ["div.type",
        {}, ["div.roomtype",
        {}, ["div.roomtype-option.roomtype-option-on",
        {}, "Public", ["div.radios",
        {}, ["input.radio-input.public",
        {
            type: "radio",
            name: "type",
            value: "public",
            checked: true
        }]],
            ["div.tip",
            {}, "(anyone can join)"]
        ]],
            ["div.roomtype",
            {}, ["div.roomtype-option",
            {}, "Unlisted", ["div.radios",
            {}, ["input.radio-input",
            {
                type: "radio",
                name: "type",
                value: "unlisted"
            }]],
                ["div.tip",
                {}, "(only people with the link can join)"]
            ]], ],
        ["div.advanced",
        {}, "Let up to ", ["select",
        {
            name: "maxdjs"
        }, ["option",
        {
            value: "1"
        }, "1"],
            ["option",
            {
                value: "2"
            }, "2"],
            ["option",
            {
                value: "3"
            }, "3"],
            ["option",
            {
                value: "4"
            }, "4"],
            ["option",
            {
                value: "5",
                selected: "selected"
            }, "5"]
        ], " people DJ", ["br"],
            ["br"], "Require ", ["input.djThreshold.text",
            {
                value: "0",
                size: 3
            }], " points to DJ", ["br"],
            ["br"], ],
        ["div.show-advanced",
        {
            event: {
                click: welcome.advancedOptions
            }
        }, "advanced options"],
        ["div.create-room.centered-button",
        {
            event: {
                click: welcome.createRoomSubmit
            }
        }],
        ["br"],
        ["p.cancel",
        {}, "or ", ["span.no-thanks",
        {
            event: {
                click: util.hideOverlay
            }
        }, "cancel"]]
    ]
};
var Room = Class.extend({
    description: "",
    songsDjed: [],
    users: {},
    djIds: [],
    timers: {},
    ignoredUsers: [],
    chatHistoryByUser: {},
    moderators: [],
    hasLoadedFavorites: false,
    isFavorite: false,
    init: function (b) {
        this.roomId = b;
        turntable.setSocketAddr(turntable.getHashedAddr(this.roomId));
        this.selfId = turntable.user.id;
        this.selfNewDjPoints = null;
        for (var a in this) {
            if (typeof this[a] == "function") {
                this[a] = $.proxy(this[a], this);
            }
        }
        this.loadLayout();
        turntable.showWelcome();
        this.initFavorite();
        turntable.addEventListener("auth", this.authListener);
        turntable.addEventListener("userinfo", this.userInfoListener);
        turntable.addEventListener("message", this.messageListener);
        turntable.addEventListener("reconnect", this.reconnectListener);
        turntable.addEventListener("trackstart", this.trackStartListener);
        turntable.addEventListener("trackfinish", this.trackFinishListener);
        this.loadRoomState();
        this.connectRoomSocket = function (c) {
            if (this.currentSong) {
                var f = $.sha1(this.roomId + c + this.currentSong._id);
                var d = $.sha1(Math.random() + "");
                var e = $.sha1(Math.random() + "");
                turntable.HRqMW({
                    api: "room.vote",
                    roomid: this.roomId,
                    val: c,
                    vh: f,
                    th: d,
                    ph: e
                });
            }
        };
        turntable.addIdleListener(4 * 3600, this.checkIdle);
        util.CWzdUjBgak(this);
        window.onbeforeunload = this.unloadWarning;
    },
    loadRoomStateRun: 0,
    loadRoomState: function () {
        if (util.now() / 1000 - this.loadRoomStateRun < 2) {
            LOG("THROTTLED LOADROOMSTATE");
            return;
        }
        this.loadRoomStateRun = util.now() / 1000;
        var b = $.Deferred();
        var c = {
            api: "room.info",
            roomid: this.roomId
        };
        if ($("#room-info-tab .songlog").children().size() > 0) {
            c.extended = false;
        }
        var d = $.when(turntable.HRqMW(c));
        var a = this;
        d.done(function (j) {
            a.clearRoomUsers();
            var h = j.room;
            var l = j.users;
            a.maxDjs = h.metadata.max_djs;
            a.setupRoom(h);
            var k = false;
            for (var f = 0; f < l.length; f++) {
                a.addUser(l[f]);
                if (l[f].userid == a.selfId) {
                    k = true;
                }
            }
            for (var f = 0; f < h.metadata.djs.length; f++) {
                a.addDj(h.metadata.djs[f]);
            }
            a.setCurrentSong(h.metadata);
            if (!k) {
                var g = {
                    api: "room.register",
                    roomid: a.roomId
                };
                if (a.invisibooted) {
                    g.invisibooted = true;
                    a.invisibooted = false;
                }
                var e = turntable.HRqMW(g, function (i) {
                    if (!i.success) {
                        a.lobbyRedirect(i.errno);
                        return;
                    }
                    if (a.reconnecting) {
                        turntable.socketDumpLog();
                    }
                    a.updateVotes(h.metadata, false);
                });
                e.then(b.resolve, b.resolve);
            } else {
                a.updateVotes(h.metadata, false);
                b.resolve();
            }
        });
        d.fail(function (e) {
            turntable.showAlert("The requested room could not found: " + e.err);
            b.reject();
            window.location.href = "/lobby";
        });
        return b.promise();
    },
    messageListener: function (d) {
        if (d.hasOwnProperty("msgid")) {
            return;
        }
        if (d.command == "speak") {
            this.showChatMessage(d.userid, d.name, d.text);
        } else {
            if (d.command == "newsong") {
                if (this.CZQFmJjTlznQ.time_left > 10) {
                    turntablePlayer.playEphemeral(UI_SOUND_ENDSONG, true);
                }
                this.setCurrentSong(d.room.metadata);
                this.addToSongLog(d.room.metadata.current_song);
            } else {
                if (d.command == "nosong") {
                    this.setCurrentSong(null);
                } else {
                    if (d.command == "registered") {
                        this.addUser(d.user[0]);
                    } else {
                        if (d.command == "deregistered") {
                            this.removeUser(d.user[0].userid);
                        } else {
                            if (d.command == "update_user") {
                                this.updateUser(d);
                            } else {
                                if (d.command == "add_dj") {
                                    var a = d.user[0];
                                    a.fanof = ($.inArray(a.userid, turntable.user.fanOf) != -1);
                                    this.users[a.userid] = a;
                                    this.addDj(a.userid);
                                    if (this.djIds.length > 1 && turntablePlayer.dmcaMuted) {
                                        turntablePlayer.setDmcaMute(false);
                                    }
                                } else {
                                    if (d.command == "rem_dj") {
                                        var c = d.user[0].userid;
                                        this.removeDj(c);
                                        if (d.modid) {
                                            var f = (d.modid == 1 ? " was booed off the stage." : " was kindly escorted off the stage by " + this.users[d.modid].name + ".");
                                            this.appendChatMessage(c, this.users[c].name, f, "action");
                                        }
                                    } else {
                                        if (d.command == "update_votes") {
                                            this.updateVotes(d.room.metadata, true);
                                        } else {
                                            if (d.command == "new_moderator") {
                                                if ($.inArray(d.userid, this.moderators) == -1) {
                                                    this.moderators.push(d.userid);
                                                    if (d.userid == this.selfId) {
                                                        this.showRoomTip("You are now a moderator of this room. Moderators can boot people out of the room who act inappropriately. Thanks for your help.", 10);
                                                        this.CZQFmJjTlznQ.add_moderator(this.moderators);
                                                        $("#room-info-tab .edit-description-btn").show();
                                                    }
                                                }
                                            } else {
                                                if (d.command == "rem_moderator") {
                                                    var b = $.inArray(d.userid, this.moderators);
                                                    if (b != -1) {
                                                        this.moderators.splice(b, 1);
                                                        if (d.userid == this.selfId) {
                                                            this.showRoomTip("You are no longer a moderator of this room.", 10);
                                                            this.CZQFmJjTlznQ.rem_moderator(this.moderators);
                                                            $("#room-info-tab .edit-description-btn").hide();
                                                        }
                                                    }
                                                } else {
                                                    if (d.command == "booted_user") {
                                                        if (d.userid == this.selfId) {
                                                            this.gotBooted(d.reason, this.users[d.modid].name);
                                                        } else {
                                                            this.appendChatMessage(d.userid, this.users[d.userid].name, " was booted from the room by " + this.users[d.modid].name + ".", "action");
                                                        }
                                                    } else {
                                                        if (d.command == "dmca_error") {
                                                            var e = (d.type == "song" ? "We had to skip your song because our music licenses force us to limit the number of times an artist can be played each hour in a room. Playing the next song in your list that is in compliance." : "We had to skip your turn because our music licenses force us to limit the number of times an artist can be played each hour in a room. Add some new artists to your playlist or try joining a new room.");
                                                            this.showRoomTip("Bummer! " + e, 10);
                                                        } else {
                                                            if (d.command == "update_room") {
                                                                this.updateRoomDesc(d);
                                                            } else {
                                                                if (d.command == "snagged") {
                                                                    this.handleSnagged(d);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    authListener: function () {
        if (turntable.user.id != this.selfId) {
            var a = this;
            turntable.HRqMW({
                api: "room.register",
                roomid: this.roomId
            }, function (b) {
                if (!b.success) {
                    a.lobbyRedirect(b.errno);
                    return;
                }
                ASSERT(!a.isDj(), "Guest DJ tried to login!");
                a.removeUser(a.selfId);
                a.selfId = turntable.user.id;
                a.CZQFmJjTlznQ.myuserid = a.selfId;
            });
        }
    },
    userInfoListener: function () {
        if (!this.users) {
            return;
        }
        var a;
        for (var c in this.users) {
            a = this.users[c];
            a.oldFanof = a.fanof;
            a.fanof = false;
        }
        for (var b = 0; b < turntable.user.fanOf.length; b++) {
            a = this.users[turntable.user.fanOf[b]];
            if (a) {
                a.fanof = true;
            }
        }
        if (!this.CZQFmJjTlznQ) {
            return;
        }
        for (var c in this.users) {
            a = this.users[c];
            if (a.oldFanof != a.fanof) {
                this.refreshRoomUser(a);
            }
        }
        this.CZQFmJjTlznQ[(this.isMod() ? "add" : "rem") + "_moderator"](this.moderators);
    },
    reconnectListener: function () {
        LOG("Reconnected to server");
        this.reconnecting = true;
        var b = this.isDj();
        var a = this;
        this.loadRoomState().done(function () {
            a.reconnecting = false;
            if (b && !a.isDj()) {
                turntable.showAlert("You stopped DJing because you were disconnected for too long.");
            }
        });
    },
    trackStartListener: function (a) {
        if (this.currentSong && a.fileId == this.currentSong._id) {
            var b = this.currentSong.metadata;
            this.CZQFmJjTlznQ.newsong($.inArray(this.currentDj, this.djIds), b.artist, b.song, b.length - Math.round(a.sound.position / 1000));
        }
    },
    trackFinishListener: function (a) {
        if (this.currentSong && a.fileId == this.currentSong._id) {
            this.currentSong = null;
        }
    },
    CZQFmJjTlznQCallback: function (c, d) {
        if (c == "upvote") {
            this.connectRoomSocket("up");
        } else {
            if (c == "downvote") {
                this.connectRoomSocket("down");
            }
        }
        if (c == "become_dj") {
            if (turntable.idleTime() < 15000) {
                this.becomeDj();
            }
        } else {
            if (c == "stop_song") {
                turntable.HRqMW({
                    api: "room.stop_song",
                    roomid: this.roomId
                });
                if (this.currentDj == this.selfId && this.songsDjed.length > 0 && this.songsDjed[this.songsDjed.length - 1].fileId == this.currentSong._id) {
                    this.songsDjed.pop();
                }
            } else {
                if (c == "rem_dj") {
                    this.quitDj();
                } else {
                    if (c == "remove_dj") {
                        turntable.HRqMW({
                            api: "room.rem_dj",
                            roomid: this.roomId,
                            djid: d
                        });
                    } else {
                        if (c == "set_volume") {
                            turntablePlayer.setVolume(d);
                        } else {
                            if (c == "boot_user") {
                                var b = this;
                                util.showOverlay(util.buildTree(Room.layouts.bootConfirmView(this.users[d].name, function () {
                                    var e = {
                                        api: "room.boot_user",
                                        roomid: b.roomId,
                                        target_userid: d
                                    };
                                    var f = $.trim($(".bootReasonField").val());
                                    if (f && f != "(optional)") {
                                        e.reason = f;
                                    }
                                    turntable.HRqMW(e);
                                })));
                            } else {
                                if (c == "add_song") {
                                    $(this.view).find(".addSongOverlay").remove();
                                    $(this.view).append(util.buildTree(Room.layouts.addSongOverlay(this)));
                                } else {
                                    if (c == "add_song_to") {
                                        this.addSong(d);
                                    } else {
                                        if (c == "invite_dj") {
                                            this.facebookSendDialog();
                                        } else {
                                            if (c == "become_fan") {
                                                var a = this.users[d];
                                                if (a) {
                                                    a.fanof = true;
                                                }
                                                turntable.HRqMW({
                                                    api: "user.become_fan",
                                                    djid: d
                                                });
                                            } else {
                                                if (c == "remove_fan") {
                                                    var a = this.users[d];
                                                    if (a) {
                                                        a.fanof = false;
                                                    }
                                                    turntable.HRqMW({
                                                        api: "user.remove_fan",
                                                        djid: d
                                                    });
                                                } else {
                                                    if (c == "profile") {
                                                        var b = this;
                                                        turntable.HRqMW({
                                                            api: "user.get_profile",
                                                            userid: d
                                                        }, function (e) {
                                                            b.setupProfileOverlay(e);
                                                        });
                                                    } else {
                                                        if (c == "add_moderator") {
                                                            turntable.HRqMW({
                                                                api: "room.add_moderator",
                                                                roomid: this.roomId,
                                                                target_userid: d
                                                            });
                                                        } else {
                                                            if (c == "rem_moderator") {
                                                                turntable.HRqMW({
                                                                    api: "room.rem_moderator",
                                                                    roomid: this.roomId,
                                                                    target_userid: d
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    setupProfileOverlay: function (h) {
        if (h.success) {
            $(this.view).find(".profile").remove();
            $(this.view).append(util.buildTree(Room.layouts.profileView(h)));
            var d = $(this.view).find(".profile");
            var i = d.find(".avatar").find("img");
            i.attr("src", "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/" + h.avatarid + "/fullfront.png");
            var j = d.find(".acl");
            if (h.verified) {
                j.text("Verified " + h.verified);
            } else {
                if (h.acl > 1) {
                    j.text("gatekeeper");
                } else {
                    if (h.acl > 0) {
                        j.text("superuser");
                    }
                }
            }
            var c = d.find(".twitter");
            if (!h.twitter) {
                c.hide();
            } else {
                c.attr("href", "http://twitter.com/" + h.twitter);
            }
            var e = d.find(".facebook");
            if (!h.facebook) {
                e.hide();
            } else {
                e.attr("href", h.facebook);
            }
            var a = d.find(".website");
            if (!h.website) {
                a.hide();
            } else {
                a.html(util.linkify(util.safeText(a.html())));
            }
            var g = d.find(".about");
            if (!h.about) {
                g.hide();
            } else {
                g.find(".right").html(util.brText(util.linkify(util.safeText(h.about))));
            }
            var f = d.find(".topartists");
            if (!h.topartists) {
                f.hide();
            } else {
                f.find(".right").html(util.brText(util.linkify(util.safeText(h.topartists))));
            }
            var b = d.find(".hangout");
            if (!h.hangout) {
                b.hide();
            } else {
                b.find(".right").html(util.brText(util.linkify(util.safeText(h.hangout))));
            }
            $(this.view).find(".profile").fadeIn();
        }
    },
    addSong: function (c, f) {
        if (!f) {
            if (!this.currentSong) {
                return;
            }
            f = this.currentSong;
        }
        var b = (f._id in turntable.playlist.songsByFid);
        if (c == "queue") {
            var e;
            if (b) {
                e = "This song is already in your playlist!";
            } else {
                turntable.playlist.addSong({
                    fileId: f._id,
                    metadata: f.metadata
                });
                e = "Song added to queue.";
            }
            this.showRoomTip(e, 5);
        } else {
            window.open("/link/?fileid=" + f._id + "&site=" + c, c + f._id);
        }
        var a = f ? f.djid : this.currentDj;
        var d = (f == this.currentSong) ? "board" : "songlog";
        this.sendSnag(turntable.user.id, this.roomId, a, f._id, c, d, (b ? "true" : "false"));
    },
    sendSnag: function (g, d, b, f, a, j, c) {
        if (b) {
            var h = $.sha1(Math.random() + "");
            var k = $.sha1(Math.random() + "");
            var i = [g, b, f, d, a, j, c, h];
            var e = $.sha1(i.join("/"));
            turntable.HRqMW({
                api: "snag.add",
                djid: b,
                songid: f,
                roomid: d,
                site: a,
                location: j,
                in_queue: c,
                vh: e,
                sh: h,
                fh: k
            });
        }
    },
    handleSnagged: function (a) {
        this.CZQFmJjTlznQ.show_heart(a.userid);
    },
    userIdFromName: function (b) {
        for (var c in this.users) {
            var a = this.users[c];
            if (a && a.name == b) {
                return c;
            }
        }
        return null;
    },
    speak: function (e) {
        e.preventDefault();
        var g = this.nodes.chatText.value;
        if (!g) {
            return;
        }
        this.nodes.chatText.value = "";
        if (g.indexOf("/ignore ") == 0) {
            var f = g.substr(8);
            var d = this.userIdFromName(f);
            if (d && $.inArray(d, this.ignoredUsers) == -1) {
                this.ignoredUsers.push(d);
                this.appendChatMessage(d, f, " will be ignored.");
            }
            return;
        } else {
            if (g.indexOf("/unignore ") == 0) {
                var f = g.substr(10);
                var d = this.userIdFromName(f);
                if (d) {
                    var c = $.inArray(d, this.ignoredUsers);
                    if (c != -1) {
                        this.ignoredUsers.splice(c, 1);
                        this.appendChatMessage(d, f, " will be ignored no more.");
                    }
                }
                return;
            }
        }
        var b = turntable.HRqMW({
            api: "room.speak",
            roomid: this.roomId,
            text: g
        });
        var a = this;
        b.fail(function (h) {
            if (h && h.err == "user not in room") {
                a.invisibooted = true;
                a.reconnectListener();
            }
        });
    },
    clearRoomUsers: function () {
        for (var b = 0; b < this.djIds.length; b++) {
            this.CZQFmJjTlznQ.rem_dj(b);
        }
        this.djIds = [];
        for (var a in this.users) {
            this.CZQFmJjTlznQ.rem_listener(this.users[a]);
        }
        this.users = {};
    },
    cleanup: function () {
        this.clearRoomUsers();
        turntable.removeEventListener("auth", this.authListener);
        turntable.removeEventListener("userinfo", this.userInfoListener);
        turntable.removeEventListener("message", this.messageListener);
        turntable.removeEventListener("reconnect", this.reconnectListener);
        turntable.removeEventListener("trackstart", this.trackStartListener);
        turntable.removeEventListener("trackfinish", this.trackFinishListener);
        if (this.roomList) {
            this.roomList.cleanup();
            this.roomList = null;
        }
        $("#offstage").append($("#userauth"));
        $("#offstage").append($("#playlist"));
        turntablePlayer.stop();
        turntable.HRqMW({
            api: "room.deregister",
            roomid: this.roomId
        });
        turntable.playlist.resetQueueView();
        for (var a in this.timers) {
            if (this.timers[a]) {
                clearTimeout(this.timers[a]);
            }
        }
        Room.layouts.zeroClip.destroy();
        Room.layouts.zeroClip = null;
        window.onbeforeunload = null;
    },
    getEntropyForUser: function (a) {
        return turntable.seedPRNG(a.userid + a.points + this.roomId + Math.round(turntable.serverNow() / (6 * 3600)));
    },
    loadLayout: function () {
        this.nodes = {};
        this.view = util.buildTree(Room.layouts.page(this.toggleFavorite), this.nodes);
        $(this.nodes.userauth).append($("#userauth"));
        $(this.nodes.playlist).append($("#playlist"));
        $(this.view).find(".searchView").hide();
        $(this.nodes.logo).click(util.eventHandlerDecorator(function () {
            window.location.href = "/lobby";
        }));
        $(this.nodes.listRooms).click(this.listRoomsShow);
        $(this.nodes.randomRoom).click(turntable.randomRoom);
        $(this.view).find(".feedback").click(this.feedbackifyShow);
        $(this.view).find(".roomTip").click(this.hideRoomTip);
        $(this.nodes.chatForm).submit(this.speak);
        if (util.getSetting("playding") == "true") {
            $(this.nodes.chatSound).addClass("checked");
        }
        $(this.nodes.chatSound).bind({
            mousedown: function (b) {
                b.stopPropagation();
            },
            selectstart: function (b) {
                b.preventDefault();
            },
            click: function () {
                $(".chatsound").toggleClass("checked");
                util.setSetting("playding", $(".chatsound").hasClass("checked"));
            }
        });
        $(this.view).find(".chatHeader").mousedown(this.chatResizeStart);
        var a = parseInt(util.getSetting("chatOffset"));
        this.chatResizeSetOffset(isNaN(a) ? this.chatOffsetTop : a);
        $(this.nodes.copyText).val(location.href);
    },
    initFavorite: function () {
        if (turntable.favorites) {
            this.hasLoadedFavorites = true;
            if (this.roomId in turntable.favorites) {
                $(this.nodes.favorite).addClass("favorite-on");
                this.isFavorite = true;
            }
        }
    },
    toggleFavorite: function () {
        if (this.hasLoadedFavorites) {
            var a = this;
            if (!this.isFavorite) {
                turntable.HRqMW({
                    api: "room.add_favorite",
                    roomid: this.roomId
                }, function (b) {
                    if (b.success) {
                        $(a.nodes.favorite).addClass("favorite-on");
                        a.isFavorite = true;
                        turntable.favorites[a.roomId] = true;
                    }
                });
            } else {
                turntable.HRqMW({
                    api: "room.rem_favorite",
                    roomid: this.roomId
                }, function (b) {
                    if (b.success) {
                        $(a.nodes.favorite).removeClass("favorite-on");
                        a.isFavorite = false;
                        delete turntable.favorites[a.roomId];
                    }
                });
            }
        }
    },
    onAddedToStage: function () {
        if (!Room.layouts.zeroClip) {
            Room.layouts.zeroClip = new ZeroClipboard.Client();
        }
        Room.layouts.zeroClip.setHandCursor(true);
        Room.layouts.zeroClip.setText(location.href);
        Room.layouts.zeroClip.glue(this.nodes.zeroClipButton, this.nodes.zeroClipContainer);
        $("#room-info-tab").show();
        $("#room-info-tab .button").click(this.toggleRoomInfo);
        $("#room-info-tab .edit-description-btn").click(this.toggleEditDesc);
    },
    setupRoom: function (d) {
        $(this.nodes.roomName).text(d.name);
        var c = d.metadata.moderator_id;
        this.moderators = (c ? ($.type(c) == "array" ? c : [c]) : []);
        this.creatorId = d.metadata.creator && d.metadata.creator.userid;
        this.setupSharing(d.name);
        this.updateRoomDesc(d);
        if (d.metadata.creator) {
            $("#room-info-tab .creator").html("<b>Created by:</b> " + util.safeText(d.metadata.creator.name));
        }
        if (d.metadata.songlog) {
            $("#room-info-tab .songlog").empty();
            for (var b = 0; b < d.metadata.songlog.length; b++) {
                this.addToSongLog(d.metadata.songlog[b]);
            }
        }
        if (!this.isMod()) {
            $("#room-info-tab .edit-description-btn").hide();
        }
        if (!this.CZQFmJjTlznQ) {
            this.CZQFmJjTlznQ = new ulXJpdM($(this.nodes.roomArea), d.metadata.max_djs, 527, 603, this.CZQFmJjTlznQCallback, this.selfId);
            var a = parseInt(util.getSetting("volume")) || turntablePlayer.volume;
            this.CZQFmJjTlznQ.set_volume(a);
            turntablePlayer.setVolume(a);
            $("#left_speaker").mouseenter().mouseleave();
        }
        if (this.isMod()) {
            this.CZQFmJjTlznQ.add_moderator(this.moderators);
        } else {
            this.CZQFmJjTlznQ.rem_moderator(this.moderators);
        }
    },
    setupSharing: function (e) {
        var d = this;
        var c = function () {
                if (d.currentSong) {
                    var h = d.currentSong.metadata.coverart;
                    if (h) {
                        return h.replace("_50", "_100");
                    }
                }
                return "";
            };
        var b = function () {
                var h = "";
                if (d.currentSong) {
                    h = "Now playing: " + d.currentSong.metadata.artist + " - " + d.currentSong.metadata.song;
                }
                return h;
            };
        var a = function () {
                var h = e;
                if (!h.match(/^the/i)) {
                    h = "the " + h;
                }
                if (!h.match(/room$/i)) {
                    h = h + " room";
                }
                return h;
            };
        var g = function () {
                var m = ["DJing in " + a() + ".", " Come hang out.", " \u266B\u266A", " #turntablefm"];
                var l = [1, -2, -1];
                if (d.currentSong) {
                    m.splice(2, 0, " Now playing " + d.currentSong.metadata.artist, ": " + d.currentSong.metadata.song);
                    l.splice(2, 0, 3);
                }
                var j = 0;
                for (var k = 0; k < m.length; k++) {
                    j += m[k].length;
                }
                for (var k = 0; k < l.length && j > 120; k++) {
                    var h = l[k];
                    if (h < 0) {
                        h += m.length;
                    }
                    j -= m[h].length;
                    m[h] = "";
                }
                return encodeURIComponent(m.join(""));
            };
        var f = encodeURIComponent(location.href);
        $("#email-button").click(function () {
            var h = b();
            var l = a();
            var i = "Let's hang out and play music together";
            var k = "Hey there,\n\nCome DJ with me at " + location.href + "\n\nI'm in " + l + " rocking out right now. Invite anyone else you want by sending them the room link.\n\n" + h;
            var j = window.open("mailto:?subject=" + encodeURIComponent(i) + "&body=" + encodeURIComponent(k));
            if (j && j.open && !j.closed) {
                j.close();
            }
        });
        $("#twitter-button").click(function () {
            var l = g();
            var i = 600;
            var h = 300;
            var k = (screen.width / 2) - (i / 2);
            var j = (screen.height / 3) - (h / 2);
            window.open("http://twitter.com/share?text=" + l + "&url=" + f, "tweet", "menubar=0,resizable=0,width=" + i + ",height=" + h + ",left=" + k + ",top=" + j);
        });
        $("#fb-button").click(function () {
            var j = g();
            var o = a();
            var l = c();
            var m = "turntable.fm+lets+you+listen+to+music+at+the+same+time+with+your+friends.";
            var h = b();
            if (h) {
                m = h;
            }
            var i = 1000;
            var p = 460;
            var k = (screen.width / 2) - (i / 2);
            var n = (screen.height / 3) - (p / 2);
            window.open("https://www.facebook.com/dialog/feed?app_id=127146244018710&redirect_uri=" + encodeURIComponent("http://" + location.host + "/close_window") + "&link=" + f + "&picture=" + l + "&caption=Come+join+me+and+let's+listen+to+music+together&description=" + m + "&name=I'm+in+" + util.title(o) + "+on+turntable.fm", "fb", "menubar=0,resizable=0,width=" + i + ",height=" + p + ",left=" + k + ",top=" + n);
        });
    },
    addToSongLog: function (c) {
        var b = $("#room-info-tab .songlog");
        var a = util.buildTree(Room.layouts.songView(this, c));
        if (b.find(".song").length % 2) {
            $(a).addClass("song2");
        }
        b.prepend(a);
        this.updateScoreInSongLog(c.score || 0.5);
    },
    updateScoreInSongLog: function (a) {
        var b = $("#room-info-tab .score:first");
        if (a >= 0.5) {
            b.addClass("scoregood");
            b.removeClass("scorebad");
        } else {
            b.removeClass("scoregood");
            b.addClass("scorebad");
        }
        b.html("Room vote: " + Math.round(a * 100) + "%");
    },
    samplePlay: function (a) {
        var b = $(a).closest(".song");
        turntablePlayer.samplePlay(b.data("songData")._id, this.sampleCallback);
        b.addClass("currentPreview");
    },
    sampleCallback: function (b, a) {
        if (b == "progress") {
            $("#room-info-tab .currentPreview .progress").css({
                width: a
            });
        } else {
            if (b == "stop") {
                $("#room-info-tab .currentPreview .progress").css({
                    width: "0%"
                });
                $("#room-info-tab .currentPreview").removeClass("currentPreview");
            }
        }
    },
    isMod: function () {
        return ($.inArray(this.selfId, this.moderators) != -1 || turntable.user.acl > 0);
    },
    toggleRoomInfo: function () {
        var b = $("#room-info-tab .button");
        var a;
        if (!b.hasClass("upbutton")) {
            a = {
                top: "+=350"
            };
            b.addClass("upbutton");
        } else {
            a = {
                top: "-=350"
            };
            b.removeClass("upbutton");
        }
        globalMove = a;
        b.animate(a);
        $("#room-info-tab .content").animate(a);
    },
    toggleEditDesc: function () {
        var b = $("#room-info-tab .edit-description-btn");
        var a = $("#room-info-tab .edit-description .edit");
        if (!a.hasClass("editing")) {
            a.val(this.description);
            $("#room-info-tab .edit-description").show();
            b.html("Save");
            a.addClass("editing");
        } else {
            if (a.val() != this.description) {
                turntable.HRqMW({
                    api: "room.modify",
                    roomid: this.roomId,
                    description: a.val()
                });
                this.description = a.val();
            }
            $("#room-info-tab .edit-description").hide();
            b.html("Edit Description");
            a.removeClass("editing");
        }
    },
    updateRoomDesc: function (a) {
        if (a.description) {
            $("#room-info-tab .description").html(util.linkify(util.safeText(a.description)));
            this.description = a.description;
        }
    },
    facebookSendDialog: function () {
        var b = 465;
        var a = 225;
        var d = (screen.width / 2) - (b / 2);
        var c = (screen.height / 3) - (a / 2);
        window.open("https://www.facebook.com/plugins/send_button_form_shell.php?api_key=113869198637480&nodeImageURL=http://static.turntable.fm/images/record_logo.gif&nodeSummary=turntable.fm+lets+you+listen+to+music+at+the+same+time+with+your+friends.&nodeTitle=Play+music+together.&nodeURL=" + encodeURIComponent(location.href), "fb", "menubar=0,resizable=0,width=" + b + ",height=" + a + ",left=" + d + ",top=" + c);
    },
    feedbackifyShow: function () {
        FBY.showForm("633");
        this.feedbackifyInstrument();
    },
    feedbackifyInstrument: function () {
        var b = $("#feedbackify .fsend");
        if (b.length == 0) {
            setTimeout(this.feedbackifyInstrument, 300);
            return;
        }
        var a = b.filter(".new");
        if (a.length == 0) {
            var a = b.clone(false).addClass("new");
            a.insertAfter(b);
            a.click(function () {
                var c = $("#feedbackify .feedback-holder textarea");
                var d = c.val();
                if (typeof d == "string") {
                    c.val(d + "\n\nSent by user " + turntable.user.id + "\n" + navigator.userAgent);
                }
                $(".fsend.new").hide();
                $(".fsend.old").show();
                YUI().use("node-event-simulate", function (e) {
                    e.one(".fsend.old").simulate("click");
                });
            });
        } else {
            a.show();
        }
        b.addClass("old").hide();
    },
    listRoomsShow: function (a) {
        var c = util.buildTree(Room.layouts.listRooms);
        this.roomList = new RoomList(this.roomId);
        $(c).find(".roomIndexContainer").append(this.roomList.view);
        $(c).find(".close").click(this.listRoomsHide);
        var b = this;
        $(c).find(".createRoom").click(function () {
            b.listRoomsHide();
            welcome.createRoomShow();
        });
        util.showOverlay(c);
    },
    listRoomsHide: function (a) {
        this.roomList.cleanup();
        this.roomList = null;
        util.hideOverlay();
    },
    addUser: function (a) {
        ASSERT(this.CZQFmJjTlznQ != null, "Room manager not setup yet!");
        var b = this.users.hasOwnProperty(a.userid);
        a.fanof = ($.inArray(a.userid, turntable.user.fanOf) != -1);
        this.users[a.userid] = a;
        if (b) {
            this.refreshRoomUser(a);
        } else {
            this.CZQFmJjTlznQ.add_listener(a, this.getEntropyForUser(a));
            this.refreshUserVote(a);
        }
    },
    removeUser: function (b) {
        if (!this.users.hasOwnProperty(b)) {
            LOG(b + " is not a user!");
            return;
        }
        var a = this.users[b];
        delete this.users[b];
        if (this.chatHistoryByUser[b]) {
            delete this.chatHistoryByUser[b];
        }
        this.CZQFmJjTlznQ.rem_listener(a);
    },
    numUsers: function () {
        var b = 0;
        for (var a in this.users) {
            if (this.users.hasOwnProperty(a) && this.users[a]) {
                b += 1;
            }
        }
        return b;
    },
    numDjs: function () {
        return this.djIds.length;
    },
    updateUser: function (b) {
        var a = this.users[b.userid];
        if (!a) {
            return;
        }
        if (b.hasOwnProperty("avatarid")) {
            a.avatarid = b.avatarid;
        }
        if (b.hasOwnProperty("name")) {
            a.name = b.name;
        }
        if (b.hasOwnProperty("fans")) {
            if (!a.fans) {
                a.fans = 0;
            }
            a.fans += b.fans;
        }
        this.refreshRoomUser(a);
    },
    refreshRoomUser: function (b) {
        var a = $.inArray(b.userid, this.djIds);
        if (a == -1) {
            this.CZQFmJjTlznQ.rem_listener(b);
            this.CZQFmJjTlznQ.add_listener(b, this.getEntropyForUser(b));
        } else {
            this.CZQFmJjTlznQ.rem_dj(a);
            this.CZQFmJjTlznQ.add_dj(b, a);
            if (b.userid == this.currentDj) {
                this.CZQFmJjTlznQ.set_active_dj(a);
            }
        }
        this.refreshUserVote(b);
    },
    refreshUserVote: function (a) {
        if ($.inArray(a.userid, this.upvoters) != -1) {
            this.CZQFmJjTlznQ.update_vote(a, "up");
        }
    },
    addDj: function (b) {
        if ($.inArray(b, this.djIds) != -1) {
            this.removeDj(b);
        }
        if (this.djIds.length < this.maxDjs) {
            var a = this.users[b];
            this.CZQFmJjTlznQ.rem_listener(a);
            this.CZQFmJjTlznQ.add_dj(a, this.djIds.length);
            this.refreshUserVote(a);
            this.djIds.push(b);
        } else {
            this.loadRoomState();
        }
    },
    removeDj: function (c) {
        var b = $.inArray(c, this.djIds);
        if (b == -1) {
            return;
        }
        this.djIds.splice(b, 1);
        this.CZQFmJjTlznQ.rem_dj(b);
        for (; b < this.djIds.length; b++) {
            this.CZQFmJjTlznQ.rem_dj(b + 1);
            var e = this.djIds[b];
            var d = this.users[e];
            this.CZQFmJjTlznQ.add_dj(d, b);
            if (e == this.currentDj) {
                this.CZQFmJjTlznQ.set_active_dj(b);
            } else {
                this.refreshUserVote(d);
            }
        }
        var a = this.users[c];
        if (a) {
            this.CZQFmJjTlznQ.add_listener(a, this.getEntropyForUser(a));
            this.refreshUserVote(a);
        }
    },
    becomeDj: function () {
        if (this.isDj()) {
            return;
        }
        if (turntable.playlist.files.length == 0) {
            turntable.showAlert("You must have songs in your queue to become a DJ.");
            return;
        }
        var a = this;
        turntable.HRqMW({
            api: "room.add_dj",
            roomid: this.roomId
        }, function (b) {
            if (!b.success && !a.isDj()) {
                turntable.showAlert(b.err);
            }
        });
    },
    quitDj: function () {
        if (this.isDj()) {
            turntable.HRqMW({
                api: "room.rem_dj",
                roomid: this.roomId
            });
        }
    },
    isDj: function () {
        return ($.inArray(this.selfId, this.djIds) != -1);
    },
    unloadWarning: function () {
        if (this.isDj()) {
            return "Warning: if you leave this page, you'll give up your DJ spot.";
        }
    },
    isMention: function (a) {
        return a && (a.toLowerCase().indexOf("@" + turntable.user.displayName.toLowerCase()) >= 0);
    },
    showChatMessage: function (b, c, e) {
        if ($.inArray(b, this.ignoredUsers) == -1) {
            var d = this.chatHistoryByUser[b];
            if (!d) {
                this.chatHistoryByUser[b] = d = [];
            }
            d.push($.trim(e));
            while (d.length > 3) {
                d.shift();
            }
            if (d.length == 3 && d[0] == d[1] && d[1] == d[2]) {
                if (b == this.selfId) {
                    this.appendChatMessage(b, c, " sounds like a broken record.", "action");
                }
                return;
            }
            if (e.indexOf("/me ") == 0) {
                this.appendChatMessage(b, c, e.substr(3));
                if (this.CZQFmJjTlznQ) {
                    this.CZQFmJjTlznQ.speak(this.users[b], "*" + e.substr(4) + "*");
                }
            } else {
                var a = this.isMention(e) ? "mention" : undefined;
                this.appendChatMessage(b, c, ": " + e, a);
                if (this.CZQFmJjTlznQ) {
                    this.CZQFmJjTlznQ.speak(this.users[b], e);
                }
            }
            if ($(".chatsound").hasClass("checked")) {
                turntablePlayer.playEphemeral(UI_SOUND_CHAT, true);
            }
        }
    },
    appendChatMessage: function (f, a, h, j) {
        var e = this.nodes.chatLog;
        var g = (e.scrollTop + $(e).height() + 20 >= e.scrollHeight);
        var b = util.buildTree(Room.layouts.chatMessage);
        var i = this;
        $(b).find(".speaker").text(a).click(function () {
            i.CZQFmJjTlznQ.toggle_listener(f);
        });
        var c = $(b).find(".text");
        h = util.stripComboDiacritics(h);
        if (h.length > 446) {
            c.attr("title", h.substr(0, 2) == ": " ? h.substr(2) : h);
            h = h.substr(0, 440) + "...";
        }
        c.html(util.linkify(util.safeText(h)));
        if (j) {
            $(b).addClass(j);
        }
        $(e).append(b);
        if (g) {
            e.scrollTop += 9001;
        }
        var d = $(e).find(".message");
        if (d.length > 500) {
            d.slice(0, 2).remove();
        }
    },
    votes: 0,
    upvoters: [],
    currentSong: null,
    setCurrentSong: function (j) {
        var a = util.now() / 1000;
        var c = (j ? j.current_dj : null);
        var f = (j ? j.current_song : null);
        if (!c || !f) {
            c = f = null;
        }
        var b = !(this.currentSong && f && this.currentSong._id == f._id && Math.abs(this.currentSong.starttime - f.starttime) < 0.1);
        this.upvoters = [];
        this.CZQFmJjTlznQ.move_needle(0.5);
        this.currentDj = c;
        if (b) {
            turntablePlayer.stop();
            if (this.selfNewDjPoints !== null) {
                turntable.user.djPoints = this.selfNewDjPoints;
            }
            if (this.timers.dmcaMute) {
                clearTimeout(this.timers.dmcaMute);
                this.timers.dmcaMute = null;
            }
        }
        if (f) {
            var k = f.metadata;
            var d = a - turntable.clientTimeDelta;
            if (d < f.starttime) {
                d = f.starttime;
                turntable.clientTimeDelta = a - d;
            }
            var g = $.inArray(this.currentDj, this.djIds);
            if (b) {
                this.appendChatMessage(this.currentDj, this.users[this.currentDj].name, ' started playing "' + f.metadata.song + '" by ' + f.metadata.artist);
                turntablePlayer.playSong(this.roomId, f._id, f.starttime + turntable.clientTimeDelta + 2);
                this.CZQFmJjTlznQ.loadingsong(g);
            } else {
                this.CZQFmJjTlznQ.set_active_dj(g);
            }
            this.currentSong = f;
            if (this.currentDj == this.selfId && this.numDjs() == 1) {
                this.timers.dmcaMute = setTimeout(this.dmcaMute, 30 * 1000);
            }
        } else {
            this.CZQFmJjTlznQ.nosong();
            this.currentSong = null;
        }
        if (b) {
            turntable.playlist.setCurrentSong(this.currentDj == this.selfId ? f : null);
            if (this.currentDj == this.selfId) {
                while (this.songsDjed.length && this.songsDjed[0].time + 3 * 3600 < a) {
                    this.songsDjed.shift();
                }
                var e = false;
                for (var h = 0; h < this.songsDjed.length; h++) {
                    if (this.songsDjed[h].fileId == f._id) {
                        e = true;
                        break;
                    }
                }
                if (!e) {
                    this.songsDjed.push({
                        fileId: f._id,
                        time: a
                    });
                } else {
                    if (turntable.idleTime() > 120 * 1000) {}
                }
            } else {
                if (turntable.idleTime() > 30 * 60 * 1000) {
                    if (this.isDj()) {
                        this.showRoomTip("It looks like you've been falling asleep at the deck. How about taking a break from DJing?");
                        this.quitDj();
                    }
                }
            }
        }
    },
    dmcaMute: function () {
        this.timers.dmcaMute = null;
        if (this.numDjs() != 1) {
            return;
        }
        turntablePlayer.setDmcaMute(true);
        this.showRoomTip("We can only play you a preview of your song until someone else also starts DJing. Everyone else can still hear the song playing.");
    },
    updateVotes: function (i, g) {
        var e = (i.upvotes - i.downvotes + i.listeners) / (2 * i.listeners);
        if (e) {
            this.CZQFmJjTlznQ.move_needle(e);
            this.updateScoreInSongLog(e);
        }
        var h = this.upvoters.length;
        for (var f = 0; f < i.votelog.length; f++) {
            var d = i.votelog[f];
            var b = this.users[d[0]];
            if (b) {
                this.CZQFmJjTlznQ.update_vote(b, d[1]);
                var a = $.inArray(b.userid, this.upvoters);
                if (d[1] == "up" && a == -1) {
                    this.upvoters.push(b.userid);
                } else {
                    if (d[1] == "down" && a != -1) {
                        this.upvoters.splice(a, 1);
                    }
                }
            }
        }
        if (g) {
            ASSERT(this.currentDj, "Somebody voted but no DJ was active");
            if (h != this.upvoters.length) {
                var c = this.users[this.currentDj];
                c.points += (this.upvoters.length - h);
                this.CZQFmJjTlznQ.set_dj_points(c.points);
                if (this.currentDj == this.selfId) {
                    this.selfNewDjPoints = c.points;
                }
            }
        }
    },
    lobbyRedirect: function (a) {
        var b = "Sorry, you weren't able to enter the room (error " + a + "). Please choose another room.";
        if (a == 1) {
            b = "Due to fire codes, this room is at maximum capacity. We'll escort you back to the lobby.";
        } else {
            if (a == 2) {
                b = "Looks like you're already in another room. Please close that room before entering another one.";
            } else {
                if (a == 3) {
                    b = "The bouncer has decided not to let you in, and will escort you back to the lobby.";
                }
            }
        }
        turntable.showAlert(b, function () {
            window.location.href = "/lobby";
        });
        this.setCurrentSong(null);
    },
    gotBooted: function (c, b) {
        if (!b) {
            b = "The Moderator";
        }
        var a = (c ? " (Reason: " + c + ")" : "");
        util.showOverlay(util.buildTree(["div.booted.modal",
        {}, ["div.unhappyFace"],
            ["br"], b, " booted you from the room.", a, ["br"],
            ["br"], "We'll take you back to the lobby to choose a new room.", ["br"],
            ["br"],
            ["div.ok-button.centered-button",
            {
                event: {
                    click: function () {
                        util.hideOverlay();
                        window.location.href = "/lobby";
                    }
                }
            }]
        ]));
    },
    checkIdle: function () {
        turntable.showAlert("Hey sleepyhead, are you idle? Click OK to continue listening, or you will be escorted to the lobby in two minutes.");
        var a = this;
        this.originalVolume = turntablePlayer.volume;
        turntablePlayer.setVolume(0);
        this.timers.checkIdle = setTimeout(function () {
            a.timers.checkIdle = null;
            turntable.removeEventListener("unidle", a.cancelIdleBoot);
            util.hideOverlay();
            turntablePlayer.setVolume(a.originalVolume);
            window.location.href = "/lobby";
        }, 120 * 1000);
        turntable.addEventListener("unidle", this.cancelIdleBoot);
    },
    cancelIdleBoot: function () {
        clearTimeout(this.timers.checkIdle);
        this.timers.checkIdle = null;
        turntable.removeEventListener("unidle", this.cancelIdleBoot);
        util.hideOverlay();
        turntablePlayer.setVolume(this.originalVolume);
    },
    showRoomTip: function (c, a) {
        var b = $(".roomTip .text");
        b.text(c);
        if (this.timers.hideRoomTip) {
            clearTimeout(this.timers.hideRoomTip);
            this.timers.hideRoomTip = null;
        } else {
            $(".roomTip").fadeIn();
        }
        setTimeout(function () {
            b.css("margin-top", ($(".roomTip").height() - b.height()) / 2 + "px");
        }, 0);
        if (a) {
            this.timers.hideRoomTip = setTimeout(this.hideRoomTip, a * 1000);
        }
    },
    hideRoomTip: function () {
        $(".roomTip").fadeOut();
        if (this.timers.hideRoomTip) {
            clearTimeout(this.timers.hideRoomTip);
            this.timers.hideRoomTip = null;
        }
    },
    chatResizeStartY: 0,
    chatOffsetTop: 351,
    chatOffsetTopOld: 351,
    chatResizeSetOffset: function (a) {
        a = turntable.playlist.setPlaylistHeight(a);
        $(this.view).find(".chat-container").css({
            top: a,
            height: 602 - a
        });
        $(this.view).find(".chat-container .messages").css({
            height: 539 - a
        });
        this.chatOffsetTop = a;
    },
    chatResizeStart: function (a) {
        $(document.body).bind("mousemove", this.chatResizeMove);
        $(document.body).bind("mouseup mouseout", this.chatResizeStop);
        $(document.body).bind("selectstart", this.chatResizeCancelSelect);
        $(".chatHeader").addClass("active");
        this.chatOffsetTopOld = this.chatOffsetTop;
        this.chatResizeStartY = a.pageY;
    },
    chatResizeMove: function (a) {
        this.chatOffsetTop = this.chatOffsetTopOld + (a.pageY - this.chatResizeStartY);
        if (this.chatOffsetTop > 577) {
            this.chatOffsetTop = 577;
        }
        this.chatResizeSetOffset(this.chatOffsetTop);
    },
    chatResizeCancelSelect: function (a) {
        a.preventDefault();
    },
    chatResizeStop: function (a) {
        if (a.type == "mouseout" && $(a.target).closest("#outer").length) {
            return;
        }
        $(document.body).unbind("mousemove", this.chatResizeMove);
        $(document.body).unbind("mouseup mouseout", this.chatResizeStop);
        $(document.body).unbind("selectstart", this.chatResizeCancelSelect);
        $(".chatHeader").removeClass("active");
        this.chatOffsetTopOld = this.chatOffsetTop;
        util.setSetting("chatOffset", String(this.chatOffsetTop));
    }
});
Room.layouts = {
    zeroClip: null,
    page: function (a) {
        return (["div.roomView",
        {}, ["div#top-panel",
        {}, ["div#room-info-tab",
        {}, ["div.content",
        {}, ["div.infowrap",
        {}, ["div.creator"],
            ["div.edit-description-btn",
            {}, "Edit Description"],
            ["div.edit-description",
            {}, ["textarea.edit"]],
            ["div.description"]
        ],
            ["div",
            {}, ["div.title",
            {}, "Recent songs:"],
                ["div.songlog"]
            ]
        ],
            ["div.button"]
        ],
            ["div.header",
            {}, ["div##logo.logo"],
                ["div##userauth.userauthContainer"],
                ["div.room-buttons",
                {}, ["div##listRooms.list"],
                    ["div##randomRoom.random"]
                ],
                ["div.search",
                {}, ["input",
                {
                    type: "text",
                    value: "room name, artist, song, or user"
                }],
                    ["div.mag-glass"]
                ]
            ],
            ["div.info",
            {}, ["div.room",
            {}, ["div##favorite.favorite",
            {
                event: {
                    click: a
                }
            }],
                ["div##roomName.name"]
            ],
                ["div.feedback"],
                ["div.faqButton",
                {
                    event: {
                        click: function () {
                            open("/static/faq.html");
                        }
                    }
                }],
                ["div.url",
                {}, ["div.title",
                {}, "Link:"],
                    ["div.copy-link",
                    {}, ["input##copyText",
                    {
                        type: "text"
                    }]],
                    ["div##zeroClipContainer.zeroClipContainer",
                    {}, ["div##zeroClipButton.zeroClipButton"]]
                ],
                ["div.share-on",
                {}, ["div.title",
                {}, "Share:"],
                    ["div#fb-button.facebook.icon"],
                    ["div#twitter-button.twitter.icon"],
                    ["div#email-button.email.icon"]
                ]
            ]
        ],
            ["div##roomArea",
            {
                style: {
                    position: "absolute",
                    top: "100px"
                }
            }],
            ["div.roomTip",
            {}, ["div.roomTipClose"],
                ["div.text"]
            ],
            ["div#right-panel",
            {}, ["div##playlist"],
                ["div.chat-container",
                {}, ["div.chatHeader.black-right-header",
                {}, ["img.icon",
                {
                    src: "https://s3.amazonaws.com/static.turntable.fm/images/room/chat_icon.png"
                }],
                    ["div.header-text",
                    {}, "Chat"],
                    ["div##chatSound.chatsound",
                    {}, ["div.dingOn", "ding on"],
                        ["div.dingOff", "ding off"]
                    ],
                    ["div.chatResizeIcon"]
                ],
                    ["div##chatLog.messages"],
                    ["form##chatForm.input-box",
                    {}, ["input##chatText",
                    {
                        type: "text",
                        placeholder: "enter a message"
                    }]]
                ]
            ]
        ]);
    },
    chatMessage: ["div.message",
    {}, ["span.speaker"],
        ["span.text"]
    ],
    listRooms: ["div.listRooms.modal",
    {}, ["div.roomIndexContainer"],
        ["div.closeFooter",
        {}, ["a.close", "close"], " or ", ["a.createRoom", "create new room"]]
    ],
    addSongOverlay: function (b) {
        var a = function (c) {
                return {
                    event: {
                        click: function () {
                            b.addSong(c);
                        }
                    }
                };
            };
        return ["div.addSongOverlay", {}, ["div.close-x",
        {
            event: {
                click: function () {
                    $(".addSongOverlay").remove();
                }
            }
        }], ["div.content",
        {}, "Add song to:", ["div.options",
        {}, ["div.btn.queue", a("queue"), ["div.text", "queue"]],
            ["div.btn.amazon", a("amazon"), ["div.text", "amazon"]],
            ["div.btn.itunes", a("itunes"), ["div.text", "iTunes"]],
            ["div.btn.lastfm", a("lastfm"), ["div.text", "last.fm"]],
            ["div.btn.spotify", a("spotify"), ["div.text", "spotify"]],
            ["div.btn.rdio", a("rdio"), ["div.text", "rdio"]]
        ]]];
    },
    songView: function (d, e) {
        var c = e.metadata;
        var b = function (f, g) {
                return {
                    event: {
                        click: function () {
                            d.addSong(f, g);
                        }
                    }
                };
            };
        var a = dmca.showPreview(e);
        return ["div.song", {
            data: {
                songData: e
            }
        }, ["div.progress"], ["div.thumbcontainer",
        {}, (c.coverart ? ["img.thumb",
        {
            src: c.coverart
        }] : null)], ["div.playSample",
        {
            style: (a ? {} : {
                display: "none"
            }),
            event: {
                click: function () {
                    d.samplePlay(this);
                }
            }
        }], ["div.pauseSample",
        {
            event: {
                click: turntablePlayer.sampleStop
            }
        }], ["div.songinfo",
        {}, ["div.title",
        {
            title: c.song
        },
        c.song],
            ["div.details",
            {}, ["div",
            {},
            c.artist + " - " + turntable.playlist.humanDuration(c.length)],
                ["div.score"]
            ],
            ["div.addSong",
            {}, ["div.btn.queue", b("queue", e)],
                ["div.btn.amazon", b("amazon", e)],
                ["div.btn.itunes", b("itunes", e)],
                ["div.btn.lastfm", b("lastfm", e)],
                ["div.btn.spotify", b("spotify", e)],
                ["div.btn.rdio", b("rdio", e)]
            ]
        ]];
    },
    bootConfirmView: function (a, b) {
        return ["div.modal", {}, ["div.close-x",
        {
            event: {
                click: util.hideOverlay
            }
        }], ["h1", "Boot User"], ["br"], ["div.field",
        {}, "You're about to boot ", a, " from the room.", ["br"],
            ["br"], "Care to give a reason?", ["br"],
            ["input.bootReasonField.text",
            {
                placeholder: "(optional)"
            }]
        ], ["div.ok-button.centered-button",
        {
            event: {
                click: b
            }
        }]];
    },
    profileView: function (a) {
        return ["div.profile", {}, ["div.close-x",
        {
            event: {
                click: function () {
                    $(".profile").fadeOut();
                }
            }
        }], ["div.mainarea",
        {}, ["div.avatar",
        {}, ["img"]],
            ["div.info",
            {}, ["div.name",
            {},
            a.name],
                ["div.social",
                {}, ["a.twitter",
                {
                    target: "_blank"
                }],
                    ["a.facebook",
                    {
                        target: "_blank"
                    }]
                ],
                ["div.website",
                {},
                a.website],
                ["div.acl"]
            ],
            ["div.section.top",
            {}, ["div.left",
            {}, "Stats"],
                ["div.right",
                {}, ["div.points",
                {},
                a.points + " DJ points"],
                    ["div.fans",
                    {},
                    a.fans + " fans"],
                    ["div.joined",
                    {}, "joined " + util.prettyDate(a.created)]
                ]
            ],
            ["div.section.about",
            {}, ["div.left",
            {}, "About me"],
                ["div.right",
                {},
                a.about]
            ],
            ["div.section.topartists",
            {}, ["div.left",
            {}, "Favorite artists"],
                ["div.right",
                {},
                a.topartists]
            ],
            ["div.section.hangout",
            {}, ["div.left",
            {}, "Usually hanging out in"],
                ["div.right",
                {},
                a.hangout]
            ],
            ["div.spacer"]
        ]];
    }
};
var RoomList = Class.extend({
    init: function (b) {
        this.currentRoomId = b;
        this.searchQuery = null;
        this.listRooms = $.proxy(this.listRooms, this);
        this.refreshRoomList = $.proxy(this.refreshRoomList, this);
        this.searchSubmit = $.proxy(this.searchSubmit, this);
        this.searchKeyUp = $.proxy(this.searchKeyUp, this);
        this.searchClear = $.proxy(this.searchClear, this);
        this.enterRoom = $.proxy(this.enterRoom, this);
        this.nodes = {};
        this.view = util.buildTree(RoomList.layouts.roomList(this), this.nodes);
        this.refreshRoomList();
        this.skip = 0;
        this.last_refresh = 0;
        var a = this;
        $(this.nodes.roomsList).unbind("scroll");
        $(this.nodes.roomsList).scroll(function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                var c = (new Date()).getTime();
                if ((c - a.last_refresh) / 1000 > 1) {
                    a.skip += 20;
                    a.refreshRoomList(a.skip, true);
                    a.last_refresh = (new Date()).getTime();
                }
            }
        });
        util.CWzdUjBgak(this);
    },
    refreshRoomList: function (c, a) {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        if (true || !turntable.isIdle) {
            if (!c) {
                c = 0;
            }
            var b = {
                api: "room.list_rooms",
                skip: c
            };
            if (this.searchQuery) {
                b = {
                    api: "room.search",
                    query: this.searchQuery,
                    skip: c
                };
            }
            if (a) {
                turntable.HRqMW(b, this.listRoomsAppend);
            } else {
                turntable.HRqMW(b, this.listRooms);
            }
        }
    },
    searchKeyUp: function () {
        if (this.nodes.searchQuery.value) {
            $(this.nodes.clearSearch).addClass("active");
        } else {
            $(this.nodes.clearSearch).removeClass("active");
            if (this.searchQuery) {
                this.searchQuery = null;
                this.refreshRoomList();
            }
        }
    },
    searchSubmit: function () {
        this.skip = 0;
        var a = $.trim(this.nodes.searchQuery.value);
        if (a != this.searchQuery) {
            this.searchQuery = a;
            this.refreshRoomList();
        }
    },
    searchClear: function () {
        var b = $(this.nodes.clearSearch);
        if (b.hasClass("active")) {
            if (this.searchQuery) {
                this.searchQuery = null;
                this.refreshRoomList();
            }
            b.removeClass("active");
            var a = $(this.nodes.searchQuery);
            a.val("").focus();
        }
    },
    listRooms: function (k, b) {
        if (!k.rooms.length) {
            this.skip = 0;
        }
        if (!b) {
            $(this.nodes.roomList).empty();
        }
        var q = this;
        var e = function () {
                q.enterRoom($(this));
            };
        for (var l = 0; l < k.rooms.length; l++) {
            var c = k.rooms[l][0];
            var h = c.metadata.current_song;
            var o = (h ? h.metadata.artist + " \u2015 " + h.metadata.song : "");
            var d = util.buildTree(RoomList.layouts.roomView(c, o, e));
            var n = k.rooms[l][1];
            var p = $(d).find(".friends");
            for (var g = 0; g < n.length; g++) {
                var m = n[g];
                var a = "";
                if (m.fbid) {
                    a = "https://graph.facebook.com/" + m.fbid + "/picture";
                } else {
                    if (m.twitterid_lower) {
                        a = "https://api.twitter.com/1/users/profile_image?screen_name=" + m.twitterid_lower + "&size=normal";
                    } else {
                        a = "https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/" + m.avatarid + "/headfront.png";
                    }
                }
                p.append('<img src="' + a + '" width="35" height="35" title="' + m.name + '" />');
            }
            if (c.roomid == this.currentRoomId) {
                $(d).addClass("currentRoom");
            }
            this.nodes.roomList.appendChild(d);
        }
        $(this.nodes.roomList).find(".roomRow:even").addClass("odd");
    },
    listRoomsAppend: function (a) {
        if (turntable.EPWNro.roomId) {
            turntable.EPWNro.roomList.listRooms(a, true);
        } else {
            welcome.roomList.listRooms(a, true);
        }
    },
    enterRoom: function (a) {
        if (a.hasClass("currentRoom")) {
            return;
        }
        turntable.setPage(a.data("shortcut"), a.data("id"));
        util.hideOverlay();
    },
    cleanup: function () {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
});
RoomList.layouts = {
    roomList: function (a) {
        return (["div.roomIndex",
        {}, ["div.rooms.roomsHeader",
        {}, ["form.roomSearch",
        {
            event: {
                submit: a.searchSubmit
            }
        }, ["input##searchQuery",
        {
            event: {
                keyup: a.searchKeyUp
            },
            placeholder: "search all rooms \u2015 enter room name"
        }],
            ["div##clearSearch.clearSearch",
            {
                event: {
                    click: a.searchClear
                }
            }]
        ], ],
            ["div##roomsList.rooms.roomsList",
            {}, ["table.roomsTable",
            {}, ["thead",
            {}, ["tr",
            {}, ["th.listeners",
            {
                scope: "col"
            }, "Listeners"],
                ["th",
                {
                    scope: "col"
                }, "Room name and Current song"],
                ["th.friends",
                {
                    scope: "col"
                }, "Friends"]
            ]],
                ["tbody##roomList"]
            ]]
        ]);
    },
    roomView: function (c, b, a) {
        return (["tr.roomRow",
        {
            data: {
                id: c.roomid,
                shortcut: c.shortcut
            },
            event: {
                click: a
            }
        }, ["td.roomStats",
        {}, ["div.nListeners",
        {},
        String(c.metadata.listeners)],
            ["div.numDJs",
            {},
            c.metadata.djcount, "/", c.metadata.max_djs, " DJs"]
        ],
            ["td.roomtitles",
            {}, ["div.roomInfo",
            {}, ["span.roomName",
            {},
            c.name]],
                ["div.songtitles",
                {},
                b]
            ],
            ["td.friends"]
        ]);
    },
};
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "static/zeroclipboard/ZeroClipboard.swf",
    nextId: 1,
    $: function (a) {
        if (typeof (a) == "string") {
            a = document.getElementById(a);
        }
        if (!a.addClass) {
            a.hide = function () {
                this.style.display = "none";
            };
            a.show = function () {
                this.style.display = "";
            };
            a.addClass = function (b) {
                this.removeClass(b);
                this.className += " " + b;
            };
            a.removeClass = function (d) {
                var e = this.className.split(/\s+/);
                var b = -1;
                for (var c = 0; c < e.length; c++) {
                    if (e[c] == d) {
                        b = c;
                        c = e.length;
                    }
                }
                if (b > -1) {
                    e.splice(b, 1);
                    this.className = e.join(" ");
                }
                return this;
            };
            a.hasClass = function (b) {
                return !!this.className.match(new RegExp("\\s*" + b + "\\s*"));
            };
        }
        return a;
    },
    setMoviePath: function (a) {
        this.moviePath = a;
    },
    dispatch: function (d, b, c) {
        var a = this.clients[d];
        if (a) {
            a.receiveEvent(b, c);
        }
    },
    register: function (b, a) {
        this.clients[b] = a;
    },
    getDOMObjectPosition: function (c, a) {
        var b = {
            left: 0,
            top: 0,
            width: c.width ? c.width : c.offsetWidth,
            height: c.height ? c.height : c.offsetHeight
        };
        while (c && (c != a)) {
            b.left += c.offsetLeft;
            b.top += c.offsetTop;
            c = c.offsetParent;
        }
        return b;
    },
    Client: function (a) {
        this.handlers = {};
        this.id = ZeroClipboard.nextId++;
        this.movieId = "ZeroClipboardMovie_" + this.id;
        ZeroClipboard.register(this.id, this);
        if (a) {
            this.glue(a);
        }
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: false,
    movie: null,
    clipText: "",
    handCursorEnabled: true,
    cssEffects: true,
    handlers: null,
    glue: function (d, b, e) {
        this.domElement = ZeroClipboard.$(d);
        var f = 99;
        if (this.domElement.style.zIndex) {
            f = parseInt(this.domElement.style.zIndex, 10) + 1;
        }
        if (typeof (b) == "string") {
            b = ZeroClipboard.$(b);
        } else {
            if (typeof (b) == "undefined") {
                b = document.getElementsByTagName("body")[0];
            }
        }
        var c = ZeroClipboard.getDOMObjectPosition(this.domElement, b);
        this.div = document.createElement("div");
        var a = this.div.style;
        a.position = "absolute";
        a.left = "" + c.left + "px";
        a.top = "" + c.top + "px";
        a.width = "" + c.width + "px";
        a.height = "" + c.height + "px";
        a.zIndex = f;
        if (typeof (e) == "object") {
            for (addedStyle in e) {
                a[addedStyle] = e[addedStyle];
            }
        }
        b.appendChild(this.div);
        this.div.innerHTML = this.getHTML(c.width, c.height);
    },
    getHTML: function (d, a) {
        var c = "";
        var b = "id=" + this.id + "&width=" + d + "&height=" + a;
        if (navigator.userAgent.match(/MSIE/)) {
            var e = location.href.match(/^https/i) ? "https://" : "http://";
            c += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + e + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + d + '" height="' + a + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + b + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            c += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + d + '" height="' + a + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + b + '" wmode="transparent" />';
        }
        return c;
    },
    hide: function () {
        if (this.div) {
            this.div.style.left = "-2000px";
        }
    },
    show: function () {
        this.reposition();
    },
    destroy: function () {
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = "";
            var a = document.getElementsByTagName("body")[0];
            try {
                a.removeChild(this.div);
            } catch (b) {}
            this.domElement = null;
            this.div = null;
        }
    },
    reposition: function (c) {
        if (c) {
            this.domElement = ZeroClipboard.$(c);
            if (!this.domElement) {
                this.hide();
            }
        }
        if (this.domElement && this.div) {
            var b = ZeroClipboard.getDOMObjectPosition(this.domElement);
            var a = this.div.style;
            a.left = "" + b.left + "px";
            a.top = "" + b.top + "px";
        }
    },
    setText: function (a) {
        this.clipText = a;
        if (this.ready) {
            this.movie.setText(a);
        }
    },
    addEventListener: function (a, b) {
        a = a.toString().toLowerCase().replace(/^on/, "");
        if (!this.handlers[a]) {
            this.handlers[a] = [];
        }
        this.handlers[a].push(b);
    },
    setHandCursor: function (a) {
        this.handCursorEnabled = a;
        if (this.ready) {
            this.movie.setHandCursor(a);
        }
    },
    setCSSEffects: function (a) {
        this.cssEffects = !! a;
    },
    receiveEvent: function (d, e) {
        d = d.toString().toLowerCase().replace(/^on/, "");
        switch (d) {
        case "load":
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var c = this;
                setTimeout(function () {
                    c.receiveEvent("load", null);
                }, 1);
                return;
            }
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                var c = this;
                setTimeout(function () {
                    c.receiveEvent("load", null);
                }, 100);
                this.ready = true;
                return;
            }
            this.ready = true;
            this.movie.setText(this.clipText);
            this.movie.setHandCursor(this.handCursorEnabled);
            break;
        case "mouseover":
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass("hover");
                if (this.recoverActive) {
                    this.domElement.addClass("active");
                }
            }
            break;
        case "mouseout":
            if (this.domElement && this.cssEffects) {
                this.recoverActive = false;
                if (this.domElement.hasClass("active")) {
                    this.domElement.removeClass("active");
                    this.recoverActive = true;
                }
                this.domElement.removeClass("hover");
            }
            break;
        case "mousedown":
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass("active");
            }
            break;
        case "mouseup":
            if (this.domElement && this.cssEffects) {
                this.domElement.removeClass("active");
                this.recoverActive = false;
            }
            break;
        }
        if (this.handlers[d]) {
            for (var b = 0, a = this.handlers[d].length; b < a; b++) {
                var f = this.handlers[d][b];
                if (typeof (f) == "function") {
                    f(this, e);
                } else {
                    if ((typeof (f) == "object") && (f.length == 2)) {
                        f[0][f[1]](this, e);
                    } else {
                        if (typeof (f) == "string") {
                            window[f](this, e);
                        }
                    }
                }
            }
        }
    }
};
if (window.DEMO_MODE) {
    $(document).ready(function () {
        var a = {
            elements: {},
            init: function () {
                a.leftView = util.buildTree(a.layouts.leftSide, a.elements);
                a.rightView = util.buildTree(a.layouts.rightSide, a.elements);
                $("body").append(a.leftView);
                $("body").append(a.rightView);
            },
            alignImagesToEdges: function () {
                $("#demoLeft img").css("left", $("#outer").position().left - 132);
                $("#demoRight img").css("left", $("#outer").position().left + $("#outer").width() + 7);
            }
        };
        a.layouts = {
            leftSide: ["div#demoLeft",
            {}, ["img.about",
            {
                src: "https://s3.amazonaws.com/static.turntable.fm/images/demo/about.png"
            }],
                ["img.djs",
                {
                    src: "https://s3.amazonaws.com/static.turntable.fm/images/demo/djs.png"
                }],
                ["img.audience",
                {
                    src: "https://s3.amazonaws.com/static.turntable.fm/images/demo/audience.png"
                }]
            ],
            rightSide: ["div#demoRight",
            {}, ["img.download",
            {
                src: "https://s3.amazonaws.com/static.turntable.fm/images/demo/download.png"
            }]]
        };
        a.init();
        a.alignImagesToEdges();
        $(window).resize(function () {
            a.alignImagesToEdges();
        });
    });
}