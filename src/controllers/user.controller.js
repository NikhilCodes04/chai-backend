import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {
    //res.status(200).json({ message: "User registered successfully" });
    //get user details from frontend
    //validate user details
    //check if user already exists
    //check for images,avatar
    //upload to cloudinary
    //create user object- create entry in db
    //remove password and jwt token from response
    //check user object
    //return response

    const { fullName, email, username, password } = req.body;
    console.log("email: ", email);

    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required")
    // }

    if ([fullName, email, username, password].some("")) {
        throw new ApiError(400, "All fields are required")
    }

    // if([fullName,email,username,password].some((field)=>field?.trim()==="")){
    //     throw new ApiError(400,"All fields are required")
    // }

    // User.findOne({ email }).then((user) => {
    //     if (user) {
    //         throw new ApiError(409, "User with email already exists")
    //     }
    // }

    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath).then((avatar) => {
        console.log("avatar: ", avatar);
    })

    const coverImage = await uploadOnCloudinary(coverImageLocalPath).then((coverImage) => {
        console.log("coverImage: ", coverImage);
    })

    if(!avatar){
        throw new ApiError(400,"Avatar image upload failed")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || null,
        email,
        password,
        username: username.toLowerCase(),
    })

    const createUser = await User.findById(user._id).then((user) => {})

})

export { registerUser }