from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal, init_db, get_db
from sqlalchemy.orm import Session
from crud import create_role, get_roles, create_user, get_users, get_user, update_user, delete_user, get_role_by_name, get_courses, get_course, create_course as create_course_db, get_course_files, create_course_file, update_course, delete_course as delete_course_db, get_user_activities, get_summary_metrics  # импортировать функции crud
from schemas import RoleCreate, Role, UserCreate, User, UserUpdate, UserActivity, Token, CourseCreate, Course as CourseSchema, CourseFile as CourseFileSchema  # импортировать схемы pydantic
from fastapi.security import OAuth2PasswordRequestForm
from auth import authenticate_user, create_access_token
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
from fastapi import Request
import os

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
students: List[Student] = []
teachers: List[Teacher] = []
schedules: List[Schedule] = []

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

@app.get("/api/users/{user_id}", response_model=User)
def api_get_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}", response_model=User)
def api_update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(db, db_user, user_update)

@app.delete("/api/users/{user_id}")
def api_delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    delete_user(db, db_user)
    return {"ok": True}

@app.get("/api/users/{user_id}/activities", response_model=List[UserActivity])
def api_get_user_activities(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_user_activities(db, user_id)

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

# endpoints для курсов
@app.get("/api/courses", response_model=List[CourseSchema])
def api_list_courses(db: Session = Depends(get_db)):
    return get_courses(db)

@app.post("/api/courses", response_model=CourseSchema)
def api_create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return create_course_db(db, course)

# endpoints для файлов курсов
@app.post("/api/courses/{course_id}/files", response_model=CourseFileSchema)
async def api_upload_course_file(request: Request, course_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    upload_dir = os.path.join("static", "courses", str(course_id))
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    db_file = create_course_file(db, course_id, file.filename, file_path)
    # return absolute URL for frontend to download
    url = str(request.base_url).rstrip("/") + f"/static/courses/{course_id}/{db_file.filename}"
    return CourseFileSchema(id=db_file.id, filename=db_file.filename, url=url)

@app.get("/api/courses/{course_id}/files", response_model=List[CourseFileSchema])
def api_get_course_files(request: Request, course_id: int, db: Session = Depends(get_db)):
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    files = get_course_files(db, course_id)
    base_url = str(request.base_url).rstrip("/")
    # return list with absolute URLs for each file
    return [CourseFileSchema(id=f.id, filename=f.filename, url=f"{base_url}/static/courses/{course_id}/{f.filename}") for f in files]

@app.delete("/api/courses/{course_id}/files/{file_id}")
def api_delete_course_file(course_id: int, file_id: int, db: Session = Depends(get_db)):
    # ensure course exists
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    # find the file record
    files = get_course_files(db, course_id)
    db_file = next((f for f in files if f.id == file_id), None)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    # remove file from disk
    try:
        os.remove(db_file.filepath)
    except OSError:
        pass
    # delete record
    db.delete(db_file)
    db.commit()
    return {"ok": True}

@app.get("/api/courses/{course_id}", response_model=CourseSchema)
def api_get_course(course_id: int, db: Session = Depends(get_db)):
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.put("/api/courses/{course_id}", response_model=CourseSchema)
def api_update_course(course_id: int, course: CourseCreate, db: Session = Depends(get_db)):
    return update_course(db, course_id, course)

@app.delete("/api/courses/{course_id}")
def api_delete_course(course_id: int, db: Session = Depends(get_db)):
    delete_course_db(db, course_id)
    return {"ok": True}

@app.get("/api/metrics/summary")
def api_get_metrics(db: Session = Depends(get_db)):
    return get_summary_metrics(db)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 