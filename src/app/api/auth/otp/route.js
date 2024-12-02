import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Format phone number helper
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Ensure it starts with +1 for US numbers
  if (!cleaned.startsWith('1')) {
    return `+1${cleaned}`;
  }
  return `+${cleaned}`;
};

export async function POST(request) {
  try {
    const { phone, action, otp } = await request.json();
    const formattedPhone = formatPhoneNumber(phone);
    
    if (action === 'send') {
      // For development/testing, log the OTP instead of sending SMS
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Development OTP for ${formattedPhone}: ${newOtp}`);
      
      // Store OTP in Supabase with expiration
      const { error: dbError } = await supabase
        .from('phone_otps')
        .insert([
          {
            phone: formattedPhone,
            otp: newOtp,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
          },
        ]);

      if (dbError) throw dbError;

      // Only send SMS in production environment
      if (process.env.NODE_ENV === 'production') {
        try {
          await twilioClient.messages.create({
            body: `Your verification code is: ${newOtp}`,
            to: formattedPhone,
            from: process.env.TWILIO_PHONE_NUMBER,
          });
        } catch (twilioError) {
          console.error('Twilio error:', twilioError);
          // Continue anyway since we're logging the OTP
        }
      }

      return Response.json({ 
        message: 'OTP sent successfully',
        development: process.env.NODE_ENV !== 'production' ? newOtp : undefined
      });
    }

    if (action === 'verify') {
      // Verify OTP from Supabase
      const { data, error } = await supabase
        .from('phone_otps')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('otp', otp)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return Response.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Delete used OTP
      await supabase
        .from('phone_otps')
        .delete()
        .eq('phone', formattedPhone);

      return Response.json({ message: 'OTP verified successfully' });
    }

  } catch (error) {
    console.error('OTP error:', error);
    return Response.json({ 
      error: 'Failed to process OTP',
      details: error.message 
    }, { status: 500 });
  }
} 