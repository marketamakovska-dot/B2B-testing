import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined'
import sidebarLogo from '../assets/figma/sidebar-logo.png'
import avatarImg from '../assets/figma/avatar.png'
import flagCz from '../assets/figma/flag-cz.png'
import { tokens } from '../theme/theme'

export type SidebarKey =
  | 'nastenka'
  | 'pripravna'
  | 'objednavky'
  | 'sprava-prukazu'
  | 'prukazy'
  | 'faktury'
  | 'bonusovy-system'
  | 'kontakty'
  | 'sprava-uzivatelu'

const NAV_ITEMS: { key: SidebarKey; label: string; icon: ReactNode; path: string; disabled?: boolean }[] = [
  { key: 'nastenka', label: 'Nástěnka', icon: <DashboardOutlinedIcon />, path: '/', disabled: true },
  { key: 'pripravna', label: 'Přípravna dat', icon: <ImageOutlinedIcon />, path: '/pripravna' },
  { key: 'objednavky', label: 'Objednávky', icon: <ReceiptLongOutlinedIcon />, path: '/objednavky' },
  { key: 'sprava-prukazu', label: 'Správa průkazů', icon: <BadgeOutlinedIcon />, path: '/sprava-prukazu' },
  { key: 'prukazy', label: 'Průkazy', icon: <DescriptionOutlinedIcon />, path: '/prukazy', disabled: true },
  { key: 'faktury', label: 'Faktury', icon: <ReceiptOutlinedIcon />, path: '/faktury', disabled: true },
  { key: 'bonusovy-system', label: 'Bonusový systém', icon: <CardGiftcardOutlinedIcon />, path: '/bonusovy-system', disabled: true },
  { key: 'kontakty', label: 'Kontakty', icon: <ContactsOutlinedIcon />, path: '/kontakty', disabled: true },
  { key: 'sprava-uzivatelu', label: 'Správa uživatelů', icon: <GroupOutlinedIcon />, path: '/sprava-uzivatelu', disabled: true },
]

export default function AppShell({
  active,
  children,
}: {
  active: SidebarKey
  children: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 294,
          flexShrink: 0,
          bgcolor: tokens.sidebarBg,
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Box sx={{ p: '16px', pb: '12px' }}>
          <img src={sidebarLogo} alt="Alive Connect" style={{ height: 40, objectFit: 'contain' }} />
        </Box>
        <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active
            return (
              <Box
                key={item.key}
                onClick={() => !item.disabled && navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  pl: '16px',
                  pr: '12px',
                  py: '12px',
                  cursor: item.disabled ? 'default' : 'pointer',
                  color: isActive ? tokens.sidebarTextActive : tokens.sidebarTextMuted,
                  bgcolor: isActive ? tokens.sidebarActiveBg : 'transparent',
                  borderLeft: isActive ? `2px solid ${tokens.sidebarTextActive}` : '2px solid transparent',
                  opacity: item.disabled && !isActive ? 0.55 : 1,
                  '&:hover': !item.disabled ? { opacity: 0.85 } : undefined,
                }}
              >
                <Box sx={{ display: 'flex', fontSize: 24, '& svg': { fontSize: 22 } }}>{item.icon}</Box>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.2px', flex: 1 }}>
                  {item.label}
                </Typography>
                {item.key === 'bonusovy-system' && <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Main column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top nav */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px',
            px: '24px',
            py: '8px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '8px' }}>
            <img src={flagCz} alt="CZ" width={24} height={24} style={{ borderRadius: 4 }} />
            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, color: tokens.textPrimary }}>CS</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20, color: tokens.textPrimary }} />
          </Box>
          <Badge badgeContent={1} color="secondary" sx={{ '& .MuiBadge-badge': { bgcolor: tokens.badge } }}>
            <IconButton size="small">
              <MailOutlineIcon sx={{ color: tokens.textPrimary }} />
            </IconButton>
          </Badge>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '8px', cursor: 'pointer' }}>
            <Avatar src={avatarImg} sx={{ width: 40, height: 40, border: '2px solid #f7f7fd' }} />
            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, color: tokens.textPrimary }}>Your profile</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20, color: tokens.textPrimary }} />
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      </Box>
    </Box>
  )
}
