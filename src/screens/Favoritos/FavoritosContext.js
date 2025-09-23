import React, { createContext, useContext, useState } from 'react';

const FavoritosContext = createContext();

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const adicionarFavorito = (produto) => {
    setFavoritos(prev => {
      const existe = prev.find(item => item.id === produto.id);
      if (!existe) {
        return [...prev, produto];
      }
      return prev;
    });
  };

  const removerFavorito = (id) => {
    setFavoritos(prev => prev.filter(item => item.id !== id));
  };

  const isFavorito = (id) => {
    return favoritos.some(item => item.id === id);
  };

  const limparFavoritos = () => {
    setFavoritos([]);
  };

  return (
    <FavoritosContext.Provider value={{
      favoritos,
      adicionarFavorito,
      removerFavorito,
      isFavorito,
      limparFavoritos,
      totalFavoritos: favoritos.length
    }}>
      {children}
    </FavoritosContext.Provider>
  );
};