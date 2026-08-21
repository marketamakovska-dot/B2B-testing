import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import AppShell, { type SidebarKey } from './AppShell'
import { tokens } from '../theme/theme'

export type WizardStep = { label: string; state: 'active' | 'done' | 'todo' }

// Generic version of ImportWizardShell that supports an arbitrary list of
// steps, so it can power the campaign-creation and ordering wizards too.
export default function WizardShell({
  active,
  title,
  steps,
  children,
  onBack,
  onContinue,
  continueLabel = 'Pokračovat',
  continueDisabled = false,
  backLabel = 'Zpět',
}: {
  active: SidebarKey
  title: ReactNode
  steps: WizardStep[]
  children: ReactNode
  onBack: () => void
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  backLabel?: string
}) {
  return (
    <AppShell active={active}>
      <Box sx={{ display: 'flex', minHeight: '100%' }}>
        <Box sx={{ bgcolor: tokens.panelBg, width: 306, flexShrink: 0, px: '60px', py: '80px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32, mb: '62px' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {steps.map((step, i) => (
              <StepIndicator key={step.label} index={i + 1} label={step.label} state={step.state} />
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ flex: 1, px: '60px', py: '48px', overflowX: 'auto' }}>{children}</Box>
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
            <Button variant="outlined" onClick={onBack}>
              {backLabel}
            </Button>
            <Button variant="contained" onClick={onContinue} disabled={continueDisabled}>
              {continueLabel}
            </Button>
          </Box>
        </Box>
      </Box>
    </AppShell>
  )
}

function StepIndicator({ index, label, state }: { index: number; label: string; state: 'active' | 'done' | 'todo' }) {
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
          flexShrink: 0,
        }}
      >
        {state === 'done' ? <CheckIcon sx={{ fontSize: 16 }} /> : index}
      </Box>
      <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontSize: 14, fontWeight: state === 'active' ? 700 : 400 }}>
        {label}
      </Typography>
    </Box>
  )
}
