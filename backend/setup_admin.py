import requests

BASE_URL = "http://localhost:3001"


def create_admin_role():
    url = f"{BASE_URL}/api/roles"
    payload = {"name": "admin", "description": "Administrator"}
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    data = resp.json()
    print("Role created:", data)
    return data["id"]


def create_admin_user(role_id):
    url = f"{BASE_URL}/api/users"
    payload = {
        "username": "admin",
        "email": "admin@example.com",
        "password": "adminpass",
        "full_name": "Site Administrator",
        "is_active": True,
        "roles": [role_id],
    }
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    data = resp.json()
    print("User created:", data)


def get_token(username, password):
    url = f"{BASE_URL}/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    resp = requests.post(url, data={"username": username, "password": password}, headers=headers)
    resp.raise_for_status()
    token = resp.json()["access_token"]
    print("Token obtained:", token)
    return token


def call_protected(token):
    url = f"{BASE_URL}/api/users"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    print("Protected data:", resp.json())


if __name__ == "__main__":
    rid = create_admin_role()
    create_admin_user(rid)
    jwt = get_token("admin", "adminpass")
    call_protected(jwt) 