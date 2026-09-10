import React, { createContext, useContext, useState, type ReactNode } from 'react'

export interface CustomerStatusRecord {
  id: string
  name: string
  isActive: boolean
  deactivationReason?: string
  deactivatedAt?: string
  leadCount?: number
  applicationCount?: number
}

interface CustomerContextType {
  customerRecords: Record<string, CustomerStatusRecord>
  isCustomerActive: (name: string) => boolean
  getCustomerRecord: (name: string) => CustomerStatusRecord | undefined
  deactivateCustomer: (name: string, reason: string) => void
  reactivateCustomer: (name: string) => void
  toggleCustomerStatus: (name: string, reason?: string) => void
}

const DEFAULT_CUSTOMERS: Record<string, CustomerStatusRecord> = {
  'Rahul Sharma': { id: 'cust-1', name: 'Rahul Sharma', isActive: true, leadCount: 1, applicationCount: 1 },
  'Meera Nair': { id: 'cust-2', name: 'Meera Nair', isActive: true, leadCount: 1, applicationCount: 1 },
  'Rajesh Varma': { id: 'cust-3', name: 'Rajesh Varma', isActive: true, leadCount: 1, applicationCount: 1 },
  'Vikram Patel': { id: 'cust-4', name: 'Vikram Patel', isActive: true, leadCount: 1, applicationCount: 1 },
  'Anita Desai': { id: 'cust-5', name: 'Anita Desai', isActive: true, leadCount: 1, applicationCount: 1 },
  'Suresh Kulkarni': { id: 'cust-6', name: 'Suresh Kulkarni', isActive: true, leadCount: 1, applicationCount: 1 },
  'Rohan Mehta': { id: 'cust-7', name: 'Rohan Mehta', isActive: true, leadCount: 0, applicationCount: 1 },
  'Ananya Iyer': { id: 'cust-8', name: 'Ananya Iyer', isActive: true, leadCount: 0, applicationCount: 1 },
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerRecords, setCustomerRecords] = useState<Record<string, CustomerStatusRecord>>(DEFAULT_CUSTOMERS)

  const isCustomerActive = (name: string): boolean => {
    const record = customerRecords[name]
    return record ? record.isActive : true
  }

  const getCustomerRecord = (name: string): CustomerStatusRecord | undefined => customerRecords[name]

  const deactivateCustomer = (name: string, reason: string) => {
    setCustomerRecords((prev) => {
      const existing = prev[name] || { id: `cust-${Date.now()}`, name, isActive: true, leadCount: 1, applicationCount: 1 }
      return {
        ...prev,
        [name]: { ...existing, isActive: false, deactivationReason: reason, deactivatedAt: new Date().toISOString() },
      }
    })
  }

  const reactivateCustomer = (name: string) => {
    setCustomerRecords((prev) => {
      const existing = prev[name] || { id: `cust-${Date.now()}`, name, isActive: false, leadCount: 1, applicationCount: 1 }
      return {
        ...prev,
        [name]: { ...existing, isActive: true, deactivationReason: undefined, deactivatedAt: undefined },
      }
    })
  }

  const toggleCustomerStatus = (name: string, reason?: string) => {
    if (isCustomerActive(name)) {
      deactivateCustomer(name, reason || 'Customer requested deactivation')
    } else {
      reactivateCustomer(name)
    }
  }

  return (
    <CustomerContext.Provider
      value={{ customerRecords, isCustomerActive, getCustomerRecord, deactivateCustomer, reactivateCustomer, toggleCustomerStatus }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomer must be used within a CustomerProvider')
  return context
}
