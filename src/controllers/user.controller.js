// import asyncHandler from '../utils/asyncHandler.js'
// import { ApiError } from '../utils/ApiError.js';
// import { User } from "../models/user.model.js";
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
// import { ApiResponse } from '../utils/ApiResponse.js';

// const registerUser = asyncHandler(async (req, res) => {
//     //res.status(200).json({ message: "User registered successfully" });
//     //get user details from frontend
//     //validate user details
//     //check if user already exists
//     //check for images,avatar
//     //upload to cloudinary
//     //create user object- create entry in db
//     //remove password and jwt token from response
//     //check user object
//     //return response

//     const { fullName, email, username, password } = req.body;
//     //console.log("email: ", email);

//     // if(fullName===""){
//     //     throw new ApiError(400,"Fullname is required")
//     // }

//     if ([fullName, email, username, password].some(field => field === "")) {
//         throw new ApiError(400, "All fields are required");
//     }
    

//     // if([fullName,email,username,password].some((field)=>field?.trim()==="")){
//     //     throw new ApiError(400,"All fields are required")
//     // }

//     // User.findOne({ email }).then((user) => {
//     //     if (user) {
//     //         throw new ApiError(409, "User with email already exists")
//     //     }
//     // }

//     const existedUser = await User.findOne({
//         $or: [{ email }, { username }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar is required")
//     }

//     const avatar= await uploadOnCloudinary(avatarLocalPath).then((avatar) => {
//         //console.log("avatar: ", avatar);
//     })

//     const coverImage = await uploadOnCloudinary(coverImageLocalPath).then((coverImage) => {
//         //console.log("coverImage: ", coverImage);
//     })

//     if(!avatar){
//         throw new ApiError(400,"Avatar image upload failed")
//     }

//     const user = await User.create({
//         fullName,
//         avatar:avatar.url,
//         coverImage:coverImage?.url || null,
//         email,
//         password,
//         username: username.toLowerCase(),
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if(!createdUser){
//         throw new ApiError(500,"User registration failed")
//     }

//     return res.status(201).json(new ApiResponse(201,"User registered successfully",createdUser))

// })

// export { registerUser }

import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    ////console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    let avatar, coverImage;

    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        ////console.log("avatar: ", avatar);

        if (coverImageLocalPath) {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
            ////console.log("coverImage: ", coverImage);
        }
    } catch (error) {
        throw new ApiError(400, "Image upload failed");
    }

    if (!avatar) {
        throw new ApiError(400, "Avatar image upload failed");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || null,
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));
});

export { registerUser };
