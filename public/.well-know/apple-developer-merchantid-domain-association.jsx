import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
    const file = readFileSync(join(process.cwd(), 'public/.well-known/apple-developer-merchantid-domain-association'))
    return new Response(file, {
        headers: { 'Content-Type': 'text/plain' }
    })
}