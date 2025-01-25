import './main.css'
import * as ls from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';
import * as eventHandlers from './eventHandlers.js';

const page = (function () {
  ls.init();
  htmlHandler.init(ls.getProjectTitles());
  eventHandlers.init(); 
})();