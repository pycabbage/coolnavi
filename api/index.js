// @ts-check

const express = require("express");
const app = express();

app.get('/', (req, res) => {
    const API_KEY = 'AIzaSyA_zlu8mk7oIDv5Vt7QFNyrhv0FSxCuaZM'
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.lat1},${req.query.lng1}&destination=${req.query.lat2},${req.query.lng2}&key=${API_KEY}&mode=walking`
    fetch(url, {
        mode: 'cors'
    })
        .then((data) => {
            return data.json()
        }).then((json)=>{
            // console.log(json.routes[0].legs)
            res.json(json.routes[0].legs)
        })
        .catch((error) => {
            console.error(error)
        })
    // console.log("fkjslkdfjl")
})

module.exports = {
    path: "/api/",
    handler: app
};