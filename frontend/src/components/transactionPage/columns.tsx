"use client"

import type { ColumnDef } from "@tanstack/react-table"

//type to define what data to include in every row
export type TransactionColumn = {
  id: string
  name: string
  amount: number
  date: Date
  category: string
  type: "income" | "expense"
  actions?: React.ReactNode
}

//Column definitions for datatable
export const columns: ColumnDef<TransactionColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date: Date = row.getValue("date")
            return (
                <div className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).format(new Date(date))}
                </div>
            )
        }
    },
    {
        accessorKey: "amount",
        header: () => <div className="">Amount</div>,
        cell: ({ row }) => {
            const amount: number = row.getValue("amount")
            const type: string = row.getValue("type")
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount)

            return (
                <div className={type === 'expense' ? 'text-red-700' : 'text-green-700'}>
                  {formatted}
                </div>
              );
        }
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {   accessorKey: "type",
        header: "Type",
    },
]