import {
  Card,
  CardAction,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTransactionStore } from "@/store/useTransactionStore"
import { 
  TrendingUp 
} from "lucide-react"

//Income Card
export default function IncomeCard() {

  const { monthlyIncome } = useTransactionStore();

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Monthly Income</CardTitle>
        <CardAction><TrendingUp /></CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">₹{monthlyIncome}</p>
      </CardContent>
    </Card>
  )
}
