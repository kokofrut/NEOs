import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DateState {
    date: Date | null
    formatDate: string | undefined
    setCurrDate: (date: Date) => void
}
export const useDateStore = create<DateState>()(
    devtools(
        (set) => ({
            date: new Date(),
            formatDate: new Date().toISOString().split("T")[0],
            setCurrDate: (newDate) => set(() => ({ date: newDate, formatDate: newDate.toISOString().split("T")[0] }))
        })
    )
)