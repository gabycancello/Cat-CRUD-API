import React, { useState, useEffect } from "react";
import "./CatForm.css";

const CatForm = ({ onSubmitCat, initialData = {}, isEditMode = false }) => {
  const [name, setName] = useState(initialData.name || "");
  const [age, setAge] = useState(initialData.age || "");
  const [image, setImage] = useState(initialData.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cat = { id: initialData.id, name, age, image };
    onSubmitCat(cat);

    if (!isEditMode) {
    setName("");
    setAge("");
    setImage("");
    }
  };

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name || "");
      setAge(initialData.age || "");
      setImage(initialData.image || "");
    }
  }, [isEditMode, initialData]);

  return (
    <form className="cat-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do gato"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Idade"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL da imagem (opcional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button type="submit">{isEditMode ? "Atualizar Gato" : "Adicionar Gato"}</button>
    </form>
  );
};

export default CatForm;