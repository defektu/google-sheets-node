const express = require("express");
require("dotenv").config();
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

const app = express();
// app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json({ extended: false }));

app.get("/", function (request, response) {
  response.sendFile("/index.html");
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
    // res.status(418).send("need id");
    res.redirect("/error.html");
    return;
  }

  if (email == "undefined" || email == "") {
    // res.status(418).send("need email");
    res.redirect("/error.html");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    // keyFile: CREDS,
    credentials: credentials,
    scopes:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const googleDrive = google.drive({ version: "v3", auth: client });
  const fileData = await googleDrive.files.list({
    q: "name='" + id + ".mov'",
  });

  let fileUrl;
  if (fileData.data.files[0]?.id) {
    fileUrl = "https://drive.google.com/file/d/" + fileData.data.files[0].id;
  } else {
    fileUrl =
      "https://drive.google.com/drive/folders/1-1OWG1x5NHCCyYQVQC9Es-iv6DxR3oNI?usp=sharing";
  }

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[id, email, name, fileUrl]],
    },
  });
  return res.redirect("/success.html");
});

app.listen(3000, () => console.log("running on 3000"));
