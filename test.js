import w from './testLib/w';
import webLine from './webLine';

webLine.mount();
w.insert(document.body, w.html(`<input id="webLineInput" type="text">`));
webLine.slash.add('js', (text) => {
  let response;
  try {
    response = eval.call(window, text);
  } catch (e) {
    response = e;
  }
  if (!response) {
    let isSpecial = text.match(/^(var|function)\s+(.*)(;|\s*)(\(|=)/);
    if (isSpecial) {
      response = `${isSpecial[1]} ${isSpecial[2]}`;
    } else {
      response = 'undefined';
    }
  }
  webLine.out(response);
});
w.addEvent('webLineInput', 'keyup', function(){
  if (event.keyCode === 13) {
    webLine.in(event.target.value);
    event.target.value = '';
  }
});
