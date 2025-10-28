

const CurrentContext = {
    url: undefined,
    title: undefined,

    currentHoveredElement: undefined,
    currentFocusedElement: undefined,
    currentHighlightedText: undefined,
    lastInput: undefined,

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
    CurrentContext.currentFocusedElement = elementIdentifierFrom(document.activeElement)
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





// Print out CurrentConext for debugging
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
  console.log("Input event on", el);

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

document.addEventListener('mousemove', function(e) {
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
    console.log('Mouse is currently over:', hoveredElement.tagName);
    CurrentContext.currentHoveredElement = elementIdentifierFrom(hoveredElement)
});






