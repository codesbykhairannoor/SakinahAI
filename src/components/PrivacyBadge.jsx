import { Shield } from 'lucide-react';

export default function PrivacyBadge() {
  return (
    <div className="flex justify-center items-center py-6 text-sakina-text/50">
      <Shield className="w-4 h-4 mr-2" />
      <span className="text-xs font-medium">Data Pribadi Terenkripsi & Disimpan Lokal</span>
    </div>
  );
}
