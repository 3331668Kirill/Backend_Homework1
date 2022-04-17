import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {ErrorMessageType, PostType} from "./types";
import {bloggers, posts} from "./state";

const port = process.env.PORT || 5002
const jsonBodyMiddleware = bodyParser.json()
const app = express()


const urlForValidation = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/

app.use(cors())
app.use(jsonBodyMiddleware)


app.get('/api/bloggers/', (req: Request, res: Response) => {
    res.status(200).send(bloggers);
})

app.post('/api/bloggers', (req: Request, res: Response) => {
    let isValid = true;
    let errorMessage: ErrorMessageType[] = [];
    if (!req.body.name) {
        isValid = false
        errorMessage.push({
            message: "name required",
            field: "name"
        })
        res.send(400)
    }
    if (!urlForValidation.test(req.body.youtubeUrl)) {
        isValid = false
        errorMessage.push({
            message: "The field YoutubeUrl must match the regular expression" +
                " '^https://([a-zA-Z0-9_-]+\\\\.)+[a-zA-Z0-9_-]+(\\\\/[a-zA-Z0-9_-]+)*\\\\/?$'.\"",
            field: "youtubeUrl"
        })
        res.send(400)
    }
    if (isValid) {
        const newBlogger = {
            id: +(new Date()),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201);
        res.send(newBlogger)
    } else {
        res.status(404)
        res.send({
            "errorsMessages": errorMessage,
            "resultCode": 1
        })
    }
})

app.get('/api/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) {
        res.status(200);
        res.send(blogger)
    } else {
        res.status(404)
        res.send(404
        //     {
        //     "errorsMessages": [{
        //         message: "blogger not found or blogger's id invalid",
        //         field: "id"
        //     }],
        //     "resultCode": 1
        // }
        )
    }
})

app.put('/api/bloggers/:bloggerId', (req: Request, res: Response) => {
    let isValid = true;
    let errorMessage: ErrorMessageType[] = [];
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        res.status(404)
        res.send(404
        //     {
        //     "errorsMessages": [{
        //         message: "blogger not found",
        //         field: "id"
        //     }],
        //     "resultCode": 0
        // }
        )
        return
    }
    if (!urlForValidation.test(req.body.youtubeUrl)) {
        isValid = false;
        errorMessage.push({
            message: "blogger's youtube`s URL invalid",
            field: "youtubeUrl"
        })
        res.send(400)
    }
    if (!id) {
        isValid = false;
        errorMessage.push({
            message: "blogger's id is invalid",
            field: "id"
        })
        res.send(400)
    }
    if (!req.body.name) {
        isValid = false;
        errorMessage.push({
            message: "blogger's name is invalid",
            field: "name"
        })
        res.send(400)
    }
    if (isValid) {
        blogger.name = req.body.name
        blogger.youtubeUrl = req.body.youtubeUrl
        res.send(204)
    }else{
        res.status(400)
        res.send({"errorsMessages": errorMessage,
            "resultCode": 1
        })
        res.send(400)
    }
})

app.delete('/api/bloggers/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const newBloggers = bloggers.filter(b => b.id != id)
    if (newBloggers.length < bloggers.length) {
        res.status(204)
            res.send(204)
    } else {
        res.status(404)
        res.send( "blogger not found")
    }
})


app.get('/api/posts', (req: Request, res: Response) => {
    res.send(posts)
})

app.post('/api/posts', (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === req.body.blogId)
    if (!req.body.shortDescription
        && !req.body.content && !req.body.title) {
        res.send(400)
    } else if (!blogger) {
        res.status(400).send('such blogger doesn`t exist')
    } else if (req.body.shortDescription > 100) {
        res.status(400).send('max length 100')
    }
    else {
        const newPost: PostType = {
            id: +(new Date()),
            title: req.body.title,
            content: req.body.content,
            blogId: req.body.blogId,
            shortDescription: req.body.shortDescription,
            bloggerName: blogger.name
        }
        posts.push(newPost)
        res.send(newPost)
    }

})

app.get('/api/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const post = posts.find(p => p.id === id)
    if (post) {
        res.send(post)
    } else {
        res.send(404)
    }
})

app.put('/api/posts/:postsId', (req: Request, res: Response) => {
    const id = +req.params.postsId

    if (!req.body.title) {

        res.status(400).send({
            errors: [{filed: 'title', message: 'Title firled is required'}]
        })
        return;
    }


    const post = posts.find(p => p.id === id)
    if (!post) {
        res.send(404)
    } else {
        if (req.body.title) {
            post.title = req.body.title
        }
        if (req.body.shortDescription) {
            post.shortDescription = req.body.shortDescription
        }
        if (req.body.content) {
            post.content = req.body.content
        }
        res.send(post)
    }
})


app.delete('/api/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const newPosts = posts.filter(p => p.id != id)
    if (newPosts.length < posts.length) {
        res.send(204)
    } else {
        res.send(404)
    }
})

app.get('/*', (req: Request, res: Response) => {
    res.send({
        "/api/bloggers": "GET, POST",
        "/api/bloggers/:postId": "GET, PUT, DELETE",
        "/api/posts": "GET, POST",
        "/api/posts/:postId": "GET, PUT, DELETE"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})