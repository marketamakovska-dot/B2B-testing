import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'

// Matches the Figma "Opravdu chcete smazat tuto objednávku?" confirmation
// (B2B ordering file, order detail screen — Smazat button).
export default function ConfirmDeleteOrderModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const [removeHolders, setRemoveHolders] = useState(false)

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff',
          width: 560,
          maxWidth: '90vw',
          p: '32px',
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', mb: '16px' }}>
          <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 24 }}>
            Opravdu chcete smazat tuto objednávku?
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: 16, color: '#1a1633', mb: '20px' }}>
          Tato akce je nevratná, objednávka bude trvale odstraněna.
        </Typography>
        <Box
          onClick={() => setRemoveHolders((v) => !v)}
          sx={{
            bgcolor: '#f7f7fd',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            px: '8px',
            py: '4px',
            mb: '28px',
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          <Checkbox checked={removeHolders} size="small" sx={{ p: '4px' }} />
          <Typography sx={{ fontSize: 14, color: '#1a1633' }}>
            Odstranit i držitele bez dalších objednávek či průkazů.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', alignItems: 'center' }}>
          <Button onClick={onClose} sx={{ color: '#1a1633' }}>
            Zrušit
          </Button>
          <Button variant="contained" onClick={onConfirm} sx={{ borderRadius: 0 }}>
            Smazat objednávku
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
