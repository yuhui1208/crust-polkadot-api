"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fees = require("./fees");

Object.keys(_fees).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fees[key];
    }
  });
});