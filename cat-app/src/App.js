import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import CatForm from "./components/CatForm";
import CatList from "./components/CatList";
import "./App.css";

// Definindo o root do modal
Modal.setAppElement("#root");

const App = () => {
  const [cats, setCats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Função para buscar os gatos da API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch("http://localhost:4000/cats");
        const data = await response.json();
        console.log("Dados recebidos:", data);
        if (Array.isArray(data)) {
          setCats(data);
        } else {
          console.error("Formato inesperado:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar gatos:", error);
      }
    };
    fetchCats();
  }, []);

  // Função para adicionar um novo gato
  const handleAddCat = async (cat) => {
    try {
      const response = await fetch("http://localhost:4000/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cat),
      });
      const newCat = await response.json();
      setCats([...cats, newCat]);
    } catch (error) {
      console.error("Erro ao adicionar gato.");
    }
  };

  // Função para excluir um gato
  const handleDeleteCat = async (id) => {
    try {
      await fetch(`http://localhost:4000/cats/${id}`, {
        method: "DELETE",
      });
      setCats(cats.filter((cat) => cat.id !== id));
    } catch (error) {
    }
  };

  // Função para abrir o modal de edição
  const handleEditCat = (cat) => {
    console.log("Editando gato:", cat);
    setEditingCat(cat);
    setIsModalOpen(true);
  };

  // Função para atualizar as informações do gato
  const handleUpdateCat = async (cat) => {
    try {
      const response = await fetch(`http://localhost:4000/cats/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cat),
      });
      const updatedCat = await response.json();
      console.log("Gato atualizado:", updatedCat);

      setCats(
        cats.map((existingCat) =>
          existingCat.id === updatedCat.id ? updatedCat : existingCat
        )
      );
      setIsModalOpen(false);
      setEditingCat(null);
    } catch (error) {
      console.error("Erro ao adicionar gato.");
    }
  };

  return (
    <div className="App">
      <h1>Cat App</h1>
      <CatForm onSubmitCat={handleAddCat} />
      <CatList cats={cats} onDelete={handleDeleteCat} onEdit={handleEditCat} />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Gato"
        className="modal"
        overlayClassName="overlay"
        style={{
          content: {
            opacity: 1,
            transition: 'opacity 0.3s ease'
          }
        }}
      >
        <h2>Editar Gato</h2>
        {editingCat && (
          <CatForm
            onSubmitCat={handleUpdateCat}
            initialData={editingCat}
            isEditMode={true}
          />
        )}
        <button onClick={() => setIsModalOpen(false)} className="close-modal">
          Fechar
        </button>
      </Modal>
    </div>
  );
};

export default App;