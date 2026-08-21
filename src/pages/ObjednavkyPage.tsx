import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import AppShell from '../layout/AppShell'
import { useFlow } from '../data/flowState'

export default function ObjednavkyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orders } = useFlow()
  const [tab, setTab] = useState<'prodlouzeni' | 'prukazy' | 'duplikaty'>('prukazy')
  const [toastOpen, setToastOpen] = useState(Boolean((location.state as { justOrdered?: boolean } | null)?.justOrdered))
  const [search, setSearch] = useState('')

  // Real substring match against name/ID, same behaviour as the "Hledat" box on Přípravna dat.
  const normalizedSearch = search.trim().toLowerCase()
  const visibleOrders = normalizedSearch
    ? orders.filter(
        (o) => o.name.toLowerCase().includes(normalizedSearch) || String(o.orderId).toLowerCase().includes(normalizedSearch),
      )
    : orders

  return (
    <AppShell active="objednavky">
      <Box sx={{ px: '60px', py: '48px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32 }}>Objednávky</Typography>
          <Button variant="contained" onClick={() => navigate('/pripravna/objednat')}>
            Objednat průkazy
          </Button>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: '24px', minHeight: 0, borderBottom: '1px solid #e6e5e7', '& .MuiTab-root': { minHeight: 0, py: '8px' } }}
        >
          <Tab label="Prodloužení platnosti" value="prodlouzeni" />
          <Tab label="Průkazy" value="prukazy" />
          <Tab label="Duplikáty" value="duplikaty" />
        </Tabs>

        {tab === 'prodlouzeni' || tab === 'duplikaty' ? (
          <Box
            sx={{
              bgcolor: '#f1f1f1',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', maxWidth: 420 }}>
              <Typography sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20 }}>
                {tab === 'prodlouzeni' ? 'Zatím žádná prodloužení platnosti' : 'Zatím žádné duplikáty'}
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#666' }}>
                {tab === 'prodlouzeni'
                  ? 'Prodloužení platnosti průkazu můžete objednat ze Správy průkazů u konkrétní osoby.'
                  : 'Duplikát ztraceného nebo poškozeného průkazu můžete objednat ze Správy průkazů u konkrétní osoby.'}
              </Typography>
              <Button variant="contained" onClick={() => navigate('/sprava-prukazu')}>
                Přejít do Správy průkazů
              </Button>
            </Box>
          </Box>
        ) : orders.length === 0 ? (
          <Typography sx={{ fontSize: 16, color: '#777' }}>Zatím jste nevytvořili žádnou objednávku.</Typography>
        ) : (
          <>
            <TextField
              size="small"
              placeholder="Hledat podle jména objednávky či ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 280, mb: '16px' }}
            />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Jméno objednávky</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Typ produktu</TableCell>
                  <TableCell>Stav</TableCell>
                  <TableCell>Vytvořeno</TableCell>
                  <TableCell>Objednáno</TableCell>
                  <TableCell align="right">Akce</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#777', py: '32px' }}>
                      Žádné objednávky neodpovídají hledání „{search}“.
                    </TableCell>
                  </TableRow>
                )}
                {visibleOrders.map((o) => (
                  <TableRow key={o.id} hover>
                    <TableCell>
                      <Box
                        component="span"
                        onClick={() => navigate(`/objednavky/${o.id}`)}
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        {o.name}
                      </Box>
                    </TableCell>
                    <TableCell>{o.orderId}</TableCell>
                    <TableCell>{o.productType}</TableCell>
                    <TableCell>{o.status}</TableCell>
                    <TableCell>{o.createdDate}</TableCell>
                    <TableCell>{o.orderedDate}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" color="secondary">
                        Zrušit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Box>

      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message="Vaše objednávka byla odeslána"
        action={
          <>
            <Button color="secondary" size="small" onClick={() => setToastOpen(false)}>
              Zrušit
            </Button>
            <IconButton size="small" color="inherit" onClick={() => setToastOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </AppShell>
  )
}
