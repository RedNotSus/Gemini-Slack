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
  client.reactions.add({
    channel: message.channel,
    name: "loading",
    timestamp: message.ts,
  });
  const { response } = await generateText({
    model: hackai("google/gemini-2.5-flash"),
    system: "You are a helpful assistant.",
    prompt: message.text,
  });
  const responseText =
    response.messages[response.messages.length - 1].content[0].text;
  console.log(responseText);
  say({
    text: responseText,
    thread_ts: message.ts || message.thread_ts,
  });
  client.reactions.remove({
    name: "loading",
    timestamp: message.ts,
    channel: message.channel,
    user: message.user.id,
  });
});

(async () => {
  await app.start();
  app.logger.info("Gemini-Slack bot is running");
})();
