from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str
    roles: Optional[List[int]] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    roles: Optional[List[int]] = None

class User(UserBase):
    id: int
    roles: List[Role] = []

    class Config:
        orm_mode = True

class UserActivityBase(BaseModel):
    event_type: str
    details: Optional[str] = None

class UserActivity(UserActivityBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseFile(BaseModel):
    id: int
    filename: str
    url: str

    class Config:
        orm_mode = True

class Course(CourseBase):
    id: int
    files: List[CourseFile] = []

    class Config:
        orm_mode = True 