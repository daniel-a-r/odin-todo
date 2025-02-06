import './main.css';
import * as storage from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';
import * as eventHandlers from './eventHandlers.js';

(() => {
  storage.init();

  if (storage.getSelectedProject()) {
    const projIndx = storage.getSelectedProject();
    const projObj = storage.getProject(projIndx);
    htmlHandler.init(storage.getProjectTitles(), projIndx, projObj);
  } else {
    htmlHandler.init(storage.getProjectTitles());
  }

  eventHandlers.init();
})();
