from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from supabase import create_client, Client
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SkillOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = "HS256"

# ─── Auth helpers ───────────────────────────────────────────

def create_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─── Pydantic models ─────────────────────────────────────────

class RegisterInput(BaseModel):
    name: str
    email: str
    password: str

class ResourceCreate(BaseModel):
    platform: str
    platform_color: Optional[str] = None
    title: str
    url: Optional[str] = None
    duration: Optional[str] = None
    tags: Optional[List[str]] = []

class ResourceUpdate(BaseModel):
    progress: Optional[int] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None

class DeckCreate(BaseModel):
    title: str
    color: Optional[str] = "indigo"

class CardCreate(BaseModel):
    question: str
    answer: str
    source: Optional[str] = None

class CardReview(BaseModel):
    rating: int  # 0=Again 1=Hard 2=Good 3=Easy

class BuddyRequestCreate(BaseModel):
    to_user_id: str

# ─── Auth routes ─────────────────────────────────────────────

@app.post("/auth/register")
def register(data: RegisterInput):
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(400, "Email already registered")
    hashed = pwd_context.hash(data.password)
    result = supabase.table("users").insert({
        "name": data.name,
        "email": data.email,
        "password_hash": hashed
    }).execute()
    user = result.data[0]
    return {"access_token": create_token(user["id"]), "token_type": "bearer"}

@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    result = supabase.table("users").select("*").eq("email", form.username).execute()
    if not result.data:
        raise HTTPException(401, "Invalid credentials")
    user = result.data[0]
    if not pwd_context.verify(form.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    return {"access_token": create_token(user["id"]), "token_type": "bearer"}

# ─── User routes ──────────────────────────────────────────────

@app.get("/users/me")
def get_me(user_id: str = Depends(get_current_user)):
    result = supabase.table("users").select(
        "id,name,email,level,xp,xp_to_next,streak,last_active"
    ).eq("id", user_id).single().execute()
    return result.data

# ─── Resources routes ─────────────────────────────────────────

@app.get("/resources")
def list_resources(user_id: str = Depends(get_current_user)):
    result = supabase.table("resources").select("*").eq("user_id", user_id).execute()
    return result.data

@app.post("/resources", status_code=201)
def create_resource(data: ResourceCreate, user_id: str = Depends(get_current_user)):
    result = supabase.table("resources").insert({
        **data.dict(), "user_id": user_id
    }).execute()
    return result.data[0]

@app.patch("/resources/{resource_id}")
def update_resource(resource_id: str, data: ResourceUpdate,
                    user_id: str = Depends(get_current_user)):
    # Only update fields that were actually provided
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(400, "Nothing to update")
    result = supabase.table("resources").update(update_data)\
        .eq("id", resource_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(404, "Resource not found")
    return result.data[0]

@app.delete("/resources/{resource_id}", status_code=204)
def delete_resource(resource_id: str, user_id: str = Depends(get_current_user)):
    supabase.table("resources").delete()\
        .eq("id", resource_id).eq("user_id", user_id).execute()

# ─── Flashcard deck routes ────────────────────────────────────

@app.get("/decks")
def list_decks(user_id: str = Depends(get_current_user)):
    decks = supabase.table("flashcard_decks").select("*")\
        .eq("user_id", user_id).execute().data
    # Annotate each deck with card counts
    for deck in decks:
        cards = supabase.table("flashcards").select("id,due_date")\
            .eq("deck_id", deck["id"]).execute().data
        deck["card_count"] = len(cards)
        deck["due_count"] = sum(1 for c in cards if c["due_date"] <= str(date.today()))
        deck["mastered_count"] = sum(1 for c in cards if c.get("review_count", 0) >= 3)
    return decks

@app.post("/decks", status_code=201)
def create_deck(data: DeckCreate, user_id: str = Depends(get_current_user)):
    result = supabase.table("flashcard_decks").insert({
        **data.dict(), "user_id": user_id
    }).execute()
    return result.data[0]

@app.get("/decks/{deck_id}/cards")
def list_cards(deck_id: str, due_only: bool = False,
               user_id: str = Depends(get_current_user)):
    query = supabase.table("flashcards").select("*").eq("deck_id", deck_id)
    if due_only:
        query = query.lte("due_date", str(date.today()))
    return query.execute().data

@app.post("/decks/{deck_id}/cards", status_code=201)
def create_card(deck_id: str, data: CardCreate,
                user_id: str = Depends(get_current_user)):
    result = supabase.table("flashcards").insert({
        **data.dict(), "deck_id": deck_id
    }).execute()
    return result.data[0]

@app.post("/cards/{card_id}/review")
def review_card(card_id: str, data: CardReview,
                user_id: str = Depends(get_current_user)):
    card = supabase.table("flashcards").select("*")\
        .eq("id", card_id).single().execute().data

    # Simple FSRS-inspired scheduling
    intervals = {0: 1, 1: 3, 2: 7, 3: 14}  # days per rating
    new_stability = card["stability"] * (1 + 0.1 * data.rating)
    new_difficulty = max(0.1, card["difficulty"] - 0.05 * (data.rating - 2))
    days_ahead = intervals.get(data.rating, 7)
    next_due = date.today() + timedelta(days=days_ahead)

    result = supabase.table("flashcards").update({
        "stability": new_stability,
        "difficulty": new_difficulty,
        "due_date": str(next_due),
        "last_review": str(date.today()),
        "review_count": card["review_count"] + 1
    }).eq("id", card_id).execute()
    return result.data[0]

# ─── Activity / heatmap routes ────────────────────────────────

@app.get("/activity/heatmap")
def get_heatmap(user_id: str = Depends(get_current_user)):
    # Last 365 days
    since = str(date.today() - timedelta(days=365))
    rows = supabase.table("activity_log").select("date,minutes")\
        .eq("user_id", user_id).gte("date", since).execute().data
    return {r["date"]: r["minutes"] for r in rows}

@app.post("/activity/log")
def log_activity(minutes: int, user_id: str = Depends(get_current_user)):
    today = str(date.today())
    # Upsert — adds to today's total if it already exists
    existing = supabase.table("activity_log").select("id,minutes")\
        .eq("user_id", user_id).eq("date", today).execute().data
    if existing:
        new_total = existing[0]["minutes"] + minutes
        supabase.table("activity_log").update({"minutes": new_total})\
            .eq("id", existing[0]["id"]).execute()
    else:
        supabase.table("activity_log").insert({
            "user_id": user_id, "date": today, "minutes": minutes
        }).execute()
    return {"date": today, "minutes": minutes}

# ─── Recommendations (rule-based for now) ────────────────────

@app.get("/recommendations")
def get_recommendations(user_id: str = Depends(get_current_user)):
    resources = supabase.table("resources").select("tags,platform")\
        .eq("user_id", user_id).execute().data

    # Collect all tags the user has engaged with
    all_tags = [tag for r in resources for tag in (r.get("tags") or [])]
    platforms_used = list({r["platform"] for r in resources})

    # In real life this hits your ML model — for now return a placeholder
    return {
        "tags_profile": list(set(all_tags)),
        "platforms": platforms_used,
        "note": "Replace this endpoint with your ML model output"
    }

# ─── Study buddies ────────────────────────────────────────────

@app.get("/buddies/matches")
def find_buddies(user_id: str = Depends(get_current_user)):
    # Get other users (exclude self and already-requested)
    sent = supabase.table("buddy_requests").select("to_user_id")\
        .eq("from_user_id", user_id).execute().data
    exclude_ids = {r["to_user_id"] for r in sent} | {user_id}

    others = supabase.table("users").select(
        "id,name,level,xp"
    ).execute().data
    matches = [u for u in others if u["id"] not in exclude_ids][:10]
    return matches

@app.post("/buddies/request", status_code=201)
def send_buddy_request(data: BuddyRequestCreate,
                        user_id: str = Depends(get_current_user)):
    result = supabase.table("buddy_requests").insert({
        "from_user_id": user_id,
        "to_user_id": data.to_user_id
    }).execute()
    return result.data[0]

# ─── Run ──────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)