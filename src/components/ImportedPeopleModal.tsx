import { useEffect, useMemo, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { samplePeople } from '../data/samplePeople'

type SortKey = 'lastName' | 'firstName' | 'birthDate' | 'prukaz' | 'status'

// The real Figma prototype's "Výsledek kontroly" screen links "10 z nich." and
// "15 osob" to this same modal — just opened on a different tab — listing the
// actual imported people split by whether their data is complete.
export default function ImportedPeopleModal({
  open,
  onClose,
  initialTab,
}: {
  open: boolean
  onClose: () => void
  initialTab: 'complete' | 'incomplete'
}) {
  const [tab, setTab] = useState<'complete' | 'incomplete'>(initialTab)
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'lastName', dir: 'asc' })
  const [search, setSearch] = useState('')

  // Re-sync the active tab/search whenever the modal is (re)opened from a different link.
  useEffect(() => {
    if (open) {
      setTab(initialTab)
      setSearch('')
    }
  }, [open, initialTab])

  const complete = samplePeople.filter((p) => p.ready)
  const incomplete = samplePeople.filter((p) => !p.ready)
  const byTab = tab === 'complete' ? complete : incomplete

  const normalizedSearch = search.trim().toLowerCase()
  const rows = normalizedSearch
    ? byTab.filter(
        (p) =>
          p.firstName.toLowerCase().includes(normalizedSearch) ||
          p.lastName.toLowerCase().includes(normalizedSearch) ||
          p.email.toLowerCase().includes(normalizedSearch),
      )
    : byTab

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      const cmp = String(av).localeCompare(String(bv), 'cs')
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, sort])

  const toggleSort = (key: SortKey) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff',
          width: 860,
          maxWidth: '94vw',
          maxHeight: '86vh',
          overflowY: 'auto',
          p: '24px',
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '8px' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
            Importované osoby
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: '12px', minHeight: 0, borderBottom: '1px solid #e6e5e7', '& .MuiTab-root': { minHeight: 0, py: '8px' } }}
        >
          <Tab label="Kompletní data" value="complete" />
          <Tab label="Nekompletní data" value="incomplete" />
        </Tabs>

        <TextField
          size="small"
          placeholder="Hledat podle jména či emailu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280, mb: '12px' }}
        />

        <Table size="small">
          <TableHead>
            <TableRow>
              <SortableHeader label="Příjmení" sortKey="lastName" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Jméno" sortKey="firstName" sort={sort} onSort={toggleSort} />
              <TableCell>Kontaktní e-mail</TableCell>
              <SortableHeader label="Narozen" sortKey="birthDate" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Průkaz" sortKey="prukaz" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.lastName}</TableCell>
                <TableCell>{p.firstName}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.birthDate}</TableCell>
                <TableCell>{p.prukaz}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {p.ready ? (
                      <CheckIcon sx={{ fontSize: 16, color: '#2d8181' }} />
                    ) : (
                      <CloseIcon sx={{ fontSize: 16, color: '#aaa' }} />
                    )}
                    {p.ready ? 'Kompletní' : 'Nekompletní'}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#777', py: '24px' }}>
                  {normalizedSearch ? `Žádné osoby neodpovídají hledání „${search}“.` : 'Žádné osoby v této kategorii.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  )
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; dir: 'asc' | 'desc' }
  onSort: (key: SortKey) => void
}) {
  const active = sort.key === sortKey
  return (
    <TableCell
      onClick={() => onSort(sortKey)}
      sx={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {label}
        <ArrowDownwardIcon
          sx={{
            fontSize: 14,
            color: active ? '#000' : '#bbb',
            transform: active && sort.dir === 'desc' ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        />
      </Box>
    </TableCell>
  )
}
