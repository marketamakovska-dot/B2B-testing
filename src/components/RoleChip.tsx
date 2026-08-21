import Box from '@mui/material/Box'
import type { Role } from '../data/samplePeople'

// Pill-style role tag ("Student" / "Zaměstnanec" / "Učitel") — added to the
// Přípravna dat table and person detail header after the August 2026 Figma
// update, which extended Přípravna dat to cover employees and teachers, not
// just students.
export default function RoleChip({ role }: { role: Role }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        border: '1px solid #afb1b6',
        borderRadius: '100px',
        px: '12px',
        py: '2px',
        fontSize: 13,
        fontFamily: '"Work Sans", sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {role}
    </Box>
  )
}
