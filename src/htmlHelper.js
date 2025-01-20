const createSVG = (pathDrawn) => {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
  const path = document.createElementNS(namespace, 'path');
  path.setAttributeNS(null, 'fill-rule', 'evenodd');
  path.setAttributeNS(null, 'd', pathDrawn);
  svg.appendChild(path);
  return svg;
};

const createPlusCircle = () => {
  pathDrawn = 'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
  return createSVG(pathDrawn);
}

const createInbox = () => {
  pathDrawn = 'M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z';
  return createSVG(pathDrawn);
};
