import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CloseIcon from '@mui/icons-material/Close'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AppShell from '../layout/AppShell'
import ConfirmDeleteOrderModal from '../components/ConfirmDeleteOrderModal'
import { useFlow } from '../data/flowState'
import { samplePeople } from '../data/samplePeople'

// Order line items aren't tracked per-order in this prototype's data model —
// this mirrors the representative product breakdown shown on the Figma
// "Objednávka" detail screen (node 5417:98089).
const PRODUCT_ROWS = [
  { name: 'ISIC průkazy', qty: 20, unit: '300 Kč', total: '6 000 Kč' },
  { name: 'bonusové body', qty: 2, unit: '2000b', total: '-200 Kč' },
  { name: 'ITIC průkazy', qty: 20, unit: '300 Kč', total: '6 000 Kč' },
]

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, cancelOrder, deleteOrder } = useFlow()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [search, setSearch] = useState('')

  const order = orders.find((o) => String(o.id) === id)

  if (!order) {
    return (
      <AppShell active="objednavky">
        <Box sx={{ px: '60px', py: '48px' }}>
          <Typography sx={{ fontSize: 16, color: '#777' }}>Tato objednávka již neexistuje.</Typography>
          <Button variant="outlined" sx={{ mt: '16px' }} onClick={() => navigate('/objednavky')}>
            Zpět na objednávky
          </Button>
        </Box>
      </AppShell>
    )
  }

  const canCancel = order.status === 'Odeslaná'
  const normalizedSearch = search.trim().toLowerCase()
  const people = samplePeople
    .slice(0, 6)
    .filter((p) => !normalizedSearch || p.name.toLowerCase().includes(normalizedSearch))

  return (
    <AppShell active="objednavky">
      <Box sx={{ px: '60px', py: '32px' }}>
        <Box
          onClick={() => navigate('/objednavky')}
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', mb: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 32 }}>
              Objednávka: {order.name}
            </Typography>
            <Chip label={order.status} size="small" sx={{ borderRadius: '6px' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineOutlinedIcon />}
              sx={{ borderRadius: 0 }}
              onClick={() => setDeleteOpen(true)}
            >
              Smazat
            </Button>
            {canCancel && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloseIcon />}
                sx={{ borderRadius: 0 }}
                onClick={() => cancelOrder(order.id)}
              >
                Zrušit objednávku
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap', mb: '32px', alignItems: 'flex-start' }}>
          <Box sx={{ border: '1px solid #e6e5e7', borderRadius: '4px', p: '24px', flex: '1 1 400px' }}>
            <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '20px' }}>
              Obecné
            </Typography>
            <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <Box>
                <Typography sx={{ fontSize: 14, color: '#434168', mb: '4px' }}>Typ produktu</Typography>
                <Typography sx={{ fontSize: 14, color: '#1a1633' }}>{order.productType}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, color: '#434168', mb: '4px' }}>Autor objednávky</Typography>
                <Typography sx={{ fontSize: 14, color: '#1a1633' }}>Adam Krakov</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: '20px' }}>
              <Typography sx={{ fontSize: 14, color: '#434168', mb: '4px' }}>Vydavatel</Typography>
              <Typography sx={{ fontSize: 14, color: '#1a1633' }}>A co čistě virutální škola</Typography>
            </Box>
          </Box>

          <Box sx={{ border: '1px solid #e6e5e7', borderRadius: '4px', p: '24px', flex: '1 1 340px' }}>
            <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '20px' }}>
              Produkty
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ px: 0 }}>PRODUKT</TableCell>
                  <TableCell>MNOŽSTVÍ</TableCell>
                  <TableCell align="right" sx={{ pr: 0 }}>
                    CENA
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PRODUCT_ROWS.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell sx={{ px: 0, color: row.name === 'bonusové body' ? '#777' : undefined, pl: row.name === 'bonusové body' ? '16px' : 0 }}>
                      {row.name}
                    </TableCell>
                    <TableCell>{row.qty}</TableCell>
                    <TableCell align="right" sx={{ pr: 0 }}>
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ px: 0, fontWeight: 700 }}>Celkem</TableCell>
                  <TableCell />
                  <TableCell align="right" sx={{ pr: 0, fontWeight: 700 }}>
                    11 800 Kč
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: 20, mb: '16px' }}>
          Osoby, pro které objednáváte průkaz
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mb: '16px' }}>
          <TextField
            size="small"
            placeholder="Hledat podle jména"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 240 }}
          />
          <TextField size="small" select defaultValue="all" label="Třída" sx={{ minWidth: 128 }}>
            <MenuItem value="all">Všechny</MenuItem>
          </TextField>
          <TextField size="small" select defaultValue="all" label="Narozen" sx={{ minWidth: 128 }}>
            <MenuItem value="all">Všechny</MenuItem>
          </TextField>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jméno</TableCell>
              <TableCell>Třída</TableCell>
              <TableCell>Narozen</TableCell>
              <TableCell>Průkaz</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {people.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: '#777', py: '32px' }}>
                  Žádné osoby neodpovídají hledání „{search}“.
                </TableCell>
              </TableRow>
            )}
            {people.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#e6e5e7', color: '#8a8a8a', flexShrink: 0 }}>
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </Avatar>
                    {p.name}
                  </Box>
                </TableCell>
                <TableCell>{p.trida}</TableCell>
                <TableCell>{p.birthDate}</TableCell>
                <TableCell>{p.prukaz}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <ConfirmDeleteOrderModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteOrder(order.id)
          setDeleteOpen(false)
          navigate('/objednavky')
        }}
      />
    </AppShell>
  )
}
