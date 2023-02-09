import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";


export const getPosts = async (req, res) => {
    try {
        const getMessage = await PostMessage.find();
        res.status(200).json(getMessage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createPost = async (req, res) => {
    const post = req.body;
    console.log('post', post)
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() }); //now backend automatically specified the creator of a specific post
    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;


    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    // we can actually receive updated version of the  post
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);

}


export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;


    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    // we can actually receive updated version of the  post
    await PostMessage.findByIdAndRemove(_id);
    res.json({ message: 'Post deleted Successfully' });

}

export const likePost = async (req, res) => {
    const { id: _id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    // we can actually receive updated version of the  post
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatePost);
}
