import React, { useContext } from 'react';
import { DeadlinesContext } from '../Context/DeadlinesContext';

export const useDeadlineContext = () => {
  const context = useContext(DeadlinesContext);

  if (!context) {
    throw Error('useDeadlineContext must be used inside a DeadlinesContextProvider');
  }

  return context;
};