import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { AddExpenseForm } from "./AddExpenseFrom"

//Dialog button which opens a dialog on clicking
export default function AddExpenseButton() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button><Plus />Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        <AddExpenseForm />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
