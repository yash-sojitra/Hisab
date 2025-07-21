import {
  Card,
  CardAction,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTransactionStore } from "@/store/useTransactionStore";
import { 
  TrendingDown 
} from "lucide-react"

//Expense Card
export default function ExpenseCard() {

  const { monthlyExpense } = useTransactionStore();

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Monthly Expenditure</CardTitle>
        <CardAction><TrendingDown /></CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">₹{monthlyExpense}</p>
      </CardContent>
    </Card>
  )
}
