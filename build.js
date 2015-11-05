(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _w = require('./testLib/w');

var _w2 = _interopRequireDefault(_w);

var _webLine = require('./webLine');

var _webLine2 = _interopRequireDefault(_webLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_webLine2.default.mount();
_w2.default.insert(document.body, _w2.default.html('<input id="webLineInput" type="text">'));
_webLine2.default.slash.add('js', function (text) {
  var response = undefined;
  try {
    response = eval.call(window, text);
  } catch (e) {
    response = e;
  }
  if (!response) {
    var isSpecial = text.match(/^(var|function)\s+(.*)(;|\s*)(\(|=)/);
    if (isSpecial) {
      response = isSpecial[1] + ' ' + isSpecial[2];
    } else {
      response = 'undefined';
    }
  }
  _webLine2.default.out(response);
});
_webLine2.default.slash.add('google', function (text) {
  location.href = 'https://www.google.com/search?q=' + text.split(' ').join('+');
});
_webLine2.default.slash.add('facebook', function (text) {
  location.href = 'https://www.facebook.com/search?q=' + text.split(' ').join('+');
});
_webLine2.default.slash.add('youtube', function (text) {
  location.href = 'https://www.youtube.com/results?search_query=' + text.split(' ').join('+');
});
_w2.default.addEvent('webLineInput', 'keyup', function () {
  if (event.keyCode === 13) {
    _webLine2.default.in(event.target.value);
    event.target.value = '';
  }
});

},{"./testLib/w":2,"./webLine":3}],2:[function(require,module,exports){
/**
 * @fileOverview w.js is a small library that abstracts events, DOM manipulation, and ajax.
 * @author Albert Hermida
 *
 * @version 1.0
 */

'use strict'

/**
 * The 'w' function allows for deferred execution of a callback.
 *
 * @param {function} main Specified function to be executed asynchronously
 */
;
var _arguments = arguments;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var w = function w(main) {
  window.setTimeout(main, 0);
};

/**
 * eventDispatcher is a utility that helps to manage delegated events
 */
var eventDispatcher = (function () {

  /**
   * eventRegistry is a map of all target identifiers to types.
   * Types are mapped to functions.
   */
  var eventRegistry = {};

  /**
   * Types helps in keeping track of all eventListeners attached to body.
   * @ignore It helps prevent any arbitrary listeners from being attached.
   */
  var types = {
    blur: 0,
    change: 0,
    click: 0,
    copy: 0,
    cut: 0,
    dblclick: 0,
    touchcancel: 0,
    touchend: 0,
    touchmove: 0,
    touchstart: 0,
    drag: 0,
    dragend: 0,
    dragenter: 0,
    dragexit: 0,
    dragleave: 0,
    dragover: 0,
    dragstart: 0,
    drop: 0,
    focus: 0,
    input: 0,
    keydown: 0,
    keypress: 0,
    keyup: 0,
    load: 0,
    mousedown: 0,
    mousemove: 0,
    mouseout: 0,
    mouseover: 0,
    mouseup: 0,
    paste: 0,
    reset: 0,
    scroll: 0,
    submit: 0,
    wheel: 0
  };

  /**
   * eventManager is a tiny API to manage which listeners are bound.
   * @ignore It helps keep track of types.
   */
  var eventManager = {

    /**
     * Adds event listener if no listener has been bound to body.
     *
     * @param {string} type Name of event to listen for
     */
    addEvent: function addEvent(type) {
      if (types[type] === 0) {
        document.body.addEventListener(type, eventDispatcher.callEvent, false);
      }
      types[type]++;
    },

    /**
     * Removes event listener if no listener has been bound to body.
     * Removes multiple types if specified by array.
     *
     * @param {array|string} typeList Name of event(s) to remove
     */
    removeEvent: function removeEvent(typeList) {
      if (typeList.constructor === Array) {
        typeList.forEach(function (type) {
          types[type]--;
          if (type[type] === 0) {
            document.body.removeEventListener(type, eventDispatcher.callEvent, false);
          }
        });
      } else {
        types[typeList]--;
        if (types[typeList] === 0) {
          document.body.removeEventListener(type, eventDispatcher.callEvent, false);
        }
      }
    }
  };
  return {

    /**
     * Registers event to eventRegistry and eventManager
     *
     * @param {string|object} target Html Element, its id, or its className
     * @param {string} type Name of event to listen for
     * @param {function} fn Function to be fired on event
     */
    registerEvent: function registerEvent(target, type, fn) {
      if (_instanceof(fn, Function)) {
        var targ = eventRegistry[target] = eventRegistry[target] || {};
        targ[type] = fn;
        eventManager.addEvent(type);
      }
    },

    /**
     * Calls event from registry.
     *
     * @param {object} event Event to be delegated by eventRegistry.
     */
    callEvent: function callEvent(event) {
      if (eventRegistry[event.target.id] && eventRegistry[event.target.id].hasOwnProperty(event.type)) {
        eventRegistry[event.target.id][event.type]();
      } else if (eventRegistry[event.target.className] && eventRegistry[event.target.className].hasOwnProperty(event.type)) {
        eventRegistry[event.target.className][event.type]();
      } else if (eventRegistry[event.target]) {
        eventRegistry[event.target][event.type]();
      }
    },

    /**
     * Deletes event, or all events of any identifier, from eventRegistry.
     *
     * @param {string|object} target Html Element, its id, or its className
     * @param {string} type Name of event to delete
     */
    removeEvent: function removeEvent(target, type) {
      if (eventRegistry[target]) {
        if (type) {
          delete eventRegistry[target][type];
          eventManager.removeEvent(type);
        } else {
          eventManager.removeEvent(Object.keys(eventRegistry[target]));
          delete eventRegistry[target];
        }
      }
    }
  };
})();

/**
 * Adds event based on identifier for target. Element, id, or class for element.
 *
 * @param {object|string} target Identifier to delegate events to.
 * @param {string} eventName Name of event one wants to add functionality for.
 * @param {function} callback Function that one wants to be called on event.
 */
w.addEvent = function (target, eventName, callback) {
  //addEvent & bind handler to it
  eventDispatcher.registerEvent(target, eventName, callback);
};

/**
 * Removes the event for that identifier. Element, id, or class for element.
 * If no eventName is specified, it removes all bound events for that element.
 *
 * @param {object|string} target Identifier to delegate events to.
 * @param {string} [eventName] Name of event one wants to remove functionality for.
 */
w.removeEvent = function (target, eventName) {
  //addEvent & bind handler to it
  eventDispatcher.removeEvent(target, eventName);
};

/**
 * Returns HTML5 nodes from htmlString.
 *
 * @param {string} htmlString String of valid html5 elements
 * @returns {object} Returns a NodeList
 */
w.html = function (htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.childNodes;
  //gets elements from htmlString & returns actual elements
};

/**
 * Inserts NodeList into the DOM
 *
 * @param {object} target DOM node to append elements to.
 * @param {object} nodeList HTML5 NodeList to be inserted.
 */
w.insert = function (target, nodeList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; nodeList[i]; i++) {
    fragment.appendChild(nodeList[i]);
  }
  target.appendChild(fragment.cloneNode(true));
};

/**
 * Removes HTML5 node from the DOM
 *
 * @param {object} target DOM node to be removed.
 */
w.remove = function (target) {
  //remove the target element & all bound listener targets
  target.parentNode.removeChild(target);
};

/**
 * Find HTML5 node in the DOM
 *
 * @param {string} selectorReference CSS selector reference to html element
 * @returns {object} Returns a DOM Node
 */
w.find = function (selectorReference) {
  //use selectorReference to query all (wrapper)
  return document.querySelector(selectorReference);
};

/**
 * Find HTML5 node in the DOM by ID only
 *
 * @param {string} id An id of an element in the dom
 * @returns {object} Returns a DOM Node
 */
w.findId = function (id) {
  //use selectorReference to query all (wrapper)
  return document.getElementById(id);
};

/**
 * Find HTML5 node in the DOM by ID only & memoizes results ('m' for 'memoizes')
 *
 * @param {string} id An id of an element in the dom
 * @param {number} [timout] An optional lifespan for the caching
 * @returns {object} Returns a DOM Node
 */
w.mFindId = function (id, timeout) {
  if (!w.mFindId.cache) w.mFindId.cache = {};
  if (timeout) {
    window.setTimeout(function () {
      delete w.mFindId.cache[id];
    }, timeout);
  }
  return w.mFindId.cache[id] = w.mFindId.cache[id] || document.getElementById(id);
};
/**
 * Find HTML5 nodes in the DOM
 *
 * @param {string} selectorReference CSS selector reference to elements
 * @returns {object} Returns a NodeList
 */
w.findAll = function (selectorReferences) {
  return document.querySelectorAll(selectorReferences);
};

/**
 * Creates a function that caches the results of its computations.
 *
 * @param {function} fn A function to be memoized
 * @param {number} [timout] An optional lifespan for the results of the function
 * @returns {function} Returns the memoizing function
 */
w.mem = function (fn, timeout) {
  var cache = {};
  return function () {
    var args = Array.prototype.slice.call(_arguments);
    if (args in cache) {
      return cache[args];
    } else {
      var result = fn.apply(undefined, args);
      cache[args] = result;
      if (timeout) {
        window.setTimeout(function () {
          delete cache[args];
        }, timeout);
      }
      return result;
    }
  };
};

/**
 * endsWith polyfill, tells us if string ends with other string
 *
 * @param {string} subjectString A string which will be tested
 * @param {string} searchString A string that will be tested against subjectString
 * @param {number} position A position index that can be tested for
 * @returns {boolean} Returns a boolean if subjectString ends with searchString at position if it's specified
 */
function endsWith(subjectString, searchString, position) {
  if (String.prototype.endsWith) {
    return String.prototype.endsWith.call(subjectString, searchString, position);
  } else {
    subjectString = subjectString.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }
};

/**
 * Template handler to escape html, expects $ before dynamic sections (so $$)
 *
 * @param {array} literals Array of strings
 * @param {array} substrings Array of strings
 * @returns {string} htmlString of escaped html
 */
w.tmp = function (literals) {
  for (var _len = arguments.length, substrings = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    substrings[_key - 1] = arguments[_key];
  }

  var finalString = '';
  substrings.forEach(function (substring, i) {
    var curr = literals.raw[i];
    if (substring.constructor === Array) {
      substring = substring.join('');
    }
    if (endsWith(curr, '$')) {
      curr.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
      curr = curr.slice(0, -1);
    }
    finalString += curr;
    finalString += substring;
  });
  finalString += literals.raw[literals.raw.length - 1];
  return finalString;
};
/**
 * Tests if String represents JSON
 *
 * @param {string} string A string that will be tested if it is JSON
 * @returns {boolean} Evaluation if string is json
 */
function jsonString(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Makes POST request to a specified URL
 *
 * @param {string} url URL to make a get request to
 * @param {object} object Javascript object that one wants to send as JSON
 * @param {function} callback Function to handle the results of the function
 */
w.post = function (url) {
  var request = new XMLHttpRequest();
  var data = undefined;
  request.open("POST", url, true);
  var adapter = {
    attach: function attach(object) {
      data = object;
      return adapter;
    },
    header: function header() {
      for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        y[_key2] = arguments[_key2];
      }

      request.setRequestHeader.apply(undefined, y);
      return adapter;
    },
    end: function end(callback) {
      data ? request.send(data) : request.send();
      if (request.readyState === 4 && request.status === 200) {
        var res = request.responseText;
        if (jsonString(request.responseText)) {
          res.body = JSON.parse(request.responseText);
        }
        callback(false, res);
      } else {
        var err = new Error("Request to " + url + " failed." + request.responseText);
        callback(err);
      }
    }
  };
  return adapter;
};

/**
 * Makes GET request to a specified URL
 *
 * @param {string} url URL to make a get request to
 * @param {function} callback Function to handle the results of the function
 */
w.get = function (url) {
  var request = new XMLHttpRequest();
  var data = undefined;
  request.open("GET", url, true);
  var adapter = {
    attach: function attach(object) {
      data = object;
      return adapter;
    },
    header: function header() {
      for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        y[_key3] = arguments[_key3];
      }

      request.setRequestHeader.apply(undefined, y);
      return adapter;
    },
    end: function end(callback) {
      data ? request.send(data) : request.send();
      if (request.readyState === 4 && request.status === 200) {
        var res = request.responseText;
        if (jsonString(request.responseText)) {
          res.body = JSON.parse(request.responseText);
        }
        callback(false, res);
      } else {
        var err = new Error("Request to " + url + " failed." + request.responseText);
        callback(err);
      }
    }
  };
  return adapter;
};

/**
 * Only export w
 */
exports.default = w;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *  webLine.js is an interface boilerplate for a pseudo-'command line input'.
 *
 *  @author Albert Hermida
 *  @version 1.0
 */

/** Set Up webLine */
var webLine = {

  /** Location is originally set to 'home' */
  loc: 'home',

  /**
   *  Input text to be parsed.
   *
   *  @param {string} text A String of text that will be parsed.
   */
  in: function _in(text) {
    text[0] === '/' ? webLine.slash.callCommand.apply(webLine.slash, getCommand(text)) : webLine.slash.callCommand(webLine.loc, text);
  },

  /**
   *  Output text to mounted div.
   *
   *  @param {string} text A String of text that will be output.
   */
  out: function out(text) {

    //produce output to screen
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    if (webLine.targetNode) {
      webLine.targetNode.appendChild(div);
    } else {
      throw new Error('Mount must be called before outputting text.');
    }
  },

  /**
   *  Mount Display
   *
   *  @param {object} [targetNode] An HTML5 Node to mount to.
   *  @returns {object} Returns an array of strings, the command & text
   */
  mount: function mount(targetNode) {
    var div = document.createElement('div');
    div.id = 'webLine';
    targetNode ? targetNode.appendChild(div) : document.body.appendChild(div);

    //cache node after query
    webLine.targetNode = document.getElementById('webLine');
  }
};

/**
 *  A function to get the command and the text after the command
 *
 *  @param {string} text A string of text to be parsed
 *  @returns {object} Returns an array of strings, the command & text
 */
function getCommand(text) {
  if (!getCommand.pattern) getCommand.pattern = /\/(\w*)\s/;
  var newText = text.match(getCommand.pattern);
  return newText ? [newText[1], text.slice(newText[1].length + 1)] : [text.slice(1)];
}

/**
 * Command Manager
 *
 * Simple API to allow users to add commands, and manages string parsers.
 */
webLine.slash = {
  commands: {},

  /**
   * Add a command and a function
   *
   * @param {string} command Should be the '/' command that will be associated with callback
   * @param {function} fn The function associated with the command.
   * @param {boolean} [instant] Whether the function should be called, but not moved to (location).
   * Any text supplied after '/command' will be fed into fn
   */
  add: function add(command, fn, instant) {
    fn.instant = instant;
    //replace or create function for a particular command
    webLine.slash.commands[command] = fn;
  },

  /**
   * Call a command's associated function with text
   *
   * @param {string} command Should be the '/' command that will be associated with callback
   * @param {function} fn will be the function associated with the command.
   * Any text supplied after '/command' will be fed into fn
   */
  callCommand: function callCommand(command, text) {
    if (text) {
      try {
        webLine.slash.commands[command](text);
      } catch (e) {
        webLine.out('Sorry, ' + command + ' is not a registered command');
      }
    } else {
      if (webLine.slash.commands.hasOwnProperty(command)) {
        if (webLine.slash.commands[command].instant) {
          webLine.slash.commands[command]();
        } else {
          webLine.loc = command;
          webLine.out('Location: ' + command);
        }
      } else {
        webLine.out('Sorry, ' + command + ' is not a registered command');
      }
    }
  }
};

/** Initialize Base Commands */
webLine.slash.add('home', function (text) {
  return webLine.out(text);
});
webLine.slash.add('location', function () {
  return webLine.out(webLine.loc);
}, true);

exports.default = webLine;

},{}]},{},[1]);
