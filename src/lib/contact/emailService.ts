import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(key);
}

interface ContactEmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail({ name, email, subject, message }: ContactEmailParams) {
  const to = process.env.CONTACT_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com';

  await getResend().emails.send({
    from: 'AutoCap Contact Form <onboarding@resend.dev>',
    to,
    subject: `New enquiry from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

interface InvestorEmailParams {
  fullName: string;
  organisation: string;
  role: string;
  enquiryType: string;
  email: string;
  message?: string;
}

const investorRecipients: Record<string, string> = {
  Investment: process.env.INVESTOR_IR_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com',
  Partnership: process.env.INVESTOR_BIZDEV_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com',
  Media: process.env.INVESTOR_PRESS_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com',
  Other: process.env.INVESTOR_GENERAL_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com',
};

export async function sendInvestorEmail(params: InvestorEmailParams) {
  const { fullName, organisation, role, enquiryType, email, message } = params;
  const to = investorRecipients[enquiryType] ?? 'amar.smajlovic@ministryofprogramming.com';

  await getResend().emails.send({
    from: 'AutoCap Contact Form <onboarding@resend.dev>',
    to,

    subject: `[INVESTOR ENQUIRY] ${enquiryType} — ${fullName} (${organisation})`,
    html: `
      <h2>[INVESTOR ENQUIRY] ${enquiryType} Enquiry</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Organisation:</strong> ${organisation}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
    `,
  });
}

interface EntrepreneurEmailParams {
  name: string;
  workshopName: string;
  cityRegion: string;
  revenue: string;
  email: string;
  phone: string;
  message?: string;
}

export async function sendEntrepreneurEmail(params: EntrepreneurEmailParams) {
  const to = process.env.ENTREPRENEUR_EMAIL_TO ?? 'amar.smajlovic@ministryofprogramming.com';
  const { name, workshopName, cityRegion, revenue, email, phone, message } = params;

  await getResend().emails.send({
    from: 'AutoCap Contact Form <onboarding@resend.dev>',
    to,

    subject: `[ACQUISITION ENQUIRY] ${name} — ${workshopName} (${cityRegion})`,
    html: `
      <h2>[ACQUISITION ENQUIRY] New Workshop Owner Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Workshop:</strong> ${workshopName}</p>
      <p><strong>City / Region:</strong> ${cityRegion}</p>
      <p><strong>Annual Revenue:</strong> ${revenue}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
    `,
  });
}
