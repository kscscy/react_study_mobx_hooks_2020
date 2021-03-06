import React, { useState } from "react";
import { useLocalStore, useObserver } from "mobx-react";

const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    // should return object
    bugs: ["CENtipede"],
    addBug: (bug) => {
      store.bugs.push(bug);
      // state in mobx is mutable, you can just change it?
    },
    // computed or readonly ...
    get bugsCount() {
      return store.bugs.length;
    }
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const BugsHeader = () => {
  const store = React.useContext(StoreContext);

  // observer hook 을 이용해서 store 값이 변하는 것을 확인
  return  useObserver(() => (
    <h1>{store.bugsCount} Bugs!</h1>
    // store.bugsCount() 로 할 필요 없다.
  ));
}

const BugsList = () => {
  // access store context
  const store = React.useContext(StoreContext);

  // 여기를 observer 로 감싼다.
  return useObserver(() => (
    <ul>
      {store.bugs.map((bug) => (
        <li key={bug}>{bug}</li>
      ))}
    </ul>
  ));
};

const BugsForm = () => {
  const store = React.useContext(StoreContext);
  const [bug, setBug] = useState("");
  return (
    <form
      onSubmit={(e) => {
        store.addBug(bug)
        setBug("")
        e.preventDefault();
      }}
    >
      <input
        type="text"
        value={bug}
        onChange={(e) => {
          setBug(e.target.value);
        }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <main>
        <BugsHeader />
        <BugsList />
        <BugsForm />
      </main>
    </StoreProvider>
  );
}
