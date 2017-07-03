'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : String;
  var blob = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Blob;

  var uri = URL.createObjectURL(blob);
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
};