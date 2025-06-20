import { ExitIcon } from "@radix-ui/react-icons";
import { Avatar } from "@radix-ui/themes";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import FavoritesPage from "./favorites/FavoitesPage";
import HomePage from "./home/HomePage";
import MovieRegister from './register/MovieRegister'
import MovieUpdate from './register/UpdateMovie'
import Login from "./users/Login";
import Register from "./users/register";
import authService from "./services/auth.service";
import ProtectedRoute from "./components/ProtectedRoute";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
      authService.logout();
      navigate("/login");
    }
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-2 fixed top-0 left-0 right-0 z-50 md:px-12 md:py-4">
      <div className="max-w-7x flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="mr-10 font-medium text-xl">Movie App</h3>
          <NavLink
            to="/"
            className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors"
          >
            <span>Home</span>
          </NavLink>
          {user && (
            <NavLink
              to="/favorites"
              className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors"
            >
              <span>Favorites</span>
            </NavLink>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Avatar
                className="!w-6 !h-6 rounded-full ring-2 ring-slate-300"
                fallback={user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              />
              {user?.name && (
                <span className="text-sm text-slate-600 font-medium">
                  {user.name}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-800 p-2 rounded-md hover:bg-slate-200 transition-colors duration-200"
              title="Logout"
            >
              <ExitIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!isAuthPage && (
        <ProtectedRoute>
          <Header />
        </ProtectedRoute>
      )}
      
      <div className="px-6 py-12 mt-8 md:mt-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/add-movie" element={<ProtectedRoute><MovieRegister /></ProtectedRoute>} />
          <Route path="/update-movie/:id" element={<ProtectedRoute><MovieUpdate /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
