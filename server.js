const express = require("express");
const fs = require("fs");
const cors= require ("cors");

const path = require("path"); // ✅ Importação do módulo path
const app = express();
const port = 4000;

const filePath = path.join(__dirname, "cat-api", "data", "cats.json"); // ✅ Caminho do arquivo padronizado

// Middleware para permitir JSON no body das requisições
app.use(express.json());
app.use(cors()); // Permitir requisições do frontend

// Rota para a página inicial
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Gatos! Adicione /cats para ver os dados.");
});

// Rota para buscar todos os gatos
app.get("/cats", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler os dados:", err);
      res.status(500).send("Erro ao ler os dados.");
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Rota para adicionar um novo gato
app.post("/cats", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler os dados:", err);
      res.status(500).send("Erro ao ler os dados.");
      return;
    }

    let cats = JSON.parse(data);
    const newCat = {
      id: cats.length + 1,
      name: req.body.name,
      age: req.body.age,
      breed: req.body.breed
    };

    cats.push(newCat);

    fs.writeFile(filePath, JSON.stringify(cats, null, 2), (err) => {
      if (err) {
        console.error("Erro ao salvar o gato:", err);
        res.status(500).send("Erro ao salvar o gato.");
        return;
      }
      res.status(201).json(newCat);
    });
  });
});

// Rota para deletar um gato pelo ID
app.delete("/cats/:id", (req, res) => {
  fs.readFile("./data/cats.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao ler os dados.");
      return;
    }

    let cats = JSON.parse(data);
    const catId = parseInt(req.params.id);
    const updatedCats = cats.filter(cat => cat.id !== catId);

    fs.writeFile("./data/cats.json", JSON.stringify(updatedCats, null, 2), (err) => {
      if (err) {
        res.status(500).send("Erro ao excluir o gato.");
        return;
      }
      res.status(200).send("Gato excluído com sucesso.");
    });
  });
});

// Rota para editar um gato pelo ID
app.put("/cats/:id", (req, res) => {
  fs.readFile("./data/cats.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao ler os dados.");
      return;
    }

    let cats = JSON.parse(data);
    const catId = parseInt(req.params.id);
    const updatedCats = cats.map(cat =>
      cat.id === catId ? { ...cat, ...req.body } : cat
    );

    fs.writeFile("./data/cats.json", JSON.stringify(updatedCats, null, 2), (err) => {
      if (err) {
        res.status(500).send("Erro ao atualizar o gato.");
        return;
      }
      res.status(200).json(updatedCats.find(cat => cat.id === catId));
    });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});