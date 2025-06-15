import { CreateUserSchema } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { SPOTIFY_REGEX, YT_REGEX } from "@/app/regex";

export async function POST(req: NextRequest) {
  try {
    //TODO: add rate limiting so a user cant flood streams
    const data = CreateUserSchema.parse(await req.json());
    const isYt = YT_REGEX.test(data.url);
    const isSpotify = SPOTIFY_REGEX.test(data.url);
    
    if (!isYt && !isSpotify) {
      return NextResponse.json({
        message: "Link is not correct should be a spotify or yt link"
      }, {
        status: 411
      });
    }

    let extractedId: string;
    let type: "Youtube" | "Spotify";

    if (isYt) {
      // Handle different YouTube URL formats
      if (data.url.includes("youtu.be/")) {
        extractedId = data.url.split("youtu.be/")[1].split("?")[0];
      } else if (data.url.includes("watch?v=")) {
        extractedId = data.url.split("?v=")[1].split("&")[0];
      } else {
        throw new Error("Invalid YouTube URL format");
      }
      type = "Youtube";
    } else if (isSpotify) {
      // Extract Spotify track ID from URL
      const match = data.url.match(/spotify\.com\/track\/([a-zA-Z0-9]{22})/);
      if (match) {
        extractedId = match[1];
      } else {
        throw new Error("Invalid Spotify URL format");
      }
      type = "Spotify";
    } else {
      throw new Error("Unsupported URL format");
    }

    // Added await for database operation
    await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type
      }
    });

    // Return success response
    return NextResponse.json({
      message: "Stream added successfully",
      extractedId,
      type
    }, {
      status: 200
    });

  } catch (e) {
    console.error("Error adding stream:", e);
    //TODO: Better error handling exactly what was wrong
    return NextResponse.json({
      message: "Error while adding a stream"
    }, {
      status: 411
    });
  }
}