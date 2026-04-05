from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Makia Capital API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str
    website: Optional[str] = None
    sector: Optional[str] = None
    name: str
    email: str
    phone: str
    pitch_mode: str = "upload"  # "upload" or "questions"
    deck_filename: Optional[str] = None
    what_do: Optional[str] = None
    biz_model: Optional[str] = None
    customers: Optional[str] = None
    problem: Optional[str] = None
    differentiator: Optional[str] = None
    revenue: Optional[str] = None
    ebitda: Optional[str] = None
    fy: Optional[str] = None
    run_rate: Optional[str] = None
    services: List[str] = []
    raise_amount: Optional[str] = None
    status: str = "new"  # new, reviewed, contacted, qualified, rejected
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    company: str
    website: Optional[str] = None
    sector: Optional[str] = None
    name: str
    email: str
    phone: str
    pitch_mode: str = "upload"
    deck_filename: Optional[str] = None
    what_do: Optional[str] = None
    biz_model: Optional[str] = None
    customers: Optional[str] = None
    problem: Optional[str] = None
    differentiator: Optional[str] = None
    revenue: Optional[str] = None
    ebitda: Optional[str] = None
    fy: Optional[str] = None
    run_rate: Optional[str] = None
    services: List[str] = []
    raise_amount: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class LeadResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    company: str
    website: Optional[str] = None
    sector: Optional[str] = None
    name: str
    email: str
    phone: str
    pitch_mode: str
    deck_filename: Optional[str] = None
    what_do: Optional[str] = None
    biz_model: Optional[str] = None
    customers: Optional[str] = None
    problem: Optional[str] = None
    differentiator: Optional[str] = None
    revenue: Optional[str] = None
    ebitda: Optional[str] = None
    fy: Optional[str] = None
    run_rate: Optional[str] = None
    services: List[str] = []
    raise_amount: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: str
    updated_at: str

# ============ EMAIL NOTIFICATION ============

async def send_lead_notification_email(lead: Lead):
    """Send email notification for new lead submission"""
    try:
        # Check if SendGrid is configured
        sendgrid_key = os.environ.get('SENDGRID_API_KEY')
        sender_email = os.environ.get('SENDER_EMAIL')
        notify_email = os.environ.get('NOTIFY_EMAIL')
        
        if not sendgrid_key or not sender_email or not notify_email:
            logger.warning("SendGrid not configured - skipping email notification")
            return
        
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        subject = f"New Pitch Submission: {lead.company}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f1a4e; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">New Pitch Submission</h1>
            </div>
            <div style="padding: 20px; background: #f7f9fb;">
                <h2 style="color: #0f1a4e;">{lead.company}</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Contact:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><a href="mailto:{lead.email}">{lead.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Sector:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.sector or 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Website:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.website or 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Services:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{', '.join(lead.services) if lead.services else 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Revenue ({lead.fy or 'FY25'}):</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.revenue or 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>EBITDA:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.ebitda or 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Raise Amount:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">{lead.raise_amount or 'Not specified'}</td>
                    </tr>
                </table>
                
                {f'''
                <div style="margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #c8a86e;">
                    <h3 style="margin-top: 0; color: #0f1a4e;">Business Overview</h3>
                    <p><strong>What they do:</strong> {lead.what_do or 'N/A'}</p>
                    <p><strong>Business Model:</strong> {lead.biz_model or 'N/A'}</p>
                    <p><strong>Target Customers:</strong> {lead.customers or 'N/A'}</p>
                    <p><strong>Problem Solved:</strong> {lead.problem or 'N/A'}</p>
                    <p><strong>Differentiator:</strong> {lead.differentiator or 'N/A'}</p>
                </div>
                ''' if lead.pitch_mode == 'questions' else ''}
                
                <p style="margin-top: 20px; color: #666; font-size: 12px;">
                    Submitted at: {lead.created_at.strftime('%Y-%m-%d %H:%M UTC')}
                </p>
            </div>
            <div style="background: #0f1a4e; color: #c8a86e; padding: 15px; text-align: center; font-size: 12px;">
                Makia Capital - Asset Management · Investment Banking
            </div>
        </body>
        </html>
        """
        
        message = Mail(
            from_email=sender_email,
            to_emails=notify_email,
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(sendgrid_key)
        response = sg.send(message)
        logger.info(f"Email notification sent for lead {lead.id}, status: {response.status_code}")
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Makia Capital API", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "makia-capital-api"}

# Lead Management
@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(input: LeadCreate, background_tasks: BackgroundTasks):
    """Submit a new pitch/lead"""
    lead_dict = input.model_dump()
    lead_obj = Lead(**lead_dict)
    
    # Convert to dict for MongoDB
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.leads.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_lead_notification_email, lead_obj)
    
    logger.info(f"New lead created: {lead_obj.id} - {lead_obj.company}")
    
    return LeadResponse(
        **{**lead_obj.model_dump(), 
           'created_at': doc['created_at'], 
           'updated_at': doc['updated_at']}
    )

@api_router.get("/leads", response_model=List[LeadResponse])
async def get_leads(status: Optional[str] = None, limit: int = 100):
    """Get all leads (for admin dashboard)"""
    query = {}
    if status:
        query['status'] = status
    
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return leads

@api_router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str):
    """Get a specific lead by ID"""
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@api_router.patch("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: str, update: LeadUpdate):
    """Update lead status or notes"""
    lead = await db.leads.find_one({"id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    updated_lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return updated_lead

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    """Delete a lead"""
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

@api_router.get("/leads/stats/summary")
async def get_leads_stats():
    """Get lead statistics"""
    total = await db.leads.count_documents({})
    new = await db.leads.count_documents({"status": "new"})
    reviewed = await db.leads.count_documents({"status": "reviewed"})
    contacted = await db.leads.count_documents({"status": "contacted"})
    qualified = await db.leads.count_documents({"status": "qualified"})
    rejected = await db.leads.count_documents({"status": "rejected"})
    
    return {
        "total": total,
        "new": new,
        "reviewed": reviewed,
        "contacted": contacted,
        "qualified": qualified,
        "rejected": rejected
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
