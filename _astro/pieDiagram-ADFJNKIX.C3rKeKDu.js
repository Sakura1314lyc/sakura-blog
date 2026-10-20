import"./src.BB5iF-8Y.js";import{t as e}from"./ordinal.CysACInB.js";import{n as t,r as n}from"./chunk-AGHRB4JF.BouXrpnn.js";import{t as r}from"./arc.DVQqFnF0.js";import{t as i}from"./pie.BUwbL19o.js";import{f as a,r as o}from"./chunk-S3R3BYOJ.C58aEQOa.js";import{t as s}from"./mermaid-parser.core.Du4Fxxlj.js";import{B as c,C as l,U as u,_ as d,a as f,b as p,c as m,d as h,v as g,z as _}from"./chunk-ABZYJK2D.x3x6zkuB.js";import{t as v}from"./chunk-EXTU4WIE.obWIbZZF.js";import{t as y}from"./chunk-4BX2VUAB.DBt_ujrv.js";var b=h.pie,x={sections:new Map,showData:!1,config:b},S=x.sections,C=x.showData,w=structuredClone(b),T={getConfig:t(()=>structuredClone(w),`getConfig`),clear:t(()=>{S=new Map,C=x.showData,f()},`clear`),setDiagramTitle:u,getDiagramTitle:l,setAccTitle:c,getAccTitle:g,setAccDescription:_,getAccDescription:d,addSection:t(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);S.has(e)||(S.set(e,t),n.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:t(()=>S,`getSections`),setShowData:t(e=>{C=e},`setShowData`),getShowData:t(()=>C,`getShowData`)},E=t((e,t)=>{y(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),D={parse:t(async e=>{let t=await s(`pie`,e);n.debug(t),E(t,T)},`parse`)},O=t(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),k=t(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1).sort((e,t)=>t.value-e.value);return i().value(e=>e.value)(n)},`createPieArcs`),A={parser:D,db:T,renderer:{draw:t((t,i,s,c)=>{n.debug(`rendering pie chart
`+t);let l=c.db,u=p(),d=o(l.getConfig(),u.pie),f=v(i),h=f.append(`g`);h.attr(`transform`,`translate(225,225)`);let{themeVariables:g}=u,[_]=a(g.pieOuterStrokeWidth);_??=2;let y=d.textPosition,b=r().innerRadius(0).outerRadius(185),x=r().innerRadius(185*y).outerRadius(185*y);h.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+_/2).attr(`class`,`pieOuterCircle`);let S=l.getSections(),C=k(S),w=[g.pie1,g.pie2,g.pie3,g.pie4,g.pie5,g.pie6,g.pie7,g.pie8,g.pie9,g.pie10,g.pie11,g.pie12],T=0;S.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=e(w);h.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),h.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`),h.append(`text`).text(l.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`);let O=[...S.entries()].map(([e,t])=>({label:e,value:t})),A=h.selectAll(`.legend`).data(O).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*O.length/2;return`translate(216,`+(t*22-n)+`)`});A.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),A.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>l.getShowData()?`${e.label} [${e.value}]`:e.label);let j=512+Math.max(...A.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0));f.attr(`viewBox`,`0 0 ${j} 450`),m(f,450,j,d.useMaxWidth)},`draw`)},styles:O};export{A as diagram};