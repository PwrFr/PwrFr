import { createRoot } from 'react-dom/client';
import './index.css';
import LadingPage from '@/pages/LadingPage';
import { BrowserRouter, Routes, Route } from 'react-router';
// import { Layout } from './components/layout/Layout';
import { TablePage } from './pages/Table';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/'>
                <Route index element={<LadingPage />} />
                <Route path='table' element={<TablePage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
