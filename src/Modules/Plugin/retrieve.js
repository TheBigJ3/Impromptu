import { PageIndex } from "./vectorIndex";

function cosine(a,b) {
    let dot = 0, na = 0,nb = 0;
    for (let i = 0; i<a.length; i++) {
        dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
    }
    return dot /Math.sqrt(na) * Math.sqrt(nb)
}

export function retrieveTopK(queryVec,k=6,{boost} = {}) {
    const scored = PageIndex.records.map(r => {
        let s = cosine(queryVec,r.vector);
        // some boosts so that our CurrentContext has influence

        if (boost?.focusedId && r.id === boost.focusedId) s += 0.15;
        if (boost?.hoveredId && r.id === boost.hoveredId) s += 0.05;
        if (boost?.lastInput && r.id === boost.lastInput) s += 0.25;
        if (boost?.inputsModified && boost.inputsModified[r.id]) s += 0.15
        if (boost?.buttonPressed && boost.buttonPressed.find((input) => input.identifier === r.id) != -1) s += 0.05
                

        return {r,s}
    });
    scored.sort((a,b)=> b.s - a.s);
    return scored.slice(0,k).map(x=> x.r)
}