<H2>Codeigniter - Migrations</H2>

These guides explain how you can use some operations of Google Sheets API directly from your website. Here, I try to show you a demonstration of reading, writing, and clearing the row of sheets. (Please visit `https://developers.google.com/sheets/api/quickstart/nodejs` to see more information)


## Installation

Please see the `migrations section <http://localhost/_Project/HJM_Logistic3/user_guide/libraries/migration.html>`_
of the CodeIgniter User Guide.

1. Turn on `Google Sheets API`:

   ```
<ol>
<li>Select <strong>+ Create a new project</strong>.</li>
<li>Enter the name &quot;Google Sheets API Quickstart&quot;.</li>
<li>Download the configuration file.</li>
<li>Move the downloaded file to your working directory and rename it &quot;client_secret.json&quot;.</li>
</ol>
   ```

2. Install the client library on your terminal:

   ```
   ~/Documents/Googlesheet_API/npm install googleapis@27 --save
   ```

3. Create `index.js` to read, write, and clear process. You can copy mine.

   ```
   
   ```

5. Run the server on your terminal

   ```
   ~/Documents/Googlesheet_API/node index
   ```

6. Get and store your token credential:

   ```
<ol>
<li><p>Browse to the provided URL in your web browser.
<p>If you are not already logged into your Google account, you will be prompted to log in.  If you are logged into multiple Google accounts, you will be asked to select one account to use for the authorization.</li>
<li>Click the <strong>Accept</strong> button.</li>
<li>Copy the code given, paste it into the command-line prompt, and press <strong>Enter</strong>.</li>
</ol>
   ```

7. Open `http://localhost:1337/` on your browser.