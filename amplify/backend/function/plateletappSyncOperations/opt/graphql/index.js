"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscriptions = exports.queries = exports.mutations = void 0;
var mutations = _interopRequireWildcard(require("./mutations.js"));
exports.mutations = mutations;
var queries = _interopRequireWildcard(require("./queries.js"));
exports.queries = queries;
var subscriptions = _interopRequireWildcard(require("./subscriptions.js"));
exports.subscriptions = subscriptions;
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }