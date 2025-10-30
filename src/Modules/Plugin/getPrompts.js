
const STORAGE_KEY = "Popups"

export default async function getUserPrompts() {
    const obj = await chrome.storage.local.get(STORAGE_KEY) || {};

    const newPrompts = [];

    for (const [key,value] of Object.entries(obj?.Popups)) {
        newPrompts.push({
            title: value?.Title,
            instructions: value?.Prompt,
            requirements: value?.InjectionBox
        });
    }

    return newPrompts;
}


export async function getRawPrompts() {
    const obj = await chrome.storage.local.get(STORAGE_KEY) || {};
    const newPrompts = [];

    for (const [key,value] of Object.entries(obj?.Popups)) {
        newPrompts.push(value);
    }

    return newPrompts;
}