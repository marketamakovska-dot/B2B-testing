import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import InfoModal from './InfoModal'

const OPTIONS = [
  {
    title: 'E-mailové kampaně',
    desc: 'Pokud máte u dotyčných osob kontaktní e-maily, zašlete jim e-mail s formulářem, kde vám můžou nahrát fotku a doplnit další chybějící údaje. Správu kampaní najdete v přípravně dat.',
  },
  {
    title: 'Chytré formuláře',
    desc: 'Chcete data sbírat klasickou cestou? Vytiskněte každé osobě papírový formulář, který vyplní a podepíšou. Tyto formuláře mají navíc unikátní QR kód, díky kterému mohou osoby nahrát fotku a ostatní údaje online, a vám tak ušetřit papírování. Tisk formulářů najdete v přípravně dat.',
  },
]

export default function ZefektivnitModal({
  open,
  onClose,
  readyCount,
  missingCount,
}: {
  open: boolean
  onClose: () => void
  readyCount: number
  missingCount: number
}) {
  const [howItWorksTitle, setHowItWorksTitle] = useState<string | null>(null)

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#fff',
            width: 700,
            maxWidth: '92vw',
            p: '32px',
            outline: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '12px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 24, maxWidth: 560 }}>
              Chcete zefektivnit sběr fotek a dalších chybějících dat?
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 14, mb: '24px' }}>
            Nyní máte kompletní data u {readyCount} osob a nekompletní u {missingCount}. Níže si můžete vybrat způsob,
            jak jednoduše získat chybějící data.
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {OPTIONS.map((opt) => (
              <Box key={opt.title} sx={{ flex: 1, minWidth: 260, border: '1px solid #e6e5e7', p: '20px' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, mb: '8px' }}>{opt.title}</Typography>
                <Typography sx={{ fontSize: 13, mb: '16px' }}>{opt.desc}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayCircleOutlineIcon />}
                  onClick={() => setHowItWorksTitle(opt.title)}
                >
                  Jak to funguje?
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
      <InfoModal
        open={!!howItWorksTitle}
        onClose={() => setHowItWorksTitle(null)}
        title={howItWorksTitle ?? ''}
        description="Podívejte se, jak jednoduše získat chybějící údaje osob."
      />
    </>
  )
}
