import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export type CardType = 'ISIC' | 'ITIC' | 'ISIC SCHOLAR' | 'ALIVE'

// Small colored icon + label matching the card-type chips added in the August
// 2026 Figma update (order wizard "Jaké produkty chcete objednávat?", the new
// campaign wizard's card-type picker, and Přípravna dat's "Průkaz" column).
const STYLES: Record<CardType, { bg: string; text: string; short: string }> = {
  ISIC: { bg: '#12b0a6', text: '#fff', short: 'ISIC' },
  ITIC: { bg: '#f07b1e', text: '#fff', short: 'ITIC' },
  'ISIC SCHOLAR': { bg: '#12b0a6', text: '#fff', short: 'ISIC' },
  ALIVE: { bg: '#2f5fd6', text: '#fff', short: 'A' },
}

export default function CardTypeBadge({ type, label }: { type: CardType; label?: string }) {
  const style = STYLES[type]
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          bgcolor: style.bg,
          color: style.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          fontWeight: 700,
          flexShrink: 0,
          fontFamily: '"Work Sans", sans-serif',
        }}
      >
        {style.short}
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label ?? type}</Typography>
    </Box>
  )
}
