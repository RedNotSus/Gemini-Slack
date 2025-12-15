# Gemini-Slack

A slack bot that uses the hack club api to let you talk with gemini through slack directly.

Supports

- Channel's
- DM's
- Photo Generation
- Conversation Contex

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add the following environment variables:

```
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
HACK_CLUB_AI_API_KEY=
```

4. Run `node index.js` to start the bot
5. Invite the bot to your slack workspace and start chatting!

## Commands

- "/photo [prompt]" - Generates an AI photo based off of the prompt provided
- Message the bot directly or mention it in a channel to chat with Gemini AI
