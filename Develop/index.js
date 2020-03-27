const fs = require("fs")
const axios = require("axios")
const inquirer = require("inquirer")
const pdf = require("html-pdf")
const generateHTML = require("./generateHTML.js")

const questions = [{
    type: "input",
    name: "username",
    message: "What is your GitHub username?",
},
{
    type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["green", "blue", "pink", "red"],
}];

function init() {
    inquirer
        .prompt(questions)
        .then(function ({ username, color }) {
            const queryURL = `https://api.github.com/users/${username}`;
            const starURL = `https://api.github.com/users/${username}/starred`
            axios.get(queryURL)
                .then(function ({ data }) {
                    axios.get(starURL)
                        .then(function (res) {
                            const numStars = res.data.map(element => {
                                return element.stargazers_count;
                            });
                            data.stars = numStars.length;
                            data.color = color;
                            
                            pdf.create(generateHTML(data)).toFile('../PDF/developerProfile.pdf', function (err, res) {
                                if (err) throw (err);
                            })
                        })
                })
        })
}

init();