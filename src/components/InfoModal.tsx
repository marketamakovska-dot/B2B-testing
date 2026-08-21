import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'

// Generic "how it works" style modal, matching the video-preview overlays found
// throughout the real Figma prototype (e.g. "Jak vytvářet sběr podkladů k průkazům").
export default function InfoModal({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
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
          width: 440,
          maxWidth: '90vw',
          p: '24px',
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', mb: '4px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>{title}</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {description && (
          <Typography sx={{ fontSize: 14, color: '#434168', mb: '16px' }}>{description}</Typography>
        )}
        <Box
          sx={{
            bgcolor: '#f1f1f1',
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <PlayCircleOutlineIcon sx={{ fontSize: 44, color: '#aaa' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: '#ddd' }}>
            <Box sx={{ width: '8%', height: '100%', bgcolor: '#888' }} />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
