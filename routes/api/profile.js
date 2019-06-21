const router = require('express').Router();
const auth = require('../../middleware/auth');
const {profileValidator, errorFormatter} = require('../../validators/profile');
const { validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const isValid = require('mongoose').mongo.ObjectId.isValid;


// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me', auth, async (req, res, next) => {
    try{

        const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', '-_id avatar name');

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);

    }catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route  POST api/profile
// @desc   Create or update user profile
// @access Private
router.post('/', auth, profileValidator, async (req, res, next) => {

        const errors = validationResult(req).formatWith(errorFormatter);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
    
    const {
        company, 
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile object

    //Can be done with for in loop
    const profileFields = {};
    profileFields.userId = req.user._id.toString();
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill=>skill.trim());
    }

    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        
        let profile = await Profile.findOne({userId: req.user._id});
        console.log(profile);
        if(profile) {
            //Overwrite data with new data, leave old untouched
            for(let key in profileFields){
                profile[key] = profileFields[key];
            } 
            const newProfile = await profile.save();
            return res.json(newProfile);
        }

        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);


    }catch(err) {
        console.error(err);
        res.sendStatus(500);
    }

});

// @route  GET api/profile
// @desc   GET all profiles
// @access Public

router.get('/', async (req, res, next) => {
    try{
        const profiles = await Profile.find().populate('userId', 'name avatar');
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
});

// @route  GET api/profile/user/:userId
// @desc   GET profile by id
// @access Public

router.get('/user/:user_id', async (req, res, next) => {
    const {user_id} = req.params;
    try{
        if(!isValid(user_id)){
            return  res.status(404).json({ msg: 'There is no profile for this user.' });
        }
        const profile = await Profile.findOne({userId: req.params.user_id}).populate('userId', 'name avatar');
        if(!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
});

// @route  DELETE api/profile/user/:userId
// @desc   Delete a profile
// @access Private


router.delete('/', auth, async (req, res, next) => {
    try{

        await Post.deleteMany({userId: req.user._id});

        await Profile.deleteOne({userId: req.user._id});

        await User.deleteOne({_id: req.user._id});


        res.json({ message: 'User deleted. '});

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile exp
// @access Private

router.put('/experience', auth, async (req, res, next) => {
//Validation....

    const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try{

        const profile = await Profile.findOne({ userId : req.user._id });

        await profile.addExperience(newExp);

        await profile.save();

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }

});

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete profile exp
// @access Private

//Validation
router.delete('/experience/:exp_id', auth, async (req, res, next) =>{
    const exp_id = req.params.exp_id;

    try{

        if(!isValid(exp_id)){
            return res.status(400).json({msg: 'Experience id is not valid.'})
        }


        const profile = await Profile.findOne({userId: req.user._id});

        await profile.deletePropById(exp_id, 'experience'); //It will call save on it

        res.json(profile); 

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
});

// @route  PATCH api/profile/experience/:exp_id
// @desc   Add profile exp
// @access Private
//Validation
router.patch('/experience/:exp_id', auth, async (req, res, next) => {
    const exp_id = req.params.exp_id;

    const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
    } = req.body;

    const fields = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    if(!isValid(exp_id)){
            return res.status(400).json({msg: 'Experience id is not valid.'})
    }
    //First approach
    try{
        const changedExp = {};
        changedExp._id = exp_id;
        for(let key in fields){
            if(fields[key]){
                    changedExp[key] = fields[key];
            }
        }

        const user = await Profile.findOneAndUpdate({
            userId: req.user._id, 
            "experience._id": exp_id
        }, 
        {$set: 
            {"experience.$": changedExp}
        },
        {
            new: true,
            upsert: false
        });    

        res.json({
           user
        });

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
    /* Second approach

        const profile = await Profile.findOne({userId: req.user._id});

        const expToChangeId = profile.experience.findIndex(exp => exp._id.toString() === exp_id);
        console.log(expToChangeId);

        for(let key in fields){
            if(fields[key]){
                    profile.experience[expToChangeId][key] = fields[key];
            }
        }
        
        await profile.save(); 

*/
});

// @route  PUT api/profile/education/:exp_id
// @desc   Add profile edu
// @access Private
router.put('/education', auth, async (req, res, next) => {
//Validation....

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        degree,
        school,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try{

        const profile = await Profile.findOne({ userId : req.user._id });

        await profile.addEducation(newExp);

        await profile.save();

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }

});

router.delete('/education/:ed_id', auth, async (req, res, next) => {
    const ed_id = req.params.ed_id;

    try{

        if(!isValid(ed_id)){
            return res.status(400).json({msg: 'Education id is not valid.'})
        }


        const profile = await Profile.findOne({userId: req.user._id});

        await profile.deletePropById(ed_id, 'education'); //It will call save on it

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
});




module.exports = router;