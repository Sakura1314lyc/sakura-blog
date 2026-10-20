/**
 * Mermaid `themeCSS`: restyles diagrams with the site's color tokens.
 *
 * Mermaid's `themeVariables` only accept literal colors (it derives shades from them), so they can't
 * follow the light/dark switch. `themeCSS` lands in the SVG's own <style>, scoped under the diagram id
 * and after the theme rules, and the SVG is inline, so `var(--…)` resolves against the page and every
 * diagram follows the site theme with no re-render. Shapes are tinted with the accent; lines and
 * secondary text use the muted foreground so the boxes, not the wiring, carry the diagram.
 */

const ACCENT_FILL = 'hsl(var(--primary) / 0.08)';
const ACCENT_STROKE = 'hsl(var(--primary) / 0.55)';
const LINE = 'hsl(var(--muted-foreground) / 0.75)';
const TEXT = 'hsl(var(--foreground))';
const SURFACE = 'var(--code-surface)';

export const mermaidThemeCSS = `
  .node rect, .node circle, .node ellipse, .node polygon, .node path,
  .actor, rect.actor, .classGroup rect, .stateGroup rect, .er.entityBox {
    fill: ${ACCENT_FILL} !important;
    stroke: ${ACCENT_STROKE} !important;
    stroke-width: 1.25px !important;
  }
  .node rect, rect.actor, .classGroup rect, .er.entityBox { rx: 8px; ry: 8px; }
  .nodeLabel, .node .label, .actor tspan, text.actor > tspan, .classTitle, .er.entityLabel {
    color: ${TEXT} !important;
    fill: ${TEXT} !important;
  }
  .flowchart-link, .edgePath .path, .messageLine0, .messageLine1, .relation, .transition, .er.relationshipLine {
    stroke: ${LINE} !important;
    stroke-width: 1.25px !important;
  }
  .arrowheadPath, .marker, marker path, #arrowhead path, .arrowhead {
    fill: ${LINE} !important;
    stroke: ${LINE} !important;
  }
  .edgeLabel, .edgeLabel p, .edgeLabel rect, .labelBkg {
    background-color: ${SURFACE} !important;
    fill: ${SURFACE} !important;
    color: hsl(var(--muted-foreground)) !important;
    opacity: 1 !important;
  }
  .messageText, .loopText, .loopText > tspan, .labelText, .labelText > tspan {
    fill: hsl(var(--muted-foreground)) !important;
    stroke: none !important;
  }
  .actor-line { stroke: hsl(var(--border)) !important; }
  .labelBox { fill: ${ACCENT_FILL} !important; stroke: ${ACCENT_STROKE} !important; }
  .loopLine { stroke: hsl(var(--border)) !important; }
  .note { fill: hsl(var(--muted)) !important; stroke: hsl(var(--border)) !important; }
  .noteText, .noteText > tspan { fill: ${TEXT} !important; }
  .activation0, .activation1, .activation2 { fill: hsl(var(--primary) / 0.2) !important; stroke: ${ACCENT_STROKE} !important; }
  .cluster rect { fill: hsl(var(--muted) / 0.4) !important; stroke: hsl(var(--border)) !important; rx: 10px; ry: 10px; }
  .pieCircle { stroke: ${SURFACE} !important; stroke-width: 2px !important; opacity: 1 !important; }
  .pieOuterCircle { stroke: none !important; }
  .pieTitleText, .legend text { fill: ${TEXT} !important; }
  .slice { fill: #fff !important; }
`;
