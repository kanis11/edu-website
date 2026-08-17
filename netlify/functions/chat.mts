export default async (req: Request) => {
  let message = ''
  try {
    const body = await req.json()
    message = typeof body?.message === 'string' ? body.message.trim() : ''
  } catch {
    message = ''
  }

  if (!message) {
    return Response.json(
      { status: 'error', reply: 'Please enter a valid message.' },
      { status: 400 },
    )
  }

  return Response.json({
    status: 'success',
    reply: `Academic Advisor: Received your inquiry regarding '${message}'.`,
  })
}

export const config = {
  path: '/api/chat',
  method: 'POST',
}
