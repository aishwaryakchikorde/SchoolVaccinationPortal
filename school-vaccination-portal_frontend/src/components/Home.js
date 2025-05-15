import { Link } from 'react-router-dom';
import { FaUserGraduate, FaFileUpload, FaChartPie, FaFileAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <h1 className="welcome-title">Welcome to Vaccination Portal</h1>
      <div className="nav-buttons">
        <Link to="/students" className="nav-btn">
          <FaUserGraduate className="nav-icon" /> Students Table
        </Link>
        <Link to="/bulk-upload" className="nav-btn">
          <FaFileUpload className="nav-icon" /> Bulk Upload
        </Link>
        <Link to="/dashboard" className="nav-btn">
          <FaChartPie className="nav-icon" /> Dashboard
        </Link>
        <Link to="/reports" className="nav-btn">
          <FaFileAlt className="nav-icon" /> Reports
        </Link>
      </div>
    </div>
  );
};

export default Home;
