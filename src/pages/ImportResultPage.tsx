import { useNavigate } from 'react-router-dom'
import ImportWizardShell from '../layout/ImportWizardShell'
import ImportSummaryContent from '../components/ImportSummaryContent'
import { useFlow } from '../data/flowState'

export default function ImportResultPage() {
  const navigate = useNavigate()
  const { setPeopleImported } = useFlow()

  return (
    <ImportWizardShell
      step={2}
      onBack={() => navigate('/pripravna/import/kontrola')}
      onContinue={() => {
        setPeopleImported(true)
        navigate('/pripravna')
      }}
    >
      <ImportSummaryContent />
    </ImportWizardShell>
  )
}
