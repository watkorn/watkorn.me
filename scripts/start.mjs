// scripts/start.mjs
// dev server: build content + watch content/ แล้วรัน react-scripts start
// (ใช้ได้ทั้ง PowerShell, macOS และ Linux)
import { spawn } from "node:child_process";
import { buildContent, watchContent } from "./content.mjs";

// ตอน dev แสดงโพสต์ draft ด้วย เพื่อ preview ก่อนเผยแพร่
buildContent({ drafts: true });
watchContent({ drafts: true });

const child = spawn("react-scripts", ["start"], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
