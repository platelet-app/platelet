import { createContext, FC, ReactNode, useContext, useState } from "react";

export interface SidebarProviderProps {
    children: ReactNode;
}

const SidebarContext = createContext<{
    sidebarOpen: boolean;
    toggleSidebar: () => void;
} | null>(null);

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};