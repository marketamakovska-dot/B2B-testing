import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import loginLogo from '../assets/figma/login-logo.png'
import { tokens } from '../theme/theme'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: 444 }}>
        <img src={loginLogo} alt="Alive Connect" style={{ height: 57, objectFit: 'contain' }} />
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/pripravna')
          }}
          sx={{
            border: '1px solid #19191b',
            borderRadius: '12px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ pt: '40px', pb: '16px', px: '32px', width: '100%' }}>
            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: 24, textAlign: 'center', color: tokens.textPrimary }}>
              Přihlášení
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', px: '32px', pt: '16px', pb: '40px', width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              defaultValue="marketa.makovska@gtsalive.com"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              defaultValue="demo1234"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ borderRadius: '12px', py: '10px', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Přihlásit se
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
