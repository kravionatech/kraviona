import path from "path";
import { cloudinary } from "../../config/cloudinary.js";

import { mediaModel } from "../../models/media/media.model.js";
import { Auth } from "../../models/auth/auth.models.js";
import { recordActivity } from "../../utils/activityLogger.js";

export const uploadMedia = async (req, res) => {
    try {
        const user = req.user;
        const files = req.files;
        if (user.role === "user") return res.status(403).json({
            message:"User not authorized"
        })

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Choose at least one media file.",
            });
        }

        const isUser = await Auth.findById(user._id || user.id);

        if (!isUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const uploadedFiles = [];

        for (const file of files) {
            const isImage = file.mimetype.startsWith("image/");
            // multer-storage-cloudinary uploads directly, exposing the secure
            // delivery URL on `path` and the Cloudinary public id on `filename`.
            const media = await mediaModel.create({
                fileName: file.filename,
                originalName: file.originalname,

                fileUrl: file.path,
                publicId: file.filename,

                // Images are normalized to WebP in the Cloudinary upload middleware.
                // Keep the original filename separately so editors can still identify it.
                mimeType: isImage ? "image/webp" : file.mimetype,
                extension: isImage ? ".webp" : path.extname(file.originalname),
                fileSize: file.size,

                mediaType: isImage
                    ? "image"
                    : file.mimetype.startsWith("video/")
                    ? "video"
                    : file.mimetype.startsWith("audio/")
                    ? "audio"
                    : "document",

                width: file.width || null,
                height: file.height || null,
                duration: file.duration || null,

                userID: isUser._id,
                uploadedBy: isUser._id,

                authorDetails: {
                    name: isUser.name,
                    email: isUser.email,
                    username: isUser.username,
                },

                altText: "",
                isDeleted: false,
            });

            uploadedFiles.push(media);
            await recordActivity(req, {
                userID: isUser._id,
                module: "media",
                action: "uploaded",
                resourceId: media._id,
                resourceName: media.originalName,
                after: { mediaType: media.mediaType, fileName: media.originalName },
            });
        }

        return res.status(201).json({
            success: true,
            message: "Media uploaded successfully.",
            count: uploadedFiles.length,
            data: uploadedFiles,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};



export const getMyMedias = async (req, res) => {
    try {
        const user = req.user;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 48);
        const skip = (page - 1) * limit;

        const filter = {
            userID: user.id,
            isDeleted: false,
        };
        const search = String(req.query.search || "").trim();
        if (search) {
            const regex = { $regex: search, $options: "i" };
            filter.$or = [
                { originalName: regex },
                { fileName: regex },
                { mediaType: regex },
                { mimeType: regex },
            ];
        }

        const [media, total] = await Promise.all([
            mediaModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            mediaModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Media fetched successfully.",
            data: media,

            pagination: {
                totalItems: total,
                currentPage: page,
                perPage: limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const deleteMedia = async (req, res) => {
    try {
        const user = req.user;
        const media = await mediaModel.findById(req.params.id);

        if (!media || media.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Media not found.",
            });
        }

        const isOwner = String(media.userID) === String(user.id || user._id);
        const canManageAll = user.role === "super_admin";

        if (!isOwner && !canManageAll) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this media.",
            });
        }

        if (media.publicId) {
            try {
                await cloudinary.uploader.destroy(media.publicId, {
                    resource_type: media.mediaType === "video" ? "video" : "image",
                });
            } catch (cloudinaryError) {
                console.error("Cloudinary delete failed:", cloudinaryError.message);
            }
        }

        media.isDeleted = true;
        await media.save();
        await recordActivity(req, {
            userID: user.id || user._id,
            module: "media",
            action: "deleted",
            resourceId: media._id,
            resourceName: media.originalName,
            before: { mediaType: media.mediaType, fileName: media.originalName },
        });

        return res.status(200).json({
            success: true,
            message: "Media deleted successfully.",
            data: media,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};
