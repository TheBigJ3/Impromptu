import { embedOne } from "./embeddings";
import { retrieveTopK } from "./retrieve";
import { buildVectorIndex, PageIndex } from "./vectorIndex";

export async function compileVectorSearch(userInstructions, amount, currentContext) {
    console.log("Compiling vector search with instructions:", userInstructions, "and amount:", amount);

    if (!PageIndex.ready) {
        await buildVectorIndex(); // build first time
    }

    const qv = await embedOne(userInstructions);
    console.log("Query vector:", qv);
    const hits = retrieveTopK(qv,amount,{
        boost: {
            focusedId: currentContext.currentFocusedElement,
            hoveredId: currentContext.currentHoveredElement,
            inputsModified: currentContext.inputsModified,
            buttonPressed: currentContext.buttonPressed,
            
            lastInput: currentContext.lastInput
        }
    })

    console.log("Vector search hits:", hits);

    return hits
}

