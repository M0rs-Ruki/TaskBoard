
import path from "path";
import fs from "fs";
import express from "express";
import { log } from "console";
const app =  express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(process.cwd(), "public")));

const port = 3000;


app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render('index', {files: files});
    })
})

app.get('/files/:title', (req, res) => {
    fs.readFile(`./files/${req.params.title}`, 'utf-8', (err, fileData) => {
        res.render('show',{
            title: req.params.title,
            task_details: fileData,
        })
    })
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.task_details, (err) => {
        res.redirect('/');
    })
})

app.listen(port, () => {
    console.log(`This website is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});