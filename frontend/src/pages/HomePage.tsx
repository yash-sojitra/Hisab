import CategoryPieChart from "@/components/graphs/categoryPieChart";
import CardGroup from "@/components/homepage/CardGroup";
import Transactions from "@/components/transactionPage/Transactions";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTransactionStore } from "@/store/useTransactionStore";

//HomePage component for Dashboard
export default function HomePage() {

  const {IncomeByCategory, ExpenseByCategory} = useTransactionStore();


  return (
    <ScrollArea className="h-full w-full">
      <div className="px-4">
        {/* <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="mb-6">This is the main content area of the home page.</p> */}
        <CardGroup />
          <div className="flex">
            {IncomeByCategory?.length ? (
                <CategoryPieChart data={IncomeByCategory} title="Income by Category" />
            ) : (
              <p>Loading income chart...</p>
            )}

            {ExpenseByCategory?.length ? (
                <CategoryPieChart data={ExpenseByCategory} title="Expense by Category" />
            ) : (
              <p>Loading expense chart...</p>
            )}
          </div>
        <Transactions />
      </div>
    </ScrollArea>
  )
}
