/**
 *  webLine.js is an interface boilerplate for pseudo-'command line input'.
 *
 *  @author Albert Hermida
 *  @version 1.0
 */

/** Set Up webLine */
var webLine = {
  loc: 'home',
  in: text => {
    //parse input & produce output
    (text[0] === '/') ? commandManager.callCommand.apply(commandManager, getCommand(text)) :
                        commandManager.callCommand(webLine.loc, text);
  },
  out: text => {
    //produce output to screen
  },

  /**
   *  Mount Display
   *
   *  @param {object} [targetNode] An HTML5 Node to mount to.
   *  @returns {array} Returns an array of strings, the command & text
   */
  mount: targetNode => {

  }
};

/**
 *  A function to get the command and the text after the command
 *
 *  @param {string} text A string of text to be parsed
 *  @returns {array} Returns an array of strings, the command & text
 */
function getCommand(text) {
  try {
    if (!getCommand.pattern) getCommand.pattern = /\/(\w*)\s+/;
    let newText = text.match(getCommand.pattern)[1];
    return [newText, text.slice(newText.length)];
  } catch(e) {
    console.log(e);
    return ['home'];
  }
}

/**
 * Command Manager
 *
 * Simple API to allow users to add commands, and manages string parsers.
 */
let commandManager = {
  commands: {},

 /**
  * Add a command and a function
  *
  * @param {string} command Should be the '/' command that will be associated with callback
  * @param {function} fn will be the function associated with the command.
  * Any text supplied after '/command' will be fed into fn
  */
  add: (command, fn) => {

    //replace or create function for a particular command
    commands[command] = fn;
  },

 /**
  * Call a command's associated function with text
  *
  * @param {string} command Should be the '/' command that will be associated with callback
  * @param {function} fn will be the function associated with the command.
  * Any text supplied after '/command' will be fed into fn
  */
  callCommand: (command, text) => {
    if (text) {
      try {
        commandManager.commands[command](text);
      } catch (e) {
        console.log(e);
      }
    } else {
      if (commandManager.commands.hasOwnProperty(command)) {
        webLine.loc = command;
        webLine.out(`Location: ${command}`);
      } else {
        webLine.out(`Sorry, ${command} is not a registered command`);
      }
    }
  }
};

/** Mount Display */
(() => {
  //bind to body

})();
