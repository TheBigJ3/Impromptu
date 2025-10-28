import { pipeline } from "@xenova/transformers";

let embedder_;
async function getEmbedder() {
    if (!embedder_) {
        embedder_ = await pipeline("feature-extraction","Xenova/all-MiniLM-L6-v2");
    }
    return embedder_;
}

export async function embedTexts(texts) {
    const emb = await getEmbedder();
    const out = [];

    for (const t of texts) {
        const vec = await emb(t,{pooling : "mean", normalize: true});
        out.push(Array.from(vec.data));
    }

    return out;
}

export async function embedOne(text) {
    return (await embedTexts([text]))[0];
}