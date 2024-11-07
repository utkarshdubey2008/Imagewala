import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    // Parse the incoming request JSON body
    const { prompt } = await request.json();

    // Validate the prompt field
    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a description for the image you want to generate" },
        { status: 400 }
      );
    }

    // Validate the length of the prompt
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please keep it under 1000 characters" },
        { status: 400 }
      );
    }

    // Prepare the payload for the API request
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

    // Log the payload to ensure correct data is being sent
    console.log("Payload:", payload);

    // Make the API request
    const response = await axios.post(
      "https://www.blackbox.ai/api/chat",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 11; Infinix X6816C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Mobile Safari/537.36",
        },
        timeout: 30000, // Timeout for the API request
      }
    );

    // Log the full response to check if the data is properly returned
    console.log("API Response:", response.data);

    // Check if the API response contains a valid 'link'
    if (!response.data || !response.data.link) {
      throw new Error("No valid image URL received from the API. Response: " + JSON.stringify(response.data));
    }

    // Return the image URL in the response
    return NextResponse.json({ imageUrl: response.data.link });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Image generation error:", error);

    // Determine the error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred while generating the image";

    // Return an error response with status 500 or custom status if Axios error
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof axios.AxiosError ? error.response?.status || 500 : 500 }
    );
  }
}
