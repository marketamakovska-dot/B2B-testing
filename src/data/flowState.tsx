import { createContext, useContext, useState, type ReactNode } from 'react'

// Very small shared "app state" so the prototype can remember whether people
// have been imported, which data-collection campaigns exist, and which
// orders have been placed — without needing a real backend.

export type Campaign = {
  id: number
  name: string
  sentDate: string
  totalPeople: number
  filledPeople: number
  status: 'probihajici' | 'ukoncena'
}

export type Order = {
  id: number
  name: string
  orderId: number
  productType: string
  status: string
  createdDate: string
  orderedDate: string
}

type FlowState = {
  peopleImported: boolean
  setPeopleImported: (v: boolean) => void
  importMethod: 'bakalari' | 'skolaonline' | 'edookit' | 'edupage' | 'manual' | null
  setImportMethod: (v: 'bakalari' | 'skolaonline' | 'edookit' | 'edupage' | 'manual' | null) => void
  campaigns: Campaign[]
  addCampaign: (c: Omit<Campaign, 'id' | 'status'>) => void
  endCampaign: (id: number) => void
  orders: Order[]
  addOrder: (o: Omit<Order, 'id'>) => void
  cancelOrder: (id: number) => void
  deleteOrder: (id: number) => void
}

const FlowContext = createContext<FlowState | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [peopleImported, setPeopleImported] = useState(false)
  const [importMethod, setImportMethod] = useState<'bakalari' | 'skolaonline' | 'edookit' | 'edupage' | 'manual' | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      name: '1277888',
      orderId: 22,
      productType: 'Digitální průkaz',
      status: 'Odeslaná',
      createdDate: '24.04.2025',
      orderedDate: '24.04.2025',
    },
    {
      id: 2,
      name: '456548997',
      orderId: 55,
      productType: 'Digitální průkaz',
      status: 'Odeslaná',
      createdDate: '24.04.2025',
      orderedDate: '24.04.2025',
    },
  ])

  const addCampaign = (c: Omit<Campaign, 'id' | 'status'>) => {
    setCampaigns((prev) => [...prev, { ...c, id: prev.length + 1, status: 'probihajici' }])
  }
  const endCampaign = (id: number) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'ukoncena' } : c)))
  }
  const addOrder = (o: Omit<Order, 'id'>) => {
    setOrders((prev) => [{ ...o, id: prev.length + 1 }, ...prev])
  }
  const cancelOrder = (id: number) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Zrušená' } : o)))
  }
  const deleteOrder = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  return (
    <FlowContext.Provider
      value={{
        peopleImported,
        setPeopleImported,
        importMethod,
        setImportMethod,
        campaigns,
        addCampaign,
        endCampaign,
        orders,
        addOrder,
        cancelOrder,
        deleteOrder,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
