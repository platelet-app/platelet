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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }