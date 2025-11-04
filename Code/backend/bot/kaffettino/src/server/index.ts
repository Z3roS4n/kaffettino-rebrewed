import Fastify from "fastify"
import { config } from "../config.ts"
import { bot } from "../bot.ts"
import { webhookHandler } from "gramio"

export const fastify = Fastify()

fastify.post(`/${config.BOT_TOKEN}`, webhookHandler(bot, "fastify"))
