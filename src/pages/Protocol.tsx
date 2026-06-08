import { ProtocolLookup } from '@/components';
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
=======
>>>>>>> 6b1edb42dc375f235193a1c5205adc4f08d8d923

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
