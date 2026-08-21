import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import ImportWizardShell from '../layout/ImportWizardShell'

export default function ImportCheckingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/pripravna/import/vysledek'), 1800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <ImportWizardShell
      step={2}
      onBack={() => navigate('/pripravna/import')}
      onContinue={() => navigate('/pripravna/import/vysledek')}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', maxWidth: 472, textAlign: 'center' }}>
          <CircularProgress size={64} thickness={2.5} />
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
            Kontroluji úplnost dat...
          </Typography>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontSize: 18 }}>
            Zjišťujeme, zda osobám nechybí údaje nutné pro objednání průkazu.
          </Typography>
        </Box>
      </Box>
    </ImportWizardShell>
  )
}
