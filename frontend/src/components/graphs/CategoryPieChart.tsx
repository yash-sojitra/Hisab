import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import type { CategoryData } from '@/types/Transaction';

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

//reusable component for showing categorized data
export default function CategoryPieChart({data, title}:{data: CategoryData[], title: string}) {
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4C60'];

    return (
        <div className='flex flex-col items-center w-full'>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <PieChart width={200} height={200}>
                    <Pie
                        data={data}
                        nameKey='category'
                        dataKey="total"
                        >
                        {data.map((_, index) => (
                            <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>  
                    <Tooltip defaultIndex={2} />
                </PieChart>
            </ChartContainer>
                        {title && <h1 className='font-semibold'>{title}</h1>}
        </div>

    )
}
