const fs = require('fs');
let content = fs.readFileSync('src/pages/Chats.jsx', 'utf8');

const overlayBlockStart = content.indexOf('<AnimatePresence>');
const overlayBlockEnd = content.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;
const overlayBlock = content.slice(overlayBlockStart, overlayBlockEnd);

// Remove it from its current position
content = content.replace(overlayBlock, '');

// Insert it right before the last </div>
const lastDivIndex = content.lastIndexOf('</div>');
content = content.slice(0, lastDivIndex) + '\n' + overlayBlock + '\n' + content.slice(lastDivIndex);

fs.writeFileSync('src/pages/Chats.jsx', content);
