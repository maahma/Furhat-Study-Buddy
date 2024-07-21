import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const DeadlinesContext = createContext();

// Define Reducer
export const deadlinesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DEADLINES':
      return { 
        deadlines: action.payload 
      };
    case 'CREATE_DEADLINE':
      return { 
        deadlines: [action.payload, ...state.deadlines] 
      };
    case 'DELETE_DEADLINE':
      return { 
        deadlines: state.deadlines.filter(deadlineItem => deadlineItem._id !== action.payload)
      };
    case 'UPDATE_DEADLINE':
      return {
        deadlines: state.deadlines.map(deadlineItem => 
          deadlineItem._id === action.payload._id ? action.payload : deadlineItem
        )
      };
    default:
      return state;
  }
};

// Create Provider
export const DeadlinesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deadlinesReducer, { 
    deadlines: [] 
  });

  const fetchDeadlines = async () => {
    try {
      const response = await axios.get('http://localhost:6005/api/deadlines', { withCredentials: true });
      dispatch({ type: 'SET_DEADLINES', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch deadlines:', error);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  return (
    <DeadlinesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DeadlinesContext.Provider>
  );
};