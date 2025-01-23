import './main.css'
import * as ls from './localStorageHandler.js';
import * as htmlBuilder from './htmlBuilder.js';
import * as eventHandlers from './eventHandlers.js';

const page = (function () {
  ls.init();
  htmlBuilder.init(ls.getProjectTitles());
  eventHandlers.init(); 
})();