import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Field, ModalSheet, Panel, ProgressBar, Screen, StatsGrid, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { exportSwapSummaryPdf } from '@/services/export';
import { useAppStore } from '@/store/useAppStore';
import { dualPrice } from '@/utils/format';
import { formatDate, formatDateTime } from '@/utils/date';

export default function SwapLogScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useCurrentUser();
  const swapLog = useAppStore((state) => state.swapLog);
  const creditLedger = useAppStore((state) => state.creditLedger);
  const contracts = useAppStore((state) => state.contracts);
  const cashPayouts = useAppStore((state) => state.cashPayouts);
  const listings = useAppStore((state) => state.listings);
  const reviews = useAppStore((state) => state.reviews);
  const markAgreementDone = useAppStore((state) => state.markAgreementDone);
  const leaveAgreementReview = useAppStore((state) => state.leaveAgreementReview);
  const [reviewContractId, setReviewContractId] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewBody, setReviewBody] = useState('Clear pacing, kind communication, and good follow-through.');
  const currentView = searchParams.get('view') === 'history' ? 'History' : 'Overview';

  const reviewTarget = contracts.find((contract) => contract.id === reviewContractId);

  const taughtHours = useMemo(
    () =>
      swapLog
        .filter((entry) => entry.userId === currentUser?.id && entry.type === 'taught')
        .reduce((sum, entry) => sum + entry.hours, 0),
    [swapLog, currentUser]
  );

  const learnedHours = useMemo(
    () =>
      swapLog
        .filter((entry) => entry.userId === currentUser?.id && entry.type === 'learned')
        .reduce((sum, entry) => sum + entry.hours, 0),
    [swapLog, currentUser]
  );

  const visibleContracts = useMemo(
    () =>
      contracts.filter(
        (contract) =>
          currentUser &&
          [contract.teacherId, contract.learnerId].includes(currentUser.id) &&
          contract.status !== 'completed'
      ),
    [contracts, currentUser]
  );

  const myLedger = creditLedger
    .filter((entry) => entry.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const payoutEntries = cashPayouts.filter((entry) => entry.userId === currentUser?.id);
  const monthlyNet = payoutEntries.reduce((sum, entry) => sum + entry.netPhp, 0);
  const actionHistory = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const listingItems = listings
      .filter((listing) => listing.ownerId === currentUser.id)
      .map((listing) => ({
        id: `listing-${listing.id}`,
        label: 'Listing',
        title: listing.title,
        body: `${dualPrice(listing)} • ${listing.availability.join(' • ')} • ${listing.status}`,
        createdAt: listing.createdAt,
        tone: 'teal' as const
      }));

    const contractItems = contracts
      .filter((contract) => [contract.teacherId, contract.learnerId].includes(currentUser.id))
      .map((contract) => {
        const role = contract.teacherId === currentUser.id ? 'You are offering' : 'You are booking';
        const paymentSummary = contract.isEqualSwap
          ? 'Equal swap'
          : contract.paymentMethod === 'Credits'
            ? `${contract.creditAmount} credits`
            : `PHP ${contract.cashAmountPhp.toFixed(2)}`;

        return {
          id: `contract-${contract.id}`,
          label: contract.isEqualSwap ? 'Swap' : 'Booking',
          title: contract.title,
          body: `${role} • ${paymentSummary} • ${contract.status.replace(/-/g, ' ')}`,
          createdAt: contract.createdAt,
          tone: contract.isEqualSwap ? ('warm' as const) : ('mauve' as const)
        };
      });

    const swapLogItems = swapLog
      .filter((entry) => entry.userId === currentUser.id)
      .map((entry) => ({
        id: `log-${entry.id}`,
        label: 'Progress',
        title: entry.title,
        body: `${entry.hours.toFixed(1)} hours • ${entry.type}`,
        createdAt: entry.happenedAt,
        tone: 'warm' as const
      }));

    const creditItems = creditLedger
      .filter((entry) => entry.userId === currentUser.id)
      .map((entry) => ({
        id: `credit-${entry.id}`,
        label: 'Credits',
        title: entry.title,
        body: `${entry.delta > 0 ? '+' : ''}${entry.delta} credits • ${entry.status}`,
        createdAt: entry.createdAt,
        tone: entry.delta >= 0 ? ('teal' as const) : ('mauve' as const)
      }));

    const payoutItems = payoutEntries.map((entry) => ({
      id: `payout-${entry.id}`,
      label: 'Payout',
      title: entry.title,
      body: `Net PHP ${entry.netPhp.toFixed(2)} • ${entry.status} • ${formatDate(entry.payoutDate)}`,
      createdAt: entry.createdAt,
      tone: 'neutral' as const
    }));

    const reviewItems = reviews
      .filter((review) => review.authorId === currentUser.id || review.targetUserId === currentUser.id)
      .map((review) => ({
        id: `review-${review.id}`,
        label: 'Review',
        title: review.authorId === currentUser.id ? 'Review sent' : 'Review received',
        body: `${review.score} stars • ${review.body}`,
        createdAt: review.createdAt,
        tone: 'teal' as const
      }));

    return [
      ...listingItems,
      ...contractItems,
      ...swapLogItems,
      ...creditItems,
      ...payoutItems,
      ...reviewItems
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [contracts, creditLedger, currentUser, listings, payoutEntries, reviews, swapLog]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Activity"
      subtitle="Your bookings, credits, reviews, and hobby wins."
      action={
        <div className="button-row">
          <Button tone="secondary" onClick={() => exportSwapSummaryPdf(currentUser, swapLog.filter((entry) => entry.userId === currentUser.id))}>
            Export PDF
          </Button>
          <span className="pill pill-neutral">{actionHistory.length} actions</span>
        </div>
      }
    >
      <div className="segments">
        {['Overview', 'History'].map((view) => (
          <button
            className={`segment ${currentView === view ? 'active' : ''}`}
            key={view}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              if (view === 'History') {
                next.set('view', 'history');
              } else {
                next.delete('view');
              }
              setSearchParams(next, { replace: true });
            }}
            type="button"
          >
            {view}
          </button>
        ))}
      </div>

      {currentView === 'Overview' ? (
        <>
          <StatsGrid
            items={[
              { label: 'Taught', value: `${taughtHours.toFixed(1)}h`, tone: 'warm' },
              { label: 'Learned', value: `${learnedHours.toFixed(1)}h`, tone: 'teal' },
              { label: 'Credits', value: `${currentUser.creditBalance} cr`, tone: 'mauve' }
            ]}
          />

          <Panel eyebrow="Credit ledger" title="Every credit movement">
            <div className="stack-list">
              {myLedger.map((entry) => (
                <article className="list-card clean-card" key={entry.id}>
                  <div>
                    <strong>{entry.delta > 0 ? `+${entry.delta}` : entry.delta} cr</strong>
                    <p>{entry.title}</p>
                    <small>
                      {entry.sessionType} • {formatDateTime(entry.createdAt)} • {entry.status}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Active sessions" title="Progress and release actions">
            <div className="stack-list">
              {visibleContracts.map((contract) => {
                const completedCount = contract.sessionRecords.filter((session) => session.status === 'completed').length;
                const reviewPending = contract.status === 'awaiting-review' && !contract.reviewLeftBy.includes(currentUser.id);
                return (
                  <article className="clean-card contract-card" key={contract.id}>
                    <div className="stack-list">
                      <div className="list-card">
                        <div>
                          <strong>{contract.title}</strong>
                          <p>{contract.note}</p>
                          <small>
                            {contract.type} • {completedCount}/{contract.sessionRecords.length} complete
                          </small>
                        </div>
                      </div>
                      <ProgressBar max={contract.sessionRecords.length} value={completedCount} />
                      <div className="button-row">
                        <Button
                          tone="secondary"
                          disabled={contract.status === 'awaiting-review'}
                          onClick={() => markAgreementDone(contract.id)}
                        >
                          Mark done
                        </Button>
                        <Button
                          disabled={!reviewPending}
                          onClick={() => {
                            setReviewContractId(contract.id);
                            setRating('5');
                          }}
                        >
                          Leave review
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Panel>

          <Panel eyebrow="Teacher payout tracker" title="Cash earnings after platform fee">
            <div className="stack-list">
              <div className="list-card clean-card">
                <div>
                  <strong>Monthly net earnings</strong>
                  <p>₱{monthlyNet.toFixed(2)}</p>
                  <small>
                    Next payout date: {formatDate(currentUser.nextPayoutDate)} • Method: {currentUser.payoutMethod}
                  </small>
                </div>
              </div>
              {payoutEntries.map((entry) => (
                <article className="list-card clean-card" key={entry.id}>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>
                      Gross ₱{entry.grossPhp.toFixed(2)} • Fee ₱{entry.feePhp.toFixed(2)} • Net ₱{entry.netPhp.toFixed(2)}
                    </p>
                    <small>
                      {entry.status} • payout {formatDate(entry.payoutDate)}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </>
      ) : (
        <Panel eyebrow="Action history" title="Everything tied to swaps, listings, payments, and reviews">
          <div className="stack-list">
            {actionHistory.map((entry) => (
              <article className="action-card" key={entry.id}>
                <div className="action-card-top">
                  <span className={`pill pill-${entry.tone}`}>{entry.label}</span>
                  <small>{formatDateTime(entry.createdAt)}</small>
                </div>
                <strong>{entry.title}</strong>
                <p>{entry.body}</p>
              </article>
            ))}
          </div>
        </Panel>
      )}

      <ModalSheet onClose={() => setReviewContractId('')} open={Boolean(reviewTarget)} title="Leave review">
        {reviewTarget ? (
          <div className="stack-list">
            <Panel eyebrow="Review release" title={reviewTarget.title}>
              <p>
                If you leave a 5-star review, the teacher earns an extra +5 credits on top of the session value.
              </p>
            </Panel>
            <Field label="Rating">
              <TextInput value={rating} onChange={(event) => setRating(event.target.value)} />
            </Field>
            <Field label="Review note">
              <TextArea value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} />
            </Field>
            <div className="button-row">
              <Button tone="secondary" onClick={() => setReviewContractId('')}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  leaveAgreementReview({
                    contractId: reviewTarget.id,
                    rating: Number(rating),
                    body: reviewBody
                  });
                  setReviewContractId('');
                }}
              >
                Submit review
              </Button>
            </div>
          </div>
        ) : null}
      </ModalSheet>
    </Screen>
  );
}
