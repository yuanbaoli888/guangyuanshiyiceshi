import json
import sys
import threading
import time
from pathlib import Path
from urllib.error import URLError
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from uuid import uuid4

import uvicorn

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app

BASE_URL = "http://127.0.0.1:8765"


def request_json(method: str, path: str, payload: dict | None = None, token: str | None = None):
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request(f"{BASE_URL}{path}", data=body, headers=headers, method=method)
    with urlopen(request, timeout=5) as response:
        response_body = response.read().decode("utf-8")
        return json.loads(response_body) if response_body else None


def wait_until_ready() -> None:
    deadline = time.time() + 10
    while time.time() < deadline:
        try:
            request_json("GET", "/health")
            return
        except (HTTPError, URLError, TimeoutError):
            time.sleep(0.2)
    raise RuntimeError("Server did not become ready in time")


def main() -> None:
    config = uvicorn.Config(app, host="127.0.0.1", port=8765, log_level="warning")
    server = uvicorn.Server(config)
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()

    try:
        wait_until_ready()

        suffix = uuid4().hex[:8]
        username = f"demo_{suffix}"
        email = f"{username}@example.com"
        password = "password123"

        registered = request_json(
            "POST",
            "/auth/register",
            {"username": username, "email": email, "password": password},
        )
        token_response = request_json(
            "POST",
            "/auth/login",
            {"username_or_email": username, "password": password},
        )
        token = token_response["access_token"]
        me = request_json("GET", "/auth/me", token=token)
        users = request_json("GET", "/users", token=token)
        logout = request_json("POST", "/auth/logout", token=token)

        revoked_status = "unexpected_success"
        try:
            request_json("GET", "/auth/me", token=token)
        except HTTPError as exc:
            revoked_status = exc.code

        print(
            json.dumps(
                {
                    "registered_user": registered["username"],
                    "me": me["username"],
                    "users_count": len(users),
                    "logout": logout["message"],
                    "revoked_token_status": revoked_status,
                },
                indent=2,
            )
        )
    finally:
        server.should_exit = True
        thread.join(timeout=5)


if __name__ == "__main__":
    main()
