import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    const { price, description, type, latitude, longitude } = req.body;
    
    if(!price || !type || !latitude || !longitude){
        return res.status(400).json({message: "Please enter all fields"});
    }
    
    try {
        const newPost = new Post ({
            user: req.user._id,
            price,
            description,
            type,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
        });

        await newPost.save();
        res.status(200).json({message: "Post created successfully", post: newPost});
    } catch (error) {
        console.log("Error creating post: ", error);
        return res.status(500).json({ message: "Error creating post", error });
    }
};

export const getPostById = async (req, res) => {
    try {
      const userId = req.params.id;
    //   console.log("UserId:", userId);
      const post = await Post.find( {user: userId}).populate("user", "name profilePic");
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
  
      // authority check
      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
      }
  
      await post.deleteOne();
      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.log("Error deleting post: ", error);
      return res.status(500).json({ message: "Error deleting post", error });
    }
  }; 

export const editPost = async (req, res) => {
    const { price, description, type, latitude, longitude } = req.body;
  
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
  
      post.price = price;
      post.description = description;
      post.type = type;
      post.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
  
      await post.save();
      return res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.log("Error updating post: ", error);
      return res.status(500).json({ message: "Error updating post", error });
    }
  };

  export const getNearbyPosts = async (req, res) => {
    const { latitude, longitude, radius = 10 } = req.query; // Default radius is 10km
  
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
            maxDistance: radius * 1000, // Convert km to meters
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