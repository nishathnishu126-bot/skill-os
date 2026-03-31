import React, { useState, useEffect } from "react";
import { RotateCcw, CheckCircle2, Layers, ChevronRight } from "lucide-react";
import { api } from "../api";

const RATINGS = [
  { label: "Again", sub: "< 1 min",  cls: "border-red-300 text-red-600 hover:bg-red-50",       rating: 0 },
  { label: "Hard",  sub: "~10 min",  cls: "border-amber-300 text-amber-600 hover:bg-amber-50",  rating: 1 },
  { label: "Good",  sub: "~3 days",  cls: "border-indigo-300 text-indigo-600 hover:bg-indigo-50", rating: 2 },
  { label: "Easy",  sub: "~1 week",  cls: "border-green-300 text-green-600 hover:bg-green-50",  rating: 3 },
];

export default function Flashcards() {
  const [decks, setDecks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cards, setCards]           = useState([]);
  const [cardIndex, setCardIndex]   = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    api.decks()
      .then(setDecks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function startDeck(deckId) {
    try {
      const deckCards = await api.cards(deckId);
      setCards(deckCards);
      setActiveDeck(deckId);
      setCardIndex(0);
      setFlipped(false);
      setDone(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function rate(rating) {
    const card = cards[cardIndex];
    try {
      await api.reviewCard(card.id, rating);
    } catch (err) {
      console.error(err);
    }
    if (cardIndex + 1 >= cards.length) {
      setDone(true);
      // Refresh deck counts
      api.decks().then(setDecks).catch(console.error);
    } else {
      setCardIndex(i => i + 1);
      setFlipped(false);
    }
  }

  // Deck list
  if (!activeDeck) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Flashcard decks</h2>
          <p className="text-sm text-slate-500">Spaced repetition powered by FSRS algorithm</p>
        </div>
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        <div className="space-y-4">
          {decks.map(deck => (
            <DeckCard key={deck.id} deck={deck} onStart={() => startDeck(deck.id)} />
          ))}
        </div>
        {!loading && decks.length === 0 && (
          <p className="text-center py-12 text-slate-400 text-sm">No decks yet. Create one to get started.</p>
        )}
        <button className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
          + Create new deck
        </button>
      </div>
    );
  }

  const deck = decks.find(d => d.id === activeDeck);

  // Done view
  if (done) {
    return (
      <div className="p-8 max-w-xl mx-auto w-full flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Session complete!</h2>
        <p className="text-slate-500 mb-8">
          You reviewed all {cards.length} cards in{" "}
          <span className="font-semibold text-slate-700">{deck?.title}</span>.
        </p>
        <div className="flex gap-3">
          <button onClick={() => startDeck(activeDeck)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Review again
          </button>
          <button onClick={() => setActiveDeck(null)}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
            Back to decks
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="p-8 max-w-xl mx-auto w-full flex flex-col items-center text-center">
        <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">All caught up!</h2>
        <p className="text-slate-500 mb-6">No cards due in this deck right now.</p>
        <button onClick={() => setActiveDeck(null)}
          className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
          Back to decks
        </button>
      </div>
    );
  }

  const card = cards[cardIndex];

  // Study view
  return (
    <div className="p-8 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setActiveDeck(null)}
          className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
          ← Decks
        </button>
        <span className="text-sm font-semibold text-slate-700">{deck?.title}</span>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          {cardIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-8">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(cardIndex / cards.length) * 100}%` }}
        />
      </div>

      <div
        onClick={() => setFlipped(f => !f)}
        className={`relative min-h-[240px] rounded-3xl border-2 p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-200 hover:shadow-lg ${
          flipped ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-200"
        }`}
      >
        <span className={`text-xs font-bold uppercase tracking-wider mb-5 ${flipped ? "text-indigo-400" : "text-slate-400"}`}>
          {flipped ? "Answer" : "Question"}
        </span>
        <p className="text-base font-semibold text-slate-900 leading-relaxed">
          {flipped ? card.answer : card.question}
        </p>
        {!flipped && <p className="text-xs text-slate-400 mt-6">Tap to reveal answer</p>}
        {card.source && (
          <span className="absolute top-4 right-4 text-[10px] text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">
            {card.source}
          </span>
        )}
      </div>

      {flipped ? (
        <div className="mt-6">
          <p className="text-xs text-center text-slate-400 mb-3">How well did you remember?</p>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map(r => (
              <button key={r.label} onClick={() => rate(r.rating)}
                className={`flex flex-col items-center py-3 rounded-xl border-2 font-semibold text-xs transition-all active:scale-95 ${r.cls}`}>
                <span>{r.label}</span>
                <span className="text-[10px] opacity-60 mt-0.5">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setFlipped(true)}
          className="mt-6 w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
          Reveal answer
        </button>
      )}
    </div>
  );
}

function DeckCard({ deck, onStart }) {
  const pct = deck.card_count > 0
    ? Math.round((deck.mastered_count / deck.card_count) * 100)
    : 0;
  const colorMap = {
    indigo: { bar: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700" },
    purple: { bar: "bg-purple-500", badge: "bg-purple-50 text-purple-700" },
    blue:   { bar: "bg-blue-500",   badge: "bg-blue-50 text-blue-700"     },
  };
  const c = colorMap[deck.color] ?? colorMap.indigo;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5 hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${c.badge} flex items-center justify-center shrink-0`}>
        <Layers className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-semibold text-slate-900 text-sm truncate">{deck.title}</p>
          {deck.due_count > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${c.badge}`}>
              {deck.due_count} due
            </span>
          )}
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
          <div className={`${c.bar} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-slate-400">{deck.mastered_count}/{deck.card_count} mastered</p>
      </div>
      <button onClick={onStart}
        className="shrink-0 p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors"
        title="Start session">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}