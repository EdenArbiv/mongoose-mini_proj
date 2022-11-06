const router = require('express').Router()
const { Comment } = require('../models/Comment')
const { Post } = require('../models/posts')


router.get('/', async (req,res) => {
    try {
        const Allcomments = await Comment.find()
        res.send(Allcomments)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req,res) => {
    try {
        const {postId} = req.params

        const comment = await Comment.find({post_id: postId})
        res.send(comment)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/:id', async (req,res) => {
    try {
        const { id } = req.params

        const payload = {...req.body, post_id: id}
        const comment = await new Comment(payload).save()
        await Post.findOneAndUpdate({_id: id}, {$push: { comments: comment } })

        res.send({msg: 'success'})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params

        await Comment.findOneAndDelete({_id: id})
        res.send({msg: 'comment deleted'})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = router;