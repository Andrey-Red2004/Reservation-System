// src/App.tsx (ejemplo sencillo)
import BookingsPage from './pages/BookingsPage';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  return (
    <>
      <DarkModeToggle />
      <BookingsPage />
    </>
  );
}
export default App;