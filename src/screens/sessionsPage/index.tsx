import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import api from '@/app/services/api';
import { format } from 'date-fns';

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  status: number;
  lastActiveAt: string;
  createdAt: string;
}

function parseUserAgent(ua: string) {
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return 'mobile';
  return 'desktop';
}

function getBrowserName(ua: string) {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('curl')) return 'curl';
  return 'Noma\'lum';
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/admins/sessions')
      .then(res => setSessions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: number) => {
    if (status === 1) return <Badge variant="success">Aktiv</Badge>;
    if (status === -2) return <Badge variant="secondary">Chiqilgan</Badge>;
    return <Badge variant="destructive">Noaktiv</Badge>;
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sessiyalar</h1>
        <p className="text-sm text-muted-foreground">{sessions.length} ta sessiya</p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Sessiyalar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sessions.map(session => (
            <Card key={session.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  {parseUserAgent(session.userAgent) === 'mobile' ? (
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{getBrowserName(session.userAgent)}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{session.ipAddress || 'IP noma\'lum'}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      Oxirgi faollik: {format(new Date(session.lastActiveAt), 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(session.status)}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(session.createdAt), 'dd.MM.yyyy')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
