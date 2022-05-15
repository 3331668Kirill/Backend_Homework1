import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";

const jsonBodyMiddleware = bodyParser.json()
const app = express()
const port = process.env.PORT || 5002

app.use(jsonBodyMiddleware)
app.use(cors())
app.use('/api/bloggers', bloggersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/auth', authRouter)

app.get('/*', (req: Request, res: Response) => {
    res.send({
        "/api/bloggers": "GET, POST",
        "/api/bloggers/:postId": "GET, PUT, DELETE",
        "/api/posts": "GET, POST",
        "/api/posts/:postId": "GET, PUT, DELETE"
    })
})

async function startServer() {
    await runDb()
    await app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer()
