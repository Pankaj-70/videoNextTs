import {Schema, models, model} from 'mongoose';

export const VIDEO_DIMENSIONS = {
    height: 1920,
    width: 1080
} as const;

export interface IVideo{
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformations?: {
        height: number;
        width: number;
        quality?: number;
    }
};

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    tranformations: {
        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height
        },
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width
        },
        quality: {
            type: Number,
            min: 1,
            max: 100
        }
    }
},{timestamps: true})

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;