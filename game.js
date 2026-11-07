const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),statusEl=document.getElementById('status'),msg=document.getElementById('message');
const keys={}; let running=false,score=0,frame=0;
const player={x:390,y:420,w:34,h:52,speed:4};
let stars=[],cops=[];
function reset(){score=0;frame=0;player.x=390;player.y=420;stars=[];cops=[];running=true;scoreEl.textContent='0';statusEl.textContent='Clear';msg.textContent='Drive around Chennai and collect the stars!';}
document.getElementById('start').onclick=reset;
window.addEventListener('keydown',e=>{keys[e.key]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();});
window.addEventListener('keyup',e=>keys[e.key]=false);
document.querySelectorAll('[data-key]').forEach(b=>{
 const k=b.dataset.key;
 b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));
});
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function car(x,y,color){ctx.fillStyle=color;ctx.fillRect(x,y,34,52);ctx.fillStyle='#bde0fe';ctx.fillRect(x+5,y+7,24,12);ctx.fillRect(x+5,y+32,24,10);ctx.fillStyle='#111';ctx.fillRect(x-3,y+8,4,10);ctx.fillRect(x+33,y+8,4,10);ctx.fillRect(x-3,y+34,4,10);ctx.fillRect(x+33,y+34,4,10);}
function spawn(){if(frame%95===0)stars.push({x:65+Math.random()*670,y:-20});if(frame%210===0)cops.push({x:80+Math.random()*620,y:-65,s:2+Math.random()*1.4});}
function update(){
 if(!running)return;
 frame++;
 if(keys.ArrowLeft||keys.a)player.x-=player.speed;
 if(keys.ArrowRight||keys.d)player.x+=player.speed;
 if(keys.ArrowUp||keys.w)player.y-=player.speed;
 if(keys.ArrowDown||keys.s)player.y+=player.speed;
 player.x=Math.max(8,Math.min(758,player.x));player.y=Math.max(8,Math.min(460,player.y));
 spawn();
 stars.forEach(s=>s.y+=2.8);cops.forEach(c=>c.y+=c.s);
 stars=stars.filter(s=>s.y<540);cops=cops.filter(c=>c.y<560);
 stars=stars.filter(s=>{if(Math.abs(s.x-player.x-17)<25&&Math.abs(s.y-player.y-26)<28){score+=10;scoreEl.textContent=score;return false;}return true;});
 let hit=cops.some(c=>Math.abs(c.x-player.x)<29&&Math.abs(c.y-player.y)<43);
 statusEl.textContent=hit?'Nearby!':'Clear';
 if(hit){running=false;msg.textContent='Police caught up! Press Start / Restart to try again.';}
}
function draw(){
 ctx.clearRect(0,0,800,520);
 // city grass and roads
 rect(0,0,800,520,'#315b45');rect(40,0,720,520,'#343a40');
 // road lanes
 ctx.setLineDash([28,22]);ctx.strokeStyle='#f5f0d5';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(400,0);ctx.lineTo(400,520);ctx.stroke();ctx.setLineDash([]);
 // side buildings
 for(let y=15;y<520;y+=115){rect(4,y,28,70,'#6c757d');rect(768,y,28,70,'#6c757d');}
 stars.forEach(s=>{ctx.font='26px Arial';ctx.fillText('⭐',s.x,s.y);});
 cops.forEach(c=>{car(c.x,c.y,'#e63946');ctx.fillStyle='#fff';ctx.font='10px Arial';ctx.fillText('POLICE',c.x-1,c.y+27);});
 car(player.x,player.y,'#ff9f1c');
 ctx.fillStyle='#fff';ctx.font='14px Arial';ctx.fillText('CHENNAI CITY',12,22);
}
function loop(){update();draw();requestAnimationFrame(loop);}loop();
