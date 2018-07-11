const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');

// Use https://www.googleapis.com/auth/spreadsheets.readonly for view only
// Use 'https://www.googleapis.com/auth/spreadsheets' so everyone can edit this spreadsheet
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';

var app = express();
app.use('/assets', express.static('node_modules'));
app.get("/", function(req, res){
  fs.readFile('client_secret.json', function(err, content){
    if (err) return console.log('Error loading client secret file:', err);

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function(auth){
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        // Change this spreadsheetId using yours, and change Link sharing access by clicking SHARE > advanced (bottom right) > chanhe who has access to public
        spreadsheetId: '<CHANGE_WITH_YOURS>', 
        range: 'Sheet1!A:C',
      }, function(err, result){
        if (err) return console.log('The API returned an error: ' + err);
        const rows = result.data.values;
        var data = {'rows': []};
        if (rows.length) {
          // console.log(JSON.stringify(rows));
          data.rows = rows;
        } 
        
        res.render('view.ejs', data);
      });
    });
  });
}).listen(1337, function(){
  console.log("App is started on port 1337!");
});

app.post("/api/create", function(req, res){
  fs.readFile('client_secret.json', function(err, content){
    if (err) return console.log('Error loading client secret file:', err);

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function(auth){
      var last_id = (req.query.last_id)?parseInt(req.query.last_id):null;
      var name = (req.query.name)?req.query.name:null;
      var nim = (req.query.nim)?req.query.nim:null;
    
      if(last_id !== null && name !== null && nim !== null){
        const sheets = google.sheets({version: 'v4', auth});
        
        sheets.spreadsheets.values.append({
          spreadsheetId: '<CHANGE_WITH_YOURS>',
          range: 'Sheet1!A:C',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [
              [(last_id+1), name, nim]
            ]
          }
        }, function(err, result){
          if(err) console.log({error: true, data: err});
          else{
            if(result.data !== undefined && result.data !== null)
              res.json({error: false, data: result.data});
            else res.json({error: true, data: null});
          }
        });
      }
      else res.json({error: true, data: null});
    });
  });
});

app.post("/api/clear", function(req, res){
  fs.readFile('client_secret.json', function(err, content){
    if (err) return console.log('Error loading client secret file:', err);

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function(auth){
      var cell = (req.query.cell)?req.query.cell:null;
    
      if(cell !== null){
        const sheets = google.sheets({version: 'v4', auth});
        
        sheets.spreadsheets.values.clear({
          spreadsheetId: '<CHANGE_WITH_YOURS>',
          range: 'Sheet1!' + cell
        }, function(err, result){
          if(err) console.log({error: true, data: err});
          else{
            if(result.data !== undefined && result.data !== null)
              res.json({error: false, data: result.data});
            else res.json({error: true, data: null});
          }
        });
      }
      else res.json({error: true, data: null});
    });
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token){
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', function(code){
    rl.close();
    oAuth2Client.getToken(code, function(err, token){
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), function(err){
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}