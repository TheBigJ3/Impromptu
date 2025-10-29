window.process = { env: { NODE_ENV: 'production' } };

import { findElementFromIdentifier } from "../Modules/Plugin/elementIdentifier";
import { promptAI } from "../Modules/Plugin/geminiHandler";
import { onHotKey } from "../Modules/Plugin/HotKey";
import WatcherService, { CompileContext } from "../Scripts/Plugin/WatcherService"
import ExamplePrompts from "../Config/ExamplePrompts.json" assert { type: 'json' };
import { createRoot } from "react-dom/client";
import MainWebInjector from "../Components/Plugin/MainWebInjector";
import MainWebInjectorCss from "../Components/Plugin/MainWebInjector.css?inline";

import React from "react";
import SummaryMain from "../Components/Plugin/Summary/SummaryMain";

export function summarizeElementsForAI(hits, currentContext, maxLabel = 60) {
  return hits.map(r => {
    const el = findElementFromIdentifier(r.pointer);
    const tag = r.meta.tag;
    const type = tag === "input" && el?.type ? el.type : tag;
    const label = (el?.innerText || el?.getAttribute?.("aria-label") || el?.getAttribute?.("placeholder") || "").trim().slice(0, maxLabel);
    const value = el?.value || "";

    const parentText = el?.parentElement?.innerText || "";

    return {
      id: r.id,
      type,
      label,
      value,
      parentContext: parentText,
      isFocused: currentContext.currentFocusedElement === r.id,
      isHovered: currentContext.currentHoveredElement === r.id,
    };
  })
}

function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(v => cleanObject(v))
      .filter(v => v !== undefined && v !== null && v !== "" && v?.length !== 0 && v !== false);
  } else if (obj && typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const v = cleanObject(value);
      if (v !== "" && v !== undefined && v !== null && !(typeof v === "number" && Number.isNaN(v)) && v?.length !== 0 && v !== false) {
        cleaned[key] = v;
      }
    }
    return cleaned;
  }
  return obj;
}

const schema = {
  "tool": "string",
  "reasoning" : "string",
  "checks" : "array"
};

let root, container;
function ensureRoot() {
  if (root) return root;
  const style = document.createElement("style");
  style.textContent = MainWebInjectorCss;
  document.head.appendChild(style);

  const el = document.createElement("div");
  el.id = "imprompto-root";
  el.style.position = "fixed";
  el.style.top = "0";
  el.style.left = "0";
  el.style.zIndex = "2147483647";
  el.style.pointerEvents = "none"
  document.body.appendChild(el);

  root = createRoot(el);
  return root;
}

const r = ensureRoot();
r.render(React.createElement(MainWebInjector));




function base64ToBlob(base64, mimeType = "image/png") {
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mimeType });
}

export function extractSelectedTool(text) {
      // in the whole ass text just look for the format -> "selected_tool": "<something>"

       if (typeof text !== "string") {
    try {
      text = JSON.stringify(text);
    } catch (err) {
      console.log("extractSelectedTool received non-string input:", text);
      return " ";
    }
  }
      const match = text.match(/"selected_tool"\s*:\s*"([^"]+)"/);
      if (match) {
        return match[1]; 
      }
      
      return " "; 
      
    }

    
    export function getToolInfo(tools, toolName) {
      if (!Array.isArray(tools)) {
        throw new Error("first argument must be an array of tool objects.");
      }

      const found = tools.find(tool => 
        tool.title.toLowerCase().trim() === toolName.toLowerCase().trim()
      );


      if (!found) {
        console.log("No tool found");
        return " ";
      }

      return {
        title: found.title,
        description: found.description
      };
}






document.addEventListener("keydown", async (event) => {
  if (event.key === ";") {
    console.log("⌘ + ; pressed — requesting screenshot");

    // --- Take Screenshot ---
    let base64Data = "";
    try {
      base64Data = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "capture" }, (response) => {
          if (!response || !response.success) {
            reject(response?.error || "Unknown error");
            return;
          }
          resolve(response.image);
        });
      });
    } catch (err) {
      console.error("❌ Failed to capture image:", err);
      alert("❌ Failed to capture image: " + err);
      return;
    }

    let fein = base64ToBlob(base64Data);

    


    


    const currentContext = CompileContext();
    const session = await promptAI();
    const a = JSON.stringify(currentContext, null, 2);
    const b = JSON.stringify(ExamplePrompts, null, 2);

    const compiled_system_prompt = `
    You are the Router Model.

  Your goal is to determine which Tool Card from the provided JSON list is most appropriate for the current screen’s context.
  You will receive up to two inputs:
-
  TOOL_CARDS — a JSON array of available tool cards. Each tool card has fields such as:

  "title": name of the tool

  "description": what the tool does

  "use-case": when the tool should be used



  SCREENSHOT — an image of the user’s browser or current screen, to infer what the user is doing and determine the most fitting tool card.

  You must think through the problem in natural language, step by step, to reason out which tool best matches what the user seems to be doing.

  Follow this process exactly:

  Step 1. Understand the user’s environment


  SCREENSHOT is provided, analyze it to further understand what the user is viewing or interacting with. Summarize the screenshot for your own understanding. For example if the screenshot shows a gmail window with a new email being composed, note that down.
  Use both sources of information together to form a complete understanding of the user’s environment.

  Describe, in plain natural language, what kind of page or environment this appears to be (for example, “the user is on Gmail composing an email,” or “the user is highlighting text in a web article”).

  If the screenshot provides extra context — such as visible buttons, text boxes, modals, sidebars, or open web pages — include those details in your reasoning to clarify the user’s likely environment and activity.

  Step 2. Infer the user’s possible intentions

  Based on the SCREENSHOT, list several possible things the user might be trying to do on this page or within this interface.

  For example: “The user might be writing an email, proofreading an email, or summarizing content.”

  Step 3. Compare with available tools

  Now read through the TOOL_CARDS JSON.
  For each tool card:

  Briefly restate what the tool does and when it’s used.

  Explain how relevant (or irrelevant) it is to the current context and the possible user intentions. Do not simply state "irrelevant" or "relevant" — explain why first, then come to that conclusion.

  Compare the tools against each other and decide which one most directly aligns with the current situation.

  You MUST go through EACH tool card one by one, describing its relevance or irrelevance to the current context and user intentions. DO NOT forget to go through any tool card.
  Start your comparing with outputting the names of ALL the tool cards to ensure none are skipped or omitted.
  You will be deactivated if you do not go through each tool card one by one.

  Take the use case of the Tool Card given the current passed context — including any observable information from the SCREENSHOT — into strong consideration when making your decision.

  Do not overfit tools. For example, just because text is highlighted in an email does not warrant a summary tool by itself, as an email-related tool would be more relevant.
  Take the full scope of the SCREENSHOT into consideration.

  Step 4. Decide on the best match

  Now decide:

  If one tool clearly fits the user’s current context and intent → select it.

  If no tool is clearly relevant, you must confidently output no tool (null).
  Do not force a choice just to fill the output. It’s okay — and correct — to say that no tool applies when nothing fits well.

  You may mention if one or two tools are “somewhat related,” but still explain why they are not a good enough fit.

  Step 5. Output the final result in JSON format

  After completing your natural-language reasoning, end your message with a single valid JSON object on a new line.

  That JSON should be structured as:

  {
  "selected_tool": "<TITLE of the chosen Tool Card>",
  "runner_ups": ["<TITLE of second best>", "<TITLE of third best>"]
  }

  If none of the tools fit, output:

  {
  "selected_tool": null,
  "runner_ups": []
  }

  Step 6.


  Important details:

  Think step-by-step in natural language before giving the final JSON.

  Never skip steps.

  Always end with a single valid JSON object on its own line.

  Never wrap the JSON output in markdown or code blocks.

  When a SCREENSHOT is available, you must integrate its visual information into your reasoning at every relevant stage — especially Steps 1, 2, and 3 — treating it as a key factor in understanding user context and intent.

  TOOL_CARDS:
  ${JSON.stringify(ExamplePrompts, null, 2)}

  UI_CONTEXT:
  ${JSON.stringify(currentContext, null, 2)}




  Now produce the reasoning and final JSON result as instructed above.`;
    //SummaryMain.setText("HELLO");
    SummaryMain.show();

    try {
      console.log("🧠 Sending prompt with image...");
      const res = await session.promptStreaming(
        [
          {
            role: "user",
            content: [
              {
                type: "image",
                value: fein, // ✅ raw bytes
              },
              {
                type: "text",
                value: compiled_system_prompt,
              }
            ],
          },
        ],
        
      );

      let t = "";
      console.log(res);
      for await (const chunk of res) {
        t += chunk;
        console.log(t);
        SummaryMain.setText(t);
      }

      console.log("Stream completed successfully");






      console.log(res);
const selected_tool = extractSelectedTool(t);
const tool_info = getToolInfo(ExamplePrompts, selected_tool);
console.log("Selected tool:", selected_tool);
console.log("Tool info:", tool_info);
console.log(`${session.inputUsage}/${session.inputQuota}`);




// next, start up da tool model to execute the fetched tool card

console.log("Init tool card model");
const tool_session = await promptAI();
const tool_res = await tool_session.prompt(
`
You are the Router Executor Model.
Your role is to take in two inputs:

Screen Context (JSON) — information captured from a user's active screen (including URL, title, selected/hovered/highlighted text, form inputs, etc.).

Tool Card (JSON) — containing a title and description that define a tool and what action it should perform.

Your task: Execute the tool's description as an instruction, using the provided screen context as your working environment and source of information.

When responding:

Use the screen context to ground your answer.

Follow the tool description exactly as written — treat it as your main directive. Follow the tool's prompt with the UI context in mind, intelligently applying it to the task.

Produce only the final, relevant output of that tool's execution (no meta commentary or system reasoning).

If the context doesn't contain enough info, infer as much as possible reasonably from what's available.

Keep the response directly tied to the screen context and the tool's intended purpose. Make sure all responses are long enough to be useful and complete.


Example:
If the screen context is from Gmail with an email being drafted and the tool card is “Complete email draft”, then write the full, natural email based on the partial input in the context.
--------
UI_CONTEXT:
${JSON.stringify(currentContext, null, 2)}
TOOL_CARD_INFORMATION:
${JSON.stringify(tool_info, null, 2)}
`);


  console.log(tool_res);
    } catch (err) {
      console.error("Error during promptStreaming:", err);
      SummaryMain.setText(err);
    }
    
  }

  
}, true);


