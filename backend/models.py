from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from database import Base  # импортировать Base из database.py корневого уровня

import datetime

# таблица связей многие-ко-многим между пользователями и ролями
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # связи
    roles = relationship('Role', secondary=user_roles, back_populates='users')
    activities = relationship('UserActivity', back_populates='user')

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    users = relationship('User', secondary=user_roles, back_populates='roles')

class UserActivity(Base):
    __tablename__ = 'user_activities'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    event_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    details = Column(Text, nullable=True)

    user = relationship('User', back_populates='activities')

# добавить модели для курсов и прикрепленных файлов
database_imports_restored = True  # placeholder to preserve context
class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    files = relationship('CourseFile', back_populates='course', cascade='all, delete-orphan')

class CourseFile(Base):
    __tablename__ = 'course_files'

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)

    course = relationship('Course', back_populates='files')

    @property
    def url(self) -> str:
        # compute public URL for the file
        return f"/static/courses/{self.course_id}/{self.filename}" 