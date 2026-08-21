import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import ImportWizardShell from '../layout/ImportWizardShell'
import InfoModal from '../components/InfoModal'
import { useFlow } from '../data/flowState'
import bakalariLogo from '../assets/agendas/bakalari.png'
import skolaOnlineLogo from '../assets/agendas/skola-online.png'
import edookitLogo from '../assets/agendas/edookit.png'
import edupageLogo from '../assets/agendas/edupage.png'

type AgendaId = 'bakalari' | 'skolaonline' | 'edookit' | 'edupage'

type Agenda = {
  id: AgendaId
  name: string
  logo: string
  // Real logo files aren't uniform height, so each gets its own rendered
  // height (matched by eye against the Figma cards) instead of one fixed size.
  logoHeight: number
}

// Per the Figma "Databáze nových osob / Import dat / Volby importu" screen
// (node 6041-41719) — all four school-agenda integrations shown there, in the
// same order.
const AGENDAS: Agenda[] = [
  { id: 'bakalari', name: 'Bakaláři', logo: bakalariLogo, logoHeight: 38 },
  { id: 'skolaonline', name: 'Škola Online', logo: skolaOnlineLogo, logoHeight: 34 },
  { id: 'edookit', name: 'Edookit', logo: edookitLogo, logoHeight: 30 },
  { id: 'edupage', name: 'EduPage', logo: edupageLogo, logoHeight: 40 },
]

export default function ImportChoicePage() {
  const navigate = useNavigate()
  const { setImportMethod } = useFlow()
  const [stage, setStage] = useState<'choose' | 'upload' | 'agenda'>('choose')
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null)
  const [tableUploaded, setTableUploaded] = useState(false)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const handleContinue = () => {
    if (stage === 'agenda') {
      navigate('/pripravna/import/nahravani')
    } else {
      navigate('/pripravna/import/kontrola')
    }
  }

  const chooseAgenda = (agenda: Agenda) => {
    setImportMethod(agenda.id)
    setSelectedAgenda(agenda)
    setStage('agenda')
  }

  return (
    <>
    <ImportWizardShell
      step={1}
      onBack={() => (stage === 'choose' ? navigate('/pripravna') : setStage('choose'))}
      onContinue={handleContinue}
      continueDisabled={stage === 'upload' && !tableUploaded}
      showFooter={stage !== 'choose'}
    >
      <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32, mb: '40px' }}>
        Jak chcete data importovat?
      </Typography>

      {stage === 'agenda' && selectedAgenda ? (
        <Box sx={{ maxWidth: 600 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #e6e5e7',
              px: '16px',
              py: '10px',
              mb: '48px',
            }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2094f3' }} />
            <Typography sx={{ fontSize: 14 }}>Propojení s agendou {selectedAgenda.name}</Typography>
            <Link component="button" onClick={() => setStage('choose')} sx={{ fontSize: 14, textDecoration: 'underline', color: '#000' }}>
              Změnit
            </Link>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', mb: '32px' }}>
            <Box
              component="img"
              src={selectedAgenda.logo}
              alt={selectedAgenda.name}
              sx={{ height: selectedAgenda.logoHeight + 12, width: 'auto', maxWidth: 260 }}
            />
            <Link component="button" onClick={() => setHowItWorksOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 14, color: '#000' }}>
              <HelpOutlineIcon sx={{ fontSize: 18 }} /> Jak to funguje?
            </Link>
          </Box>

          <Typography sx={{ fontSize: 16, mb: '16px' }}>
            Kliknutím na tlačítko Pokračovat importujeme dočasně do Alive Connect všechny údaje o vašich studentech a
            zaměstnancích dle dohodnutého nastavení se školní agendou, abyste mohli učinit objednávku průkazů.
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Nic nemusíte dál nahrávat ručně.</Typography>
        </Box>
      ) : stage === 'choose' ? (
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', mb: '20px' }}>
            PROPOJIT SE ŠKOLNÍ AGENDOU
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', mb: '48px' }}>
            {AGENDAS.map((agenda) => (
              <Box
                key={agenda.id}
                sx={{
                  border: '1px solid #e6e5e7',
                  pt: '32px',
                  pb: '24px',
                  px: '24px',
                  width: 273,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <Box sx={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src={agenda.logo}
                    alt={agenda.name}
                    sx={{ height: agenda.logoHeight, width: 'auto', maxWidth: '100%' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{agenda.name}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#555' }}>
                    Jednoduše importujte data osob ze své školní agendy.
                  </Typography>
                </Box>
                <Button variant="contained" onClick={() => chooseAgenda(agenda)}>
                  Importovat
                </Button>
                <Link
                  component="button"
                  onClick={() => {
                    setSelectedAgenda(agenda)
                    setHowItWorksOpen(true)
                  }}
                  sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 14, color: '#000' }}
                >
                  <HelpOutlineIcon sx={{ fontSize: 18 }} /> Jak to funguje?
                </Link>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: '32px', maxWidth: 1140 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e6e5e7' }} />
            <Typography sx={{ fontSize: 14, color: '#777' }}>nebo</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e6e5e7' }} />
          </Box>

          <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', mb: '20px', textAlign: 'center' }}>
            NAHRÁT DATA RUČNĚ
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                border: '1px solid #e6e5e7',
                p: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                width: 468,
                maxWidth: '100%',
              }}
            >
              <TableChartOutlinedIcon sx={{ fontSize: 40 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Import z tabulky</Typography>
              <Typography sx={{ fontSize: 14, color: '#555', textAlign: 'center' }}>
                Manuálně nahrajte tabulku s daty osob a soubor s fotkami osob.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: '8px' }}
                onClick={() => {
                  setImportMethod('manual')
                  setStage('upload')
                }}
              >
                Importovat
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e6e5e7', p: '16px', mb: '32px', maxWidth: 400 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TableChartOutlinedIcon fontSize="small" /> Import z tabulky
            </Box>
            <Link component="button" onClick={() => setStage('choose')} sx={{ textDecoration: 'underline' }}>
              Změnit
            </Link>
          </Box>

          <Box sx={{ display: 'flex', gap: '32px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', mb: '12px' }}>
                TABULKA S DATY OSOB
              </Typography>
              <Box
                onClick={() => setTableUploaded(true)}
                sx={{
                  border: '1px dashed #aaa',
                  p: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  bgcolor: tableUploaded ? '#dbffe8' : 'transparent',
                }}
              >
                <UploadFileOutlinedIcon />
                <Typography sx={{ fontSize: 14, textAlign: 'center' }}>
                  {tableUploaded ? '25osob.xlsx nahráno' : <><u>Nahrejte</u> nebo přetáhněte .XLSX soubor.</>}
                </Typography>
              </Box>
              <Link component="button" onClick={() => {}} sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 14, mt: '8px', color: '#000' }}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} /> Stáhnout šablonu tabulky
              </Link>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', mb: '12px' }}>
                SOUBOR S FOTKAMI
              </Typography>
              <Box
                sx={{
                  border: '1px dashed #aaa',
                  p: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <UploadFileOutlinedIcon />
                <Typography sx={{ fontSize: 14, textAlign: 'center' }}>
                  <u>Nahrejte</u> nebo přetáhněte .ZIP soubor s fotkami osob ve formátu .jpg, .heic nebo .png.
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#777', mt: '8px' }}>
                Minimální šířka fotografie je 500×600px, maximální velikost zip souboru je 100 MB.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </ImportWizardShell>
    <InfoModal
      open={howItWorksOpen}
      onClose={() => setHowItWorksOpen(false)}
      title={`Jak funguje import z ${selectedAgenda ? selectedAgenda.name : 'školní agendy'}`}
      description="Podívejte se, jak jednoduše propojit školní agendu a naimportovat data osob."
    />
    </>
  )
}
