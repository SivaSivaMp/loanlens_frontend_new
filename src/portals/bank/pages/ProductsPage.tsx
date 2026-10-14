import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Eye,
  ChevronDown,
  X,
  Check,
} from 'lucide-react'
import type { LoanType } from '../types/bank.types'

export interface ProductItem {
  id: string
  name: string
  updatedAt: string
  type: LoanType
  interestRate: string
  impressions: number | null
  applications: number | null
  status: 'active' | 'inactive' | 'draft'
}

const initialProducts: ProductItem[] = [
  { id: '1', name: 'SBI Home Loan', updatedAt: 'Updated 3 days ago', type: 'HOME', interestRate: '8.50% – 9.85%', impressions: 1240, applications: 45, status: 'active' },
  { id: '2', name: 'SBI Personal Loan', updatedAt: 'Updated 1 week ago', type: 'PERSONAL', interestRate: '10.50% – 14.00%', impressions: 890, applications: 32, status: 'active' },
  { id: '3', name: 'SBI Car Loan', updatedAt: 'Updated 5 days ago', type: 'CAR', interestRate: '8.80% – 10.25%', impressions: 654, applications: 28, status: 'active' },
  { id: '4', name: 'SBI Gold Loan', updatedAt: 'Updated 2 weeks ago', type: 'GOLD', interestRate: '9.50% – 11.00%', impressions: 124, applications: 3, status: 'inactive' },
  { id: '5', name: 'SBI Business Loan', updatedAt: 'Updated 4 days ago', type: 'BUSINESS', interestRate: '11.00% – 15.00%', impressions: 340, applications: 12, status: 'active' },
  { id: '6', name: 'SBI LAP', updatedAt: 'Created yesterday', type: 'LAP', interestRate: '9.80% – 12.00%', impressions: null, applications: null, status: 'draft' },
]

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'ALL' || item.type === selectedType
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus.toLowerCase()
      return matchesSearch && matchesType && matchesStatus
    })
  }, [products, searchQuery, selectedType, selectedStatus])

  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === 'draft') return item
          return { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        }
        return item
      })
    )
  }

  const getTypeBadgeStyle = (type: LoanType) => {
    switch (type) {
      case 'HOME': return 'bg-indigo-50 text-[#4648d4] border-indigo-100'
      case 'PERSONAL': return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'CAR': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'GOLD': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'BUSINESS': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'LAP': return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto pb-12">
      {/* Top Actions Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Loan Type Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowStatusDropdown(false) }}
              className="h-10 px-3.5 rounded-xl border border-slate-200/90 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Loan Type: {selectedType === 'ALL' ? 'All Types' : selectedType}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showTypeDropdown && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                {['ALL', 'HOME', 'PERSONAL', 'CAR', 'GOLD', 'BUSINESS', 'LAP'].map((type) => (
                  <button key={type} onClick={() => { setSelectedType(type); setShowTypeDropdown(false) }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors flex items-center justify-between ${selectedType === type ? 'bg-indigo-50 text-[#4648d4] font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{type === 'ALL' ? 'All Types' : type}</span>
                    {selectedType === type && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowTypeDropdown(false) }}
              className="h-10 px-3.5 rounded-xl border border-slate-200/90 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Status: {selectedStatus === 'ALL' ? 'All Statuses' : selectedStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showStatusDropdown && (
              <div className="absolute left-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                {['ALL', 'Active', 'Inactive', 'Draft'].map((status) => (
                  <button key={status} onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false) }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors flex items-center justify-between ${selectedStatus === status ? 'bg-indigo-50 text-[#4648d4] font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{status === 'ALL' ? 'All Statuses' : status}</span>
                    {selectedStatus === status && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link
          to="/bank/products/new"
          className="h-10 px-5 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center gap-2 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loan Type</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interest Rate</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Impressions</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-50/70 transition-colors group ${item.status === 'inactive' ? 'opacity-70' : ''}`}>
                    <td className="px-6 py-4">
                      <Link to={`/bank/products/${item.id}`} className="font-semibold text-xs sm:text-sm text-slate-900 hover:text-[#4648d4] transition-colors block">
                        {item.name}
                      </Link>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyle(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">{item.interestRate}</td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-medium">
                      {item.impressions !== null ? item.impressions.toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-medium">
                      {item.applications !== null ? item.applications.toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'draft' ? (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Draft
                        </span>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${item.status === 'active' ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <span className={`text-xs font-medium ${item.status === 'active' ? 'text-slate-800' : 'text-slate-400'}`}>
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/bank/products/${item.id}/edit`} className="p-1.5 text-slate-400 hover:text-[#4648d4] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center" title="Edit Product">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <Link to={`/bank/products/${item.id}`} className="p-1.5 text-slate-400 hover:text-[#4648d4] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Product Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <div className="flex items-center gap-1">
            <button disabled className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-400 text-xs font-medium cursor-not-allowed opacity-50">Previous</button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#4648d4] text-white text-xs font-bold">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
