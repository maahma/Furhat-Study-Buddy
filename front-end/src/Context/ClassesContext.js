import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const ClassesContext = createContext();

// Define Reducer
export const classesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLASSES':
      return { 
        classes: action.payload 
      };
    case 'CREATE_CLASS':
      return { 
        classes: [action.payload, ...state.classes] 
      };
    case 'DELETE_CLASS':
      return { 
        classes: state.classes.filter(classItem => classItem._id !== action.payload)
      };
    case 'UPDATE_CLASS':
      return {
        classes: state.classes.map(classItem => 
          classItem._id === action.payload._id ? action.payload : classItem
        )
      };
    default:
      return state;
  }
};

// Create Provider
export const ClassesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(classesReducer, { 
    classes: [] 
  });

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:6005/api/classes', { withCredentials: true });
      dispatch({ type: 'SET_CLASSES', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <ClassesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ClassesContext.Provider>
  );
};