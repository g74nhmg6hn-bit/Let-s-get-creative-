// ===== HAND-DRAWN PARTS =====
// Pixel sprites drawn by hand and attached to the skeleton by drawRig():
// fists (side view for punches, front view for a raised guard), footwear that
// rotates with the foot, and costume pieces on the chest. All sprites face right.
// Letters map to colour-ramp levels through each character's palette below.

const FIST_SIDE={cx:0,cy:3,rows:[
 '..bccd..',
 '.bcccddd',
 'bccbcdtT',
 'bcccccTT',
 'bccbcctT',
 'bbcbccTt',
 '.bbbbbt.']};
const FIST_FRONT={cx:3,cy:7,rows:[
 '.tTTTt.',
 'tTTTTTt',
 'bttbttb',
 'bcddcdb',
 'bcdccdb',
 'bbcccdb',
 '.bcccb.',
 '..bbb..']};
const BOOT={cx:4,cy:1,rows:[
 '..bccdd......',
 '.bccccdd.....',
 '.bcclcdd.....',
 '.bccclcddd...',
 'bbcccccccddd.',
 'bbbccccccccdd',
 '1111111111111',
 '.22222222222.']};
const BOOT_BIG={cx:5,cy:1,rows:[
 '..bcccdd........',
 '.bcccccdd.......',
 '.bccecccdd......',
 '.bcccccccdd.....',
 '.bccccccccdddd..',
 'bbcccccccccccdd.',
 'bbbcccccccccccdd',
 'bbbbccccccccccdd',
 '1111111111111111',
 '.22222222222222.']};

// chest pieces (anchor = chest point; +x = front, +y = down the spine)
const DECALS={
 juno:{cx:-1,cy:5,rows:[
  '..p..',
  '.pPp.',
  'pPPPp',
  '.pPp.',
  '.p.p.']},
 grunt:{cx:-1,cy:9,rows:[
  '.......w.w',
  '.......w.w',
  '.......w.w',
  '...LL..W.W',
  '..LL......',
  '.LLLLL....',
  '...LL.....',
  '..LL......',
  '.L........']},
 shield:{cx:-1,cy:6,rows:[
  '.GgggG.',
  'GgyyygG',
  'gyGGGyg',
  'gyGyGyg',
  'gyyGyyg',
  '.gyyyg.',
  '..gyg..',
  '...g...']},
 knife:(()=>{const rows=[];const W=15,Hh=24;for(let j=0;j<Hh;j++){let r='';for(let i=0;i<W;i++){const x0=j*.55;
   let ch='.';if(Math.abs(i-x0-1)<1.6)ch=Math.abs(i-x0-1)<.6?'s':'S';
   const k=j%7;if(j>2&&j<Hh-2&&k<4&&i>=x0-3&&i<x0-.5&&ch==='.')ch=k===0?'K':'h';r+=ch}rows.push(r)}return {cx:4,cy:11,rows}})(),
 boss:(()=>{const rows=[];const W=16,Hh=18;for(let j=0;j<Hh;j++){let r='';for(let i=0;i<W;i++){let ch='.';
   const ca=Math.abs(i-(2+j*.32)),cb=Math.abs(i-(14-j*.42));if(j<11&&(ca<.6||cb<.6))ch=((i+j)%2)?'G':'g';
   const dx=i-7.5,dy=j-12.5,d=Math.hypot(dx,dy);if(d<3.6)ch=d>2.6?'y':'g';if(d<2.6&&((Math.abs(dx+dy*.4)<.7&&dy<.5)||(Math.abs(dx+dy*.4-.8)<.7&&dy>=0)))ch='v';
   r+=ch}rows.push(r)}return {cx:7,cy:6,rows}})()
};

// palettes: char -> [ramp, level]
function partPal(map){const p={},d={};for(const k in map){const [r,l]=map[k];p[k]=M(r,l);d[k]=M(r,Math.max(1,l-(r.glow?0:1)))}return {p,d}}
const skinMap=(sk,tp)=>({b:[sk,1],c:[sk,2],d:[sk,3],e:[sk,4],t:[tp,2],T:[tp,3]});
let PARTS=null;
function initParts(){const J=PAL.juno,Gr=PAL.grunt,S=PAL.shield,K=PAL.knife,Bo=PAL.boss;
 PARTS={
  juno:{fist:partPal(skinMap(J.skin,J.tape)),boot:partPal({b:[J.shoe,1],c:[J.shoe,2],d:[J.shoe,3],e:[J.shoe,4],l:[J.sole,2],'1':[J.sole,2],'2':[J.sole,1]}),
   decal:partPal({p:[J.stripe,2],P:[J.stripe,3]})},
  grunt:{fist:partPal(skinMap(Gr.skin,Gr.tape)),boot:partPal({b:[Gr.boot,1],c:[Gr.boot,2],d:[Gr.boot,3],e:[Gr.boot,4],l:[Gr.lace,3],'1':[Gr.sole,2],'2':[Gr.sole,1]}),
   decal:partPal({L:[Gr.logo,2],w:[Gr.str,3],W:[Gr.str,1]})},
  shield:{fist:partPal({b:[S.glove,1],c:[S.glove,2],d:[S.glove,3],e:[S.glove,4],t:[S.glove,3],T:[S.glove,4]}),boot:partPal({b:[S.boot,1],c:[S.boot,2],d:[S.boot,3],e:[S.boot,4],l:[S.pad,3],'1':[S.belt,1],'2':[S.belt,0]}),
   decal:partPal({g:[S.buck,2],G:[S.buck,4],y:[S.buck,1]})},
  knife:{fist:partPal({b:[K.glove,1],c:[K.glove,2],d:[K.glove,3],e:[K.glove,4],t:[K.skin,2],T:[K.skin,3]}),boot:partPal({b:[K.shoe,1],c:[K.shoe,2],d:[K.shoe,3],e:[K.shoe,4],l:[K.sole,2],'1':[K.sole,2],'2':[K.sole,1]}),
   decal:partPal({s:[K.strap,2],S:[K.strap,1],h:[K.hilt,2],K:[K.hilt,4]})},
  boss:{boot:partPal({b:[Bo.boot,1],c:[Bo.boot,2],d:[Bo.boot,3],e:[Bo.boot,4],l:[Bo.gem,2],'1':[Bo.gold,1],'2':[Bo.gold,0]}),
   decal:partPal({g:[Bo.gold,2],G:[Bo.gold,4],y:[Bo.gold,1],v:[Bo.gem,2]}),bigBoot:true}
 }}
