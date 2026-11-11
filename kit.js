// kit.js — the drawing kit for the portfolio's front door (玄関).
// Same family as "Open the box" (箱) and "The factory" (工場): thick ink outline, flat fills, a hard offset ink
// shadow, screentone dots. ROUND characters are models (agents); SQUARE robots are code (hooks, scripts).
// Everything is a pure function of time t (seconds), so a frame can be seeked and captured.
// Palette: ground #F1F2F4, ink #15171C, ONE accent violet #6A4CF5 with its tint #DCD4FF. Kraft only on the box.
(function(){
const INK='#15171C', GROUND='#F1F2F4', PALE='#E7E9ED', GREY='#D3D7DD', MID='#8C929C',
      ACC='#6A4CF5', ACC_L='#DCD4FF', WOOD='#A97C4F', KRAFT='#D6B98A', KRAFT_L='#E3CDA6', KRAFT_D='#B89566';
const r2=v=>Math.round(v*10)/10;
const F='-apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif', M='ui-monospace,SF Mono,Menlo,Consolas,monospace';
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ramp=(t,a,b)=>ease(clamp((t-a)/(b-a),0,1));   // 0 before a, 1 after b, eased between

// a round worker (a model). hat letter = the model. pose: idle | read | cheer | walk
function worker(x,y,t,o={}){
  const s=o.s||1, hat=o.hat||'S', pose=o.pose||'idle', ph=o.ph||0;
  const bob = pose==='read'? Math.sin(t*5+ph)*1.6 : pose==='walk'? Math.abs(Math.sin(t*9+ph))*-3 : Math.sin(t*2+ph)*0.8;
  const look = pose==='read'? Math.sin(t*2.2+ph)*2.2 : (o.look||0);
  const blink = ((t*0.7+ph)%3)<0.08;
  const leg = pose==='walk'? Math.sin(t*9+ph)*5 : 0;
  const cheer = pose==='cheer';
  let arms='';
  if(cheer) arms=`<path d="M-13,2 l-9,-14 M13,2 l9,-14" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
  else arms=`<path d="M-13,5 q-6,6 -3,12 M13,5 q6,6 3,12" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const eyes = blink? `<path d="M${r2(-6+look)},-6 h4 M${r2(2+look)},-6 h4" stroke="${INK}" stroke-width="2"/>`
                    : `<circle cx="${r2(-4+look)}" cy="-6" r="2.3" fill="${INK}"/><circle cx="${r2(4+look)}" cy="-6" r="2.3" fill="${INK}"/>`;
  const mouth = cheer? `<path d="M-4,0 q4,5 8,0" fill="${MID}" stroke="${INK}" stroke-width="1.6"/>` : pose==='read'? `<circle cx="${r2(look*0.5)}" cy="1" r="1.6" fill="${INK}"/>` : `<path d="M-3,0 q3,3 6,0" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  return `<g transform="translate(${r2(x)},${r2(y)}) scale(${s})">
   <ellipse cx="0" cy="34" rx="15" ry="4" fill="rgba(21,23,28,.15)"/>
   <path d="M-6,22 l${r2(-2+leg*0.4)},12 M6,22 l${r2(2-leg*0.4)},12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
   <g transform="translate(0,${r2(bob)})">
    <ellipse cx="0" cy="6" rx="17" ry="18" fill="#fff" stroke="${INK}" stroke-width="2.6"/>
    ${eyes}${mouth}
    <path d="M-16,-6 a16,15 0 0 1 32,0 z" fill="${INK}" stroke="${INK}" stroke-width="2.4"/>
    <rect x="-19" y="-8" width="38" height="5" rx="2.5" fill="${INK}" stroke="${INK}" stroke-width="2.2"/>
    <text x="0" y="-11" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" font-family="${F}">${hat}</text>
    ${arms}
   </g></g>`;
}
// a prop held at the right hand of a worker placed at (x,y)
function prop(kind,x,y,t,ph=0,still=false){
  const sw=still?0:Math.sin(t*6+ph);
  if(kind==='hammer'){ const a=-30+sw*28;
    return `<g transform="translate(${r2(x+20)},${r2(y+12)}) rotate(${r2(a)})">
      <rect x="-2" y="-26" width="4" height="28" rx="2" fill="${WOOD}" stroke="${INK}" stroke-width="1.8"/>
      <rect x="-10" y="-34" width="20" height="11" rx="2" fill="${GREY}" stroke="${INK}" stroke-width="2.2"/></g>`; }
  if(kind==='glass'){ const dx=sw*3;
    return `<g transform="translate(${r2(x+24+dx)},${r2(y+2)})">
      <line x1="5" y1="7" x2="12" y2="16" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="9" fill="${PALE}" fill-opacity=".8" stroke="${INK}" stroke-width="2.6"/></g>`; }
  if(kind==='cards'){ const dy=sw*2;
    return `<g transform="translate(${r2(x+24)},${r2(y+10+dy)}) rotate(8)">
      <rect x="-9" y="-12" width="18" height="22" rx="2" fill="#fff" stroke="${INK}" stroke-width="2"/>
      <rect x="-6" y="-15" width="18" height="22" rx="2" fill="${PALE}" stroke="${INK}" stroke-width="2"/>
      <path d="M-2,-9 h10 M-2,-5 h7" stroke="${INK}" stroke-width="1.3"/>
      <circle cx="3" cy="-14" r="2.4" fill="${INK}"/></g>`; }
  return '';
}
function agent(x,y,t,o={}){ return worker(x,y,t,o) + (o.prop?prop(o.prop,x,y,t,o.ph||0,o.still):''); }

// a square robot (code). headband = a guard. arm: 0 = down, 1 = palm up ("wait")
function bot(x,y,t,o={}){
  const s=o.s||1, band=o.band!==false, arm=o.arm||0;
  const bob = Math.sin(t*2)*0.6, tail = Math.sin(t*7)*4, blink = (t%2.7)<0.1;
  const face = (blink? `<path d="M-8,-20 h5 M3,-20 h5" stroke="#fff" stroke-width="2.4"/>` : `<rect x="-8" y="-23" width="5" height="6" rx="1" fill="#fff"/><rect x="3" y="-23" width="5" height="6" rx="1" fill="#fff"/>`)+`<path d="M-4,-12 h8" stroke="#fff" stroke-width="2"/>`;
  const ay=r2(8-arm*20), ax=r2(-8-arm*6);
  return `<g transform="translate(${r2(x)},${r2(y)}) scale(${s})">
   <ellipse cx="0" cy="34" rx="18" ry="4" fill="rgba(21,23,28,.15)"/>
   <path d="M-7,20 l0,14 M7,20 l0,14" stroke="${INK}" stroke-width="3.2" stroke-linecap="square"/>
   <g transform="translate(0,${r2(bob)})">
    <line x1="0" y1="-36" x2="0" y2="-44" stroke="${INK}" stroke-width="2.4"/><circle cx="0" cy="-46" r="3.2" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <rect x="-16" y="-36" width="32" height="30" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.6"/>
    <rect x="-12" y="-30" width="24" height="20" rx="2" fill="${INK}"/>
    ${face}
    ${band? `<rect x="-17" y="-38" width="34" height="6" fill="${INK}" stroke="${INK}" stroke-width="2"/>
      <path d="M17,-36 l9,${r2(-3+tail*0.3)} M17,-34 l8,${r2(4+tail*0.4)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`:''}
    <rect x="-14" y="-4" width="28" height="25" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.6"/>
    <rect x="-7" y="2" width="14" height="9" rx="1.5" fill="${GREY}" stroke="${INK}" stroke-width="1.6"/>
    <path d="M-14,2 L${r2(-14+ax)},${ay} M14,2 l8,8" stroke="${INK}" stroke-width="3" stroke-linecap="square"/>
    ${arm>0.5?`<rect x="${r2(-14+ax-5)}" y="${r2(ay-9)}" width="10" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="2"/>`:''}
   </g></g>`;
}
// a person: not round, not square (the one who approves)
function human(x,y,t,o={}){ const s=o.s||1, bob=Math.sin(t*2)*0.8, cheer=o.cheer;
  return `<g transform="translate(${r2(x)},${r2(y)}) scale(${s})">
   <ellipse cx="0" cy="44" rx="17" ry="4" fill="rgba(21,23,28,.15)"/>
   <path d="M-6,26 l-2,18 M6,26 l2,18" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>
   <g transform="translate(0,${r2(bob)})">
    <path d="M-15,28 q0,-26 15,-26 q15,0 15,26 z" fill="${MID}" stroke="${INK}" stroke-width="2.6"/>
    ${cheer?`<path d="M-13,10 q-7,8 -2,14 M13,10 l10,-14" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`
           :`<path d="M-13,10 q-7,8 -2,14 M13,10 q7,8 2,14" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
    <circle cx="0" cy="-12" r="13" fill="#F1DCC6" stroke="${INK}" stroke-width="2.6"/>
    <path d="M-13,-14 q2,-14 14,-13 q12,0 12,12 q-8,-6 -14,-6 q-6,1 -12,7 z" fill="${INK}"/>
    <circle cx="-4.5" cy="-11" r="1.9" fill="${INK}"/><circle cx="4.5" cy="-11" r="1.9" fill="${INK}"/>
    <path d="M-3,-5 q3,3 6,0" fill="none" stroke="${INK}" stroke-width="1.6"/>
   </g></g>`; }
// a door with a sign. open in [0,1]
function door(x,y,w,h,label,open=0){
  return `<g transform="translate(${r2(x)},${r2(y)})">
   <rect x="-8" y="-8" width="${w+16}" height="${h+8}" rx="4" fill="${INK}"/>
   <rect x="0" y="0" width="${w}" height="${h}" fill="#2B2F37" stroke="${INK}" stroke-width="2.4"/>
   <rect x="0" y="0" width="${r2(w*(1-open*0.7))}" height="${h}" fill="#5F6672" stroke="${INK}" stroke-width="2.4"/>
   <circle cx="${r2(w*(1-open*0.7)-9)}" cy="${r2(h*0.55)}" r="3.4" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
   <rect x="${w/2-30}" y="-36" width="60" height="24" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
   <text x="${w/2}" y="-19" text-anchor="middle" font-size="15" font-weight="900" font-family="${M}" fill="${INK}">${label}</text></g>`; }
// a pull request: a sheet with a "PR" tag. rot in degrees
function pr(x,y,o={}){ const s=o.s||1, rot=o.rot||0;
  return `<g transform="translate(${r2(x)},${r2(y)}) rotate(${r2(rot)}) scale(${s})">
   <rect x="-14" y="-17" width="32" height="38" rx="3" fill="${INK}"/>
   <rect x="-17" y="-20" width="32" height="38" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
   <path d="M-11,-2 h20 M-11,4 h16 M-11,10 h18" stroke="${INK}" stroke-width="1.6" opacity=".55"/>
   <rect x="-12" y="-16" width="20" height="11" rx="2" fill="${INK}"/>
   <text x="-2" y="-7.5" text-anchor="middle" font-size="8.5" font-weight="900" fill="#fff" font-family="${F}">PR</text></g>`; }
// a small label under a character
function tag(x,y,name,o={}){ const w=o.w||(name.length*7.6+16);
  return `<g transform="translate(${r2(x-w/2)},${r2(y)})"><rect width="${w}" height="20" rx="4" fill="${o.fill||'#fff'}" stroke="${INK}" stroke-width="1.8"/>
   <text x="${w/2}" y="14.5" text-anchor="middle" font-size="12" font-weight="800" font-family="${M}" fill="${INK}">${name}</text></g>`; }
// a check mark in a ring
function check(x,y,s=1){ return `<g transform="translate(${r2(x)},${r2(y)}) scale(${r2(s*100)/100})">
   <circle r="13" fill="${INK}"/><path d="M-6,0 l4,4.5 l8,-9" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>`; }

// ---- the three beats of the welcome line. each is f(local time u), u in seconds since the beat began.
// u is clamped by the caller; at u >= the beat's END the drawing holds its final state.
// viewBox 0 0 360 190 for all three.
const BEAT_END=[1.6, 2.6, 3.8];
function beatTeam(u,t){ // a small team: one craft each (builder, breaker, organizer, navigator + a swarm of small readers)
  const crew=[['O','hammer',44],['O','hammer2',110],['S','cards',176],['O','glass',242]];
  let g='';
  crew.forEach(([hat,p,x],i)=>{ const k=ramp(u,0.15*i,0.15*i+0.45); if(k<=0) return;
    const y=118+(1-k)*14; g+=`<g opacity="${r2(k)}">`+(p==='hammer2'
      ? worker(x,y,t,{hat,ph:i})+`<g transform="translate(${x+18},${y+16}) rotate(${r2(-55+Math.sin(t*3+i)*6)})"><rect x="-2" y="-30" width="4" height="32" rx="2" fill="${WOOD}" stroke="${INK}" stroke-width="1.8"/><rect x="-12" y="-40" width="24" height="14" rx="3" fill="${MID}" stroke="${INK}" stroke-width="2.2"/></g>`
      : agent(x,y,t,{hat,prop:p,ph:i}))+`</g>`; });
  const ks=ramp(u,0.75,1.2);
  if(ks>0){ g+=`<g opacity="${r2(ks)}">`; [[306,112],[332,112],[319,140]].forEach(([x,y],j)=>{ g+=worker(x,y,t,{hat:'H',s:0.55,pose:'read',ph:j*1.7}); }); g+='</g>'; }
  return g;
}
function beatReview(u,t){ // the one who wrote it hands the PR across a line to one who did not
  let g='';
  g+=`<line x1="180" y1="40" x2="180" y2="176" stroke="${INK}" stroke-width="2.4" stroke-dasharray="7 6" opacity=".55"/>`;
  g+=agent(78,108,t,{hat:'O',prop:'hammer',still:u>0.4});
  g+=tag(78,160,'wrote it');
  const look = u<0.9? 0 : 2.5;
  g+=worker(286,108,t,{hat:'O',look,pose:u>1.8&&u<2.3?'cheer':'idle'});
  g+=tag(286,160,'reviews it');
  // the PR travels from the writer to the reviewer over the line
  const k=ramp(u,0.25,1.05), px=112+k*(238-112), py=96-Math.sin(k*Math.PI)*46;
  g+=pr(px,py,{rot:-6+k*10});
  // the magnifier sweeps over it, then a check lands
  if(u>1.0){ const sw=Math.min(1,(u-1.0)/0.8), gx=238+Math.sin(sw*Math.PI*2)*10;
    g+=`<g transform="translate(${r2(gx+4)},${r2(96)})"><line x1="6" y1="8" x2="16" y2="20" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><circle r="12" fill="${PALE}" fill-opacity=".55" stroke="${INK}" stroke-width="2.8"/></g>`; }
  const kc=ramp(u,1.85,2.15); if(kc>0) g+=check(262,64,0.6+0.4*kc);
  return g;
}
function beatGuard(u,t){ // a PR reaches main; the guard says wait; a person approves; the door opens
  let g='';
  const op=ramp(u,2.6,3.0);
  g+=door(286,52,58,118,'main',op);
  const kp=ramp(u,1.3,1.7);
  if(kp>0) g+=`<g opacity="${r2(kp)}">`+human(46,118+(1-kp)*10,t,{cheer:u>1.9})+tag(46,168,'a person')+`</g>`;
  // the PR: slides in, waits at the guard; drawn first so it passes BEHIND the guard, then goes through the open door
  const k1=ramp(u,0,0.55), k2=ramp(u,3.0,3.7);
  let px=96+k1*44 + k2*(316-140), op2=1-ramp(u,3.55,3.8);
  if(op2>0) g+=`<g opacity="${r2(op2)}">`+pr(px,146,{rot:k2>0?0:-4})+`</g>`;
  const wait=u>0.55&&u<2.35;
  g+=bot(198,122,t,{arm:wait?1:0});
  g+=tag(198,166,'guard hook');
  if(wait) g+=`<g transform="translate(150,40) rotate(-6)"><rect x="3" y="3" width="64" height="26" rx="5" fill="${INK}"/><rect width="64" height="26" rx="5" fill="#fff" stroke="${INK}" stroke-width="2.4"/><text x="32" y="18.5" text-anchor="middle" font-size="14" font-weight="900" font-style="italic" font-family="${F}" fill="${INK}">wait</text></g>`;
  const ka=ramp(u,2.25,2.5);
  if(ka>0) g+=`<g transform="translate(150,40) rotate(-6)" opacity="${r2(ka)}"><rect x="3" y="3" width="76" height="26" rx="13" fill="${INK}"/><rect width="76" height="26" rx="13" fill="${ACC}" stroke="${INK}" stroke-width="2.4"/><text x="38" y="18" text-anchor="middle" font-size="13.5" font-weight="900" font-family="${F}" fill="#fff">approved</text></g>`;
  return g;
}

// ---- project art (the cards). each is f(t), viewBox 0 0 360 190
function artBox(t){
  let g='';
  g+=`<g transform="translate(70,70)">
    <path d="M0,40 L-36,8 L60,8 L96,40 Z" fill="${KRAFT_L}" stroke="${INK}" stroke-width="2.6"/>
    <path d="M220,40 L256,8 L160,8 L124,40 Z" fill="${KRAFT_L}" stroke="${INK}" stroke-width="2.6"/></g>`;
  [[118,'O','hammer'],[170,'S','cards'],[222,'O','glass']].forEach(([x,h,p],i)=>{ g+=agent(x,92+Math.sin(t*2.2+i)*2,t,{hat:h,prop:p,ph:i}); });
  g+=`<rect x="70" y="110" width="220" height="72" fill="${KRAFT}" stroke="${INK}" stroke-width="2.8"/>
    <rect x="70" y="110" width="220" height="12" fill="${KRAFT_D}" stroke="${INK}" stroke-width="2.4"/>
    <rect x="104" y="136" width="152" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
    <text x="180" y="156" text-anchor="middle" font-size="12.5" font-weight="800" font-family="${M}" fill="${INK}">claude-setup-guide</text>`;
  return g;
}
function artFactory(t){
  let g='';
  g+=`<rect x="22" y="130" width="316" height="22" rx="11" fill="${PALE}" stroke="${INK}" stroke-width="2.6"/>`;
  for(let i=0;i<16;i++){ const x=36+((i*20+t*30)%292); g+=`<circle cx="${r2(x)}" cy="146" r="2" fill="${MID}"/>`; }
  g+=`<g transform="translate(34,64)"><rect x="4" y="4" width="54" height="58" rx="6" fill="${INK}"/><rect width="54" height="58" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
     <path d="M16,26 l22,12 M16,38 l22,-12" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="14" cy="24" r="4" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="14" cy="40" r="4" fill="none" stroke="${INK}" stroke-width="2"/></g>`;
  [118,152,186].forEach((x,i)=>{ g+=worker(x,94,t,{hat:'S',pose:'read',ph:i*1.3,s:0.9}); });
  // the gate: a square stamper with PASS
  const hit=Math.max(0,Math.sin(t*2.4)); const off=-14*(1-hit);
  g+=`<g transform="translate(252,118)"><rect x="-22" y="-62" width="44" height="34" rx="5" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
     <rect x="-16" y="-56" width="32" height="18" rx="2" fill="${INK}"/><rect x="-10" y="-52" width="5" height="6" fill="#fff"/><rect x="5" y="-52" width="5" height="6" fill="#fff"/>
     <rect x="-4" y="-28" width="8" height="${r2(Math.max(2,14+off))}" fill="${GREY}" stroke="${INK}" stroke-width="2"/>
     <g transform="translate(0,${r2(off)})"><rect x="-18" y="-14" width="36" height="13" rx="3" fill="${INK}"/><text x="0" y="-4" text-anchor="middle" font-size="9" font-weight="900" fill="#fff" font-family="${F}">PASS</text></g></g>`;
  g+=bot(312,100,t,{s:0.8});
  return g;
}
const ART={box:artBox,factory:artFactory};

window.KIT={INK,GROUND,PALE,GREY,MID,ACC,ACC_L,F,M,ease,clamp,ramp,worker,agent,bot,human,door,pr,tag,check,BEAT_END,beats:[beatTeam,beatReview,beatGuard],ART};
})();
