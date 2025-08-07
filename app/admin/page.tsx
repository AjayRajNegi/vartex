import { SectionCards } from "@/components/sidebar/section-cards";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";

export default function AdminIndexPage() {
  return (
    <>
      <SectionCards />
      <div>
        <ChartAreaInteractive />
      </div>
    </>
  );
}
