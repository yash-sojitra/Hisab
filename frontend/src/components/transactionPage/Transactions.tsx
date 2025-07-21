"use client"

import { useState, useEffect } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
} from "@tanstack/react-table"

import {
    Select,
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue
} from "@/components/ui/select"


import { TransactionTable } from "./TransactionTable"
import { columns } from "./columns" 
import { useTransactionStore } from "@/store/useTransactionStore"
import { useCategoryStore } from "@/store/useCategoryStore"
import AddExpenseButton from "../AddExpenseButton"

//Transactions Section
export default function Transactions() {
    
    //loading data and filter prequisites from store
    const { transactions, pageCount, isLoading, getAllTransactions } = useTransactionStore()
    const { categories, fetchAllCategories } = useCategoryStore()

    //states for selecting filter
    const [typeFilter, setTypeFilter] = useState<string>("") 
    const [categoryFilter, setCategoryFilter] = useState<string>("") 

    //state used for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, 
        pageSize: 10,
    })

    //state for sorting data
    const [sorting, setSorting] = useState<SortingState>([])

    //table hook that provides ease access to tables configurations
    const table = useReactTable({
        data: transactions.map((transaction) => {
            return {
                id: transaction.id,
                name: transaction.name,
                amount: transaction.amount,
                date: new Date(transaction.date),
                category: transaction.category.name,
                type: transaction.category.type,
            }
        }),
        columns,
        pageCount: pageCount, 
        state: {
            pagination, 
            sorting,    
        },
        manualPagination: true,
        manualSorting: true,

        onPaginationChange: setPagination,
        onSortingChange: setSorting,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    useEffect(() => {
        fetchAllCategories()
    }, [fetchAllCategories])

    //responsible for refetching data every time configuration changes
    useEffect(() => {
        const sort = sorting[0]?.id
        const order = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

        getAllTransactions({
            page: pagination.pageIndex + 1, 
            limit: pagination.pageSize,
            sort,
            order,
            filters: {
                type: typeFilter,
                categoryId: categoryFilter,
            },
        })
    }, [pagination, sorting, getAllTransactions, typeFilter, categoryFilter])

    //sets page to 0 every time you change the filter
    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
        table.setPageIndex(0)
        setter(value === "all" ? "" : value)
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-4">Transactions</h1>

            <div className="flex items-center gap-4 mb-4">

                <Select value={typeFilter || "all"} onValueChange={handleFilterChange(setTypeFilter)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={categoryFilter || "all"} onValueChange={handleFilterChange(setCategoryFilter)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <AddExpenseButton/>
            </div>

            <TransactionTable
                table={table}
                isLoading={isLoading}
                columnsLength={columns.length}
            />
        </div>
    )
}