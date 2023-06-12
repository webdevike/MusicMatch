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
    text: z.string(),
  })).mutation(async ({ ctx, input }) => {
    try {
      const account = await ctx.prisma.account.findFirst({
        where: {
          user: {
            id: ctx.session.user.id
          }
        }
      })

      const accessToken = account?.access_token


      const api = new ChatGPTAPI({
        apiKey: env.OPENAI_API_KEY,
      })

      const res = await api.sendMessage(
        `${input.text} Please respond in JSON format. The key name should be "artists" the values should be an array of objects. The object should have the following values. name: string, description: string. Respond with at least 10 results if you can.`
      )
      const data = JSON.parse(res.text)


      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const promises: Promise<unknown>[] = data?.artists.map(async (artist: string) => {
        const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist.name)}&type=artist`;
        const query: string = encodeURIComponent(artist.name);
        const response = await fetch(`${apiUrl}&q=${query}`, {
          headers: {
            'Authorization': `Bearer ${accessToken as string}`
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const res = await response.json();
        const spotifyArtist = res?.artists?.items[0];



        return spotifyArtist;
      });

      const results: any[] = await Promise.all(promises);


      return results
      
    } catch (error) {
      console.error(error)
      // throw new Error(error)
    }
    // https://github.com/transitive-bullshit/chatgpt-api/blob/main/demos/demo-conversation.ts for multiple contextual prompts

   
  })
});
