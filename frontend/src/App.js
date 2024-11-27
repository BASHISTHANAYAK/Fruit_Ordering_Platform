import { Provider } from "react-redux";
import PageRoute from "./Routes/pageRoute";
import { persistor, store } from "./ReduxPersist/store";
import { PersistGate } from "redux-persist/integration/react";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <div className="App">
          <PageRoute />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;

