const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

const allowedOrigins = [
  "https://lks-phonebook.fly.dev",
  "http://localhost:5173",
];

app.use(express.json());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  console.log(`User is admin = ${req.admin}`);
  const date = new Date();

  Person.countDocuments({})
    .then((count) => {
      res.set("Content-Type", "text/html");
      res.send(
        `<h3>Phonebook has info for ${count} people <br/><br/> ${date.toUTCString()}</h3>`
      );
    })
    .catch(() => res.status(500).send("Error retrieving data"));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end();
      res.json(person).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(res.status(200).send({ id: id }))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const person = req.body;

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      console.log(savedPerson.name, "contact saved");
      res.json(newPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(body.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.error(err.name);

  if (err.name === "ValidationError") return res.status(400).json(err.message);

  if (err.name === "CastError")
    return res.status(400).send({ error: "malformatted id" });
  next(err);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
