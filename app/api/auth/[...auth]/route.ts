import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "https://tta-kha7.onrender.com"

export async function POST(request: NextRequest, { params }: { params: { auth: string[] } }) {
  const authPath = params.auth.join("/")
  const url = `${API_BASE_URL}/api/auth/${authPath}`

  try {
    const body = await request.json()

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Error in auth/${authPath}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { auth: string[] } }) {
  const authPath = params.auth.join("/")
  const url = `${API_BASE_URL}/api/auth/${authPath}`

  try {
    const token = request.headers.get("Authorization")

    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = token
    }

    const response = await fetch(url, { headers })
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Error in auth/${authPath}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
