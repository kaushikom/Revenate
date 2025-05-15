import { User } from "../models/user.model.js";

export const addUser = async (req, res) => {
  const { clerkId, email, firstName, lastName, profileImage } = req.body;
  try {
    if (!clerkId) {
      return res
        .status(404)
        .json({ success: false, message: "clerkId not found" });
    }

    // check if the user already exists

    const userExists = await User.findOne({ clerkId });
    if (userExists) {
      return res
        .status(200)
        .json({ success: true, message: "User already exists" });
    }

    // If user doesn't exists

    // Create new user in MongoDB
    const newUser = new User({
      clerkId,
      email: email.emailAddress,
      firstName,
      lastName,
      profileImage,
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    console.error("Error while adding new user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while adding new user", error });
  }
};
