import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const port = 3000;

// Home route
app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    const txtFiles = files.filter(file => path.extname(file) === '.txt');
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

// Task detail route
app.get('/files/:title', (req, res) => {
  fs.readFile(`./files/${req.params.title}`, 'utf-8', (err, fileData) => {
    res.render('show', {
      title: req.params.title,
      task_details: fileData,
    });
  });
});

// Create task route
app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.task_details, (err) => {
    res.redirect('/');
  });
});

// Delete task route
app.post('/files/:title/delete', (req, res) => {
  fs.unlink(`./files/${req.params.title}`, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send('Error deleting task');
    }
    res.redirect('/');
  });
});

// Edit task form
app.get('/files/:title/edit', (req, res) => {
  fs.readFile(`./files/${req.params.title}`, 'utf-8', (err, fileData) => {
    res.render('edit', {
      oldTitle: req.params.title,
      task_details: fileData
    });
  });
});

// Rename task route
app.post('/files/:title/rename', (req, res) => {
  const oldPath = `./files/${req.params.title}`;
  const newPath = `./files/${req.body.title.split(' ').join('')}.txt`;

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      return res.status(500).send('Error renaming task');
    }
    res.redirect(`/files/${req.body.title.split(' ').join('')}.txt`);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});