import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_DB: str = os.getenv("POSTGRES_DB")
POSTGRES_USER: str = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST: str = os.getenv("POSTGRES_HOST")
POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT"))
QUESTIONS_URL: str = os.getenv("QUESTIONS_URL")

SECRET_KEY: str = os.getenv("SECRET_KEY")

FAKE_DATA: bool = True if os.getenv("FAKE_DATA").lower() == "true" else False

DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}' \
               f'@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
