import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useCategoryStore } from "@/store/useCategoryStore"
import { useTransactionStore } from "@/store/useTransactionStore"
import { useEffect, useRef, useState } from "react"



//form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  date: z.coerce.date().max(new Date(), {
    message: "Date cannot be in the future.",
  }),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required").optional(),
})

export function AddExpenseForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { categories, fetchAllCategories } = useCategoryStore()
  const { createTransaction, getRecieptDetails, isLoading } = useTransactionStore()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAllCategories()
  }, [fetchAllCategories])

  //using useForm hook to control it otside JSX
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      date: new Date(),
      category: "",
    },
  })

  //uploads file to server for processing and auto fills form using recieved data
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setUploading(true)
        const text = await getRecieptDetails(base64String);
        setUploading(false)

        const correctCategory = categories.find(category => text.category === category.name)
        
        try{

          let parsedDate = new Date()
          if (text.date) {
            parsedDate = parse(text.date, 'dd/MM/yyyy', new Date())
          }

          form.setValue("image", base64String)
          form.setValue("name", text.name)
          form.setValue("amount", text.total)
          form.setValue("date", parsedDate)
          form.setValue("category", correctCategory?._id || '')
        } catch(error){
          console.error(error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  //onSubmit submits the form to server on submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    createTransaction(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} value={field.value as string | number | undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value as Date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // FIX 3: field.value is already a Date object, so no need to wrap it in new Date().
                    selected={field.value instanceof Date ? field.value : undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>x
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Upload Photo to fill details automatically</FormLabel>
              <FormControl>
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button variant={'outline'} type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? "Processing..." : "Upload Receipt"}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">Submit</Button>
      </form>
    </Form>
  )
}