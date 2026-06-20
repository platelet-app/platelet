import { createFileRoute } from '@tanstack/react-router';
import { getTrackingData } from '../utils/getTrackingData';

export const Route = createFileRoute('/$trackingCode')({
  component: TrackingPage,
  loader: ({ params }) => getTrackingData(params.trackingCode),
});

function TrackingPage() {
  // TODO: use trackingCode to query your API
  // e.g. const { data } = useQuery({ queryKey: ['tracking', trackingCode], queryFn: () => fetchTracking(trackingCode) })

  const data = Route.useLoaderData(); // typed to the return value of fetchTracking

  return (
    <div>
      <p>Tracking code: {data}</p>
    </div>
  );
}
