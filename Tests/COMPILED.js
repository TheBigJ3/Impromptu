const UNSTABLE_CLASS_PARTS = [
  'active','selected','focus','hover','open','closing','show','hide',
  'hidden','visible','disabled','error','loading','spinner','temp',
  'drag','drop','resizing','moving','transition'
];


function isUniqueSelector(sel, root = document) {
  try {
    const nodes = root.querySelectorAll(sel);
    return nodes.length === 1;
  } catch {
    return false;
  }
}

function getStableClasses(classList) {
  const out = [];
  for (const c of classList) {
    // Drop empty, very short, or obviously dynamic classes (numbers/hash-like)
    if (!c || c.length < 3) continue;
    if (/\d/.test(c)) continue;           // contains digits (often hashed or dynamic)
    if (/^[a-f0-9]{6,}$/i.test(c)) continue; // long hexish token
    if (UNSTABLE_CLASS_PARTS.some(p => c.includes(p))) continue;
    out.push(c);
    if (out.length >= 3) break; // keep it short
  }
  return out;
}


function buildClassSelector(el) {
  const tag = el.tagName?.toLowerCase();
  if (!tag) return null;

  const stable = getStableClasses(el.classList || []);
  if (stable.length === 0) return null;

  return `${tag}.${stable.join('.')}`;
}

function buildIdSelector(el, root = document) {
  if (el.id && typeof el.id === 'string') {
    const sel = `#${CSS.escape(el.id)}`;
    if (isUniqueSelector(sel, root)) return sel;
  }
  return null;
}

function buildUniquePathSelector(el, root = document,maxDepth = 5) {
    const parts = [];

    let node = el;
    let depth = 0;
    
    while (node && node !== root && depth < maxDepth) {
        const idSel = buildIdSelector(node,root);

        // If we have a unique ID selector, use it and stop
        if (idSel) {
            parts.unshift(idSel);
            const candidate = parts.join(' > ');
            if (isUniqueSelector(candidate, root)) return candidate;
        }

        const tag = node.tagName?.toLowerCase();
        const classSel = buildClassSelector(node);

        // Find what sibling it is in the parent
        const parent = node.parentElement;
        let nth = 1;
        if (parent) {
            let sib = node;
            while ((sib = sib.previousElementSibling)) {
                if (sib.tagName.toLowerCase() === tag) nth++;
            }
        }
        
        let seg = tag;
        if (classSel) seg = classSel; // tag plus up to 3 stable classes
        seg += `:nth-of-type(${nth})`;

        parts.unshift(seg);
        const candidate = parts.join(' > ');
        if (isUniqueSelector(candidate, root)) return candidate;

        node = node.parentElement;
        depth++;
    }

    // Fallback: try from the root if we didn’t prove uniqueness in the loop
    const fallback = parts.join(' > ');
    if (fallback && isUniqueSelector(fallback, root)) return fallback;

    // Last resort: just the element’s tag with nth-of-type from body
    if (el && el.tagName) {
        const tag = el.tagName.toLowerCase();
        let nth = 1, sib = el;
        while ((sib = sib.previousElementSibling)) {
        if (sib.tagName.toLowerCase() === tag) nth++;
        }
        return `${tag}:nth-of-type(${nth})`;
    }

    return null;
}

function elementIdentifierFrom(el,root = document) {
    if (!el) return {cssSelector: null, idSelector:null, classSelector:null}

    const idSelector = buildIdSelector(el,root);
    const classSelector = buildClassSelector(el);
    let cssSelector = null;

    if (idSelector) {
        cssSelector = idSelector;
    } else if (classSelector && isUniqueSelector(classSelector, root)) {
        cssSelector = classSelector;
    } else {
        cssSelector = buildUniquePathSelector(el, root);
    }

    
    return (idSelector && `${idSelector}=id`) ||
           (cssSelector && `${cssSelector}=css`) ||
           (classSelector && `${classSelector}=class`) ||
           null;
}

function findElementFromIdentifier(identifier, root = document) {
  if (!identifier) return null;

  const [sel, type] = identifier.split("=");

  switch (type) {
    case "id":
      return root.getElementById(sel.slice(1)); // remove #
    case "class":
    case "css":
    default:
      return root.querySelector(sel);
  }
}




const CurrentContext = {
    url: null,
    title: null,

    currentHighlightedText: null,
    lastInput: null,

    buttonPressed: [],
    inputsModified: {},
}

function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString();
}

// When the user presses the context key what values should be updated
function onCompile() {
    CurrentContext.url = window.location.href
    CurrentContext.title = document.title
    CurrentContext.currentHighlightedText = getSelectedText()
}


function compileInput(inputEl) {
    if (!inputEl) return

    function getLabelForInput(input) {
        if (input.label) return input.label
        // Case 1: <label for="id">
        if (input.id) {
            const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
            if (label) return label.innerText.trim();
        }

        // Case 2: input wrapped by <label>
        if (input.closest("label")) {
            return input.closest("label").innerText.trim();
        }

        // Case 3: Sometimes labels are "nearby" (heuristic fallback)
        // Look for a label sibling just before the input
        const prev = input.previousElementSibling;
        if (prev && prev.tagName.toLowerCase() === "label") {
            return prev.innerText.trim();
        }

        return null;
    }

    const inputCompiled = {
        identifier: elementIdentifierFrom(inputEl),
        tag: inputEl.tagName,
        type: inputEl.type,
        id: inputEl.id,
        label: getLabelForInput(inputEl),
        name: inputEl.name,
        placeholder: inputEl.placeholder,
        value: inputEl.value || inputEl.textContent,
        checked: inputEl.checked,
        disabled: inputEl.disabled,
        readonly: inputEl.readOnly,
    }
    return inputCompiled
}

function compileButton(buttonEl) {
    if (!buttonEl) return
    
    const buttonCompiled = {
        identifier: elementIdentifierFrom(buttonEl),
        tag: buttonEl.tagName,
        type: buttonEl.type,
        id: buttonEl.id,
        text: buttonEl.innerText.trim(),
        name: buttonEl.name,
        value: buttonEl.value,
        disabled: buttonEl.disabled,
    }
    return buttonCompiled
}




// Print out CurrentConext for debuggxwing
document.addEventListener('keydown',(event) => {
    if (event.key === ';' && event.metaKey)  {
        // check if alt key is also pressed
        onCompile()
        console.log(CurrentContext)
        navigator.clipboard.writeText(JSON.stringify(CurrentContext,null,2))
    }
},true)


document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches("input, textarea, [contenteditable='true'],[role='textbox'], select")) {
        CurrentContext.lastInput = elementIdentifierFrom(el)
        CurrentContext.inputsModified[elementIdentifierFrom(el)] = compileInput(el)
    }
},true);

document.addEventListener("click", (e) => {
    const el = e.target.closest("button, input[type='button'], input[type='submit']");
    if (el) {
        CurrentContext.buttonPressed.push(compileButton(el))
    }
});






