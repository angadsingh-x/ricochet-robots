(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[1,2,4,8],t={1:4,4:1,2:8,8:2},n={1:{dr:-1,dc:0},4:{dr:1,dc:0},2:{dr:0,dc:1},8:{dr:0,dc:-1}},r=[`red`,`blue`,`green`,`yellow`],i=class e{walls;targets;constructor(){this.walls=[],this.targets=[];for(let e=0;e<16;e++)this.walls[e]=Array(16).fill(0);this.addBorderWalls(),this.addCenterBlock()}addBorderWalls(){for(let e=0;e<16;e++)this.walls[0][e]|=1,this.walls[15][e]|=4,this.walls[e][0]|=8,this.walls[e][15]|=2}addCenterBlock(){this.walls[7][7]|=9,this.walls[7][8]|=3,this.walls[8][7]|=12,this.walls[8][8]|=6,this.walls[6][7]|=4,this.walls[6][8]|=4,this.walls[9][7]|=1,this.walls[9][8]|=1,this.walls[7][6]|=2,this.walls[8][6]|=2,this.walls[7][9]|=8,this.walls[8][9]|=8}addWall(e,n,r){this.walls[e][n]|=r;let i=t[r],a=r===1?e-1:r===4?e+1:e,o=r===8?n-1:r===2?n+1:n;a>=0&&a<16&&o>=0&&o<16&&(this.walls[a][o]|=i)}hasWall(e,t,n){return(this.walls[e][t]&n)!==0}static fromQuadrants(t,n=[0,1,2,3]){let r=new e,i=[{dr:0,dc:0},{dr:0,dc:8},{dr:8,dc:0},{dr:8,dc:8}];for(let e=0;e<4;e++){let o=t[e],c=n[e],l=i[e];for(let e of o.walls){let{row:t,col:n,side:i}=s(e,c);r.addWall(t+l.dr,n+l.dc,i)}for(let e of o.targets){let{row:t,col:n}=a(e.pos,c);r.targets.push({pos:{row:t+l.dr,col:n+l.dc},color:e.color,shape:e.shape})}}return r}};function a(e,t){let{row:n,col:r}=e;for(let e=0;e<t;e++){let e=r,t=7-n;n=e,r=t}return{row:n,col:r}}function o(e,t){let n=[1,2,4,8],r=n.indexOf(e);return r=(r+t)%4,n[r]}function s(e,t){let n=a({row:e.row,col:e.col},t),r=o(e.side,t);return{row:n.row,col:n.col,side:r}}var c=[[{walls:[{row:1,col:2,side:4},{row:1,col:2,side:2},{row:2,col:5,side:4},{row:2,col:5,side:8},{row:3,col:1,side:2},{row:3,col:1,side:4},{row:4,col:6,side:4},{row:4,col:6,side:2},{row:5,col:3,side:1},{row:5,col:3,side:2},{row:6,col:0,side:4},{row:6,col:5,side:4},{row:6,col:5,side:8}],targets:[{pos:{row:1,col:2},color:`red`,shape:`circle`},{pos:{row:2,col:5},color:`blue`,shape:`triangle`},{pos:{row:3,col:1},color:`green`,shape:`square`},{pos:{row:5,col:3},color:`yellow`,shape:`diamond`},{pos:{row:6,col:5},color:`red`,shape:`star`}]},{walls:[{row:0,col:3,side:2},{row:1,col:5,side:4},{row:1,col:5,side:8},{row:2,col:1,side:4},{row:2,col:1,side:2},{row:3,col:6,side:1},{row:3,col:6,side:8},{row:4,col:3,side:4},{row:4,col:3,side:2},{row:5,col:7,side:4},{row:6,col:2,side:1},{row:6,col:2,side:2}],targets:[{pos:{row:1,col:5},color:`yellow`,shape:`circle`},{pos:{row:2,col:1},color:`red`,shape:`triangle`},{pos:{row:3,col:6},color:`green`,shape:`diamond`},{pos:{row:4,col:3},color:`blue`,shape:`star`},{pos:{row:6,col:2},color:`yellow`,shape:`square`}]}],[{walls:[{row:1,col:4,side:4},{row:1,col:4,side:8},{row:2,col:6,side:4},{row:2,col:6,side:2},{row:3,col:2,side:1},{row:3,col:2,side:2},{row:4,col:0,side:4},{row:5,col:5,side:4},{row:5,col:5,side:8},{row:6,col:3,side:1},{row:6,col:3,side:8},{row:7,col:6,side:1}],targets:[{pos:{row:1,col:4},color:`blue`,shape:`circle`},{pos:{row:2,col:6},color:`red`,shape:`diamond`},{pos:{row:3,col:2},color:`yellow`,shape:`triangle`},{pos:{row:5,col:5},color:`green`,shape:`star`},{pos:{row:6,col:3},color:`blue`,shape:`square`}]},{walls:[{row:0,col:5,side:2},{row:1,col:1,side:4},{row:1,col:1,side:2},{row:2,col:4,side:1},{row:2,col:4,side:8},{row:3,col:7,side:4},{row:4,col:2,side:4},{row:4,col:2,side:2},{row:5,col:6,side:1},{row:5,col:6,side:2},{row:6,col:4,side:4},{row:6,col:4,side:8}],targets:[{pos:{row:1,col:1},color:`green`,shape:`circle`},{pos:{row:2,col:4},color:`yellow`,shape:`diamond`},{pos:{row:4,col:2},color:`red`,shape:`square`},{pos:{row:5,col:6},color:`blue`,shape:`triangle`},{pos:{row:6,col:4},color:`green`,shape:`star`}]}],[{walls:[{row:0,col:4,side:2},{row:1,col:6,side:4},{row:1,col:6,side:8},{row:2,col:3,side:4},{row:2,col:3,side:2},{row:3,col:0,side:4},{row:4,col:5,side:1},{row:4,col:5,side:8},{row:5,col:1,side:4},{row:5,col:1,side:2},{row:6,col:7,side:4},{row:7,col:4,side:1}],targets:[{pos:{row:1,col:6},color:`yellow`,shape:`star`},{pos:{row:2,col:3},color:`blue`,shape:`diamond`},{pos:{row:4,col:5},color:`red`,shape:`circle`},{pos:{row:5,col:1},color:`green`,shape:`triangle`}]},{walls:[{row:1,col:3,side:4},{row:1,col:3,side:8},{row:2,col:7,side:4},{row:3,col:5,side:1},{row:3,col:5,side:2},{row:4,col:1,side:4},{row:4,col:1,side:8},{row:5,col:4,side:4},{row:5,col:4,side:2},{row:6,col:6,side:1},{row:6,col:6,side:8}],targets:[{pos:{row:1,col:3},color:`red`,shape:`triangle`},{pos:{row:3,col:5},color:`blue`,shape:`square`},{pos:{row:4,col:1},color:`yellow`,shape:`circle`},{pos:{row:5,col:4},color:`green`,shape:`diamond`},{pos:{row:6,col:6},color:`red`,shape:`star`}]}],[{walls:[{row:0,col:2,side:2},{row:1,col:5,side:1},{row:1,col:5,side:2},{row:2,col:0,side:4},{row:3,col:3,side:4},{row:3,col:3,side:8},{row:4,col:7,side:4},{row:5,col:2,side:1},{row:5,col:2,side:8},{row:6,col:5,side:4},{row:6,col:5,side:2}],targets:[{pos:{row:1,col:5},color:`green`,shape:`star`},{pos:{row:3,col:3},color:`blue`,shape:`circle`},{pos:{row:5,col:2},color:`red`,shape:`diamond`},{pos:{row:6,col:5},color:`yellow`,shape:`triangle`}]},{walls:[{row:1,col:1,side:4},{row:1,col:1,side:8},{row:2,col:6,side:1},{row:2,col:6,side:2},{row:3,col:4,side:4},{row:3,col:4,side:8},{row:4,col:2,side:1},{row:4,col:2,side:2},{row:5,col:5,side:4},{row:5,col:5,side:8},{row:6,col:0,side:4},{row:7,col:3,side:1}],targets:[{pos:{row:1,col:1},color:`yellow`,shape:`square`},{pos:{row:2,col:6},color:`green`,shape:`circle`},{pos:{row:3,col:4},color:`red`,shape:`triangle`},{pos:{row:5,col:5},color:`blue`,shape:`diamond`}]}]];function l(){let e=[0,1,2,3];u(e);let t=[],n=[];for(let r=0;r<4;r++){let i=c[e[r]],a=i[Math.floor(Math.random()*i.length)];t.push(a),n.push(r)}return{quadrants:t,rotations:n}}function u(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}function d(e,t,i,a){let o={...t[i]},s=n[a],c=r.filter(e=>e!==i).map(e=>t[e]);for(;!e.hasWall(o.row,o.col,a);){let e=o.row+s.dr,t=o.col+s.dc;if(e<0||e>=16||t<0||t>=16||c.some(n=>n.row===e&&n.col===t))break;o.row=e,o.col=t}return o}function f(e){let t=new Set;for(let e=7;e<=8;e++)for(let n=7;n<=8;n++)t.add(`${e},${n}`);let n={};for(let e of r){let r,i;do r=Math.floor(Math.random()*16),i=Math.floor(Math.random()*16);while(t.has(`${r},${i}`));t.add(`${r},${i}`),n[e]={row:r,col:i}}return n}function p(e,t,n){let r=e[t];return r.row===n.row&&r.col===n.col}function m(t,n,i,a,o=15){let s=e=>r.map(t=>`${e[t].row},${e[t].col}`).join(`|`),c=s(n);if(n[i].row===a.row&&n[i].col===a.col)return[];let l=new Set;l.add(c);let u=[{robots:n,moves:[]}];for(let n=0;n<o;n++){let n=[];for(let{robots:o,moves:c}of u)for(let u of r)for(let r of e){let e=d(t,o,u,r),f=o[u];if(e.row===f.row&&e.col===f.col)continue;let p={...o,[u]:e},m=s(p);if(l.has(m))continue;l.add(m);let h=[...c,{color:u,from:f,to:e}];if(u===i&&e.row===a.row&&e.col===a.col)return h;n.push({robots:p,moves:h})}if(u=n,l.size>2e6)return null}return null}var h={red:`#e53e3e`,blue:`#3182ce`,green:`#38a169`,yellow:`#d69e2e`},g={red:`#c53030`,blue:`#2b6cb0`,green:`#2f855a`,yellow:`#b7791f`},_={red:`rgba(229, 62, 62, 0.3)`,blue:`rgba(49, 130, 206, 0.3)`,green:`rgba(56, 161, 105, 0.3)`,yellow:`rgba(214, 158, 46, 0.3)`},v={red:`#e53e3e`,blue:`#3182ce`,green:`#38a169`,yellow:`#d69e2e`},y=class{canvas;ctx;cellSize=0;offsetX=0;offsetY=0;animating=!1;animRobot=null;animFrom=null;animTo=null;animProgress=0;animCallback=null;constructor(e){this.canvas=e,this.ctx=e.getContext(`2d`)}resize(){let e=window.devicePixelRatio||1,t=this.canvas.parentElement,n=Math.min(t.clientWidth,t.clientHeight,700);this.canvas.width=n*e,this.canvas.height=n*e,this.canvas.style.width=`${n}px`,this.canvas.style.height=`${n}px`,this.ctx.setTransform(e,0,0,e,0,0),this.cellSize=(n-24)/16,this.offsetX=12,this.offsetY=12}getCellFromPixel(e,t){let n=Math.floor((e-this.offsetX)/this.cellSize),r=Math.floor((t-this.offsetY)/this.cellSize);return r>=0&&r<16&&n>=0&&n<16?{row:r,col:n}:null}animateMove(e,t,n,r){this.animating=!0,this.animRobot=e,this.animFrom=t,this.animTo=n,this.animProgress=0,this.animCallback=r;let i=performance.now(),a=()=>{this.animating=!1,this.animRobot=null,this.animFrom=null,this.animTo=null,this.animCallback?.()},o=e=>{this.animProgress=Math.min((e-i)/150,1),this.animProgress<1?requestAnimationFrame(o):a()};requestAnimationFrame(o),setTimeout(()=>{this.animating&&this.animRobot===e&&a()},200)}draw(e,t,n,r,i=[]){let a=this.ctx,o=this.cellSize,s=this.offsetX,c=this.offsetY;a.fillStyle=`#1a1a2e`,a.fillRect(0,0,this.canvas.width,this.canvas.height),a.fillStyle=`#16213e`,a.fillRect(s,c,o*16,o*16),a.strokeStyle=`rgba(255, 255, 255, 0.12)`,a.lineWidth=1;for(let e=0;e<=16;e++)a.beginPath(),a.moveTo(s+e*o,c),a.lineTo(s+e*o,c+16*o),a.stroke(),a.beginPath(),a.moveTo(s,c+e*o),a.lineTo(s+16*o,c+e*o),a.stroke();a.fillStyle=`#0f0f23`,a.fillRect(s+7*o,c+7*o,2*o,2*o),a.strokeStyle=`#4a5568`,a.lineWidth=2,a.strokeRect(s+7*o,c+7*o,2*o,2*o),n&&this.drawTarget(n),i.length>0&&this.drawTraces(i),this.drawWalls(e),this.drawRobots(t,r)}drawTarget(e){let t=this.ctx,n=this.cellSize,r=this.offsetX,i=this.offsetY,a=r+e.pos.col*n,o=i+e.pos.row*n;t.fillStyle=_[e.color],t.fillRect(a+1,o+1,n-2,n-2);let s=a+n/2,c=o+n/2,l=n*.25;switch(t.fillStyle=v[e.color],t.strokeStyle=v[e.color],t.lineWidth=1.5,e.shape){case`circle`:t.beginPath(),t.arc(s,c,l,0,Math.PI*2),t.stroke();break;case`triangle`:t.beginPath(),t.moveTo(s,c-l),t.lineTo(s+l,c+l),t.lineTo(s-l,c+l),t.closePath(),t.stroke();break;case`square`:t.strokeRect(s-l,c-l,l*2,l*2);break;case`diamond`:t.beginPath(),t.moveTo(s,c-l),t.lineTo(s+l,c),t.lineTo(s,c+l),t.lineTo(s-l,c),t.closePath(),t.stroke();break;case`star`:this.drawStar(s,c,l);break}}drawStar(e,t,n){let r=this.ctx,i=n,a=n*.45;r.beginPath();for(let n=0;n<10;n++){let o=n%2==0?i:a,s=n*Math.PI/5-Math.PI/2,c=e+Math.cos(s)*o,l=t+Math.sin(s)*o;n===0?r.moveTo(c,l):r.lineTo(c,l)}r.closePath(),r.stroke()}drawTraces(e){let t=this.ctx,n=this.cellSize,r=this.offsetX,i=this.offsetY,a={red:`rgba(229, 62, 62, 0.45)`,blue:`rgba(49, 130, 206, 0.45)`,green:`rgba(56, 161, 105, 0.45)`,yellow:`rgba(214, 158, 46, 0.45)`};for(let o=0;o<e.length;o++){let s=e[o],c=a[s.color],l=r+s.from.col*n+n/2,u=i+s.from.row*n+n/2,d=r+s.to.col*n+n/2,f=i+s.to.row*n+n/2;t.strokeStyle=c,t.lineWidth=n*.18,t.lineCap=`round`,t.setLineDash([n*.15,n*.1]),t.beginPath(),t.moveTo(l,u),t.lineTo(d,f),t.stroke(),t.setLineDash([]);let p=d-l,m=f-u,h=Math.sqrt(p*p+m*m);if(h>0){let e=p/h,r=m/h,i=n*.3,a=d,o=f;t.fillStyle=c,t.beginPath(),t.moveTo(a,o),t.lineTo(a-e*i-r*i*.5,o-r*i+e*i*.5),t.lineTo(a-e*i+r*i*.5,o-r*i-e*i*.5),t.closePath(),t.fill()}t.fillStyle=`rgba(255, 255, 255, 0.85)`,t.font=`bold ${Math.round(n*.32)}px system-ui, sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`;let g=(l+d)/2,_=(u+f)/2,v=String(o+1),y=n*.22;t.fillStyle=`rgba(0, 0, 0, 0.6)`,t.beginPath(),t.arc(g,_,y,0,Math.PI*2),t.fill(),t.fillStyle=`rgba(255, 255, 255, 0.9)`,t.fillText(v,g,_)}}drawWalls(e){let t=this.ctx,n=this.cellSize,r=this.offsetX,i=this.offsetY;t.strokeStyle=`#f6ad55`,t.lineWidth=3,t.lineCap=`round`;for(let a=0;a<16;a++)for(let o=0;o<16;o++){let s=r+o*n,c=i+a*n,l=e.walls[a][o];l&1&&a>0&&(t.beginPath(),t.moveTo(s,c),t.lineTo(s+n,c),t.stroke()),l&4&&a<15&&(t.beginPath(),t.moveTo(s,c+n),t.lineTo(s+n,c+n),t.stroke()),l&8&&o>0&&(t.beginPath(),t.moveTo(s,c),t.lineTo(s,c+n),t.stroke()),l&2&&o<15&&(t.beginPath(),t.moveTo(s+n,c),t.lineTo(s+n,c+n),t.stroke())}t.strokeStyle=`#f6ad55`,t.lineWidth=4,t.strokeRect(r,i,n*16,n*16)}drawRobots(e,t){let n=this.ctx,r=this.cellSize,i=this.offsetX,a=this.offsetY;for(let o of[`red`,`blue`,`green`,`yellow`]){let s=e[o];if(this.animating&&this.animRobot===o&&this.animFrom&&this.animTo){let e=b(this.animProgress);s={row:this.animFrom.row+(this.animTo.row-this.animFrom.row)*e,col:this.animFrom.col+(this.animTo.col-this.animFrom.col)*e}}let c=i+s.col*r+r/2,l=a+s.row*r+r/2,u=r*.35;o===t&&(n.shadowColor=h[o],n.shadowBlur=15),n.beginPath(),n.arc(c,l,u,0,Math.PI*2),n.fillStyle=h[o],n.fill(),n.strokeStyle=g[o],n.lineWidth=2,n.stroke(),n.beginPath(),n.arc(c-u*.2,l-u*.2,u*.4,0,Math.PI*2),n.fillStyle=`rgba(255,255,255,0.25)`,n.fill(),n.shadowColor=`transparent`,n.shadowBlur=0}}};function b(e){return 1-(1-e)**3}var x=class{board;robots;initialRobots;currentTarget;selectedRobot=null;moves=[];solved=!1;optimalMoves=null;renderer;canvas;onUpdate;animating=!1;targetIndex=0;allTargets=[];constructor(e,t){this.canvas=e,this.renderer=new y(e),this.onUpdate=t,this.newGame(),this.setupInput()}newGame(){let{quadrants:e,rotations:t}=l();this.board=i.fromQuadrants(e,t),this.allTargets=[...this.board.targets],C(this.allTargets),this.targetIndex=0,this.robots=f(this.board),this.nextTarget()}nextTarget(){this.targetIndex>=this.allTargets.length&&(C(this.allTargets),this.targetIndex=0),this.currentTarget=this.allTargets[this.targetIndex++],this.initialRobots=S(this.robots),this.moves=[],this.solved=!1,this.optimalMoves=null,this.selectedRobot=this.currentTarget.color,this.redraw(),this.onUpdate()}resetPuzzle(){this.robots=S(this.initialRobots),this.moves=[],this.solved=!1,this.selectedRobot=this.currentTarget.color,this.redraw(),this.onUpdate()}undo(){if(this.moves.length===0||this.solved)return;let e=this.moves.pop();this.robots[e.color]={...e.from},this.redraw(),this.onUpdate()}moveRobot(e){if(!this.selectedRobot||this.solved||this.animating)return;let t=this.selectedRobot,n={...this.robots[t]},r=d(this.board,this.robots,t,e);if(r.row===n.row&&r.col===n.col)return;this.animating=!0,this.renderer.animateMove(t,n,r,()=>{this.robots[t]=r,this.moves.push({color:t,from:n,to:r}),this.animating=!1,p(this.robots,this.currentTarget.color,this.currentTarget.pos)&&(this.solved=!0),this.redraw(),this.onUpdate()});let i=()=>{this.animating&&(this.redraw(),requestAnimationFrame(i))};requestAnimationFrame(i)}showSolution(){let e=m(this.board,this.initialRobots,this.currentTarget.color,this.currentTarget.pos);e?(this.optimalMoves=e.length,this.robots=S(this.initialRobots),this.moves=[],this.replaySolution(e,0)):this.optimalMoves=-1,this.onUpdate()}replaySolution(e,t){if(t>=e.length){this.solved=!0,this.onUpdate();return}let n=e[t];this.selectedRobot=n.color,this.animating=!0,this.renderer.animateMove(n.color,n.from,n.to,()=>{this.robots[n.color]={...n.to},this.moves.push(n),this.animating=!1,this.redraw(),this.onUpdate(),setTimeout(()=>this.replaySolution(e,t+1),300)});let r=()=>{this.animating&&(this.redraw(),requestAnimationFrame(r))};requestAnimationFrame(r)}selectRobotAt(e,t){for(let n of r)if(this.robots[n].row===e&&this.robots[n].col===t){this.selectedRobot=n,this.redraw(),this.onUpdate();return}}resize(){this.renderer.resize(),this.redraw()}redraw(){this.renderer.draw(this.board,this.robots,this.currentTarget,this.selectedRobot,this.moves)}getCellFromPixel(e,t){return this.renderer.getCellFromPixel(e,t)}setupInput(){window.addEventListener(`keydown`,e=>{if(!this.animating)switch(e.key){case`ArrowUp`:case`w`:case`W`:e.preventDefault(),this.moveRobot(1);break;case`ArrowDown`:case`s`:case`S`:e.preventDefault(),this.moveRobot(4);break;case`ArrowLeft`:case`a`:case`A`:e.preventDefault(),this.moveRobot(8);break;case`ArrowRight`:case`d`:case`D`:e.preventDefault(),this.moveRobot(2);break;case`u`:case`U`:this.undo();break;case`r`:case`R`:this.resetPuzzle();break;case`1`:this.selectedRobot=`red`,this.redraw(),this.onUpdate();break;case`2`:this.selectedRobot=`blue`,this.redraw(),this.onUpdate();break;case`3`:this.selectedRobot=`green`,this.redraw(),this.onUpdate();break;case`4`:this.selectedRobot=`yellow`,this.redraw(),this.onUpdate();break}}),this.canvas.addEventListener(`click`,e=>{let t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,i=this.getCellFromPixel(n,r);i&&this.selectRobotAt(i.row,i.col)})}};function S(e){return{red:{...e.red},blue:{...e.blue},green:{...e.green},yellow:{...e.yellow}}}function C(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}var w=class{board;robots;initialRobots;currentTarget;selectedRobot=null;moves=[];solved=!1;players;currentSolverIndex=0;phase=`thinking`;thinkingTimeLeft=0;round=0;maxRounds;lastRoundWasSolved=!1;showingSolution=!1;solutionOptimalMoves=null;failedRobotPositions=null;renderer;canvas;onUpdate;animating=!1;timerInterval=null;targetIndex=0;allTargets=[];bidQueue=[];constructor(e,t,n,r){this.canvas=e,this.renderer=new y(e),this.onUpdate=r,this.maxRounds=n,this.players=t.map(e=>({name:e,score:0,bid:null})),this.newGame(),this.setupInput()}newGame(){let{quadrants:e,rotations:t}=l();this.board=i.fromQuadrants(e,t),this.allTargets=[...this.board.targets],E(this.allTargets),this.targetIndex=0,this.robots=f(this.board),this.round=0,this.players.forEach(e=>e.score=0),this.nextRound()}nextRound(){this.round++,this.targetIndex>=this.allTargets.length&&(E(this.allTargets),this.targetIndex=0),this.currentTarget=this.allTargets[this.targetIndex++],this.initialRobots=T(this.failedRobotPositions??this.robots),this.moves=[],this.solved=!1,this.selectedRobot=this.currentTarget.color,this.players.forEach(e=>e.bid=null),this.bidQueue=[],this.currentSolverIndex=0,this.failedRobotPositions=null,this.showingSolution=!1,this.solutionOptimalMoves=null,this.lastRoundWasSolved=!1,this.startThinking()}startThinking(){this.phase=`thinking`,this.thinkingTimeLeft=60,this.onUpdate(),this.timerInterval=window.setInterval(()=>{this.thinkingTimeLeft--,this.thinkingTimeLeft<=0&&(this.stopTimer(),this.startBidding()),this.onUpdate()},1e3),this.redraw()}stopThinkingEarly(){this.stopTimer(),this.startBidding()}startBidding(){this.phase=`bidding`,this.onUpdate()}submitBid(e,t){this.players[e].bid=t,this.onUpdate()}allBidsIn(){return this.players.every(e=>e.bid!==null)}startSolving(){if(this.bidQueue=this.players.map((e,t)=>({bid:e.bid??1/0,index:t})).filter(e=>e.bid<1/0).sort((e,t)=>e.bid-t.bid).map(e=>e.index),this.bidQueue.length===0){this.endRound(null);return}this.currentSolverIndex=0,this.startSolverTurn()}startSolverTurn(){this.phase=`solving`,this.robots=T(this.initialRobots),this.moves=[],this.solved=!1,this.selectedRobot=this.currentTarget.color,this.redraw(),this.onUpdate()}getCurrentSolver(){return this.currentSolverIndex>=this.bidQueue.length?null:this.players[this.bidQueue[this.currentSolverIndex]]}getCurrentSolverMaxMoves(){return this.getCurrentSolver()?.bid??0}failCurrentSolver(){this.currentSolverIndex++,this.currentSolverIndex>=this.bidQueue.length?this.endRound(null):this.startSolverTurn()}moveRobot(e){if(!this.selectedRobot||this.solved||this.animating||this.phase!==`solving`)return;let t=this.selectedRobot,n={...this.robots[t]},r=d(this.board,this.robots,t,e);if(r.row===n.row&&r.col===n.col)return;this.animating=!0,this.renderer.animateMove(t,n,r,()=>{if(this.robots[t]=r,this.moves.push({color:t,from:n,to:r}),this.animating=!1,p(this.robots,this.currentTarget.color,this.currentTarget.pos)){this.solved=!0;let e=this.bidQueue[this.currentSolverIndex];this.endRound(e)}else this.moves.length>=this.getCurrentSolverMaxMoves()&&this.failCurrentSolver();this.redraw(),this.onUpdate()});let i=()=>{this.animating&&(this.redraw(),requestAnimationFrame(i))};requestAnimationFrame(i)}endRound(e){this.phase=`round_end`,this.lastRoundWasSolved=e!==null,e===null?this.failedRobotPositions=T(this.robots):this.players[e].score++,this.onUpdate()}showSolution(){if(this.showingSolution||this.solutionOptimalMoves!==null)return;let e=m(this.board,this.initialRobots,this.currentTarget.color,this.currentTarget.pos);e?(this.solutionOptimalMoves=e.length,this.showingSolution=!0,this.robots=T(this.initialRobots),this.moves=[],this.onUpdate(),this.replaySolution(e,0)):(this.solutionOptimalMoves=-1,this.onUpdate())}replaySolution(e,t){if(t>=e.length){this.showingSolution=!1,this.redraw(),this.onUpdate();return}let n=e[t];this.selectedRobot=n.color,this.animating=!0,this.renderer.animateMove(n.color,n.from,n.to,()=>{this.robots[n.color]={...n.to},this.moves.push(n),this.animating=!1,this.redraw(),this.onUpdate(),setTimeout(()=>this.replaySolution(e,t+1),300)});let r=()=>{this.animating&&(this.redraw(),requestAnimationFrame(r))};requestAnimationFrame(r)}isGameOver(){return this.round>=this.maxRounds}undo(){if(this.moves.length===0||this.solved||this.phase!==`solving`)return;let e=this.moves.pop();this.robots[e.color]={...e.from},this.redraw(),this.onUpdate()}resetPuzzle(){this.phase===`solving`&&(this.robots=T(this.initialRobots),this.moves=[],this.solved=!1,this.selectedRobot=this.currentTarget.color,this.redraw(),this.onUpdate())}selectRobotAt(e,t){if(this.phase===`solving`){for(let n of r)if(this.robots[n].row===e&&this.robots[n].col===t){this.selectedRobot=n,this.redraw(),this.onUpdate();return}}}resize(){this.renderer.resize(),this.redraw()}redraw(){this.renderer.draw(this.board,this.robots,this.currentTarget,this.selectedRobot,this.moves)}getCellFromPixel(e,t){return this.renderer.getCellFromPixel(e,t)}stopTimer(){this.timerInterval!==null&&(clearInterval(this.timerInterval),this.timerInterval=null)}destroy(){this.stopTimer()}setupInput(){window.addEventListener(`keydown`,e=>{if(!(this.animating||this.phase!==`solving`))switch(e.key){case`ArrowUp`:case`w`:case`W`:e.preventDefault(),this.moveRobot(1);break;case`ArrowDown`:case`s`:case`S`:e.preventDefault(),this.moveRobot(4);break;case`ArrowLeft`:case`a`:case`A`:e.preventDefault(),this.moveRobot(8);break;case`ArrowRight`:case`d`:case`D`:e.preventDefault(),this.moveRobot(2);break;case`u`:case`U`:this.undo();break;case`r`:case`R`:this.resetPuzzle();break;case`1`:this.selectedRobot=`red`,this.redraw(),this.onUpdate();break;case`2`:this.selectedRobot=`blue`,this.redraw(),this.onUpdate();break;case`3`:this.selectedRobot=`green`,this.redraw(),this.onUpdate();break;case`4`:this.selectedRobot=`yellow`,this.redraw(),this.onUpdate();break}}),this.canvas.addEventListener(`click`,e=>{let t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,i=this.getCellFromPixel(n,r);i&&this.selectRobotAt(i.row,i.col)})}};function T(e){return{red:{...e.red},blue:{...e.blue},green:{...e.green},yellow:{...e.yellow}}}function E(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}var D=`menu`,O=null,k=null,A=document.getElementById(`app`);function j(){switch(D){case`menu`:M();break;case`solo`:N();break;case`multiplayer-setup`:z();break;case`multiplayer`:V();break}}function M(){A.innerHTML=`
    <div class="menu-screen">
      <h1>Ricochet Robots</h1>
      <p class="subtitle">The sliding puzzle game</p>
      <div class="menu-buttons">
        <button class="btn btn-primary" id="btn-solo">Solo Puzzle</button>
        <button class="btn btn-secondary" id="btn-mp">Local Multiplayer</button>
      </div>
      <div class="keyboard-hints" style="margin-top: 2rem;">
        <span><kbd>Arrow Keys</kbd> / <kbd>WASD</kbd> Move</span>
        <span><kbd>1-4</kbd> Select Robot</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>R</kbd> Reset</span>
      </div>
    </div>
  `,document.getElementById(`btn-solo`).onclick=()=>{D=`solo`,j()},document.getElementById(`btn-mp`).onclick=()=>{D=`multiplayer-setup`,j()}}function N(){A.innerHTML=`
    <div class="game-screen">
      <div class="game-header">
        <button class="btn btn-ghost btn-small" id="btn-back">Back</button>
        <h2>Solo Puzzle</h2>
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">Moves</span>
            <span class="info-value" id="move-count">0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Target</span>
            <span class="info-value" id="target-info">-</span>
          </div>
        </div>
      </div>

      <div class="robot-selector" id="robot-selector"></div>

      <div class="canvas-container" id="canvas-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div id="solved-area"></div>

      <div class="game-controls">
        <button class="btn btn-ghost btn-small" id="btn-undo">Undo (U)</button>
        <button class="btn btn-ghost btn-small" id="btn-reset">Reset (R)</button>
        <button class="btn btn-ghost btn-small" id="btn-solve">Show Solution</button>
        <button class="btn btn-primary btn-small" id="btn-next">Next Puzzle</button>
      </div>

      <div class="d-pad" id="d-pad">
        <button class="d-pad-up">&#9650;</button>
        <button class="d-pad-left">&#9668;</button>
        <button class="d-pad-center"></button>
        <button class="d-pad-right">&#9658;</button>
        <button class="d-pad-down">&#9660;</button>
      </div>

      <div class="keyboard-hints">
        <span><kbd>Arrow Keys</kbd> / <kbd>WASD</kbd> Move</span>
        <span><kbd>1-4</kbd> Select Robot</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>R</kbd> Reset</span>
        <span>Click robot to select</span>
        <span>Swipe on mobile</span>
      </div>
    </div>
  `,O=new x(document.getElementById(`game-canvas`),F),O.resize();let e=document.getElementById(`d-pad`);e.querySelector(`.d-pad-up`).addEventListener(`click`,()=>O?.moveRobot(1)),e.querySelector(`.d-pad-down`).addEventListener(`click`,()=>O?.moveRobot(4)),e.querySelector(`.d-pad-left`).addEventListener(`click`,()=>O?.moveRobot(8)),e.querySelector(`.d-pad-right`).addEventListener(`click`,()=>O?.moveRobot(2)),document.getElementById(`btn-back`).onclick=()=>{O=null,D=`menu`,j()},document.getElementById(`btn-undo`).onclick=()=>O?.undo(),document.getElementById(`btn-reset`).onclick=()=>O?.resetPuzzle(),document.getElementById(`btn-solve`).onclick=()=>O?.showSolution(),document.getElementById(`btn-next`).onclick=()=>O?.nextTarget(),P(),F(),window.addEventListener(`resize`,()=>O?.resize())}function P(){let e=document.getElementById(`robot-selector`),t=[`red`,`blue`,`green`,`yellow`];e.innerHTML=t.map(e=>`<button class="robot-btn ${e}" data-color="${e}" title="${e} (${t.indexOf(e)+1})"></button>`).join(``),e.querySelectorAll(`.robot-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.color;O&&(O.selectedRobot=t,O.redraw(),F()),k&&(k.selectedRobot=t,k.redraw(),H())})})}function F(){if(!O)return;document.getElementById(`move-count`).textContent=String(O.moves.length);let e=O.currentTarget,t=document.getElementById(`target-info`);t.textContent=`${e.shape}`,t.style.color=U(e.color),document.querySelectorAll(`.robot-btn`).forEach(e=>{let t=e.dataset.color;e.classList.toggle(`selected`,t===O.selectedRobot)});let n=document.getElementById(`solved-area`);if(O.solved){let e=`Solved in ${O.moves.length} move${O.moves.length===1?``:`s`}!`;O.optimalMoves!==null&&O.optimalMoves>0&&(e+=` (Optimal: ${O.optimalMoves})`),n.innerHTML=`<div class="solved-banner">${e}</div>`}else O.optimalMoves===-1?n.innerHTML=`<div class="phase-banner">No solution found within search depth.</div>`:n.innerHTML=``}var I=2,L=[`Player 1`,`Player 2`],R=10;function z(){A.innerHTML=`
    <div class="menu-screen">
      <h1>Local Multiplayer</h1>
      <p class="subtitle">Play on the same device</p>

      <div class="player-count-control">
        <button id="btn-minus">-</button>
        <span id="count-label">${I} Players</span>
        <button id="btn-plus">+</button>
      </div>

      <div class="player-setup" id="player-inputs"></div>

      <div style="display:flex; align-items:center; gap:0.75rem;">
        <label style="color:#718096; font-size:0.9rem;">Rounds:</label>
        <input type="number" id="rounds-input" value="${R}" min="1" max="50"
          style="width:60px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:0.4rem; color:#e2e8f0; text-align:center; font-size:1rem;">
      </div>

      <div class="menu-buttons">
        <button class="btn btn-secondary" id="btn-start-mp">Start Game</button>
        <button class="btn btn-ghost" id="btn-back-setup">Back</button>
      </div>
    </div>
  `,B(),document.getElementById(`btn-minus`).onclick=()=>{I>2&&(I--,L=L.slice(0,I),document.getElementById(`count-label`).textContent=`${I} Players`,B())},document.getElementById(`btn-plus`).onclick=()=>{I<8&&(I++,L.push(`Player ${I}`),document.getElementById(`count-label`).textContent=`${I} Players`,B())},document.getElementById(`btn-back-setup`).onclick=()=>{D=`menu`,j()},document.getElementById(`btn-start-mp`).onclick=()=>{for(let e=0;e<I;e++){let t=document.getElementById(`player-name-${e}`);t.value.trim()&&(L[e]=t.value.trim())}let e=document.getElementById(`rounds-input`);R=Math.max(1,Math.min(50,parseInt(e.value)||10)),D=`multiplayer`,j()}}function B(){let e=document.getElementById(`player-inputs`);e.innerHTML=``;for(let t=0;t<I;t++)L[t]||(L[t]=`Player ${t+1}`),e.innerHTML+=`
      <input type="text" id="player-name-${t}" placeholder="Player ${t+1}" value="${L[t]}">
    `}function V(){A.innerHTML=`
    <div class="game-screen">
      <div class="game-header">
        <button class="btn btn-ghost btn-small" id="btn-back-mp">Back</button>
        <h2 id="mp-title">Round 1/${R}</h2>
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">Moves</span>
            <span class="info-value" id="mp-move-count">0</span>
          </div>
        </div>
      </div>

      <div class="robot-selector" id="robot-selector"></div>

      <div class="canvas-container" id="canvas-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div id="mp-phase-area"></div>

      <div class="game-controls" id="mp-controls" style="display:none;">
        <button class="btn btn-ghost btn-small" id="mp-undo">Undo</button>
        <button class="btn btn-ghost btn-small" id="mp-reset">Reset</button>
        <button class="btn btn-ghost btn-small" id="mp-fail">Give Up</button>
      </div>

      <div class="d-pad" id="d-pad" style="display:none;">
        <button class="d-pad-up">&#9650;</button>
        <button class="d-pad-left">&#9668;</button>
        <button class="d-pad-center"></button>
        <button class="d-pad-right">&#9658;</button>
        <button class="d-pad-down">&#9660;</button>
      </div>

      <div id="mp-scoreboard"></div>
    </div>
  `,k=new w(document.getElementById(`game-canvas`),L.slice(0,I),R,H),k.resize(),P();let e=document.getElementById(`d-pad`);e.querySelector(`.d-pad-up`).addEventListener(`click`,()=>k?.moveRobot(1)),e.querySelector(`.d-pad-down`).addEventListener(`click`,()=>k?.moveRobot(4)),e.querySelector(`.d-pad-left`).addEventListener(`click`,()=>k?.moveRobot(8)),e.querySelector(`.d-pad-right`).addEventListener(`click`,()=>k?.moveRobot(2)),document.getElementById(`btn-back-mp`).onclick=()=>{k?.destroy(),k=null,D=`menu`,j()},document.getElementById(`mp-undo`).onclick=()=>k?.undo(),document.getElementById(`mp-reset`).onclick=()=>k?.resetPuzzle(),document.getElementById(`mp-fail`).onclick=()=>k?.failCurrentSolver(),H(),window.addEventListener(`resize`,()=>k?.resize())}function H(){if(!k)return;document.getElementById(`mp-title`).textContent=`Round ${k.round}/${k.maxRounds}`,document.getElementById(`mp-move-count`).textContent=String(k.moves.length);let e=document.getElementById(`mp-controls`),t=document.getElementById(`d-pad`),n=document.getElementById(`mp-phase-area`);switch(document.querySelectorAll(`.robot-btn`).forEach(e=>{let t=e.dataset.color;e.classList.toggle(`selected`,t===k.selectedRobot)}),k.phase){case`thinking`:e.style.display=`none`,t.style.display=`none`,n.innerHTML=`
        <div class="phase-banner">
          <p>Look at the board and think of a solution!</p>
          <div class="timer-display${k.thinkingTimeLeft<=10?` warning`:``}">${k.thinkingTimeLeft}s</div>
          <button class="btn btn-ghost btn-small" id="btn-stop-timer" style="margin-top:0.5rem;">Everyone Ready</button>
        </div>
      `,document.getElementById(`btn-stop-timer`).onclick=()=>k?.stopThinkingEarly();break;case`bidding`:e.style.display=`none`,t.style.display=`none`,n.innerHTML=`
        <div class="phase-banner">
          <p style="margin-bottom:0.75rem;">How many moves can you do it in?</p>
          <div class="bid-form">
            ${k.players.map((e,t)=>`
              <div class="bid-row">
                <span class="player-name">${e.name}</span>
                <input type="number" id="bid-${t}" min="1" max="30"
                  value="${e.bid??``}" placeholder="-">
                <button class="btn btn-ghost btn-small" id="bid-pass-${t}">${e.bid===null?`Pass`:`Change`}</button>
              </div>
            `).join(``)}
            <button class="btn btn-secondary btn-small" id="btn-start-solve" style="margin-top:0.5rem;">
              Start Solving
            </button>
          </div>
        </div>
      `,k.players.forEach((e,t)=>{let n=document.getElementById(`bid-${t}`);n.onchange=()=>{let e=parseInt(n.value);e>0&&k?.submitBid(t,e)},document.getElementById(`bid-pass-${t}`).onclick=()=>{let e=parseInt(n.value);e>0&&k?.submitBid(t,e)}}),document.getElementById(`btn-start-solve`).onclick=()=>k?.startSolving();break;case`solving`:{e.style.display=`flex`,t.style.display=`grid`;let r=k.getCurrentSolver(),i=k.getCurrentSolverMaxMoves();n.innerHTML=`
        <div class="phase-banner">
          <p><strong>${r?.name}</strong> is solving (bid: ${i} moves)</p>
          <p>Moves used: ${k.moves.length} / ${i}</p>
        </div>
      `,k.solved&&(n.innerHTML=`
          <div class="solved-banner">
            ${r?.name} solved it in ${k.moves.length} move${k.moves.length===1?``:`s`}!
          </div>
        `,e.style.display=`none`,t.style.display=`none`);break}case`round_end`:if(e.style.display=`none`,t.style.display=`none`,k.isGameOver()){let e=k.players.reduce((e,t)=>e.score>t.score?e:t);n.innerHTML=`
          <div class="solved-banner">
            Game Over! ${e.name} wins with ${e.score} points!
          </div>
          <button class="btn btn-primary" id="btn-new-mp-game" style="margin-top:1rem;">Play Again</button>
        `,document.getElementById(`btn-new-mp-game`)?.addEventListener(`click`,()=>{k?.newGame()})}else{let e=`<p>${k.lastRoundWasSolved?`Round ${k.round} complete!`:`Round ${k.round} complete! Nobody solved it.`}</p>`;k.lastRoundWasSolved||(k.showingSolution?e+=`<p><em>Showing solution...</em></p>`:k.solutionOptimalMoves===-1?e+=`<p><em>No solution found within search depth.</em></p>`:k.solutionOptimalMoves===null?e+=`<button class="btn btn-secondary btn-small" id="btn-show-mp-solution" style="margin-top:0.5rem;">Show Solution</button>`:e+=`<p><em>Solution: ${k.solutionOptimalMoves} move(s).</em></p>`);let t=k.showingSolution?`disabled`:``;e+=`
          <button class="btn btn-primary btn-small" id="btn-next-round" style="margin-top:0.5rem;" ${t}>
            Next Round
          </button>
        `,n.innerHTML=`<div class="phase-banner">${e}</div>`,document.getElementById(`btn-show-mp-solution`)?.addEventListener(`click`,()=>{k?.showSolution()}),k.showingSolution||(document.getElementById(`btn-next-round`).onclick=()=>k?.nextRound())}break}let r=document.getElementById(`mp-scoreboard`);r.innerHTML=`
    <table class="scoreboard">
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${k.players.map(e=>`
          <tr>
            <td>${e.name}</td>
            <td>${e.score}</td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `}function U(e){return{red:`#e53e3e`,blue:`#3182ce`,green:`#38a169`,yellow:`#d69e2e`}[e]}j();