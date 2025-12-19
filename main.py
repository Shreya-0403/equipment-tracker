from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal, engine
from models import Base, Equipment


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class EquipmentCreate(BaseModel):
    name: str
    type: str
    status: str
    last_cleaned: str


@app.get("/api/equipment")
def get_all_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).all()


@app.post("/api/equipment")
def add_equipment(item: EquipmentCreate, db: Session = Depends(get_db)):
    equipment = Equipment(
        name=item.name,
        type=item.type,
        status=item.status,
        last_cleaned=item.last_cleaned
    )
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment


@app.put("/api/equipment/{item_id}")
def update_equipment(item_id: int, item: EquipmentCreate, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.id == item_id).first()
    equipment.name = item.name
    equipment.type = item.type
    equipment.status = item.status
    equipment.last_cleaned = item.last_cleaned
    db.commit()
    return equipment


@app.delete("/api/equipment/{item_id}")
def delete_equipment(item_id: int, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.id == item_id).first()
    db.delete(equipment)
    db.commit()
    return {"message": "Deleted successfully"}
