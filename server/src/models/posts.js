const {Schema, model} = require('mongoose')
 
const PostSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    image: {type: String, default: ''},
    title: {type: String, default: ''},
    text: {type: String, default: ''},
    likes: {type: Number, default: 0},
    comments: {type: Array, default: []},
    createdAt:  {type: Date, default: Date.now },

})


const Post = model("post", PostSchema)

module.exports = {Post}