import React, { useState, useEffect } from "react";

function Cats() {
  const [cats, setCats] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: "", age: "", breed: "" });
  const [editingCat, setEditingCat] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/cats")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCats(data);
        } else {
          console.error("Formato de dados inesperado:", data);
          setCats([]); // Evita erro ao renderizar
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar gatos:", error);
        setLoading(false);
      });
  }, [refresh]);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  // Função para atualizar os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCat({ 
      ...newCat, 
      [name]: name === "age" ? Number(value) : value,
  });
};

  // Função para enviar o novo gato para a API
  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch("http://localhost:4000/cats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    })
      .then((response) => response.json())
      .then((data) => {
        setCats((prevCats) => [...prevCats, data]); // Correção aqui
        setNewCat({ name: "", age: "", breed: "" }); // Limpa o formulário
      })
      .catch((error) => console.error("Erro ao adicionar gato:", error));
    triggerRefresh();
  };
  
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/cats/${id}`, { method: "DELETE" })
      .then(() => {
        setCats((prevCats) => prevCats.filter((cat) => cat.id !== id)); // Correção aqui
      })
      .catch((error) => console.error("Erro ao deletar gato:", error));
    triggerRefresh();
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    triggerRefresh();
  
    fetch(`http://localhost:4000/cats/${editingCat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    })
      .then((response) => response.json())
      .then((updatedCat) => {
        setCats((prevCats) =>
          prevCats.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
        ); // Correção aqui
        setEditingCat(null);
        setNewCat({ name: "", age: "", breed: "" });
      });
  };

  return (
    <div>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {Array.isArray(cats) && cats.length > 0 ? (
           cats.map(cat => (
            <li key={cat.id}>
              <strong>{cat.name}</strong> ({cat.breed}) - {cat.age} anos
              <button className="edit" onClick={() => handleEdit(cat)}>✏️</button>
              <button className="delete" onClick={() => handleDelete(cat.id)}>🗑️</button>
            </li>
          ))
        )  :  (
          <p>Nenhum gato encontrado.</p>
        )}
        </ul>
      )}

      {/* Formulário Único para Adicionar e Editar */}
      <h2>{editingCat ? "✏️ Editar Gato" : "➕ Adicionar um Gato"}</h2>
      <form onSubmit={editingCat ? handleUpdate : handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={newCat.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Idade"
          value={newCat.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="breed"
          placeholder="Raça"
          value={newCat.breed}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingCat ? "Atualizar" : "Adicionar"}</button>
        {editingCat && <button type="button" onClick={() => setEditingCat(null)}>Cancelar</button>}
      </form>
    </div>
  );
}

export default Cats;
      


        