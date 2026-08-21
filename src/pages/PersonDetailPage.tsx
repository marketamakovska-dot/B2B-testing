import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AppShell from '../layout/AppShell'
import RoleChip from '../components/RoleChip'
import { tokens } from '../theme/theme'
import { samplePeople } from '../data/samplePeople'

// Static filler content for the fields the "Příprava dat" table doesn't track
// (rodné číslo, adresa, zákonný zástupce, ...) — mirrors the placeholder values
// shown in the Figma "detail partnera" reference (node 4305:92264).
const PLACEHOLDER = {
  titulPred: 'Bc.',
  titulZa: '—',
  pohlavi: 'Žena',
  rodneCislo: '965524/4444',
  jazyk: 'Angličtina',
  telefon: '604 555 555',
  formaStudia: 'Prezenční',
  externiId: '44444',
  poznamka: '—',
  adresa: {
    radek1: 'Krakovská 3',
    radek2: '—',
    obec: 'Brno',
    psc: '177 00',
    okres: 'Brno',
    zeme: 'Česko',
  },
  zastupce: {
    jmeno: 'Anna',
    prijmeni: 'Nováková',
    rodneCislo: '4555555',
    vztah: 'Matka',
    email: 'anna@anna.com',
    telefon: '604 555 555',
  },
}

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const person = samplePeople.find((p) => String(p.id) === id) ?? samplePeople[0]

  return (
    <AppShell active="pripravna">
      <Box sx={{ px: '60px', py: '32px' }}>
        <Box
          onClick={() => navigate('/pripravna')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#666',
            fontSize: 16,
            mb: '24px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ← Zpět
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 32 }}>
                {person.name}
              </Typography>
              <RoleChip role={person.role} />
            </Box>
            <Button variant="contained" sx={{ borderRadius: '12px' }}>
              Editovat
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20 }}>Průkazy</Typography>
            <Box
              sx={{
                border: '1px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                px: '24px',
                py: '20px',
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 16, color: tokens.textPrimary }}>
                {person.prukaz && person.prukaz !== '-' ? `Přiřazený průkaz: ${person.prukaz}` : 'Uživatel nemá žádný průkaz.'}
              </Typography>
              <Button variant="outlined" endIcon={<ArrowDownwardIcon sx={{ fontSize: 16 }} />} sx={{ borderRadius: '12px' }}>
                Objednat průkaz
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <Card sx={{ flex: '2 1 500px' }}>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '24px' }}>
                  Osobní údaje
                </Typography>
                <FieldRow fields={[['Titul před', PLACEHOLDER.titulPred], ['Titul za', PLACEHOLDER.titulZa]]} />
                <FieldRow fields={[['Jméno', person.firstName], ['Příjmení', person.lastName]]} />
                <FieldRow fields={[['Datum narození', person.birthDate], ['Pohlaví', PLACEHOLDER.pohlavi]]} />
                <FieldRow fields={[['Rodné číslo', PLACEHOLDER.rodneCislo], ['Preferovaný jazyk komunikace', PLACEHOLDER.jazyk]]} />
                <FieldRow fields={[['Telefon', PLACEHOLDER.telefon], ['E-mail', person.email]]} />

                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mt: '16px', mb: '8px' }}>
                  Další údaje
                </Typography>
                <Box sx={{ display: 'flex', gap: '24px', mb: '16px', flexWrap: 'wrap' }}>
                  <CheckedTag label="Aktivní student" checked={person.aktivniStudent} />
                  <CheckedTag label="Absolvent" checked={person.absolvent} />
                </Box>
                <FieldRow fields={[['Třída', person.trida], ['Ročník', person.rocnik]]} />
                <FieldRow fields={[['Forma studia', PLACEHOLDER.formaStudia], ['Externí ID', PLACEHOLDER.externiId]]} />
                <FieldRow fields={[['Poznámka', PLACEHOLDER.poznamka]]} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '8px' }}>
                  <CheckedTag label="Souhlas se zpracováním osobních údajů pro marketingové účely" />
                  <CheckedTag label="Informovaný souhlas" />
                </Box>
              </Card>

              <Card sx={{ flex: '1 1 280px', alignSelf: 'flex-start' }}>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '24px' }}>
                  Fotografie
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#efeff0',
                    border: '1px solid #afb1b6',
                    borderRadius: '2px',
                    height: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageOutlinedIcon sx={{ fontSize: 40, color: '#afb1b6' }} />
                </Box>
              </Card>
            </Box>

            <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Card sx={{ flex: '1 1 340px' }}>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '24px' }}>
                  Adresa
                </Typography>
                <FieldRow fields={[['Adresní řádek 1', PLACEHOLDER.adresa.radek1], ['Adresní řádek 2', PLACEHOLDER.adresa.radek2]]} />
                <FieldRow fields={[['Obec', PLACEHOLDER.adresa.obec], ['PSČ', PLACEHOLDER.adresa.psc]]} />
                <FieldRow fields={[['Okres', PLACEHOLDER.adresa.okres], ['Země', PLACEHOLDER.adresa.zeme]]} />
              </Card>

              <Card sx={{ flex: '1 1 340px' }}>
                <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '24px' }}>
                  Zákonný zástupce
                </Typography>
                <FieldRow fields={[['Jméno', PLACEHOLDER.zastupce.jmeno], ['Příjmení', PLACEHOLDER.zastupce.prijmeni]]} />
                <FieldRow fields={[['Rodné číslo', PLACEHOLDER.zastupce.rodneCislo], ['Vztah k držiteli', PLACEHOLDER.zastupce.vztah]]} />
                <FieldRow fields={[['Email', PLACEHOLDER.zastupce.email], ['Telefon', PLACEHOLDER.zastupce.telefon]]} />
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell>
  )
}

function Card({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box sx={{ border: '2px solid #1e1e1e', borderRadius: '8px', p: '16px', minWidth: 0, ...sx }}>{children}</Box>
  )
}

function FieldRow({ fields }: { fields: [string, string][] }) {
  return (
    <Box sx={{ display: 'flex', gap: '8px', mb: '8px', flexWrap: 'wrap' }}>
      {fields.map(([label, value]) => (
        <Box key={label} sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: 14, color: tokens.textSecondary }}>
            {label}
          </Typography>
          <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, color: tokens.textPrimary }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

// Renders a filled black check for true, and an outlined circle with an "X"
// for false — matching the Figma "Aktivní student" / "Absolvent" tags, which
// visually distinguish which of the two actually applies to this person
// rather than showing both as always-checked.
function CheckedTag({ label, checked = true }: { label: string; checked?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '100px',
          bgcolor: checked ? '#19191b' : '#fff',
          border: checked ? 'none' : '1px solid #19191b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked ? (
          <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />
        ) : (
          <CloseOutlinedIcon sx={{ fontSize: 16, color: '#19191b' }} />
        )}
      </Box>
      <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 500, fontSize: 14, color: '#19191b' }}>
        {label}
      </Typography>
    </Box>
  )
}
