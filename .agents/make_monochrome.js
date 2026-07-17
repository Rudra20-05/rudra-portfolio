const fs = require('fs');
const path = require('path');

const cssPath = "c:/Users/RUDRA DALVI/OneDrive - Vidyalankar Institute of Technology/Documents/portfolio/style.css";
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Convert rgb/rgba colors to white/gray equivalents
css = css.replace(/rgba\(0,\s*240,\s*255,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(6,\s*182,\s*212,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(124,\s*58,\s*237,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(245,\s*158,\s*11,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(217,\s*119,\s*6,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(139,\s*92,\s*246,/gi, 'rgba(255, 255, 255,');
css = css.replace(/rgba\(236,\s*72,\s*153,/gi, 'rgba(255, 255, 255,');

// 2. Convert specific colorful hexes to pure white/gray
css = css.replace(/#06b6d4/gi, '#ffffff');
css = css.replace(/#00f0ff/gi, '#ffffff');
css = css.replace(/#0ea5e9/gi, '#ffffff');
css = css.replace(/#8b5cf6/gi, '#ffffff');
css = css.replace(/#8f00ff/gi, '#ffffff');
css = css.replace(/#a78bfa/gi, '#ffffff');
css = css.replace(/#7dd3fc/gi, '#a3a3a3');
css = css.replace(/#38bdf8/gi, '#ffffff');
css = css.replace(/#fbbf24/gi, '#ffffff');
css = css.replace(/#7c3aed/gi, '#ffffff');
css = css.replace(/#d97706/gi, '#ffffff');
css = css.replace(/#b45309/gi, '#ffffff');
css = css.replace(/#22c55e/gi, '#ffffff'); // Green status dot to white

// 3. Keep light theme colors aligned with white/black
css = css.replace(/#f8f9fc/gi, '#000000');
css = css.replace(/#eef0f5/gi, '#050505');
css = css.replace(/#e8eaf0/gi, '#0a0a0a');
css = css.replace(/#e0e4f0/gi, '#050505');
css = css.replace(/#d4d8e8/gi, '#0a0a0a');
css = css.replace(/#e8eaf0/gi, '#000000');
css = css.replace(/#eef0f5/gi, '#000000');

// 4. Update flashlight glow gradients to pure white glow
css = css.replace(/rgba\(236,72,153,0\.2\)/gi, 'rgba(255,255,255,0.05)');
css = css.replace(/rgba\(245,158,11,0\.15\)/gi, 'rgba(255,255,255,0.05)');
css = css.replace(/rgba\(0,\s*240,\s*255,0\.12\)/gi, 'rgba(255,255,255,0.05)');

// 5. Update gradient background rules in globe
css = css.replace(/rgba\(8,51,68,0\.06\)/gi, 'rgba(255,255,255,0.01)');
css = css.replace(/rgba\(2,6,23,0\.8\)/gi, 'rgba(0,0,0,0.8)');

// 6. Ensure any remaining background gradients for active/primary buttons are simple white
css = css.replace(/var\(--gradient-primary\)/gi, '#ffffff');
css = css.replace(/var\(--gradient-hero\)/gi, '#ffffff');

fs.writeFileSync(cssPath, css, 'utf8');
console.log("Complete monochrome updates applied successfully!");
