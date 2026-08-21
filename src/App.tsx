import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FlowProvider } from './data/flowState'
import LoginPage from './pages/LoginPage'
import PripravnaDataPage from './pages/PripravnaDataPage'
import ImportChoicePage from './pages/ImportChoicePage'
import ImportCheckingPage from './pages/ImportCheckingPage'
import ImportResultPage from './pages/ImportResultPage'
import ImportUploadingPage from './pages/ImportUploadingPage'
import ImportUploadedPage from './pages/ImportUploadedPage'
import PridatOsobyPage from './pages/PridatOsobyPage'
import PersonDetailPage from './pages/PersonDetailPage'
import SberPodkladuPage from './pages/SberPodkladuPage'
import NewCampaignWizard from './pages/NewCampaignWizard'
import ObjednavkaWizard from './pages/ObjednavkaWizard'
import ObjednavkyPage from './pages/ObjednavkyPage'
import OrderDetailPage from './pages/OrderDetailPage'
import SpravaPrukazuPage from './pages/SpravaPrukazuPage'

function App() {
  return (
    <FlowProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pripravna" element={<PripravnaDataPage />} />
          <Route path="/pripravna/osoba/:id" element={<PersonDetailPage />} />
          <Route path="/pripravna/import" element={<ImportChoicePage />} />
          <Route path="/pripravna/import/nahravani" element={<ImportUploadingPage />} />
          <Route path="/pripravna/import/nahrano" element={<ImportUploadedPage />} />
          <Route path="/pripravna/import/kontrola" element={<ImportCheckingPage />} />
          <Route path="/pripravna/import/vysledek" element={<ImportResultPage />} />
          <Route path="/pripravna/pridat-osoby" element={<PridatOsobyPage />} />
          <Route path="/pripravna/sber-podkladu" element={<SberPodkladuPage />} />
          <Route path="/pripravna/sber-podkladu/novy" element={<NewCampaignWizard />} />
          <Route path="/pripravna/objednat" element={<ObjednavkaWizard />} />
          <Route path="/objednavky" element={<ObjednavkyPage />} />
          <Route path="/objednavky/:id" element={<OrderDetailPage />} />
          <Route path="/sprava-prukazu" element={<SpravaPrukazuPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </FlowProvider>
  )
}

export default App
