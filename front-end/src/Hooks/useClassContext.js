import { useContext } from 'react';
import { ClassesContext } from '../Context/ClassesContext';

export const useClassContext = () => {
  const context = useContext(ClassesContext);

  if (!context) {
    throw Error('useClassContext must be used inside an ClassesContextProvider');
  }

  return context;
};