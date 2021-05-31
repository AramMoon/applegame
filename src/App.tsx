import { Button } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import MLView from './view/MLView';
import ScreenView from './view/ScreenView';

function App() {
  const [solveMode, setsolveMode] = useState(true)

  return (
    <div >
      <Button variant="outlined" color="primary" onClick={()=>setsolveMode(!solveMode)}>{solveMode ? "Solve": "Learn"}</Button>
      {solveMode ? <ScreenView /> : <MLView /> }
    </div>
  );
}

export default App;
