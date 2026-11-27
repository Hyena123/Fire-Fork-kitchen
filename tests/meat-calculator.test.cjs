'use strict';const test=require('node:test');const assert=require('node:assert/strict');const {scaleSeasonings,cookingGuidance}=require('../meat-calculator-core.js');
test('weight changes quantities proportionally',()=>{const r=scaleSeasonings([{name:'Demo',amount:2,unit:'tsp'}],4,6);assert.equal(r.factor,1.5);assert.equal(r.items[0].amount,3)});
test('rejects unsafe weights and malformed items',()=>{assert.ok(scaleSeasonings([],0,4).error);assert.ok(scaleSeasonings([],4,-1).error);assert.ok(scaleSeasonings([{name:'x',amount:-1,unit:'tsp'}],4,6).error)});
test('does not silently scale already per-pound seasonings',()=>assert.ok(scaleSeasonings([{name:'salt',amount:0.5,unit:'tsp',perPound:true}],4,6).error));
test('thin pork guidance differs from thick',()=>{const a=cookingGuidance('pork-steak',0.33);const b=cookingGuidance('pork-steak',1.5);assert.match(a.message,/short, direct cook/);assert.notEqual(a.message,b.message)});
test('does not invent brisket time',()=>assert.match(cookingGuidance('brisket',1).message,/not to a formula/));
