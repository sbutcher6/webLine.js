/**
 * @fileOverview w.js is a small library that abstracts events, DOM manipulation, and ajax.
 * @author Albert Hermida
 *
 * @version 1.0
 */

'use strict';

/**
 * The 'w' function allows for deferred execution of a callback.
 *
 * @param {function} main Specified function to be executed asynchronously
 */
var w = (main) => {
  window.setTimeout(main, 0);
};

/**
 * eventDispatcher is a utility that helps to manage delegated events
 */
const eventDispatcher = (() => {

  /**
   * eventRegistry is a map of all target identifiers to types.
   * Types are mapped to functions.
   */
  const eventRegistry = {};

  /**
   * Types helps in keeping track of all eventListeners attached to body.
   * @ignore It helps prevent any arbitrary listeners from being attached.
   */
  const types = {
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
  const eventManager = {

      /**
       * Adds event listener if no listener has been bound to body.
       *
       * @param {string} type Name of event to listen for
       */
      addEvent: (type) => {
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
      removeEvent: (typeList) => {
        if (typeList.constructor === Array) {
          typeList.forEach((type) => {
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
    registerEvent: (target, type, fn) => {
      if (fn instanceof Function) {
        let targ = eventRegistry[target] = eventRegistry[target] || {};
        targ[type] = fn;
        eventManager.addEvent(type);
      }
    },

    /**
     * Calls event from registry.
     *
     * @param {object} event Event to be delegated by eventRegistry.
     */
    callEvent: (event) => {
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
    removeEvent: (target, type) => {
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
w.addEvent = (target, eventName, callback) => {
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
w.removeEvent = (target, eventName) => {
  //addEvent & bind handler to it
  eventDispatcher.removeEvent(target, eventName);
};

/**
 * Returns HTML5 nodes from htmlString.
 *
 * @param {string} htmlString String of valid html5 elements
 * @returns {object} Returns a NodeList
 */
w.html = (htmlString) => {
  let div = document.createElement('div');
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
w.insert = (target, nodeList) => {
  let fragment = document.createDocumentFragment();
  for (let i = 0; nodeList[i]; i++) {
    fragment.appendChild(nodeList[i]);
  }
  target.appendChild(fragment.cloneNode(true));
};

/**
 * Removes HTML5 node from the DOM
 *
 * @param {object} target DOM node to be removed.
 */
w.remove = (target) => {
  //remove the target element & all bound listener targets
  target.parentNode.removeChild(target);
};

/**
 * Find HTML5 node in the DOM
 *
 * @param {string} selectorReference CSS selector reference to html element
 * @returns {object} Returns a DOM Node
 */
w.find = (selectorReference) => {
  //use selectorReference to query all (wrapper)
  return document.querySelector(selectorReference);
};

/**
 * Find HTML5 node in the DOM by ID only
 *
 * @param {string} id An id of an element in the dom
 * @returns {object} Returns a DOM Node
 */
w.findId = (id) => {
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
w.mFindId = (id, timeout) => {
  if (!w.mFindId.cache) w.mFindId.cache = {};
  if (timeout) {
    window.setTimeout(() => {
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
w.findAll = (selectorReferences) => {
  return document.querySelectorAll(selectorReferences);
};

/**
 * Creates a function that caches the results of its computations.
 *
 * @param {function} fn A function to be memoized
 * @param {number} [timout] An optional lifespan for the results of the function
 * @returns {function} Returns the memoizing function
 */
w.mem = (fn, timeout) => {
  const cache = {};
  return () => {
    var args = Array.prototype.slice.call(arguments);
    if (args in cache) {
      return cache[args];
    } else {
      let result = fn.apply(this, args);
      cache[args] = result;
      if (timeout) {
        window.setTimeout(() => {
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
w.tmp = (literals, ...substrings) => {
  let finalString = '';
  substrings.forEach((substring, i) => {
    let curr = literals.raw[i];
    if (substring.constructor === Array) {
      substring = substring.join('');
    }
    if (endsWith(curr, '$')) {
      curr.replace(/&/g, '&amp;')
         .replace(/>/g, '&gt;')
         .replace(/</g, '&lt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#39;')
         .replace(/`/g, '&#96;');
      curr = curr.slice(0, -1);
    }
    finalString += curr;
    finalString += substring;
  });
  finalString += literals.raw[literals.raw.length - 1];
  return finalString;
}
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
 w.post = (url) => {
   let request = new XMLHttpRequest();
   let data;
   request.open("POST", url, true);
   let adapter = {
     attach: (object) => {
       data = object;
       return adapter;
     },
     header: (...y) => {
       request.setRequestHeader.apply(this, y);
       return adapter;
     },
     end: (callback) => {
       data ? request.send(data) : request.send();
       if (request.readyState === 4 && request.status === 200) {
           let res = request.responseText;
           if (jsonString(request.responseText)) {
               res.body = JSON.parse(request.responseText);
           }
           callback(false, res);
       } else {
         let err = new Error("Request to " + url + " failed." + request.responseText);
         callback(err);
       }
     }
   }
   return adapter;
 }

/**
 * Makes GET request to a specified URL
 *
 * @param {string} url URL to make a get request to
 * @param {function} callback Function to handle the results of the function
 */
w.get = (url) => {
  let request = new XMLHttpRequest();
  let data;
  request.open("GET", url, true);
  let adapter = {
    attach: (object) => {
      data = object;
      return adapter;
    },
    header: (...y) => {
      request.setRequestHeader.apply(this, y);
      return adapter;
    },
    end: (callback) => {
      data ? request.send(data) : request.send();
      if (request.readyState === 4 && request.status === 200) {
          let res = request.responseText;
          if (jsonString(request.responseText)) {
              res.body = JSON.parse(request.responseText);
          }
          callback(false, res);
      } else {
        let err = new Error("Request to " + url + " failed." + request.responseText);
        callback(err);
      }
    }
  }
  return adapter;
}

/**
 * Only export w
 */
export default w;
