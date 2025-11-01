import { elementIdentifierFrom } from "./elementIdentifier";

const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE"]);


function visible(el) {
    if (!el) return false

    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) return false;
    const r = el.getBoundingClientRect?.();

    return !!r && r.width >= 2 && r.height >= 2
}

function bestText(el) {
    const text = (el.innerText || "").trim();
    if (text) return text;
    
    return (
    el.getAttribute?.("aria-label") ||
    el.getAttribute?.("placeholder") ||
    el.getAttribute?.("title") || ""
  ).trim();
}

function parentId(el) {
  const p = el.parentElement;
  return p ? elementIdentifierFrom(p) : null;
}

export function* walkActionables(root=document.body) {
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
        const el = walker.currentNode;
        if (SKIP.has(el.tagName)) continue;
        if (!visible(el)) continue;

        const tag = el.tagName.toLowerCase();
        const role = (el.getAttribute("role") || "").toLowerCase();
        const isInputLike =
            tag === "input" ||
            tag === "textarea" ||
            el.isContentEditable ||
            role === "textbox" ||
            role === "textarea";

        const isClickable =
            tag === "button" ||
            tag === "a" ||
            role === "button" ||
            el.onclick != null;

        const hasText = bestText(el).length >= 2
        
        if (isInputLike || isClickable || hasText) yield el;
    }
}

export function elementsToRecords() {
    const recs = [];
    const elMap = new Map(); // id -> Element

    let i = 0;
    for (const el of walkActionables()) {
        const text = bestText(el) || el?.value;
        const identifier = elementIdentifierFrom(el);
        const parentIdentifier = parentId(el)

        recs.push({
            id: identifier,
            textContent : text,
            pointer : identifier,
            parentPointer : parentIdentifier,
            meta: {
                tag: el.tagName.toLowerCase(),
                role: (el.getAttribute("role") || "").toLowerCase()
            }
        })
        elMap.set(identifier,el)
    }
    
    return {records: recs,elMap}
}