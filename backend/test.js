const axios = require("axios");
const readline = require("readline");

const url = "https://www.perplexity.ai/rest/sse/perplexity_ask";

const headers = {
  accept: "text/event-stream",
  "content-type": "application/json",
  "user-agent": "Mozilla/5.0",
  origin: "https://www.perplexity.ai",
  referer: "https://www.perplexity.ai/"
};

async function ask(query) {
  try {
    const response = await axios({
      method: "POST",
      url,
      headers,
      data: {
        query_str: query,
        mode: "copilot",
        model_preference: "turbo"
      },
      responseType: "stream"
    });

    let buffer = "";
    let lastPrinted = "";

    response.data.on("data", (chunk) => {
      buffer += chunk.toString();

      let lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        if (!line.startsWith("data: ")) continue;

        try {
          const json = JSON.parse(line.slice(6));

          if (!json.blocks) continue;

          let fullText = "";

          for (const block of json.blocks) {

            // ✅ CASE 1: old format
            if (block.markdown_block?.chunks?.length) {
              fullText = block.markdown_block.chunks.slice(-1)[0];
            }

            // ❌ ignore diff_block (too unstable)
          }

          if (fullText && fullText !== lastPrinted) {
            process.stdout.write("\r🤖 Bot: " + fullText);
            lastPrinted = fullText;
          }

        } catch (e) {}
      }
    });

    return new Promise((resolve) => {
      response.data.on("end", () => {
        console.log("\n");
        resolve();
      });
    });

  } catch (err) {
    console.error("Error:", err.message);
  }
}

// ================= CLI =================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🤖 Chatbot started (type 'exit' to stop)\n");

function loop() {
  rl.question("🧑 You: ", async (input) => {
    if (input === "exit") {
      rl.close();
      return;
    }

    await ask(input);
    loop();
  });
}

loop();