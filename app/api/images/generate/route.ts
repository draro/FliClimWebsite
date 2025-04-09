import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, high-quality image related to ${topic} in the context of aviation and weather technology. The image should be suitable for a business website or blog post.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL received from OpenAI');
    }

    return NextResponse.json({ 
      imageUrl: response.data[0].url 
    });
  } catch (error) {
    console.error('Failed to generate image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}