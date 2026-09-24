(function(global){
  const routes=["ASSESSMENT","AUTO_ELIGIBLE","BOUNDED_AUTONOMY","HUMAN_GATE","BLOCKED"];

  function routeTask(task){
    if(!task || !task.preflightComplete || !task.scopeClear || !task.checksDeclared){
      return {route:"ASSESSMENT",reason:"Preflight, scope or checks are incomplete."};
    }

    if(task.protectedSurface && !task.authorizationPresent){
      return {route:"HUMAN_GATE",reason:"Protected surface requires explicit authorization."};
    }

    if(task.externalEffect){
      if(!task.authorizationPresent){
        return {route:"HUMAN_GATE",reason:"External effect is not authorized."};
      }
      if(!task.reversible){
        return {route:"HUMAN_GATE",reason:"Irreversible external effect requires human review."};
      }
    }

    if(task.changeRisk === "HIGH"){
      return {route:"HUMAN_GATE",reason:"High change risk exceeds the public demo autonomy boundary."};
    }

    if(task.changeRisk === "MEDIUM" || task.externalEffect){
      return {route:"BOUNDED_AUTONOMY",reason:"Task is bounded but requires stronger verification."};
    }

    if(task.changeRisk === "LOW"){
      return {route:"AUTO_ELIGIBLE",reason:"Low-risk, bounded task with declared checks."};
    }

    return {route:"BLOCKED",reason:"Risk classification is unknown or unsupported."};
  }

  function closureStatus(input){
    const route=routes.includes(input.route)?input.route:"BLOCKED";

    if(route==="ASSESSMENT" || route==="BLOCKED"){
      return {status:"BLOCKED",reason:"Execution is not eligible for closure."};
    }

    if(route==="HUMAN_GATE" && !input.humanApproved){
      return {status:"HUMAN_DECISION_REQUIRED",reason:"Human approval is still required."};
    }

    if(!input.checksPassed){
      return {status:"NOT_VALIDATED",reason:"Declared checks have not passed."};
    }

    if(!input.verifierPassed){
      return {status:"NOT_VALIDATED",reason:"Independent verification is missing."};
    }

    if((input.evidenceCount||0)<1){
      return {status:"NOT_VALIDATED",reason:"No closure evidence is registered."};
    }

    if((input.unresolved||0)>0){
      return {status:"PARTIAL",reason:"Unresolved items remain."};
    }

    return {status:"COMPLETED_VALIDATED",reason:"Checks, verifier and evidence support closure."};
  }

  global.WiiOpsLogic={routeTask,closureStatus};
})(typeof window!=="undefined"?window:globalThis);
