const fs = require('fs');
let content = fs.readFileSync('src/pages/Chats.jsx', 'utf8');

if (!content.includes("import { createPortal }")) {
  content = content.replace("import React, { useEffect, useState, useRef } from 'react';", "import React, { useEffect, useState, useRef } from 'react';\nimport { createPortal } from 'react-dom';");
}

const overlayStart = content.indexOf('{showAcceptMascot && (');
const overlayEnd = content.indexOf('</div>\n      )}') + '</div>\n      )}'.length;

const overlayStr = content.slice(overlayStart, overlayEnd);

const newOverlay = `      {showAcceptMascot && createPortal(
        <div 
          className="accept-mascot-overlay"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(248, 244, 237, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999999,
            pointerEvents: 'none'
          }}
        >
          <img src={MascotImg} alt="Connection Accepted" style={{ width: '180px', height: 'auto', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.05))' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-teal)', marginTop: '24px', fontWeight: 'normal' }}>Thread Connected.</h2>
        </div>,
        document.body
      )}`;

content = content.replace(overlayStr, newOverlay);

fs.writeFileSync('src/pages/Chats.jsx', content);
