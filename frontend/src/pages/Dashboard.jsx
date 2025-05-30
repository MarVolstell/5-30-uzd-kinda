const role = localStorage.getItem('role');
import "../styles/home/dashboard.scss";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen main-content">
      <h1 className="text-4xl font-bold mb-4 dashboard-title">Dashboard</h1>
      <p className="text-lg text-gray-700 lead">Sveiki, jūsų vartotojo duomenys ir rolė yra: {role}</p>
    </div>
  );
}

export default Dashboard;