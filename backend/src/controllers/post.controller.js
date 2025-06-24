import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const createPost = async (req, res) => {
    // console.log("Received Request Body:", req.body);
    const { price, description, type, latitude, longitude, utilities, contact } = req.body;
    const image = req.file;
    const parsedUtilities = Array.isArray(utilities) ? utilities : JSON.parse(utilities);

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Please enter location" });
    }

    let imageUrl = null;
    if (image){
        const uploadResposnse = await cloudinary.uploader.upload(image.path,{
            folder: 'chat_app',
        });

        imageUrl = uploadResposnse.secure_url;
        fs.unlinkSync(image.path);
    }

    try {
        const newPost = new Post({
            user: req.user._id,
            price,
            description,
            type,
            contact,
            utilities: parsedUtilities,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            image: imageUrl ? imageUrl : null,
        });

        await newPost.save();
        res.status(200).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.log("Error creating post: ", error);
        return res.status(500).json({ message: "Error creating post", error });
    }
};


export const getPostByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const post = await Post.find({ user: userId }).populate("user", "name email profilePic");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ post });
    } catch (error) {
        console.log("Error fetching post by ID: ", error);
        return res.status(500).json({ message: "Error fetching post", error });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting post", error });
    }
};

export const editPost = async (req, res) => {
    const { price, description, type, latitude, longitude, utilities } = req.body;
    const image = req.files?.image;

    if (!price || !description || !type || !latitude || !longitude) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to edit this post" });
        }

        const imageUrl = image ? await uploadImage(image) : post.image;

        post.price = price;
        post.description = description;
        post.type = type;
        post.utilities = utilities;
        post.location = {
            type: "Point",
            coordinates: [longitude, latitude],
        };

        if (imageUrl) {
            post.image = imageUrl;
        }

        await post.save();
        return res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.log("Error updating post: ", error);
        return res.status(500).json({ message: "Error updating post", error });
    }
};

export const getNearbyPosts = async (req, res) => {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    try {
        const posts = await Post.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    distanceField: "distance",
                    maxDistance: radius * 1000,
                    spherical: true,
                },
            },
        ])
        .then(async (posts) => {
            const populatedPosts = await Post.populate(posts, {
                path: 'user', 
                select: 'name email profilePic',
            });
            return populatedPosts;
        });

        return res.status(200).json({ posts });
    } catch (error) {
        console.log("Error fetching nearby posts: ", error);
        return res.status(500).json({ message: "Error fetching nearby posts", error });
    }
};

export const getRecentPostsWithImages = async (req, res) => {
        try {
            const posts = await Post.find() 
                .sort({ createdAt: -1 }) 
                .limit(10)
                .populate("user", "name email profilePic");
    
            return res.status(200).json({ posts });
        } catch (error) {
            console.log("Error fetching recent posts with images: ", error);
            return res.status(500).json({ message: "Error fetching posts", error });
        }
    };