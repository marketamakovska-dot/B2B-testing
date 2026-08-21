import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import ImportWizardShell from '../layout/ImportWizardShell'

// Real prototype: after confirming the Bakaláři connection, this loading
// screen appears briefly and auto-advances to the "Data úspěšně nahrána" screen.
export default function ImportUploadingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/pripravna/import/nahrano'), 1500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <ImportWizardShell
      step={1}
      onBack={() => navigate('/pripravna/import')}
      onContinue={() => navigate('/pripravna/import/nahrano')}
      continueDisabled
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
          <CircularProgress size={64} thickness={2.5} />
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
            Nahrávám data...
          </Typography>
        </Box>
      </Box>
    </ImportWizardShell>
  )
}
