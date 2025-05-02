import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Check if the authorization header exists and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Missing or invalid authentication token' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  
  // This is a mock endpoint, so we'll just verify the token has a valid format
  // In a real app, you would validate the JWT token
  if (!token || !token.includes('.') || token.split('.').length !== 3) {
    return NextResponse.json(
      { success: false, message: 'Invalid token format' },
      { status: 401 }
    );
  }

  // Return mock user data
  return NextResponse.json({
    success: true,
    user: {
      _id: "mock-user-id-123",
      name: "Test User",
      email: "testuser@example.com",
      bio: "This is a mock user for testing purposes",
      createdAt: new Date().toISOString(),
      subscription: {
        status: "premium",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: ["unlimited_access", "premium_content"]
      },
      stats: {
        totalAnswered: 42,
        totalCorrect: 37,
        streak: 5,
        lastPlayed: new Date().toISOString(),
        badges: ["quick_learner", "perfect_score"]
      },
      preferences: {
        notifications: true,
        shareActivity: false,
        theme: "dark"
      }
    }
  });
} 