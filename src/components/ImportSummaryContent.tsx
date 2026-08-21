import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import InfoModal from './InfoModal'
import ImportedPeopleModal from './ImportedPeopleModal'

const MISSING = [
  { label: 'Chybějící fotografie', count: '15 osob' },
  { label: 'Chybějící příjmení', count: '2 osoby' },
  { label: 'Chybějící datum narození', count: '5 osob' },
  { label: 'Chybějící zákonný zástupce', count: '6 osob' },
]

const TIPS = [
  {
    title: 'Sběr podkladů přes e-mail',
    desc: 'Zašlete osobám e-mail s formulářem, kde vám sami nahrají fotku a doplní další chybějící údaje.',
  },
  {
    title: 'Tisknutelné QR formuláře',
    desc: 'Vytisknete formulář s QR kódem, který si osoba naskenuje sama.',
  },
]

// The "Výsledek kontroly" / "Shrnutí" content is reused as-is (same copy, same
// numbers) by both the Bakaláři/table import flow and the manual "Přidat osoby"
// flow in the real Figma prototype — this is that shared block.
export default function ImportSummaryContent({ title = 'Výsledek kontroly' }: { title?: string }) {
  const [howItWorksTitle, setHowItWorksTitle] = useState<string | null>(null)
  const [peopleModalTab, setPeopleModalTab] = useState<'complete' | 'incomplete' | null>(null)

  return (
    <>
      <Box sx={{ maxWidth: 962 }}>
        <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontSize: 40, textAlign: 'center', mb: '20px' }}>
          {title}
        </Typography>

        <Box sx={{ bgcolor: '#dbffe8', px: '24px', py: '12px', mb: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircleIcon sx={{ color: '#1a7a3d' }} />
            <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20 }}>
              25 osob je připraveno k importu.
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 16, mt: '4px' }}>
            Po dokončení bude průkaz možné rovnou objednat pro{' '}
            <Link component="button" onClick={() => setPeopleModalTab('complete')} sx={{ fontSize: 16, color: '#000' }}>
              10 z nich.
            </Link>
          </Typography>
        </Box>

        <Box sx={{ p: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '8px' }}>
            <ErrorOutlineIcon sx={{ color: '#b26a00' }} />
            <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
              U zbylých{' '}
              <Link
                component="button"
                onClick={() => setPeopleModalTab('incomplete')}
                sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20, color: '#000' }}
              >
                15 osob
              </Link>{' '}
              po importu ještě doplníme pár údajů.
            </Typography>
          </Box>
          {MISSING.map((row) => (
            <Box
              key={row.label}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #aaa', py: '12px', height: 48 }}
            >
              <Typography>{row.label}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{row.count}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ bgcolor: '#efeff0', p: '24px', mt: '16px' }}>
          <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '12px' }}>
            Po importu vám pomůžeme chybějící údaje snadno doplnit:
          </Typography>
          {TIPS.map((item, i) => (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
                py: '16px',
                borderBottom: i === 0 ? '1px solid #afb1b6' : 'none',
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 16 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: 16 }}>{item.desc}</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<PlayCircleOutlineIcon />}
                sx={{ whiteSpace: 'nowrap' }}
                onClick={() => setHowItWorksTitle(item.title)}
              >
                Zjistit, jak to funguje
              </Button>
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontSize: 16, mt: '16px' }}>
          Po kliknutí na Pokračovat uložíme všech 25 osob se vším, co teď máte, a rovnou vám nabídneme kampaň nebo
          formuláře výše. Na doplnění chybějících údajů pak máte 180 dní — dost času na to počkat na odpověď.
        </Typography>
      </Box>
      <InfoModal
        open={!!howItWorksTitle}
        onClose={() => setHowItWorksTitle(null)}
        title={howItWorksTitle ?? ''}
        description="Podívejte se, jak jednoduše doplnit chybějící údaje osob."
      />
      <ImportedPeopleModal
        open={!!peopleModalTab}
        onClose={() => setPeopleModalTab(null)}
        initialTab={peopleModalTab ?? 'complete'}
      />
    </>
  )
}
