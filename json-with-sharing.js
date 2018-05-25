(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function expandCse(json, valueField, cseField, refField) {
        if (valueField === void 0) { valueField = '_value'; }
        if (cseField === void 0) { cseField = '_cse'; }
        if (refField === void 0) { refField = '_r'; }
        if (typeof json !== 'object')
            return json;
        if (json === null || json[cseField] === void (0))
            return json;
        var cse = json[cseField];
        return expandRec(json[valueField], cse, new Array(cse.length), refField);
    }
    exports.expandCse = expandCse;
    function expandRec(json, cse, reformed, refField) {
        var type = typeof json;
        if (type === 'object') {
            if (json === null)
                return null;
            var ix = json[refField];
            if (ix !== void (0)) {
                var t = reformed[ix];
                if (t !== void (0))
                    return t;
                return reformed[ix] = expandRec(cse[ix], cse, reformed, refField);
            }
            if (json instanceof Array) {
                var len = json.length;
                var t = new Array(json.length);
                for (var i = 0; i < len; ++i) {
                    t[i] = expandRec(json[i], cse, reformed, refField);
                }
                return t;
            }
            else {
                var keys = Object.keys(json);
                var len = keys.length;
                var t = {};
                for (var i = 0; i < len; ++i) {
                    var k = keys[i];
                    t[k] = expandRec(json[k], cse, reformed, refField);
                }
                return t;
            }
        }
        else {
            return json;
        }
    }
    function cse(json, valueField, cseField, refField) {
        if (valueField === void 0) { valueField = '_value'; }
        if (cseField === void 0) { cseField = '_cse'; }
        if (refField === void 0) { refField = '_r'; }
        var cseTemp = [];
        var reused = [];
        if (typeof json === 'object') {
            if (json === null)
                return null;
            var intermediate = cseRec(json, JsonTrie.create(), cseTemp, reused, refField);
            var cse_1 = [];
            var result = reconstitute(intermediate, cseTemp, cse_1, reused, refField);
            return cse_1.length === 0 ? json : (_a = {}, _a[valueField] = result, _a[cseField] = cse_1, _a);
        }
        else {
            return json;
        }
        var _a;
    }
    exports.cse = cse;
    function reconstitute(intermediate, cseTemp, cse, reused, refField) {
        var type = typeof intermediate;
        if (type === 'object') {
            if (intermediate === null)
                return null;
            var ix = intermediate[refField];
            if (reused[ix]) {
                var t = cseTemp[ix];
                if (typeof t === 'number') {
                    return _a = {}, _a[refField] = t, _a;
                }
                else {
                    var newIx = cse.length;
                    cse.push(t);
                    cseTemp[ix] = newIx;
                    if (t instanceof Array) {
                        var len = t.length;
                        for (var i = 0; i < len; ++i) {
                            t[i] = reconstitute(t[i], cseTemp, cse, reused, refField);
                        }
                    }
                    else {
                        var keys = Object.keys(t);
                        var len = keys.length;
                        for (var i = 0; i < len; ++i) {
                            var k = keys[i];
                            t[k] = reconstitute(t[k], cseTemp, cse, reused, refField);
                        }
                    }
                    return _b = {}, _b[refField] = newIx, _b;
                }
            }
            else {
                var tmp = cseTemp[ix];
                if (tmp instanceof Array) {
                    var len = tmp.length;
                    for (var i = 0; i < len; ++i) {
                        tmp[i] = reconstitute(tmp[i], cseTemp, cse, reused, refField);
                    }
                    return tmp;
                }
                else {
                    var tmp_1 = cseTemp[ix];
                    var keys = Object.keys(tmp_1);
                    var len = keys.length;
                    for (var i = 0; i < len; ++i) {
                        var k = keys[i];
                        tmp_1[k] = reconstitute(tmp_1[k], cseTemp, cse, reused, refField);
                    }
                    return tmp_1;
                }
            }
        }
        else {
            return intermediate;
        }
        var _a, _b;
    }
    function cseRec(key, trie, cse, reused, refField) {
        var type = typeof key;
        if (type === 'object') {
            if (key === null) {
                return null;
            }
            else if (key instanceof Array) {
                var len = key.length;
                var result = new Array(len);
                for (var i = 0; i < len; ++i) {
                    result[i] = cseRec(key[i], trie, cse, reused, refField);
                }
                var ix = trie.insert(result);
                if (ix < 0) {
                    reused[-ix - 1] = true;
                    return _a = {}, _a[refField] = -ix - 1, _a;
                }
                else {
                    cse[ix - 1] = result;
                    return _b = {}, _b[refField] = ix - 1, _b;
                }
            }
            else {
                var keys = Object.keys(key);
                var len = keys.length;
                var result = {};
                for (var i = 0; i < len; ++i) {
                    var k = keys[i];
                    result[k] = cseRec(key[k], trie, cse, reused, refField);
                }
                var ix = trie.insert(result);
                if (ix < 0) {
                    reused[-ix - 1] = true;
                    return _c = {}, _c[refField] = -ix - 1, _c;
                }
                else {
                    cse[ix - 1] = result;
                    return _d = {}, _d[refField] = ix - 1, _d;
                }
            }
        }
        else {
            return key;
        }
        var _a, _b, _c, _d;
    }
    var JsonTrie = (function () {
        function JsonTrie() {
            this.trie = {};
            this.count = 1;
        }
        JsonTrie.create = function () {
            return new JsonTrie();
        };
        JsonTrie.prototype.insert = function (key) {
            return this.insertRec(key, void (0), this.trie);
        };
        JsonTrie.prototype.insertRec = function (key, val, curr, root) {
            if (root === void 0) { root = true; }
            var type = typeof key;
            if (type === 'object') {
                if (key === null) {
                    if (root)
                        return 'null' in curr ? -curr.null : curr.null = this.count++;
                    var node = curr.null;
                    if (node === void (0))
                        curr.null = node = val;
                    return node;
                }
                else if (key instanceof Array) {
                    var node = curr.array;
                    if (node === void (0))
                        curr.array = node = {};
                    var len = key.length;
                    for (var i = 0; i < len; ++i) {
                        node = this.insertRec(key[i], {}, node, false);
                    }
                    if (root)
                        return 'empty' in node ? -node.empty : node.empty = this.count++;
                    var node2 = node.empty;
                    if (node2 === void (0))
                        node.empty = node2 = val;
                    return node2;
                }
                else {
                    var node = curr.object;
                    if (node === void (0))
                        curr.object = node = {};
                    var keys = Object.keys(key).sort();
                    var len = keys.length;
                    for (var i = 0; i < len; ++i) {
                        var k = keys[i];
                        var node2_1 = node.more;
                        if (node2_1 === void (0))
                            node.more = node2_1 = {};
                        var node3 = node2_1[k];
                        if (node3 === void (0))
                            node2_1[k] = node3 = {};
                        node = this.insertRec(key[k], {}, node3, false);
                    }
                    if (root)
                        return 'empty' in node ? -node.empty : node.empty = this.count++;
                    var node2 = node.empty;
                    if (node2 === void (0))
                        node.empty = node2 = val;
                    return node2;
                }
            }
            else if (type === 'undefined') {
                if (root)
                    return 'undefined' in curr ? -curr.undefined : curr.undefined = this.count++;
                var node = curr.undefined;
                if (node === void (0))
                    curr.undefined = node = val;
                return node;
            }
            else {
                var node = curr[type];
                if (node === void (0))
                    curr[type] = node = {};
                if (root)
                    return key in node ? -node[key] : node[key] = this.count++;
                var node2 = node[key];
                if (node2 === void (0))
                    node[key] = node2 = val;
                return node2;
            }
        };
        return JsonTrie;
    }());
});
//# sourceMappingURL=json-with-sharing.js.map