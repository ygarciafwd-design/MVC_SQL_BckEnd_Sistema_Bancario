import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../Components/Layout';
import HomePage from '../Pages/Homepage/HomePage';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path='login' element={<LoginPage />} />
                    <Route path='register' element={<RegisterPage />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routing;