import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';
import { createBlog, updateBlog} from '@Anirudh808/medium-common'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: string;
    }
}>();

blogRouter.use('/*', async (c, next) => {

    const authHeader = c.req.header('authorization') || "";
    
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);

        if(user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    }
    catch(e) {
        console.log(e);
        c.status(403);
        return c.json({
            message: "Error while login please login again"
        })
    }
})

blogRouter.post("/blog", async (c) => {

    const body = await c.req.json();

    const { success } = createBlog.safeParse(body);
    if(!success) {
        c.status(411);
        return c.text("Invalid Inputs cannot create blog")
    }
    try {
        const authorId = c.get("userId");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const blog = prisma.post.create({
            data: {
                tittle: body.title,
                content: body.content,
                authorId: authorId
            },
            select: {
                id: true
            }
        })

        return c.json({
            id: (await blog).id
        })
    }
    catch(e) {

    }

})
