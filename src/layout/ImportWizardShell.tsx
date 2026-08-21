import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import AppShell from './AppShell'
import { tokens } from '../theme/theme'

// Shared chrome for the "Import dat" wizard: left step rail + bottom Zpět/Pokračovat bar.
export default function ImportWizardShell({
  step,
  children,
  onBack,
  onContinue,
  continueLabel = 'Pokračovat',
  continueDisabled = false,
  showFooter = true,
}: {
  step: 1 | 2
  children: ReactNode
  onBack: () => void
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  // The initial "Volby importu" choice screen has no Zpět/Pokračovat bar in the
  // real Figma design — picking a card's own "Importovat" button is the only
  // forward action there. Every later step in the wizard keeps the footer.
  showFooter?: boolean
}) {
  return (
    <AppShell active="pripravna">
      <Box sx={{ display: 'flex', minHeight: '100%' }}>
        <Box sx={{ bgcolor: tokens.panelBg, width: 306, flexShrink: 0, px: '60px', py: '80px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32, mb: '62px' }}>
            Import dat
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* The real prototype always shows "Volby importu" as done once you're
                past the choice screen — even the loading/confirmation screens that
                are still conceptually "step 1" show it checked, not active. */}
            <StepIndicator label="Volby importu" state="done" />
            <StepIndicator label="Kontrola dat" state={step === 2 ? 'active' : 'todo'} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ flex: 1, px: '60px', py: '48px' }}>{children}</Box>
          {showFooter && (
            <Box
              sx={{
                borderTop: '1px solid #666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '24px',
                py: '24px',
              }}
            >
              <Button
                variant="outlined"
                onClick={onBack}
              >
                Zpět
              </Button>
              <Button variant="contained" onClick={onContinue} disabled={continueDisabled}>
                {continueLabel}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </AppShell>
  )
}

function StepIndicator({ label, state }: { label: string; state: 'active' | 'done' | 'todo' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: state === 'done' ? '#fff' : 'transparent',
          fontSize: 14,
        }}
      >
        {state === 'done' ? <CheckIcon sx={{ fontSize: 16 }} /> : label === 'Volby importu' ? 1 : 2}
      </Box>
      <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontSize: 14, fontWeight: state === 'active' ? 700 : 400 }}>
        {label}
      </Typography>
    </Box>
  )
}
