import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(request) {
  try {
    // Get ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    console.log('Processing PATCH request for ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing ID parameter' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select()
      .eq('id', id)
      .single();

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: `API key not found with ID: ${id}`,
          error: 'KEY_NOT_FOUND'
        }, 
        { status: 404 }
      );
    }

    const updates = {
      name: body.name || existingKey.name,
      usage_limit: body.usage_limit,
      updated_at: new Date().toISOString()
    };

    const { data: updatedKey, error: updateError } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedKey,
      message: 'API key updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update API key',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Get ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    console.log('Processing DELETE request for ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing ID parameter' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'API key deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete API key' },
      { status: 500 }
    );
  }
} 