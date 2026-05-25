import http from "node:http";

const port = Number(process.env.LEAD_WEBHOOK_PORT ?? 8787);
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function formatLead(lead) {
  return [
    "Заявка с лендинга AntEx",
    `Мессенджер: ${lead.messenger ?? "-"}`,
    `Контакт: ${lead.contact ?? "-"}`,
    `Тема: ${lead.topic ?? "-"}`,
    `Сообщение: ${lead.message ?? "-"}`,
    `Источник: ${lead.source ?? "antex-landing"}`,
  ].join("\n");
}

async function sendToTelegram(text) {
  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram API failed: ${response.status} ${details}`);
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== "POST" || request.url !== "/lead") {
    sendJson(response, 404, { ok: false, error: "Not found" });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const lead = JSON.parse(rawBody);

    if (!lead.contact || !lead.message) {
      sendJson(response, 400, { ok: false, error: "contact and message are required" });
      return;
    }

    await sendToTelegram(formatLead(lead));
    sendJson(response, 200, { ok: true });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { ok: false, error: "Lead delivery failed" });
  }
});

server.listen(port, () => {
  console.log(`Lead webhook listening on http://localhost:${port}/lead`);
});
