import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
    try {
        const path = join(process.cwd(), 'public/.well-known/apple-developer-merchantid-domain-association')
        console.log('path:', path)
        const file = readFileSync(path)
        return new Response(file, {
            headers: { 'Content-Type': 'text/plain' }
        })
    } catch (error) {
        console.log('errore:', error.message)
        return new Response(error.message, { status: 500 })
    }
}