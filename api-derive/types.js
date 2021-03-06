"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require("./accounts/types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _types2 = require("./council/types");

Object.keys(_types2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types2[key];
    }
  });
});

var _types3 = require("./democracy/types");

Object.keys(_types3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types3[key];
    }
  });
});

var _types4 = require("./elections/types");

Object.keys(_types4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types4[key];
    }
  });
});

var _types5 = require("./parachains/types");

Object.keys(_types5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types5[key];
    }
  });
});

var _types6 = require("./session/types");

Object.keys(_types6).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types6[key];
    }
  });
});

var _types7 = require("./staking/types");

Object.keys(_types7).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types7[key];
    }
  });
});