const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/mermaid.core.Bb55t80k.js","_astro/preload-helper.CxFQXtKk.js","_astro/purify.es.DaBa283-.js","_astro/src.BB5iF-8Y.js","_astro/isEmpty.Bp6Fjg9-.js","_astro/chunk-AGHRB4JF.BouXrpnn.js","_astro/rolldown-runtime.C_JxhDyB.js","_astro/chunk-S3R3BYOJ.C58aEQOa.js","_astro/chunk-ABZYJK2D.x3x6zkuB.js","_astro/dist.DO2fBI_b.js","_astro/chunk-EXTU4WIE.obWIbZZF.js","_astro/chunk-JA3XYJ7Z.cyW3VS2U.js","_astro/marked.esm.CBLx7Uyl.js","_astro/chunk-HN2XXSSU.l_CtLlME.js","_astro/chunk-CVBHYZKI.BBEDsbnP.js","_astro/chunk-ATLVNIR6.B-g8srPT.js","_astro/chunk-JZLCHNYA.BC2tY-E1.js","_astro/chunk-QXUST7PY.TmS_WPgy.js","_astro/chunk-N4CR4FBY.D_BHjXu9.js","_astro/chunk-MI3HLSF2.CHsrfAWF.js","_astro/chunk-XAJISQIX.DyzqyIF6.js"])))=>i.map(i=>d[i]);
import{t as e}from"./prefetch.D9e_hwx5.js";import{t}from"./preload-helper.CxFQXtKk.js";var n=(...e)=>console.log(`[astro-mermaid]`,...e),r=(...e)=>console.error(`[astro-mermaid]`,...e),i=()=>document.querySelectorAll(`pre.mermaid[data-mermaid-visible]`).length>0,a=null;async function o(){return a||(n(`Loading mermaid.js...`),a=t(async()=>{let{default:e}=await import(`./mermaid.core.Bb55t80k.js`);return{default:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])).then(async({default:e})=>{let t=[];if(t&&t.length>0){n(`Registering`,t.length,`icon packs`);let r=t.map(e=>e.icons?{name:e.name,icons:e.icons}:{name:e.name,loader:()=>fetch(e.url).then(e=>e.json())});await e.registerIconPacks(r)}return e}).catch(e=>{throw r(`Failed to load mermaid:`,e),a=null,e}),a)}var s={startOnLoad:!1,theme:`default`,themeCSS:`
  .node rect, .node circle, .node ellipse, .node polygon, .node path,
  .actor, rect.actor, .classGroup rect, .stateGroup rect, .er.entityBox {
    fill: hsl(var(--primary) / 0.08) !important;
    stroke: hsl(var(--primary) / 0.55) !important;
    stroke-width: 1.25px !important;
  }
  .node rect, rect.actor, .classGroup rect, .er.entityBox { rx: 8px; ry: 8px; }
  .nodeLabel, .node .label, .actor tspan, text.actor > tspan, .classTitle, .er.entityLabel {
    color: hsl(var(--foreground)) !important;
    fill: hsl(var(--foreground)) !important;
  }
  .flowchart-link, .edgePath .path, .messageLine0, .messageLine1, .relation, .transition, .er.relationshipLine {
    stroke: hsl(var(--muted-foreground) / 0.75) !important;
    stroke-width: 1.25px !important;
  }
  .arrowheadPath, .marker, marker path, #arrowhead path, .arrowhead {
    fill: hsl(var(--muted-foreground) / 0.75) !important;
    stroke: hsl(var(--muted-foreground) / 0.75) !important;
  }
  .edgeLabel, .edgeLabel p, .edgeLabel rect, .labelBkg {
    background-color: var(--code-surface) !important;
    fill: var(--code-surface) !important;
    color: hsl(var(--muted-foreground)) !important;
    opacity: 1 !important;
  }
  .messageText, .loopText, .loopText > tspan, .labelText, .labelText > tspan {
    fill: hsl(var(--muted-foreground)) !important;
    stroke: none !important;
  }
  .actor-line { stroke: hsl(var(--border)) !important; }
  .labelBox { fill: hsl(var(--primary) / 0.08) !important; stroke: hsl(var(--primary) / 0.55) !important; }
  .loopLine { stroke: hsl(var(--border)) !important; }
  .note { fill: hsl(var(--muted)) !important; stroke: hsl(var(--border)) !important; }
  .noteText, .noteText > tspan { fill: hsl(var(--foreground)) !important; }
  .activation0, .activation1, .activation2 { fill: hsl(var(--primary) / 0.2) !important; stroke: hsl(var(--primary) / 0.55) !important; }
  .cluster rect { fill: hsl(var(--muted) / 0.4) !important; stroke: hsl(var(--border)) !important; rx: 10px; ry: 10px; }
  .pieCircle { stroke: var(--code-surface) !important; stroke-width: 2px !important; opacity: 1 !important; }
  .pieOuterCircle { stroke: none !important; }
  .pieTitleText, .legend text { fill: hsl(var(--foreground)) !important; }
  .slice { fill: #fff !important; }
`},c={light:`default`,dark:`dark`};async function l(e){n(`Initializing mermaid diagrams...`);let t=document.querySelectorAll(`pre.mermaid[data-mermaid-visible]`);if(n(`Found`,t.length,`mermaid diagrams`),t.length===0)return;let i=await o(),a=s.theme;{let e=document.documentElement.getAttribute(`data-theme`),t=document.body.getAttribute(`data-theme`);a=c[e||t]||s.theme,n(`Using theme:`,a,`from`,e?`html`:`body`)}i.initialize({...s,theme:a,gitGraph:{mainBranchName:`main`,showCommitLabel:!0,showBranches:!0,rotateCommitLabel:!0}});for(let a of t){if(!a.isConnected||e!==u||a.hasAttribute(`data-processed`))continue;a.hasAttribute(`data-diagram`)||a.setAttribute(`data-diagram`,a.textContent||``);let t=a.getAttribute(`data-diagram`)||``,o=`mermaid-`+Math.random().toString(36).slice(2,11);n(`Rendering diagram:`,o);try{let r=document.getElementById(o);r&&r.remove();let{svg:s}=await i.render(o,t);if(!a.isConnected||e!==u)continue;a.innerHTML=s,a.setAttribute(`data-processed`,`true`),n(`Successfully rendered diagram:`,o)}catch(t){if(!a.isConnected||e!==u)continue;r(`Mermaid rendering error for diagram:`,o,t);let n=document.createElement(`div`);n.style.cssText=`color: red; padding: 1rem; border: 1px solid red; border-radius: 0.5rem;`;let i=document.createElement(`strong`);i.textContent=`Error rendering diagram:`;let s=document.createElement(`span`);s.textContent=` `+(t.message||`Unknown error`),n.appendChild(i),n.appendChild(s),a.textContent=``,a.appendChild(n),a.setAttribute(`data-processed`,`true`)}}}i()?(n(`Mermaid diagrams detected on initial load`),m()):n(`No mermaid diagrams found on initial load`);{let e=new MutationObserver(e=>{for(let t of e)t.type===`attributes`&&t.attributeName===`data-theme`&&(u++,document.querySelectorAll(`pre.mermaid[data-processed]`).forEach(e=>{e.removeAttribute(`data-processed`)}),m())});e.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`]}),e.observe(document.body,{attributes:!0,attributeFilter:[`data-theme`]})}document.addEventListener(`astro:after-swap`,()=>{n(`View transition detected`),i()&&m()});var u=0,d=!1,f=!1,p;async function m(){if(f=!0,!d){d=!0;try{for(;f;)f=!1,await l(u)}catch(e){r(`Failed to initialize nearby diagrams:`,e)}finally{d=!1}}}function h(){p?.disconnect();let e=document.querySelectorAll(`pre.mermaid`);if(typeof IntersectionObserver>`u`){e.forEach(e=>e.setAttribute(`data-mermaid-visible`,`true`)),m();return}p=new IntersectionObserver(e=>{let t=!1;for(let n of e)n.isIntersecting&&(n.target.setAttribute(`data-mermaid-visible`,`true`),p.unobserve(n.target),t=!0);t&&m()},{rootMargin:`800px`}),e.forEach(e=>p.observe(e))}document.addEventListener(`astro:before-swap`,()=>{u++,p?.disconnect()}),document.addEventListener(`astro:after-swap`,h),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,h,{once:!0}):h();var g=document.createElement(`style`);g.textContent=`
            /* Prevent layout shifts by setting minimum height */
            pre.mermaid {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 2rem 0;
              padding: 1rem;
              background-color: transparent;
              border: none;
              overflow: auto;
              min-height: 200px; /* Prevent layout shift */
              position: relative;
            }
            
            /* Loading state with skeleton loader */
            pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            }
            
            /* Dark mode skeleton loader */
            [data-theme="dark"] pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
              background-size: 200% 100%;
            }
            
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            
            /* Show processed diagrams with smooth transition */
            pre.mermaid[data-processed] {
              animation: none;
              background: transparent;
              min-height: auto; /* Allow natural height after render */
            }
            
            /* Ensure responsive sizing for mermaid SVGs */
            pre.mermaid svg {
              max-width: 100%;
              height: auto;
            }
            
            /* Optional: Add subtle background for better visibility */
            @media (prefers-color-scheme: dark) {
              pre.mermaid[data-processed] {
                background-color: rgba(255, 255, 255, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            @media (prefers-color-scheme: light) {
              pre.mermaid[data-processed] {
                background-color: rgba(0, 0, 0, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            /* Respect user's color scheme preference */
            [data-theme="dark"] pre.mermaid[data-processed] {
              background-color: rgba(255, 255, 255, 0.02);
              border-radius: 0.5rem;
            }
            
            [data-theme="light"] pre.mermaid[data-processed] {
              background-color: rgba(0, 0, 0, 0.02);
              border-radius: 0.5rem;
            }
          `,document.head.appendChild(g),e();