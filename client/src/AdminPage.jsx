import { useEffect, useState } from 'react';

//const API_URL = 'https://all-night-challenges-production.up.railway.app';
const API_URL = 'http://all-night-challenges.essat-gabes.com:5000';

function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);

  const ADMIN_PASSWORD = 'ANC2026admin!';

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/registrations`);
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data ❌');
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
    } else {
      alert('Wrong password ❌');
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  const formatDateTime = (value) => {
    if (!value) return '-';

    const normalized = value.includes('T')
      ? value
      : value.replace(' ', 'T');

    const date = new Date(normalized + 'Z');

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Tunis',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="rounded-xl bg-white/10 p-8 backdrop-blur">
          <h2 className="mb-4 text-xl font-bold">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full rounded p-3 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="mt-4 w-full rounded bg-cyan-400 p-3 text-black"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03040a] p-6 text-white">
      <h1 className="mb-6 text-center text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-6 flex justify-center">
        <button
          onClick={fetchData}
          className="rounded bg-cyan-400 px-4 py-2 text-black"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Team Name</th>
              <th className="p-3 text-center">Leader CIN</th>
              <th className="p-3 text-center">Idea Drive Linkik</th>
              <th className="p-3 text-center">Project Drive Link</th>
              <th className="p-3 text-center">Idea last update</th>
              <th className="p-3 text-center">project submit time</th>

              <th className="p-3 text-center">inscription time</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/10 text-center"
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.teamName || '-'}</td>
                <td className="p-3">{item.leaderCin || '-'}</td>
                <td className="p-3">
                  {item.driveLink ? (
                    <a
                      href={item.ideaDriveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-cyan-300 underline"
                    >
                      Open Drive Link
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-3">
                  {item.driveLink ? (
                    <a
                      href={item.projectDriveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-cyan-300 underline"
                    >
                      Open Drive Link
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-3">{formatDateTime(item.idea_last_updated_at)}</td>
                <td className="p-3">{formatDateTime(item.project_updated_at)}</td>
                <td className="p-3">{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;