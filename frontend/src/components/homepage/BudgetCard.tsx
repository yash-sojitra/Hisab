import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Target } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { useTransactionStore } from "@/store/useTransactionStore"

//budget card for displaying monthly budget
export default function BudgetCard() {

  const [progress, setProgress] = useState(13) //for progressbar

  const { monthlyExpense } = useTransactionStore();

  const budget = 10000;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(() => (monthlyExpense/ budget) * 100), 500)
    return () => clearTimeout(timer)
  }, [monthlyExpense])  

  return (
    <Card className="flex-1">
  <CardHeader>
    <CardTitle>Your monthly Budget</CardTitle>
    <CardAction><Target/></CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold">10000</p>
  </CardContent>
  <CardFooter className="flex-col items-start gap-2">
    <Progress value={progress} className="w-[90%]" />
    <p>You are left with {budget - monthlyExpense}</p>
  </CardFooter>
</Card>
  )
}
