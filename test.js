const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    username: String
});

UserSchema.pre('save', function(){
    console.log('Saving user');
})

UserSchema.pre('remove', async function(next){
    try{

        await this.model('posts').deleteMany({userId: this._id});
        
    }catch(err){

        next(err);

    }
});

const User = mongoose.model('users', UserSchema);

const PostSchema = new mongoose.Schema({
    text: String,
    userId: {
        type: ObjectId,
        ref:  'users'
    }
});

const Post = mongoose.model('posts', PostSchema);


(async () => {
    try{
    await mongoose.connect('mongodb+srv://root:sevo1389@practice-hsewl.mongodb.net/testing?retryWrites=true');
    await Post.deleteMany({});
    await User.deleteMany({});
    
    //Initializing and saving user
    const user = new User({username: 'Vukasin'});
    await user.save();
    //Initializing and saving post
    const post = new Post({text: 'Random post.', userId: user._id});
    await post.save();


    const removed = await user.remove();

    console.log('User removed.');
    console.log(removed);

    }catch(err){
        console.log(err);
    }
}) ()