import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs';

const uploadImage = async (image) => {
    if (!image) {
        return null;
    }

    try {
        let uploadResponse;

        if (image.startsWith('data:image/')) {
            uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'post_images',
            });
        } else {
            uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'post_images',
            });

            fs.unlinkSync(image.tempFilePath);
        }

        return uploadResponse.secure_url;
    } catch (error) {
        throw new Error("Image upload failed: " + error.message);
    }
};

export const createPost = async (req, res) => {
    const { price, description, type, latitude, longitude, utilities } = req.body;
    const image = req.files?.image;

    if (!price || !type || !latitude || !longitude) {
        return res.status(400).json({ message: "Please enter all required fields" });
    }

    try {
        const imageUrl = await uploadImage(image);

        const newPost = new Post({
            user: req.user._id,
            price,
            description,
            type,
            utilities,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            image: imageUrl,
        });

        await newPost.save();
        res.status(200).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.log("Error creating post: ", error);
        return res.status(500).json({ message: "Error creating post", error });
    }
};

export const getPostById = async (req, res) => {
    try {
        const userId = req.params.id;
        const post = await Post.find({ user: userId }).populate("user", "name profilePic");
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
        ]);

        return res.status(200).json({ posts });
    } catch (error) {
        console.log("Error fetching nearby posts: ", error);
        return res.status(500).json({ message: "Error fetching nearby posts", error });
    }
};
