const express = require("express");

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

app.get("/api", function (req, res) {
  const user_id = req.query.id;
  const token = req.query.name;
  const geo = req.query.email;

  res.send({
    user_id: user_id,
    token: token,
    geo: geo,
  });
});

app.post("/", async (req, res) => {
  const { name, email, id } = req.body;
  console.log("wtf");
  console.log(name, email, id);
});

app.listen(8080, () => console.log("running on 8080"));
