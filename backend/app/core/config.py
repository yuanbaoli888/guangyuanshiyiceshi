from functools import cached_property
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Fullstack Auth Scaffold"
    environment: str = "development"
    secret_key: str = Field(default="change-me-in-production", min_length=16)
    access_token_expire_minutes: int = 60 * 24
    db_path: str = "./app.db"
    backend_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @cached_property
    def database_url(self) -> str:
        if self.db_path.startswith("sqlite:///"):
            return self.db_path
        path = Path(self.db_path)
        return f"sqlite:///{path.as_posix()}"

    @cached_property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


settings = Settings()
