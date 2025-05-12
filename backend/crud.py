from sqlalchemy.orm import Session
from models import User, Role, UserActivity, Course, CourseFile
from schemas import UserCreate, UserUpdate, RoleCreate, CourseCreate
from passlib.context import CryptContext
import datetime
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

# хеширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# crud для ролей

def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.id == role_id).first()

def get_role_by_name(db: Session, name: str):
    return db.query(Role).filter(Role.name == name).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: RoleCreate):
    # предотвращение создания дубликатов ролей
    existing = get_role_by_name(db, role.name)
    if existing:
        raise HTTPException(status_code=400, detail="Role already exists")
    try:
        db_role = Role(name=role.name, description=role.description)
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Role already exists")

# crud для пользователей

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    # предотвращение дублирования имени пользователя или email
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=user.is_active
    )
    try:
        if user.roles:
            roles = db.query(Role).filter(Role.id.in_(user.roles)).all()
            db_user.roles = roles
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Could not create user")

def update_user(db: Session, db_user: User, user_update: UserUpdate):
    if user_update.full_name is not None:
        db_user.full_name = user_update.full_name
    if user_update.is_active is not None:
        db_user.is_active = user_update.is_active
    if user_update.roles is not None:
        roles = db.query(Role).filter(Role.id.in_(user_update.roles)).all()
        db_user.roles = roles
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, db_user: User):
    db.delete(db_user)
    db.commit()

# запись активности

def create_user_activity(db: Session, user_id: int, event_type: str, details: str = None):
    activity = UserActivity(
        user_id=user_id,
        event_type=event_type,
        timestamp=datetime.datetime.utcnow(),
        details=details
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Course).offset(skip).limit(limit).all()

def get_course(db: Session, course_id: int):
    return db.query(Course).filter(Course.id == course_id).first()

def create_course(db: Session, course: CourseCreate):
    db_course = Course(title=course.title, description=course.description)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_course_files(db: Session, course_id: int):
    return db.query(CourseFile).filter(CourseFile.course_id == course_id).all()

def create_course_file(db: Session, course_id: int, filename: str, filepath: str):
    db_file = CourseFile(course_id=course_id, filename=filename, filepath=filepath)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def update_course(db: Session, course_id: int, course: CourseCreate):
    """Update title and description of existing course"""
    db_course = get_course(db, course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db_course.title = course.title
    db_course.description = course.description
    db.commit()
    db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    """Delete an existing course"""
    db_course = get_course(db, course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"ok": True}

def get_user_activities(db: Session, user_id: int):
    return db.query(UserActivity).filter(UserActivity.user_id == user_id).all() 