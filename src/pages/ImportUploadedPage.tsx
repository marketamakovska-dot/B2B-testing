import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ChecklistIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import ImportWizardShell from '../layout/ImportWizardShell'

export default function ImportUploadedPage() {
  const navigate = useNavigate()

  return (
    <ImportWizardShell
      step={1}
      onBack={() => navigate('/pripravna/import')}
      onContinue={() => navigate('/pripravna/import/kontrola')}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#f1f1f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChecklistIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 24 }}>
            Data úspěšně nahrána.
          </Typography>
          <Typography sx={{ fontSize: 16 }}>
            Celkem nahráno <b>25 osob</b>
          </Typography>
        </Box>
      </Box>
    </ImportWizardShell>
  )
}
