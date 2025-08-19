import { memo } from 'react';
import Users from './components/Users/index';

const App = () => {
  return (
    <div className="App">
      <Users/>
    </div>
  );
};

export default memo(App);