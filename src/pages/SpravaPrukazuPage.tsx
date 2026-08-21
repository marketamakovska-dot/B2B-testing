import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AppShell from '../layout/AppShell'
import CardTypeBadge from '../components/CardTypeBadge'
import RoleChip from '../components/RoleChip'
import { samplePeople } from '../data/samplePeople'

type SortKey = 'cardNumber' | 'name' | 'cardExpiry' | 'trida' | 'rocnik'

// "Správa průkazů" — a table of every already-issued card, added in the
// August 2026 Figma update as a standalone section (previously only
// reachable indirectly through Přípravna dat / objednávky). Only people who
// actually have a card assigned (prukaz !== '-') show up here.
export default function SpravaPrukazuPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null)

  const cards = samplePeople.filter((p) => p.prukaz !== '-')

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = normalizedSearch
    ? cards.filter(
        (p) => p.name.toLowerCase().includes(normalizedSearch) || p.cardNumber.toLowerCase().includes(normalizedSearch),
      )
    : cards

  const visible = useMemo(() => {
    if (!sort) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), 'cs')
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filtered, sort])

  const toggleSort = (key: SortKey) => {
    setSort((prev) => (prev?.key === key ? (prev.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }))
  }

  return (
    <AppShell active="sprava-prukazu">
      <Box sx={{ px: '60px', py: '48px' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', mb: '32px', flexWrap: 'wrap' }}>
          <Box sx={{ maxWidth: 700 }}>
            <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 40, mb: '16px' }}>
              Správa průkazů
            </Typography>
            <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontSize: 18, color: '#000' }}>
              Přehled všech vydaných průkazů, jejich platnosti a stavu. Odsud můžete objednat prodloužení platnosti nebo
              duplikát.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<DownloadOutlinedIcon />} onClick={() => navigate('/pripravna/import')}>
            Importovat
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mb: '24px' }}>
          <TextField
            size="small"
            placeholder="Hledat podle jména či čísla průkazu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
          />
          <FilterField label="Typ průkazu" />
          <FilterField label="Třída" />
          <FilterField label="Stav" />
          <Button variant="outlined" sx={{ height: 40 }}>
            Filtrovat
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <SortableHeaderCell label="Číslo průkazu" sortKey="cardNumber" sort={sort} onSort={toggleSort} />
              <SortableHeaderCell label="Jméno držitele" sortKey="name" sort={sort} onSort={toggleSort} />
              <TableCell>Typ průkazu</TableCell>
              <TableCell>Kategorie</TableCell>
              <SortableHeaderCell label="Platnost do" sortKey="cardExpiry" sort={sort} onSort={toggleSort} />
              <SortableHeaderCell label="Třída" sortKey="trida" sort={sort} onSort={toggleSort} />
              <SortableHeaderCell label="Ročník" sortKey="rocnik" sort={sort} onSort={toggleSort} />
              <TableCell>Stav</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', color: '#777', py: '32px' }}>
                  Žádné průkazy neodpovídají hledání „{search}“.
                </TableCell>
              </TableRow>
            )}
            {visible.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{p.cardNumber}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box
                    onClick={() => navigate(`/pripravna/osoba/${p.id}`)}
                    sx={{ cursor: 'pointer', textDecoration: 'underline', width: 'fit-content' }}
                  >
                    {p.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <CardTypeBadge type="ISIC" />
                </TableCell>
                <TableCell>
                  <RoleChip role={p.role} />
                </TableCell>
                <TableCell>{p.cardExpiry}</TableCell>
                <TableCell>{p.trida}</TableCell>
                <TableCell>{p.rocnik}</TableCell>
                <TableCell>
                  <StatusPill expiry={p.cardExpiry} />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                    <Button size="small" variant="outlined">
                      Duplikát
                    </Button>
                    <Button size="small" variant="outlined">
                      Prodloužit
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', mt: '16px' }}>
          <Button variant="outlined" size="small" startIcon={<ChevronLeftIcon />}>
            Prev
          </Button>
          {[1, 2, 3].map((n) => (
            <Button key={n} size="small" variant={n === 1 ? 'contained' : 'outlined'} sx={{ minWidth: 36, px: 0 }}>
              {n}
            </Button>
          ))}
          <Button variant="outlined" size="small" endIcon={<ChevronRightIcon />}>
            Next
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}

function StatusPill({ expiry }: { expiry: string }) {
  const active = expiry !== '—'
  return (
    <Box
      sx={{
        display: 'inline-block',
        borderRadius: '100px',
        px: '12px',
        py: '2px',
        fontSize: 13,
        fontWeight: 600,
        bgcolor: active ? '#e3f3f2' : '#f1f1f1',
        color: active ? '#12746f' : '#777',
      }}
    >
      {active ? 'Aktivní' : 'Bez platnosti'}
    </Box>
  )
}

function FilterField({ label }: { label: string }) {
  return (
    <TextField size="small" select defaultValue="all" label={label} sx={{ minWidth: 128 }}>
      <MenuItem value="all">Všechny</MenuItem>
    </TextField>
  )
}

function SortableHeaderCell({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; dir: 'asc' | 'desc' } | null
  onSort: (key: SortKey) => void
}) {
  const active = sort?.key === sortKey
  return (
    <TableCell onClick={() => onSort(sortKey)} sx={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {label}
        <ArrowDownwardIcon
          sx={{
            fontSize: 14,
            color: active ? '#000' : '#bbb',
            transform: active && sort?.dir === 'desc' ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        />
      </Box>
    </TableCell>
  )
}
