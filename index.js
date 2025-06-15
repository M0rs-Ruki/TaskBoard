
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
        const txtFiles = files.filter(file => path.extname(file) === '.txt');

        // Dummy logic to simulate completed/pending
        // Let's say files with "done" in name are completed
        const completed = txtFiles.filter(file => file.toLowerCase().includes('done')).length;
        const totalTasks = txtFiles.length;
        const pending = totalTasks - completed;
        const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

        res.render('index', {
            files: txtFiles,
            totalTasks,
            completed,
            pending,
            completionRate
        });
    });
});


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