'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (originalSerie) {
  var lookup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var stackLookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var max = 0;
  var total = 0;

  var serie = (0, _lodash.transform)(originalSerie, function (liveObject, step, key) {
    var formattedKey = formatKey(key);
    if ((0, _lodash.isObject)(step)) {
      if (step.hasOwnProperty('c')) {
        liveObject[formattedKey] = {
          c: step.c,
          name: lookup[key] || formattedKey,
          key: key
        };
      } else {
        liveObject[formattedKey] = {
          c: 0,
          key: key,
          name: lookup[key] || formattedKey,
          stack: {}
        };
        (0, _lodash.each)(step, function (substep, subkey) {
          var formattedSubkey = formatKey(subkey);
          liveObject[formattedKey].c += substep.c;
          liveObject[formattedKey].stack[formattedSubkey] = {
            c: substep.c,
            name: stackLookup[subkey] || formattedSubkey,
            key: subkey
          };
        });
      }
      total += liveObject[formattedKey].c;
      max = liveObject[formattedKey].c > max ? liveObject[formattedKey].c : max;
    } else {
      total += step;
      max = step > max ? step : max;
      liveObject[formattedKey] = {
        c: step,
        key: key,
        name: lookup[key] || formattedKey,
        stack: {}
      };
    }
    return liveObject;
  }, {});

  return { serie: serie, total: total, max: max };
};

var _lodash = require('lodash');

var _d = require('d3');

/**
 * Expecting 
 * @param {[name|date]: {c}} serie
 * @param {[name|date]: {[name]: {c}}} serie 
 * 
 */

var hourParseTime = (0, _d.utcParse)("%Y-%m-%d %H");
var dayParseTime = (0, _d.utcParse)("%Y-%m-%d");

function formatKey(key) {
  return hourParseTime(key) || dayParseTime(key) || key;
}