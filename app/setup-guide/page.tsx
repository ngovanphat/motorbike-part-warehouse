export default function SetupGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Step-by-Step Google Sheets Setup Guide</h1>

      <div className="prose max-w-none">
        <h2>1. Create a New Google Spreadsheet</h2>
        <ol>
          <li>
            Go to{" "}
            <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer">
              Google Sheets
            </a>
          </li>
          <li>Click on the "+" icon to create a new spreadsheet</li>
          <li>Rename the spreadsheet to something like "E-Commerce Products"</li>
        </ol>

        <h2>2. Set Up the Products Sheet</h2>
        <ol>
          <li>Rename "Sheet1" to "Products" by right-clicking on the tab at the bottom and selecting "Rename"</li>
          <li>
            Add the following headers in row 1:
            <ul>
              <li>A1: ID</li>
              <li>B1: Name</li>
              <li>C1: Description</li>
              <li>D1: Price</li>
              <li>E1: Stock</li>
              <li>F1: Image</li>
            </ul>
          </li>
          <li>
            Add some sample product data starting from row 2. For example:
            <table className="border-collapse border border-gray-300 my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Price</th>
                  <th className="border border-gray-300 p-2">Stock</th>
                  <th className="border border-gray-300 p-2">Image</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">1</td>
                  <td className="border border-gray-300 p-2">Test Product</td>
                  <td className="border border-gray-300 p-2">This is a test product</td>
                  <td className="border border-gray-300 p-2">19.99</td>
                  <td className="border border-gray-300 p-2">10</td>
                  <td className="border border-gray-300 p-2">/placeholder.svg?height=400&width=400</td>
                </tr>
              </tbody>
            </table>
          </li>
        </ol>

        <h2>3. Make the Spreadsheet Public</h2>
        <ol>
          <li>Click the "Share" button in the top-right corner</li>
          <li>Click "Change to anyone with the link"</li>
          <li>Make sure "Viewer" is selected</li>
          <li>Click "Done"</li>
        </ol>

        <h2>4. Get the Spreadsheet ID</h2>
        <ol>
          <li>
            Look at the URL of your spreadsheet. It should look like:
            <pre className="bg-gray-100 p-2 rounded-md my-2">
              https://docs.google.com/spreadsheets/d/<strong>1a2b3c4d5e6f7g8h9i0j</strong>/edit#gid=0
            </pre>
          </li>
          <li>The part highlighted in bold is your Spreadsheet ID</li>
          <li>Copy this ID</li>
        </ol>

        <h2>5. Set Up Google Cloud Project</h2>
        <ol>
          <li>
            Go to the{" "}
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
              Google Cloud Console
            </a>
          </li>
          <li>Create a new project or select an existing one</li>
          <li>Navigate to "APIs & Services" &gt; "Library"</li>
          <li>Search for "Google Sheets API" and enable it</li>
          <li>Go to "APIs & Services" &gt; "Credentials"</li>
          <li>Click "Create Credentials" and select "API Key"</li>
          <li>Copy your new API key</li>
        </ol>

        <h2>6. Test Your Setup</h2>
        <ol>
          <li>Go back to your application</li>
          <li>
            Use the Sheets Debugger to test your connection:
            <ul>
              <li>Enter your Spreadsheet ID</li>
              <li>Enter your API Key</li>
              <li>Set the Sheet Name to "Products"</li>
              <li>Set the Range to "A1:F100"</li>
              <li>Click "Test Metadata" to verify your spreadsheet is accessible</li>
              <li>Click "Test Sheet Data" to verify your data can be retrieved</li>
            </ul>
          </li>
        </ol>

        <h2>6.5. Environment Variables Setup</h2>
        <ol>
          <li>In your Vercel project, go to Settings > Environment Variables</li>
          <li>
            Add the following environment variables:
            <ul>
              <li>
                <code>GOOGLE_API_KEY</code> - Your Google API Key (without NEXT_PUBLIC prefix)
              </li>
              <li>
                <code>NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID</code> - Your Spreadsheet ID
              </li>
            </ul>
          </li>
          <li>Make sure to deploy your project after adding these variables</li>
        </ol>

        <h2>7. Common Issues and Solutions</h2>

        <h3>Issue: "Sheet not found" error</h3>
        <ul>
          <li>Make sure the sheet name is exactly "Products" (case-sensitive)</li>
          <li>If your sheet has a different name, update the "Sheet Name" field in the debugger</li>
        </ul>

        <h3>Issue: "Invalid API key" error</h3>
        <ul>
          <li>Verify that you've copied the entire API key correctly</li>
          <li>Make sure the Google Sheets API is enabled for your project</li>
          <li>Check if your API key has any restrictions that might be blocking access</li>
        </ul>

        <h3>Issue: "Access denied" error</h3>
        <ul>
          <li>Make sure your spreadsheet is shared with "Anyone with the link" as a Viewer</li>
          <li>Try creating a new spreadsheet and setting the permissions again</li>
        </ul>

        <h3>Issue: No data appears</h3>
        <ul>
          <li>Check that your data starts from row 2 (with headers in row 1)</li>
          <li>Verify that your columns match the expected format (ID, Name, Description, Price, Stock, Image)</li>
          <li>Make sure the range (A1:F100) covers all your data</li>
        </ul>
      </div>
    </div>
  )
}
