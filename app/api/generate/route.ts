import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    // Parsing the request body to get the prompt
    const { prompt } = await request.json();

    // Validate prompt existence and length
    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a description for the image you want to generate" },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please keep it under 1000 characters" },
        { status: 400 }
      );
    }

    // Creating the payload to send to the image generation API
    const payload = {
      messages: [{ content: prompt, role: "user" }],
      user_id: uuidv4(),
      codeModelMode: true,
      agentMode: {
        mode: true,
        id: "ImageGenerationLV45LJp",
        name: "Image Generation",
      },
    };

    // Making a POST request to the image generation API
    const response = await axios.post(
      "https://www.blackbox.ai/api/chat",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 11; Infinix X6816C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Mobile Safari/537.36",
        },
        timeout: 30000, // Timeout set for the API request
      }
    );

    // Check if the response contains a valid image URL
    if (!response.data?.link) {
      throw new Error("No image URL received from the API");
    }

    // Return the image URL in the response
    return NextResponse.json({ imageUrl: response.data.link });
  } catch (error) {
    console.error("Image generation error:", error);

    // Handle error messages appropriately
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred while generating the image";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof axios.AxiosError ? error.response?.status || 500 : 500 }
    );
  }
}
