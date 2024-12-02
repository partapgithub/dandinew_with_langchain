import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { createSummaryChain } from './chain';

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();
    //console.log("request.headers: ", request.headers);
    console.log("NODE_ENV: ", process.env.NODE_ENV);
    const apiKey = process.env.NODE_ENV !== 'production' ? request.headers.get('x-api-key') : process.env.API_KEY
    //const apiKey = request.headers.get('x-api-key');
    // Validate that API key is provided
    if (!apiKey) {
      return Response.json({ error: 'API key is required' }, { status: 401 });
    }
    // Validate that githubUrl is provided
    if (!githubUrl) {
      return Response.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Validate API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey);

    if (error || !data || data.length === 0) {
      return Response.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // TODO: Add your GitHub repository summarization logic here
    // This is where you'll implement the actual summarization functionality
    const readmeContent = await getReadmeContent(githubUrl);
    const summary = await createSummaryChain(readmeContent);
    
    return Response.json({ 
      message: 'Successfully validated API key',
      summary
    });

  } catch (error) {
    console.error('GitHub summarizer error:', error);
    return Response.json({ 
      error: 'An error occurred while processing your request' 
    }, { status: 500 });
  }
} 
async function getReadmeContent(githubUrl) {
  try {
    // Convert github.com URL to raw content URL
    // Example: https://github.com/owner/repo -> https://raw.githubusercontent.com/owner/repo/main/README.md
    const rawUrl = githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace(/\/$/, '') // Remove trailing slash if present
      .concat('/main/README.md');

    //console.log("URLName: ",rawUrl);
    const response = await fetch(rawUrl);
    
    if (!response.ok) {
      // Try 'master' branch if 'main' fails
      const masterUrl = rawUrl.replace('/main/', '/master/');
      console.log("MasterURLName: ",masterUrl);
      const masterResponse = await fetch(masterUrl);
      
      if (!masterResponse.ok) {
        throw new Error('README.md not found in main or master branch');
      }
      
      return await masterResponse.text();
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    throw new Error('Failed to fetch README content');
  }
}




