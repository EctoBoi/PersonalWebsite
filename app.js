"use strict";

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("public"));
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.use("/EmoticonRumble", express.static("projects/EmoticonRumble/public"));
app.route("/EmoticonRumble").get(function (req, res) {
    res.sendFile(process.cwd() + "/projects/EmoticonRumble/views/index.html");
});

app.use("/OatSoup", express.static("projects/OatSoup/public"));
app.route("/OatSoup").get(function (req, res) {
    res.sendFile(process.cwd() + "/projects/OatSoup/views/index.html");
});

app.use("/Snakish", express.static("projects/Snakish/public"));
app.route("/Snakish").get(function (req, res) {
    res.sendFile(process.cwd() + "/projects/Snakish/views/index.html");
});

app.use("/MapGen", express.static("projects/MapGen/public"));
app.route("/MapGen").get(function (req, res) {
    res.sendFile(process.cwd() + "/projects/MapGen/views/index.html");
});

app.use("/SignMaker", express.static("projects/SignMaker/public"));
app.route("/SignMaker").get(function (req, res) {
    res.sendFile(process.cwd() + "/projects/SignMaker/views/index.html");
});

app.use(function (req, res, next) {
    res.status(404).type("text").send("Not Found");
});

const listener = app.listen(port, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
