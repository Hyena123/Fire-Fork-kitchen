/* Fire-Fork Kitchen calculator prototype. No private recipe data or credentials. */
(function(root){
"use strict";
const limit=(v,min,max)=>Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):null;
function scaleSeasonings(items,referenceLb,actualLb){
 const reference=limit(referenceLb,0.1,200),actual=limit(actualLb,0.1,200);
 if(reference===null||actual===null)return {error:"Enter valid meat weights (0.1–200 lb).",factor:null,items:[]};
 if(!Array.isArray(items)||items.length>100)return {error:"Invalid seasoning list.",factor:null,items:[]};
 const factor=actual/reference;
 const scaled=[];
 for(const item of items){
  const amount=limit(item?.amount,0,100000);
  if(amount===null||typeof item?.name!=="string"||!item.name.trim()||item.name.length>120||typeof item?.unit!=="string"||item.unit.length>30)
   return {error:"One seasoning entry is invalid.",factor:null,items:[]};
  if(item.perPound)return {error:"Per-pound amounts must be handled separately.",factor:null,items:[]};
  scaled.push({name:item.name,unit:item.unit,amount:Math.round(amount*factor*100)/100});
 }
 return {error:null,factor:Math.round(factor*100)/100,items:scaled};
}
function cookingGuidance(meat,thicknessIn){
 const thickness=limit(thicknessIn,0.2,4);
 if(thickness===null)return {error:"Enter a thickness from 0.2–4 inches.",message:null};
 if(meat==="pork-steak"&&thickness<=0.5)
  return {error:null,message:"Thin shoulder steak: prefer a short, direct cook rather than the thick-steak 2–4 hour smoke. Start checking early. Verify 145°F and rest at least 3 min; exact minutes depend on heat and actual cut."};
 if(meat==="pork-steak")
  return {error:null,message:"Thicker shoulder steak: choose steak-like or tenderizing texture first; do not scale smoke time linearly by weight. Verify final doneness/tenderness."};
 if(meat==="chicken-wings")
  return {error:null,message:"Wings: keep the recipe's approximately 45-minute oven cooking window for a single uncrowded batch; extra weight may mean more batches, not longer oven time. Verify 165°F."};
 if(meat==="brisket")
  return {error:null,message:"Whole brisket: cooking time varies widely with thickness, stall and smoker temperature. Weight is for planning only; cook until probe-tender, not to a formula."};
 return {error:null,message:"Use the original recipe's doneness target and method. No validated automatic timing rule for this cut."};
}
const api={scaleSeasonings,cookingGuidance};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
root.FireForkMeatCalculator=api;
})(typeof window!=="undefined"?window:globalThis);
