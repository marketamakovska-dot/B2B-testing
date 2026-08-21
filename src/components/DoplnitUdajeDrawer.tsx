import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

// Slide-over panel matching the real "Doplnit údaje" drawer reachable from the
// per-row link on the "Přidat osoby" screen.
export default function DoplnitUdajeDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '24px', py: '20px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20 }}>Doplnit údaje</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: '24px', pb: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '8px' }}>Platba</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Checkbox size="small" sx={{ p: 0, mt: '-2px' }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Platba už dorazila</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#777', mt: '4px' }}>
              Nezaškrtnuto neznamená, že osoba nezaplatila — jen že ji zatím nikdo neoznačil jako zaplacenou.
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '12px' }}>Osobní údaje</Typography>
            <Box sx={{ display: 'flex', gap: '12px', mb: '12px' }}>
              <TextField label="Jméno *" size="small" fullWidth />
              <TextField label="Příjmení *" size="small" fullWidth />
            </Box>
            <TextField label="Email *" size="small" fullWidth sx={{ mb: '12px' }} />
            <Box sx={{ display: 'flex', gap: '12px', mb: '12px' }}>
              <TextField label="Titul před jménem" size="small" fullWidth />
              <TextField label="Titul za jménem" size="small" fullWidth />
            </Box>
            <Box sx={{ display: 'flex', gap: '12px', mb: '12px' }}>
              <TextField label="Datum narození *" size="small" fullWidth />
              <TextField label="Pohlaví" size="small" select fullWidth defaultValue="">
                <MenuItem value="zena">Žena</MenuItem>
                <MenuItem value="muz">Muž</MenuItem>
              </TextField>
            </Box>
            <TextField label="Telefon *" size="small" fullWidth />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '12px' }}>Fotka</Typography>
            <Box
              sx={{
                border: '1px dashed #aaa',
                p: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: '#f1f1f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CloudUploadOutlinedIcon fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: 13 }}>
                <u>Nahrejte</u> nebo přetáhněte obrázek ve formátu JPEG nebo PNG. Poměr stran by měl být 2:1, minimální
                rozlišení 2000 × 1000 px.
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '12px' }}>Adresa</Typography>
            <TextField label="Ulice a číslo popisné" size="small" fullWidth sx={{ mb: '12px' }} />
            <Box sx={{ display: 'flex', gap: '12px' }}>
              <TextField label="Město" size="small" fullWidth />
              <TextField label="PSČ" size="small" fullWidth />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e6e5e7', px: '24px', py: '16px' }}>
          <Button variant="outlined" onClick={onClose}>
            Zrušit
          </Button>
          <Button variant="contained" onClick={onClose}>
            Uložit
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
