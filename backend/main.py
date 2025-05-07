from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal, init_db, get_db
from sqlalchemy.orm import Session
from crud import create_role, get_roles, create_user, get_users, get_role_by_name  # импортировать функции crud
from schemas import RoleCreate, Role, UserCreate, User, Token  # импортировать схемы pydantic
from fastapi.security import OAuth2PasswordRequestForm
from auth import authenticate_user, create_access_token
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# модели данных
class Course(BaseModel):
    id: int
    title: str
    description: str

class Student(BaseModel):
    id: int
    name: str

class Teacher(BaseModel):
    id: int
    name: str

class Schedule(BaseModel):
    id: int
    date: str
    day_of_week: str
    start_time: str
    end_time: str
    subject: str
    teacher: str
    classroom: str
    group_name: str

# хранилище в памяти
courses: List[Course] = []
students: List[Student] = []
teachers: List[Teacher] = []
schedules: List[Schedule] = []

# курсы
@app.get("/api/courses", response_model=List[Course])
def list_courses():
    return courses

@app.post("/api/courses", response_model=Course)
def create_course(course: Course):
    courses.append(course)
    return course

# студенты
@app.get("/api/students", response_model=List[Student])
def list_students():
    return students

@app.post("/api/students", response_model=Student)
def create_student(student: Student):
    students.append(student)
    return student

# преподаватели
@app.get("/api/teachers", response_model=List[Teacher])
def list_teachers():
    return teachers

@app.post("/api/teachers", response_model=Teacher)
def create_teacher(teacher: Teacher):
    teachers.append(teacher)
    return teacher

# расписания
@app.get("/api/schedules", response_model=List[Schedule])
def list_schedules():
    return schedules

@app.post("/api/schedules", response_model=Schedule)
def create_schedule(schedule: Schedule):
    schedules.append(schedule)
    return schedule

@app.put("/api/schedules/{id}", response_model=Schedule)
def update_schedule(id: int, schedule: Schedule):
    for idx, s in enumerate(schedules):
        if s.id == id:
            schedules[idx] = schedule
            return schedule
    raise HTTPException(status_code=404, detail="Schedule not found")

@app.delete("/api/schedules/{id}")
def delete_schedule(id: int):
    global schedules
    schedules = [s for s in schedules if s.id != id]
    return {"ok": True}

# endpoints для ролей
@app.post("/api/roles", response_model=Role)
def api_create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return create_role(db, role)

@app.get("/api/roles", response_model=List[Role])
def api_list_roles(db: Session = Depends(get_db)):
    return get_roles(db)

# endpoints для пользователей
@app.post("/api/users", response_model=User)
def api_create_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@app.get("/api/users", response_model=List[User])
def api_list_users(db: Session = Depends(get_db)):
    return get_users(db)

# монтировать директорию 'static' для обслуживания файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# маршрут favicon для избежания 404
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")

@app.on_event("startup")
async def on_startup():
    init_db()
    # заполнить роли по умолчанию, если они не существуют
    db = SessionLocal()
    try:
        for name, desc in [("student", "Student role"), ("teacher", "Teacher role"), ("admin", "Administrator role")]:
            if not get_role_by_name(db, name):
                create_role(db, RoleCreate(name=name, description=desc))
    finally:
        db.close()

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 