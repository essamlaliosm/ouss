var ZONES=["Larache","Al Hoceima","Nador","Berkane","Zaio","Casablanca","Kenitra"];
var K="deplacements_v3",data=[];
var DRIVERS=["Yassine Najjari","Said Lamine","Mohammed Benzagdou","Mourad El Gharrar","Mohssine Medouri","Imad El Ganay","Abdellah Ouahmane","Mohammed Azzokri","Mohammed El Bejjaoui","Mohammed Hamzaoui","Ismail Ben Hamza"];
var ZM={},TARIFS=[],OLDDEF=[50,100,200,300,350,400,450,500,550,600],CK="dep_cfg_v1",STK="dep_step_v1";
(function(){try{var c=JSON.parse(localStorage.getItem(CK));if(c){if(c.zones&&c.zones.length)ZONES=c.zones;if(c.drivers&&c.drivers.length)DRIVERS=c.drivers;if(c.tarifs&&c.tarifs.length)TARIFS=c.tarifs;if(c.zm)ZM=c.zm}}catch(e){}})();
function saveCfg(){try{localStorage.setItem(CK,JSON.stringify({zones:ZONES,drivers:DRIVERS,tarifs:TARIFS,zm:ZM}))}catch(e){}}
function allZ(){var z=ZONES.slice();data.forEach(function(r){[].concat(r.z||[]).forEach(function(x){if(z.indexOf(x)<0)z.push(x)})});return z}
function load(){try{var s=localStorage.getItem(K);if(s)return JSON.parse(s)}catch(e){}return null}
function save(){try{localStorage.setItem(K,JSON.stringify(data))}catch(e){}}
data=load()||[];
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(n){return n.toLocaleString("fr-FR")+" MAD"}
function render(){buildT();
var ls=DRIVERS.slice();data.forEach(function(r){if(ls.indexOf(r.l)<0)ls.push(r.l)});
var ce=$("ex").value;
$("ex").innerHTML='<option value="">Tous les livreurs (récap global)</option>'+ls.map(function(x){return'<option'+(x===ce?' selected':'')+'>'+esc(x)+'</option>'}).join("");
var cz=$("f4").value;
$("f4").innerHTML='<option value="">Toutes</option>'+allZ().map(function(x){return'<option'+(x===cz?' selected':'')+'>'+esc(x)+'</option>'}).join("");
var cur=$("f3").value,cl=$("l").value;
$("f3").innerHTML='<option value="">Tous</option>'+ls.map(function(x){return'<option'+(x===cur?' selected':'')+'>'+esc(x)+'</option>'}).join("");
$("l").innerHTML=ls.map(function(x){return'<option'+(x===cl?' selected':'')+'>'+esc(x)+'</option>'}).join("");

var a=$("f1").value,b=$("f2").value,c=$("f3").value,zf=$("f4").value;
var f=data.filter(function(r){return(!a||r.d>=a)&&(!b||r.d<=b)&&(!c||r.l===c)&&(!zf||r.z.indexOf(zf)>=0)}).sort(function(x,y){return y.d.localeCompare(x.d)});
var g={},t=0;ls.forEach(function(k){if(!c||k===c)g[k]={n:0,s:0}});f.forEach(function(r){g[r.l].n++;g[r.l].s+=r.m;t+=r.m});
var ks=Object.keys(g).sort(function(x,y){return g[y].s-g[x].s||x.localeCompare(y)});
$("sum").innerHTML=ks.map(function(k){return'<tr><td>'+esc(k)+'</td><td class="n">'+g[k].n+'</td><td class="n">'+fmt(g[k].s)+'</td></tr>'}).join("")||'<tr><td colspan="3">Aucune donnée</td></tr>';
$("rows").innerHTML=f.map(function(r){return'<tr><td>'+esc(r.d)+'</td><td>'+esc(r.z.join(', '))+'</td><td>'+esc(r.l)+'</td><td class="n">'+fmt(r.m)+'</td><td><button class="g" data-id="'+r.id+'">✕</button></td></tr>'}).join("")||'<tr><td colspan="5">Aucune livraison</td></tr>';
var _n=new Date(),cm=rangeYM($("f1").value,$("f2").value)||window.__GM||(_n.getFullYear()+"-"+("0"+(_n.getMonth()+1)).slice(-2)),mm=data.filter(function(r){return String(r.d).slice(0,7)===cm}),mt=0;mm.forEach(function(r){mt+=(+r.m||0)});
var mlab=new Date(cm+"-01T12:00:00").toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
$("kl1").textContent="Déplacements · "+mlab;$("kl2").textContent="Montant total · "+mlab;
$("k1").textContent=mm.length;$("k2").textContent=fmt(mt);$("k3").textContent=ks.length;syncMonthUI(f.length,t);
}
$("d").value=new Date().toISOString().slice(0,10);
$("add").onclick=function(){
var d=$("d").value,l=$("l").value.trim(),m=parseFloat($("m").value);
var z=[].map.call($("z").querySelectorAll("input:checked"),function(i){return i.value});
if(!d||!z.length||!l||isNaN(m)){toast("Complète tous les champs (au moins une zone)",1);return}
data.push({id:Date.now(),d:d,z:z,l:l,m:m});save();[].forEach.call($("z").querySelectorAll("input"),function(i){i.checked=false});$("m").value="";mAuto=false;render()};
$("rows").onclick=function(e){var id=e.target.getAttribute("data-id");if(!id)return;
data=data.filter(function(r){return String(r.id)!==id});save();render()};
$("clr").onclick=function(){if(!clrArm){clrArm=1;$("clr").textContent="Confirmer : tout supprimer ?";setTimeout(function(){clrArm=0;$("clr").textContent="Vider tout"},4000);return}clrArm=0;$("clr").textContent="Vider tout";data=[];save();render()};
["f1","f2","f3","f4"].forEach(function(i){$(i).onchange=render});
function pad2(n){return("0"+n).slice(-2)}
function curYM(){var n=new Date();return n.getFullYear()+"-"+pad2(n.getMonth()+1)}
function monthRange(ym){var p=ym.split("-"),y=+p[0],m=+p[1];return[ym+"-01",ym+"-"+pad2(new Date(y,m,0).getDate())]}
function ymLabel(ym){var p=ym.split("-");return new Date(+p[0],+p[1]-1,1).toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}
function rangeYM(a,b){if(!a||!b)return"";var ym=a.slice(0,7),r=monthRange(ym);return(a===r[0]&&b===r[1])?ym:""}
function setMonth(ym){if(ym){var r=monthRange(ym);$("f1").value=r[0];$("f2").value=r[1]}else{$("f1").value="";$("f2").value=""}render()}
function shiftMonth(dir){var ym=rangeYM($("f1").value,$("f2").value)||curYM(),p=ym.split("-"),d=new Date(+p[0],+p[1]-1+dir,1);setMonth(d.getFullYear()+"-"+pad2(d.getMonth()+1))}
function syncMonthUI(n,t){var a=$("f1").value,b=$("f2").value,ym=rangeYM(a,b),lab=ym?ymLabel(ym):(!a&&!b?"Tous les mois":"Période personnalisée");
$("fm").value=ym;$("fml").innerHTML="<b>"+esc(lab)+"</b> · "+n+" déplacement(s) · "+fmt(t);
var h2=document.querySelectorAll("#hs,#hd");if($("hs"))$("hs").textContent="Résumé par livreur · "+lab;if($("hd"))$("hd").textContent="Détail des livraisons · "+lab;
var cnt={};data.forEach(function(r){var k=String(r.d).slice(0,7);cnt[k]=(cnt[k]||0)+1});var ms=Object.keys(cnt).sort().reverse().slice(0,12);
$("mch").innerHTML=ms.map(function(k){return'<button type="button" class="'+(k===ym?'':'s')+'" data-ym="'+k+'">'+esc(ymLabel(k))+' ('+cnt[k]+')</button>'}).join("")}
$("fm").onchange=function(){setMonth($("fm").value)};
$("mpv").onclick=function(){shiftMonth(-1)};$("mnx").onclick=function(){shiftMonth(1)};
$("mcu").onclick=function(){setMonth(curYM())};$("mal").onclick=function(){setMonth("")};
$("mch").onclick=function(e){var b=e.target.closest("button");if(b)setMonth(b.dataset.ym)};
(function(){var r=monthRange(curYM());$("f1").value=r[0];$("f2").value=r[1]})();

var mAuto=false;
function buildZ(){var ck={};[].forEach.call($("z").querySelectorAll("input:checked"),function(i){ck[i.value]=1});$("z").innerHTML=ZONES.map(function(x){return'<label class="chip"><input type="checkbox" value="'+esc(x)+'"'+(ck[x]?' checked':'')+'>'+esc(x)+(ZM[x]?' <small>· '+ZM[x]+'</small>':'')+'</label>'}).join("")}
function propAmounts(){var u={};data.forEach(function(r){var v=+r.m;if(v>=0)u[v]=1});var s={};Object.keys(u).forEach(function(k){s[k]=1});TARIFS.forEach(function(x){if(OLDDEF.indexOf(x)<0||u[x])s[x]=1});return Object.keys(s).map(Number).sort(function(x,y){return x-y})}
function buildT(){var P=propAmounts();$("tl").innerHTML=P.map(function(x){return'<option value="'+x+'">'+x+' MAD</option>'}).join("");$("mq").innerHTML=P.slice(0,14).map(function(x){return'<button type="button" class="s qa" data-v="'+x+'">'+x+'</button>'}).join("")}
function stepM(dir){var s=+$("ms").value||10,v=parseFloat($("m").value);if(isNaN(v))v=0;v=Math.max(0,Math.round((v+dir*s)*100)/100);$("m").value=v;mAuto=false}
function renderCfg(){
var h='<h3>📍 Zones et montant par zone</h3>'+ZONES.map(function(z,i){return'<div class="cr"><input data-zn="'+i+'" value="'+esc(z)+'"><input type="number" min="0" data-zm="'+i+'" value="'+(ZM[z]||"")+'" placeholder="Montant MAD"><button class="g" data-zd="'+i+'" title="Supprimer">✕</button></div>'}).join("")+'<div class="cr"><input id="nz" placeholder="Nouvelle zone (ex : Tanger)"><input id="nzm" type="number" min="0" placeholder="Montant MAD"><button id="nza">+ Zone</button></div>';
h+='<h3>👤 Livreurs</h3><div class="chips2">'+DRIVERS.map(function(x,i){return'<span class="chip2">'+esc(x)+' <button class="g" data-dd="'+i+'" title="Retirer de la liste">✕</button></span>'}).join("")+'</div><div class="cr"><input id="nd" placeholder="Nouveau livreur (nom complet)"><button id="nda">+ Livreur</button><button class="s" id="ndi">🔄 Importer de l’équipe</button></div>';
h+='<h3>💰 Montants proposés (déjà saisis)</h3><div class="chips2">'+(propAmounts().map(function(x){return'<span class="chip2">'+x+' MAD'+(TARIFS.indexOf(x)>=0?' <button class="g" data-tv="'+x+'" title="Retirer">✕</button>':'')+'</span>'}).join("")||'<span class="hint">Aucun montant pour le moment.</span>')+'</div><div class="cr"><input id="nt" type="number" min="0" placeholder="Ajouter un montant (MAD)"><button id="nta">+ Montant</button></div>';
h+='<p class="hint">Le montant d’une zone est proposé automatiquement quand on la coche (somme si plusieurs zones) ; il reste modifiable. Retirer un livreur ou une zone de la liste ne supprime pas les livraisons déjà saisies.</p>';
$("cfg").innerHTML=h}
function applyCfg(){saveCfg();buildZ();buildT();render();renderCfg()}
function dup(arr,v){return arr.some(function(x){return String(x).toLowerCase()===String(v).toLowerCase()})}
$("cfg").onclick=function(e){var b=e.target.closest("button");if(!b)return;
if(b.id==="nza"){var n=$("nz").value.trim(),m=parseFloat($("nzm").value);if(!n)return;if(dup(ZONES,n)){toast("Cette zone existe déjà",1);return}ZONES.push(n);if(m>0)ZM[n]=m;applyCfg();toast("Zone ajoutée : "+n)}
else if(b.id==="nda"){var n=$("nd").value.trim();if(!n)return;if(dup(DRIVERS,n)){toast("Ce livreur existe déjà",1);return}DRIVERS.push(n);applyCfg();toast("Livreur ajouté : "+n)}
else if(b.id==="ndi"){var t;try{t=parent.__getTeam()}catch(x){}if(!t||!t.liv){toast("Équipe indisponible ici",1);return}var c=0;t.liv.forEach(function(m){var n=((m.p||"")+" "+(m.n||"")).trim();if(n&&!dup(DRIVERS,n)){DRIVERS.push(n);c++}});applyCfg();toast(c?c+" livreur(s) importé(s)":"Aucun nouveau livreur")}
else if(b.id==="nta"){var v=parseFloat($("nt").value);if(!(v>=0)||$("nt").value==="")return;if(propAmounts().indexOf(v)>=0){toast("Ce montant existe déjà",1);return}TARIFS.push(v);TARIFS.sort(function(x,y){return x-y});applyCfg()}
else if(b.dataset.zd!==undefined){var z=ZONES.splice(+b.dataset.zd,1)[0];delete ZM[z];applyCfg()}
else if(b.dataset.dd!==undefined){DRIVERS.splice(+b.dataset.dd,1);applyCfg();toast("Retiré de la liste (ses livraisons restent dans l’historique)")}
else if(b.dataset.tv!==undefined){var tv=+b.dataset.tv;TARIFS=TARIFS.filter(function(x){return x!==tv});applyCfg()}};
$("cfg").onchange=function(e){var t=e.target;
if(t.dataset.zn!==undefined){var i=+t.dataset.zn,old=ZONES[i],n=t.value.trim();if(!n||n===old)return;if(dup(ZONES.filter(function(x,k){return k!==i}),n)){toast("Cette zone existe déjà",1);renderCfg();return}ZONES[i]=n;if(ZM[old]!==undefined){ZM[n]=ZM[old];delete ZM[old]}applyCfg()}
else if(t.dataset.zm!==undefined){var z=ZONES[+t.dataset.zm],v=parseFloat(t.value);if(v>0)ZM[z]=v;else delete ZM[z];applyCfg()}};
$("z").onchange=function(){var s=0;[].forEach.call($("z").querySelectorAll("input:checked"),function(i){s+=+ZM[i.value]||0});if(s>0&&(!$("m").value||mAuto)){$("m").value=s;mAuto=true}else if(s===0&&mAuto){$("m").value="";mAuto=false}};
$("m").oninput=function(){mAuto=false};
try{$("ms").value=localStorage.getItem(STK)||"10"}catch(e){}$("m").step=$("ms").value;
$("ms").onchange=function(){$("m").step=$("ms").value;try{localStorage.setItem(STK,$("ms").value)}catch(e){}};
$("mp").onclick=function(){stepM(1)};$("mm").onclick=function(){stepM(-1)};
$("mq").onclick=function(e){var b=e.target.closest("button");if(!b)return;$("m").value=b.dataset.v;mAuto=false};
function mRange(m){var p=m.split("-"),l=new Date(+p[0],+p[1],0).getDate();return[m+"-01",m+"-"+("0"+l).slice(-2)]}
function applyMonth(){var m=window.__GM;if(!m)return;var r=mRange(m);$("f1").value=r[0];$("f2").value=r[1];if($("p1")){$("p1").value=r[0];$("p2").value=r[1]}var n=new Date(),cm=n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2);$("d").value=(m===cm)?cm+"-"+("0"+n.getDate()).slice(-2):r[0]}
applyMonth();window.addEventListener("salmonth",function(){applyMonth();render()});
buildZ();buildT();renderCfg();
var DL=null,tt,clrArm=0;
function toast(t,err){var e=$("toast");e.textContent=t;e.className=err?"err":"";e.style.display="block";clearTimeout(tt);tt=setTimeout(function(){e.style.display="none"},err?7000:3500)}
function mny(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" MAD"}
function fd(s){var p=s.split("-");return p[2]+"/"+p[1]+"/"+p[0]}
function dlBlob(bl,name){var u=URL.createObjectURL(bl),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)}
async function pdfRecap(){
var J=window.jspdf;
if(!DL&&window.claude&&window.claude.use){try{DL=await window.claude.use("downloads")}catch(e){}}
if(!J){toast("Librairie PDF non chargée. Vérifie ta connexion internet puis recharge la page.",1);return}
toast("Génération du PDF…");
var who=$("ex").value,a=$("p1").value,b=$("p2").value;
if(a&&b&&a>b){toast("La date de début doit être avant la date de fin",1);return}
var f=data.filter(function(r){return(!a||r.d>=a)&&(!b||r.d<=b)&&(!who||r.l===who)}).sort(function(x,y){return x.d.localeCompare(y.d)});
var tot=f.reduce(function(s,r){return s+r.m},0);
var NAVY=[31,42,92],GOLD=[240,196,25];
var doc=new J.jsPDF({unit:"mm",format:"a4"});
try{doc.addImage(document.querySelector(".lg").src,"PNG",14,10,36,13)}catch(e){}
doc.setTextColor(31,42,92);doc.setFont("helvetica","bold");doc.setFontSize(17);
doc.text("Récap des déplacements",196,17,{align:"right"});
doc.setFont("helvetica","normal");doc.setFontSize(10);doc.setTextColor(107,114,128);
doc.text("Salipro Tétouan",196,23,{align:"right"});
doc.setDrawColor(240,196,25);doc.setLineWidth(1);doc.line(14,28,196,28);
doc.setTextColor(27,31,36);doc.setFontSize(11);
var per=(a||b)?("du "+(a?fd(a):"...")+" au "+(b?fd(b):"...")):"toutes les dates";
doc.text("Livreur : "+(who||"Tous les livreurs"),14,38);
doc.text("Période : "+per,14,45);
doc.text("Généré le : "+new Date().toLocaleDateString("fr-FR"),14,52);
doc.setFont("helvetica","bold");doc.setTextColor(31,42,92);doc.setFontSize(12);
doc.text("Nombre de déplacements : "+f.length+"      Montant total : "+mny(tot),14,63);
var head,body,foot,cs;
if(who){
head=[["Date","Zones","Montant","Signature Livreur"]];
body=f.map(function(r){return[fd(r.d),r.z.join(", "),mny(r.m),""]});
if(!body.length)body=[["-","Aucune livraison","-",""]];
foot=[["Total",f.length+" déplacement(s)",mny(tot),""]];
cs={2:{halign:"right"},3:{cellWidth:55}};
}else{
var g={};DRIVERS.forEach(function(k){g[k]={n:0,s:0}});
f.forEach(function(r){g[r.l]=g[r.l]||{n:0,s:0};g[r.l].n++;g[r.l].s+=r.m});
var ks=Object.keys(g).sort(function(x,y){return g[y].s-g[x].s||x.localeCompare(y)});
head=[["Livreur","Nb déplacements","Montant total","Signature Livreur"]];
body=ks.map(function(k){return[k,g[k].n,mny(g[k].s),""]});
foot=[["Total",f.length,mny(tot),""]];
cs={1:{halign:"center"},2:{halign:"right"},3:{cellWidth:50}};
}
doc.autoTable({startY:70,head:head,body:body,foot:foot,showFoot:"lastPage",theme:"grid",styles:{fontSize:10,valign:"middle"},bodyStyles:{minCellHeight:14},headStyles:{fillColor:NAVY,textColor:255},footStyles:{fillColor:GOLD,textColor:NAVY,fontStyle:"bold"},columnStyles:cs});
var name="recap-deplacements-salipro-"+(who?who.toLowerCase().replace(/[^a-z0-9]+/g,"-"):"tous")+".pdf";
try{var bl=doc.output("blob");if(DL){await DL.save({filename:name,data:bl})}else{dlBlob(bl,name)}toast("PDF prêt ✔ "+name)}
catch(e){if(e&&e.code==="declined")toast("Téléchargement annulé");else toast("Téléchargement impossible ("+((e&&(e.code||e.message))||"erreur")+")",1)}
}
$("pdf").onclick=pdfRecap;
function ymd(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
[].forEach.call(document.querySelectorAll("button[data-p]"),function(bt){bt.onclick=function(){
var n=new Date(),k=bt.getAttribute("data-p");
if(k==="all"){$("p1").value="";$("p2").value=""}
else{var o=k==="m1"?1:0;$("p1").value=ymd(new Date(n.getFullYear(),n.getMonth()-o,1));$("p2").value=ymd(new Date(n.getFullYear(),n.getMonth()-o+1,0))}}});
if(window.claude&&window.claude.use){window.claude.use("downloads").then(function(d){DL=d;}).catch(function(){})}
render();

// --- SCRIPT BLOCK ---

(function(){
var CSS=":root{--hdA:#293361;--hdB:#3f4f9a}\n@keyframes exUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}\n@keyframes exPulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ac) 35%,transparent)}50%{box-shadow:0 0 0 9px transparent}}\n@keyframes exFloat{50%{transform:translate(-14px,10px) scale(1.08)}}\n@keyframes exGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n.card,.kpi{border-radius:18px!important;box-shadow:0 6px 22px rgba(20,30,70,.08);animation:exUp .55s both;transition:transform .25s,box-shadow .25s}\n.card:hover,.kpi:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(20,30,70,.15)}\n.card:nth-child(2),.kpi:nth-child(2){animation-delay:.06s}.card:nth-child(3),.kpi:nth-child(3){animation-delay:.12s}.card:nth-child(4){animation-delay:.18s}.card:nth-child(5){animation-delay:.24s}.card:nth-child(6){animation-delay:.3s}.card:nth-child(n+7){animation-delay:.36s}\n.kpi{position:relative;overflow:hidden}.kpi:before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(var(--ac),#ECC10F)}.kpi b{font-size:26px!important}\n.hd,header{background:linear-gradient(120deg,var(--hdA),var(--hdB))!important;color:#fff!important;border-radius:20px;padding:16px 20px!important;box-shadow:0 10px 28px rgba(20,30,70,.22);position:relative;overflow:hidden}\n.hd:after,header:after{content:\"\";position:absolute;right:-40px;top:-60px;width:180px;height:180px;border-radius:50%;background:rgba(236,193,15,.22);animation:exFloat 6s ease-in-out infinite;pointer-events:none}\n.hd h1,.hd h1 *,header b,header span{color:#fff!important}header{margin:12px}\nbutton{transition:transform .15s,box-shadow .2s,filter .2s}button:hover{transform:translateY(-2px);filter:brightness(1.08)}button:active{transform:scale(.96)}\nbutton:not(.s):not(.sec):not(.g):not(.ex-sw):not(.ex-t){background:linear-gradient(120deg,var(--ac),color-mix(in srgb,var(--ac) 65%,#fff))!important;color:#fff!important;box-shadow:0 4px 12px color-mix(in srgb,var(--ac) 35%,transparent)}\ninput:focus,select:focus{outline:2px solid var(--ac);outline-offset:1px}\ntbody tr{transition:background .2s}tbody tr:hover td{background:color-mix(in srgb,var(--ac) 9%,transparent)}\nlabel.chip{transition:.2s}label.chip:has(input:checked){background:var(--ac);color:#fff;border-color:var(--ac);transform:scale(1.05)}\n#drop{animation:exPulse 2.4s infinite;transition:.25s}#drop.over,#drop.ex-drag{transform:scale(1.015);animation:none;border-color:var(--ac);background:var(--ac2)}\n.ex-theme{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));right:12px;z-index:60}\n.ex-t{width:42px;height:42px;border-radius:50%!important;padding:0!important;font-size:20px;background:var(--card)!important;color:var(--tx)!important;border:1px solid var(--bd)!important;box-shadow:0 6px 18px rgba(0,0,0,.2)}\n.ex-menu{display:none;position:absolute;right:0;top:48px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,.25);flex-direction:column;gap:6px;min-width:150px}.ex-menu.on{display:flex;animation:exUp .25s both}\n.ex-sw{display:flex;align-items:center;gap:8px;background:var(--bg)!important;color:var(--tx)!important;border:1px solid var(--bd)!important;box-shadow:none!important;border-radius:10px!important;padding:6px 10px!important;text-align:left}.ex-sw.on{border-color:var(--ac)!important;font-weight:700}\n.ex-dot{width:16px;height:16px;border-radius:50%;display:inline-block;background:linear-gradient(135deg,var(--a),var(--b))}\n.ex-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:10px 0}.ex-k>div{background:var(--bg);border:1px solid var(--bd);border-radius:14px;padding:10px}.ex-k small{display:block;color:var(--mu);font-size:11px}.ex-k b{font-size:20px;color:var(--ac)}\n.ex-up{color:#d64545}.ex-dn{color:#1f9d6b}\n.ex-row{display:grid;grid-template-columns:minmax(90px,130px) 1fr 90px;gap:8px;align-items:center;font-size:13px;margin:6px 0}.ex-track{height:10px;background:var(--bd);border-radius:6px;overflow:hidden}.ex-fill{height:100%;background:linear-gradient(90deg,var(--ac),#ECC10F);border-radius:6px;transform-origin:left;animation:exGrow .8s both}\n.ex-two{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.ex-tip{font-size:13px;color:var(--mu)}.ex-tip li{margin:4px 0}\n.ex-bar{height:12px;background:var(--bd);border-radius:8px;overflow:hidden}.ex-bar>i{display:block;height:100%;transition:width 1s}\ndetails.ex-d summary{cursor:pointer;font-weight:700;color:var(--ac)}\n";var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
var TH={salipro:{n:"Salipro",a:"#293361",b:"#3f4f9a",bg:"#f3f5fa",card:"#ffffff",tx:"#1b2140",mu:"#6b7394",bd:"#e3e7f2",ac:"#293361",ac2:"#e6e9f5",tt:"#293361",dg:"#d64545",ok:"#1f9d6b"},
ocean:{n:"Océan",a:"#0c4a6e",b:"#0891b2",bg:"#f0f9ff",card:"#ffffff",tx:"#0c2a3a",mu:"#4b7185",bd:"#d3e8f3",ac:"#0e7490",ac2:"#dff3f9",tt:"#0c4a6e",dg:"#dc2626",ok:"#15803d"},
foret:{n:"Forêt",a:"#14532d",b:"#16a34a",bg:"#f0fdf4",card:"#ffffff",tx:"#14281d",mu:"#52705e",bd:"#d4ebdb",ac:"#15803d",ac2:"#dcf5e5",tt:"#14532d",dg:"#dc2626",ok:"#15803d"},
sunset:{n:"Sunset",a:"#9a3412",b:"#f97316",bg:"#fff7ed",card:"#ffffff",tx:"#2b1a10",mu:"#7c5a45",bd:"#f5e1cf",ac:"#ea580c",ac2:"#ffe9d6",tt:"#9a3412",dg:"#b91c1c",ok:"#15803d"},
violet:{n:"Violet",a:"#4c1d95",b:"#8b5cf6",bg:"#f5f3ff",card:"#ffffff",tx:"#1e1536",mu:"#6b5f8a",bd:"#e4def7",ac:"#7c3aed",ac2:"#ece6fd",tt:"#4c1d95",dg:"#dc2626",ok:"#15803d"}};
var KEYS=["bg","card","tx","mu","bd","ac","ac2","tt","dg","ok"];
function apply(k,fp){var t=TH[k]||TH.salipro,r=document.documentElement;KEYS.forEach(function(x){r.style.setProperty("--"+x,t[x])});r.style.setProperty("--hdA",t.a);r.style.setProperty("--hdB",t.b);try{localStorage.setItem("salipro_theme",k)}catch(e){}if(!fp){try{if(parent!==window&&parent.__setTheme)parent.__setTheme(k)}catch(e){}}[].forEach.call(document.querySelectorAll(".ex-sw"),function(b){b.classList.toggle("on",b.dataset.k===k)})}
var w=document.createElement("div");w.className="ex-theme";w.innerHTML='<button class="ex-t" title="Thème" aria-label="Changer le thème">🎨</button><div class="ex-menu">'+Object.keys(TH).map(function(k){return'<button class="ex-sw" data-k="'+k+'"><span class="ex-dot" style="--a:'+TH[k].a+';--b:'+TH[k].b+'"></span>'+TH[k].n+'</button>'}).join("")+'</div>';
document.body.appendChild(w);var mn=w.querySelector(".ex-menu");
w.querySelector(".ex-t").onclick=function(e){e.stopPropagation();mn.classList.toggle("on")};
mn.onclick=function(e){var b=e.target.closest(".ex-sw");if(b){apply(b.dataset.k);mn.classList.remove("on")}};
document.addEventListener("click",function(){mn.classList.remove("on")});
var cur="salipro";try{cur=localStorage.getItem("salipro_theme")||"salipro"}catch(e){}try{if(parent!==window&&parent.__getTheme)cur=parent.__getTheme()||cur}catch(e){}if(!TH[cur])cur="salipro";apply(cur,true);window.__applyTheme=function(k){apply(k,true)};
/* compteurs animés */
function cu(el){var tx=el.textContent,m=tx.match(/^([^\d-]*)(-?[\d\s.,]*\d)(.*)$/);if(!m){el.dataset.cu=tx;return}var raw=m[2].replace(/\s/g,"").replace(",","."),v=parseFloat(raw);if(isNaN(v)){el.dataset.cu=tx;return}var dec=(raw.split(".")[1]||"").length,t0=performance.now(),tok=(el._tk=(el._tk||0)+1);el._last=undefined;el.dataset.anim="1";el.dataset.cu=tx;
(function f(t){if(el._tk!==tok)return;if(el._last!==undefined&&el.textContent!==el._last){cu(el);return}var p=Math.min(1,(t-t0)/700),e=1-Math.pow(1-p,3),n=(v*e).toLocaleString("fr-FR",{minimumFractionDigits:dec,maximumFractionDigits:dec}),s=m[1]+(p<1?n:m[2])+m[3];el._last=s;el.textContent=s;if(p<1)requestAnimationFrame(f);else delete el.dataset.anim})(t0)}
var tm;new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(function(){[].forEach.call(document.querySelectorAll(".kpi b,.ex-k b"),function(el){if((!el.dataset.anim&&el.textContent!==el.dataset.cu)||(el.dataset.anim&&el.textContent!==el._last))cu(el)})},60)}).observe(document.body,{subtree:true,childList:true,characterData:true});
[].forEach.call(["dragenter","dragover"],function(ev){document.addEventListener(ev,function(){var d=document.getElementById("drop");if(d)d.classList.add("ex-drag")})});
[].forEach.call(["dragleave","drop"],function(ev){document.addEventListener(ev,function(){var d=document.getElementById("drop");if(d)d.classList.remove("ex-drag")})});
window.__exEsc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
window.__exF=function(n){return Math.round(n||0).toLocaleString("fr-FR")};
})();

(function(){
var E=window.__exEsc,F=window.__exF,per="m0",last="";
var kp=document.querySelector(".kpis");if(!kp)return;
var el=document.createElement("div");el.className="card";el.id="pil";kp.insertAdjacentElement("afterend",el);
var _hb=0,_ht=0;function hubBud(){if(Date.now()-_ht<5000)return _hb;_ht=Date.now();try{var s=JSON.parse(localStorage.getItem("salipro_hub_state"));_hb=s&&s.bud&&s.bud.dm||0}catch(e){_hb=0}return _hb}
function bud(){var v=0;try{v=+localStorage.getItem("dep_budget")||0}catch(e){}return v||hubBud()}
function iso(d){return d.toISOString().slice(0,10)}
function ym(o){var d=new Date();d.setDate(1);d.setMonth(d.getMonth()+o);return iso(d).slice(0,7)}
function inR(r,p){var d=r.d||"";if(p=="m0")return d.slice(0,7)==ym(0);if(p=="m1")return d.slice(0,7)==ym(-1);if(p=="m2")return d.slice(0,7)==ym(-2);if(p=="d30")return d>=iso(new Date(Date.now()-30*864e5));return true}
function sum(a){return a.reduce(function(s,r){return s+(+r.m||0)},0)}
function rows(o,fmt){var mx=Math.max.apply(null,o.map(function(x){return x[1]}).concat([1]));return o.map(function(x,i){return'<div class="ex-row"><span>'+E(x[0])+'</span><div class="ex-track"><div class="ex-fill" style="width:'+(x[1]/mx*100)+'%;animation-delay:'+i*.06+'s"></div></div><b>'+F(x[1])+' MAD</b></div>'}).join("")||'<div class="ex-tip">Aucune donnée</div>'}
function draw(){var D=window.data||[],cur=D.filter(function(r){return inR(r,per)}),prev=per=="m0"?D.filter(function(r){return inR(r,"m1")}):per=="m1"?D.filter(function(r){return inR(r,"m2")}):null,tot=sum(cur),n=cur.length,avg=n?tot/n:0,dl=prev&&sum(prev)?(tot/sum(prev)-1)*100:null;
var bl={},bz={};cur.forEach(function(r){bl[r.l]=(bl[r.l]||0)+(+r.m||0);var z=[].concat(r.z||[]);z.forEach(function(x){bz[x]=(bz[x]||0)+(+r.m||0)/(z.length||1)})});
var tl=Object.keys(bl).map(function(k){return[k,bl[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,6),tz=Object.keys(bz).map(function(k){return[k,bz[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,6);
var B=bud(),m0=sum(D.filter(function(r){return inR(r,"m0")})),pc=B?m0/B*100:0,col=!B?"var(--mu)":m0>B?"#d64545":m0>B*.8?"#d9a400":"#1f9d6b";
var seen={},dup=[];cur.forEach(function(r){var k=r.d+"|"+r.l+"|"+[].concat(r.z).join(",");if(seen[k])dup.push(r);seen[k]=1});
var odd=n>3?cur.filter(function(r){return r.m>avg*1.6}).slice(0,5):[];
el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="margin:0">📊 Pilotage des frais de déplacement</h2><select id="exp">'+[["m0","Ce mois"],["m1","Mois dernier"],["d30","30 derniers jours"],["all","Tout"]].map(function(o){return'<option value="'+o[0]+'"'+(o[0]==per?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></div>'+
'<div class="ex-k"><div><small>Total période</small><b>'+F(tot)+' MAD</b></div><div><small>Déplacements</small><b>'+n+'</b></div><div><small>Moyenne / déplacement</small><b>'+F(avg)+' MAD</b></div><div><small>vs période précédente</small><b class="'+(dl==null?"":dl>0?"ex-up":"ex-dn")+'">'+(dl==null?"—":(dl>0?"+":"")+dl.toFixed(1)+" %")+'</b></div></div>'+
'<div class="ex-two"><div><h2>👤 Par livreur</h2>'+rows(tl)+'</div><div><h2>📍 Par zone</h2>'+rows(tz)+'</div></div>'+
'<div class="ex-two" style="margin-top:12px"><div><h2>🎯 Budget du mois</h2><div style="display:flex;gap:8px;align-items:end;flex-wrap:wrap"><label>Budget mensuel (MAD)<input id="exb" type="number" min="0" value="'+(B||"")+'" style="width:140px"></label><span style="font-size:13px">'+F(m0)+' / '+(B?F(B):"—")+(B?' ('+pc.toFixed(0)+' %)':'')+'</span></div><div class="ex-bar" style="margin-top:8px"><i style="width:'+Math.min(pc,100)+'%;background:'+col+'"></i></div><div class="ex-tip">Orange à 80 %, rouge au-delà.</div></div>'+
'<div><h2>⚠️ À vérifier</h2>'+(odd.length||dup.length?'<ul class="ex-tip">'+odd.map(function(r){return'<li>'+E(r.d)+' · '+E(r.l)+' : '+F(r.m)+' MAD (très au-dessus de la moyenne)</li>'}).join("")+dup.map(function(r){return'<li>Doublon possible : '+E(r.d)+' · '+E(r.l)+'</li>'}).join("")+'</ul>':'<div class="ex-tip">✅ Rien d’anormal sur la période.</div>')+'</div></div>'+
'<p style="margin:12px 0 0;display:flex;gap:8px;flex-wrap:wrap"><button class="s" id="excsv">⬇ Export CSV</button><button class="s" id="excp">📋 Copier le résumé</button></p>'+
'<details class="ex-d" style="margin-top:12px"><summary>💡 Idées pour mieux gérer les déplacements</summary><ul class="ex-tip"><li><b>Barème automatique</b> : montant proposé selon la zone choisie.</li><li><b>Validation mensuelle</b> par le responsable avant paiement (statut Validé / Payé).</li><li><b>Plafond par livreur</b> et alerte au dépassement.</li><li><b>Justificatif</b> (photo du bon) joint à chaque déplacement.</li><li><b>Détection des doublons</b> (même livreur, même jour, même zone) — déjà actif ci-dessus.</li><li><b>Comparaison mois par mois</b> par livreur et par zone.</li><li><b>Export pour la paie</b> : un fichier Excel par livreur.</li><li><b>Envoi du récap</b> au livreur par WhatsApp.</li></ul></details>';
last=D.length+":"+(D.length?D[D.length-1].id:0)+":"+per+":"+B;
document.getElementById("exp").onchange=function(){per=this.value;draw()};
document.getElementById("exb").onchange=function(){try{localStorage.setItem("dep_budget",this.value)}catch(e){}draw()};
document.getElementById("excp").onclick=function(){var t="Déplacements Salipro Tétouan : "+F(tot)+" MAD · "+n+" trajets · moyenne "+F(avg)+" MAD";try{navigator.clipboard.writeText(t);if(window.toast)toast("Résumé copié")}catch(e){}};
document.getElementById("excsv").onclick=function(){var c=["Date;Zones;Livreur;Montant"].concat(cur.map(function(r){return[r.d,[].concat(r.z).join(" + "),r.l,r.m].join(";")})).join("\n"),b=new Blob(["\ufeff"+c],{type:"text/csv"});if(window.dlBlob)dlBlob(b,"deplacements.csv");else{var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="deplacements.csv";document.body.appendChild(a);a.click();a.remove()}}}
draw();setInterval(function(){var D=window.data||[],s=D.length+":"+(D.length?D[D.length-1].id:0)+":"+per+":"+bud();if(s!==last)draw()},1500);
})();