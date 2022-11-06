const router = require('express').Router()
const { Post } = require('../models/posts')


router.get('/', async (req,res) => {
    try {
        const posts = await Post.find()
        
        res.send(posts)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params
        const post = await Post.findOne({_id: id})
        
        res.send(post)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/:id', async (req,res) => {
    try {
        const { id } = req.params
        const {title, text, image} = req.body
        if(!title && !text && !image){
            res.send({msg: 'This is an empty post!'})
        }
        const payload = {...req.body, user_id: id}
        await new Post(payload).save()

        res.send({msg: 'post Uploaded'})

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params
        const payload = req.body
        
        console.log(payload)
        await Post.findOneAndUpdate({user_id: id}, payload)
        res.send({msg: 'post Updated'})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params
        
        await Post.findOneAndDelete({user_id: id})
        res.send({msg: 'post Deleted'})

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = router;