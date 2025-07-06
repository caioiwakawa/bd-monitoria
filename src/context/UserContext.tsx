"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  matricula: number | null;
  setMatricula: (matricula: number) => void;
  tipo: string | null;
  setTipo: (tipo: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  matricula: null,
  setMatricula: () => {},
  tipo: null,
  setTipo: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [matricula, setMatriculaState] = useState<number | null>(null);
  const [tipo, setTipoState] = useState<string | null>(null);

  useEffect(() => {
    const storedMatricula = localStorage.getItem("matricula");
    const storedTipo = localStorage.getItem("tipo");
    if (storedMatricula) setMatriculaState(parseInt(storedMatricula));
    if (storedTipo) setTipoState(storedTipo);
  }, []);

  const setMatricula = (matricula: number) => {
    setMatriculaState(matricula);
    localStorage.setItem("matricula", matricula.toString());
  };

  const setTipo = (tipo: string) => {
    setTipoState(tipo);
    localStorage.setItem("tipo", tipo);
  };

  const logout = () => {
    setMatriculaState(null);
    setTipoState(null);
    localStorage.removeItem("matricula");
    localStorage.removeItem("tipo");
  };

  return (
    <UserContext.Provider
      value={{ matricula, setMatricula, tipo, setTipo, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
