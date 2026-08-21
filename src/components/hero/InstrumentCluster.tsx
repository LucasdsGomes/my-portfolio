import type { Gauge as GaugeData } from '@/types/portfolio';
import { Gauge } from './Gauge';

interface InstrumentClusterProps {
  gauges: readonly GaugeData[];
}

export function InstrumentCluster({ gauges }: InstrumentClusterProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {gauges.map((gauge, index) => (
        <Gauge key={gauge.label} gauge={gauge} index={index} />
      ))}
    </div>
  );
}
