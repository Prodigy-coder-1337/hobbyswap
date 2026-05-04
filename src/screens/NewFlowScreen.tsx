import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AvailabilityBuilder,
  createAvailabilitySlot,
  formatAvailabilitySlot
} from '@/components/AvailabilityBuilder';
import {
  Button,
  Field,
  Panel,
  Pill,
  ProgressBar,
  Screen,
  Segments,
  TextArea,
  TextInput,
  Toggle
} from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { PaymentMethod, PriceMode } from '@/types/models';
import { credits, dualPrice, peso } from '@/utils/format';

type FlowMode = 'Swap' | 'Book session' | 'Create listing';

const paymentOptions: PaymentMethod[] = ['GCash', 'Maya', 'Card', 'PayPal', 'Credits'];

export default function NewFlowScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const users = useAppStore((state) => state.users);
  const listings = useAppStore((state) => state.listings);
  const hobbies = useAppStore((state) => state.hobbies);
  const createSwapAgreement = useAppStore((state) => state.createSwapAgreement);
  const bookSession = useAppStore((state) => state.bookSession);
  const createListing = useAppStore((state) => state.createListing);

  const routeState = location.state as { mode?: FlowMode; listingId?: string } | null;
  const [mode, setMode] = useState<FlowMode>(routeState?.mode ?? 'Swap');
  const [step, setStep] = useState(1);

  const [swapForm, setSwapForm] = useState({
    partnerId: users.find((user) => user.id !== currentUser?.id)?.id ?? '',
    teachSkill: 'Journaling for creative blocks',
    learnSkill: 'Film camera basics',
    sessions: '2',
    durationMinutes: '75',
    format: 'Hybrid',
    locationLabel: 'Safe public cafe, studio, or video call',
    equalSwap: true,
    creditAmount: '15',
    note: 'Keep the pacing beginner-friendly and confirm boundaries after each session.',
    availabilitySlots: [createAvailabilitySlot({ time: '18:00' }, 2), createAvailabilitySlot({ time: '10:00' }, 5)]
  });

  const teacherListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.ownerId !== currentUser?.id &&
          (listing.intent === 'teach' || listing.intent === 'workshop')
      ),
    [listings, currentUser]
  );

  const [bookingForm, setBookingForm] = useState({
    listingId: routeState?.listingId ?? teacherListings[0]?.id ?? '',
    paymentMethod: 'Credits' as PaymentMethod,
    scheduleSlots: [createAvailabilitySlot({ time: '18:00' }, 4)],
    note: 'Please keep this beginner-safe and low pressure.'
  });

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    hobbyId: hobbies[0]?.id ?? 'journaling',
    intent: 'teach',
    level: 'Beginner',
    format: 'Hybrid',
    priceMode: 'credits' as PriceMode,
    creditPrice: '15',
    cashPricePhp: '350',
    photoUrl: '',
    availabilitySlots: [createAvailabilitySlot({ time: '18:00' }, 3), createAvailabilitySlot({ time: '10:00' }, 5)]
  });

  useEffect(() => {
    setStep(1);
  }, [mode]);

  useEffect(() => {
    if (routeState?.mode) {
      setMode(routeState.mode);
    }
    if (routeState?.listingId) {
      setBookingForm((state) => ({ ...state, listingId: routeState.listingId! }));
    }
  }, [routeState]);

  const selectedBooking = teacherListings.find((listing) => listing.id === bookingForm.listingId) ?? teacherListings[0];
  const cashPrice = selectedBooking?.cashPricePhp ?? 0;
  const feePhp = Number((cashPrice * 0.09).toFixed(2));
  const teacherNet = Number((cashPrice - feePhp).toFixed(2));
  const availablePaymentMethods = paymentOptions.filter((method) => {
    if (!selectedBooking) {
      return false;
    }

    if (method === 'Credits') {
      return selectedBooking.priceMode === 'credits' || selectedBooking.priceMode === 'both';
    }

    return selectedBooking.priceMode === 'cash' || selectedBooking.priceMode === 'both';
  });

  useEffect(() => {
    if (availablePaymentMethods.length && !availablePaymentMethods.includes(bookingForm.paymentMethod)) {
      setBookingForm((state) => ({
        ...state,
        paymentMethod: availablePaymentMethods[0]
      }));
    }
  }, [availablePaymentMethods, bookingForm.paymentMethod]);

  const cashFeeExample =
    createForm.priceMode === 'cash' || createForm.priceMode === 'both'
      ? Number((Number(createForm.cashPricePhp || 0) * 0.09).toFixed(2))
      : 0;
  const swapAvailabilityLabels = swapForm.availabilitySlots.map((slot) => formatAvailabilitySlot(slot));
  const createAvailabilityLabels = createForm.availabilitySlots.map((slot) => formatAvailabilitySlot(slot));
  const requestedSchedule = bookingForm.scheduleSlots[0]
    ? formatAvailabilitySlot(bookingForm.scheduleSlots[0])
    : 'Schedule to be confirmed';

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Create"
      subtitle="Teach, join, list, or swap in a few taps."
      action={<Pill tone="warm">Step {step}</Pill>}
    >
      <Segments
        value={mode}
        options={['Swap', 'Book session', 'Create listing']}
        onChange={(next) => setMode(next as FlowMode)}
      />

      {mode === 'Swap' ? (
        <Panel eyebrow="Swap" title="Trade skills">
          {step === 1 ? (
            <div className="form-stack">
              <Field label="Swap partner">
                <select
                  className="text-input"
                  value={swapForm.partnerId}
                  onChange={(event) => setSwapForm((state) => ({ ...state, partnerId: event.target.value }))}
                >
                  {users
                    .filter((user) => user.id !== currentUser.id)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.displayName}
                      </option>
                    ))}
                </select>
              </Field>
              <div className="split-fields">
                <Field label="I will teach">
                  <TextInput
                    value={swapForm.teachSkill}
                    onChange={(event) => setSwapForm((state) => ({ ...state, teachSkill: event.target.value }))}
                  />
                </Field>
                <Field label="I want to learn">
                  <TextInput
                    value={swapForm.learnSkill}
                    onChange={(event) => setSwapForm((state) => ({ ...state, learnSkill: event.target.value }))}
                  />
                </Field>
              </div>
              <div className="split-fields">
                <Field label="Sessions">
                  <TextInput
                    value={swapForm.sessions}
                    onChange={(event) => setSwapForm((state) => ({ ...state, sessions: event.target.value }))}
                  />
                </Field>
                <Field label="Duration minutes">
                  <TextInput
                    value={swapForm.durationMinutes}
                    onChange={(event) => setSwapForm((state) => ({ ...state, durationMinutes: event.target.value }))}
                  />
                </Field>
              </div>
              <Field label="Format">
                <select
                  className="text-input"
                  value={swapForm.format}
                  onChange={(event) => setSwapForm((state) => ({ ...state, format: event.target.value }))}
                >
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online</option>
                </select>
              </Field>
              <AvailabilityBuilder
                addLabel="Add another availability slot"
                hint="Pick the exact day, date, and time options you want your partner to choose from."
                label="Availability choices"
                slots={swapForm.availabilitySlots}
                onChange={(availabilitySlots) => setSwapForm((state) => ({ ...state, availabilitySlots }))}
              />
              <Field label="Meeting point or location">
                <TextInput
                  value={swapForm.locationLabel}
                  onChange={(event) => setSwapForm((state) => ({ ...state, locationLabel: event.target.value }))}
                />
              </Field>
              <Toggle
                checked={swapForm.equalSwap}
                description="Turn this off only if one side should receive credits instead of an equal exchange."
                label="Equal swap"
                onChange={(value) => setSwapForm((state) => ({ ...state, equalSwap: value }))}
              />
              {!swapForm.equalSwap ? (
                <Field label="Credits to transfer">
                  <TextInput
                    value={swapForm.creditAmount}
                    onChange={(event) => setSwapForm((state) => ({ ...state, creditAmount: event.target.value }))}
                  />
                </Field>
              ) : null}
              <Field label="Shared note">
                <TextArea
                  value={swapForm.note}
                  onChange={(event) => setSwapForm((state) => ({ ...state, note: event.target.value }))}
                />
              </Field>
              <Button onClick={() => setStep(2)}>Preview swap</Button>
            </div>
          ) : (
            <div className="stack-list">
              <Panel eyebrow="Swap preview" title={`${swapForm.teachSkill} ↔ ${swapForm.learnSkill}`}>
                <div className="rule-list">
                  <div>
                    <strong>Availability choices</strong>
                    <p>{swapAvailabilityLabels.join(' • ')}</p>
                  </div>
                  <div>
                    <strong>Format and duration</strong>
                    <p>
                      {swapForm.format} • {swapForm.sessions} sessions • {swapForm.durationMinutes} mins each
                    </p>
                  </div>
                  <div>
                    <strong>Payment track</strong>
                    <p>
                      {swapForm.equalSwap
                        ? 'Equal swap — no credits needed.'
                        : `Credit-based swap — ${swapForm.creditAmount} credits.`}
                    </p>
                  </div>
                </div>
              </Panel>
              <div className="button-row">
                <Button tone="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    createSwapAgreement({
                      partnerId: swapForm.partnerId,
                      teachSkill: swapForm.teachSkill,
                      learnSkill: swapForm.learnSkill,
                      sessions: Number(swapForm.sessions),
                      durationMinutes: Number(swapForm.durationMinutes),
                      format: swapForm.format as 'In-person' | 'Hybrid' | 'Online',
                      availabilityGrid: swapAvailabilityLabels,
                      locationLabel: swapForm.locationLabel,
                      equalSwap: swapForm.equalSwap,
                      creditAmount: Number(swapForm.creditAmount || 0),
                      note: swapForm.note
                    });
                    navigate('/app/log');
                  }}
                >
                  Confirm swap
                </Button>
              </div>
            </div>
          )}
        </Panel>
      ) : null}

      {mode === 'Book session' ? (
        <Panel eyebrow="Book" title="Join a lesson or workshop">
          {step === 1 ? (
            <div className="form-stack">
              <Field label="Choose a teacher or workshop">
                <select
                  className="text-input"
                  value={bookingForm.listingId}
                  onChange={(event) => setBookingForm((state) => ({ ...state, listingId: event.target.value }))}
                >
                  {teacherListings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title}
                    </option>
                  ))}
                </select>
              </Field>
              {selectedBooking ? (
                <Panel eyebrow={selectedBooking.intent} title={selectedBooking.title}>
                  <p>{selectedBooking.description}</p>
                  <small>
                    {dualPrice(selectedBooking)} • {selectedBooking.format} • {selectedBooking.level}
                  </small>
                </Panel>
              ) : null}
              <AvailabilityBuilder
                hint="Choose one exact schedule option so both sides see the same starting plan."
                label="Requested schedule"
                maxSlots={1}
                slots={bookingForm.scheduleSlots}
                onChange={(scheduleSlots) => setBookingForm((state) => ({ ...state, scheduleSlots }))}
              />
              <Field label="Booking note">
                <TextArea
                  value={bookingForm.note}
                  onChange={(event) => setBookingForm((state) => ({ ...state, note: event.target.value }))}
                />
              </Field>
              <Button onClick={() => setStep(2)}>Choose payment</Button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="stack-list">
              <Panel eyebrow="Payment method" title="Choose how you want to pay">
                <div className="chip-wrap">
                  {availablePaymentMethods.map((method) => (
                    <button
                      className={`chip ${bookingForm.paymentMethod === method ? 'active' : ''}`}
                      key={method}
                      onClick={() => setBookingForm((state) => ({ ...state, paymentMethod: method }))}
                      type="button"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </Panel>
              <div className="button-row">
                <Button tone="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Review checkout</Button>
              </div>
            </div>
          ) : null}

          {step === 3 && selectedBooking ? (
            <div className="stack-list">
              <Panel eyebrow="Checkout review" title={selectedBooking.title}>
                <div className="rule-list">
                  <div>
                    <strong>Requested schedule</strong>
                    <p>{requestedSchedule}</p>
                  </div>
                  <div>
                    <strong>Payment method</strong>
                    <p>{bookingForm.paymentMethod}</p>
                  </div>
                  <div>
                    <strong>Price</strong>
                    <p>
                      {bookingForm.paymentMethod === 'Credits'
                        ? credits(selectedBooking.creditPrice)
                        : peso(selectedBooking.cashPricePhp)}
                    </p>
                  </div>
                  <div>
                    <strong>Platform fee</strong>
                    <p>{bookingForm.paymentMethod === 'Credits' ? '0% on credit transfers' : `${peso(feePhp)} (9%)`}</p>
                  </div>
                  <div>
                    <strong>Teacher receives</strong>
                    <p>{bookingForm.paymentMethod === 'Credits' ? credits(selectedBooking.creditPrice) : peso(teacherNet)}</p>
                  </div>
                </div>
              </Panel>

              <Panel eyebrow="Next" title="How booking works">
                <div className="escrow-steps">
                  <div>
                    <strong>1. You pay</strong>
                    <p>The booking is confirmed and the amount is held.</p>
                  </div>
                  <div>
                    <strong>2. We hold it</strong>
                    <p>Funds or credits stay protected until the session is marked complete.</p>
                  </div>
                  <div>
                    <strong>3. Teacher gets paid</strong>
                    <p>The teacher receives credits instantly on release, or cash net of the 9% fee.</p>
                  </div>
                </div>
                <ProgressBar max={3} tone="amber" value={3} />
              </Panel>

              <div className="button-row">
                <Button tone="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    bookSession({
                      listingId: selectedBooking.id,
                      paymentMethod: bookingForm.paymentMethod,
                      scheduleLabel: requestedSchedule,
                      note: bookingForm.note
                    });
                    navigate('/app/log');
                  }}
                >
                  Confirm booking
                </Button>
              </div>
            </div>
          ) : null}
        </Panel>
      ) : null}

      {mode === 'Create listing' ? (
        <Panel eyebrow="List" title="Show your skills or gear">
          {step === 1 ? (
            <div className="form-stack">
              <Field label="Title">
                <TextInput
                  value={createForm.title}
                  onChange={(event) => setCreateForm((state) => ({ ...state, title: event.target.value }))}
                />
              </Field>
              <Field label="Description">
                <TextArea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((state) => ({ ...state, description: event.target.value }))}
                />
              </Field>
              <div className="split-fields">
                <Field label="Skill">
                  <select
                    className="text-input"
                    value={createForm.hobbyId}
                    onChange={(event) => setCreateForm((state) => ({ ...state, hobbyId: event.target.value }))}
                  >
                    {hobbies.map((hobby) => (
                      <option key={hobby.id} value={hobby.id}>
                        {hobby.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Intent">
                  <select
                    className="text-input"
                    value={createForm.intent}
                    onChange={(event) => setCreateForm((state) => ({ ...state, intent: event.target.value }))}
                  >
                    <option value="teach">Teacher session</option>
                    <option value="workshop">Workshop</option>
                    <option value="item">Item listing</option>
                  </select>
                </Field>
              </div>
              <div className="split-fields">
                <Field label="Level">
                  <select
                    className="text-input"
                    value={createForm.level}
                    onChange={(event) => setCreateForm((state) => ({ ...state, level: event.target.value }))}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Learning">Learning</option>
                    <option value="Comfortable">Comfortable</option>
                    <option value="Can Teach">Can Teach</option>
                  </select>
                </Field>
                <Field label="Format">
                  <select
                    className="text-input"
                    value={createForm.format}
                    onChange={(event) => setCreateForm((state) => ({ ...state, format: event.target.value }))}
                  >
                    <option value="In-person">In-person</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                  </select>
                </Field>
              </div>
              <Field label="Pricing">
                <Segments
                  value={
                    createForm.priceMode === 'free'
                      ? 'Free'
                      : createForm.priceMode === 'credits'
                        ? 'Credits'
                        : createForm.priceMode === 'cash'
                          ? 'Cash'
                          : 'Both'
                  }
                  options={['Free', 'Credits', 'Cash', 'Both']}
                  onChange={(next) =>
                    setCreateForm((state) => ({
                      ...state,
                      priceMode:
                        next === 'Free'
                          ? 'free'
                          : next === 'Credits'
                            ? 'credits'
                            : next === 'Cash'
                              ? 'cash'
                              : 'both'
                    }))
                  }
                />
              </Field>
              {(createForm.priceMode === 'credits' || createForm.priceMode === 'both') ? (
                <Field label="Credit price">
                  <TextInput
                    value={createForm.creditPrice}
                    onChange={(event) => setCreateForm((state) => ({ ...state, creditPrice: event.target.value }))}
                  />
                </Field>
              ) : null}
              {(createForm.priceMode === 'cash' || createForm.priceMode === 'both') ? (
                <Field label="Cash price in PHP">
                  <TextInput
                    value={createForm.cashPricePhp}
                    onChange={(event) => setCreateForm((state) => ({ ...state, cashPricePhp: event.target.value }))}
                  />
                </Field>
              ) : null}
              <AvailabilityBuilder
                addLabel="Add another availability slot"
                hint="Show exact day, date, and time windows instead of vague weekly slots."
                label="Availability"
                slots={createForm.availabilitySlots}
                onChange={(availabilitySlots) => setCreateForm((state) => ({ ...state, availabilitySlots }))}
              />
              <Field hint="Optional URL for the listing cover image" label="Photo URL">
                <TextInput
                  value={createForm.photoUrl}
                  onChange={(event) => setCreateForm((state) => ({ ...state, photoUrl: event.target.value }))}
                />
              </Field>
              <Button onClick={() => setStep(2)}>Preview listing</Button>
            </div>
          ) : (
            <div className="stack-list">
              <Panel eyebrow="Listing preview" title={createForm.title || 'Untitled listing'}>
                <div className="rule-list">
                  <div>
                    <strong>Skill and format</strong>
                    <p>
                      {hobbies.find((hobby) => hobby.id === createForm.hobbyId)?.label} • {createForm.level} • {createForm.format}
                    </p>
                  </div>
                  <div>
                    <strong>Pricing</strong>
                    <p>
                      {createForm.priceMode === 'free'
                        ? 'Free'
                        : createForm.priceMode === 'credits'
                          ? `${createForm.creditPrice} credits`
                          : createForm.priceMode === 'cash'
                            ? `₱${createForm.cashPricePhp}`
                          : `₱${createForm.cashPricePhp} or ${createForm.creditPrice} credits`}
                    </p>
                  </div>
                  <div>
                    <strong>Availability</strong>
                    <p>{createAvailabilityLabels.join(' • ')}</p>
                  </div>
                  <div>
                    <strong>{createForm.intent === 'item' ? 'Seller' : 'Teacher'} fee rule</strong>
                    <p>
                      {createForm.priceMode === 'credits'
                        ? 'Credit transfers stay fee-free.'
                        : createForm.priceMode === 'free'
                          ? 'Free listings carry no fee.'
                          : `Cash listings carry a 9% platform fee, so a ₱${createForm.cashPricePhp} listing pays out roughly ₱${Number(createForm.cashPricePhp || 0) - cashFeeExample}.`}
                    </p>
                  </div>
                </div>
              </Panel>
              <div className="button-row">
                <Button tone="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    createListing({
                      title: createForm.title,
                      description: createForm.description,
                      hobbyId: createForm.hobbyId,
                      intent: createForm.intent as 'teach' | 'workshop' | 'item',
                      level: createForm.level as 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach',
                      format: createForm.format as 'In-person' | 'Hybrid' | 'Online',
                      priceMode: createForm.priceMode,
                      creditPrice:
                        createForm.priceMode === 'credits' || createForm.priceMode === 'both'
                          ? Number(createForm.creditPrice)
                          : null,
                      cashPricePhp:
                        createForm.priceMode === 'cash' || createForm.priceMode === 'both'
                          ? Number(createForm.cashPricePhp)
                          : null,
                      availability: createAvailabilityLabels,
                      photoUrl: createForm.photoUrl
                    });
                    navigate('/app/discover');
                  }}
                >
                  Publish listing
                </Button>
              </div>
            </div>
          )}
        </Panel>
      ) : null}
    </Screen>
  );
}
