const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('./../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('./../../models/Profile');
const User = require('./../../models/User');
const { default: Axios } = require('axios');
const { response } = require('express');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth, [
    check('status', 'Cargo é obrigatório').not().isEmpty(),
    check('skills', 'Habilidades são obrigatórias').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try { 

        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields },
                {new: true}
            );

            return res.json(profile); 
        }

        //Create 
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {

    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        res.json(profiles);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by user id
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {

        const profile = await Profile.findOne({user: req.params.userId}).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({msg: 'Profile not found'});

        res.json(profile);
        
    } catch (error) {
        console.error(error.message);

        if(error.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {

    try {
        //TODO: remove user posts
        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        //Remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User deleted'});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [auth, [
    check('title', 'Título é obrigatório').not().isEmpty(),
    check('company', 'Empresa é obrigatória').not().isEmpty(),
    check('from', 'Data de início é obrigatória').not().isEmpty(),
]], async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

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

    try {

        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/experience/:expId
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:expId', auth, async (req, res) => {
    try {
        
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience = profile.experience.filter((exp) => {
            return exp.id.toString() !== req.params.expId
        });

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [auth, [
    check('school', 'Instituição é obrigatória').not().isEmpty(),
    check('degree', 'Grau de formação é obrigatório').not().isEmpty(),
    check('fieldofstudy', 'Área de estudo é obrigatória').not().isEmpty(),
    check('from', 'Data de início é obrigatória').not().isEmpty(),
]], async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {

        const profile = await Profile.findOne({user: req.user.id});

        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/education/:eduId
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:eduId', auth, async (req, res) => {
    try {
        
        const profile = await Profile.findOne({user: req.user.id});

        profile.education = profile.education.filter((edu) => {
            return edu.id.toString() !== req.params.eduId;
        });

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`);

        const headers = {
            'user-agent': 'node.js',
            Authorization: `token ${process.env['GITHUB_TOKEN']}`
        };

        const githubResponse = await axios.get(uri, {headers});
        
        res.json(githubResponse.data);

    } catch (error) {
        console.error(error.message);

        if(error.response.data.message == 'Not Found'){
            return res.status(404).json({msg: 'No Github profile found'});
        };

        res.status(500).send('Server Error');
    }
});

module.exports = router;