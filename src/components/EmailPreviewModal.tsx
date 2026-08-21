import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

// Shows the actual e-mail copy a campaign recipient would receive, instead of
// the generic "how it works" video placeholder used by InfoModal. Added after
// the August 2026 Figma update introduced a real "E-mail" flow with concrete
// letter content, rather than a placeholder screen.
export default function EmailPreviewModal({
  open,
  onClose,
  campaignName,
  reminder = false,
}: {
  open: boolean
  onClose: () => void
  campaignName: string
  reminder?: boolean
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
          width: 520,
          maxWidth: '92vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          p: '24px',
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', mb: '16px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
            {reminder ? 'Náhled připomínkového e-mailu' : 'Náhled e-mailu'}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ border: '1px solid #e6e5e7', p: '20px', fontSize: 14, lineHeight: 1.6 }}>
          <Typography sx={{ fontSize: 12, color: '#666', mb: '12px' }}>
            Předmět: {reminder ? `Připomínka — ${campaignName}` : campaignName}
          </Typography>
          <p>Vážení rodiče, vážení žáci,</p>
          {reminder ? (
            <p>
              rádi bychom Vám připomněli, že jsme Vás nedávno požádali o doplnění údajů a fotografie pro vydání
              studentského průkazu. Pokud jste tak ještě neučinili, prosíme o vyplnění co nejdříve.
            </p>
          ) : (
            <p>
              rádi bychom Vás informovali, že naše škola vydává svým žákům mezinárodní studentský průkaz. Tento průkaz je
              především identifikačním dokladem, který potvrzuje studium na naší škole.
            </p>
          )}
          <p>Pro vydání průkazu potřebujeme doplnit několik údajů a fotografii. Klikněte prosím na tlačítko níže.</p>
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
    </Modal>
  )
}
