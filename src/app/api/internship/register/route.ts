import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, year, college, internshipDuration, courses, areaOfInterest } = body;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Internship Application <onboarding@resend.dev>', 
      to: ['hr@vmkedgemindsolutions.com'],
      subject: `New Internship Application: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">New Internship Registration</h2>
          
          <div style="margin-top: 20px;">
            <p><strong>Candidate Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>College:</strong> ${college}</p>
            <p><strong>Year:</strong> ${year}</p>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4b5563;">Internship Details</h3>
            <p><strong>Duration:</strong> ${internshipDuration.replace('_', ' ')}</p>
            <p><strong>Selected Courses:</strong></p>
            <ul>
              ${courses.map((c: string) => `<li>${c}</li>`).join('')}
            </ul>
             ${areaOfInterest ? `<p><strong>Area of Interest:</strong> ${areaOfInterest}</p>` : ''}
          </div>

          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
            Sent from VMK Edgemind Solutions Website
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
