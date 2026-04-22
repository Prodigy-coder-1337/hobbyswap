import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  EmptyState,
  Field,
  ModalSheet,
  Panel,
  Pill,
  Screen,
  SearchField,
  Segments,
  TextArea,
  TextInput
} from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { peso } from '@/utils/format';

const categories = ['Craft Tools', 'Cameras', 'Music Gear', 'Stationery', 'Sports', 'Other'];

export default function MarketplaceScreen() {
  const [params, setParams] = useSearchParams();
  const currentUser = useCurrentUser();
  const listings = useAppStore((state) => state.listings);
  const transactions = useAppStore((state) => state.transactions);
  const hobbies = useAppStore((state) => state.hobbies);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const submitOffer = useAppStore((state) => state.submitOffer);
  const purchaseListing = useAppStore((state) => state.purchaseListing);
  const createListing = useAppStore((state) => state.createListing);
  const decideOffer = useAppStore((state) => state.decideOffer);
  const rateTransaction = useAppStore((state) => state.rateTransaction);
  const [tab, setTab] = useState<'Browse' | 'Create' | 'Saved' | 'History'>('Browse');
  const [selectedId, setSelectedId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    mode: 'all'
  });
  const [offerForm, setOfferForm] = useState({ item: '', note: '' });
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'Craft Tools',
    hobbyId: hobbies[0]?.id ?? 'watercolor',
    photoUrl: '',
    condition: 'Good',
    swapPreference: '',
    pricePhp: '',
    availability: 'Weekends',
    mode: 'both'
  });

  useEffect(() => {
    if (params.get('compose') === '1') {
      setTab('Create');
      setParams({});
    }
  }, [params, setParams]);

  const selected = listings.find((listing) => listing.id === selectedId);
  const visible = useMemo(
    () =>
      listings.filter((listing) => {
        const searchMatch =
          !search ||
          `${listing.title} ${listing.description} ${listing.location.city}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const categoryMatch = filters.category === 'all' || listing.category === filters.category;
        const conditionMatch = filters.condition === 'all' || listing.condition === filters.condition;
        const modeMatch = filters.mode === 'all' || listing.mode === filters.mode;
        return searchMatch && categoryMatch && conditionMatch && modeMatch;
      }),
    [listings, filters, search]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Swap Marketplace"
      subtitle="Trade supplies, buy gear in PHP, save wishlist items, and keep all transaction history in one calm place."
      action={<Pill tone="warm">{visible.length} active listings</Pill>}
    >
      <Segments value={tab} options={['Browse', 'Create', 'Saved', 'History']} onChange={(next) => setTab(next as typeof tab)} />

      {tab === 'Browse' ? (
        <>
          <Panel>
            <SearchField value={search} onChange={setSearch} placeholder="Search by item, city, or category" />
            <div className="filter-row">
              <select
                className="text-input"
                value={filters.category}
                onChange={(event) => setFilters((state) => ({ ...state, category: event.target.value }))}
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="text-input"
                value={filters.condition}
                onChange={(event) => setFilters((state) => ({ ...state, condition: event.target.value }))}
              >
                <option value="all">Any condition</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Well-loved">Well-loved</option>
              </select>
              <select
                className="text-input"
                value={filters.mode}
                onChange={(event) => setFilters((state) => ({ ...state, mode: event.target.value }))}
              >
                <option value="all">Swap or sale</option>
                <option value="swap">Swap only</option>
                <option value="sale">Sale only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </Panel>

          {visible.length === 0 ? (
            <EmptyState
              title="Nothing matches those filters"
              body="Try clearing a filter or create the first listing in this niche."
              action={<Button onClick={() => setTab('Create')}>Create a listing</Button>}
            />
          ) : (
            <div className="stack-list">
              {visible.map((listing) => (
                <article className="listing-card" key={listing.id}>
                  <img alt={listing.title} src={listing.photos[0]} />
                  <div>
                    <span className="card-label">{listing.category}</span>
                    <strong>{listing.title}</strong>
                    <p>{listing.description}</p>
                    <small>
                      {listing.location.barangay}, {listing.location.city} • {listing.condition}
                    </small>
                    <div className="meta-row">
                      <Pill tone="teal">{peso(listing.pricePhp)}</Pill>
                      <Pill tone="neutral">{listing.mode}</Pill>
                    </div>
                    <div className="button-row">
                      <Button tone="secondary" onClick={() => setSelectedId(listing.id)}>
                        View
                      </Button>
                      <Button tone="secondary" onClick={() => toggleWishlist(listing.id)}>
                        {listing.savedBy.includes(currentUser.id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>

                    {listing.ownerId === currentUser.id && listing.offers.length ? (
                      <div className="offer-box">
                        <strong>Offers waiting on you</strong>
                        {listing.offers.map((offer) => (
                          <div className="offer-row" key={offer.id}>
                            <span>
                              {offer.offeredItem} • {offer.status}
                            </span>
                            {offer.status === 'pending' ? (
                              <div className="button-row">
                                <Button tone="secondary" onClick={() => decideOffer(listing.id, offer.id, 'declined')}>
                                  Decline
                                </Button>
                                <Button onClick={() => decideOffer(listing.id, offer.id, 'accepted')}>Accept</Button>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : null}

      {tab === 'Create' ? (
        <Panel eyebrow="New listing" title="Share something useful with the community">
          <div className="form-stack">
            <Field label="Item name">
              <TextInput value={createForm.title} onChange={(event) => setCreateForm((state) => ({ ...state, title: event.target.value }))} />
            </Field>
            <Field label="Description">
              <TextArea value={createForm.description} onChange={(event) => setCreateForm((state) => ({ ...state, description: event.target.value }))} />
            </Field>
            <div className="split-fields">
              <Field label="Category">
                <select className="text-input" value={createForm.category} onChange={(event) => setCreateForm((state) => ({ ...state, category: event.target.value }))}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hobby">
                <select className="text-input" value={createForm.hobbyId} onChange={(event) => setCreateForm((state) => ({ ...state, hobbyId: event.target.value }))}>
                  {hobbies.map((hobby) => (
                    <option key={hobby.id} value={hobby.id}>
                      {hobby.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="split-fields">
              <Field label="Condition">
                <select className="text-input" value={createForm.condition} onChange={(event) => setCreateForm((state) => ({ ...state, condition: event.target.value }))}>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Well-loved">Well-loved</option>
                </select>
              </Field>
              <Field label="Mode">
                <select className="text-input" value={createForm.mode} onChange={(event) => setCreateForm((state) => ({ ...state, mode: event.target.value }))}>
                  <option value="swap">Swap only</option>
                  <option value="sale">Sale only</option>
                  <option value="both">Both</option>
                </select>
              </Field>
            </div>
            <Field hint="Use an image URL or CDN path for now." label="Photo URL">
              <TextInput value={createForm.photoUrl} onChange={(event) => setCreateForm((state) => ({ ...state, photoUrl: event.target.value }))} />
            </Field>
            <Field label="Swap preference">
              <TextInput value={createForm.swapPreference} onChange={(event) => setCreateForm((state) => ({ ...state, swapPreference: event.target.value }))} />
            </Field>
            <div className="split-fields">
              <Field label="Price in PHP">
                <TextInput value={createForm.pricePhp} onChange={(event) => setCreateForm((state) => ({ ...state, pricePhp: event.target.value }))} />
              </Field>
              <Field label="Availability">
                <TextInput value={createForm.availability} onChange={(event) => setCreateForm((state) => ({ ...state, availability: event.target.value }))} />
              </Field>
            </div>

            <Button
              onClick={() => {
                createListing({
                  title: createForm.title,
                  description: createForm.description,
                  category: createForm.category,
                  hobbyId: createForm.hobbyId,
                  photoUrl: createForm.photoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                  condition: createForm.condition as 'New' | 'Good' | 'Well-loved',
                  swapPreference: createForm.swapPreference,
                  pricePhp: createForm.pricePhp ? Number(createForm.pricePhp) : null,
                  location: currentUser.location,
                  availability: createForm.availability,
                  mode: createForm.mode as 'swap' | 'sale' | 'both'
                });
                setTab('Browse');
              }}
            >
              Publish listing
            </Button>
          </div>
        </Panel>
      ) : null}

      {tab === 'Saved' ? (
        <Panel eyebrow="Wishlist" title="Saved items">
          <div className="stack-list">
            {listings.filter((listing) => listing.savedBy.includes(currentUser.id)).map((listing) => (
              <article className="list-card" key={listing.id}>
                <div>
                  <strong>{listing.title}</strong>
                  <p>{listing.description}</p>
                  <small>{peso(listing.pricePhp)}</small>
                </div>
                <Button tone="secondary" onClick={() => setSelectedId(listing.id)}>
                  View
                </Button>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      {tab === 'History' ? (
        <Panel eyebrow="Transaction history" title="Recent swap and sale activity">
          <div className="stack-list">
            {transactions.map((transaction) => (
              <article className="list-card" key={transaction.id}>
                <div>
                  <strong>
                    {transaction.type === 'sale' ? 'Sale' : 'Swap'} • {peso(transaction.amountPhp)}
                  </strong>
                  <p>Status: {transaction.status}</p>
                  <small>{transaction.createdAt.slice(0, 10)}</small>
                </div>
                <div className="button-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button className="rating-dot" key={value} onClick={() => rateTransaction(transaction.id, value)} type="button">
                      {value}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      <ModalSheet open={Boolean(selected)} onClose={() => setSelectedId('')} title={selected?.title ?? 'Listing'}>
        {selected ? (
          <div className="detail-sheet">
            <img alt={selected.title} src={selected.photos[0]} />
            <p>{selected.description}</p>
            <p>
              {selected.location.barangay}, {selected.location.city} • {selected.condition}
            </p>
            <p>{selected.swapPreference}</p>
            <div className="meta-row">
              <Pill tone="warm">{peso(selected.pricePhp)}</Pill>
              <Pill tone="neutral">{selected.mode}</Pill>
            </div>

            {selected.ownerId !== currentUser.id ? (
              <>
                <Field label="Offer to swap">
                  <TextInput
                    placeholder="What are you offering in return?"
                    value={offerForm.item}
                    onChange={(event) => setOfferForm((state) => ({ ...state, item: event.target.value }))}
                  />
                </Field>
                <Field label="Offer note">
                  <TextArea
                    placeholder="Pickup details, add-on cash, or availability"
                    value={offerForm.note}
                    onChange={(event) => setOfferForm((state) => ({ ...state, note: event.target.value }))}
                  />
                </Field>
                <div className="button-row">
                  <Button
                    tone="secondary"
                    onClick={() => {
                      submitOffer(selected.id, offerForm.item, offerForm.note);
                      setSelectedId('');
                    }}
                  >
                    Send offer
                  </Button>
                  {selected.pricePhp !== null ? (
                    <Button
                      onClick={() => {
                        purchaseListing(selected.id);
                        setSelectedId('');
                      }}
                    >
                      Buy now
                    </Button>
                  ) : null}
                </div>
              </>
            ) : (
              <Panel eyebrow="Owner tools" title="Manage offers">
                {selected.offers.length ? (
                  selected.offers.map((offer) => (
                    <div className="offer-row" key={offer.id}>
                      <span>
                        {offer.offeredItem} • {offer.note}
                      </span>
                      {offer.status === 'pending' ? (
                        <div className="button-row">
                          <Button tone="secondary" onClick={() => decideOffer(selected.id, offer.id, 'declined')}>
                            Decline
                          </Button>
                          <Button onClick={() => decideOffer(selected.id, offer.id, 'accepted')}>Accept</Button>
                        </div>
                      ) : (
                        <Pill tone="neutral">{offer.status}</Pill>
                      )}
                    </div>
                  ))
                ) : (
                  <EmptyState title="No offers yet" body="Share this listing with your local circles or wait for the next community browse wave." />
                )}
              </Panel>
            )}
          </div>
        ) : null}
      </ModalSheet>
    </Screen>
  );
}
