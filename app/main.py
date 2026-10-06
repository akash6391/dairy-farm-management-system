from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import animals, milk_logs, breeding,inventory,sales,expenses,analytics,auth,medical

app = FastAPI(title="Dairy Farm PostgreSQL API", version="1.0.0")

# CORS middleware enable karein taaki frontend ya Swagger UI asani se connect ho sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to automatically create all tables in PostgreSQL
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include all modular routers
app.include_router(animals.router)
app.include_router(milk_logs.router)
app.include_router(breeding.router)
app.include_router(inventory.router)
app.include_router(sales.router)
app.include_router(expenses.router)
app.include_router(analytics.router)
app.include_router(auth.router)
app.include_router(medical.router)
@app.get("/")
async def root():
    return {"message": "Welcome to Dairy Farm & Animal Tracking API!"}