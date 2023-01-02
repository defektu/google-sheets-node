const express = require("express");
require("dotenv").config();
const { google } = require("googleapis");

const api = require("./api/api");

const app = express();
// app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json({ extended: false }));
// app.use("/api", api);

// app.use(express.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

const CREDS = JSON.parse(process.env.CREDS || {});
const spreadsheetId = process.env.SPREADSHEET;
credentials = CREDS;

app.get("/api/users", function (req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  res.send({
    user_id: user_id,
    token: token,
    geo: geo,
  });
});

app.get("/api", async (req, res) => {
  const { name, email, id } = req.query;
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

app.post("/", async (req, res) => {
  const { name, email, id } = req.body;
  console.log("wtf");
  console.log(name, email, id);
});

app.listen(80, () => console.log("running on 80"));
