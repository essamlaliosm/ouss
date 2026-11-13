const K=["Volume","Vitesse","Qualité","Régularité","Assiduité"],DW=[30,20,25,15,10];let W=[...DW],F="Tous";
const R={P:"Préparateur",T:"Pointeur",L:"Livreur"};
const U={P:["cmd/j",v=>Math.round(18+v*.4)],T:["palettes/j",v=>Math.round(30+v*.6)],L:["livr./j",v=>Math.round(8+v*.17)]};
const DEMO=[["Karim B.","P","Sec",92,85,88,90,95],["Youssef A.","P","Frais",78,70,95,80,92],["Hamza R.","P","Surgelé",60,55,70,62,70],["Imad S.","P","Sec",85,90,62,75,88],["Anas T.","P","Frais",48,52,66,50,58],
["Said M.","T","Sec",88,80,94,86,96],["Nabil O.","T","Frais",70,75,80,72,80],["Rachid L.","T","Surgelé",52,58,60,55,64],["Hicham D.","T","Sec",66,60,90,70,76],
["Mehdi K.","L","Frais",90,82,86,88,94],["Omar Z.","L","Sec",74,68,92,78,85],["Ayoub H.","L","Surgelé",58,50,64,60,55],["Soufiane E.","L","Sec",82,86,58,72,80]];
const mk=o=>({id:o.id,n:o.n,r:o.r,d:o.d,b:o.b,demo:!!o.demo,get m(){const a=[...this.b];a[2]=Math.max(0,a[2]-pen(this));return a}});
let RAW=null;try{RAW=JSON.parse(localStorage.getItem("perf_ppl_v1"))}catch(e){}
if(!Array.isArray(RAW))RAW=DEMO.map((d,i)=>({id:i,n:d[0],r:d[1],d:d[2],b:d.slice(3),demo:true}));
let D=RAW.map(mk);
const saveP=()=>{try{localStorage.setItem("perf_ppl_v1",JSON.stringify(D.map(p=>({id:p.id,n:p.n,r:p.r,d:p.d,b:p.b,demo:p.demo}))))}catch(e){}};
const byId=id=>D.find(p=>p.id===id);
const nid=()=>D.reduce((m,p)=>Math.max(m,p.id),-1)+1;
const MO={P:["Quantité en moins","Quantité en plus","Article différent","Qualité : déchiré","Qualité : cabossé"],L:["Manque d’articles","Réclamation client","Retard de livraison"]};
MO.T=[...MO.P,"Commande chargée sans pointage","Partie en livraison sans facture"];
const PEN=4;let ERR=[];try{ERR=JSON.parse(localStorage.getItem("perf_err_v1")||"[]")}catch(e){}
const saveE=()=>{try{localStorage.setItem("perf_err_v1",JSON.stringify(ERR))}catch(e){}};
const curM=()=>{const n=new Date();return n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2)};let PM=window.__GM||curM();const MLAB=m=>new Date(m+"-01T12:00:00").toLocaleDateString("fr-FR",{month:"long",year:"numeric"});const EMo=()=>ERR.filter(e=>(e.d||"").slice(0,7)===PM);const pen=p=>EMo().filter(e=>e.p===p.id).length*PEN;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
function ERRUI(){
 const e=document.getElementById("er"),f=document.getElementById("ep"),m=document.getElementById("em");
 const fill=()=>{const r=e.value;f.innerHTML=D.filter(p=>p.r===r).map(p=>`<option value="${p.id}">${p.n}</option>`).join("");m.innerHTML=MO[r].map(x=>`<option>${x}</option>`).join("")};
 e.innerHTML=Object.keys(R).map(k=>`<option value="${k}">${R[k]}</option>`).join("");fill();e.onchange=fill;window.fillErr=fill;
 document.getElementById("ed").value=new Date().toISOString().slice(0,10);
 document.getElementById("ea").onclick=()=>{if(!f.value)return;const o=document.getElementById("eo").value.trim();if(!o){document.getElementById("eo").focus();return}
  ERR.unshift({id:Date.now(),d:document.getElementById("ed").value,p:+f.value,o,x:m.value,c:document.getElementById("ec").value.trim()});saveE();document.getElementById("eo").value="";document.getElementById("ec").value="";render()};
 document.getElementById("eh").onclick=ev=>{const b=ev.target.closest("[data-del]");if(b){ERR=ERR.filter(x=>x.id!==+b.dataset.del);saveE();render()}}}
function renderErr(){const gmn=document.getElementById("gmn");if(gmn)gmn.textContent="📅 Erreurs et pénalités du mois : "+MLAB(PM);
 const v=EMo().filter(x=>byId(x.p)&&(F==="Tous"||R[byId(x.p).r]+"s"===F)),cm={},cp={};
 v.forEach(x=>{cm[x.x]=(cm[x.x]||0)+1;cp[byId(x.p).n]=(cp[byId(x.p).n]||0)+1});
 const mm=Object.entries(cm).sort((a,b)=>b[1]-a[1]),pp=Object.entries(cp).sort((a,b)=>b[1]-a[1]),mx=mm.length?mm[0][1]:1;
 document.getElementById("es").innerHTML=`<div class="card kpi"><small>Erreurs enregistrées</small><div class="n">${v.length}</div><div class="s">${F}</div></div><div class="card kpi"><small>Motif n°1</small><div class="n" style="font-size:16px">${mm[0]?mm[0][0]:"—"}</div><div class="s">${mm[0]?mm[0][1]+" fois":""}</div></div><div class="card kpi"><small>Plus d’erreurs</small><div class="n" style="font-size:16px">${pp[0]?pp[0][0]:"—"}</div><div class="s">${pp[0]?pp[0][1]+" erreur(s)":""}</div></div>`;
 document.getElementById("em2").innerHTML=mm.map(([k,n])=>`<div style="margin:8px 0;font-size:12px">${k} · <b>${n}</b><div class="bar" style="margin-top:4px"><i style="width:${n/mx*100}%;background:var(--a)"></i></div></div>`).join("")||"<small>Rien à afficher</small>";
 document.getElementById("eh").innerHTML=v.length?`<table><tr><th>Date</th><th>Nom</th><th>Rôle</th><th>N° commande</th><th>Motif</th><th>Remarque</th><th></th></tr>${v.map(x=>`<tr><td>${x.d}</td><td>${byId(x.p).n}</td><td>${R[byId(x.p).r]}</td><td>${esc(x.o)}</td><td>${x.x}</td><td>${esc(x.c||"")}</td><td><button class="x" data-del="${x.id}" style="float:none;width:26px;height:26px">✕</button></td></tr>`).join("")}</table>`:"<small>Aucune erreur enregistrée.</small>"}
const TIP={Volume:"Fixer un objectif journalier clair, répartir les tâches plus équitablement et suivre le volume chaque semaine.",Vitesse:"Former aux bons parcours (rangement par fréquence de rotation), vérifier l’état du PDA et réduire les temps d’attente.",Qualité:"Binôme avec un collègue fiable, double contrôle sur les références à risque, rappel des erreurs fréquentes (quantité, mauvais produit, produit cabossé).",Régularité:"Éviter les pics et creux : planifier les pauses, répartir la charge sur la journée et faire un point court en fin de journée.",Assiduité:"Entretien individuel pour comprendre les absences ou retards, et fixer un objectif réaliste de présence."};
const sc=(p,w=W)=>p.m.reduce((s,v,i)=>s+v*w[i],0)/w.reduce((a,b)=>a+b,0);
const lv=s=>s>=75?["Top performer","top"]:s>=55?["Solide","mid"]:["À accompagner","low"];
const col=s=>s>=75?"#293361":s>=55?"#ecc10f":"#2f6bff";
const ini=n=>n.split(" ").map(x=>x[0]).join("");
const tr=p=>{const k=((p.id%5)-2)*.8;return Array.from({length:6},(_,i)=>Math.max(20,Math.min(100,sc(p)+Math.sin(p.id*3+i*1.7)*5-(5-i)*k)))};
const list=()=>D.filter(p=>F==="Tous"||R[p.r]+"s"===F).sort((a,b)=>sc(b)-sc(a));
function cnt(el,to,dec=0){const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/900);el.textContent=(to*(1-Math.pow(1-k,3))).toFixed(dec);if(k<1)requestAnimationFrame(f)})(t0)}
function avg(l,i){return l.reduce((s,p)=>s+p.m[i],0)/l.length}
function render0(){renderErr();
 const l=list(),A=l.reduce((s,p)=>s+sc(p),0)/l.length,top=l.filter(p=>sc(p)>=75).length,low=l.filter(p=>sc(p)<55).length;
 document.getElementById("tabs").innerHTML=["Tous","Préparateurs","Pointeurs","Livreurs"].map(t=>`<button class="tab ${t===F?"on":""}" data-t="${t}">${t}</button>`).join("");
 document.getElementById("kpis").innerHTML=[["Effectif",l.length,"personnes suivies",0],["Score moyen",A,"sur 100",1],["Top performers",top,"score ≥ 75",0],["À accompagner",low,"score < 55",0]].map(k=>`<div class="card kpi"><small>${k[0]}</small><div class="n" data-v="${k[1]}" data-d="${k[3]}">0</div><div class="s">${k[2]}</div></div>`).join("");
 document.querySelectorAll(".kpi .n").forEach(e=>cnt(e,+e.dataset.v,+e.dataset.d));
 document.getElementById("pod").innerHTML=l.slice(0,3).map((p,i)=>`<div class="card pc" data-i="${p.id}" style="animation-delay:${i*.15}s"><div class="m">${["🥇","🥈","🥉"][i]}</div><b>${p.n}</b><small style="color:var(--mut)">${R[p.r]} · ${p.d}</small><div class="sc">${sc(p).toFixed(1)}</div></div>`).join("");
 document.getElementById("rk").innerHTML=l.map((p,i)=>{const s=sc(p),b=lv(s),t=tr(p),up=t[5]>=t[0];return`<div class="row" data-i="${p.id}"><b>${i+1}</b><div class="av">${ini(p.n)}</div><div class="nm">${p.n}<small>${R[p.r]} · ${p.d}</small></div><div class="bw bar"><span style="color:${col(s)}">${s.toFixed(1)}</span><i data-w="${s}" style="background:${col(s)}"></i></div><div class="bd ${b[1]}">${b[0]}</div><div class="tr" style="color:${up?"#293361":"#2f6bff"};font-weight:800">${up?"▲":"▼"}</div></div>`}).join("");
 setTimeout(()=>document.querySelectorAll(".bar i").forEach(e=>e.style.width=e.dataset.w+"%"),60);
 const av=K.map((_,i)=>avg(l,i)),mx=av.indexOf(Math.max(...av)),mn=av.indexOf(Math.min(...av)),sp=Math.max(...l.map(q=>sc(q)))-Math.min(...l.map(q=>sc(q)));
 document.getElementById("ins").innerHTML=`<div class="card"><b>✅ Force collective</b><p>${K[mx]} (${av[mx].toFixed(0)}/100) est le point le plus solide du groupe.</p></div><div class="card w"><b>⚠️ Faiblesse collective</b><p>${K[mn]} (${av[mn].toFixed(0)}/100) est à améliorer en priorité.</p><div class="tp">${TIP[K[mn]]}</div></div><div class="card"><b>📏 Écart de performance</b><p>${sp.toFixed(0)} points séparent le meilleur du moins performant. ${sp>30?"L’écart est important : prévoir du coaching croisé.":"Le groupe est plutôt homogène."}</p></div>`;
}
function radar(p,l){const c=110,r=80,pt=(v,i)=>{const a=(i*72-90)*Math.PI/180;return[c+Math.cos(a)*r*v/100,c+Math.sin(a)*r*v/100].map(x=>x.toFixed(1)).join(",")};
 const poly=(f,fill,st)=>`<polygon points="${K.map((_,i)=>pt(f(i),i)).join(" ")}" fill="${fill}" stroke="${st}" stroke-width="2"/>`;
 return`<svg viewBox="0 0 220 220" width="100%" style="max-width:300px;display:block;margin:auto">${[25,50,75,100].map(g=>`<polygon points="${K.map((_,i)=>pt(g,i)).join(" ")}" fill="none" stroke="#dfe7f0"/>`).join("")}${K.map((k,i)=>{const q=pt(112,i).split(",");return`<text x="${q[0]}" y="${q[1]}" font-size="9.5" text-anchor="middle" fill="#6b7a90">${k}</text>`}).join("")}${poly(i=>avg(l,i),"rgba(236,193,15,.15)","#ecc10f")}${poly(i=>p.m[i]*1,"rgba(20,184,166,.35)","#293361")}</svg>`}
function detail(id){const p=byId(id),l=D.filter(x=>x.r===p.r),s=sc(p),b=lv(s),o=K.map((k,i)=>[k,p.m[i]]).sort((a,b)=>b[1]-a[1]),st=o.filter(x=>x[1]>=80).slice(0,3),wk=o.filter(x=>x[1]<65).reverse().slice(0,3),t=tr(p),rk=[...l].sort((a,b)=>sc(b)-sc(a)).findIndex(x=>x.id===id)+1;
 const sp=`<svg viewBox="0 0 120 34" width="140" height="40"><polyline fill="none" stroke="#293361" stroke-width="2.5" stroke-linecap="round" points="${t.map((v,i)=>`${i*22+5},${34-(v-20)/80*30}`).join(" ")}"/></svg>`;
 const d=document.getElementById("dr");
 d.innerHTML=`<button class="x" id="cl">✕</button><button class="btn ghost" id="ed" style="float:right;margin-right:38px;padding:6px 10px;font-size:12px">✏️ Modifier</button><div style="display:flex;gap:12px;align-items:center"><div class="av" style="width:52px;height:52px;font-size:18px">${ini(p.n)}</div><div><b style="font-size:18px">${p.n}</b><br><small style="color:var(--mut)">${R[p.r]} · ${p.d} · ${U[p.r][1](p.m[0])} ${U[p.r][0]}</small></div></div>
 <div style="display:flex;gap:14px;align-items:center;margin:14px 0"><div><div style="font-size:34px;font-weight:800;color:${col(s)}">${s.toFixed(1)}</div><span class="bd ${b[1]}">${b[0]}</span></div><div style="flex:1;font-size:13px;color:var(--mut)">Rang ${rk}/${l.length} parmi les ${R[p.r].toLowerCase()}s<br>Évolution 6 semaines<br>${sp}</div></div>
 ${radar(p,l)}<div style="font-size:11px;text-align:center;color:var(--mut)"><span style="color:#293361">■</span> ${p.n} &nbsp; <span style="color:#ecc10f">■</span> moyenne du groupe</div>
 <h2>Points forts</h2>${st.length?st.map(x=>`<span class="chip sg">${x[0]} ${x[1]}</span>`).join(""):"<small>Aucun point fort marqué (≥ 80)</small>"}
 <h2>Points faibles</h2>${wk.length?wk.map(x=>`<span class="chip wk">${x[0]} ${x[1]}</span>`).join(""):"<small>Aucun point faible (tout ≥ 65) 👏</small>"}
 <h2>Erreurs enregistrées</h2>${EMo().filter(e=>e.p===id).map(e=>`<div class="tp"><b>${e.x}</b> · ${esc(e.o)} · ${e.d}${e.c?"<br>"+esc(e.c):""}</div>`).join("")||"<small>Aucune erreur enregistrée</small>"}<h2>Plan d’action</h2>${wk.length?wk.map(x=>`<div class="tp"><b>${x[0]}</b> — ${TIP[x[0]]}</div>`).join(""):`<div class="tp">Profil solide : confier un rôle de référent ou de formateur pour transmettre les bonnes pratiques.</div>`}`;
 d.classList.add("o");document.getElementById("ov").classList.add("o");document.getElementById("cl").onclick=close;document.getElementById("ed").onclick=()=>openForm(id)}
function close(){document.getElementById("dr").classList.remove("o");document.getElementById("ov").classList.remove("o")}
document.getElementById("ov").onclick=close;
document.addEventListener("click",e=>{const t=e.target.closest(".tab"),r=e.target.closest("[data-i]");if(t){F=t.dataset.t;render()}else if(r)detail(+r.dataset.i)});
document.getElementById("wts").innerHTML=K.map((k,i)=>`<div><label>${k} : <b id="w${i}">${W[i]}</b>%</label><input type="range" min="0" max="60" value="${W[i]}" data-w="${i}"></div>`).join("");
document.getElementById("wts").oninput=e=>{const i=+e.target.dataset.w;W[i]=+e.target.value||0;if(!W.some(x=>x))W[i]=1;document.getElementById("w"+i).textContent=W[i];render()};
document.getElementById("rs").onclick=()=>{W=[...DW];W.forEach((v,i)=>{document.getElementById("w"+i).textContent=v;document.querySelector(`[data-w="${i}"]`).value=v});render()};

function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
function render(){const l=list(),t=document.getElementById("pc");t.style.display=D.some(p=>p.demo)?"":"none";t.textContent="🧹 Retirer la démo";
 if(l.length){render0();return}
 renderErr();
 document.getElementById("tabs").innerHTML=["Tous","Préparateurs","Pointeurs","Livreurs"].map(x=>`<button class="tab ${x===F?"on":""}" data-t="${x}">${x}</button>`).join("");
 document.getElementById("kpis").innerHTML=[["Effectif",0,"personnes suivies"],["Score moyen","—","sur 100"],["Top performers",0,"score ≥ 75"],["À accompagner",0,"score < 55"]].map(k=>`<div class="card kpi"><small>${k[0]}</small><div class="n">${k[1]}</div><div class="s">${k[2]}</div></div>`).join("");
 document.getElementById("pod").innerHTML="";document.getElementById("ins").innerHTML="";
 document.getElementById("rk").innerHTML='<div style="padding:22px;text-align:center;color:var(--mut)">Aucune personne dans cette liste. Utilisez « ➕ Ajouter une personne ».</div>'}
let EDIT=null;
const DEPL=()=>[...new Set(["Sec","Frais","Surgelé",...D.map(p=>p.d)])];
function closeForm(){document.getElementById("md").classList.remove("o")}
function openForm(id){const p=id==null?null:byId(id);EDIT=id;
 const v=p||{n:"",r:F==="Pointeurs"?"T":F==="Livreurs"?"L":"P",d:"Sec",b:[60,60,60,60,60]},md=document.getElementById("md");
 md.querySelector(".mb").innerHTML=`<h2 style="margin:0 0 4px">${p?"Modifier la personne":"Ajouter une personne"}</h2><label>Nom complet<input id="fn" value="${esc(v.n)}" placeholder="ex : Yassine Najjari"></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label>Rôle<select id="fr">${Object.keys(R).map(k=>`<option value="${k}" ${k===v.r?"selected":""}>${R[k]}</option>`).join("")}</select></label><label>Département<select id="fd">${DEPL().map(x=>`<option ${x===v.d?"selected":""}>${esc(x)}</option>`).join("")}</select></label></div><h2 style="margin:14px 0 2px">Compétences (0 à 100)</h2>${K.map((k,i)=>`<div class="sl"><span>${k}</span><input type="range" min="0" max="100" value="${v.b[i]}" data-k="${i}"><b id="fv${i}">${v.b[i]}</b></div>`).join("")}<div class="prev" id="fp"></div><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn" id="fs">Enregistrer</button><button class="btn ghost" id="fc">Annuler</button>${p?'<button class="btn ghost" id="fx" style="margin-left:auto;color:#2f6bff;border-color:#2f6bff">🗑 Supprimer</button>':""}</div>`;
 md.classList.add("o");prevForm();if(!p)document.getElementById("fn").focus()}
function formVals(){return[...document.querySelectorAll("#md [data-k]")].map(x=>+x.value)}
function prevForm(){const b=formVals(),p=EDIT==null?null:byId(EDIT);b.forEach((v,i)=>document.getElementById("fv"+i).textContent=v);
 const a=[...b];a[2]=Math.max(0,a[2]-(p?pen(p):0));const s=sc({m:a}),l=lv(s);
 document.getElementById("fp").innerHTML=`Score : <b style="color:${col(s)}">${s.toFixed(1)}</b> · ${l[0]}${p&&pen(p)?`<br><small>Qualité réduite de ${pen(p)} pts à cause des erreurs enregistrées.</small>`:""}`}
document.getElementById("md").addEventListener("input",e=>{if(e.target.dataset.k!==undefined)prevForm()});
document.getElementById("md").addEventListener("click",e=>{
 if(e.target.id==="md"||e.target.closest("#fc")){closeForm();return}
 if(e.target.closest("#fs")){const n=document.getElementById("fn").value.trim();if(!n){document.getElementById("fn").focus();return}
  const o={n,r:document.getElementById("fr").value,d:document.getElementById("fd").value,b:formVals()};
  let id=EDIT;if(EDIT==null){id=nid();D.push(mk({id,...o}))}else Object.assign(byId(EDIT),o);
  saveP();closeForm();if(window.fillErr)fillErr();render();if(EDIT!=null)detail(id);else close();toast(EDIT==null?"✅ Personne ajoutée":"✅ Modifications enregistrées");return}
 const x=e.target.closest("#fx");if(x){if(!x.dataset.c){x.dataset.c=1;x.textContent="Confirmer la suppression ?";return}
  const id=EDIT;D=D.filter(p=>p.id!==id);ERR=ERR.filter(r=>r.p!==id);saveE();saveP();closeForm();close();if(window.fillErr)fillErr();render();toast("🗑 Personne supprimée")}});
document.getElementById("pa").onclick=()=>openForm(null);
document.getElementById("pc").onclick=e=>{const b=e.currentTarget;if(!b.dataset.c){b.dataset.c=1;b.textContent="Confirmer ? (supprime les noms de démo)";setTimeout(()=>{delete b.dataset.c;b.textContent="🧹 Retirer la démo"},4000);return}
 delete b.dataset.c;D=D.filter(p=>!p.demo);ERR=ERR.filter(r=>byId(r.p));saveE();saveP();if(window.fillErr)fillErr();render();toast("Données de démonstration retirées")};
function teamOK(){try{return parent!==window&&typeof parent.__getTeam==="function"}catch(e){return false}}
if(teamOK())document.getElementById("pi").style.display="";
document.getElementById("pi").onclick=()=>{let t;try{t=parent.__getTeam()}catch(e){return}if(!t)return;const MP={prep:"P",point:"T",liv:"L"},have=new Set(D.map(p=>p.n.toLowerCase()));let n=0;
 Object.keys(MP).forEach(g=>(t[g]||[]).forEach(m=>{const nm=((m.p||"")+" "+(m.n||"")).trim();if(!nm||have.has(nm.toLowerCase()))return;have.add(nm.toLowerCase());D.push(mk({id:nid(),n:nm,r:MP[g],d:["Sec","Frais","Surgelé"].includes(m.dep)?m.dep:"Sec",b:[60,60,60,60,60]}));n++}));
 saveP();if(window.fillErr)fillErr();render();toast(n?n+" personne(s) importée(s) : réglez leurs compétences":"Toute l’équipe est déjà dans la liste")};

(function(){const pmI=document.getElementById("pm"),setEd=()=>{const n=new Date();document.getElementById("ed").value=PM===curM()?(n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2)+"-"+("0"+n.getDate()).slice(-2)):PM+"-01"};
 if(window.__GM){pmI.parentNode.style.display="none"}else{pmI.value=PM;pmI.onchange=()=>{if(pmI.value){PM=pmI.value;setEd();render()}}}
 setEd();window.addEventListener("salmonth",()=>{PM=window.__GM||curM();setEd();render()})})();
ERRUI();render();