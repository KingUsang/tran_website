const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\Dell Latitude 7280\\.gemini\\antigravity-cli\\brain";
const workspaceDir = "C:\\Users\\Dell Latitude 7280\\Documents\\programming\\tran_website";

let allSteps = [];

const convoDirs = fs.readdirSync(brainDir);
for (const convoDir of convoDirs) {
    const transcriptPath = path.join(brainDir, convoDir, ".system_generated", "logs", "transcript_full.jsonl");
    if (fs.existsSync(transcriptPath)) {
        const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const step = JSON.parse(line);
                if (step.type === "PLANNER_RESPONSE" && step.tool_calls) {
                    allSteps.push(step);
                }
            } catch (e) {}
        }
    }
}

allSteps.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

const filesToRecover = [
    "index.html",
    "assets/css/home.css",
    "js/home.js"
];

let files = {};
for (const f of filesToRecover) {
    const fullPath = path.join(workspaceDir, f);
    files[f] = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : "";
}

let recoveredCount = 0;

for (const step of allSteps) {
    for (const call of step.tool_calls) {
        if (call.name === "replace_file_content") {
            const args = call.args;
            const targetFile = args.TargetFile || "";
            const targetContent = args.TargetContent || "";
            const replacementContent = args.ReplacementContent || "";
            
            let fileKey = null;
            if (targetFile.includes("index.html") && !targetFile.includes("about-us")) fileKey = "index.html";
            else if (targetFile.includes("home.css")) fileKey = "assets/css/home.css";
            else if (targetFile.includes("home.js")) fileKey = "js/home.js";
                
            if (fileKey && files[fileKey].includes(targetContent)) {
                files[fileKey] = files[fileKey].replace(targetContent, replacementContent);
                recoveredCount++;
                console.log("Replayed edit on " + fileKey + " from " + step.created_at);
            }
        } else if (call.name === "write_to_file") {
            const args = call.args;
            const targetFile = args.TargetFile || "";
            const codeContent = args.CodeContent || "";
            
            let fileKey = null;
            if (targetFile.includes("index.html") && !targetFile.includes("about-us")) fileKey = "index.html";
            else if (targetFile.includes("home.css")) fileKey = "assets/css/home.css";
            else if (targetFile.includes("home.js")) fileKey = "js/home.js";
            
            if (fileKey) {
                files[fileKey] = codeContent;
                recoveredCount++;
                console.log("Replayed write on " + fileKey + " from " + step.created_at);
            }
        }
    }
}

for (const f of filesToRecover) {
    const fullPath = path.join(workspaceDir, f);
    if (files[f]) {
        fs.writeFileSync(fullPath, files[f]);
    }
}

console.log("Total home edits recovered: " + recoveredCount);
