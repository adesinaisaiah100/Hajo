'use client';

import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender: 'ARTISAN' | 'CUSTOMER';
  message: string;
  suggestedCost?: number | null;
  createdAt: string;
}

interface NegotiationThreadProps {
  messages: Message[];
  currentUserRole: 'artisan' | 'customer';
  isLoading?: boolean;
  isPolling?: boolean;
}

export function NegotiationThread({
  messages,
  currentUserRole,
  isLoading = false,
  isPolling = false,
}: NegotiationThreadProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-[var(--color-line)]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-[var(--color-surface)] rounded w-24 mb-2" />
              <div className="h-16 bg-[var(--color-surface)]/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-line)] text-center">
        <p className="text-sm text-[var(--color-ink-muted)]">No messages yet. Start negotiating to see messages here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-[var(--color-line)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--foreground)]">Negotiation Thread</h3>
        {isPolling && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
            <span className="text-xs text-[var(--color-ink-muted)]">Live polling</span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((msg) => {
          const isCurrentUser =
            (currentUserRole === 'artisan' && msg.sender === 'ARTISAN') ||
            (currentUserRole === 'customer' && msg.sender === 'CUSTOMER');

          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--foreground)]'
                }`}
              >
                <p className="text-xs opacity-75 mb-1">
                  {msg.sender === 'ARTISAN' ? 'Artisan' : 'You'}
                </p>
                <p className="text-sm break-words">{msg.message}</p>

                {msg.suggestedCost && (
                  <div className={`mt-2 pt-2 border-t ${isCurrentUser ? 'border-[var(--color-brand)]/40' : 'border-[var(--color-line)]'}`}>
                    <p className="text-xs opacity-75">Counter-offer:</p>
                    <p className="text-sm font-semibold">₦{msg.suggestedCost.toLocaleString()}</p>
                  </div>
                )}

                <p
                  className={`text-xs mt-2 opacity-50`}
                >
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isPolling && (
        <div className="mt-4 text-center text-xs text-[var(--color-ink-muted)]">
          Messages update automatically every 4 seconds
        </div>
      )}
    </div>
  );
}
