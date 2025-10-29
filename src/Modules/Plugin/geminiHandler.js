export async function promptAI() {
    const availability = await LanguageModel.availability();
    const params = await LanguageModel.params();
    if (availability == "downloadable") {
        document.getElementById("output").textContent  = "Downloading the promptAPI model";
        const session = await LanguageModel.create({
            monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
                document.getElementById("output").textContent  = "Downloading the promptAPI model\n" + e + "%";

            });
            },
        });
        return 0;
    } else if(availability == "downloading") {
        document.getElementById("output").textContent  = "Currently downloading";
    } else if(availability == "unavailable") {
        document.getElementById("output").textContent  = "Session Unavailable on your device";
        return 0;
    }

    const session = await LanguageModel.create({
        expectedInputs: [
        { type: "text", languages: ["en" /* system prompt */,] },
        { type: "image" },
        {type: "audio"}
        ],
        expectedOutputs: [
        { type: "text", languages: ["en"] }
        ],
        temperature: 0.7,

        topK: params.defaultTopK,
    });
    return session;
}