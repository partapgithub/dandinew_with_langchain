import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url, method, body } = await request.json();
    
    // Add your security checks here
    if (!url.startsWith('https://api.')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`, // Real API key stays server-side
        // Add other sensitive headers here
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 