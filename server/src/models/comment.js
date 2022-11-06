const {Schema, model} = require('mongoose')
 
const CommentSchema = new Schema({
    post_id:{
        type:Schema.Types.ObjectId,
        ref:'post'
    },
    content: {type: String, default: ''},
    createdAt:  {type: Date, default: Date.now },

})


const Comment = model("comment", CommentSchema)

module.exports = {Comment}