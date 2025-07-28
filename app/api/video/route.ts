import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo, VIDEO_DIMENSIONS } from "@/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if(!videos || videos.length == 0) {
      return NextResponse.json({
        message: "No videos found",
        videos: []
      },{status: 200});
    }      

    return NextResponse.json({videos: videos},{status:200});
  } catch (err) {
    return NextResponse.json({
      error:`Internal Server Error: ${err}`
    },{status: 500})
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if(!session) {
      return NextResponse.json({
        error: "Unauthorized"
      },{status: 401})
    }
    await connectToDatabase();
    const body: IVideo = await request.json();

    if(!body.description || !body.thumbnailUrl || !body.title || !body.videoUrl) {
      return NextResponse.json({
        error: "Enter all details"
      },{status: 400})
    }
    
    const videoData = {
      ...body,
      controls: body?. controls?? true,
      transformations: {
        height: body?.transformations?.height ?? VIDEO_DIMENSIONS.height,
        width: body?.transformations?.width ?? VIDEO_DIMENSIONS.width,
        quality: body?.transformations?.quality ?? 100
      }
    }

    const newVideo = await Video.create(videoData);
    return NextResponse.json({video: newVideo});

    
  } catch (error) {
    return NextResponse.json({
      error:`Internal Server Error: ${error}`
    },{status: 500})
  }
}