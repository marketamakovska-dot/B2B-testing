import type { ReactNode } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'

// A real confirm dialog (title + optional body content + Ano/Zrušit), matching
// the Figma "Opravdu chcete..." / "Hromadné přiřazení..." modals — as opposed
// to InfoModal's generic video-placeholder, which is for "how it works" style
// explainers only.
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Ano',
  cancelLabel = 'Zrušit',
  confirmDisabled = false,
  children,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
  children?: ReactNode
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff',
          width: 480,
          maxWidth: '92vw',
          p: '24px',
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', mb: '8px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 18 }}>{title}</Typography>
          <IconButton size="small" onClick={onClose} sx={{ mt: '-4px', mr: '-4px' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {description && <Typography sx={{ fontSize: 14, color: '#434168', mb: '20px' }}>{description}</Typography>}
        {children}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', mt: children ? '20px' : '4px' }}>
          <Button variant="contained" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
          <Button variant="text" onClick={onClose} sx={{ color: '#434168' }}>
            {cancelLabel}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
