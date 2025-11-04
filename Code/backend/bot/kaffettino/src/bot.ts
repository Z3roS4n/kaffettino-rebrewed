import { Bot } from "gramio"
import { config } from "./config.ts"
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query"
import { i18n } from "@gramio/i18n/fluent"
import type { TypedFluentBundle } from "./locales.types.ts";

export const bot = new Bot(config.BOT_TOKEN)
.extend(autoAnswerCallbackQuery())
.extend(i18n<TypedFluentBundle>())
    .command("start", (context) => context.send("Hi!"))
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));