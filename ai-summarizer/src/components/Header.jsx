const Header = ({ title, user, onLogout }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user.name || user.email}
            </span>
            <button
              onClick={onLogout}
              className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;