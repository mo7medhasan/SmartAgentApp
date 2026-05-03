import React from 'react';
import AppNavigator from '@navigation/index';

// ✅ App.tsx أصبح بسيطاً جداً — كل المنطق في navigation/index.tsx
const App = (): React.JSX.Element => {
  return <AppNavigator />;
};

export default App;