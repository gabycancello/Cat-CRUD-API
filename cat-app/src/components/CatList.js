import React from "react";
import CatCard from "./CatCard";
import "./CatList.css";

const CatList = ({ cats, onDelete, onEdit }) => {
  return (
    <div className="cat-list">
      {cats.length > 0 ? (
        cats.map((cat) => (
            <CatCard 
            key={cat.id} 
            cat={cat} 
            onDelete={onDelete} 
            onEdit={onEdit} 
          />
        ))
      ) : (
        <p>Nenhum gato encontrado.</p>
      )}
    </div>
  );
};

export default CatList;