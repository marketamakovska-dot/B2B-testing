import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Menu from '@mui/material/Menu'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AppShell from '../layout/AppShell'
import InfoModal from '../components/InfoModal'
import ConfirmModal from '../components/ConfirmModal'
import EmailPreviewModal from '../components/EmailPreviewModal'
import ZefektivnitModal from '../components/ZefektivnitModal'
import RoleChip from '../components/RoleChip'
import { useFlow } from '../data/flowState'
import { samplePeople, type Person } from '../data/samplePeople'

type SortKey = 'name' | 'birthDate' | 'trida' | 'rocnik' | 'prukaz' | 'role' | 'status' | 'platba' | 'smazeSeZa'

export default function PripravnaDataPage() {
  const navigate = useNavigate()
  const { peopleImported } = useFlow()
  // Local, mutable copy so the new contextual row actions (Smazat, Označit jako
  // zaplacené) can actually change the table, not just the static sample data.
  const [people, setPeople] = useState<Person[]>(samplePeople)
  const [formsOpen, setFormsOpen] = useState(false)
  const [printSelectedOpen, setPrintSelectedOpen] = useState(false)
  const [assignCardOpen, setAssignCardOpen] = useState(false)
  const [assignCardValue, setAssignCardValue] = useState('')
  const [zefektivnitOpen, setZefektivnitOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [search, setSearch] = useState('')
  const [filterBirth, setFilterBirth] = useState('')
  const [filterTrida, setFilterTrida] = useState('')
  const [filterRocnik, setFilterRocnik] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPrukaz, setFilterPrukaz] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null)
  const [rowMenu, setRowMenu] = useState<{ el: HTMLElement; personId: number } | null>(null)
  const [messagePerson, setMessagePerson] = useState<Person | null>(null)

  const readyCount = people.filter((p) => p.status === 'Kompletní').length
  const missingCount = people.length - readyCount

  // Filter dropdown options are derived from the values actually present in
  // the table (plus a couple of plausible extras), instead of the static
  // Figma frame's single decorative "Všechny" entry.
  const birthOptions = useMemo(() => {
    const real = Array.from(new Set(people.map((p) => p.birthDate)))
    const extra = ['1/11/1998'].filter((d) => !real.includes(d))
    return [...real, ...extra].sort()
  }, [people])
  const tridaOptions = useMemo(() => {
    const real = Array.from(new Set(people.map((p) => p.trida)))
    const extra = ['3B', '4A'].filter((t) => !real.includes(t))
    return [...real, ...extra].sort()
  }, [people])
  const rocnikOptions = useMemo(() => {
    const real = Array.from(new Set(people.map((p) => p.rocnik)))
    const extra = ['4.'].filter((r) => !real.includes(r))
    return [...real, ...extra].sort()
  }, [people])
  const prukazOptions = useMemo(() => {
    const real = Array.from(new Set(people.map((p) => p.prukaz)))
    const opts = real.map((v) => ({ value: v, label: v === '-' ? 'Bez průkazu' : v }))
    const extra = ['ITIC', 'ALIVE'].filter((t) => !real.includes(t)).map((t) => ({ value: t, label: t }))
    return [...opts, ...extra]
  }, [people])
  const roleOptions = useMemo(() => Array.from(new Set(people.map((p) => p.role))).sort(), [people])

  // "Hledat podle jména či emailu" plus the five dropdown filters — all real,
  // combinable substring/exact matches against the underlying data, not just
  // decorative like the static Figma frame.
  const normalizedSearch = search.trim().toLowerCase()
  const filteredPeople = people.filter((p) => {
    const matchesSearch =
      !normalizedSearch || p.name.toLowerCase().includes(normalizedSearch) || p.email.toLowerCase().includes(normalizedSearch)
    const matchesBirth = !filterBirth || p.birthDate === filterBirth
    const matchesTrida = !filterTrida || p.trida === filterTrida
    const matchesRocnik = !filterRocnik || p.rocnik === filterRocnik
    const matchesStatus = !filterStatus || p.status === filterStatus
    const matchesPrukaz = !filterPrukaz || p.prukaz === filterPrukaz
    const matchesRole = !filterRole || p.role === filterRole
    return matchesSearch && matchesBirth && matchesTrida && matchesRocnik && matchesStatus && matchesPrukaz && matchesRole
  })

  const visiblePeople = useMemo(() => {
    if (!sort) return filteredPeople
    const copy = [...filteredPeople]
    copy.sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), 'cs')
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filteredPeople, sort])

  const toggleSort = (key: SortKey) => {
    setSort((prev) => (prev?.key === key ? (prev.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }))
  }

  const allVisibleSelected = visiblePeople.length > 0 && visiblePeople.every((p) => selected.has(p.id))
  const someVisibleSelected = visiblePeople.some((p) => selected.has(p.id))

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) visiblePeople.forEach((p) => next.delete(p.id))
      else visiblePeople.forEach((p) => next.add(p.id))
      return next
    })
  }

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = () => {
    setPeople((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const handleMarkPaid = () => {
    setPeople((prev) => prev.map((p) => (selected.has(p.id) ? { ...p, platba: 'Zaplaceno' as const } : p)))
    setSelected(new Set())
  }

  const openAssignCard = () => {
    setAssignCardValue('')
    setAssignCardOpen(true)
  }

  // "Hromadné přiřazení vybraných osob k průkazům" — confirming actually
  // writes the chosen card type onto every selected row (and updates its
  // platnost), instead of the old modal that only showed a video placeholder
  // and never touched the table.
  const handleAssignCard = () => {
    if (assignCardValue) {
      setPeople((prev) =>
        prev.map((p) =>
          selected.has(p.id)
            ? { ...p, prukaz: assignCardValue, cardExpiry: assignCardValue === '-' ? '—' : '31.08.2026' }
            : p,
        ),
      )
    }
    setAssignCardOpen(false)
    setSelected(new Set())
  }

  // The per-row "⋮" menu (Upravit / Zaplaceno / Vytisknout formulář / Odeslat
  // zprávu / Přiřadit průkaz / Smazat) from the Figma dropdown — wired to real
  // row actions instead of being a static, non-functional icon button.
  const closeRowMenu = () => setRowMenu(null)
  const rowMenuPerson = rowMenu ? people.find((p) => p.id === rowMenu.personId) ?? null : null

  const handleRowEdit = () => {
    if (rowMenuPerson) navigate(`/pripravna/osoba/${rowMenuPerson.id}`)
    closeRowMenu()
  }
  const handleRowMarkPaid = () => {
    if (rowMenuPerson) {
      setPeople((prev) => prev.map((p) => (p.id === rowMenuPerson.id ? { ...p, platba: 'Zaplaceno' as const } : p)))
    }
    closeRowMenu()
  }
  const handleRowPrint = () => {
    if (rowMenuPerson) {
      setSelected(new Set([rowMenuPerson.id]))
      setPrintSelectedOpen(true)
    }
    closeRowMenu()
  }
  const handleRowSendMessage = () => {
    if (rowMenuPerson) setMessagePerson(rowMenuPerson)
    closeRowMenu()
  }
  const handleRowAssignCard = () => {
    if (rowMenuPerson) {
      setSelected(new Set([rowMenuPerson.id]))
      openAssignCard()
    }
    closeRowMenu()
  }
  const handleRowDelete = () => {
    if (rowMenuPerson) {
      const id = rowMenuPerson.id
      setPeople((prev) => prev.filter((p) => p.id !== id))
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
    closeRowMenu()
  }

  return (
    <AppShell active="pripravna">
      <Box sx={{ px: '60px', py: '48px' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px', mb: '32px', flexWrap: 'wrap' }}>
          <Box sx={{ maxWidth: 700, flex: '1 1 320px', minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 40, mb: '16px' }}>
              Příprava dat
            </Typography>
            <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontSize: 18, color: '#000' }}>
              Zde sbíráte osobní údaje pro objednánní nových průkazů. Pokud pro osobu neobjednáte průkaz do 30 dnů od
              nahrání dat, jejich údaje budou smazány.
            </Typography>
          </Box>

          {peopleImported && (
            // ml: 'auto' (rather than justifyContent: 'space-between' on the
            // parent) keeps this block right-aligned even when it wraps onto its
            // own line on narrower viewports — space-between would otherwise pin
            // a lone wrapped item to the left edge instead of the right.
            <Box sx={{ textAlign: 'right', ml: 'auto', minWidth: 0, maxWidth: '100%' }}>
              <Box sx={{ height: 4, bgcolor: '#e6e5e7', mb: '8px', minWidth: 160 }}>
                <Box
                  sx={{
                    height: '100%',
                    width: people.length ? `${(readyCount / people.length) * 100}%` : '0%',
                    bgcolor: '#000',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: 14, mb: '12px', whiteSpace: 'nowrap' }}>
                Průkaz lze objednat pro <b>{readyCount} osob</b> z {people.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<DescriptionOutlinedIcon />} onClick={() => setFormsOpen(true)}>
                  Formuláře
                </Button>
                <Button variant="outlined" startIcon={<MailOutlineIcon />} onClick={() => navigate('/pripravna/sber-podkladu')}>
                  Sběr podkladů
                </Button>
                <Button variant="contained" onClick={() => navigate('/pripravna/objednat')}>
                  Objednat průkazy
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {!peopleImported ? (
          <Box
            sx={{
              bgcolor: '#f1f1f1',
              minHeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
              <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 24, textAlign: 'center' }}>
                Zatím zde nemáte žádné osoby
              </Typography>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadOutlinedIcon />}
                  onClick={() => navigate('/pripravna/import')}
                >
                  Importovat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={() => navigate('/pripravna/pridat-osoby')}
                >
                  Přidat osoby manuálně
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap', mb: '16px' }}>
              <TextField
                size="small"
                placeholder="Hledat podle jména či emailu"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 190 }}
              />
              <FilterField
                label="Datum narození"
                value={filterBirth}
                onChange={setFilterBirth}
                options={birthOptions.map((b) => ({ value: b, label: b }))}
              />
              <FilterField
                label="Třída"
                value={filterTrida}
                onChange={setFilterTrida}
                options={tridaOptions.map((t) => ({ value: t, label: t }))}
              />
              <FilterField
                label="Ročník"
                value={filterRocnik}
                onChange={setFilterRocnik}
                options={rocnikOptions.map((r) => ({ value: r, label: r }))}
              />
              <FilterField label="Průkaz" value={filterPrukaz} onChange={setFilterPrukaz} options={prukazOptions} />
              <FilterField
                label="Role"
                value={filterRole}
                onChange={setFilterRole}
                options={roleOptions.map((r) => ({ value: r, label: r }))}
              />
              <FilterField
                label="Status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'Kompletní', label: 'Kompletní' },
                  { value: 'Nedokončeno', label: 'Nedokončeno' },
                ]}
              />
              <Button variant="outlined" size="small" sx={{ height: 40 }}>
                Filtrovat
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {selected.size > 0 && (
                  <>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                      {selected.size} vybráno
                    </Typography>
                    <Button variant="outlined" size="small" startIcon={<DeleteOutlineOutlinedIcon />} onClick={handleDelete}>
                      Smazat
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<PrintOutlinedIcon />} onClick={() => setPrintSelectedOpen(true)}>
                      Vytisknout formulář
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<CreditCardOutlinedIcon />} onClick={openAssignCard}>
                      Přiřadit průkaz
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<PaidOutlinedIcon />} onClick={handleMarkPaid}>
                      Označit jako zaplacené
                    </Button>
                  </>
                )}
              </Box>
              {/* ml: 'auto' keeps this pinned to the right of the row even when
                  it wraps onto its own line on narrow viewports. */}
              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', ml: 'auto', justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => navigate('/pripravna/import')}>
                  Importovat osoby
                </Button>
                <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => navigate('/pripravna/pridat-osoby')}>
                  Přidat osoby
                </Button>
              </Box>
            </Box>

            {missingCount > 0 && !bannerDismissed && (
              <Box
                sx={{
                  bgcolor: '#f1f1f1',
                  px: '20px',
                  py: '14px',
                  mb: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{missingCount} osob má ještě neúplná data.</Typography>
                  <Typography sx={{ fontSize: 14 }}>Chcete zefektivnit sběr fotek a chybějících údajů?</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', ml: 'auto', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => setZefektivnitOpen(true)}
                  >
                    Jak jednoduše doplnit data?
                  </Button>
                  <IconButton size="small" onClick={() => setBannerDismissed(true)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected && !allVisibleSelected}
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                  <SortableHeaderCell label="Jméno" sortKey="name" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Narozen" sortKey="birthDate" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Třída" sortKey="trida" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Ročník" sortKey="rocnik" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Průkaz" sortKey="prukaz" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Role" sortKey="role" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Platba" sortKey="platba" sort={sort} onSort={toggleSort} />
                  <SortableHeaderCell label="Smaže se za" sortKey="smazeSeZa" sort={sort} onSort={toggleSort} />
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {visiblePeople.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', color: '#777', py: '32px' }}>
                      {search ? `Žádné osoby neodpovídají hledání „${search}“.` : 'Žádné osoby neodpovídají zvoleným filtrům.'}
                    </TableCell>
                  </TableRow>
                )}
                {visiblePeople.map((person) => (
                  <TableRow key={person.id} hover selected={selected.has(person.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.has(person.id)} onChange={() => toggleSelect(person.id)} />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box
                        onClick={() => navigate(`/pripravna/osoba/${person.id}`)}
                        sx={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', width: 'fit-content' }}
                      >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#e6e5e7', color: '#8a8a8a', flexShrink: 0 }}>
                          <PersonOutlineOutlinedIcon fontSize="small" />
                        </Avatar>
                        <Box component="span" sx={{ textDecoration: 'underline' }}>{person.name}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>{person.birthDate}</TableCell>
                    <TableCell>{person.trida}</TableCell>
                    <TableCell>{person.rocnik}</TableCell>
                    <TableCell>{person.prukaz}</TableCell>
                    <TableCell>
                      <RoleChip role={person.role} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {person.status === 'Kompletní' && <CheckIcon sx={{ fontSize: 18, color: '#2d8181' }} />}
                        {person.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {person.platba === 'Zaplaceno' && <CheckIcon sx={{ fontSize: 18, color: '#2d8181' }} />}
                        {person.platba}
                      </Box>
                    </TableCell>
                    <TableCell>{person.smazeSeZa}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => setRowMenu({ el: e.currentTarget, personId: person.id })}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', mt: '16px' }}>
              <Button variant="outlined" size="small" startIcon={<ChevronLeftIcon />}>
                Prev
              </Button>
              {[1, 2, 3, 4].map((n) => (
                <Button key={n} size="small" variant={n === 1 ? 'contained' : 'outlined'} sx={{ minWidth: 36, px: 0 }}>
                  {n}
                </Button>
              ))}
              <Button variant="outlined" size="small" endIcon={<ChevronRightIcon />}>
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Menu anchorEl={rowMenu?.el ?? null} open={Boolean(rowMenu)} onClose={closeRowMenu}>
        <MenuItem onClick={handleRowEdit}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Upravit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowMarkPaid}>
          <ListItemIcon><PaidOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Zaplaceno</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowPrint}>
          <ListItemIcon><PrintOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Vytisknout formulář</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowSendMessage}>
          <ListItemIcon><MailOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Odeslat zprávu</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowAssignCard}>
          <ListItemIcon><CreditCardOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Přiřadit průkaz</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowDelete}>
          <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Smazat</ListItemText>
        </MenuItem>
      </Menu>

      <EmailPreviewModal
        open={!!messagePerson}
        onClose={() => setMessagePerson(null)}
        campaignName={`Doplnění údajů — ${messagePerson?.name ?? ''}`}
        reminder
      />

      <InfoModal
        open={formsOpen}
        onClose={() => setFormsOpen(false)}
        title="Formuláře k tisku"
        description="Stáhněte si papírové formuláře pro osoby, které nemohou vyplnit údaje online."
      />
      <ConfirmModal
        open={printSelectedOpen}
        onClose={() => setPrintSelectedOpen(false)}
        onConfirm={() => setPrintSelectedOpen(false)}
        title={`Opravdu chcete pro ${selected.size} ${pluralOsoby(selected.size)} připravit formuláře k tisku?`}
        description="Formuláře vám budou odeslány ve formátu .zip na váš e-mail."
      />
      <ConfirmModal
        open={assignCardOpen}
        onClose={() => setAssignCardOpen(false)}
        onConfirm={handleAssignCard}
        title="Hromadné přiřazení vybraných osob k průkazům"
        description={`Vyberte typ průkazu, který bude hromadně přiřazen ke ${selected.size} ${pluralOsoby(selected.size)}, které jste vybrali.`}
      >
        <Box sx={{ mb: '4px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '6px' }}>Průkaz</Typography>
          <Select
            fullWidth
            size="small"
            displayEmpty
            value={assignCardValue}
            onChange={(e) => setAssignCardValue(e.target.value)}
          >
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            <MenuItem value="-">Bez průkazu</MenuItem>
            <MenuItem value="ISIC">ISIC</MenuItem>
            <MenuItem value="ITIC">ITIC</MenuItem>
            <MenuItem value="ISIC SCHOLAR">ISIC SCHOLAR</MenuItem>
            <MenuItem value="ALIVE">ALIVE</MenuItem>
          </Select>
        </Box>
      </ConfirmModal>
      <ZefektivnitModal
        open={zefektivnitOpen}
        onClose={() => setZefektivnitOpen(false)}
        readyCount={readyCount}
        missingCount={missingCount}
      />
    </AppShell>
  )
}

// Czech noun plural forms for "osoba" ("1 osobu", "2-4 osoby", "5+ osob").
function pluralOsoby(n: number) {
  if (n === 1) return 'osobu'
  if (n >= 2 && n <= 4) return 'osoby'
  return 'osob'
}

function FilterField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <TextField
      size="small"
      select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      sx={{ width: 108 }}
    >
      <MenuItem value="">Všechny</MenuItem>
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
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
