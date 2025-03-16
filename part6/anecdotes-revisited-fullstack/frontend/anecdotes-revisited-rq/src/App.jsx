import NotificationContextProvider from './components/NotificationContextProvider.jsx';
import AnecdoteList from './components/AnecdoteList.jsx';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const App = () => {
  return (
    <NotificationContextProvider>
      <div>
        <h1>Anecdote App - React Query</h1>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList />
      </div>
    </NotificationContextProvider>
  );
};

export default App;
