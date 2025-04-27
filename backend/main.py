from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

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

# Data models
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

# In-memory storage
courses: List[Course] = []
students: List[Student] = []
teachers: List[Teacher] = []
schedules: List[Schedule] = []

# Courses
@app.get("/api/courses", response_model=List[Course])
def list_courses():
    return courses

@app.post("/api/courses", response_model=Course)
def create_course(course: Course):
    courses.append(course)
    return course

# Students
@app.get("/api/students", response_model=List[Student])
def list_students():
    return students

@app.post("/api/students", response_model=Student)
def create_student(student: Student):
    students.append(student)
    return student

# Teachers
@app.get("/api/teachers", response_model=List[Teacher])
def list_teachers():
    return teachers

@app.post("/api/teachers", response_model=Teacher)
def create_teacher(teacher: Teacher):
    teachers.append(teacher)
    return teacher

# Schedules
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