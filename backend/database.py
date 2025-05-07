import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

# url базы данных sqlalchemy, по умолчанию локальный файл sqlite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

# создать движок; для sqlite отключить проверку потоков
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# создать настроенный класс session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# базовый класс для декларативных определений классов
Base = declarative_base()


def init_db():
    """
    инициализировать базу данных, создавая все таблицы.
    """
    Base.metadata.create_all(bind=engine)

# предоставить зависимость сеанса базы данных
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()