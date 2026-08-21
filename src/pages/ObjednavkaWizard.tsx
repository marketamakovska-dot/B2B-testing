import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import WizardShell, { type WizardStep } from '../layout/WizardShell'
import { useFlow } from '../data/flowState'
import { samplePeople } from '../data/samplePeople'

const PRICE_PER_CARD = { digital: 55, 'digital-plast': 150 }

export default function ObjednavkaWizard() {
  const navigate = useNavigate()
  const { addOrder } = useFlow()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [nazev, setNazev] = useState('')
  const [productType, setProductType] = useState<'digital' | 'digital-plast'>('digital')
  const [useBonus, setUseBonus] = useState(false)

  // Only people with complete data can be ordered — mirrors "Průkaz lze objednat pro X osob" on Přípravna dat.
  const readyPeople = samplePeople.filter((p) => p.status === 'Kompletní')

  const steps: WizardStep[] = [
    { label: 'Výběr produktu', state: step === 1 ? 'active' : 'done' },
    { label: 'Kontrola dat', state: step === 2 ? 'active' : step > 2 ? 'done' : 'todo' },
    { label: 'Shrnutí', state: step === 3 ? 'active' : 'todo' },
  ]

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3)
    else navigate('/pripravna')
  }

  const handleContinue = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3)
      return
    }
    const today = new Date().toLocaleDateString('cs-CZ')
    addOrder({
      name: nazev || `Objednávka ${readyPeople.length} průkazů`,
      orderId: 100 + readyPeople.length,
      productType: productType === 'digital' ? 'Digitální průkaz' : 'Digitální a fyzický průkaz',
      status: 'Odeslaná',
      createdDate: today,
      orderedDate: today,
    })
    navigate('/objednavky', { state: { justOrdered: true } })
  }

  const pricePerCard = PRICE_PER_CARD[productType]
  const totalPrice = readyPeople.length * pricePerCard

  return (
    <WizardShell
      active="objednavky"
      title="Objednávka průkazů"
      steps={steps}
      onBack={handleBack}
      onContinue={handleContinue}
      continueLabel={step === 3 ? 'Odeslat objednávku' : 'Pokračovat'}
      continueDisabled={step === 1 && !nazev.trim()}
    >
      {step === 1 && (
        <Box sx={{ maxWidth: 700 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 24, mb: '4px' }}>Objednávka průkazů</Typography>
          <Typography sx={{ fontSize: 16, mb: '24px' }}>
            Objednáváte průkazy <b>ISIC</b> pro {readyPeople.length} osob z přípravny dat.
          </Typography>

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '8px' }}>Název objednávky</Typography>
          <TextField fullWidth value={nazev} onChange={(e) => setNazev(e.target.value)} sx={{ mb: '32px', maxWidth: 400 }} />

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '12px' }}>Jaké typy průkazu chcete objednat?</Typography>
          <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <OrderOption
              label="Pouze digitální průkaz"
              desc="Jedná se o průkaz v digitální podobě, který je dostupný v naší aplikaci Alive App."
              selected={productType === 'digital'}
              onClick={() => setProductType('digital')}
            />
            <OrderOption
              label="Digitální a plastový průkaz"
              desc="Jedná se o fyzický plastový průkaz společně s průkazem v digitální podobě, který je dostupný v naší aplikaci Alive App."
              selected={productType === 'digital-plast'}
              onClick={() => setProductType('digital-plast')}
            />
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 22, mb: '4px' }}>Zkontrolujte seznam osob, pro které budete objednávat</Typography>
          <Typography sx={{ fontSize: 14, mb: '16px' }}>Přidali jste celkem {readyPeople.length} <u>osob</u>.</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox defaultChecked /></TableCell>
                <TableCell>Jméno</TableCell>
                <TableCell>Třída</TableCell>
                <TableCell>Narozen</TableCell>
                <TableCell>Průkaz</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {readyPeople.map((p) => (
                <TableRow key={p.id}>
                  <TableCell padding="checkbox"><Checkbox defaultChecked /></TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.trida}</TableCell>
                  <TableCell>{p.birthDate}</TableCell>
                  <TableCell>{p.prukaz}</TableCell>
                  <TableCell align="right">
                    <EditOutlinedIcon fontSize="small" sx={{ color: '#777', cursor: 'pointer' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {step === 3 && (
        <Box sx={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 320 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 24, mb: '16px' }}>
              Shrnutí objednávky {productType === 'digital' ? 'digitálních' : 'digitálních a plastových'} průkazů
            </Typography>
            <Box sx={{ bgcolor: '#2b2955', color: '#fff', px: '16px', py: '10px', mb: '16px', fontSize: 14 }}>
              Faktury vám vystavíme souhrnně za všechny objednávky za tento měsíc k poslednímu dni kalendářního měsíce.
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Produkt</TableCell>
                  <TableCell>Cena/ks</TableCell>
                  <TableCell>Cena celkem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {readyPeople.length} × {productType === 'digital' ? 'digitální' : 'digitální a plastový'} ISIC průkazy
                  </TableCell>
                  <TableCell>{pricePerCard.toFixed(2)} Kč</TableCell>
                  <TableCell>{totalPrice.toFixed(2)} Kč</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                    Celkem
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{totalPrice.toFixed(2)} Kč</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ width: 300 }}>
            <Box sx={{ border: '1px solid #e6e5e7', p: '20px', mb: '24px' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, mb: '8px' }}>Bonusový systém</Typography>
              <Typography sx={{ fontSize: 14 }}>
                Vaše dostupné body: <b>2000b</b>
              </Typography>
              <Typography sx={{ fontSize: 14, mb: '8px' }}>
                Můžete na objednávce ušetřit až: <b>2000 Kč</b>.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Checkbox checked={useBonus} onChange={(e) => setUseBonus(e.target.checked)} size="small" sx={{ p: 0, mt: '-2px' }} />
                <Typography sx={{ fontSize: 14 }}>Chci využít bonusové body pro snížení ceny objednávky</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: '8px' }}>Doručení</Typography>
            <Typography sx={{ fontSize: 14 }}>Doručení na adresu:</Typography>
            <Typography sx={{ fontSize: 14, mb: '12px' }}>Gymnázium Křenová, Křenová 36, Brno, 602 00</Typography>
            <Typography sx={{ fontSize: 14 }}>Kontaktní osoba:</Typography>
            <Typography sx={{ fontSize: 14, mb: '16px' }}>Anna Nováková, 602 444 888, anna@novakova.cz</Typography>
            <Button variant="outlined" size="small">
              Změnit doručovací údaje
            </Button>
          </Box>
        </Box>
      )}
    </WizardShell>
  )
}

function OrderOption({ label, desc, selected, onClick }: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{ flex: 1, minWidth: 260, border: selected ? '2px solid #000' : '1px solid #e6e5e7', p: '20px', cursor: 'pointer', display: 'flex', gap: '12px' }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1px solid #000',
          flexShrink: 0,
          mt: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#000' }} />}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 16, mb: '4px' }}>{label}</Typography>
        <Typography sx={{ fontSize: 13 }}>{desc}</Typography>
      </Box>
    </Box>
  )
}
