import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import WizardShell, { type WizardStep } from '../layout/WizardShell'
import CardTypeBadge, { type CardType } from '../components/CardTypeBadge'
import RoleChip from '../components/RoleChip'
import { useFlow } from '../data/flowState'
import { samplePeople } from '../data/samplePeople'

const CARD_TYPES: CardType[] = ['ISIC', 'ITIC', 'ISIC SCHOLAR', 'ALIVE']

export default function NewCampaignWizard() {
  const navigate = useNavigate()
  const { addCampaign } = useFlow()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [nazev, setNazev] = useState('')
  const [cardType, setCardType] = useState<CardType>('ISIC')
  const [predmet, setPredmet] = useState('')
  const [sendMode, setSendMode] = useState<'hned' | 'naplanovat'>('hned')
  const [recipientSearch, setRecipientSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Recipients = everyone in "Přípravna dat" who is still missing data or a photo.
  const allRecipients = samplePeople.filter((p) => p.status === 'Nedokončeno')
  const recipients = allRecipients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(recipientSearch.toLowerCase())
    const matchesCategory = !categoryFilter || p.role === categoryFilter
    return matchesSearch && matchesCategory
  })

  const steps: WizardStep[] = [
    { label: 'Nastavení', state: step === 1 ? 'active' : 'done' },
    { label: 'Obsah zprávy', state: step === 2 ? 'active' : step > 2 ? 'done' : 'todo' },
    { label: 'Shrnutí a odeslání', state: step === 3 ? 'active' : 'todo' },
  ]

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3)
    else navigate('/pripravna/sber-podkladu')
  }

  const handleContinue = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3)
      return
    }
    addCampaign({
      name: nazev || 'Nový sběr podkladů',
      sentDate: new Date().toLocaleDateString('cs-CZ'),
      totalPeople: recipients.length,
      filledPeople: 0,
    })
    navigate('/pripravna/sber-podkladu')
  }

  const continueDisabled = (step === 1 && !nazev.trim()) || (step === 2 && !predmet.trim())

  return (
    <WizardShell
      active="pripravna"
      title="Nový sběr podkladů"
      steps={steps}
      onBack={handleBack}
      onContinue={handleContinue}
      continueLabel={step === 3 ? 'Vytvořit kampaň' : 'Pokračovat'}
      continueDisabled={continueDisabled}
    >
      {step === 1 && (
        <Box sx={{ maxWidth: 900 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 24, mb: '4px' }}>Nastavení sběru podkladů</Typography>
          <Typography sx={{ fontSize: 14, mb: '24px' }}>
            Rozešlete uživatelům e-mailem informace o průkazech a umožněte jim vyplnit údaje online.
          </Typography>

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '8px' }}>Interní název *</Typography>
          <TextField fullWidth value={nazev} onChange={(e) => setNazev(e.target.value)} sx={{ mb: '24px', maxWidth: 400 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '8px', gap: '12px', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Jaká data sbíráme?</Typography>
            <Link component="button" underline="hover" sx={{ fontSize: 13, fontWeight: 700 }}>
              Upravit
            </Link>
          </Box>
          <Typography sx={{ fontSize: 14, mb: '24px' }}>
            Automaticky v kampani sbíráme <b>jméno, příjmení, datum narození, informační povinnost, fotku</b> a u osob mladších 15 let{' '}
            <b>jméno, příjmení a email zákonného zástupce</b>.
          </Typography>

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '12px' }}>Pro jaký typ průkazu sbíráme data?</Typography>
          <Box sx={{ display: 'flex', gap: '12px', mb: '32px', flexWrap: 'wrap' }}>
            {CARD_TYPES.map((t) => (
              <Box
                key={t}
                onClick={() => setCardType(t)}
                sx={{
                  border: cardType === t ? '2px solid #000' : '1px solid #e6e5e7',
                  px: '16px',
                  py: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '1px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {cardType === t && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#000' }} />}
                </Box>
                <CardTypeBadge type={t} />
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '4px' }}>Příjemci</Typography>
          <Typography sx={{ fontSize: 14, mb: '16px' }}>
            Všichni v přípravě, kteří nemají fotografii či kompletní data a zároveň mají e-mailovou adresu. Vybráno:{' '}
            <u>{recipients.length} osob z {allRecipients.length}</u>.
          </Typography>

          <Box sx={{ display: 'flex', gap: '12px', mb: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '4px' }}>Hledat podle jména</Typography>
              <TextField
                size="small"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                placeholder="Jméno a příjmení"
                sx={{ minWidth: 220 }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '4px' }}>Kategorie</Typography>
              <Select
                size="small"
                displayEmpty
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">Všechny</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Zaměstnanec">Zaměstnanec</MenuItem>
                <MenuItem value="Učitel">Učitel</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '4px' }}>Třída</Typography>
              <Select size="small" displayEmpty value="" sx={{ minWidth: 128 }}>
                <MenuItem value="">Všechny</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '4px' }}>Narozen</Typography>
              <Select size="small" displayEmpty value="" sx={{ minWidth: 128 }}>
                <MenuItem value="">Všechny</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '4px' }}>Fotografie</Typography>
              <Select size="small" displayEmpty value="" sx={{ minWidth: 128 }}>
                <MenuItem value="">Všechny</MenuItem>
                <MenuItem value="ano">Nahraná</MenuItem>
                <MenuItem value="ne">Chybí</MenuItem>
              </Select>
            </Box>
            <Button variant="outlined" sx={{ borderRadius: '12px', height: 40 }}>
              Filtrovat
            </Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox defaultChecked /></TableCell>
                <TableCell>Jméno</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Třída</TableCell>
                <TableCell>Narozen</TableCell>
                <TableCell>Zákonný zástupce</TableCell>
                <TableCell>Fotografie</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell padding="checkbox"><Checkbox defaultChecked /></TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell><RoleChip role={p.role} /></TableCell>
                  <TableCell>{p.trida}</TableCell>
                  <TableCell>{p.birthDate}</TableCell>
                  <TableCell>{p.zastupceJmeno ?? '-'}</TableCell>
                  <TableCell>
                    {p.hasPhoto ? (
                      <CheckIcon sx={{ fontSize: 18, color: '#19191b' }} />
                    ) : (
                      <CloseIcon sx={{ fontSize: 18, color: '#afb1b6' }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ maxWidth: 700 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 24, mb: '4px' }}>Obsah zprávy</Typography>
          <Typography sx={{ fontSize: 14, mb: '24px' }}>Vyplňte obsah e-mailu, který dorazí všem příjemcům.</Typography>

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '8px' }}>Předmět *</Typography>
          <TextField
            fullWidth
            value={predmet}
            onChange={(e) => setPredmet(e.target.value)}
            placeholder="Např. ISIC průkazy pro prváky"
            sx={{ mb: '24px' }}
          />

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '8px' }}>Text znění e-mailu</Typography>
          <Box sx={{ border: '1px solid #e6e5e7' }}>
            <Box sx={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e6e5e7', px: '12px', py: '8px', color: '#777' }}>
              <FormatBoldIcon fontSize="small" />
              <FormatItalicIcon fontSize="small" />
            </Box>
            <Box sx={{ p: '16px', fontSize: 14, lineHeight: 1.6 }}>
              <p>Vážení rodiče, vážení žáci,</p>
              <p>
                rádi bychom Vás informovali, že naše škola vydává svým žákům mezinárodní studentský průkaz {cardType}. Tento průkaz je
                především identifikačním dokladem, který potvrzuje studium na naší škole.
              </p>
              <p>Průkaz {cardType} slouží také jako:</p>
              <Box component="ul" sx={{ listStyle: 'disc', pl: '24px', m: 0 }}>
                <li>čipová karta do jídelny</li>
                <li>na vstup do škol</li>
                <li>k evidenci docházky</li>
              </Box>
              <p>
                Pro vydání průkazu potřebujeme doplnit několik údajů a fotografii. Vyplnění zabere jen pár minut — klikněte prosím na
                tlačítko níže a postupujte podle pokynů.
              </p>
              <Box sx={{ my: '12px' }}>
                <Box
                  component="span"
                  sx={{ display: 'inline-block', bgcolor: '#000', color: '#fff', borderRadius: '8px', px: '20px', py: '10px', fontWeight: 700 }}
                >
                  Vyplnit údaje
                </Box>
              </Box>
              <p>Odkaz je platný 14 dní od odeslání tohoto e-mailu.</p>
              <p>Děkujeme a přejeme hezký den,</p>
              <p>Vaše škola</p>
            </Box>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box sx={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 320 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 24, mb: '24px' }}>Shrnutí</Typography>
            <SummaryRow label="Interní název" value={nazev || '—'} />
            <SummaryRow label="Předmět" value={predmet || '—'} />
            <SummaryRow label="Počet příjemců" value={String(recipients.length)} />

            <Typography sx={{ fontSize: 13, fontWeight: 700, mt: '32px', mb: '12px' }}>Nastavení odeslání</Typography>
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SendOption
                label="Odeslat hned"
                desc="E-maily se rozešlou ihned po vytvoření kampaně"
                selected={sendMode === 'hned'}
                onClick={() => setSendMode('hned')}
              />
              <SendOption
                label="Naplánovat odeslání"
                desc="Nastavit si vlastní den a čas odeslání e-mailu"
                selected={sendMode === 'naplanovat'}
                onClick={() => setSendMode('naplanovat')}
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: '12px' }}>Náhled zprávy</Typography>
            <Box sx={{ border: '1px solid #e6e5e7', p: '20px', fontSize: 14, lineHeight: 1.6, mb: '16px' }}>
              <Typography sx={{ fontSize: 12, color: '#666', mb: '8px' }}>
                Předmět: {predmet || `${cardType} průkazy — doplňte prosím údaje`}
              </Typography>
              <p>Vážení rodiče, vážení žáci,</p>
              <p>rádi bychom Vás informovali, že naše škola vydává svým žákům mezinárodní studentský průkaz {cardType}.</p>
              <Box sx={{ my: '8px' }}>
                <Box
                  component="span"
                  sx={{ display: 'inline-block', bgcolor: '#000', color: '#fff', borderRadius: '8px', px: '16px', py: '8px', fontWeight: 700, fontSize: 13 }}
                >
                  Vyplnit údaje
                </Box>
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<PlayCircleOutlineIcon />}>
              Odeslat testovací e-mail
            </Button>
          </Box>
        </Box>
      )}
    </WizardShell>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px', borderBottom: '1px solid #e6e5e7', py: '10px' }}>
      <Typography sx={{ fontSize: 14, color: '#434168' }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{value}</Typography>
    </Box>
  )
}

function SendOption({ label, desc, selected, onClick }: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{ width: 220, border: selected ? '2px solid #000' : '1px solid #e6e5e7', p: '16px', cursor: 'pointer' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
        <PlayCircleOutlineIcon sx={{ fontSize: 18, color: '#777' }} />
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '1px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#000' }} />}
        </Box>
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '4px' }}>{label}</Typography>
      <Typography sx={{ fontSize: 13 }}>{desc}</Typography>
    </Box>
  )
}
