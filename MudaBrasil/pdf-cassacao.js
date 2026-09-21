/* vb-pdf-v6 */ 
(function(){ 
var T=70; 
function cards(){return [].slice.call(document.querySelectorAll('.card,[data-revogado]'));} 
function pct(c){var d=c.getAttribute('data-revogado');if(d){return +d;}var m=(c.textContent||'').match(/([0-9]{1,3})\s*%/);return m?+m[1]:0;} 
function nome(c){var e=c.querySelector('h3,h4,strong');return e?e.textContent.trim():'Politico';} 
function btn(c){if(c.getAttribute('data-vbpdf')){return;}c.setAttribute('data-vbpdf','1');var b=document.createElement('button');b.textContent='Gerar Relatorio de Cassacao (PDF)';b.style.cssText='display:block;margin:8px 0;padding:10px 14px;background:#C0392B;color:#fff;border:0;border-radius:8px;font-weight:700;cursor:pointer';b.onclick=function(){relatorio([c]);};c.appendChild(b);} 
function relatorio(cs){var w=window.open('','_blank');if(!w){alert('Permita pop-ups');return;}var r='';for(var i=0;i<cs.length;i++){var c=cs[i];r=r+'<tr><td>'+nome(c)+'</td><td>'+pct(c)+'%</td></tr>';}w.document.write('<html><head><meta charset=utf-8><title>Relatorio VotaBrasil</title></head><body onload=window.print()><h1>VotaBrasil - Relatorio de Cassacao</h1><p>Regra: 70% = cassacao. Prototipo demonstrativo.</p><table border=1 cellpadding=8><tr><th>Politico</th><th>Revogacao</th></tr>'+r+'</table><p>'+new Date().toLocaleString('pt-BR')+'</p><p>Assinatura: ______________________</p></body></html>');w.document.close();} 
function scan(){cards().forEach(function(c){if(pct(c)>=T){btn(c);}});} 
var n=0;var t=setInterval(function(){scan();n++;if(n>40){clearInterval(t);}},1500); 
scan(); 
})(); 
