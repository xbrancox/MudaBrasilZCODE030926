/* VotaBrasil - Gamificacao Civica v10 (ASCII) */
(function(){
var K={xp:'vb_xp',streak:'vb_streak',last:'vb_last_activity',badges:'vb_badges',hist:'vb_xp_history',daily:'vb_daily'};
function num(k,d){var v=parseInt(localStorage.getItem(k),10);return isNaN(v)?d:v;}
function set(k,v){localStorage.setItem(k,String(v));}
function xp(){return num(K.xp,0);}
function level(x){return Math.floor(Math.sqrt(x/100));}
var TITLES=['Observador','Cidadao','Eleitor','Fiscal','Ativista','Guardiao','Lider Civico','Reformador'];
function title(l){return TITLES[Math.min(l,TITLES.length-1)];}
function badges(){try{return JSON.parse(localStorage.getItem(K.badges)||'[]');}catch(e){return [];}}
function addBadge(id){var b=badges();if(b.indexOf(id)<0){b.push(id);set(K.badges,JSON.stringify(b));toast('Badge: '+id);}}
function streakTouch(){var now=Date.now();var last=num(K.last,0);var s=num(K.streak,0);if(!last){s=1;}else{var d=now-last;if(d>=172800000){s=1;}else if(d>=86400000){s=s+1;}}set(K.streak,s);set(K.last,now);if(s>=3){addBadge('streak3');}if(s>=7){addBadge('streak7');}if(s>=30){addBadge('streak30');}return s;}
function gain(n,why){var x=xp()+n;set(K.xp,x);var h=[];try{h=JSON.parse(localStorage.getItem(K.hist)||'[]');}catch(e){}h.unshift({n:n,w:why,t:Date.now()});h=h.slice(0,30);set(K.hist,JSON.stringify(h));streakTouch();if(level(x)>=5){addBadge('guardiao');}toast('+'+n+' XP - '+why);render();}
function toast(m){var t=document.createElement('div');t.textContent=m;t.style.cssText='position:fixed;right:16px;bottom:80px;z-index:99999;background:#009739;color:#fff;padding:10px 14px;border-radius:10px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.4);font-family:Arial,sans-serif';document.body.appendChild(t);setTimeout(function(){if(t.parentNode){t.parentNode.removeChild(t);}},3500);}
function panel(){var x=xp();var l=level(x);var s=num(K.streak,0);var b=badges();var next=(l+1)*(l+1)*100;var w=window.open('','_blank');if(!w){alert('Permita pop-ups');return;}w.document.write('<html><head><meta charset=utf-8><title>VotaBrasil - Perfil Civico</title></head><body style="font-family:Arial;margin:40px"><h1>Perfil Civico VotaBrasil</h1><p>Nivel '+l+' - '+title(l)+'</p><p>XP: '+x+' (proximo nivel em '+next+')</p><p>Streak: '+s+' dia(s)</p><p>Badges: '+(b.length?b.join(', '):'nenhum ainda')+'</p></body></html>');w.document.close();}
function widget(){if(document.getElementById('vb-gamif')){return;}var d=document.createElement('div');d.id='vb-gamif';d.style.cssText='position:fixed;left:16px;bottom:16px;z-index:99998;background:#0B132B;color:#FFD700;border:1px solid #FFD700;border-radius:20px;padding:8px 14px;cursor:pointer;font-family:Arial,sans-serif;font-size:13px';d.onclick=panel;document.body.appendChild(d);render();}
function render(){var d=document.getElementById('vb-gamif');if(!d){return;}var x=xp();var l=level(x);var s=num(K.streak,0);d.textContent='Nv '+l+' - '+title(l)+' - '+x+' XP - streak '+s;}
function hook(){document.addEventListener('click',function(ev){var el=ev.target&&ev.target.closest?ev.target.closest('button,a'):null;if(!el){return;}var t=el.textContent||'';if(/Conferir/i.test(t)){gain(50,'Voto conferido');}else if(/Revogar/i.test(t)){gain(80,'Revogacao exercida');}else if(/reclama/i.test(t)){gain(30,'Reclamacao enviada');}else if(/apoio/i.test(t)){gain(20,'Apoio dado');}else if(/Comparar/i.test(t)){gain(15,'Comparacao feita');}else if(/Votar/i.test(t)){gain(100,'Voto registrado');}},true);var today=new Date().toDateString();if(localStorage.getItem(K.daily)!==today){localStorage.setItem(K.daily,today);gain(10,'Presenca diaria');}}
function init(){widget();hook();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
window.VBGamif={gain:gain,xp:xp,level:level,badges:badges,panel:panel};
})();
