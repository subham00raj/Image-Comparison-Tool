
import { GoogleGenAI, Type } from "@google/genai";
import { BoundingBox } from '../types';

export async function getImageDifferences(
  originalImageData: string,
  originalMimeType: string,
  changedImageData: string,
  changedMimeType: string
): Promise<BoundingBox[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    Analyze the two images provided. The first is the "original" and the second is the "changed" version.
    Your task is to identify all significant differences between them. These differences could be added objects, removed objects, or modified objects.
    For each difference you find, provide its location as a bounding box and a brief label describing the change.
    Return the result as a JSON object that strictly adheres to the provided schema. The output should be an array of objects, where each object contains 'x', 'y', 'width', 'height', and 'label' for a detected difference.
    If there are no differences, return an empty array.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: originalImageData,
            mimeType: originalMimeType,
          },
        },
        {
          inlineData: {
            data: changedImageData,
            mimeType: changedMimeType,
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.INTEGER, description: "The x-coordinate of the top-left corner of the bounding box." },
            y: { type: Type.INTEGER, description: "The y-coordinate of the top-left corner of the bounding box." },
            width: { type: Type.INTEGER, description: "The width of the bounding box." },
            height: { type: Type.INTEGER, description: "The height of the bounding box." },
            label: { type: Type.STRING, description: "A brief description of the difference." },
          },
          required: ["x", "y", "width", "height", "label"],
        },
      },
    },
  });

  const text = response.text.trim();
  if (!text) {
    return [];
  }

  try {
    const parsedJson = JSON.parse(text);
    return parsedJson as BoundingBox[];
  } catch (error) {
    console.error("Failed to parse JSON from Gemini response:", text);
    throw new Error("Invalid JSON response from the API.");
  }
}
