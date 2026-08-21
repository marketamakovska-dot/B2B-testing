import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LinearProgress from '@mui/material/LinearProgress'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined'
import AppShell from '../layout/AppShell'
import InfoModal from '../components/InfoModal'
import EmailPreviewModal from '../components/EmailPreviewModal'
import { useFlow } from '../data/flowState'

export default function SberPodkladuPage() {
  const navigate = useNavigate()
  const { campaigns, endCampaign } = useFlow()
  const [tab, setTab] = useState<'probihajici' | 'ukoncene'>('probihajici')
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [preview, setPreview] = useState<{ name: string; reminder: boolean } | null>(null)

  const visible = campaigns.filter((c) => (tab === 'probihajici' ? c.status === 'probihajici' : c.status === 'ukoncena'))

  return (
    <AppShell active="pripravna">
      <Box sx={{ px: '60px', py: '48px' }}>
        <Typography sx={{ fontSize: 14, color: '#434168', mb: '8px' }}>
          <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/pripravna')}>
            Příprava dat
          </Box>{' '}
          / Sběr podkladů k průkazům
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '8px', gap: '16px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32 }}>
            Sběr podkladů k průkazům
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => navigate('/pripravna/sber-podkladu/novy')}
          >
            Nový sběr podkladů
          </Button>
        </Box>
        <Typography sx={{ fontSize: 16, mb: '32px', maxWidth: 700 }}>
          Rozesílejte uživatelům e-mailem informace o průkazech a umožněte jim nahrát fotografie a vyplnit údaje online.
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: '24px', minHeight: 0, borderBottom: '1px solid #e6e5e7', '& .MuiTab-root': { minHeight: 0, py: '8px' } }}
        >
          <Tab label="Probíhající" value="probihajici" />
          <Tab label="Ukončené" value="ukoncene" />
        </Tabs>

        {visible.length === 0 ? (
          <Box sx={{ bgcolor: '#f1f1f1', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 20, textAlign: 'center' }}>
                {tab === 'probihajici' ? 'Aktuálně nesbíráte podklady k průkazům' : 'Zatím zde nemáte žádné ukončené sběry'}
              </Typography>
              {tab === 'probihajici' && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    onClick={() => navigate('/pripravna/sber-podkladu/novy')}
                  >
                    Nový sběr podkladů
                  </Button>
                  <Button variant="outlined" startIcon={<PlayCircleOutlineIcon />} onClick={() => setHowItWorksOpen(true)}>
                    Jak sbírat podklady
                  </Button>
                </>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {visible.map((c) => (
              <Box key={c.id} sx={{ border: '1px solid #e6e5e7', p: '24px', width: 300 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, mb: '4px' }}>{c.name}</Typography>
                <Typography sx={{ fontSize: 14, mb: '12px' }}>Odesláno {c.sentDate}</Typography>
                {c.filledPeople > 0 ? (
                  <>
                    <Typography sx={{ fontSize: 14, mb: '8px' }}>
                      Vyplnilo {c.filledPeople} z {c.totalPeople} osob
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(c.filledPeople / c.totalPeople) * 100}
                      sx={{ height: 6, mb: '16px', bgcolor: '#e6e5e7', '& .MuiLinearProgress-bar': { bgcolor: '#000' } }}
                    />
                  </>
                ) : (
                  <Typography sx={{ fontSize: 14, mb: '16px' }}>{c.totalPeople} osob</Typography>
                )}
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {tab === 'probihajici' && c.filledPeople > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<MailOutlineIcon />}
                      onClick={() => setPreview({ name: c.name, reminder: true })}
                    >
                      Poslat připomenutí
                    </Button>
                  )}
                  {tab === 'probihajici' && c.filledPeople === 0 && (
                    <Button size="small" variant="outlined">
                      Upravit
                    </Button>
                  )}
                  <Button size="small" variant="outlined" onClick={() => setPreview({ name: c.name, reminder: false })}>
                    Zobrazit náhled
                  </Button>
                  {tab === 'probihajici' && (
                    <Button size="small" variant="outlined" color="secondary" onClick={() => endCampaign(c.id)}>
                      Ukončit
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <InfoModal
        open={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        title="Jak vytvářet sběr podkladů k průkazům"
        description="Podívejte se, jak jednoduše sbírat podklady."
      />
      <EmailPreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        campaignName={preview?.name ?? ''}
        reminder={preview?.reminder ?? false}
      />
    </AppShell>
  )
}
