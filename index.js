import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Degrees of Wikipedia",
  password: "Truck123@",
  port: 5432,
});

db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let totalCorrect = 0;

// GET home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// POST a new post
app.post("/submit", async (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = await findUser(answer);
  //console.log("isCorrect: " + isCorrect);
  if (isCorrect) {
    totalCorrect++;
    //console.log("Correct");
  }
  //console.log("post" + isCorrect);
  res.render("index.ejs", {
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function findUser(name) {
  const res = await db.query("SELECT * FROM articles WHERE url = $1", [name]);
  //console.log(res.rows);
  //console.log(res.rows.length > 0);
  return res.rows.length > 0;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
