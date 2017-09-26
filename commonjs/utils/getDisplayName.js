'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// :: Component => String
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

exports.default = getDisplayName;