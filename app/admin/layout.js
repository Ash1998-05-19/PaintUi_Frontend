
import SidebarComp from "@/components/common/sidebar";


export const metadata = {
  title: "PaintUi",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
   
        <SidebarComp children={children}/>
        
    
  );
}
