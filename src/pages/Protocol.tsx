import { ProtocolLookup } from '@/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Protocol() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">Protocol Interface</h1>
        <p className="text-sm text-gray-500 mt-1">
          Public lookup for lenders and developers to verify wallet scores
        </p>
      </div>
      <ProtocolLookup />

    </div>
  );
}
