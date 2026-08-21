import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import WizardShell, { type WizardStep } from '../layout/WizardShell'
import ImportSummaryContent from '../components/ImportSummaryContent'
import DoplnitUdajeDrawer from '../components/DoplnitUdajeDrawer'
import { useFlow } from '../data/flowState'

type Row = { id: number; jmeno: string; prijmeni: string; email: string }

export default function PridatOsobyPage() {
  const navigate = useNavigate()
  const { setPeopleImported } = useFlow()
  const [step, setStep] = useState<1 | 2>(1)
  const [rows, setRows] = useState<Row[]>([{ id: 1, jmeno: '', prijmeni: '', email: '' }])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const steps: WizardStep[] = [
    { label: 'Přidání osob', state: step === 1 ? 'active' : 'done' },
    { label: 'Shrnutí', state: step === 2 ? 'active' : 'todo' },
  ]

  const updateRow = (id: number, field: keyof Omit<Row, 'id'>, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, { id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1, jmeno: '', prijmeni: '', email: '' }])
  }

  const removeRow = (id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    else navigate('/pripravna')
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      setPeopleImported(true)
      navigate('/pripravna')
    }
  }

  const firstRow = rows[0]
  const continueDisabled = step === 1 && !(firstRow.jmeno.trim() && firstRow.prijmeni.trim() && firstRow.email.trim())

  return (
    <WizardShell
      active="pripravna"
      title="Přidat osoby"
      steps={steps}
      onBack={handleBack}
      onContinue={handleContinue}
      continueLabel={step === 2 ? 'Dokončit import' : 'Pokračovat'}
      continueDisabled={continueDisabled}
    >
      {step === 1 ? (
        <Box>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 26, textAlign: 'center', mb: '32px' }}>
            Jaké osoby chcete přidat?
          </Typography>

          <Box sx={{ border: '1px solid #000', p: '24px', maxWidth: 900, mx: 'auto', mb: '24px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: '16px' }}>Přidat osoby</Typography>
            {rows.map((row, i) => (
              <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: '12px' }}>
                <Typography sx={{ width: 20 }}>{i + 1}.</Typography>
                <TextField
                  label="Jméno *"
                  size="small"
                  fullWidth
                  value={row.jmeno}
                  onChange={(e) => updateRow(row.id, 'jmeno', e.target.value)}
                />
                <TextField
                  label="Příjmení *"
                  size="small"
                  fullWidth
                  value={row.prijmeni}
                  onChange={(e) => updateRow(row.id, 'prijmeni', e.target.value)}
                />
                <TextField
                  label="E-mail *"
                  size="small"
                  fullWidth
                  value={row.email}
                  onChange={(e) => updateRow(row.id, 'email', e.target.value)}
                />
                <Link component="button" onClick={() => setDrawerOpen(true)} sx={{ whiteSpace: 'nowrap', fontSize: 14, textDecoration: 'underline', color: '#000' }}>
                  Doplnit údaje
                </Link>
                <IconButton size="small" onClick={() => removeRow(row.id)} disabled={rows.length === 1}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={addRow} sx={{ mt: '8px' }}>
              Přidat další osobu
            </Button>
          </Box>

          <Box sx={{ bgcolor: '#f1f1f1', maxWidth: 900, mx: 'auto', p: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <InfoOutlinedIcon sx={{ fontSize: 20, mt: '2px' }} />
            <Typography sx={{ fontSize: 14 }}>
              Osoby s nekompletními daty nic neblokuje — po dokončení jim jednoduše pošlete e-mailovou kampaň nebo
              vytisknete formulář, ať si zbytek doplní sami.
            </Typography>
          </Box>
        </Box>
      ) : (
        <ImportSummaryContent title="Shrnutí" />
      )}

      <DoplnitUdajeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </WizardShell>
  )
}
