import { useState, useEffect } from "react";

const API_URL = "https://all-night-challenges-production.up.railway.app";

function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);

  const ADMIN_PASSWORD = "ANC2026admin!";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      fetchData();
    } else {
      alert("Wrong password ❌");
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/registrations`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur">
          <h2 className="mb-4 text-xl font-bold">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            className="p-3 w-full rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="mt-4 w-full bg-cyan-400 text-black p-3 rounded"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#03040a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      <button
        onClick={fetchData}
        className="mb-6 bg-cyan-400 text-black px-4 py-2 rounded"
      >
        Refresh
      </button>

      <div className="overflow-auto">
        <table className="w-full border border-white/10">
          <thead className="bg-white/10">
            <tr>
              <th>ID</th>
              <th>Team</th>
              <th>Leader</th>
              <th>Phone</th>
              <th>CIN</th>
              <th>Email</th>
              <th>Members</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center border-t border-white/10">
                <td>{item.id}</td>
                <td>{item.teamName}</td>
                <td>{item.leaderFullName}</td>
                <td>{item.leaderPhone}</td>
                <td>{item.leaderCin}</td>
                <td>{item.leaderEmail}</td>
                <td>
                    <div>
                    <strong>{item.member1FullName}</strong><br />
                    <span className="text-sm text-gray-400">
                        {item.member1Email}
                    </span>
                    </div>

                    <div className="mt-2">
                        <strong>{item.member2FullName}</strong><br />
                        <span className="text-sm text-gray-400">
                            {item.member2Email}
                        </span>
                    </div>
                </td>
                <td>{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;