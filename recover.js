const fs = require('fs');

const transcriptPath = "C:\\Users\\Dell Latitude 7280\\.gemini\\antigravity-cli\\brain\\fc57b3a6-a394-427f-86a5-45ae44b53d72\\.system_generated\\logs\\transcript_full.jsonl";
const indexHtmlPath = "C:\\Users\\Dell Latitude 7280\\Documents\\programming\\tran_website\\index.html";
const homeCssPath = "C:\\Users\\Dell Latitude 7280\\Documents\\programming\\tran_website\\assets\\css\\home.css";
const jsHomePath = "C:\\Users\\Dell Latitude 7280\\Documents\\programming\\tran_website\\js\\home.js";

let files = {
    "index.html": fs.readFileSync(indexHtmlPath, 'utf8'),
    "home.css": fs.readFileSync(homeCssPath, 'utf8'),
    "home.js": fs.existsSync(jsHomePath) ? fs.readFileSync(jsHomePath, 'utf8') : ""
};

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

for (const line of lines) {
    if (!line.trim()) continue;
    try {
        const step = JSON.parse(line);
        if (step.type === "PLANNER_RESPONSE" && step.tool_calls) {
            for (const call of step.tool_calls) {
                if (call.name === "replace_file_content") {
                    const args = call.args;
                    const targetFile = args.TargetFile || "";
                    const targetContent = args.TargetContent || "";
                    const replacementContent = args.ReplacementContent || "";
                    
                    let fileKey = null;
                    if (targetFile.includes("index.html") && !targetFile.includes("about-us")) fileKey = "index.html";
                    else if (targetFile.includes("home.css")) fileKey = "home.css";
                    else if (targetFile.includes("home.js")) fileKey = "home.js";
                        
                    if (fileKey && files[fileKey].includes(targetContent)) {
                        files[fileKey] = files[fileKey].replace(targetContent, replacementContent);
                        console.log("Applied replacement to " + fileKey);
                    }
                } else if (call.name === "write_to_file") {
                    const args = call.args;
                    const targetFile = args.TargetFile || "";
                    const codeContent = args.CodeContent || "";
                    
                    let fileKey = null;
                    if (targetFile.includes("index.html") && !targetFile.includes("about-us")) fileKey = "index.html";
                    else if (targetFile.includes("home.css")) fileKey = "home.css";
                    else if (targetFile.includes("home.js")) fileKey = "home.js";
                    
                    if (fileKey) {
                        files[fileKey] = codeContent;
                        console.log("Applied write to " + fileKey);
                    }
                }
            }
        }
    } catch (e) {
    }
}

fs.writeFileSync(indexHtmlPath, files["index.html"]);
fs.writeFileSync(homeCssPath, files["home.css"]);
if (files["home.js"]) fs.writeFileSync(jsHomePath, files["home.js"]);

console.log("Recovery files written!");
