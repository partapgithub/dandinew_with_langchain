import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

// GET handler to list all keys
export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST handler to create new key
export async function POST(request) {
  try {
    const body = await request.json();
    
    const newKey = {
      id: uuidv4(),
      name: body.name,
      key: Math.random().toString(36).substring(2) + Date.now().toString(36),
      usage_limit: body.usage_limit || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating new key:', newKey);
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create API key',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 