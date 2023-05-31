from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import env
from fastapi import HTTPException, status

try:
    engine = create_engine(
        f"postgresql://{env.DB_USER}:{env.DB_PASSWORD}@{env.DB_HOST}:{env.DB_PORT}/{env.DB}",
        echo=False
    )
    session = sessionmaker(bind=engine)()
    base = declarative_base()

except Exception as e:
    print(f'error in establishing connection with database{e}')
    raise HTTPException(status_code=503)
