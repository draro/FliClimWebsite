export const sendEmail = (subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const mailtoLink = `mailto:info@flyclim.com?subject=${encodedSubject}&body=${encodedBody}`;
  window.location.href = mailtoLink;
};

export const createPilotProgramEmail = (companyName?: string) => {
  const subject = 'Pilot Program Application';
  const body = `Hi FlyClim team,

I'm interested in joining the FlyClim Pilot Program.${companyName ? `\n\nCompany: ${companyName}` : ''}

Please send me more information about:
- Program requirements
- Integration process
- Timeline and next steps

Looking forward to hearing from you.

Best regards`;

  return { subject, body };
};