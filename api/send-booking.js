function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({
      error: 'Email service is not configured.'
    });
  }

  try {
    const {
      name,
      email,
      phone,
      eventType,
      guestCount,
      eventDate,
      venue,
      message,
      budget
    } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Name, email and phone are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.'
      });
    }

    const htmlContent = `
      <h2>New EventifyAllure Booking Request</h2>

      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Event Type:</strong> ${escapeHtml(eventType)}</p>
      <p><strong>Guest Count:</strong> ${escapeHtml(guestCount)}</p>
      <p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>
      <p><strong>Venue / Location:</strong> ${escapeHtml(venue)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>

      <h3>Message</h3>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'EventifyAllure Bookings',
          email: 'booking@eventifyallure.co'
        },
        to: [
          {
            email: 'afinniadenike@gmail.com',
            name: 'EventifyAllure'
          }
        ],
        replyTo: {
          email,
          name
        },
        subject: `New EventifyAllure Booking Request from ${name}`,
        htmlContent
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Brevo error:', result);

      return res.status(502).json({
        error: 'Unable to send the booking request.'
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error('Booking API error:', error);

    return res.status(500).json({
      error: 'Something went wrong while sending your booking request.'
    });
  }
}