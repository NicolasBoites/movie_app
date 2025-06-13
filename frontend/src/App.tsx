import { ExitIcon } from "@radix-ui/react-icons";
import { Flex, Avatar } from "@radix-ui/themes";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import HomePage from "./home/HomePage";

function App() {
  return (
    <BrowserRouter>
      <header className="bg-white border-b border-slate-200 px-6 py-2">
        <div className="max-w-7x flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="mr-10 font-medium text-xl">Movie App</h3>
            <NavLink
              to="/"
              className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors"
            >
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/favorites"
              className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors"
            >
              <span>Favorites</span>
            </NavLink>
            {/* TODO ruta agregar  */}
          </div>

          {/* User Avatar + Logout */}
          <div className="flex items-center space-x-6">
            <Avatar
              className="!w-6 !h-6 rounded-full ring-2 ring-slate-300"
              //   src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
              fallback="A"
            />
            <NavLink
              to="/logout"
              className="text-slate-800 p-2 rounded-md hover:bg-slate-200  transition-colors duration-200"
              title="Logout"
            >
              <ExitIcon className="w-6 h-6" />
            </NavLink>
          </div>
        </div>
      </header>

      <div className="px-6 py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
