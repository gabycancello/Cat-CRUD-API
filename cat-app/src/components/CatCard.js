import React from "react";
import "./CatCard.css"; // Importando o CSS

const CatCard = ({ cat, onDelete, onEdit }) => {
  // Certifique-se de que as propriedades estão sendo acessadas corretamente
  if (!cat) return null;

  return (
    <div className="cat-card">
      {cat.image && <img src={cat.image} alt={cat.name} className="cat-image" />}
      <h3>{cat.name}</h3>
      <p>{cat.age} anos</p>
      <button onClick={() => onEdit(cat)}>Editar</button>
      <button onClick={() => onDelete(cat.id)}>Excluir</button>
    </div>
  );
};

export default CatCard;