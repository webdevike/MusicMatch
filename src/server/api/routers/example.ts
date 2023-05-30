import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ChatGPTAPI } from "chatgpt";
import { env } from "@/env.mjs";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getSuggestions: protectedProcedure.input(z.object({
    text: z.string()
  })).mutation(async () => {
    const api = new ChatGPTAPI({
      apiKey: env.OPENAI_API_KEY
    })

    const res = await api.sendMessage('Provide me suggestions based on the following music I like. Bad suns, fleet foxes, Cautious Clay. Please respond in JSON format. The key name should be "artists" the values should be an array.')
    const data = JSON.parse(res.text)

    
    
    return data
  })
});
