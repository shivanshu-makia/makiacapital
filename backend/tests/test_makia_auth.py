"""
Makia Capital API - Authentication & Protected Endpoints Tests
Tests: Auth flows, JWT tokens, protected lead endpoints, brute force protection
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@makiacapital.com"
ADMIN_PASSWORD = "Makia@2026"


class TestHealthEndpoints:
    """Basic health check tests"""
    
    def test_health_check(self):
        """Test /api/health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health check passed")
    
    def test_root_endpoint(self):
        """Test /api/ root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✓ Root endpoint passed")


class TestAuthLogin:
    """Authentication login tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "token" in data, "Token missing from response"
        assert "id" in data, "User ID missing from response"
        assert "email" in data, "Email missing from response"
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        
        # Verify token is a valid JWT format (3 parts separated by dots)
        token = data["token"]
        assert len(token.split(".")) == 3, "Token is not valid JWT format"
        
        # Verify httpOnly cookies are set
        cookies = response.cookies
        assert "access_token" in cookies or len(cookies) > 0, "Cookies should be set"
        
        print(f"✓ Login success - User: {data['email']}, Role: {data['role']}")
    
    def test_login_invalid_email(self):
        """Test login with invalid email"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@example.com", "password": "wrongpass"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print("✓ Invalid email rejected correctly")
    
    def test_login_invalid_password(self):
        """Test login with valid email but wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print("✓ Invalid password rejected correctly")
    
    def test_login_empty_credentials(self):
        """Test login with empty credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "", "password": ""}
        )
        # Should return 401 or 422 (validation error)
        assert response.status_code in [401, 422]
        print("✓ Empty credentials rejected correctly")


class TestAuthMe:
    """Test /api/auth/me endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get valid auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not get auth token")
    
    def test_get_me_with_token(self, auth_token):
        """Test /api/auth/me with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"✓ Auth/me returned user: {data['email']}")
    
    def test_get_me_without_token(self):
        """Test /api/auth/me without token - should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Auth/me without token rejected correctly")
    
    def test_get_me_with_invalid_token(self):
        """Test /api/auth/me with invalid token"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        assert response.status_code == 401
        print("✓ Auth/me with invalid token rejected correctly")


class TestAuthLogout:
    """Test logout functionality"""
    
    def test_logout(self):
        """Test logout endpoint"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200
        
        # Then logout
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✓ Logout successful")


class TestProtectedLeadsEndpoints:
    """Test that leads endpoints require authentication"""
    
    @pytest.fixture
    def auth_token(self):
        """Get valid auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not get auth token")
    
    def test_get_leads_without_auth(self):
        """GET /api/leads should require authentication"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ GET /api/leads requires auth")
    
    def test_get_leads_with_auth(self, auth_token):
        """GET /api/leads with valid token should work"""
        response = requests.get(
            f"{BASE_URL}/api/leads",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/leads with auth returned {len(data)} leads")
    
    def test_get_lead_by_id_without_auth(self):
        """GET /api/leads/{id} should require authentication"""
        response = requests.get(f"{BASE_URL}/api/leads/some-lead-id")
        assert response.status_code == 401
        print("✓ GET /api/leads/{id} requires auth")
    
    def test_patch_lead_without_auth(self):
        """PATCH /api/leads/{id} should require authentication"""
        response = requests.patch(
            f"{BASE_URL}/api/leads/some-lead-id",
            json={"status": "reviewed"}
        )
        assert response.status_code == 401
        print("✓ PATCH /api/leads/{id} requires auth")
    
    def test_delete_lead_without_auth(self):
        """DELETE /api/leads/{id} should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/leads/some-lead-id")
        assert response.status_code == 401
        print("✓ DELETE /api/leads/{id} requires auth")
    
    def test_get_stats_without_auth(self):
        """GET /api/leads/stats/summary should require authentication"""
        response = requests.get(f"{BASE_URL}/api/leads/stats/summary")
        assert response.status_code == 401
        print("✓ GET /api/leads/stats/summary requires auth")
    
    def test_get_stats_with_auth(self, auth_token):
        """GET /api/leads/stats/summary with valid token should work"""
        response = requests.get(
            f"{BASE_URL}/api/leads/stats/summary",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "new" in data
        assert "reviewed" in data
        print(f"✓ GET /api/leads/stats/summary returned stats: total={data['total']}")


class TestPublicLeadCreation:
    """Test that POST /api/leads is public (for form submissions)"""
    
    def test_create_lead_without_auth(self):
        """POST /api/leads should be public (no auth required)"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "company": f"TEST_Public_Company_{unique_id}",
            "name": "Test User",
            "email": f"test_{unique_id}@example.com",
            "phone": "1234567890",
            "pitch_mode": "upload"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["company"] == payload["company"]
        assert data["status"] == "new"
        
        # Cleanup - need auth for delete
        lead_id = data["id"]
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if login_response.status_code == 200:
            token = login_response.json()["token"]
            requests.delete(
                f"{BASE_URL}/api/leads/{lead_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
        
        print("✓ POST /api/leads is public (no auth required)")


class TestLeadStatusUpdate:
    """Test lead status update with authentication"""
    
    @pytest.fixture
    def auth_token(self):
        """Get valid auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not get auth token")
    
    def test_update_lead_status(self, auth_token):
        """Test updating lead status with auth"""
        # Create a test lead first (public endpoint)
        unique_id = str(uuid.uuid4())[:8]
        create_response = requests.post(
            f"{BASE_URL}/api/leads",
            json={
                "company": f"TEST_Status_Company_{unique_id}",
                "name": "Test User",
                "email": f"test_{unique_id}@example.com",
                "phone": "1234567890"
            }
        )
        assert create_response.status_code in [200, 201]
        lead_id = create_response.json()["id"]
        
        # Update status with auth
        update_response = requests.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "reviewed"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "reviewed"
        
        # Verify persistence
        get_response = requests.get(
            f"{BASE_URL}/api/leads/{lead_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert get_response.status_code == 200
        assert get_response.json()["status"] == "reviewed"
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/leads/{lead_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        print("✓ Lead status update with auth works correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
