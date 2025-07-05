'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  matricula: number | null;
  setMatricula: (matricula: number) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  matricula: null,
  setMatricula: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [matricula, setMatriculaState] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('matricula');
    if (stored) setMatriculaState(parseInt(stored));
  }, []);

  const setMatricula = (matricula: number) => {
    setMatriculaState(matricula);
    localStorage.setItem('matricula', matricula.toString());
  };

  const logout = () => {
    setMatriculaState(null);
    localStorage.removeItem('matricula');
  };

  return (
    <UserContext.Provider value={{ matricula, setMatricula, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
