require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const router = express.Router();

const CREDS = JSON.parse(process.env.CREDS || {});
const spreadsheetId = process.env.SPREADSHEET;
credentials = CREDS;

router.get("/", async (req, res) => {
  //   return res.status(200).send(req);
  const { name, email, id } = req.body;
  console.log(req.body);
  console.log(name, email, id);
  if (id == null || id == "undefined") {
    res.status(418).send("need id");
    return;
  }

  if (email == "undefined" || email == "") {
    res.status(418).send("need email");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    // keyFile: CREDS,
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  //   const spreadsheetId = "1jZuEYjohuU0UFTyfZZEtWDwnId2rL9on2s0xxE03-G4";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:C",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[id, email, name]],
    },
  });

  //   router.send("Successfully submitted! Thank you!");
  return res.status(200).send("Successfully submitted! Thank you!");
});

module.exports = router;
