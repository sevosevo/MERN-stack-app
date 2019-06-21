const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    company: String,
    website: String,
    location: String,
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: String,
    githubusername: String,
    experience: [{
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: String,
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: String
    }],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type:Date,
                required:true
            },
            to:{
                type:Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: String
        }
    ],
    social: {
        youtube: String,
        twitter: String,
        facebook: String,
        linkedin: String,
        instagram: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ProfileSchema.methods.add = function(newData, what) {
    if(what === 'experience'){
        const newExp = newData;
        this.experience.unshift(newExp);
    }else if(what === 'education'){
        const newEd = newData;
        this.education.unshift(newEd);
    }
};
ProfileSchema.methods.deletePropById = async function(id, what) {
    if(what === 'experience'){
        const newExp = this.experience.filter(exp=>exp._id.toString() !== id);
        this.experience = newExp;
        return this.save();
    }else if(what === 'education'){
        const newEd = this.education.filter(exp=>exp._id.toString() !== id);
        this.education = newEd;
        return this.save();
    }
};
ProfileSchema.methods.addExperience = async function(exp, save = false){
    this.experience.push(exp);
    if(save) return this.save();
};
ProfileSchema.methods.addEducation = async function(ed, save = false){
  this.education.push(ed);
  if(save) return this.save();
};

module.exports = mongoose.model('profiles', ProfileSchema);