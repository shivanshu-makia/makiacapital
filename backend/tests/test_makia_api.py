"""
Backend API Tests for Makia Capital Website
Tests: Health check, Lead CRUD operations
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://website-builder-1263.preview.emergentagent.com').rstrip('/')


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test GET /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        print(f"✓ Health check passed: {data}")

    def test_root_endpoint(self):
        """Test GET /api/ returns API info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "status" in data
        print(f"✓ Root endpoint passed: {data}")


class TestLeadsCRUD:
    """Lead management CRUD tests"""
    
    @pytest.fixture
    def test_lead_data(self):
        """Generate unique test lead data"""
        unique_id = str(uuid.uuid4())[:8]
        return {
            "company": f"TEST_Company_{unique_id}",
            "name": f"TEST_User_{unique_id}",
            "email": f"test_{unique_id}@example.com",
            "phone": "+91-9876543210",
            "pitch_mode": "upload",
            "sector": "Technology",
            "website": "https://example.com",
            "revenue": "10-50 Cr",
            "ebitda": "5-10 Cr",
            "services": ["Equity Fundraise", "IPO Advisory"]
        }

    def test_create_lead(self, test_lead_data):
        """Test POST /api/leads creates a new lead"""
        response = requests.post(f"{BASE_URL}/api/leads", json=test_lead_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["company"] == test_lead_data["company"]
        assert data["name"] == test_lead_data["name"]
        assert data["email"] == test_lead_data["email"]
        assert data["phone"] == test_lead_data["phone"]
        assert data["status"] == "new"
        print(f"✓ Lead created successfully: {data['id']}")
        
        # Store lead_id for cleanup
        return data["id"]

    def test_create_lead_and_verify_persistence(self, test_lead_data):
        """Test Create → GET verification pattern"""
        # CREATE
        create_response = requests.post(f"{BASE_URL}/api/leads", json=test_lead_data)
        assert create_response.status_code == 200
        created_lead = create_response.json()
        lead_id = created_lead["id"]
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert get_response.status_code == 200
        
        fetched_lead = get_response.json()
        assert fetched_lead["company"] == test_lead_data["company"]
        assert fetched_lead["email"] == test_lead_data["email"]
        print(f"✓ Lead persistence verified: {lead_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/{lead_id}")

    def test_get_leads_list(self):
        """Test GET /api/leads returns list of leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Leads list retrieved: {len(data)} leads")

    def test_get_lead_by_id(self, test_lead_data):
        """Test GET /api/leads/{id} returns specific lead"""
        # First create a lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json=test_lead_data)
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Get the lead
        response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == lead_id
        assert data["company"] == test_lead_data["company"]
        print(f"✓ Lead retrieved by ID: {lead_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/{lead_id}")

    def test_get_nonexistent_lead(self):
        """Test GET /api/leads/{id} returns 404 for non-existent lead"""
        fake_id = "nonexistent-lead-id-12345"
        response = requests.get(f"{BASE_URL}/api/leads/{fake_id}")
        assert response.status_code == 404
        print(f"✓ 404 returned for non-existent lead")

    def test_update_lead_status(self, test_lead_data):
        """Test PATCH /api/leads/{id} updates lead status"""
        # Create a lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json=test_lead_data)
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Update status
        update_data = {"status": "reviewed", "notes": "Test note"}
        response = requests.patch(f"{BASE_URL}/api/leads/{lead_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "reviewed"
        assert data["notes"] == "Test note"
        print(f"✓ Lead status updated: {lead_id}")
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert get_response.json()["status"] == "reviewed"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/{lead_id}")

    def test_delete_lead(self, test_lead_data):
        """Test DELETE /api/leads/{id} removes lead"""
        # Create a lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json=test_lead_data)
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Delete the lead
        response = requests.delete(f"{BASE_URL}/api/leads/{lead_id}")
        assert response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert get_response.status_code == 404
        print(f"✓ Lead deleted successfully: {lead_id}")

    def test_delete_nonexistent_lead(self):
        """Test DELETE /api/leads/{id} returns 404 for non-existent lead"""
        fake_id = "nonexistent-lead-id-67890"
        response = requests.delete(f"{BASE_URL}/api/leads/{fake_id}")
        assert response.status_code == 404
        print(f"✓ 404 returned for deleting non-existent lead")


class TestLeadValidation:
    """Lead validation tests"""
    
    def test_create_lead_minimal_fields(self):
        """Test creating lead with only required fields"""
        minimal_data = {
            "company": "TEST_Minimal_Company",
            "name": "TEST_Minimal_User",
            "email": "minimal@test.com",
            "phone": "+91-1234567890"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=minimal_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["pitch_mode"] == "upload"  # Default value
        assert data["services"] == []  # Default empty list
        print(f"✓ Minimal lead created: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/{data['id']}")

    def test_create_lead_with_questions_mode(self):
        """Test creating lead with questions pitch mode"""
        lead_data = {
            "company": "TEST_Questions_Company",
            "name": "TEST_Questions_User",
            "email": "questions@test.com",
            "phone": "+91-9999999999",
            "pitch_mode": "questions",
            "what_do": "We build software",
            "biz_model": "SaaS",
            "customers": "Enterprise",
            "problem": "Efficiency",
            "differentiator": "AI-powered"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["pitch_mode"] == "questions"
        assert data["what_do"] == "We build software"
        print(f"✓ Questions mode lead created: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/{data['id']}")


class TestLeadsStats:
    """Lead statistics endpoint tests"""
    
    def test_get_leads_stats(self):
        """Test GET /api/leads/stats/summary returns statistics"""
        response = requests.get(f"{BASE_URL}/api/leads/stats/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert "total" in data
        assert "new" in data
        assert "reviewed" in data
        assert "contacted" in data
        assert "qualified" in data
        assert "rejected" in data
        print(f"✓ Stats retrieved: {data}")


# Cleanup function to remove test data
def cleanup_test_leads():
    """Remove all TEST_ prefixed leads"""
    response = requests.get(f"{BASE_URL}/api/leads")
    if response.status_code == 200:
        leads = response.json()
        for lead in leads:
            if lead.get("company", "").startswith("TEST_") or lead.get("name", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/leads/{lead['id']}")
                print(f"Cleaned up test lead: {lead['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
