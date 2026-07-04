"use strict";
var __StripeExtExports = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      module.exports = TypeError;
    }
  });

  // (disabled):node_modules/object-inspect/util.inspect
  var require_util = __commonJS({
    "(disabled):node_modules/object-inspect/util.inspect"() {
    }
  });

  // node_modules/object-inspect/index.js
  var require_object_inspect = __commonJS({
    "node_modules/object-inspect/index.js"(exports, module) {
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      var utilInspect = require_util();
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      var quotes = {
        __proto__: null,
        "double": '"',
        single: "'"
      };
      var quoteREs = {
        __proto__: null,
        "double": /(["\\])/g,
        single: /(['\\])/g
      };
      module.exports = function inspect_(obj, options, depth, seen) {
        var opts = options || {};
        if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj === "undefined") {
          return "undefined";
        }
        if (obj === null) {
          return "null";
        }
        if (typeof obj === "boolean") {
          return obj ? "true" : "false";
        }
        if (typeof obj === "string") {
          return inspectString(obj, opts);
        }
        if (typeof obj === "number") {
          if (obj === 0) {
            return Infinity / obj > 0 ? "0" : "-0";
          }
          var str = String(obj);
          return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === "bigint") {
          var bigIntStr = String(obj) + "n";
          return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
          return isArray(obj) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj) >= 0) {
          return "[Circular]";
        }
        function inspect(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        if (typeof obj === "function" && !isRegExp(obj)) {
          var name = nameOf(obj);
          var keys = arrObjKeys(obj, inspect);
          return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
        }
        if (isSymbol(obj)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
          return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
          var s = "<" + $toLowerCase.call(String(obj.nodeName));
          var attrs = obj.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj.childNodes && obj.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
          return s;
        }
        if (isArray(obj)) {
          if (obj.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj, inspect);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj)) {
          var parts = arrObjKeys(obj, inspect);
          if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
            return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj) + "]";
          }
          return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj === "object" && customInspect) {
          if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
            return obj.inspect();
          }
        }
        if (isMap(obj)) {
          var mapParts = [];
          if (mapForEach) {
            mapForEach.call(obj, function(value, key) {
              mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
            });
          }
          return collectionOf("Map", mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
          var setParts = [];
          if (setForEach) {
            setForEach.call(obj, function(value) {
              setParts.push(inspect(value, obj));
            });
          }
          return collectionOf("Set", setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj)) {
          return markBoxed(inspect(Number(obj)));
        }
        if (isBigInt(obj)) {
          return markBoxed(inspect(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
          return markBoxed(booleanValueOf.call(obj));
        }
        if (isString(obj)) {
          return markBoxed(inspect(String(obj)));
        }
        if (typeof window !== "undefined" && obj === window) {
          return "{ [object Window] }";
        }
        if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
          return "{ [object globalThis] }";
        }
        if (!isDate(obj) && !isRegExp(obj)) {
          var ys = arrObjKeys(obj, inspect);
          var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
          var protoTag = obj instanceof Object ? "" : "null prototype";
          var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
          var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag + "{}";
          }
          if (indent) {
            return tag + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj);
      };
      function wrapQuotes(s, defaultStyle, opts) {
        var style = opts.quoteStyle || defaultStyle;
        var quoteChar = quotes[style];
        return quoteChar + s + quoteChar;
      }
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      function canTrustToString(obj) {
        return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
      }
      function isArray(obj) {
        return toStr(obj) === "[object Array]" && canTrustToString(obj);
      }
      function isDate(obj) {
        return toStr(obj) === "[object Date]" && canTrustToString(obj);
      }
      function isRegExp(obj) {
        return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
      }
      function isError(obj) {
        return toStr(obj) === "[object Error]" && canTrustToString(obj);
      }
      function isString(obj) {
        return toStr(obj) === "[object String]" && canTrustToString(obj);
      }
      function isNumber(obj) {
        return toStr(obj) === "[object Number]" && canTrustToString(obj);
      }
      function isBoolean(obj) {
        return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
      }
      function isSymbol(obj) {
        if (hasShammedSymbols) {
          return obj && typeof obj === "object" && obj instanceof Symbol;
        }
        if (typeof obj === "symbol") {
          return true;
        }
        if (!obj || typeof obj !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isBigInt(obj) {
        if (!obj || typeof obj !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has(obj, key) {
        return hasOwn.call(obj, key);
      }
      function toStr(obj) {
        return objectToString.call(obj);
      }
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var quoteRE = quoteREs[opts.quoteStyle || "single"];
        quoteRE.lastIndex = 0;
        var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      function arrObjKeys(obj, inspect) {
        var isArr = isArray(obj);
        var xs = [];
        if (isArr) {
          xs.length = obj.length;
          for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj) {
          if (!has(obj, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
          } else {
            xs.push(key + ": " + inspect(obj[key], obj));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
              xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
            }
          }
        }
        return xs;
      }
    }
  });

  // node_modules/side-channel-list/index.js
  var require_side_channel_list = __commonJS({
    "node_modules/side-channel-list/index.js"(exports, module) {
      "use strict";
      var inspect = require_object_inspect();
      var $TypeError = require_type();
      var listGetNode = function(list, key, isDelete) {
        var prev = list;
        var curr;
        for (; (curr = prev.next) != null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            if (!isDelete) {
              curr.next = list.next;
              list.next = curr;
            }
            return curr;
          }
        }
      };
      var listGet = function(objects, key) {
        if (!objects) {
          return void 0;
        }
        var node = listGetNode(objects, key);
        return node && node.value;
      };
      var listSet = function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = {
            key,
            next: objects.next,
            value
          };
        }
      };
      var listHas = function(objects, key) {
        if (!objects) {
          return false;
        }
        return !!listGetNode(objects, key);
      };
      var listDelete = function(objects, key) {
        if (objects) {
          return listGetNode(objects, key, true);
        }
      };
      module.exports = function getSideChannelList() {
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            var deletedNode = listDelete($o, key);
            if (deletedNode && $o && !$o.next) {
              $o = void 0;
            }
            return !!deletedNode;
          },
          get: function(key) {
            return listGet($o, key);
          },
          has: function(key) {
            return listHas($o, key);
          },
          set: function(key, value) {
            if (!$o) {
              $o = {
                next: void 0
              };
            }
            listSet($o, key, value);
          }
        };
        return channel;
      };
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
      "use strict";
      var $Object = require_es_object_atoms();
      module.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports, module) {
      "use strict";
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      } : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports, module) {
      "use strict";
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        "%EvalError%": $EvalError,
        "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic([intrinsic]);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/side-channel-map/index.js
  var require_side_channel_map = __commonJS({
    "node_modules/side-channel-map/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var inspect = require_object_inspect();
      var $TypeError = require_type();
      var $Map = GetIntrinsic("%Map%", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var $mapDelete = callBound("Map.prototype.delete", true);
      var $mapSize = callBound("Map.prototype.size", true);
      module.exports = !!$Map && function getSideChannelMap() {
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($m) {
              var result = $mapDelete($m, key);
              if ($mapSize($m) === 0) {
                $m = void 0;
              }
              return result;
            }
            return false;
          },
          get: function(key) {
            if ($m) {
              return $mapGet($m, key);
            }
          },
          has: function(key) {
            if ($m) {
              return $mapHas($m, key);
            }
            return false;
          },
          set: function(key, value) {
            if (!$m) {
              $m = new $Map();
            }
            $mapSet($m, key, value);
          }
        };
        return channel;
      };
    }
  });

  // node_modules/side-channel-weakmap/index.js
  var require_side_channel_weakmap = __commonJS({
    "node_modules/side-channel-weakmap/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var inspect = require_object_inspect();
      var getSideChannelMap = require_side_channel_map();
      var $TypeError = require_type();
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
      module.exports = $WeakMap ? function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }
        };
        return channel;
      } : getSideChannelMap;
    }
  });

  // node_modules/side-channel/index.js
  var require_side_channel = __commonJS({
    "node_modules/side-channel/index.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var inspect = require_object_inspect();
      var getSideChannelList = require_side_channel_list();
      var getSideChannelMap = require_side_channel_map();
      var getSideChannelWeakMap = require_side_channel_weakmap();
      var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
      module.exports = function getSideChannel() {
        var $channelData;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              var keyDesc = key && Object(key) === key ? "the given object key" : inspect(key);
              throw new $TypeError("Side channel does not contain " + keyDesc);
            }
          },
          "delete": function(key) {
            return !!$channelData && $channelData["delete"](key);
          },
          get: function(key) {
            return $channelData && $channelData.get(key);
          },
          has: function(key) {
            return !!$channelData && $channelData.has(key);
          },
          set: function(key, value) {
            if (!$channelData) {
              $channelData = makeChannel();
            }
            $channelData.set(key, value);
          }
        };
        return channel;
      };
    }
  });

  // node_modules/qs/lib/formats.js
  var require_formats = __commonJS({
    "node_modules/qs/lib/formats.js"(exports, module) {
      "use strict";
      var replace = String.prototype.replace;
      var percentTwenties = /%20/g;
      var Format = {
        RFC1738: "RFC1738",
        RFC3986: "RFC3986"
      };
      module.exports = {
        "default": Format.RFC3986,
        formatters: {
          RFC1738: function(value) {
            return replace.call(value, percentTwenties, "+");
          },
          RFC3986: function(value) {
            return String(value);
          }
        },
        RFC1738: Format.RFC1738,
        RFC3986: Format.RFC3986
      };
    }
  });

  // node_modules/qs/lib/utils.js
  var require_utils = __commonJS({
    "node_modules/qs/lib/utils.js"(exports, module) {
      "use strict";
      var formats = require_formats();
      var getSideChannel = require_side_channel();
      var has = Object.prototype.hasOwnProperty;
      var isArray = Array.isArray;
      var overflowChannel = getSideChannel();
      var markOverflow = function markOverflow2(obj, maxIndex) {
        overflowChannel.set(obj, maxIndex);
        return obj;
      };
      var isOverflow = function isOverflow2(obj) {
        return overflowChannel.has(obj);
      };
      var getMaxIndex = function getMaxIndex2(obj) {
        return overflowChannel.get(obj);
      };
      var setMaxIndex = function setMaxIndex2(obj, maxIndex) {
        overflowChannel.set(obj, maxIndex);
      };
      var hexTable = function() {
        var array = [];
        for (var i = 0; i < 256; ++i) {
          array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
        }
        return array;
      }();
      var compactQueue = function compactQueue2(queue) {
        while (queue.length > 1) {
          var item = queue.pop();
          var obj = item.obj[item.prop];
          if (isArray(obj)) {
            var compacted = [];
            for (var j = 0; j < obj.length; ++j) {
              if (typeof obj[j] !== "undefined") {
                compacted[compacted.length] = obj[j];
              }
            }
            item.obj[item.prop] = compacted;
          }
        }
      };
      var arrayToObject = function arrayToObject2(source, options) {
        var obj = options && options.plainObjects ? { __proto__: null } : {};
        for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== "undefined") {
            obj[i] = source[i];
          }
        }
        return obj;
      };
      var merge = function merge2(target, source, options) {
        if (!source) {
          return target;
        }
        if (typeof source !== "object" && typeof source !== "function") {
          if (isArray(target)) {
            var nextIndex = target.length;
            if (options && typeof options.arrayLimit === "number" && nextIndex > options.arrayLimit) {
              return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
            }
            target[nextIndex] = source;
          } else if (target && typeof target === "object") {
            if (isOverflow(target)) {
              var newIndex = getMaxIndex(target) + 1;
              target[newIndex] = source;
              setMaxIndex(target, newIndex);
            } else if (options && options.strictMerge) {
              return [target, source];
            } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
              target[source] = true;
            }
          } else {
            return [target, source];
          }
          return target;
        }
        if (!target || typeof target !== "object") {
          if (isOverflow(source)) {
            var sourceKeys = Object.keys(source);
            var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
            for (var m = 0; m < sourceKeys.length; m++) {
              var oldKey = parseInt(sourceKeys[m], 10);
              result[oldKey + 1] = source[sourceKeys[m]];
            }
            return markOverflow(result, getMaxIndex(source) + 1);
          }
          var combined = [target].concat(source);
          if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
            return markOverflow(arrayToObject(combined, options), combined.length - 1);
          }
          return combined;
        }
        var mergeTarget = target;
        if (isArray(target) && !isArray(source)) {
          mergeTarget = arrayToObject(target, options);
        }
        if (isArray(target) && isArray(source)) {
          source.forEach(function(item, i) {
            if (has.call(target, i)) {
              var targetItem = target[i];
              if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
                target[i] = merge2(targetItem, item, options);
              } else {
                target[target.length] = item;
              }
            } else {
              target[i] = item;
            }
          });
          return target;
        }
        return Object.keys(source).reduce(function(acc, key) {
          var value = source[key];
          if (has.call(acc, key)) {
            acc[key] = merge2(acc[key], value, options);
          } else {
            acc[key] = value;
          }
          if (isOverflow(source) && !isOverflow(acc)) {
            markOverflow(acc, getMaxIndex(source));
          }
          if (isOverflow(acc)) {
            var keyNum = parseInt(key, 10);
            if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
              setMaxIndex(acc, keyNum);
            }
          }
          return acc;
        }, mergeTarget);
      };
      var assign = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function(acc, key) {
          acc[key] = source[key];
          return acc;
        }, target);
      };
      var decode = function(str, defaultDecoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, " ");
        if (charset === "iso-8859-1") {
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        try {
          return decodeURIComponent(strWithoutPlus);
        } catch (e) {
          return strWithoutPlus;
        }
      };
      var limit = 1024;
      var encode = function encode2(str, defaultEncoder, charset, kind, format) {
        if (str.length === 0) {
          return str;
        }
        var string = str;
        if (typeof str === "symbol") {
          string = Symbol.prototype.toString.call(str);
        } else if (typeof str !== "string") {
          string = String(str);
        }
        if (charset === "iso-8859-1") {
          return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
            return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
          });
        }
        var out = "";
        for (var j = 0; j < string.length; j += limit) {
          var segment = string.length >= limit ? string.slice(j, j + limit) : string;
          var arr = [];
          for (var i = 0; i < segment.length; ++i) {
            var c = segment.charCodeAt(i);
            if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
              arr[arr.length] = segment.charAt(i);
              continue;
            }
            if (c < 128) {
              arr[arr.length] = hexTable[c];
              continue;
            }
            if (c < 2048) {
              arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
              continue;
            }
            if (c < 55296 || c >= 57344) {
              arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
              continue;
            }
            i += 1;
            c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
            arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
          }
          out += arr.join("");
        }
        return out;
      };
      var compact = function compact2(value) {
        var queue = [{ obj: { o: value }, prop: "o" }];
        var refs = [];
        for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];
          var keys = Object.keys(obj);
          for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
              queue[queue.length] = { obj, prop: key };
              refs[refs.length] = val;
            }
          }
        }
        compactQueue(queue);
        return value;
      };
      var isRegExp = function isRegExp2(obj) {
        return Object.prototype.toString.call(obj) === "[object RegExp]";
      };
      var isBuffer = function isBuffer2(obj) {
        if (!obj || typeof obj !== "object") {
          return false;
        }
        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
      };
      var combine = function combine2(a, b, arrayLimit, plainObjects) {
        if (isOverflow(a)) {
          var newIndex = getMaxIndex(a) + 1;
          a[newIndex] = b;
          setMaxIndex(a, newIndex);
          return a;
        }
        var result = [].concat(a, b);
        if (result.length > arrayLimit) {
          return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
        }
        return result;
      };
      var maybeMap = function maybeMap2(val, fn) {
        if (isArray(val)) {
          var mapped = [];
          for (var i = 0; i < val.length; i += 1) {
            mapped[mapped.length] = fn(val[i]);
          }
          return mapped;
        }
        return fn(val);
      };
      module.exports = {
        arrayToObject,
        assign,
        combine,
        compact,
        decode,
        encode,
        isBuffer,
        isOverflow,
        isRegExp,
        markOverflow,
        maybeMap,
        merge
      };
    }
  });

  // node_modules/qs/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/qs/lib/stringify.js"(exports, module) {
      "use strict";
      var getSideChannel = require_side_channel();
      var utils = require_utils();
      var formats = require_formats();
      var has = Object.prototype.hasOwnProperty;
      var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
          return prefix + "[]";
        },
        comma: "comma",
        indices: function indices(prefix, key) {
          return prefix + "[" + key + "]";
        },
        repeat: function repeat(prefix) {
          return prefix;
        }
      };
      var isArray = Array.isArray;
      var push = Array.prototype.push;
      var pushToArray = function(arr, valueOrArray) {
        push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
      };
      var toISO = Date.prototype.toISOString;
      var defaultFormat = formats["default"];
      var defaults = {
        addQueryPrefix: false,
        allowDots: false,
        allowEmptyArrays: false,
        arrayFormat: "indices",
        charset: "utf-8",
        charsetSentinel: false,
        commaRoundTrip: false,
        delimiter: "&",
        encode: true,
        encodeDotInKeys: false,
        encoder: utils.encode,
        encodeValuesOnly: false,
        filter: void 0,
        format: defaultFormat,
        formatter: formats.formatters[defaultFormat],
        indices: false,
        serializeDate: function serializeDate(date) {
          return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
      };
      var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
        return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
      };
      var sentinel = {};
      var stringify2 = function stringify3(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
        var obj = object;
        var tmpSc = sideChannel;
        var step = 0;
        var findFlag = false;
        while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
          var pos = tmpSc.get(object);
          step += 1;
          if (typeof pos !== "undefined") {
            if (pos === step) {
              throw new RangeError("Cyclic object value");
            } else {
              findFlag = true;
            }
          }
          if (typeof tmpSc.get(sentinel) === "undefined") {
            step = 0;
          }
        }
        if (typeof filter === "function") {
          obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
          obj = serializeDate(obj);
        } else if (generateArrayPrefix === "comma" && isArray(obj)) {
          obj = utils.maybeMap(obj, function(value2) {
            if (value2 instanceof Date) {
              return serializeDate(value2);
            }
            return value2;
          });
        }
        if (obj === null) {
          if (strictNullHandling) {
            return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix);
          }
          obj = "";
        }
        if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
          if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
            return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
          }
          return [formatter(prefix) + "=" + formatter(String(obj))];
        }
        var values = [];
        if (typeof obj === "undefined") {
          return values;
        }
        var objKeys;
        if (generateArrayPrefix === "comma" && isArray(obj)) {
          if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, function(v) {
              return v == null ? v : encoder(v);
            });
          }
          objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
        } else if (isArray(filter)) {
          objKeys = filter;
        } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
        }
        var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
        var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
        if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
          return adjustedPrefix + "[]";
        }
        for (var j = 0; j < objKeys.length; ++j) {
          var key = objKeys[j];
          var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
          if (skipNulls && value === null) {
            continue;
          }
          var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
          var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
          sideChannel.set(object, step);
          var valueSideChannel = getSideChannel();
          valueSideChannel.set(sentinel, sideChannel);
          pushToArray(values, stringify3(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            allowEmptyArrays,
            strictNullHandling,
            skipNulls,
            encodeDotInKeys,
            generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
          ));
        }
        return values;
      };
      var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
          throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        }
        if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
          throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
        }
        if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
          throw new TypeError("Encoder has to be a function.");
        }
        var charset = opts.charset || defaults.charset;
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var format = formats["default"];
        if (typeof opts.format !== "undefined") {
          if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError("Unknown format option provided.");
          }
          format = opts.format;
        }
        var formatter = formats.formatters[format];
        var filter = defaults.filter;
        if (typeof opts.filter === "function" || isArray(opts.filter)) {
          filter = opts.filter;
        }
        var arrayFormat;
        if (opts.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = opts.arrayFormat;
        } else if ("indices" in opts) {
          arrayFormat = opts.indices ? "indices" : "repeat";
        } else {
          arrayFormat = defaults.arrayFormat;
        }
        if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
          throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        }
        var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
        return {
          addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
          allowDots,
          allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
          arrayFormat,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
          commaRoundTrip: !!opts.commaRoundTrip,
          delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
          encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
          encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
          encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
          encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
          filter,
          format,
          formatter,
          serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
          skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
          sort: typeof opts.sort === "function" ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
        };
      };
      module.exports = function(object, opts) {
        var obj = object;
        var options = normalizeStringifyOptions(opts);
        var objKeys;
        var filter;
        if (typeof options.filter === "function") {
          filter = options.filter;
          obj = filter("", obj);
        } else if (isArray(options.filter)) {
          filter = options.filter;
          objKeys = filter;
        }
        var keys = [];
        if (typeof obj !== "object" || obj === null) {
          return "";
        }
        var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
        var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
        if (!objKeys) {
          objKeys = Object.keys(obj);
        }
        if (options.sort) {
          objKeys.sort(options.sort);
        }
        var sideChannel = getSideChannel();
        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];
          if (typeof key === "undefined" || key === null) {
            continue;
          }
          var value = obj[key];
          if (options.skipNulls && value === null) {
            continue;
          }
          pushToArray(keys, stringify2(
            value,
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.allowEmptyArrays,
            options.strictNullHandling,
            options.skipNulls,
            options.encodeDotInKeys,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
          ));
        }
        var joined = keys.join(options.delimiter);
        var prefix = options.addQueryPrefix === true ? "?" : "";
        if (options.charsetSentinel) {
          if (options.charset === "iso-8859-1") {
            prefix += "utf8=%26%2310003%3B" + options.delimiter;
          } else {
            prefix += "utf8=%E2%9C%93" + options.delimiter;
          }
        }
        return joined.length > 0 ? prefix + joined : "";
      };
    }
  });

  // node_modules/qs/lib/parse.js
  var require_parse = __commonJS({
    "node_modules/qs/lib/parse.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var has = Object.prototype.hasOwnProperty;
      var isArray = Array.isArray;
      var defaults = {
        allowDots: false,
        allowEmptyArrays: false,
        allowPrototypes: false,
        allowSparse: false,
        arrayLimit: 20,
        charset: "utf-8",
        charsetSentinel: false,
        comma: false,
        decodeDotInKeys: false,
        decoder: utils.decode,
        delimiter: "&",
        depth: 5,
        duplicates: "combine",
        ignoreQueryPrefix: false,
        interpretNumericEntities: false,
        parameterLimit: 1e3,
        parseArrays: true,
        plainObjects: false,
        strictDepth: false,
        strictMerge: true,
        strictNullHandling: false,
        throwOnLimitExceeded: false
      };
      var interpretNumericEntities = function(str) {
        return str.replace(/&#(\d+);/g, function($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
        });
      };
      var parseArrayValue = function(val, options, currentArrayLength) {
        if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
          return val.split(",");
        }
        if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
          throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        return val;
      };
      var isoSentinel = "utf8=%26%2310003%3B";
      var charsetSentinel = "utf8=%E2%9C%93";
      var parseValues = function parseQueryStringValues(str, options) {
        var obj = { __proto__: null };
        var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
        cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
        var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
        var parts = cleanStr.split(
          options.delimiter,
          options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit
        );
        if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) {
          throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
        }
        var skipIndex = -1;
        var i;
        var charset = options.charset;
        if (options.charsetSentinel) {
          for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf("utf8=") === 0) {
              if (parts[i] === charsetSentinel) {
                charset = "utf-8";
              } else if (parts[i] === isoSentinel) {
                charset = "iso-8859-1";
              }
              skipIndex = i;
              i = parts.length;
            }
          }
        }
        for (i = 0; i < parts.length; ++i) {
          if (i === skipIndex) {
            continue;
          }
          var part = parts[i];
          var bracketEqualsPos = part.indexOf("]=");
          var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
          var key;
          var val;
          if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, "key");
            val = options.strictNullHandling ? null : "";
          } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
            if (key !== null) {
              val = utils.maybeMap(
                parseArrayValue(
                  part.slice(pos + 1),
                  options,
                  isArray(obj[key]) ? obj[key].length : 0
                ),
                function(encodedVal) {
                  return options.decoder(encodedVal, defaults.decoder, charset, "value");
                }
              );
            }
          }
          if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
            val = interpretNumericEntities(String(val));
          }
          if (part.indexOf("[]=") > -1) {
            val = isArray(val) ? [val] : val;
          }
          if (options.comma && isArray(val) && val.length > options.arrayLimit) {
            if (options.throwOnLimitExceeded) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            val = utils.combine([], val, options.arrayLimit, options.plainObjects);
          }
          if (key !== null) {
            var existing = has.call(obj, key);
            if (existing && (options.duplicates === "combine" || part.indexOf("[]=") > -1)) {
              obj[key] = utils.combine(
                obj[key],
                val,
                options.arrayLimit,
                options.plainObjects
              );
            } else if (!existing || options.duplicates === "last") {
              obj[key] = val;
            }
          }
        }
        return obj;
      };
      var parseObject = function(chain, val, options, valuesParsed) {
        var currentArrayLength = 0;
        if (chain.length > 0 && chain[chain.length - 1] === "[]") {
          var parentKey = chain.slice(0, -1).join("");
          currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
        }
        var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
        for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root = chain[i];
          if (root === "[]" && options.parseArrays) {
            if (utils.isOverflow(leaf)) {
              obj = leaf;
            } else {
              obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
                [],
                leaf,
                options.arrayLimit,
                options.plainObjects
              );
            }
          } else {
            obj = options.plainObjects ? { __proto__: null } : {};
            var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
            var index = parseInt(decodedRoot, 10);
            var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
            if (!options.parseArrays && decodedRoot === "") {
              obj = { 0: leaf };
            } else if (isValidArrayIndex && index < options.arrayLimit) {
              obj = [];
              obj[index] = leaf;
            } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            } else if (isValidArrayIndex) {
              obj[index] = leaf;
              utils.markOverflow(obj, index);
            } else if (decodedRoot !== "__proto__") {
              obj[decodedRoot] = leaf;
            }
          }
          leaf = obj;
        }
        return leaf;
      };
      var splitKeyIntoSegments = function splitKeyIntoSegments2(originalKey, options) {
        var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, "[$1]") : originalKey;
        if (options.depth <= 0) {
          if (!options.plainObjects && has.call(Object.prototype, key)) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          return [key];
        }
        var segments = [];
        var first = key.indexOf("[");
        var parent = first >= 0 ? key.slice(0, first) : key;
        if (parent) {
          if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          segments[segments.length] = parent;
        }
        var n = key.length;
        var open = first;
        var collected = 0;
        while (open >= 0 && collected < options.depth) {
          var level = 1;
          var i = open + 1;
          var close = -1;
          while (i < n && close < 0) {
            var cu = key.charCodeAt(i);
            if (cu === 91) {
              level += 1;
            } else if (cu === 93) {
              level -= 1;
              if (level === 0) {
                close = i;
              }
            }
            i += 1;
          }
          if (close < 0) {
            segments[segments.length] = "[" + key.slice(open) + "]";
            return segments;
          }
          var seg = key.slice(open, close + 1);
          var content = seg.slice(1, -1);
          if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) {
            return;
          }
          segments[segments.length] = seg;
          collected += 1;
          open = key.indexOf("[", close + 1);
        }
        if (open >= 0) {
          if (options.strictDepth === true) {
            throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
          }
          segments[segments.length] = "[" + key.slice(open) + "]";
        }
        return segments;
      };
      var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
        if (!givenKey) {
          return;
        }
        var keys = splitKeyIntoSegments(givenKey, options);
        if (!keys) {
          return;
        }
        return parseObject(keys, val, options, valuesParsed);
      };
      var normalizeParseOptions = function normalizeParseOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
          throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        }
        if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
          throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
        }
        if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
          throw new TypeError("Decoder has to be a function.");
        }
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
          throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
        }
        var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
        var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
        if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
          throw new TypeError("The duplicates option must be either combine, first, or last");
        }
        var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
        return {
          allowDots,
          allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
          allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
          allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
          arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
          comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
          decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
          decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
          delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
          depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
          duplicates,
          ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
          interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
          parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
          parseArrays: opts.parseArrays !== false,
          plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
          strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
          strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults.strictMerge,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
          throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
        };
      };
      module.exports = function(str, opts) {
        var options = normalizeParseOptions(opts);
        if (str === "" || str === null || typeof str === "undefined") {
          return options.plainObjects ? { __proto__: null } : {};
        }
        var tempObj = typeof str === "string" ? parseValues(str, options) : str;
        var obj = options.plainObjects ? { __proto__: null } : {};
        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
          obj = utils.merge(obj, newObj, options);
        }
        if (options.allowSparse === true) {
          return obj;
        }
        return utils.compact(obj);
      };
    }
  });

  // node_modules/qs/lib/index.js
  var require_lib = __commonJS({
    "node_modules/qs/lib/index.js"(exports, module) {
      "use strict";
      var stringify2 = require_stringify();
      var parse = require_parse();
      var formats = require_formats();
      module.exports = {
        formats,
        parse,
        stringify: stringify2
      };
    }
  });

  // node_modules/@stripe/ui-extension-sdk/version.js
  var require_version = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/version.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SDK_VERSION = void 0;
      exports.SDK_VERSION = "8.11.0";
    }
  });

  // node_modules/@stripe/ui-extension-sdk/ui/index.js
  var require_ui = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/ui/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Tooltip = exports.TextField = exports.TextArea = exports.Tabs = exports.TableRow = exports.Table = exports.TableHeaderCell = exports.TableHead = exports.TableFooter = exports.TableCell = exports.TableBody = exports.Tab = exports.TabPanels = exports.TabPanel = exports.TabList = exports.Switch = exports.StripeFileUploader = exports.Spinner = exports.Sparkline = exports.SignInView = exports.SettingsView = exports.Select = exports.Radio = exports.Menu = exports.MenuItem = exports.MenuGroup = exports.List = exports.ListItem = exports.Link = exports.LineChart = exports.Inline = exports.Img = exports.Icon = exports.FormFieldGroup = exports.FocusView = exports.Divider = exports.DateField = exports.ContextView = exports.Chip = exports.ChipList = exports.Checkbox = exports.Button = exports.ButtonGroup = exports.Box = exports.BarChart = exports.Banner = exports.Badge = exports.Accordion = exports.AccordionItem = void 0;
      var jsx_runtime_1 = __require("react/jsx-runtime");
      var react_1 = __require("@remote-ui/react");
      var version_1 = require_version();
      var withSdkProps = (Component) => {
        const wrappedComponentName = Component.displayName || Component.toString();
        const WithSdkProps = (props) => (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props, { wrappedComponentName, sdkVersion: version_1.SDK_VERSION, schemaVersion: "v8" }));
        WithSdkProps.wrappedComponentName = wrappedComponentName;
        return WithSdkProps;
      };
      var defineComponent = (name, fragmentProps, wrapWithSdkProps) => {
        const remoteComponent = (0, react_1.createRemoteReactComponent)(name, {
          fragmentProps
        });
        if (!wrapWithSdkProps) {
          return remoteComponent;
        }
        return withSdkProps(remoteComponent);
      };
      exports.AccordionItem = defineComponent("AccordionItem", ["title", "actions", "media", "subtitle"], true);
      exports.Accordion = defineComponent("Accordion", [], true);
      exports.Badge = defineComponent("Badge", [], true);
      exports.Banner = defineComponent("Banner", ["actions", "description", "title"], true);
      exports.BarChart = defineComponent("BarChart", [], true);
      exports.Box = defineComponent("Box", [], true);
      exports.ButtonGroup = defineComponent("ButtonGroup", ["menuTrigger"], true);
      exports.Button = defineComponent("Button", [], true);
      exports.Checkbox = defineComponent("Checkbox", ["label"], true);
      exports.ChipList = defineComponent("ChipList", [], true);
      exports.Chip = defineComponent("Chip", [], true);
      exports.ContextView = defineComponent("ContextView", ["actions", "banner", "footerContent", "primaryAction", "secondaryAction"], true);
      exports.DateField = defineComponent("DateField", ["label"], true);
      exports.Divider = defineComponent("Divider", [], true);
      exports.FocusView = defineComponent("FocusView", ["footerContent", "primaryAction", "secondaryAction"], true);
      exports.FormFieldGroup = defineComponent("FormFieldGroup", [], true);
      exports.Icon = defineComponent("Icon", [], true);
      exports.Img = defineComponent("Img", [], true);
      exports.Inline = defineComponent("Inline", [], true);
      exports.LineChart = defineComponent("LineChart", [], true);
      exports.Link = defineComponent("Link", [], true);
      exports.ListItem = defineComponent("ListItem", ["icon", "image", "secondaryTitle", "title", "value"], true);
      exports.List = defineComponent("List", [], true);
      exports.MenuGroup = defineComponent("MenuGroup", ["title"], true);
      exports.MenuItem = defineComponent("MenuItem", [], true);
      exports.Menu = defineComponent("Menu", ["trigger"], true);
      exports.Radio = defineComponent("Radio", ["label"], true);
      exports.Select = defineComponent("Select", ["label"], true);
      exports.SettingsView = defineComponent("SettingsView", [], true);
      exports.SignInView = defineComponent("SignInView", ["descriptionActionContents", "footerContent"], true);
      exports.Sparkline = defineComponent("Sparkline", [], true);
      exports.Spinner = defineComponent("Spinner", [], true);
      exports.StripeFileUploader = defineComponent("StripeFileUploader", [], true);
      exports.Switch = defineComponent("Switch", ["label"], true);
      exports.TabList = defineComponent("TabList", [], true);
      exports.TabPanel = defineComponent("TabPanel", [], true);
      exports.TabPanels = defineComponent("TabPanels", [], true);
      exports.Tab = defineComponent("Tab", [], true);
      exports.TableBody = defineComponent("TableBody", [], true);
      exports.TableCell = defineComponent("TableCell", [], true);
      exports.TableFooter = defineComponent("TableFooter", [], true);
      exports.TableHead = defineComponent("TableHead", [], true);
      exports.TableHeaderCell = defineComponent("TableHeaderCell", [], true);
      exports.Table = defineComponent("Table", [], true);
      exports.TableRow = defineComponent("TableRow", [], true);
      exports.Tabs = defineComponent("Tabs", [], true);
      exports.TextArea = defineComponent("TextArea", ["label"], true);
      exports.TextField = defineComponent("TextField", ["label"], true);
      exports.Tooltip = defineComponent("Tooltip", ["trigger"], true);
    }
  });

  // node_modules/invariant/browser.js
  var require_browser = __commonJS({
    "node_modules/invariant/browser.js"(exports, module) {
      "use strict";
      var invariant = function(condition, format, a, b, c, d, e, f) {
        if (true) {
          if (format === void 0) {
            throw new Error("invariant requires an error message argument");
          }
        }
        if (!condition) {
          var error;
          if (format === void 0) {
            error = new Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
            );
          } else {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
            error = new Error(
              format.replace(/%s/g, function() {
                return args[argIndex++];
              })
            );
            error.name = "Invariant Violation";
          }
          error.framesToPop = 1;
          throw error;
        }
      };
      module.exports = invariant;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/_endpoint.js
  var require_endpoint = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/_endpoint.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getHostEndpoint = void 0;
      var invariant_1 = __importDefault(require_browser());
      var getHostEndpoint = () => {
        var _a;
        const hostEndpoint = (_a = globalThis.__StripeExtExports) === null || _a === void 0 ? void 0 : _a.endpoint;
        (0, invariant_1.default)(hostEndpoint, "hostEndpoint has not been initialized");
        return hostEndpoint;
      };
      exports.getHostEndpoint = getHostEndpoint;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/apiFetch.js
  var require_apiFetch = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/apiFetch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stripeApiFetch = void 0;
      var _endpoint_1 = require_endpoint();
      var stripeApiFetch = (path, req) => {
        try {
          return (0, _endpoint_1.getHostEndpoint)().call.stripeApiFetch(path, req);
        } catch (e) {
          console.error("error calling stripe fetch", e);
          throw e;
        }
      };
      exports.stripeApiFetch = stripeApiFetch;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/httpClient.js
  var require_httpClient = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/httpClient.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AUTHORIZATION_VALUE = exports.AUTHORIZATION_HEADER = exports.createHttpClient = exports.STRIPE_API_KEY = exports.StripeAppsHttpClient = void 0;
      var invariant_1 = __importDefault(require_browser());
      var apiFetch_1 = require_apiFetch();
      var matchesStripeKey = /[ps]k_(test|live)_[A-Za-z0-9]+/;
      var StripeAppsHttpResponse = class {
        constructor(resp) {
          this._resp = resp;
        }
        getHeaders() {
          return this._resp.headers;
        }
        getStatusCode() {
          return this._resp.status;
        }
        getRawResponse() {
          return this._resp;
        }
        toStream() {
          throw new Error("Streams have not been implemented in the Stripe HTTP client");
        }
        toJSON() {
          const { json } = this._resp;
          if (json === void 0) {
            return Promise.reject(new Error("Response body undefined"));
          } else {
            return Promise.resolve(json);
          }
        }
      };
      var StripeAppsHttpClient = class {
        constructor(fetch2) {
          this._fetch = fetch2;
        }
        getClientName() {
          return "stripe-ui-extension";
        }
        makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
          return __awaiter(this, void 0, void 0, function* () {
            (0, invariant_1.default)(protocol === "https", "Must use https connections in UI extensions");
            const fetchOptions = {
              method,
              headers
            };
            if (requestData) {
              fetchOptions.body = requestData;
            }
            const authHeader = headers.Authorization;
            if (authHeader && matchesStripeKey.test(authHeader)) {
              throw new Error("Do not use actual stripe keys when using the Stripe JS API client with UI extesions.\n\n Instead, use `STRIPE_API_KEY` from `@stripe/ui-extension-sdk/http_client` as a placeholder.");
            }
            const resp = yield this._fetch(path, fetchOptions);
            return new StripeAppsHttpResponse(resp);
          });
        }
      };
      exports.StripeAppsHttpClient = StripeAppsHttpClient;
      exports.STRIPE_API_KEY = "DO_NOT_PASS_A_REAL_API_KEY";
      var createHttpClient3 = () => new StripeAppsHttpClient(apiFetch_1.stripeApiFetch);
      exports.createHttpClient = createHttpClient3;
      exports.AUTHORIZATION_HEADER = "Authorization";
      exports.AUTHORIZATION_VALUE = `Bearer ${exports.STRIPE_API_KEY}`;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/http_client.js
  var require_http_client = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/http_client.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createHttpClient = exports.STRIPE_API_KEY = exports.AUTHORIZATION_VALUE = exports.AUTHORIZATION_HEADER = void 0;
      var httpClient_1 = require_httpClient();
      Object.defineProperty(exports, "AUTHORIZATION_HEADER", { enumerable: true, get: function() {
        return httpClient_1.AUTHORIZATION_HEADER;
      } });
      Object.defineProperty(exports, "AUTHORIZATION_VALUE", { enumerable: true, get: function() {
        return httpClient_1.AUTHORIZATION_VALUE;
      } });
      Object.defineProperty(exports, "STRIPE_API_KEY", { enumerable: true, get: function() {
        return httpClient_1.STRIPE_API_KEY;
      } });
      Object.defineProperty(exports, "createHttpClient", { enumerable: true, get: function() {
        return httpClient_1.createHttpClient;
      } });
      exports.default = httpClient_1.StripeAppsHttpClient;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/clipboard.js
  var require_clipboard = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/clipboard.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.clipboardWriteText = void 0;
      var _endpoint_1 = require_endpoint();
      var clipboardWriteText = (text = "") => {
        return (0, _endpoint_1.getHostEndpoint)().call.clipboardWriteText(text);
      };
      exports.clipboardWriteText = clipboardWriteText;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/context.js
  var require_context = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/context.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.useRefreshDashboardData = void 0;
      var React3 = __importStar(__require("react"));
      var _endpoint_1 = require_endpoint();
      var useRefreshDashboardData = () => {
        return React3.useCallback(() => {
          return (0, _endpoint_1.getHostEndpoint)().call.refreshDashboardData();
        }, []);
      };
      exports.useRefreshDashboardData = useRefreshDashboardData;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/getDashboardUserEmail.js
  var require_getDashboardUserEmail = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/getDashboardUserEmail.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getDashboardUserEmail = void 0;
      var _endpoint_1 = require_endpoint();
      var httpClient_1 = require_httpClient();
      var getDashboardUserEmail = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
          const resp = yield (0, _endpoint_1.getHostEndpoint)().call.stripeApiFetch("/v1/user/email", {
            headers: {
              [httpClient_1.AUTHORIZATION_HEADER]: httpClient_1.AUTHORIZATION_VALUE
            }
          });
          if (resp.ok) {
            resp.email = resp.json.email;
            return resp;
          }
          return Promise.reject(resp);
        } catch (e) {
          console.error("Error getting dashboard user email", e);
          throw e;
        }
      });
      exports.getDashboardUserEmail = getDashboardUserEmail;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/getUserAuthorizedPermissions.js
  var require_getUserAuthorizedPermissions = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/getUserAuthorizedPermissions.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getUserAuthorizedPermissions = void 0;
      var _endpoint_1 = require_endpoint();
      var getUserAuthorizedPermissions = () => {
        return (0, _endpoint_1.getHostEndpoint)().call.getUserAuthorizedPermissions();
      };
      exports.getUserAuthorizedPermissions = getUserAuthorizedPermissions;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/isPermissionAuthorized.js
  var require_isPermissionAuthorized = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/isPermissionAuthorized.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isPermissionAuthorized = void 0;
      var _endpoint_1 = require_endpoint();
      var isPermissionAuthorized = (permission) => {
        return (0, _endpoint_1.getHostEndpoint)().call.isPermissionAuthorized(permission);
      };
      exports.isPermissionAuthorized = isPermissionAuthorized;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/isSourceInAuthorizedCSP.js
  var require_isSourceInAuthorizedCSP = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/isSourceInAuthorizedCSP.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isSourceInAuthorizedCSP = void 0;
      var _endpoint_1 = require_endpoint();
      var isSourceInAuthorizedCSP = (source) => {
        return (0, _endpoint_1.getHostEndpoint)().call.isSourceInAuthorizedCSP(source);
      };
      exports.isSourceInAuthorizedCSP = isSourceInAuthorizedCSP;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/oauth.js
  var require_oauth = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/oauth.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createOAuthState = void 0;
      var _endpoint_1 = require_endpoint();
      var createOAuthState2 = (state = "") => {
        return (0, _endpoint_1.getHostEndpoint)().call.createOAuthState(state);
      };
      exports.createOAuthState = createOAuthState2;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/platformRpcs.js
  var require_platformRpcs = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/platformRpcs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/signature.js
  var require_signature = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/signature.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fetchStripeSignature = void 0;
      var _endpoint_1 = require_endpoint();
      var fetchStripeSignature3 = (additionalPayload) => {
        return (0, _endpoint_1.getHostEndpoint)().call.fetchStripeSignature(additionalPayload);
      };
      exports.fetchStripeSignature = fetchStripeSignature3;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/toast.js
  var require_toast = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/toast.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.showToast = void 0;
      var _endpoint_1 = require_endpoint();
      var showToast = (message_1, ...args_1) => __awaiter(void 0, [message_1, ...args_1], void 0, function* (message, options = {}) {
        const endpoint = (0, _endpoint_1.getHostEndpoint)();
        return endpoint.call.showToast(message, options);
      });
      exports.showToast = showToast;
    }
  });

  // node_modules/@stripe/ui-extension-sdk/utils/index.js
  var require_utils2 = __commonJS({
    "node_modules/@stripe/ui-extension-sdk/utils/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_endpoint(), exports);
      __exportStar(require_apiFetch(), exports);
      __exportStar(require_clipboard(), exports);
      __exportStar(require_context(), exports);
      __exportStar(require_getDashboardUserEmail(), exports);
      __exportStar(require_getUserAuthorizedPermissions(), exports);
      __exportStar(require_httpClient(), exports);
      __exportStar(require_isPermissionAuthorized(), exports);
      __exportStar(require_isSourceInAuthorizedCSP(), exports);
      __exportStar(require_oauth(), exports);
      __exportStar(require_platformRpcs(), exports);
      __exportStar(require_signature(), exports);
      __exportStar(require_toast(), exports);
    }
  });

  // .build/manifest.js
  var manifest_exports = {};
  __export(manifest_exports, {
    App: () => App,
    BUILD_TIME: () => BUILD_TIME,
    CustomerDetailView: () => CustomerDetailView,
    default: () => manifest_default
  });

  // src/views/App.tsx
  var import_react = __require("react");

  // node_modules/stripe/esm/net/HttpClient.js
  var HttpClient = class {
    getClientName() {
      throw new Error("getClientName not implemented.");
    }
    makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
      throw new Error("makeRequest not implemented.");
    }
    static makeTimeoutError() {
      const timeoutErr = new TypeError(HttpClient.TIMEOUT_ERROR_CODE);
      timeoutErr.code = HttpClient.TIMEOUT_ERROR_CODE;
      return timeoutErr;
    }
  };
  HttpClient.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
  HttpClient.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
  var HttpClientResponse = class {
    constructor(statusCode, headers) {
      this._statusCode = statusCode;
      this._headers = headers;
    }
    getStatusCode() {
      return this._statusCode;
    }
    getHeaders() {
      return this._headers;
    }
    getRawResponse() {
      throw new Error("getRawResponse not implemented.");
    }
    toStream(streamCompleteCallback) {
      throw new Error("toStream not implemented.");
    }
    toJSON() {
      throw new Error("toJSON not implemented.");
    }
  };

  // node_modules/stripe/esm/net/FetchHttpClient.js
  var FetchHttpClient = class extends HttpClient {
    constructor(fetchFn) {
      super();
      if (!fetchFn) {
        if (!globalThis.fetch) {
          throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
        }
        fetchFn = globalThis.fetch;
      }
      if (globalThis.AbortController) {
        this._fetchFn = FetchHttpClient.makeFetchWithAbortTimeout(fetchFn);
      } else {
        this._fetchFn = FetchHttpClient.makeFetchWithRaceTimeout(fetchFn);
      }
    }
    static makeFetchWithRaceTimeout(fetchFn) {
      return (url, init, timeout) => {
        let pendingTimeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          pendingTimeoutId = setTimeout(() => {
            pendingTimeoutId = null;
            reject(HttpClient.makeTimeoutError());
          }, timeout);
        });
        const fetchPromise = fetchFn(url, init);
        return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
          if (pendingTimeoutId) {
            clearTimeout(pendingTimeoutId);
          }
        });
      };
    }
    static makeFetchWithAbortTimeout(fetchFn) {
      return async (url, init, timeout) => {
        const abort = new AbortController();
        let timeoutId = setTimeout(() => {
          timeoutId = null;
          abort.abort(HttpClient.makeTimeoutError());
        }, timeout);
        try {
          return await fetchFn(url, Object.assign(Object.assign({}, init), { signal: abort.signal }));
        } catch (err) {
          if (err.name === "AbortError") {
            throw HttpClient.makeTimeoutError();
          } else {
            throw err;
          }
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      };
    }
    getClientName() {
      return "fetch";
    }
    async makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
      const isInsecureConnection = protocol === "http";
      const url = new URL(path, `${isInsecureConnection ? "http" : "https"}://${host}`);
      url.port = port;
      const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
      const body = requestData || (methodHasPayload ? "" : void 0);
      const res = await this._fetchFn(url.toString(), {
        method,
        headers,
        body
      }, timeout);
      return new FetchHttpClientResponse(res);
    }
  };
  var FetchHttpClientResponse = class extends HttpClientResponse {
    constructor(res) {
      super(res.status, FetchHttpClientResponse._transformHeadersToObject(res.headers));
      this._res = res;
    }
    getRawResponse() {
      return this._res;
    }
    toStream(streamCompleteCallback) {
      streamCompleteCallback();
      return this._res.body;
    }
    toJSON() {
      return this._res.json();
    }
    static _transformHeadersToObject(headers) {
      const headersObj = {};
      for (const entry of headers) {
        if (!Array.isArray(entry) || entry.length != 2) {
          throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
        }
        headersObj[entry[0]] = entry[1];
      }
      return headersObj;
    }
  };

  // node_modules/stripe/esm/crypto/CryptoProvider.js
  var CryptoProvider = class {
    computeHMACSignature(payload, secret) {
      throw new Error("computeHMACSignature not implemented.");
    }
    computeHMACSignatureAsync(payload, secret) {
      throw new Error("computeHMACSignatureAsync not implemented.");
    }
  };
  var CryptoProviderOnlySupportsAsyncError = class extends Error {
  };

  // node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
  var SubtleCryptoProvider = class extends CryptoProvider {
    constructor(subtleCrypto) {
      super();
      this.subtleCrypto = subtleCrypto || crypto.subtle;
    }
    computeHMACSignature(payload, secret) {
      throw new CryptoProviderOnlySupportsAsyncError("SubtleCryptoProvider cannot be used in a synchronous context.");
    }
    async computeHMACSignatureAsync(payload, secret) {
      const encoder = new TextEncoder();
      const key = await this.subtleCrypto.importKey("raw", encoder.encode(secret), {
        name: "HMAC",
        hash: { name: "SHA-256" }
      }, false, ["sign"]);
      const signatureBuffer = await this.subtleCrypto.sign("hmac", key, encoder.encode(payload));
      const signatureBytes = new Uint8Array(signatureBuffer);
      const signatureHexCodes = new Array(signatureBytes.length);
      for (let i = 0; i < signatureBytes.length; i++) {
        signatureHexCodes[i] = byteHexMapping[signatureBytes[i]];
      }
      return signatureHexCodes.join("");
    }
  };
  var byteHexMapping = new Array(256);
  for (let i = 0; i < byteHexMapping.length; i++) {
    byteHexMapping[i] = i.toString(16).padStart(2, "0");
  }

  // node_modules/stripe/esm/platform/PlatformFunctions.js
  var PlatformFunctions = class {
    constructor() {
      this._fetchFn = null;
      this._agent = null;
    }
    getUname() {
      throw new Error("getUname not implemented.");
    }
    uuid4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    }
    secureCompare(a, b) {
      if (a.length !== b.length) {
        return false;
      }
      const len = a.length;
      let result = 0;
      for (let i = 0; i < len; ++i) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
      }
      return result === 0;
    }
    createEmitter() {
      throw new Error("createEmitter not implemented.");
    }
    tryBufferData(data) {
      throw new Error("tryBufferData not implemented.");
    }
    createNodeHttpClient(agent) {
      throw new Error("createNodeHttpClient not implemented.");
    }
    createFetchHttpClient(fetchFn) {
      return new FetchHttpClient(fetchFn);
    }
    createDefaultHttpClient() {
      throw new Error("createDefaultHttpClient not implemented.");
    }
    createNodeCryptoProvider() {
      throw new Error("createNodeCryptoProvider not implemented.");
    }
    createSubtleCryptoProvider(subtleCrypto) {
      return new SubtleCryptoProvider(subtleCrypto);
    }
    createDefaultCryptoProvider() {
      throw new Error("createDefaultCryptoProvider not implemented.");
    }
  };

  // node_modules/stripe/esm/StripeEmitter.js
  var _StripeEvent = class extends Event {
    constructor(eventName, data) {
      super(eventName);
      this.data = data;
    }
  };
  var StripeEmitter = class {
    constructor() {
      this.eventTarget = new EventTarget();
      this.listenerMapping = /* @__PURE__ */ new Map();
    }
    on(eventName, listener) {
      const listenerWrapper = (event) => {
        listener(event.data);
      };
      this.listenerMapping.set(listener, listenerWrapper);
      return this.eventTarget.addEventListener(eventName, listenerWrapper);
    }
    removeListener(eventName, listener) {
      const listenerWrapper = this.listenerMapping.get(listener);
      this.listenerMapping.delete(listener);
      return this.eventTarget.removeEventListener(eventName, listenerWrapper);
    }
    once(eventName, listener) {
      const listenerWrapper = (event) => {
        listener(event.data);
      };
      this.listenerMapping.set(listener, listenerWrapper);
      return this.eventTarget.addEventListener(eventName, listenerWrapper, {
        once: true
      });
    }
    emit(eventName, data) {
      return this.eventTarget.dispatchEvent(new _StripeEvent(eventName, data));
    }
  };

  // node_modules/stripe/esm/platform/WebPlatformFunctions.js
  var WebPlatformFunctions = class extends PlatformFunctions {
    getUname() {
      return Promise.resolve(null);
    }
    createEmitter() {
      return new StripeEmitter();
    }
    tryBufferData(data) {
      if (data.file.data instanceof ReadableStream) {
        throw new Error("Uploading a file as a stream is not supported in non-Node environments. Please open or upvote an issue at github.com/stripe/stripe-node if you use this, detailing your use-case.");
      }
      return Promise.resolve(data);
    }
    createNodeHttpClient() {
      throw new Error("Stripe: `createNodeHttpClient()` is not available in non-Node environments. Please use `createFetchHttpClient()` instead.");
    }
    createDefaultHttpClient() {
      return super.createFetchHttpClient();
    }
    createNodeCryptoProvider() {
      throw new Error("Stripe: `createNodeCryptoProvider()` is not available in non-Node environments. Please use `createSubtleCryptoProvider()` instead.");
    }
    createDefaultCryptoProvider() {
      return this.createSubtleCryptoProvider();
    }
  };

  // node_modules/stripe/esm/Error.js
  var Error_exports = {};
  __export(Error_exports, {
    StripeAPIError: () => StripeAPIError,
    StripeAuthenticationError: () => StripeAuthenticationError,
    StripeCardError: () => StripeCardError,
    StripeConnectionError: () => StripeConnectionError,
    StripeError: () => StripeError,
    StripeIdempotencyError: () => StripeIdempotencyError,
    StripeInvalidGrantError: () => StripeInvalidGrantError,
    StripeInvalidRequestError: () => StripeInvalidRequestError,
    StripePermissionError: () => StripePermissionError,
    StripeRateLimitError: () => StripeRateLimitError,
    StripeSignatureVerificationError: () => StripeSignatureVerificationError,
    StripeUnknownError: () => StripeUnknownError,
    generate: () => generate
  });
  var generate = (rawStripeError) => {
    switch (rawStripeError.type) {
      case "card_error":
        return new StripeCardError(rawStripeError);
      case "invalid_request_error":
        return new StripeInvalidRequestError(rawStripeError);
      case "api_error":
        return new StripeAPIError(rawStripeError);
      case "authentication_error":
        return new StripeAuthenticationError(rawStripeError);
      case "rate_limit_error":
        return new StripeRateLimitError(rawStripeError);
      case "idempotency_error":
        return new StripeIdempotencyError(rawStripeError);
      case "invalid_grant":
        return new StripeInvalidGrantError(rawStripeError);
      default:
        return new StripeUnknownError(rawStripeError);
    }
  };
  var StripeError = class extends Error {
    constructor(raw = {}, type = null) {
      super(raw.message);
      this.type = type || this.constructor.name;
      this.raw = raw;
      this.rawType = raw.type;
      this.code = raw.code;
      this.doc_url = raw.doc_url;
      this.param = raw.param;
      this.detail = raw.detail;
      this.headers = raw.headers;
      this.requestId = raw.requestId;
      this.statusCode = raw.statusCode;
      this.message = raw.message;
      this.charge = raw.charge;
      this.decline_code = raw.decline_code;
      this.payment_intent = raw.payment_intent;
      this.payment_method = raw.payment_method;
      this.payment_method_type = raw.payment_method_type;
      this.setup_intent = raw.setup_intent;
      this.source = raw.source;
    }
  };
  StripeError.generate = generate;
  var StripeCardError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeCardError");
    }
  };
  var StripeInvalidRequestError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeInvalidRequestError");
    }
  };
  var StripeAPIError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeAPIError");
    }
  };
  var StripeAuthenticationError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeAuthenticationError");
    }
  };
  var StripePermissionError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripePermissionError");
    }
  };
  var StripeRateLimitError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeRateLimitError");
    }
  };
  var StripeConnectionError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeConnectionError");
    }
  };
  var StripeSignatureVerificationError = class extends StripeError {
    constructor(header, payload, raw = {}) {
      super(raw, "StripeSignatureVerificationError");
      this.header = header;
      this.payload = payload;
    }
  };
  var StripeIdempotencyError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeIdempotencyError");
    }
  };
  var StripeInvalidGrantError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeInvalidGrantError");
    }
  };
  var StripeUnknownError = class extends StripeError {
    constructor(raw = {}) {
      super(raw, "StripeUnknownError");
    }
  };

  // node_modules/stripe/esm/apiVersion.js
  var ApiVersion = "2023-10-16";

  // node_modules/stripe/esm/resources.js
  var resources_exports = {};
  __export(resources_exports, {
    Account: () => Accounts2,
    AccountLinks: () => AccountLinks,
    AccountSessions: () => AccountSessions,
    Accounts: () => Accounts2,
    ApplePayDomains: () => ApplePayDomains,
    ApplicationFees: () => ApplicationFees,
    Apps: () => Apps,
    Balance: () => Balance,
    BalanceTransactions: () => BalanceTransactions,
    Billing: () => Billing,
    BillingPortal: () => BillingPortal,
    Charges: () => Charges,
    Checkout: () => Checkout,
    Climate: () => Climate,
    ConfirmationTokens: () => ConfirmationTokens2,
    CountrySpecs: () => CountrySpecs,
    Coupons: () => Coupons,
    CreditNotes: () => CreditNotes,
    CustomerSessions: () => CustomerSessions,
    Customers: () => Customers2,
    Disputes: () => Disputes2,
    Entitlements: () => Entitlements,
    EphemeralKeys: () => EphemeralKeys,
    Events: () => Events,
    ExchangeRates: () => ExchangeRates,
    FileLinks: () => FileLinks,
    Files: () => Files,
    FinancialConnections: () => FinancialConnections,
    Forwarding: () => Forwarding,
    Identity: () => Identity,
    InvoiceItems: () => InvoiceItems,
    Invoices: () => Invoices,
    Issuing: () => Issuing,
    Mandates: () => Mandates,
    OAuth: () => OAuth,
    PaymentIntents: () => PaymentIntents,
    PaymentLinks: () => PaymentLinks,
    PaymentMethodConfigurations: () => PaymentMethodConfigurations,
    PaymentMethodDomains: () => PaymentMethodDomains,
    PaymentMethods: () => PaymentMethods,
    Payouts: () => Payouts,
    Plans: () => Plans,
    Prices: () => Prices,
    Products: () => Products2,
    PromotionCodes: () => PromotionCodes,
    Quotes: () => Quotes,
    Radar: () => Radar,
    Refunds: () => Refunds2,
    Reporting: () => Reporting,
    Reviews: () => Reviews,
    SetupAttempts: () => SetupAttempts,
    SetupIntents: () => SetupIntents,
    ShippingRates: () => ShippingRates,
    Sigma: () => Sigma,
    Sources: () => Sources,
    SubscriptionItems: () => SubscriptionItems,
    SubscriptionSchedules: () => SubscriptionSchedules,
    Subscriptions: () => Subscriptions,
    Tax: () => Tax,
    TaxCodes: () => TaxCodes,
    TaxIds: () => TaxIds,
    TaxRates: () => TaxRates,
    Terminal: () => Terminal,
    TestHelpers: () => TestHelpers,
    Tokens: () => Tokens2,
    Topups: () => Topups,
    Transfers: () => Transfers,
    Treasury: () => Treasury,
    WebhookEndpoints: () => WebhookEndpoints
  });

  // node_modules/stripe/esm/ResourceNamespace.js
  function ResourceNamespace(stripe3, resources) {
    for (const name in resources) {
      const camelCaseName = name[0].toLowerCase() + name.substring(1);
      const resource = new resources[name](stripe3);
      this[camelCaseName] = resource;
    }
  }
  function resourceNamespace(namespace, resources) {
    return function(stripe3) {
      return new ResourceNamespace(stripe3, resources);
    };
  }

  // node_modules/stripe/esm/utils.js
  var qs = __toESM(require_lib(), 1);
  var OPTIONS_KEYS = [
    "apiKey",
    "idempotencyKey",
    "stripeAccount",
    "apiVersion",
    "maxNetworkRetries",
    "timeout",
    "host"
  ];
  function isOptionsHash(o) {
    return o && typeof o === "object" && OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop));
  }
  function stringifyRequestData(data) {
    return qs.stringify(data, {
      serializeDate: (d) => Math.floor(d.getTime() / 1e3).toString()
    }).replace(/%5B/g, "[").replace(/%5D/g, "]");
  }
  var makeURLInterpolator = (() => {
    const rc = {
      "\n": "\\n",
      '"': '\\"',
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    return (str) => {
      const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
      return (outputs) => {
        return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => encodeURIComponent(outputs[$1] || ""));
      };
    };
  })();
  function extractUrlParams(path) {
    const params = path.match(/\{\w+\}/g);
    if (!params) {
      return [];
    }
    return params.map((param) => param.replace(/[{}]/g, ""));
  }
  function getDataFromArgs(args) {
    if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
      return {};
    }
    if (!isOptionsHash(args[0])) {
      return args.shift();
    }
    const argKeys = Object.keys(args[0]);
    const optionKeysInArgs = argKeys.filter((key) => OPTIONS_KEYS.includes(key));
    if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
      emitWarning(`Options found in arguments (${optionKeysInArgs.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`);
    }
    return {};
  }
  function getOptionsFromArgs(args) {
    const opts = {
      auth: null,
      host: null,
      headers: {},
      settings: {}
    };
    if (args.length > 0) {
      const arg = args[args.length - 1];
      if (typeof arg === "string") {
        opts.auth = args.pop();
      } else if (isOptionsHash(arg)) {
        const params = Object.assign({}, args.pop());
        const extraKeys = Object.keys(params).filter((key) => !OPTIONS_KEYS.includes(key));
        if (extraKeys.length) {
          emitWarning(`Invalid options found (${extraKeys.join(", ")}); ignoring.`);
        }
        if (params.apiKey) {
          opts.auth = params.apiKey;
        }
        if (params.idempotencyKey) {
          opts.headers["Idempotency-Key"] = params.idempotencyKey;
        }
        if (params.stripeAccount) {
          opts.headers["Stripe-Account"] = params.stripeAccount;
        }
        if (params.apiVersion) {
          opts.headers["Stripe-Version"] = params.apiVersion;
        }
        if (Number.isInteger(params.maxNetworkRetries)) {
          opts.settings.maxNetworkRetries = params.maxNetworkRetries;
        }
        if (Number.isInteger(params.timeout)) {
          opts.settings.timeout = params.timeout;
        }
        if (params.host) {
          opts.host = params.host;
        }
      }
    }
    return opts;
  }
  function protoExtend(sub) {
    const Super = this;
    const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor") ? sub.constructor : function(...args) {
      Super.apply(this, args);
    };
    Object.assign(Constructor, Super);
    Constructor.prototype = Object.create(Super.prototype);
    Object.assign(Constructor.prototype, sub);
    return Constructor;
  }
  function removeNullish(obj) {
    if (typeof obj !== "object") {
      throw new Error("Argument must be an object");
    }
    return Object.keys(obj).reduce((result, key) => {
      if (obj[key] != null) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }
  function normalizeHeaders(obj) {
    if (!(obj && typeof obj === "object")) {
      return obj;
    }
    return Object.keys(obj).reduce((result, header) => {
      result[normalizeHeader(header)] = obj[header];
      return result;
    }, {});
  }
  function normalizeHeader(header) {
    return header.split("-").map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()).join("-");
  }
  function callbackifyPromiseWithTimeout(promise, callback) {
    if (callback) {
      return promise.then((res) => {
        setTimeout(() => {
          callback(null, res);
        }, 0);
      }, (err) => {
        setTimeout(() => {
          callback(err, null);
        }, 0);
      });
    }
    return promise;
  }
  function pascalToCamelCase(name) {
    if (name === "OAuth") {
      return "oauth";
    } else {
      return name[0].toLowerCase() + name.substring(1);
    }
  }
  function emitWarning(warning) {
    if (typeof process.emitWarning !== "function") {
      return console.warn(`Stripe: ${warning}`);
    }
    return process.emitWarning(warning, "Stripe");
  }
  function isObject(obj) {
    const type = typeof obj;
    return (type === "function" || type === "object") && !!obj;
  }
  function flattenAndStringify(data) {
    const result = {};
    const step = (obj, prevKey) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = prevKey ? `${prevKey}[${key}]` : key;
        if (isObject(value)) {
          if (!(value instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(value, "data")) {
            return step(value, newKey);
          } else {
            result[newKey] = value;
          }
        } else {
          result[newKey] = String(value);
        }
      });
    };
    step(data, null);
    return result;
  }
  function validateInteger(name, n, defaultVal) {
    if (!Number.isInteger(n)) {
      if (defaultVal !== void 0) {
        return defaultVal;
      } else {
        throw new Error(`${name} must be an integer`);
      }
    }
    return n;
  }
  function determineProcessUserAgentProperties() {
    return typeof process === "undefined" ? {} : {
      lang_version: process.version,
      platform: process.platform
    };
  }

  // node_modules/stripe/esm/autoPagination.js
  var StripeIterator = class {
    constructor(firstPagePromise, requestArgs, spec, stripeResource) {
      this.index = 0;
      this.pagePromise = firstPagePromise;
      this.promiseCache = { currentPromise: null };
      this.requestArgs = requestArgs;
      this.spec = spec;
      this.stripeResource = stripeResource;
    }
    async iterate(pageResult) {
      if (!(pageResult && pageResult.data && typeof pageResult.data.length === "number")) {
        throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
      }
      const reverseIteration = isReverseIteration(this.requestArgs);
      if (this.index < pageResult.data.length) {
        const idx = reverseIteration ? pageResult.data.length - 1 - this.index : this.index;
        const value = pageResult.data[idx];
        this.index += 1;
        return { value, done: false };
      } else if (pageResult.has_more) {
        this.index = 0;
        this.pagePromise = this.getNextPage(pageResult);
        const nextPageResult = await this.pagePromise;
        return this.iterate(nextPageResult);
      }
      return { done: true, value: void 0 };
    }
    getNextPage(_pageResult) {
      throw new Error("Unimplemented");
    }
    async _next() {
      return this.iterate(await this.pagePromise);
    }
    next() {
      if (this.promiseCache.currentPromise) {
        return this.promiseCache.currentPromise;
      }
      const nextPromise = (async () => {
        const ret = await this._next();
        this.promiseCache.currentPromise = null;
        return ret;
      })();
      this.promiseCache.currentPromise = nextPromise;
      return nextPromise;
    }
  };
  var ListIterator = class extends StripeIterator {
    getNextPage(pageResult) {
      const reverseIteration = isReverseIteration(this.requestArgs);
      const lastId = getLastId(pageResult, reverseIteration);
      return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
        [reverseIteration ? "ending_before" : "starting_after"]: lastId
      });
    }
  };
  var SearchIterator = class extends StripeIterator {
    getNextPage(pageResult) {
      if (!pageResult.next_page) {
        throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
      }
      return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
        page: pageResult.next_page
      });
    }
  };
  var makeAutoPaginationMethods = (stripeResource, requestArgs, spec, firstPagePromise) => {
    if (spec.methodType === "search") {
      return makeAutoPaginationMethodsFromIterator(new SearchIterator(firstPagePromise, requestArgs, spec, stripeResource));
    }
    if (spec.methodType === "list") {
      return makeAutoPaginationMethodsFromIterator(new ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
    }
    return null;
  };
  var makeAutoPaginationMethodsFromIterator = (iterator) => {
    const autoPagingEach = makeAutoPagingEach((...args) => iterator.next(...args));
    const autoPagingToArray = makeAutoPagingToArray(autoPagingEach);
    const autoPaginationMethods = {
      autoPagingEach,
      autoPagingToArray,
      next: () => iterator.next(),
      return: () => {
        return {};
      },
      [getAsyncIteratorSymbol()]: () => {
        return autoPaginationMethods;
      }
    };
    return autoPaginationMethods;
  };
  function getAsyncIteratorSymbol() {
    if (typeof Symbol !== "undefined" && Symbol.asyncIterator) {
      return Symbol.asyncIterator;
    }
    return "@@asyncIterator";
  }
  function getDoneCallback(args) {
    if (args.length < 2) {
      return null;
    }
    const onDone = args[1];
    if (typeof onDone !== "function") {
      throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof onDone}`);
    }
    return onDone;
  }
  function getItemCallback(args) {
    if (args.length === 0) {
      return void 0;
    }
    const onItem = args[0];
    if (typeof onItem !== "function") {
      throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof onItem}`);
    }
    if (onItem.length === 2) {
      return onItem;
    }
    if (onItem.length > 2) {
      throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${onItem}`);
    }
    return function _onItem(item, next) {
      const shouldContinue = onItem(item);
      next(shouldContinue);
    };
  }
  function getLastId(listResult, reverseIteration) {
    const lastIdx = reverseIteration ? 0 : listResult.data.length - 1;
    const lastItem = listResult.data[lastIdx];
    const lastId = lastItem && lastItem.id;
    if (!lastId) {
      throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
    }
    return lastId;
  }
  function makeAutoPagingEach(asyncIteratorNext) {
    return function autoPagingEach() {
      const args = [].slice.call(arguments);
      const onItem = getItemCallback(args);
      const onDone = getDoneCallback(args);
      if (args.length > 2) {
        throw Error(`autoPagingEach takes up to two arguments; received ${args}`);
      }
      const autoPagePromise = wrapAsyncIteratorWithCallback(
        asyncIteratorNext,
        onItem
      );
      return callbackifyPromiseWithTimeout(autoPagePromise, onDone);
    };
  }
  function makeAutoPagingToArray(autoPagingEach) {
    return function autoPagingToArray(opts, onDone) {
      const limit = opts && opts.limit;
      if (!limit) {
        throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
      }
      if (limit > 1e4) {
        throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
      }
      const promise = new Promise((resolve, reject) => {
        const items = [];
        autoPagingEach((item) => {
          items.push(item);
          if (items.length >= limit) {
            return false;
          }
        }).then(() => {
          resolve(items);
        }).catch(reject);
      });
      return callbackifyPromiseWithTimeout(promise, onDone);
    };
  }
  function wrapAsyncIteratorWithCallback(asyncIteratorNext, onItem) {
    return new Promise((resolve, reject) => {
      function handleIteration(iterResult) {
        if (iterResult.done) {
          resolve();
          return;
        }
        const item = iterResult.value;
        return new Promise((next) => {
          onItem(item, next);
        }).then((shouldContinue) => {
          if (shouldContinue === false) {
            return handleIteration({ done: true, value: void 0 });
          } else {
            return asyncIteratorNext().then(handleIteration);
          }
        });
      }
      asyncIteratorNext().then(handleIteration).catch(reject);
    });
  }
  function isReverseIteration(requestArgs) {
    const args = [].slice.call(requestArgs);
    const dataFromArgs = getDataFromArgs(args);
    return !!dataFromArgs.ending_before;
  }

  // node_modules/stripe/esm/StripeMethod.js
  function stripeMethod(spec) {
    if (spec.path !== void 0 && spec.fullPath !== void 0) {
      throw new Error(`Method spec specified both a 'path' (${spec.path}) and a 'fullPath' (${spec.fullPath}).`);
    }
    return function(...args) {
      const callback = typeof args[args.length - 1] == "function" && args.pop();
      spec.urlParams = extractUrlParams(spec.fullPath || this.createResourcePathWithSymbols(spec.path || ""));
      const requestPromise = callbackifyPromiseWithTimeout(this._makeRequest(args, spec, {}), callback);
      Object.assign(requestPromise, makeAutoPaginationMethods(this, args, spec, requestPromise));
      return requestPromise;
    };
  }

  // node_modules/stripe/esm/StripeResource.js
  StripeResource.extend = protoExtend;
  StripeResource.method = stripeMethod;
  StripeResource.MAX_BUFFERED_REQUEST_METRICS = 100;
  function StripeResource(stripe3, deprecatedUrlData) {
    this._stripe = stripe3;
    if (deprecatedUrlData) {
      throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
    }
    this.basePath = makeURLInterpolator(
      this.basePath || stripe3.getApiField("basePath")
    );
    this.resourcePath = this.path;
    this.path = makeURLInterpolator(this.path);
    this.initialize(...arguments);
  }
  StripeResource.prototype = {
    _stripe: null,
    path: "",
    resourcePath: "",
    basePath: null,
    initialize() {
    },
    requestDataProcessor: null,
    validateRequest: null,
    createFullPath(commandPath, urlData) {
      const urlParts = [this.basePath(urlData), this.path(urlData)];
      if (typeof commandPath === "function") {
        const computedCommandPath = commandPath(urlData);
        if (computedCommandPath) {
          urlParts.push(computedCommandPath);
        }
      } else {
        urlParts.push(commandPath);
      }
      return this._joinUrlParts(urlParts);
    },
    createResourcePathWithSymbols(pathWithSymbols) {
      if (pathWithSymbols) {
        return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
      } else {
        return `/${this.resourcePath}`;
      }
    },
    _joinUrlParts(parts) {
      return parts.join("/").replace(/\/{2,}/g, "/");
    },
    _getRequestOpts(requestArgs, spec, overrideData) {
      const requestMethod = (spec.method || "GET").toUpperCase();
      const usage = spec.usage || [];
      const urlParams = spec.urlParams || [];
      const encode = spec.encode || ((data2) => data2);
      const isUsingFullPath = !!spec.fullPath;
      const commandPath = makeURLInterpolator(isUsingFullPath ? spec.fullPath : spec.path || "");
      const path = isUsingFullPath ? spec.fullPath : this.createResourcePathWithSymbols(spec.path);
      const args = [].slice.call(requestArgs);
      const urlData = urlParams.reduce((urlData2, param) => {
        const arg = args.shift();
        if (typeof arg !== "string") {
          throw new Error(`Stripe: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`);
        }
        urlData2[param] = arg;
        return urlData2;
      }, {});
      const dataFromArgs = getDataFromArgs(args);
      const data = encode(Object.assign({}, dataFromArgs, overrideData));
      const options = getOptionsFromArgs(args);
      const host = options.host || spec.host;
      const streaming = !!spec.streaming;
      if (args.filter((x) => x != null).length) {
        throw new Error(`Stripe: Unknown arguments (${args}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${requestMethod} \`${path}\`)`);
      }
      const requestPath = isUsingFullPath ? commandPath(urlData) : this.createFullPath(commandPath, urlData);
      const headers = Object.assign(options.headers, spec.headers);
      if (spec.validator) {
        spec.validator(data, { headers });
      }
      const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
      const bodyData = dataInQuery ? {} : data;
      const queryData = dataInQuery ? data : {};
      return {
        requestMethod,
        requestPath,
        bodyData,
        queryData,
        auth: options.auth,
        headers,
        host: host !== null && host !== void 0 ? host : null,
        streaming,
        settings: options.settings,
        usage
      };
    },
    _makeRequest(requestArgs, spec, overrideData) {
      return new Promise((resolve, reject) => {
        var _a;
        let opts;
        try {
          opts = this._getRequestOpts(requestArgs, spec, overrideData);
        } catch (err) {
          reject(err);
          return;
        }
        function requestCallback(err, response) {
          if (err) {
            reject(err);
          } else {
            resolve(spec.transformResponseData ? spec.transformResponseData(response) : response);
          }
        }
        const emptyQuery = Object.keys(opts.queryData).length === 0;
        const path = [
          opts.requestPath,
          emptyQuery ? "" : "?",
          stringifyRequestData(opts.queryData)
        ].join("");
        const { headers, settings } = opts;
        this._stripe._requestSender._request(opts.requestMethod, opts.host, path, opts.bodyData, opts.auth, { headers, settings, streaming: opts.streaming }, opts.usage, requestCallback, (_a = this.requestDataProcessor) === null || _a === void 0 ? void 0 : _a.bind(this));
      });
    }
  };

  // node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
  var stripeMethod2 = StripeResource.method;
  var Accounts = StripeResource.extend({
    retrieve: stripeMethod2({
      method: "GET",
      fullPath: "/v1/financial_connections/accounts/{account}"
    }),
    list: stripeMethod2({
      method: "GET",
      fullPath: "/v1/financial_connections/accounts",
      methodType: "list"
    }),
    disconnect: stripeMethod2({
      method: "POST",
      fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
    }),
    listOwners: stripeMethod2({
      method: "GET",
      fullPath: "/v1/financial_connections/accounts/{account}/owners",
      methodType: "list"
    }),
    refresh: stripeMethod2({
      method: "POST",
      fullPath: "/v1/financial_connections/accounts/{account}/refresh"
    }),
    subscribe: stripeMethod2({
      method: "POST",
      fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
    }),
    unsubscribe: stripeMethod2({
      method: "POST",
      fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
    })
  });

  // node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
  var stripeMethod3 = StripeResource.method;
  var ActiveEntitlements = StripeResource.extend({
    retrieve: stripeMethod3({
      method: "GET",
      fullPath: "/v1/entitlements/active_entitlements/{id}"
    }),
    list: stripeMethod3({
      method: "GET",
      fullPath: "/v1/entitlements/active_entitlements",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
  var stripeMethod4 = StripeResource.method;
  var Authorizations = StripeResource.extend({
    create: stripeMethod4({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/authorizations"
    }),
    capture: stripeMethod4({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
    }),
    expire: stripeMethod4({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
    }),
    increment: stripeMethod4({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
    }),
    reverse: stripeMethod4({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Authorizations.js
  var stripeMethod5 = StripeResource.method;
  var Authorizations2 = StripeResource.extend({
    retrieve: stripeMethod5({
      method: "GET",
      fullPath: "/v1/issuing/authorizations/{authorization}"
    }),
    update: stripeMethod5({
      method: "POST",
      fullPath: "/v1/issuing/authorizations/{authorization}"
    }),
    list: stripeMethod5({
      method: "GET",
      fullPath: "/v1/issuing/authorizations",
      methodType: "list"
    }),
    approve: stripeMethod5({
      method: "POST",
      fullPath: "/v1/issuing/authorizations/{authorization}/approve"
    }),
    decline: stripeMethod5({
      method: "POST",
      fullPath: "/v1/issuing/authorizations/{authorization}/decline"
    })
  });

  // node_modules/stripe/esm/resources/Tax/Calculations.js
  var stripeMethod6 = StripeResource.method;
  var Calculations = StripeResource.extend({
    create: stripeMethod6({ method: "POST", fullPath: "/v1/tax/calculations" }),
    listLineItems: stripeMethod6({
      method: "GET",
      fullPath: "/v1/tax/calculations/{calculation}/line_items",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Cardholders.js
  var stripeMethod7 = StripeResource.method;
  var Cardholders = StripeResource.extend({
    create: stripeMethod7({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
    retrieve: stripeMethod7({
      method: "GET",
      fullPath: "/v1/issuing/cardholders/{cardholder}"
    }),
    update: stripeMethod7({
      method: "POST",
      fullPath: "/v1/issuing/cardholders/{cardholder}"
    }),
    list: stripeMethod7({
      method: "GET",
      fullPath: "/v1/issuing/cardholders",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
  var stripeMethod8 = StripeResource.method;
  var Cards = StripeResource.extend({
    deliverCard: stripeMethod8({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
    }),
    failCard: stripeMethod8({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
    }),
    returnCard: stripeMethod8({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
    }),
    shipCard: stripeMethod8({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Cards.js
  var stripeMethod9 = StripeResource.method;
  var Cards2 = StripeResource.extend({
    create: stripeMethod9({ method: "POST", fullPath: "/v1/issuing/cards" }),
    retrieve: stripeMethod9({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
    update: stripeMethod9({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
    list: stripeMethod9({
      method: "GET",
      fullPath: "/v1/issuing/cards",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/BillingPortal/Configurations.js
  var stripeMethod10 = StripeResource.method;
  var Configurations = StripeResource.extend({
    create: stripeMethod10({
      method: "POST",
      fullPath: "/v1/billing_portal/configurations"
    }),
    retrieve: stripeMethod10({
      method: "GET",
      fullPath: "/v1/billing_portal/configurations/{configuration}"
    }),
    update: stripeMethod10({
      method: "POST",
      fullPath: "/v1/billing_portal/configurations/{configuration}"
    }),
    list: stripeMethod10({
      method: "GET",
      fullPath: "/v1/billing_portal/configurations",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Terminal/Configurations.js
  var stripeMethod11 = StripeResource.method;
  var Configurations2 = StripeResource.extend({
    create: stripeMethod11({
      method: "POST",
      fullPath: "/v1/terminal/configurations"
    }),
    retrieve: stripeMethod11({
      method: "GET",
      fullPath: "/v1/terminal/configurations/{configuration}"
    }),
    update: stripeMethod11({
      method: "POST",
      fullPath: "/v1/terminal/configurations/{configuration}"
    }),
    list: stripeMethod11({
      method: "GET",
      fullPath: "/v1/terminal/configurations",
      methodType: "list"
    }),
    del: stripeMethod11({
      method: "DELETE",
      fullPath: "/v1/terminal/configurations/{configuration}"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
  var stripeMethod12 = StripeResource.method;
  var ConfirmationTokens = StripeResource.extend({
    create: stripeMethod12({
      method: "POST",
      fullPath: "/v1/test_helpers/confirmation_tokens"
    })
  });

  // node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
  var stripeMethod13 = StripeResource.method;
  var ConnectionTokens = StripeResource.extend({
    create: stripeMethod13({
      method: "POST",
      fullPath: "/v1/terminal/connection_tokens"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/CreditReversals.js
  var stripeMethod14 = StripeResource.method;
  var CreditReversals = StripeResource.extend({
    create: stripeMethod14({
      method: "POST",
      fullPath: "/v1/treasury/credit_reversals"
    }),
    retrieve: stripeMethod14({
      method: "GET",
      fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
    }),
    list: stripeMethod14({
      method: "GET",
      fullPath: "/v1/treasury/credit_reversals",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Customers.js
  var stripeMethod15 = StripeResource.method;
  var Customers = StripeResource.extend({
    fundCashBalance: stripeMethod15({
      method: "POST",
      fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/DebitReversals.js
  var stripeMethod16 = StripeResource.method;
  var DebitReversals = StripeResource.extend({
    create: stripeMethod16({
      method: "POST",
      fullPath: "/v1/treasury/debit_reversals"
    }),
    retrieve: stripeMethod16({
      method: "GET",
      fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
    }),
    list: stripeMethod16({
      method: "GET",
      fullPath: "/v1/treasury/debit_reversals",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Disputes.js
  var stripeMethod17 = StripeResource.method;
  var Disputes = StripeResource.extend({
    create: stripeMethod17({ method: "POST", fullPath: "/v1/issuing/disputes" }),
    retrieve: stripeMethod17({
      method: "GET",
      fullPath: "/v1/issuing/disputes/{dispute}"
    }),
    update: stripeMethod17({
      method: "POST",
      fullPath: "/v1/issuing/disputes/{dispute}"
    }),
    list: stripeMethod17({
      method: "GET",
      fullPath: "/v1/issuing/disputes",
      methodType: "list"
    }),
    submit: stripeMethod17({
      method: "POST",
      fullPath: "/v1/issuing/disputes/{dispute}/submit"
    })
  });

  // node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
  var stripeMethod18 = StripeResource.method;
  var EarlyFraudWarnings = StripeResource.extend({
    retrieve: stripeMethod18({
      method: "GET",
      fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
    }),
    list: stripeMethod18({
      method: "GET",
      fullPath: "/v1/radar/early_fraud_warnings",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Entitlements/Features.js
  var stripeMethod19 = StripeResource.method;
  var Features = StripeResource.extend({
    create: stripeMethod19({ method: "POST", fullPath: "/v1/entitlements/features" }),
    retrieve: stripeMethod19({
      method: "GET",
      fullPath: "/v1/entitlements/features/{id}"
    }),
    update: stripeMethod19({
      method: "POST",
      fullPath: "/v1/entitlements/features/{id}"
    }),
    list: stripeMethod19({
      method: "GET",
      fullPath: "/v1/entitlements/features",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
  var stripeMethod20 = StripeResource.method;
  var FinancialAccounts = StripeResource.extend({
    create: stripeMethod20({
      method: "POST",
      fullPath: "/v1/treasury/financial_accounts"
    }),
    retrieve: stripeMethod20({
      method: "GET",
      fullPath: "/v1/treasury/financial_accounts/{financial_account}"
    }),
    update: stripeMethod20({
      method: "POST",
      fullPath: "/v1/treasury/financial_accounts/{financial_account}"
    }),
    list: stripeMethod20({
      method: "GET",
      fullPath: "/v1/treasury/financial_accounts",
      methodType: "list"
    }),
    retrieveFeatures: stripeMethod20({
      method: "GET",
      fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
    }),
    updateFeatures: stripeMethod20({
      method: "POST",
      fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
  var stripeMethod21 = StripeResource.method;
  var InboundTransfers = StripeResource.extend({
    fail: stripeMethod21({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
    }),
    returnInboundTransfer: stripeMethod21({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
    }),
    succeed: stripeMethod21({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
  var stripeMethod22 = StripeResource.method;
  var InboundTransfers2 = StripeResource.extend({
    create: stripeMethod22({
      method: "POST",
      fullPath: "/v1/treasury/inbound_transfers"
    }),
    retrieve: stripeMethod22({
      method: "GET",
      fullPath: "/v1/treasury/inbound_transfers/{id}"
    }),
    list: stripeMethod22({
      method: "GET",
      fullPath: "/v1/treasury/inbound_transfers",
      methodType: "list"
    }),
    cancel: stripeMethod22({
      method: "POST",
      fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
    })
  });

  // node_modules/stripe/esm/resources/Terminal/Locations.js
  var stripeMethod23 = StripeResource.method;
  var Locations = StripeResource.extend({
    create: stripeMethod23({ method: "POST", fullPath: "/v1/terminal/locations" }),
    retrieve: stripeMethod23({
      method: "GET",
      fullPath: "/v1/terminal/locations/{location}"
    }),
    update: stripeMethod23({
      method: "POST",
      fullPath: "/v1/terminal/locations/{location}"
    }),
    list: stripeMethod23({
      method: "GET",
      fullPath: "/v1/terminal/locations",
      methodType: "list"
    }),
    del: stripeMethod23({
      method: "DELETE",
      fullPath: "/v1/terminal/locations/{location}"
    })
  });

  // node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
  var stripeMethod24 = StripeResource.method;
  var MeterEventAdjustments = StripeResource.extend({
    create: stripeMethod24({
      method: "POST",
      fullPath: "/v1/billing/meter_event_adjustments"
    })
  });

  // node_modules/stripe/esm/resources/Billing/MeterEvents.js
  var stripeMethod25 = StripeResource.method;
  var MeterEvents = StripeResource.extend({
    create: stripeMethod25({ method: "POST", fullPath: "/v1/billing/meter_events" })
  });

  // node_modules/stripe/esm/resources/Billing/Meters.js
  var stripeMethod26 = StripeResource.method;
  var Meters = StripeResource.extend({
    create: stripeMethod26({ method: "POST", fullPath: "/v1/billing/meters" }),
    retrieve: stripeMethod26({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
    update: stripeMethod26({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
    list: stripeMethod26({
      method: "GET",
      fullPath: "/v1/billing/meters",
      methodType: "list"
    }),
    deactivate: stripeMethod26({
      method: "POST",
      fullPath: "/v1/billing/meters/{id}/deactivate"
    }),
    listEventSummaries: stripeMethod26({
      method: "GET",
      fullPath: "/v1/billing/meters/{id}/event_summaries",
      methodType: "list"
    }),
    reactivate: stripeMethod26({
      method: "POST",
      fullPath: "/v1/billing/meters/{id}/reactivate"
    })
  });

  // node_modules/stripe/esm/resources/Climate/Orders.js
  var stripeMethod27 = StripeResource.method;
  var Orders = StripeResource.extend({
    create: stripeMethod27({ method: "POST", fullPath: "/v1/climate/orders" }),
    retrieve: stripeMethod27({
      method: "GET",
      fullPath: "/v1/climate/orders/{order}"
    }),
    update: stripeMethod27({
      method: "POST",
      fullPath: "/v1/climate/orders/{order}"
    }),
    list: stripeMethod27({
      method: "GET",
      fullPath: "/v1/climate/orders",
      methodType: "list"
    }),
    cancel: stripeMethod27({
      method: "POST",
      fullPath: "/v1/climate/orders/{order}/cancel"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
  var stripeMethod28 = StripeResource.method;
  var OutboundPayments = StripeResource.extend({
    fail: stripeMethod28({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
    }),
    post: stripeMethod28({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
    }),
    returnOutboundPayment: stripeMethod28({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
  var stripeMethod29 = StripeResource.method;
  var OutboundPayments2 = StripeResource.extend({
    create: stripeMethod29({
      method: "POST",
      fullPath: "/v1/treasury/outbound_payments"
    }),
    retrieve: stripeMethod29({
      method: "GET",
      fullPath: "/v1/treasury/outbound_payments/{id}"
    }),
    list: stripeMethod29({
      method: "GET",
      fullPath: "/v1/treasury/outbound_payments",
      methodType: "list"
    }),
    cancel: stripeMethod29({
      method: "POST",
      fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
  var stripeMethod30 = StripeResource.method;
  var OutboundTransfers = StripeResource.extend({
    fail: stripeMethod30({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
    }),
    post: stripeMethod30({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
    }),
    returnOutboundTransfer: stripeMethod30({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
  var stripeMethod31 = StripeResource.method;
  var OutboundTransfers2 = StripeResource.extend({
    create: stripeMethod31({
      method: "POST",
      fullPath: "/v1/treasury/outbound_transfers"
    }),
    retrieve: stripeMethod31({
      method: "GET",
      fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
    }),
    list: stripeMethod31({
      method: "GET",
      fullPath: "/v1/treasury/outbound_transfers",
      methodType: "list"
    }),
    cancel: stripeMethod31({
      method: "POST",
      fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
  var stripeMethod32 = StripeResource.method;
  var PersonalizationDesigns = StripeResource.extend({
    activate: stripeMethod32({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
    }),
    deactivate: stripeMethod32({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
    }),
    reject: stripeMethod32({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
  var stripeMethod33 = StripeResource.method;
  var PersonalizationDesigns2 = StripeResource.extend({
    create: stripeMethod33({
      method: "POST",
      fullPath: "/v1/issuing/personalization_designs"
    }),
    retrieve: stripeMethod33({
      method: "GET",
      fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
    }),
    update: stripeMethod33({
      method: "POST",
      fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
    }),
    list: stripeMethod33({
      method: "GET",
      fullPath: "/v1/issuing/personalization_designs",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
  var stripeMethod34 = StripeResource.method;
  var PhysicalBundles = StripeResource.extend({
    retrieve: stripeMethod34({
      method: "GET",
      fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
    }),
    list: stripeMethod34({
      method: "GET",
      fullPath: "/v1/issuing/physical_bundles",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Climate/Products.js
  var stripeMethod35 = StripeResource.method;
  var Products = StripeResource.extend({
    retrieve: stripeMethod35({
      method: "GET",
      fullPath: "/v1/climate/products/{product}"
    }),
    list: stripeMethod35({
      method: "GET",
      fullPath: "/v1/climate/products",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
  var stripeMethod36 = StripeResource.method;
  var Readers = StripeResource.extend({
    presentPaymentMethod: stripeMethod36({
      method: "POST",
      fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
    })
  });

  // node_modules/stripe/esm/resources/Terminal/Readers.js
  var stripeMethod37 = StripeResource.method;
  var Readers2 = StripeResource.extend({
    create: stripeMethod37({ method: "POST", fullPath: "/v1/terminal/readers" }),
    retrieve: stripeMethod37({
      method: "GET",
      fullPath: "/v1/terminal/readers/{reader}"
    }),
    update: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}"
    }),
    list: stripeMethod37({
      method: "GET",
      fullPath: "/v1/terminal/readers",
      methodType: "list"
    }),
    del: stripeMethod37({
      method: "DELETE",
      fullPath: "/v1/terminal/readers/{reader}"
    }),
    cancelAction: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}/cancel_action"
    }),
    processPaymentIntent: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
    }),
    processSetupIntent: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
    }),
    refundPayment: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}/refund_payment"
    }),
    setReaderDisplay: stripeMethod37({
      method: "POST",
      fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
  var stripeMethod38 = StripeResource.method;
  var ReceivedCredits = StripeResource.extend({
    create: stripeMethod38({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/received_credits"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
  var stripeMethod39 = StripeResource.method;
  var ReceivedCredits2 = StripeResource.extend({
    retrieve: stripeMethod39({
      method: "GET",
      fullPath: "/v1/treasury/received_credits/{id}"
    }),
    list: stripeMethod39({
      method: "GET",
      fullPath: "/v1/treasury/received_credits",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
  var stripeMethod40 = StripeResource.method;
  var ReceivedDebits = StripeResource.extend({
    create: stripeMethod40({
      method: "POST",
      fullPath: "/v1/test_helpers/treasury/received_debits"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
  var stripeMethod41 = StripeResource.method;
  var ReceivedDebits2 = StripeResource.extend({
    retrieve: stripeMethod41({
      method: "GET",
      fullPath: "/v1/treasury/received_debits/{id}"
    }),
    list: stripeMethod41({
      method: "GET",
      fullPath: "/v1/treasury/received_debits",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Refunds.js
  var stripeMethod42 = StripeResource.method;
  var Refunds = StripeResource.extend({
    expire: stripeMethod42({
      method: "POST",
      fullPath: "/v1/test_helpers/refunds/{refund}/expire"
    })
  });

  // node_modules/stripe/esm/resources/Tax/Registrations.js
  var stripeMethod43 = StripeResource.method;
  var Registrations = StripeResource.extend({
    create: stripeMethod43({ method: "POST", fullPath: "/v1/tax/registrations" }),
    retrieve: stripeMethod43({
      method: "GET",
      fullPath: "/v1/tax/registrations/{id}"
    }),
    update: stripeMethod43({
      method: "POST",
      fullPath: "/v1/tax/registrations/{id}"
    }),
    list: stripeMethod43({
      method: "GET",
      fullPath: "/v1/tax/registrations",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Reporting/ReportRuns.js
  var stripeMethod44 = StripeResource.method;
  var ReportRuns = StripeResource.extend({
    create: stripeMethod44({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
    retrieve: stripeMethod44({
      method: "GET",
      fullPath: "/v1/reporting/report_runs/{report_run}"
    }),
    list: stripeMethod44({
      method: "GET",
      fullPath: "/v1/reporting/report_runs",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Reporting/ReportTypes.js
  var stripeMethod45 = StripeResource.method;
  var ReportTypes = StripeResource.extend({
    retrieve: stripeMethod45({
      method: "GET",
      fullPath: "/v1/reporting/report_types/{report_type}"
    }),
    list: stripeMethod45({
      method: "GET",
      fullPath: "/v1/reporting/report_types",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Forwarding/Requests.js
  var stripeMethod46 = StripeResource.method;
  var Requests = StripeResource.extend({
    create: stripeMethod46({ method: "POST", fullPath: "/v1/forwarding/requests" }),
    retrieve: stripeMethod46({
      method: "GET",
      fullPath: "/v1/forwarding/requests/{id}"
    }),
    list: stripeMethod46({
      method: "GET",
      fullPath: "/v1/forwarding/requests",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
  var stripeMethod47 = StripeResource.method;
  var ScheduledQueryRuns = StripeResource.extend({
    retrieve: stripeMethod47({
      method: "GET",
      fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
    }),
    list: stripeMethod47({
      method: "GET",
      fullPath: "/v1/sigma/scheduled_query_runs",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Apps/Secrets.js
  var stripeMethod48 = StripeResource.method;
  var Secrets = StripeResource.extend({
    create: stripeMethod48({ method: "POST", fullPath: "/v1/apps/secrets" }),
    list: stripeMethod48({
      method: "GET",
      fullPath: "/v1/apps/secrets",
      methodType: "list"
    }),
    deleteWhere: stripeMethod48({
      method: "POST",
      fullPath: "/v1/apps/secrets/delete"
    }),
    find: stripeMethod48({ method: "GET", fullPath: "/v1/apps/secrets/find" })
  });

  // node_modules/stripe/esm/resources/BillingPortal/Sessions.js
  var stripeMethod49 = StripeResource.method;
  var Sessions = StripeResource.extend({
    create: stripeMethod49({
      method: "POST",
      fullPath: "/v1/billing_portal/sessions"
    })
  });

  // node_modules/stripe/esm/resources/Checkout/Sessions.js
  var stripeMethod50 = StripeResource.method;
  var Sessions2 = StripeResource.extend({
    create: stripeMethod50({ method: "POST", fullPath: "/v1/checkout/sessions" }),
    retrieve: stripeMethod50({
      method: "GET",
      fullPath: "/v1/checkout/sessions/{session}"
    }),
    list: stripeMethod50({
      method: "GET",
      fullPath: "/v1/checkout/sessions",
      methodType: "list"
    }),
    expire: stripeMethod50({
      method: "POST",
      fullPath: "/v1/checkout/sessions/{session}/expire"
    }),
    listLineItems: stripeMethod50({
      method: "GET",
      fullPath: "/v1/checkout/sessions/{session}/line_items",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
  var stripeMethod51 = StripeResource.method;
  var Sessions3 = StripeResource.extend({
    create: stripeMethod51({
      method: "POST",
      fullPath: "/v1/financial_connections/sessions"
    }),
    retrieve: stripeMethod51({
      method: "GET",
      fullPath: "/v1/financial_connections/sessions/{session}"
    })
  });

  // node_modules/stripe/esm/resources/Tax/Settings.js
  var stripeMethod52 = StripeResource.method;
  var Settings = StripeResource.extend({
    retrieve: stripeMethod52({ method: "GET", fullPath: "/v1/tax/settings" }),
    update: stripeMethod52({ method: "POST", fullPath: "/v1/tax/settings" })
  });

  // node_modules/stripe/esm/resources/Climate/Suppliers.js
  var stripeMethod53 = StripeResource.method;
  var Suppliers = StripeResource.extend({
    retrieve: stripeMethod53({
      method: "GET",
      fullPath: "/v1/climate/suppliers/{supplier}"
    }),
    list: stripeMethod53({
      method: "GET",
      fullPath: "/v1/climate/suppliers",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
  var stripeMethod54 = StripeResource.method;
  var TestClocks = StripeResource.extend({
    create: stripeMethod54({
      method: "POST",
      fullPath: "/v1/test_helpers/test_clocks"
    }),
    retrieve: stripeMethod54({
      method: "GET",
      fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
    }),
    list: stripeMethod54({
      method: "GET",
      fullPath: "/v1/test_helpers/test_clocks",
      methodType: "list"
    }),
    del: stripeMethod54({
      method: "DELETE",
      fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
    }),
    advance: stripeMethod54({
      method: "POST",
      fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Tokens.js
  var stripeMethod55 = StripeResource.method;
  var Tokens = StripeResource.extend({
    retrieve: stripeMethod55({
      method: "GET",
      fullPath: "/v1/issuing/tokens/{token}"
    }),
    update: stripeMethod55({
      method: "POST",
      fullPath: "/v1/issuing/tokens/{token}"
    }),
    list: stripeMethod55({
      method: "GET",
      fullPath: "/v1/issuing/tokens",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
  var stripeMethod56 = StripeResource.method;
  var TransactionEntries = StripeResource.extend({
    retrieve: stripeMethod56({
      method: "GET",
      fullPath: "/v1/treasury/transaction_entries/{id}"
    }),
    list: stripeMethod56({
      method: "GET",
      fullPath: "/v1/treasury/transaction_entries",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
  var stripeMethod57 = StripeResource.method;
  var Transactions = StripeResource.extend({
    createForceCapture: stripeMethod57({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
    }),
    createUnlinkedRefund: stripeMethod57({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
    }),
    refund: stripeMethod57({
      method: "POST",
      fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
    })
  });

  // node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
  var stripeMethod58 = StripeResource.method;
  var Transactions2 = StripeResource.extend({
    retrieve: stripeMethod58({
      method: "GET",
      fullPath: "/v1/financial_connections/transactions/{transaction}"
    }),
    list: stripeMethod58({
      method: "GET",
      fullPath: "/v1/financial_connections/transactions",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Issuing/Transactions.js
  var stripeMethod59 = StripeResource.method;
  var Transactions3 = StripeResource.extend({
    retrieve: stripeMethod59({
      method: "GET",
      fullPath: "/v1/issuing/transactions/{transaction}"
    }),
    update: stripeMethod59({
      method: "POST",
      fullPath: "/v1/issuing/transactions/{transaction}"
    }),
    list: stripeMethod59({
      method: "GET",
      fullPath: "/v1/issuing/transactions",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Tax/Transactions.js
  var stripeMethod60 = StripeResource.method;
  var Transactions4 = StripeResource.extend({
    retrieve: stripeMethod60({
      method: "GET",
      fullPath: "/v1/tax/transactions/{transaction}"
    }),
    createFromCalculation: stripeMethod60({
      method: "POST",
      fullPath: "/v1/tax/transactions/create_from_calculation"
    }),
    createReversal: stripeMethod60({
      method: "POST",
      fullPath: "/v1/tax/transactions/create_reversal"
    }),
    listLineItems: stripeMethod60({
      method: "GET",
      fullPath: "/v1/tax/transactions/{transaction}/line_items",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Treasury/Transactions.js
  var stripeMethod61 = StripeResource.method;
  var Transactions5 = StripeResource.extend({
    retrieve: stripeMethod61({
      method: "GET",
      fullPath: "/v1/treasury/transactions/{id}"
    }),
    list: stripeMethod61({
      method: "GET",
      fullPath: "/v1/treasury/transactions",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Radar/ValueListItems.js
  var stripeMethod62 = StripeResource.method;
  var ValueListItems = StripeResource.extend({
    create: stripeMethod62({
      method: "POST",
      fullPath: "/v1/radar/value_list_items"
    }),
    retrieve: stripeMethod62({
      method: "GET",
      fullPath: "/v1/radar/value_list_items/{item}"
    }),
    list: stripeMethod62({
      method: "GET",
      fullPath: "/v1/radar/value_list_items",
      methodType: "list"
    }),
    del: stripeMethod62({
      method: "DELETE",
      fullPath: "/v1/radar/value_list_items/{item}"
    })
  });

  // node_modules/stripe/esm/resources/Radar/ValueLists.js
  var stripeMethod63 = StripeResource.method;
  var ValueLists = StripeResource.extend({
    create: stripeMethod63({ method: "POST", fullPath: "/v1/radar/value_lists" }),
    retrieve: stripeMethod63({
      method: "GET",
      fullPath: "/v1/radar/value_lists/{value_list}"
    }),
    update: stripeMethod63({
      method: "POST",
      fullPath: "/v1/radar/value_lists/{value_list}"
    }),
    list: stripeMethod63({
      method: "GET",
      fullPath: "/v1/radar/value_lists",
      methodType: "list"
    }),
    del: stripeMethod63({
      method: "DELETE",
      fullPath: "/v1/radar/value_lists/{value_list}"
    })
  });

  // node_modules/stripe/esm/resources/Identity/VerificationReports.js
  var stripeMethod64 = StripeResource.method;
  var VerificationReports = StripeResource.extend({
    retrieve: stripeMethod64({
      method: "GET",
      fullPath: "/v1/identity/verification_reports/{report}"
    }),
    list: stripeMethod64({
      method: "GET",
      fullPath: "/v1/identity/verification_reports",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Identity/VerificationSessions.js
  var stripeMethod65 = StripeResource.method;
  var VerificationSessions = StripeResource.extend({
    create: stripeMethod65({
      method: "POST",
      fullPath: "/v1/identity/verification_sessions"
    }),
    retrieve: stripeMethod65({
      method: "GET",
      fullPath: "/v1/identity/verification_sessions/{session}"
    }),
    update: stripeMethod65({
      method: "POST",
      fullPath: "/v1/identity/verification_sessions/{session}"
    }),
    list: stripeMethod65({
      method: "GET",
      fullPath: "/v1/identity/verification_sessions",
      methodType: "list"
    }),
    cancel: stripeMethod65({
      method: "POST",
      fullPath: "/v1/identity/verification_sessions/{session}/cancel"
    }),
    redact: stripeMethod65({
      method: "POST",
      fullPath: "/v1/identity/verification_sessions/{session}/redact"
    })
  });

  // node_modules/stripe/esm/resources/Accounts.js
  var stripeMethod66 = StripeResource.method;
  var Accounts2 = StripeResource.extend({
    create: stripeMethod66({ method: "POST", fullPath: "/v1/accounts" }),
    retrieve(id, ...args) {
      if (typeof id === "string") {
        return stripeMethod66({
          method: "GET",
          fullPath: "/v1/accounts/{id}"
        }).apply(this, [id, ...args]);
      } else {
        if (id === null || id === void 0) {
          [].shift.apply([id, ...args]);
        }
        return stripeMethod66({
          method: "GET",
          fullPath: "/v1/account"
        }).apply(this, [id, ...args]);
      }
    },
    update: stripeMethod66({ method: "POST", fullPath: "/v1/accounts/{account}" }),
    list: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts",
      methodType: "list"
    }),
    del: stripeMethod66({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
    createExternalAccount: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/external_accounts"
    }),
    createLoginLink: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/login_links"
    }),
    createPerson: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/persons"
    }),
    deleteExternalAccount: stripeMethod66({
      method: "DELETE",
      fullPath: "/v1/accounts/{account}/external_accounts/{id}"
    }),
    deletePerson: stripeMethod66({
      method: "DELETE",
      fullPath: "/v1/accounts/{account}/persons/{person}"
    }),
    listCapabilities: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/capabilities",
      methodType: "list"
    }),
    listExternalAccounts: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/external_accounts",
      methodType: "list"
    }),
    listPersons: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/persons",
      methodType: "list"
    }),
    reject: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/reject"
    }),
    retrieveCurrent: stripeMethod66({ method: "GET", fullPath: "/v1/account" }),
    retrieveCapability: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/capabilities/{capability}"
    }),
    retrieveExternalAccount: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/external_accounts/{id}"
    }),
    retrievePerson: stripeMethod66({
      method: "GET",
      fullPath: "/v1/accounts/{account}/persons/{person}"
    }),
    updateCapability: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/capabilities/{capability}"
    }),
    updateExternalAccount: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/external_accounts/{id}"
    }),
    updatePerson: stripeMethod66({
      method: "POST",
      fullPath: "/v1/accounts/{account}/persons/{person}"
    })
  });

  // node_modules/stripe/esm/resources/AccountLinks.js
  var stripeMethod67 = StripeResource.method;
  var AccountLinks = StripeResource.extend({
    create: stripeMethod67({ method: "POST", fullPath: "/v1/account_links" })
  });

  // node_modules/stripe/esm/resources/AccountSessions.js
  var stripeMethod68 = StripeResource.method;
  var AccountSessions = StripeResource.extend({
    create: stripeMethod68({ method: "POST", fullPath: "/v1/account_sessions" })
  });

  // node_modules/stripe/esm/resources/ApplePayDomains.js
  var stripeMethod69 = StripeResource.method;
  var ApplePayDomains = StripeResource.extend({
    create: stripeMethod69({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
    retrieve: stripeMethod69({
      method: "GET",
      fullPath: "/v1/apple_pay/domains/{domain}"
    }),
    list: stripeMethod69({
      method: "GET",
      fullPath: "/v1/apple_pay/domains",
      methodType: "list"
    }),
    del: stripeMethod69({
      method: "DELETE",
      fullPath: "/v1/apple_pay/domains/{domain}"
    })
  });

  // node_modules/stripe/esm/resources/ApplicationFees.js
  var stripeMethod70 = StripeResource.method;
  var ApplicationFees = StripeResource.extend({
    retrieve: stripeMethod70({
      method: "GET",
      fullPath: "/v1/application_fees/{id}"
    }),
    list: stripeMethod70({
      method: "GET",
      fullPath: "/v1/application_fees",
      methodType: "list"
    }),
    createRefund: stripeMethod70({
      method: "POST",
      fullPath: "/v1/application_fees/{id}/refunds"
    }),
    listRefunds: stripeMethod70({
      method: "GET",
      fullPath: "/v1/application_fees/{id}/refunds",
      methodType: "list"
    }),
    retrieveRefund: stripeMethod70({
      method: "GET",
      fullPath: "/v1/application_fees/{fee}/refunds/{id}"
    }),
    updateRefund: stripeMethod70({
      method: "POST",
      fullPath: "/v1/application_fees/{fee}/refunds/{id}"
    })
  });

  // node_modules/stripe/esm/resources/Balance.js
  var stripeMethod71 = StripeResource.method;
  var Balance = StripeResource.extend({
    retrieve: stripeMethod71({ method: "GET", fullPath: "/v1/balance" })
  });

  // node_modules/stripe/esm/resources/BalanceTransactions.js
  var stripeMethod72 = StripeResource.method;
  var BalanceTransactions = StripeResource.extend({
    retrieve: stripeMethod72({
      method: "GET",
      fullPath: "/v1/balance_transactions/{id}"
    }),
    list: stripeMethod72({
      method: "GET",
      fullPath: "/v1/balance_transactions",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Charges.js
  var stripeMethod73 = StripeResource.method;
  var Charges = StripeResource.extend({
    create: stripeMethod73({ method: "POST", fullPath: "/v1/charges" }),
    retrieve: stripeMethod73({ method: "GET", fullPath: "/v1/charges/{charge}" }),
    update: stripeMethod73({ method: "POST", fullPath: "/v1/charges/{charge}" }),
    list: stripeMethod73({
      method: "GET",
      fullPath: "/v1/charges",
      methodType: "list"
    }),
    capture: stripeMethod73({
      method: "POST",
      fullPath: "/v1/charges/{charge}/capture"
    }),
    search: stripeMethod73({
      method: "GET",
      fullPath: "/v1/charges/search",
      methodType: "search"
    })
  });

  // node_modules/stripe/esm/resources/ConfirmationTokens.js
  var stripeMethod74 = StripeResource.method;
  var ConfirmationTokens2 = StripeResource.extend({
    retrieve: stripeMethod74({
      method: "GET",
      fullPath: "/v1/confirmation_tokens/{confirmation_token}"
    })
  });

  // node_modules/stripe/esm/resources/CountrySpecs.js
  var stripeMethod75 = StripeResource.method;
  var CountrySpecs = StripeResource.extend({
    retrieve: stripeMethod75({
      method: "GET",
      fullPath: "/v1/country_specs/{country}"
    }),
    list: stripeMethod75({
      method: "GET",
      fullPath: "/v1/country_specs",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Coupons.js
  var stripeMethod76 = StripeResource.method;
  var Coupons = StripeResource.extend({
    create: stripeMethod76({ method: "POST", fullPath: "/v1/coupons" }),
    retrieve: stripeMethod76({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
    update: stripeMethod76({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
    list: stripeMethod76({
      method: "GET",
      fullPath: "/v1/coupons",
      methodType: "list"
    }),
    del: stripeMethod76({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
  });

  // node_modules/stripe/esm/resources/CreditNotes.js
  var stripeMethod77 = StripeResource.method;
  var CreditNotes = StripeResource.extend({
    create: stripeMethod77({ method: "POST", fullPath: "/v1/credit_notes" }),
    retrieve: stripeMethod77({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
    update: stripeMethod77({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
    list: stripeMethod77({
      method: "GET",
      fullPath: "/v1/credit_notes",
      methodType: "list"
    }),
    listLineItems: stripeMethod77({
      method: "GET",
      fullPath: "/v1/credit_notes/{credit_note}/lines",
      methodType: "list"
    }),
    listPreviewLineItems: stripeMethod77({
      method: "GET",
      fullPath: "/v1/credit_notes/preview/lines",
      methodType: "list"
    }),
    preview: stripeMethod77({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
    voidCreditNote: stripeMethod77({
      method: "POST",
      fullPath: "/v1/credit_notes/{id}/void"
    })
  });

  // node_modules/stripe/esm/resources/CustomerSessions.js
  var stripeMethod78 = StripeResource.method;
  var CustomerSessions = StripeResource.extend({
    create: stripeMethod78({ method: "POST", fullPath: "/v1/customer_sessions" })
  });

  // node_modules/stripe/esm/resources/Customers.js
  var stripeMethod79 = StripeResource.method;
  var Customers2 = StripeResource.extend({
    create: stripeMethod79({ method: "POST", fullPath: "/v1/customers" }),
    retrieve: stripeMethod79({ method: "GET", fullPath: "/v1/customers/{customer}" }),
    update: stripeMethod79({ method: "POST", fullPath: "/v1/customers/{customer}" }),
    list: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers",
      methodType: "list"
    }),
    del: stripeMethod79({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
    createBalanceTransaction: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/balance_transactions"
    }),
    createFundingInstructions: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/funding_instructions"
    }),
    createSource: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/sources"
    }),
    createTaxId: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/tax_ids"
    }),
    deleteDiscount: stripeMethod79({
      method: "DELETE",
      fullPath: "/v1/customers/{customer}/discount"
    }),
    deleteSource: stripeMethod79({
      method: "DELETE",
      fullPath: "/v1/customers/{customer}/sources/{id}"
    }),
    deleteTaxId: stripeMethod79({
      method: "DELETE",
      fullPath: "/v1/customers/{customer}/tax_ids/{id}"
    }),
    listBalanceTransactions: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/balance_transactions",
      methodType: "list"
    }),
    listCashBalanceTransactions: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/cash_balance_transactions",
      methodType: "list"
    }),
    listPaymentMethods: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/payment_methods",
      methodType: "list"
    }),
    listSources: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/sources",
      methodType: "list"
    }),
    listTaxIds: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/tax_ids",
      methodType: "list"
    }),
    retrieveBalanceTransaction: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
    }),
    retrieveCashBalance: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/cash_balance"
    }),
    retrieveCashBalanceTransaction: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
    }),
    retrievePaymentMethod: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
    }),
    retrieveSource: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/sources/{id}"
    }),
    retrieveTaxId: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/{customer}/tax_ids/{id}"
    }),
    search: stripeMethod79({
      method: "GET",
      fullPath: "/v1/customers/search",
      methodType: "search"
    }),
    updateBalanceTransaction: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
    }),
    updateCashBalance: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/cash_balance"
    }),
    updateSource: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/sources/{id}"
    }),
    verifySource: stripeMethod79({
      method: "POST",
      fullPath: "/v1/customers/{customer}/sources/{id}/verify"
    })
  });

  // node_modules/stripe/esm/resources/Disputes.js
  var stripeMethod80 = StripeResource.method;
  var Disputes2 = StripeResource.extend({
    retrieve: stripeMethod80({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
    update: stripeMethod80({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
    list: stripeMethod80({
      method: "GET",
      fullPath: "/v1/disputes",
      methodType: "list"
    }),
    close: stripeMethod80({
      method: "POST",
      fullPath: "/v1/disputes/{dispute}/close"
    })
  });

  // node_modules/stripe/esm/resources/EphemeralKeys.js
  var stripeMethod81 = StripeResource.method;
  var EphemeralKeys = StripeResource.extend({
    create: stripeMethod81({
      method: "POST",
      fullPath: "/v1/ephemeral_keys",
      validator: (data, options) => {
        if (!options.headers || !options.headers["Stripe-Version"]) {
          throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
        }
      }
    }),
    del: stripeMethod81({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
  });

  // node_modules/stripe/esm/resources/Events.js
  var stripeMethod82 = StripeResource.method;
  var Events = StripeResource.extend({
    retrieve: stripeMethod82({ method: "GET", fullPath: "/v1/events/{id}" }),
    list: stripeMethod82({
      method: "GET",
      fullPath: "/v1/events",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/ExchangeRates.js
  var stripeMethod83 = StripeResource.method;
  var ExchangeRates = StripeResource.extend({
    retrieve: stripeMethod83({
      method: "GET",
      fullPath: "/v1/exchange_rates/{rate_id}"
    }),
    list: stripeMethod83({
      method: "GET",
      fullPath: "/v1/exchange_rates",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/FileLinks.js
  var stripeMethod84 = StripeResource.method;
  var FileLinks = StripeResource.extend({
    create: stripeMethod84({ method: "POST", fullPath: "/v1/file_links" }),
    retrieve: stripeMethod84({ method: "GET", fullPath: "/v1/file_links/{link}" }),
    update: stripeMethod84({ method: "POST", fullPath: "/v1/file_links/{link}" }),
    list: stripeMethod84({
      method: "GET",
      fullPath: "/v1/file_links",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/multipart.js
  var multipartDataGenerator = (method, data, headers) => {
    const segno = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
    headers["Content-Type"] = `multipart/form-data; boundary=${segno}`;
    const textEncoder = new TextEncoder();
    let buffer = new Uint8Array(0);
    const endBuffer = textEncoder.encode("\r\n");
    function push(l) {
      const prevBuffer = buffer;
      const newBuffer = l instanceof Uint8Array ? l : new Uint8Array(textEncoder.encode(l));
      buffer = new Uint8Array(prevBuffer.length + newBuffer.length + 2);
      buffer.set(prevBuffer);
      buffer.set(newBuffer, prevBuffer.length);
      buffer.set(endBuffer, buffer.length - 2);
    }
    function q(s) {
      return `"${s.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
    }
    const flattenedData = flattenAndStringify(data);
    for (const k in flattenedData) {
      const v = flattenedData[k];
      push(`--${segno}`);
      if (Object.prototype.hasOwnProperty.call(v, "data")) {
        const typedEntry = v;
        push(`Content-Disposition: form-data; name=${q(k)}; filename=${q(typedEntry.name || "blob")}`);
        push(`Content-Type: ${typedEntry.type || "application/octet-stream"}`);
        push("");
        push(typedEntry.data);
      } else {
        push(`Content-Disposition: form-data; name=${q(k)}`);
        push("");
        push(v);
      }
    }
    push(`--${segno}--`);
    return buffer;
  };
  function multipartRequestDataProcessor(method, data, headers, callback) {
    data = data || {};
    if (method !== "POST") {
      return callback(null, stringifyRequestData(data));
    }
    this._stripe._platformFunctions.tryBufferData(data).then((bufferedData) => {
      const buffer = multipartDataGenerator(method, bufferedData, headers);
      return callback(null, buffer);
    }).catch((err) => callback(err, null));
  }

  // node_modules/stripe/esm/resources/Files.js
  var stripeMethod85 = StripeResource.method;
  var Files = StripeResource.extend({
    create: stripeMethod85({
      method: "POST",
      fullPath: "/v1/files",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      host: "files.stripe.com"
    }),
    retrieve: stripeMethod85({ method: "GET", fullPath: "/v1/files/{file}" }),
    list: stripeMethod85({
      method: "GET",
      fullPath: "/v1/files",
      methodType: "list"
    }),
    requestDataProcessor: multipartRequestDataProcessor
  });

  // node_modules/stripe/esm/resources/InvoiceItems.js
  var stripeMethod86 = StripeResource.method;
  var InvoiceItems = StripeResource.extend({
    create: stripeMethod86({ method: "POST", fullPath: "/v1/invoiceitems" }),
    retrieve: stripeMethod86({
      method: "GET",
      fullPath: "/v1/invoiceitems/{invoiceitem}"
    }),
    update: stripeMethod86({
      method: "POST",
      fullPath: "/v1/invoiceitems/{invoiceitem}"
    }),
    list: stripeMethod86({
      method: "GET",
      fullPath: "/v1/invoiceitems",
      methodType: "list"
    }),
    del: stripeMethod86({
      method: "DELETE",
      fullPath: "/v1/invoiceitems/{invoiceitem}"
    })
  });

  // node_modules/stripe/esm/resources/Invoices.js
  var stripeMethod87 = StripeResource.method;
  var Invoices = StripeResource.extend({
    create: stripeMethod87({ method: "POST", fullPath: "/v1/invoices" }),
    retrieve: stripeMethod87({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
    update: stripeMethod87({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
    list: stripeMethod87({
      method: "GET",
      fullPath: "/v1/invoices",
      methodType: "list"
    }),
    del: stripeMethod87({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
    finalizeInvoice: stripeMethod87({
      method: "POST",
      fullPath: "/v1/invoices/{invoice}/finalize"
    }),
    listLineItems: stripeMethod87({
      method: "GET",
      fullPath: "/v1/invoices/{invoice}/lines",
      methodType: "list"
    }),
    listUpcomingLines: stripeMethod87({
      method: "GET",
      fullPath: "/v1/invoices/upcoming/lines",
      methodType: "list"
    }),
    markUncollectible: stripeMethod87({
      method: "POST",
      fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
    }),
    pay: stripeMethod87({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
    retrieveUpcoming: stripeMethod87({
      method: "GET",
      fullPath: "/v1/invoices/upcoming"
    }),
    search: stripeMethod87({
      method: "GET",
      fullPath: "/v1/invoices/search",
      methodType: "search"
    }),
    sendInvoice: stripeMethod87({
      method: "POST",
      fullPath: "/v1/invoices/{invoice}/send"
    }),
    updateLineItem: stripeMethod87({
      method: "POST",
      fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
    }),
    voidInvoice: stripeMethod87({
      method: "POST",
      fullPath: "/v1/invoices/{invoice}/void"
    })
  });

  // node_modules/stripe/esm/resources/Mandates.js
  var stripeMethod88 = StripeResource.method;
  var Mandates = StripeResource.extend({
    retrieve: stripeMethod88({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
  });

  // node_modules/stripe/esm/resources/OAuth.js
  var stripeMethod89 = StripeResource.method;
  var oAuthHost = "connect.stripe.com";
  var OAuth = StripeResource.extend({
    basePath: "/",
    authorizeUrl(params, options) {
      params = params || {};
      options = options || {};
      let path = "oauth/authorize";
      if (options.express) {
        path = `express/${path}`;
      }
      if (!params.response_type) {
        params.response_type = "code";
      }
      if (!params.client_id) {
        params.client_id = this._stripe.getClientId();
      }
      if (!params.scope) {
        params.scope = "read_write";
      }
      return `https://${oAuthHost}/${path}?${stringifyRequestData(params)}`;
    },
    token: stripeMethod89({
      method: "POST",
      path: "oauth/token",
      host: oAuthHost
    }),
    deauthorize(spec, ...args) {
      if (!spec.client_id) {
        spec.client_id = this._stripe.getClientId();
      }
      return stripeMethod89({
        method: "POST",
        path: "oauth/deauthorize",
        host: oAuthHost
      }).apply(this, [spec, ...args]);
    }
  });

  // node_modules/stripe/esm/resources/PaymentIntents.js
  var stripeMethod90 = StripeResource.method;
  var PaymentIntents = StripeResource.extend({
    create: stripeMethod90({ method: "POST", fullPath: "/v1/payment_intents" }),
    retrieve: stripeMethod90({
      method: "GET",
      fullPath: "/v1/payment_intents/{intent}"
    }),
    update: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}"
    }),
    list: stripeMethod90({
      method: "GET",
      fullPath: "/v1/payment_intents",
      methodType: "list"
    }),
    applyCustomerBalance: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
    }),
    cancel: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/cancel"
    }),
    capture: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/capture"
    }),
    confirm: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/confirm"
    }),
    incrementAuthorization: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/increment_authorization"
    }),
    search: stripeMethod90({
      method: "GET",
      fullPath: "/v1/payment_intents/search",
      methodType: "search"
    }),
    verifyMicrodeposits: stripeMethod90({
      method: "POST",
      fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
    })
  });

  // node_modules/stripe/esm/resources/PaymentLinks.js
  var stripeMethod91 = StripeResource.method;
  var PaymentLinks = StripeResource.extend({
    create: stripeMethod91({ method: "POST", fullPath: "/v1/payment_links" }),
    retrieve: stripeMethod91({
      method: "GET",
      fullPath: "/v1/payment_links/{payment_link}"
    }),
    update: stripeMethod91({
      method: "POST",
      fullPath: "/v1/payment_links/{payment_link}"
    }),
    list: stripeMethod91({
      method: "GET",
      fullPath: "/v1/payment_links",
      methodType: "list"
    }),
    listLineItems: stripeMethod91({
      method: "GET",
      fullPath: "/v1/payment_links/{payment_link}/line_items",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
  var stripeMethod92 = StripeResource.method;
  var PaymentMethodConfigurations = StripeResource.extend({
    create: stripeMethod92({
      method: "POST",
      fullPath: "/v1/payment_method_configurations"
    }),
    retrieve: stripeMethod92({
      method: "GET",
      fullPath: "/v1/payment_method_configurations/{configuration}"
    }),
    update: stripeMethod92({
      method: "POST",
      fullPath: "/v1/payment_method_configurations/{configuration}"
    }),
    list: stripeMethod92({
      method: "GET",
      fullPath: "/v1/payment_method_configurations",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/PaymentMethodDomains.js
  var stripeMethod93 = StripeResource.method;
  var PaymentMethodDomains = StripeResource.extend({
    create: stripeMethod93({
      method: "POST",
      fullPath: "/v1/payment_method_domains"
    }),
    retrieve: stripeMethod93({
      method: "GET",
      fullPath: "/v1/payment_method_domains/{payment_method_domain}"
    }),
    update: stripeMethod93({
      method: "POST",
      fullPath: "/v1/payment_method_domains/{payment_method_domain}"
    }),
    list: stripeMethod93({
      method: "GET",
      fullPath: "/v1/payment_method_domains",
      methodType: "list"
    }),
    validate: stripeMethod93({
      method: "POST",
      fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
    })
  });

  // node_modules/stripe/esm/resources/PaymentMethods.js
  var stripeMethod94 = StripeResource.method;
  var PaymentMethods = StripeResource.extend({
    create: stripeMethod94({ method: "POST", fullPath: "/v1/payment_methods" }),
    retrieve: stripeMethod94({
      method: "GET",
      fullPath: "/v1/payment_methods/{payment_method}"
    }),
    update: stripeMethod94({
      method: "POST",
      fullPath: "/v1/payment_methods/{payment_method}"
    }),
    list: stripeMethod94({
      method: "GET",
      fullPath: "/v1/payment_methods",
      methodType: "list"
    }),
    attach: stripeMethod94({
      method: "POST",
      fullPath: "/v1/payment_methods/{payment_method}/attach"
    }),
    detach: stripeMethod94({
      method: "POST",
      fullPath: "/v1/payment_methods/{payment_method}/detach"
    })
  });

  // node_modules/stripe/esm/resources/Payouts.js
  var stripeMethod95 = StripeResource.method;
  var Payouts = StripeResource.extend({
    create: stripeMethod95({ method: "POST", fullPath: "/v1/payouts" }),
    retrieve: stripeMethod95({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
    update: stripeMethod95({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
    list: stripeMethod95({
      method: "GET",
      fullPath: "/v1/payouts",
      methodType: "list"
    }),
    cancel: stripeMethod95({
      method: "POST",
      fullPath: "/v1/payouts/{payout}/cancel"
    }),
    reverse: stripeMethod95({
      method: "POST",
      fullPath: "/v1/payouts/{payout}/reverse"
    })
  });

  // node_modules/stripe/esm/resources/Plans.js
  var stripeMethod96 = StripeResource.method;
  var Plans = StripeResource.extend({
    create: stripeMethod96({ method: "POST", fullPath: "/v1/plans" }),
    retrieve: stripeMethod96({ method: "GET", fullPath: "/v1/plans/{plan}" }),
    update: stripeMethod96({ method: "POST", fullPath: "/v1/plans/{plan}" }),
    list: stripeMethod96({
      method: "GET",
      fullPath: "/v1/plans",
      methodType: "list"
    }),
    del: stripeMethod96({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
  });

  // node_modules/stripe/esm/resources/Prices.js
  var stripeMethod97 = StripeResource.method;
  var Prices = StripeResource.extend({
    create: stripeMethod97({ method: "POST", fullPath: "/v1/prices" }),
    retrieve: stripeMethod97({ method: "GET", fullPath: "/v1/prices/{price}" }),
    update: stripeMethod97({ method: "POST", fullPath: "/v1/prices/{price}" }),
    list: stripeMethod97({
      method: "GET",
      fullPath: "/v1/prices",
      methodType: "list"
    }),
    search: stripeMethod97({
      method: "GET",
      fullPath: "/v1/prices/search",
      methodType: "search"
    })
  });

  // node_modules/stripe/esm/resources/Products.js
  var stripeMethod98 = StripeResource.method;
  var Products2 = StripeResource.extend({
    create: stripeMethod98({ method: "POST", fullPath: "/v1/products" }),
    retrieve: stripeMethod98({ method: "GET", fullPath: "/v1/products/{id}" }),
    update: stripeMethod98({ method: "POST", fullPath: "/v1/products/{id}" }),
    list: stripeMethod98({
      method: "GET",
      fullPath: "/v1/products",
      methodType: "list"
    }),
    del: stripeMethod98({ method: "DELETE", fullPath: "/v1/products/{id}" }),
    createFeature: stripeMethod98({
      method: "POST",
      fullPath: "/v1/products/{product}/features"
    }),
    deleteFeature: stripeMethod98({
      method: "DELETE",
      fullPath: "/v1/products/{product}/features/{id}"
    }),
    listFeatures: stripeMethod98({
      method: "GET",
      fullPath: "/v1/products/{product}/features",
      methodType: "list"
    }),
    retrieveFeature: stripeMethod98({
      method: "GET",
      fullPath: "/v1/products/{product}/features/{id}"
    }),
    search: stripeMethod98({
      method: "GET",
      fullPath: "/v1/products/search",
      methodType: "search"
    })
  });

  // node_modules/stripe/esm/resources/PromotionCodes.js
  var stripeMethod99 = StripeResource.method;
  var PromotionCodes = StripeResource.extend({
    create: stripeMethod99({ method: "POST", fullPath: "/v1/promotion_codes" }),
    retrieve: stripeMethod99({
      method: "GET",
      fullPath: "/v1/promotion_codes/{promotion_code}"
    }),
    update: stripeMethod99({
      method: "POST",
      fullPath: "/v1/promotion_codes/{promotion_code}"
    }),
    list: stripeMethod99({
      method: "GET",
      fullPath: "/v1/promotion_codes",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Quotes.js
  var stripeMethod100 = StripeResource.method;
  var Quotes = StripeResource.extend({
    create: stripeMethod100({ method: "POST", fullPath: "/v1/quotes" }),
    retrieve: stripeMethod100({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
    update: stripeMethod100({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
    list: stripeMethod100({
      method: "GET",
      fullPath: "/v1/quotes",
      methodType: "list"
    }),
    accept: stripeMethod100({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
    cancel: stripeMethod100({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
    finalizeQuote: stripeMethod100({
      method: "POST",
      fullPath: "/v1/quotes/{quote}/finalize"
    }),
    listComputedUpfrontLineItems: stripeMethod100({
      method: "GET",
      fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
      methodType: "list"
    }),
    listLineItems: stripeMethod100({
      method: "GET",
      fullPath: "/v1/quotes/{quote}/line_items",
      methodType: "list"
    }),
    pdf: stripeMethod100({
      method: "GET",
      fullPath: "/v1/quotes/{quote}/pdf",
      host: "files.stripe.com",
      streaming: true
    })
  });

  // node_modules/stripe/esm/resources/Refunds.js
  var stripeMethod101 = StripeResource.method;
  var Refunds2 = StripeResource.extend({
    create: stripeMethod101({ method: "POST", fullPath: "/v1/refunds" }),
    retrieve: stripeMethod101({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
    update: stripeMethod101({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
    list: stripeMethod101({
      method: "GET",
      fullPath: "/v1/refunds",
      methodType: "list"
    }),
    cancel: stripeMethod101({
      method: "POST",
      fullPath: "/v1/refunds/{refund}/cancel"
    })
  });

  // node_modules/stripe/esm/resources/Reviews.js
  var stripeMethod102 = StripeResource.method;
  var Reviews = StripeResource.extend({
    retrieve: stripeMethod102({ method: "GET", fullPath: "/v1/reviews/{review}" }),
    list: stripeMethod102({
      method: "GET",
      fullPath: "/v1/reviews",
      methodType: "list"
    }),
    approve: stripeMethod102({
      method: "POST",
      fullPath: "/v1/reviews/{review}/approve"
    })
  });

  // node_modules/stripe/esm/resources/SetupAttempts.js
  var stripeMethod103 = StripeResource.method;
  var SetupAttempts = StripeResource.extend({
    list: stripeMethod103({
      method: "GET",
      fullPath: "/v1/setup_attempts",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/SetupIntents.js
  var stripeMethod104 = StripeResource.method;
  var SetupIntents = StripeResource.extend({
    create: stripeMethod104({ method: "POST", fullPath: "/v1/setup_intents" }),
    retrieve: stripeMethod104({
      method: "GET",
      fullPath: "/v1/setup_intents/{intent}"
    }),
    update: stripeMethod104({
      method: "POST",
      fullPath: "/v1/setup_intents/{intent}"
    }),
    list: stripeMethod104({
      method: "GET",
      fullPath: "/v1/setup_intents",
      methodType: "list"
    }),
    cancel: stripeMethod104({
      method: "POST",
      fullPath: "/v1/setup_intents/{intent}/cancel"
    }),
    confirm: stripeMethod104({
      method: "POST",
      fullPath: "/v1/setup_intents/{intent}/confirm"
    }),
    verifyMicrodeposits: stripeMethod104({
      method: "POST",
      fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
    })
  });

  // node_modules/stripe/esm/resources/ShippingRates.js
  var stripeMethod105 = StripeResource.method;
  var ShippingRates = StripeResource.extend({
    create: stripeMethod105({ method: "POST", fullPath: "/v1/shipping_rates" }),
    retrieve: stripeMethod105({
      method: "GET",
      fullPath: "/v1/shipping_rates/{shipping_rate_token}"
    }),
    update: stripeMethod105({
      method: "POST",
      fullPath: "/v1/shipping_rates/{shipping_rate_token}"
    }),
    list: stripeMethod105({
      method: "GET",
      fullPath: "/v1/shipping_rates",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Sources.js
  var stripeMethod106 = StripeResource.method;
  var Sources = StripeResource.extend({
    create: stripeMethod106({ method: "POST", fullPath: "/v1/sources" }),
    retrieve: stripeMethod106({ method: "GET", fullPath: "/v1/sources/{source}" }),
    update: stripeMethod106({ method: "POST", fullPath: "/v1/sources/{source}" }),
    listSourceTransactions: stripeMethod106({
      method: "GET",
      fullPath: "/v1/sources/{source}/source_transactions",
      methodType: "list"
    }),
    verify: stripeMethod106({
      method: "POST",
      fullPath: "/v1/sources/{source}/verify"
    })
  });

  // node_modules/stripe/esm/resources/SubscriptionItems.js
  var stripeMethod107 = StripeResource.method;
  var SubscriptionItems = StripeResource.extend({
    create: stripeMethod107({ method: "POST", fullPath: "/v1/subscription_items" }),
    retrieve: stripeMethod107({
      method: "GET",
      fullPath: "/v1/subscription_items/{item}"
    }),
    update: stripeMethod107({
      method: "POST",
      fullPath: "/v1/subscription_items/{item}"
    }),
    list: stripeMethod107({
      method: "GET",
      fullPath: "/v1/subscription_items",
      methodType: "list"
    }),
    del: stripeMethod107({
      method: "DELETE",
      fullPath: "/v1/subscription_items/{item}"
    }),
    createUsageRecord: stripeMethod107({
      method: "POST",
      fullPath: "/v1/subscription_items/{subscription_item}/usage_records"
    }),
    listUsageRecordSummaries: stripeMethod107({
      method: "GET",
      fullPath: "/v1/subscription_items/{subscription_item}/usage_record_summaries",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/SubscriptionSchedules.js
  var stripeMethod108 = StripeResource.method;
  var SubscriptionSchedules = StripeResource.extend({
    create: stripeMethod108({
      method: "POST",
      fullPath: "/v1/subscription_schedules"
    }),
    retrieve: stripeMethod108({
      method: "GET",
      fullPath: "/v1/subscription_schedules/{schedule}"
    }),
    update: stripeMethod108({
      method: "POST",
      fullPath: "/v1/subscription_schedules/{schedule}"
    }),
    list: stripeMethod108({
      method: "GET",
      fullPath: "/v1/subscription_schedules",
      methodType: "list"
    }),
    cancel: stripeMethod108({
      method: "POST",
      fullPath: "/v1/subscription_schedules/{schedule}/cancel"
    }),
    release: stripeMethod108({
      method: "POST",
      fullPath: "/v1/subscription_schedules/{schedule}/release"
    })
  });

  // node_modules/stripe/esm/resources/Subscriptions.js
  var stripeMethod109 = StripeResource.method;
  var Subscriptions = StripeResource.extend({
    create: stripeMethod109({ method: "POST", fullPath: "/v1/subscriptions" }),
    retrieve: stripeMethod109({
      method: "GET",
      fullPath: "/v1/subscriptions/{subscription_exposed_id}"
    }),
    update: stripeMethod109({
      method: "POST",
      fullPath: "/v1/subscriptions/{subscription_exposed_id}"
    }),
    list: stripeMethod109({
      method: "GET",
      fullPath: "/v1/subscriptions",
      methodType: "list"
    }),
    cancel: stripeMethod109({
      method: "DELETE",
      fullPath: "/v1/subscriptions/{subscription_exposed_id}"
    }),
    deleteDiscount: stripeMethod109({
      method: "DELETE",
      fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
    }),
    resume: stripeMethod109({
      method: "POST",
      fullPath: "/v1/subscriptions/{subscription}/resume"
    }),
    search: stripeMethod109({
      method: "GET",
      fullPath: "/v1/subscriptions/search",
      methodType: "search"
    })
  });

  // node_modules/stripe/esm/resources/TaxCodes.js
  var stripeMethod110 = StripeResource.method;
  var TaxCodes = StripeResource.extend({
    retrieve: stripeMethod110({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
    list: stripeMethod110({
      method: "GET",
      fullPath: "/v1/tax_codes",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/TaxIds.js
  var stripeMethod111 = StripeResource.method;
  var TaxIds = StripeResource.extend({
    create: stripeMethod111({ method: "POST", fullPath: "/v1/tax_ids" }),
    retrieve: stripeMethod111({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
    list: stripeMethod111({
      method: "GET",
      fullPath: "/v1/tax_ids",
      methodType: "list"
    }),
    del: stripeMethod111({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
  });

  // node_modules/stripe/esm/resources/TaxRates.js
  var stripeMethod112 = StripeResource.method;
  var TaxRates = StripeResource.extend({
    create: stripeMethod112({ method: "POST", fullPath: "/v1/tax_rates" }),
    retrieve: stripeMethod112({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
    update: stripeMethod112({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
    list: stripeMethod112({
      method: "GET",
      fullPath: "/v1/tax_rates",
      methodType: "list"
    })
  });

  // node_modules/stripe/esm/resources/Tokens.js
  var stripeMethod113 = StripeResource.method;
  var Tokens2 = StripeResource.extend({
    create: stripeMethod113({ method: "POST", fullPath: "/v1/tokens" }),
    retrieve: stripeMethod113({ method: "GET", fullPath: "/v1/tokens/{token}" })
  });

  // node_modules/stripe/esm/resources/Topups.js
  var stripeMethod114 = StripeResource.method;
  var Topups = StripeResource.extend({
    create: stripeMethod114({ method: "POST", fullPath: "/v1/topups" }),
    retrieve: stripeMethod114({ method: "GET", fullPath: "/v1/topups/{topup}" }),
    update: stripeMethod114({ method: "POST", fullPath: "/v1/topups/{topup}" }),
    list: stripeMethod114({
      method: "GET",
      fullPath: "/v1/topups",
      methodType: "list"
    }),
    cancel: stripeMethod114({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
  });

  // node_modules/stripe/esm/resources/Transfers.js
  var stripeMethod115 = StripeResource.method;
  var Transfers = StripeResource.extend({
    create: stripeMethod115({ method: "POST", fullPath: "/v1/transfers" }),
    retrieve: stripeMethod115({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
    update: stripeMethod115({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
    list: stripeMethod115({
      method: "GET",
      fullPath: "/v1/transfers",
      methodType: "list"
    }),
    createReversal: stripeMethod115({
      method: "POST",
      fullPath: "/v1/transfers/{id}/reversals"
    }),
    listReversals: stripeMethod115({
      method: "GET",
      fullPath: "/v1/transfers/{id}/reversals",
      methodType: "list"
    }),
    retrieveReversal: stripeMethod115({
      method: "GET",
      fullPath: "/v1/transfers/{transfer}/reversals/{id}"
    }),
    updateReversal: stripeMethod115({
      method: "POST",
      fullPath: "/v1/transfers/{transfer}/reversals/{id}"
    })
  });

  // node_modules/stripe/esm/resources/WebhookEndpoints.js
  var stripeMethod116 = StripeResource.method;
  var WebhookEndpoints = StripeResource.extend({
    create: stripeMethod116({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
    retrieve: stripeMethod116({
      method: "GET",
      fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
    }),
    update: stripeMethod116({
      method: "POST",
      fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
    }),
    list: stripeMethod116({
      method: "GET",
      fullPath: "/v1/webhook_endpoints",
      methodType: "list"
    }),
    del: stripeMethod116({
      method: "DELETE",
      fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
    })
  });

  // node_modules/stripe/esm/resources.js
  var Apps = resourceNamespace("apps", { Secrets });
  var Billing = resourceNamespace("billing", {
    MeterEventAdjustments,
    MeterEvents,
    Meters
  });
  var BillingPortal = resourceNamespace("billingPortal", {
    Configurations,
    Sessions
  });
  var Checkout = resourceNamespace("checkout", {
    Sessions: Sessions2
  });
  var Climate = resourceNamespace("climate", {
    Orders,
    Products,
    Suppliers
  });
  var Entitlements = resourceNamespace("entitlements", {
    ActiveEntitlements,
    Features
  });
  var FinancialConnections = resourceNamespace("financialConnections", {
    Accounts,
    Sessions: Sessions3,
    Transactions: Transactions2
  });
  var Forwarding = resourceNamespace("forwarding", {
    Requests
  });
  var Identity = resourceNamespace("identity", {
    VerificationReports,
    VerificationSessions
  });
  var Issuing = resourceNamespace("issuing", {
    Authorizations: Authorizations2,
    Cardholders,
    Cards: Cards2,
    Disputes,
    PersonalizationDesigns: PersonalizationDesigns2,
    PhysicalBundles,
    Tokens,
    Transactions: Transactions3
  });
  var Radar = resourceNamespace("radar", {
    EarlyFraudWarnings,
    ValueListItems,
    ValueLists
  });
  var Reporting = resourceNamespace("reporting", {
    ReportRuns,
    ReportTypes
  });
  var Sigma = resourceNamespace("sigma", {
    ScheduledQueryRuns
  });
  var Tax = resourceNamespace("tax", {
    Calculations,
    Registrations,
    Settings,
    Transactions: Transactions4
  });
  var Terminal = resourceNamespace("terminal", {
    Configurations: Configurations2,
    ConnectionTokens,
    Locations,
    Readers: Readers2
  });
  var TestHelpers = resourceNamespace("testHelpers", {
    ConfirmationTokens,
    Customers,
    Refunds,
    TestClocks,
    Issuing: resourceNamespace("issuing", {
      Authorizations,
      Cards,
      PersonalizationDesigns,
      Transactions
    }),
    Terminal: resourceNamespace("terminal", {
      Readers
    }),
    Treasury: resourceNamespace("treasury", {
      InboundTransfers,
      OutboundPayments,
      OutboundTransfers,
      ReceivedCredits,
      ReceivedDebits
    })
  });
  var Treasury = resourceNamespace("treasury", {
    CreditReversals,
    DebitReversals,
    FinancialAccounts,
    InboundTransfers: InboundTransfers2,
    OutboundPayments: OutboundPayments2,
    OutboundTransfers: OutboundTransfers2,
    ReceivedCredits: ReceivedCredits2,
    ReceivedDebits: ReceivedDebits2,
    TransactionEntries,
    Transactions: Transactions5
  });

  // node_modules/stripe/esm/RequestSender.js
  var MAX_RETRY_AFTER_WAIT = 60;
  var RequestSender = class {
    constructor(stripe3, maxBufferedRequestMetric) {
      this._stripe = stripe3;
      this._maxBufferedRequestMetric = maxBufferedRequestMetric;
    }
    _addHeadersDirectlyToObject(obj, headers) {
      obj.requestId = headers["request-id"];
      obj.stripeAccount = obj.stripeAccount || headers["stripe-account"];
      obj.apiVersion = obj.apiVersion || headers["stripe-version"];
      obj.idempotencyKey = obj.idempotencyKey || headers["idempotency-key"];
    }
    _makeResponseEvent(requestEvent, statusCode, headers) {
      const requestEndTime = Date.now();
      const requestDurationMs = requestEndTime - requestEvent.request_start_time;
      return removeNullish({
        api_version: headers["stripe-version"],
        account: headers["stripe-account"],
        idempotency_key: headers["idempotency-key"],
        method: requestEvent.method,
        path: requestEvent.path,
        status: statusCode,
        request_id: this._getRequestId(headers),
        elapsed: requestDurationMs,
        request_start_time: requestEvent.request_start_time,
        request_end_time: requestEndTime
      });
    }
    _getRequestId(headers) {
      return headers["request-id"];
    }
    _streamingResponseHandler(requestEvent, usage, callback) {
      return (res) => {
        const headers = res.getHeaders();
        const streamCompleteCallback = () => {
          const responseEvent = this._makeResponseEvent(requestEvent, res.getStatusCode(), headers);
          this._stripe._emitter.emit("response", responseEvent);
          this._recordRequestMetrics(this._getRequestId(headers), responseEvent.elapsed, usage);
        };
        const stream = res.toStream(streamCompleteCallback);
        this._addHeadersDirectlyToObject(stream, headers);
        return callback(null, stream);
      };
    }
    _jsonResponseHandler(requestEvent, usage, callback) {
      return (res) => {
        const headers = res.getHeaders();
        const requestId = this._getRequestId(headers);
        const statusCode = res.getStatusCode();
        const responseEvent = this._makeResponseEvent(requestEvent, statusCode, headers);
        this._stripe._emitter.emit("response", responseEvent);
        res.toJSON().then((jsonResponse) => {
          if (jsonResponse.error) {
            let err;
            if (typeof jsonResponse.error === "string") {
              jsonResponse.error = {
                type: jsonResponse.error,
                message: jsonResponse.error_description
              };
            }
            jsonResponse.error.headers = headers;
            jsonResponse.error.statusCode = statusCode;
            jsonResponse.error.requestId = requestId;
            if (statusCode === 401) {
              err = new StripeAuthenticationError(jsonResponse.error);
            } else if (statusCode === 403) {
              err = new StripePermissionError(jsonResponse.error);
            } else if (statusCode === 429) {
              err = new StripeRateLimitError(jsonResponse.error);
            } else {
              err = StripeError.generate(jsonResponse.error);
            }
            throw err;
          }
          return jsonResponse;
        }, (e) => {
          throw new StripeAPIError({
            message: "Invalid JSON received from the Stripe API",
            exception: e,
            requestId: headers["request-id"]
          });
        }).then((jsonResponse) => {
          this._recordRequestMetrics(requestId, responseEvent.elapsed, usage);
          const rawResponse = res.getRawResponse();
          this._addHeadersDirectlyToObject(rawResponse, headers);
          Object.defineProperty(jsonResponse, "lastResponse", {
            enumerable: false,
            writable: false,
            value: rawResponse
          });
          callback(null, jsonResponse);
        }, (e) => callback(e, null));
      };
    }
    static _generateConnectionErrorMessage(requestRetries) {
      return `An error occurred with our connection to Stripe.${requestRetries > 0 ? ` Request was retried ${requestRetries} times.` : ""}`;
    }
    static _shouldRetry(res, numRetries, maxRetries, error) {
      if (error && numRetries === 0 && HttpClient.CONNECTION_CLOSED_ERROR_CODES.includes(error.code)) {
        return true;
      }
      if (numRetries >= maxRetries) {
        return false;
      }
      if (!res) {
        return true;
      }
      if (res.getHeaders()["stripe-should-retry"] === "false") {
        return false;
      }
      if (res.getHeaders()["stripe-should-retry"] === "true") {
        return true;
      }
      if (res.getStatusCode() === 409) {
        return true;
      }
      if (res.getStatusCode() >= 500) {
        return true;
      }
      return false;
    }
    _getSleepTimeInMS(numRetries, retryAfter = null) {
      const initialNetworkRetryDelay = this._stripe.getInitialNetworkRetryDelay();
      const maxNetworkRetryDelay = this._stripe.getMaxNetworkRetryDelay();
      let sleepSeconds = Math.min(initialNetworkRetryDelay * Math.pow(numRetries - 1, 2), maxNetworkRetryDelay);
      sleepSeconds *= 0.5 * (1 + Math.random());
      sleepSeconds = Math.max(initialNetworkRetryDelay, sleepSeconds);
      if (Number.isInteger(retryAfter) && retryAfter <= MAX_RETRY_AFTER_WAIT) {
        sleepSeconds = Math.max(sleepSeconds, retryAfter);
      }
      return sleepSeconds * 1e3;
    }
    _getMaxNetworkRetries(settings = {}) {
      return settings.maxNetworkRetries !== void 0 && Number.isInteger(settings.maxNetworkRetries) ? settings.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
    }
    _defaultIdempotencyKey(method, settings) {
      const maxRetries = this._getMaxNetworkRetries(settings);
      if (method === "POST" && maxRetries > 0) {
        return `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`;
      }
      return null;
    }
    _makeHeaders(auth, contentLength, apiVersion, clientUserAgent, method, userSuppliedHeaders, userSuppliedSettings) {
      const defaultHeaders = {
        Authorization: auth ? `Bearer ${auth}` : this._stripe.getApiField("auth"),
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this._getUserAgentString(),
        "X-Stripe-Client-User-Agent": clientUserAgent,
        "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
        "Stripe-Version": apiVersion,
        "Stripe-Account": this._stripe.getApiField("stripeAccount"),
        "Idempotency-Key": this._defaultIdempotencyKey(method, userSuppliedSettings)
      };
      const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
      if (methodHasPayload || contentLength) {
        if (!methodHasPayload) {
          emitWarning(`${method} method had non-zero contentLength but no payload is expected for this verb`);
        }
        defaultHeaders["Content-Length"] = contentLength;
      }
      return Object.assign(
        removeNullish(defaultHeaders),
        normalizeHeaders(userSuppliedHeaders)
      );
    }
    _getUserAgentString() {
      const packageVersion = this._stripe.getConstant("PACKAGE_VERSION");
      const appInfo = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
      return `Stripe/v1 NodeBindings/${packageVersion} ${appInfo}`.trim();
    }
    _getTelemetryHeader() {
      if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
        const metrics = this._stripe._prevRequestMetrics.shift();
        return JSON.stringify({
          last_request_metrics: metrics
        });
      }
    }
    _recordRequestMetrics(requestId, requestDurationMs, usage) {
      if (this._stripe.getTelemetryEnabled() && requestId) {
        if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric) {
          emitWarning("Request metrics buffer is full, dropping telemetry message.");
        } else {
          const m = {
            request_id: requestId,
            request_duration_ms: requestDurationMs
          };
          if (usage && usage.length > 0) {
            m.usage = usage;
          }
          this._stripe._prevRequestMetrics.push(m);
        }
      }
    }
    _request(method, host, path, data, auth, options = {}, usage = [], callback, requestDataProcessor = null) {
      let requestData;
      const retryRequest = (requestFn, apiVersion, headers, requestRetries, retryAfter) => {
        return setTimeout(requestFn, this._getSleepTimeInMS(requestRetries, retryAfter), apiVersion, headers, requestRetries + 1);
      };
      const makeRequest = (apiVersion, headers, numRetries) => {
        const timeout = options.settings && options.settings.timeout && Number.isInteger(options.settings.timeout) && options.settings.timeout >= 0 ? options.settings.timeout : this._stripe.getApiField("timeout");
        const req = this._stripe.getApiField("httpClient").makeRequest(host || this._stripe.getApiField("host"), this._stripe.getApiField("port"), path, method, headers, requestData, this._stripe.getApiField("protocol"), timeout);
        const requestStartTime = Date.now();
        const requestEvent = removeNullish({
          api_version: apiVersion,
          account: headers["Stripe-Account"],
          idempotency_key: headers["Idempotency-Key"],
          method,
          path,
          request_start_time: requestStartTime
        });
        const requestRetries = numRetries || 0;
        const maxRetries = this._getMaxNetworkRetries(options.settings || {});
        this._stripe._emitter.emit("request", requestEvent);
        req.then((res) => {
          if (RequestSender._shouldRetry(res, requestRetries, maxRetries)) {
            return retryRequest(
              makeRequest,
              apiVersion,
              headers,
              requestRetries,
              res.getHeaders()["retry-after"]
            );
          } else if (options.streaming && res.getStatusCode() < 400) {
            return this._streamingResponseHandler(requestEvent, usage, callback)(res);
          } else {
            return this._jsonResponseHandler(requestEvent, usage, callback)(res);
          }
        }).catch((error) => {
          if (RequestSender._shouldRetry(null, requestRetries, maxRetries, error)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, null);
          } else {
            const isTimeoutError = error.code && error.code === HttpClient.TIMEOUT_ERROR_CODE;
            return callback(new StripeConnectionError({
              message: isTimeoutError ? `Request aborted due to timeout being reached (${timeout}ms)` : RequestSender._generateConnectionErrorMessage(requestRetries),
              detail: error
            }));
          }
        });
      };
      const prepareAndMakeRequest = (error, data2) => {
        if (error) {
          return callback(error);
        }
        requestData = data2;
        this._stripe.getClientUserAgent((clientUserAgent) => {
          var _a, _b;
          const apiVersion = this._stripe.getApiField("version");
          const headers = this._makeHeaders(auth, requestData.length, apiVersion, clientUserAgent, method, (_a = options.headers) !== null && _a !== void 0 ? _a : null, (_b = options.settings) !== null && _b !== void 0 ? _b : {});
          makeRequest(apiVersion, headers, 0);
        });
      };
      if (requestDataProcessor) {
        requestDataProcessor(method, data, options.headers, prepareAndMakeRequest);
      } else {
        prepareAndMakeRequest(null, stringifyRequestData(data || {}));
      }
    }
  };

  // node_modules/stripe/esm/Webhooks.js
  function createWebhooks(platformFunctions) {
    const Webhook = {
      DEFAULT_TOLERANCE: 300,
      signature: null,
      constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
        try {
          this.signature.verifyHeader(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
        } catch (e) {
          if (e instanceof CryptoProviderOnlySupportsAsyncError) {
            e.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`";
          }
          throw e;
        }
        const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
        return jsonPayload;
      },
      async constructEventAsync(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
        await this.signature.verifyHeaderAsync(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
        const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
        return jsonPayload;
      },
      generateTestHeaderString: function(opts) {
        if (!opts) {
          throw new StripeError({
            message: "Options are required"
          });
        }
        opts.timestamp = Math.floor(opts.timestamp) || Math.floor(Date.now() / 1e3);
        opts.scheme = opts.scheme || signature.EXPECTED_SCHEME;
        opts.cryptoProvider = opts.cryptoProvider || getCryptoProvider();
        opts.signature = opts.signature || opts.cryptoProvider.computeHMACSignature(opts.timestamp + "." + opts.payload, opts.secret);
        const generatedHeader = [
          "t=" + opts.timestamp,
          opts.scheme + "=" + opts.signature
        ].join(",");
        return generatedHeader;
      }
    };
    const signature = {
      EXPECTED_SCHEME: "v1",
      verifyHeader(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
        const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
        const secretContainsWhitespace = /\s/.test(secret);
        cryptoProvider = cryptoProvider || getCryptoProvider();
        const expectedSignature = cryptoProvider.computeHMACSignature(makeHMACContent(payload, details), secret);
        validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
        return true;
      },
      async verifyHeaderAsync(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
        const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
        const secretContainsWhitespace = /\s/.test(secret);
        cryptoProvider = cryptoProvider || getCryptoProvider();
        const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(makeHMACContent(payload, details), secret);
        return validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
      }
    };
    function makeHMACContent(payload, details) {
      return `${details.timestamp}.${payload}`;
    }
    function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {
      if (!encodedPayload) {
        throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
          message: "No webhook payload was provided."
        });
      }
      const suspectPayloadType = typeof encodedPayload != "string" && !(encodedPayload instanceof Uint8Array);
      const textDecoder = new TextDecoder("utf8");
      const decodedPayload = encodedPayload instanceof Uint8Array ? textDecoder.decode(encodedPayload) : encodedPayload;
      if (Array.isArray(encodedHeader)) {
        throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
      }
      if (encodedHeader == null || encodedHeader == "") {
        throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
          message: "No stripe-signature header value was provided."
        });
      }
      const decodedHeader = encodedHeader instanceof Uint8Array ? textDecoder.decode(encodedHeader) : encodedHeader;
      const details = parseHeader(decodedHeader, expectedScheme);
      if (!details || details.timestamp === -1) {
        throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
          message: "Unable to extract timestamp and signatures from header"
        });
      }
      if (!details.signatures.length) {
        throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
          message: "No signatures found with expected scheme"
        });
      }
      return {
        decodedPayload,
        decodedHeader,
        details,
        suspectPayloadType
      };
    }
    function validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt) {
      const signatureFound = !!details.signatures.filter(platformFunctions.secureCompare.bind(platformFunctions, expectedSignature)).length;
      const docsLocation = "\nLearn more about webhook signing and explore webhook integration examples for various frameworks at https://github.com/stripe/stripe-node#webhook-signing";
      const whitespaceMessage = secretContainsWhitespace ? "\n\nNote: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value" : "";
      if (!signatureFound) {
        if (suspectPayloadType) {
          throw new StripeSignatureVerificationError(header, payload, {
            message: "Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. \nSignature verification is impossible without access to the original signed material. \n" + docsLocation + "\n" + whitespaceMessage
          });
        }
        throw new StripeSignatureVerificationError(header, payload, {
          message: "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n" + docsLocation + "\n" + whitespaceMessage
        });
      }
      const timestampAge = Math.floor((typeof receivedAt === "number" ? receivedAt : Date.now()) / 1e3) - details.timestamp;
      if (tolerance > 0 && timestampAge > tolerance) {
        throw new StripeSignatureVerificationError(header, payload, {
          message: "Timestamp outside the tolerance zone"
        });
      }
      return true;
    }
    function parseHeader(header, scheme) {
      if (typeof header !== "string") {
        return null;
      }
      return header.split(",").reduce((accum, item) => {
        const kv = item.split("=");
        if (kv[0] === "t") {
          accum.timestamp = parseInt(kv[1], 10);
        }
        if (kv[0] === scheme) {
          accum.signatures.push(kv[1]);
        }
        return accum;
      }, {
        timestamp: -1,
        signatures: []
      });
    }
    let webhooksCryptoProviderInstance = null;
    function getCryptoProvider() {
      if (!webhooksCryptoProviderInstance) {
        webhooksCryptoProviderInstance = platformFunctions.createDefaultCryptoProvider();
      }
      return webhooksCryptoProviderInstance;
    }
    Webhook.signature = signature;
    return Webhook;
  }

  // node_modules/stripe/esm/stripe.core.js
  var DEFAULT_HOST = "api.stripe.com";
  var DEFAULT_PORT = "443";
  var DEFAULT_BASE_PATH = "/v1/";
  var DEFAULT_API_VERSION = ApiVersion;
  var DEFAULT_TIMEOUT = 8e4;
  var MAX_NETWORK_RETRY_DELAY_SEC = 2;
  var INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;
  var APP_INFO_PROPERTIES = ["name", "version", "url", "partner_id"];
  var ALLOWED_CONFIG_PROPERTIES = [
    "apiVersion",
    "typescript",
    "maxNetworkRetries",
    "httpAgent",
    "httpClient",
    "timeout",
    "host",
    "port",
    "protocol",
    "telemetry",
    "appInfo",
    "stripeAccount"
  ];
  var defaultRequestSenderFactory = (stripe3) => new RequestSender(stripe3, StripeResource.MAX_BUFFERED_REQUEST_METRICS);
  function createStripe(platformFunctions, requestSender = defaultRequestSenderFactory) {
    Stripe2.PACKAGE_VERSION = "14.25.0";
    Stripe2.USER_AGENT = Object.assign({ bindings_version: Stripe2.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: false }, determineProcessUserAgentProperties());
    Stripe2.StripeResource = StripeResource;
    Stripe2.resources = resources_exports;
    Stripe2.HttpClient = HttpClient;
    Stripe2.HttpClientResponse = HttpClientResponse;
    Stripe2.CryptoProvider = CryptoProvider;
    function createWebhooksDefault(fns = platformFunctions) {
      return createWebhooks(fns);
    }
    Stripe2.webhooks = Object.assign(createWebhooksDefault, createWebhooks(platformFunctions));
    function Stripe2(key, config = {}) {
      if (!(this instanceof Stripe2)) {
        return new Stripe2(key, config);
      }
      const props = this._getPropsFromConfig(config);
      this._platformFunctions = platformFunctions;
      Object.defineProperty(this, "_emitter", {
        value: this._platformFunctions.createEmitter(),
        enumerable: false,
        configurable: false,
        writable: false
      });
      this.VERSION = Stripe2.PACKAGE_VERSION;
      this.on = this._emitter.on.bind(this._emitter);
      this.once = this._emitter.once.bind(this._emitter);
      this.off = this._emitter.removeListener.bind(this._emitter);
      const agent = props.httpAgent || null;
      this._api = {
        auth: null,
        host: props.host || DEFAULT_HOST,
        port: props.port || DEFAULT_PORT,
        protocol: props.protocol || "https",
        basePath: DEFAULT_BASE_PATH,
        version: props.apiVersion || DEFAULT_API_VERSION,
        timeout: validateInteger("timeout", props.timeout, DEFAULT_TIMEOUT),
        maxNetworkRetries: validateInteger("maxNetworkRetries", props.maxNetworkRetries, 1),
        agent,
        httpClient: props.httpClient || (agent ? this._platformFunctions.createNodeHttpClient(agent) : this._platformFunctions.createDefaultHttpClient()),
        dev: false,
        stripeAccount: props.stripeAccount || null
      };
      const typescript = props.typescript || false;
      if (typescript !== Stripe2.USER_AGENT.typescript) {
        Stripe2.USER_AGENT.typescript = typescript;
      }
      if (props.appInfo) {
        this._setAppInfo(props.appInfo);
      }
      this._prepResources();
      this._setApiKey(key);
      this.errors = Error_exports;
      this.webhooks = createWebhooksDefault();
      this._prevRequestMetrics = [];
      this._enableTelemetry = props.telemetry !== false;
      this._requestSender = requestSender(this);
      this.StripeResource = Stripe2.StripeResource;
    }
    Stripe2.errors = Error_exports;
    Stripe2.createNodeHttpClient = platformFunctions.createNodeHttpClient;
    Stripe2.createFetchHttpClient = platformFunctions.createFetchHttpClient;
    Stripe2.createNodeCryptoProvider = platformFunctions.createNodeCryptoProvider;
    Stripe2.createSubtleCryptoProvider = platformFunctions.createSubtleCryptoProvider;
    Stripe2.prototype = {
      _appInfo: void 0,
      on: null,
      off: null,
      once: null,
      VERSION: null,
      StripeResource: null,
      webhooks: null,
      errors: null,
      _api: null,
      _prevRequestMetrics: null,
      _emitter: null,
      _enableTelemetry: null,
      _requestSender: null,
      _platformFunctions: null,
      _setApiKey(key) {
        if (key) {
          this._setApiField("auth", `Bearer ${key}`);
        }
      },
      _setAppInfo(info) {
        if (info && typeof info !== "object") {
          throw new Error("AppInfo must be an object.");
        }
        if (info && !info.name) {
          throw new Error("AppInfo.name is required");
        }
        info = info || {};
        this._appInfo = APP_INFO_PROPERTIES.reduce(
          (accum, prop) => {
            if (typeof info[prop] == "string") {
              accum = accum || {};
              accum[prop] = info[prop];
            }
            return accum;
          },
          void 0
        );
      },
      _setApiField(key, value) {
        this._api[key] = value;
      },
      getApiField(key) {
        return this._api[key];
      },
      setClientId(clientId) {
        this._clientId = clientId;
      },
      getClientId() {
        return this._clientId;
      },
      getConstant: (c) => {
        switch (c) {
          case "DEFAULT_HOST":
            return DEFAULT_HOST;
          case "DEFAULT_PORT":
            return DEFAULT_PORT;
          case "DEFAULT_BASE_PATH":
            return DEFAULT_BASE_PATH;
          case "DEFAULT_API_VERSION":
            return DEFAULT_API_VERSION;
          case "DEFAULT_TIMEOUT":
            return DEFAULT_TIMEOUT;
          case "MAX_NETWORK_RETRY_DELAY_SEC":
            return MAX_NETWORK_RETRY_DELAY_SEC;
          case "INITIAL_NETWORK_RETRY_DELAY_SEC":
            return INITIAL_NETWORK_RETRY_DELAY_SEC;
        }
        return Stripe2[c];
      },
      getMaxNetworkRetries() {
        return this.getApiField("maxNetworkRetries");
      },
      _setApiNumberField(prop, n, defaultVal) {
        const val = validateInteger(prop, n, defaultVal);
        this._setApiField(prop, val);
      },
      getMaxNetworkRetryDelay() {
        return MAX_NETWORK_RETRY_DELAY_SEC;
      },
      getInitialNetworkRetryDelay() {
        return INITIAL_NETWORK_RETRY_DELAY_SEC;
      },
      getClientUserAgent(cb) {
        return this.getClientUserAgentSeeded(Stripe2.USER_AGENT, cb);
      },
      getClientUserAgentSeeded(seed, cb) {
        this._platformFunctions.getUname().then((uname) => {
          var _a;
          const userAgent = {};
          for (const field in seed) {
            userAgent[field] = encodeURIComponent((_a = seed[field]) !== null && _a !== void 0 ? _a : "null");
          }
          userAgent.uname = encodeURIComponent(uname || "UNKNOWN");
          const client = this.getApiField("httpClient");
          if (client) {
            userAgent.httplib = encodeURIComponent(client.getClientName());
          }
          if (this._appInfo) {
            userAgent.application = this._appInfo;
          }
          cb(JSON.stringify(userAgent));
        });
      },
      getAppInfoAsString() {
        if (!this._appInfo) {
          return "";
        }
        let formatted = this._appInfo.name;
        if (this._appInfo.version) {
          formatted += `/${this._appInfo.version}`;
        }
        if (this._appInfo.url) {
          formatted += ` (${this._appInfo.url})`;
        }
        return formatted;
      },
      getTelemetryEnabled() {
        return this._enableTelemetry;
      },
      _prepResources() {
        for (const name in resources_exports) {
          this[pascalToCamelCase(name)] = new resources_exports[name](this);
        }
      },
      _getPropsFromConfig(config) {
        if (!config) {
          return {};
        }
        const isString = typeof config === "string";
        const isObject2 = config === Object(config) && !Array.isArray(config);
        if (!isObject2 && !isString) {
          throw new Error("Config must either be an object or a string");
        }
        if (isString) {
          return {
            apiVersion: config
          };
        }
        const values = Object.keys(config).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value));
        if (values.length > 0) {
          throw new Error(`Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(", ")}`);
        }
        return config;
      }
    };
    return Stripe2;
  }

  // node_modules/stripe/esm/stripe.esm.worker.js
  var Stripe = createStripe(new WebPlatformFunctions());
  var stripe_esm_worker_default = Stripe;

  // src/views/App.tsx
  var import_ui = __toESM(require_ui());
  var import_http_client = __toESM(require_http_client());
  var import_utils8 = __toESM(require_utils2());

  // src/utils/riskScoring.ts
  function calculateRisk(subscription, charges) {
    let score = 0;
    const factors = [];
    if (subscription?.status === "past_due") {
      score += 25;
      factors.push("Subscription is past due");
    }
    if (subscription?.cancel_at_period_end) {
      score += 25;
      factors.push("Cancellation scheduled at period end");
    }
    const failedCharges = charges.filter((c) => c.status === "failed");
    if (failedCharges.length > 0) {
      const points = Math.min(failedCharges.length * 10, 30);
      score += points;
      factors.push(`${failedCharges.length} failed payment attempt${failedCharges.length > 1 ? "s" : ""}`);
    }
    const thirtyDaysAgo = Date.now() / 1e3 - 30 * 24 * 60 * 60;
    const hasRecentSuccess = charges.some((c) => c.status === "succeeded" && c.created > thirtyDaysAgo);
    if (!hasRecentSuccess && charges.length > 0) {
      score += 20;
      factors.push("No successful payment in the past 30 days");
    }
    if (factors.length === 0) {
      factors.push("No churn signals detected");
    }
    const finalScore = Math.min(score, 100);
    return {
      score: finalScore,
      level: finalScore >= 70 ? "high" : finalScore >= 40 ? "medium" : "low",
      factors,
      mrr: getSubscriptionMrr(subscription)
    };
  }
  function getSubscriptionMrr(sub) {
    if (!sub)
      return 0;
    return sub.items.data.reduce((total, item) => {
      const price = item.price;
      const unitAmount = price.unit_amount ?? 0;
      const qty = item.quantity ?? 1;
      const interval = price.recurring?.interval;
      const intervalCount = price.recurring?.interval_count ?? 1;
      let monthlyCents = unitAmount * qty;
      if (interval === "year")
        monthlyCents = monthlyCents / (12 * intervalCount);
      if (interval === "week")
        monthlyCents = monthlyCents * (52 / 12) / intervalCount;
      if (interval === "day")
        monthlyCents = monthlyCents * (365 / 12) / intervalCount;
      return total + monthlyCents;
    }, 0) / 100;
  }
  function riskBadgeType(level) {
    if (level === "high")
      return "negative";
    if (level === "medium")
      return "warning";
    return "positive";
  }
  function subscriptionBadgeType(status, cancelAtPeriodEnd) {
    if (cancelAtPeriodEnd)
      return "negative";
    if (status === "past_due" || status === "unpaid")
      return "negative";
    if (status === "trialing")
      return "warning";
    if (status === "active")
      return "positive";
    return "neutral";
  }
  function subscriptionLabel(status, cancelAtPeriodEnd) {
    if (cancelAtPeriodEnd)
      return "Cancelling";
    const labels = {
      active: "Active",
      past_due: "Past Due",
      unpaid: "Unpaid",
      canceled: "Cancelled",
      trialing: "Trial",
      incomplete: "Incomplete",
      incomplete_expired: "Expired",
      paused: "Paused"
    };
    return labels[status] ?? status;
  }

  // src/views/App.tsx
  var import_jsx_runtime = __require("react/jsx-runtime");
  var stripe = new stripe_esm_worker_default(import_http_client.STRIPE_API_KEY, {
    httpClient: (0, import_http_client.createHttpClient)(),
    apiVersion: "2023-10-16"
  });
  var APP_URL = "https://churnguardapp.com";
  function trunc(s, max) {
    return s.length > max ? s.slice(0, max) + "\u2026" : s;
  }
  function App({ userContext, environment }) {
    const [rows, setRows] = (0, import_react.useState)([]);
    const [loading, setLoading] = (0, import_react.useState)(true);
    const [error, setError] = (0, import_react.useState)(null);
    const [showingAll, setShowingAll] = (0, import_react.useState)(false);
    const [churnGuardLinked, setChurnGuardLinked] = (0, import_react.useState)(false);
    const accountId = userContext?.account?.id ?? "";
    const apiBase = environment?.constants?.API_BASE ?? `${APP_URL}/api/stripe-app`;
    const isTestMode = environment?.mode === "test";
    const [connectUrl, setConnectUrl] = (0, import_react.useState)(
      `${APP_URL}/signup?${new URLSearchParams({ stripe_account_id: accountId, source: "stripe_app" })}`
    );
    const atRisk = rows.filter((r) => r.riskScore >= 40);
    const highRisk = rows.filter((r) => r.riskScore >= 70);
    const revenueAtRisk = atRisk.reduce((sum, r) => sum + r.mrr, 0);
    const displayRows = showingAll ? rows : rows.slice(0, 8);
    function fmtMrr(n) {
      if (n >= 1e3)
        return `$${(n / 1e3).toFixed(1)}k`;
      return `$${n}`;
    }
    const load = (0, import_react.useCallback)(async () => {
      setLoading(true);
      setError(null);
      try {
        const [subscriptionsRes, chargesRes] = await Promise.all([
          stripe.subscriptions.list({
            limit: 100,
            expand: ["data.customer", "data.items.data.price"]
          }),
          stripe.charges.list({ limit: 100 })
        ]);
        const chargesByCustomer = {};
        for (const charge of chargesRes.data) {
          const cid = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
          if (!cid)
            continue;
          (chargesByCustomer[cid] ?? (chargesByCustomer[cid] = [])).push(charge);
        }
        const built = [];
        for (const sub of subscriptionsRes.data) {
          const customer = typeof sub.customer === "object" && sub.customer && !("deleted" in sub.customer) ? sub.customer : null;
          if (!customer)
            continue;
          const customerCharges = chargesByCustomer[customer.id] ?? [];
          const risk = calculateRisk(sub, customerCharges);
          const lastSuccess = customerCharges.find((c) => c.status === "succeeded");
          const daysSince = lastSuccess ? Math.floor((Date.now() / 1e3 - lastSuccess.created) / 86400) : null;
          built.push({
            id: customer.id,
            name: customer.name ?? customer.email ?? "Unknown",
            email: customer.email ?? "",
            riskScore: risk.score,
            riskLevel: risk.level,
            subscriptionStatus: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            daysSinceLastPayment: daysSince,
            mrr: risk.mrr
          });
        }
        built.sort((a, b) => b.riskScore - a.riskScore);
        setRows(built);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Stripe data");
      } finally {
        setLoading(false);
      }
      try {
        const { state, challenge } = await (0, import_utils8.createOAuthState)();
        const p = new URLSearchParams({
          stripe_account_id: accountId,
          state,
          challenge,
          source: "stripe_app"
        });
        setConnectUrl(`${APP_URL}/stripe-app/connect?${p}`);
      } catch {
      }
      try {
        const sig = await (0, import_utils8.fetchStripeSignature)();
        const res = await fetch(`${apiBase}/risk?account_id=${accountId}`, {
          headers: { "stripe-signature": sig }
        });
        if (res.ok) {
          const data = await res.json();
          setChurnGuardLinked(data.linked === true);
        }
      } catch {
      }
    }, [accountId, apiBase]);
    (0, import_react.useEffect)(() => {
      load();
    }, [load]);
    if (loading) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
        css: { stack: "y", gap: "medium", padding: "large", alignX: "center" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Spinner, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
            css: { font: "body" },
            children: "Loading customer risk scores\u2026"
          })
        ]
      });
    }
    if (error) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
        css: { stack: "y", gap: "medium", padding: "medium" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Banner, {
            type: "caution",
            title: "Could not load Stripe data",
            description: error,
            onDismiss: () => setError(null)
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Button, {
            onPress: load,
            children: "Retry"
          })
        ]
      });
    }
    if (rows.length === 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
        css: { stack: "y", gap: "medium", padding: "medium" },
        children: [
          isTestMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Banner, {
            type: "caution",
            title: "Test mode",
            description: "Add test subscriptions to see risk scores here."
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
            css: {
              stack: "y",
              gap: "small",
              padding: "medium",
              backgroundColor: "container",
              borderRadius: "medium"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
                css: { stack: "x", gap: "small", alignY: "center" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Badge, {
                    type: "positive",
                    children: "Live"
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                    css: { font: "bodyEmphasized" },
                    children: "Reading your Stripe data"
                  })
                ]
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                css: { font: "body" },
                children: "No active subscriptions found. Risk scores will appear here automatically once subscriptions exist in this account."
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Button, {
                type: "secondary",
                onPress: load,
                children: "Refresh"
              })
            ]
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Inline, {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Button, {
              type: "primary",
              href: connectUrl,
              target: "_blank",
              children: "Get ChurnGuard \u2014 Start Free Trial"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Inline, {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Link, {
              href: `${APP_URL}/pricing?source=stripe_app`,
              external: true,
              children: "See all plans \u2192"
            })
          })
        ]
      });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
      css: { stack: "y", gap: "medium", padding: "medium" },
      children: [
        isTestMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Banner, {
          type: "caution",
          title: "Test mode",
          description: "Showing test data. Switch to live mode to see real customer risk."
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
          css: { stack: "x", gap: "xsmall" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
              css: {
                width: "fill",
                stack: "y",
                gap: "xxsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "At Risk"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "title" },
                  children: atRisk.length
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "score \u2265 40"
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
              css: {
                width: "fill",
                stack: "y",
                gap: "xxsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "High Risk"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "title" },
                  children: highRisk.length
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "act now"
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
              css: {
                width: "fill",
                stack: "y",
                gap: "xxsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "MRR Risk"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "title" },
                  children: fmtMrr(revenueAtRisk)
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                  css: { font: "caption" },
                  children: "monthly"
                })
              ]
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Divider, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
          css: { stack: "x", gap: "small", alignY: "center" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
              css: { font: "subheading" },
              children: "Customer Risk Scores"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Badge, {
              type: "neutral",
              children: rows.length
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
          css: { stack: "y", gap: "xsmall" },
          children: [
            displayRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
              css: {
                stack: "y",
                gap: "xxsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
                  css: { stack: "x", gap: "small", alignY: "center" },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
                      css: { stack: "y", gap: "xxsmall", width: "fill" },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                          css: { font: "bodyEmphasized" },
                          children: trunc(row.name, 24)
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
                          css: { font: "caption" },
                          children: trunc(row.email, 30)
                        })
                      ]
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Badge, {
                      type: riskBadgeType(row.riskLevel),
                      children: [
                        row.riskScore,
                        " ",
                        row.riskLevel === "high" ? "High" : row.riskLevel === "medium" ? "Med" : "Low"
                      ]
                    })
                  ]
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
                  css: { stack: "x", gap: "xsmall", alignY: "center" },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Badge, {
                      type: subscriptionBadgeType(row.subscriptionStatus, row.cancelAtPeriodEnd),
                      children: subscriptionLabel(row.subscriptionStatus, row.cancelAtPeriodEnd)
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
                      css: { font: "caption" },
                      children: [
                        fmtMrr(row.mrr),
                        "/mo",
                        row.daysSinceLastPayment !== null ? ` \xB7 ${row.daysSinceLastPayment}d ago` : ""
                      ]
                    })
                  ]
                })
              ]
            }, row.id)),
            rows.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
              css: { alignX: "center", paddingY: "small" },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Button, {
                type: "secondary",
                onPress: () => setShowingAll((v) => !v),
                children: showingAll ? "Show less" : `Show all ${rows.length} customers`
              })
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Divider, {}),
        churnGuardLinked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Inline, {
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Link, {
            href: `${APP_URL}/dashboard?source=stripe_app`,
            external: true,
            children: "Open full ChurnGuard dashboard \u2192"
          })
        }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Box, {
          css: { stack: "y", gap: "xsmall" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Box, {
              css: { font: "caption" },
              children: highRisk.length > 0 ? `${highRisk.length} high-risk customer${highRisk.length !== 1 ? "s" : ""} \u2014 automate retention with ChurnGuard.` : "Automate retention campaigns when risk signals appear."
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Inline, {
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ui.Button, {
                type: "primary",
                href: connectUrl,
                target: "_blank",
                children: "Start Free Trial"
              })
            })
          ]
        })
      ]
    });
  }

  // src/views/CustomerDetailView.tsx
  var import_react2 = __require("react");
  var import_ui2 = __toESM(require_ui());
  var import_http_client2 = __toESM(require_http_client());
  var import_utils9 = __toESM(require_utils2());
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var stripe2 = new stripe_esm_worker_default(import_http_client2.STRIPE_API_KEY, {
    httpClient: (0, import_http_client2.createHttpClient)(),
    apiVersion: "2023-10-16"
  });
  var APP_URL2 = "https://churnguardapp.com";
  function CustomerDetailView({ userContext, environment }) {
    const customerId = environment?.objectContext?.id ?? "";
    const accountId = userContext?.account?.id ?? "";
    const apiBase = environment?.constants?.API_BASE ?? `${APP_URL2}/api/stripe-app`;
    const [risk, setRisk] = (0, import_react2.useState)(null);
    const [customerName, setCustomerName] = (0, import_react2.useState)("");
    const [subStatus, setSubStatus] = (0, import_react2.useState)("");
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = (0, import_react2.useState)(false);
    const [daysSince, setDaysSince] = (0, import_react2.useState)(null);
    const [loading, setLoading] = (0, import_react2.useState)(true);
    const [error, setError] = (0, import_react2.useState)(null);
    const load = (0, import_react2.useCallback)(async () => {
      if (!customerId)
        return;
      setLoading(true);
      setError(null);
      try {
        const [customer, subscriptions, charges] = await Promise.all([
          stripe2.customers.retrieve(customerId),
          stripe2.subscriptions.list({
            customer: customerId,
            limit: 10,
            expand: ["data.items.data.price"]
          }),
          stripe2.charges.list({ customer: customerId, limit: 30 })
        ]);
        if (!customer || "deleted" in customer) {
          setError("Customer not found or has been deleted.");
          return;
        }
        setCustomerName(customer.name ?? customer.email ?? customerId);
        const activeSub = subscriptions.data.find((s) => s.status === "active") ?? subscriptions.data.find((s) => s.status === "past_due") ?? subscriptions.data[0] ?? null;
        if (activeSub) {
          setSubStatus(activeSub.status);
          setCancelAtPeriodEnd(activeSub.cancel_at_period_end);
        }
        const result = calculateRisk(activeSub ?? null, charges.data);
        setRisk(result);
        const lastSuccess = charges.data.find((c) => c.status === "succeeded");
        if (lastSuccess) {
          setDaysSince(Math.floor((Date.now() / 1e3 - lastSuccess.created) / 86400));
        }
        try {
          const sig = await (0, import_utils9.fetchStripeSignature)();
          await fetch(
            `${apiBase}/customer?account_id=${accountId}&customer_id=${customerId}`,
            { headers: { "stripe-signature": sig } }
          );
        } catch {
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customer data");
      } finally {
        setLoading(false);
      }
    }, [customerId, accountId, apiBase]);
    (0, import_react2.useEffect)(() => {
      load();
    }, [load]);
    const signupParams = new URLSearchParams({
      stripe_account_id: accountId,
      customer_id: customerId,
      source: "stripe_app_customer"
    });
    const signupUrl = `${APP_URL2}/signup?${signupParams}`;
    if (!customerId) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
        css: { padding: "medium" },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
          css: { font: "body" },
          children: "No customer selected."
        })
      });
    }
    if (loading) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
        css: { padding: "large", stack: "y", gap: "medium", alignX: "center" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Spinner, {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
            css: { font: "body" },
            children: "Calculating churn risk\u2026"
          })
        ]
      });
    }
    if (error) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
        css: { padding: "medium", stack: "y", gap: "medium" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Banner, {
            type: "caution",
            title: "Error",
            description: error,
            onDismiss: () => setError(null)
          }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Button, {
            onPress: load,
            children: "Retry"
          })
        ]
      });
    }
    if (!risk)
      return null;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
      css: { stack: "y", gap: "medium", padding: "medium" },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
          css: { stack: "x", gap: "medium", alignY: "center" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
              css: { font: "heading" },
              children: "ChurnGuard Risk"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Badge, {
              type: riskBadgeType(risk.level),
              children: [
                risk.score,
                "/100 \u2014 ",
                risk.level === "high" ? "High" : risk.level === "medium" ? "Medium" : "Low",
                " Risk"
              ]
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
          css: { stack: "x", gap: "small" },
          children: [
            subStatus && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
              css: {
                stack: "y",
                gap: "xsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium",
                width: "1/3"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                  css: { font: "caption" },
                  children: "Subscription"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Badge, {
                  type: subscriptionBadgeType(subStatus, cancelAtPeriodEnd),
                  children: subscriptionLabel(subStatus, cancelAtPeriodEnd)
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
              css: {
                stack: "y",
                gap: "xsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium",
                width: "1/3"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                  css: { font: "caption" },
                  children: "MRR"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
                  css: { font: "heading" },
                  children: [
                    "$",
                    risk.mrr.toLocaleString("en-US", { maximumFractionDigits: 0 }),
                    "/mo"
                  ]
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
              css: {
                stack: "y",
                gap: "xsmall",
                padding: "small",
                backgroundColor: "container",
                borderRadius: "medium",
                width: "1/3"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                  css: { font: "caption" },
                  children: "Last Payment"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                  css: { font: "heading" },
                  children: daysSince !== null ? `${daysSince}d ago` : "\u2014"
                })
              ]
            })
          ]
        }),
        risk.factors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Divider, {}),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
              css: { stack: "y", gap: "xsmall" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                  css: { font: "subheading" },
                  children: "Risk Factors"
                }),
                risk.factors.map((factor, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
                  css: {
                    stack: "x",
                    gap: "small",
                    padding: "xsmall",
                    backgroundColor: "container",
                    borderRadius: "small",
                    alignY: "center"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Badge, {
                      type: risk.level === "high" ? "negative" : risk.level === "medium" ? "warning" : "positive",
                      children: i + 1
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Box, {
                      css: { font: "body" },
                      children: factor
                    })
                  ]
                }, i))
              ]
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Divider, {}),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
          css: { stack: "y", gap: "small" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ui2.Box, {
              css: { font: "body" },
              children: [
                "Prevent ",
                customerName,
                " from churning \u2014 ChurnGuard sends automated retention messages the moment risk signals appear."
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Inline, {
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Button, {
                type: "primary",
                href: signupUrl,
                target: "_blank",
                children: "Prevent Churn \u2014 Start Free Trial"
              })
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Inline, {
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ui2.Link, {
                href: `${APP_URL2}/pricing?source=stripe_app`,
                external: true,
                children: "See all ChurnGuard plans \u2192"
              })
            })
          ]
        })
      ]
    });
  }

  // .build/manifest.js
  __reExport(manifest_exports, __toESM(require_version()));
  var BUILD_TIME = "2026-06-29 13:31:24.7785491 +0100 WAT m=+85.816725001";
  var manifest_default = {
    "$schema": "https://stripe.com/stripe-app.schema.json",
    "constants": {
      "API_BASE": "https://churnguardapp.com/api/stripe-app"
    },
    "distribution_type": "public",
    "icon": "./public/icon.png",
    "id": "com.churnguard.risk-monitor",
    "name": "ChurnGuard",
    "permissions": [
      {
        "permission": "customer_read",
        "purpose": "Identify customers at risk of churning based on their profile and payment history"
      },
      {
        "permission": "subscription_read",
        "purpose": "Detect past-due, cancelling, and at-risk subscriptions"
      },
      {
        "permission": "charge_read",
        "purpose": "Calculate churn risk from failed and missing payment attempts"
      }
    ],
    "post_install_action": {
      "type": "external",
      "url": "https://churnguardapp.com/stripe-app/install"
    },
    "ui_extension": {
      "content_security_policy": {
        "connect-src": [
          "https://churnguardapp.com/api/"
        ],
        "purpose": "ChurnGuard backend API for AI-powered churn risk scores and retention data"
      },
      "views": [
        {
          "component": "App",
          "viewport": "stripe.dashboard.home.overview"
        },
        {
          "component": "CustomerDetailView",
          "viewport": "stripe.dashboard.customer.detail"
        }
      ]
    },
    "version": "0.0.6"
  };
  return __toCommonJS(manifest_exports);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy90eXBlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9vYmplY3QtaW5zcGVjdC91dGlsLmluc3BlY3QiLCAiLi4vbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwtbGlzdC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZXMtb2JqZWN0LWF0b21zL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9ldmFsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvcmFuZ2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9yZWYuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9zeW50YXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy91cmkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL21hdGgtaW50cmluc2ljcy9hYnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL21hdGgtaW50cmluc2ljcy9mbG9vci5qcyIsICIuLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL21heC5qcyIsICIuLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL21pbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL3Bvdy5qcyIsICIuLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL3JvdW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9tYXRoLWludHJpbnNpY3MvaXNOYU4uanMiLCAiLi4vbm9kZV9tb2R1bGVzL21hdGgtaW50cmluc2ljcy9zaWduLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9nb3BkL2dPUEQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2dvcGQvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2VzLWRlZmluZS1wcm9wZXJ0eS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvaGFzLXN5bWJvbHMvc2hhbXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9nZXQtcHJvdG8vUmVmbGVjdC5nZXRQcm90b3R5cGVPZi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL09iamVjdC5nZXRQcm90b3R5cGVPZi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZnVuY3Rpb24tYmluZC9pbXBsZW1lbnRhdGlvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZnVuY3Rpb24tYmluZC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMvZnVuY3Rpb25DYWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9jYWxsLWJpbmQtYXBwbHktaGVscGVycy9mdW5jdGlvbkFwcGx5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9jYWxsLWJpbmQtYXBwbHktaGVscGVycy9yZWZsZWN0QXBwbHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC1hcHBseS1oZWxwZXJzL2FjdHVhbEFwcGx5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9jYWxsLWJpbmQtYXBwbHktaGVscGVycy9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZHVuZGVyLXByb3RvL2dldC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9oYXNvd24vaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2dldC1pbnRyaW5zaWMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2NhbGwtYm91bmQvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL3NpZGUtY2hhbm5lbC1tYXAvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL3NpZGUtY2hhbm5lbC13ZWFrbWFwL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL3FzL2xpYi9mb3JtYXRzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9xcy9saWIvdXRpbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3FzL2xpYi9zdHJpbmdpZnkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3FzL2xpYi9wYXJzZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvcXMvbGliL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdmVyc2lvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3VpL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9pbnZhcmlhbnQvYnJvd3Nlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL19lbmRwb2ludC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL2FwaUZldGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMvaHR0cENsaWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL2h0dHBfY2xpZW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMvY2xpcGJvYXJkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMvY29udGV4dC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL2dldERhc2hib2FyZFVzZXJFbWFpbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL2dldFVzZXJBdXRob3JpemVkUGVybWlzc2lvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BzdHJpcGUvdWktZXh0ZW5zaW9uLXNkay91dGlscy9pc1Blcm1pc3Npb25BdXRob3JpemVkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMvaXNTb3VyY2VJbkF1dGhvcml6ZWRDU1AuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BzdHJpcGUvdWktZXh0ZW5zaW9uLXNkay91dGlscy9vYXV0aC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL3BsYXRmb3JtUnBjcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL3NpZ25hdHVyZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzL3RvYXN0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9Ac3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMvaW5kZXguanMiLCAibWFuaWZlc3QuanMiLCAiLi4vc3JjL3ZpZXdzL0FwcC50c3giLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vbmV0L0h0dHBDbGllbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vbmV0L0ZldGNoSHR0cENsaWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9jcnlwdG8vQ3J5cHRvUHJvdmlkZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vY3J5cHRvL1N1YnRsZUNyeXB0b1Byb3ZpZGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3BsYXRmb3JtL1BsYXRmb3JtRnVuY3Rpb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL1N0cmlwZUVtaXR0ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcGxhdGZvcm0vV2ViUGxhdGZvcm1GdW5jdGlvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vRXJyb3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vYXBpVmVyc2lvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vUmVzb3VyY2VOYW1lc3BhY2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vdXRpbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vYXV0b1BhZ2luYXRpb24uanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vU3RyaXBlTWV0aG9kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL1N0cmlwZVJlc291cmNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9GaW5hbmNpYWxDb25uZWN0aW9ucy9BY2NvdW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvRW50aXRsZW1lbnRzL0FjdGl2ZUVudGl0bGVtZW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvSXNzdWluZy9BdXRob3JpemF0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSXNzdWluZy9BdXRob3JpemF0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGF4L0NhbGN1bGF0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSXNzdWluZy9DYXJkaG9sZGVycy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvSXNzdWluZy9DYXJkcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSXNzdWluZy9DYXJkcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQmlsbGluZ1BvcnRhbC9Db25maWd1cmF0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVybWluYWwvQ29uZmlndXJhdGlvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL0NvbmZpcm1hdGlvblRva2Vucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVybWluYWwvQ29ubmVjdGlvblRva2Vucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvQ3JlZGl0UmV2ZXJzYWxzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UZXN0SGVscGVycy9DdXN0b21lcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1RyZWFzdXJ5L0RlYml0UmV2ZXJzYWxzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9Jc3N1aW5nL0Rpc3B1dGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9SYWRhci9FYXJseUZyYXVkV2FybmluZ3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0VudGl0bGVtZW50cy9GZWF0dXJlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvRmluYW5jaWFsQWNjb3VudHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1RyZWFzdXJ5L0luYm91bmRUcmFuc2ZlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1RyZWFzdXJ5L0luYm91bmRUcmFuc2ZlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlcm1pbmFsL0xvY2F0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQmlsbGluZy9NZXRlckV2ZW50QWRqdXN0bWVudHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0JpbGxpbmcvTWV0ZXJFdmVudHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0JpbGxpbmcvTWV0ZXJzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9DbGltYXRlL09yZGVycy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvVHJlYXN1cnkvT3V0Ym91bmRQYXltZW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvT3V0Ym91bmRQYXltZW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvVHJlYXN1cnkvT3V0Ym91bmRUcmFuc2ZlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1RyZWFzdXJ5L091dGJvdW5kVHJhbnNmZXJzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UZXN0SGVscGVycy9Jc3N1aW5nL1BlcnNvbmFsaXphdGlvbkRlc2lnbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0lzc3VpbmcvUGVyc29uYWxpemF0aW9uRGVzaWducy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSXNzdWluZy9QaHlzaWNhbEJ1bmRsZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0NsaW1hdGUvUHJvZHVjdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1Rlcm1pbmFsL1JlYWRlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlcm1pbmFsL1JlYWRlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1RyZWFzdXJ5L1JlY2VpdmVkQ3JlZGl0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvUmVjZWl2ZWRDcmVkaXRzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UZXN0SGVscGVycy9UcmVhc3VyeS9SZWNlaXZlZERlYml0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvUmVjZWl2ZWREZWJpdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1JlZnVuZHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1RheC9SZWdpc3RyYXRpb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9SZXBvcnRpbmcvUmVwb3J0UnVucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUmVwb3J0aW5nL1JlcG9ydFR5cGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9Gb3J3YXJkaW5nL1JlcXVlc3RzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9TaWdtYS9TY2hlZHVsZWRRdWVyeVJ1bnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0FwcHMvU2VjcmV0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQmlsbGluZ1BvcnRhbC9TZXNzaW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQ2hlY2tvdXQvU2Vzc2lvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0ZpbmFuY2lhbENvbm5lY3Rpb25zL1Nlc3Npb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UYXgvU2V0dGluZ3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0NsaW1hdGUvU3VwcGxpZXJzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UZXN0SGVscGVycy9UZXN0Q2xvY2tzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9Jc3N1aW5nL1Rva2Vucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvVHJhbnNhY3Rpb25FbnRyaWVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UZXN0SGVscGVycy9Jc3N1aW5nL1RyYW5zYWN0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvRmluYW5jaWFsQ29ubmVjdGlvbnMvVHJhbnNhY3Rpb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9Jc3N1aW5nL1RyYW5zYWN0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGF4L1RyYW5zYWN0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVHJlYXN1cnkvVHJhbnNhY3Rpb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9SYWRhci9WYWx1ZUxpc3RJdGVtcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUmFkYXIvVmFsdWVMaXN0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSWRlbnRpdHkvVmVyaWZpY2F0aW9uUmVwb3J0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSWRlbnRpdHkvVmVyaWZpY2F0aW9uU2Vzc2lvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0FjY291bnRzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9BY2NvdW50TGlua3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0FjY291bnRTZXNzaW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQXBwbGVQYXlEb21haW5zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9BcHBsaWNhdGlvbkZlZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0JhbGFuY2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0JhbGFuY2VUcmFuc2FjdGlvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0NoYXJnZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL0NvbmZpcm1hdGlvblRva2Vucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQ291bnRyeVNwZWNzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9Db3Vwb25zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9DcmVkaXROb3Rlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQ3VzdG9tZXJTZXNzaW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvQ3VzdG9tZXJzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9EaXNwdXRlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvRXBoZW1lcmFsS2V5cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvRXZlbnRzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9FeGNoYW5nZVJhdGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9GaWxlTGlua3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vbXVsdGlwYXJ0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9GaWxlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvSW52b2ljZUl0ZW1zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9JbnZvaWNlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvTWFuZGF0ZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL09BdXRoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9QYXltZW50SW50ZW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUGF5bWVudExpbmtzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9QYXltZW50TWV0aG9kQ29uZmlndXJhdGlvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1BheW1lbnRNZXRob2REb21haW5zLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9QYXltZW50TWV0aG9kcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUGF5b3V0cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUGxhbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1ByaWNlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvUHJvZHVjdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Byb21vdGlvbkNvZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9RdW90ZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1JlZnVuZHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Jldmlld3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1NldHVwQXR0ZW1wdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1NldHVwSW50ZW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvU2hpcHBpbmdSYXRlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvU291cmNlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvU3Vic2NyaXB0aW9uSXRlbXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1N1YnNjcmlwdGlvblNjaGVkdWxlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvU3Vic2NyaXB0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGF4Q29kZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1RheElkcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVGF4UmF0ZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1Rva2Vucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9yZXNvdXJjZXMvVG9wdXBzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9zdHJpcGUvZXNtL3Jlc291cmNlcy9UcmFuc2ZlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vcmVzb3VyY2VzL1dlYmhvb2tFbmRwb2ludHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3N0cmlwZS9lc20vUmVxdWVzdFNlbmRlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9XZWJob29rcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9zdHJpcGUuY29yZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvc3RyaXBlL2VzbS9zdHJpcGUuZXNtLndvcmtlci5qcyIsICIuLi9zcmMvdXRpbHMvcmlza1Njb3JpbmcudHMiLCAiLi4vc3JjL3ZpZXdzL0N1c3RvbWVyRGV0YWlsVmlldy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vdHlwZScpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBUeXBlRXJyb3I7XG4iLCAiIiwgInZhciBoYXNNYXAgPSB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIE1hcC5wcm90b3R5cGU7XG52YXIgbWFwU2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc01hcCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTWFwLnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgbWFwU2l6ZSA9IGhhc01hcCAmJiBtYXBTaXplRGVzY3JpcHRvciAmJiB0eXBlb2YgbWFwU2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gbWFwU2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBtYXBGb3JFYWNoID0gaGFzTWFwICYmIE1hcC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNTZXQgPSB0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIFNldC5wcm90b3R5cGU7XG52YXIgc2V0U2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc1NldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU2V0LnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgc2V0U2l6ZSA9IGhhc1NldCAmJiBzZXRTaXplRGVzY3JpcHRvciAmJiB0eXBlb2Ygc2V0U2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gc2V0U2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBzZXRGb3JFYWNoID0gaGFzU2V0ICYmIFNldC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgV2Vha01hcC5wcm90b3R5cGU7XG52YXIgd2Vha01hcEhhcyA9IGhhc1dlYWtNYXAgPyBXZWFrTWFwLnByb3RvdHlwZS5oYXMgOiBudWxsO1xudmFyIGhhc1dlYWtTZXQgPSB0eXBlb2YgV2Vha1NldCA9PT0gJ2Z1bmN0aW9uJyAmJiBXZWFrU2V0LnByb3RvdHlwZTtcbnZhciB3ZWFrU2V0SGFzID0gaGFzV2Vha1NldCA/IFdlYWtTZXQucHJvdG90eXBlLmhhcyA6IG51bGw7XG52YXIgaGFzV2Vha1JlZiA9IHR5cGVvZiBXZWFrUmVmID09PSAnZnVuY3Rpb24nICYmIFdlYWtSZWYucHJvdG90eXBlO1xudmFyIHdlYWtSZWZEZXJlZiA9IGhhc1dlYWtSZWYgPyBXZWFrUmVmLnByb3RvdHlwZS5kZXJlZiA6IG51bGw7XG52YXIgYm9vbGVhblZhbHVlT2YgPSBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mO1xudmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyICRtYXRjaCA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG52YXIgJHNsaWNlID0gU3RyaW5nLnByb3RvdHlwZS5zbGljZTtcbnZhciAkcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbnZhciAkdG9VcHBlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvVXBwZXJDYXNlO1xudmFyICR0b0xvd2VyQ2FzZSA9IFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2U7XG52YXIgJHRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG52YXIgJGNvbmNhdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQ7XG52YXIgJGpvaW4gPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbnZhciAkYXJyU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBiaWdJbnRWYWx1ZU9mID0gdHlwZW9mIEJpZ0ludCA9PT0gJ2Z1bmN0aW9uJyA/IEJpZ0ludC5wcm90b3R5cGUudmFsdWVPZiA6IG51bGw7XG52YXIgZ09QUyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgc3ltVG9TdHJpbmcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdzeW1ib2wnID8gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA6IG51bGw7XG52YXIgaGFzU2hhbW1lZFN5bWJvbHMgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdvYmplY3QnO1xuLy8gaWUsIGBoYXMtdG9zdHJpbmd0YWcvc2hhbXNcbnZhciB0b1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLnRvU3RyaW5nVGFnICYmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSBoYXNTaGFtbWVkU3ltYm9scyA/ICdvYmplY3QnIDogJ3N5bWJvbCcpXG4gICAgPyBTeW1ib2wudG9TdHJpbmdUYWdcbiAgICA6IG51bGw7XG52YXIgaXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxudmFyIGdQTyA9ICh0eXBlb2YgUmVmbGVjdCA9PT0gJ2Z1bmN0aW9uJyA/IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YgOiBPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHx8IChcbiAgICBbXS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvXG4gICAgICAgID8gZnVuY3Rpb24gKE8pIHtcbiAgICAgICAgICAgIHJldHVybiBPLl9fcHJvdG9fXzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b1xuICAgICAgICB9XG4gICAgICAgIDogbnVsbFxuKTtcblxuZnVuY3Rpb24gYWRkTnVtZXJpY1NlcGFyYXRvcihudW0sIHN0cikge1xuICAgIGlmIChcbiAgICAgICAgbnVtID09PSBJbmZpbml0eVxuICAgICAgICB8fCBudW0gPT09IC1JbmZpbml0eVxuICAgICAgICB8fCBudW0gIT09IG51bVxuICAgICAgICB8fCAobnVtICYmIG51bSA+IC0xMDAwICYmIG51bSA8IDEwMDApXG4gICAgICAgIHx8ICR0ZXN0LmNhbGwoL2UvLCBzdHIpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHZhciBzZXBSZWdleCA9IC9bMC05XSg/PSg/OlswLTldezN9KSsoPyFbMC05XSkpL2c7XG4gICAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgICAgIHZhciBpbnQgPSBudW0gPCAwID8gLSRmbG9vcigtbnVtKSA6ICRmbG9vcihudW0pOyAvLyB0cnVuYyhudW0pXG4gICAgICAgIGlmIChpbnQgIT09IG51bSkge1xuICAgICAgICAgICAgdmFyIGludFN0ciA9IFN0cmluZyhpbnQpO1xuICAgICAgICAgICAgdmFyIGRlYyA9ICRzbGljZS5jYWxsKHN0ciwgaW50U3RyLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoaW50U3RyLCBzZXBSZWdleCwgJyQmXycpICsgJy4nICsgJHJlcGxhY2UuY2FsbCgkcmVwbGFjZS5jYWxsKGRlYywgLyhbMC05XXszfSkvZywgJyQmXycpLCAvXyQvLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoc3RyLCBzZXBSZWdleCwgJyQmXycpO1xufVxuXG52YXIgdXRpbEluc3BlY3QgPSByZXF1aXJlKCcuL3V0aWwuaW5zcGVjdCcpO1xudmFyIGluc3BlY3RDdXN0b20gPSB1dGlsSW5zcGVjdC5jdXN0b207XG52YXIgaW5zcGVjdFN5bWJvbCA9IGlzU3ltYm9sKGluc3BlY3RDdXN0b20pID8gaW5zcGVjdEN1c3RvbSA6IG51bGw7XG5cbnZhciBxdW90ZXMgPSB7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgICdkb3VibGUnOiAnXCInLFxuICAgIHNpbmdsZTogXCInXCJcbn07XG52YXIgcXVvdGVSRXMgPSB7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgICdkb3VibGUnOiAvKFtcIlxcXFxdKS9nLFxuICAgIHNpbmdsZTogLyhbJ1xcXFxdKS9nXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluc3BlY3RfKG9iaiwgb3B0aW9ucywgZGVwdGgsIHNlZW4pIHtcbiAgICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoaGFzKG9wdHMsICdxdW90ZVN0eWxlJykgJiYgIWhhcyhxdW90ZXMsIG9wdHMucXVvdGVTdHlsZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwicXVvdGVTdHlsZVwiIG11c3QgYmUgXCJzaW5nbGVcIiBvciBcImRvdWJsZVwiJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgICAgaGFzKG9wdHMsICdtYXhTdHJpbmdMZW5ndGgnKSAmJiAodHlwZW9mIG9wdHMubWF4U3RyaW5nTGVuZ3RoID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyBvcHRzLm1heFN0cmluZ0xlbmd0aCA8IDAgJiYgb3B0cy5tYXhTdHJpbmdMZW5ndGggIT09IEluZmluaXR5XG4gICAgICAgICAgICA6IG9wdHMubWF4U3RyaW5nTGVuZ3RoICE9PSBudWxsXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwibWF4U3RyaW5nTGVuZ3RoXCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgSW5maW5pdHksIG9yIGBudWxsYCcpO1xuICAgIH1cbiAgICB2YXIgY3VzdG9tSW5zcGVjdCA9IGhhcyhvcHRzLCAnY3VzdG9tSW5zcGVjdCcpID8gb3B0cy5jdXN0b21JbnNwZWN0IDogdHJ1ZTtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUluc3BlY3QgIT09ICdib29sZWFuJyAmJiBjdXN0b21JbnNwZWN0ICE9PSAnc3ltYm9sJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJjdXN0b21JbnNwZWN0XCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGB0cnVlYCwgYGZhbHNlYCwgb3IgYFxcJ3N5bWJvbFxcJ2AnKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGhhcyhvcHRzLCAnaW5kZW50JylcbiAgICAgICAgJiYgb3B0cy5pbmRlbnQgIT09IG51bGxcbiAgICAgICAgJiYgb3B0cy5pbmRlbnQgIT09ICdcXHQnXG4gICAgICAgICYmICEocGFyc2VJbnQob3B0cy5pbmRlbnQsIDEwKSA9PT0gb3B0cy5pbmRlbnQgJiYgb3B0cy5pbmRlbnQgPiAwKVxuICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJpbmRlbnRcIiBtdXN0IGJlIFwiXFxcXHRcIiwgYW4gaW50ZWdlciA+IDAsIG9yIGBudWxsYCcpO1xuICAgIH1cbiAgICBpZiAoaGFzKG9wdHMsICdudW1lcmljU2VwYXJhdG9yJykgJiYgdHlwZW9mIG9wdHMubnVtZXJpY1NlcGFyYXRvciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcIm51bWVyaWNTZXBhcmF0b3JcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYHRydWVgIG9yIGBmYWxzZWAnKTtcbiAgICB9XG4gICAgdmFyIG51bWVyaWNTZXBhcmF0b3IgPSBvcHRzLm51bWVyaWNTZXBhcmF0b3I7XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgIH1cbiAgICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIG9iaiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBpbnNwZWN0U3RyaW5nKG9iaiwgb3B0cyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAob2JqID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5maW5pdHkgLyBvYmogPiAwID8gJzAnIDogJy0wJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gU3RyaW5nKG9iaik7XG4gICAgICAgIHJldHVybiBudW1lcmljU2VwYXJhdG9yID8gYWRkTnVtZXJpY1NlcGFyYXRvcihvYmosIHN0cikgOiBzdHI7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnYmlnaW50Jykge1xuICAgICAgICB2YXIgYmlnSW50U3RyID0gU3RyaW5nKG9iaikgKyAnbic7XG4gICAgICAgIHJldHVybiBudW1lcmljU2VwYXJhdG9yID8gYWRkTnVtZXJpY1NlcGFyYXRvcihvYmosIGJpZ0ludFN0cikgOiBiaWdJbnRTdHI7XG4gICAgfVxuXG4gICAgdmFyIG1heERlcHRoID0gdHlwZW9mIG9wdHMuZGVwdGggPT09ICd1bmRlZmluZWQnID8gNSA6IG9wdHMuZGVwdGg7XG4gICAgaWYgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcpIHsgZGVwdGggPSAwOyB9XG4gICAgaWYgKGRlcHRoID49IG1heERlcHRoICYmIG1heERlcHRoID4gMCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gaXNBcnJheShvYmopID8gJ1tBcnJheV0nIDogJ1tPYmplY3RdJztcbiAgICB9XG5cbiAgICB2YXIgaW5kZW50ID0gZ2V0SW5kZW50KG9wdHMsIGRlcHRoKTtcblxuICAgIGlmICh0eXBlb2Ygc2VlbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2VlbiA9IFtdO1xuICAgIH0gZWxzZSBpZiAoaW5kZXhPZihzZWVuLCBvYmopID49IDApIHtcbiAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNwZWN0KHZhbHVlLCBmcm9tLCBub0luZGVudCkge1xuICAgICAgICBpZiAoZnJvbSkge1xuICAgICAgICAgICAgc2VlbiA9ICRhcnJTbGljZS5jYWxsKHNlZW4pO1xuICAgICAgICAgICAgc2Vlbi5wdXNoKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub0luZGVudCkge1xuICAgICAgICAgICAgdmFyIG5ld09wdHMgPSB7XG4gICAgICAgICAgICAgICAgZGVwdGg6IG9wdHMuZGVwdGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoaGFzKG9wdHMsICdxdW90ZVN0eWxlJykpIHtcbiAgICAgICAgICAgICAgICBuZXdPcHRzLnF1b3RlU3R5bGUgPSBvcHRzLnF1b3RlU3R5bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zcGVjdF8odmFsdWUsIG5ld09wdHMsIGRlcHRoICsgMSwgc2Vlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3BlY3RfKHZhbHVlLCBvcHRzLCBkZXB0aCArIDEsIHNlZW4pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmICFpc1JlZ0V4cChvYmopKSB7IC8vIGluIG9sZGVyIGVuZ2luZXMsIHJlZ2V4ZXMgYXJlIGNhbGxhYmxlXG4gICAgICAgIHZhciBuYW1lID0gbmFtZU9mKG9iaik7XG4gICAgICAgIHZhciBrZXlzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpO1xuICAgICAgICByZXR1cm4gJ1tGdW5jdGlvbicgKyAobmFtZSA/ICc6ICcgKyBuYW1lIDogJyAoYW5vbnltb3VzKScpICsgJ10nICsgKGtleXMubGVuZ3RoID4gMCA/ICcgeyAnICsgJGpvaW4uY2FsbChrZXlzLCAnLCAnKSArICcgfScgOiAnJyk7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChvYmopKSB7XG4gICAgICAgIHZhciBzeW1TdHJpbmcgPSBoYXNTaGFtbWVkU3ltYm9scyA/ICRyZXBsYWNlLmNhbGwoU3RyaW5nKG9iaiksIC9eKFN5bWJvbFxcKC4qXFwpKV9bXildKiQvLCAnJDEnKSA6IHN5bVRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICFoYXNTaGFtbWVkU3ltYm9scyA/IG1hcmtCb3hlZChzeW1TdHJpbmcpIDogc3ltU3RyaW5nO1xuICAgIH1cbiAgICBpZiAoaXNFbGVtZW50KG9iaikpIHtcbiAgICAgICAgdmFyIHMgPSAnPCcgKyAkdG9Mb3dlckNhc2UuY2FsbChTdHJpbmcob2JqLm5vZGVOYW1lKSk7XG4gICAgICAgIHZhciBhdHRycyA9IG9iai5hdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzICs9ICcgJyArIGF0dHJzW2ldLm5hbWUgKyAnPScgKyB3cmFwUXVvdGVzKHF1b3RlKGF0dHJzW2ldLnZhbHVlKSwgJ2RvdWJsZScsIG9wdHMpO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gJz4nO1xuICAgICAgICBpZiAob2JqLmNoaWxkTm9kZXMgJiYgb2JqLmNoaWxkTm9kZXMubGVuZ3RoKSB7IHMgKz0gJy4uLic7IH1cbiAgICAgICAgcyArPSAnPC8nICsgJHRvTG93ZXJDYXNlLmNhbGwoU3RyaW5nKG9iai5ub2RlTmFtZSkpICsgJz4nO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJ1tdJzsgfVxuICAgICAgICB2YXIgeHMgPSBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdCk7XG4gICAgICAgIGlmIChpbmRlbnQgJiYgIXNpbmdsZUxpbmVWYWx1ZXMoeHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgaW5kZW50ZWRKb2luKHhzLCBpbmRlbnQpICsgJ10nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnWyAnICsgJGpvaW4uY2FsbCh4cywgJywgJykgKyAnIF0nO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcihvYmopKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0KTtcbiAgICAgICAgaWYgKCEoJ2NhdXNlJyBpbiBFcnJvci5wcm90b3R5cGUpICYmICdjYXVzZScgaW4gb2JqICYmICFpc0VudW1lcmFibGUuY2FsbChvYmosICdjYXVzZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3sgWycgKyBTdHJpbmcob2JqKSArICddICcgKyAkam9pbi5jYWxsKCRjb25jYXQuY2FsbCgnW2NhdXNlXTogJyArIGluc3BlY3Qob2JqLmNhdXNlKSwgcGFydHMpLCAnLCAnKSArICcgfSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJ1snICsgU3RyaW5nKG9iaikgKyAnXSc7IH1cbiAgICAgICAgcmV0dXJuICd7IFsnICsgU3RyaW5nKG9iaikgKyAnXSAnICsgJGpvaW4uY2FsbChwYXJ0cywgJywgJykgKyAnIH0nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgY3VzdG9tSW5zcGVjdCkge1xuICAgICAgICBpZiAoaW5zcGVjdFN5bWJvbCAmJiB0eXBlb2Ygb2JqW2luc3BlY3RTeW1ib2xdID09PSAnZnVuY3Rpb24nICYmIHV0aWxJbnNwZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbEluc3BlY3Qob2JqLCB7IGRlcHRoOiBtYXhEZXB0aCAtIGRlcHRoIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGN1c3RvbUluc3BlY3QgIT09ICdzeW1ib2wnICYmIHR5cGVvZiBvYmouaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pbnNwZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTWFwKG9iaikpIHtcbiAgICAgICAgdmFyIG1hcFBhcnRzID0gW107XG4gICAgICAgIGlmIChtYXBGb3JFYWNoKSB7XG4gICAgICAgICAgICBtYXBGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIG1hcFBhcnRzLnB1c2goaW5zcGVjdChrZXksIG9iaiwgdHJ1ZSkgKyAnID0+ICcgKyBpbnNwZWN0KHZhbHVlLCBvYmopKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uT2YoJ01hcCcsIG1hcFNpemUuY2FsbChvYmopLCBtYXBQYXJ0cywgaW5kZW50KTtcbiAgICB9XG4gICAgaWYgKGlzU2V0KG9iaikpIHtcbiAgICAgICAgdmFyIHNldFBhcnRzID0gW107XG4gICAgICAgIGlmIChzZXRGb3JFYWNoKSB7XG4gICAgICAgICAgICBzZXRGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzZXRQYXJ0cy5wdXNoKGluc3BlY3QodmFsdWUsIG9iaikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25PZignU2V0Jywgc2V0U2l6ZS5jYWxsKG9iaiksIHNldFBhcnRzLCBpbmRlbnQpO1xuICAgIH1cbiAgICBpZiAoaXNXZWFrTWFwKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHdlYWtDb2xsZWN0aW9uT2YoJ1dlYWtNYXAnKTtcbiAgICB9XG4gICAgaWYgKGlzV2Vha1NldChvYmopKSB7XG4gICAgICAgIHJldHVybiB3ZWFrQ29sbGVjdGlvbk9mKCdXZWFrU2V0Jyk7XG4gICAgfVxuICAgIGlmIChpc1dlYWtSZWYob2JqKSkge1xuICAgICAgICByZXR1cm4gd2Vha0NvbGxlY3Rpb25PZignV2Vha1JlZicpO1xuICAgIH1cbiAgICBpZiAoaXNOdW1iZXIob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QoTnVtYmVyKG9iaikpKTtcbiAgICB9XG4gICAgaWYgKGlzQmlnSW50KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG1hcmtCb3hlZChpbnNwZWN0KGJpZ0ludFZhbHVlT2YuY2FsbChvYmopKSk7XG4gICAgfVxuICAgIGlmIChpc0Jvb2xlYW4ob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGJvb2xlYW5WYWx1ZU9mLmNhbGwob2JqKSk7XG4gICAgfVxuICAgIGlmIChpc1N0cmluZyhvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoaW5zcGVjdChTdHJpbmcob2JqKSkpO1xuICAgIH1cbiAgICAvLyBub3RlOiBpbiBJRSA4LCBzb21ldGltZXMgYGdsb2JhbCAhPT0gd2luZG93YCBidXQgYm90aCBhcmUgdGhlIHByb3RvdHlwZXMgb2YgZWFjaCBvdGhlclxuICAgIC8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBvYmogPT09IHdpbmRvdykge1xuICAgICAgICByZXR1cm4gJ3sgW29iamVjdCBXaW5kb3ddIH0nO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqID09PSBnbG9iYWxUaGlzKVxuICAgICAgICB8fCAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqID09PSBnbG9iYWwpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiAneyBbb2JqZWN0IGdsb2JhbFRoaXNdIH0nO1xuICAgIH1cbiAgICBpZiAoIWlzRGF0ZShvYmopICYmICFpc1JlZ0V4cChvYmopKSB7XG4gICAgICAgIHZhciB5cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0KTtcbiAgICAgICAgdmFyIGlzUGxhaW5PYmplY3QgPSBnUE8gPyBnUE8ob2JqKSA9PT0gT2JqZWN0LnByb3RvdHlwZSA6IG9iaiBpbnN0YW5jZW9mIE9iamVjdCB8fCBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgICAgICAgdmFyIHByb3RvVGFnID0gb2JqIGluc3RhbmNlb2YgT2JqZWN0ID8gJycgOiAnbnVsbCBwcm90b3R5cGUnO1xuICAgICAgICB2YXIgc3RyaW5nVGFnID0gIWlzUGxhaW5PYmplY3QgJiYgdG9TdHJpbmdUYWcgJiYgT2JqZWN0KG9iaikgPT09IG9iaiAmJiB0b1N0cmluZ1RhZyBpbiBvYmogPyAkc2xpY2UuY2FsbCh0b1N0cihvYmopLCA4LCAtMSkgOiBwcm90b1RhZyA/ICdPYmplY3QnIDogJyc7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvclRhZyA9IGlzUGxhaW5PYmplY3QgfHwgdHlwZW9mIG9iai5jb25zdHJ1Y3RvciAhPT0gJ2Z1bmN0aW9uJyA/ICcnIDogb2JqLmNvbnN0cnVjdG9yLm5hbWUgPyBvYmouY29uc3RydWN0b3IubmFtZSArICcgJyA6ICcnO1xuICAgICAgICB2YXIgdGFnID0gY29uc3RydWN0b3JUYWcgKyAoc3RyaW5nVGFnIHx8IHByb3RvVGFnID8gJ1snICsgJGpvaW4uY2FsbCgkY29uY2F0LmNhbGwoW10sIHN0cmluZ1RhZyB8fCBbXSwgcHJvdG9UYWcgfHwgW10pLCAnOiAnKSArICddICcgOiAnJyk7XG4gICAgICAgIGlmICh5cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRhZyArICd7fSc7IH1cbiAgICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhZyArICd7JyArIGluZGVudGVkSm9pbih5cywgaW5kZW50KSArICd9JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFnICsgJ3sgJyArICRqb2luLmNhbGwoeXMsICcsICcpICsgJyB9JztcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhvYmopO1xufTtcblxuZnVuY3Rpb24gd3JhcFF1b3RlcyhzLCBkZWZhdWx0U3R5bGUsIG9wdHMpIHtcbiAgICB2YXIgc3R5bGUgPSBvcHRzLnF1b3RlU3R5bGUgfHwgZGVmYXVsdFN0eWxlO1xuICAgIHZhciBxdW90ZUNoYXIgPSBxdW90ZXNbc3R5bGVdO1xuICAgIHJldHVybiBxdW90ZUNoYXIgKyBzICsgcXVvdGVDaGFyO1xufVxuXG5mdW5jdGlvbiBxdW90ZShzKSB7XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoU3RyaW5nKHMpLCAvXCIvZywgJyZxdW90OycpO1xufVxuXG5mdW5jdGlvbiBjYW5UcnVzdFRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiAhdG9TdHJpbmdUYWcgfHwgISh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAodG9TdHJpbmdUYWcgaW4gb2JqIHx8IHR5cGVvZiBvYmpbdG9TdHJpbmdUYWddICE9PSAndW5kZWZpbmVkJykpO1xufVxuZnVuY3Rpb24gaXNBcnJheShvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7IHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBEYXRlXScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTsgfVxuZnVuY3Rpb24gaXNFcnJvcihvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEVycm9yXScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTsgfVxuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7IHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBOdW1iZXJdJyAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7IH1cbmZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJyAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7IH1cblxuLy8gU3ltYm9sIGFuZCBCaWdJbnQgZG8gaGF2ZSBTeW1ib2wudG9TdHJpbmdUYWcgYnkgc3BlYywgc28gdGhhdCBjYW4ndCBiZSB1c2VkIHRvIGVsaW1pbmF0ZSBmYWxzZSBwb3NpdGl2ZXNcbmZ1bmN0aW9uIGlzU3ltYm9sKG9iaikge1xuICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scykge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiBpbnN0YW5jZW9mIFN5bWJvbDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCAhc3ltVG9TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBzeW1Ub1N0cmluZy5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0JpZ0ludChvYmopIHtcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCAhYmlnSW50VmFsdWVPZikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGJpZ0ludFZhbHVlT2YuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgfHwgZnVuY3Rpb24gKGtleSkgeyByZXR1cm4ga2V5IGluIHRoaXM7IH07XG5mdW5jdGlvbiBoYXMob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufVxuXG5mdW5jdGlvbiB0b1N0cihvYmopIHtcbiAgICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbChvYmopO1xufVxuXG5mdW5jdGlvbiBuYW1lT2YoZikge1xuICAgIGlmIChmLm5hbWUpIHsgcmV0dXJuIGYubmFtZTsgfVxuICAgIHZhciBtID0gJG1hdGNoLmNhbGwoZnVuY3Rpb25Ub1N0cmluZy5jYWxsKGYpLCAvXmZ1bmN0aW9uXFxzKihbXFx3JF0rKS8pO1xuICAgIGlmIChtKSB7IHJldHVybiBtWzFdOyB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGluZGV4T2YoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgeyByZXR1cm4geHMuaW5kZXhPZih4KTsgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmICh4c1tpXSA9PT0geCkgeyByZXR1cm4gaTsgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGlzTWFwKHgpIHtcbiAgICBpZiAoIW1hcFNpemUgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgbWFwU2l6ZS5jYWxsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIE1hcDsgLy8gY29yZS1qcyB3b3JrYXJvdW5kLCBwcmUtdjIuNS4wXG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzV2Vha01hcCh4KSB7XG4gICAgaWYgKCF3ZWFrTWFwSGFzIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHdlYWtNYXBIYXMuY2FsbCh4LCB3ZWFrTWFwSGFzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgfSBjYXRjaCAocykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrTWFwOyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNXZWFrUmVmKHgpIHtcbiAgICBpZiAoIXdlYWtSZWZEZXJlZiB8fCAheCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICB3ZWFrUmVmRGVyZWYuY2FsbCh4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzU2V0KHgpIHtcbiAgICBpZiAoIXNldFNpemUgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbWFwU2l6ZS5jYWxsKHgpO1xuICAgICAgICB9IGNhdGNoIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFNldDsgLy8gY29yZS1qcyB3b3JrYXJvdW5kLCBwcmUtdjIuNS4wXG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzV2Vha1NldCh4KSB7XG4gICAgaWYgKCF3ZWFrU2V0SGFzIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdlYWtNYXBIYXMuY2FsbCh4LCB3ZWFrTWFwSGFzKTtcbiAgICAgICAgfSBjYXRjaCAocykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrU2V0OyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50KHgpIHtcbiAgICBpZiAoIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB4Lm5vZGVOYW1lID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgeC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGluc3BlY3RTdHJpbmcoc3RyLCBvcHRzKSB7XG4gICAgaWYgKHN0ci5sZW5ndGggPiBvcHRzLm1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gc3RyLmxlbmd0aCAtIG9wdHMubWF4U3RyaW5nTGVuZ3RoO1xuICAgICAgICB2YXIgdHJhaWxlciA9ICcuLi4gJyArIHJlbWFpbmluZyArICcgbW9yZSBjaGFyYWN0ZXInICsgKHJlbWFpbmluZyA+IDEgPyAncycgOiAnJyk7XG4gICAgICAgIHJldHVybiBpbnNwZWN0U3RyaW5nKCRzbGljZS5jYWxsKHN0ciwgMCwgb3B0cy5tYXhTdHJpbmdMZW5ndGgpLCBvcHRzKSArIHRyYWlsZXI7XG4gICAgfVxuICAgIHZhciBxdW90ZVJFID0gcXVvdGVSRXNbb3B0cy5xdW90ZVN0eWxlIHx8ICdzaW5nbGUnXTtcbiAgICBxdW90ZVJFLmxhc3RJbmRleCA9IDA7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgICB2YXIgcyA9ICRyZXBsYWNlLmNhbGwoJHJlcGxhY2UuY2FsbChzdHIsIHF1b3RlUkUsICdcXFxcJDEnKSwgL1tcXHgwMC1cXHgxZl0vZywgbG93Ynl0ZSk7XG4gICAgcmV0dXJuIHdyYXBRdW90ZXMocywgJ3NpbmdsZScsIG9wdHMpO1xufVxuXG5mdW5jdGlvbiBsb3dieXRlKGMpIHtcbiAgICB2YXIgbiA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgeCA9IHtcbiAgICAgICAgODogJ2InLFxuICAgICAgICA5OiAndCcsXG4gICAgICAgIDEwOiAnbicsXG4gICAgICAgIDEyOiAnZicsXG4gICAgICAgIDEzOiAncidcbiAgICB9W25dO1xuICAgIGlmICh4KSB7IHJldHVybiAnXFxcXCcgKyB4OyB9XG4gICAgcmV0dXJuICdcXFxceCcgKyAobiA8IDB4MTAgPyAnMCcgOiAnJykgKyAkdG9VcHBlckNhc2UuY2FsbChuLnRvU3RyaW5nKDE2KSk7XG59XG5cbmZ1bmN0aW9uIG1hcmtCb3hlZChzdHIpIHtcbiAgICByZXR1cm4gJ09iamVjdCgnICsgc3RyICsgJyknO1xufVxuXG5mdW5jdGlvbiB3ZWFrQ29sbGVjdGlvbk9mKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSArICcgeyA/IH0nO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0aW9uT2YodHlwZSwgc2l6ZSwgZW50cmllcywgaW5kZW50KSB7XG4gICAgdmFyIGpvaW5lZEVudHJpZXMgPSBpbmRlbnQgPyBpbmRlbnRlZEpvaW4oZW50cmllcywgaW5kZW50KSA6ICRqb2luLmNhbGwoZW50cmllcywgJywgJyk7XG4gICAgcmV0dXJuIHR5cGUgKyAnICgnICsgc2l6ZSArICcpIHsnICsgam9pbmVkRW50cmllcyArICd9Jztcbn1cblxuZnVuY3Rpb24gc2luZ2xlTGluZVZhbHVlcyh4cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGluZGV4T2YoeHNbaV0sICdcXG4nKSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGdldEluZGVudChvcHRzLCBkZXB0aCkge1xuICAgIHZhciBiYXNlSW5kZW50O1xuICAgIGlmIChvcHRzLmluZGVudCA9PT0gJ1xcdCcpIHtcbiAgICAgICAgYmFzZUluZGVudCA9ICdcXHQnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHMuaW5kZW50ID09PSAnbnVtYmVyJyAmJiBvcHRzLmluZGVudCA+IDApIHtcbiAgICAgICAgYmFzZUluZGVudCA9ICRqb2luLmNhbGwoQXJyYXkob3B0cy5pbmRlbnQgKyAxKSwgJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmFzZTogYmFzZUluZGVudCxcbiAgICAgICAgcHJldjogJGpvaW4uY2FsbChBcnJheShkZXB0aCArIDEpLCBiYXNlSW5kZW50KVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGluZGVudGVkSm9pbih4cywgaW5kZW50KSB7XG4gICAgaWYgKHhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cbiAgICB2YXIgbGluZUpvaW5lciA9ICdcXG4nICsgaW5kZW50LnByZXYgKyBpbmRlbnQuYmFzZTtcbiAgICByZXR1cm4gbGluZUpvaW5lciArICRqb2luLmNhbGwoeHMsICcsJyArIGxpbmVKb2luZXIpICsgJ1xcbicgKyBpbmRlbnQucHJldjtcbn1cblxuZnVuY3Rpb24gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KG9iaik7XG4gICAgdmFyIHhzID0gW107XG4gICAgaWYgKGlzQXJyKSB7XG4gICAgICAgIHhzLmxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4c1tpXSA9IGhhcyhvYmosIGkpID8gaW5zcGVjdChvYmpbaV0sIG9iaikgOiAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgc3ltcyA9IHR5cGVvZiBnT1BTID09PSAnZnVuY3Rpb24nID8gZ09QUyhvYmopIDogW107XG4gICAgdmFyIHN5bU1hcDtcbiAgICBpZiAoaGFzU2hhbW1lZFN5bWJvbHMpIHtcbiAgICAgICAgc3ltTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3ltcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgc3ltTWFwWyckJyArIHN5bXNba11dID0gc3ltc1trXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICBpZiAoIWhhcyhvYmosIGtleSkpIHsgY29udGludWU7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheCwgbm8tY29udGludWVcbiAgICAgICAgaWYgKGlzQXJyICYmIFN0cmluZyhOdW1iZXIoa2V5KSkgPT09IGtleSAmJiBrZXkgPCBvYmoubGVuZ3RoKSB7IGNvbnRpbnVlOyB9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXgsIG5vLWNvbnRpbnVlXG4gICAgICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scyAmJiBzeW1NYXBbJyQnICsga2V5XSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0byBwcmV2ZW50IHNoYW1tZWQgU3ltYm9scywgd2hpY2ggYXJlIHN0b3JlZCBhcyBzdHJpbmdzLCBmcm9tIGJlaW5nIGluY2x1ZGVkIGluIHRoZSBzdHJpbmcga2V5IHNlY3Rpb25cbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4LCBuby1jb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKCR0ZXN0LmNhbGwoL1teXFx3JF0vLCBrZXkpKSB7XG4gICAgICAgICAgICB4cy5wdXNoKGluc3BlY3Qoa2V5LCBvYmopICsgJzogJyArIGluc3BlY3Qob2JqW2tleV0sIG9iaikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeHMucHVzaChrZXkgKyAnOiAnICsgaW5zcGVjdChvYmpba2V5XSwgb2JqKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnT1BTID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3ltcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGlzRW51bWVyYWJsZS5jYWxsKG9iaiwgc3ltc1tqXSkpIHtcbiAgICAgICAgICAgICAgICB4cy5wdXNoKCdbJyArIGluc3BlY3Qoc3ltc1tqXSkgKyAnXTogJyArIGluc3BlY3Qob2JqW3N5bXNbal1dLCBvYmopKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geHM7XG59XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJ29iamVjdC1pbnNwZWN0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcblxuLypcbiogVGhpcyBmdW5jdGlvbiB0cmF2ZXJzZXMgdGhlIGxpc3QgcmV0dXJuaW5nIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGtleS5cbipcbiogVGhhdCBub2RlIGlzIGFsc28gbW92ZWQgdG8gdGhlIGhlYWQgb2YgdGhlIGxpc3QsIHNvIHRoYXQgaWYgaXQncyBhY2Nlc3NlZCBhZ2FpbiB3ZSBkb24ndCBuZWVkIHRvIHRyYXZlcnNlIHRoZSB3aG9sZSBsaXN0LlxuKiBCeSBkb2luZyBzbywgYWxsIHRoZSByZWNlbnRseSB1c2VkIG5vZGVzIGNhbiBiZSBhY2Nlc3NlZCByZWxhdGl2ZWx5IHF1aWNrbHkuXG4qL1xuLyoqIEB0eXBlIHtpbXBvcnQoJy4vbGlzdC5kLnRzJykubGlzdEdldE5vZGV9ICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbnZhciBsaXN0R2V0Tm9kZSA9IGZ1bmN0aW9uIChsaXN0LCBrZXksIGlzRGVsZXRlKSB7XG5cdC8qKiBAdHlwZSB7dHlwZW9mIGxpc3QgfCBOb25OdWxsYWJsZTwodHlwZW9mIGxpc3QpWyduZXh0J10+fSAqL1xuXHR2YXIgcHJldiA9IGxpc3Q7XG5cdC8qKiBAdHlwZSB7KHR5cGVvZiBsaXN0KVsnbmV4dCddfSAqL1xuXHR2YXIgY3Vycjtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRmb3IgKDsgKGN1cnIgPSBwcmV2Lm5leHQpICE9IG51bGw7IHByZXYgPSBjdXJyKSB7XG5cdFx0aWYgKGN1cnIua2V5ID09PSBrZXkpIHtcblx0XHRcdHByZXYubmV4dCA9IGN1cnIubmV4dDtcblx0XHRcdGlmICghaXNEZWxldGUpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVuc1xuXHRcdFx0XHRjdXJyLm5leHQgPSAvKiogQHR5cGUge05vbk51bGxhYmxlPHR5cGVvZiBsaXN0Lm5leHQ+fSAqLyAobGlzdC5uZXh0KTtcblx0XHRcdFx0bGlzdC5uZXh0ID0gY3VycjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnI7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5saXN0R2V0fSAqL1xudmFyIGxpc3RHZXQgPSBmdW5jdGlvbiAob2JqZWN0cywga2V5KSB7XG5cdGlmICghb2JqZWN0cykge1xuXHRcdHJldHVybiB2b2lkIHVuZGVmaW5lZDtcblx0fVxuXHR2YXIgbm9kZSA9IGxpc3RHZXROb2RlKG9iamVjdHMsIGtleSk7XG5cdHJldHVybiBub2RlICYmIG5vZGUudmFsdWU7XG59O1xuLyoqIEB0eXBlIHtpbXBvcnQoJy4vbGlzdC5kLnRzJykubGlzdFNldH0gKi9cbnZhciBsaXN0U2V0ID0gZnVuY3Rpb24gKG9iamVjdHMsIGtleSwgdmFsdWUpIHtcblx0dmFyIG5vZGUgPSBsaXN0R2V0Tm9kZShvYmplY3RzLCBrZXkpO1xuXHRpZiAobm9kZSkge1xuXHRcdG5vZGUudmFsdWUgPSB2YWx1ZTtcblx0fSBlbHNlIHtcblx0XHQvLyBQcmVwZW5kIHRoZSBuZXcgbm9kZSB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0XG5cdFx0b2JqZWN0cy5uZXh0ID0gLyoqIEB0eXBlIHtpbXBvcnQoJy4vbGlzdC5kLnRzJykuTGlzdE5vZGU8dHlwZW9mIHZhbHVlLCB0eXBlb2Yga2V5Pn0gKi8gKHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnbiwgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRrZXk6IGtleSxcblx0XHRcdG5leHQ6IG9iamVjdHMubmV4dCxcblx0XHRcdHZhbHVlOiB2YWx1ZVxuXHRcdH0pO1xuXHR9XG59O1xuLyoqIEB0eXBlIHtpbXBvcnQoJy4vbGlzdC5kLnRzJykubGlzdEhhc30gKi9cbnZhciBsaXN0SGFzID0gZnVuY3Rpb24gKG9iamVjdHMsIGtleSkge1xuXHRpZiAoIW9iamVjdHMpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuICEhbGlzdEdldE5vZGUob2JqZWN0cywga2V5KTtcbn07XG4vKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5saXN0RGVsZXRlfSAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG52YXIgbGlzdERlbGV0ZSA9IGZ1bmN0aW9uIChvYmplY3RzLCBrZXkpIHtcblx0aWYgKG9iamVjdHMpIHtcblx0XHRyZXR1cm4gbGlzdEdldE5vZGUob2JqZWN0cywga2V5LCB0cnVlKTtcblx0fVxufTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U2lkZUNoYW5uZWxMaXN0KCkge1xuXHQvKiogQHR5cGVkZWYge1JldHVyblR5cGU8dHlwZW9mIGdldFNpZGVDaGFubmVsTGlzdD59IENoYW5uZWwgKi9cblx0LyoqIEB0eXBlZGVmIHtQYXJhbWV0ZXJzPENoYW5uZWxbJ2dldCddPlswXX0gSyAqL1xuXHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnc2V0J10+WzFdfSBWICovXG5cblx0LyoqIEB0eXBlIHtpbXBvcnQoJy4vbGlzdC5kLnRzJykuUm9vdE5vZGU8ViwgSz4gfCB1bmRlZmluZWR9ICovIHZhciAkbztcblxuXHQvKiogQHR5cGUge0NoYW5uZWx9ICovXG5cdHZhciBjaGFubmVsID0ge1xuXHRcdGFzc2VydDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0aWYgKCFjaGFubmVsLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdTaWRlIGNoYW5uZWwgZG9lcyBub3QgY29udGFpbiAnICsgaW5zcGVjdChrZXkpKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHR2YXIgZGVsZXRlZE5vZGUgPSBsaXN0RGVsZXRlKCRvLCBrZXkpO1xuXHRcdFx0aWYgKGRlbGV0ZWROb2RlICYmICRvICYmICEkby5uZXh0KSB7XG5cdFx0XHRcdCRvID0gdm9pZCB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gISFkZWxldGVkTm9kZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGxpc3RHZXQoJG8sIGtleSk7XG5cdFx0fSxcblx0XHRoYXM6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBsaXN0SGFzKCRvLCBrZXkpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0aWYgKCEkbykge1xuXHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBsaW5rZWQgbGlzdCBhcyBhbiBlbXB0eSBub2RlLCBzbyB0aGF0IHdlIGRvbid0IGhhdmUgdG8gc3BlY2lhbC1jYXNlIGhhbmRsaW5nIG9mIHRoZSBmaXJzdCBub2RlOiB3ZSBjYW4gYWx3YXlzIHJlZmVyIHRvIGl0IGFzIChwcmV2aW91cyBub2RlKS5uZXh0LCBpbnN0ZWFkIG9mIHNvbWV0aGluZyBsaWtlIChsaXN0KS5oZWFkXG5cdFx0XHRcdCRvID0ge1xuXHRcdFx0XHRcdG5leHQ6IHZvaWQgdW5kZWZpbmVkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRsaXN0U2V0KC8qKiBAdHlwZSB7Tm9uTnVsbGFibGU8dHlwZW9mICRvPn0gKi8gKCRvKSwga2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gY2hhbm5lbDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Q7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2V2YWwnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gRXZhbEVycm9yO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vcmFuZ2UnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gUmFuZ2VFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3JlZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBSZWZlcmVuY2VFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3N5bnRheCcpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBTeW50YXhFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3VyaScpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBVUklFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2FicycpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBNYXRoLmFicztcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2Zsb29yJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGguZmxvb3I7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9tYXgnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5tYXg7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9taW4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5taW47XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9wb3cnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5wb3c7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9yb3VuZCcpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBNYXRoLnJvdW5kO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vaXNOYU4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIGlzTmFOKGEpIHtcblx0cmV0dXJuIGEgIT09IGE7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyICRpc05hTiA9IHJlcXVpcmUoJy4vaXNOYU4nKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vc2lnbicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaWduKG51bWJlcikge1xuXHRpZiAoJGlzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG5cdFx0cmV0dXJuIG51bWJlcjtcblx0fVxuXHRyZXR1cm4gbnVtYmVyIDwgMCA/IC0xIDogKzE7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZ09QRCcpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbnZhciAkZ09QRCA9IHJlcXVpcmUoJy4vZ09QRCcpO1xuXG5pZiAoJGdPUEQpIHtcblx0dHJ5IHtcblx0XHQkZ09QRChbXSwgJ2xlbmd0aCcpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gSUUgOCBoYXMgYSBicm9rZW4gZ09QRFxuXHRcdCRnT1BEID0gbnVsbDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICRnT1BEO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZmFsc2U7XG5pZiAoJGRlZmluZVByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0JGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgdmFsdWU6IDEgfSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBJRSA4IGhhcyBhIGJyb2tlbiBkZWZpbmVQcm9wZXJ0eVxuXHRcdCRkZWZpbmVQcm9wZXJ0eSA9IGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gJGRlZmluZVByb3BlcnR5O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vc2hhbXMnKX0gKi9cbi8qIGVzbGludCBjb21wbGV4aXR5OiBbMiwgMThdLCBtYXgtc3RhdGVtZW50czogWzIsIDMzXSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNTeW1ib2xzKCkge1xuXHRpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdzeW1ib2wnKSB7IHJldHVybiB0cnVlOyB9XG5cblx0LyoqIEB0eXBlIHt7IFtrIGluIHN5bWJvbF0/OiB1bmtub3duIH19ICovXG5cdHZhciBvYmogPSB7fTtcblx0dmFyIHN5bSA9IFN5bWJvbCgndGVzdCcpO1xuXHR2YXIgc3ltT2JqID0gT2JqZWN0KHN5bSk7XG5cdGlmICh0eXBlb2Ygc3ltID09PSAnc3RyaW5nJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN5bSkgIT09ICdbb2JqZWN0IFN5bWJvbF0nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN5bU9iaikgIT09ICdbb2JqZWN0IFN5bWJvbF0nKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdC8vIHRlbXAgZGlzYWJsZWQgcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvb2JqZWN0LmFzc2lnbi9pc3N1ZXMvMTdcblx0Ly8gaWYgKHN5bSBpbnN0YW5jZW9mIFN5bWJvbCkgeyByZXR1cm4gZmFsc2U7IH1cblx0Ly8gdGVtcCBkaXNhYmxlZCBwZXIgaHR0cHM6Ly9naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzL2lzc3Vlcy80XG5cdC8vIGlmICghKHN5bU9iaiBpbnN0YW5jZW9mIFN5bWJvbCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0Ly8gaWYgKHR5cGVvZiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHQvLyBpZiAoU3RyaW5nKHN5bSkgIT09IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW0pKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdHZhciBzeW1WYWwgPSA0Mjtcblx0b2JqW3N5bV0gPSBzeW1WYWw7XG5cdGZvciAodmFyIF8gaW4gb2JqKSB7IHJldHVybiBmYWxzZTsgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4LCBuby11bnJlYWNoYWJsZS1sb29wXG5cdGlmICh0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9PT0gJ2Z1bmN0aW9uJyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHR2YXIgc3ltcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKTtcblx0aWYgKHN5bXMubGVuZ3RoICE9PSAxIHx8IHN5bXNbMF0gIT09IHN5bSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmosIHN5bSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVuc1xuXHRcdHZhciBkZXNjcmlwdG9yID0gLyoqIEB0eXBlIHtQcm9wZXJ0eURlc2NyaXB0b3J9ICovIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgc3ltKSk7XG5cdFx0aWYgKGRlc2NyaXB0b3IudmFsdWUgIT09IHN5bVZhbCB8fCBkZXNjcmlwdG9yLmVudW1lcmFibGUgIT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb3JpZ1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbDtcbnZhciBoYXNTeW1ib2xTaGFtID0gcmVxdWlyZSgnLi9zaGFtcycpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNOYXRpdmVTeW1ib2xzKCkge1xuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2wgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2woJ2ZvbycpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2woJ2JhcicpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRyZXR1cm4gaGFzU3ltYm9sU2hhbSgpO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKSB8fCBudWxsO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyICRPYmplY3QgPSByZXF1aXJlKCdlcy1vYmplY3QtYXRvbXMnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vT2JqZWN0LmdldFByb3RvdHlwZU9mJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgbnVsbDtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludCBuby1pbnZhbGlkLXRoaXM6IDEgKi9cblxudmFyIEVSUk9SX01FU1NBR0UgPSAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnO1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBmdW5jVHlwZSA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbnZhciBjb25jYXR0eSA9IGZ1bmN0aW9uIGNvbmNhdHR5KGEsIGIpIHtcbiAgICB2YXIgYXJyID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyW2ldID0gYVtpXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBiLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGFycltqICsgYS5sZW5ndGhdID0gYltqXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xufTtcblxudmFyIHNsaWN5ID0gZnVuY3Rpb24gc2xpY3koYXJyTGlrZSwgb2Zmc2V0KSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSBvZmZzZXQgfHwgMCwgaiA9IDA7IGkgPCBhcnJMaWtlLmxlbmd0aDsgaSArPSAxLCBqICs9IDEpIHtcbiAgICAgICAgYXJyW2pdID0gYXJyTGlrZVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn07XG5cbnZhciBqb2lueSA9IGZ1bmN0aW9uIChhcnIsIGpvaW5lcikge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gYXJyW2ldO1xuICAgICAgICBpZiAoaSArIDEgPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHIgKz0gam9pbmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQodGhhdCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nIHx8IHRvU3RyLmFwcGx5KHRhcmdldCkgIT09IGZ1bmNUeXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJST1JfTUVTU0FHRSArIHRhcmdldCk7XG4gICAgfVxuICAgIHZhciBhcmdzID0gc2xpY3koYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBib3VuZDtcbiAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgY29uY2F0dHkoYXJncywgYXJndW1lbnRzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgY29uY2F0dHkoYXJncywgYXJndW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgfTtcblxuICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm91bmRBcmdzW2ldID0gJyQnICsgaTtcbiAgICB9XG5cbiAgICBib3VuZCA9IEZ1bmN0aW9uKCdiaW5kZXInLCAncmV0dXJuIGZ1bmN0aW9uICgnICsgam9pbnkoYm91bmRBcmdzLCAnLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgIGlmICh0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBib3VuZDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgfHwgaW1wbGVtZW50YXRpb247XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9mdW5jdGlvbkNhbGwnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9mdW5jdGlvbkFwcGx5Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3JlZmxlY3RBcHBseScpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgUmVmbGVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgUmVmbGVjdCAmJiBSZWZsZWN0LmFwcGx5O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG5cbnZhciAkYXBwbHkgPSByZXF1aXJlKCcuL2Z1bmN0aW9uQXBwbHknKTtcbnZhciAkY2FsbCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25DYWxsJyk7XG52YXIgJHJlZmxlY3RBcHBseSA9IHJlcXVpcmUoJy4vcmVmbGVjdEFwcGx5Jyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2FjdHVhbEFwcGx5Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9ICRyZWZsZWN0QXBwbHkgfHwgYmluZC5jYWxsKCRjYWxsLCAkYXBwbHkpO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgJFR5cGVFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy90eXBlJyk7XG5cbnZhciAkY2FsbCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25DYWxsJyk7XG52YXIgJGFjdHVhbEFwcGx5ID0gcmVxdWlyZSgnLi9hY3R1YWxBcHBseScpO1xuXG4vKiogQHR5cGUgeyhhcmdzOiBbRnVuY3Rpb24sIHRoaXNBcmc/OiB1bmtub3duLCAuLi5hcmdzOiB1bmtub3duW11dKSA9PiBGdW5jdGlvbn0gVE9ETyBGSVhNRSwgZmluZCBhIHdheSB0byB1c2UgaW1wb3J0KCcuJykgKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEJpbmRCYXNpYyhhcmdzKSB7XG5cdGlmIChhcmdzLmxlbmd0aCA8IDEgfHwgdHlwZW9mIGFyZ3NbMF0gIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYSBmdW5jdGlvbiBpcyByZXF1aXJlZCcpO1xuXHR9XG5cdHJldHVybiAkYWN0dWFsQXBwbHkoYmluZCwgJGNhbGwsIGFyZ3MpO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsQmluZCA9IHJlcXVpcmUoJ2NhbGwtYmluZC1hcHBseS1oZWxwZXJzJyk7XG52YXIgZ09QRCA9IHJlcXVpcmUoJ2dvcGQnKTtcblxudmFyIGhhc1Byb3RvQWNjZXNzb3I7XG50cnkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zLCBuby1wcm90b1xuXHRoYXNQcm90b0FjY2Vzc29yID0gLyoqIEB0eXBlIHt7IF9fcHJvdG9fXz86IHR5cGVvZiBBcnJheS5wcm90b3R5cGUgfX0gKi8gKFtdKS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZTtcbn0gY2F0Y2ggKGUpIHtcblx0aWYgKCFlIHx8IHR5cGVvZiBlICE9PSAnb2JqZWN0JyB8fCAhKCdjb2RlJyBpbiBlKSB8fCBlLmNvZGUgIT09ICdFUlJfUFJPVE9fQUNDRVNTJykge1xuXHRcdHRocm93IGU7XG5cdH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVuc1xudmFyIGRlc2MgPSAhIWhhc1Byb3RvQWNjZXNzb3IgJiYgZ09QRCAmJiBnT1BEKE9iamVjdC5wcm90b3R5cGUsIC8qKiBAdHlwZSB7a2V5b2YgdHlwZW9mIE9iamVjdC5wcm90b3R5cGV9ICovICgnX19wcm90b19fJykpO1xuXG52YXIgJE9iamVjdCA9IE9iamVjdDtcbnZhciAkZ2V0UHJvdG90eXBlT2YgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9nZXQnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gZGVzYyAmJiB0eXBlb2YgZGVzYy5nZXQgPT09ICdmdW5jdGlvbidcblx0PyBjYWxsQmluZChbZGVzYy5nZXRdKVxuXHQ6IHR5cGVvZiAkZ2V0UHJvdG90eXBlT2YgPT09ICdmdW5jdGlvbidcblx0XHQ/IC8qKiBAdHlwZSB7aW1wb3J0KCcuL2dldCcpfSAqLyBmdW5jdGlvbiBnZXREdW5kZXIodmFsdWUpIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdHJldHVybiAkZ2V0UHJvdG90eXBlT2YodmFsdWUgPT0gbnVsbCA/IHZhbHVlIDogJE9iamVjdCh2YWx1ZSkpO1xuXHRcdH1cblx0XHQ6IGZhbHNlO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHJlZmxlY3RHZXRQcm90byA9IHJlcXVpcmUoJy4vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpO1xudmFyIG9yaWdpbmFsR2V0UHJvdG8gPSByZXF1aXJlKCcuL09iamVjdC5nZXRQcm90b3R5cGVPZicpO1xuXG52YXIgZ2V0RHVuZGVyUHJvdG8gPSByZXF1aXJlKCdkdW5kZXItcHJvdG8vZ2V0Jyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlZmxlY3RHZXRQcm90b1xuXHQ/IGZ1bmN0aW9uIGdldFByb3RvKE8pIHtcblx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRyZXR1cm4gcmVmbGVjdEdldFByb3RvKE8pO1xuXHR9XG5cdDogb3JpZ2luYWxHZXRQcm90b1xuXHRcdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xuXHRcdFx0aWYgKCFPIHx8ICh0eXBlb2YgTyAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIE8gIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2dldFByb3RvOiBub3QgYW4gb2JqZWN0Jyk7XG5cdFx0XHR9XG5cdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRcdHJldHVybiBvcmlnaW5hbEdldFByb3RvKE8pO1xuXHRcdH1cblx0XHQ6IGdldER1bmRlclByb3RvXG5cdFx0XHQ/IGZ1bmN0aW9uIGdldFByb3RvKE8pIHtcblx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXG5cdFx0XHRcdHJldHVybiBnZXREdW5kZXJQcm90byhPKTtcblx0XHRcdH1cblx0XHRcdDogbnVsbDtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgJGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gYmluZC5jYWxsKGNhbGwsICRoYXNPd24pO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHVuZGVmaW5lZDtcblxudmFyICRPYmplY3QgPSByZXF1aXJlKCdlcy1vYmplY3QtYXRvbXMnKTtcblxudmFyICRFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycycpO1xudmFyICRFdmFsRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvZXZhbCcpO1xudmFyICRSYW5nZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3JhbmdlJyk7XG52YXIgJFJlZmVyZW5jZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3JlZicpO1xudmFyICRTeW50YXhFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy9zeW50YXgnKTtcbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcbnZhciAkVVJJRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdXJpJyk7XG5cbnZhciBhYnMgPSByZXF1aXJlKCdtYXRoLWludHJpbnNpY3MvYWJzJyk7XG52YXIgZmxvb3IgPSByZXF1aXJlKCdtYXRoLWludHJpbnNpY3MvZmxvb3InKTtcbnZhciBtYXggPSByZXF1aXJlKCdtYXRoLWludHJpbnNpY3MvbWF4Jyk7XG52YXIgbWluID0gcmVxdWlyZSgnbWF0aC1pbnRyaW5zaWNzL21pbicpO1xudmFyIHBvdyA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9wb3cnKTtcbnZhciByb3VuZCA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9yb3VuZCcpO1xudmFyIHNpZ24gPSByZXF1aXJlKCdtYXRoLWludHJpbnNpY3Mvc2lnbicpO1xuXG52YXIgJEZ1bmN0aW9uID0gRnVuY3Rpb247XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxudmFyIGdldEV2YWxsZWRDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIChleHByZXNzaW9uU3ludGF4KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuICRGdW5jdGlvbignXCJ1c2Ugc3RyaWN0XCI7IHJldHVybiAoJyArIGV4cHJlc3Npb25TeW50YXggKyAnKS5jb25zdHJ1Y3RvcjsnKSgpO1xuXHR9IGNhdGNoIChlKSB7fVxufTtcblxudmFyICRnT1BEID0gcmVxdWlyZSgnZ29wZCcpO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJ2VzLWRlZmluZS1wcm9wZXJ0eScpO1xuXG52YXIgdGhyb3dUeXBlRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG5cdHRocm93IG5ldyAkVHlwZUVycm9yKCk7XG59O1xudmFyIFRocm93VHlwZUVycm9yID0gJGdPUERcblx0PyAoZnVuY3Rpb24gKCkge1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zLCBuby1jYWxsZXIsIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllc1xuXHRcdFx0YXJndW1lbnRzLmNhbGxlZTsgLy8gSUUgOCBkb2VzIG5vdCB0aHJvdyBoZXJlXG5cdFx0XHRyZXR1cm4gdGhyb3dUeXBlRXJyb3I7XG5cdFx0fSBjYXRjaCAoY2FsbGVlVGhyb3dzKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBJRSA4IHRocm93cyBvbiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGFyZ3VtZW50cywgJycpXG5cdFx0XHRcdHJldHVybiAkZ09QRChhcmd1bWVudHMsICdjYWxsZWUnKS5nZXQ7XG5cdFx0XHR9IGNhdGNoIChnT1BEdGhyb3dzKSB7XG5cdFx0XHRcdHJldHVybiB0aHJvd1R5cGVFcnJvcjtcblx0XHRcdH1cblx0XHR9XG5cdH0oKSlcblx0OiB0aHJvd1R5cGVFcnJvcjtcblxudmFyIGhhc1N5bWJvbHMgPSByZXF1aXJlKCdoYXMtc3ltYm9scycpKCk7XG5cbnZhciBnZXRQcm90byA9IHJlcXVpcmUoJ2dldC1wcm90bycpO1xudmFyICRPYmplY3RHUE8gPSByZXF1aXJlKCdnZXQtcHJvdG8vT2JqZWN0LmdldFByb3RvdHlwZU9mJyk7XG52YXIgJFJlZmxlY3RHUE8gPSByZXF1aXJlKCdnZXQtcHJvdG8vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpO1xuXG52YXIgJGFwcGx5ID0gcmVxdWlyZSgnY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMvZnVuY3Rpb25BcHBseScpO1xudmFyICRjYWxsID0gcmVxdWlyZSgnY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMvZnVuY3Rpb25DYWxsJyk7XG5cbnZhciBuZWVkc0V2YWwgPSB7fTtcblxudmFyIFR5cGVkQXJyYXkgPSB0eXBlb2YgVWludDhBcnJheSA9PT0gJ3VuZGVmaW5lZCcgfHwgIWdldFByb3RvID8gdW5kZWZpbmVkIDogZ2V0UHJvdG8oVWludDhBcnJheSk7XG5cbnZhciBJTlRSSU5TSUNTID0ge1xuXHRfX3Byb3RvX186IG51bGwsXG5cdCclQWdncmVnYXRlRXJyb3IlJzogdHlwZW9mIEFnZ3JlZ2F0ZUVycm9yID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEFnZ3JlZ2F0ZUVycm9yLFxuXHQnJUFycmF5JSc6IEFycmF5LFxuXHQnJUFycmF5QnVmZmVyJSc6IHR5cGVvZiBBcnJheUJ1ZmZlciA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBBcnJheUJ1ZmZlcixcblx0JyVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJSc6IGhhc1N5bWJvbHMgJiYgZ2V0UHJvdG8gPyBnZXRQcm90byhbXVtTeW1ib2wuaXRlcmF0b3JdKCkpIDogdW5kZWZpbmVkLFxuXHQnJUFzeW5jRnJvbVN5bmNJdGVyYXRvclByb3RvdHlwZSUnOiB1bmRlZmluZWQsXG5cdCclQXN5bmNGdW5jdGlvbiUnOiBuZWVkc0V2YWwsXG5cdCclQXN5bmNHZW5lcmF0b3IlJzogbmVlZHNFdmFsLFxuXHQnJUFzeW5jR2VuZXJhdG9yRnVuY3Rpb24lJzogbmVlZHNFdmFsLFxuXHQnJUFzeW5jSXRlcmF0b3JQcm90b3R5cGUlJzogbmVlZHNFdmFsLFxuXHQnJUF0b21pY3MlJzogdHlwZW9mIEF0b21pY3MgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQXRvbWljcyxcblx0JyVCaWdJbnQlJzogdHlwZW9mIEJpZ0ludCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBCaWdJbnQsXG5cdCclQmlnSW50NjRBcnJheSUnOiB0eXBlb2YgQmlnSW50NjRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBCaWdJbnQ2NEFycmF5LFxuXHQnJUJpZ1VpbnQ2NEFycmF5JSc6IHR5cGVvZiBCaWdVaW50NjRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBCaWdVaW50NjRBcnJheSxcblx0JyVCb29sZWFuJSc6IEJvb2xlYW4sXG5cdCclRGF0YVZpZXclJzogdHlwZW9mIERhdGFWaWV3ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IERhdGFWaWV3LFxuXHQnJURhdGUlJzogRGF0ZSxcblx0JyVkZWNvZGVVUkklJzogZGVjb2RlVVJJLFxuXHQnJWRlY29kZVVSSUNvbXBvbmVudCUnOiBkZWNvZGVVUklDb21wb25lbnQsXG5cdCclZW5jb2RlVVJJJSc6IGVuY29kZVVSSSxcblx0JyVlbmNvZGVVUklDb21wb25lbnQlJzogZW5jb2RlVVJJQ29tcG9uZW50LFxuXHQnJUVycm9yJSc6ICRFcnJvcixcblx0JyVldmFsJSc6IGV2YWwsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXZhbFxuXHQnJUV2YWxFcnJvciUnOiAkRXZhbEVycm9yLFxuXHQnJUZsb2F0MTZBcnJheSUnOiB0eXBlb2YgRmxvYXQxNkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEZsb2F0MTZBcnJheSxcblx0JyVGbG9hdDMyQXJyYXklJzogdHlwZW9mIEZsb2F0MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGbG9hdDMyQXJyYXksXG5cdCclRmxvYXQ2NEFycmF5JSc6IHR5cGVvZiBGbG9hdDY0QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogRmxvYXQ2NEFycmF5LFxuXHQnJUZpbmFsaXphdGlvblJlZ2lzdHJ5JSc6IHR5cGVvZiBGaW5hbGl6YXRpb25SZWdpc3RyeSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGaW5hbGl6YXRpb25SZWdpc3RyeSxcblx0JyVGdW5jdGlvbiUnOiAkRnVuY3Rpb24sXG5cdCclR2VuZXJhdG9yRnVuY3Rpb24lJzogbmVlZHNFdmFsLFxuXHQnJUludDhBcnJheSUnOiB0eXBlb2YgSW50OEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDhBcnJheSxcblx0JyVJbnQxNkFycmF5JSc6IHR5cGVvZiBJbnQxNkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDE2QXJyYXksXG5cdCclSW50MzJBcnJheSUnOiB0eXBlb2YgSW50MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBJbnQzMkFycmF5LFxuXHQnJWlzRmluaXRlJSc6IGlzRmluaXRlLFxuXHQnJWlzTmFOJSc6IGlzTmFOLFxuXHQnJUl0ZXJhdG9yUHJvdG90eXBlJSc6IGhhc1N5bWJvbHMgJiYgZ2V0UHJvdG8gPyBnZXRQcm90byhnZXRQcm90byhbXVtTeW1ib2wuaXRlcmF0b3JdKCkpKSA6IHVuZGVmaW5lZCxcblx0JyVKU09OJSc6IHR5cGVvZiBKU09OID09PSAnb2JqZWN0JyA/IEpTT04gOiB1bmRlZmluZWQsXG5cdCclTWFwJSc6IHR5cGVvZiBNYXAgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogTWFwLFxuXHQnJU1hcEl0ZXJhdG9yUHJvdG90eXBlJSc6IHR5cGVvZiBNYXAgPT09ICd1bmRlZmluZWQnIHx8ICFoYXNTeW1ib2xzIHx8ICFnZXRQcm90byA/IHVuZGVmaW5lZCA6IGdldFByb3RvKG5ldyBNYXAoKVtTeW1ib2wuaXRlcmF0b3JdKCkpLFxuXHQnJU1hdGglJzogTWF0aCxcblx0JyVOdW1iZXIlJzogTnVtYmVyLFxuXHQnJU9iamVjdCUnOiAkT2JqZWN0LFxuXHQnJU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IlJzogJGdPUEQsXG5cdCclcGFyc2VGbG9hdCUnOiBwYXJzZUZsb2F0LFxuXHQnJXBhcnNlSW50JSc6IHBhcnNlSW50LFxuXHQnJVByb21pc2UlJzogdHlwZW9mIFByb21pc2UgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogUHJvbWlzZSxcblx0JyVQcm94eSUnOiB0eXBlb2YgUHJveHkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogUHJveHksXG5cdCclUmFuZ2VFcnJvciUnOiAkUmFuZ2VFcnJvcixcblx0JyVSZWZlcmVuY2VFcnJvciUnOiAkUmVmZXJlbmNlRXJyb3IsXG5cdCclUmVmbGVjdCUnOiB0eXBlb2YgUmVmbGVjdCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBSZWZsZWN0LFxuXHQnJVJlZ0V4cCUnOiBSZWdFeHAsXG5cdCclU2V0JSc6IHR5cGVvZiBTZXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogU2V0LFxuXHQnJVNldEl0ZXJhdG9yUHJvdG90eXBlJSc6IHR5cGVvZiBTZXQgPT09ICd1bmRlZmluZWQnIHx8ICFoYXNTeW1ib2xzIHx8ICFnZXRQcm90byA/IHVuZGVmaW5lZCA6IGdldFByb3RvKG5ldyBTZXQoKVtTeW1ib2wuaXRlcmF0b3JdKCkpLFxuXHQnJVNoYXJlZEFycmF5QnVmZmVyJSc6IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBTaGFyZWRBcnJheUJ1ZmZlcixcblx0JyVTdHJpbmclJzogU3RyaW5nLFxuXHQnJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJSc6IGhhc1N5bWJvbHMgJiYgZ2V0UHJvdG8gPyBnZXRQcm90bygnJ1tTeW1ib2wuaXRlcmF0b3JdKCkpIDogdW5kZWZpbmVkLFxuXHQnJVN5bWJvbCUnOiBoYXNTeW1ib2xzID8gU3ltYm9sIDogdW5kZWZpbmVkLFxuXHQnJVN5bnRheEVycm9yJSc6ICRTeW50YXhFcnJvcixcblx0JyVUaHJvd1R5cGVFcnJvciUnOiBUaHJvd1R5cGVFcnJvcixcblx0JyVUeXBlZEFycmF5JSc6IFR5cGVkQXJyYXksXG5cdCclVHlwZUVycm9yJSc6ICRUeXBlRXJyb3IsXG5cdCclVWludDhBcnJheSUnOiB0eXBlb2YgVWludDhBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50OEFycmF5LFxuXHQnJVVpbnQ4Q2xhbXBlZEFycmF5JSc6IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50OENsYW1wZWRBcnJheSxcblx0JyVVaW50MTZBcnJheSUnOiB0eXBlb2YgVWludDE2QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogVWludDE2QXJyYXksXG5cdCclVWludDMyQXJyYXklJzogdHlwZW9mIFVpbnQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFVpbnQzMkFycmF5LFxuXHQnJVVSSUVycm9yJSc6ICRVUklFcnJvcixcblx0JyVXZWFrTWFwJSc6IHR5cGVvZiBXZWFrTWFwID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFdlYWtNYXAsXG5cdCclV2Vha1JlZiUnOiB0eXBlb2YgV2Vha1JlZiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBXZWFrUmVmLFxuXHQnJVdlYWtTZXQlJzogdHlwZW9mIFdlYWtTZXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogV2Vha1NldCxcblxuXHQnJUZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsJSc6ICRjYWxsLFxuXHQnJUZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseSUnOiAkYXBwbHksXG5cdCclT2JqZWN0LmRlZmluZVByb3BlcnR5JSc6ICRkZWZpbmVQcm9wZXJ0eSxcblx0JyVPYmplY3QuZ2V0UHJvdG90eXBlT2YlJzogJE9iamVjdEdQTyxcblx0JyVNYXRoLmFicyUnOiBhYnMsXG5cdCclTWF0aC5mbG9vciUnOiBmbG9vcixcblx0JyVNYXRoLm1heCUnOiBtYXgsXG5cdCclTWF0aC5taW4lJzogbWluLFxuXHQnJU1hdGgucG93JSc6IHBvdyxcblx0JyVNYXRoLnJvdW5kJSc6IHJvdW5kLFxuXHQnJU1hdGguc2lnbiUnOiBzaWduLFxuXHQnJVJlZmxlY3QuZ2V0UHJvdG90eXBlT2YlJzogJFJlZmxlY3RHUE9cbn07XG5cbmlmIChnZXRQcm90bykge1xuXHR0cnkge1xuXHRcdG51bGwuZXJyb3I7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zaGFkb3dyZWFsbS9wdWxsLzM4NCNpc3N1ZWNvbW1lbnQtMTM2NDI2NDIyOVxuXHRcdHZhciBlcnJvclByb3RvID0gZ2V0UHJvdG8oZ2V0UHJvdG8oZSkpO1xuXHRcdElOVFJJTlNJQ1NbJyVFcnJvci5wcm90b3R5cGUlJ10gPSBlcnJvclByb3RvO1xuXHR9XG59XG5cbnZhciBkb0V2YWwgPSBmdW5jdGlvbiBkb0V2YWwobmFtZSkge1xuXHR2YXIgdmFsdWU7XG5cdGlmIChuYW1lID09PSAnJUFzeW5jRnVuY3Rpb24lJykge1xuXHRcdHZhbHVlID0gZ2V0RXZhbGxlZENvbnN0cnVjdG9yKCdhc3luYyBmdW5jdGlvbiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclR2VuZXJhdG9yRnVuY3Rpb24lJykge1xuXHRcdHZhbHVlID0gZ2V0RXZhbGxlZENvbnN0cnVjdG9yKCdmdW5jdGlvbiogKCkge30nKTtcblx0fSBlbHNlIGlmIChuYW1lID09PSAnJUFzeW5jR2VuZXJhdG9yRnVuY3Rpb24lJykge1xuXHRcdHZhbHVlID0gZ2V0RXZhbGxlZENvbnN0cnVjdG9yKCdhc3luYyBmdW5jdGlvbiogKCkge30nKTtcblx0fSBlbHNlIGlmIChuYW1lID09PSAnJUFzeW5jR2VuZXJhdG9yJScpIHtcblx0XHR2YXIgZm4gPSBkb0V2YWwoJyVBc3luY0dlbmVyYXRvckZ1bmN0aW9uJScpO1xuXHRcdGlmIChmbikge1xuXHRcdFx0dmFsdWUgPSBmbi5wcm90b3R5cGU7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNJdGVyYXRvclByb3RvdHlwZSUnKSB7XG5cdFx0dmFyIGdlbiA9IGRvRXZhbCgnJUFzeW5jR2VuZXJhdG9yJScpO1xuXHRcdGlmIChnZW4gJiYgZ2V0UHJvdG8pIHtcblx0XHRcdHZhbHVlID0gZ2V0UHJvdG8oZ2VuLnByb3RvdHlwZSk7XG5cdFx0fVxuXHR9XG5cblx0SU5UUklOU0lDU1tuYW1lXSA9IHZhbHVlO1xuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciBMRUdBQ1lfQUxJQVNFUyA9IHtcblx0X19wcm90b19fOiBudWxsLFxuXHQnJUFycmF5QnVmZmVyUHJvdG90eXBlJSc6IFsnQXJyYXlCdWZmZXInLCAncHJvdG90eXBlJ10sXG5cdCclQXJyYXlQcm90b3R5cGUlJzogWydBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVBcnJheVByb3RvX2VudHJpZXMlJzogWydBcnJheScsICdwcm90b3R5cGUnLCAnZW50cmllcyddLFxuXHQnJUFycmF5UHJvdG9fZm9yRWFjaCUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICdmb3JFYWNoJ10sXG5cdCclQXJyYXlQcm90b19rZXlzJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ2tleXMnXSxcblx0JyVBcnJheVByb3RvX3ZhbHVlcyUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICd2YWx1ZXMnXSxcblx0JyVBc3luY0Z1bmN0aW9uUHJvdG90eXBlJSc6IFsnQXN5bmNGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVBc3luY0dlbmVyYXRvciUnOiBbJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nLCAncHJvdG90eXBlJ10sXG5cdCclQXN5bmNHZW5lcmF0b3JQcm90b3R5cGUlJzogWydBc3luY0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZScsICdwcm90b3R5cGUnXSxcblx0JyVCb29sZWFuUHJvdG90eXBlJSc6IFsnQm9vbGVhbicsICdwcm90b3R5cGUnXSxcblx0JyVEYXRhVmlld1Byb3RvdHlwZSUnOiBbJ0RhdGFWaWV3JywgJ3Byb3RvdHlwZSddLFxuXHQnJURhdGVQcm90b3R5cGUlJzogWydEYXRlJywgJ3Byb3RvdHlwZSddLFxuXHQnJUVycm9yUHJvdG90eXBlJSc6IFsnRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclRXZhbEVycm9yUHJvdG90eXBlJSc6IFsnRXZhbEVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJUZsb2F0MzJBcnJheVByb3RvdHlwZSUnOiBbJ0Zsb2F0MzJBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVGbG9hdDY0QXJyYXlQcm90b3R5cGUlJzogWydGbG9hdDY0QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclRnVuY3Rpb25Qcm90b3R5cGUlJzogWydGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVHZW5lcmF0b3IlJzogWydHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVHZW5lcmF0b3JQcm90b3R5cGUlJzogWydHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnLCAncHJvdG90eXBlJ10sXG5cdCclSW50OEFycmF5UHJvdG90eXBlJSc6IFsnSW50OEFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUludDE2QXJyYXlQcm90b3R5cGUlJzogWydJbnQxNkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUludDMyQXJyYXlQcm90b3R5cGUlJzogWydJbnQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUpTT05QYXJzZSUnOiBbJ0pTT04nLCAncGFyc2UnXSxcblx0JyVKU09OU3RyaW5naWZ5JSc6IFsnSlNPTicsICdzdHJpbmdpZnknXSxcblx0JyVNYXBQcm90b3R5cGUlJzogWydNYXAnLCAncHJvdG90eXBlJ10sXG5cdCclTnVtYmVyUHJvdG90eXBlJSc6IFsnTnVtYmVyJywgJ3Byb3RvdHlwZSddLFxuXHQnJU9iamVjdFByb3RvdHlwZSUnOiBbJ09iamVjdCcsICdwcm90b3R5cGUnXSxcblx0JyVPYmpQcm90b190b1N0cmluZyUnOiBbJ09iamVjdCcsICdwcm90b3R5cGUnLCAndG9TdHJpbmcnXSxcblx0JyVPYmpQcm90b192YWx1ZU9mJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZScsICd2YWx1ZU9mJ10sXG5cdCclUHJvbWlzZVByb3RvdHlwZSUnOiBbJ1Byb21pc2UnLCAncHJvdG90eXBlJ10sXG5cdCclUHJvbWlzZVByb3RvX3RoZW4lJzogWydQcm9taXNlJywgJ3Byb3RvdHlwZScsICd0aGVuJ10sXG5cdCclUHJvbWlzZV9hbGwlJzogWydQcm9taXNlJywgJ2FsbCddLFxuXHQnJVByb21pc2VfcmVqZWN0JSc6IFsnUHJvbWlzZScsICdyZWplY3QnXSxcblx0JyVQcm9taXNlX3Jlc29sdmUlJzogWydQcm9taXNlJywgJ3Jlc29sdmUnXSxcblx0JyVSYW5nZUVycm9yUHJvdG90eXBlJSc6IFsnUmFuZ2VFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVSZWZlcmVuY2VFcnJvclByb3RvdHlwZSUnOiBbJ1JlZmVyZW5jZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVJlZ0V4cFByb3RvdHlwZSUnOiBbJ1JlZ0V4cCcsICdwcm90b3R5cGUnXSxcblx0JyVTZXRQcm90b3R5cGUlJzogWydTZXQnLCAncHJvdG90eXBlJ10sXG5cdCclU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGUlJzogWydTaGFyZWRBcnJheUJ1ZmZlcicsICdwcm90b3R5cGUnXSxcblx0JyVTdHJpbmdQcm90b3R5cGUlJzogWydTdHJpbmcnLCAncHJvdG90eXBlJ10sXG5cdCclU3ltYm9sUHJvdG90eXBlJSc6IFsnU3ltYm9sJywgJ3Byb3RvdHlwZSddLFxuXHQnJVN5bnRheEVycm9yUHJvdG90eXBlJSc6IFsnU3ludGF4RXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclVHlwZWRBcnJheVByb3RvdHlwZSUnOiBbJ1R5cGVkQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVHlwZUVycm9yUHJvdG90eXBlJSc6IFsnVHlwZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQ4QXJyYXlQcm90b3R5cGUlJzogWydVaW50OEFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQ4Q2xhbXBlZEFycmF5UHJvdG90eXBlJSc6IFsnVWludDhDbGFtcGVkQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVWludDE2QXJyYXlQcm90b3R5cGUlJzogWydVaW50MTZBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVVaW50MzJBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVSSUVycm9yUHJvdG90eXBlJSc6IFsnVVJJRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclV2Vha01hcFByb3RvdHlwZSUnOiBbJ1dlYWtNYXAnLCAncHJvdG90eXBlJ10sXG5cdCclV2Vha1NldFByb3RvdHlwZSUnOiBbJ1dlYWtTZXQnLCAncHJvdG90eXBlJ11cbn07XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJ2hhc293bicpO1xudmFyICRjb25jYXQgPSBiaW5kLmNhbGwoJGNhbGwsIEFycmF5LnByb3RvdHlwZS5jb25jYXQpO1xudmFyICRzcGxpY2VBcHBseSA9IGJpbmQuY2FsbCgkYXBwbHksIEFycmF5LnByb3RvdHlwZS5zcGxpY2UpO1xudmFyICRyZXBsYWNlID0gYmluZC5jYWxsKCRjYWxsLCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UpO1xudmFyICRzdHJTbGljZSA9IGJpbmQuY2FsbCgkY2FsbCwgU3RyaW5nLnByb3RvdHlwZS5zbGljZSk7XG52YXIgJGV4ZWMgPSBiaW5kLmNhbGwoJGNhbGwsIFJlZ0V4cC5wcm90b3R5cGUuZXhlYyk7XG5cbi8qIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iLzQuMTcuMTUvZGlzdC9sb2Rhc2guanMjTDY3MzUtTDY3NDQgKi9cbnZhciByZVByb3BOYW1lID0gL1teJS5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwlJCkpL2c7XG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7IC8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IGZ1bmN0aW9uIHN0cmluZ1RvUGF0aChzdHJpbmcpIHtcblx0dmFyIGZpcnN0ID0gJHN0clNsaWNlKHN0cmluZywgMCwgMSk7XG5cdHZhciBsYXN0ID0gJHN0clNsaWNlKHN0cmluZywgLTEpO1xuXHRpZiAoZmlyc3QgPT09ICclJyAmJiBsYXN0ICE9PSAnJScpIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdpbnZhbGlkIGludHJpbnNpYyBzeW50YXgsIGV4cGVjdGVkIGNsb3NpbmcgYCVgJyk7XG5cdH0gZWxzZSBpZiAobGFzdCA9PT0gJyUnICYmIGZpcnN0ICE9PSAnJScpIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdpbnZhbGlkIGludHJpbnNpYyBzeW50YXgsIGV4cGVjdGVkIG9wZW5pbmcgYCVgJyk7XG5cdH1cblx0dmFyIHJlc3VsdCA9IFtdO1xuXHQkcmVwbGFjZShzdHJpbmcsIHJlUHJvcE5hbWUsIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG5cdFx0cmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcXVvdGUgPyAkcmVwbGFjZShzdWJTdHJpbmcsIHJlRXNjYXBlQ2hhciwgJyQxJykgOiBudW1iZXIgfHwgbWF0Y2g7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbi8qIGVuZCBhZGFwdGF0aW9uICovXG5cbnZhciBnZXRCYXNlSW50cmluc2ljID0gZnVuY3Rpb24gZ2V0QmFzZUludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0dmFyIGludHJpbnNpY05hbWUgPSBuYW1lO1xuXHR2YXIgYWxpYXM7XG5cdGlmIChoYXNPd24oTEVHQUNZX0FMSUFTRVMsIGludHJpbnNpY05hbWUpKSB7XG5cdFx0YWxpYXMgPSBMRUdBQ1lfQUxJQVNFU1tpbnRyaW5zaWNOYW1lXTtcblx0XHRpbnRyaW5zaWNOYW1lID0gJyUnICsgYWxpYXNbMF0gKyAnJSc7XG5cdH1cblxuXHRpZiAoaGFzT3duKElOVFJJTlNJQ1MsIGludHJpbnNpY05hbWUpKSB7XG5cdFx0dmFyIHZhbHVlID0gSU5UUklOU0lDU1tpbnRyaW5zaWNOYW1lXTtcblx0XHRpZiAodmFsdWUgPT09IG5lZWRzRXZhbCkge1xuXHRcdFx0dmFsdWUgPSBkb0V2YWwoaW50cmluc2ljTmFtZSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICYmICFhbGxvd01pc3NpbmcpIHtcblx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdpbnRyaW5zaWMgJyArIG5hbWUgKyAnIGV4aXN0cywgYnV0IGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBmaWxlIGFuIGlzc3VlIScpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRhbGlhczogYWxpYXMsXG5cdFx0XHRuYW1lOiBpbnRyaW5zaWNOYW1lLFxuXHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0fTtcblx0fVxuXG5cdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ2ludHJpbnNpYyAnICsgbmFtZSArICcgZG9lcyBub3QgZXhpc3QhJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdldEludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0aWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJyB8fCBuYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdpbnRyaW5zaWMgbmFtZSBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuXHR9XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYWxsb3dNaXNzaW5nICE9PSAnYm9vbGVhbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignXCJhbGxvd01pc3NpbmdcIiBhcmd1bWVudCBtdXN0IGJlIGEgYm9vbGVhbicpO1xuXHR9XG5cblx0aWYgKCRleGVjKC9eJT9bXiVdKiU/JC8sIG5hbWUpID09PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcignYCVgIG1heSBub3QgYmUgcHJlc2VudCBhbnl3aGVyZSBidXQgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIHRoZSBpbnRyaW5zaWMgbmFtZScpO1xuXHR9XG5cdHZhciBwYXJ0cyA9IHN0cmluZ1RvUGF0aChuYW1lKTtcblx0dmFyIGludHJpbnNpY0Jhc2VOYW1lID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzWzBdIDogJyc7XG5cblx0dmFyIGludHJpbnNpYyA9IGdldEJhc2VJbnRyaW5zaWMoJyUnICsgaW50cmluc2ljQmFzZU5hbWUgKyAnJScsIGFsbG93TWlzc2luZyk7XG5cdHZhciBpbnRyaW5zaWNSZWFsTmFtZSA9IGludHJpbnNpYy5uYW1lO1xuXHR2YXIgdmFsdWUgPSBpbnRyaW5zaWMudmFsdWU7XG5cdHZhciBza2lwRnVydGhlckNhY2hpbmcgPSBmYWxzZTtcblxuXHR2YXIgYWxpYXMgPSBpbnRyaW5zaWMuYWxpYXM7XG5cdGlmIChhbGlhcykge1xuXHRcdGludHJpbnNpY0Jhc2VOYW1lID0gYWxpYXNbMF07XG5cdFx0JHNwbGljZUFwcGx5KHBhcnRzLCAkY29uY2F0KFswLCAxXSwgYWxpYXMpKTtcblx0fVxuXG5cdGZvciAodmFyIGkgPSAxLCBpc093biA9IHRydWU7IGkgPCBwYXJ0cy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdHZhciBwYXJ0ID0gcGFydHNbaV07XG5cdFx0dmFyIGZpcnN0ID0gJHN0clNsaWNlKHBhcnQsIDAsIDEpO1xuXHRcdHZhciBsYXN0ID0gJHN0clNsaWNlKHBhcnQsIC0xKTtcblx0XHRpZiAoXG5cdFx0XHQoXG5cdFx0XHRcdChmaXJzdCA9PT0gJ1wiJyB8fCBmaXJzdCA9PT0gXCInXCIgfHwgZmlyc3QgPT09ICdgJylcblx0XHRcdFx0fHwgKGxhc3QgPT09ICdcIicgfHwgbGFzdCA9PT0gXCInXCIgfHwgbGFzdCA9PT0gJ2AnKVxuXHRcdFx0KVxuXHRcdFx0JiYgZmlyc3QgIT09IGxhc3Rcblx0XHQpIHtcblx0XHRcdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ3Byb3BlcnR5IG5hbWVzIHdpdGggcXVvdGVzIG11c3QgaGF2ZSBtYXRjaGluZyBxdW90ZXMnKTtcblx0XHR9XG5cdFx0aWYgKHBhcnQgPT09ICdjb25zdHJ1Y3RvcicgfHwgIWlzT3duKSB7XG5cdFx0XHRza2lwRnVydGhlckNhY2hpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGludHJpbnNpY0Jhc2VOYW1lICs9ICcuJyArIHBhcnQ7XG5cdFx0aW50cmluc2ljUmVhbE5hbWUgPSAnJScgKyBpbnRyaW5zaWNCYXNlTmFtZSArICclJztcblxuXHRcdGlmIChoYXNPd24oSU5UUklOU0lDUywgaW50cmluc2ljUmVhbE5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IElOVFJJTlNJQ1NbaW50cmluc2ljUmVhbE5hbWVdO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0aWYgKCEocGFydCBpbiB2YWx1ZSkpIHtcblx0XHRcdFx0aWYgKCFhbGxvd01pc3NpbmcpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYmFzZSBpbnRyaW5zaWMgZm9yICcgKyBuYW1lICsgJyBleGlzdHMsIGJ1dCB0aGUgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZS4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdm9pZCB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoJGdPUEQgJiYgKGkgKyAxKSA+PSBwYXJ0cy5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGRlc2MgPSAkZ09QRCh2YWx1ZSwgcGFydCk7XG5cdFx0XHRcdGlzT3duID0gISFkZXNjO1xuXG5cdFx0XHRcdC8vIEJ5IGNvbnZlbnRpb24sIHdoZW4gYSBkYXRhIHByb3BlcnR5IGlzIGNvbnZlcnRlZCB0byBhbiBhY2Nlc3NvclxuXHRcdFx0XHQvLyBwcm9wZXJ0eSB0byBlbXVsYXRlIGEgZGF0YSBwcm9wZXJ0eSB0aGF0IGRvZXMgbm90IHN1ZmZlciBmcm9tXG5cdFx0XHRcdC8vIHRoZSBvdmVycmlkZSBtaXN0YWtlLCB0aGF0IGFjY2Vzc29yJ3MgZ2V0dGVyIGlzIG1hcmtlZCB3aXRoXG5cdFx0XHRcdC8vIGFuIGBvcmlnaW5hbFZhbHVlYCBwcm9wZXJ0eS4gSGVyZSwgd2hlbiB3ZSBkZXRlY3QgdGhpcywgd2Vcblx0XHRcdFx0Ly8gdXBob2xkIHRoZSBpbGx1c2lvbiBieSBwcmV0ZW5kaW5nIHRvIHNlZSB0aGF0IG9yaWdpbmFsIGRhdGFcblx0XHRcdFx0Ly8gcHJvcGVydHksIGkuZS4sIHJldHVybmluZyB0aGUgdmFsdWUgcmF0aGVyIHRoYW4gdGhlIGdldHRlclxuXHRcdFx0XHQvLyBpdHNlbGYuXG5cdFx0XHRcdGlmIChpc093biAmJiAnZ2V0JyBpbiBkZXNjICYmICEoJ29yaWdpbmFsVmFsdWUnIGluIGRlc2MuZ2V0KSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZGVzYy5nZXQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZVtwYXJ0XTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aXNPd24gPSBoYXNPd24odmFsdWUsIHBhcnQpO1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlW3BhcnRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXNPd24gJiYgIXNraXBGdXJ0aGVyQ2FjaGluZykge1xuXHRcdFx0XHRJTlRSSU5TSUNTW2ludHJpbnNpY1JlYWxOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIEdldEludHJpbnNpYyA9IHJlcXVpcmUoJ2dldC1pbnRyaW5zaWMnKTtcblxudmFyIGNhbGxCaW5kQmFzaWMgPSByZXF1aXJlKCdjYWxsLWJpbmQtYXBwbHktaGVscGVycycpO1xuXG4vKiogQHR5cGUgeyh0aGlzQXJnOiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gbnVtYmVyfSAqL1xudmFyICRpbmRleE9mID0gY2FsbEJpbmRCYXNpYyhbR2V0SW50cmluc2ljKCclU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mJScpXSk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGxCb3VuZEludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0LyogZXNsaW50IG5vLWV4dHJhLXBhcmVuczogMCAqL1xuXG5cdHZhciBpbnRyaW5zaWMgPSAvKiogQHR5cGUgeyh0aGlzOiB1bmtub3duLCAuLi5hcmdzOiB1bmtub3duW10pID0+IHVua25vd259ICovIChHZXRJbnRyaW5zaWMobmFtZSwgISFhbGxvd01pc3NpbmcpKTtcblx0aWYgKHR5cGVvZiBpbnRyaW5zaWMgPT09ICdmdW5jdGlvbicgJiYgJGluZGV4T2YobmFtZSwgJy5wcm90b3R5cGUuJykgPiAtMSkge1xuXHRcdHJldHVybiBjYWxsQmluZEJhc2ljKC8qKiBAdHlwZSB7Y29uc3R9ICovIChbaW50cmluc2ljXSkpO1xuXHR9XG5cdHJldHVybiBpbnRyaW5zaWM7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIEdldEludHJpbnNpYyA9IHJlcXVpcmUoJ2dldC1pbnRyaW5zaWMnKTtcbnZhciBjYWxsQm91bmQgPSByZXF1aXJlKCdjYWxsLWJvdW5kJyk7XG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJ29iamVjdC1pbnNwZWN0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcbnZhciAkTWFwID0gR2V0SW50cmluc2ljKCclTWFwJScsIHRydWUpO1xuXG4vKiogQHR5cGUgezxLLCBWPih0aGlzQXJnOiBNYXA8SywgVj4sIGtleTogSykgPT4gVn0gKi9cbnZhciAkbWFwR2V0ID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLmdldCcsIHRydWUpO1xuLyoqIEB0eXBlIHs8SywgVj4odGhpc0FyZzogTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiB2b2lkfSAqL1xudmFyICRtYXBTZXQgPSBjYWxsQm91bmQoJ01hcC5wcm90b3R5cGUuc2V0JywgdHJ1ZSk7XG4vKiogQHR5cGUgezxLLCBWPih0aGlzQXJnOiBNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbnZhciAkbWFwSGFzID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLmhhcycsIHRydWUpO1xuLyoqIEB0eXBlIHs8SywgVj4odGhpc0FyZzogTWFwPEssIFY+LCBrZXk6IEspID0+IGJvb2xlYW59ICovXG52YXIgJG1hcERlbGV0ZSA9IGNhbGxCb3VuZCgnTWFwLnByb3RvdHlwZS5kZWxldGUnLCB0cnVlKTtcbi8qKiBAdHlwZSB7PEssIFY+KHRoaXNBcmc6IE1hcDxLLCBWPikgPT4gbnVtYmVyfSAqL1xudmFyICRtYXBTaXplID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLnNpemUnLCB0cnVlKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gISEkTWFwICYmIC8qKiBAdHlwZSB7RXhjbHVkZTxpbXBvcnQoJy4nKSwgZmFsc2U+fSAqLyBmdW5jdGlvbiBnZXRTaWRlQ2hhbm5lbE1hcCgpIHtcblx0LyoqIEB0eXBlZGVmIHtSZXR1cm5UeXBlPHR5cGVvZiBnZXRTaWRlQ2hhbm5lbE1hcD59IENoYW5uZWwgKi9cblx0LyoqIEB0eXBlZGVmIHtQYXJhbWV0ZXJzPENoYW5uZWxbJ2dldCddPlswXX0gSyAqL1xuXHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnc2V0J10+WzFdfSBWICovXG5cblx0LyoqIEB0eXBlIHtNYXA8SywgVj4gfCB1bmRlZmluZWR9ICovIHZhciAkbTtcblxuXHQvKiogQHR5cGUge0NoYW5uZWx9ICovXG5cdHZhciBjaGFubmVsID0ge1xuXHRcdGFzc2VydDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0aWYgKCFjaGFubmVsLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdTaWRlIGNoYW5uZWwgZG9lcyBub3QgY29udGFpbiAnICsgaW5zcGVjdChrZXkpKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoJG0pIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9ICRtYXBEZWxldGUoJG0sIGtleSk7XG5cdFx0XHRcdGlmICgkbWFwU2l6ZSgkbSkgPT09IDApIHtcblx0XHRcdFx0XHQkbSA9IHZvaWQgdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIChrZXkpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuXHRcdFx0aWYgKCRtKSB7XG5cdFx0XHRcdHJldHVybiAkbWFwR2V0KCRtLCBrZXkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFzOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoJG0pIHtcblx0XHRcdFx0cmV0dXJuICRtYXBIYXMoJG0sIGtleSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0XHRpZiAoISRtKSB7XG5cdFx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgaGFuZGxlIG5hcnJvd2luZyBhIHZhcmlhYmxlIGluc2lkZSBhIGNsb3N1cmVcblx0XHRcdFx0JG0gPSBuZXcgJE1hcCgpO1xuXHRcdFx0fVxuXHRcdFx0JG1hcFNldCgkbSwga2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEB0cy1leHBlY3QtZXJyb3IgVE9ETzogZmlndXJlIG91dCB3aHkgVFMgaXMgZXJyb3JpbmcgaGVyZVxuXHRyZXR1cm4gY2hhbm5lbDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xudmFyIGNhbGxCb3VuZCA9IHJlcXVpcmUoJ2NhbGwtYm91bmQnKTtcbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnb2JqZWN0LWluc3BlY3QnKTtcbnZhciBnZXRTaWRlQ2hhbm5lbE1hcCA9IHJlcXVpcmUoJ3NpZGUtY2hhbm5lbC1tYXAnKTtcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyICRXZWFrTWFwID0gR2V0SW50cmluc2ljKCclV2Vha01hcCUnLCB0cnVlKTtcblxuLyoqIEB0eXBlIHs8SyBleHRlbmRzIG9iamVjdCwgVj4odGhpc0FyZzogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBWfSAqL1xudmFyICR3ZWFrTWFwR2V0ID0gY2FsbEJvdW5kKCdXZWFrTWFwLnByb3RvdHlwZS5nZXQnLCB0cnVlKTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyBvYmplY3QsIFY+KHRoaXNBcmc6IFdlYWtNYXA8SywgVj4sIGtleTogSywgdmFsdWU6IFYpID0+IHZvaWR9ICovXG52YXIgJHdlYWtNYXBTZXQgPSBjYWxsQm91bmQoJ1dlYWtNYXAucHJvdG90eXBlLnNldCcsIHRydWUpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIG9iamVjdCwgVj4odGhpc0FyZzogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBib29sZWFufSAqL1xudmFyICR3ZWFrTWFwSGFzID0gY2FsbEJvdW5kKCdXZWFrTWFwLnByb3RvdHlwZS5oYXMnLCB0cnVlKTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyBvYmplY3QsIFY+KHRoaXNBcmc6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbnZhciAkd2Vha01hcERlbGV0ZSA9IGNhbGxCb3VuZCgnV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlJywgdHJ1ZSk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9ICRXZWFrTWFwXG5cdD8gLyoqIEB0eXBlIHtFeGNsdWRlPGltcG9ydCgnLicpLCBmYWxzZT59ICovIGZ1bmN0aW9uIGdldFNpZGVDaGFubmVsV2Vha01hcCgpIHtcblx0XHQvKiogQHR5cGVkZWYge1JldHVyblR5cGU8dHlwZW9mIGdldFNpZGVDaGFubmVsV2Vha01hcD59IENoYW5uZWwgKi9cblx0XHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnZ2V0J10+WzBdfSBLICovXG5cdFx0LyoqIEB0eXBlZGVmIHtQYXJhbWV0ZXJzPENoYW5uZWxbJ3NldCddPlsxXX0gViAqL1xuXG5cdFx0LyoqIEB0eXBlIHtXZWFrTWFwPEsgJiBvYmplY3QsIFY+IHwgdW5kZWZpbmVkfSAqLyB2YXIgJHdtO1xuXHRcdC8qKiBAdHlwZSB7Q2hhbm5lbCB8IHVuZGVmaW5lZH0gKi8gdmFyICRtO1xuXG5cdFx0LyoqIEB0eXBlIHtDaGFubmVsfSAqL1xuXHRcdHZhciBjaGFubmVsID0ge1xuXHRcdFx0YXNzZXJ0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmICghY2hhbm5lbC5oYXMoa2V5KSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdTaWRlIGNoYW5uZWwgZG9lcyBub3QgY29udGFpbiAnICsgaW5zcGVjdChrZXkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmICgkV2Vha01hcCAmJiBrZXkgJiYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdFx0aWYgKCR3bSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICR3ZWFrTWFwRGVsZXRlKCR3bSwga2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoZ2V0U2lkZUNoYW5uZWxNYXApIHtcblx0XHRcdFx0XHRpZiAoJG0pIHtcblx0XHRcdFx0XHRcdHJldHVybiAkbVsnZGVsZXRlJ10oa2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdGdldDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRpZiAoJFdlYWtNYXAgJiYga2V5ICYmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHRcdGlmICgkd20pIHtcblx0XHRcdFx0XHRcdHJldHVybiAkd2Vha01hcEdldCgkd20sIGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAkbSAmJiAkbS5nZXQoa2V5KTtcblx0XHRcdH0sXG5cdFx0XHRoYXM6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKCRXZWFrTWFwICYmIGtleSAmJiAodHlwZW9mIGtleSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykpIHtcblx0XHRcdFx0XHRpZiAoJHdtKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHdlYWtNYXBIYXMoJHdtLCBrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gISEkbSAmJiAkbS5oYXMoa2V5KTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0XHRcdGlmICgkV2Vha01hcCAmJiBrZXkgJiYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdFx0aWYgKCEkd20pIHtcblx0XHRcdFx0XHRcdCR3bSA9IG5ldyAkV2Vha01hcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkd2Vha01hcFNldCgkd20sIGtleSwgdmFsdWUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGdldFNpZGVDaGFubmVsTWFwKSB7XG5cdFx0XHRcdFx0aWYgKCEkbSkge1xuXHRcdFx0XHRcdFx0JG0gPSBnZXRTaWRlQ2hhbm5lbE1hcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRcdFx0LyoqIEB0eXBlIHtOb25OdWxsYWJsZTx0eXBlb2YgJG0+fSAqLyAoJG0pLnNldChrZXksIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IGZpZ3VyZSBvdXQgd2h5IHRoaXMgaXMgZXJyb3Jpbmdcblx0XHRyZXR1cm4gY2hhbm5lbDtcblx0fVxuXHQ6IGdldFNpZGVDaGFubmVsTWFwO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyIGluc3BlY3QgPSByZXF1aXJlKCdvYmplY3QtaW5zcGVjdCcpO1xudmFyIGdldFNpZGVDaGFubmVsTGlzdCA9IHJlcXVpcmUoJ3NpZGUtY2hhbm5lbC1saXN0Jyk7XG52YXIgZ2V0U2lkZUNoYW5uZWxNYXAgPSByZXF1aXJlKCdzaWRlLWNoYW5uZWwtbWFwJyk7XG52YXIgZ2V0U2lkZUNoYW5uZWxXZWFrTWFwID0gcmVxdWlyZSgnc2lkZS1jaGFubmVsLXdlYWttYXAnKTtcblxudmFyIG1ha2VDaGFubmVsID0gZ2V0U2lkZUNoYW5uZWxXZWFrTWFwIHx8IGdldFNpZGVDaGFubmVsTWFwIHx8IGdldFNpZGVDaGFubmVsTGlzdDtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U2lkZUNoYW5uZWwoKSB7XG5cdC8qKiBAdHlwZWRlZiB7UmV0dXJuVHlwZTx0eXBlb2YgZ2V0U2lkZUNoYW5uZWw+fSBDaGFubmVsICovXG5cblx0LyoqIEB0eXBlIHtDaGFubmVsIHwgdW5kZWZpbmVkfSAqLyB2YXIgJGNoYW5uZWxEYXRhO1xuXG5cdC8qKiBAdHlwZSB7Q2hhbm5lbH0gKi9cblx0dmFyIGNoYW5uZWwgPSB7XG5cdFx0YXNzZXJ0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoIWNoYW5uZWwuaGFzKGtleSkpIHtcblx0XHRcdFx0dmFyIGtleURlc2MgPSBrZXkgJiYgT2JqZWN0KGtleSkgPT09IGtleVxuXHRcdFx0XHRcdD8gJ3RoZSBnaXZlbiBvYmplY3Qga2V5J1xuXHRcdFx0XHRcdDogaW5zcGVjdChrZXkpO1xuXHRcdFx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignU2lkZSBjaGFubmVsIGRvZXMgbm90IGNvbnRhaW4gJyArIGtleURlc2MpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiAhISRjaGFubmVsRGF0YSAmJiAkY2hhbm5lbERhdGFbJ2RlbGV0ZSddKGtleSk7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiAkY2hhbm5lbERhdGEgJiYgJGNoYW5uZWxEYXRhLmdldChrZXkpO1xuXHRcdH0sXG5cdFx0aGFzOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gISEkY2hhbm5lbERhdGEgJiYgJGNoYW5uZWxEYXRhLmhhcyhrZXkpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0aWYgKCEkY2hhbm5lbERhdGEpIHtcblx0XHRcdFx0JGNoYW5uZWxEYXRhID0gbWFrZUNoYW5uZWwoKTtcblx0XHRcdH1cblxuXHRcdFx0JGNoYW5uZWxEYXRhLnNldChrZXksIHZhbHVlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGNoYW5uZWw7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG52YXIgcGVyY2VudFR3ZW50aWVzID0gLyUyMC9nO1xuXG52YXIgRm9ybWF0ID0ge1xuICAgIFJGQzE3Mzg6ICdSRkMxNzM4JyxcbiAgICBSRkMzOTg2OiAnUkZDMzk4Nidcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdkZWZhdWx0JzogRm9ybWF0LlJGQzM5ODYsXG4gICAgZm9ybWF0dGVyczoge1xuICAgICAgICBSRkMxNzM4OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlLmNhbGwodmFsdWUsIHBlcmNlbnRUd2VudGllcywgJysnKTtcbiAgICAgICAgfSxcbiAgICAgICAgUkZDMzk4NjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgUkZDMTczODogRm9ybWF0LlJGQzE3MzgsXG4gICAgUkZDMzk4NjogRm9ybWF0LlJGQzM5ODZcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xudmFyIGdldFNpZGVDaGFubmVsID0gcmVxdWlyZSgnc2lkZS1jaGFubmVsJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vLyBUcmFjayBvYmplY3RzIGNyZWF0ZWQgZnJvbSBhcnJheUxpbWl0IG92ZXJmbG93IHVzaW5nIHNpZGUtY2hhbm5lbFxuLy8gU3RvcmVzIHRoZSBjdXJyZW50IG1heCBudW1lcmljIGluZGV4IGZvciBPKDEpIGxvb2t1cFxudmFyIG92ZXJmbG93Q2hhbm5lbCA9IGdldFNpZGVDaGFubmVsKCk7XG5cbnZhciBtYXJrT3ZlcmZsb3cgPSBmdW5jdGlvbiBtYXJrT3ZlcmZsb3cob2JqLCBtYXhJbmRleCkge1xuICAgIG92ZXJmbG93Q2hhbm5lbC5zZXQob2JqLCBtYXhJbmRleCk7XG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc092ZXJmbG93ID0gZnVuY3Rpb24gaXNPdmVyZmxvdyhvYmopIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dDaGFubmVsLmhhcyhvYmopO1xufTtcblxudmFyIGdldE1heEluZGV4ID0gZnVuY3Rpb24gZ2V0TWF4SW5kZXgob2JqKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93Q2hhbm5lbC5nZXQob2JqKTtcbn07XG5cbnZhciBzZXRNYXhJbmRleCA9IGZ1bmN0aW9uIHNldE1heEluZGV4KG9iaiwgbWF4SW5kZXgpIHtcbiAgICBvdmVyZmxvd0NoYW5uZWwuc2V0KG9iaiwgbWF4SW5kZXgpO1xufTtcblxudmFyIGhleFRhYmxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgICAgIGFycmF5W2FycmF5Lmxlbmd0aF0gPSAnJScgKyAoKGkgPCAxNiA/ICcwJyA6ICcnKSArIGkudG9TdHJpbmcoMTYpKS50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn0oKSk7XG5cbnZhciBjb21wYWN0UXVldWUgPSBmdW5jdGlvbiBjb21wYWN0UXVldWUocXVldWUpIHtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB2YXIgb2JqID0gaXRlbS5vYmpbaXRlbS5wcm9wXTtcblxuICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICB2YXIgY29tcGFjdGVkID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpbal0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhY3RlZFtjb21wYWN0ZWQubGVuZ3RoXSA9IG9ialtqXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW0ub2JqW2l0ZW0ucHJvcF0gPSBjb21wYWN0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgYXJyYXlUb09iamVjdCA9IGZ1bmN0aW9uIGFycmF5VG9PYmplY3Qoc291cmNlLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wbGFpbk9iamVjdHMgPyB7IF9fcHJvdG9fXzogbnVsbCB9IDoge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvYmpbaV0gPSBzb3VyY2VbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAvKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IDAgKi9cbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc291cmNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSB0YXJnZXQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuYXJyYXlMaW1pdCA9PT0gJ251bWJlcicgJiYgbmV4dEluZGV4ID4gb3B0aW9ucy5hcnJheUxpbWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtPdmVyZmxvdyhhcnJheVRvT2JqZWN0KHRhcmdldC5jb25jYXQoc291cmNlKSwgb3B0aW9ucyksIG5leHRJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRbbmV4dEluZGV4XSA9IHNvdXJjZTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChpc092ZXJmbG93KHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgYXQgbmV4dCBudW1lcmljIGluZGV4IGZvciBvdmVyZmxvdyBvYmplY3RzXG4gICAgICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gZ2V0TWF4SW5kZXgodGFyZ2V0KSArIDE7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25ld0luZGV4XSA9IHNvdXJjZTtcbiAgICAgICAgICAgICAgICBzZXRNYXhJbmRleCh0YXJnZXQsIG5ld0luZGV4KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmljdE1lcmdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0YXJnZXQsIHNvdXJjZV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIChvcHRpb25zICYmIChvcHRpb25zLnBsYWluT2JqZWN0cyB8fCBvcHRpb25zLmFsbG93UHJvdG90eXBlcykpXG4gICAgICAgICAgICAgICAgfHwgIWhhcy5jYWxsKE9iamVjdC5wcm90b3R5cGUsIHNvdXJjZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoaXNPdmVyZmxvdyhzb3VyY2UpKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IG9iamVjdCB3aXRoIHRhcmdldCBhdCAwLCBzb3VyY2UgdmFsdWVzIHNoaWZ0ZWQgYnkgMVxuICAgICAgICAgICAgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wbGFpbk9iamVjdHNcbiAgICAgICAgICAgICAgICA/IHsgX19wcm90b19fOiBudWxsLCAwOiB0YXJnZXQgfVxuICAgICAgICAgICAgICAgIDogeyAwOiB0YXJnZXQgfTtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgc291cmNlS2V5cy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgIHZhciBvbGRLZXkgPSBwYXJzZUludChzb3VyY2VLZXlzW21dLCAxMCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0W29sZEtleSArIDFdID0gc291cmNlW3NvdXJjZUtleXNbbV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hcmtPdmVyZmxvdyhyZXN1bHQsIGdldE1heEluZGV4KHNvdXJjZSkgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tYmluZWQgPSBbdGFyZ2V0XS5jb25jYXQoc291cmNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuYXJyYXlMaW1pdCA9PT0gJ251bWJlcicgJiYgY29tYmluZWQubGVuZ3RoID4gb3B0aW9ucy5hcnJheUxpbWl0KSB7XG4gICAgICAgICAgICByZXR1cm4gbWFya092ZXJmbG93KGFycmF5VG9PYmplY3QoY29tYmluZWQsIG9wdGlvbnMpLCBjb21iaW5lZC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tYmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIG1lcmdlVGFyZ2V0ID0gdGFyZ2V0O1xuICAgIGlmIChpc0FycmF5KHRhcmdldCkgJiYgIWlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBtZXJnZVRhcmdldCA9IGFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheSh0YXJnZXQpICYmIGlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0SXRlbSA9IHRhcmdldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SXRlbSAmJiB0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2ldID0gbWVyZ2UodGFyZ2V0SXRlbSwgaXRlbSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3RhcmdldC5sZW5ndGhdID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICAgICAgaWYgKGhhcy5jYWxsKGFjYywga2V5KSkge1xuICAgICAgICAgICAgYWNjW2tleV0gPSBtZXJnZShhY2Nba2V5XSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc092ZXJmbG93KHNvdXJjZSkgJiYgIWlzT3ZlcmZsb3coYWNjKSkge1xuICAgICAgICAgICAgbWFya092ZXJmbG93KGFjYywgZ2V0TWF4SW5kZXgoc291cmNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzT3ZlcmZsb3coYWNjKSkge1xuICAgICAgICAgICAgdmFyIGtleU51bSA9IHBhcnNlSW50KGtleSwgMTApO1xuICAgICAgICAgICAgaWYgKFN0cmluZyhrZXlOdW0pID09PSBrZXkgJiYga2V5TnVtID49IDAgJiYga2V5TnVtID4gZ2V0TWF4SW5kZXgoYWNjKSkge1xuICAgICAgICAgICAgICAgIHNldE1heEluZGV4KGFjYywga2V5TnVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgbWVyZ2VUYXJnZXQpO1xufTtcblxudmFyIGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnblNpbmdsZVNvdXJjZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgYWNjW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB0YXJnZXQpO1xufTtcblxudmFyIGRlY29kZSA9IGZ1bmN0aW9uIChzdHIsIGRlZmF1bHREZWNvZGVyLCBjaGFyc2V0KSB7XG4gICAgdmFyIHN0cldpdGhvdXRQbHVzID0gc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpO1xuICAgIGlmIChjaGFyc2V0ID09PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgLy8gdW5lc2NhcGUgbmV2ZXIgdGhyb3dzLCBubyB0cnkuLi5jYXRjaCBuZWVkZWQ6XG4gICAgICAgIHJldHVybiBzdHJXaXRob3V0UGx1cy5yZXBsYWNlKC8lWzAtOWEtZl17Mn0vZ2ksIHVuZXNjYXBlKTtcbiAgICB9XG4gICAgLy8gdXRmLThcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cldpdGhvdXRQbHVzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBzdHJXaXRob3V0UGx1cztcbiAgICB9XG59O1xuXG52YXIgbGltaXQgPSAxMDI0O1xuXG4vKiBlc2xpbnQgb3BlcmF0b3ItbGluZWJyZWFrOiBbMiwgXCJiZWZvcmVcIl0gKi9cblxudmFyIGVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShzdHIsIGRlZmF1bHRFbmNvZGVyLCBjaGFyc2V0LCBraW5kLCBmb3JtYXQpIHtcbiAgICAvLyBUaGlzIGNvZGUgd2FzIG9yaWdpbmFsbHkgd3JpdHRlbiBieSBCcmlhbiBXaGl0ZSAobXNjZGV4KSBmb3IgdGhlIGlvLmpzIGNvcmUgcXVlcnlzdHJpbmcgbGlicmFyeS5cbiAgICAvLyBJdCBoYXMgYmVlbiBhZGFwdGVkIGhlcmUgZm9yIHN0cmljdGVyIGFkaGVyZW5jZSB0byBSRkMgMzk4NlxuICAgIGlmIChzdHIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgdmFyIHN0cmluZyA9IHN0cjtcbiAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgc3RyaW5nID0gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgICAgICBzdHJpbmcgPSBTdHJpbmcoc3RyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhcnNldCA9PT0gJ2lzby04ODU5LTEnKSB7XG4gICAgICAgIHJldHVybiBlc2NhcGUoc3RyaW5nKS5yZXBsYWNlKC8ldVswLTlhLWZdezR9L2dpLCBmdW5jdGlvbiAoJDApIHtcbiAgICAgICAgICAgIHJldHVybiAnJTI2JTIzJyArIHBhcnNlSW50KCQwLnNsaWNlKDIpLCAxNikgKyAnJTNCJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RyaW5nLmxlbmd0aDsgaiArPSBsaW1pdCkge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHN0cmluZy5sZW5ndGggPj0gbGltaXQgPyBzdHJpbmcuc2xpY2UoaiwgaiArIGxpbWl0KSA6IHN0cmluZztcbiAgICAgICAgdmFyIGFyciA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGMgPSBzZWdtZW50LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYyA9PT0gMHgyRCAvLyAtXG4gICAgICAgICAgICAgICAgfHwgYyA9PT0gMHgyRSAvLyAuXG4gICAgICAgICAgICAgICAgfHwgYyA9PT0gMHg1RiAvLyBfXG4gICAgICAgICAgICAgICAgfHwgYyA9PT0gMHg3RSAvLyB+XG4gICAgICAgICAgICAgICAgfHwgKGMgPj0gMHgzMCAmJiBjIDw9IDB4MzkpIC8vIDAtOVxuICAgICAgICAgICAgICAgIHx8IChjID49IDB4NDEgJiYgYyA8PSAweDVBKSAvLyBhLXpcbiAgICAgICAgICAgICAgICB8fCAoYyA+PSAweDYxICYmIGMgPD0gMHg3QSkgLy8gQS1aXG4gICAgICAgICAgICAgICAgfHwgKGZvcm1hdCA9PT0gZm9ybWF0cy5SRkMxNzM4ICYmIChjID09PSAweDI4IHx8IGMgPT09IDB4MjkpKSAvLyAoIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGFyclthcnIubGVuZ3RoXSA9IHNlZ21lbnQuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA8IDB4ODApIHtcbiAgICAgICAgICAgICAgICBhcnJbYXJyLmxlbmd0aF0gPSBoZXhUYWJsZVtjXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPCAweDgwMCkge1xuICAgICAgICAgICAgICAgIGFyclthcnIubGVuZ3RoXSA9IGhleFRhYmxlWzB4QzAgfCAoYyA+PiA2KV1cbiAgICAgICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjIDwgMHhEODAwIHx8IGMgPj0gMHhFMDAwKSB7XG4gICAgICAgICAgICAgICAgYXJyW2Fyci5sZW5ndGhdID0gaGV4VGFibGVbMHhFMCB8IChjID4+IDEyKV1cbiAgICAgICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDYpICYgMHgzRildXG4gICAgICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICBjID0gMHgxMDAwMCArICgoKGMgJiAweDNGRikgPDwgMTApIHwgKHNlZ21lbnQuY2hhckNvZGVBdChpKSAmIDB4M0ZGKSk7XG5cbiAgICAgICAgICAgIGFyclthcnIubGVuZ3RoXSA9IGhleFRhYmxlWzB4RjAgfCAoYyA+PiAxOCldXG4gICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDEyKSAmIDB4M0YpXVxuICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8ICgoYyA+PiA2KSAmIDB4M0YpXVxuICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0ICs9IGFyci5qb2luKCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxudmFyIGNvbXBhY3QgPSBmdW5jdGlvbiBjb21wYWN0KHZhbHVlKSB7XG4gICAgdmFyIHF1ZXVlID0gW3sgb2JqOiB7IG86IHZhbHVlIH0sIHByb3A6ICdvJyB9XTtcbiAgICB2YXIgcmVmcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlW2ldO1xuICAgICAgICB2YXIgb2JqID0gaXRlbS5vYmpbaXRlbS5wcm9wXTtcblxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal07XG4gICAgICAgICAgICB2YXIgdmFsID0gb2JqW2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgdmFsICE9PSBudWxsICYmIHJlZnMuaW5kZXhPZih2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB7IG9iajogb2JqLCBwcm9wOiBrZXkgfTtcbiAgICAgICAgICAgICAgICByZWZzW3JlZnMubGVuZ3RoXSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBhY3RRdWV1ZShxdWV1ZSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG52YXIgaXNSZWdFeHAgPSBmdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufTtcblxudmFyIGlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIob2JqKSB7XG4gICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhIShvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopKTtcbn07XG5cbnZhciBjb21iaW5lID0gZnVuY3Rpb24gY29tYmluZShhLCBiLCBhcnJheUxpbWl0LCBwbGFpbk9iamVjdHMpIHtcbiAgICAvLyBJZiAnYScgaXMgYWxyZWFkeSBhbiBvdmVyZmxvdyBvYmplY3QsIGFkZCB0byBpdFxuICAgIGlmIChpc092ZXJmbG93KGEpKSB7XG4gICAgICAgIHZhciBuZXdJbmRleCA9IGdldE1heEluZGV4KGEpICsgMTtcbiAgICAgICAgYVtuZXdJbmRleF0gPSBiO1xuICAgICAgICBzZXRNYXhJbmRleChhLCBuZXdJbmRleCk7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbXS5jb25jYXQoYSwgYik7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiBhcnJheUxpbWl0KSB7XG4gICAgICAgIHJldHVybiBtYXJrT3ZlcmZsb3coYXJyYXlUb09iamVjdChyZXN1bHQsIHsgcGxhaW5PYmplY3RzOiBwbGFpbk9iamVjdHMgfSksIHJlc3VsdC5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnZhciBtYXliZU1hcCA9IGZ1bmN0aW9uIG1heWJlTWFwKHZhbCwgZm4pIHtcbiAgICBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIHZhciBtYXBwZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIG1hcHBlZFttYXBwZWQubGVuZ3RoXSA9IGZuKHZhbFtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcHBlZDtcbiAgICB9XG4gICAgcmV0dXJuIGZuKHZhbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhcnJheVRvT2JqZWN0OiBhcnJheVRvT2JqZWN0LFxuICAgIGFzc2lnbjogYXNzaWduLFxuICAgIGNvbWJpbmU6IGNvbWJpbmUsXG4gICAgY29tcGFjdDogY29tcGFjdCxcbiAgICBkZWNvZGU6IGRlY29kZSxcbiAgICBlbmNvZGU6IGVuY29kZSxcbiAgICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gICAgaXNPdmVyZmxvdzogaXNPdmVyZmxvdyxcbiAgICBpc1JlZ0V4cDogaXNSZWdFeHAsXG4gICAgbWFya092ZXJmbG93OiBtYXJrT3ZlcmZsb3csXG4gICAgbWF5YmVNYXA6IG1heWJlTWFwLFxuICAgIG1lcmdlOiBtZXJnZVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRTaWRlQ2hhbm5lbCA9IHJlcXVpcmUoJ3NpZGUtY2hhbm5lbCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgYXJyYXlQcmVmaXhHZW5lcmF0b3JzID0ge1xuICAgIGJyYWNrZXRzOiBmdW5jdGlvbiBicmFja2V0cyhwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArICdbXSc7XG4gICAgfSxcbiAgICBjb21tYTogJ2NvbW1hJyxcbiAgICBpbmRpY2VzOiBmdW5jdGlvbiBpbmRpY2VzKHByZWZpeCwga2V5KSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyAnWycgKyBrZXkgKyAnXSc7XG4gICAgfSxcbiAgICByZXBlYXQ6IGZ1bmN0aW9uIHJlcGVhdChwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG52YXIgcHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoO1xudmFyIHB1c2hUb0FycmF5ID0gZnVuY3Rpb24gKGFyciwgdmFsdWVPckFycmF5KSB7XG4gICAgcHVzaC5hcHBseShhcnIsIGlzQXJyYXkodmFsdWVPckFycmF5KSA/IHZhbHVlT3JBcnJheSA6IFt2YWx1ZU9yQXJyYXldKTtcbn07XG5cbnZhciB0b0lTTyA9IERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nO1xuXG52YXIgZGVmYXVsdEZvcm1hdCA9IGZvcm1hdHNbJ2RlZmF1bHQnXTtcbnZhciBkZWZhdWx0cyA9IHtcbiAgICBhZGRRdWVyeVByZWZpeDogZmFsc2UsXG4gICAgYWxsb3dEb3RzOiBmYWxzZSxcbiAgICBhbGxvd0VtcHR5QXJyYXlzOiBmYWxzZSxcbiAgICBhcnJheUZvcm1hdDogJ2luZGljZXMnLFxuICAgIGNoYXJzZXQ6ICd1dGYtOCcsXG4gICAgY2hhcnNldFNlbnRpbmVsOiBmYWxzZSxcbiAgICBjb21tYVJvdW5kVHJpcDogZmFsc2UsXG4gICAgZGVsaW1pdGVyOiAnJicsXG4gICAgZW5jb2RlOiB0cnVlLFxuICAgIGVuY29kZURvdEluS2V5czogZmFsc2UsXG4gICAgZW5jb2RlcjogdXRpbHMuZW5jb2RlLFxuICAgIGVuY29kZVZhbHVlc09ubHk6IGZhbHNlLFxuICAgIGZpbHRlcjogdm9pZCB1bmRlZmluZWQsXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGZvcm1hdHRlcjogZm9ybWF0cy5mb3JtYXR0ZXJzW2RlZmF1bHRGb3JtYXRdLFxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBpbmRpY2VzOiBmYWxzZSxcbiAgICBzZXJpYWxpemVEYXRlOiBmdW5jdGlvbiBzZXJpYWxpemVEYXRlKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRvSVNPLmNhbGwoZGF0ZSk7XG4gICAgfSxcbiAgICBza2lwTnVsbHM6IGZhbHNlLFxuICAgIHN0cmljdE51bGxIYW5kbGluZzogZmFsc2Vcbn07XG5cbnZhciBpc05vbk51bGxpc2hQcmltaXRpdmUgPSBmdW5jdGlvbiBpc05vbk51bGxpc2hQcmltaXRpdmUodikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gJ3N0cmluZydcbiAgICAgICAgfHwgdHlwZW9mIHYgPT09ICdudW1iZXInXG4gICAgICAgIHx8IHR5cGVvZiB2ID09PSAnYm9vbGVhbidcbiAgICAgICAgfHwgdHlwZW9mIHYgPT09ICdzeW1ib2wnXG4gICAgICAgIHx8IHR5cGVvZiB2ID09PSAnYmlnaW50Jztcbn07XG5cbnZhciBzZW50aW5lbCA9IHt9O1xuXG52YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KFxuICAgIG9iamVjdCxcbiAgICBwcmVmaXgsXG4gICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICBjb21tYVJvdW5kVHJpcCxcbiAgICBhbGxvd0VtcHR5QXJyYXlzLFxuICAgIHN0cmljdE51bGxIYW5kbGluZyxcbiAgICBza2lwTnVsbHMsXG4gICAgZW5jb2RlRG90SW5LZXlzLFxuICAgIGVuY29kZXIsXG4gICAgZmlsdGVyLFxuICAgIHNvcnQsXG4gICAgYWxsb3dEb3RzLFxuICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgZm9ybWF0LFxuICAgIGZvcm1hdHRlcixcbiAgICBlbmNvZGVWYWx1ZXNPbmx5LFxuICAgIGNoYXJzZXQsXG4gICAgc2lkZUNoYW5uZWxcbikge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG5cbiAgICB2YXIgdG1wU2MgPSBzaWRlQ2hhbm5lbDtcbiAgICB2YXIgc3RlcCA9IDA7XG4gICAgdmFyIGZpbmRGbGFnID0gZmFsc2U7XG4gICAgd2hpbGUgKCh0bXBTYyA9IHRtcFNjLmdldChzZW50aW5lbCkpICE9PSB2b2lkIHVuZGVmaW5lZCAmJiAhZmluZEZsYWcpIHtcbiAgICAgICAgLy8gV2hlcmUgb2JqZWN0IGxhc3QgYXBwZWFyZWQgaW4gdGhlIHJlZiB0cmVlXG4gICAgICAgIHZhciBwb3MgPSB0bXBTYy5nZXQob2JqZWN0KTtcbiAgICAgICAgc3RlcCArPSAxO1xuICAgICAgICBpZiAodHlwZW9mIHBvcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmIChwb3MgPT09IHN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ3ljbGljIG9iamVjdCB2YWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaW5kRmxhZyA9IHRydWU7IC8vIEJyZWFrIHdoaWxlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0bXBTYy5nZXQoc2VudGluZWwpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3RlcCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvYmogPSBmaWx0ZXIocHJlZml4LCBvYmopO1xuICAgIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvYmogPSBzZXJpYWxpemVEYXRlKG9iaik7XG4gICAgfSBlbHNlIGlmIChnZW5lcmF0ZUFycmF5UHJlZml4ID09PSAnY29tbWEnICYmIGlzQXJyYXkob2JqKSkge1xuICAgICAgICBvYmogPSB1dGlscy5tYXliZU1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVEYXRlKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgICAgICBpZiAoc3RyaWN0TnVsbEhhbmRsaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyKGVuY29kZXIgJiYgIWVuY29kZVZhbHVlc09ubHkgPyBlbmNvZGVyKHByZWZpeCwgZGVmYXVsdHMuZW5jb2RlciwgY2hhcnNldCwgJ2tleScsIGZvcm1hdCkgOiBwcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9uTnVsbGlzaFByaW1pdGl2ZShvYmopIHx8IHV0aWxzLmlzQnVmZmVyKG9iaikpIHtcbiAgICAgICAgaWYgKGVuY29kZXIpIHtcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IGVuY29kZVZhbHVlc09ubHkgPyBwcmVmaXggOiBlbmNvZGVyKHByZWZpeCwgZGVmYXVsdHMuZW5jb2RlciwgY2hhcnNldCwgJ2tleScsIGZvcm1hdCk7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihrZXlWYWx1ZSkgKyAnPScgKyBmb3JtYXR0ZXIoZW5jb2RlcihvYmosIGRlZmF1bHRzLmVuY29kZXIsIGNoYXJzZXQsICd2YWx1ZScsIGZvcm1hdCkpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihwcmVmaXgpICsgJz0nICsgZm9ybWF0dGVyKFN0cmluZyhvYmopKV07XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuXG4gICAgdmFyIG9iaktleXM7XG4gICAgaWYgKGdlbmVyYXRlQXJyYXlQcmVmaXggPT09ICdjb21tYScgJiYgaXNBcnJheShvYmopKSB7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gam9pbiBlbGVtZW50cyBpblxuICAgICAgICBpZiAoZW5jb2RlVmFsdWVzT25seSAmJiBlbmNvZGVyKSB7XG4gICAgICAgICAgICBvYmogPSB1dGlscy5tYXliZU1hcChvYmosIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IHYgOiBlbmNvZGVyKHYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgb2JqS2V5cyA9IFt7IHZhbHVlOiBvYmoubGVuZ3RoID4gMCA/IG9iai5qb2luKCcsJykgfHwgbnVsbCA6IHZvaWQgdW5kZWZpbmVkIH1dO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBvYmpLZXlzID0gc29ydCA/IGtleXMuc29ydChzb3J0KSA6IGtleXM7XG4gICAgfVxuXG4gICAgdmFyIGVuY29kZWRQcmVmaXggPSBlbmNvZGVEb3RJbktleXMgPyBTdHJpbmcocHJlZml4KS5yZXBsYWNlKC9cXC4vZywgJyUyRScpIDogU3RyaW5nKHByZWZpeCk7XG5cbiAgICB2YXIgYWRqdXN0ZWRQcmVmaXggPSBjb21tYVJvdW5kVHJpcCAmJiBpc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCA9PT0gMSA/IGVuY29kZWRQcmVmaXggKyAnW10nIDogZW5jb2RlZFByZWZpeDtcblxuICAgIGlmIChhbGxvd0VtcHR5QXJyYXlzICYmIGlzQXJyYXkob2JqKSAmJiBvYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBhZGp1c3RlZFByZWZpeCArICdbXSc7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBvYmpLZXlzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2pdO1xuICAgICAgICB2YXIgdmFsdWUgPSB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyAmJiBrZXkgJiYgdHlwZW9mIGtleS52YWx1ZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8ga2V5LnZhbHVlXG4gICAgICAgICAgICA6IG9ialtrZXldO1xuXG4gICAgICAgIGlmIChza2lwTnVsbHMgJiYgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVuY29kZWRLZXkgPSBhbGxvd0RvdHMgJiYgZW5jb2RlRG90SW5LZXlzID8gU3RyaW5nKGtleSkucmVwbGFjZSgvXFwuL2csICclMkUnKSA6IFN0cmluZyhrZXkpO1xuICAgICAgICB2YXIga2V5UHJlZml4ID0gaXNBcnJheShvYmopXG4gICAgICAgICAgICA/IHR5cGVvZiBnZW5lcmF0ZUFycmF5UHJlZml4ID09PSAnZnVuY3Rpb24nID8gZ2VuZXJhdGVBcnJheVByZWZpeChhZGp1c3RlZFByZWZpeCwgZW5jb2RlZEtleSkgOiBhZGp1c3RlZFByZWZpeFxuICAgICAgICAgICAgOiBhZGp1c3RlZFByZWZpeCArIChhbGxvd0RvdHMgPyAnLicgKyBlbmNvZGVkS2V5IDogJ1snICsgZW5jb2RlZEtleSArICddJyk7XG5cbiAgICAgICAgc2lkZUNoYW5uZWwuc2V0KG9iamVjdCwgc3RlcCk7XG4gICAgICAgIHZhciB2YWx1ZVNpZGVDaGFubmVsID0gZ2V0U2lkZUNoYW5uZWwoKTtcbiAgICAgICAgdmFsdWVTaWRlQ2hhbm5lbC5zZXQoc2VudGluZWwsIHNpZGVDaGFubmVsKTtcbiAgICAgICAgcHVzaFRvQXJyYXkodmFsdWVzLCBzdHJpbmdpZnkoXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGtleVByZWZpeCxcbiAgICAgICAgICAgIGdlbmVyYXRlQXJyYXlQcmVmaXgsXG4gICAgICAgICAgICBjb21tYVJvdW5kVHJpcCxcbiAgICAgICAgICAgIGFsbG93RW1wdHlBcnJheXMsXG4gICAgICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICBza2lwTnVsbHMsXG4gICAgICAgICAgICBlbmNvZGVEb3RJbktleXMsXG4gICAgICAgICAgICBnZW5lcmF0ZUFycmF5UHJlZml4ID09PSAnY29tbWEnICYmIGVuY29kZVZhbHVlc09ubHkgJiYgaXNBcnJheShvYmopID8gbnVsbCA6IGVuY29kZXIsXG4gICAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgYWxsb3dEb3RzLFxuICAgICAgICAgICAgc2VyaWFsaXplRGF0ZSxcbiAgICAgICAgICAgIGZvcm1hdCxcbiAgICAgICAgICAgIGZvcm1hdHRlcixcbiAgICAgICAgICAgIGVuY29kZVZhbHVlc09ubHksXG4gICAgICAgICAgICBjaGFyc2V0LFxuICAgICAgICAgICAgdmFsdWVTaWRlQ2hhbm5lbFxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTtcblxudmFyIG5vcm1hbGl6ZVN0cmluZ2lmeU9wdGlvbnMgPSBmdW5jdGlvbiBub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zKG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5hbGxvd0VtcHR5QXJyYXlzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5hbGxvd0VtcHR5QXJyYXlzICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYGFsbG93RW1wdHlBcnJheXNgIG9wdGlvbiBjYW4gb25seSBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCwgd2hlbiBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5lbmNvZGVEb3RJbktleXMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmVuY29kZURvdEluS2V5cyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BlbmNvZGVEb3RJbktleXNgIG9wdGlvbiBjYW4gb25seSBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCwgd2hlbiBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmVuY29kZXIgIT09IG51bGwgJiYgdHlwZW9mIG9wdHMuZW5jb2RlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuZW5jb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFbmNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIHZhciBjaGFyc2V0ID0gb3B0cy5jaGFyc2V0IHx8IGRlZmF1bHRzLmNoYXJzZXQ7XG4gICAgaWYgKHR5cGVvZiBvcHRzLmNoYXJzZXQgIT09ICd1bmRlZmluZWQnICYmIG9wdHMuY2hhcnNldCAhPT0gJ3V0Zi04JyAmJiBvcHRzLmNoYXJzZXQgIT09ICdpc28tODg1OS0xJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgY2hhcnNldCBvcHRpb24gbXVzdCBiZSBlaXRoZXIgdXRmLTgsIGlzby04ODU5LTEsIG9yIHVuZGVmaW5lZCcpO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXQgPSBmb3JtYXRzWydkZWZhdWx0J107XG4gICAgaWYgKHR5cGVvZiBvcHRzLmZvcm1hdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKCFoYXMuY2FsbChmb3JtYXRzLmZvcm1hdHRlcnMsIG9wdHMuZm9ybWF0KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBmb3JtYXQgb3B0aW9uIHByb3ZpZGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIGZvcm1hdCA9IG9wdHMuZm9ybWF0O1xuICAgIH1cbiAgICB2YXIgZm9ybWF0dGVyID0gZm9ybWF0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG5cbiAgICB2YXIgZmlsdGVyID0gZGVmYXVsdHMuZmlsdGVyO1xuICAgIGlmICh0eXBlb2Ygb3B0cy5maWx0ZXIgPT09ICdmdW5jdGlvbicgfHwgaXNBcnJheShvcHRzLmZpbHRlcikpIHtcbiAgICAgICAgZmlsdGVyID0gb3B0cy5maWx0ZXI7XG4gICAgfVxuXG4gICAgdmFyIGFycmF5Rm9ybWF0O1xuICAgIGlmIChvcHRzLmFycmF5Rm9ybWF0IGluIGFycmF5UHJlZml4R2VuZXJhdG9ycykge1xuICAgICAgICBhcnJheUZvcm1hdCA9IG9wdHMuYXJyYXlGb3JtYXQ7XG4gICAgfSBlbHNlIGlmICgnaW5kaWNlcycgaW4gb3B0cykge1xuICAgICAgICBhcnJheUZvcm1hdCA9IG9wdHMuaW5kaWNlcyA/ICdpbmRpY2VzJyA6ICdyZXBlYXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gZGVmYXVsdHMuYXJyYXlGb3JtYXQ7XG4gICAgfVxuXG4gICAgaWYgKCdjb21tYVJvdW5kVHJpcCcgaW4gb3B0cyAmJiB0eXBlb2Ygb3B0cy5jb21tYVJvdW5kVHJpcCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Bjb21tYVJvdW5kVHJpcGAgbXVzdCBiZSBhIGJvb2xlYW4sIG9yIGFic2VudCcpO1xuICAgIH1cblxuICAgIHZhciBhbGxvd0RvdHMgPSB0eXBlb2Ygb3B0cy5hbGxvd0RvdHMgPT09ICd1bmRlZmluZWQnID8gb3B0cy5lbmNvZGVEb3RJbktleXMgPT09IHRydWUgPyB0cnVlIDogZGVmYXVsdHMuYWxsb3dEb3RzIDogISFvcHRzLmFsbG93RG90cztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFkZFF1ZXJ5UHJlZml4OiB0eXBlb2Ygb3B0cy5hZGRRdWVyeVByZWZpeCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5hZGRRdWVyeVByZWZpeCA6IGRlZmF1bHRzLmFkZFF1ZXJ5UHJlZml4LFxuICAgICAgICBhbGxvd0RvdHM6IGFsbG93RG90cyxcbiAgICAgICAgYWxsb3dFbXB0eUFycmF5czogdHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyA9PT0gJ2Jvb2xlYW4nID8gISFvcHRzLmFsbG93RW1wdHlBcnJheXMgOiBkZWZhdWx0cy5hbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICBhcnJheUZvcm1hdDogYXJyYXlGb3JtYXQsXG4gICAgICAgIGNoYXJzZXQ6IGNoYXJzZXQsXG4gICAgICAgIGNoYXJzZXRTZW50aW5lbDogdHlwZW9mIG9wdHMuY2hhcnNldFNlbnRpbmVsID09PSAnYm9vbGVhbicgPyBvcHRzLmNoYXJzZXRTZW50aW5lbCA6IGRlZmF1bHRzLmNoYXJzZXRTZW50aW5lbCxcbiAgICAgICAgY29tbWFSb3VuZFRyaXA6ICEhb3B0cy5jb21tYVJvdW5kVHJpcCxcbiAgICAgICAgZGVsaW1pdGVyOiB0eXBlb2Ygb3B0cy5kZWxpbWl0ZXIgPT09ICd1bmRlZmluZWQnID8gZGVmYXVsdHMuZGVsaW1pdGVyIDogb3B0cy5kZWxpbWl0ZXIsXG4gICAgICAgIGVuY29kZTogdHlwZW9mIG9wdHMuZW5jb2RlID09PSAnYm9vbGVhbicgPyBvcHRzLmVuY29kZSA6IGRlZmF1bHRzLmVuY29kZSxcbiAgICAgICAgZW5jb2RlRG90SW5LZXlzOiB0eXBlb2Ygb3B0cy5lbmNvZGVEb3RJbktleXMgPT09ICdib29sZWFuJyA/IG9wdHMuZW5jb2RlRG90SW5LZXlzIDogZGVmYXVsdHMuZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICBlbmNvZGVyOiB0eXBlb2Ygb3B0cy5lbmNvZGVyID09PSAnZnVuY3Rpb24nID8gb3B0cy5lbmNvZGVyIDogZGVmYXVsdHMuZW5jb2RlcixcbiAgICAgICAgZW5jb2RlVmFsdWVzT25seTogdHlwZW9mIG9wdHMuZW5jb2RlVmFsdWVzT25seSA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5lbmNvZGVWYWx1ZXNPbmx5IDogZGVmYXVsdHMuZW5jb2RlVmFsdWVzT25seSxcbiAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgICBmb3JtYXR0ZXI6IGZvcm1hdHRlcixcbiAgICAgICAgc2VyaWFsaXplRGF0ZTogdHlwZW9mIG9wdHMuc2VyaWFsaXplRGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9wdHMuc2VyaWFsaXplRGF0ZSA6IGRlZmF1bHRzLnNlcmlhbGl6ZURhdGUsXG4gICAgICAgIHNraXBOdWxsczogdHlwZW9mIG9wdHMuc2tpcE51bGxzID09PSAnYm9vbGVhbicgPyBvcHRzLnNraXBOdWxscyA6IGRlZmF1bHRzLnNraXBOdWxscyxcbiAgICAgICAgc29ydDogdHlwZW9mIG9wdHMuc29ydCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdHMuc29ydCA6IG51bGwsXG4gICAgICAgIHN0cmljdE51bGxIYW5kbGluZzogdHlwZW9mIG9wdHMuc3RyaWN0TnVsbEhhbmRsaW5nID09PSAnYm9vbGVhbicgPyBvcHRzLnN0cmljdE51bGxIYW5kbGluZyA6IGRlZmF1bHRzLnN0cmljdE51bGxIYW5kbGluZ1xuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG9wdHMpIHtcbiAgICB2YXIgb2JqID0gb2JqZWN0O1xuICAgIHZhciBvcHRpb25zID0gbm9ybWFsaXplU3RyaW5naWZ5T3B0aW9ucyhvcHRzKTtcblxuICAgIHZhciBvYmpLZXlzO1xuICAgIHZhciBmaWx0ZXI7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICBvYmogPSBmaWx0ZXIoJycsIG9iaik7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9wdGlvbnMuZmlsdGVyKSkge1xuICAgICAgICBmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgb2JqS2V5cyA9IGZpbHRlcjtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgdmFyIGdlbmVyYXRlQXJyYXlQcmVmaXggPSBhcnJheVByZWZpeEdlbmVyYXRvcnNbb3B0aW9ucy5hcnJheUZvcm1hdF07XG4gICAgdmFyIGNvbW1hUm91bmRUcmlwID0gZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2NvbW1hJyAmJiBvcHRpb25zLmNvbW1hUm91bmRUcmlwO1xuXG4gICAgaWYgKCFvYmpLZXlzKSB7XG4gICAgICAgIG9iaktleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNvcnQpIHtcbiAgICAgICAgb2JqS2V5cy5zb3J0KG9wdGlvbnMuc29ydCk7XG4gICAgfVxuXG4gICAgdmFyIHNpZGVDaGFubmVsID0gZ2V0U2lkZUNoYW5uZWwoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IG9iaktleXNbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgICBpZiAob3B0aW9ucy5za2lwTnVsbHMgJiYgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHB1c2hUb0FycmF5KGtleXMsIHN0cmluZ2lmeShcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgIGNvbW1hUm91bmRUcmlwLFxuICAgICAgICAgICAgb3B0aW9ucy5hbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICBvcHRpb25zLnNraXBOdWxscyxcbiAgICAgICAgICAgIG9wdGlvbnMuZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5lbmNvZGUgPyBvcHRpb25zLmVuY29kZXIgOiBudWxsLFxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLnNvcnQsXG4gICAgICAgICAgICBvcHRpb25zLmFsbG93RG90cyxcbiAgICAgICAgICAgIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbnMuZm9ybWF0LFxuICAgICAgICAgICAgb3B0aW9ucy5mb3JtYXR0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLmVuY29kZVZhbHVlc09ubHksXG4gICAgICAgICAgICBvcHRpb25zLmNoYXJzZXQsXG4gICAgICAgICAgICBzaWRlQ2hhbm5lbFxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICB2YXIgam9pbmVkID0ga2V5cy5qb2luKG9wdGlvbnMuZGVsaW1pdGVyKTtcbiAgICB2YXIgcHJlZml4ID0gb3B0aW9ucy5hZGRRdWVyeVByZWZpeCA9PT0gdHJ1ZSA/ICc/JyA6ICcnO1xuXG4gICAgaWYgKG9wdGlvbnMuY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNoYXJzZXQgPT09ICdpc28tODg1OS0xJykge1xuICAgICAgICAgICAgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCcmIzEwMDAzOycpLCB0aGUgXCJudW1lcmljIGVudGl0eVwiIHJlcHJlc2VudGF0aW9uIG9mIGEgY2hlY2ttYXJrXG4gICAgICAgICAgICBwcmVmaXggKz0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0InICsgb3B0aW9ucy5kZWxpbWl0ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbmNvZGVVUklDb21wb25lbnQoJ1x1MjcxMycpXG4gICAgICAgICAgICBwcmVmaXggKz0gJ3V0Zjg9JUUyJTlDJTkzJyArIG9wdGlvbnMuZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpvaW5lZC5sZW5ndGggPiAwID8gcHJlZml4ICsgam9pbmVkIDogJyc7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGFsbG93RG90czogZmFsc2UsXG4gICAgYWxsb3dFbXB0eUFycmF5czogZmFsc2UsXG4gICAgYWxsb3dQcm90b3R5cGVzOiBmYWxzZSxcbiAgICBhbGxvd1NwYXJzZTogZmFsc2UsXG4gICAgYXJyYXlMaW1pdDogMjAsXG4gICAgY2hhcnNldDogJ3V0Zi04JyxcbiAgICBjaGFyc2V0U2VudGluZWw6IGZhbHNlLFxuICAgIGNvbW1hOiBmYWxzZSxcbiAgICBkZWNvZGVEb3RJbktleXM6IGZhbHNlLFxuICAgIGRlY29kZXI6IHV0aWxzLmRlY29kZSxcbiAgICBkZWxpbWl0ZXI6ICcmJyxcbiAgICBkZXB0aDogNSxcbiAgICBkdXBsaWNhdGVzOiAnY29tYmluZScsXG4gICAgaWdub3JlUXVlcnlQcmVmaXg6IGZhbHNlLFxuICAgIGludGVycHJldE51bWVyaWNFbnRpdGllczogZmFsc2UsXG4gICAgcGFyYW1ldGVyTGltaXQ6IDEwMDAsXG4gICAgcGFyc2VBcnJheXM6IHRydWUsXG4gICAgcGxhaW5PYmplY3RzOiBmYWxzZSxcbiAgICBzdHJpY3REZXB0aDogZmFsc2UsXG4gICAgc3RyaWN0TWVyZ2U6IHRydWUsXG4gICAgc3RyaWN0TnVsbEhhbmRsaW5nOiBmYWxzZSxcbiAgICB0aHJvd09uTGltaXRFeGNlZWRlZDogZmFsc2Vcbn07XG5cbnZhciBpbnRlcnByZXROdW1lcmljRW50aXRpZXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIyhcXGQrKTsvZywgZnVuY3Rpb24gKCQwLCBudW1iZXJTdHIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobnVtYmVyU3RyLCAxMCkpO1xuICAgIH0pO1xufTtcblxudmFyIHBhcnNlQXJyYXlWYWx1ZSA9IGZ1bmN0aW9uICh2YWwsIG9wdGlvbnMsIGN1cnJlbnRBcnJheUxlbmd0aCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5jb21tYSAmJiB2YWwuaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5zcGxpdCgnLCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRocm93T25MaW1pdEV4Y2VlZGVkICYmIGN1cnJlbnRBcnJheUxlbmd0aCA+PSBvcHRpb25zLmFycmF5TGltaXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0FycmF5IGxpbWl0IGV4Y2VlZGVkLiBPbmx5ICcgKyBvcHRpb25zLmFycmF5TGltaXQgKyAnIGVsZW1lbnQnICsgKG9wdGlvbnMuYXJyYXlMaW1pdCA9PT0gMSA/ICcnIDogJ3MnKSArICcgYWxsb3dlZCBpbiBhbiBhcnJheS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xufTtcblxuLy8gVGhpcyBpcyB3aGF0IGJyb3dzZXJzIHdpbGwgc3VibWl0IHdoZW4gdGhlIFx1MjcxMyBjaGFyYWN0ZXIgb2NjdXJzIGluIGFuXG4vLyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQgYm9keSBhbmQgdGhlIGVuY29kaW5nIG9mIHRoZSBwYWdlIGNvbnRhaW5pbmdcbi8vIHRoZSBmb3JtIGlzIGlzby04ODU5LTEsIG9yIHdoZW4gdGhlIHN1Ym1pdHRlZCBmb3JtIGhhcyBhbiBhY2NlcHQtY2hhcnNldFxuLy8gYXR0cmlidXRlIG9mIGlzby04ODU5LTEuIFByZXN1bWFibHkgYWxzbyB3aXRoIG90aGVyIGNoYXJzZXRzIHRoYXQgZG8gbm90IGNvbnRhaW5cbi8vIHRoZSBcdTI3MTMgY2hhcmFjdGVyLCBzdWNoIGFzIHVzLWFzY2lpLlxudmFyIGlzb1NlbnRpbmVsID0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0InOyAvLyBlbmNvZGVVUklDb21wb25lbnQoJyYjMTAwMDM7JylcblxuLy8gVGhlc2UgYXJlIHRoZSBwZXJjZW50LWVuY29kZWQgdXRmLTggb2N0ZXRzIHJlcHJlc2VudGluZyBhIGNoZWNrbWFyaywgaW5kaWNhdGluZyB0aGF0IHRoZSByZXF1ZXN0IGFjdHVhbGx5IGlzIHV0Zi04IGVuY29kZWQuXG52YXIgY2hhcnNldFNlbnRpbmVsID0gJ3V0Zjg9JUUyJTlDJTkzJzsgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCdcdTI3MTMnKVxuXG52YXIgcGFyc2VWYWx1ZXMgPSBmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nVmFsdWVzKHN0ciwgb3B0aW9ucykge1xuICAgIHZhciBvYmogPSB7IF9fcHJvdG9fXzogbnVsbCB9O1xuXG4gICAgdmFyIGNsZWFuU3RyID0gb3B0aW9ucy5pZ25vcmVRdWVyeVByZWZpeCA/IHN0ci5yZXBsYWNlKC9eXFw/LywgJycpIDogc3RyO1xuICAgIGNsZWFuU3RyID0gY2xlYW5TdHIucmVwbGFjZSgvJTVCL2dpLCAnWycpLnJlcGxhY2UoLyU1RC9naSwgJ10nKTtcblxuICAgIHZhciBsaW1pdCA9IG9wdGlvbnMucGFyYW1ldGVyTGltaXQgPT09IEluZmluaXR5ID8gdm9pZCB1bmRlZmluZWQgOiBvcHRpb25zLnBhcmFtZXRlckxpbWl0O1xuICAgIHZhciBwYXJ0cyA9IGNsZWFuU3RyLnNwbGl0KFxuICAgICAgICBvcHRpb25zLmRlbGltaXRlcixcbiAgICAgICAgb3B0aW9ucy50aHJvd09uTGltaXRFeGNlZWRlZCAmJiB0eXBlb2YgbGltaXQgIT09ICd1bmRlZmluZWQnID8gbGltaXQgKyAxIDogbGltaXRcbiAgICApO1xuXG4gICAgaWYgKG9wdGlvbnMudGhyb3dPbkxpbWl0RXhjZWVkZWQgJiYgdHlwZW9mIGxpbWl0ICE9PSAndW5kZWZpbmVkJyAmJiBwYXJ0cy5sZW5ndGggPiBsaW1pdCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignUGFyYW1ldGVyIGxpbWl0IGV4Y2VlZGVkLiBPbmx5ICcgKyBsaW1pdCArICcgcGFyYW1ldGVyJyArIChsaW1pdCA9PT0gMSA/ICcnIDogJ3MnKSArICcgYWxsb3dlZC4nKTtcbiAgICB9XG5cbiAgICB2YXIgc2tpcEluZGV4ID0gLTE7IC8vIEtlZXAgdHJhY2sgb2Ygd2hlcmUgdGhlIHV0Zjggc2VudGluZWwgd2FzIGZvdW5kXG4gICAgdmFyIGk7XG5cbiAgICB2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldDtcbiAgICBpZiAob3B0aW9ucy5jaGFyc2V0U2VudGluZWwpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocGFydHNbaV0uaW5kZXhPZigndXRmOD0nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0c1tpXSA9PT0gY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAndXRmLTgnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV0gPT09IGlzb1NlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAnaXNvLTg4NTktMSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNraXBJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaSA9IHBhcnRzLmxlbmd0aDsgLy8gVGhlIGVzbGludCBzZXR0aW5ncyBkbyBub3QgYWxsb3cgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGkgPT09IHNraXBJbmRleCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcblxuICAgICAgICB2YXIgYnJhY2tldEVxdWFsc1BvcyA9IHBhcnQuaW5kZXhPZignXT0nKTtcbiAgICAgICAgdmFyIHBvcyA9IGJyYWNrZXRFcXVhbHNQb3MgPT09IC0xID8gcGFydC5pbmRleE9mKCc9JykgOiBicmFja2V0RXF1YWxzUG9zICsgMTtcblxuICAgICAgICB2YXIga2V5O1xuICAgICAgICB2YXIgdmFsO1xuICAgICAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICAgICAga2V5ID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQsIGRlZmF1bHRzLmRlY29kZXIsIGNoYXJzZXQsICdrZXknKTtcbiAgICAgICAgICAgIHZhbCA9IG9wdGlvbnMuc3RyaWN0TnVsbEhhbmRsaW5nID8gbnVsbCA6ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5ID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQuc2xpY2UoMCwgcG9zKSwgZGVmYXVsdHMuZGVjb2RlciwgY2hhcnNldCwgJ2tleScpO1xuXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdXRpbHMubWF5YmVNYXAoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQXJyYXlWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQuc2xpY2UocG9zICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBcnJheShvYmpba2V5XSkgPyBvYmpba2V5XS5sZW5ndGggOiAwXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlbmNvZGVkVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5kZWNvZGVyKGVuY29kZWRWYWwsIGRlZmF1bHRzLmRlY29kZXIsIGNoYXJzZXQsICd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWwgJiYgb3B0aW9ucy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMgJiYgY2hhcnNldCA9PT0gJ2lzby04ODU5LTEnKSB7XG4gICAgICAgICAgICB2YWwgPSBpbnRlcnByZXROdW1lcmljRW50aXRpZXMoU3RyaW5nKHZhbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnQuaW5kZXhPZignW109JykgPiAtMSkge1xuICAgICAgICAgICAgdmFsID0gaXNBcnJheSh2YWwpID8gW3ZhbF0gOiB2YWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5jb21tYSAmJiBpc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA+IG9wdGlvbnMuYXJyYXlMaW1pdCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGhyb3dPbkxpbWl0RXhjZWVkZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXJyYXkgbGltaXQgZXhjZWVkZWQuIE9ubHkgJyArIG9wdGlvbnMuYXJyYXlMaW1pdCArICcgZWxlbWVudCcgKyAob3B0aW9ucy5hcnJheUxpbWl0ID09PSAxID8gJycgOiAncycpICsgJyBhbGxvd2VkIGluIGFuIGFycmF5LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsID0gdXRpbHMuY29tYmluZShbXSwgdmFsLCBvcHRpb25zLmFycmF5TGltaXQsIG9wdGlvbnMucGxhaW5PYmplY3RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBleGlzdGluZyA9IGhhcy5jYWxsKG9iaiwga2V5KTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZyAmJiAob3B0aW9ucy5kdXBsaWNhdGVzID09PSAnY29tYmluZScgfHwgcGFydC5pbmRleE9mKCdbXT0nKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdXRpbHMuY29tYmluZShcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5hcnJheUxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWluT2JqZWN0c1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFleGlzdGluZyB8fCBvcHRpb25zLmR1cGxpY2F0ZXMgPT09ICdsYXN0Jykge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBwYXJzZU9iamVjdCA9IGZ1bmN0aW9uIChjaGFpbiwgdmFsLCBvcHRpb25zLCB2YWx1ZXNQYXJzZWQpIHtcbiAgICB2YXIgY3VycmVudEFycmF5TGVuZ3RoID0gMDtcbiAgICBpZiAoY2hhaW4ubGVuZ3RoID4gMCAmJiBjaGFpbltjaGFpbi5sZW5ndGggLSAxXSA9PT0gJ1tdJykge1xuICAgICAgICB2YXIgcGFyZW50S2V5ID0gY2hhaW4uc2xpY2UoMCwgLTEpLmpvaW4oJycpO1xuICAgICAgICBjdXJyZW50QXJyYXlMZW5ndGggPSBBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsW3BhcmVudEtleV0gPyB2YWxbcGFyZW50S2V5XS5sZW5ndGggOiAwO1xuICAgIH1cblxuICAgIHZhciBsZWFmID0gdmFsdWVzUGFyc2VkID8gdmFsIDogcGFyc2VBcnJheVZhbHVlKHZhbCwgb3B0aW9ucywgY3VycmVudEFycmF5TGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSBjaGFpbi5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgb2JqO1xuICAgICAgICB2YXIgcm9vdCA9IGNoYWluW2ldO1xuXG4gICAgICAgIGlmIChyb290ID09PSAnW10nICYmIG9wdGlvbnMucGFyc2VBcnJheXMpIHtcbiAgICAgICAgICAgIGlmICh1dGlscy5pc092ZXJmbG93KGxlYWYpKSB7XG4gICAgICAgICAgICAgICAgLy8gbGVhZiBpcyBhbHJlYWR5IGFuIG92ZXJmbG93IG9iamVjdCwgcHJlc2VydmUgaXRcbiAgICAgICAgICAgICAgICBvYmogPSBsZWFmO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmogPSBvcHRpb25zLmFsbG93RW1wdHlBcnJheXMgJiYgKGxlYWYgPT09ICcnIHx8IChvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyAmJiBsZWFmID09PSBudWxsKSlcbiAgICAgICAgICAgICAgICAgICAgPyBbXVxuICAgICAgICAgICAgICAgICAgICA6IHV0aWxzLmNvbWJpbmUoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlYWYsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmFycmF5TGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWluT2JqZWN0c1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqID0gb3B0aW9ucy5wbGFpbk9iamVjdHMgPyB7IF9fcHJvdG9fXzogbnVsbCB9IDoge307XG4gICAgICAgICAgICB2YXIgY2xlYW5Sb290ID0gcm9vdC5jaGFyQXQoMCkgPT09ICdbJyAmJiByb290LmNoYXJBdChyb290Lmxlbmd0aCAtIDEpID09PSAnXScgPyByb290LnNsaWNlKDEsIC0xKSA6IHJvb3Q7XG4gICAgICAgICAgICB2YXIgZGVjb2RlZFJvb3QgPSBvcHRpb25zLmRlY29kZURvdEluS2V5cyA/IGNsZWFuUm9vdC5yZXBsYWNlKC8lMkUvZywgJy4nKSA6IGNsZWFuUm9vdDtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KGRlY29kZWRSb290LCAxMCk7XG4gICAgICAgICAgICB2YXIgaXNWYWxpZEFycmF5SW5kZXggPSAhaXNOYU4oaW5kZXgpXG4gICAgICAgICAgICAgICAgJiYgcm9vdCAhPT0gZGVjb2RlZFJvb3RcbiAgICAgICAgICAgICAgICAmJiBTdHJpbmcoaW5kZXgpID09PSBkZWNvZGVkUm9vdFxuICAgICAgICAgICAgICAgICYmIGluZGV4ID49IDBcbiAgICAgICAgICAgICAgICAmJiBvcHRpb25zLnBhcnNlQXJyYXlzO1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnBhcnNlQXJyYXlzICYmIGRlY29kZWRSb290ID09PSAnJykge1xuICAgICAgICAgICAgICAgIG9iaiA9IHsgMDogbGVhZiB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1ZhbGlkQXJyYXlJbmRleCAmJiBpbmRleCA8IG9wdGlvbnMuYXJyYXlMaW1pdCkge1xuICAgICAgICAgICAgICAgIG9iaiA9IFtdO1xuICAgICAgICAgICAgICAgIG9ialtpbmRleF0gPSBsZWFmO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1ZhbGlkQXJyYXlJbmRleCAmJiBvcHRpb25zLnRocm93T25MaW1pdEV4Y2VlZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0FycmF5IGxpbWl0IGV4Y2VlZGVkLiBPbmx5ICcgKyBvcHRpb25zLmFycmF5TGltaXQgKyAnIGVsZW1lbnQnICsgKG9wdGlvbnMuYXJyYXlMaW1pdCA9PT0gMSA/ICcnIDogJ3MnKSArICcgYWxsb3dlZCBpbiBhbiBhcnJheS4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNWYWxpZEFycmF5SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBvYmpbaW5kZXhdID0gbGVhZjtcbiAgICAgICAgICAgICAgICB1dGlscy5tYXJrT3ZlcmZsb3cob2JqLCBpbmRleCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlY29kZWRSb290ICE9PSAnX19wcm90b19fJykge1xuICAgICAgICAgICAgICAgIG9ialtkZWNvZGVkUm9vdF0gPSBsZWFmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGVhZiA9IG9iajtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVhZjtcbn07XG5cbi8vIFNwbGl0IGEga2V5IGxpa2UgXCJhW2JdW2NbXV1cIiBpbnRvIFsnYScsICdbYl0nLCAnW2NbXV0nXSB3aGlsZSBwcmVzZXJ2aW5nXG4vLyBxcyBwYXJzZSBzZW1hbnRpY3MgZm9yIGRlcHRoL3Byb3RvdHlwZSBndWFyZHMuXG52YXIgc3BsaXRLZXlJbnRvU2VnbWVudHMgPSBmdW5jdGlvbiBzcGxpdEtleUludG9TZWdtZW50cyhvcmlnaW5hbEtleSwgb3B0aW9ucykge1xuICAgIHZhciBrZXkgPSBvcHRpb25zLmFsbG93RG90cyA/IG9yaWdpbmFsS2V5LnJlcGxhY2UoL1xcLihbXi5bXSspL2csICdbJDFdJykgOiBvcmlnaW5hbEtleTtcblxuICAgIC8vIGRlcHRoIDw9IDAga2VlcHMgdGhlIHdob2xlIGtleSBhcyBvbmUgc2VnbWVudFxuICAgIGlmIChvcHRpb25zLmRlcHRoIDw9IDApIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBrZXkpKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtrZXldO1xuICAgIH1cblxuICAgIHZhciBzZWdtZW50cyA9IFtdO1xuXG4gICAgLy8gcGFyZW50IGJlZm9yZSB0aGUgZmlyc3QgJ1snIChtYXkgYmUgZW1wdHkgaWYga2V5IHN0YXJ0cyB3aXRoICdbJylcbiAgICB2YXIgZmlyc3QgPSBrZXkuaW5kZXhPZignWycpO1xuICAgIHZhciBwYXJlbnQgPSBmaXJzdCA+PSAwID8ga2V5LnNsaWNlKDAsIGZpcnN0KSA6IGtleTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5wbGFpbk9iamVjdHMgJiYgaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgcGFyZW50KSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93UHJvdG90eXBlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aF0gPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG4gPSBrZXkubGVuZ3RoO1xuICAgIHZhciBvcGVuID0gZmlyc3Q7XG4gICAgdmFyIGNvbGxlY3RlZCA9IDA7XG5cbiAgICB3aGlsZSAob3BlbiA+PSAwICYmIGNvbGxlY3RlZCA8IG9wdGlvbnMuZGVwdGgpIHtcbiAgICAgICAgdmFyIGxldmVsID0gMTtcbiAgICAgICAgdmFyIGkgPSBvcGVuICsgMTtcbiAgICAgICAgdmFyIGNsb3NlID0gLTE7XG5cbiAgICAgICAgLy8gYmFsYW5jZSBuZXN0ZWQgJ1snIGFuZCAnXScgaW5zaWRlIHRoaXMgYnJhY2tldCBncm91cCB1c2luZyBhIG5lc3RpbmcgbGV2ZWwgY291bnRlclxuICAgICAgICB3aGlsZSAoaSA8IG4gJiYgY2xvc2UgPCAwKSB7XG4gICAgICAgICAgICB2YXIgY3UgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGlmIChjdSA9PT0gMHg1QikgeyAvLyAnWydcbiAgICAgICAgICAgICAgICBsZXZlbCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdSA9PT0gMHg1RCkgeyAvLyAnXSdcbiAgICAgICAgICAgICAgICBsZXZlbCAtPSAxO1xuICAgICAgICAgICAgICAgIGlmIChsZXZlbCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZSA9IGk7IC8vIGZvdW5kIG1hdGNoaW5nIGNsb3NlOyBsb29wIHdpbGwgZXhpdCBieSBjb25kaXRpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xvc2UgPCAwKSB7XG4gICAgICAgICAgICAvLyBVbnRlcm1pbmF0ZWQgZ3JvdXA6IHdyYXAgdGhlIHJhdyByZW1haW5kZXIgaW4gb25lIGJyYWNrZXQgcGFpciBzbyBpdCBzdGF5c1xuICAgICAgICAgICAgLy8gYSBzaW5nbGUgbGl0ZXJhbCBzZWdtZW50IChlLmcuIFwiW1tdYlwiIC0+IFwiW1tdYl1cIik7IHdlIGRvIG5vdCBpbmZlciBtaXNzaW5nICddJy5cbiAgICAgICAgICAgIHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aF0gPSAnWycgKyBrZXkuc2xpY2Uob3BlbikgKyAnXSc7XG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudHM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VnID0ga2V5LnNsaWNlKG9wZW4sIGNsb3NlICsgMSk7XG4gICAgICAgIC8vIHByb3RvdHlwZSBndWFyZCBmb3IgdGhlIGNvbnRlbnQgb2YgdGhpcyBncm91cFxuICAgICAgICB2YXIgY29udGVudCA9IHNlZy5zbGljZSgxLCAtMSk7XG4gICAgICAgIGlmICghb3B0aW9ucy5wbGFpbk9iamVjdHMgJiYgaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgY29udGVudCkgJiYgIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGhdID0gc2VnO1xuICAgICAgICBjb2xsZWN0ZWQgKz0gMTtcblxuICAgICAgICAvLyBmaW5kIHRoZSBuZXh0ICdbJyBhZnRlciB0aGlzIGJhbGFuY2VkIGdyb3VwXG4gICAgICAgIG9wZW4gPSBrZXkuaW5kZXhPZignWycsIGNsb3NlICsgMSk7XG4gICAgfVxuXG4gICAgaWYgKG9wZW4gPj0gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zdHJpY3REZXB0aCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0lucHV0IGRlcHRoIGV4Y2VlZGVkIGRlcHRoIG9wdGlvbiBvZiAnICsgb3B0aW9ucy5kZXB0aCArICcgYW5kIHN0cmljdERlcHRoIGlzIHRydWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aF0gPSAnWycgKyBrZXkuc2xpY2Uob3BlbikgKyAnXSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xufTtcblxudmFyIHBhcnNlS2V5cyA9IGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmdLZXlzKGdpdmVuS2V5LCB2YWwsIG9wdGlvbnMsIHZhbHVlc1BhcnNlZCkge1xuICAgIGlmICghZ2l2ZW5LZXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gc3BsaXRLZXlJbnRvU2VnbWVudHMoZ2l2ZW5LZXksIG9wdGlvbnMpO1xuXG4gICAgaWYgKCFrZXlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VPYmplY3Qoa2V5cywgdmFsLCBvcHRpb25zLCB2YWx1ZXNQYXJzZWQpO1xufTtcblxudmFyIG5vcm1hbGl6ZVBhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZVBhcnNlT3B0aW9ucyhvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BhbGxvd0VtcHR5QXJyYXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuZGVjb2RlRG90SW5LZXlzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5kZWNvZGVEb3RJbktleXMgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgZGVjb2RlRG90SW5LZXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5kZWNvZGVyICE9PSBudWxsICYmIHR5cGVvZiBvcHRzLmRlY29kZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmRlY29kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRGVjb2RlciBoYXMgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuY2hhcnNldCAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0cy5jaGFyc2V0ICE9PSAndXRmLTgnICYmIG9wdHMuY2hhcnNldCAhPT0gJ2lzby04ODU5LTEnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBjaGFyc2V0IG9wdGlvbiBtdXN0IGJlIGVpdGhlciB1dGYtOCwgaXNvLTg4NTktMSwgb3IgdW5kZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLnRocm93T25MaW1pdEV4Y2VlZGVkICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy50aHJvd09uTGltaXRFeGNlZWRlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aHJvd09uTGltaXRFeGNlZWRlZGAgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgfVxuXG4gICAgdmFyIGNoYXJzZXQgPSB0eXBlb2Ygb3B0cy5jaGFyc2V0ID09PSAndW5kZWZpbmVkJyA/IGRlZmF1bHRzLmNoYXJzZXQgOiBvcHRzLmNoYXJzZXQ7XG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IHR5cGVvZiBvcHRzLmR1cGxpY2F0ZXMgPT09ICd1bmRlZmluZWQnID8gZGVmYXVsdHMuZHVwbGljYXRlcyA6IG9wdHMuZHVwbGljYXRlcztcblxuICAgIGlmIChkdXBsaWNhdGVzICE9PSAnY29tYmluZScgJiYgZHVwbGljYXRlcyAhPT0gJ2ZpcnN0JyAmJiBkdXBsaWNhdGVzICE9PSAnbGFzdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGR1cGxpY2F0ZXMgb3B0aW9uIG11c3QgYmUgZWl0aGVyIGNvbWJpbmUsIGZpcnN0LCBvciBsYXN0Jyk7XG4gICAgfVxuXG4gICAgdmFyIGFsbG93RG90cyA9IHR5cGVvZiBvcHRzLmFsbG93RG90cyA9PT0gJ3VuZGVmaW5lZCcgPyBvcHRzLmRlY29kZURvdEluS2V5cyA9PT0gdHJ1ZSA/IHRydWUgOiBkZWZhdWx0cy5hbGxvd0RvdHMgOiAhIW9wdHMuYWxsb3dEb3RzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsb3dEb3RzOiBhbGxvd0RvdHMsXG4gICAgICAgIGFsbG93RW1wdHlBcnJheXM6IHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgPT09ICdib29sZWFuJyA/ICEhb3B0cy5hbGxvd0VtcHR5QXJyYXlzIDogZGVmYXVsdHMuYWxsb3dFbXB0eUFycmF5cyxcbiAgICAgICAgYWxsb3dQcm90b3R5cGVzOiB0eXBlb2Ygb3B0cy5hbGxvd1Byb3RvdHlwZXMgPT09ICdib29sZWFuJyA/IG9wdHMuYWxsb3dQcm90b3R5cGVzIDogZGVmYXVsdHMuYWxsb3dQcm90b3R5cGVzLFxuICAgICAgICBhbGxvd1NwYXJzZTogdHlwZW9mIG9wdHMuYWxsb3dTcGFyc2UgPT09ICdib29sZWFuJyA/IG9wdHMuYWxsb3dTcGFyc2UgOiBkZWZhdWx0cy5hbGxvd1NwYXJzZSxcbiAgICAgICAgYXJyYXlMaW1pdDogdHlwZW9mIG9wdHMuYXJyYXlMaW1pdCA9PT0gJ251bWJlcicgPyBvcHRzLmFycmF5TGltaXQgOiBkZWZhdWx0cy5hcnJheUxpbWl0LFxuICAgICAgICBjaGFyc2V0OiBjaGFyc2V0LFxuICAgICAgICBjaGFyc2V0U2VudGluZWw6IHR5cGVvZiBvcHRzLmNoYXJzZXRTZW50aW5lbCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jaGFyc2V0U2VudGluZWwgOiBkZWZhdWx0cy5jaGFyc2V0U2VudGluZWwsXG4gICAgICAgIGNvbW1hOiB0eXBlb2Ygb3B0cy5jb21tYSA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jb21tYSA6IGRlZmF1bHRzLmNvbW1hLFxuICAgICAgICBkZWNvZGVEb3RJbktleXM6IHR5cGVvZiBvcHRzLmRlY29kZURvdEluS2V5cyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5kZWNvZGVEb3RJbktleXMgOiBkZWZhdWx0cy5kZWNvZGVEb3RJbktleXMsXG4gICAgICAgIGRlY29kZXI6IHR5cGVvZiBvcHRzLmRlY29kZXIgPT09ICdmdW5jdGlvbicgPyBvcHRzLmRlY29kZXIgOiBkZWZhdWx0cy5kZWNvZGVyLFxuICAgICAgICBkZWxpbWl0ZXI6IHR5cGVvZiBvcHRzLmRlbGltaXRlciA9PT0gJ3N0cmluZycgfHwgdXRpbHMuaXNSZWdFeHAob3B0cy5kZWxpbWl0ZXIpID8gb3B0cy5kZWxpbWl0ZXIgOiBkZWZhdWx0cy5kZWxpbWl0ZXIsXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1pbXBsaWNpdC1jb2VyY2lvbiwgbm8tZXh0cmEtcGFyZW5zXG4gICAgICAgIGRlcHRoOiAodHlwZW9mIG9wdHMuZGVwdGggPT09ICdudW1iZXInIHx8IG9wdHMuZGVwdGggPT09IGZhbHNlKSA/ICtvcHRzLmRlcHRoIDogZGVmYXVsdHMuZGVwdGgsXG4gICAgICAgIGR1cGxpY2F0ZXM6IGR1cGxpY2F0ZXMsXG4gICAgICAgIGlnbm9yZVF1ZXJ5UHJlZml4OiBvcHRzLmlnbm9yZVF1ZXJ5UHJlZml4ID09PSB0cnVlLFxuICAgICAgICBpbnRlcnByZXROdW1lcmljRW50aXRpZXM6IHR5cGVvZiBvcHRzLmludGVycHJldE51bWVyaWNFbnRpdGllcyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMgOiBkZWZhdWx0cy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMsXG4gICAgICAgIHBhcmFtZXRlckxpbWl0OiB0eXBlb2Ygb3B0cy5wYXJhbWV0ZXJMaW1pdCA9PT0gJ251bWJlcicgPyBvcHRzLnBhcmFtZXRlckxpbWl0IDogZGVmYXVsdHMucGFyYW1ldGVyTGltaXQsXG4gICAgICAgIHBhcnNlQXJyYXlzOiBvcHRzLnBhcnNlQXJyYXlzICE9PSBmYWxzZSxcbiAgICAgICAgcGxhaW5PYmplY3RzOiB0eXBlb2Ygb3B0cy5wbGFpbk9iamVjdHMgPT09ICdib29sZWFuJyA/IG9wdHMucGxhaW5PYmplY3RzIDogZGVmYXVsdHMucGxhaW5PYmplY3RzLFxuICAgICAgICBzdHJpY3REZXB0aDogdHlwZW9mIG9wdHMuc3RyaWN0RGVwdGggPT09ICdib29sZWFuJyA/ICEhb3B0cy5zdHJpY3REZXB0aCA6IGRlZmF1bHRzLnN0cmljdERlcHRoLFxuICAgICAgICBzdHJpY3RNZXJnZTogdHlwZW9mIG9wdHMuc3RyaWN0TWVyZ2UgPT09ICdib29sZWFuJyA/ICEhb3B0cy5zdHJpY3RNZXJnZSA6IGRlZmF1bHRzLnN0cmljdE1lcmdlLFxuICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IHR5cGVvZiBvcHRzLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgIHRocm93T25MaW1pdEV4Y2VlZGVkOiB0eXBlb2Ygb3B0cy50aHJvd09uTGltaXRFeGNlZWRlZCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy50aHJvd09uTGltaXRFeGNlZWRlZCA6IGZhbHNlXG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgb3B0cykge1xuICAgIHZhciBvcHRpb25zID0gbm9ybWFsaXplUGFyc2VPcHRpb25zKG9wdHMpO1xuXG4gICAgaWYgKHN0ciA9PT0gJycgfHwgc3RyID09PSBudWxsIHx8IHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLnBsYWluT2JqZWN0cyA/IHsgX19wcm90b19fOiBudWxsIH0gOiB7fTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcE9iaiA9IHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnID8gcGFyc2VWYWx1ZXMoc3RyLCBvcHRpb25zKSA6IHN0cjtcbiAgICB2YXIgb2JqID0gb3B0aW9ucy5wbGFpbk9iamVjdHMgPyB7IF9fcHJvdG9fXzogbnVsbCB9IDoge307XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGtleXMgYW5kIHNldHVwIHRoZSBuZXcgb2JqZWN0XG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRlbXBPYmopO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgdmFyIG5ld09iaiA9IHBhcnNlS2V5cyhrZXksIHRlbXBPYmpba2V5XSwgb3B0aW9ucywgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpO1xuICAgICAgICBvYmogPSB1dGlscy5tZXJnZShvYmosIG5ld09iaiwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWxsb3dTcGFyc2UgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbHMuY29tcGFjdChvYmopO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpO1xudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9ybWF0czogZm9ybWF0cyxcbiAgICBwYXJzZTogcGFyc2UsXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlcbn07XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNES19WRVJTSU9OID0gdm9pZCAwO1xuZXhwb3J0cy5TREtfVkVSU0lPTiA9ICc4LjExLjAnO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Ub29sdGlwID0gZXhwb3J0cy5UZXh0RmllbGQgPSBleHBvcnRzLlRleHRBcmVhID0gZXhwb3J0cy5UYWJzID0gZXhwb3J0cy5UYWJsZVJvdyA9IGV4cG9ydHMuVGFibGUgPSBleHBvcnRzLlRhYmxlSGVhZGVyQ2VsbCA9IGV4cG9ydHMuVGFibGVIZWFkID0gZXhwb3J0cy5UYWJsZUZvb3RlciA9IGV4cG9ydHMuVGFibGVDZWxsID0gZXhwb3J0cy5UYWJsZUJvZHkgPSBleHBvcnRzLlRhYiA9IGV4cG9ydHMuVGFiUGFuZWxzID0gZXhwb3J0cy5UYWJQYW5lbCA9IGV4cG9ydHMuVGFiTGlzdCA9IGV4cG9ydHMuU3dpdGNoID0gZXhwb3J0cy5TdHJpcGVGaWxlVXBsb2FkZXIgPSBleHBvcnRzLlNwaW5uZXIgPSBleHBvcnRzLlNwYXJrbGluZSA9IGV4cG9ydHMuU2lnbkluVmlldyA9IGV4cG9ydHMuU2V0dGluZ3NWaWV3ID0gZXhwb3J0cy5TZWxlY3QgPSBleHBvcnRzLlJhZGlvID0gZXhwb3J0cy5NZW51ID0gZXhwb3J0cy5NZW51SXRlbSA9IGV4cG9ydHMuTWVudUdyb3VwID0gZXhwb3J0cy5MaXN0ID0gZXhwb3J0cy5MaXN0SXRlbSA9IGV4cG9ydHMuTGluayA9IGV4cG9ydHMuTGluZUNoYXJ0ID0gZXhwb3J0cy5JbmxpbmUgPSBleHBvcnRzLkltZyA9IGV4cG9ydHMuSWNvbiA9IGV4cG9ydHMuRm9ybUZpZWxkR3JvdXAgPSBleHBvcnRzLkZvY3VzVmlldyA9IGV4cG9ydHMuRGl2aWRlciA9IGV4cG9ydHMuRGF0ZUZpZWxkID0gZXhwb3J0cy5Db250ZXh0VmlldyA9IGV4cG9ydHMuQ2hpcCA9IGV4cG9ydHMuQ2hpcExpc3QgPSBleHBvcnRzLkNoZWNrYm94ID0gZXhwb3J0cy5CdXR0b24gPSBleHBvcnRzLkJ1dHRvbkdyb3VwID0gZXhwb3J0cy5Cb3ggPSBleHBvcnRzLkJhckNoYXJ0ID0gZXhwb3J0cy5CYW5uZXIgPSBleHBvcnRzLkJhZGdlID0gZXhwb3J0cy5BY2NvcmRpb24gPSBleHBvcnRzLkFjY29yZGlvbkl0ZW0gPSB2b2lkIDA7XG5jb25zdCBqc3hfcnVudGltZV8xID0gcmVxdWlyZShcInJlYWN0L2pzeC1ydW50aW1lXCIpO1xuY29uc3QgcmVhY3RfMSA9IHJlcXVpcmUoXCJAcmVtb3RlLXVpL3JlYWN0XCIpO1xuY29uc3QgdmVyc2lvbl8xID0gcmVxdWlyZShcIi4uL3ZlcnNpb25cIik7XG5jb25zdCB3aXRoU2RrUHJvcHMgPSAoQ29tcG9uZW50KSA9PiB7XG4gICAgY29uc3Qgd3JhcHBlZENvbXBvbmVudE5hbWUgPSBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50LnRvU3RyaW5nKCk7XG4gICAgY29uc3QgV2l0aFNka1Byb3BzID0gKHByb3BzKSA9PiAoKDAsIGpzeF9ydW50aW1lXzEuanN4KShDb21wb25lbnQsIE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCB7IHdyYXBwZWRDb21wb25lbnROYW1lOiB3cmFwcGVkQ29tcG9uZW50TmFtZSwgc2RrVmVyc2lvbjogdmVyc2lvbl8xLlNES19WRVJTSU9OLCBzY2hlbWFWZXJzaW9uOiBcInY4XCIgfSkpKTtcbiAgICBXaXRoU2RrUHJvcHMud3JhcHBlZENvbXBvbmVudE5hbWUgPSB3cmFwcGVkQ29tcG9uZW50TmFtZTtcbiAgICByZXR1cm4gV2l0aFNka1Byb3BzO1xufTtcbmNvbnN0IGRlZmluZUNvbXBvbmVudCA9IChuYW1lLCBmcmFnbWVudFByb3BzLCB3cmFwV2l0aFNka1Byb3BzKSA9PiB7XG4gICAgY29uc3QgcmVtb3RlQ29tcG9uZW50ID0gKDAsIHJlYWN0XzEuY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQpKG5hbWUsIHtcbiAgICAgICAgZnJhZ21lbnRQcm9wcyxcbiAgICB9KTtcbiAgICBpZiAoIXdyYXBXaXRoU2RrUHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIHJlbW90ZUNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuIHdpdGhTZGtQcm9wcyhyZW1vdGVDb21wb25lbnQpO1xufTtcbmV4cG9ydHMuQWNjb3JkaW9uSXRlbSA9IGRlZmluZUNvbXBvbmVudCgnQWNjb3JkaW9uSXRlbScsIFsndGl0bGUnLCAnYWN0aW9ucycsICdtZWRpYScsICdzdWJ0aXRsZSddLCB0cnVlKTtcbmV4cG9ydHMuQWNjb3JkaW9uID0gZGVmaW5lQ29tcG9uZW50KCdBY2NvcmRpb24nLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLkJhZGdlID0gZGVmaW5lQ29tcG9uZW50KCdCYWRnZScsIFtdLCB0cnVlKTtcbmV4cG9ydHMuQmFubmVyID0gZGVmaW5lQ29tcG9uZW50KCdCYW5uZXInLCBbJ2FjdGlvbnMnLCAnZGVzY3JpcHRpb24nLCAndGl0bGUnXSwgdHJ1ZSk7XG5leHBvcnRzLkJhckNoYXJ0ID0gZGVmaW5lQ29tcG9uZW50KCdCYXJDaGFydCcsIFtdLCB0cnVlKTtcbmV4cG9ydHMuQm94ID0gZGVmaW5lQ29tcG9uZW50KCdCb3gnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLkJ1dHRvbkdyb3VwID0gZGVmaW5lQ29tcG9uZW50KCdCdXR0b25Hcm91cCcsIFsnbWVudVRyaWdnZXInXSwgdHJ1ZSk7XG5leHBvcnRzLkJ1dHRvbiA9IGRlZmluZUNvbXBvbmVudCgnQnV0dG9uJywgW10sIHRydWUpO1xuZXhwb3J0cy5DaGVja2JveCA9IGRlZmluZUNvbXBvbmVudCgnQ2hlY2tib3gnLCBbJ2xhYmVsJ10sIHRydWUpO1xuZXhwb3J0cy5DaGlwTGlzdCA9IGRlZmluZUNvbXBvbmVudCgnQ2hpcExpc3QnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLkNoaXAgPSBkZWZpbmVDb21wb25lbnQoJ0NoaXAnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLkNvbnRleHRWaWV3ID0gZGVmaW5lQ29tcG9uZW50KCdDb250ZXh0VmlldycsIFsnYWN0aW9ucycsICdiYW5uZXInLCAnZm9vdGVyQ29udGVudCcsICdwcmltYXJ5QWN0aW9uJywgJ3NlY29uZGFyeUFjdGlvbiddLCB0cnVlKTtcbmV4cG9ydHMuRGF0ZUZpZWxkID0gZGVmaW5lQ29tcG9uZW50KCdEYXRlRmllbGQnLCBbJ2xhYmVsJ10sIHRydWUpO1xuZXhwb3J0cy5EaXZpZGVyID0gZGVmaW5lQ29tcG9uZW50KCdEaXZpZGVyJywgW10sIHRydWUpO1xuZXhwb3J0cy5Gb2N1c1ZpZXcgPSBkZWZpbmVDb21wb25lbnQoJ0ZvY3VzVmlldycsIFsnZm9vdGVyQ29udGVudCcsICdwcmltYXJ5QWN0aW9uJywgJ3NlY29uZGFyeUFjdGlvbiddLCB0cnVlKTtcbmV4cG9ydHMuRm9ybUZpZWxkR3JvdXAgPSBkZWZpbmVDb21wb25lbnQoJ0Zvcm1GaWVsZEdyb3VwJywgW10sIHRydWUpO1xuZXhwb3J0cy5JY29uID0gZGVmaW5lQ29tcG9uZW50KCdJY29uJywgW10sIHRydWUpO1xuZXhwb3J0cy5JbWcgPSBkZWZpbmVDb21wb25lbnQoJ0ltZycsIFtdLCB0cnVlKTtcbmV4cG9ydHMuSW5saW5lID0gZGVmaW5lQ29tcG9uZW50KCdJbmxpbmUnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLkxpbmVDaGFydCA9IGRlZmluZUNvbXBvbmVudCgnTGluZUNoYXJ0JywgW10sIHRydWUpO1xuZXhwb3J0cy5MaW5rID0gZGVmaW5lQ29tcG9uZW50KCdMaW5rJywgW10sIHRydWUpO1xuZXhwb3J0cy5MaXN0SXRlbSA9IGRlZmluZUNvbXBvbmVudCgnTGlzdEl0ZW0nLCBbJ2ljb24nLCAnaW1hZ2UnLCAnc2Vjb25kYXJ5VGl0bGUnLCAndGl0bGUnLCAndmFsdWUnXSwgdHJ1ZSk7XG5leHBvcnRzLkxpc3QgPSBkZWZpbmVDb21wb25lbnQoJ0xpc3QnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLk1lbnVHcm91cCA9IGRlZmluZUNvbXBvbmVudCgnTWVudUdyb3VwJywgWyd0aXRsZSddLCB0cnVlKTtcbmV4cG9ydHMuTWVudUl0ZW0gPSBkZWZpbmVDb21wb25lbnQoJ01lbnVJdGVtJywgW10sIHRydWUpO1xuZXhwb3J0cy5NZW51ID0gZGVmaW5lQ29tcG9uZW50KCdNZW51JywgWyd0cmlnZ2VyJ10sIHRydWUpO1xuZXhwb3J0cy5SYWRpbyA9IGRlZmluZUNvbXBvbmVudCgnUmFkaW8nLCBbJ2xhYmVsJ10sIHRydWUpO1xuZXhwb3J0cy5TZWxlY3QgPSBkZWZpbmVDb21wb25lbnQoJ1NlbGVjdCcsIFsnbGFiZWwnXSwgdHJ1ZSk7XG5leHBvcnRzLlNldHRpbmdzVmlldyA9IGRlZmluZUNvbXBvbmVudCgnU2V0dGluZ3NWaWV3JywgW10sIHRydWUpO1xuZXhwb3J0cy5TaWduSW5WaWV3ID0gZGVmaW5lQ29tcG9uZW50KCdTaWduSW5WaWV3JywgWydkZXNjcmlwdGlvbkFjdGlvbkNvbnRlbnRzJywgJ2Zvb3RlckNvbnRlbnQnXSwgdHJ1ZSk7XG5leHBvcnRzLlNwYXJrbGluZSA9IGRlZmluZUNvbXBvbmVudCgnU3BhcmtsaW5lJywgW10sIHRydWUpO1xuZXhwb3J0cy5TcGlubmVyID0gZGVmaW5lQ29tcG9uZW50KCdTcGlubmVyJywgW10sIHRydWUpO1xuZXhwb3J0cy5TdHJpcGVGaWxlVXBsb2FkZXIgPSBkZWZpbmVDb21wb25lbnQoJ1N0cmlwZUZpbGVVcGxvYWRlcicsIFtdLCB0cnVlKTtcbmV4cG9ydHMuU3dpdGNoID0gZGVmaW5lQ29tcG9uZW50KCdTd2l0Y2gnLCBbJ2xhYmVsJ10sIHRydWUpO1xuZXhwb3J0cy5UYWJMaXN0ID0gZGVmaW5lQ29tcG9uZW50KCdUYWJMaXN0JywgW10sIHRydWUpO1xuZXhwb3J0cy5UYWJQYW5lbCA9IGRlZmluZUNvbXBvbmVudCgnVGFiUGFuZWwnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLlRhYlBhbmVscyA9IGRlZmluZUNvbXBvbmVudCgnVGFiUGFuZWxzJywgW10sIHRydWUpO1xuZXhwb3J0cy5UYWIgPSBkZWZpbmVDb21wb25lbnQoJ1RhYicsIFtdLCB0cnVlKTtcbmV4cG9ydHMuVGFibGVCb2R5ID0gZGVmaW5lQ29tcG9uZW50KCdUYWJsZUJvZHknLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLlRhYmxlQ2VsbCA9IGRlZmluZUNvbXBvbmVudCgnVGFibGVDZWxsJywgW10sIHRydWUpO1xuZXhwb3J0cy5UYWJsZUZvb3RlciA9IGRlZmluZUNvbXBvbmVudCgnVGFibGVGb290ZXInLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLlRhYmxlSGVhZCA9IGRlZmluZUNvbXBvbmVudCgnVGFibGVIZWFkJywgW10sIHRydWUpO1xuZXhwb3J0cy5UYWJsZUhlYWRlckNlbGwgPSBkZWZpbmVDb21wb25lbnQoJ1RhYmxlSGVhZGVyQ2VsbCcsIFtdLCB0cnVlKTtcbmV4cG9ydHMuVGFibGUgPSBkZWZpbmVDb21wb25lbnQoJ1RhYmxlJywgW10sIHRydWUpO1xuZXhwb3J0cy5UYWJsZVJvdyA9IGRlZmluZUNvbXBvbmVudCgnVGFibGVSb3cnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLlRhYnMgPSBkZWZpbmVDb21wb25lbnQoJ1RhYnMnLCBbXSwgdHJ1ZSk7XG5leHBvcnRzLlRleHRBcmVhID0gZGVmaW5lQ29tcG9uZW50KCdUZXh0QXJlYScsIFsnbGFiZWwnXSwgdHJ1ZSk7XG5leHBvcnRzLlRleHRGaWVsZCA9IGRlZmluZUNvbXBvbmVudCgnVGV4dEZpZWxkJywgWydsYWJlbCddLCB0cnVlKTtcbmV4cG9ydHMuVG9vbHRpcCA9IGRlZmluZUNvbXBvbmVudCgnVG9vbHRpcCcsIFsndHJpZ2dlciddLCB0cnVlKTtcbiIsICIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIFByaXZhdGUhIFRoaXMgYWxsb3dzIHRoZSBzaGFyZWQgZW5kcG9pbnQgdG8gYmUgaW5pdGlhbGl6ZWRcbiAqIHNvIHRoYXQgdGhlIFNESyBjYW4gY29tbXVuaWNhdGUgd2l0aCB0aGUgRGFzaGJvYXJkLlxuICovXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEhvc3RFbmRwb2ludCA9IHZvaWQgMDtcbmNvbnN0IGludmFyaWFudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJpbnZhcmlhbnRcIikpO1xuY29uc3QgZ2V0SG9zdEVuZHBvaW50ID0gKCkgPT4ge1xuICAgIHZhciBfYTtcbiAgICAvLyBUaGlzIGlzIGVuZHBvaW50IGlzIGNyZWF0ZWQgZnJvbSB0aGUgTWVzc2FnZVBvcnQgdHJhbnNmZXJyZWQgZnJvbSB0aGUgaG9zdCBlbnZcbiAgICAvLyBhcyBhIHBhcnQgb2YgdGhlIGBpbml0X2V4dGVuc2lvbmAgbWVzc2FnZS5cbiAgICBjb25zdCBob3N0RW5kcG9pbnQgPSAoX2EgPSBnbG9iYWxUaGlzLl9fU3RyaXBlRXh0RXhwb3J0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVuZHBvaW50O1xuICAgICgwLCBpbnZhcmlhbnRfMS5kZWZhdWx0KShob3N0RW5kcG9pbnQsICdob3N0RW5kcG9pbnQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkJyk7XG4gICAgcmV0dXJuIGhvc3RFbmRwb2ludDtcbn07XG5leHBvcnRzLmdldEhvc3RFbmRwb2ludCA9IGdldEhvc3RFbmRwb2ludDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3RyaXBlQXBpRmV0Y2ggPSB2b2lkIDA7XG5jb25zdCBfZW5kcG9pbnRfMSA9IHJlcXVpcmUoXCIuL19lbmRwb2ludFwiKTtcbmNvbnN0IHN0cmlwZUFwaUZldGNoID0gKHBhdGgsIHJlcSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAoMCwgX2VuZHBvaW50XzEuZ2V0SG9zdEVuZHBvaW50KSgpLmNhbGwuc3RyaXBlQXBpRmV0Y2gocGF0aCwgcmVxKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgY2FsbGluZyBzdHJpcGUgZmV0Y2gnLCBlKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59O1xuZXhwb3J0cy5zdHJpcGVBcGlGZXRjaCA9IHN0cmlwZUFwaUZldGNoO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIEh0dHBDbGllbnQgdGhhdCBjYW4gYmUgcGx1Z2dlZCBpbnRvIHN0cmlwZS1ub2RlXG4gKiB0aGF0IHdpbGwgYWxsb3cgdGhlIHVzZXIgdG8gdXNlIHN0cmlwZS1ub2RlIGluIGV4dGVuc2lvbnMgaWYgdGhlIERhc2hib2FyZFxuICogcHJvdmlkZXMgYSBgc3RyaXBlQXBpRmV0Y2hgIGZ1bmN0aW9uIHRoYXQgd2lsbCByZWxheSBBUEkgY2FsbHMgdGhyb3VnaCB0aGVcbiAqIERhc2hib2FyZCBhbmQgcGlnZ3kgYmFjayBvbiB0aGUgdXNlcidzIERhc2hib2FyZCBzZXNzaW9uLlxuICovXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQVVUSE9SSVpBVElPTl9WQUxVRSA9IGV4cG9ydHMuQVVUSE9SSVpBVElPTl9IRUFERVIgPSBleHBvcnRzLmNyZWF0ZUh0dHBDbGllbnQgPSBleHBvcnRzLlNUUklQRV9BUElfS0VZID0gZXhwb3J0cy5TdHJpcGVBcHBzSHR0cENsaWVudCA9IHZvaWQgMDtcbmNvbnN0IGludmFyaWFudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJpbnZhcmlhbnRcIikpO1xuY29uc3QgYXBpRmV0Y2hfMSA9IHJlcXVpcmUoXCIuL2FwaUZldGNoXCIpO1xuY29uc3QgbWF0Y2hlc1N0cmlwZUtleSA9IC9bcHNda18odGVzdHxsaXZlKV9bQS1aYS16MC05XSsvO1xuY2xhc3MgU3RyaXBlQXBwc0h0dHBSZXNwb25zZSB7XG4gICAgY29uc3RydWN0b3IocmVzcCkge1xuICAgICAgICB0aGlzLl9yZXNwID0gcmVzcDtcbiAgICB9XG4gICAgZ2V0SGVhZGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3AuaGVhZGVycztcbiAgICB9XG4gICAgZ2V0U3RhdHVzQ29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3Auc3RhdHVzO1xuICAgIH1cbiAgICBnZXRSYXdSZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3A7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gICAgdG9TdHJlYW0oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RyZWFtcyBoYXZlIG5vdCBiZWVuIGltcGxlbWVudGVkIGluIHRoZSBTdHJpcGUgSFRUUCBjbGllbnQnKTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbiAgICB0b0pTT04oKSB7XG4gICAgICAgIGNvbnN0IHsganNvbiB9ID0gdGhpcy5fcmVzcDtcbiAgICAgICAgaWYgKGpzb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVzcG9uc2UgYm9keSB1bmRlZmluZWQnKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGpzb24pO1xuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgU3RyaXBlQXBwc0h0dHBDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGZldGNoKSB7XG4gICAgICAgIHRoaXMuX2ZldGNoID0gZmV0Y2g7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gICAgZ2V0Q2xpZW50TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdzdHJpcGUtdWktZXh0ZW5zaW9uJztcbiAgICB9XG4gICAgbWFrZVJlcXVlc3QoaG9zdCwgcG9ydCwgcGF0aCwgbWV0aG9kLCBoZWFkZXJzLCByZXF1ZXN0RGF0YSwgcHJvdG9jb2wsIHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICgwLCBpbnZhcmlhbnRfMS5kZWZhdWx0KShwcm90b2NvbCA9PT0gJ2h0dHBzJywgJ011c3QgdXNlIGh0dHBzIGNvbm5lY3Rpb25zIGluIFVJIGV4dGVuc2lvbnMnKTtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocmVxdWVzdERhdGEpIHtcbiAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMuYm9keSA9IHJlcXVlc3REYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXV0aEhlYWRlciA9IGhlYWRlcnMuQXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgIGlmIChhdXRoSGVhZGVyICYmIG1hdGNoZXNTdHJpcGVLZXkudGVzdChhdXRoSGVhZGVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRG8gbm90IHVzZSBhY3R1YWwgc3RyaXBlIGtleXMgd2hlbiB1c2luZyB0aGUgU3RyaXBlIEpTIEFQSSBjbGllbnQgd2l0aCBVSSBleHRlc2lvbnMuXFxuXFxuIEluc3RlYWQsIHVzZSBgU1RSSVBFX0FQSV9LRVlgIGZyb20gYEBzdHJpcGUvdWktZXh0ZW5zaW9uLXNkay9odHRwX2NsaWVudGAgYXMgYSBwbGFjZWhvbGRlci4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3AgPSB5aWVsZCB0aGlzLl9mZXRjaChwYXRoLCBmZXRjaE9wdGlvbnMpO1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIHRpbWVvdXRzLlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpcGVBcHBzSHR0cFJlc3BvbnNlKHJlc3ApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlN0cmlwZUFwcHNIdHRwQ2xpZW50ID0gU3RyaXBlQXBwc0h0dHBDbGllbnQ7XG4vLyBETyBOT1QgY2hhbmdlIHRoaXMgc3RyaW5nIHdpdGhvdXQgYSBkZXByZWNhdGlvbiBwbGFuLiBUaGUgcnVudGltZSBjaGVja3MgdG8gbWFrZSBzdXJlIHRoYXQgdGhpc1xuLy8gZXhhY3Qgc3RyaW5nIGlzIHBhc3NlZCwgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4vLyBTZWU6IG1hbmFnZS9mcm9udGVuZC9zcmMvdGFpbG9yL2V4dGVuc2lvbnMvaG9zdC9hcGlfZmV0Y2guanNcbmV4cG9ydHMuU1RSSVBFX0FQSV9LRVkgPSAnRE9fTk9UX1BBU1NfQV9SRUFMX0FQSV9LRVknO1xuY29uc3QgY3JlYXRlSHR0cENsaWVudCA9ICgpID0+IG5ldyBTdHJpcGVBcHBzSHR0cENsaWVudChhcGlGZXRjaF8xLnN0cmlwZUFwaUZldGNoKTtcbmV4cG9ydHMuY3JlYXRlSHR0cENsaWVudCA9IGNyZWF0ZUh0dHBDbGllbnQ7XG5leHBvcnRzLkFVVEhPUklaQVRJT05fSEVBREVSID0gJ0F1dGhvcml6YXRpb24nO1xuZXhwb3J0cy5BVVRIT1JJWkFUSU9OX1ZBTFVFID0gYEJlYXJlciAke2V4cG9ydHMuU1RSSVBFX0FQSV9LRVl9YDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbi8vIFRoaXMgZmlsZSBtb3ZlZCB0byB1dGlsczsgcmUtZXhwb3J0ZWQgdG8gbm90IGJyZWFrIGltcG9ydHNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlSHR0cENsaWVudCA9IGV4cG9ydHMuU1RSSVBFX0FQSV9LRVkgPSBleHBvcnRzLkFVVEhPUklaQVRJT05fVkFMVUUgPSBleHBvcnRzLkFVVEhPUklaQVRJT05fSEVBREVSID0gdm9pZCAwO1xuY29uc3QgaHR0cENsaWVudF8xID0gcmVxdWlyZShcIi4vdXRpbHMvaHR0cENsaWVudFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkFVVEhPUklaQVRJT05fSEVBREVSXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBodHRwQ2xpZW50XzEuQVVUSE9SSVpBVElPTl9IRUFERVI7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJBVVRIT1JJWkFUSU9OX1ZBTFVFXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBodHRwQ2xpZW50XzEuQVVUSE9SSVpBVElPTl9WQUxVRTsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlNUUklQRV9BUElfS0VZXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBodHRwQ2xpZW50XzEuU1RSSVBFX0FQSV9LRVk7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjcmVhdGVIdHRwQ2xpZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBodHRwQ2xpZW50XzEuY3JlYXRlSHR0cENsaWVudDsgfSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGh0dHBDbGllbnRfMS5TdHJpcGVBcHBzSHR0cENsaWVudDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2xpcGJvYXJkV3JpdGVUZXh0ID0gdm9pZCAwO1xuY29uc3QgX2VuZHBvaW50XzEgPSByZXF1aXJlKFwiLi9fZW5kcG9pbnRcIik7XG5jb25zdCBjbGlwYm9hcmRXcml0ZVRleHQgPSAodGV4dCA9ICcnKSA9PiB7XG4gICAgcmV0dXJuICgwLCBfZW5kcG9pbnRfMS5nZXRIb3N0RW5kcG9pbnQpKCkuY2FsbC5jbGlwYm9hcmRXcml0ZVRleHQodGV4dCk7XG59O1xuZXhwb3J0cy5jbGlwYm9hcmRXcml0ZVRleHQgPSBjbGlwYm9hcmRXcml0ZVRleHQ7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlUmVmcmVzaERhc2hib2FyZERhdGEgPSB2b2lkIDA7XG5jb25zdCBSZWFjdCA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3QgX2VuZHBvaW50XzEgPSByZXF1aXJlKFwiLi9fZW5kcG9pbnRcIik7XG5jb25zdCB1c2VSZWZyZXNoRGFzaGJvYXJkRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gUmVhY3QudXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICByZXR1cm4gKDAsIF9lbmRwb2ludF8xLmdldEhvc3RFbmRwb2ludCkoKS5jYWxsLnJlZnJlc2hEYXNoYm9hcmREYXRhKCk7XG4gICAgfSwgW10pO1xufTtcbmV4cG9ydHMudXNlUmVmcmVzaERhc2hib2FyZERhdGEgPSB1c2VSZWZyZXNoRGFzaGJvYXJkRGF0YTtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXREYXNoYm9hcmRVc2VyRW1haWwgPSB2b2lkIDA7XG5jb25zdCBfZW5kcG9pbnRfMSA9IHJlcXVpcmUoXCIuL19lbmRwb2ludFwiKTtcbmNvbnN0IGh0dHBDbGllbnRfMSA9IHJlcXVpcmUoXCIuL2h0dHBDbGllbnRcIik7XG5jb25zdCBnZXREYXNoYm9hcmRVc2VyRW1haWwgPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwID0gKHlpZWxkICgwLCBfZW5kcG9pbnRfMS5nZXRIb3N0RW5kcG9pbnQpKCkuY2FsbC5zdHJpcGVBcGlGZXRjaCgnL3YxL3VzZXIvZW1haWwnLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgW2h0dHBDbGllbnRfMS5BVVRIT1JJWkFUSU9OX0hFQURFUl06IGh0dHBDbGllbnRfMS5BVVRIT1JJWkFUSU9OX1ZBTFVFLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAocmVzcC5vaykge1xuICAgICAgICAgICAgcmVzcC5lbWFpbCA9IHJlc3AuanNvbi5lbWFpbDtcbiAgICAgICAgICAgIHJldHVybiByZXNwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXNwKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBkYXNoYm9hcmQgdXNlciBlbWFpbCcsIGUpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5nZXREYXNoYm9hcmRVc2VyRW1haWwgPSBnZXREYXNoYm9hcmRVc2VyRW1haWw7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJBdXRob3JpemVkUGVybWlzc2lvbnMgPSB2b2lkIDA7XG5jb25zdCBfZW5kcG9pbnRfMSA9IHJlcXVpcmUoXCIuL19lbmRwb2ludFwiKTtcbmNvbnN0IGdldFVzZXJBdXRob3JpemVkUGVybWlzc2lvbnMgPSAoKSA9PiB7XG4gICAgcmV0dXJuICgwLCBfZW5kcG9pbnRfMS5nZXRIb3N0RW5kcG9pbnQpKCkuY2FsbC5nZXRVc2VyQXV0aG9yaXplZFBlcm1pc3Npb25zKCk7XG59O1xuZXhwb3J0cy5nZXRVc2VyQXV0aG9yaXplZFBlcm1pc3Npb25zID0gZ2V0VXNlckF1dGhvcml6ZWRQZXJtaXNzaW9ucztcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNQZXJtaXNzaW9uQXV0aG9yaXplZCA9IHZvaWQgMDtcbmNvbnN0IF9lbmRwb2ludF8xID0gcmVxdWlyZShcIi4vX2VuZHBvaW50XCIpO1xuY29uc3QgaXNQZXJtaXNzaW9uQXV0aG9yaXplZCA9IChwZXJtaXNzaW9uKSA9PiB7XG4gICAgcmV0dXJuICgwLCBfZW5kcG9pbnRfMS5nZXRIb3N0RW5kcG9pbnQpKCkuY2FsbC5pc1Blcm1pc3Npb25BdXRob3JpemVkKHBlcm1pc3Npb24pO1xufTtcbmV4cG9ydHMuaXNQZXJtaXNzaW9uQXV0aG9yaXplZCA9IGlzUGVybWlzc2lvbkF1dGhvcml6ZWQ7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzU291cmNlSW5BdXRob3JpemVkQ1NQID0gdm9pZCAwO1xuY29uc3QgX2VuZHBvaW50XzEgPSByZXF1aXJlKFwiLi9fZW5kcG9pbnRcIik7XG5jb25zdCBpc1NvdXJjZUluQXV0aG9yaXplZENTUCA9IChzb3VyY2UpID0+IHtcbiAgICByZXR1cm4gKDAsIF9lbmRwb2ludF8xLmdldEhvc3RFbmRwb2ludCkoKS5jYWxsLmlzU291cmNlSW5BdXRob3JpemVkQ1NQKHNvdXJjZSk7XG59O1xuZXhwb3J0cy5pc1NvdXJjZUluQXV0aG9yaXplZENTUCA9IGlzU291cmNlSW5BdXRob3JpemVkQ1NQO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVPQXV0aFN0YXRlID0gdm9pZCAwO1xuY29uc3QgX2VuZHBvaW50XzEgPSByZXF1aXJlKFwiLi9fZW5kcG9pbnRcIik7XG5jb25zdCBjcmVhdGVPQXV0aFN0YXRlID0gKHN0YXRlID0gJycpID0+IHtcbiAgICByZXR1cm4gKDAsIF9lbmRwb2ludF8xLmdldEhvc3RFbmRwb2ludCkoKS5jYWxsLmNyZWF0ZU9BdXRoU3RhdGUoc3RhdGUpO1xufTtcbmV4cG9ydHMuY3JlYXRlT0F1dGhTdGF0ZSA9IGNyZWF0ZU9BdXRoU3RhdGU7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZldGNoU3RyaXBlU2lnbmF0dXJlID0gdm9pZCAwO1xuY29uc3QgX2VuZHBvaW50XzEgPSByZXF1aXJlKFwiLi9fZW5kcG9pbnRcIik7XG5jb25zdCBmZXRjaFN0cmlwZVNpZ25hdHVyZSA9IChhZGRpdGlvbmFsUGF5bG9hZCkgPT4ge1xuICAgIHJldHVybiAoMCwgX2VuZHBvaW50XzEuZ2V0SG9zdEVuZHBvaW50KSgpLmNhbGwuZmV0Y2hTdHJpcGVTaWduYXR1cmUoYWRkaXRpb25hbFBheWxvYWQpO1xufTtcbmV4cG9ydHMuZmV0Y2hTdHJpcGVTaWduYXR1cmUgPSBmZXRjaFN0cmlwZVNpZ25hdHVyZTtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zaG93VG9hc3QgPSB2b2lkIDA7XG5jb25zdCBfZW5kcG9pbnRfMSA9IHJlcXVpcmUoXCIuL19lbmRwb2ludFwiKTtcbmNvbnN0IHNob3dUb2FzdCA9IChtZXNzYWdlXzEsIC4uLmFyZ3NfMSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgW21lc3NhZ2VfMSwgLi4uYXJnc18xXSwgdm9pZCAwLCBmdW5jdGlvbiogKG1lc3NhZ2UsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gKDAsIF9lbmRwb2ludF8xLmdldEhvc3RFbmRwb2ludCkoKTtcbiAgICByZXR1cm4gZW5kcG9pbnQuY2FsbC5zaG93VG9hc3QobWVzc2FnZSwgb3B0aW9ucyk7XG59KTtcbmV4cG9ydHMuc2hvd1RvYXN0ID0gc2hvd1RvYXN0O1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vX2VuZHBvaW50XCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcGlGZXRjaFwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vY2xpcGJvYXJkXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9jb250ZXh0XCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9nZXREYXNoYm9hcmRVc2VyRW1haWxcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2dldFVzZXJBdXRob3JpemVkUGVybWlzc2lvbnNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2h0dHBDbGllbnRcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2lzUGVybWlzc2lvbkF1dGhvcml6ZWRcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2lzU291cmNlSW5BdXRob3JpemVkQ1NQXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vYXV0aFwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vcGxhdGZvcm1ScGNzXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zaWduYXR1cmVcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RvYXN0XCIpLCBleHBvcnRzKTtcbiIsICIvLyBBVVRPR0VORVJBVEVEIC0gRE8gTk9UIE1PRElGWVxuXG4vLyBWaWV3IGNvbXBvbmVudCBpbXBvcnRzIFx1MjAxNCBvbmUgcGVyIHZpZXdwb3J0IGRlY2xhcmVkIGluIHVpX2V4dGVuc2lvbi52aWV3c1xuaW1wb3J0IEFwcCBmcm9tICcuLi9zcmMvdmlld3MvQXBwJztcbmltcG9ydCBDdXN0b21lckRldGFpbFZpZXcgZnJvbSAnLi4vc3JjL3ZpZXdzL0N1c3RvbWVyRGV0YWlsVmlldyc7XG5cbi8vIEV4cG9zZXMgdGhlIFNESyB2ZXJzaW9uIHNvIHRoZSBEYXNoYm9hcmQgY2FuIHZlcmlmeSBjb21wYXRpYmlsaXR5XG5leHBvcnQgKiBmcm9tICdAc3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdmVyc2lvbic7XG5cbi8vIE5hbWVkIGV4cG9ydHMgbWFrZSBlYWNoIHZpZXcgY29tcG9uZW50IGFjY2Vzc2libGUgdG8gdGhlIERhc2hib2FyZCBydW50aW1lXG5cbmV4cG9ydCB7IFxuICBBcHAsXG5cbiAgQ3VzdG9tZXJEZXRhaWxWaWV3XG4gfTtcblxuLy8gVGltZXN0YW1wIGNoYW5nZXMgb24gZXZlcnkgZXhwb3J0LCBlbnN1cmluZyB0aGUgZGV2IHNlcnZlciBkZXRlY3RzIGEgcmVidWlsZFxuZXhwb3J0IGNvbnN0IEJVSUxEX1RJTUUgPSAnMjAyNi0wNi0yOSAxMzozMToyNC43Nzg1NDkxICswMTAwIFdBVCBtPSs4NS44MTY3MjUwMDEnO1xuXG4vLyBBcHAgbWFuaWZlc3QgXHUyMDE0IGNvbnN1bWVkIGJ5IHRoZSBEYXNoYm9hcmQgdG8gY29uZmlndXJlIHRoZSBhcHBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgXCIkc2NoZW1hXCI6IFwiaHR0cHM6Ly9zdHJpcGUuY29tL3N0cmlwZS1hcHAuc2NoZW1hLmpzb25cIixcbiAgXCJjb25zdGFudHNcIjoge1xuICAgIFwiQVBJX0JBU0VcIjogXCJodHRwczovL2NodXJuZ3VhcmRhcHAuY29tL2FwaS9zdHJpcGUtYXBwXCJcbiAgfSxcbiAgXCJkaXN0cmlidXRpb25fdHlwZVwiOiBcInB1YmxpY1wiLFxuICBcImljb25cIjogXCIuL3B1YmxpYy9pY29uLnBuZ1wiLFxuICBcImlkXCI6IFwiY29tLmNodXJuZ3VhcmQucmlzay1tb25pdG9yXCIsXG4gIFwibmFtZVwiOiBcIkNodXJuR3VhcmRcIixcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiY3VzdG9tZXJfcmVhZFwiLFxuICAgICAgXCJwdXJwb3NlXCI6IFwiSWRlbnRpZnkgY3VzdG9tZXJzIGF0IHJpc2sgb2YgY2h1cm5pbmcgYmFzZWQgb24gdGhlaXIgcHJvZmlsZSBhbmQgcGF5bWVudCBoaXN0b3J5XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwicGVybWlzc2lvblwiOiBcInN1YnNjcmlwdGlvbl9yZWFkXCIsXG4gICAgICBcInB1cnBvc2VcIjogXCJEZXRlY3QgcGFzdC1kdWUsIGNhbmNlbGxpbmcsIGFuZCBhdC1yaXNrIHN1YnNjcmlwdGlvbnNcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiY2hhcmdlX3JlYWRcIixcbiAgICAgIFwicHVycG9zZVwiOiBcIkNhbGN1bGF0ZSBjaHVybiByaXNrIGZyb20gZmFpbGVkIGFuZCBtaXNzaW5nIHBheW1lbnQgYXR0ZW1wdHNcIlxuICAgIH1cbiAgXSxcbiAgXCJwb3N0X2luc3RhbGxfYWN0aW9uXCI6IHtcbiAgICBcInR5cGVcIjogXCJleHRlcm5hbFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9jaHVybmd1YXJkYXBwLmNvbS9zdHJpcGUtYXBwL2luc3RhbGxcIlxuICB9LFxuICBcInVpX2V4dGVuc2lvblwiOiB7XG4gICAgXCJjb250ZW50X3NlY3VyaXR5X3BvbGljeVwiOiB7XG4gICAgICBcImNvbm5lY3Qtc3JjXCI6IFtcbiAgICAgICAgXCJodHRwczovL2NodXJuZ3VhcmRhcHAuY29tL2FwaS9cIlxuICAgICAgXSxcbiAgICAgIFwicHVycG9zZVwiOiBcIkNodXJuR3VhcmQgYmFja2VuZCBBUEkgZm9yIEFJLXBvd2VyZWQgY2h1cm4gcmlzayBzY29yZXMgYW5kIHJldGVudGlvbiBkYXRhXCJcbiAgICB9LFxuICAgIFwidmlld3NcIjogW1xuICAgICAge1xuICAgICAgICBcImNvbXBvbmVudFwiOiBcIkFwcFwiLFxuICAgICAgICBcInZpZXdwb3J0XCI6IFwic3RyaXBlLmRhc2hib2FyZC5ob21lLm92ZXJ2aWV3XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiY29tcG9uZW50XCI6IFwiQ3VzdG9tZXJEZXRhaWxWaWV3XCIsXG4gICAgICAgIFwidmlld3BvcnRcIjogXCJzdHJpcGUuZGFzaGJvYXJkLmN1c3RvbWVyLmRldGFpbFwiXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIwLjAuNlwiXG59O1xuIiwgImltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTdHJpcGUgZnJvbSAnc3RyaXBlJztcbmltcG9ydCB7XG4gIEJhZGdlLFxuICBCYW5uZXIsXG4gIEJveCxcbiAgQnV0dG9uLFxuICBEaXZpZGVyLFxuICBJbmxpbmUsXG4gIExpbmssXG4gIFNwaW5uZXIsXG59IGZyb20gJ0BzdHJpcGUvdWktZXh0ZW5zaW9uLXNkay91aSc7XG5pbXBvcnQgdHlwZSB7IEV4dGVuc2lvbkNvbnRleHRWYWx1ZSB9IGZyb20gJ0BzdHJpcGUvdWktZXh0ZW5zaW9uLXNkay9jb250ZXh0JztcbmltcG9ydCB7IGNyZWF0ZUh0dHBDbGllbnQsIFNUUklQRV9BUElfS0VZIH0gZnJvbSAnQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL2h0dHBfY2xpZW50JztcbmltcG9ydCB7IGNyZWF0ZU9BdXRoU3RhdGUsIGZldGNoU3RyaXBlU2lnbmF0dXJlIH0gZnJvbSAnQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3V0aWxzJztcbmltcG9ydCB7XG4gIGNhbGN1bGF0ZVJpc2ssXG4gIHJpc2tCYWRnZVR5cGUsXG4gIHN1YnNjcmlwdGlvbkJhZGdlVHlwZSxcbiAgc3Vic2NyaXB0aW9uTGFiZWwsXG59IGZyb20gJy4uL3V0aWxzL3Jpc2tTY29yaW5nJztcblxuY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShTVFJJUEVfQVBJX0tFWSwge1xuICBodHRwQ2xpZW50OiBjcmVhdGVIdHRwQ2xpZW50KCksXG4gIGFwaVZlcnNpb246ICcyMDIzLTEwLTE2Jyxcbn0pO1xuXG5pbnRlcmZhY2UgQ3VzdG9tZXJSb3cge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIHJpc2tTY29yZTogbnVtYmVyO1xuICByaXNrTGV2ZWw6ICdoaWdoJyB8ICdtZWRpdW0nIHwgJ2xvdyc7XG4gIHN1YnNjcmlwdGlvblN0YXR1czogc3RyaW5nO1xuICBjYW5jZWxBdFBlcmlvZEVuZDogYm9vbGVhbjtcbiAgZGF5c1NpbmNlTGFzdFBheW1lbnQ6IG51bWJlciB8IG51bGw7XG4gIG1ycjogbnVtYmVyO1xufVxuXG5jb25zdCBBUFBfVVJMID0gJ2h0dHBzOi8vY2h1cm5ndWFyZGFwcC5jb20nO1xuXG4vLyBUcnVuY2F0ZSBsb25nIHN0cmluZ3Mgc28gdGhleSBkb24ndCBvdmVyZmxvdyB0aGUgbmFycm93IGRyYXdlclxuZnVuY3Rpb24gdHJ1bmMoczogc3RyaW5nLCBtYXg6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBzLmxlbmd0aCA+IG1heCA/IHMuc2xpY2UoMCwgbWF4KSArICdcdTIwMjYnIDogcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgdXNlckNvbnRleHQsIGVudmlyb25tZW50IH06IEV4dGVuc2lvbkNvbnRleHRWYWx1ZSkge1xuICBjb25zdCBbcm93cywgc2V0Um93c10gPSB1c2VTdGF0ZTxDdXN0b21lclJvd1tdPihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbc2hvd2luZ0FsbCwgc2V0U2hvd2luZ0FsbF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtjaHVybkd1YXJkTGlua2VkLCBzZXRDaHVybkd1YXJkTGlua2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBhY2NvdW50SWQgPSB1c2VyQ29udGV4dD8uYWNjb3VudD8uaWQgPz8gJyc7XG4gIGNvbnN0IGFwaUJhc2UgPSAoZW52aXJvbm1lbnQ/LmNvbnN0YW50cyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkKT8uQVBJX0JBU0VcbiAgICA/PyBgJHtBUFBfVVJMfS9hcGkvc3RyaXBlLWFwcGA7XG4gIGNvbnN0IGlzVGVzdE1vZGUgPSBlbnZpcm9ubWVudD8ubW9kZSA9PT0gJ3Rlc3QnO1xuXG4gIC8vIEluaXRpYWxpc2UgY29ubmVjdCBVUkwgaW1tZWRpYXRlbHkgc28gdGhlIGJ1dHRvbiBpcyBuZXZlciBlbXB0eS5cbiAgLy8gQWZ0ZXIgbG9hZCgpIHdlIHVwZ3JhZGUgaXQgd2l0aCBhIHNob3J0LWxpdmVkIE9BdXRoIHN0YXRlLlxuICBjb25zdCBbY29ubmVjdFVybCwgc2V0Q29ubmVjdFVybF0gPSB1c2VTdGF0ZShcbiAgICBgJHtBUFBfVVJMfS9zaWdudXA/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHsgc3RyaXBlX2FjY291bnRfaWQ6IGFjY291bnRJZCwgc291cmNlOiAnc3RyaXBlX2FwcCcgfSl9YFxuICApO1xuXG4gIGNvbnN0IGF0UmlzayA9IHJvd3MuZmlsdGVyKHIgPT4gci5yaXNrU2NvcmUgPj0gNDApO1xuICBjb25zdCBoaWdoUmlzayA9IHJvd3MuZmlsdGVyKHIgPT4gci5yaXNrU2NvcmUgPj0gNzApO1xuICBjb25zdCByZXZlbnVlQXRSaXNrID0gYXRSaXNrLnJlZHVjZSgoc3VtLCByKSA9PiBzdW0gKyByLm1yciwgMCk7XG4gIGNvbnN0IGRpc3BsYXlSb3dzID0gc2hvd2luZ0FsbCA/IHJvd3MgOiByb3dzLnNsaWNlKDAsIDgpO1xuXG4gIC8vIEZvcm1hdCBNUlIgY29tcGFjdGx5IHRvIGF2b2lkIG92ZXJmbG93OiAkMS4yayBpbnN0ZWFkIG9mICQxLDIzNFxuICBmdW5jdGlvbiBmbXRNcnIobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBpZiAobiA+PSAxMDAwKSByZXR1cm4gYCQkeyhuIC8gMTAwMCkudG9GaXhlZCgxKX1rYDtcbiAgICByZXR1cm4gYCQke259YDtcbiAgfVxuXG4gIGNvbnN0IGxvYWQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBTVFJJUEVfQVBJX0tFWSBpcyB0aGUgbWVyY2hhbnQncyBvd24gcmVzdHJpY3RlZCBrZXkgXHUyMDE0IGdyYW50ZWQgYXQgaW5zdGFsbC5cbiAgICAgIC8vIERvIE5PVCBleHBhbmQgZGF0YS5sYXRlc3RfaW52b2ljZS5wYXltZW50X2ludGVudCBcdTIwMTQgcmVxdWlyZXMgaW52b2ljZV9yZWFkXG4gICAgICAvLyB3aGljaCBpcyBub3QgaW4gdGhlIG1hbmlmZXN0IGFuZCBjYXVzZXMgYSBzaWxlbnQgcGVybWlzc2lvbiBlcnJvci5cbiAgICAgIGNvbnN0IFtzdWJzY3JpcHRpb25zUmVzLCBjaGFyZ2VzUmVzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc3RyaXBlLnN1YnNjcmlwdGlvbnMubGlzdCh7XG4gICAgICAgICAgbGltaXQ6IDEwMCxcbiAgICAgICAgICBleHBhbmQ6IFsnZGF0YS5jdXN0b21lcicsICdkYXRhLml0ZW1zLmRhdGEucHJpY2UnXSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cmlwZS5jaGFyZ2VzLmxpc3QoeyBsaW1pdDogMTAwIH0pLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGNoYXJnZXNCeUN1c3RvbWVyOiBSZWNvcmQ8c3RyaW5nLCBTdHJpcGUuQ2hhcmdlW10+ID0ge307XG4gICAgICBmb3IgKGNvbnN0IGNoYXJnZSBvZiBjaGFyZ2VzUmVzLmRhdGEpIHtcbiAgICAgICAgY29uc3QgY2lkID0gdHlwZW9mIGNoYXJnZS5jdXN0b21lciA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IGNoYXJnZS5jdXN0b21lclxuICAgICAgICAgIDogY2hhcmdlLmN1c3RvbWVyPy5pZDtcbiAgICAgICAgaWYgKCFjaWQpIGNvbnRpbnVlO1xuICAgICAgICAoY2hhcmdlc0J5Q3VzdG9tZXJbY2lkXSA/Pz0gW10pLnB1c2goY2hhcmdlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnVpbHQ6IEN1c3RvbWVyUm93W10gPSBbXTtcbiAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnNjcmlwdGlvbnNSZXMuZGF0YSkge1xuICAgICAgICBjb25zdCBjdXN0b21lciA9XG4gICAgICAgICAgdHlwZW9mIHN1Yi5jdXN0b21lciA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICBzdWIuY3VzdG9tZXIgJiZcbiAgICAgICAgICAhKCdkZWxldGVkJyBpbiBzdWIuY3VzdG9tZXIpXG4gICAgICAgICAgICA/IChzdWIuY3VzdG9tZXIgYXMgU3RyaXBlLkN1c3RvbWVyKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBpZiAoIWN1c3RvbWVyKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBjdXN0b21lckNoYXJnZXMgPSBjaGFyZ2VzQnlDdXN0b21lcltjdXN0b21lci5pZF0gPz8gW107XG4gICAgICAgIGNvbnN0IHJpc2sgPSBjYWxjdWxhdGVSaXNrKHN1YiwgY3VzdG9tZXJDaGFyZ2VzKTtcblxuICAgICAgICBjb25zdCBsYXN0U3VjY2VzcyA9IGN1c3RvbWVyQ2hhcmdlcy5maW5kKGMgPT4gYy5zdGF0dXMgPT09ICdzdWNjZWVkZWQnKTtcbiAgICAgICAgY29uc3QgZGF5c1NpbmNlID0gbGFzdFN1Y2Nlc3NcbiAgICAgICAgICA/IE1hdGguZmxvb3IoKERhdGUubm93KCkgLyAxMDAwIC0gbGFzdFN1Y2Nlc3MuY3JlYXRlZCkgLyA4NjQwMClcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgYnVpbHQucHVzaCh7XG4gICAgICAgICAgaWQ6IGN1c3RvbWVyLmlkLFxuICAgICAgICAgIG5hbWU6IGN1c3RvbWVyLm5hbWUgPz8gY3VzdG9tZXIuZW1haWwgPz8gJ1Vua25vd24nLFxuICAgICAgICAgIGVtYWlsOiBjdXN0b21lci5lbWFpbCA/PyAnJyxcbiAgICAgICAgICByaXNrU2NvcmU6IHJpc2suc2NvcmUsXG4gICAgICAgICAgcmlza0xldmVsOiByaXNrLmxldmVsLFxuICAgICAgICAgIHN1YnNjcmlwdGlvblN0YXR1czogc3ViLnN0YXR1cyxcbiAgICAgICAgICBjYW5jZWxBdFBlcmlvZEVuZDogc3ViLmNhbmNlbF9hdF9wZXJpb2RfZW5kLFxuICAgICAgICAgIGRheXNTaW5jZUxhc3RQYXltZW50OiBkYXlzU2luY2UsXG4gICAgICAgICAgbXJyOiByaXNrLm1ycixcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGJ1aWx0LnNvcnQoKGEsIGIpID0+IGIucmlza1Njb3JlIC0gYS5yaXNrU2NvcmUpO1xuICAgICAgc2V0Um93cyhidWlsdCk7XG4gICAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG4gICAgICBzZXRFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ0ZhaWxlZCB0byBsb2FkIFN0cmlwZSBkYXRhJyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIFJ1biBhZnRlciBzZXRMb2FkaW5nKGZhbHNlKSBzbyB0aGV5IG5ldmVyIGJsb2NrIHRoZSBkYXRhIGRpc3BsYXkuXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzdGF0ZSwgY2hhbGxlbmdlIH0gPSBhd2FpdCBjcmVhdGVPQXV0aFN0YXRlKCk7XG4gICAgICBjb25zdCBwID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgICAgIHN0cmlwZV9hY2NvdW50X2lkOiBhY2NvdW50SWQsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBjaGFsbGVuZ2UsXG4gICAgICAgIHNvdXJjZTogJ3N0cmlwZV9hcHAnLFxuICAgICAgfSk7XG4gICAgICBzZXRDb25uZWN0VXJsKGAke0FQUF9VUkx9L3N0cmlwZS1hcHAvY29ubmVjdD8ke3B9YCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBLZWVwIHRoZSBiYXNpYyBzaWdudXAgVVJMXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNpZyA9IGF3YWl0IGZldGNoU3RyaXBlU2lnbmF0dXJlKCk7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlfS9yaXNrP2FjY291bnRfaWQ9JHthY2NvdW50SWR9YCwge1xuICAgICAgICBoZWFkZXJzOiB7ICdzdHJpcGUtc2lnbmF0dXJlJzogc2lnIH0sXG4gICAgICB9KTtcbiAgICAgIGlmIChyZXMub2spIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IChhd2FpdCByZXMuanNvbigpKSBhcyB7IGxpbmtlZD86IGJvb2xlYW4gfTtcbiAgICAgICAgc2V0Q2h1cm5HdWFyZExpbmtlZChkYXRhLmxpbmtlZCA9PT0gdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBCYWNrZW5kIHVuYXZhaWxhYmxlIFx1MjAxNCBuYXRpdmUgc2NvcmVzIHNob3duLCBsaW5rZWQgc3RheXMgZmFsc2VcbiAgICB9XG4gIH0sIFthY2NvdW50SWQsIGFwaUJhc2VdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxvYWQoKTtcbiAgfSwgW2xvYWRdKTtcblxuICAvLyBcdTI1MDBcdTI1MDAgTG9hZGluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgaWYgKGxvYWRpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveCBjc3M9e3sgc3RhY2s6ICd5JywgZ2FwOiAnbWVkaXVtJywgcGFkZGluZzogJ2xhcmdlJywgYWxpZ25YOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPFNwaW5uZXIgLz5cbiAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHknIH19PkxvYWRpbmcgY3VzdG9tZXIgcmlzayBzY29yZXNcdTIwMjY8L0JveD5cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXJyb3IgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94IGNzcz17eyBzdGFjazogJ3knLCBnYXA6ICdtZWRpdW0nLCBwYWRkaW5nOiAnbWVkaXVtJyB9fT5cbiAgICAgICAgPEJhbm5lclxuICAgICAgICAgIHR5cGU9XCJjYXV0aW9uXCJcbiAgICAgICAgICB0aXRsZT1cIkNvdWxkIG5vdCBsb2FkIFN0cmlwZSBkYXRhXCJcbiAgICAgICAgICBkZXNjcmlwdGlvbj17ZXJyb3J9XG4gICAgICAgICAgb25EaXNtaXNzPXsoKSA9PiBzZXRFcnJvcihudWxsKX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvbiBvblByZXNzPXtsb2FkfT5SZXRyeTwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBObyBzdWJzY3JpcHRpb25zIHlldCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneScsIGdhcDogJ21lZGl1bScsIHBhZGRpbmc6ICdtZWRpdW0nIH19PlxuICAgICAgICB7aXNUZXN0TW9kZSAmJiAoXG4gICAgICAgICAgPEJhbm5lclxuICAgICAgICAgICAgdHlwZT1cImNhdXRpb25cIlxuICAgICAgICAgICAgdGl0bGU9XCJUZXN0IG1vZGVcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb249XCJBZGQgdGVzdCBzdWJzY3JpcHRpb25zIHRvIHNlZSByaXNrIHNjb3JlcyBoZXJlLlwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgPEJveCBjc3M9e3tcbiAgICAgICAgICBzdGFjazogJ3knLFxuICAgICAgICAgIGdhcDogJ3NtYWxsJyxcbiAgICAgICAgICBwYWRkaW5nOiAnbWVkaXVtJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjb250YWluZXInLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogJ21lZGl1bScsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ3NtYWxsJywgYWxpZ25ZOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxCYWRnZSB0eXBlPVwicG9zaXRpdmVcIj5MaXZlPC9CYWRnZT5cbiAgICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdib2R5RW1waGFzaXplZCcgfX0+UmVhZGluZyB5b3VyIFN0cmlwZSBkYXRhPC9Cb3g+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHknIH19PlxuICAgICAgICAgICAgTm8gYWN0aXZlIHN1YnNjcmlwdGlvbnMgZm91bmQuIFJpc2sgc2NvcmVzIHdpbGwgYXBwZWFyIGhlcmVcbiAgICAgICAgICAgIGF1dG9tYXRpY2FsbHkgb25jZSBzdWJzY3JpcHRpb25zIGV4aXN0IGluIHRoaXMgYWNjb3VudC5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzZWNvbmRhcnlcIiBvblByZXNzPXtsb2FkfT5SZWZyZXNoPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgICA8SW5saW5lPlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInByaW1hcnlcIiBocmVmPXtjb25uZWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgICAgIEdldCBDaHVybkd1YXJkIFx1MjAxNCBTdGFydCBGcmVlIFRyaWFsXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvSW5saW5lPlxuICAgICAgICA8SW5saW5lPlxuICAgICAgICAgIDxMaW5rIGhyZWY9e2Ake0FQUF9VUkx9L3ByaWNpbmc/c291cmNlPXN0cmlwZV9hcHBgfSBleHRlcm5hbD5cbiAgICAgICAgICAgIFNlZSBhbGwgcGxhbnMgXHUyMTkyXG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L0lubGluZT5cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTWFpbiB2aWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICByZXR1cm4gKFxuICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneScsIGdhcDogJ21lZGl1bScsIHBhZGRpbmc6ICdtZWRpdW0nIH19PlxuICAgICAge2lzVGVzdE1vZGUgJiYgKFxuICAgICAgICA8QmFubmVyXG4gICAgICAgICAgdHlwZT1cImNhdXRpb25cIlxuICAgICAgICAgIHRpdGxlPVwiVGVzdCBtb2RlXCJcbiAgICAgICAgICBkZXNjcmlwdGlvbj1cIlNob3dpbmcgdGVzdCBkYXRhLiBTd2l0Y2ggdG8gbGl2ZSBtb2RlIHRvIHNlZSByZWFsIGN1c3RvbWVyIHJpc2suXCJcbiAgICAgICAgLz5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBTdW1tYXJ5IHN0YXRzIFx1MjAxNCB0aHJlZSBlcXVhbC13aWR0aCB0aWxlcyAqL31cbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ3hzbWFsbCcgfX0+XG4gICAgICAgIDxCb3ggY3NzPXt7XG4gICAgICAgICAgd2lkdGg6ICdmaWxsJyxcbiAgICAgICAgICBzdGFjazogJ3knLFxuICAgICAgICAgIGdhcDogJ3h4c21hbGwnLFxuICAgICAgICAgIHBhZGRpbmc6ICdzbWFsbCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnY29udGFpbmVyJyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICdtZWRpdW0nLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAnY2FwdGlvbicgfX0+QXQgUmlzazwvQm94PlxuICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICd0aXRsZScgfX0+e2F0Umlzay5sZW5ndGh9PC9Cb3g+XG4gICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2NhcHRpb24nIH19PnNjb3JlIFx1MjI2NSA0MDwvQm94PlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPEJveCBjc3M9e3tcbiAgICAgICAgICB3aWR0aDogJ2ZpbGwnLFxuICAgICAgICAgIHN0YWNrOiAneScsXG4gICAgICAgICAgZ2FwOiAneHhzbWFsbCcsXG4gICAgICAgICAgcGFkZGluZzogJ3NtYWxsJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjb250YWluZXInLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogJ21lZGl1bScsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdjYXB0aW9uJyB9fT5IaWdoIFJpc2s8L0JveD5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAndGl0bGUnIH19PntoaWdoUmlzay5sZW5ndGh9PC9Cb3g+XG4gICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2NhcHRpb24nIH19PmFjdCBub3c8L0JveD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxCb3ggY3NzPXt7XG4gICAgICAgICAgd2lkdGg6ICdmaWxsJyxcbiAgICAgICAgICBzdGFjazogJ3knLFxuICAgICAgICAgIGdhcDogJ3h4c21hbGwnLFxuICAgICAgICAgIHBhZGRpbmc6ICdzbWFsbCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnY29udGFpbmVyJyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICdtZWRpdW0nLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAnY2FwdGlvbicgfX0+TVJSIFJpc2s8L0JveD5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAndGl0bGUnIH19PntmbXRNcnIocmV2ZW51ZUF0Umlzayl9PC9Cb3g+XG4gICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2NhcHRpb24nIH19Pm1vbnRobHk8L0JveD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cblxuICAgICAgPERpdmlkZXIgLz5cblxuICAgICAgey8qIEN1c3RvbWVyIHJpc2sgbGlzdCBcdTIwMTQgY2FyZCBsYXlvdXQsIGZpdHMgYW55IGRyYXdlciB3aWR0aCAqL31cbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ3NtYWxsJywgYWxpZ25ZOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ3N1YmhlYWRpbmcnIH19PkN1c3RvbWVyIFJpc2sgU2NvcmVzPC9Cb3g+XG4gICAgICAgIDxCYWRnZSB0eXBlPVwibmV1dHJhbFwiPntyb3dzLmxlbmd0aH08L0JhZGdlPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneScsIGdhcDogJ3hzbWFsbCcgfX0+XG4gICAgICAgIHtkaXNwbGF5Um93cy5tYXAocm93ID0+IChcbiAgICAgICAgICA8Qm94XG4gICAgICAgICAgICBrZXk9e3Jvdy5pZH1cbiAgICAgICAgICAgIGNzcz17e1xuICAgICAgICAgICAgICBzdGFjazogJ3knLFxuICAgICAgICAgICAgICBnYXA6ICd4eHNtYWxsJyxcbiAgICAgICAgICAgICAgcGFkZGluZzogJ3NtYWxsJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnbWVkaXVtJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgey8qIFJvdyAxOiBuYW1lICsgZW1haWwgb24gbGVmdCwgcmlzayBiYWRnZSBvbiByaWdodCAqL31cbiAgICAgICAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ3NtYWxsJywgYWxpZ25ZOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAgPEJveCBjc3M9e3sgc3RhY2s6ICd5JywgZ2FwOiAneHhzbWFsbCcsIHdpZHRoOiAnZmlsbCcgfX0+XG4gICAgICAgICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHlFbXBoYXNpemVkJyB9fT57dHJ1bmMocm93Lm5hbWUsIDI0KX08L0JveD5cbiAgICAgICAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAnY2FwdGlvbicgfX0+e3RydW5jKHJvdy5lbWFpbCwgMzApfTwvQm94PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJhZGdlIHR5cGU9e3Jpc2tCYWRnZVR5cGUocm93LnJpc2tMZXZlbCl9PlxuICAgICAgICAgICAgICAgIHtyb3cucmlza1Njb3JlfXsnICd9XG4gICAgICAgICAgICAgICAge3Jvdy5yaXNrTGV2ZWwgPT09ICdoaWdoJyA/ICdIaWdoJyA6IHJvdy5yaXNrTGV2ZWwgPT09ICdtZWRpdW0nID8gJ01lZCcgOiAnTG93J31cbiAgICAgICAgICAgICAgPC9CYWRnZT5cbiAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICB7LyogUm93IDI6IHN0YXR1cyBiYWRnZSArIE1SUiArIGxhc3QgcGF5bWVudCAoYWxsIHNtYWxsKSAqL31cbiAgICAgICAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ3hzbWFsbCcsIGFsaWduWTogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgIDxCYWRnZSB0eXBlPXtzdWJzY3JpcHRpb25CYWRnZVR5cGUocm93LnN1YnNjcmlwdGlvblN0YXR1cywgcm93LmNhbmNlbEF0UGVyaW9kRW5kKX0+XG4gICAgICAgICAgICAgICAge3N1YnNjcmlwdGlvbkxhYmVsKHJvdy5zdWJzY3JpcHRpb25TdGF0dXMsIHJvdy5jYW5jZWxBdFBlcmlvZEVuZCl9XG4gICAgICAgICAgICAgIDwvQmFkZ2U+XG4gICAgICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdjYXB0aW9uJyB9fT5cbiAgICAgICAgICAgICAgICB7Zm10TXJyKHJvdy5tcnIpfS9tb1xuICAgICAgICAgICAgICAgIHtyb3cuZGF5c1NpbmNlTGFzdFBheW1lbnQgIT09IG51bGxcbiAgICAgICAgICAgICAgICAgID8gYCBcdTAwQjcgJHtyb3cuZGF5c1NpbmNlTGFzdFBheW1lbnR9ZCBhZ29gXG4gICAgICAgICAgICAgICAgICA6ICcnfVxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApKX1cblxuICAgICAgICB7cm93cy5sZW5ndGggPiA4ICYmIChcbiAgICAgICAgICA8Qm94IGNzcz17eyBhbGlnblg6ICdjZW50ZXInLCBwYWRkaW5nWTogJ3NtYWxsJyB9fT5cbiAgICAgICAgICAgIDxCdXR0b24gdHlwZT1cInNlY29uZGFyeVwiIG9uUHJlc3M9eygpID0+IHNldFNob3dpbmdBbGwodiA9PiAhdil9PlxuICAgICAgICAgICAgICB7c2hvd2luZ0FsbCA/ICdTaG93IGxlc3MnIDogYFNob3cgYWxsICR7cm93cy5sZW5ndGh9IGN1c3RvbWVyc2B9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8RGl2aWRlciAvPlxuXG4gICAgICB7LyogRm9vdGVyIENUQSAqL31cbiAgICAgIHtjaHVybkd1YXJkTGlua2VkID8gKFxuICAgICAgICA8SW5saW5lPlxuICAgICAgICAgIDxMaW5rIGhyZWY9e2Ake0FQUF9VUkx9L2Rhc2hib2FyZD9zb3VyY2U9c3RyaXBlX2FwcGB9IGV4dGVybmFsPlxuICAgICAgICAgICAgT3BlbiBmdWxsIENodXJuR3VhcmQgZGFzaGJvYXJkIFx1MjE5MlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgPC9JbmxpbmU+XG4gICAgICApIDogKFxuICAgICAgICA8Qm94IGNzcz17eyBzdGFjazogJ3knLCBnYXA6ICd4c21hbGwnIH19PlxuICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdjYXB0aW9uJyB9fT5cbiAgICAgICAgICAgIHtoaWdoUmlzay5sZW5ndGggPiAwXG4gICAgICAgICAgICAgID8gYCR7aGlnaFJpc2subGVuZ3RofSBoaWdoLXJpc2sgY3VzdG9tZXIke2hpZ2hSaXNrLmxlbmd0aCAhPT0gMSA/ICdzJyA6ICcnfSBcdTIwMTQgYXV0b21hdGUgcmV0ZW50aW9uIHdpdGggQ2h1cm5HdWFyZC5gXG4gICAgICAgICAgICAgIDogJ0F1dG9tYXRlIHJldGVudGlvbiBjYW1wYWlnbnMgd2hlbiByaXNrIHNpZ25hbHMgYXBwZWFyLid9XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPElubGluZT5cbiAgICAgICAgICAgIDxCdXR0b24gdHlwZT1cInByaW1hcnlcIiBocmVmPXtjb25uZWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgICAgICAgU3RhcnQgRnJlZSBUcmlhbFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9JbmxpbmU+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKTtcbn1cbiIsICIvKipcbiAqIEVuY2Fwc3VsYXRlcyB0aGUgbG9naWMgZm9yIGlzc3VpbmcgYSByZXF1ZXN0IHRvIHRoZSBTdHJpcGUgQVBJLlxuICpcbiAqIEEgY3VzdG9tIEhUVFAgY2xpZW50IHNob3VsZCBzaG91bGQgaW1wbGVtZW50OlxuICogMS4gQSByZXNwb25zZSBjbGFzcyB3aGljaCBleHRlbmRzIEh0dHBDbGllbnRSZXNwb25zZSBhbmQgd3JhcHMgYXJvdW5kIHRoZWlyXG4gKiAgICBvd24gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgYSByZXNwb25zZS5cbiAqIDIuIEEgY2xpZW50IGNsYXNzIHdoaWNoIGV4dGVuZHMgSHR0cENsaWVudCBhbmQgaW1wbGVtZW50cyBhbGwgbWV0aG9kcyxcbiAqICAgIHJldHVybmluZyB0aGVpciBvd24gcmVzcG9uc2UgY2xhc3Mgd2hlbiBtYWtpbmcgcmVxdWVzdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcbiAgICAvKiogVGhlIGNsaWVudCBuYW1lIHVzZWQgZm9yIGRpYWdub3N0aWNzLiAqL1xuICAgIGdldENsaWVudE5hbWUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q2xpZW50TmFtZSBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIG1ha2VSZXF1ZXN0KGhvc3QsIHBvcnQsIHBhdGgsIG1ldGhvZCwgaGVhZGVycywgcmVxdWVzdERhdGEsIHByb3RvY29sLCB0aW1lb3V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFrZVJlcXVlc3Qgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbiAgICAvKiogSGVscGVyIHRvIG1ha2UgYSBjb25zaXN0ZW50IHRpbWVvdXQgZXJyb3IgYWNyb3NzIGltcGxlbWVudGF0aW9ucy4gKi9cbiAgICBzdGF0aWMgbWFrZVRpbWVvdXRFcnJvcigpIHtcbiAgICAgICAgY29uc3QgdGltZW91dEVyciA9IG5ldyBUeXBlRXJyb3IoSHR0cENsaWVudC5USU1FT1VUX0VSUk9SX0NPREUpO1xuICAgICAgICB0aW1lb3V0RXJyLmNvZGUgPSBIdHRwQ2xpZW50LlRJTUVPVVRfRVJST1JfQ09ERTtcbiAgICAgICAgcmV0dXJuIHRpbWVvdXRFcnI7XG4gICAgfVxufVxuLy8gUHVibGljIEFQSSBhY2Nlc3NpYmxlIHZpYSBTdHJpcGUuSHR0cENsaWVudFxuSHR0cENsaWVudC5DT05ORUNUSU9OX0NMT1NFRF9FUlJPUl9DT0RFUyA9IFsnRUNPTk5SRVNFVCcsICdFUElQRSddO1xuSHR0cENsaWVudC5USU1FT1VUX0VSUk9SX0NPREUgPSAnRVRJTUVET1VUJztcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50UmVzcG9uc2Uge1xuICAgIGNvbnN0cnVjdG9yKHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5fc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gICAgICAgIHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzO1xuICAgIH1cbiAgICBnZXRTdGF0dXNDb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzQ29kZTtcbiAgICB9XG4gICAgZ2V0SGVhZGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlcnM7XG4gICAgfVxuICAgIGdldFJhd1Jlc3BvbnNlKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFJhd1Jlc3BvbnNlIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gICAgdG9TdHJlYW0oc3RyZWFtQ29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RvU3RyZWFtIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RvSlNPTiBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRSZXNwb25zZSwgfSBmcm9tICcuL0h0dHBDbGllbnQuanMnO1xuLyoqXG4gKiBIVFRQIGNsaWVudCB3aGljaCB1c2VzIGEgYGZldGNoYCBmdW5jdGlvbiB0byBpc3N1ZSByZXF1ZXN0cy5cbiAqXG4gKiBCeSBkZWZhdWx0IHJlbGllcyBvbiB0aGUgZ2xvYmFsIGBmZXRjaGAgZnVuY3Rpb24sIGJ1dCBhbiBvcHRpb25hbCBmdW5jdGlvblxuICogY2FuIGJlIHBhc3NlZCBpbi4gSWYgcGFzc2luZyBpbiBhIGZ1bmN0aW9uLCBpdCBpcyBleHBlY3RlZCB0byBtYXRjaCB0aGUgV2ViXG4gKiBGZXRjaCBBUEkuIEFzIGFuIGV4YW1wbGUsIHRoaXMgY291bGQgYmUgdGhlIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZVxuICogbm9kZS1mZXRjaCBwYWNrYWdlIChodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoKS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZldGNoSHR0cENsaWVudCBleHRlbmRzIEh0dHBDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGZldGNoRm4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLy8gRGVmYXVsdCB0byBnbG9iYWwgZmV0Y2ggaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmICghZmV0Y2hGbikge1xuICAgICAgICAgICAgaWYgKCFnbG9iYWxUaGlzLmZldGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmZXRjaCgpIGZ1bmN0aW9uIG5vdCBwcm92aWRlZCBhbmQgaXMgbm90IGRlZmluZWQgaW4gdGhlIGdsb2JhbCBzY29wZS4gJyArXG4gICAgICAgICAgICAgICAgICAgICdZb3UgbXVzdCBwcm92aWRlIGEgZmV0Y2ggaW1wbGVtZW50YXRpb24uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZXRjaEZuID0gZ2xvYmFsVGhpcy5mZXRjaDtcbiAgICAgICAgfVxuICAgICAgICAvLyBCb3RoIHRpbWVvdXQgYmVoYXZpb3JzIGRpZmZlcnMgZnJvbSBOb2RlOlxuICAgICAgICAvLyAtIEZldGNoIHVzZXMgYSBzaW5nbGUgdGltZW91dCBmb3IgdGhlIGVudGlyZSBsZW5ndGggb2YgdGhlIHJlcXVlc3QuXG4gICAgICAgIC8vIC0gTm9kZSBpcyBtb3JlIGZpbmUtZ3JhaW5lZCBhbmQgcmVzZXRzIHRoZSB0aW1lb3V0IGFmdGVyIGVhY2ggc3RhZ2Ugb2YgdGhlIHJlcXVlc3QuXG4gICAgICAgIGlmIChnbG9iYWxUaGlzLkFib3J0Q29udHJvbGxlcikge1xuICAgICAgICAgICAgLy8gVXRpbGlzZSBuYXRpdmUgQWJvcnRDb250cm9sbGVyIGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgLy8gQWJvcnRDb250cm9sbGVyIHdhcyBhZGRlZCBpbiBOb2RlIHYxNS4wLjAsIHYxNC4xNy4wXG4gICAgICAgICAgICB0aGlzLl9mZXRjaEZuID0gRmV0Y2hIdHRwQ2xpZW50Lm1ha2VGZXRjaFdpdGhBYm9ydFRpbWVvdXQoZmV0Y2hGbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBGYWxsIGJhY2sgdG8gcmFjaW5nIGFnYWluc3QgYSB0aW1lb3V0IHByb21pc2UgaWYgbm90IGF2YWlsYWJsZSBpbiB0aGUgcnVudGltZVxuICAgICAgICAgICAgLy8gVGhpcyBkb2VzIG5vdCBhY3R1YWxseSBjYW5jZWwgdGhlIHVuZGVybHlpbmcgZmV0Y2ggb3BlcmF0aW9uIG9yIHJlc291cmNlc1xuICAgICAgICAgICAgdGhpcy5fZmV0Y2hGbiA9IEZldGNoSHR0cENsaWVudC5tYWtlRmV0Y2hXaXRoUmFjZVRpbWVvdXQoZmV0Y2hGbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIG1ha2VGZXRjaFdpdGhSYWNlVGltZW91dChmZXRjaEZuKSB7XG4gICAgICAgIHJldHVybiAodXJsLCBpbml0LCB0aW1lb3V0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGVuZGluZ1RpbWVvdXRJZDtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF8sIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHBlbmRpbmdUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChIdHRwQ2xpZW50Lm1ha2VUaW1lb3V0RXJyb3IoKSk7XG4gICAgICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUHJvbWlzZSA9IGZldGNoRm4odXJsLCBpbml0KTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW2ZldGNoUHJvbWlzZSwgdGltZW91dFByb21pc2VdKS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ1RpbWVvdXRJZCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGVuZGluZ1RpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBtYWtlRmV0Y2hXaXRoQWJvcnRUaW1lb3V0KGZldGNoRm4pIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICh1cmwsIGluaXQsIHRpbWVvdXQpID0+IHtcbiAgICAgICAgICAgIC8vIFVzZSBBYm9ydENvbnRyb2xsZXIgYmVjYXVzZSBBYm9ydFNpZ25hbC50aW1lb3V0KCkgd2FzIGFkZGVkIGxhdGVyIGluIE5vZGUgdjE3LjMuMCwgdjE2LjE0LjBcbiAgICAgICAgICAgIGNvbnN0IGFib3J0ID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICAgICAgbGV0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgYWJvcnQuYWJvcnQoSHR0cENsaWVudC5tYWtlVGltZW91dEVycm9yKCkpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBmZXRjaEZuKHVybCwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpbml0KSwgeyBzaWduYWw6IGFib3J0LnNpZ25hbCB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gU29tZSBpbXBsZW1lbnRhdGlvbnMsIGxpa2Ugbm9kZS1mZXRjaCwgZG8gbm90IHJlc3BlY3QgdGhlIHJlYXNvbiBwYXNzZWQgdG8gQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICAgICAgICAgICAgICAvLyBhbmQgaW5zdGVhZCBpdCBhbHdheXMgdGhyb3dzIGFuIEFib3J0RXJyb3JcbiAgICAgICAgICAgICAgICAvLyBXZSBjYXRjaCB0aGlzIGNhc2UgdG8gbm9ybWFsaXNlIGFsbCB0aW1lb3V0IGVycm9yc1xuICAgICAgICAgICAgICAgIGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEh0dHBDbGllbnQubWFrZVRpbWVvdXRFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKiogQG92ZXJyaWRlLiAqL1xuICAgIGdldENsaWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnZmV0Y2gnO1xuICAgIH1cbiAgICBhc3luYyBtYWtlUmVxdWVzdChob3N0LCBwb3J0LCBwYXRoLCBtZXRob2QsIGhlYWRlcnMsIHJlcXVlc3REYXRhLCBwcm90b2NvbCwgdGltZW91dCkge1xuICAgICAgICBjb25zdCBpc0luc2VjdXJlQ29ubmVjdGlvbiA9IHByb3RvY29sID09PSAnaHR0cCc7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGF0aCwgYCR7aXNJbnNlY3VyZUNvbm5lY3Rpb24gPyAnaHR0cCcgOiAnaHR0cHMnfTovLyR7aG9zdH1gKTtcbiAgICAgICAgdXJsLnBvcnQgPSBwb3J0O1xuICAgICAgICAvLyBGb3IgbWV0aG9kcyB3aGljaCBleHBlY3QgcGF5bG9hZHMsIHdlIHNob3VsZCBhbHdheXMgcGFzcyBhIGJvZHkgdmFsdWVcbiAgICAgICAgLy8gZXZlbiB3aGVuIGl0IGlzIGVtcHR5LiBXaXRob3V0IHRoaXMsIHNvbWUgSlMgcnVudGltZXMgKGVnLiBEZW5vKSB3aWxsXG4gICAgICAgIC8vIGluamVjdCBhIHNlY29uZCBDb250ZW50LUxlbmd0aCBoZWFkZXIuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vc3RyaXBlL3N0cmlwZS1ub2RlL2lzc3Vlcy8xNTE5XG4gICAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICAgIGNvbnN0IG1ldGhvZEhhc1BheWxvYWQgPSBtZXRob2QgPT0gJ1BPU1QnIHx8IG1ldGhvZCA9PSAnUFVUJyB8fCBtZXRob2QgPT0gJ1BBVENIJztcbiAgICAgICAgY29uc3QgYm9keSA9IHJlcXVlc3REYXRhIHx8IChtZXRob2RIYXNQYXlsb2FkID8gJycgOiB1bmRlZmluZWQpO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9mZXRjaEZuKHVybC50b1N0cmluZygpLCB7XG4gICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIHJldHVybiBuZXcgRmV0Y2hIdHRwQ2xpZW50UmVzcG9uc2UocmVzKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgRmV0Y2hIdHRwQ2xpZW50UmVzcG9uc2UgZXh0ZW5kcyBIdHRwQ2xpZW50UmVzcG9uc2Uge1xuICAgIGNvbnN0cnVjdG9yKHJlcykge1xuICAgICAgICBzdXBlcihyZXMuc3RhdHVzLCBGZXRjaEh0dHBDbGllbnRSZXNwb25zZS5fdHJhbnNmb3JtSGVhZGVyc1RvT2JqZWN0KHJlcy5oZWFkZXJzKSk7XG4gICAgICAgIHRoaXMuX3JlcyA9IHJlcztcbiAgICB9XG4gICAgZ2V0UmF3UmVzcG9uc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXM7XG4gICAgfVxuICAgIHRvU3RyZWFtKHN0cmVhbUNvbXBsZXRlQ2FsbGJhY2spIHtcbiAgICAgICAgLy8gVW5mb3J0dW5hdGVseSBgZmV0Y2hgIGRvZXMgbm90IGhhdmUgZXZlbnQgaGFuZGxlcnMgZm9yIHdoZW4gdGhlIHN0cmVhbSBpc1xuICAgICAgICAvLyBjb21wbGV0ZWx5IHJlYWQuIFdlIHRoZXJlZm9yZSBpbnZva2UgdGhlIHN0cmVhbUNvbXBsZXRlQ2FsbGJhY2sgcmlnaHRcbiAgICAgICAgLy8gYXdheS4gVGhpcyBjYWxsYmFjayBlbWl0cyBhIHJlc3BvbnNlIGV2ZW50IHdpdGggbWV0YWRhdGEgYW5kIGNvbXBsZXRlc1xuICAgICAgICAvLyBtZXRyaWNzLCBzbyBpdCdzIG9rIHRvIGRvIHRoaXMgd2l0aG91dCB3YWl0aW5nIGZvciB0aGUgc3RyZWFtIHRvIGJlXG4gICAgICAgIC8vIGNvbXBsZXRlbHkgcmVhZC5cbiAgICAgICAgc3RyZWFtQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICAvLyBGZXRjaCdzIGBib2R5YCBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIHJlYWRhYmxlIHN0cmVhbSBvZiB0aGUgYm9keS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlcy5ib2R5O1xuICAgIH1cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXMuanNvbigpO1xuICAgIH1cbiAgICBzdGF0aWMgX3RyYW5zZm9ybUhlYWRlcnNUb09iamVjdChoZWFkZXJzKSB7XG4gICAgICAgIC8vIEZldGNoIHVzZXMgYSBIZWFkZXJzIGluc3RhbmNlIHNvIHRoaXMgbXVzdCBiZSBjb252ZXJ0ZWQgdG8gYSBiYXJlYm9uZXNcbiAgICAgICAgLy8gSlMgb2JqZWN0IHRvIG1lZXQgdGhlIEh0dHBDbGllbnQgaW50ZXJmYWNlLlxuICAgICAgICBjb25zdCBoZWFkZXJzT2JqID0ge307XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgaGVhZGVycykge1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJ5KSB8fCBlbnRyeS5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVzcG9uc2Ugb2JqZWN0cyBwcm9kdWNlZCBieSB0aGUgZmV0Y2ggZnVuY3Rpb24gZ2l2ZW4gdG8gRmV0Y2hIdHRwQ2xpZW50IGRvIG5vdCBoYXZlIGFuIGl0ZXJhYmxlIGhlYWRlcnMgbWFwLiBSZXNwb25zZSNoZWFkZXJzIHNob3VsZCBiZSBhbiBpdGVyYWJsZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWFkZXJzT2JqW2VudHJ5WzBdXSA9IGVudHJ5WzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZWFkZXJzT2JqO1xuICAgIH1cbn1cbiIsICIvKipcbiAqIEludGVyZmFjZSBlbmNhcHN1bGF0aW5nIHRoZSB2YXJpb3VzIGNyeXB0byBjb21wdXRhdGlvbnMgdXNlZCBieSB0aGUgbGlicmFyeSxcbiAqIGFsbG93aW5nIHBsdWdnYWJsZSB1bmRlcmx5aW5nIGNyeXB0byBpbXBsZW1lbnRhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDcnlwdG9Qcm92aWRlciB7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSBTSEEtMjU2IEhNQUMgZ2l2ZW4gYSBzZWNyZXQgYW5kIGEgcGF5bG9hZCAoZW5jb2RlZCBpbiBVVEYtOCkuXG4gICAgICogVGhlIG91dHB1dCBITUFDIHNob3VsZCBiZSBlbmNvZGVkIGluIGhleGFkZWNpbWFsLlxuICAgICAqXG4gICAgICogU2FtcGxlIHZhbHVlcyBmb3IgaW1wbGVtZW50YXRpb25zOlxuICAgICAqIC0gY29tcHV0ZUhNQUNTaWduYXR1cmUoJycsICd0ZXN0X3NlY3JldCcpID0+ICdmN2Y5YmQ0N2ZiOTg3MzM3YjU3OTZmZGMxZmRiOWJhMjIxZDBkNTM5NjgxNGJmY2FmOTUyMWY0M2ZkODkyN2ZkJ1xuICAgICAqIC0gY29tcHV0ZUhNQUNTaWduYXR1cmUoJ1xcdWQ4M2RcXHVkZTAwJywgJ3Rlc3Rfc2VjcmV0JykgPT4gJzgzN2RhMjk2ZDA1YzRmZTMxZjYxZDVkN2VhZDAzNTA5OWQ5NTg1YTViY2RlODdkZTk1MjAxMmE3OGYwYjBjNDNcbiAgICAgKi9cbiAgICBjb21wdXRlSE1BQ1NpZ25hdHVyZShwYXlsb2FkLCBzZWNyZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb21wdXRlSE1BQ1NpZ25hdHVyZSBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91cyB2ZXJzaW9uIG9mIGBjb21wdXRlSE1BQ1NpZ25hdHVyZWAuIFNvbWUgaW1wbGVtZW50YXRpb25zIG1heVxuICAgICAqIG9ubHkgYWxsb3cgc3VwcG9ydCBhc3luYyBzaWduYXR1cmUgY29tcHV0YXRpb24uXG4gICAgICpcbiAgICAgKiBDb21wdXRlcyBhIFNIQS0yNTYgSE1BQyBnaXZlbiBhIHNlY3JldCBhbmQgYSBwYXlsb2FkIChlbmNvZGVkIGluIFVURi04KS5cbiAgICAgKiBUaGUgb3V0cHV0IEhNQUMgc2hvdWxkIGJlIGVuY29kZWQgaW4gaGV4YWRlY2ltYWwuXG4gICAgICpcbiAgICAgKiBTYW1wbGUgdmFsdWVzIGZvciBpbXBsZW1lbnRhdGlvbnM6XG4gICAgICogLSBjb21wdXRlSE1BQ1NpZ25hdHVyZSgnJywgJ3Rlc3Rfc2VjcmV0JykgPT4gJ2Y3ZjliZDQ3ZmI5ODczMzdiNTc5NmZkYzFmZGI5YmEyMjFkMGQ1Mzk2ODE0YmZjYWY5NTIxZjQzZmQ4OTI3ZmQnXG4gICAgICogLSBjb21wdXRlSE1BQ1NpZ25hdHVyZSgnXFx1ZDgzZFxcdWRlMDAnLCAndGVzdF9zZWNyZXQnKSA9PiAnODM3ZGEyOTZkMDVjNGZlMzFmNjFkNWQ3ZWFkMDM1MDk5ZDk1ODVhNWJjZGU4N2RlOTUyMDEyYTc4ZjBiMGM0M1xuICAgICAqL1xuICAgIGNvbXB1dGVITUFDU2lnbmF0dXJlQXN5bmMocGF5bG9hZCwgc2VjcmV0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY29tcHV0ZUhNQUNTaWduYXR1cmVBc3luYyBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxufVxuLyoqXG4gKiBJZiB0aGUgY3J5cHRvIHByb3ZpZGVyIG9ubHkgc3VwcG9ydHMgYXN5bmNocm9ub3VzIG9wZXJhdGlvbnMsXG4gKiB0aHJvdyBDcnlwdG9Qcm92aWRlck9ubHlTdXBwb3J0c0FzeW5jRXJyb3IgaW5zdGVhZCBvZlxuICogYSBnZW5lcmljIGVycm9yIHNvIHRoYXQgdGhlIGNhbGxlciBjYW4gY2hvb3NlIHRvIHByb3ZpZGVcbiAqIGEgbW9yZSBoZWxwZnVsIGVycm9yIG1lc3NhZ2UgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIHVzZVxuICogYW4gYXN5bmNocm9ub3VzIHBhdGh3YXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDcnlwdG9Qcm92aWRlck9ubHlTdXBwb3J0c0FzeW5jRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG4iLCAiaW1wb3J0IHsgQ3J5cHRvUHJvdmlkZXIsIENyeXB0b1Byb3ZpZGVyT25seVN1cHBvcnRzQXN5bmNFcnJvciwgfSBmcm9tICcuL0NyeXB0b1Byb3ZpZGVyLmpzJztcbi8qKlxuICogYENyeXB0b1Byb3ZpZGVyIHdoaWNoIHVzZXMgdGhlIFN1YnRsZUNyeXB0byBpbnRlcmZhY2Ugb2YgdGhlIFdlYiBDcnlwdG8gQVBJLlxuICpcbiAqIFRoaXMgb25seSBzdXBwb3J0cyBhc3luY2hyb25vdXMgb3BlcmF0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnRsZUNyeXB0b1Byb3ZpZGVyIGV4dGVuZHMgQ3J5cHRvUHJvdmlkZXIge1xuICAgIGNvbnN0cnVjdG9yKHN1YnRsZUNyeXB0bykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvLyBJZiBubyBzdWJ0bGUgY3J5cHRvIGlzIGludGVyZmFjZSwgZGVmYXVsdCB0byB0aGUgZ2xvYmFsIG5hbWVzcGFjZS4gVGhpc1xuICAgICAgICAvLyBpcyB0byBhbGxvdyBjdXN0b20gaW50ZXJmYWNlcyAoZWcuIHVzaW5nIHRoZSBOb2RlIHdlYmNyeXB0byBpbnRlcmZhY2UgaW5cbiAgICAgICAgLy8gdGVzdHMpLlxuICAgICAgICB0aGlzLnN1YnRsZUNyeXB0byA9IHN1YnRsZUNyeXB0byB8fCBjcnlwdG8uc3VidGxlO1xuICAgIH1cbiAgICAvKiogQG92ZXJyaWRlICovXG4gICAgY29tcHV0ZUhNQUNTaWduYXR1cmUocGF5bG9hZCwgc2VjcmV0KSB7XG4gICAgICAgIHRocm93IG5ldyBDcnlwdG9Qcm92aWRlck9ubHlTdXBwb3J0c0FzeW5jRXJyb3IoJ1N1YnRsZUNyeXB0b1Byb3ZpZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgc3luY2hyb25vdXMgY29udGV4dC4nKTtcbiAgICB9XG4gICAgLyoqIEBvdmVycmlkZSAqL1xuICAgIGFzeW5jIGNvbXB1dGVITUFDU2lnbmF0dXJlQXN5bmMocGF5bG9hZCwgc2VjcmV0KSB7XG4gICAgICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgdGhpcy5zdWJ0bGVDcnlwdG8uaW1wb3J0S2V5KCdyYXcnLCBlbmNvZGVyLmVuY29kZShzZWNyZXQpLCB7XG4gICAgICAgICAgICBuYW1lOiAnSE1BQycsXG4gICAgICAgICAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMjU2JyB9LFxuICAgICAgICB9LCBmYWxzZSwgWydzaWduJ10pO1xuICAgICAgICBjb25zdCBzaWduYXR1cmVCdWZmZXIgPSBhd2FpdCB0aGlzLnN1YnRsZUNyeXB0by5zaWduKCdobWFjJywga2V5LCBlbmNvZGVyLmVuY29kZShwYXlsb2FkKSk7XG4gICAgICAgIC8vIGNyeXB0by5zdWJ0bGUgcmV0dXJucyB0aGUgc2lnbmF0dXJlIGluIGJhc2U2NCBmb3JtYXQuIFRoaXMgbXVzdCBiZVxuICAgICAgICAvLyBlbmNvZGVkIGluIGhleCB0byBtYXRjaCB0aGUgQ3J5cHRvUHJvdmlkZXIgY29udHJhY3QuIFdlIG1hcCBlYWNoIGJ5dGUgaW5cbiAgICAgICAgLy8gdGhlIGJ1ZmZlciB0byBpdHMgY29ycmVzcG9uZGluZyBoZXggb2N0ZXQgYW5kIHRoZW4gY29tYmluZSBpbnRvIGEgc3RyaW5nLlxuICAgICAgICBjb25zdCBzaWduYXR1cmVCeXRlcyA9IG5ldyBVaW50OEFycmF5KHNpZ25hdHVyZUJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZUhleENvZGVzID0gbmV3IEFycmF5KHNpZ25hdHVyZUJ5dGVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lnbmF0dXJlQnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNpZ25hdHVyZUhleENvZGVzW2ldID0gYnl0ZUhleE1hcHBpbmdbc2lnbmF0dXJlQnl0ZXNbaV1dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWduYXR1cmVIZXhDb2Rlcy5qb2luKCcnKTtcbiAgICB9XG59XG4vLyBDYWNoZWQgbWFwcGluZyBvZiBieXRlIHRvIGhleCByZXByZXNlbnRhdGlvbi4gV2UgZG8gdGhpcyBvbmNlIHRvIGF2b2lkIHJlLVxuLy8gY29tcHV0aW5nIGV2ZXJ5IHRpbWUgd2UgbmVlZCB0byBjb252ZXJ0IHRoZSByZXN1bHQgb2YgYSBzaWduYXR1cmUgdG8gaGV4LlxuY29uc3QgYnl0ZUhleE1hcHBpbmcgPSBuZXcgQXJyYXkoMjU2KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZUhleE1hcHBpbmcubGVuZ3RoOyBpKyspIHtcbiAgICBieXRlSGV4TWFwcGluZ1tpXSA9IGkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyk7XG59XG4iLCAiaW1wb3J0IHsgRmV0Y2hIdHRwQ2xpZW50IH0gZnJvbSAnLi4vbmV0L0ZldGNoSHR0cENsaWVudC5qcyc7XG5pbXBvcnQgeyBTdWJ0bGVDcnlwdG9Qcm92aWRlciB9IGZyb20gJy4uL2NyeXB0by9TdWJ0bGVDcnlwdG9Qcm92aWRlci5qcyc7XG4vKipcbiAqIEludGVyZmFjZSBlbmNhcHN1bGF0aW5nIHZhcmlvdXMgdXRpbGl0eSBmdW5jdGlvbnMgd2hvc2VcbiAqIGltcGxlbWVudGF0aW9ucyBkZXBlbmQgb24gdGhlIHBsYXRmb3JtIC8gSlMgcnVudGltZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXRmb3JtRnVuY3Rpb25zIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZmV0Y2hGbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FnZW50ID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB1bmFtZSB3aXRoIE5vZGUncyBidWlsdC1pbiBgZXhlY2AgZnVuY3Rpb24sIGlmIGF2YWlsYWJsZS5cbiAgICAgKi9cbiAgICBnZXRVbmFtZSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRVbmFtZSBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIHY0IFVVSUQuIFNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyM1xuICAgICAqL1xuICAgIHV1aWQ0KCkge1xuICAgICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCAoYykgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMDtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgICAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcGFyZXMgc3RyaW5ncyBpbiBjb25zdGFudCB0aW1lLlxuICAgICAqL1xuICAgIHNlY3VyZUNvbXBhcmUoYSwgYikge1xuICAgICAgICAvLyByZXR1cm4gZWFybHkgaGVyZSBpZiBidWZmZXIgbGVuZ3RocyBhcmUgbm90IGVxdWFsXG4gICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW4gPSBhLmxlbmd0aDtcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIHJlc3VsdCB8PSBhLmNoYXJDb2RlQXQoaSkgXiBiLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBldmVudCBlbWl0dGVyLlxuICAgICAqL1xuICAgIGNyZWF0ZUVtaXR0ZXIoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY3JlYXRlRW1pdHRlciBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgcmVxdWVzdCBkYXRhIGlzIGEgc3RyZWFtLiBJZiBzbywgcmVhZCB0aGUgZW50aXJlIHN0cmVhbVxuICAgICAqIHRvIGEgYnVmZmVyIGFuZCByZXR1cm4gdGhlIGJ1ZmZlci5cbiAgICAgKi9cbiAgICB0cnlCdWZmZXJEYXRhKGRhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cnlCdWZmZXJEYXRhIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBIVFRQIGNsaWVudCB3aGljaCB1c2VzIHRoZSBOb2RlIGBodHRwYCBhbmQgYGh0dHBzYCBwYWNrYWdlc1xuICAgICAqIHRvIGlzc3VlIHJlcXVlc3RzLlxuICAgICAqL1xuICAgIGNyZWF0ZU5vZGVIdHRwQ2xpZW50KGFnZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY3JlYXRlTm9kZUh0dHBDbGllbnQgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEhUVFAgY2xpZW50IGZvciBpc3N1aW5nIFN0cmlwZSBBUEkgcmVxdWVzdHMgd2hpY2ggdXNlcyB0aGUgV2ViXG4gICAgICogRmV0Y2ggQVBJLlxuICAgICAqXG4gICAgICogQSBmZXRjaCBmdW5jdGlvbiBjYW4gb3B0aW9uYWxseSBiZSBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXIuIElmIG5vbmUgaXNcbiAgICAgKiBwYXNzZWQsIHdpbGwgZGVmYXVsdCB0byB0aGUgZGVmYXVsdCBgZmV0Y2hgIGZ1bmN0aW9uIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gICAgICovXG4gICAgY3JlYXRlRmV0Y2hIdHRwQ2xpZW50KGZldGNoRm4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGZXRjaEh0dHBDbGllbnQoZmV0Y2hGbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gSFRUUCBjbGllbnQgdXNpbmcgcnVudGltZS1zcGVjaWZpYyBBUElzLlxuICAgICAqL1xuICAgIGNyZWF0ZURlZmF1bHRIdHRwQ2xpZW50KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZURlZmF1bHRIdHRwQ2xpZW50IG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIENyeXB0b1Byb3ZpZGVyIHdoaWNoIHVzZXMgdGhlIE5vZGUgYGNyeXB0b2AgcGFja2FnZSBmb3IgaXRzIGNvbXB1dGF0aW9ucy5cbiAgICAgKi9cbiAgICBjcmVhdGVOb2RlQ3J5cHRvUHJvdmlkZXIoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY3JlYXRlTm9kZUNyeXB0b1Byb3ZpZGVyIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIENyeXB0b1Byb3ZpZGVyIHdoaWNoIHVzZXMgdGhlIFN1YnRsZUNyeXB0byBpbnRlcmZhY2Ugb2YgdGhlIFdlYiBDcnlwdG8gQVBJLlxuICAgICAqL1xuICAgIGNyZWF0ZVN1YnRsZUNyeXB0b1Byb3ZpZGVyKHN1YnRsZUNyeXB0bykge1xuICAgICAgICByZXR1cm4gbmV3IFN1YnRsZUNyeXB0b1Byb3ZpZGVyKHN1YnRsZUNyeXB0byk7XG4gICAgfVxuICAgIGNyZWF0ZURlZmF1bHRDcnlwdG9Qcm92aWRlcigpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcmVhdGVEZWZhdWx0Q3J5cHRvUHJvdmlkZXIgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbn1cbiIsICIvKipcbiAqIEBwcml2YXRlXG4gKiAoRm9yIGludGVybmFsIHVzZSBpbiBzdHJpcGUtbm9kZS4pXG4gKiBXcmFwcGVyIGFyb3VuZCB0aGUgRXZlbnQgV2ViIEFQSS5cbiAqL1xuY2xhc3MgX1N0cmlwZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgICBzdXBlcihldmVudE5hbWUpO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbn1cbi8qKiBNaW5pbWFsIEV2ZW50RW1pdHRlciB3cmFwcGVyIGFyb3VuZCBFdmVudFRhcmdldC4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpcGVFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudFRhcmdldCA9IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB0aGlzLmxpc3RlbmVyTWFwcGluZyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgb24oZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgICAgICBjb25zdCBsaXN0ZW5lcldyYXBwZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVyKGV2ZW50LmRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxpc3RlbmVyTWFwcGluZy5zZXQobGlzdGVuZXIsIGxpc3RlbmVyV3JhcHBlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcldyYXBwZXIpO1xuICAgIH1cbiAgICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyV3JhcHBlciA9IHRoaXMubGlzdGVuZXJNYXBwaW5nLmdldChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubGlzdGVuZXJNYXBwaW5nLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcldyYXBwZXIpO1xuICAgIH1cbiAgICBvbmNlKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJXcmFwcGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lcihldmVudC5kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5saXN0ZW5lck1hcHBpbmcuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcldyYXBwZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXJXcmFwcGVyLCB7XG4gICAgICAgICAgICBvbmNlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZW1pdChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgX1N0cmlwZUV2ZW50KGV2ZW50TmFtZSwgZGF0YSkpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBQbGF0Zm9ybUZ1bmN0aW9ucyB9IGZyb20gJy4vUGxhdGZvcm1GdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgU3RyaXBlRW1pdHRlciB9IGZyb20gJy4uL1N0cmlwZUVtaXR0ZXIuanMnO1xuLyoqXG4gKiBTcGVjaWFsaXplcyBXZWJQbGF0Zm9ybUZ1bmN0aW9ucyB1c2luZyBBUElzIGF2YWlsYWJsZSBpbiBXZWIgd29ya2Vycy5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYlBsYXRmb3JtRnVuY3Rpb25zIGV4dGVuZHMgUGxhdGZvcm1GdW5jdGlvbnMge1xuICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICBnZXRVbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG4gICAgLyoqIEBvdmVycmlkZSAqL1xuICAgIGNyZWF0ZUVtaXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaXBlRW1pdHRlcigpO1xuICAgIH1cbiAgICAvKiogQG92ZXJyaWRlICovXG4gICAgdHJ5QnVmZmVyRGF0YShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmZpbGUuZGF0YSBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwbG9hZGluZyBhIGZpbGUgYXMgYSBzdHJlYW0gaXMgbm90IHN1cHBvcnRlZCBpbiBub24tTm9kZSBlbnZpcm9ubWVudHMuIFBsZWFzZSBvcGVuIG9yIHVwdm90ZSBhbiBpc3N1ZSBhdCBnaXRodWIuY29tL3N0cmlwZS9zdHJpcGUtbm9kZSBpZiB5b3UgdXNlIHRoaXMsIGRldGFpbGluZyB5b3VyIHVzZS1jYXNlLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgfVxuICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICBjcmVhdGVOb2RlSHR0cENsaWVudCgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHJpcGU6IGBjcmVhdGVOb2RlSHR0cENsaWVudCgpYCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1Ob2RlIGVudmlyb25tZW50cy4gUGxlYXNlIHVzZSBgY3JlYXRlRmV0Y2hIdHRwQ2xpZW50KClgIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICBjcmVhdGVEZWZhdWx0SHR0cENsaWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUZldGNoSHR0cENsaWVudCgpO1xuICAgIH1cbiAgICAvKiogQG92ZXJyaWRlICovXG4gICAgY3JlYXRlTm9kZUNyeXB0b1Byb3ZpZGVyKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0cmlwZTogYGNyZWF0ZU5vZGVDcnlwdG9Qcm92aWRlcigpYCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1Ob2RlIGVudmlyb25tZW50cy4gUGxlYXNlIHVzZSBgY3JlYXRlU3VidGxlQ3J5cHRvUHJvdmlkZXIoKWAgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgLyoqIEBvdmVycmlkZSAqL1xuICAgIGNyZWF0ZURlZmF1bHRDcnlwdG9Qcm92aWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3VidGxlQ3J5cHRvUHJvdmlkZXIoKTtcbiAgICB9XG59XG4iLCAiLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5leHBvcnQgY29uc3QgZ2VuZXJhdGUgPSAocmF3U3RyaXBlRXJyb3IpID0+IHtcbiAgICBzd2l0Y2ggKHJhd1N0cmlwZUVycm9yLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2FyZF9lcnJvcic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmlwZUNhcmRFcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGNhc2UgJ2ludmFsaWRfcmVxdWVzdF9lcnJvcic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmlwZUludmFsaWRSZXF1ZXN0RXJyb3IocmF3U3RyaXBlRXJyb3IpO1xuICAgICAgICBjYXNlICdhcGlfZXJyb3InOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpcGVBUElFcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGNhc2UgJ2F1dGhlbnRpY2F0aW9uX2Vycm9yJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaXBlQXV0aGVudGljYXRpb25FcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGNhc2UgJ3JhdGVfbGltaXRfZXJyb3InOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpcGVSYXRlTGltaXRFcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGNhc2UgJ2lkZW1wb3RlbmN5X2Vycm9yJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RyaXBlSWRlbXBvdGVuY3lFcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGNhc2UgJ2ludmFsaWRfZ3JhbnQnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJpcGVJbnZhbGlkR3JhbnRFcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmlwZVVua25vd25FcnJvcihyYXdTdHJpcGVFcnJvcik7XG4gICAgfVxufTtcbi8qKlxuICogU3RyaXBlRXJyb3IgaXMgdGhlIGJhc2UgZXJyb3IgZnJvbSB3aGljaCBhbGwgb3RoZXIgbW9yZSBzcGVjaWZpYyBTdHJpcGUgZXJyb3JzIGRlcml2ZS5cbiAqIFNwZWNpZmljYWxseSBmb3IgZXJyb3JzIHJldHVybmVkIGZyb20gU3RyaXBlJ3MgUkVTVCBBUEkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpcGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihyYXcgPSB7fSwgdHlwZSA9IG51bGwpIHtcbiAgICAgICAgc3VwZXIocmF3Lm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgdGhpcy5yYXcgPSByYXc7XG4gICAgICAgIHRoaXMucmF3VHlwZSA9IHJhdy50eXBlO1xuICAgICAgICB0aGlzLmNvZGUgPSByYXcuY29kZTtcbiAgICAgICAgdGhpcy5kb2NfdXJsID0gcmF3LmRvY191cmw7XG4gICAgICAgIHRoaXMucGFyYW0gPSByYXcucGFyYW07XG4gICAgICAgIHRoaXMuZGV0YWlsID0gcmF3LmRldGFpbDtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gcmF3LmhlYWRlcnM7XG4gICAgICAgIHRoaXMucmVxdWVzdElkID0gcmF3LnJlcXVlc3RJZDtcbiAgICAgICAgdGhpcy5zdGF0dXNDb2RlID0gcmF3LnN0YXR1c0NvZGU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gcmF3Lm1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY2hhcmdlID0gcmF3LmNoYXJnZTtcbiAgICAgICAgdGhpcy5kZWNsaW5lX2NvZGUgPSByYXcuZGVjbGluZV9jb2RlO1xuICAgICAgICB0aGlzLnBheW1lbnRfaW50ZW50ID0gcmF3LnBheW1lbnRfaW50ZW50O1xuICAgICAgICB0aGlzLnBheW1lbnRfbWV0aG9kID0gcmF3LnBheW1lbnRfbWV0aG9kO1xuICAgICAgICB0aGlzLnBheW1lbnRfbWV0aG9kX3R5cGUgPSByYXcucGF5bWVudF9tZXRob2RfdHlwZTtcbiAgICAgICAgdGhpcy5zZXR1cF9pbnRlbnQgPSByYXcuc2V0dXBfaW50ZW50O1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHJhdy5zb3VyY2U7XG4gICAgfVxufVxuLyoqXG4gKiBIZWxwZXIgZmFjdG9yeSB3aGljaCB0YWtlcyByYXcgc3RyaXBlIGVycm9ycyBhbmQgb3V0cHV0cyB3cmFwcGluZyBpbnN0YW5jZXNcbiAqL1xuU3RyaXBlRXJyb3IuZ2VuZXJhdGUgPSBnZW5lcmF0ZTtcbi8vIFNwZWNpZmljIFN0cmlwZSBFcnJvciB0eXBlczpcbi8qKlxuICogQ2FyZEVycm9yIGlzIHJhaXNlZCB3aGVuIGEgdXNlciBlbnRlcnMgYSBjYXJkIHRoYXQgY2FuJ3QgYmUgY2hhcmdlZCBmb3JcbiAqIHNvbWUgcmVhc29uLlxuICovXG5leHBvcnQgY2xhc3MgU3RyaXBlQ2FyZEVycm9yIGV4dGVuZHMgU3RyaXBlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJhdyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHJhdywgJ1N0cmlwZUNhcmRFcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogSW52YWxpZFJlcXVlc3RFcnJvciBpcyByYWlzZWQgd2hlbiBhIHJlcXVlc3QgaXMgaW5pdGlhdGVkIHdpdGggaW52YWxpZFxuICogcGFyYW1ldGVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmlwZUludmFsaWRSZXF1ZXN0RXJyb3IgZXh0ZW5kcyBTdHJpcGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IocmF3ID0ge30pIHtcbiAgICAgICAgc3VwZXIocmF3LCAnU3RyaXBlSW52YWxpZFJlcXVlc3RFcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogQVBJRXJyb3IgaXMgYSBnZW5lcmljIGVycm9yIHRoYXQgbWF5IGJlIHJhaXNlZCBpbiBjYXNlcyB3aGVyZSBub25lIG9mIHRoZVxuICogb3RoZXIgbmFtZWQgZXJyb3JzIGNvdmVyIHRoZSBwcm9ibGVtLiBJdCBjb3VsZCBhbHNvIGJlIHJhaXNlZCBpbiB0aGUgY2FzZVxuICogdGhhdCBhIG5ldyBlcnJvciBoYXMgYmVlbiBpbnRyb2R1Y2VkIGluIHRoZSBBUEksIGJ1dCB0aGlzIHZlcnNpb24gb2YgdGhlXG4gKiBOb2RlLkpTIFNESyBkb2Vzbid0IGtub3cgaG93IHRvIGhhbmRsZSBpdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmlwZUFQSUVycm9yIGV4dGVuZHMgU3RyaXBlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJhdyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHJhdywgJ1N0cmlwZUFQSUVycm9yJyk7XG4gICAgfVxufVxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbkVycm9yIGlzIHJhaXNlZCB3aGVuIGludmFsaWQgY3JlZGVudGlhbHMgYXJlIHVzZWQgdG8gY29ubmVjdFxuICogdG8gU3RyaXBlJ3Mgc2VydmVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmlwZUF1dGhlbnRpY2F0aW9uRXJyb3IgZXh0ZW5kcyBTdHJpcGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IocmF3ID0ge30pIHtcbiAgICAgICAgc3VwZXIocmF3LCAnU3RyaXBlQXV0aGVudGljYXRpb25FcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogUGVybWlzc2lvbkVycm9yIGlzIHJhaXNlZCBpbiBjYXNlcyB3aGVyZSBhY2Nlc3Mgd2FzIGF0dGVtcHRlZCBvbiBhIHJlc291cmNlXG4gKiB0aGF0IHdhc24ndCBhbGxvd2VkLlxuICovXG5leHBvcnQgY2xhc3MgU3RyaXBlUGVybWlzc2lvbkVycm9yIGV4dGVuZHMgU3RyaXBlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJhdyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHJhdywgJ1N0cmlwZVBlcm1pc3Npb25FcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogUmF0ZUxpbWl0RXJyb3IgaXMgcmFpc2VkIGluIGNhc2VzIHdoZXJlIGFuIGFjY291bnQgaXMgcHV0dGluZyB0b28gbXVjaCBsb2FkXG4gKiBvbiBTdHJpcGUncyBBUEkgc2VydmVycyAodXN1YWxseSBieSBwZXJmb3JtaW5nIHRvbyBtYW55IHJlcXVlc3RzKS4gUGxlYXNlXG4gKiBiYWNrIG9mZiBvbiByZXF1ZXN0IHJhdGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpcGVSYXRlTGltaXRFcnJvciBleHRlbmRzIFN0cmlwZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihyYXcgPSB7fSkge1xuICAgICAgICBzdXBlcihyYXcsICdTdHJpcGVSYXRlTGltaXRFcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogU3RyaXBlQ29ubmVjdGlvbkVycm9yIGlzIHJhaXNlZCBpbiB0aGUgZXZlbnQgdGhhdCB0aGUgU0RLIGNhbid0IGNvbm5lY3QgdG9cbiAqIFN0cmlwZSdzIHNlcnZlcnMuIFRoYXQgY2FuIGJlIGZvciBhIHZhcmlldHkgb2YgZGlmZmVyZW50IHJlYXNvbnMgZnJvbSBhXG4gKiBkb3duZWQgbmV0d29yayB0byBhIGJhZCBUTFMgY2VydGlmaWNhdGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpcGVDb25uZWN0aW9uRXJyb3IgZXh0ZW5kcyBTdHJpcGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IocmF3ID0ge30pIHtcbiAgICAgICAgc3VwZXIocmF3LCAnU3RyaXBlQ29ubmVjdGlvbkVycm9yJyk7XG4gICAgfVxufVxuLyoqXG4gKiBTaWduYXR1cmVWZXJpZmljYXRpb25FcnJvciBpcyByYWlzZWQgd2hlbiB0aGUgc2lnbmF0dXJlIHZlcmlmaWNhdGlvbiBmb3IgYVxuICogd2ViaG9vayBmYWlsc1xuICovXG5leHBvcnQgY2xhc3MgU3RyaXBlU2lnbmF0dXJlVmVyaWZpY2F0aW9uRXJyb3IgZXh0ZW5kcyBTdHJpcGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IoaGVhZGVyLCBwYXlsb2FkLCByYXcgPSB7fSkge1xuICAgICAgICBzdXBlcihyYXcsICdTdHJpcGVTaWduYXR1cmVWZXJpZmljYXRpb25FcnJvcicpO1xuICAgICAgICB0aGlzLmhlYWRlciA9IGhlYWRlcjtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9XG59XG4vKipcbiAqIElkZW1wb3RlbmN5RXJyb3IgaXMgcmFpc2VkIGluIGNhc2VzIHdoZXJlIGFuIGlkZW1wb3RlbmN5IGtleSB3YXMgdXNlZFxuICogaW1wcm9wZXJseS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmlwZUlkZW1wb3RlbmN5RXJyb3IgZXh0ZW5kcyBTdHJpcGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IocmF3ID0ge30pIHtcbiAgICAgICAgc3VwZXIocmF3LCAnU3RyaXBlSWRlbXBvdGVuY3lFcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogSW52YWxpZEdyYW50RXJyb3IgaXMgcmFpc2VkIHdoZW4gYSBzcGVjaWZpZWQgY29kZSBkb2Vzbid0IGV4aXN0LCBpc1xuICogZXhwaXJlZCwgaGFzIGJlZW4gdXNlZCwgb3IgZG9lc24ndCBiZWxvbmcgdG8geW91OyBhIHJlZnJlc2ggdG9rZW4gZG9lc24ndFxuICogZXhpc3QsIG9yIGRvZXNuJ3QgYmVsb25nIHRvIHlvdTsgb3IgaWYgYW4gQVBJIGtleSdzIG1vZGUgKGxpdmUgb3IgdGVzdClcbiAqIGRvZXNuJ3QgbWF0Y2ggdGhlIG1vZGUgb2YgYSBjb2RlIG9yIHJlZnJlc2ggdG9rZW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpcGVJbnZhbGlkR3JhbnRFcnJvciBleHRlbmRzIFN0cmlwZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihyYXcgPSB7fSkge1xuICAgICAgICBzdXBlcihyYXcsICdTdHJpcGVJbnZhbGlkR3JhbnRFcnJvcicpO1xuICAgIH1cbn1cbi8qKlxuICogQW55IG90aGVyIGVycm9yIGZyb20gU3RyaXBlIG5vdCBzcGVjaWZpY2FsbHkgY2FwdHVyZWQgYWJvdmVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmlwZVVua25vd25FcnJvciBleHRlbmRzIFN0cmlwZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihyYXcgPSB7fSkge1xuICAgICAgICBzdXBlcihyYXcsICdTdHJpcGVVbmtub3duRXJyb3InKTtcbiAgICB9XG59XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5leHBvcnQgY29uc3QgQXBpVmVyc2lvbiA9ICcyMDIzLTEwLTE2JztcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IHJlc291cmNlTmFtZXNwYWNlIH0gZnJvbSAnLi9SZXNvdXJjZU5hbWVzcGFjZS5qcyc7XG5pbXBvcnQgeyBBY2NvdW50cyBhcyBGaW5hbmNpYWxDb25uZWN0aW9uc0FjY291bnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvRmluYW5jaWFsQ29ubmVjdGlvbnMvQWNjb3VudHMuanMnO1xuaW1wb3J0IHsgQWN0aXZlRW50aXRsZW1lbnRzIGFzIEVudGl0bGVtZW50c0FjdGl2ZUVudGl0bGVtZW50cyB9IGZyb20gJy4vcmVzb3VyY2VzL0VudGl0bGVtZW50cy9BY3RpdmVFbnRpdGxlbWVudHMuanMnO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvbnMgYXMgVGVzdEhlbHBlcnNJc3N1aW5nQXV0aG9yaXphdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9Jc3N1aW5nL0F1dGhvcml6YXRpb25zLmpzJztcbmltcG9ydCB7IEF1dGhvcml6YXRpb25zIGFzIElzc3VpbmdBdXRob3JpemF0aW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL0lzc3VpbmcvQXV0aG9yaXphdGlvbnMuanMnO1xuaW1wb3J0IHsgQ2FsY3VsYXRpb25zIGFzIFRheENhbGN1bGF0aW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL1RheC9DYWxjdWxhdGlvbnMuanMnO1xuaW1wb3J0IHsgQ2FyZGhvbGRlcnMgYXMgSXNzdWluZ0NhcmRob2xkZXJzIH0gZnJvbSAnLi9yZXNvdXJjZXMvSXNzdWluZy9DYXJkaG9sZGVycy5qcyc7XG5pbXBvcnQgeyBDYXJkcyBhcyBUZXN0SGVscGVyc0lzc3VpbmdDYXJkcyB9IGZyb20gJy4vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL0lzc3VpbmcvQ2FyZHMuanMnO1xuaW1wb3J0IHsgQ2FyZHMgYXMgSXNzdWluZ0NhcmRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvSXNzdWluZy9DYXJkcy5qcyc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9ucyBhcyBCaWxsaW5nUG9ydGFsQ29uZmlndXJhdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9CaWxsaW5nUG9ydGFsL0NvbmZpZ3VyYXRpb25zLmpzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25zIGFzIFRlcm1pbmFsQ29uZmlndXJhdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXJtaW5hbC9Db25maWd1cmF0aW9ucy5qcyc7XG5pbXBvcnQgeyBDb25maXJtYXRpb25Ub2tlbnMgYXMgVGVzdEhlbHBlcnNDb25maXJtYXRpb25Ub2tlbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9Db25maXJtYXRpb25Ub2tlbnMuanMnO1xuaW1wb3J0IHsgQ29ubmVjdGlvblRva2VucyBhcyBUZXJtaW5hbENvbm5lY3Rpb25Ub2tlbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXJtaW5hbC9Db25uZWN0aW9uVG9rZW5zLmpzJztcbmltcG9ydCB7IENyZWRpdFJldmVyc2FscyBhcyBUcmVhc3VyeUNyZWRpdFJldmVyc2FscyB9IGZyb20gJy4vcmVzb3VyY2VzL1RyZWFzdXJ5L0NyZWRpdFJldmVyc2Fscy5qcyc7XG5pbXBvcnQgeyBDdXN0b21lcnMgYXMgVGVzdEhlbHBlcnNDdXN0b21lcnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9DdXN0b21lcnMuanMnO1xuaW1wb3J0IHsgRGViaXRSZXZlcnNhbHMgYXMgVHJlYXN1cnlEZWJpdFJldmVyc2FscyB9IGZyb20gJy4vcmVzb3VyY2VzL1RyZWFzdXJ5L0RlYml0UmV2ZXJzYWxzLmpzJztcbmltcG9ydCB7IERpc3B1dGVzIGFzIElzc3VpbmdEaXNwdXRlcyB9IGZyb20gJy4vcmVzb3VyY2VzL0lzc3VpbmcvRGlzcHV0ZXMuanMnO1xuaW1wb3J0IHsgRWFybHlGcmF1ZFdhcm5pbmdzIGFzIFJhZGFyRWFybHlGcmF1ZFdhcm5pbmdzIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmFkYXIvRWFybHlGcmF1ZFdhcm5pbmdzLmpzJztcbmltcG9ydCB7IEZlYXR1cmVzIGFzIEVudGl0bGVtZW50c0ZlYXR1cmVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvRW50aXRsZW1lbnRzL0ZlYXR1cmVzLmpzJztcbmltcG9ydCB7IEZpbmFuY2lhbEFjY291bnRzIGFzIFRyZWFzdXJ5RmluYW5jaWFsQWNjb3VudHMgfSBmcm9tICcuL3Jlc291cmNlcy9UcmVhc3VyeS9GaW5hbmNpYWxBY2NvdW50cy5qcyc7XG5pbXBvcnQgeyBJbmJvdW5kVHJhbnNmZXJzIGFzIFRlc3RIZWxwZXJzVHJlYXN1cnlJbmJvdW5kVHJhbnNmZXJzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvVHJlYXN1cnkvSW5ib3VuZFRyYW5zZmVycy5qcyc7XG5pbXBvcnQgeyBJbmJvdW5kVHJhbnNmZXJzIGFzIFRyZWFzdXJ5SW5ib3VuZFRyYW5zZmVycyB9IGZyb20gJy4vcmVzb3VyY2VzL1RyZWFzdXJ5L0luYm91bmRUcmFuc2ZlcnMuanMnO1xuaW1wb3J0IHsgTG9jYXRpb25zIGFzIFRlcm1pbmFsTG9jYXRpb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGVybWluYWwvTG9jYXRpb25zLmpzJztcbmltcG9ydCB7IE1ldGVyRXZlbnRBZGp1c3RtZW50cyBhcyBCaWxsaW5nTWV0ZXJFdmVudEFkanVzdG1lbnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQmlsbGluZy9NZXRlckV2ZW50QWRqdXN0bWVudHMuanMnO1xuaW1wb3J0IHsgTWV0ZXJFdmVudHMgYXMgQmlsbGluZ01ldGVyRXZlbnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQmlsbGluZy9NZXRlckV2ZW50cy5qcyc7XG5pbXBvcnQgeyBNZXRlcnMgYXMgQmlsbGluZ01ldGVycyB9IGZyb20gJy4vcmVzb3VyY2VzL0JpbGxpbmcvTWV0ZXJzLmpzJztcbmltcG9ydCB7IE9yZGVycyBhcyBDbGltYXRlT3JkZXJzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ2xpbWF0ZS9PcmRlcnMuanMnO1xuaW1wb3J0IHsgT3V0Ym91bmRQYXltZW50cyBhcyBUZXN0SGVscGVyc1RyZWFzdXJ5T3V0Ym91bmRQYXltZW50cyB9IGZyb20gJy4vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1RyZWFzdXJ5L091dGJvdW5kUGF5bWVudHMuanMnO1xuaW1wb3J0IHsgT3V0Ym91bmRQYXltZW50cyBhcyBUcmVhc3VyeU91dGJvdW5kUGF5bWVudHMgfSBmcm9tICcuL3Jlc291cmNlcy9UcmVhc3VyeS9PdXRib3VuZFBheW1lbnRzLmpzJztcbmltcG9ydCB7IE91dGJvdW5kVHJhbnNmZXJzIGFzIFRlc3RIZWxwZXJzVHJlYXN1cnlPdXRib3VuZFRyYW5zZmVycyB9IGZyb20gJy4vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1RyZWFzdXJ5L091dGJvdW5kVHJhbnNmZXJzLmpzJztcbmltcG9ydCB7IE91dGJvdW5kVHJhbnNmZXJzIGFzIFRyZWFzdXJ5T3V0Ym91bmRUcmFuc2ZlcnMgfSBmcm9tICcuL3Jlc291cmNlcy9UcmVhc3VyeS9PdXRib3VuZFRyYW5zZmVycy5qcyc7XG5pbXBvcnQgeyBQZXJzb25hbGl6YXRpb25EZXNpZ25zIGFzIFRlc3RIZWxwZXJzSXNzdWluZ1BlcnNvbmFsaXphdGlvbkRlc2lnbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9Jc3N1aW5nL1BlcnNvbmFsaXphdGlvbkRlc2lnbnMuanMnO1xuaW1wb3J0IHsgUGVyc29uYWxpemF0aW9uRGVzaWducyBhcyBJc3N1aW5nUGVyc29uYWxpemF0aW9uRGVzaWducyB9IGZyb20gJy4vcmVzb3VyY2VzL0lzc3VpbmcvUGVyc29uYWxpemF0aW9uRGVzaWducy5qcyc7XG5pbXBvcnQgeyBQaHlzaWNhbEJ1bmRsZXMgYXMgSXNzdWluZ1BoeXNpY2FsQnVuZGxlcyB9IGZyb20gJy4vcmVzb3VyY2VzL0lzc3VpbmcvUGh5c2ljYWxCdW5kbGVzLmpzJztcbmltcG9ydCB7IFByb2R1Y3RzIGFzIENsaW1hdGVQcm9kdWN0cyB9IGZyb20gJy4vcmVzb3VyY2VzL0NsaW1hdGUvUHJvZHVjdHMuanMnO1xuaW1wb3J0IHsgUmVhZGVycyBhcyBUZXN0SGVscGVyc1Rlcm1pbmFsUmVhZGVycyB9IGZyb20gJy4vcmVzb3VyY2VzL1Rlc3RIZWxwZXJzL1Rlcm1pbmFsL1JlYWRlcnMuanMnO1xuaW1wb3J0IHsgUmVhZGVycyBhcyBUZXJtaW5hbFJlYWRlcnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXJtaW5hbC9SZWFkZXJzLmpzJztcbmltcG9ydCB7IFJlY2VpdmVkQ3JlZGl0cyBhcyBUZXN0SGVscGVyc1RyZWFzdXJ5UmVjZWl2ZWRDcmVkaXRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGVzdEhlbHBlcnMvVHJlYXN1cnkvUmVjZWl2ZWRDcmVkaXRzLmpzJztcbmltcG9ydCB7IFJlY2VpdmVkQ3JlZGl0cyBhcyBUcmVhc3VyeVJlY2VpdmVkQ3JlZGl0cyB9IGZyb20gJy4vcmVzb3VyY2VzL1RyZWFzdXJ5L1JlY2VpdmVkQ3JlZGl0cy5qcyc7XG5pbXBvcnQgeyBSZWNlaXZlZERlYml0cyBhcyBUZXN0SGVscGVyc1RyZWFzdXJ5UmVjZWl2ZWREZWJpdHMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9UcmVhc3VyeS9SZWNlaXZlZERlYml0cy5qcyc7XG5pbXBvcnQgeyBSZWNlaXZlZERlYml0cyBhcyBUcmVhc3VyeVJlY2VpdmVkRGViaXRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVHJlYXN1cnkvUmVjZWl2ZWREZWJpdHMuanMnO1xuaW1wb3J0IHsgUmVmdW5kcyBhcyBUZXN0SGVscGVyc1JlZnVuZHMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9SZWZ1bmRzLmpzJztcbmltcG9ydCB7IFJlZ2lzdHJhdGlvbnMgYXMgVGF4UmVnaXN0cmF0aW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL1RheC9SZWdpc3RyYXRpb25zLmpzJztcbmltcG9ydCB7IFJlcG9ydFJ1bnMgYXMgUmVwb3J0aW5nUmVwb3J0UnVucyB9IGZyb20gJy4vcmVzb3VyY2VzL1JlcG9ydGluZy9SZXBvcnRSdW5zLmpzJztcbmltcG9ydCB7IFJlcG9ydFR5cGVzIGFzIFJlcG9ydGluZ1JlcG9ydFR5cGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVwb3J0aW5nL1JlcG9ydFR5cGVzLmpzJztcbmltcG9ydCB7IFJlcXVlc3RzIGFzIEZvcndhcmRpbmdSZXF1ZXN0cyB9IGZyb20gJy4vcmVzb3VyY2VzL0ZvcndhcmRpbmcvUmVxdWVzdHMuanMnO1xuaW1wb3J0IHsgU2NoZWR1bGVkUXVlcnlSdW5zIGFzIFNpZ21hU2NoZWR1bGVkUXVlcnlSdW5zIH0gZnJvbSAnLi9yZXNvdXJjZXMvU2lnbWEvU2NoZWR1bGVkUXVlcnlSdW5zLmpzJztcbmltcG9ydCB7IFNlY3JldHMgYXMgQXBwc1NlY3JldHMgfSBmcm9tICcuL3Jlc291cmNlcy9BcHBzL1NlY3JldHMuanMnO1xuaW1wb3J0IHsgU2Vzc2lvbnMgYXMgQmlsbGluZ1BvcnRhbFNlc3Npb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvQmlsbGluZ1BvcnRhbC9TZXNzaW9ucy5qcyc7XG5pbXBvcnQgeyBTZXNzaW9ucyBhcyBDaGVja291dFNlc3Npb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ2hlY2tvdXQvU2Vzc2lvbnMuanMnO1xuaW1wb3J0IHsgU2Vzc2lvbnMgYXMgRmluYW5jaWFsQ29ubmVjdGlvbnNTZXNzaW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL0ZpbmFuY2lhbENvbm5lY3Rpb25zL1Nlc3Npb25zLmpzJztcbmltcG9ydCB7IFNldHRpbmdzIGFzIFRheFNldHRpbmdzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGF4L1NldHRpbmdzLmpzJztcbmltcG9ydCB7IFN1cHBsaWVycyBhcyBDbGltYXRlU3VwcGxpZXJzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ2xpbWF0ZS9TdXBwbGllcnMuanMnO1xuaW1wb3J0IHsgVGVzdENsb2NrcyBhcyBUZXN0SGVscGVyc1Rlc3RDbG9ja3MgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9UZXN0Q2xvY2tzLmpzJztcbmltcG9ydCB7IFRva2VucyBhcyBJc3N1aW5nVG9rZW5zIH0gZnJvbSAnLi9yZXNvdXJjZXMvSXNzdWluZy9Ub2tlbnMuanMnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25FbnRyaWVzIGFzIFRyZWFzdXJ5VHJhbnNhY3Rpb25FbnRyaWVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVHJlYXN1cnkvVHJhbnNhY3Rpb25FbnRyaWVzLmpzJztcbmltcG9ydCB7IFRyYW5zYWN0aW9ucyBhcyBUZXN0SGVscGVyc0lzc3VpbmdUcmFuc2FjdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UZXN0SGVscGVycy9Jc3N1aW5nL1RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbnMgYXMgRmluYW5jaWFsQ29ubmVjdGlvbnNUcmFuc2FjdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9GaW5hbmNpYWxDb25uZWN0aW9ucy9UcmFuc2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25zIGFzIElzc3VpbmdUcmFuc2FjdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9Jc3N1aW5nL1RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbnMgYXMgVGF4VHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGF4L1RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbnMgYXMgVHJlYXN1cnlUcmFuc2FjdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9UcmVhc3VyeS9UcmFuc2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgVmFsdWVMaXN0SXRlbXMgYXMgUmFkYXJWYWx1ZUxpc3RJdGVtcyB9IGZyb20gJy4vcmVzb3VyY2VzL1JhZGFyL1ZhbHVlTGlzdEl0ZW1zLmpzJztcbmltcG9ydCB7IFZhbHVlTGlzdHMgYXMgUmFkYXJWYWx1ZUxpc3RzIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmFkYXIvVmFsdWVMaXN0cy5qcyc7XG5pbXBvcnQgeyBWZXJpZmljYXRpb25SZXBvcnRzIGFzIElkZW50aXR5VmVyaWZpY2F0aW9uUmVwb3J0cyB9IGZyb20gJy4vcmVzb3VyY2VzL0lkZW50aXR5L1ZlcmlmaWNhdGlvblJlcG9ydHMuanMnO1xuaW1wb3J0IHsgVmVyaWZpY2F0aW9uU2Vzc2lvbnMgYXMgSWRlbnRpdHlWZXJpZmljYXRpb25TZXNzaW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL0lkZW50aXR5L1ZlcmlmaWNhdGlvblNlc3Npb25zLmpzJztcbmV4cG9ydCB7IEFjY291bnRzIGFzIEFjY291bnQgfSBmcm9tICcuL3Jlc291cmNlcy9BY2NvdW50cy5qcyc7XG5leHBvcnQgeyBBY2NvdW50TGlua3MgfSBmcm9tICcuL3Jlc291cmNlcy9BY2NvdW50TGlua3MuanMnO1xuZXhwb3J0IHsgQWNjb3VudFNlc3Npb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvQWNjb3VudFNlc3Npb25zLmpzJztcbmV4cG9ydCB7IEFjY291bnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQWNjb3VudHMuanMnO1xuZXhwb3J0IHsgQXBwbGVQYXlEb21haW5zIH0gZnJvbSAnLi9yZXNvdXJjZXMvQXBwbGVQYXlEb21haW5zLmpzJztcbmV4cG9ydCB7IEFwcGxpY2F0aW9uRmVlcyB9IGZyb20gJy4vcmVzb3VyY2VzL0FwcGxpY2F0aW9uRmVlcy5qcyc7XG5leHBvcnQgeyBCYWxhbmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvQmFsYW5jZS5qcyc7XG5leHBvcnQgeyBCYWxhbmNlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9yZXNvdXJjZXMvQmFsYW5jZVRyYW5zYWN0aW9ucy5qcyc7XG5leHBvcnQgeyBDaGFyZ2VzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ2hhcmdlcy5qcyc7XG5leHBvcnQgeyBDb25maXJtYXRpb25Ub2tlbnMgfSBmcm9tICcuL3Jlc291cmNlcy9Db25maXJtYXRpb25Ub2tlbnMuanMnO1xuZXhwb3J0IHsgQ291bnRyeVNwZWNzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ291bnRyeVNwZWNzLmpzJztcbmV4cG9ydCB7IENvdXBvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9Db3Vwb25zLmpzJztcbmV4cG9ydCB7IENyZWRpdE5vdGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ3JlZGl0Tm90ZXMuanMnO1xuZXhwb3J0IHsgQ3VzdG9tZXJTZXNzaW9ucyB9IGZyb20gJy4vcmVzb3VyY2VzL0N1c3RvbWVyU2Vzc2lvbnMuanMnO1xuZXhwb3J0IHsgQ3VzdG9tZXJzIH0gZnJvbSAnLi9yZXNvdXJjZXMvQ3VzdG9tZXJzLmpzJztcbmV4cG9ydCB7IERpc3B1dGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvRGlzcHV0ZXMuanMnO1xuZXhwb3J0IHsgRXBoZW1lcmFsS2V5cyB9IGZyb20gJy4vcmVzb3VyY2VzL0VwaGVtZXJhbEtleXMuanMnO1xuZXhwb3J0IHsgRXZlbnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvRXZlbnRzLmpzJztcbmV4cG9ydCB7IEV4Y2hhbmdlUmF0ZXMgfSBmcm9tICcuL3Jlc291cmNlcy9FeGNoYW5nZVJhdGVzLmpzJztcbmV4cG9ydCB7IEZpbGVMaW5rcyB9IGZyb20gJy4vcmVzb3VyY2VzL0ZpbGVMaW5rcy5qcyc7XG5leHBvcnQgeyBGaWxlcyB9IGZyb20gJy4vcmVzb3VyY2VzL0ZpbGVzLmpzJztcbmV4cG9ydCB7IEludm9pY2VJdGVtcyB9IGZyb20gJy4vcmVzb3VyY2VzL0ludm9pY2VJdGVtcy5qcyc7XG5leHBvcnQgeyBJbnZvaWNlcyB9IGZyb20gJy4vcmVzb3VyY2VzL0ludm9pY2VzLmpzJztcbmV4cG9ydCB7IE1hbmRhdGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvTWFuZGF0ZXMuanMnO1xuZXhwb3J0IHsgT0F1dGggfSBmcm9tICcuL3Jlc291cmNlcy9PQXV0aC5qcyc7XG5leHBvcnQgeyBQYXltZW50SW50ZW50cyB9IGZyb20gJy4vcmVzb3VyY2VzL1BheW1lbnRJbnRlbnRzLmpzJztcbmV4cG9ydCB7IFBheW1lbnRMaW5rcyB9IGZyb20gJy4vcmVzb3VyY2VzL1BheW1lbnRMaW5rcy5qcyc7XG5leHBvcnQgeyBQYXltZW50TWV0aG9kQ29uZmlndXJhdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9QYXltZW50TWV0aG9kQ29uZmlndXJhdGlvbnMuanMnO1xuZXhwb3J0IHsgUGF5bWVudE1ldGhvZERvbWFpbnMgfSBmcm9tICcuL3Jlc291cmNlcy9QYXltZW50TWV0aG9kRG9tYWlucy5qcyc7XG5leHBvcnQgeyBQYXltZW50TWV0aG9kcyB9IGZyb20gJy4vcmVzb3VyY2VzL1BheW1lbnRNZXRob2RzLmpzJztcbmV4cG9ydCB7IFBheW91dHMgfSBmcm9tICcuL3Jlc291cmNlcy9QYXlvdXRzLmpzJztcbmV4cG9ydCB7IFBsYW5zIH0gZnJvbSAnLi9yZXNvdXJjZXMvUGxhbnMuanMnO1xuZXhwb3J0IHsgUHJpY2VzIH0gZnJvbSAnLi9yZXNvdXJjZXMvUHJpY2VzLmpzJztcbmV4cG9ydCB7IFByb2R1Y3RzIH0gZnJvbSAnLi9yZXNvdXJjZXMvUHJvZHVjdHMuanMnO1xuZXhwb3J0IHsgUHJvbW90aW9uQ29kZXMgfSBmcm9tICcuL3Jlc291cmNlcy9Qcm9tb3Rpb25Db2Rlcy5qcyc7XG5leHBvcnQgeyBRdW90ZXMgfSBmcm9tICcuL3Jlc291cmNlcy9RdW90ZXMuanMnO1xuZXhwb3J0IHsgUmVmdW5kcyB9IGZyb20gJy4vcmVzb3VyY2VzL1JlZnVuZHMuanMnO1xuZXhwb3J0IHsgUmV2aWV3cyB9IGZyb20gJy4vcmVzb3VyY2VzL1Jldmlld3MuanMnO1xuZXhwb3J0IHsgU2V0dXBBdHRlbXB0cyB9IGZyb20gJy4vcmVzb3VyY2VzL1NldHVwQXR0ZW1wdHMuanMnO1xuZXhwb3J0IHsgU2V0dXBJbnRlbnRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvU2V0dXBJbnRlbnRzLmpzJztcbmV4cG9ydCB7IFNoaXBwaW5nUmF0ZXMgfSBmcm9tICcuL3Jlc291cmNlcy9TaGlwcGluZ1JhdGVzLmpzJztcbmV4cG9ydCB7IFNvdXJjZXMgfSBmcm9tICcuL3Jlc291cmNlcy9Tb3VyY2VzLmpzJztcbmV4cG9ydCB7IFN1YnNjcmlwdGlvbkl0ZW1zIH0gZnJvbSAnLi9yZXNvdXJjZXMvU3Vic2NyaXB0aW9uSXRlbXMuanMnO1xuZXhwb3J0IHsgU3Vic2NyaXB0aW9uU2NoZWR1bGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvU3Vic2NyaXB0aW9uU2NoZWR1bGVzLmpzJztcbmV4cG9ydCB7IFN1YnNjcmlwdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlcy9TdWJzY3JpcHRpb25zLmpzJztcbmV4cG9ydCB7IFRheENvZGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGF4Q29kZXMuanMnO1xuZXhwb3J0IHsgVGF4SWRzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGF4SWRzLmpzJztcbmV4cG9ydCB7IFRheFJhdGVzIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGF4UmF0ZXMuanMnO1xuZXhwb3J0IHsgVG9rZW5zIH0gZnJvbSAnLi9yZXNvdXJjZXMvVG9rZW5zLmpzJztcbmV4cG9ydCB7IFRvcHVwcyB9IGZyb20gJy4vcmVzb3VyY2VzL1RvcHVwcy5qcyc7XG5leHBvcnQgeyBUcmFuc2ZlcnMgfSBmcm9tICcuL3Jlc291cmNlcy9UcmFuc2ZlcnMuanMnO1xuZXhwb3J0IHsgV2ViaG9va0VuZHBvaW50cyB9IGZyb20gJy4vcmVzb3VyY2VzL1dlYmhvb2tFbmRwb2ludHMuanMnO1xuZXhwb3J0IGNvbnN0IEFwcHMgPSByZXNvdXJjZU5hbWVzcGFjZSgnYXBwcycsIHsgU2VjcmV0czogQXBwc1NlY3JldHMgfSk7XG5leHBvcnQgY29uc3QgQmlsbGluZyA9IHJlc291cmNlTmFtZXNwYWNlKCdiaWxsaW5nJywge1xuICAgIE1ldGVyRXZlbnRBZGp1c3RtZW50czogQmlsbGluZ01ldGVyRXZlbnRBZGp1c3RtZW50cyxcbiAgICBNZXRlckV2ZW50czogQmlsbGluZ01ldGVyRXZlbnRzLFxuICAgIE1ldGVyczogQmlsbGluZ01ldGVycyxcbn0pO1xuZXhwb3J0IGNvbnN0IEJpbGxpbmdQb3J0YWwgPSByZXNvdXJjZU5hbWVzcGFjZSgnYmlsbGluZ1BvcnRhbCcsIHtcbiAgICBDb25maWd1cmF0aW9uczogQmlsbGluZ1BvcnRhbENvbmZpZ3VyYXRpb25zLFxuICAgIFNlc3Npb25zOiBCaWxsaW5nUG9ydGFsU2Vzc2lvbnMsXG59KTtcbmV4cG9ydCBjb25zdCBDaGVja291dCA9IHJlc291cmNlTmFtZXNwYWNlKCdjaGVja291dCcsIHtcbiAgICBTZXNzaW9uczogQ2hlY2tvdXRTZXNzaW9ucyxcbn0pO1xuZXhwb3J0IGNvbnN0IENsaW1hdGUgPSByZXNvdXJjZU5hbWVzcGFjZSgnY2xpbWF0ZScsIHtcbiAgICBPcmRlcnM6IENsaW1hdGVPcmRlcnMsXG4gICAgUHJvZHVjdHM6IENsaW1hdGVQcm9kdWN0cyxcbiAgICBTdXBwbGllcnM6IENsaW1hdGVTdXBwbGllcnMsXG59KTtcbmV4cG9ydCBjb25zdCBFbnRpdGxlbWVudHMgPSByZXNvdXJjZU5hbWVzcGFjZSgnZW50aXRsZW1lbnRzJywge1xuICAgIEFjdGl2ZUVudGl0bGVtZW50czogRW50aXRsZW1lbnRzQWN0aXZlRW50aXRsZW1lbnRzLFxuICAgIEZlYXR1cmVzOiBFbnRpdGxlbWVudHNGZWF0dXJlcyxcbn0pO1xuZXhwb3J0IGNvbnN0IEZpbmFuY2lhbENvbm5lY3Rpb25zID0gcmVzb3VyY2VOYW1lc3BhY2UoJ2ZpbmFuY2lhbENvbm5lY3Rpb25zJywge1xuICAgIEFjY291bnRzOiBGaW5hbmNpYWxDb25uZWN0aW9uc0FjY291bnRzLFxuICAgIFNlc3Npb25zOiBGaW5hbmNpYWxDb25uZWN0aW9uc1Nlc3Npb25zLFxuICAgIFRyYW5zYWN0aW9uczogRmluYW5jaWFsQ29ubmVjdGlvbnNUcmFuc2FjdGlvbnMsXG59KTtcbmV4cG9ydCBjb25zdCBGb3J3YXJkaW5nID0gcmVzb3VyY2VOYW1lc3BhY2UoJ2ZvcndhcmRpbmcnLCB7XG4gICAgUmVxdWVzdHM6IEZvcndhcmRpbmdSZXF1ZXN0cyxcbn0pO1xuZXhwb3J0IGNvbnN0IElkZW50aXR5ID0gcmVzb3VyY2VOYW1lc3BhY2UoJ2lkZW50aXR5Jywge1xuICAgIFZlcmlmaWNhdGlvblJlcG9ydHM6IElkZW50aXR5VmVyaWZpY2F0aW9uUmVwb3J0cyxcbiAgICBWZXJpZmljYXRpb25TZXNzaW9uczogSWRlbnRpdHlWZXJpZmljYXRpb25TZXNzaW9ucyxcbn0pO1xuZXhwb3J0IGNvbnN0IElzc3VpbmcgPSByZXNvdXJjZU5hbWVzcGFjZSgnaXNzdWluZycsIHtcbiAgICBBdXRob3JpemF0aW9uczogSXNzdWluZ0F1dGhvcml6YXRpb25zLFxuICAgIENhcmRob2xkZXJzOiBJc3N1aW5nQ2FyZGhvbGRlcnMsXG4gICAgQ2FyZHM6IElzc3VpbmdDYXJkcyxcbiAgICBEaXNwdXRlczogSXNzdWluZ0Rpc3B1dGVzLFxuICAgIFBlcnNvbmFsaXphdGlvbkRlc2lnbnM6IElzc3VpbmdQZXJzb25hbGl6YXRpb25EZXNpZ25zLFxuICAgIFBoeXNpY2FsQnVuZGxlczogSXNzdWluZ1BoeXNpY2FsQnVuZGxlcyxcbiAgICBUb2tlbnM6IElzc3VpbmdUb2tlbnMsXG4gICAgVHJhbnNhY3Rpb25zOiBJc3N1aW5nVHJhbnNhY3Rpb25zLFxufSk7XG5leHBvcnQgY29uc3QgUmFkYXIgPSByZXNvdXJjZU5hbWVzcGFjZSgncmFkYXInLCB7XG4gICAgRWFybHlGcmF1ZFdhcm5pbmdzOiBSYWRhckVhcmx5RnJhdWRXYXJuaW5ncyxcbiAgICBWYWx1ZUxpc3RJdGVtczogUmFkYXJWYWx1ZUxpc3RJdGVtcyxcbiAgICBWYWx1ZUxpc3RzOiBSYWRhclZhbHVlTGlzdHMsXG59KTtcbmV4cG9ydCBjb25zdCBSZXBvcnRpbmcgPSByZXNvdXJjZU5hbWVzcGFjZSgncmVwb3J0aW5nJywge1xuICAgIFJlcG9ydFJ1bnM6IFJlcG9ydGluZ1JlcG9ydFJ1bnMsXG4gICAgUmVwb3J0VHlwZXM6IFJlcG9ydGluZ1JlcG9ydFR5cGVzLFxufSk7XG5leHBvcnQgY29uc3QgU2lnbWEgPSByZXNvdXJjZU5hbWVzcGFjZSgnc2lnbWEnLCB7XG4gICAgU2NoZWR1bGVkUXVlcnlSdW5zOiBTaWdtYVNjaGVkdWxlZFF1ZXJ5UnVucyxcbn0pO1xuZXhwb3J0IGNvbnN0IFRheCA9IHJlc291cmNlTmFtZXNwYWNlKCd0YXgnLCB7XG4gICAgQ2FsY3VsYXRpb25zOiBUYXhDYWxjdWxhdGlvbnMsXG4gICAgUmVnaXN0cmF0aW9uczogVGF4UmVnaXN0cmF0aW9ucyxcbiAgICBTZXR0aW5nczogVGF4U2V0dGluZ3MsXG4gICAgVHJhbnNhY3Rpb25zOiBUYXhUcmFuc2FjdGlvbnMsXG59KTtcbmV4cG9ydCBjb25zdCBUZXJtaW5hbCA9IHJlc291cmNlTmFtZXNwYWNlKCd0ZXJtaW5hbCcsIHtcbiAgICBDb25maWd1cmF0aW9uczogVGVybWluYWxDb25maWd1cmF0aW9ucyxcbiAgICBDb25uZWN0aW9uVG9rZW5zOiBUZXJtaW5hbENvbm5lY3Rpb25Ub2tlbnMsXG4gICAgTG9jYXRpb25zOiBUZXJtaW5hbExvY2F0aW9ucyxcbiAgICBSZWFkZXJzOiBUZXJtaW5hbFJlYWRlcnMsXG59KTtcbmV4cG9ydCBjb25zdCBUZXN0SGVscGVycyA9IHJlc291cmNlTmFtZXNwYWNlKCd0ZXN0SGVscGVycycsIHtcbiAgICBDb25maXJtYXRpb25Ub2tlbnM6IFRlc3RIZWxwZXJzQ29uZmlybWF0aW9uVG9rZW5zLFxuICAgIEN1c3RvbWVyczogVGVzdEhlbHBlcnNDdXN0b21lcnMsXG4gICAgUmVmdW5kczogVGVzdEhlbHBlcnNSZWZ1bmRzLFxuICAgIFRlc3RDbG9ja3M6IFRlc3RIZWxwZXJzVGVzdENsb2NrcyxcbiAgICBJc3N1aW5nOiByZXNvdXJjZU5hbWVzcGFjZSgnaXNzdWluZycsIHtcbiAgICAgICAgQXV0aG9yaXphdGlvbnM6IFRlc3RIZWxwZXJzSXNzdWluZ0F1dGhvcml6YXRpb25zLFxuICAgICAgICBDYXJkczogVGVzdEhlbHBlcnNJc3N1aW5nQ2FyZHMsXG4gICAgICAgIFBlcnNvbmFsaXphdGlvbkRlc2lnbnM6IFRlc3RIZWxwZXJzSXNzdWluZ1BlcnNvbmFsaXphdGlvbkRlc2lnbnMsXG4gICAgICAgIFRyYW5zYWN0aW9uczogVGVzdEhlbHBlcnNJc3N1aW5nVHJhbnNhY3Rpb25zLFxuICAgIH0pLFxuICAgIFRlcm1pbmFsOiByZXNvdXJjZU5hbWVzcGFjZSgndGVybWluYWwnLCB7XG4gICAgICAgIFJlYWRlcnM6IFRlc3RIZWxwZXJzVGVybWluYWxSZWFkZXJzLFxuICAgIH0pLFxuICAgIFRyZWFzdXJ5OiByZXNvdXJjZU5hbWVzcGFjZSgndHJlYXN1cnknLCB7XG4gICAgICAgIEluYm91bmRUcmFuc2ZlcnM6IFRlc3RIZWxwZXJzVHJlYXN1cnlJbmJvdW5kVHJhbnNmZXJzLFxuICAgICAgICBPdXRib3VuZFBheW1lbnRzOiBUZXN0SGVscGVyc1RyZWFzdXJ5T3V0Ym91bmRQYXltZW50cyxcbiAgICAgICAgT3V0Ym91bmRUcmFuc2ZlcnM6IFRlc3RIZWxwZXJzVHJlYXN1cnlPdXRib3VuZFRyYW5zZmVycyxcbiAgICAgICAgUmVjZWl2ZWRDcmVkaXRzOiBUZXN0SGVscGVyc1RyZWFzdXJ5UmVjZWl2ZWRDcmVkaXRzLFxuICAgICAgICBSZWNlaXZlZERlYml0czogVGVzdEhlbHBlcnNUcmVhc3VyeVJlY2VpdmVkRGViaXRzLFxuICAgIH0pLFxufSk7XG5leHBvcnQgY29uc3QgVHJlYXN1cnkgPSByZXNvdXJjZU5hbWVzcGFjZSgndHJlYXN1cnknLCB7XG4gICAgQ3JlZGl0UmV2ZXJzYWxzOiBUcmVhc3VyeUNyZWRpdFJldmVyc2FscyxcbiAgICBEZWJpdFJldmVyc2FsczogVHJlYXN1cnlEZWJpdFJldmVyc2FscyxcbiAgICBGaW5hbmNpYWxBY2NvdW50czogVHJlYXN1cnlGaW5hbmNpYWxBY2NvdW50cyxcbiAgICBJbmJvdW5kVHJhbnNmZXJzOiBUcmVhc3VyeUluYm91bmRUcmFuc2ZlcnMsXG4gICAgT3V0Ym91bmRQYXltZW50czogVHJlYXN1cnlPdXRib3VuZFBheW1lbnRzLFxuICAgIE91dGJvdW5kVHJhbnNmZXJzOiBUcmVhc3VyeU91dGJvdW5kVHJhbnNmZXJzLFxuICAgIFJlY2VpdmVkQ3JlZGl0czogVHJlYXN1cnlSZWNlaXZlZENyZWRpdHMsXG4gICAgUmVjZWl2ZWREZWJpdHM6IFRyZWFzdXJ5UmVjZWl2ZWREZWJpdHMsXG4gICAgVHJhbnNhY3Rpb25FbnRyaWVzOiBUcmVhc3VyeVRyYW5zYWN0aW9uRW50cmllcyxcbiAgICBUcmFuc2FjdGlvbnM6IFRyZWFzdXJ5VHJhbnNhY3Rpb25zLFxufSk7XG4iLCAiLy8gUmVzb3VyY2VOYW1lc3BhY2UgYWxsb3dzIHlvdSB0byBjcmVhdGUgbmVzdGVkIHJlc291cmNlcywgaS5lLiBgc3RyaXBlLmlzc3VpbmcuY2FyZHNgLlxuLy8gSXQgYWxzbyB3b3JrcyByZWN1cnNpdmVseSwgc28geW91IGNvdWxkIGRvIGkuZS4gYHN0cmlwZS5iaWxsaW5nLmludm9pY2luZy5wYXlgLlxuZnVuY3Rpb24gUmVzb3VyY2VOYW1lc3BhY2Uoc3RyaXBlLCByZXNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcmVzb3VyY2VzKSB7XG4gICAgICAgIGNvbnN0IGNhbWVsQ2FzZU5hbWUgPSBuYW1lWzBdLnRvTG93ZXJDYXNlKCkgKyBuYW1lLnN1YnN0cmluZygxKTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgcmVzb3VyY2VzW25hbWVdKHN0cmlwZSk7XG4gICAgICAgIHRoaXNbY2FtZWxDYXNlTmFtZV0gPSByZXNvdXJjZTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gcmVzb3VyY2VOYW1lc3BhY2UobmFtZXNwYWNlLCByZXNvdXJjZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0cmlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc291cmNlTmFtZXNwYWNlKHN0cmlwZSwgcmVzb3VyY2VzKTtcbiAgICB9O1xufVxuIiwgImltcG9ydCAqIGFzIHFzIGZyb20gJ3FzJztcbmNvbnN0IE9QVElPTlNfS0VZUyA9IFtcbiAgICAnYXBpS2V5JyxcbiAgICAnaWRlbXBvdGVuY3lLZXknLFxuICAgICdzdHJpcGVBY2NvdW50JyxcbiAgICAnYXBpVmVyc2lvbicsXG4gICAgJ21heE5ldHdvcmtSZXRyaWVzJyxcbiAgICAndGltZW91dCcsXG4gICAgJ2hvc3QnLFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc09wdGlvbnNIYXNoKG8pIHtcbiAgICByZXR1cm4gKG8gJiZcbiAgICAgICAgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmXG4gICAgICAgIE9QVElPTlNfS0VZUy5zb21lKChwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcHJvcCkpKTtcbn1cbi8qKlxuICogU3RyaW5naWZpZXMgYW4gT2JqZWN0LCBhY2NvbW1vZGF0aW5nIG5lc3RlZCBvYmplY3RzXG4gKiAoZm9ybWluZyB0aGUgY29udmVudGlvbmFsIGtleSAncGFyZW50W2NoaWxkXT12YWx1ZScpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlSZXF1ZXN0RGF0YShkYXRhKSB7XG4gICAgcmV0dXJuIChxc1xuICAgICAgICAuc3RyaW5naWZ5KGRhdGEsIHtcbiAgICAgICAgc2VyaWFsaXplRGF0ZTogKGQpID0+IE1hdGguZmxvb3IoZC5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpLFxuICAgIH0pXG4gICAgICAgIC8vIERvbid0IHVzZSBzdHJpY3QgZm9ybSBlbmNvZGluZyBieSBjaGFuZ2luZyB0aGUgc3F1YXJlIGJyYWNrZXQgY29udHJvbFxuICAgICAgICAvLyBjaGFyYWN0ZXJzIGJhY2sgdG8gdGhlaXIgbGl0ZXJhbHMuIFRoaXMgaXMgZmluZSBieSB0aGUgc2VydmVyLCBhbmRcbiAgICAgICAgLy8gbWFrZXMgdGhlc2UgcGFyYW1ldGVyIHN0cmluZ3MgZWFzaWVyIHRvIHJlYWQuXG4gICAgICAgIC5yZXBsYWNlKC8lNUIvZywgJ1snKVxuICAgICAgICAucmVwbGFjZSgvJTVEL2csICddJykpO1xufVxuLyoqXG4gKiBPdXRwdXRzIGEgbmV3IGZ1bmN0aW9uIHdpdGggaW50ZXJwb2xhdGVkIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiBVc2UgbGlrZSBzbzpcbiAqICAgY29uc3QgZm4gPSBtYWtlVVJMSW50ZXJwb2xhdG9yKCdzb21lL3VybC97cGFyYW0xfS97cGFyYW0yfScpO1xuICogICBmbih7IHBhcmFtMTogMTIzLCBwYXJhbTI6IDQ1NiB9KTsgLy8gPT4gJ3NvbWUvdXJsLzEyMy80NTYnXG4gKi9cbmV4cG9ydCBjb25zdCBtYWtlVVJMSW50ZXJwb2xhdG9yID0gKCgpID0+IHtcbiAgICBjb25zdCByYyA9IHtcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcIic6ICdcXFxcXCInLFxuICAgICAgICAnXFx1MjAyOCc6ICdcXFxcdTIwMjgnLFxuICAgICAgICAnXFx1MjAyOSc6ICdcXFxcdTIwMjknLFxuICAgIH07XG4gICAgcmV0dXJuIChzdHIpID0+IHtcbiAgICAgICAgY29uc3QgY2xlYW5TdHJpbmcgPSBzdHIucmVwbGFjZSgvW1wiXFxuXFxyXFx1MjAyOFxcdTIwMjldL2csICgkMCkgPT4gcmNbJDBdKTtcbiAgICAgICAgcmV0dXJuIChvdXRwdXRzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2xlYW5TdHJpbmcucmVwbGFjZSgvXFx7KFtcXHNcXFNdKz8pXFx9L2csICgkMCwgJDEpID0+IFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KG91dHB1dHNbJDFdIHx8ICcnKSk7XG4gICAgICAgIH07XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFVybFBhcmFtcyhwYXRoKSB7XG4gICAgY29uc3QgcGFyYW1zID0gcGF0aC5tYXRjaCgvXFx7XFx3K1xcfS9nKTtcbiAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXMubWFwKChwYXJhbSkgPT4gcGFyYW0ucmVwbGFjZSgvW3t9XS9nLCAnJykpO1xufVxuLyoqXG4gKiBSZXR1cm4gdGhlIGRhdGEgYXJndW1lbnQgZnJvbSBhIGxpc3Qgb2YgYXJndW1lbnRzXG4gKlxuICogQHBhcmFtIHtvYmplY3RbXX0gYXJnc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFGcm9tQXJncyhhcmdzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFyZ3MpIHx8ICFhcmdzWzBdIHx8IHR5cGVvZiBhcmdzWzBdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghaXNPcHRpb25zSGFzaChhcmdzWzBdKSkge1xuICAgICAgICByZXR1cm4gYXJncy5zaGlmdCgpO1xuICAgIH1cbiAgICBjb25zdCBhcmdLZXlzID0gT2JqZWN0LmtleXMoYXJnc1swXSk7XG4gICAgY29uc3Qgb3B0aW9uS2V5c0luQXJncyA9IGFyZ0tleXMuZmlsdGVyKChrZXkpID0+IE9QVElPTlNfS0VZUy5pbmNsdWRlcyhrZXkpKTtcbiAgICAvLyBJbiBzb21lIGNhc2VzIG9wdGlvbnMgbWF5IGJlIHRoZSBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgLy8gSGVyZSB3ZSdyZSBkZXRlY3RpbmcgYSBjYXNlIHdoZXJlIHRoZXJlIGFyZSB0d28gZGlzdGluY3QgYXJndW1lbnRzXG4gICAgLy8gKHRoZSBmaXJzdCBiZWluZyBhcmdzIGFuZCB0aGUgc2Vjb25kIG9wdGlvbnMpIGFuZCB3aXRoIGtub3duXG4gICAgLy8gb3B0aW9uIGtleXMgaW4gdGhlIGZpcnN0IHNvIHRoYXQgd2UgY2FuIHdhcm4gdGhlIHVzZXIgYWJvdXQgaXQuXG4gICAgaWYgKG9wdGlvbktleXNJbkFyZ3MubGVuZ3RoID4gMCAmJlxuICAgICAgICBvcHRpb25LZXlzSW5BcmdzLmxlbmd0aCAhPT0gYXJnS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgZW1pdFdhcm5pbmcoYE9wdGlvbnMgZm91bmQgaW4gYXJndW1lbnRzICgke29wdGlvbktleXNJbkFyZ3Muam9pbignLCAnKX0pLiBEaWQgeW91IG1lYW4gdG8gcGFzcyBhbiBvcHRpb25zIG9iamVjdD8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGUvd2lraS9QYXNzaW5nLU9wdGlvbnMuYCk7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbn1cbi8qKlxuICogUmV0dXJuIHRoZSBvcHRpb25zIGhhc2ggZnJvbSBhIGxpc3Qgb2YgYXJndW1lbnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcHRpb25zRnJvbUFyZ3MoYXJncykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgIGF1dGg6IG51bGwsXG4gICAgICAgIGhvc3Q6IG51bGwsXG4gICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgfTtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRzLmF1dGggPSBhcmdzLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzT3B0aW9uc0hhc2goYXJnKSkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgYXJncy5wb3AoKSk7XG4gICAgICAgICAgICBjb25zdCBleHRyYUtleXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcigoa2V5KSA9PiAhT1BUSU9OU19LRVlTLmluY2x1ZGVzKGtleSkpO1xuICAgICAgICAgICAgaWYgKGV4dHJhS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlbWl0V2FybmluZyhgSW52YWxpZCBvcHRpb25zIGZvdW5kICgke2V4dHJhS2V5cy5qb2luKCcsICcpfSk7IGlnbm9yaW5nLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmFtcy5hcGlLZXkpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmF1dGggPSBwYXJhbXMuYXBpS2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmFtcy5pZGVtcG90ZW5jeUtleSkge1xuICAgICAgICAgICAgICAgIG9wdHMuaGVhZGVyc1snSWRlbXBvdGVuY3ktS2V5J10gPSBwYXJhbXMuaWRlbXBvdGVuY3lLZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyYW1zLnN0cmlwZUFjY291bnQpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmhlYWRlcnNbJ1N0cmlwZS1BY2NvdW50J10gPSBwYXJhbXMuc3RyaXBlQWNjb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMuYXBpVmVyc2lvbikge1xuICAgICAgICAgICAgICAgIG9wdHMuaGVhZGVyc1snU3RyaXBlLVZlcnNpb24nXSA9IHBhcmFtcy5hcGlWZXJzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIocGFyYW1zLm1heE5ldHdvcmtSZXRyaWVzKSkge1xuICAgICAgICAgICAgICAgIG9wdHMuc2V0dGluZ3MubWF4TmV0d29ya1JldHJpZXMgPSBwYXJhbXMubWF4TmV0d29ya1JldHJpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJhbXMudGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnNldHRpbmdzLnRpbWVvdXQgPSBwYXJhbXMudGltZW91dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaG9zdCkge1xuICAgICAgICAgICAgICAgIG9wdHMuaG9zdCA9IHBhcmFtcy5ob3N0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xufVxuLyoqXG4gKiBQcm92aWRlIHNpbXBsZSBcIkNsYXNzXCIgZXh0ZW5zaW9uIG1lY2hhbmlzbS5cbiAqIDwhLS0gUHVibGljIEFQSSBhY2Nlc3NpYmxlIHZpYSBTdHJpcGUuU3RyaXBlUmVzb3VyY2UuZXh0ZW5kIC0tPlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvdG9FeHRlbmQoc3ViKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgY29uc3QgU3VwZXIgPSB0aGlzO1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN1YiwgJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgPyBzdWIuY29uc3RydWN0b3JcbiAgICAgICAgOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgU3VwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgLy8gVGhpcyBpbml0aWFsaXphdGlvbiBsb2dpYyBpcyBzb21ld2hhdCBzZW5zaXRpdmUgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgLy8gZGl2ZXJnZW50IEpTIGltcGxlbWVudGF0aW9ucyBsaWtlIHRoZSBvbmUgZm91bmQgaW4gUXQuIFNlZSBoZXJlIGZvciBtb3JlXG4gICAgLy8gY29udGV4dDpcbiAgICAvL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGUvcHVsbC8zMzRcbiAgICBPYmplY3QuYXNzaWduKENvbnN0cnVjdG9yLCBTdXBlcik7XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xuICAgIE9iamVjdC5hc3NpZ24oQ29uc3RydWN0b3IucHJvdG90eXBlLCBzdWIpO1xuICAgIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qKlxuICogUmVtb3ZlIGVtcHR5IHZhbHVlcyBmcm9tIGFuIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTnVsbGlzaChvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG4gICAgICAgIGlmIChvYmpba2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xufVxuLyoqXG4gKiBOb3JtYWxpemUgc3RhbmRhcmQgSFRUUCBIZWFkZXJzOlxuICogeydmb28tYmFyJzogJ2hpJ31cbiAqIGJlY29tZXNcbiAqIHsnRm9vLUJhcic6ICdoaSd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJzKG9iaikge1xuICAgIGlmICghKG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKChyZXN1bHQsIGhlYWRlcikgPT4ge1xuICAgICAgICByZXN1bHRbbm9ybWFsaXplSGVhZGVyKGhlYWRlcildID0gb2JqW2hlYWRlcl07XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xufVxuLyoqXG4gKiBTdG9sZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWFydGVuLWRlLXZyaWVzL2hlYWRlci1jYXNlLW5vcm1hbGl6ZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDM2LUw0MVxuICogd2l0aG91dCB0aGUgZXhjZXB0aW9ucyB3aGljaCBhcmUgaXJyZWxldmFudCB0byB1cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpIHtcbiAgICByZXR1cm4gaGVhZGVyXG4gICAgICAgIC5zcGxpdCgnLScpXG4gICAgICAgIC5tYXAoKHRleHQpID0+IHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAuam9pbignLScpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxiYWNraWZ5UHJvbWlzZVdpdGhUaW1lb3V0KHByb21pc2UsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEVuc3VyZSBjYWxsYmFjayBpcyBjYWxsZWQgb3V0c2lkZSBvZiBwcm9taXNlIHN0YWNrLlxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG4vKipcbiAqIEFsbG93IGZvciBzcGVjaWFsIGNhcGl0YWxpemF0aW9uIGNhc2VzIChzdWNoIGFzIE9BdXRoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFzY2FsVG9DYW1lbENhc2UobmFtZSkge1xuICAgIGlmIChuYW1lID09PSAnT0F1dGgnKSB7XG4gICAgICAgIHJldHVybiAnb2F1dGgnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5hbWVbMF0udG9Mb3dlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBlbWl0V2FybmluZyh3YXJuaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzLmVtaXRXYXJuaW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFN0cmlwZTogJHt3YXJuaW5nfWApOyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUgKi9cbiAgICB9XG4gICAgcmV0dXJuIHByb2Nlc3MuZW1pdFdhcm5pbmcod2FybmluZywgJ1N0cmlwZScpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JykgJiYgISFvYmo7XG59XG4vLyBGb3IgdXNlIGluIG11bHRpcGFydCByZXF1ZXN0c1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5BbmRTdHJpbmdpZnkoZGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGNvbnN0IHN0ZXAgPSAob2JqLCBwcmV2S2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgICAgICAgY29uc3QgbmV3S2V5ID0gcHJldktleSA/IGAke3ByZXZLZXl9WyR7a2V5fV1gIDoga2V5O1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb24tYnVmZmVyIG5vbi1maWxlIE9iamVjdHMgYXJlIHJlY3Vyc2l2ZWx5IGZsYXR0ZW5lZFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RlcCh2YWx1ZSwgbmV3S2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1ZmZlcnMgYW5kIGZpbGUgb2JqZWN0cyBhcmUgc3RvcmVkIHdpdGhvdXQgbW9kaWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtuZXdLZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUHJpbWl0aXZlcyBhcmUgY29udmVydGVkIHRvIHN0cmluZ3NcbiAgICAgICAgICAgICAgICByZXN1bHRbbmV3S2V5XSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgc3RlcChkYXRhLCBudWxsKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW50ZWdlcihuYW1lLCBuLCBkZWZhdWx0VmFsKSB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG4pKSB7XG4gICAgICAgIGlmIChkZWZhdWx0VmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG11c3QgYmUgYW4gaW50ZWdlcmApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZVByb2Nlc3NVc2VyQWdlbnRQcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiB0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyB7fVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIGxhbmdfdmVyc2lvbjogcHJvY2Vzcy52ZXJzaW9uLFxuICAgICAgICAgICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgICAgIH07XG59XG4vKipcbiAqIEpvaW5zIGFuIGFycmF5IG9mIFVpbnQ4QXJyYXlzIGludG8gYSBzaW5nbGUgVWludDhBcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0KGFycmF5cykge1xuICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gYXJyYXlzLnJlZHVjZSgobGVuLCBhcnJheSkgPT4gbGVuICsgYXJyYXkubGVuZ3RoLCAwKTtcbiAgICBjb25zdCBtZXJnZWQgPSBuZXcgVWludDhBcnJheSh0b3RhbExlbmd0aCk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgYXJyYXlzLmZvckVhY2goKGFycmF5KSA9PiB7XG4gICAgICAgIG1lcmdlZC5zZXQoYXJyYXksIG9mZnNldCk7XG4gICAgICAgIG9mZnNldCArPSBhcnJheS5sZW5ndGg7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lcmdlZDtcbn1cbiIsICJpbXBvcnQgeyBjYWxsYmFja2lmeVByb21pc2VXaXRoVGltZW91dCwgZ2V0RGF0YUZyb21BcmdzIH0gZnJvbSAnLi91dGlscy5qcyc7XG5jbGFzcyBTdHJpcGVJdGVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoZmlyc3RQYWdlUHJvbWlzZSwgcmVxdWVzdEFyZ3MsIHNwZWMsIHN0cmlwZVJlc291cmNlKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhZ2VQcm9taXNlID0gZmlyc3RQYWdlUHJvbWlzZTtcbiAgICAgICAgdGhpcy5wcm9taXNlQ2FjaGUgPSB7IGN1cnJlbnRQcm9taXNlOiBudWxsIH07XG4gICAgICAgIHRoaXMucmVxdWVzdEFyZ3MgPSByZXF1ZXN0QXJncztcbiAgICAgICAgdGhpcy5zcGVjID0gc3BlYztcbiAgICAgICAgdGhpcy5zdHJpcGVSZXNvdXJjZSA9IHN0cmlwZVJlc291cmNlO1xuICAgIH1cbiAgICBhc3luYyBpdGVyYXRlKHBhZ2VSZXN1bHQpIHtcbiAgICAgICAgaWYgKCEocGFnZVJlc3VsdCAmJlxuICAgICAgICAgICAgcGFnZVJlc3VsdC5kYXRhICYmXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVJlc3VsdC5kYXRhLmxlbmd0aCA9PT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZDogU3RyaXBlIEFQSSByZXNwb25zZSBkb2VzIG5vdCBoYXZlIGEgd2VsbC1mb3JtZWQgYGRhdGFgIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldmVyc2VJdGVyYXRpb24gPSBpc1JldmVyc2VJdGVyYXRpb24odGhpcy5yZXF1ZXN0QXJncyk7XG4gICAgICAgIGlmICh0aGlzLmluZGV4IDwgcGFnZVJlc3VsdC5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gcmV2ZXJzZUl0ZXJhdGlvblxuICAgICAgICAgICAgICAgID8gcGFnZVJlc3VsdC5kYXRhLmxlbmd0aCAtIDEgLSB0aGlzLmluZGV4XG4gICAgICAgICAgICAgICAgOiB0aGlzLmluZGV4O1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYWdlUmVzdWx0LmRhdGFbaWR4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhZ2VSZXN1bHQuaGFzX21vcmUpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IGNvdW50ZXIsIHJlcXVlc3QgbmV4dCBwYWdlLCBhbmQgcmVjdXJzZS5cbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICAgICAgdGhpcy5wYWdlUHJvbWlzZSA9IHRoaXMuZ2V0TmV4dFBhZ2UocGFnZVJlc3VsdCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UGFnZVJlc3VsdCA9IGF3YWl0IHRoaXMucGFnZVByb21pc2U7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVyYXRlKG5leHRQYWdlUmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG4gICAgfVxuICAgIC8qKiBAYWJzdHJhY3QgKi9cbiAgICBnZXROZXh0UGFnZShfcGFnZVJlc3VsdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQnKTtcbiAgICB9XG4gICAgYXN5bmMgX25leHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZXJhdGUoYXdhaXQgdGhpcy5wYWdlUHJvbWlzZSk7XG4gICAgfVxuICAgIG5leHQoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBhIHVzZXIgY2FsbHMgYC5uZXh0KClgIG11bHRpcGxlIHRpbWVzIGluIHBhcmFsbGVsLFxuICAgICAgICAgKiByZXR1cm4gdGhlIHNhbWUgcmVzdWx0IHVudGlsIHNvbWV0aGluZyBoYXMgcmVzb2x2ZWRcbiAgICAgICAgICogdG8gcHJldmVudCBwYWdlLXR1cm5pbmcgcmFjZSBjb25kaXRpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMucHJvbWlzZUNhY2hlLmN1cnJlbnRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FjaGUuY3VycmVudFByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV4dFByb21pc2UgPSAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fbmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9taXNlQ2FjaGUuY3VycmVudFByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlQ2FjaGUuY3VycmVudFByb21pc2UgPSBuZXh0UHJvbWlzZTtcbiAgICAgICAgcmV0dXJuIG5leHRQcm9taXNlO1xuICAgIH1cbn1cbmNsYXNzIExpc3RJdGVyYXRvciBleHRlbmRzIFN0cmlwZUl0ZXJhdG9yIHtcbiAgICBnZXROZXh0UGFnZShwYWdlUmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHJldmVyc2VJdGVyYXRpb24gPSBpc1JldmVyc2VJdGVyYXRpb24odGhpcy5yZXF1ZXN0QXJncyk7XG4gICAgICAgIGNvbnN0IGxhc3RJZCA9IGdldExhc3RJZChwYWdlUmVzdWx0LCByZXZlcnNlSXRlcmF0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaXBlUmVzb3VyY2UuX21ha2VSZXF1ZXN0KHRoaXMucmVxdWVzdEFyZ3MsIHRoaXMuc3BlYywge1xuICAgICAgICAgICAgW3JldmVyc2VJdGVyYXRpb24gPyAnZW5kaW5nX2JlZm9yZScgOiAnc3RhcnRpbmdfYWZ0ZXInXTogbGFzdElkLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5jbGFzcyBTZWFyY2hJdGVyYXRvciBleHRlbmRzIFN0cmlwZUl0ZXJhdG9yIHtcbiAgICBnZXROZXh0UGFnZShwYWdlUmVzdWx0KSB7XG4gICAgICAgIGlmICghcGFnZVJlc3VsdC5uZXh0X3BhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdVbmV4cGVjdGVkOiBTdHJpcGUgQVBJIHJlc3BvbnNlIGRvZXMgbm90IGhhdmUgYSB3ZWxsLWZvcm1lZCBgbmV4dF9wYWdlYCBmaWVsZCwgYnV0IGBoYXNfbW9yZWAgd2FzIHRydWUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaXBlUmVzb3VyY2UuX21ha2VSZXF1ZXN0KHRoaXMucmVxdWVzdEFyZ3MsIHRoaXMuc3BlYywge1xuICAgICAgICAgICAgcGFnZTogcGFnZVJlc3VsdC5uZXh0X3BhZ2UsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBtYWtlQXV0b1BhZ2luYXRpb25NZXRob2RzID0gKHN0cmlwZVJlc291cmNlLCByZXF1ZXN0QXJncywgc3BlYywgZmlyc3RQYWdlUHJvbWlzZSkgPT4ge1xuICAgIGlmIChzcGVjLm1ldGhvZFR5cGUgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgIHJldHVybiBtYWtlQXV0b1BhZ2luYXRpb25NZXRob2RzRnJvbUl0ZXJhdG9yKG5ldyBTZWFyY2hJdGVyYXRvcihmaXJzdFBhZ2VQcm9taXNlLCByZXF1ZXN0QXJncywgc3BlYywgc3RyaXBlUmVzb3VyY2UpKTtcbiAgICB9XG4gICAgaWYgKHNwZWMubWV0aG9kVHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIHJldHVybiBtYWtlQXV0b1BhZ2luYXRpb25NZXRob2RzRnJvbUl0ZXJhdG9yKG5ldyBMaXN0SXRlcmF0b3IoZmlyc3RQYWdlUHJvbWlzZSwgcmVxdWVzdEFyZ3MsIHNwZWMsIHN0cmlwZVJlc291cmNlKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufTtcbmNvbnN0IG1ha2VBdXRvUGFnaW5hdGlvbk1ldGhvZHNGcm9tSXRlcmF0b3IgPSAoaXRlcmF0b3IpID0+IHtcbiAgICBjb25zdCBhdXRvUGFnaW5nRWFjaCA9IG1ha2VBdXRvUGFnaW5nRWFjaCgoLi4uYXJncykgPT4gaXRlcmF0b3IubmV4dCguLi5hcmdzKSk7XG4gICAgY29uc3QgYXV0b1BhZ2luZ1RvQXJyYXkgPSBtYWtlQXV0b1BhZ2luZ1RvQXJyYXkoYXV0b1BhZ2luZ0VhY2gpO1xuICAgIGNvbnN0IGF1dG9QYWdpbmF0aW9uTWV0aG9kcyA9IHtcbiAgICAgICAgYXV0b1BhZ2luZ0VhY2gsXG4gICAgICAgIGF1dG9QYWdpbmdUb0FycmF5LFxuICAgICAgICAvLyBBc3luYyBpdGVyYXRvciBmdW5jdGlvbnM6XG4gICAgICAgIG5leHQ6ICgpID0+IGl0ZXJhdG9yLm5leHQoKSxcbiAgICAgICAgcmV0dXJuOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGZvciBgYnJlYWtgLlxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBbZ2V0QXN5bmNJdGVyYXRvclN5bWJvbCgpXTogKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF1dG9QYWdpbmF0aW9uTWV0aG9kcztcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBhdXRvUGFnaW5hdGlvbk1ldGhvZHM7XG59O1xuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tXG4gKiBQcml2YXRlIEhlbHBlcnM6XG4gKiAtLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmZ1bmN0aW9uIGdldEFzeW5jSXRlcmF0b3JTeW1ib2woKSB7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5hc3luY0l0ZXJhdG9yKSB7XG4gICAgICAgIHJldHVybiBTeW1ib2wuYXN5bmNJdGVyYXRvcjtcbiAgICB9XG4gICAgLy8gRm9sbG93IHRoZSBjb252ZW50aW9uIGZyb20gbGlicmFyaWVzIGxpa2UgaXRlcmFsbDogaHR0cHM6Ly9naXRodWIuY29tL2xlZWJ5cm9uL2l0ZXJhbGwjYXN5bmNpdGVyYXRvci0xXG4gICAgcmV0dXJuICdAQGFzeW5jSXRlcmF0b3InO1xufVxuZnVuY3Rpb24gZ2V0RG9uZUNhbGxiYWNrKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBvbkRvbmUgPSBhcmdzWzFdO1xuICAgIGlmICh0eXBlb2Ygb25Eb25lICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBUaGUgc2Vjb25kIGFyZ3VtZW50IHRvIGF1dG9QYWdpbmdFYWNoLCBpZiBwcmVzZW50LCBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb247IHJlY2VpdmVkICR7dHlwZW9mIG9uRG9uZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG9uRG9uZTtcbn1cbi8qKlxuICogV2UgYWxsb3cgZm91ciBmb3JtcyBvZiB0aGUgYG9uSXRlbWAgY2FsbGJhY2sgKHRoZSBtaWRkbGUgdHdvIGJlaW5nIGVxdWl2YWxlbnQpLFxuICpcbiAqICAgMS4gYC5hdXRvUGFnaW5nRWFjaCgoaXRlbSkgPT4geyBkb1NvbWV0aGluZyhpdGVtKTsgcmV0dXJuIGZhbHNlOyB9KTtgXG4gKiAgIDIuIGAuYXV0b1BhZ2luZ0VhY2goYXN5bmMgKGl0ZW0pID0+IHsgYXdhaXQgZG9Tb21ldGhpbmcoaXRlbSk7IHJldHVybiBmYWxzZTsgfSk7YFxuICogICAzLiBgLmF1dG9QYWdpbmdFYWNoKChpdGVtKSA9PiBkb1NvbWV0aGluZyhpdGVtKS50aGVuKCgpID0+IGZhbHNlKSk7YFxuICogICA0LiBgLmF1dG9QYWdpbmdFYWNoKChpdGVtLCBuZXh0KSA9PiB7IGRvU29tZXRoaW5nKGl0ZW0pOyBuZXh0KGZhbHNlKTsgfSk7YFxuICpcbiAqIEluIGFkZGl0aW9uIHRvIHN0YW5kYXJkIHZhbGlkYXRpb24sIHRoaXMgaGVscGVyXG4gKiBjb2FsZXNjZXMgdGhlIGZvcm1lciBmb3JtcyBpbnRvIHRoZSBsYXR0ZXIgZm9ybS5cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlbUNhbGxiYWNrKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3Qgb25JdGVtID0gYXJnc1swXTtcbiAgICBpZiAodHlwZW9mIG9uSXRlbSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBFcnJvcihgVGhlIGZpcnN0IGFyZ3VtZW50IHRvIGF1dG9QYWdpbmdFYWNoLCBpZiBwcmVzZW50LCBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb247IHJlY2VpdmVkICR7dHlwZW9mIG9uSXRlbX1gKTtcbiAgICB9XG4gICAgLy8gNC4gYC5hdXRvUGFnaW5nRWFjaCgoaXRlbSwgbmV4dCkgPT4geyBkb1NvbWV0aGluZyhpdGVtKTsgbmV4dChmYWxzZSk7IH0pO2BcbiAgICBpZiAob25JdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gb25JdGVtO1xuICAgIH1cbiAgICBpZiAob25JdGVtLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYFRoZSBcXGBvbkl0ZW1cXGAgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGF1dG9QYWdpbmdFYWNoIG11c3QgYWNjZXB0IGF0IG1vc3QgdHdvIGFyZ3VtZW50czsgZ290ICR7b25JdGVtfWApO1xuICAgIH1cbiAgICAvLyBUaGlzIG1hZ2ljYWxseSBoYW5kbGVzIGFsbCB0aHJlZSBvZiB0aGVzZSB1c2VjYXNlcyAodGhlIGxhdHRlciB0d28gYmVpbmcgZnVuY3Rpb25hbGx5IGlkZW50aWNhbCk6XG4gICAgLy8gMS4gYC5hdXRvUGFnaW5nRWFjaCgoaXRlbSkgPT4geyBkb1NvbWV0aGluZyhpdGVtKTsgcmV0dXJuIGZhbHNlOyB9KTtgXG4gICAgLy8gMi4gYC5hdXRvUGFnaW5nRWFjaChhc3luYyAoaXRlbSkgPT4geyBhd2FpdCBkb1NvbWV0aGluZyhpdGVtKTsgcmV0dXJuIGZhbHNlOyB9KTtgXG4gICAgLy8gMy4gYC5hdXRvUGFnaW5nRWFjaCgoaXRlbSkgPT4gZG9Tb21ldGhpbmcoaXRlbSkudGhlbigoKSA9PiBmYWxzZSkpO2BcbiAgICByZXR1cm4gZnVuY3Rpb24gX29uSXRlbShpdGVtLCBuZXh0KSB7XG4gICAgICAgIGNvbnN0IHNob3VsZENvbnRpbnVlID0gb25JdGVtKGl0ZW0pO1xuICAgICAgICBuZXh0KHNob3VsZENvbnRpbnVlKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0TGFzdElkKGxpc3RSZXN1bHQsIHJldmVyc2VJdGVyYXRpb24pIHtcbiAgICBjb25zdCBsYXN0SWR4ID0gcmV2ZXJzZUl0ZXJhdGlvbiA/IDAgOiBsaXN0UmVzdWx0LmRhdGEubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBsYXN0SXRlbSA9IGxpc3RSZXN1bHQuZGF0YVtsYXN0SWR4XTtcbiAgICBjb25zdCBsYXN0SWQgPSBsYXN0SXRlbSAmJiBsYXN0SXRlbS5pZDtcbiAgICBpZiAoIWxhc3RJZCkge1xuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZDogTm8gYGlkYCBmb3VuZCBvbiB0aGUgbGFzdCBpdGVtIHdoaWxlIGF1dG8tcGFnaW5nIGEgbGlzdC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RJZDtcbn1cbmZ1bmN0aW9uIG1ha2VBdXRvUGFnaW5nRWFjaChhc3luY0l0ZXJhdG9yTmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBhdXRvUGFnaW5nRWFjaCggLyogb25JdGVtPywgb25Eb25lPyAqLykge1xuICAgICAgICBjb25zdCBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBjb25zdCBvbkl0ZW0gPSBnZXRJdGVtQ2FsbGJhY2soYXJncyk7XG4gICAgICAgIGNvbnN0IG9uRG9uZSA9IGdldERvbmVDYWxsYmFjayhhcmdzKTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYGF1dG9QYWdpbmdFYWNoIHRha2VzIHVwIHRvIHR3byBhcmd1bWVudHM7IHJlY2VpdmVkICR7YXJnc31gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhdXRvUGFnZVByb21pc2UgPSB3cmFwQXN5bmNJdGVyYXRvcldpdGhDYWxsYmFjayhhc3luY0l0ZXJhdG9yTmV4dCwgXG4gICAgICAgIC8vIEB0cy1pZ25vcmUgd2UgbWlnaHQgbmVlZCBhIG51bGwgY2hlY2tcbiAgICAgICAgb25JdGVtKTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNraWZ5UHJvbWlzZVdpdGhUaW1lb3V0KGF1dG9QYWdlUHJvbWlzZSwgb25Eb25lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbWFrZUF1dG9QYWdpbmdUb0FycmF5KGF1dG9QYWdpbmdFYWNoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGF1dG9QYWdpbmdUb0FycmF5KG9wdHMsIG9uRG9uZSkge1xuICAgICAgICBjb25zdCBsaW1pdCA9IG9wdHMgJiYgb3B0cy5saW1pdDtcbiAgICAgICAgaWYgKCFsaW1pdCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSBgbGltaXRgIG9wdGlvbiB0byBhdXRvUGFnaW5nVG9BcnJheSwgZS5nLiwgYGF1dG9QYWdpbmdUb0FycmF5KHtsaW1pdDogMTAwMH0pO2AuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID4gMTAwMDApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdZb3UgY2Fubm90IHNwZWNpZnkgYSBsaW1pdCBvZiBtb3JlIHRoYW4gMTAsMDAwIGl0ZW1zIHRvIGZldGNoIGluIGBhdXRvUGFnaW5nVG9BcnJheWA7IHVzZSBgYXV0b1BhZ2luZ0VhY2hgIHRvIGl0ZXJhdGUgdGhyb3VnaCBsb25nZXIgbGlzdHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgICAgICBhdXRvUGFnaW5nRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+PSBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShpdGVtcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gY2FsbGJhY2tpZnlQcm9taXNlV2l0aFRpbWVvdXQocHJvbWlzZSwgb25Eb25lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gd3JhcEFzeW5jSXRlcmF0b3JXaXRoQ2FsbGJhY2soYXN5bmNJdGVyYXRvck5leHQsIG9uSXRlbSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZXJhdGlvbihpdGVyUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoaXRlclJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVyUmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChuZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQml0IGNvbmZ1c2luZywgcGVyaGFwczsgd2UgcGFzcyBhIGByZXNvbHZlYCBmblxuICAgICAgICAgICAgICAgIC8vIHRvIHRoZSB1c2VyLCBzbyB0aGV5IGNhbiBkZWNpZGUgd2hlbiBhbmQgaWYgdG8gY29udGludWUuXG4gICAgICAgICAgICAgICAgLy8gVGhleSBjYW4gcmV0dXJuIGZhbHNlLCBvciBhIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgdG8gZmFsc2UsIHRvIGJyZWFrLlxuICAgICAgICAgICAgICAgIG9uSXRlbShpdGVtLCBuZXh0KTtcbiAgICAgICAgICAgIH0pLnRoZW4oKHNob3VsZENvbnRpbnVlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZENvbnRpbnVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlSXRlcmF0aW9uKHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3luY0l0ZXJhdG9yTmV4dCgpLnRoZW4oaGFuZGxlSXRlcmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBhc3luY0l0ZXJhdG9yTmV4dCgpXG4gICAgICAgICAgICAudGhlbihoYW5kbGVJdGVyYXRpb24pXG4gICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGlzUmV2ZXJzZUl0ZXJhdGlvbihyZXF1ZXN0QXJncykge1xuICAgIGNvbnN0IGFyZ3MgPSBbXS5zbGljZS5jYWxsKHJlcXVlc3RBcmdzKTtcbiAgICBjb25zdCBkYXRhRnJvbUFyZ3MgPSBnZXREYXRhRnJvbUFyZ3MoYXJncyk7XG4gICAgcmV0dXJuICEhZGF0YUZyb21BcmdzLmVuZGluZ19iZWZvcmU7XG59XG4iLCAiaW1wb3J0IHsgY2FsbGJhY2tpZnlQcm9taXNlV2l0aFRpbWVvdXQsIGV4dHJhY3RVcmxQYXJhbXMgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IG1ha2VBdXRvUGFnaW5hdGlvbk1ldGhvZHMgfSBmcm9tICcuL2F1dG9QYWdpbmF0aW9uLmpzJztcbi8qKlxuICogQ3JlYXRlIGFuIEFQSSBtZXRob2QgZnJvbSB0aGUgZGVjbGFyZWQgc3BlYy5cbiAqXG4gKiBAcGFyYW0gW3NwZWMubWV0aG9kPSdHRVQnXSBSZXF1ZXN0IE1ldGhvZCAoUE9TVCwgR0VULCBERUxFVEUsIFBVVClcbiAqIEBwYXJhbSBbc3BlYy5wYXRoPScnXSBQYXRoIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBBUEkgQkFTRV9QQVRILCBqb2luZWQgd2l0aFxuICogIHRoZSBpbnN0YW5jZSdzIHBhdGggKGUuZy4gJ2NoYXJnZXMnIG9yICdjdXN0b21lcnMnKVxuICogQHBhcmFtIFtzcGVjLmZ1bGxQYXRoPScnXSBGdWxseSBxdWFsaWZpZWQgcGF0aCB0byB0aGUgbWV0aG9kIChlZy4gL3YxL2EvYi9jKS5cbiAqICBJZiB0aGlzIGlzIHNwZWNpZmllZCwgcGF0aCBzaG91bGQgbm90IGJlIHNwZWNpZmllZC5cbiAqIEBwYXJhbSBbc3BlYy51cmxQYXJhbXM9W11dIEFycmF5IG9mIHJlcXVpcmVkIGFyZ3VtZW50cyBpbiB0aGUgb3JkZXIgdGhhdCB0aGV5XG4gKiAgbXVzdCBiZSBwYXNzZWQgYnkgdGhlIGNvbnN1bWVyIG9mIHRoZSBBUEkuIFN1YnNlcXVlbnQgb3B0aW9uYWwgYXJndW1lbnRzIGFyZVxuICogIG9wdGlvbmFsbHkgcGFzc2VkIHRocm91Z2ggYSBoYXNoIChPYmplY3QpIGFzIHRoZSBwZW51bHRpbWF0ZSBhcmd1bWVudFxuICogIChwcmVjZWRpbmcgdGhlIGFsc28tb3B0aW9uYWwgY2FsbGJhY2sgYXJndW1lbnRcbiAqIEBwYXJhbSBbc3BlYy5lbmNvZGVdIEZ1bmN0aW9uIGZvciBtdXRhdGluZyBpbnB1dCBwYXJhbWV0ZXJzIHRvIGEgbWV0aG9kLlxuICogIFVzZWZ1bGx5IGZvciBhcHBseWluZyB0cmFuc2Zvcm1zIHRvIGRhdGEgb24gYSBwZXItbWV0aG9kIGJhc2lzLlxuICogQHBhcmFtIFtzcGVjLmhvc3RdIEhvc3RuYW1lIGZvciB0aGUgcmVxdWVzdC5cbiAqXG4gKiA8IS0tIFB1YmxpYyBBUEkgYWNjZXNzaWJsZSB2aWEgU3RyaXBlLlN0cmlwZVJlc291cmNlLm1ldGhvZCAtLT5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwZU1ldGhvZChzcGVjKSB7XG4gICAgaWYgKHNwZWMucGF0aCAhPT0gdW5kZWZpbmVkICYmIHNwZWMuZnVsbFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1ldGhvZCBzcGVjIHNwZWNpZmllZCBib3RoIGEgJ3BhdGgnICgke3NwZWMucGF0aH0pIGFuZCBhICdmdWxsUGF0aCcgKCR7c3BlYy5mdWxsUGF0aH0pLmApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09ICdmdW5jdGlvbicgJiYgYXJncy5wb3AoKTtcbiAgICAgICAgc3BlYy51cmxQYXJhbXMgPSBleHRyYWN0VXJsUGFyYW1zKHNwZWMuZnVsbFBhdGggfHwgdGhpcy5jcmVhdGVSZXNvdXJjZVBhdGhXaXRoU3ltYm9scyhzcGVjLnBhdGggfHwgJycpKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBjYWxsYmFja2lmeVByb21pc2VXaXRoVGltZW91dCh0aGlzLl9tYWtlUmVxdWVzdChhcmdzLCBzcGVjLCB7fSksIGNhbGxiYWNrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXF1ZXN0UHJvbWlzZSwgbWFrZUF1dG9QYWdpbmF0aW9uTWV0aG9kcyh0aGlzLCBhcmdzLCBzcGVjLCByZXF1ZXN0UHJvbWlzZSkpO1xuICAgICAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XG4gICAgfTtcbn1cbiIsICJpbXBvcnQgeyBnZXREYXRhRnJvbUFyZ3MsIGdldE9wdGlvbnNGcm9tQXJncywgbWFrZVVSTEludGVycG9sYXRvciwgcHJvdG9FeHRlbmQsIHN0cmluZ2lmeVJlcXVlc3REYXRhLCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgc3RyaXBlTWV0aG9kIH0gZnJvbSAnLi9TdHJpcGVNZXRob2QuanMnO1xuLy8gUHJvdmlkZSBleHRlbnNpb24gbWVjaGFuaXNtIGZvciBTdHJpcGUgUmVzb3VyY2UgU3ViLUNsYXNzZXNcblN0cmlwZVJlc291cmNlLmV4dGVuZCA9IHByb3RvRXh0ZW5kO1xuLy8gRXhwb3NlIG1ldGhvZC1jcmVhdG9yXG5TdHJpcGVSZXNvdXJjZS5tZXRob2QgPSBzdHJpcGVNZXRob2Q7XG5TdHJpcGVSZXNvdXJjZS5NQVhfQlVGRkVSRURfUkVRVUVTVF9NRVRSSUNTID0gMTAwO1xuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgcmVxdWVzdCBsb2dpYyBmb3IgYSBTdHJpcGUgUmVzb3VyY2VcbiAqL1xuZnVuY3Rpb24gU3RyaXBlUmVzb3VyY2Uoc3RyaXBlLCBkZXByZWNhdGVkVXJsRGF0YSkge1xuICAgIHRoaXMuX3N0cmlwZSA9IHN0cmlwZTtcbiAgICBpZiAoZGVwcmVjYXRlZFVybERhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdXBwb3J0IGZvciBjdXJyaWVkIHVybCBwYXJhbXMgd2FzIGRyb3BwZWQgaW4gc3RyaXBlLW5vZGUgdjcuMC4wLiBJbnN0ZWFkLCBwYXNzIHR3byBpZHMuJyk7XG4gICAgfVxuICAgIHRoaXMuYmFzZVBhdGggPSBtYWtlVVJMSW50ZXJwb2xhdG9yKFxuICAgIC8vIEB0cy1pZ25vcmUgY2hhbmdpbmcgdHlwZSBvZiBiYXNlUGF0aFxuICAgIHRoaXMuYmFzZVBhdGggfHwgc3RyaXBlLmdldEFwaUZpZWxkKCdiYXNlUGF0aCcpKTtcbiAgICAvLyBAdHMtaWdub3JlIGNoYW5naW5nIHR5cGUgb2YgcGF0aFxuICAgIHRoaXMucmVzb3VyY2VQYXRoID0gdGhpcy5wYXRoO1xuICAgIC8vIEB0cy1pZ25vcmUgY2hhbmdpbmcgdHlwZSBvZiBwYXRoXG4gICAgdGhpcy5wYXRoID0gbWFrZVVSTEludGVycG9sYXRvcih0aGlzLnBhdGgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSguLi5hcmd1bWVudHMpO1xufVxuU3RyaXBlUmVzb3VyY2UucHJvdG90eXBlID0ge1xuICAgIF9zdHJpcGU6IG51bGwsXG4gICAgLy8gQHRzLWlnbm9yZSB0aGUgdHlwZSBvZiBwYXRoIGNoYW5nZXMgaW4gY3RvclxuICAgIHBhdGg6ICcnLFxuICAgIHJlc291cmNlUGF0aDogJycsXG4gICAgLy8gTWV0aG9kcyB0aGF0IGRvbid0IHVzZSB0aGUgQVBJJ3MgZGVmYXVsdCAnL3YxJyBwYXRoIGNhbiBvdmVycmlkZSBpdCB3aXRoIHRoaXMgc2V0dGluZy5cbiAgICBiYXNlUGF0aDogbnVsbCxcbiAgICBpbml0aWFsaXplKCkgeyB9LFxuICAgIC8vIEZ1bmN0aW9uIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGRhdGEgcHJvY2Vzc29yLiBUaGlzIGFsbG93cyBmdWxsIGNvbnRyb2xcbiAgICAvLyBvdmVyIGhvdyBhIFN0cmlwZVJlc291cmNlJ3MgcmVxdWVzdCBkYXRhIHdpbGwgZ2V0IGNvbnZlcnRlZCBpbnRvIGFuIEhUVFBcbiAgICAvLyBib2R5LiBUaGlzIGlzIHVzZWZ1bCBmb3Igbm9uLXN0YW5kYXJkIEhUVFAgcmVxdWVzdHMuIFRoZSBmdW5jdGlvbiBzaG91bGRcbiAgICAvLyB0YWtlIG1ldGhvZCBuYW1lLCBkYXRhLCBhbmQgaGVhZGVycyBhcyBhcmd1bWVudHMuXG4gICAgcmVxdWVzdERhdGFQcm9jZXNzb3I6IG51bGwsXG4gICAgLy8gRnVuY3Rpb24gdG8gYWRkIGEgdmFsaWRhdGlvbiBjaGVja3MgYmVmb3JlIHNlbmRpbmcgdGhlIHJlcXVlc3QsIGVycm9ycyBzaG91bGRcbiAgICAvLyBiZSB0aHJvd24sIGFuZCB0aGV5IHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjYWxsYmFjay9wcm9taXNlLlxuICAgIHZhbGlkYXRlUmVxdWVzdDogbnVsbCxcbiAgICBjcmVhdGVGdWxsUGF0aChjb21tYW5kUGF0aCwgdXJsRGF0YSkge1xuICAgICAgICBjb25zdCB1cmxQYXJ0cyA9IFt0aGlzLmJhc2VQYXRoKHVybERhdGEpLCB0aGlzLnBhdGgodXJsRGF0YSldO1xuICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRQYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZENvbW1hbmRQYXRoID0gY29tbWFuZFBhdGgodXJsRGF0YSk7XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIG5vIGFjdHVhbCBjb21tYW5kIHBhdGgsIHdlIGp1c3Qgb21pdCBpdCB0byBhdm9pZCBhZGRpbmcgYVxuICAgICAgICAgICAgLy8gdHJhaWxpbmcgc2xhc2guIFRoaXMgaXMgaW1wb3J0YW50IGZvciB0b3AtbGV2ZWwgbGlzdGluZyByZXF1ZXN0cywgd2hpY2hcbiAgICAgICAgICAgIC8vIGRvIG5vdCBoYXZlIGEgY29tbWFuZCBwYXRoLlxuICAgICAgICAgICAgaWYgKGNvbXB1dGVkQ29tbWFuZFBhdGgpIHtcbiAgICAgICAgICAgICAgICB1cmxQYXJ0cy5wdXNoKGNvbXB1dGVkQ29tbWFuZFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXJsUGFydHMucHVzaChjb21tYW5kUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW5VcmxQYXJ0cyh1cmxQYXJ0cyk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGVzIGEgcmVsYXRpdmUgcmVzb3VyY2UgcGF0aCB3aXRoIHN5bWJvbHMgbGVmdCBpbiAodW5saWtlXG4gICAgLy8gY3JlYXRlRnVsbFBhdGggd2hpY2ggdGFrZXMgc29tZSBkYXRhIHRvIHJlcGxhY2UgdGhlbSB3aXRoKS4gRm9yIGV4YW1wbGUgaXRcbiAgICAvLyBtaWdodCBwcm9kdWNlOiAvaW52b2ljZXMve2lkfVxuICAgIGNyZWF0ZVJlc291cmNlUGF0aFdpdGhTeW1ib2xzKHBhdGhXaXRoU3ltYm9scykge1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBwYXRoIGJleW9uZCB0aGUgcmVzb3VyY2UgcGF0aCwgd2Ugd2FudCB0byBwcm9kdWNlIGp1c3RcbiAgICAgICAgLy8gLzxyZXNvdXJjZSBwYXRoPiByYXRoZXIgdGhhbiAvPHJlc291cmNlIHBhdGg+Ly5cbiAgICAgICAgaWYgKHBhdGhXaXRoU3ltYm9scykge1xuICAgICAgICAgICAgcmV0dXJuIGAvJHt0aGlzLl9qb2luVXJsUGFydHMoW3RoaXMucmVzb3VyY2VQYXRoLCBwYXRoV2l0aFN5bWJvbHNdKX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAvJHt0aGlzLnJlc291cmNlUGF0aH1gO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfam9pblVybFBhcnRzKHBhcnRzKSB7XG4gICAgICAgIC8vIFJlcGxhY2UgYW55IGFjY2lkZW50YWxseSBkb3VibGVkIHVwIHNsYXNoZXMuIFRoaXMgcHJldmlvdXNseSB1c2VkXG4gICAgICAgIC8vIHBhdGguam9pbiwgd2hpY2ggd291bGQgZG8gdGhpcyBhcyB3ZWxsLiBVbmZvcnR1bmF0ZWx5IHdlIG5lZWQgdG8gZG8gdGhpc1xuICAgICAgICAvLyBhcyB0aGUgZnVuY3Rpb25zIGZvciBjcmVhdGluZyBwYXRocyBhcmUgdGVjaG5pY2FsbHkgcGFydCBvZiB0aGUgcHVibGljXG4gICAgICAgIC8vIGludGVyZmFjZSBhbmQgc28gd2UgbmVlZCB0byBwcmVzZXJ2ZSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy8nKS5yZXBsYWNlKC9cXC97Mix9L2csICcvJyk7XG4gICAgfSxcbiAgICBfZ2V0UmVxdWVzdE9wdHMocmVxdWVzdEFyZ3MsIHNwZWMsIG92ZXJyaWRlRGF0YSkge1xuICAgICAgICAvLyBFeHRyYWN0IHNwZWMgdmFsdWVzIHdpdGggZGVmYXVsdHMuXG4gICAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSAoc3BlYy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHVzYWdlID0gc3BlYy51c2FnZSB8fCBbXTtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gc3BlYy51cmxQYXJhbXMgfHwgW107XG4gICAgICAgIGNvbnN0IGVuY29kZSA9IHNwZWMuZW5jb2RlIHx8ICgoZGF0YSkgPT4gZGF0YSk7XG4gICAgICAgIGNvbnN0IGlzVXNpbmdGdWxsUGF0aCA9ICEhc3BlYy5mdWxsUGF0aDtcbiAgICAgICAgY29uc3QgY29tbWFuZFBhdGggPSBtYWtlVVJMSW50ZXJwb2xhdG9yKGlzVXNpbmdGdWxsUGF0aCA/IHNwZWMuZnVsbFBhdGggOiBzcGVjLnBhdGggfHwgJycpO1xuICAgICAgICAvLyBXaGVuIHVzaW5nIGZ1bGxQYXRoLCB3ZSBpZ25vcmUgdGhlIHJlc291cmNlIHBhdGggYXMgaXQgc2hvdWxkIGFscmVhZHkgYmVcbiAgICAgICAgLy8gZnVsbHkgcXVhbGlmaWVkLlxuICAgICAgICBjb25zdCBwYXRoID0gaXNVc2luZ0Z1bGxQYXRoXG4gICAgICAgICAgICA/IHNwZWMuZnVsbFBhdGhcbiAgICAgICAgICAgIDogdGhpcy5jcmVhdGVSZXNvdXJjZVBhdGhXaXRoU3ltYm9scyhzcGVjLnBhdGgpO1xuICAgICAgICAvLyBEb24ndCBtdXRhdGUgYXJncyBleHRlcm5hbGx5LlxuICAgICAgICBjb25zdCBhcmdzID0gW10uc2xpY2UuY2FsbChyZXF1ZXN0QXJncyk7XG4gICAgICAgIC8vIEdlbmVyYXRlIGFuZCB2YWxpZGF0ZSB1cmwgcGFyYW1zLlxuICAgICAgICBjb25zdCB1cmxEYXRhID0gdXJsUGFyYW1zLnJlZHVjZSgodXJsRGF0YSwgcGFyYW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyZyA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU3RyaXBlOiBBcmd1bWVudCBcIiR7cGFyYW19XCIgbXVzdCBiZSBhIHN0cmluZywgYnV0IGdvdDogJHthcmd9IChvbiBBUEkgcmVxdWVzdCB0byBcXGAke3JlcXVlc3RNZXRob2R9ICR7cGF0aH1cXGApYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmxEYXRhW3BhcmFtXSA9IGFyZztcbiAgICAgICAgICAgIHJldHVybiB1cmxEYXRhO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIC8vIFB1bGwgcmVxdWVzdCBkYXRhIGFuZCBvcHRpb25zIChoZWFkZXJzLCBhdXRoKSBmcm9tIGFyZ3MuXG4gICAgICAgIGNvbnN0IGRhdGFGcm9tQXJncyA9IGdldERhdGFGcm9tQXJncyhhcmdzKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGVuY29kZShPYmplY3QuYXNzaWduKHt9LCBkYXRhRnJvbUFyZ3MsIG92ZXJyaWRlRGF0YSkpO1xuICAgICAgICBjb25zdCBvcHRpb25zID0gZ2V0T3B0aW9uc0Zyb21BcmdzKGFyZ3MpO1xuICAgICAgICBjb25zdCBob3N0ID0gb3B0aW9ucy5ob3N0IHx8IHNwZWMuaG9zdDtcbiAgICAgICAgY29uc3Qgc3RyZWFtaW5nID0gISFzcGVjLnN0cmVhbWluZztcbiAgICAgICAgLy8gVmFsaWRhdGUgdGhhdCB0aGVyZSBhcmUgbm8gbW9yZSBhcmdzLlxuICAgICAgICBpZiAoYXJncy5maWx0ZXIoKHgpID0+IHggIT0gbnVsbCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0cmlwZTogVW5rbm93biBhcmd1bWVudHMgKCR7YXJnc30pLiBEaWQgeW91IG1lYW4gdG8gcGFzcyBhbiBvcHRpb25zIG9iamVjdD8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGUvd2lraS9QYXNzaW5nLU9wdGlvbnMuIChvbiBBUEkgcmVxdWVzdCB0byAke3JlcXVlc3RNZXRob2R9IFxcYCR7cGF0aH1cXGApYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiB1c2luZyBmdWxsIHBhdGgsIHdlIGNhbiBqdXN0IGludm9rZSB0aGUgVVJMIGludGVycG9sYXRvciBkaXJlY3RseVxuICAgICAgICAvLyBhcyB3ZSBkb24ndCBuZWVkIHRvIHVzZSB0aGUgcmVzb3VyY2UgdG8gY3JlYXRlIGEgZnVsbCBwYXRoLlxuICAgICAgICBjb25zdCByZXF1ZXN0UGF0aCA9IGlzVXNpbmdGdWxsUGF0aFxuICAgICAgICAgICAgPyBjb21tYW5kUGF0aCh1cmxEYXRhKVxuICAgICAgICAgICAgOiB0aGlzLmNyZWF0ZUZ1bGxQYXRoKGNvbW1hbmRQYXRoLCB1cmxEYXRhKTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucy5oZWFkZXJzLCBzcGVjLmhlYWRlcnMpO1xuICAgICAgICBpZiAoc3BlYy52YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIHNwZWMudmFsaWRhdG9yKGRhdGEsIHsgaGVhZGVycyB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhSW5RdWVyeSA9IHNwZWMubWV0aG9kID09PSAnR0VUJyB8fCBzcGVjLm1ldGhvZCA9PT0gJ0RFTEVURSc7XG4gICAgICAgIGNvbnN0IGJvZHlEYXRhID0gZGF0YUluUXVlcnkgPyB7fSA6IGRhdGE7XG4gICAgICAgIGNvbnN0IHF1ZXJ5RGF0YSA9IGRhdGFJblF1ZXJ5ID8gZGF0YSA6IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWVzdE1ldGhvZCxcbiAgICAgICAgICAgIHJlcXVlc3RQYXRoLFxuICAgICAgICAgICAgYm9keURhdGEsXG4gICAgICAgICAgICBxdWVyeURhdGEsXG4gICAgICAgICAgICBhdXRoOiBvcHRpb25zLmF1dGgsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgaG9zdDogaG9zdCAhPT0gbnVsbCAmJiBob3N0ICE9PSB2b2lkIDAgPyBob3N0IDogbnVsbCxcbiAgICAgICAgICAgIHN0cmVhbWluZyxcbiAgICAgICAgICAgIHNldHRpbmdzOiBvcHRpb25zLnNldHRpbmdzLFxuICAgICAgICAgICAgdXNhZ2UsXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBfbWFrZVJlcXVlc3QocmVxdWVzdEFyZ3MsIHNwZWMsIG92ZXJyaWRlRGF0YSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgbGV0IG9wdHM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9wdHMgPSB0aGlzLl9nZXRSZXF1ZXN0T3B0cyhyZXF1ZXN0QXJncywgc3BlYywgb3ZlcnJpZGVEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiByZXF1ZXN0Q2FsbGJhY2soZXJyLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNwZWMudHJhbnNmb3JtUmVzcG9uc2VEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHNwZWMudHJhbnNmb3JtUmVzcG9uc2VEYXRhKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW1wdHlRdWVyeSA9IE9iamVjdC5rZXlzKG9wdHMucXVlcnlEYXRhKS5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gW1xuICAgICAgICAgICAgICAgIG9wdHMucmVxdWVzdFBhdGgsXG4gICAgICAgICAgICAgICAgZW1wdHlRdWVyeSA/ICcnIDogJz8nLFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeVJlcXVlc3REYXRhKG9wdHMucXVlcnlEYXRhKSxcbiAgICAgICAgICAgIF0uam9pbignJyk7XG4gICAgICAgICAgICBjb25zdCB7IGhlYWRlcnMsIHNldHRpbmdzIH0gPSBvcHRzO1xuICAgICAgICAgICAgdGhpcy5fc3RyaXBlLl9yZXF1ZXN0U2VuZGVyLl9yZXF1ZXN0KG9wdHMucmVxdWVzdE1ldGhvZCwgb3B0cy5ob3N0LCBwYXRoLCBvcHRzLmJvZHlEYXRhLCBvcHRzLmF1dGgsIHsgaGVhZGVycywgc2V0dGluZ3MsIHN0cmVhbWluZzogb3B0cy5zdHJlYW1pbmcgfSwgb3B0cy51c2FnZSwgcmVxdWVzdENhbGxiYWNrLCAoX2EgPSB0aGlzLnJlcXVlc3REYXRhUHJvY2Vzc29yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYmluZCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuZXhwb3J0IHsgU3RyaXBlUmVzb3VyY2UgfTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEFjY291bnRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZmluYW5jaWFsX2Nvbm5lY3Rpb25zL2FjY291bnRzL3thY2NvdW50fScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZmluYW5jaWFsX2Nvbm5lY3Rpb25zL2FjY291bnRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRpc2Nvbm5lY3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9maW5hbmNpYWxfY29ubmVjdGlvbnMvYWNjb3VudHMve2FjY291bnR9L2Rpc2Nvbm5lY3QnLFxuICAgIH0pLFxuICAgIGxpc3RPd25lcnM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ZpbmFuY2lhbF9jb25uZWN0aW9ucy9hY2NvdW50cy97YWNjb3VudH0vb3duZXJzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIHJlZnJlc2g6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9maW5hbmNpYWxfY29ubmVjdGlvbnMvYWNjb3VudHMve2FjY291bnR9L3JlZnJlc2gnLFxuICAgIH0pLFxuICAgIHN1YnNjcmliZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ZpbmFuY2lhbF9jb25uZWN0aW9ucy9hY2NvdW50cy97YWNjb3VudH0vc3Vic2NyaWJlJyxcbiAgICB9KSxcbiAgICB1bnN1YnNjcmliZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ZpbmFuY2lhbF9jb25uZWN0aW9ucy9hY2NvdW50cy97YWNjb3VudH0vdW5zdWJzY3JpYmUnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBBY3RpdmVFbnRpdGxlbWVudHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9lbnRpdGxlbWVudHMvYWN0aXZlX2VudGl0bGVtZW50cy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9lbnRpdGxlbWVudHMvYWN0aXZlX2VudGl0bGVtZW50cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQXV0aG9yaXphdGlvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL2F1dGhvcml6YXRpb25zJyxcbiAgICB9KSxcbiAgICBjYXB0dXJlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL2lzc3VpbmcvYXV0aG9yaXphdGlvbnMve2F1dGhvcml6YXRpb259L2NhcHR1cmUnLFxuICAgIH0pLFxuICAgIGV4cGlyZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL2F1dGhvcml6YXRpb25zL3thdXRob3JpemF0aW9ufS9leHBpcmUnLFxuICAgIH0pLFxuICAgIGluY3JlbWVudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL2F1dGhvcml6YXRpb25zL3thdXRob3JpemF0aW9ufS9pbmNyZW1lbnQnLFxuICAgIH0pLFxuICAgIHJldmVyc2U6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvaXNzdWluZy9hdXRob3JpemF0aW9ucy97YXV0aG9yaXphdGlvbn0vcmV2ZXJzZScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEF1dGhvcml6YXRpb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9hdXRob3JpemF0aW9ucy97YXV0aG9yaXphdGlvbn0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lzc3VpbmcvYXV0aG9yaXphdGlvbnMve2F1dGhvcml6YXRpb259JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2F1dGhvcml6YXRpb25zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGFwcHJvdmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2F1dGhvcml6YXRpb25zL3thdXRob3JpemF0aW9ufS9hcHByb3ZlJyxcbiAgICB9KSxcbiAgICBkZWNsaW5lOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9hdXRob3JpemF0aW9ucy97YXV0aG9yaXphdGlvbn0vZGVjbGluZScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IENhbGN1bGF0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdGF4L2NhbGN1bGF0aW9ucycgfSksXG4gICAgbGlzdExpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGF4L2NhbGN1bGF0aW9ucy97Y2FsY3VsYXRpb259L2xpbmVfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IENhcmRob2xkZXJzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2NhcmRob2xkZXJzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9jYXJkaG9sZGVycy97Y2FyZGhvbGRlcn0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lzc3VpbmcvY2FyZGhvbGRlcnMve2NhcmRob2xkZXJ9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2NhcmRob2xkZXJzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDYXJkcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgZGVsaXZlckNhcmQ6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvaXNzdWluZy9jYXJkcy97Y2FyZH0vc2hpcHBpbmcvZGVsaXZlcicsXG4gICAgfSksXG4gICAgZmFpbENhcmQ6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvaXNzdWluZy9jYXJkcy97Y2FyZH0vc2hpcHBpbmcvZmFpbCcsXG4gICAgfSksXG4gICAgcmV0dXJuQ2FyZDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL2NhcmRzL3tjYXJkfS9zaGlwcGluZy9yZXR1cm4nLFxuICAgIH0pLFxuICAgIHNoaXBDYXJkOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL2lzc3VpbmcvY2FyZHMve2NhcmR9L3NoaXBwaW5nL3NoaXAnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDYXJkcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9jYXJkcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL2lzc3VpbmcvY2FyZHMve2NhcmR9JyB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2NhcmRzL3tjYXJkfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9jYXJkcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQ29uZmlndXJhdGlvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmdfcG9ydGFsL2NvbmZpZ3VyYXRpb25zJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYmlsbGluZ19wb3J0YWwvY29uZmlndXJhdGlvbnMve2NvbmZpZ3VyYXRpb259JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iaWxsaW5nX3BvcnRhbC9jb25maWd1cmF0aW9ucy97Y29uZmlndXJhdGlvbn0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmdfcG9ydGFsL2NvbmZpZ3VyYXRpb25zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDb25maWd1cmF0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvY29uZmlndXJhdGlvbnMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9jb25maWd1cmF0aW9ucy97Y29uZmlndXJhdGlvbn0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL2NvbmZpZ3VyYXRpb25zL3tjb25maWd1cmF0aW9ufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvY29uZmlndXJhdGlvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9jb25maWd1cmF0aW9ucy97Y29uZmlndXJhdGlvbn0nLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDb25maXJtYXRpb25Ub2tlbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9jb25maXJtYXRpb25fdG9rZW5zJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQ29ubmVjdGlvblRva2VucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvY29ubmVjdGlvbl90b2tlbnMnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDcmVkaXRSZXZlcnNhbHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L2NyZWRpdF9yZXZlcnNhbHMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9jcmVkaXRfcmV2ZXJzYWxzL3tjcmVkaXRfcmV2ZXJzYWx9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9jcmVkaXRfcmV2ZXJzYWxzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDdXN0b21lcnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGZ1bmRDYXNoQmFsYW5jZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9jdXN0b21lcnMve2N1c3RvbWVyfS9mdW5kX2Nhc2hfYmFsYW5jZScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IERlYml0UmV2ZXJzYWxzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9kZWJpdF9yZXZlcnNhbHMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9kZWJpdF9yZXZlcnNhbHMve2RlYml0X3JldmVyc2FsfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvZGViaXRfcmV2ZXJzYWxzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBEaXNwdXRlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9kaXNwdXRlcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lzc3VpbmcvZGlzcHV0ZXMve2Rpc3B1dGV9JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2Rpc3B1dGVzL3tkaXNwdXRlfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9kaXNwdXRlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBzdWJtaXQ6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL2Rpc3B1dGVzL3tkaXNwdXRlfS9zdWJtaXQnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBFYXJseUZyYXVkV2FybmluZ3MgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yYWRhci9lYXJseV9mcmF1ZF93YXJuaW5ncy97ZWFybHlfZnJhdWRfd2FybmluZ30nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3JhZGFyL2Vhcmx5X2ZyYXVkX3dhcm5pbmdzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBGZWF0dXJlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvZW50aXRsZW1lbnRzL2ZlYXR1cmVzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZW50aXRsZW1lbnRzL2ZlYXR1cmVzL3tpZH0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2VudGl0bGVtZW50cy9mZWF0dXJlcy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9lbnRpdGxlbWVudHMvZmVhdHVyZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEZpbmFuY2lhbEFjY291bnRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9maW5hbmNpYWxfYWNjb3VudHMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9maW5hbmNpYWxfYWNjb3VudHMve2ZpbmFuY2lhbF9hY2NvdW50fScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvZmluYW5jaWFsX2FjY291bnRzL3tmaW5hbmNpYWxfYWNjb3VudH0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L2ZpbmFuY2lhbF9hY2NvdW50cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZUZlYXR1cmVzOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9maW5hbmNpYWxfYWNjb3VudHMve2ZpbmFuY2lhbF9hY2NvdW50fS9mZWF0dXJlcycsXG4gICAgfSksXG4gICAgdXBkYXRlRmVhdHVyZXM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9maW5hbmNpYWxfYWNjb3VudHMve2ZpbmFuY2lhbF9hY2NvdW50fS9mZWF0dXJlcycsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEluYm91bmRUcmFuc2ZlcnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGZhaWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvaW5ib3VuZF90cmFuc2ZlcnMve2lkfS9mYWlsJyxcbiAgICB9KSxcbiAgICByZXR1cm5JbmJvdW5kVHJhbnNmZXI6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvaW5ib3VuZF90cmFuc2ZlcnMve2lkfS9yZXR1cm4nLFxuICAgIH0pLFxuICAgIHN1Y2NlZWQ6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvaW5ib3VuZF90cmFuc2ZlcnMve2lkfS9zdWNjZWVkJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgSW5ib3VuZFRyYW5zZmVycyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvaW5ib3VuZF90cmFuc2ZlcnMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9pbmJvdW5kX3RyYW5zZmVycy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9pbmJvdW5kX3RyYW5zZmVycycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9pbmJvdW5kX3RyYW5zZmVycy97aW5ib3VuZF90cmFuc2Zlcn0vY2FuY2VsJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgTG9jYXRpb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9sb2NhdGlvbnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9sb2NhdGlvbnMve2xvY2F0aW9ufScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvbG9jYXRpb25zL3tsb2NhdGlvbn0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL2xvY2F0aW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBkZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL2xvY2F0aW9ucy97bG9jYXRpb259JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgTWV0ZXJFdmVudEFkanVzdG1lbnRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iaWxsaW5nL21ldGVyX2V2ZW50X2FkanVzdG1lbnRzJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgTWV0ZXJFdmVudHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmcvbWV0ZXJfZXZlbnRzJyB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgTWV0ZXJzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9iaWxsaW5nL21ldGVycycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmcvbWV0ZXJzL3tpZH0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmcvbWV0ZXJzL3tpZH0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmcvbWV0ZXJzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlYWN0aXZhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iaWxsaW5nL21ldGVycy97aWR9L2RlYWN0aXZhdGUnLFxuICAgIH0pLFxuICAgIGxpc3RFdmVudFN1bW1hcmllczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYmlsbGluZy9tZXRlcnMve2lkfS9ldmVudF9zdW1tYXJpZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgcmVhY3RpdmF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2JpbGxpbmcvbWV0ZXJzL3tpZH0vcmVhY3RpdmF0ZScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IE9yZGVycyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvY2xpbWF0ZS9vcmRlcnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jbGltYXRlL29yZGVycy97b3JkZXJ9JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jbGltYXRlL29yZGVycy97b3JkZXJ9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jbGltYXRlL29yZGVycycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jbGltYXRlL29yZGVycy97b3JkZXJ9L2NhbmNlbCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IE91dGJvdW5kUGF5bWVudHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGZhaWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvb3V0Ym91bmRfcGF5bWVudHMve2lkfS9mYWlsJyxcbiAgICB9KSxcbiAgICBwb3N0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3RyZWFzdXJ5L291dGJvdW5kX3BheW1lbnRzL3tpZH0vcG9zdCcsXG4gICAgfSksXG4gICAgcmV0dXJuT3V0Ym91bmRQYXltZW50OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3RyZWFzdXJ5L291dGJvdW5kX3BheW1lbnRzL3tpZH0vcmV0dXJuJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgT3V0Ym91bmRQYXltZW50cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvb3V0Ym91bmRfcGF5bWVudHMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9vdXRib3VuZF9wYXltZW50cy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9vdXRib3VuZF9wYXltZW50cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9vdXRib3VuZF9wYXltZW50cy97aWR9L2NhbmNlbCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IE91dGJvdW5kVHJhbnNmZXJzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBmYWlsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3RyZWFzdXJ5L291dGJvdW5kX3RyYW5zZmVycy97b3V0Ym91bmRfdHJhbnNmZXJ9L2ZhaWwnLFxuICAgIH0pLFxuICAgIHBvc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvb3V0Ym91bmRfdHJhbnNmZXJzL3tvdXRib3VuZF90cmFuc2Zlcn0vcG9zdCcsXG4gICAgfSksXG4gICAgcmV0dXJuT3V0Ym91bmRUcmFuc2Zlcjogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy90cmVhc3VyeS9vdXRib3VuZF90cmFuc2ZlcnMve291dGJvdW5kX3RyYW5zZmVyfS9yZXR1cm4nLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBPdXRib3VuZFRyYW5zZmVycyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvb3V0Ym91bmRfdHJhbnNmZXJzJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvb3V0Ym91bmRfdHJhbnNmZXJzL3tvdXRib3VuZF90cmFuc2Zlcn0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L291dGJvdW5kX3RyYW5zZmVycycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9vdXRib3VuZF90cmFuc2ZlcnMve291dGJvdW5kX3RyYW5zZmVyfS9jYW5jZWwnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBQZXJzb25hbGl6YXRpb25EZXNpZ25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBhY3RpdmF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL3BlcnNvbmFsaXphdGlvbl9kZXNpZ25zL3twZXJzb25hbGl6YXRpb25fZGVzaWdufS9hY3RpdmF0ZScsXG4gICAgfSksXG4gICAgZGVhY3RpdmF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL3BlcnNvbmFsaXphdGlvbl9kZXNpZ25zL3twZXJzb25hbGl6YXRpb25fZGVzaWdufS9kZWFjdGl2YXRlJyxcbiAgICB9KSxcbiAgICByZWplY3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvaXNzdWluZy9wZXJzb25hbGl6YXRpb25fZGVzaWducy97cGVyc29uYWxpemF0aW9uX2Rlc2lnbn0vcmVqZWN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgUGVyc29uYWxpemF0aW9uRGVzaWducyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9wZXJzb25hbGl6YXRpb25fZGVzaWducycsXG4gICAgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lzc3VpbmcvcGVyc29uYWxpemF0aW9uX2Rlc2lnbnMve3BlcnNvbmFsaXphdGlvbl9kZXNpZ259JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL3BlcnNvbmFsaXphdGlvbl9kZXNpZ25zL3twZXJzb25hbGl6YXRpb25fZGVzaWdufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9wZXJzb25hbGl6YXRpb25fZGVzaWducycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgUGh5c2ljYWxCdW5kbGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy9waHlzaWNhbF9idW5kbGVzL3twaHlzaWNhbF9idW5kbGV9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pc3N1aW5nL3BoeXNpY2FsX2J1bmRsZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFByb2R1Y3RzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY2xpbWF0ZS9wcm9kdWN0cy97cHJvZHVjdH0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NsaW1hdGUvcHJvZHVjdHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJlYWRlcnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHByZXNlbnRQYXltZW50TWV0aG9kOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3Rlcm1pbmFsL3JlYWRlcnMve3JlYWRlcn0vcHJlc2VudF9wYXltZW50X21ldGhvZCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJlYWRlcnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL3JlYWRlcnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9yZWFkZXJzL3tyZWFkZXJ9JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9yZWFkZXJzL3tyZWFkZXJ9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9yZWFkZXJzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvcmVhZGVycy97cmVhZGVyfScsXG4gICAgfSksXG4gICAgY2FuY2VsQWN0aW9uOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvcmVhZGVycy97cmVhZGVyfS9jYW5jZWxfYWN0aW9uJyxcbiAgICB9KSxcbiAgICBwcm9jZXNzUGF5bWVudEludGVudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL3JlYWRlcnMve3JlYWRlcn0vcHJvY2Vzc19wYXltZW50X2ludGVudCcsXG4gICAgfSksXG4gICAgcHJvY2Vzc1NldHVwSW50ZW50OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVybWluYWwvcmVhZGVycy97cmVhZGVyfS9wcm9jZXNzX3NldHVwX2ludGVudCcsXG4gICAgfSksXG4gICAgcmVmdW5kUGF5bWVudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlcm1pbmFsL3JlYWRlcnMve3JlYWRlcn0vcmVmdW5kX3BheW1lbnQnLFxuICAgIH0pLFxuICAgIHNldFJlYWRlckRpc3BsYXk6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXJtaW5hbC9yZWFkZXJzL3tyZWFkZXJ9L3NldF9yZWFkZXJfZGlzcGxheScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJlY2VpdmVkQ3JlZGl0cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3RyZWFzdXJ5L3JlY2VpdmVkX2NyZWRpdHMnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZWNlaXZlZENyZWRpdHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9yZWNlaXZlZF9jcmVkaXRzL3tpZH0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L3JlY2VpdmVkX2NyZWRpdHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJlY2VpdmVkRGViaXRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdHJlYXN1cnkvcmVjZWl2ZWRfZGViaXRzJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgUmVjZWl2ZWREZWJpdHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS9yZWNlaXZlZF9kZWJpdHMve2lkfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvcmVjZWl2ZWRfZGViaXRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZWZ1bmRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBleHBpcmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvcmVmdW5kcy97cmVmdW5kfS9leHBpcmUnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZWdpc3RyYXRpb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS90YXgvcmVnaXN0cmF0aW9ucycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RheC9yZWdpc3RyYXRpb25zL3tpZH0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RheC9yZWdpc3RyYXRpb25zL3tpZH0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RheC9yZWdpc3RyYXRpb25zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZXBvcnRSdW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9yZXBvcnRpbmcvcmVwb3J0X3J1bnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZXBvcnRpbmcvcmVwb3J0X3J1bnMve3JlcG9ydF9ydW59JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZXBvcnRpbmcvcmVwb3J0X3J1bnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJlcG9ydFR5cGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcmVwb3J0aW5nL3JlcG9ydF90eXBlcy97cmVwb3J0X3R5cGV9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZXBvcnRpbmcvcmVwb3J0X3R5cGVzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZXF1ZXN0cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvZm9yd2FyZGluZy9yZXF1ZXN0cycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ZvcndhcmRpbmcvcmVxdWVzdHMve2lkfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZm9yd2FyZGluZy9yZXF1ZXN0cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU2NoZWR1bGVkUXVlcnlSdW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc2lnbWEvc2NoZWR1bGVkX3F1ZXJ5X3J1bnMve3NjaGVkdWxlZF9xdWVyeV9ydW59JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zaWdtYS9zY2hlZHVsZWRfcXVlcnlfcnVucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU2VjcmV0cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvYXBwcy9zZWNyZXRzJyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBzL3NlY3JldHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsZXRlV2hlcmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBzL3NlY3JldHMvZGVsZXRlJyxcbiAgICB9KSxcbiAgICBmaW5kOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9hcHBzL3NlY3JldHMvZmluZCcgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFNlc3Npb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iaWxsaW5nX3BvcnRhbC9zZXNzaW9ucycsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFNlc3Npb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9jaGVja291dC9zZXNzaW9ucycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NoZWNrb3V0L3Nlc3Npb25zL3tzZXNzaW9ufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY2hlY2tvdXQvc2Vzc2lvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZXhwaXJlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY2hlY2tvdXQvc2Vzc2lvbnMve3Nlc3Npb259L2V4cGlyZScsXG4gICAgfSksXG4gICAgbGlzdExpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY2hlY2tvdXQvc2Vzc2lvbnMve3Nlc3Npb259L2xpbmVfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFNlc3Npb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9maW5hbmNpYWxfY29ubmVjdGlvbnMvc2Vzc2lvbnMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9maW5hbmNpYWxfY29ubmVjdGlvbnMvc2Vzc2lvbnMve3Nlc3Npb259JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU2V0dGluZ3MgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS90YXgvc2V0dGluZ3MnIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3RheC9zZXR0aW5ncycgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFN1cHBsaWVycyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NsaW1hdGUvc3VwcGxpZXJzL3tzdXBwbGllcn0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NsaW1hdGUvc3VwcGxpZXJzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uLy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBUZXN0Q2xvY2tzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdGVzdF9jbG9ja3MnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdGVzdF9jbG9ja3Mve3Rlc3RfY2xvY2t9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdGVzdF9jbG9ja3MnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvdGVzdF9jbG9ja3Mve3Rlc3RfY2xvY2t9JyxcbiAgICB9KSxcbiAgICBhZHZhbmNlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL3Rlc3RfY2xvY2tzL3t0ZXN0X2Nsb2NrfS9hZHZhbmNlJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVG9rZW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90b2tlbnMve3Rva2VufScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90b2tlbnMve3Rva2VufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90b2tlbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRyYW5zYWN0aW9uRW50cmllcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L3RyYW5zYWN0aW9uX2VudHJpZXMve2lkfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJlYXN1cnkvdHJhbnNhY3Rpb25fZW50cmllcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVHJhbnNhY3Rpb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGVGb3JjZUNhcHR1cmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90ZXN0X2hlbHBlcnMvaXNzdWluZy90cmFuc2FjdGlvbnMvY3JlYXRlX2ZvcmNlX2NhcHR1cmUnLFxuICAgIH0pLFxuICAgIGNyZWF0ZVVubGlua2VkUmVmdW5kOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGVzdF9oZWxwZXJzL2lzc3VpbmcvdHJhbnNhY3Rpb25zL2NyZWF0ZV91bmxpbmtlZF9yZWZ1bmQnLFxuICAgIH0pLFxuICAgIHJlZnVuZDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Rlc3RfaGVscGVycy9pc3N1aW5nL3RyYW5zYWN0aW9ucy97dHJhbnNhY3Rpb259L3JlZnVuZCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRyYW5zYWN0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ZpbmFuY2lhbF9jb25uZWN0aW9ucy90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZmluYW5jaWFsX2Nvbm5lY3Rpb25zL3RyYW5zYWN0aW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVHJhbnNhY3Rpb25zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaXNzdWluZy90cmFuc2FjdGlvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRyYW5zYWN0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RheC90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgY3JlYXRlRnJvbUNhbGN1bGF0aW9uOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGF4L3RyYW5zYWN0aW9ucy9jcmVhdGVfZnJvbV9jYWxjdWxhdGlvbicsXG4gICAgfSksXG4gICAgY3JlYXRlUmV2ZXJzYWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90YXgvdHJhbnNhY3Rpb25zL2NyZWF0ZV9yZXZlcnNhbCcsXG4gICAgfSksXG4gICAgbGlzdExpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGF4L3RyYW5zYWN0aW9ucy97dHJhbnNhY3Rpb259L2xpbmVfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRyYW5zYWN0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyZWFzdXJ5L3RyYW5zYWN0aW9ucy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90cmVhc3VyeS90cmFuc2FjdGlvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFZhbHVlTGlzdEl0ZW1zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yYWRhci92YWx1ZV9saXN0X2l0ZW1zJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcmFkYXIvdmFsdWVfbGlzdF9pdGVtcy97aXRlbX0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3JhZGFyL3ZhbHVlX2xpc3RfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yYWRhci92YWx1ZV9saXN0X2l0ZW1zL3tpdGVtfScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFZhbHVlTGlzdHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3JhZGFyL3ZhbHVlX2xpc3RzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcmFkYXIvdmFsdWVfbGlzdHMve3ZhbHVlX2xpc3R9JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yYWRhci92YWx1ZV9saXN0cy97dmFsdWVfbGlzdH0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3JhZGFyL3ZhbHVlX2xpc3RzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcmFkYXIvdmFsdWVfbGlzdHMve3ZhbHVlX2xpc3R9JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVmVyaWZpY2F0aW9uUmVwb3J0cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lkZW50aXR5L3ZlcmlmaWNhdGlvbl9yZXBvcnRzL3tyZXBvcnR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pZGVudGl0eS92ZXJpZmljYXRpb25fcmVwb3J0cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVmVyaWZpY2F0aW9uU2Vzc2lvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lkZW50aXR5L3ZlcmlmaWNhdGlvbl9zZXNzaW9ucycsXG4gICAgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lkZW50aXR5L3ZlcmlmaWNhdGlvbl9zZXNzaW9ucy97c2Vzc2lvbn0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lkZW50aXR5L3ZlcmlmaWNhdGlvbl9zZXNzaW9ucy97c2Vzc2lvbn0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2lkZW50aXR5L3ZlcmlmaWNhdGlvbl9zZXNzaW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pZGVudGl0eS92ZXJpZmljYXRpb25fc2Vzc2lvbnMve3Nlc3Npb259L2NhbmNlbCcsXG4gICAgfSksXG4gICAgcmVkYWN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaWRlbnRpdHkvdmVyaWZpY2F0aW9uX3Nlc3Npb25zL3tzZXNzaW9ufS9yZWRhY3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbi8vIFNpbmNlIHBhdGggY2FuIGVpdGhlciBiZSBgYWNjb3VudGAgb3IgYGFjY291bnRzYCwgc3VwcG9ydCBib3RoIHRocm91Z2ggc3RyaXBlTWV0aG9kIHBhdGhcbmV4cG9ydCBjb25zdCBBY2NvdW50cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMnIH0pLFxuICAgIHJldHJpZXZlKGlkLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIE5vIGxvbmdlciBhbGxvdyBhbiBhcGkga2V5IHRvIGJlIHBhc3NlZCBhcyB0aGUgZmlyc3Qgc3RyaW5nIHRvIHRoaXMgZnVuY3Rpb24gZHVlIHRvIGFtYmlndWl0eSBiZXR3ZWVuXG4gICAgICAgIC8vIG9sZCBhY2NvdW50IGlkcyBhbmQgYXBpIGtleXMuIFRvIHJlcXVlc3QgdGhlIGFjY291bnQgZm9yIGFuIGFwaSBrZXksIHNlbmQgbnVsbCBhcyB0aGUgaWRcbiAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2lkfScsXG4gICAgICAgICAgICB9KS5hcHBseSh0aGlzLCBbaWQsIC4uLmFyZ3NdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpZCA9PT0gbnVsbCB8fCBpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGlkIGFzIHN0cmlwZU1ldGhvZCB3b3VsZCBjb21wbGFpbiBvZiB1bmV4cGVjdGVkIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgW10uc2hpZnQuYXBwbHkoW2lkLCAuLi5hcmdzXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FjY291bnQnLFxuICAgICAgICAgICAgfSkuYXBwbHkodGhpcywgW2lkLCAuLi5hcmdzXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2FjY291bnRzL3thY2NvdW50fScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdERUxFVEUnLCBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0nIH0pLFxuICAgIGNyZWF0ZUV4dGVybmFsQWNjb3VudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FjY291bnRzL3thY2NvdW50fS9leHRlcm5hbF9hY2NvdW50cycsXG4gICAgfSksXG4gICAgY3JlYXRlTG9naW5MaW5rOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2FjY291bnR9L2xvZ2luX2xpbmtzJyxcbiAgICB9KSxcbiAgICBjcmVhdGVQZXJzb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vcGVyc29ucycsXG4gICAgfSksXG4gICAgZGVsZXRlRXh0ZXJuYWxBY2NvdW50OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vZXh0ZXJuYWxfYWNjb3VudHMve2lkfScsXG4gICAgfSksXG4gICAgZGVsZXRlUGVyc29uOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vcGVyc29ucy97cGVyc29ufScsXG4gICAgfSksXG4gICAgbGlzdENhcGFiaWxpdGllczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2FjY291bnR9L2NhcGFiaWxpdGllcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBsaXN0RXh0ZXJuYWxBY2NvdW50czogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2FjY291bnR9L2V4dGVybmFsX2FjY291bnRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGxpc3RQZXJzb25zOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vcGVyc29ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICByZWplY3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vcmVqZWN0JyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZUN1cnJlbnQ6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL2FjY291bnQnIH0pLFxuICAgIHJldHJpZXZlQ2FwYWJpbGl0eTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2FjY291bnR9L2NhcGFiaWxpdGllcy97Y2FwYWJpbGl0eX0nLFxuICAgIH0pLFxuICAgIHJldHJpZXZlRXh0ZXJuYWxBY2NvdW50OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vZXh0ZXJuYWxfYWNjb3VudHMve2lkfScsXG4gICAgfSksXG4gICAgcmV0cmlldmVQZXJzb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FjY291bnRzL3thY2NvdW50fS9wZXJzb25zL3twZXJzb259JyxcbiAgICB9KSxcbiAgICB1cGRhdGVDYXBhYmlsaXR5OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYWNjb3VudHMve2FjY291bnR9L2NhcGFiaWxpdGllcy97Y2FwYWJpbGl0eX0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZUV4dGVybmFsQWNjb3VudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FjY291bnRzL3thY2NvdW50fS9leHRlcm5hbF9hY2NvdW50cy97aWR9JyxcbiAgICB9KSxcbiAgICB1cGRhdGVQZXJzb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hY2NvdW50cy97YWNjb3VudH0vcGVyc29ucy97cGVyc29ufScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEFjY291bnRMaW5rcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvYWNjb3VudF9saW5rcycgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEFjY291bnRTZXNzaW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvYWNjb3VudF9zZXNzaW9ucycgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEFwcGxlUGF5RG9tYWlucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvYXBwbGVfcGF5L2RvbWFpbnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBsZV9wYXkvZG9tYWlucy97ZG9tYWlufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYXBwbGVfcGF5L2RvbWFpbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBsZV9wYXkvZG9tYWlucy97ZG9tYWlufScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEFwcGxpY2F0aW9uRmVlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FwcGxpY2F0aW9uX2ZlZXMve2lkfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYXBwbGljYXRpb25fZmVlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjcmVhdGVSZWZ1bmQ6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBsaWNhdGlvbl9mZWVzL3tpZH0vcmVmdW5kcycsXG4gICAgfSksXG4gICAgbGlzdFJlZnVuZHM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2FwcGxpY2F0aW9uX2ZlZXMve2lkfS9yZWZ1bmRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlUmVmdW5kOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9hcHBsaWNhdGlvbl9mZWVzL3tmZWV9L3JlZnVuZHMve2lkfScsXG4gICAgfSksXG4gICAgdXBkYXRlUmVmdW5kOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvYXBwbGljYXRpb25fZmVlcy97ZmVlfS9yZWZ1bmRzL3tpZH0nLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBCYWxhbmNlID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvYmFsYW5jZScgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEJhbGFuY2VUcmFuc2FjdGlvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iYWxhbmNlX3RyYW5zYWN0aW9ucy97aWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9iYWxhbmNlX3RyYW5zYWN0aW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQ2hhcmdlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvY2hhcmdlcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL2NoYXJnZXMve2NoYXJnZX0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2NoYXJnZXMve2NoYXJnZX0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NoYXJnZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgY2FwdHVyZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NoYXJnZXMve2NoYXJnZX0vY2FwdHVyZScsXG4gICAgfSksXG4gICAgc2VhcmNoOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jaGFyZ2VzL3NlYXJjaCcsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdzZWFyY2gnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBDb25maXJtYXRpb25Ub2tlbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jb25maXJtYXRpb25fdG9rZW5zL3tjb25maXJtYXRpb25fdG9rZW59JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQ291bnRyeVNwZWNzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY291bnRyeV9zcGVjcy97Y291bnRyeX0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NvdW50cnlfc3BlY3MnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IENvdXBvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2NvdXBvbnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9jb3Vwb25zL3tjb3Vwb259JyB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9jb3Vwb25zL3tjb3Vwb259JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jb3Vwb25zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnREVMRVRFJywgZnVsbFBhdGg6ICcvdjEvY291cG9ucy97Y291cG9ufScgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IENyZWRpdE5vdGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9jcmVkaXRfbm90ZXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9jcmVkaXRfbm90ZXMve2lkfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvY3JlZGl0X25vdGVzL3tpZH0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2NyZWRpdF9ub3RlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBsaXN0TGluZUl0ZW1zOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jcmVkaXRfbm90ZXMve2NyZWRpdF9ub3RlfS9saW5lcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBsaXN0UHJldmlld0xpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3JlZGl0X25vdGVzL3ByZXZpZXcvbGluZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgcHJldmlldzogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvY3JlZGl0X25vdGVzL3ByZXZpZXcnIH0pLFxuICAgIHZvaWRDcmVkaXROb3RlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3JlZGl0X25vdGVzL3tpZH0vdm9pZCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IEN1c3RvbWVyU2Vzc2lvbnMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVyX3Nlc3Npb25zJyB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgQ3VzdG9tZXJzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBkZWw6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0RFTEVURScsIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9JyB9KSxcbiAgICBjcmVhdGVCYWxhbmNlVHJhbnNhY3Rpb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9iYWxhbmNlX3RyYW5zYWN0aW9ucycsXG4gICAgfSksXG4gICAgY3JlYXRlRnVuZGluZ0luc3RydWN0aW9uczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L2Z1bmRpbmdfaW5zdHJ1Y3Rpb25zJyxcbiAgICB9KSxcbiAgICBjcmVhdGVTb3VyY2U6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9zb3VyY2VzJyxcbiAgICB9KSxcbiAgICBjcmVhdGVUYXhJZDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L3RheF9pZHMnLFxuICAgIH0pLFxuICAgIGRlbGV0ZURpc2NvdW50OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9kaXNjb3VudCcsXG4gICAgfSksXG4gICAgZGVsZXRlU291cmNlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9zb3VyY2VzL3tpZH0nLFxuICAgIH0pLFxuICAgIGRlbGV0ZVRheElkOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS90YXhfaWRzL3tpZH0nLFxuICAgIH0pLFxuICAgIGxpc3RCYWxhbmNlVHJhbnNhY3Rpb25zOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9iYWxhbmNlX3RyYW5zYWN0aW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBsaXN0Q2FzaEJhbGFuY2VUcmFuc2FjdGlvbnM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L2Nhc2hfYmFsYW5jZV90cmFuc2FjdGlvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgbGlzdFBheW1lbnRNZXRob2RzOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9wYXltZW50X21ldGhvZHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgbGlzdFNvdXJjZXM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L3NvdXJjZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgbGlzdFRheElkczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0vdGF4X2lkcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZUJhbGFuY2VUcmFuc2FjdGlvbjogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0vYmFsYW5jZV90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgcmV0cmlldmVDYXNoQmFsYW5jZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0vY2FzaF9iYWxhbmNlJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZUNhc2hCYWxhbmNlVHJhbnNhY3Rpb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L2Nhc2hfYmFsYW5jZV90cmFuc2FjdGlvbnMve3RyYW5zYWN0aW9ufScsXG4gICAgfSksXG4gICAgcmV0cmlldmVQYXltZW50TWV0aG9kOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9wYXltZW50X21ldGhvZHMve3BheW1lbnRfbWV0aG9kfScsXG4gICAgfSksXG4gICAgcmV0cmlldmVTb3VyY2U6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L3NvdXJjZXMve2lkfScsXG4gICAgfSksXG4gICAgcmV0cmlldmVUYXhJZDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0vdGF4X2lkcy97aWR9JyxcbiAgICB9KSxcbiAgICBzZWFyY2g6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy9zZWFyY2gnLFxuICAgICAgICBtZXRob2RUeXBlOiAnc2VhcmNoJyxcbiAgICB9KSxcbiAgICB1cGRhdGVCYWxhbmNlVHJhbnNhY3Rpb246IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9iYWxhbmNlX3RyYW5zYWN0aW9ucy97dHJhbnNhY3Rpb259JyxcbiAgICB9KSxcbiAgICB1cGRhdGVDYXNoQmFsYW5jZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2N1c3RvbWVycy97Y3VzdG9tZXJ9L2Nhc2hfYmFsYW5jZScsXG4gICAgfSksXG4gICAgdXBkYXRlU291cmNlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvY3VzdG9tZXJzL3tjdXN0b21lcn0vc291cmNlcy97aWR9JyxcbiAgICB9KSxcbiAgICB2ZXJpZnlTb3VyY2U6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9jdXN0b21lcnMve2N1c3RvbWVyfS9zb3VyY2VzL3tpZH0vdmVyaWZ5JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgRGlzcHV0ZXMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9kaXNwdXRlcy97ZGlzcHV0ZX0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2Rpc3B1dGVzL3tkaXNwdXRlfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZGlzcHV0ZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgY2xvc2U6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9kaXNwdXRlcy97ZGlzcHV0ZX0vY2xvc2UnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBFcGhlbWVyYWxLZXlzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9lcGhlbWVyYWxfa2V5cycsXG4gICAgICAgIHZhbGlkYXRvcjogKGRhdGEsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzIHx8ICFvcHRpb25zLmhlYWRlcnNbJ1N0cmlwZS1WZXJzaW9uJ10pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bhc3NpbmcgYXBpVmVyc2lvbiBpbiBhIHNlcGFyYXRlIG9wdGlvbnMgaGFzaCBpcyByZXF1aXJlZCB0byBjcmVhdGUgYW4gZXBoZW1lcmFsIGtleS4gU2VlIGh0dHBzOi8vc3RyaXBlLmNvbS9kb2NzL2FwaS92ZXJzaW9uaW5nP2xhbmc9bm9kZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnREVMRVRFJywgZnVsbFBhdGg6ICcvdjEvZXBoZW1lcmFsX2tleXMve2tleX0nIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBFdmVudHMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9ldmVudHMve2lkfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZXZlbnRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBFeGNoYW5nZVJhdGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZXhjaGFuZ2VfcmF0ZXMve3JhdGVfaWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9leGNoYW5nZV9yYXRlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgRmlsZUxpbmtzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9maWxlX2xpbmtzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvZmlsZV9saW5rcy97bGlua30nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2ZpbGVfbGlua3Mve2xpbmt9JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9maWxlX2xpbmtzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxufSk7XG4iLCAiaW1wb3J0IHsgZmxhdHRlbkFuZFN0cmluZ2lmeSwgc3RyaW5naWZ5UmVxdWVzdERhdGEgfSBmcm9tICcuL3V0aWxzLmpzJztcbi8vIE1ldGhvZCBmb3IgZm9ybWF0dGluZyBIVFRQIGJvZHkgZm9yIHRoZSBtdWx0aXBhcnQvZm9ybS1kYXRhIHNwZWNpZmljYXRpb25cbi8vIE1vc3RseSB0YWtlbiBmcm9tIEZlcm1hdGEuanNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uYXRldncvZmVybWF0YS9ibG9iLzVkOTczMmEzM2Q3NzZjZTkyNTAxM2EyNjU5MzVmYWNkMTYyNmNjODgvZmVybWF0YS5qcyNMMzE1LUwzNDNcbmNvbnN0IG11bHRpcGFydERhdGFHZW5lcmF0b3IgPSAobWV0aG9kLCBkYXRhLCBoZWFkZXJzKSA9PiB7XG4gICAgY29uc3Qgc2Vnbm8gPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSkudG9TdHJpbmcoKTtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IGBtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT0ke3NlZ25vfWA7XG4gICAgY29uc3QgdGV4dEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICBsZXQgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgY29uc3QgZW5kQnVmZmVyID0gdGV4dEVuY29kZXIuZW5jb2RlKCdcXHJcXG4nKTtcbiAgICBmdW5jdGlvbiBwdXNoKGwpIHtcbiAgICAgICAgY29uc3QgcHJldkJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgY29uc3QgbmV3QnVmZmVyID0gbCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgPyBsIDogbmV3IFVpbnQ4QXJyYXkodGV4dEVuY29kZXIuZW5jb2RlKGwpKTtcbiAgICAgICAgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkocHJldkJ1ZmZlci5sZW5ndGggKyBuZXdCdWZmZXIubGVuZ3RoICsgMik7XG4gICAgICAgIGJ1ZmZlci5zZXQocHJldkJ1ZmZlcik7XG4gICAgICAgIGJ1ZmZlci5zZXQobmV3QnVmZmVyLCBwcmV2QnVmZmVyLmxlbmd0aCk7XG4gICAgICAgIGJ1ZmZlci5zZXQoZW5kQnVmZmVyLCBidWZmZXIubGVuZ3RoIC0gMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHEocykge1xuICAgICAgICByZXR1cm4gYFwiJHtzLnJlcGxhY2UoL1wifFwiL2csICclMjInKS5yZXBsYWNlKC9cXHJcXG58XFxyfFxcbi9nLCAnICcpfVwiYDtcbiAgICB9XG4gICAgY29uc3QgZmxhdHRlbmVkRGF0YSA9IGZsYXR0ZW5BbmRTdHJpbmdpZnkoZGF0YSk7XG4gICAgZm9yIChjb25zdCBrIGluIGZsYXR0ZW5lZERhdGEpIHtcbiAgICAgICAgY29uc3QgdiA9IGZsYXR0ZW5lZERhdGFba107XG4gICAgICAgIHB1c2goYC0tJHtzZWdub31gKTtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2LCAnZGF0YScpKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlZEVudHJ5ID0gdjtcbiAgICAgICAgICAgIHB1c2goYENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT0ke3Eoayl9OyBmaWxlbmFtZT0ke3EodHlwZWRFbnRyeS5uYW1lIHx8ICdibG9iJyl9YCk7XG4gICAgICAgICAgICBwdXNoKGBDb250ZW50LVR5cGU6ICR7dHlwZWRFbnRyeS50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfWApO1xuICAgICAgICAgICAgcHVzaCgnJyk7XG4gICAgICAgICAgICBwdXNoKHR5cGVkRW50cnkuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwdXNoKGBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9JHtxKGspfWApO1xuICAgICAgICAgICAgcHVzaCgnJyk7XG4gICAgICAgICAgICBwdXNoKHYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1c2goYC0tJHtzZWdub30tLWApO1xuICAgIHJldHVybiBidWZmZXI7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGFydFJlcXVlc3REYXRhUHJvY2Vzc29yKG1ldGhvZCwgZGF0YSwgaGVhZGVycywgY2FsbGJhY2spIHtcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICBpZiAobWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHN0cmluZ2lmeVJlcXVlc3REYXRhKGRhdGEpKTtcbiAgICB9XG4gICAgdGhpcy5fc3RyaXBlLl9wbGF0Zm9ybUZ1bmN0aW9uc1xuICAgICAgICAudHJ5QnVmZmVyRGF0YShkYXRhKVxuICAgICAgICAudGhlbigoYnVmZmVyZWREYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG11bHRpcGFydERhdGFHZW5lcmF0b3IobWV0aG9kLCBidWZmZXJlZERhdGEsIGhlYWRlcnMpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgYnVmZmVyKTtcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4gY2FsbGJhY2soZXJyLCBudWxsKSk7XG59XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBtdWx0aXBhcnRSZXF1ZXN0RGF0YVByb2Nlc3NvciB9IGZyb20gJy4uL211bHRpcGFydC5qcyc7XG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBGaWxlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZmlsZXMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ211bHRpcGFydC9mb3JtLWRhdGEnLFxuICAgICAgICB9LFxuICAgICAgICBob3N0OiAnZmlsZXMuc3RyaXBlLmNvbScsXG4gICAgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL2ZpbGVzL3tmaWxlfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvZmlsZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgcmVxdWVzdERhdGFQcm9jZXNzb3I6IG11bHRpcGFydFJlcXVlc3REYXRhUHJvY2Vzc29yLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBJbnZvaWNlSXRlbXMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIGNyZWF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VpdGVtcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VpdGVtcy97aW52b2ljZWl0ZW19JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pbnZvaWNlaXRlbXMve2ludm9pY2VpdGVtfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZWl0ZW1zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZWl0ZW1zL3tpbnZvaWNlaXRlbX0nLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBJbnZvaWNlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvaW52b2ljZXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9pbnZvaWNlcy97aW52b2ljZX0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3tpbnZvaWNlfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdERUxFVEUnLCBmdWxsUGF0aDogJy92MS9pbnZvaWNlcy97aW52b2ljZX0nIH0pLFxuICAgIGZpbmFsaXplSW52b2ljZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3tpbnZvaWNlfS9maW5hbGl6ZScsXG4gICAgfSksXG4gICAgbGlzdExpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZXMve2ludm9pY2V9L2xpbmVzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGxpc3RVcGNvbWluZ0xpbmVzOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9pbnZvaWNlcy91cGNvbWluZy9saW5lcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBtYXJrVW5jb2xsZWN0aWJsZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3tpbnZvaWNlfS9tYXJrX3VuY29sbGVjdGlibGUnLFxuICAgIH0pLFxuICAgIHBheTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3tpbnZvaWNlfS9wYXknIH0pLFxuICAgIHJldHJpZXZlVXBjb21pbmc6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3VwY29taW5nJyxcbiAgICB9KSxcbiAgICBzZWFyY2g6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3NlYXJjaCcsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdzZWFyY2gnLFxuICAgIH0pLFxuICAgIHNlbmRJbnZvaWNlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZXMve2ludm9pY2V9L3NlbmQnLFxuICAgIH0pLFxuICAgIHVwZGF0ZUxpbmVJdGVtOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvaW52b2ljZXMve2ludm9pY2V9L2xpbmVzL3tsaW5lX2l0ZW1faWR9JyxcbiAgICB9KSxcbiAgICB2b2lkSW52b2ljZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL2ludm9pY2VzL3tpbnZvaWNlfS92b2lkJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgTWFuZGF0ZXMgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9tYW5kYXRlcy97bWFuZGF0ZX0nIH0pLFxufSk7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlSZXF1ZXN0RGF0YSB9IGZyb20gJy4uL3V0aWxzLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmNvbnN0IG9BdXRoSG9zdCA9ICdjb25uZWN0LnN0cmlwZS5jb20nO1xuZXhwb3J0IGNvbnN0IE9BdXRoID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBiYXNlUGF0aDogJy8nLFxuICAgIGF1dGhvcml6ZVVybChwYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgbGV0IHBhdGggPSAnb2F1dGgvYXV0aG9yaXplJztcbiAgICAgICAgLy8gRm9yIEV4cHJlc3MgYWNjb3VudHMsIHRoZSBwYXRoIGNoYW5nZXNcbiAgICAgICAgaWYgKG9wdGlvbnMuZXhwcmVzcykge1xuICAgICAgICAgICAgcGF0aCA9IGBleHByZXNzLyR7cGF0aH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW1zLnJlc3BvbnNlX3R5cGUpIHtcbiAgICAgICAgICAgIHBhcmFtcy5yZXNwb25zZV90eXBlID0gJ2NvZGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW1zLmNsaWVudF9pZCkge1xuICAgICAgICAgICAgcGFyYW1zLmNsaWVudF9pZCA9IHRoaXMuX3N0cmlwZS5nZXRDbGllbnRJZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW1zLnNjb3BlKSB7XG4gICAgICAgICAgICBwYXJhbXMuc2NvcGUgPSAncmVhZF93cml0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBodHRwczovLyR7b0F1dGhIb3N0fS8ke3BhdGh9PyR7c3RyaW5naWZ5UmVxdWVzdERhdGEocGFyYW1zKX1gO1xuICAgIH0sXG4gICAgdG9rZW46IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnb2F1dGgvdG9rZW4nLFxuICAgICAgICBob3N0OiBvQXV0aEhvc3QsXG4gICAgfSksXG4gICAgZGVhdXRob3JpemUoc3BlYywgLi4uYXJncykge1xuICAgICAgICBpZiAoIXNwZWMuY2xpZW50X2lkKSB7XG4gICAgICAgICAgICBzcGVjLmNsaWVudF9pZCA9IHRoaXMuX3N0cmlwZS5nZXRDbGllbnRJZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBwYXRoOiAnb2F1dGgvZGVhdXRob3JpemUnLFxuICAgICAgICAgICAgaG9zdDogb0F1dGhIb3N0LFxuICAgICAgICB9KS5hcHBseSh0aGlzLCBbc3BlYywgLi4uYXJnc10pO1xuICAgIH0sXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFBheW1lbnRJbnRlbnRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wYXltZW50X2ludGVudHMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X2ludGVudHMve2ludGVudH0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfaW50ZW50cy97aW50ZW50fScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9pbnRlbnRzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGFwcGx5Q3VzdG9tZXJCYWxhbmNlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9pbnRlbnRzL3tpbnRlbnR9L2FwcGx5X2N1c3RvbWVyX2JhbGFuY2UnLFxuICAgIH0pLFxuICAgIGNhbmNlbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfaW50ZW50cy97aW50ZW50fS9jYW5jZWwnLFxuICAgIH0pLFxuICAgIGNhcHR1cmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X2ludGVudHMve2ludGVudH0vY2FwdHVyZScsXG4gICAgfSksXG4gICAgY29uZmlybTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfaW50ZW50cy97aW50ZW50fS9jb25maXJtJyxcbiAgICB9KSxcbiAgICBpbmNyZW1lbnRBdXRob3JpemF0aW9uOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9pbnRlbnRzL3tpbnRlbnR9L2luY3JlbWVudF9hdXRob3JpemF0aW9uJyxcbiAgICB9KSxcbiAgICBzZWFyY2g6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfaW50ZW50cy9zZWFyY2gnLFxuICAgICAgICBtZXRob2RUeXBlOiAnc2VhcmNoJyxcbiAgICB9KSxcbiAgICB2ZXJpZnlNaWNyb2RlcG9zaXRzOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9pbnRlbnRzL3tpbnRlbnR9L3ZlcmlmeV9taWNyb2RlcG9zaXRzJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgUGF5bWVudExpbmtzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wYXltZW50X2xpbmtzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9saW5rcy97cGF5bWVudF9saW5rfScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9saW5rcy97cGF5bWVudF9saW5rfScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9saW5rcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBsaXN0TGluZUl0ZW1zOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X2xpbmtzL3twYXltZW50X2xpbmt9L2xpbmVfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFBheW1lbnRNZXRob2RDb25maWd1cmF0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RfY29uZmlndXJhdGlvbnMnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X21ldGhvZF9jb25maWd1cmF0aW9ucy97Y29uZmlndXJhdGlvbn0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfbWV0aG9kX2NvbmZpZ3VyYXRpb25zL3tjb25maWd1cmF0aW9ufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RfY29uZmlndXJhdGlvbnMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFBheW1lbnRNZXRob2REb21haW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X21ldGhvZF9kb21haW5zJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RfZG9tYWlucy97cGF5bWVudF9tZXRob2RfZG9tYWlufScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RfZG9tYWlucy97cGF5bWVudF9tZXRob2RfZG9tYWlufScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RfZG9tYWlucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICB2YWxpZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfbWV0aG9kX2RvbWFpbnMve3BheW1lbnRfbWV0aG9kX2RvbWFpbn0vdmFsaWRhdGUnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBQYXltZW50TWV0aG9kcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RzL3twYXltZW50X21ldGhvZH0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW1lbnRfbWV0aG9kcy97cGF5bWVudF9tZXRob2R9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X21ldGhvZHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgYXR0YWNoOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5bWVudF9tZXRob2RzL3twYXltZW50X21ldGhvZH0vYXR0YWNoJyxcbiAgICB9KSxcbiAgICBkZXRhY2g6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXltZW50X21ldGhvZHMve3BheW1lbnRfbWV0aG9kfS9kZXRhY2gnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBQYXlvdXRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wYXlvdXRzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvcGF5b3V0cy97cGF5b3V0fScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcGF5b3V0cy97cGF5b3V0fScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcGF5b3V0cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wYXlvdXRzL3twYXlvdXR9L2NhbmNlbCcsXG4gICAgfSksXG4gICAgcmV2ZXJzZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3BheW91dHMve3BheW91dH0vcmV2ZXJzZScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFBsYW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wbGFucycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL3BsYW5zL3twbGFufScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcGxhbnMve3BsYW59JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wbGFucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBkZWw6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0RFTEVURScsIGZ1bGxQYXRoOiAnL3YxL3BsYW5zL3twbGFufScgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFByaWNlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcHJpY2VzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvcHJpY2VzL3twcmljZX0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3ByaWNlcy97cHJpY2V9JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wcmljZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgc2VhcmNoOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wcmljZXMvc2VhcmNoJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ3NlYXJjaCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFByb2R1Y3RzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wcm9kdWN0cycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL3Byb2R1Y3RzL3tpZH0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3Byb2R1Y3RzL3tpZH0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Byb2R1Y3RzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGRlbDogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnREVMRVRFJywgZnVsbFBhdGg6ICcvdjEvcHJvZHVjdHMve2lkfScgfSksXG4gICAgY3JlYXRlRmVhdHVyZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Byb2R1Y3RzL3twcm9kdWN0fS9mZWF0dXJlcycsXG4gICAgfSksXG4gICAgZGVsZXRlRmVhdHVyZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcHJvZHVjdHMve3Byb2R1Y3R9L2ZlYXR1cmVzL3tpZH0nLFxuICAgIH0pLFxuICAgIGxpc3RGZWF0dXJlczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcHJvZHVjdHMve3Byb2R1Y3R9L2ZlYXR1cmVzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlRmVhdHVyZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcHJvZHVjdHMve3Byb2R1Y3R9L2ZlYXR1cmVzL3tpZH0nLFxuICAgIH0pLFxuICAgIHNlYXJjaDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcHJvZHVjdHMvc2VhcmNoJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ3NlYXJjaCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFByb21vdGlvbkNvZGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9wcm9tb3Rpb25fY29kZXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9wcm9tb3Rpb25fY29kZXMve3Byb21vdGlvbl9jb2RlfScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcHJvbW90aW9uX2NvZGVzL3twcm9tb3Rpb25fY29kZX0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3Byb21vdGlvbl9jb2RlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgUXVvdGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9xdW90ZXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9xdW90ZXMve3F1b3RlfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcXVvdGVzL3txdW90ZX0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3F1b3RlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBhY2NlcHQ6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9xdW90ZXMve3F1b3RlfS9hY2NlcHQnIH0pLFxuICAgIGNhbmNlbDogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3F1b3Rlcy97cXVvdGV9L2NhbmNlbCcgfSksXG4gICAgZmluYWxpemVRdW90ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3F1b3Rlcy97cXVvdGV9L2ZpbmFsaXplJyxcbiAgICB9KSxcbiAgICBsaXN0Q29tcHV0ZWRVcGZyb250TGluZUl0ZW1zOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9xdW90ZXMve3F1b3RlfS9jb21wdXRlZF91cGZyb250X2xpbmVfaXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgbGlzdExpbmVJdGVtczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcXVvdGVzL3txdW90ZX0vbGluZV9pdGVtcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBwZGY6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3F1b3Rlcy97cXVvdGV9L3BkZicsXG4gICAgICAgIGhvc3Q6ICdmaWxlcy5zdHJpcGUuY29tJyxcbiAgICAgICAgc3RyZWFtaW5nOiB0cnVlLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBSZWZ1bmRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9yZWZ1bmRzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvcmVmdW5kcy97cmVmdW5kfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvcmVmdW5kcy97cmVmdW5kfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvcmVmdW5kcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZWZ1bmRzL3tyZWZ1bmR9L2NhbmNlbCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFJldmlld3MgPSBTdHJpcGVSZXNvdXJjZS5leHRlbmQoe1xuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS9yZXZpZXdzL3tyZXZpZXd9JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZXZpZXdzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGFwcHJvdmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9yZXZpZXdzL3tyZXZpZXd9L2FwcHJvdmUnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBTZXR1cEF0dGVtcHRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zZXR1cF9hdHRlbXB0cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU2V0dXBJbnRlbnRzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9zZXR1cF9pbnRlbnRzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc2V0dXBfaW50ZW50cy97aW50ZW50fScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc2V0dXBfaW50ZW50cy97aW50ZW50fScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc2V0dXBfaW50ZW50cycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjYW5jZWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zZXR1cF9pbnRlbnRzL3tpbnRlbnR9L2NhbmNlbCcsXG4gICAgfSksXG4gICAgY29uZmlybTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3NldHVwX2ludGVudHMve2ludGVudH0vY29uZmlybScsXG4gICAgfSksXG4gICAgdmVyaWZ5TWljcm9kZXBvc2l0czogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3NldHVwX2ludGVudHMve2ludGVudH0vdmVyaWZ5X21pY3JvZGVwb3NpdHMnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBTaGlwcGluZ1JhdGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9zaGlwcGluZ19yYXRlcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3NoaXBwaW5nX3JhdGVzL3tzaGlwcGluZ19yYXRlX3Rva2VufScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc2hpcHBpbmdfcmF0ZXMve3NoaXBwaW5nX3JhdGVfdG9rZW59JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zaGlwcGluZ19yYXRlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU291cmNlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvc291cmNlcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL3NvdXJjZXMve3NvdXJjZX0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3NvdXJjZXMve3NvdXJjZX0nIH0pLFxuICAgIGxpc3RTb3VyY2VUcmFuc2FjdGlvbnM6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3NvdXJjZXMve3NvdXJjZX0vc291cmNlX3RyYW5zYWN0aW9ucycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICB2ZXJpZnk6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zb3VyY2VzL3tzb3VyY2V9L3ZlcmlmeScsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFN1YnNjcmlwdGlvbkl0ZW1zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25faXRlbXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25faXRlbXMve2l0ZW19JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25faXRlbXMve2l0ZW19JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25faXRlbXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25faXRlbXMve2l0ZW19JyxcbiAgICB9KSxcbiAgICBjcmVhdGVVc2FnZVJlY29yZDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3N1YnNjcmlwdGlvbl9pdGVtcy97c3Vic2NyaXB0aW9uX2l0ZW19L3VzYWdlX3JlY29yZHMnLFxuICAgIH0pLFxuICAgIGxpc3RVc2FnZVJlY29yZFN1bW1hcmllczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9uX2l0ZW1zL3tzdWJzY3JpcHRpb25faXRlbX0vdXNhZ2VfcmVjb3JkX3N1bW1hcmllcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU3Vic2NyaXB0aW9uU2NoZWR1bGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25fc2NoZWR1bGVzJyxcbiAgICB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9uX3NjaGVkdWxlcy97c2NoZWR1bGV9JyxcbiAgICB9KSxcbiAgICB1cGRhdGU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25fc2NoZWR1bGVzL3tzY2hlZHVsZX0nLFxuICAgIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3N1YnNjcmlwdGlvbl9zY2hlZHVsZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgY2FuY2VsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9uX3NjaGVkdWxlcy97c2NoZWR1bGV9L2NhbmNlbCcsXG4gICAgfSksXG4gICAgcmVsZWFzZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3N1YnNjcmlwdGlvbl9zY2hlZHVsZXMve3NjaGVkdWxlfS9yZWxlYXNlJyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgU3Vic2NyaXB0aW9ucyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9ucycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3N1YnNjcmlwdGlvbnMve3N1YnNjcmlwdGlvbl9leHBvc2VkX2lkfScsXG4gICAgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9ucy97c3Vic2NyaXB0aW9uX2V4cG9zZWRfaWR9JyxcbiAgICB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25zJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIGNhbmNlbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9ucy97c3Vic2NyaXB0aW9uX2V4cG9zZWRfaWR9JyxcbiAgICB9KSxcbiAgICBkZWxldGVEaXNjb3VudDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvc3Vic2NyaXB0aW9ucy97c3Vic2NyaXB0aW9uX2V4cG9zZWRfaWR9L2Rpc2NvdW50JyxcbiAgICB9KSxcbiAgICByZXN1bWU6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25zL3tzdWJzY3JpcHRpb259L3Jlc3VtZScsXG4gICAgfSksXG4gICAgc2VhcmNoOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS9zdWJzY3JpcHRpb25zL3NlYXJjaCcsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdzZWFyY2gnLFxuICAgIH0pLFxufSk7XG4iLCAiLy8gRmlsZSBnZW5lcmF0ZWQgZnJvbSBvdXIgT3BlbkFQSSBzcGVjXG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4uL1N0cmlwZVJlc291cmNlLmpzJztcbmNvbnN0IHN0cmlwZU1ldGhvZCA9IFN0cmlwZVJlc291cmNlLm1ldGhvZDtcbmV4cG9ydCBjb25zdCBUYXhDb2RlcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL3RheF9jb2Rlcy97aWR9JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90YXhfY29kZXMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRheElkcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdGF4X2lkcycgfSksXG4gICAgcmV0cmlldmU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0dFVCcsIGZ1bGxQYXRoOiAnL3YxL3RheF9pZHMve2lkfScgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdGF4X2lkcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBkZWw6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ0RFTEVURScsIGZ1bGxQYXRoOiAnL3YxL3RheF9pZHMve2lkfScgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRheFJhdGVzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS90YXhfcmF0ZXMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS90YXhfcmF0ZXMve3RheF9yYXRlfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdGF4X3JhdGVzL3t0YXhfcmF0ZX0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RheF9yYXRlcycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVG9rZW5zID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS90b2tlbnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS90b2tlbnMve3Rva2VufScgfSksXG59KTtcbiIsICIvLyBGaWxlIGdlbmVyYXRlZCBmcm9tIG91ciBPcGVuQVBJIHNwZWNcbmltcG9ydCB7IFN0cmlwZVJlc291cmNlIH0gZnJvbSAnLi4vU3RyaXBlUmVzb3VyY2UuanMnO1xuY29uc3Qgc3RyaXBlTWV0aG9kID0gU3RyaXBlUmVzb3VyY2UubWV0aG9kO1xuZXhwb3J0IGNvbnN0IFRvcHVwcyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdG9wdXBzJyB9KSxcbiAgICByZXRyaWV2ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnR0VUJywgZnVsbFBhdGg6ICcvdjEvdG9wdXBzL3t0b3B1cH0nIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHsgbWV0aG9kOiAnUE9TVCcsIGZ1bGxQYXRoOiAnL3YxL3RvcHVwcy97dG9wdXB9JyB9KSxcbiAgICBsaXN0OiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS90b3B1cHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgY2FuY2VsOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdG9wdXBzL3t0b3B1cH0vY2FuY2VsJyB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgVHJhbnNmZXJzID0gU3RyaXBlUmVzb3VyY2UuZXh0ZW5kKHtcbiAgICBjcmVhdGU6IHN0cmlwZU1ldGhvZCh7IG1ldGhvZDogJ1BPU1QnLCBmdWxsUGF0aDogJy92MS90cmFuc2ZlcnMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdHRVQnLCBmdWxsUGF0aDogJy92MS90cmFuc2ZlcnMve3RyYW5zZmVyfScgfSksXG4gICAgdXBkYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvdHJhbnNmZXJzL3t0cmFuc2Zlcn0nIH0pLFxuICAgIGxpc3Q6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyYW5zZmVycycsXG4gICAgICAgIG1ldGhvZFR5cGU6ICdsaXN0JyxcbiAgICB9KSxcbiAgICBjcmVhdGVSZXZlcnNhbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyYW5zZmVycy97aWR9L3JldmVyc2FscycsXG4gICAgfSksXG4gICAgbGlzdFJldmVyc2Fsczogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvdHJhbnNmZXJzL3tpZH0vcmV2ZXJzYWxzJyxcbiAgICAgICAgbWV0aG9kVHlwZTogJ2xpc3QnLFxuICAgIH0pLFxuICAgIHJldHJpZXZlUmV2ZXJzYWw6IHN0cmlwZU1ldGhvZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyYW5zZmVycy97dHJhbnNmZXJ9L3JldmVyc2Fscy97aWR9JyxcbiAgICB9KSxcbiAgICB1cGRhdGVSZXZlcnNhbDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3RyYW5zZmVycy97dHJhbnNmZXJ9L3JldmVyc2Fscy97aWR9JyxcbiAgICB9KSxcbn0pO1xuIiwgIi8vIEZpbGUgZ2VuZXJhdGVkIGZyb20gb3VyIE9wZW5BUEkgc3BlY1xuaW1wb3J0IHsgU3RyaXBlUmVzb3VyY2UgfSBmcm9tICcuLi9TdHJpcGVSZXNvdXJjZS5qcyc7XG5jb25zdCBzdHJpcGVNZXRob2QgPSBTdHJpcGVSZXNvdXJjZS5tZXRob2Q7XG5leHBvcnQgY29uc3QgV2ViaG9va0VuZHBvaW50cyA9IFN0cmlwZVJlc291cmNlLmV4dGVuZCh7XG4gICAgY3JlYXRlOiBzdHJpcGVNZXRob2QoeyBtZXRob2Q6ICdQT1NUJywgZnVsbFBhdGg6ICcvdjEvd2ViaG9va19lbmRwb2ludHMnIH0pLFxuICAgIHJldHJpZXZlOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS93ZWJob29rX2VuZHBvaW50cy97d2ViaG9va19lbmRwb2ludH0nLFxuICAgIH0pLFxuICAgIHVwZGF0ZTogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGZ1bGxQYXRoOiAnL3YxL3dlYmhvb2tfZW5kcG9pbnRzL3t3ZWJob29rX2VuZHBvaW50fScsXG4gICAgfSksXG4gICAgbGlzdDogc3RyaXBlTWV0aG9kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZnVsbFBhdGg6ICcvdjEvd2ViaG9va19lbmRwb2ludHMnLFxuICAgICAgICBtZXRob2RUeXBlOiAnbGlzdCcsXG4gICAgfSksXG4gICAgZGVsOiBzdHJpcGVNZXRob2Qoe1xuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBmdWxsUGF0aDogJy92MS93ZWJob29rX2VuZHBvaW50cy97d2ViaG9va19lbmRwb2ludH0nLFxuICAgIH0pLFxufSk7XG4iLCAiaW1wb3J0IHsgU3RyaXBlQVBJRXJyb3IsIFN0cmlwZUF1dGhlbnRpY2F0aW9uRXJyb3IsIFN0cmlwZUNvbm5lY3Rpb25FcnJvciwgU3RyaXBlRXJyb3IsIFN0cmlwZVBlcm1pc3Npb25FcnJvciwgU3RyaXBlUmF0ZUxpbWl0RXJyb3IsIH0gZnJvbSAnLi9FcnJvci5qcyc7XG5pbXBvcnQgeyBlbWl0V2FybmluZywgbm9ybWFsaXplSGVhZGVycywgcmVtb3ZlTnVsbGlzaCwgc3RyaW5naWZ5UmVxdWVzdERhdGEsIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnLi9uZXQvSHR0cENsaWVudC5qcyc7XG5jb25zdCBNQVhfUkVUUllfQUZURVJfV0FJVCA9IDYwO1xuZXhwb3J0IGNsYXNzIFJlcXVlc3RTZW5kZXIge1xuICAgIGNvbnN0cnVjdG9yKHN0cmlwZSwgbWF4QnVmZmVyZWRSZXF1ZXN0TWV0cmljKSB7XG4gICAgICAgIHRoaXMuX3N0cmlwZSA9IHN0cmlwZTtcbiAgICAgICAgdGhpcy5fbWF4QnVmZmVyZWRSZXF1ZXN0TWV0cmljID0gbWF4QnVmZmVyZWRSZXF1ZXN0TWV0cmljO1xuICAgIH1cbiAgICBfYWRkSGVhZGVyc0RpcmVjdGx5VG9PYmplY3Qob2JqLCBoZWFkZXJzKSB7XG4gICAgICAgIC8vIEZvciBjb252ZW5pZW5jZSwgbWFrZSBzb21lIGhlYWRlcnMgZWFzaWx5IGFjY2Vzc2libGUgb25cbiAgICAgICAgLy8gbGFzdFJlc3BvbnNlLlxuICAgICAgICAvLyBOT1RFOiBTdHJpcGUgcmVzcG9uZHMgd2l0aCBsb3dlcmNhc2UgaGVhZGVyIG5hbWVzL2tleXMuXG4gICAgICAgIG9iai5yZXF1ZXN0SWQgPSBoZWFkZXJzWydyZXF1ZXN0LWlkJ107XG4gICAgICAgIG9iai5zdHJpcGVBY2NvdW50ID0gb2JqLnN0cmlwZUFjY291bnQgfHwgaGVhZGVyc1snc3RyaXBlLWFjY291bnQnXTtcbiAgICAgICAgb2JqLmFwaVZlcnNpb24gPSBvYmouYXBpVmVyc2lvbiB8fCBoZWFkZXJzWydzdHJpcGUtdmVyc2lvbiddO1xuICAgICAgICBvYmouaWRlbXBvdGVuY3lLZXkgPSBvYmouaWRlbXBvdGVuY3lLZXkgfHwgaGVhZGVyc1snaWRlbXBvdGVuY3kta2V5J107XG4gICAgfVxuICAgIF9tYWtlUmVzcG9uc2VFdmVudChyZXF1ZXN0RXZlbnQsIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdEVuZFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCByZXF1ZXN0RHVyYXRpb25NcyA9IHJlcXVlc3RFbmRUaW1lIC0gcmVxdWVzdEV2ZW50LnJlcXVlc3Rfc3RhcnRfdGltZTtcbiAgICAgICAgcmV0dXJuIHJlbW92ZU51bGxpc2goe1xuICAgICAgICAgICAgYXBpX3ZlcnNpb246IGhlYWRlcnNbJ3N0cmlwZS12ZXJzaW9uJ10sXG4gICAgICAgICAgICBhY2NvdW50OiBoZWFkZXJzWydzdHJpcGUtYWNjb3VudCddLFxuICAgICAgICAgICAgaWRlbXBvdGVuY3lfa2V5OiBoZWFkZXJzWydpZGVtcG90ZW5jeS1rZXknXSxcbiAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdEV2ZW50Lm1ldGhvZCxcbiAgICAgICAgICAgIHBhdGg6IHJlcXVlc3RFdmVudC5wYXRoLFxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXNDb2RlLFxuICAgICAgICAgICAgcmVxdWVzdF9pZDogdGhpcy5fZ2V0UmVxdWVzdElkKGhlYWRlcnMpLFxuICAgICAgICAgICAgZWxhcHNlZDogcmVxdWVzdER1cmF0aW9uTXMsXG4gICAgICAgICAgICByZXF1ZXN0X3N0YXJ0X3RpbWU6IHJlcXVlc3RFdmVudC5yZXF1ZXN0X3N0YXJ0X3RpbWUsXG4gICAgICAgICAgICByZXF1ZXN0X2VuZF90aW1lOiByZXF1ZXN0RW5kVGltZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9nZXRSZXF1ZXN0SWQoaGVhZGVycykge1xuICAgICAgICByZXR1cm4gaGVhZGVyc1sncmVxdWVzdC1pZCddO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVc2VkIGJ5IG1ldGhvZHMgd2l0aCBzcGVjLnN0cmVhbWluZyA9PT0gdHJ1ZS4gRm9yIHRoZXNlIG1ldGhvZHMsIHdlIGRvIG5vdFxuICAgICAqIGJ1ZmZlciBzdWNjZXNzZnVsIHJlc3BvbnNlcyBpbnRvIG1lbW9yeSBvciBkbyBwYXJzZSB0aGVtIGludG8gc3RyaXBlXG4gICAgICogb2JqZWN0cywgd2UgZGVsZWdhdGUgdGhhdCBhbGwgb2YgdGhhdCB0byB0aGUgdXNlciBhbmQgcGFzcyBiYWNrIHRoZSByYXdcbiAgICAgKiBodHRwLlJlc3BvbnNlIG9iamVjdCB0byB0aGUgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiAoVW5zdWNjZXNzZnVsIHJlc3BvbnNlcyBzaG91bGRuJ3QgbWFrZSBpdCBoZXJlLCB0aGV5IHNob3VsZFxuICAgICAqIHN0aWxsIGJlIGJ1ZmZlcmVkL3BhcnNlZCBhbmQgaGFuZGxlZCBieSBfanNvblJlc3BvbnNlSGFuZGxlciAtLSBzZWVcbiAgICAgKiBtYWtlUmVxdWVzdClcbiAgICAgKi9cbiAgICBfc3RyZWFtaW5nUmVzcG9uc2VIYW5kbGVyKHJlcXVlc3RFdmVudCwgdXNhZ2UsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAocmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gcmVzLmdldEhlYWRlcnMoKTtcbiAgICAgICAgICAgIGNvbnN0IHN0cmVhbUNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VFdmVudCA9IHRoaXMuX21ha2VSZXNwb25zZUV2ZW50KHJlcXVlc3RFdmVudCwgcmVzLmdldFN0YXR1c0NvZGUoKSwgaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyaXBlLl9lbWl0dGVyLmVtaXQoJ3Jlc3BvbnNlJywgcmVzcG9uc2VFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUmVxdWVzdE1ldHJpY3ModGhpcy5fZ2V0UmVxdWVzdElkKGhlYWRlcnMpLCByZXNwb25zZUV2ZW50LmVsYXBzZWQsIHVzYWdlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBzdHJlYW0gPSByZXMudG9TdHJlYW0oc3RyZWFtQ29tcGxldGVDYWxsYmFjayk7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGhlcmUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCBhcyB0aGUgc3RyZWFtIGlzIGEgcmF3XG4gICAgICAgICAgICAvLyBIVFRQIHJlc3BvbnNlIGluIE5vZGUgYW5kIHRoZSBsZWdhY3kgYmVoYXZpb3Igd2FzIHRvIG11dGF0ZSB0aGlzXG4gICAgICAgICAgICAvLyByZXNwb25zZS5cbiAgICAgICAgICAgIHRoaXMuX2FkZEhlYWRlcnNEaXJlY3RseVRvT2JqZWN0KHN0cmVhbSwgaGVhZGVycyk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgc3RyZWFtKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVmYXVsdCBoYW5kbGVyIGZvciBTdHJpcGUgcmVzcG9uc2VzLiBCdWZmZXJzIHRoZSByZXNwb25zZSBpbnRvIG1lbW9yeSxcbiAgICAgKiBwYXJzZXMgdGhlIEpTT04gYW5kIHJldHVybnMgaXQgKGkuZS4gcGFzc2VzIGl0IHRvIHRoZSBjYWxsYmFjaykgaWYgdGhlcmVcbiAgICAgKiBpcyBubyBcImVycm9yXCIgZmllbGQuIE90aGVyd2lzZSBjb25zdHJ1Y3RzL3Bhc3NlcyBhbiBhcHByb3ByaWF0ZSBFcnJvci5cbiAgICAgKi9cbiAgICBfanNvblJlc3BvbnNlSGFuZGxlcihyZXF1ZXN0RXZlbnQsIHVzYWdlLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gKHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHJlcy5nZXRIZWFkZXJzKCk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLl9nZXRSZXF1ZXN0SWQoaGVhZGVycyk7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXNDb2RlID0gcmVzLmdldFN0YXR1c0NvZGUoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRXZlbnQgPSB0aGlzLl9tYWtlUmVzcG9uc2VFdmVudChyZXF1ZXN0RXZlbnQsIHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgICAgICAgdGhpcy5fc3RyaXBlLl9lbWl0dGVyLmVtaXQoJ3Jlc3BvbnNlJywgcmVzcG9uc2VFdmVudCk7XG4gICAgICAgICAgICByZXNcbiAgICAgICAgICAgICAgICAudG9KU09OKClcbiAgICAgICAgICAgICAgICAudGhlbigoanNvblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGpzb25SZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IE9BdXRoIGVycm9yIHJlc3BvbnNlcyBpbnRvIGEgc3RhbmRhcmQgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIGVycm9yIGxvZ2ljIGNhbiBiZSBzaGFyZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBqc29uUmVzcG9uc2UuZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uUmVzcG9uc2UuZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZToganNvblJlc3BvbnNlLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGpzb25SZXNwb25zZS5lcnJvcl9kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAganNvblJlc3BvbnNlLmVycm9yLmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgICAgICAgICAgICAgICBqc29uUmVzcG9uc2UuZXJyb3Iuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gICAgICAgICAgICAgICAgICAgIGpzb25SZXNwb25zZS5lcnJvci5yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9IG5ldyBTdHJpcGVBdXRoZW50aWNhdGlvbkVycm9yKGpzb25SZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBuZXcgU3RyaXBlUGVybWlzc2lvbkVycm9yKGpzb25SZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RhdHVzQ29kZSA9PT0gNDI5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBuZXcgU3RyaXBlUmF0ZUxpbWl0RXJyb3IoanNvblJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9IFN0cmlwZUVycm9yLmdlbmVyYXRlKGpzb25SZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvblJlc3BvbnNlO1xuICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RyaXBlQVBJRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSW52YWxpZCBKU09OIHJlY2VpdmVkIGZyb20gdGhlIFN0cmlwZSBBUEknLFxuICAgICAgICAgICAgICAgICAgICBleGNlcHRpb246IGUsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RJZDogaGVhZGVyc1sncmVxdWVzdC1pZCddLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoanNvblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUmVxdWVzdE1ldHJpY3MocmVxdWVzdElkLCByZXNwb25zZUV2ZW50LmVsYXBzZWQsIHVzYWdlKTtcbiAgICAgICAgICAgICAgICAvLyBFeHBvc2UgcmF3IHJlc3BvbnNlIG9iamVjdC5cbiAgICAgICAgICAgICAgICBjb25zdCByYXdSZXNwb25zZSA9IHJlcy5nZXRSYXdSZXNwb25zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FkZEhlYWRlcnNEaXJlY3RseVRvT2JqZWN0KHJhd1Jlc3BvbnNlLCBoZWFkZXJzKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoanNvblJlc3BvbnNlLCAnbGFzdFJlc3BvbnNlJywge1xuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmF3UmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwganNvblJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0sIChlKSA9PiBjYWxsYmFjayhlLCBudWxsKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBfZ2VuZXJhdGVDb25uZWN0aW9uRXJyb3JNZXNzYWdlKHJlcXVlc3RSZXRyaWVzKSB7XG4gICAgICAgIHJldHVybiBgQW4gZXJyb3Igb2NjdXJyZWQgd2l0aCBvdXIgY29ubmVjdGlvbiB0byBTdHJpcGUuJHtyZXF1ZXN0UmV0cmllcyA+IDAgPyBgIFJlcXVlc3Qgd2FzIHJldHJpZWQgJHtyZXF1ZXN0UmV0cmllc30gdGltZXMuYCA6ICcnfWA7XG4gICAgfVxuICAgIC8vIEZvciBtb3JlIG9uIHdoZW4gYW5kIGhvdyB0byByZXRyeSBBUEkgcmVxdWVzdHMsIHNlZSBodHRwczovL3N0cmlwZS5jb20vZG9jcy9lcnJvci1oYW5kbGluZyNzYWZlbHktcmV0cnlpbmctcmVxdWVzdHMtd2l0aC1pZGVtcG90ZW5jeVxuICAgIHN0YXRpYyBfc2hvdWxkUmV0cnkocmVzLCBudW1SZXRyaWVzLCBtYXhSZXRyaWVzLCBlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgJiZcbiAgICAgICAgICAgIG51bVJldHJpZXMgPT09IDAgJiZcbiAgICAgICAgICAgIEh0dHBDbGllbnQuQ09OTkVDVElPTl9DTE9TRURfRVJST1JfQ09ERVMuaW5jbHVkZXMoZXJyb3IuY29kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIG5vdCByZXRyeSBpZiB3ZSBhcmUgb3V0IG9mIHJldHJpZXMuXG4gICAgICAgIGlmIChudW1SZXRyaWVzID49IG1heFJldHJpZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXRyeSBvbiBjb25uZWN0aW9uIGVycm9yLlxuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIEFQSSBtYXkgYXNrIHVzIG5vdCB0byByZXRyeSAoZS5nLiwgaWYgZG9pbmcgc28gd291bGQgYmUgYSBuby1vcClcbiAgICAgICAgLy8gb3IgYWR2aXNlIHVzIHRvIHJldHJ5IChlLmcuLCBpbiBjYXNlcyBvZiBsb2NrIHRpbWVvdXRzKTsgd2UgZGVmZXIgdG8gdGhhdC5cbiAgICAgICAgaWYgKHJlcy5nZXRIZWFkZXJzKClbJ3N0cmlwZS1zaG91bGQtcmV0cnknXSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXMuZ2V0SGVhZGVycygpWydzdHJpcGUtc2hvdWxkLXJldHJ5J10gPT09ICd0cnVlJykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0cnkgb24gY29uZmxpY3QgZXJyb3JzLlxuICAgICAgICBpZiAocmVzLmdldFN0YXR1c0NvZGUoKSA9PT0gNDA5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXRyeSBvbiA1MDAsIDUwMywgYW5kIG90aGVyIGludGVybmFsIGVycm9ycy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGV4cGVjdCB0aGUgc3RyaXBlLXNob3VsZC1yZXRyeSBoZWFkZXIgdG8gYmUgZmFsc2VcbiAgICAgICAgLy8gaW4gbW9zdCBjYXNlcyB3aGVuIGEgNTAwIGlzIHJldHVybmVkLCBzaW5jZSBvdXIgaWRlbXBvdGVuY3kgZnJhbWV3b3JrXG4gICAgICAgIC8vIHdvdWxkIHR5cGljYWxseSByZXBsYXkgaXQgYW55d2F5LlxuICAgICAgICBpZiAocmVzLmdldFN0YXR1c0NvZGUoKSA+PSA1MDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX2dldFNsZWVwVGltZUluTVMobnVtUmV0cmllcywgcmV0cnlBZnRlciA9IG51bGwpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbE5ldHdvcmtSZXRyeURlbGF5ID0gdGhpcy5fc3RyaXBlLmdldEluaXRpYWxOZXR3b3JrUmV0cnlEZWxheSgpO1xuICAgICAgICBjb25zdCBtYXhOZXR3b3JrUmV0cnlEZWxheSA9IHRoaXMuX3N0cmlwZS5nZXRNYXhOZXR3b3JrUmV0cnlEZWxheSgpO1xuICAgICAgICAvLyBBcHBseSBleHBvbmVudGlhbCBiYWNrb2ZmIHdpdGggaW5pdGlhbE5ldHdvcmtSZXRyeURlbGF5IG9uIHRoZVxuICAgICAgICAvLyBudW1iZXIgb2YgbnVtUmV0cmllcyBzbyBmYXIgYXMgaW5wdXRzLiBEbyBub3QgYWxsb3cgdGhlIG51bWJlciB0byBleGNlZWRcbiAgICAgICAgLy8gbWF4TmV0d29ya1JldHJ5RGVsYXkuXG4gICAgICAgIGxldCBzbGVlcFNlY29uZHMgPSBNYXRoLm1pbihpbml0aWFsTmV0d29ya1JldHJ5RGVsYXkgKiBNYXRoLnBvdyhudW1SZXRyaWVzIC0gMSwgMiksIG1heE5ldHdvcmtSZXRyeURlbGF5KTtcbiAgICAgICAgLy8gQXBwbHkgc29tZSBqaXR0ZXIgYnkgcmFuZG9taXppbmcgdGhlIHZhbHVlIGluIHRoZSByYW5nZSBvZlxuICAgICAgICAvLyAoc2xlZXBTZWNvbmRzIC8gMikgdG8gKHNsZWVwU2Vjb25kcykuXG4gICAgICAgIHNsZWVwU2Vjb25kcyAqPSAwLjUgKiAoMSArIE1hdGgucmFuZG9tKCkpO1xuICAgICAgICAvLyBCdXQgbmV2ZXIgc2xlZXAgbGVzcyB0aGFuIHRoZSBiYXNlIHNsZWVwIHNlY29uZHMuXG4gICAgICAgIHNsZWVwU2Vjb25kcyA9IE1hdGgubWF4KGluaXRpYWxOZXR3b3JrUmV0cnlEZWxheSwgc2xlZXBTZWNvbmRzKTtcbiAgICAgICAgLy8gQW5kIG5ldmVyIHNsZWVwIGxlc3MgdGhhbiB0aGUgdGltZSB0aGUgQVBJIGFza3MgdXMgdG8gd2FpdCwgYXNzdW1pbmcgaXQncyBhIHJlYXNvbmFibGUgYXNrLlxuICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihyZXRyeUFmdGVyKSAmJiByZXRyeUFmdGVyIDw9IE1BWF9SRVRSWV9BRlRFUl9XQUlUKSB7XG4gICAgICAgICAgICBzbGVlcFNlY29uZHMgPSBNYXRoLm1heChzbGVlcFNlY29uZHMsIHJldHJ5QWZ0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbGVlcFNlY29uZHMgKiAxMDAwO1xuICAgIH1cbiAgICAvLyBNYXggcmV0cmllcyBjYW4gYmUgc2V0IG9uIGEgcGVyIHJlcXVlc3QgYmFzaXMuIEZhdm9yIHRob3NlIG92ZXIgdGhlIGdsb2JhbCBzZXR0aW5nXG4gICAgX2dldE1heE5ldHdvcmtSZXRyaWVzKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzLm1heE5ldHdvcmtSZXRyaWVzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIE51bWJlci5pc0ludGVnZXIoc2V0dGluZ3MubWF4TmV0d29ya1JldHJpZXMpXG4gICAgICAgICAgICA/IHNldHRpbmdzLm1heE5ldHdvcmtSZXRyaWVzXG4gICAgICAgICAgICA6IHRoaXMuX3N0cmlwZS5nZXRNYXhOZXR3b3JrUmV0cmllcygpO1xuICAgIH1cbiAgICBfZGVmYXVsdElkZW1wb3RlbmN5S2V5KG1ldGhvZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIFBPU1QgYW5kIHdlIGFsbG93IG11bHRpcGxlIHJldHJpZXMsIGVuc3VyZSBhbiBpZGVtcG90ZW5jeSBrZXkuXG4gICAgICAgIGNvbnN0IG1heFJldHJpZXMgPSB0aGlzLl9nZXRNYXhOZXR3b3JrUmV0cmllcyhzZXR0aW5ncyk7XG4gICAgICAgIGlmIChtZXRob2QgPT09ICdQT1NUJyAmJiBtYXhSZXRyaWVzID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGBzdHJpcGUtbm9kZS1yZXRyeS0ke3RoaXMuX3N0cmlwZS5fcGxhdGZvcm1GdW5jdGlvbnMudXVpZDQoKX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBfbWFrZUhlYWRlcnMoYXV0aCwgY29udGVudExlbmd0aCwgYXBpVmVyc2lvbiwgY2xpZW50VXNlckFnZW50LCBtZXRob2QsIHVzZXJTdXBwbGllZEhlYWRlcnMsIHVzZXJTdXBwbGllZFNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgICAgLy8gVXNlIHNwZWNpZmllZCBhdXRoIHRva2VuIG9yIHVzZSBkZWZhdWx0IGZyb20gdGhpcyBzdHJpcGUgaW5zdGFuY2U6XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiBhdXRoID8gYEJlYXJlciAke2F1dGh9YCA6IHRoaXMuX3N0cmlwZS5nZXRBcGlGaWVsZCgnYXV0aCcpLFxuICAgICAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAnVXNlci1BZ2VudCc6IHRoaXMuX2dldFVzZXJBZ2VudFN0cmluZygpLFxuICAgICAgICAgICAgJ1gtU3RyaXBlLUNsaWVudC1Vc2VyLUFnZW50JzogY2xpZW50VXNlckFnZW50LFxuICAgICAgICAgICAgJ1gtU3RyaXBlLUNsaWVudC1UZWxlbWV0cnknOiB0aGlzLl9nZXRUZWxlbWV0cnlIZWFkZXIoKSxcbiAgICAgICAgICAgICdTdHJpcGUtVmVyc2lvbic6IGFwaVZlcnNpb24sXG4gICAgICAgICAgICAnU3RyaXBlLUFjY291bnQnOiB0aGlzLl9zdHJpcGUuZ2V0QXBpRmllbGQoJ3N0cmlwZUFjY291bnQnKSxcbiAgICAgICAgICAgICdJZGVtcG90ZW5jeS1LZXknOiB0aGlzLl9kZWZhdWx0SWRlbXBvdGVuY3lLZXkobWV0aG9kLCB1c2VyU3VwcGxpZWRTZXR0aW5ncyksXG4gICAgICAgIH07XG4gICAgICAgIC8vIEFzIHBlciBodHRwczovL2RhdGF0cmFja2VyLmlldGYub3JnL2RvYy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjMuMjpcbiAgICAgICAgLy8gICBBIHVzZXIgYWdlbnQgU0hPVUxEIHNlbmQgYSBDb250ZW50LUxlbmd0aCBpbiBhIHJlcXVlc3QgbWVzc2FnZSB3aGVuXG4gICAgICAgIC8vICAgbm8gVHJhbnNmZXItRW5jb2RpbmcgaXMgc2VudCBhbmQgdGhlIHJlcXVlc3QgbWV0aG9kIGRlZmluZXMgYSBtZWFuaW5nXG4gICAgICAgIC8vICAgZm9yIGFuIGVuY2xvc2VkIHBheWxvYWQgYm9keS4gIEZvciBleGFtcGxlLCBhIENvbnRlbnQtTGVuZ3RoIGhlYWRlclxuICAgICAgICAvLyAgIGZpZWxkIGlzIG5vcm1hbGx5IHNlbnQgaW4gYSBQT1NUIHJlcXVlc3QgZXZlbiB3aGVuIHRoZSB2YWx1ZSBpcyAwXG4gICAgICAgIC8vICAgKGluZGljYXRpbmcgYW4gZW1wdHkgcGF5bG9hZCBib2R5KS4gIEEgdXNlciBhZ2VudCBTSE9VTEQgTk9UIHNlbmQgYVxuICAgICAgICAvLyAgIENvbnRlbnQtTGVuZ3RoIGhlYWRlciBmaWVsZCB3aGVuIHRoZSByZXF1ZXN0IG1lc3NhZ2UgZG9lcyBub3QgY29udGFpblxuICAgICAgICAvLyAgIGEgcGF5bG9hZCBib2R5IGFuZCB0aGUgbWV0aG9kIHNlbWFudGljcyBkbyBub3QgYW50aWNpcGF0ZSBzdWNoIGFcbiAgICAgICAgLy8gICBib2R5LlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVzZSBtZXRob2QgdHlwZXMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYm9kaWVzIGFuZCBzbyB3ZSBzaG91bGQgYWx3YXlzXG4gICAgICAgIC8vIGluY2x1ZGUgYSBDb250ZW50LUxlbmd0aC5cbiAgICAgICAgY29uc3QgbWV0aG9kSGFzUGF5bG9hZCA9IG1ldGhvZCA9PSAnUE9TVCcgfHwgbWV0aG9kID09ICdQVVQnIHx8IG1ldGhvZCA9PSAnUEFUQ0gnO1xuICAgICAgICAvLyBJZiBhIGNvbnRlbnQgbGVuZ3RoIHdhcyBzcGVjaWZpZWQsIHdlIGFsd2F5cyBpbmNsdWRlIGl0IHJlZ2FyZGxlc3Mgb2ZcbiAgICAgICAgLy8gd2hldGhlciB0aGUgbWV0aG9kIHNlbWFudGljcyBhbnRpY2lwYXRlIHN1Y2ggYSBib2R5LiBUaGlzIGtlZXBzIHVzXG4gICAgICAgIC8vIGNvbnNpc3RlbnQgd2l0aCBoaXN0b3JpY2FsIGJlaGF2aW9yLiBXZSBkbyBob3dldmVyIHdhbnQgdG8gd2FybiBvbiB0aGlzXG4gICAgICAgIC8vIGFuZCBmaXggdGhlc2UgY2FzZXMgYXMgdGhleSBhcmUgc2VtYW50aWNhbGx5IGluY29ycmVjdC5cbiAgICAgICAgaWYgKG1ldGhvZEhhc1BheWxvYWQgfHwgY29udGVudExlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFtZXRob2RIYXNQYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgZW1pdFdhcm5pbmcoYCR7bWV0aG9kfSBtZXRob2QgaGFkIG5vbi16ZXJvIGNvbnRlbnRMZW5ndGggYnV0IG5vIHBheWxvYWQgaXMgZXhwZWN0ZWQgZm9yIHRoaXMgdmVyYmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdEhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBjb250ZW50TGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHJlbW92ZU51bGxpc2goZGVmYXVsdEhlYWRlcnMpLCBcbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgc3VwcGxpZWQsIHNheSAnaWRlbXBvdGVuY3kta2V5Jywgb3ZlcnJpZGUgaW5zdGVhZCBvZiBhcHBlbmRpbmcgYnkgZW5zdXJpbmcgY2FwcyBhcmUgdGhlIHNhbWUuXG4gICAgICAgIG5vcm1hbGl6ZUhlYWRlcnModXNlclN1cHBsaWVkSGVhZGVycykpO1xuICAgIH1cbiAgICBfZ2V0VXNlckFnZW50U3RyaW5nKCkge1xuICAgICAgICBjb25zdCBwYWNrYWdlVmVyc2lvbiA9IHRoaXMuX3N0cmlwZS5nZXRDb25zdGFudCgnUEFDS0FHRV9WRVJTSU9OJyk7XG4gICAgICAgIGNvbnN0IGFwcEluZm8gPSB0aGlzLl9zdHJpcGUuX2FwcEluZm9cbiAgICAgICAgICAgID8gdGhpcy5fc3RyaXBlLmdldEFwcEluZm9Bc1N0cmluZygpXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICByZXR1cm4gYFN0cmlwZS92MSBOb2RlQmluZGluZ3MvJHtwYWNrYWdlVmVyc2lvbn0gJHthcHBJbmZvfWAudHJpbSgpO1xuICAgIH1cbiAgICBfZ2V0VGVsZW1ldHJ5SGVhZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5fc3RyaXBlLmdldFRlbGVtZXRyeUVuYWJsZWQoKSAmJlxuICAgICAgICAgICAgdGhpcy5fc3RyaXBlLl9wcmV2UmVxdWVzdE1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbWV0cmljcyA9IHRoaXMuX3N0cmlwZS5fcHJldlJlcXVlc3RNZXRyaWNzLnNoaWZ0KCk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGxhc3RfcmVxdWVzdF9tZXRyaWNzOiBtZXRyaWNzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3JlY29yZFJlcXVlc3RNZXRyaWNzKHJlcXVlc3RJZCwgcmVxdWVzdER1cmF0aW9uTXMsIHVzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdHJpcGUuZ2V0VGVsZW1ldHJ5RW5hYmxlZCgpICYmIHJlcXVlc3RJZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0cmlwZS5fcHJldlJlcXVlc3RNZXRyaWNzLmxlbmd0aCA+IHRoaXMuX21heEJ1ZmZlcmVkUmVxdWVzdE1ldHJpYykge1xuICAgICAgICAgICAgICAgIGVtaXRXYXJuaW5nKCdSZXF1ZXN0IG1ldHJpY3MgYnVmZmVyIGlzIGZ1bGwsIGRyb3BwaW5nIHRlbGVtZXRyeSBtZXNzYWdlLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF9pZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2R1cmF0aW9uX21zOiByZXF1ZXN0RHVyYXRpb25NcyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICh1c2FnZSAmJiB1c2FnZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG0udXNhZ2UgPSB1c2FnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyaXBlLl9wcmV2UmVxdWVzdE1ldHJpY3MucHVzaChtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfcmVxdWVzdChtZXRob2QsIGhvc3QsIHBhdGgsIGRhdGEsIGF1dGgsIG9wdGlvbnMgPSB7fSwgdXNhZ2UgPSBbXSwgY2FsbGJhY2ssIHJlcXVlc3REYXRhUHJvY2Vzc29yID0gbnVsbCkge1xuICAgICAgICBsZXQgcmVxdWVzdERhdGE7XG4gICAgICAgIGNvbnN0IHJldHJ5UmVxdWVzdCA9IChyZXF1ZXN0Rm4sIGFwaVZlcnNpb24sIGhlYWRlcnMsIHJlcXVlc3RSZXRyaWVzLCByZXRyeUFmdGVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChyZXF1ZXN0Rm4sIHRoaXMuX2dldFNsZWVwVGltZUluTVMocmVxdWVzdFJldHJpZXMsIHJldHJ5QWZ0ZXIpLCBhcGlWZXJzaW9uLCBoZWFkZXJzLCByZXF1ZXN0UmV0cmllcyArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYWtlUmVxdWVzdCA9IChhcGlWZXJzaW9uLCBoZWFkZXJzLCBudW1SZXRyaWVzKSA9PiB7XG4gICAgICAgICAgICAvLyB0aW1lb3V0IGNhbiBiZSBzZXQgb24gYSBwZXItcmVxdWVzdCBiYXNpcy4gRmF2b3IgdGhhdCBvdmVyIHRoZSBnbG9iYWwgc2V0dGluZ1xuICAgICAgICAgICAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMuc2V0dGluZ3MgJiZcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNldHRpbmdzLnRpbWVvdXQgJiZcbiAgICAgICAgICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMuc2V0dGluZ3MudGltZW91dCkgJiZcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNldHRpbmdzLnRpbWVvdXQgPj0gMFxuICAgICAgICAgICAgICAgID8gb3B0aW9ucy5zZXR0aW5ncy50aW1lb3V0XG4gICAgICAgICAgICAgICAgOiB0aGlzLl9zdHJpcGUuZ2V0QXBpRmllbGQoJ3RpbWVvdXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHRoaXMuX3N0cmlwZVxuICAgICAgICAgICAgICAgIC5nZXRBcGlGaWVsZCgnaHR0cENsaWVudCcpXG4gICAgICAgICAgICAgICAgLm1ha2VSZXF1ZXN0KGhvc3QgfHwgdGhpcy5fc3RyaXBlLmdldEFwaUZpZWxkKCdob3N0JyksIHRoaXMuX3N0cmlwZS5nZXRBcGlGaWVsZCgncG9ydCcpLCBwYXRoLCBtZXRob2QsIGhlYWRlcnMsIHJlcXVlc3REYXRhLCB0aGlzLl9zdHJpcGUuZ2V0QXBpRmllbGQoJ3Byb3RvY29sJyksIHRpbWVvdXQpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0RXZlbnQgPSByZW1vdmVOdWxsaXNoKHtcbiAgICAgICAgICAgICAgICBhcGlfdmVyc2lvbjogYXBpVmVyc2lvbixcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBoZWFkZXJzWydTdHJpcGUtQWNjb3VudCddLFxuICAgICAgICAgICAgICAgIGlkZW1wb3RlbmN5X2tleTogaGVhZGVyc1snSWRlbXBvdGVuY3ktS2V5J10sXG4gICAgICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgcmVxdWVzdF9zdGFydF90aW1lOiByZXF1ZXN0U3RhcnRUaW1lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0UmV0cmllcyA9IG51bVJldHJpZXMgfHwgMDtcbiAgICAgICAgICAgIGNvbnN0IG1heFJldHJpZXMgPSB0aGlzLl9nZXRNYXhOZXR3b3JrUmV0cmllcyhvcHRpb25zLnNldHRpbmdzIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuX3N0cmlwZS5fZW1pdHRlci5lbWl0KCdyZXF1ZXN0JywgcmVxdWVzdEV2ZW50KTtcbiAgICAgICAgICAgIHJlcVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoUmVxdWVzdFNlbmRlci5fc2hvdWxkUmV0cnkocmVzLCByZXF1ZXN0UmV0cmllcywgbWF4UmV0cmllcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHJ5UmVxdWVzdChtYWtlUmVxdWVzdCwgYXBpVmVyc2lvbiwgaGVhZGVycywgcmVxdWVzdFJldHJpZXMsIFxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHJlcy5nZXRIZWFkZXJzKClbJ3JldHJ5LWFmdGVyJ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zLnN0cmVhbWluZyAmJiByZXMuZ2V0U3RhdHVzQ29kZSgpIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdHJlYW1pbmdSZXNwb25zZUhhbmRsZXIocmVxdWVzdEV2ZW50LCB1c2FnZSwgY2FsbGJhY2spKHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fanNvblJlc3BvbnNlSGFuZGxlcihyZXF1ZXN0RXZlbnQsIHVzYWdlLCBjYWxsYmFjaykocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoUmVxdWVzdFNlbmRlci5fc2hvdWxkUmV0cnkobnVsbCwgcmVxdWVzdFJldHJpZXMsIG1heFJldHJpZXMsIGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0cnlSZXF1ZXN0KG1ha2VSZXF1ZXN0LCBhcGlWZXJzaW9uLCBoZWFkZXJzLCByZXF1ZXN0UmV0cmllcywgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1RpbWVvdXRFcnJvciA9IGVycm9yLmNvZGUgJiYgZXJyb3IuY29kZSA9PT0gSHR0cENsaWVudC5USU1FT1VUX0VSUk9SX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgU3RyaXBlQ29ubmVjdGlvbkVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlzVGltZW91dEVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgUmVxdWVzdCBhYm9ydGVkIGR1ZSB0byB0aW1lb3V0IGJlaW5nIHJlYWNoZWQgKCR7dGltZW91dH1tcylgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSZXF1ZXN0U2VuZGVyLl9nZW5lcmF0ZUNvbm5lY3Rpb25FcnJvck1lc3NhZ2UocmVxdWVzdFJldHJpZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBwcmVwYXJlQW5kTWFrZVJlcXVlc3QgPSAoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0RGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLl9zdHJpcGUuZ2V0Q2xpZW50VXNlckFnZW50KChjbGllbnRVc2VyQWdlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFwaVZlcnNpb24gPSB0aGlzLl9zdHJpcGUuZ2V0QXBpRmllbGQoJ3ZlcnNpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5fbWFrZUhlYWRlcnMoYXV0aCwgcmVxdWVzdERhdGEubGVuZ3RoLCBhcGlWZXJzaW9uLCBjbGllbnRVc2VyQWdlbnQsIG1ldGhvZCwgKF9hID0gb3B0aW9ucy5oZWFkZXJzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsLCAoX2IgPSBvcHRpb25zLnNldHRpbmdzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fSk7XG4gICAgICAgICAgICAgICAgbWFrZVJlcXVlc3QoYXBpVmVyc2lvbiwgaGVhZGVycywgMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlcXVlc3REYXRhUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICByZXF1ZXN0RGF0YVByb2Nlc3NvcihtZXRob2QsIGRhdGEsIG9wdGlvbnMuaGVhZGVycywgcHJlcGFyZUFuZE1ha2VSZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByZXBhcmVBbmRNYWtlUmVxdWVzdChudWxsLCBzdHJpbmdpZnlSZXF1ZXN0RGF0YShkYXRhIHx8IHt9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgU3RyaXBlRXJyb3IsIFN0cmlwZVNpZ25hdHVyZVZlcmlmaWNhdGlvbkVycm9yIH0gZnJvbSAnLi9FcnJvci5qcyc7XG5pbXBvcnQgeyBDcnlwdG9Qcm92aWRlck9ubHlTdXBwb3J0c0FzeW5jRXJyb3IsIH0gZnJvbSAnLi9jcnlwdG8vQ3J5cHRvUHJvdmlkZXIuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlYmhvb2tzKHBsYXRmb3JtRnVuY3Rpb25zKSB7XG4gICAgY29uc3QgV2ViaG9vayA9IHtcbiAgICAgICAgREVGQVVMVF9UT0xFUkFOQ0U6IDMwMCxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzaWduYXR1cmU6IG51bGwsXG4gICAgICAgIGNvbnN0cnVjdEV2ZW50KHBheWxvYWQsIGhlYWRlciwgc2VjcmV0LCB0b2xlcmFuY2UsIGNyeXB0b1Byb3ZpZGVyLCByZWNlaXZlZEF0KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlLnZlcmlmeUhlYWRlcihwYXlsb2FkLCBoZWFkZXIsIHNlY3JldCwgdG9sZXJhbmNlIHx8IFdlYmhvb2suREVGQVVMVF9UT0xFUkFOQ0UsIGNyeXB0b1Byb3ZpZGVyLCByZWNlaXZlZEF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBDcnlwdG9Qcm92aWRlck9ubHlTdXBwb3J0c0FzeW5jRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5tZXNzYWdlICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxuVXNlIGBhd2FpdCBjb25zdHJ1Y3RFdmVudEFzeW5jKC4uLilgIGluc3RlYWQgb2YgYGNvbnN0cnVjdEV2ZW50KC4uLilgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGpzb25QYXlsb2FkID0gcGF5bG9hZCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXlcbiAgICAgICAgICAgICAgICA/IEpTT04ucGFyc2UobmV3IFRleHREZWNvZGVyKCd1dGY4JykuZGVjb2RlKHBheWxvYWQpKVxuICAgICAgICAgICAgICAgIDogSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybiBqc29uUGF5bG9hZDtcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgY29uc3RydWN0RXZlbnRBc3luYyhwYXlsb2FkLCBoZWFkZXIsIHNlY3JldCwgdG9sZXJhbmNlLCBjcnlwdG9Qcm92aWRlciwgcmVjZWl2ZWRBdCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zaWduYXR1cmUudmVyaWZ5SGVhZGVyQXN5bmMocGF5bG9hZCwgaGVhZGVyLCBzZWNyZXQsIHRvbGVyYW5jZSB8fCBXZWJob29rLkRFRkFVTFRfVE9MRVJBTkNFLCBjcnlwdG9Qcm92aWRlciwgcmVjZWl2ZWRBdCk7XG4gICAgICAgICAgICBjb25zdCBqc29uUGF5bG9hZCA9IHBheWxvYWQgaW5zdGFuY2VvZiBVaW50OEFycmF5XG4gICAgICAgICAgICAgICAgPyBKU09OLnBhcnNlKG5ldyBUZXh0RGVjb2RlcigndXRmOCcpLmRlY29kZShwYXlsb2FkKSlcbiAgICAgICAgICAgICAgICA6IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm4ganNvblBheWxvYWQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYSBoZWFkZXIgdG8gYmUgdXNlZCBmb3Igd2ViaG9vayBtb2NraW5nXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlZGVmIHtvYmplY3R9IG9wdHNcbiAgICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbWVzdGFtcCAtIFRpbWVzdGFtcCBvZiB0aGUgaGVhZGVyLiBEZWZhdWx0cyB0byBEYXRlLm5vdygpXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXlsb2FkIC0gSlNPTiBzdHJpbmdpZmllZCBwYXlsb2FkIG9iamVjdCwgY29udGFpbmluZyB0aGUgJ2lkJyBhbmQgJ29iamVjdCcgcGFyYW1ldGVyc1xuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gc2VjcmV0IC0gU3RyaXBlIHdlYmhvb2sgc2VjcmV0ICd3aHNlY18uLi4nXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzY2hlbWUgLSBWZXJzaW9uIG9mIEFQSSB0byBoaXQuIERlZmF1bHRzIHRvICd2MScuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzaWduYXR1cmUgLSBDb21wdXRlZCB3ZWJob29rIHNpZ25hdHVyZVxuICAgICAgICAgKiBAcHJvcGVydHkge0NyeXB0b1Byb3ZpZGVyfSBjcnlwdG9Qcm92aWRlciAtIENyeXB0byBwcm92aWRlciB0byB1c2UgZm9yIGNvbXB1dGluZyB0aGUgc2lnbmF0dXJlIGlmIG5vbmUgd2FzIHByb3ZpZGVkLiBEZWZhdWx0cyB0byBOb2RlQ3J5cHRvUHJvdmlkZXIuXG4gICAgICAgICAqL1xuICAgICAgICBnZW5lcmF0ZVRlc3RIZWFkZXJTdHJpbmc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgICAgICBpZiAoIW9wdHMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RyaXBlRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnT3B0aW9ucyBhcmUgcmVxdWlyZWQnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0cy50aW1lc3RhbXAgPVxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3Iob3B0cy50aW1lc3RhbXApIHx8IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICAgICAgICAgICAgb3B0cy5zY2hlbWUgPSBvcHRzLnNjaGVtZSB8fCBzaWduYXR1cmUuRVhQRUNURURfU0NIRU1FO1xuICAgICAgICAgICAgb3B0cy5jcnlwdG9Qcm92aWRlciA9IG9wdHMuY3J5cHRvUHJvdmlkZXIgfHwgZ2V0Q3J5cHRvUHJvdmlkZXIoKTtcbiAgICAgICAgICAgIG9wdHMuc2lnbmF0dXJlID1cbiAgICAgICAgICAgICAgICBvcHRzLnNpZ25hdHVyZSB8fFxuICAgICAgICAgICAgICAgICAgICBvcHRzLmNyeXB0b1Byb3ZpZGVyLmNvbXB1dGVITUFDU2lnbmF0dXJlKG9wdHMudGltZXN0YW1wICsgJy4nICsgb3B0cy5wYXlsb2FkLCBvcHRzLnNlY3JldCk7XG4gICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRIZWFkZXIgPSBbXG4gICAgICAgICAgICAgICAgJ3Q9JyArIG9wdHMudGltZXN0YW1wLFxuICAgICAgICAgICAgICAgIG9wdHMuc2NoZW1lICsgJz0nICsgb3B0cy5zaWduYXR1cmUsXG4gICAgICAgICAgICBdLmpvaW4oJywnKTtcbiAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZWRIZWFkZXI7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSB7XG4gICAgICAgIEVYUEVDVEVEX1NDSEVNRTogJ3YxJyxcbiAgICAgICAgdmVyaWZ5SGVhZGVyKGVuY29kZWRQYXlsb2FkLCBlbmNvZGVkSGVhZGVyLCBzZWNyZXQsIHRvbGVyYW5jZSwgY3J5cHRvUHJvdmlkZXIsIHJlY2VpdmVkQXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZGVjb2RlZEhlYWRlcjogaGVhZGVyLCBkZWNvZGVkUGF5bG9hZDogcGF5bG9hZCwgZGV0YWlscywgc3VzcGVjdFBheWxvYWRUeXBlLCB9ID0gcGFyc2VFdmVudERldGFpbHMoZW5jb2RlZFBheWxvYWQsIGVuY29kZWRIZWFkZXIsIHRoaXMuRVhQRUNURURfU0NIRU1FKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY3JldENvbnRhaW5zV2hpdGVzcGFjZSA9IC9cXHMvLnRlc3Qoc2VjcmV0KTtcbiAgICAgICAgICAgIGNyeXB0b1Byb3ZpZGVyID0gY3J5cHRvUHJvdmlkZXIgfHwgZ2V0Q3J5cHRvUHJvdmlkZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkU2lnbmF0dXJlID0gY3J5cHRvUHJvdmlkZXIuY29tcHV0ZUhNQUNTaWduYXR1cmUobWFrZUhNQUNDb250ZW50KHBheWxvYWQsIGRldGFpbHMpLCBzZWNyZXQpO1xuICAgICAgICAgICAgdmFsaWRhdGVDb21wdXRlZFNpZ25hdHVyZShwYXlsb2FkLCBoZWFkZXIsIGRldGFpbHMsIGV4cGVjdGVkU2lnbmF0dXJlLCB0b2xlcmFuY2UsIHN1c3BlY3RQYXlsb2FkVHlwZSwgc2VjcmV0Q29udGFpbnNXaGl0ZXNwYWNlLCByZWNlaXZlZEF0KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBhc3luYyB2ZXJpZnlIZWFkZXJBc3luYyhlbmNvZGVkUGF5bG9hZCwgZW5jb2RlZEhlYWRlciwgc2VjcmV0LCB0b2xlcmFuY2UsIGNyeXB0b1Byb3ZpZGVyLCByZWNlaXZlZEF0KSB7XG4gICAgICAgICAgICBjb25zdCB7IGRlY29kZWRIZWFkZXI6IGhlYWRlciwgZGVjb2RlZFBheWxvYWQ6IHBheWxvYWQsIGRldGFpbHMsIHN1c3BlY3RQYXlsb2FkVHlwZSwgfSA9IHBhcnNlRXZlbnREZXRhaWxzKGVuY29kZWRQYXlsb2FkLCBlbmNvZGVkSGVhZGVyLCB0aGlzLkVYUEVDVEVEX1NDSEVNRSk7XG4gICAgICAgICAgICBjb25zdCBzZWNyZXRDb250YWluc1doaXRlc3BhY2UgPSAvXFxzLy50ZXN0KHNlY3JldCk7XG4gICAgICAgICAgICBjcnlwdG9Qcm92aWRlciA9IGNyeXB0b1Byb3ZpZGVyIHx8IGdldENyeXB0b1Byb3ZpZGVyKCk7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZFNpZ25hdHVyZSA9IGF3YWl0IGNyeXB0b1Byb3ZpZGVyLmNvbXB1dGVITUFDU2lnbmF0dXJlQXN5bmMobWFrZUhNQUNDb250ZW50KHBheWxvYWQsIGRldGFpbHMpLCBzZWNyZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlQ29tcHV0ZWRTaWduYXR1cmUocGF5bG9hZCwgaGVhZGVyLCBkZXRhaWxzLCBleHBlY3RlZFNpZ25hdHVyZSwgdG9sZXJhbmNlLCBzdXNwZWN0UGF5bG9hZFR5cGUsIHNlY3JldENvbnRhaW5zV2hpdGVzcGFjZSwgcmVjZWl2ZWRBdCk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBmdW5jdGlvbiBtYWtlSE1BQ0NvbnRlbnQocGF5bG9hZCwgZGV0YWlscykge1xuICAgICAgICByZXR1cm4gYCR7ZGV0YWlscy50aW1lc3RhbXB9LiR7cGF5bG9hZH1gO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXJzZUV2ZW50RGV0YWlscyhlbmNvZGVkUGF5bG9hZCwgZW5jb2RlZEhlYWRlciwgZXhwZWN0ZWRTY2hlbWUpIHtcbiAgICAgICAgaWYgKCFlbmNvZGVkUGF5bG9hZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0cmlwZVNpZ25hdHVyZVZlcmlmaWNhdGlvbkVycm9yKGVuY29kZWRIZWFkZXIsIGVuY29kZWRQYXlsb2FkLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHdlYmhvb2sgcGF5bG9hZCB3YXMgcHJvdmlkZWQuJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1c3BlY3RQYXlsb2FkVHlwZSA9IHR5cGVvZiBlbmNvZGVkUGF5bG9hZCAhPSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgIShlbmNvZGVkUGF5bG9hZCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpO1xuICAgICAgICBjb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmOCcpO1xuICAgICAgICBjb25zdCBkZWNvZGVkUGF5bG9hZCA9IGVuY29kZWRQYXlsb2FkIGluc3RhbmNlb2YgVWludDhBcnJheVxuICAgICAgICAgICAgPyB0ZXh0RGVjb2Rlci5kZWNvZGUoZW5jb2RlZFBheWxvYWQpXG4gICAgICAgICAgICA6IGVuY29kZWRQYXlsb2FkO1xuICAgICAgICAvLyBFeHByZXNzJ3MgdHlwZSBmb3IgYFJlcXVlc3QjaGVhZGVyc2AgaXMgYHN0cmluZyB8IFtdc3RyaW5nYFxuICAgICAgICAvLyB3aGljaCBpcyBiZWNhdXNlIHRoZSBgc2V0LWNvb2tpZWAgaGVhZGVyIGlzIGFuIGFycmF5LFxuICAgICAgICAvLyBidXQgbm8gb3RoZXIgaGVhZGVycyBhcmUgYW4gYXJyYXkgKGRvY3M6IGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzKVxuICAgICAgICAvLyAoRXhwcmVzcydzIFJlcXVlc3QgY2xhc3MgaXMgYW4gZXh0ZW5zaW9uIG9mIGh0dHAuSW5jb21pbmdNZXNzYWdlLCBhbmQgZG9lc24ndCBhcHBlYXIgdG8gYmUgcmVsZXZhbnRseSBtb2RpZmllZDogaHR0cHM6Ly9naXRodWIuY29tL2V4cHJlc3Nqcy9leHByZXNzL2Jsb2IvbWFzdGVyL2xpYi9yZXF1ZXN0LmpzI0wzMSlcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW5jb2RlZEhlYWRlcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZDogQW4gYXJyYXkgd2FzIHBhc3NlZCBhcyBhIGhlYWRlciwgd2hpY2ggc2hvdWxkIG5vdCBiZSBwb3NzaWJsZSBmb3IgdGhlIHN0cmlwZS1zaWduYXR1cmUgaGVhZGVyLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmNvZGVkSGVhZGVyID09IG51bGwgfHwgZW5jb2RlZEhlYWRlciA9PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0cmlwZVNpZ25hdHVyZVZlcmlmaWNhdGlvbkVycm9yKGVuY29kZWRIZWFkZXIsIGVuY29kZWRQYXlsb2FkLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHN0cmlwZS1zaWduYXR1cmUgaGVhZGVyIHZhbHVlIHdhcyBwcm92aWRlZC4nLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVjb2RlZEhlYWRlciA9IGVuY29kZWRIZWFkZXIgaW5zdGFuY2VvZiBVaW50OEFycmF5XG4gICAgICAgICAgICA/IHRleHREZWNvZGVyLmRlY29kZShlbmNvZGVkSGVhZGVyKVxuICAgICAgICAgICAgOiBlbmNvZGVkSGVhZGVyO1xuICAgICAgICBjb25zdCBkZXRhaWxzID0gcGFyc2VIZWFkZXIoZGVjb2RlZEhlYWRlciwgZXhwZWN0ZWRTY2hlbWUpO1xuICAgICAgICBpZiAoIWRldGFpbHMgfHwgZGV0YWlscy50aW1lc3RhbXAgPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3RyaXBlU2lnbmF0dXJlVmVyaWZpY2F0aW9uRXJyb3IoZGVjb2RlZEhlYWRlciwgZGVjb2RlZFBheWxvYWQsIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIGV4dHJhY3QgdGltZXN0YW1wIGFuZCBzaWduYXR1cmVzIGZyb20gaGVhZGVyJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGV0YWlscy5zaWduYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0cmlwZVNpZ25hdHVyZVZlcmlmaWNhdGlvbkVycm9yKGRlY29kZWRIZWFkZXIsIGRlY29kZWRQYXlsb2FkLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHNpZ25hdHVyZXMgZm91bmQgd2l0aCBleHBlY3RlZCBzY2hlbWUnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlY29kZWRQYXlsb2FkLFxuICAgICAgICAgICAgZGVjb2RlZEhlYWRlcixcbiAgICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgICBzdXNwZWN0UGF5bG9hZFR5cGUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlQ29tcHV0ZWRTaWduYXR1cmUocGF5bG9hZCwgaGVhZGVyLCBkZXRhaWxzLCBleHBlY3RlZFNpZ25hdHVyZSwgdG9sZXJhbmNlLCBzdXNwZWN0UGF5bG9hZFR5cGUsIHNlY3JldENvbnRhaW5zV2hpdGVzcGFjZSwgcmVjZWl2ZWRBdCkge1xuICAgICAgICBjb25zdCBzaWduYXR1cmVGb3VuZCA9ICEhZGV0YWlscy5zaWduYXR1cmVzLmZpbHRlcihwbGF0Zm9ybUZ1bmN0aW9ucy5zZWN1cmVDb21wYXJlLmJpbmQocGxhdGZvcm1GdW5jdGlvbnMsIGV4cGVjdGVkU2lnbmF0dXJlKSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBkb2NzTG9jYXRpb24gPSAnXFxuTGVhcm4gbW9yZSBhYm91dCB3ZWJob29rIHNpZ25pbmcgYW5kIGV4cGxvcmUgd2ViaG9vayBpbnRlZ3JhdGlvbiBleGFtcGxlcyBmb3IgdmFyaW91cyBmcmFtZXdvcmtzIGF0ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGUjd2ViaG9vay1zaWduaW5nJztcbiAgICAgICAgY29uc3Qgd2hpdGVzcGFjZU1lc3NhZ2UgPSBzZWNyZXRDb250YWluc1doaXRlc3BhY2VcbiAgICAgICAgICAgID8gJ1xcblxcbk5vdGU6IFRoZSBwcm92aWRlZCBzaWduaW5nIHNlY3JldCBjb250YWlucyB3aGl0ZXNwYWNlLiBUaGlzIG9mdGVuIGluZGljYXRlcyBhbiBleHRyYSBuZXdsaW5lIG9yIHNwYWNlIGlzIGluIHRoZSB2YWx1ZSdcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIGlmICghc2lnbmF0dXJlRm91bmQpIHtcbiAgICAgICAgICAgIGlmIChzdXNwZWN0UGF5bG9hZFR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RyaXBlU2lnbmF0dXJlVmVyaWZpY2F0aW9uRXJyb3IoaGVhZGVyLCBwYXlsb2FkLCB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZWJob29rIHBheWxvYWQgbXVzdCBiZSBwcm92aWRlZCBhcyBhIHN0cmluZyBvciBhIEJ1ZmZlciAoaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9idWZmZXIuaHRtbCkgaW5zdGFuY2UgcmVwcmVzZW50aW5nIHRoZSBfcmF3XyByZXF1ZXN0IGJvZHkuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnUGF5bG9hZCB3YXMgcHJvdmlkZWQgYXMgYSBwYXJzZWQgSmF2YVNjcmlwdCBvYmplY3QgaW5zdGVhZC4gXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2lnbmF0dXJlIHZlcmlmaWNhdGlvbiBpcyBpbXBvc3NpYmxlIHdpdGhvdXQgYWNjZXNzIHRvIHRoZSBvcmlnaW5hbCBzaWduZWQgbWF0ZXJpYWwuIFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jc0xvY2F0aW9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlc3BhY2VNZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFN0cmlwZVNpZ25hdHVyZVZlcmlmaWNhdGlvbkVycm9yKGhlYWRlciwgcGF5bG9hZCwge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBzaWduYXR1cmVzIGZvdW5kIG1hdGNoaW5nIHRoZSBleHBlY3RlZCBzaWduYXR1cmUgZm9yIHBheWxvYWQuJyArXG4gICAgICAgICAgICAgICAgICAgICcgQXJlIHlvdSBwYXNzaW5nIHRoZSByYXcgcmVxdWVzdCBib2R5IHlvdSByZWNlaXZlZCBmcm9tIFN0cmlwZT8gXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgSWYgYSB3ZWJob29rIHJlcXVlc3QgaXMgYmVpbmcgZm9yd2FyZGVkIGJ5IGEgdGhpcmQtcGFydHkgdG9vbCwnICtcbiAgICAgICAgICAgICAgICAgICAgJyBlbnN1cmUgdGhhdCB0aGUgZXhhY3QgcmVxdWVzdCBib2R5LCBpbmNsdWRpbmcgSlNPTiBmb3JtYXR0aW5nIGFuZCBuZXcgbGluZSBzdHlsZSwgaXMgcHJlc2VydmVkLlxcbicgK1xuICAgICAgICAgICAgICAgICAgICBkb2NzTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlc3BhY2VNZXNzYWdlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGltZXN0YW1wQWdlID0gTWF0aC5mbG9vcigodHlwZW9mIHJlY2VpdmVkQXQgPT09ICdudW1iZXInID8gcmVjZWl2ZWRBdCA6IERhdGUubm93KCkpIC8gMTAwMCkgLSBkZXRhaWxzLnRpbWVzdGFtcDtcbiAgICAgICAgaWYgKHRvbGVyYW5jZSA+IDAgJiYgdGltZXN0YW1wQWdlID4gdG9sZXJhbmNlKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3RyaXBlU2lnbmF0dXJlVmVyaWZpY2F0aW9uRXJyb3IoaGVhZGVyLCBwYXlsb2FkLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1RpbWVzdGFtcCBvdXRzaWRlIHRoZSB0b2xlcmFuY2Ugem9uZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGFyc2VIZWFkZXIoaGVhZGVyLCBzY2hlbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBoZWFkZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVhZGVyLnNwbGl0KCcsJykucmVkdWNlKChhY2N1bSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga3YgPSBpdGVtLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICBpZiAoa3ZbMF0gPT09ICd0Jykge1xuICAgICAgICAgICAgICAgIGFjY3VtLnRpbWVzdGFtcCA9IHBhcnNlSW50KGt2WzFdLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa3ZbMF0gPT09IHNjaGVtZSkge1xuICAgICAgICAgICAgICAgIGFjY3VtLnNpZ25hdHVyZXMucHVzaChrdlsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjdW07XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRpbWVzdGFtcDogLTEsXG4gICAgICAgICAgICBzaWduYXR1cmVzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCB3ZWJob29rc0NyeXB0b1Byb3ZpZGVySW5zdGFuY2UgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIExhemlseSBpbnN0YW50aWF0ZSBhIENyeXB0b1Byb3ZpZGVyIGluc3RhbmNlLiBUaGlzIGlzIGEgc3RhdGVsZXNzIG9iamVjdFxuICAgICAqIHNvIGEgc2luZ2xldG9uIGNhbiBiZSB1c2VkIGhlcmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q3J5cHRvUHJvdmlkZXIoKSB7XG4gICAgICAgIGlmICghd2ViaG9va3NDcnlwdG9Qcm92aWRlckluc3RhbmNlKSB7XG4gICAgICAgICAgICB3ZWJob29rc0NyeXB0b1Byb3ZpZGVySW5zdGFuY2UgPSBwbGF0Zm9ybUZ1bmN0aW9ucy5jcmVhdGVEZWZhdWx0Q3J5cHRvUHJvdmlkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2ViaG9va3NDcnlwdG9Qcm92aWRlckluc3RhbmNlO1xuICAgIH1cbiAgICBXZWJob29rLnNpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICByZXR1cm4gV2ViaG9vaztcbn1cbiIsICJpbXBvcnQgKiBhcyBfRXJyb3IgZnJvbSAnLi9FcnJvci5qcyc7XG5pbXBvcnQgKiBhcyBhcGlWZXJzaW9uIGZyb20gJy4vYXBpVmVyc2lvbi5qcyc7XG5pbXBvcnQgKiBhcyByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMuanMnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cENsaWVudFJlc3BvbnNlIH0gZnJvbSAnLi9uZXQvSHR0cENsaWVudC5qcyc7XG5pbXBvcnQgeyBkZXRlcm1pbmVQcm9jZXNzVXNlckFnZW50UHJvcGVydGllcywgcGFzY2FsVG9DYW1lbENhc2UsIHZhbGlkYXRlSW50ZWdlciwgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IENyeXB0b1Byb3ZpZGVyIH0gZnJvbSAnLi9jcnlwdG8vQ3J5cHRvUHJvdmlkZXIuanMnO1xuaW1wb3J0IHsgUmVxdWVzdFNlbmRlciB9IGZyb20gJy4vUmVxdWVzdFNlbmRlci5qcyc7XG5pbXBvcnQgeyBTdHJpcGVSZXNvdXJjZSB9IGZyb20gJy4vU3RyaXBlUmVzb3VyY2UuanMnO1xuaW1wb3J0IHsgY3JlYXRlV2ViaG9va3MgfSBmcm9tICcuL1dlYmhvb2tzLmpzJztcbmNvbnN0IERFRkFVTFRfSE9TVCA9ICdhcGkuc3RyaXBlLmNvbSc7XG5jb25zdCBERUZBVUxUX1BPUlQgPSAnNDQzJztcbmNvbnN0IERFRkFVTFRfQkFTRV9QQVRIID0gJy92MS8nO1xuY29uc3QgREVGQVVMVF9BUElfVkVSU0lPTiA9IGFwaVZlcnNpb24uQXBpVmVyc2lvbjtcbmNvbnN0IERFRkFVTFRfVElNRU9VVCA9IDgwMDAwO1xuY29uc3QgTUFYX05FVFdPUktfUkVUUllfREVMQVlfU0VDID0gMjtcbmNvbnN0IElOSVRJQUxfTkVUV09SS19SRVRSWV9ERUxBWV9TRUMgPSAwLjU7XG5jb25zdCBBUFBfSU5GT19QUk9QRVJUSUVTID0gWyduYW1lJywgJ3ZlcnNpb24nLCAndXJsJywgJ3BhcnRuZXJfaWQnXTtcbmNvbnN0IEFMTE9XRURfQ09ORklHX1BST1BFUlRJRVMgPSBbXG4gICAgJ2FwaVZlcnNpb24nLFxuICAgICd0eXBlc2NyaXB0JyxcbiAgICAnbWF4TmV0d29ya1JldHJpZXMnLFxuICAgICdodHRwQWdlbnQnLFxuICAgICdodHRwQ2xpZW50JyxcbiAgICAndGltZW91dCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncHJvdG9jb2wnLFxuICAgICd0ZWxlbWV0cnknLFxuICAgICdhcHBJbmZvJyxcbiAgICAnc3RyaXBlQWNjb3VudCcsXG5dO1xuY29uc3QgZGVmYXVsdFJlcXVlc3RTZW5kZXJGYWN0b3J5ID0gKHN0cmlwZSkgPT4gbmV3IFJlcXVlc3RTZW5kZXIoc3RyaXBlLCBTdHJpcGVSZXNvdXJjZS5NQVhfQlVGRkVSRURfUkVRVUVTVF9NRVRSSUNTKTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHJpcGUocGxhdGZvcm1GdW5jdGlvbnMsIHJlcXVlc3RTZW5kZXIgPSBkZWZhdWx0UmVxdWVzdFNlbmRlckZhY3RvcnkpIHtcbiAgICBTdHJpcGUuUEFDS0FHRV9WRVJTSU9OID0gJzE0LjI1LjAnO1xuICAgIFN0cmlwZS5VU0VSX0FHRU5UID0gT2JqZWN0LmFzc2lnbih7IGJpbmRpbmdzX3ZlcnNpb246IFN0cmlwZS5QQUNLQUdFX1ZFUlNJT04sIGxhbmc6ICdub2RlJywgcHVibGlzaGVyOiAnc3RyaXBlJywgdW5hbWU6IG51bGwsIHR5cGVzY3JpcHQ6IGZhbHNlIH0sIGRldGVybWluZVByb2Nlc3NVc2VyQWdlbnRQcm9wZXJ0aWVzKCkpO1xuICAgIFN0cmlwZS5TdHJpcGVSZXNvdXJjZSA9IFN0cmlwZVJlc291cmNlO1xuICAgIFN0cmlwZS5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gICAgU3RyaXBlLkh0dHBDbGllbnQgPSBIdHRwQ2xpZW50O1xuICAgIFN0cmlwZS5IdHRwQ2xpZW50UmVzcG9uc2UgPSBIdHRwQ2xpZW50UmVzcG9uc2U7XG4gICAgU3RyaXBlLkNyeXB0b1Byb3ZpZGVyID0gQ3J5cHRvUHJvdmlkZXI7XG4gICAgLy8gUHJldmlvdXNseSBTdHJpcGUud2ViaG9va3Mgd2FzIGp1c3QgdGhlIGNyZWF0ZVdlYmhvb2tzKCkgZmFjdG9yeSBmdW5jdGlvblxuICAgIC8vIGhvd2V2ZXIgZ29pbmcgZm9yd2FyZCBpdCB3aWxsIGJlIGEgV2ViaG9va09iamVjdCBpbnN0YW5jZS4gVG8gbWFpbnRhaW5cbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBpdCBpcyBjdXJyZW50bHkgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgYWxzb1xuICAgIC8vIGNvbXBsaWVzIHRvIHRoZSBXZWJob29rT2JqZWN0IHNpZ25hdHVyZS4gVGhlIGZhY3RvcnkgZnVuY3Rpb24gc2lnbmF0dXJlXG4gICAgLy8gd2lsbCBiZSByZW1vdmVkIGFzIGEgYnJlYWtpbmcgY2hhbmdlIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGUvaXNzdWVzLzE5NTZcbiAgICBmdW5jdGlvbiBjcmVhdGVXZWJob29rc0RlZmF1bHQoZm5zID0gcGxhdGZvcm1GdW5jdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVdlYmhvb2tzKGZucyk7XG4gICAgfVxuICAgIFN0cmlwZS53ZWJob29rcyA9IE9iamVjdC5hc3NpZ24oY3JlYXRlV2ViaG9va3NEZWZhdWx0LCBjcmVhdGVXZWJob29rcyhwbGF0Zm9ybUZ1bmN0aW9ucykpO1xuICAgIGZ1bmN0aW9uIFN0cmlwZShrZXksIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTdHJpcGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0cmlwZShrZXksIGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLl9nZXRQcm9wc0Zyb21Db25maWcoY29uZmlnKTtcbiAgICAgICAgdGhpcy5fcGxhdGZvcm1GdW5jdGlvbnMgPSBwbGF0Zm9ybUZ1bmN0aW9ucztcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfZW1pdHRlcicsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLl9wbGF0Zm9ybUZ1bmN0aW9ucy5jcmVhdGVFbWl0dGVyKCksXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLlZFUlNJT04gPSBTdHJpcGUuUEFDS0FHRV9WRVJTSU9OO1xuICAgICAgICB0aGlzLm9uID0gdGhpcy5fZW1pdHRlci5vbi5iaW5kKHRoaXMuX2VtaXR0ZXIpO1xuICAgICAgICB0aGlzLm9uY2UgPSB0aGlzLl9lbWl0dGVyLm9uY2UuYmluZCh0aGlzLl9lbWl0dGVyKTtcbiAgICAgICAgdGhpcy5vZmYgPSB0aGlzLl9lbWl0dGVyLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcy5fZW1pdHRlcik7XG4gICAgICAgIGNvbnN0IGFnZW50ID0gcHJvcHMuaHR0cEFnZW50IHx8IG51bGw7XG4gICAgICAgIHRoaXMuX2FwaSA9IHtcbiAgICAgICAgICAgIGF1dGg6IG51bGwsXG4gICAgICAgICAgICBob3N0OiBwcm9wcy5ob3N0IHx8IERFRkFVTFRfSE9TVCxcbiAgICAgICAgICAgIHBvcnQ6IHByb3BzLnBvcnQgfHwgREVGQVVMVF9QT1JULFxuICAgICAgICAgICAgcHJvdG9jb2w6IHByb3BzLnByb3RvY29sIHx8ICdodHRwcycsXG4gICAgICAgICAgICBiYXNlUGF0aDogREVGQVVMVF9CQVNFX1BBVEgsXG4gICAgICAgICAgICB2ZXJzaW9uOiBwcm9wcy5hcGlWZXJzaW9uIHx8IERFRkFVTFRfQVBJX1ZFUlNJT04sXG4gICAgICAgICAgICB0aW1lb3V0OiB2YWxpZGF0ZUludGVnZXIoJ3RpbWVvdXQnLCBwcm9wcy50aW1lb3V0LCBERUZBVUxUX1RJTUVPVVQpLFxuICAgICAgICAgICAgbWF4TmV0d29ya1JldHJpZXM6IHZhbGlkYXRlSW50ZWdlcignbWF4TmV0d29ya1JldHJpZXMnLCBwcm9wcy5tYXhOZXR3b3JrUmV0cmllcywgMSksXG4gICAgICAgICAgICBhZ2VudDogYWdlbnQsXG4gICAgICAgICAgICBodHRwQ2xpZW50OiBwcm9wcy5odHRwQ2xpZW50IHx8XG4gICAgICAgICAgICAgICAgKGFnZW50XG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5fcGxhdGZvcm1GdW5jdGlvbnMuY3JlYXRlTm9kZUh0dHBDbGllbnQoYWdlbnQpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5fcGxhdGZvcm1GdW5jdGlvbnMuY3JlYXRlRGVmYXVsdEh0dHBDbGllbnQoKSksXG4gICAgICAgICAgICBkZXY6IGZhbHNlLFxuICAgICAgICAgICAgc3RyaXBlQWNjb3VudDogcHJvcHMuc3RyaXBlQWNjb3VudCB8fCBudWxsLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0eXBlc2NyaXB0ID0gcHJvcHMudHlwZXNjcmlwdCB8fCBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVzY3JpcHQgIT09IFN0cmlwZS5VU0VSX0FHRU5ULnR5cGVzY3JpcHQpIHtcbiAgICAgICAgICAgIC8vIFRoZSBtdXRhdGlvbiBoZXJlIGlzIHVuY29tZm9ydGFibGUsIGJ1dCBsaWtlbHkgZmFzdGVzdDtcbiAgICAgICAgICAgIC8vIHNlcmlhbGl6aW5nIHRoZSB1c2VyIGFnZW50IGludm9sdmVzIHNoZWxsaW5nIG91dCB0byB0aGUgc3lzdGVtLFxuICAgICAgICAgICAgLy8gYW5kIGdpdmVuIHNvbWUgdXNlcnMgbWF5IGluc3RhbnRpYXRlIHRoZSBsaWJyYXJ5IG1hbnkgdGltZXMgd2l0aG91dCBzd2l0Y2hpbmcgYmV0d2VlbiBUUyBhbmQgbm9uLVRTLFxuICAgICAgICAgICAgLy8gd2Ugb25seSB3YW50IHRvIGluY3VyIHRoZSBwZXJmb3JtYW5jZSBoaXQgd2hlbiB0aGF0IGFjdHVhbGx5IGhhcHBlbnMuXG4gICAgICAgICAgICBTdHJpcGUuVVNFUl9BR0VOVC50eXBlc2NyaXB0ID0gdHlwZXNjcmlwdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHMuYXBwSW5mbykge1xuICAgICAgICAgICAgdGhpcy5fc2V0QXBwSW5mbyhwcm9wcy5hcHBJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmVwUmVzb3VyY2VzKCk7XG4gICAgICAgIHRoaXMuX3NldEFwaUtleShrZXkpO1xuICAgICAgICB0aGlzLmVycm9ycyA9IF9FcnJvcjtcbiAgICAgICAgLy8gT25jZSBTdHJpcGUud2ViaG9va3MgbG9vc2VzIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHNpZ25hdHVyZSBpbiBhIGZ1dHVyZSByZWxlYXNlXG4gICAgICAgIC8vIHRoZW4gdGhpcyBzaG91bGQgYmVjb21lIHRoaXMud2ViaG9va3MgPSBTdHJpcGUud2ViaG9va3NcbiAgICAgICAgdGhpcy53ZWJob29rcyA9IGNyZWF0ZVdlYmhvb2tzRGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9wcmV2UmVxdWVzdE1ldHJpY3MgPSBbXTtcbiAgICAgICAgdGhpcy5fZW5hYmxlVGVsZW1ldHJ5ID0gcHJvcHMudGVsZW1ldHJ5ICE9PSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdFNlbmRlciA9IHJlcXVlc3RTZW5kZXIodGhpcyk7XG4gICAgICAgIC8vIEV4cG9zZSBTdHJpcGVSZXNvdXJjZSBvbiB0aGUgaW5zdGFuY2UgdG9vXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5TdHJpcGVSZXNvdXJjZSA9IFN0cmlwZS5TdHJpcGVSZXNvdXJjZTtcbiAgICB9XG4gICAgU3RyaXBlLmVycm9ycyA9IF9FcnJvcjtcbiAgICBTdHJpcGUuY3JlYXRlTm9kZUh0dHBDbGllbnQgPSBwbGF0Zm9ybUZ1bmN0aW9ucy5jcmVhdGVOb2RlSHR0cENsaWVudDtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEhUVFAgY2xpZW50IGZvciBpc3N1aW5nIFN0cmlwZSBBUEkgcmVxdWVzdHMgd2hpY2ggdXNlcyB0aGUgV2ViXG4gICAgICogRmV0Y2ggQVBJLlxuICAgICAqXG4gICAgICogQSBmZXRjaCBmdW5jdGlvbiBjYW4gb3B0aW9uYWxseSBiZSBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXIuIElmIG5vbmUgaXNcbiAgICAgKiBwYXNzZWQsIHdpbGwgZGVmYXVsdCB0byB0aGUgZGVmYXVsdCBgZmV0Y2hgIGZ1bmN0aW9uIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gICAgICovXG4gICAgU3RyaXBlLmNyZWF0ZUZldGNoSHR0cENsaWVudCA9IHBsYXRmb3JtRnVuY3Rpb25zLmNyZWF0ZUZldGNoSHR0cENsaWVudDtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBDcnlwdG9Qcm92aWRlciB3aGljaCB1c2VzIHRoZSBidWlsdC1pbiBOb2RlIGNyeXB0byBsaWJyYXJpZXMgZm9yXG4gICAgICogaXRzIGNyeXB0byBvcGVyYXRpb25zLlxuICAgICAqL1xuICAgIFN0cmlwZS5jcmVhdGVOb2RlQ3J5cHRvUHJvdmlkZXIgPSBwbGF0Zm9ybUZ1bmN0aW9ucy5jcmVhdGVOb2RlQ3J5cHRvUHJvdmlkZXI7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIENyeXB0b1Byb3ZpZGVyIHdoaWNoIHVzZXMgdGhlIFN1YnRsZSBDcnlwdG8gQVBJIGZyb20gdGhlIFdlYlxuICAgICAqIENyeXB0byBBUEkgc3BlYyBmb3IgaXRzIGNyeXB0byBvcGVyYXRpb25zLlxuICAgICAqXG4gICAgICogQSBTdWJ0bGVDcnlwdG8gaW50ZXJmYWNlIGNhbiBvcHRpb25hbGx5IGJlIHBhc3NlZCBpbiBhcyBhIHBhcmFtZXRlci4gSWYgbm9uZVxuICAgICAqIGlzIHBhc3NlZCwgd2lsbCBkZWZhdWx0IHRvIHRoZSBkZWZhdWx0IGBjcnlwdG8uc3VidGxlYCBvYmplY3QgaW4gdGhlIGdsb2JhbFxuICAgICAqIHNjb3BlLlxuICAgICAqL1xuICAgIFN0cmlwZS5jcmVhdGVTdWJ0bGVDcnlwdG9Qcm92aWRlciA9XG4gICAgICAgIHBsYXRmb3JtRnVuY3Rpb25zLmNyZWF0ZVN1YnRsZUNyeXB0b1Byb3ZpZGVyO1xuICAgIFN0cmlwZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIC8vIFByb3BlcnRpZXMgYXJlIHNldCBpbiB0aGUgY29uc3RydWN0b3IgYWJvdmVcbiAgICAgICAgX2FwcEluZm86IHVuZGVmaW5lZCxcbiAgICAgICAgb246IG51bGwsXG4gICAgICAgIG9mZjogbnVsbCxcbiAgICAgICAgb25jZTogbnVsbCxcbiAgICAgICAgVkVSU0lPTjogbnVsbCxcbiAgICAgICAgU3RyaXBlUmVzb3VyY2U6IG51bGwsXG4gICAgICAgIHdlYmhvb2tzOiBudWxsLFxuICAgICAgICBlcnJvcnM6IG51bGwsXG4gICAgICAgIF9hcGk6IG51bGwsXG4gICAgICAgIF9wcmV2UmVxdWVzdE1ldHJpY3M6IG51bGwsXG4gICAgICAgIF9lbWl0dGVyOiBudWxsLFxuICAgICAgICBfZW5hYmxlVGVsZW1ldHJ5OiBudWxsLFxuICAgICAgICBfcmVxdWVzdFNlbmRlcjogbnVsbCxcbiAgICAgICAgX3BsYXRmb3JtRnVuY3Rpb25zOiBudWxsLFxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9zZXRBcGlLZXkoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0QXBpRmllbGQoJ2F1dGgnLCBgQmVhcmVyICR7a2V5fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogVGhpcyBtYXkgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKi9cbiAgICAgICAgX3NldEFwcEluZm8oaW5mbykge1xuICAgICAgICAgICAgaWYgKGluZm8gJiYgdHlwZW9mIGluZm8gIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcHBJbmZvIG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZm8gJiYgIWluZm8ubmFtZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXBwSW5mby5uYW1lIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmZvID0gaW5mbyB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuX2FwcEluZm8gPSBBUFBfSU5GT19QUk9QRVJUSUVTLnJlZHVjZSgoYWNjdW0sIHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGluZm9bcHJvcF0gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW0gPSBhY2N1bSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW1bcHJvcF0gPSBpbmZvW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW07XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHVuZGVmaW5lZCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBUaGlzIG1heSBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUuXG4gICAgICAgICAqL1xuICAgICAgICBfc2V0QXBpRmllbGQoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYXBpW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIFBsZWFzZSBvcGVuIG9yIHVwdm90ZSBhbiBpc3N1ZSBhdCBnaXRodWIuY29tL3N0cmlwZS9zdHJpcGUtbm9kZVxuICAgICAgICAgKiBpZiB5b3UgdXNlIHRoaXMsIGRldGFpbGluZyB5b3VyIHVzZS1jYXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCBtYXkgYmUgZGVwcmVjYXRlZCBhbmQgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QXBpRmllbGQoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXBpW2tleV07XG4gICAgICAgIH0sXG4gICAgICAgIHNldENsaWVudElkKGNsaWVudElkKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGllbnRJZCA9IGNsaWVudElkO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDbGllbnRJZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGllbnRJZDtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIFBsZWFzZSBvcGVuIG9yIHVwdm90ZSBhbiBpc3N1ZSBhdCBnaXRodWIuY29tL3N0cmlwZS9zdHJpcGUtbm9kZVxuICAgICAgICAgKiBpZiB5b3UgdXNlIHRoaXMsIGRldGFpbGluZyB5b3VyIHVzZS1jYXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCBtYXkgYmUgZGVwcmVjYXRlZCBhbmQgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q29uc3RhbnQ6IChjKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdERUZBVUxUX0hPU1QnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVGQVVMVF9IT1NUO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0RFRkFVTFRfUE9SVCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERUZBVUxUX1BPUlQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnREVGQVVMVF9CQVNFX1BBVEgnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVGQVVMVF9CQVNFX1BBVEg7XG4gICAgICAgICAgICAgICAgY2FzZSAnREVGQVVMVF9BUElfVkVSU0lPTic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERUZBVUxUX0FQSV9WRVJTSU9OO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0RFRkFVTFRfVElNRU9VVCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERUZBVUxUX1RJTUVPVVQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnTUFYX05FVFdPUktfUkVUUllfREVMQVlfU0VDJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1BWF9ORVRXT1JLX1JFVFJZX0RFTEFZX1NFQztcbiAgICAgICAgICAgICAgICBjYXNlICdJTklUSUFMX05FVFdPUktfUkVUUllfREVMQVlfU0VDJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOSVRJQUxfTkVUV09SS19SRVRSWV9ERUxBWV9TRUM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaXBlW2NdO1xuICAgICAgICB9LFxuICAgICAgICBnZXRNYXhOZXR3b3JrUmV0cmllcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFwaUZpZWxkKCdtYXhOZXR3b3JrUmV0cmllcycpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogVGhpcyBtYXkgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKi9cbiAgICAgICAgX3NldEFwaU51bWJlckZpZWxkKHByb3AsIG4sIGRlZmF1bHRWYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHZhbGlkYXRlSW50ZWdlcihwcm9wLCBuLCBkZWZhdWx0VmFsKTtcbiAgICAgICAgICAgIHRoaXMuX3NldEFwaUZpZWxkKHByb3AsIHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldE1heE5ldHdvcmtSZXRyeURlbGF5KCkge1xuICAgICAgICAgICAgcmV0dXJuIE1BWF9ORVRXT1JLX1JFVFJZX0RFTEFZX1NFQztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5pdGlhbE5ldHdvcmtSZXRyeURlbGF5KCkge1xuICAgICAgICAgICAgcmV0dXJuIElOSVRJQUxfTkVUV09SS19SRVRSWV9ERUxBWV9TRUM7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBQbGVhc2Ugb3BlbiBvciB1cHZvdGUgYW4gaXNzdWUgYXQgZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGVcbiAgICAgICAgICogaWYgeW91IHVzZSB0aGlzLCBkZXRhaWxpbmcgeW91ciB1c2UtY2FzZS5cbiAgICAgICAgICpcbiAgICAgICAgICogSXQgbWF5IGJlIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgICpcbiAgICAgICAgICogR2V0cyBhIEpTT04gdmVyc2lvbiBvZiBhIFVzZXItQWdlbnQgYW5kIHVzZXMgYSBjYWNoZWQgdmVyc2lvbiBmb3IgYSBzbGlnaHRcbiAgICAgICAgICogc3BlZWQgYWR2YW50YWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q2xpZW50VXNlckFnZW50KGNiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRVc2VyQWdlbnRTZWVkZWQoU3RyaXBlLlVTRVJfQUdFTlQsIGNiKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIFBsZWFzZSBvcGVuIG9yIHVwdm90ZSBhbiBpc3N1ZSBhdCBnaXRodWIuY29tL3N0cmlwZS9zdHJpcGUtbm9kZVxuICAgICAgICAgKiBpZiB5b3UgdXNlIHRoaXMsIGRldGFpbGluZyB5b3VyIHVzZS1jYXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCBtYXkgYmUgZGVwcmVjYXRlZCBhbmQgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBHZXRzIGEgSlNPTiB2ZXJzaW9uIG9mIGEgVXNlci1BZ2VudCBieSBlbmNvZGluZyBhIHNlZWRlZCBvYmplY3QgYW5kXG4gICAgICAgICAqIGZldGNoaW5nIGEgdW5hbWUgZnJvbSB0aGUgc3lzdGVtLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q2xpZW50VXNlckFnZW50U2VlZGVkKHNlZWQsIGNiKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF0Zm9ybUZ1bmN0aW9ucy5nZXRVbmFtZSgpLnRoZW4oKHVuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJBZ2VudCA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGQgaW4gc2VlZCkge1xuICAgICAgICAgICAgICAgICAgICB1c2VyQWdlbnRbZmllbGRdID0gZW5jb2RlVVJJQ29tcG9uZW50KChfYSA9IHNlZWRbZmllbGRdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnbnVsbCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBVUkktZW5jb2RlIGluIGNhc2UgdGhlcmUgYXJlIHVudXN1YWwgY2hhcmFjdGVycyBpbiB0aGUgc3lzdGVtJ3MgdW5hbWUuXG4gICAgICAgICAgICAgICAgdXNlckFnZW50LnVuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KHVuYW1lIHx8ICdVTktOT1dOJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5nZXRBcGlGaWVsZCgnaHR0cENsaWVudCcpO1xuICAgICAgICAgICAgICAgIGlmIChjbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckFnZW50Lmh0dHBsaWIgPSBlbmNvZGVVUklDb21wb25lbnQoY2xpZW50LmdldENsaWVudE5hbWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcHBJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJBZ2VudC5hcHBsaWNhdGlvbiA9IHRoaXMuX2FwcEluZm87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNiKEpTT04uc3RyaW5naWZ5KHVzZXJBZ2VudCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBQbGVhc2Ugb3BlbiBvciB1cHZvdGUgYW4gaXNzdWUgYXQgZ2l0aHViLmNvbS9zdHJpcGUvc3RyaXBlLW5vZGVcbiAgICAgICAgICogaWYgeW91IHVzZSB0aGlzLCBkZXRhaWxpbmcgeW91ciB1c2UtY2FzZS5cbiAgICAgICAgICpcbiAgICAgICAgICogSXQgbWF5IGJlIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgICovXG4gICAgICAgIGdldEFwcEluZm9Bc1N0cmluZygpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fYXBwSW5mbykge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmb3JtYXR0ZWQgPSB0aGlzLl9hcHBJbmZvLm5hbWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXBwSW5mby52ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkICs9IGAvJHt0aGlzLl9hcHBJbmZvLnZlcnNpb259YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9hcHBJbmZvLnVybCkge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlZCArPSBgICgke3RoaXMuX2FwcEluZm8udXJsfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VGVsZW1ldHJ5RW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVUZWxlbWV0cnk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBUaGlzIG1heSBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUuXG4gICAgICAgICAqL1xuICAgICAgICBfcHJlcFJlc291cmNlcygpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiByZXNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdGhpc1twYXNjYWxUb0NhbWVsQ2FzZShuYW1lKV0gPSBuZXcgcmVzb3VyY2VzW25hbWVdKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogVGhpcyBtYXkgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgKi9cbiAgICAgICAgX2dldFByb3BzRnJvbUNvbmZpZyhjb25maWcpIHtcbiAgICAgICAgICAgIC8vIElmIGNvbmZpZyBpcyBudWxsIG9yIHVuZGVmaW5lZCwganVzdCBiYWlsIGVhcmx5IHdpdGggbm8gcHJvcHNcbiAgICAgICAgICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uZmlnIGNhbiBiZSBhbiBvYmplY3Qgb3IgYSBzdHJpbmdcbiAgICAgICAgICAgIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZyc7XG4gICAgICAgICAgICBjb25zdCBpc09iamVjdCA9IGNvbmZpZyA9PT0gT2JqZWN0KGNvbmZpZykgJiYgIUFycmF5LmlzQXJyYXkoY29uZmlnKTtcbiAgICAgICAgICAgIGlmICghaXNPYmplY3QgJiYgIWlzU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWcgbXVzdCBlaXRoZXIgYmUgYW4gb2JqZWN0IG9yIGEgc3RyaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBjb25maWcgaXMgYSBzdHJpbmcsIHdlIGFzc3VtZSB0aGUgb2xkIGJlaGF2aW9yIG9mIHBhc3NpbmcgaW4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFwaSB2ZXJzaW9uXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBhcGlWZXJzaW9uOiBjb25maWcsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIGNvbmZpZyBpcyBhbiBvYmplY3QsIHdlIGFzc3VtZSB0aGUgbmV3IGJlaGF2aW9yIGFuZCBtYWtlIHN1cmUgaXQgZG9lc24ndCBjb250YWluIGFueSB1bmV4cGVjdGVkIHZhbHVlc1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmtleXMoY29uZmlnKS5maWx0ZXIoKHZhbHVlKSA9PiAhQUxMT1dFRF9DT05GSUdfUFJPUEVSVElFUy5pbmNsdWRlcyh2YWx1ZSkpO1xuICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb25maWcgb2JqZWN0IG1heSBvbmx5IGNvbnRhaW4gdGhlIGZvbGxvd2luZzogJHtBTExPV0VEX0NPTkZJR19QUk9QRVJUSUVTLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIFN0cmlwZTtcbn1cbiIsICJpbXBvcnQgeyBXZWJQbGF0Zm9ybUZ1bmN0aW9ucyB9IGZyb20gJy4vcGxhdGZvcm0vV2ViUGxhdGZvcm1GdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3RyaXBlIH0gZnJvbSAnLi9zdHJpcGUuY29yZS5qcyc7XG5leHBvcnQgY29uc3QgU3RyaXBlID0gY3JlYXRlU3RyaXBlKG5ldyBXZWJQbGF0Zm9ybUZ1bmN0aW9ucygpKTtcbmV4cG9ydCBkZWZhdWx0IFN0cmlwZTtcbiIsICJpbXBvcnQgdHlwZSBTdHJpcGUgZnJvbSAnc3RyaXBlJztcblxuZXhwb3J0IHR5cGUgUmlza0xldmVsID0gJ2hpZ2gnIHwgJ21lZGl1bScgfCAnbG93JztcblxuZXhwb3J0IGludGVyZmFjZSBSaXNrUmVzdWx0IHtcbiAgc2NvcmU6IG51bWJlcjtcbiAgbGV2ZWw6IFJpc2tMZXZlbDtcbiAgZmFjdG9yczogc3RyaW5nW107XG4gIG1ycjogbnVtYmVyOyAvLyBtb250aGx5IGRvbGxhcnNcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIGEgMFx1MjAxMzEwMCBjaHVybiByaXNrIHNjb3JlIGZyb20gU3RyaXBlIG9iamVjdHMuXG4gKiBTY29yaW5nOlxuICogICBwYXN0X2R1ZSBzdWJzY3JpcHRpb24gICAgICAgICAgXHUyMTkyICsyNVxuICogICBjYW5jZWxsYXRpb24gc2NoZWR1bGVkICAgICAgICAgIFx1MjE5MiArMjVcbiAqICAgZWFjaCBmYWlsZWQgY2hhcmdlIChtYXggMykgICAgICBcdTIxOTIgKzEwIGVhY2ggKG1heCArMzApXG4gKiAgIG5vIHN1Y2Nlc3NmdWwgY2hhcmdlIGluIDMwIGRheXMgXHUyMTkyICsyMFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlUmlzayhcbiAgc3Vic2NyaXB0aW9uOiBTdHJpcGUuU3Vic2NyaXB0aW9uIHwgbnVsbCxcbiAgY2hhcmdlczogU3RyaXBlLkNoYXJnZVtdXG4pOiBSaXNrUmVzdWx0IHtcbiAgbGV0IHNjb3JlID0gMDtcbiAgY29uc3QgZmFjdG9yczogc3RyaW5nW10gPSBbXTtcblxuICBpZiAoc3Vic2NyaXB0aW9uPy5zdGF0dXMgPT09ICdwYXN0X2R1ZScpIHtcbiAgICBzY29yZSArPSAyNTtcbiAgICBmYWN0b3JzLnB1c2goJ1N1YnNjcmlwdGlvbiBpcyBwYXN0IGR1ZScpO1xuICB9XG5cbiAgaWYgKHN1YnNjcmlwdGlvbj8uY2FuY2VsX2F0X3BlcmlvZF9lbmQpIHtcbiAgICBzY29yZSArPSAyNTtcbiAgICBmYWN0b3JzLnB1c2goJ0NhbmNlbGxhdGlvbiBzY2hlZHVsZWQgYXQgcGVyaW9kIGVuZCcpO1xuICB9XG5cbiAgY29uc3QgZmFpbGVkQ2hhcmdlcyA9IGNoYXJnZXMuZmlsdGVyKGMgPT4gYy5zdGF0dXMgPT09ICdmYWlsZWQnKTtcbiAgaWYgKGZhaWxlZENoYXJnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHBvaW50cyA9IE1hdGgubWluKGZhaWxlZENoYXJnZXMubGVuZ3RoICogMTAsIDMwKTtcbiAgICBzY29yZSArPSBwb2ludHM7XG4gICAgZmFjdG9ycy5wdXNoKGAke2ZhaWxlZENoYXJnZXMubGVuZ3RofSBmYWlsZWQgcGF5bWVudCBhdHRlbXB0JHtmYWlsZWRDaGFyZ2VzLmxlbmd0aCA+IDEgPyAncycgOiAnJ31gKTtcbiAgfVxuXG4gIGNvbnN0IHRoaXJ0eURheXNBZ28gPSBEYXRlLm5vdygpIC8gMTAwMCAtIDMwICogMjQgKiA2MCAqIDYwO1xuICBjb25zdCBoYXNSZWNlbnRTdWNjZXNzID0gY2hhcmdlcy5zb21lKGMgPT4gYy5zdGF0dXMgPT09ICdzdWNjZWVkZWQnICYmIGMuY3JlYXRlZCA+IHRoaXJ0eURheXNBZ28pO1xuICBpZiAoIWhhc1JlY2VudFN1Y2Nlc3MgJiYgY2hhcmdlcy5sZW5ndGggPiAwKSB7XG4gICAgc2NvcmUgKz0gMjA7XG4gICAgZmFjdG9ycy5wdXNoKCdObyBzdWNjZXNzZnVsIHBheW1lbnQgaW4gdGhlIHBhc3QgMzAgZGF5cycpO1xuICB9XG5cbiAgaWYgKGZhY3RvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgZmFjdG9ycy5wdXNoKCdObyBjaHVybiBzaWduYWxzIGRldGVjdGVkJyk7XG4gIH1cblxuICBjb25zdCBmaW5hbFNjb3JlID0gTWF0aC5taW4oc2NvcmUsIDEwMCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29yZTogZmluYWxTY29yZSxcbiAgICBsZXZlbDogZmluYWxTY29yZSA+PSA3MCA/ICdoaWdoJyA6IGZpbmFsU2NvcmUgPj0gNDAgPyAnbWVkaXVtJyA6ICdsb3cnLFxuICAgIGZhY3RvcnMsXG4gICAgbXJyOiBnZXRTdWJzY3JpcHRpb25NcnIoc3Vic2NyaXB0aW9uKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U3Vic2NyaXB0aW9uTXJyKHN1YjogU3RyaXBlLlN1YnNjcmlwdGlvbiB8IG51bGwpOiBudW1iZXIge1xuICBpZiAoIXN1YikgcmV0dXJuIDA7XG4gIHJldHVybiBzdWIuaXRlbXMuZGF0YS5yZWR1Y2UoKHRvdGFsLCBpdGVtKSA9PiB7XG4gICAgY29uc3QgcHJpY2UgPSBpdGVtLnByaWNlIGFzIFN0cmlwZS5QcmljZTtcbiAgICBjb25zdCB1bml0QW1vdW50ID0gcHJpY2UudW5pdF9hbW91bnQgPz8gMDtcbiAgICBjb25zdCBxdHkgPSBpdGVtLnF1YW50aXR5ID8/IDE7XG4gICAgY29uc3QgaW50ZXJ2YWwgPSBwcmljZS5yZWN1cnJpbmc/LmludGVydmFsO1xuICAgIGNvbnN0IGludGVydmFsQ291bnQgPSBwcmljZS5yZWN1cnJpbmc/LmludGVydmFsX2NvdW50ID8/IDE7XG4gICAgLy8gTm9ybWFsaXNlIHRvIG1vbnRobHkgY2VudHNcbiAgICBsZXQgbW9udGhseUNlbnRzID0gdW5pdEFtb3VudCAqIHF0eTtcbiAgICBpZiAoaW50ZXJ2YWwgPT09ICd5ZWFyJykgbW9udGhseUNlbnRzID0gbW9udGhseUNlbnRzIC8gKDEyICogaW50ZXJ2YWxDb3VudCk7XG4gICAgaWYgKGludGVydmFsID09PSAnd2VlaycpIG1vbnRobHlDZW50cyA9IG1vbnRobHlDZW50cyAqICg1MiAvIDEyKSAvIGludGVydmFsQ291bnQ7XG4gICAgaWYgKGludGVydmFsID09PSAnZGF5JykgbW9udGhseUNlbnRzID0gbW9udGhseUNlbnRzICogKDM2NSAvIDEyKSAvIGludGVydmFsQ291bnQ7XG4gICAgcmV0dXJuIHRvdGFsICsgbW9udGhseUNlbnRzO1xuICB9LCAwKSAvIDEwMDsgLy8gY2VudHMgXHUyMTkyIGRvbGxhcnNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJpc2tCYWRnZVR5cGUobGV2ZWw6IFJpc2tMZXZlbCk6ICduZWdhdGl2ZScgfCAnd2FybmluZycgfCAncG9zaXRpdmUnIHtcbiAgaWYgKGxldmVsID09PSAnaGlnaCcpIHJldHVybiAnbmVnYXRpdmUnO1xuICBpZiAobGV2ZWwgPT09ICdtZWRpdW0nKSByZXR1cm4gJ3dhcm5pbmcnO1xuICByZXR1cm4gJ3Bvc2l0aXZlJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmlwdGlvbkJhZGdlVHlwZShcbiAgc3RhdHVzOiBzdHJpbmcsXG4gIGNhbmNlbEF0UGVyaW9kRW5kOiBib29sZWFuXG4pOiAnbmVnYXRpdmUnIHwgJ3dhcm5pbmcnIHwgJ3Bvc2l0aXZlJyB8ICduZXV0cmFsJyB7XG4gIGlmIChjYW5jZWxBdFBlcmlvZEVuZCkgcmV0dXJuICduZWdhdGl2ZSc7XG4gIGlmIChzdGF0dXMgPT09ICdwYXN0X2R1ZScgfHwgc3RhdHVzID09PSAndW5wYWlkJykgcmV0dXJuICduZWdhdGl2ZSc7XG4gIGlmIChzdGF0dXMgPT09ICd0cmlhbGluZycpIHJldHVybiAnd2FybmluZyc7XG4gIGlmIChzdGF0dXMgPT09ICdhY3RpdmUnKSByZXR1cm4gJ3Bvc2l0aXZlJztcbiAgcmV0dXJuICduZXV0cmFsJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmlwdGlvbkxhYmVsKHN0YXR1czogc3RyaW5nLCBjYW5jZWxBdFBlcmlvZEVuZDogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmIChjYW5jZWxBdFBlcmlvZEVuZCkgcmV0dXJuICdDYW5jZWxsaW5nJztcbiAgY29uc3QgbGFiZWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGFjdGl2ZTogJ0FjdGl2ZScsXG4gICAgcGFzdF9kdWU6ICdQYXN0IER1ZScsXG4gICAgdW5wYWlkOiAnVW5wYWlkJyxcbiAgICBjYW5jZWxlZDogJ0NhbmNlbGxlZCcsXG4gICAgdHJpYWxpbmc6ICdUcmlhbCcsXG4gICAgaW5jb21wbGV0ZTogJ0luY29tcGxldGUnLFxuICAgIGluY29tcGxldGVfZXhwaXJlZDogJ0V4cGlyZWQnLFxuICAgIHBhdXNlZDogJ1BhdXNlZCcsXG4gIH07XG4gIHJldHVybiBsYWJlbHNbc3RhdHVzXSA/PyBzdGF0dXM7XG59XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFN0cmlwZSBmcm9tICdzdHJpcGUnO1xuaW1wb3J0IHtcbiAgQmFkZ2UsXG4gIEJhbm5lcixcbiAgQm94LFxuICBCdXR0b24sXG4gIERpdmlkZXIsXG4gIElubGluZSxcbiAgTGluayxcbiAgU3Bpbm5lcixcbn0gZnJvbSAnQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL3VpJztcbmltcG9ydCB0eXBlIHsgRXh0ZW5zaW9uQ29udGV4dFZhbHVlIH0gZnJvbSAnQHN0cmlwZS91aS1leHRlbnNpb24tc2RrL2NvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlSHR0cENsaWVudCwgU1RSSVBFX0FQSV9LRVkgfSBmcm9tICdAc3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvaHR0cF9jbGllbnQnO1xuaW1wb3J0IHsgZmV0Y2hTdHJpcGVTaWduYXR1cmUgfSBmcm9tICdAc3RyaXBlL3VpLWV4dGVuc2lvbi1zZGsvdXRpbHMnO1xuaW1wb3J0IHtcbiAgY2FsY3VsYXRlUmlzayxcbiAgcmlza0JhZGdlVHlwZSxcbiAgc3Vic2NyaXB0aW9uQmFkZ2VUeXBlLFxuICBzdWJzY3JpcHRpb25MYWJlbCxcbiAgdHlwZSBSaXNrUmVzdWx0LFxufSBmcm9tICcuLi91dGlscy9yaXNrU2NvcmluZyc7XG5cbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUoU1RSSVBFX0FQSV9LRVksIHtcbiAgaHR0cENsaWVudDogY3JlYXRlSHR0cENsaWVudCgpLFxuICBhcGlWZXJzaW9uOiAnMjAyMy0xMC0xNicsXG59KTtcblxuY29uc3QgQVBQX1VSTCA9ICdodHRwczovL2NodXJuZ3VhcmRhcHAuY29tJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxWaWV3KHsgdXNlckNvbnRleHQsIGVudmlyb25tZW50IH06IEV4dGVuc2lvbkNvbnRleHRWYWx1ZSkge1xuICBjb25zdCBjdXN0b21lcklkID0gZW52aXJvbm1lbnQ/Lm9iamVjdENvbnRleHQ/LmlkID8/ICcnO1xuICBjb25zdCBhY2NvdW50SWQgPSB1c2VyQ29udGV4dD8uYWNjb3VudD8uaWQgPz8gJyc7XG4gIGNvbnN0IGFwaUJhc2UgPSAoZW52aXJvbm1lbnQ/LmNvbnN0YW50cyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkKT8uQVBJX0JBU0VcbiAgICA/PyBgJHtBUFBfVVJMfS9hcGkvc3RyaXBlLWFwcGA7XG5cbiAgY29uc3QgW3Jpc2ssIHNldFJpc2tdID0gdXNlU3RhdGU8Umlza1Jlc3VsdCB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbY3VzdG9tZXJOYW1lLCBzZXRDdXN0b21lck5hbWVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbc3ViU3RhdHVzLCBzZXRTdWJTdGF0dXNdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbY2FuY2VsQXRQZXJpb2RFbmQsIHNldENhbmNlbEF0UGVyaW9kRW5kXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2RheXNTaW5jZSwgc2V0RGF5c1NpbmNlXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcblxuICBjb25zdCBsb2FkID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmICghY3VzdG9tZXJJZCkgcmV0dXJuO1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgc2V0RXJyb3IobnVsbCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFtjdXN0b21lciwgc3Vic2NyaXB0aW9ucywgY2hhcmdlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0cmlwZS5jdXN0b21lcnMucmV0cmlldmUoY3VzdG9tZXJJZCksXG4gICAgICAgIHN0cmlwZS5zdWJzY3JpcHRpb25zLmxpc3Qoe1xuICAgICAgICAgIGN1c3RvbWVyOiBjdXN0b21lcklkLFxuICAgICAgICAgIGxpbWl0OiAxMCxcbiAgICAgICAgICBleHBhbmQ6IFsnZGF0YS5pdGVtcy5kYXRhLnByaWNlJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJpcGUuY2hhcmdlcy5saXN0KHsgY3VzdG9tZXI6IGN1c3RvbWVySWQsIGxpbWl0OiAzMCB9KSxcbiAgICAgIF0pO1xuXG4gICAgICBpZiAoIWN1c3RvbWVyIHx8ICdkZWxldGVkJyBpbiBjdXN0b21lcikge1xuICAgICAgICBzZXRFcnJvcignQ3VzdG9tZXIgbm90IGZvdW5kIG9yIGhhcyBiZWVuIGRlbGV0ZWQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0Q3VzdG9tZXJOYW1lKGN1c3RvbWVyLm5hbWUgPz8gY3VzdG9tZXIuZW1haWwgPz8gY3VzdG9tZXJJZCk7XG5cbiAgICAgIGNvbnN0IGFjdGl2ZVN1YiA9XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGF0YS5maW5kKHMgPT4gcy5zdGF0dXMgPT09ICdhY3RpdmUnKSA/P1xuICAgICAgICBzdWJzY3JpcHRpb25zLmRhdGEuZmluZChzID0+IHMuc3RhdHVzID09PSAncGFzdF9kdWUnKSA/P1xuICAgICAgICBzdWJzY3JpcHRpb25zLmRhdGFbMF0gPz9cbiAgICAgICAgbnVsbDtcblxuICAgICAgaWYgKGFjdGl2ZVN1Yikge1xuICAgICAgICBzZXRTdWJTdGF0dXMoYWN0aXZlU3ViLnN0YXR1cyk7XG4gICAgICAgIHNldENhbmNlbEF0UGVyaW9kRW5kKGFjdGl2ZVN1Yi5jYW5jZWxfYXRfcGVyaW9kX2VuZCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNhbGN1bGF0ZVJpc2soYWN0aXZlU3ViID8/IG51bGwsIGNoYXJnZXMuZGF0YSk7XG4gICAgICBzZXRSaXNrKHJlc3VsdCk7XG5cbiAgICAgIGNvbnN0IGxhc3RTdWNjZXNzID0gY2hhcmdlcy5kYXRhLmZpbmQoYyA9PiBjLnN0YXR1cyA9PT0gJ3N1Y2NlZWRlZCcpO1xuICAgICAgaWYgKGxhc3RTdWNjZXNzKSB7XG4gICAgICAgIHNldERheXNTaW5jZShNYXRoLmZsb29yKChEYXRlLm5vdygpIC8gMTAwMCAtIGxhc3RTdWNjZXNzLmNyZWF0ZWQpIC8gODY0MDApKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmV0Y2ggZW5oYW5jZWQgQ2h1cm5HdWFyZCBkYXRhIGluIGJhY2tncm91bmQgXHUyMDE0IG5vbi1ibG9ja2luZ1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2lnID0gYXdhaXQgZmV0Y2hTdHJpcGVTaWduYXR1cmUoKTtcbiAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgYCR7YXBpQmFzZX0vY3VzdG9tZXI/YWNjb3VudF9pZD0ke2FjY291bnRJZH0mY3VzdG9tZXJfaWQ9JHtjdXN0b21lcklkfWAsXG4gICAgICAgICAgeyBoZWFkZXJzOiB7ICdzdHJpcGUtc2lnbmF0dXJlJzogc2lnIH0gfVxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIEJhY2tlbmQgdW5hdmFpbGFibGUgXHUyMDE0IFN0cmlwZS1uYXRpdmUgc2NvcmVzIHNob3duXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG4gICAgICBzZXRFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ0ZhaWxlZCB0byBsb2FkIGN1c3RvbWVyIGRhdGEnKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfVxuICB9LCBbY3VzdG9tZXJJZCwgYWNjb3VudElkLCBhcGlCYXNlXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsb2FkKCk7XG4gIH0sIFtsb2FkXSk7XG5cbiAgY29uc3Qgc2lnbnVwUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgc3RyaXBlX2FjY291bnRfaWQ6IGFjY291bnRJZCxcbiAgICBjdXN0b21lcl9pZDogY3VzdG9tZXJJZCxcbiAgICBzb3VyY2U6ICdzdHJpcGVfYXBwX2N1c3RvbWVyJyxcbiAgfSk7XG4gIGNvbnN0IHNpZ251cFVybCA9IGAke0FQUF9VUkx9L3NpZ251cD8ke3NpZ251cFBhcmFtc31gO1xuXG4gIGlmICghY3VzdG9tZXJJZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94IGNzcz17eyBwYWRkaW5nOiAnbWVkaXVtJyB9fT5cbiAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHknIH19Pk5vIGN1c3RvbWVyIHNlbGVjdGVkLjwvQm94PlxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChsb2FkaW5nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3ggY3NzPXt7IHBhZGRpbmc6ICdsYXJnZScsIHN0YWNrOiAneScsIGdhcDogJ21lZGl1bScsIGFsaWduWDogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxTcGlubmVyIC8+XG4gICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdib2R5JyB9fT5DYWxjdWxhdGluZyBjaHVybiByaXNrXHUyMDI2PC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3ggY3NzPXt7IHBhZGRpbmc6ICdtZWRpdW0nLCBzdGFjazogJ3knLCBnYXA6ICdtZWRpdW0nIH19PlxuICAgICAgICA8QmFubmVyXG4gICAgICAgICAgdHlwZT1cImNhdXRpb25cIlxuICAgICAgICAgIHRpdGxlPVwiRXJyb3JcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uPXtlcnJvcn1cbiAgICAgICAgICBvbkRpc21pc3M9eygpID0+IHNldEVycm9yKG51bGwpfVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uIG9uUHJlc3M9e2xvYWR9PlJldHJ5PC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKCFyaXNrKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneScsIGdhcDogJ21lZGl1bScsIHBhZGRpbmc6ICdtZWRpdW0nIH19PlxuXG4gICAgICB7LyogSGVhZGVyIHJvdyAqL31cbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneCcsIGdhcDogJ21lZGl1bScsIGFsaWduWTogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdoZWFkaW5nJyB9fT5DaHVybkd1YXJkIFJpc2s8L0JveD5cbiAgICAgICAgPEJhZGdlIHR5cGU9e3Jpc2tCYWRnZVR5cGUocmlzay5sZXZlbCl9PlxuICAgICAgICAgIHtyaXNrLnNjb3JlfS8xMDAgXHUyMDE0IHtyaXNrLmxldmVsID09PSAnaGlnaCcgPyAnSGlnaCcgOiByaXNrLmxldmVsID09PSAnbWVkaXVtJyA/ICdNZWRpdW0nIDogJ0xvdyd9IFJpc2tcbiAgICAgICAgPC9CYWRnZT5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7LyogU3RhdHMgcm93ICovfVxuICAgICAgPEJveCBjc3M9e3sgc3RhY2s6ICd4JywgZ2FwOiAnc21hbGwnIH19PlxuICAgICAgICB7c3ViU3RhdHVzICYmIChcbiAgICAgICAgICA8Qm94IGNzcz17e1xuICAgICAgICAgICAgc3RhY2s6ICd5JywgZ2FwOiAneHNtYWxsJywgcGFkZGluZzogJ3NtYWxsJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2NvbnRhaW5lcicsIGJvcmRlclJhZGl1czogJ21lZGl1bScsIHdpZHRoOiAnMS8zJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdjYXB0aW9uJyB9fT5TdWJzY3JpcHRpb248L0JveD5cbiAgICAgICAgICAgIDxCYWRnZSB0eXBlPXtzdWJzY3JpcHRpb25CYWRnZVR5cGUoc3ViU3RhdHVzLCBjYW5jZWxBdFBlcmlvZEVuZCl9PlxuICAgICAgICAgICAgICB7c3Vic2NyaXB0aW9uTGFiZWwoc3ViU3RhdHVzLCBjYW5jZWxBdFBlcmlvZEVuZCl9XG4gICAgICAgICAgICA8L0JhZGdlPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApfVxuXG4gICAgICAgIDxCb3ggY3NzPXt7XG4gICAgICAgICAgc3RhY2s6ICd5JywgZ2FwOiAneHNtYWxsJywgcGFkZGluZzogJ3NtYWxsJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjb250YWluZXInLCBib3JkZXJSYWRpdXM6ICdtZWRpdW0nLCB3aWR0aDogJzEvMycsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxCb3ggY3NzPXt7IGZvbnQ6ICdjYXB0aW9uJyB9fT5NUlI8L0JveD5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAnaGVhZGluZycgfX0+XG4gICAgICAgICAgICAke3Jpc2subXJyLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwIH0pfS9tb1xuICAgICAgICAgIDwvQm94PlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8Qm94IGNzcz17e1xuICAgICAgICAgIHN0YWNrOiAneScsIGdhcDogJ3hzbWFsbCcsIHBhZGRpbmc6ICdzbWFsbCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnY29udGFpbmVyJywgYm9yZGVyUmFkaXVzOiAnbWVkaXVtJywgd2lkdGg6ICcxLzMnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8Qm94IGNzcz17eyBmb250OiAnY2FwdGlvbicgfX0+TGFzdCBQYXltZW50PC9Cb3g+XG4gICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2hlYWRpbmcnIH19PlxuICAgICAgICAgICAge2RheXNTaW5jZSAhPT0gbnVsbCA/IGAke2RheXNTaW5jZX1kIGFnb2AgOiAnXHUyMDE0J31cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cblxuICAgICAgey8qIFJpc2sgZmFjdG9ycyAqL31cbiAgICAgIHtyaXNrLmZhY3RvcnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPERpdmlkZXIgLz5cbiAgICAgICAgICA8Qm94IGNzcz17eyBzdGFjazogJ3knLCBnYXA6ICd4c21hbGwnIH19PlxuICAgICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ3N1YmhlYWRpbmcnIH19PlJpc2sgRmFjdG9yczwvQm94PlxuICAgICAgICAgICAge3Jpc2suZmFjdG9ycy5tYXAoKGZhY3RvciwgaSkgPT4gKFxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgIGNzcz17e1xuICAgICAgICAgICAgICAgICAgc3RhY2s6ICd4JywgZ2FwOiAnc21hbGwnLCBwYWRkaW5nOiAneHNtYWxsJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2NvbnRhaW5lcicsIGJvcmRlclJhZGl1czogJ3NtYWxsJywgYWxpZ25ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJhZGdlIHR5cGU9e3Jpc2subGV2ZWwgPT09ICdoaWdoJyA/ICduZWdhdGl2ZScgOiByaXNrLmxldmVsID09PSAnbWVkaXVtJyA/ICd3YXJuaW5nJyA6ICdwb3NpdGl2ZSd9PlxuICAgICAgICAgICAgICAgICAge2kgKyAxfVxuICAgICAgICAgICAgICAgIDwvQmFkZ2U+XG4gICAgICAgICAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHknIH19PntmYWN0b3J9PC9Cb3g+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgIDwvPlxuICAgICAgKX1cblxuICAgICAgPERpdmlkZXIgLz5cblxuICAgICAgey8qIENUQSAqL31cbiAgICAgIDxCb3ggY3NzPXt7IHN0YWNrOiAneScsIGdhcDogJ3NtYWxsJyB9fT5cbiAgICAgICAgPEJveCBjc3M9e3sgZm9udDogJ2JvZHknIH19PlxuICAgICAgICAgIFByZXZlbnQge2N1c3RvbWVyTmFtZX0gZnJvbSBjaHVybmluZyBcdTIwMTQgQ2h1cm5HdWFyZCBzZW5kcyBhdXRvbWF0ZWQgcmV0ZW50aW9uXG4gICAgICAgICAgbWVzc2FnZXMgdGhlIG1vbWVudCByaXNrIHNpZ25hbHMgYXBwZWFyLlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPElubGluZT5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgaHJlZj17c2lnbnVwVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgICAgIFByZXZlbnQgQ2h1cm4gXHUyMDE0IFN0YXJ0IEZyZWUgVHJpYWxcbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9JbmxpbmU+XG4gICAgICAgIDxJbmxpbmU+XG4gICAgICAgICAgPExpbmsgaHJlZj17YCR7QVBQX1VSTH0vcHJpY2luZz9zb3VyY2U9c3RyaXBlX2FwcGB9IGV4dGVybmFsPlxuICAgICAgICAgICAgU2VlIGFsbCBDaHVybkd1YXJkIHBsYW5zIFx1MjE5MlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgPC9JbmxpbmU+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBR0EsYUFBTyxVQUFVO0FBQUE7QUFBQTs7O0FDSGpCO0FBQUE7QUFBQTtBQUFBOzs7QUNBQTtBQUFBO0FBQUEsVUFBSSxTQUFTLE9BQU8sUUFBUSxjQUFjLElBQUk7QUFDOUMsVUFBSSxvQkFBb0IsT0FBTyw0QkFBNEIsU0FBUyxPQUFPLHlCQUF5QixJQUFJLFdBQVcsTUFBTSxJQUFJO0FBQzdILFVBQUksVUFBVSxVQUFVLHFCQUFxQixPQUFPLGtCQUFrQixRQUFRLGFBQWEsa0JBQWtCLE1BQU07QUFDbkgsVUFBSSxhQUFhLFVBQVUsSUFBSSxVQUFVO0FBQ3pDLFVBQUksU0FBUyxPQUFPLFFBQVEsY0FBYyxJQUFJO0FBQzlDLFVBQUksb0JBQW9CLE9BQU8sNEJBQTRCLFNBQVMsT0FBTyx5QkFBeUIsSUFBSSxXQUFXLE1BQU0sSUFBSTtBQUM3SCxVQUFJLFVBQVUsVUFBVSxxQkFBcUIsT0FB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O0FBQUEsUUFDRSxjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsTUFDYjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBLE1BQ3JCLFFBQVE7QUFBQSxNQUNSLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxnQkFBZ0I7QUFBQSxNQUNkLDJCQUEyQjtBQUFBLFFBQ3pCLGVBQWU7QUFBQSxVQUNiO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxhQUFhO0FBQUEsVUFDYixZQUFZO0FBQUEsUUFDZDtBQUFBLFFBQ0E7QUFBQSxVQUNFLGFBQWE7QUFBQSxVQUNiLFlBQVk7QUFBQSxRQUNkO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFdBQVc7QUFBQSxFQUNiOyIsCiAgIm5hbWVzIjogWyJpc05hTiIsICJjb25jYXR0eSIsICJzbGljeSIsICJFbXB0eSIsICJ1bmRlZmluZWQiLCAiZG9FdmFsIiwgInN0cmluZ1RvUGF0aCIsICJnZXRCYXNlSW50cmluc2ljIiwgIm1hcmtPdmVyZmxvdyIsICJpc092ZXJmbG93IiwgImdldE1heEluZGV4IiwgInNldE1heEluZGV4IiwgImNvbXBhY3RRdWV1ZSIsICJhcnJheVRvT2JqZWN0IiwgIm1lcmdlIiwgImVuY29kZSIsICJjb21wYWN0IiwgImlzUmVnRXhwIiwgImlzQnVmZmVyIiwgImNvbWJpbmUiLCAibWF5YmVNYXAiLCAiaXNOb25OdWxsaXNoUHJpbWl0aXZlIiwgInN0cmluZ2lmeSIsICJ2YWx1ZSIsICJub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zIiwgInNwbGl0S2V5SW50b1NlZ21lbnRzIiwgIm5vcm1hbGl6ZVBhcnNlT3B0aW9ucyIsICJzdHJpbmdpZnkiLCAiZmV0Y2giLCAiY3JlYXRlSHR0cENsaWVudCIsICJSZWFjdCIsICJjcmVhdGVPQXV0aFN0YXRlIiwgImZldGNoU3RyaXBlU2lnbmF0dXJlIiwgInJlcXVpcmVfdXRpbHMiLCAiZXhwb3J0cyIsICJBY2NvdW50cyIsICJDb25maXJtYXRpb25Ub2tlbnMiLCAiQ3VzdG9tZXJzIiwgIkRpc3B1dGVzIiwgIlByb2R1Y3RzIiwgIlJlZnVuZHMiLCAiVG9rZW5zIiwgInN0cmlwZSIsICJzdHJpcGUiLCAiZGF0YSIsICJ1cmxEYXRhIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJBdXRob3JpemF0aW9ucyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAiQ2FyZHMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJDb25maWd1cmF0aW9ucyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIkluYm91bmRUcmFuc2ZlcnMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIk91dGJvdW5kUGF5bWVudHMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJPdXRib3VuZFRyYW5zZmVycyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIlBlcnNvbmFsaXphdGlvbkRlc2lnbnMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIlJlYWRlcnMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJSZWNlaXZlZENyZWRpdHMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJSZWNlaXZlZERlYml0cyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJTZXNzaW9ucyIsICJzdHJpcGVNZXRob2QiLCAiU2Vzc2lvbnMiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIlRyYW5zYWN0aW9ucyIsICJzdHJpcGVNZXRob2QiLCAiVHJhbnNhY3Rpb25zIiwgInN0cmlwZU1ldGhvZCIsICJUcmFuc2FjdGlvbnMiLCAic3RyaXBlTWV0aG9kIiwgIlRyYW5zYWN0aW9ucyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIkFjY291bnRzIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAiQ29uZmlybWF0aW9uVG9rZW5zIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAiQ3VzdG9tZXJzIiwgInN0cmlwZU1ldGhvZCIsICJEaXNwdXRlcyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJQcm9kdWN0cyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJSZWZ1bmRzIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgIlRva2VucyIsICJzdHJpcGVNZXRob2QiLCAic3RyaXBlTWV0aG9kIiwgInN0cmlwZU1ldGhvZCIsICJTZXNzaW9ucyIsICJUcmFuc2FjdGlvbnMiLCAiQXV0aG9yaXphdGlvbnMiLCAiQ2FyZHMiLCAiUGVyc29uYWxpemF0aW9uRGVzaWducyIsICJDb25maWd1cmF0aW9ucyIsICJSZWFkZXJzIiwgIkluYm91bmRUcmFuc2ZlcnMiLCAiT3V0Ym91bmRQYXltZW50cyIsICJPdXRib3VuZFRyYW5zZmVycyIsICJSZWNlaXZlZENyZWRpdHMiLCAiUmVjZWl2ZWREZWJpdHMiLCAic3RyaXBlIiwgImRhdGEiLCAic3RyaXBlIiwgIlN0cmlwZSIsICJpc09iamVjdCIsICJpbXBvcnRfdXRpbHMiLCAiaW1wb3J0X3JlYWN0IiwgImltcG9ydF91aSIsICJpbXBvcnRfaHR0cF9jbGllbnQiLCAiaW1wb3J0X3V0aWxzIiwgImltcG9ydF9qc3hfcnVudGltZSIsICJzdHJpcGUiLCAiQVBQX1VSTCJdCn0K
