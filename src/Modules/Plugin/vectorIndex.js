import { embedTexts } from "./embeddings";
import { elementsToRecords } from "./extractor";


export const PageIndex = {
    records : [],
    elMap: new Map(),
    ready: false
}

export async function buildVectorIndex() {
    const {records, elMap} = elementsToRecords();
    PageIndex.elMap = elMap;

    const vecs = await embedTexts(records.map(r=>r.textContent));
    records.forEach((r,i)=> (r.vector = vecs[i]));

    PageIndex.records = records;
    PageIndex.ready = true;

    return {count: records.length};
}