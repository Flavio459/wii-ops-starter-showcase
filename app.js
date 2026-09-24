const L=window.WiiOpsLogic;
let tasks=[];
let closureTask=null;
let closure={checksPassed:false,evidenceCount:0,verifierPassed:false,humanApproved:false,unresolved:0};

function routeOf(t){return L.routeTask(t);}
function renderSummary(){
  const routed=tasks.map(t=>routeOf(t).route);
  const count=r=>routed.filter(x=>x===r).length;
  document.querySelector("#summary").innerHTML=`
    <div class="kpi"><span>Tasks</span><b>${tasks.length}</b></div>
    <div class="kpi"><span>Auto eligible</span><b>${count("AUTO_ELIGIBLE")}</b></div>
    <div class="kpi"><span>Bounded</span><b>${count("BOUNDED_AUTONOMY")}</b></div>
    <div class="kpi"><span>Human gate</span><b>${count("HUMAN_GATE")}</b></div>
    <div class="kpi"><span>Assessment / blocked</span><b>${count("ASSESSMENT")+count("BLOCKED")}</b></div>`;
}
function renderCards(items){
  document.querySelector("#cards").innerHTML=items.map(t=>{
    const r=routeOf(t);
    return `<article class="card">
      <div class="head">
        <div><div class="title">${t.id} · ${t.title}</div><div class="meta">${t.project}</div></div>
        <span class="route ${r.route}">${r.route.replaceAll("_"," ")}</span>
      </div>
      <div class="metrics">
        <div class="metric"><span>Change risk</span><b>${t.changeRisk}</b></div>
        <div class="metric"><span>External effect</span><b>${t.externalEffect?"YES":"NO"}</b></div>
        <div class="metric"><span>Protected surface</span><b>${t.protectedSurface?"YES":"NO"}</b></div>
        <div class="metric"><span>Authorization</span><b>${t.authorizationPresent?"PRESENT":"NOT PRESENT"}</b></div>
      </div>
      <div class="why"><strong>Route reason:</strong> ${r.reason}</div>
      <div class="signals">
        <span class="signal ${t.preflightComplete?"ok":"risk"}">preflight ${t.preflightComplete?"complete":"missing"}</span>
        <span class="signal ${t.scopeClear?"ok":"risk"}">scope ${t.scopeClear?"clear":"unclear"}</span>
        <span class="signal ${t.checksDeclared?"ok":"warn"}">checks ${t.checksDeclared?"declared":"missing"}</span>
        <span class="signal">expected: ${t.expectedCheck}</span>
      </div>
    </article>`;
  }).join("");
}
function resetClosure(){
  closure={checksPassed:false,evidenceCount:0,verifierPassed:false,humanApproved:false,unresolved:0};
  renderClosure();
}
function renderClosure(){
  if(!closureTask)return;
  const route=routeOf(closureTask).route;
  const result=L.closureStatus({...closure,route});
  document.querySelector("#closure-state").innerHTML=`
    <strong>${closureTask.id} · ${closureTask.title}</strong><br>
    Route: <b>${route}</b><br>
    Checks: ${closure.checksPassed?"PASS":"pending"} · Evidence: ${closure.evidenceCount} · Verifier: ${closure.verifierPassed?"PASS":"pending"} · Human approval: ${closure.humanApproved?"YES":"NO"}<br><br>
    Closure state: <span class="route ${result.status==="COMPLETED_VALIDATED"?"AUTO_ELIGIBLE":result.status==="HUMAN_DECISION_REQUIRED"?"HUMAN_GATE":"BLOCKED"}">${result.status.replaceAll("_"," ")}</span><br>
    ${result.reason}
  `;
  document.querySelector("#human-approve").disabled=route!=="HUMAN_GATE";
}
document.querySelector("#filter").addEventListener("change",e=>{
  const v=e.target.value;
  renderCards(v==="all"?tasks:tasks.filter(t=>routeOf(t).route===v));
});
document.querySelector("#closure-task").addEventListener("change",e=>{
  closureTask=tasks.find(t=>t.id===e.target.value);
  resetClosure();
});
document.querySelector("#pass-checks").addEventListener("click",()=>{closure.checksPassed=true;renderClosure();});
document.querySelector("#add-evidence").addEventListener("click",()=>{closure.evidenceCount+=1;renderClosure();});
document.querySelector("#verify").addEventListener("click",()=>{closure.verifierPassed=true;renderClosure();});
document.querySelector("#human-approve").addEventListener("click",()=>{closure.humanApproved=true;renderClosure();});
document.querySelector("#reset").addEventListener("click",resetClosure);

fetch("data/tasks.json").then(r=>r.json()).then(data=>{
  tasks=data;
  renderSummary();
  renderCards(tasks);
  const sel=document.querySelector("#closure-task");
  sel.innerHTML=tasks.map(t=>`<option value="${t.id}">${t.id} · ${t.title}</option>`).join("");
  closureTask=tasks[0];
  renderClosure();
}).catch(()=>{document.querySelector("#cards").innerHTML="<p>Could not load synthetic task data.</p>";});
