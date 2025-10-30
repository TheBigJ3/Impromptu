import { embedOne } from "./embeddings";
import { retrieveTopK } from "./retrieve";
import { buildVectorIndex, PageIndex } from "./vectorIndex";

export async function compileVectorSearch(userInstructions, amount, currentContext) {
    if (!PageIndex.ready) {
        await buildVectorIndex(); // build first time
    }

    const qv = await embedOne(userInstructions);
    const hits = retrieveTopK(qv,amount || 20,{
        boost: {
            focusedId: currentContext.currentFocusedElement,
            hoveredId: currentContext.currentHoveredElement,
            inputsModified: currentContext.inputsModified,
            buttonPressed: currentContext.buttonPressed,
            
            lastInput: currentContext.lastInput
        }
    })

    return hits
}

