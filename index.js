import { App } from "@slack/bolt";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import "dotenv/config";

const hackai = createOpenRouter({
  apiKey: process.env.HACK_CLUB_AI_API_KEY,
  baseUrl: "https://ai.hackclub.com/proxy/v1",
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.message(async ({ message, say, client }) => {
  if (message.subtype === "bot_message" || message.bot_id) return;
  if (message.thread_ts) return;
  client.reactions.add({
    channel: message.channel,
    name: "loading",
    timestamp: message.ts,
  });
  const { response } = await generateText({
    model: hackai("google/gemini-2.5-flash"),
    system:
      "Format your response using Slack's mrkdwn syntax. Use *bold* for bold, _italics_ for italics, and <url|text> for links. For unordered lists, use a bullet point (•) followed by a space. Do not use * for lists. Do not use # for headers or markdown tables. Do not wrap the response in a markdown code block. Never mention that you are using special markdown.",
    prompt: message.text,
  });
  const responseText =
    response.messages[response.messages.length - 1].content[0].text;
  say({
    text: responseText,
    thread_ts: message.ts || message.thread_ts,
    mrkdwn: true,
  });
  client.reactions.remove({
    name: "loading",
    timestamp: message.ts,
    channel: message.channel,
    user: message.user.id,
  });
});

app.message(async ({ message, say, client }) => {
  if (!message.thread_ts) return;
});

(async () => {
  await app.start();
  app.logger.info("Gemini-Slack bot is running");
})();
