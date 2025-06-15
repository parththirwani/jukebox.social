import { z } from "zod"


export const CreateUserSchema = z.object({
    creatorId: z.string(),
    url: z.string() //TODO: Add validation for youtube or spotify urls only


})