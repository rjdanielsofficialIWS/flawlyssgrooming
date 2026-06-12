const FIELD_LIMIT = 1024

function clean(value, fallback = 'Not provided') {
  const text = String(value || '').trim()
  return (text || fallback).slice(0, FIELD_LIMIT)
}

function yesNo(value) {
  if (value === 'yes') return 'Yes'
  if (value === 'no') return 'No'
  return clean(value)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const webhookUrl = process.env.DISCORD_BOOKING_WEBHOOK_URL
  if (!webhookUrl) {
    return response.status(503).json({ error: 'Discord notifications are not configured.' })
  }

  const booking = request.body || {}
  if (!booking.name || !booking.phone || !booking.email || !booking.petName) {
    return response.status(400).json({ error: 'Required booking details are missing.' })
  }

  const animal = booking.animal === 'Other' && booking.otherAnimal
    ? `Other: ${clean(booking.otherAnimal)}`
    : clean(booking.animal)

  const discordResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'FlawLyss Booking Alerts',
      allowed_mentions: { parse: [] },
      embeds: [{
        title: 'New appointment request',
        color: 15577725,
        timestamp: new Date().toISOString(),
        fields: [
          { name: 'Client', value: clean(booking.name), inline: true },
          { name: 'Pet', value: clean(booking.petName), inline: true },
          { name: 'Animal', value: animal, inline: true },
          { name: 'Service', value: clean(booking.service), inline: false },
          { name: 'Preferred date', value: clean(booking.date), inline: true },
          { name: 'Preferred time', value: clean(booking.time), inline: true },
          { name: 'Phone', value: clean(booking.phone), inline: true },
          { name: 'Email', value: clean(booking.email), inline: true },
          { name: 'Recent surgery or care', value: yesNo(booking.recentCare), inline: true },
          { name: 'Allergies or medical conditions', value: yesNo(booking.conditions), inline: true },
          { name: 'Special instructions', value: clean(booking.notes, 'None'), inline: false },
        ],
        footer: { text: 'FlawLyss Grooming website' },
      }],
    }),
  })

  if (!discordResponse.ok) {
    const message = await discordResponse.text().catch(() => '')
    console.error('Discord booking notification failed:', discordResponse.status, message)
    return response.status(502).json({ error: 'Discord notification failed.' })
  }

  return response.status(204).end()
}
