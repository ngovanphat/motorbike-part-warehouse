import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function MissingEnvVars() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Environment Variables</AlertTitle>
        <AlertDescription>
          The Google Sheets API credentials are not configured. Please set up the required environment variables.
        </AlertDescription>
      </Alert>

      <div className="prose">
        <h2>Required Environment Variables</h2>
        <p>This application requires the following environment variables to connect to Google Sheets:</p>
        <ul>
          <li>
            <code>GOOGLE_API_KEY</code> - Your Google API Key (server-side only)
          </li>
          <li>
            <code>NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID</code> - The ID of your Google Spreadsheet
          </li>
        </ul>

        <h2>How to Set Up</h2>
        <p>
          Create a <code>.env.local</code> file in the root of your project with the following content:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md">
          GOOGLE_API_KEY=your_api_key_here
          <br />
          NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
        </pre>

        <div className="flex gap-4 mt-6">
          <Link href="/env-setup">
            <Button>View Setup Guide</Button>
          </Link>
          <Link href="/setup-guide">
            <Button variant="outline">Step-by-Step Guide</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
