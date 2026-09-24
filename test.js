require("./logic.js");
const assert=require("node:assert/strict");
const L=globalThis.WiiOpsLogic;
let passed=0;
function test(name,fn){fn();passed+=1;console.log("PASS",name);}

const base={
  changeRisk:"LOW",externalEffect:false,protectedSurface:false,authorizationPresent:true,
  reversible:true,preflightComplete:true,scopeClear:true,checksDeclared:true
};

test("low-risk bounded work can be auto eligible",()=>{
  assert.equal(L.routeTask(base).route,"AUTO_ELIGIBLE");
});

test("medium-risk work uses bounded autonomy",()=>{
  assert.equal(L.routeTask({...base,changeRisk:"MEDIUM"}).route,"BOUNDED_AUTONOMY");
});

test("protected external work without authorization hits human gate",()=>{
  assert.equal(L.routeTask({...base,externalEffect:true,protectedSurface:true,authorizationPresent:false}).route,"HUMAN_GATE");
});

test("missing preflight routes to assessment",()=>{
  assert.equal(L.routeTask({...base,preflightComplete:false}).route,"ASSESSMENT");
});

test("unknown risk cannot silently auto execute",()=>{
  assert.equal(L.routeTask({...base,changeRisk:"UNKNOWN"}).route,"BLOCKED");
});

test("human-gated work cannot close before approval",()=>{
  const result=L.closureStatus({route:"HUMAN_GATE",humanApproved:false,checksPassed:true,verifierPassed:true,evidenceCount:1,unresolved:0});
  assert.equal(result.status,"HUMAN_DECISION_REQUIRED");
});

test("checks alone do not prove completion",()=>{
  const result=L.closureStatus({route:"AUTO_ELIGIBLE",humanApproved:false,checksPassed:true,verifierPassed:false,evidenceCount:0,unresolved:0});
  assert.equal(result.status,"NOT_VALIDATED");
});

test("evidence and verifier are both required",()=>{
  const noEvidence=L.closureStatus({route:"AUTO_ELIGIBLE",checksPassed:true,verifierPassed:true,evidenceCount:0,unresolved:0});
  assert.equal(noEvidence.status,"NOT_VALIDATED");
});

test("validated closure requires checks verifier and evidence",()=>{
  const result=L.closureStatus({route:"BOUNDED_AUTONOMY",checksPassed:true,verifierPassed:true,evidenceCount:1,unresolved:0});
  assert.equal(result.status,"COMPLETED_VALIDATED");
});

test("unresolved items prevent full closure",()=>{
  const result=L.closureStatus({route:"AUTO_ELIGIBLE",checksPassed:true,verifierPassed:true,evidenceCount:1,unresolved:1});
  assert.equal(result.status,"PARTIAL");
});

console.log(`\n${passed} tests passed`);
