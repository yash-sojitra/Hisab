import { useTransactionStore } from "@/store/useTransactionStore";
import BudgetCard from "./BudgetCard";
import ExpenseCard from "./ExpenseCard";
import IncomeCard from "./IncomeCard";
import { useEffect } from "react";

//group of all the three cards Budget, Income, Expense
export default function CardGroup () {

  const { getDashboardSummary } = useTransactionStore();

  useEffect(()=>{
    getDashboardSummary()
  },[getDashboardSummary])

  return (
    <div className="flex gap-4 basis-full  justify-center">
        <BudgetCard/>
        <IncomeCard/>
        <ExpenseCard/>
    </div>
  )
}
