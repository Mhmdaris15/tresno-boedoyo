import { NextRequest, NextResponse } from 'next/server'

interface BatikGenerationRequest {
  prompt: string
  motif: string
  style: string
  colors: string[]
  region: string
  complexity: string
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: BatikGenerationRequest = await request.json()
    const { prompt, motif, style, colors, region, complexity } = body

    // Validate required fields
    if (!prompt || !motif || !style || !colors || !region || !complexity) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    const backendResponse = await fetch(`${backendUrl}/api/generate/batik`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ message: 'Backend error' }))
      return NextResponse.json(
        { success: false, message: errorData.message || 'Backend request failed' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Batik generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to generate batik pattern'
      },
      { status: 500 }
    )
  }
}
