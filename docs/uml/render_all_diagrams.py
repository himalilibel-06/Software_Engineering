import os
import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

OUTPUT_DIR = "E:/SE_Project/Software_Engineering/docs/uml"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════════
# COMMON SVG DEFS (Markers, Styles)
# ═══════════════════════════════════════════════════════════════════════════════
SVG_DEFS = """
  <defs>
    <!-- Solid black arrowhead for standard UML navigation / messages -->
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#000000" />
    </marker>
    <!-- Open black arrowhead for UML associations & returns -->
    <marker id="arrow-open" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 1 2 L 8 5 L 1 8" fill="none" stroke="#000000" stroke-width="2" />
    </marker>
  </defs>
"""

# ═══════════════════════════════════════════════════════════════════════════════
# 1. USE CASE DIAGRAM SVG
# ═══════════════════════════════════════════════════════════════════════════════
def generate_use_case_svg():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="920" viewBox="0 0 1240 920">
  <rect width="1240" height="920" fill="#FFFFFF"/>
  {SVG_DEFS}

  <!-- Title -->
  <text x="620" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">Use Case Diagram — BIM Facility Management System</text>

  <!-- System Boundary -->
  <rect x="270" y="55" width="670" height="840" rx="8" ry="8" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <text x="605" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="bold" fill="#000000" text-anchor="middle">System Boundary: Smart BIM FM Web Platform</text>

  <!-- ── ACTOR 1: Facility Manager / Staff (Left) ── -->
  <!-- Stick figure center at (130, 460) -->
  <circle cx="130" cy="415" r="18" fill="#81D4F0" stroke="#000000" stroke-width="2.5"/>
  <line x1="130" y1="433" x2="130" y2="485" stroke="#000000" stroke-width="2.5"/>
  <line x1="95" y1="452" x2="165" y2="452" stroke="#000000" stroke-width="2.5"/>
  <line x1="130" y1="485" x2="105" y2="535" stroke="#000000" stroke-width="2.5"/>
  <line x1="130" y1="485" x2="155" y2="535" stroke="#000000" stroke-width="2.5"/>
  <text x="130" y="565" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Facility Manager /</text>
  <text x="130" y="585" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Staff User</text>

  <!-- ── ACTOR 2: System Administrator (Right Top) ── -->
  <!-- Stick figure center at (1090, 230) -->
  <circle cx="1090" cy="190" r="18" fill="#81D4F0" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="208" x2="1090" y2="260" stroke="#000000" stroke-width="2.5"/>
  <line x1="1055" y1="227" x2="1125" y2="227" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="260" x2="1065" y2="310" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="260" x2="1115" y2="310" stroke="#000000" stroke-width="2.5"/>
  <text x="1090" y="338" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">System Administrator</text>

  <!-- ── ACTOR 3: Field Technician (Right Bottom) ── -->
  <!-- Stick figure center at (1090, 640) -->
  <circle cx="1090" cy="600" r="18" fill="#81D4F0" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="618" x2="1090" y2="670" stroke="#000000" stroke-width="2.5"/>
  <line x1="1055" y1="637" x2="1125" y2="637" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="670" x2="1065" y2="720" stroke="#000000" stroke-width="2.5"/>
  <line x1="1090" y1="670" x2="1115" y2="720" stroke="#000000" stroke-width="2.5"/>
  <text x="1090" y="748" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Field Technician</text>

  <!-- ── USE CASES (Left Column: center x=430) ── -->
  <!-- UC-001: Register Account -->
  <rect x="300" y="115" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="144" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-001: Register Account</text>

  <!-- UC-003: View Dashboard KPIs & Alerts -->
  <rect x="300" y="200" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="229" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-003: View Dashboard KPIs</text>

  <!-- UC-004: Manage Asset Inventory (CRUD) -->
  <rect x="300" y="295" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="324" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-004: Manage Asset Inventory</text>

  <!-- UC-006: Report Incident Ticket -->
  <rect x="300" y="390" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="419" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-006: Report Incident Ticket</text>

  <!-- UC-008: Schedule Maintenance -->
  <rect x="300" y="490" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="519" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-008: Schedule Maintenance</text>

  <!-- UC-009: Inspect 2D Isometric BIM Viewer -->
  <rect x="300" y="590" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="619" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-009: Inspect 2D Isometric BIM</text>

  <!-- UC-011: Export Data Reports (CSV) -->
  <rect x="300" y="690" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="719" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-011: Export Reports (CSV)</text>

  <!-- UC-012: Edit Profile & Avatar -->
  <rect x="300" y="790" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="430" y="819" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-012: Edit Profile & Avatar</text>

  <!-- ── USE CASES (Right Column: center x=750) ── -->
  <!-- UC-002: Authenticate & Log In (JWT) -->
  <rect x="620" y="115" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="750" y="144" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-002: Log In & Authenticate (JWT)</text>

  <!-- UC-005: Edit Asset Specs & Health -->
  <rect x="620" y="295" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="750" y="324" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-005: Edit Asset Specs & Health</text>

  <!-- UC-007: Assign Technician & Update Status -->
  <rect x="620" y="390" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="750" y="419" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-007: Assign Tech & Update Status</text>

  <!-- UC-010: Manage User Directory -->
  <rect x="620" y="690" width="260" height="46" rx="23" ry="23" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="750" y="719" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">UC-010: Manage User Directory</text>

  <!-- ── CONNECTORS: Facility Manager (Left) to Use Cases ── -->
  <line x1="165" y1="440" x2="300" y2="138" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="450" x2="300" y2="223" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="460" x2="300" y2="318" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="470" x2="300" y2="413" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="480" x2="300" y2="513" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="490" x2="300" y2="613" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="500" x2="300" y2="713" stroke="#000000" stroke-width="1.8"/>
  <line x1="165" y1="510" x2="300" y2="813" stroke="#000000" stroke-width="1.8"/>

  <!-- ── CONNECTORS: System Administrator (Right) ── -->
  <line x1="1055" y1="225" x2="880" y2="138" stroke="#000000" stroke-width="1.8"/>
  <line x1="1055" y1="240" x2="880" y2="713" stroke="#000000" stroke-width="1.8"/>
  <line x1="1055" y1="230" x2="560" y2="223" stroke="#000000" stroke-width="1.8"/>

  <!-- ── CONNECTORS: Field Technician (Right) ── -->
  <line x1="1055" y1="630" x2="880" y2="413" stroke="#000000" stroke-width="1.8"/>
  <line x1="1055" y1="640" x2="560" y2="513" stroke="#000000" stroke-width="1.8"/>
  <line x1="1055" y1="650" x2="560" y2="613" stroke="#000000" stroke-width="1.8"/>

  <!-- ── INCLUDE / EXTEND RELATIONSHIPS (Dashed Arrows) ── -->
  <!-- UC-004 --> UC-005 (<<include>>) -->
  <line x1="560" y1="318" x2="615" y2="318" stroke="#000000" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
  <text x="590" y="310" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">&lt;&lt;include&gt;&gt;</text>

  <!-- UC-006 --> UC-007 (<<include>>) -->
  <line x1="560" y1="413" x2="615" y2="413" stroke="#000000" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
  <text x="590" y="405" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">&lt;&lt;include&gt;&gt;</text>

  <!-- UC-003 --> UC-002 (<<include>>) -->
  <path d="M 530 200 L 590 170 L 635 155" fill="none" stroke="#000000" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
  <text x="590" y="165" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">&lt;&lt;include&gt;&gt;</text>
</svg>"""

# ═══════════════════════════════════════════════════════════════════════════════
# 2. CLASS DIAGRAM SVG
# ═══════════════════════════════════════════════════════════════════════════════
def generate_class_diagram_svg():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="960" viewBox="0 0 1300 960">
  <rect width="1300" height="960" fill="#FFFFFF"/>
  {SVG_DEFS}

  <!-- Title -->
  <text x="650" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">Class Diagram — BIM Facility Management System</text>

  <!-- ── 1. CLASS: User (x=50, y=60, w=340, h=330) ── -->
  <rect x="50" y="60" width="340" height="330" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="50" y="60" width="340" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="220" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">User</text>
  <!-- Attributes -->
  <text x="65" y="122" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ _id: ObjectId</text>
  <text x="65" y="140" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ fullName: String</text>
  <text x="65" y="158" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ email: String (unique)</text>
  <text x="65" y="176" font-family="'Courier New', monospace" font-size="12" fill="#000000">- password: String (bcrypt hash)</text>
  <text x="65" y="194" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ role: String [Admin, Manager, Tech]</text>
  <text x="65" y="212" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ department: String</text>
  <text x="65" y="230" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ profileImage: String (Base64)</text>
  <text x="65" y="248" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ phone: String</text>
  <text x="65" y="266" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ employeeId: String</text>
  <text x="65" y="284" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ createdAt: Date</text>
  <line x1="50" y1="300" x2="390" y2="300" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="65" y="324" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ comparePassword(pwd): Boolean</text>
  <text x="65" y="344" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ pre('save', hashPassword): void</text>
  <text x="65" y="364" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ generateAuthToken(): String</text>

  <!-- ── 2. CLASS: Asset (x=470, y=60, w=350, h=330) ── -->
  <rect x="470" y="60" width="350" height="330" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="470" y="60" width="350" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="645" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">Asset</text>
  <!-- Attributes -->
  <text x="485" y="122" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ _id: ObjectId</text>
  <text x="485" y="140" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assetId: String (unique)</text>
  <text x="485" y="158" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ name: String</text>
  <text x="485" y="176" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ category: String [HVAC, Elec, Plumb]</text>
  <text x="485" y="194" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ status: String [Active, Maint, Repair]</text>
  <text x="485" y="212" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ location: String</text>
  <text x="485" y="230" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ installationDate: String</text>
  <text x="485" y="248" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ manufacturer: String</text>
  <text x="485" y="266" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ health: Number [0 - 100%]</text>
  <text x="485" y="284" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ userId: ObjectId &lt;&lt;FK&gt;&gt;</text>
  <line x1="470" y1="300" x2="820" y2="300" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="485" y="324" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ getHealthStatus(): String</text>
  <text x="485" y="344" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ updateCondition(score): void</text>
  <text x="485" y="364" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ toCSVRow(): String</text>

  <!-- ── 3. CLASS: BIMNode (x=900, y=90, w=340, h=270) ── -->
  <rect x="900" y="90" width="340" height="270" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="900" y="90" width="340" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1070" y="115" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">&lt;&lt;Component&gt;&gt; BIMNode</text>
  <!-- Attributes -->
  <text x="915" y="152" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ id: String</text>
  <text x="915" y="172" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ name: String</text>
  <text x="915" y="192" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ category: String</text>
  <text x="915" y="212" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ level: String</text>
  <text x="915" y="232" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ x: Number, y: Number, z: Number</text>
  <text x="915" y="252" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ status: String</text>
  <text x="915" y="272" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ temperature: Number, pressure: Number</text>
  <line x1="900" y1="288" x2="1240" y2="288" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="915" y="312" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ getIsometricCoordinates(): Point</text>
  <text x="915" y="332" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ renderWireframeNode(): SVGElement</text>

  <!-- ── 4. CLASS: Issue (x=50, y=510, w=340, h=340) ── -->
  <rect x="50" y="510" width="340" height="340" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="50" y="510" width="340" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="220" y="535" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">Issue</text>
  <!-- Attributes -->
  <text x="65" y="572" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ _id: ObjectId</text>
  <text x="65" y="590" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ userId: ObjectId &lt;&lt;FK&gt;&gt;</text>
  <text x="65" y="608" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assetId: String &lt;&lt;FK&gt;&gt;</text>
  <text x="65" y="626" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ title: String</text>
  <text x="65" y="644" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ category: String [HVAC, Plumb, Elec]</text>
  <text x="65" y="662" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ priority: String [High, Medium, Low]</text>
  <text x="65" y="680" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ reportedBy: String</text>
  <text x="65" y="698" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assignedTo: String</text>
  <text x="65" y="716" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ status: String [Open, In Prog, Resolv]</text>
  <text x="65" y="734" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ createdAt: Date, updatedAt: Date</text>
  <line x1="50" y1="750" x2="390" y2="750" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="65" y="774" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ updateStatus(newStatus): void</text>
  <text x="65" y="794" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assignTechnician(techName): void</text>
  <text x="65" y="814" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ resolveIssue(notes): void</text>

  <!-- ── 5. CLASS: Maintenance (x=470, y=510, w=350, h=340) ── -->
  <rect x="470" y="510" width="350" height="340" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="470" y="510" width="350" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="645" y="535" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">Maintenance</text>
  <!-- Attributes -->
  <text x="485" y="572" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ _id: ObjectId</text>
  <text x="485" y="590" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ userId: ObjectId &lt;&lt;FK&gt;&gt;</text>
  <text x="485" y="608" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assetId: String &lt;&lt;FK&gt;&gt;</text>
  <text x="485" y="626" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ taskName: String</text>
  <text x="485" y="644" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ category: String [Preventive, Routine]</text>
  <text x="485" y="662" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ priority: String [High, Medium, Low]</text>
  <text x="485" y="680" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ frequency: String [Routine, Monthly]</text>
  <text x="485" y="698" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ scheduledDate: Date</text>
  <text x="485" y="716" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assignedTeam: String</text>
  <text x="485" y="734" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ workStatus: String [Scheduled, Done]</text>
  <line x1="470" y1="750" x2="820" y2="750" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="485" y="774" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ isOverdue(): Boolean</text>
  <text x="485" y="794" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ markCompleted(): void</text>
  <text x="485" y="814" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ reschedule(newDate): void</text>

  <!-- ── 6. CLASS: Technician (x=900, y=580, w=340, h=200) ── -->
  <rect x="900" y="580" width="340" height="200" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <rect x="900" y="580" width="340" height="40" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1070" y="605" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">Technician</text>
  <!-- Attributes -->
  <text x="915" y="642" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ _id: ObjectId</text>
  <text x="915" y="662" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ name: String</text>
  <text x="915" y="682" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ role: String [HVAC Tech, Electrician]</text>
  <line x1="900" y1="702" x2="1240" y2="702" stroke="#000000" stroke-width="1.5"/>
  <!-- Methods -->
  <text x="915" y="726" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ getSpecialization(): String</text>
  <text x="915" y="746" font-family="'Courier New', monospace" font-size="12" fill="#000000">+ assignTask(taskId): void</text>

  <!-- ── ASSOCIATIONS & CONNECTORS ── -->
  <!-- User (390, 180) -> Asset (470, 180) -->
  <line x1="390" y1="180" x2="462" y2="180" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="425" y="172" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">manages &gt;</text>
  <text x="400" y="196" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="450" y="196" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>

  <!-- Asset (820, 180) ..> BIMNode (900, 180) -->
  <line x1="820" y1="180" x2="892" y2="180" stroke="#000000" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
  <text x="860" y="172" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">telemetry &gt;</text>
  <text x="830" y="196" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="880" y="196" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">0..1</text>

  <!-- User (220, 390) -> Issue (220, 510) -->
  <line x1="220" y1="390" x2="220" y2="502" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="250" y="450" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000">reports v</text>
  <text x="205" y="410" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="205" y="495" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>

  <!-- Asset (645, 390) -> Maintenance (645, 510) -->
  <line x1="645" y1="390" x2="645" y2="502" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="685" y="450" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000">services v</text>
  <text x="630" y="410" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="630" y="495" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>

  <!-- Asset (470, 350) -> Issue (390, 550) via right-angle -->
  <path d="M 470 350 L 430 350 L 430 550 L 398 550" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="435" y="405" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">pertains to</text>
  <text x="450" y="342" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="405" y="542" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>

  <!-- Technician (900, 680) -> Maintenance (820, 680) -->
  <line x1="900" y1="680" x2="828" y2="680" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="860" y="672" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">&lt; executes</text>
  <text x="890" y="696" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="835" y="696" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>

  <!-- Technician (1070, 780) down & left to Issue (390, 830) -->
  <path d="M 1070 780 L 1070 885 L 390 885 L 390 858" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="730" y="878" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">assigned to issue &gt;</text>
  <text x="1080" y="805" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">1</text>
  <text x="398" y="872" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000">*</text>
</svg>"""

# ═══════════════════════════════════════════════════════════════════════════════
# 3. SEQUENCE DIAGRAM SVG
# ═══════════════════════════════════════════════════════════════════════════════
def generate_sequence_svg():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="980" viewBox="0 0 1320 980">
  <rect width="1320" height="980" fill="#FFFFFF"/>
  {SVG_DEFS}

  <!-- Title -->
  <text x="660" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">Sequence Diagram — User Authentication &amp; Protected Dashboard Flow</text>

  <!-- ── 7 LIFELINES ── -->
  <!-- Header Boxes -->
  <!-- 1. Facility Manager (x=90) -->
  <rect x="20" y="55" width="140" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="90" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Facility Manager</text>

  <!-- 2. LoginUI (x=270) -->
  <rect x="200" y="55" width="140" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="270" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">LoginUI (React)</text>

  <!-- 3. APIService (x=450) -->
  <rect x="380" y="55" width="140" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="450" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">APIService (api.js)</text>

  <!-- 4. AuthRouter (x=640) -->
  <rect x="565" y="55" width="150" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="640" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">AuthRouter (Express)</text>

  <!-- 5. Bcrypt / JWT (x=835) -->
  <rect x="760" y="55" width="150" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="835" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Bcrypt / JWT Utility</text>

  <!-- 6. AuthMiddleware (x=1030) -->
  <rect x="955" y="55" width="150" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1030" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">AuthMiddleware</text>

  <!-- 7. MongoDB (x=1220) -->
  <rect x="1150" y="55" width="140" height="44" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1220" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">MongoDB (Mongoose)</text>

  <!-- Vertical Dashed Lines -->
  <line x1="90" y1="99" x2="90" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="270" y1="99" x2="270" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="450" y1="99" x2="450" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="640" y1="99" x2="640" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="835" y1="99" x2="835" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="1030" y1="99" x2="1030" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>
  <line x1="1220" y1="99" x2="1220" y2="890" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,6"/>

  <!-- Activation Bars -->
  <!-- LoginUI activation -->
  <rect x="262" y="130" width="16" height="430" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- APIService activation 1 -->
  <rect x="442" y="215" width="16" height="315" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- AuthRouter activation -->
  <rect x="632" y="245" width="16" height="255" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- Bcrypt activation 1 -->
  <rect x="827" y="325" width="16" height="50" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- Bcrypt activation 2 -->
  <rect x="827" y="405" width="16" height="50" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- MongoDB activation 1 -->
  <rect x="1212" y="275" width="16" height="45" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- APIService activation 2 (Dashboard) -->
  <rect x="442" y="630" width="16" height="220" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- AuthMiddleware activation -->
  <rect x="1022" y="660" width="16" height="150" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>
  <!-- MongoDB activation 2 -->
  <rect x="1212" y="740" width="16" height="55" fill="#81D4F0" stroke="#000000" stroke-width="1.5"/>

  <!-- ── MESSAGES ── -->
  <!-- Step 1: User enters credentials -->
  <line x1="90" y1="140" x2="262" y2="140" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="176" y="132" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">1. Enter email, password &amp; submit form</text>

  <!-- Step 2: Self-validate -->
  <path d="M 278 160 L 320 160 L 320 185 L 278 185" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="330" y="176" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000">2. Validate inputs (email format &amp; password required)</text>

  <!-- Step 3: APIService.post -->
  <line x1="278" y1="220" x2="442" y2="220" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="360" y="212" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">3. api.post('/auth/Login', credentials)</text>

  <!-- Step 4: HTTP POST -->
  <line x1="458" y1="250" x2="632" y2="250" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="545" y="242" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4. HTTP POST /api/auth/Login</text>

  <!-- Step 5: User.findOne -->
  <line x1="648" y1="280" x2="1212" y2="280" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="930" y="272" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5. User.findOne({{ email }})</text>

  <!-- Step 6: Return user doc -->
  <line x1="1212" y1="315" x2="648" y2="315" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="930" y="307" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">6. Return user record (contains hashed password)</text>

  <!-- Step 7: bcrypt.compare -->
  <line x1="648" y1="340" x2="827" y2="340" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="737" y="332" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">7. bcrypt.compare(pwd, hash)</text>

  <!-- Step 8: bcrypt result -->
  <line x1="827" y1="370" x2="648" y2="370" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="737" y="362" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">8. Password match confirmed (true)</text>

  <!-- Step 9: jwt.sign -->
  <line x1="648" y1="415" x2="827" y2="415" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="737" y="407" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">9. jwt.sign({{ id, email, role }}, JWT_SECRET, 24h)</text>

  <!-- Step 10: jwt return -->
  <line x1="827" y1="445" x2="648" y2="445" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="737" y="437" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">10. Signed JWT auth token string</text>

  <!-- Step 11: HTTP 200 OK -->
  <line x1="632" y1="490" x2="458" y2="490" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="545" y="482" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">11. 200 OK {{ token, user: {{ id, fullName, role }} }}</text>

  <!-- Step 12: APIService return -->
  <line x1="442" y1="520" x2="278" y2="520" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="360" y="512" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">12. Resolve payload to UI state</text>

  <!-- Step 13: Store token & navigate -->
  <path d="M 278 540 L 320 540 L 320 565 L 278 565" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="330" y="556" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000">13. localStorage.setItem('token', token)</text>

  <!-- Step 14: Redirect to dashboard -->
  <line x1="262" y1="585" x2="90" y2="585" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="176" y="577" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">14. Redirect user to /dashboard</text>

  <!-- Divider band -->
  <line x1="30" y1="610" x2="1290" y2="610" stroke="#81D4F0" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="660" y="605" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">── AUTHENTICATED DATA RETRIEVAL (DASHBOARD INITIALIZATION) ──</text>

  <!-- Step 15: GET /api/assets with token -->
  <line x1="90" y1="640" x2="442" y2="640" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="266" y="632" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">15. Load Dashboard: api.get('/assets') &amp; /stats</text>

  <!-- Step 16: Intercept & verify token -->
  <line x1="458" y1="670" x2="1022" y2="670" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="740" y="662" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">16. Header: Authorization: Bearer &lt;token&gt;</text>

  <!-- Step 17: jwt.verify -->
  <line x1="1022" y1="700" x2="843" y2="700" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="932" y="692" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">17. jwt.verify(token, JWT_SECRET)</text>

  <!-- Step 18: Scoped DB query -->
  <line x1="1038" y1="745" x2="1212" y2="745" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="1125" y="737" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">18. Asset.find({{ userId: req.user.id }})</text>

  <!-- Step 19: Return user-scoped assets -->
  <line x1="1212" y1="790" x2="1038" y2="790" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="1125" y="782" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">19. Return isolated asset documents</text>

  <!-- Step 20: Return payload to UI -->
  <line x1="1022" y1="820" x2="458" y2="820" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="740" y="812" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#000000" text-anchor="middle">20. 200 OK [ user-scoped assets &amp; KPI metrics ]</text>

  <!-- Step 21: Render dashboard to user -->
  <line x1="442" y1="850" x2="90" y2="850" stroke="#000000" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#arrow-open)"/>
  <text x="266" y="842" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">21. Render KPI overview, health scores &amp; charts</text>

  <!-- Bottom Boxes matching top -->
  <rect x="20" y="890" width="140" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="90" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Facility Manager</text>

  <rect x="200" y="890" width="140" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="270" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">LoginUI (React)</text>

  <rect x="380" y="890" width="140" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="450" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">APIService (api.js)</text>

  <rect x="565" y="890" width="150" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="640" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">AuthRouter (Express)</text>

  <rect x="760" y="890" width="150" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="835" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Bcrypt / JWT Utility</text>

  <rect x="955" y="890" width="150" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1030" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">AuthMiddleware</text>

  <rect x="1150" y="890" width="140" height="40" rx="8" ry="8" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="1220" y="915" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">MongoDB (Mongoose)</text>
</svg>"""

# ═══════════════════════════════════════════════════════════════════════════════
# 4. ACTIVITY DIAGRAM SVG (Direct reference style match)
# ═══════════════════════════════════════════════════════════════════════════════
def generate_activity_svg():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="1260" viewBox="0 0 1050 1260">
  <rect width="1050" height="1260" fill="#FFFFFF"/>
  {SVG_DEFS}

  <!-- Title -->
  <text x="525" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">Activity Diagram — Issue Reporting, Triage &amp; Resolution Lifecycle</text>

  <!-- ── 1. Initial State (Black circle) ── -->
  <circle cx="525" cy="65" r="14" fill="#000000" stroke="#000000" stroke-width="2"/>
  <line x1="525" y1="79" x2="525" y2="108" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 2. Action: Navigate to Issue Management ── -->
  <rect x="365" y="110" width="320" height="52" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="141" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Navigate to Issue Management (/issues)</text>
  <line x1="525" y1="162" x2="525" y2="198" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 3. Action: Click Report Issue & Fill Form ── -->
  <rect x="330" y="200" width="390" height="60" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="226" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Click "Report Issue" &amp; Input Incident Form</text>
  <text x="525" y="246" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">(Title, Category, Priority, Asset ID, Reported By)</text>
  <line x1="525" y1="260" x2="525" y2="298" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 4. Decision Diamond: Form Valid? ── -->
  <!-- Diamond center (525, 335), w=150, h=70 -->
  <polygon points="525,300 600,335 525,370 450,335" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="339" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Form Valid?</text>

  <!-- Branch [No]: Go left -->
  <line x1="450" y1="335" x2="200" y2="335" stroke="#000000" stroke-width="2"/>
  <line x1="200" y1="335" x2="200" y2="368" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="325" y="327" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">[No / Missing Fields]</text>

  <!-- Error Action Box (Left) -->
  <rect x="70" y="370" width="260" height="54" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="200" y="393" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Display Toast Notification</text>
  <text x="200" y="411" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">"Please fill in all required fields"</text>

  <!-- Loop back from Error Box to Action 2 -->
  <line x1="200" y1="370" x2="200" y2="230" stroke="#000000" stroke-width="2"/>
  <line x1="200" y1="230" x2="328" y2="230" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- Branch [Yes]: Go down -->
  <line x1="525" y1="370" x2="525" y2="418" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="575" y="395" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000">[Yes / Valid]</text>

  <!-- ── 5. Action: Send POST /api/issues ── -->
  <rect x="335" y="420" width="380" height="54" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="443" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Dispatch POST /api/issues</text>
  <text x="525" y="461" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">(Attaches Bearer JWT in Authorization Header)</text>
  <line x1="525" y1="474" x2="525" y2="508" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 6. Action: Backend Validates & Saves (Open) ── -->
  <rect x="330" y="510" width="390" height="56" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="534" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Backend Validates Token &amp; Stores in MongoDB</text>
  <text x="525" y="552" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">(Sets status: 'Open', assignedTo: 'Unassigned')</text>
  <line x1="525" y1="566" x2="525" y2="600" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 7. Action: Facility Manager Triage ── -->
  <rect x="335" y="602" width="380" height="56" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="626" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Facility Manager Reviews Open Issue Queue</text>
  <text x="525" y="644" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">&amp; Selects Field Technician from Dropdown</text>
  <line x1="525" y1="658" x2="525" y2="692" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 8. Action: PUT /api/issues/:id/assign ── -->
  <rect x="340" y="694" width="370" height="56" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="718" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Dispatch PUT /api/issues/:id/assign</text>
  <text x="525" y="736" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">(Updates status -&gt; 'In Progress', assignedTo -&gt; tech)</text>
  <line x1="525" y1="750" x2="525" y2="784" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 9. Action: Technician Physical Repair ── -->
  <rect x="335" y="786" width="380" height="56" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="810" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Field Technician Inspects Physical Asset</text>
  <text x="525" y="828" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">&amp; Executes Corrective Maintenance Tasks</text>
  <line x1="525" y1="786" x2="525" y2="786"/>
  <line x1="525" y1="842" x2="525" y2="878" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 10. Decision Diamond 2: Defect Resolved? ── -->
  <!-- Center (525, 915), w=160, h=70 -->
  <polygon points="525,880 605,915 525,950 445,915" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="919" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Defect Resolved?</text>

  <!-- Branch [No]: Go right -->
  <line x1="605" y1="915" x2="840" y2="915" stroke="#000000" stroke-width="2"/>
  <line x1="840" y1="915" x2="840" y2="948" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="725" y="907" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">[No / Parts Required]</text>

  <!-- Parts Action Box (Right) -->
  <rect x="710" y="950" width="260" height="54" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="840" y="973" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">Log Diagnostic Notes &amp;</text>
  <text x="840" y="991" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">Order Replacement Spare Parts</text>

  <!-- Loop back from Parts Box to Action 9 -->
  <line x1="840" y1="950" x2="840" y2="814" stroke="#000000" stroke-width="2"/>
  <line x1="840" y1="814" x2="717" y2="814" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- Branch [Yes]: Go down -->
  <line x1="525" y1="950" x2="525" y2="996" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="575" y="975" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="bold" fill="#000000">[Yes / Fixed]</text>

  <!-- ── 11. Action: PUT /api/issues/:id/status (Resolved) ── -->
  <rect x="340" y="998" width="370" height="56" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="1022" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">Dispatch PUT /api/issues/:id/status</text>
  <text x="525" y="1040" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">(Updates status -&gt; 'Resolved', sets resolvedAt date)</text>
  <line x1="525" y1="1054" x2="525" y2="1088" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 12. Action: Recalculate Health & KPIs ── -->
  <rect x="345" y="1090" width="360" height="54" rx="14" ry="14" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="525" y="1113" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">System Recalculates Asset Health Score</text>
  <text x="525" y="1131" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#000000" text-anchor="middle">&amp; Updates Facility KPI Summary Cards</text>
  <line x1="525" y1="1144" x2="525" y2="1178" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- ── 13. Final State (UML Bullseye) ── -->
  <circle cx="525" cy="1195" r="16" fill="none" stroke="#000000" stroke-width="2"/>
  <circle cx="525" cy="1195" r="10" fill="#000000"/>
</svg>"""

# ═══════════════════════════════════════════════════════════════════════════════
# 5. STATE MACHINE DIAGRAM SVG
# ═══════════════════════════════════════════════════════════════════════════════
def generate_state_machine_svg():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1150" height="780" viewBox="0 0 1150 780">
  <rect width="1150" height="780" fill="#FFFFFF"/>
  {SVG_DEFS}

  <!-- Title -->
  <text x="575" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">State Machine Diagram — Facility Incident Ticket Lifecycle</text>

  <!-- ── Initial Pseudo-State (Black Circle) ── -->
  <circle cx="70" cy="240" r="14" fill="#000000" stroke="#000000" stroke-width="2"/>
  <!-- Arrow from Start to Open -->
  <line x1="84" y1="240" x2="188" y2="240" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="136" y="218" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Report Issue</text>
  <text x="136" y="232" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">[Valid input] /</text>
  <text x="136" y="258" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">POST /api/issues</text>

  <!-- ── STATE 1: Open (x=190, y=160, w=270, h=160) ── -->
  <rect x="190" y="160" width="270" height="160" rx="16" ry="16" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="325" y="195" font-family="'Segoe UI', Arial, sans-serif" font-size="17" font-weight="bold" fill="#000000" text-anchor="middle">Open</text>
  <line x1="190" y1="210" x2="460" y2="210" stroke="#000000" stroke-width="1.8"/>
  <text x="205" y="235" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set status = 'Open'</text>
  <text x="205" y="255" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set userId = req.user.id</text>
  <text x="205" y="275" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set assignedTo = 'Unassigned'</text>
  <text x="205" y="295" font-family="'Courier New', monospace" font-size="12" fill="#000000">do / Await manager triage</text>

  <!-- Transition: Open -> In Progress -->
  <line x1="460" y1="240" x2="578" y2="240" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="520" y="216" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Assign Technician</text>
  <text x="520" y="230" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">[Tech selected] /</text>
  <text x="520" y="258" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">PUT /api/issues/:id/assign</text>

  <!-- ── STATE 2: In Progress (x=580, y=160, w=290, h=160) ── -->
  <rect x="580" y="160" width="290" height="160" rx="16" ry="16" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="725" y="195" font-family="'Segoe UI', Arial, sans-serif" font-size="17" font-weight="bold" fill="#000000" text-anchor="middle">In Progress</text>
  <line x1="580" y1="210" x2="870" y2="210" stroke="#000000" stroke-width="1.8"/>
  <text x="595" y="235" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set status = 'In Progress'</text>
  <text x="595" y="255" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set assignedTo = techName</text>
  <text x="595" y="275" font-family="'Courier New', monospace" font-size="12" fill="#000000">do / On-site diagnostics</text>
  <text x="595" y="295" font-family="'Courier New', monospace" font-size="12" fill="#000000">do / Execute corrective repair</text>

  <!-- Self-transition on In Progress (Reassign / Update) -->
  <path d="M 680 160 L 680 90 L 770 90 L 770 158" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="725" y="75" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Reassign Technician [New tech selected] /</text>
  <text x="725" y="87" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">PUT /api/issues/:id/assign</text>

  <!-- Transition: In Progress -> Resolved -->
  <line x1="725" y1="320" x2="725" y2="488" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="740" y="395" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000">Complete Repair</text>
  <text x="740" y="412" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000">[Defect fixed &amp; verified] /</text>
  <text x="740" y="428" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000">PUT /api/issues/:id/status</text>

  <!-- ── STATE 3: Resolved (x=580, y=490, w=290, h=160) ── -->
  <rect x="580" y="490" width="290" height="160" rx="16" ry="16" fill="#81D4F0" stroke="#000000" stroke-width="2"/>
  <text x="725" y="525" font-family="'Segoe UI', Arial, sans-serif" font-size="17" font-weight="bold" fill="#000000" text-anchor="middle">Resolved</text>
  <line x1="580" y1="540" x2="870" y2="540" stroke="#000000" stroke-width="1.8"/>
  <text x="595" y="565" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Set status = 'Resolved'</text>
  <text x="595" y="585" font-family="'Courier New', monospace" font-size="12" fill="#000000">entry / Record resolvedAt date</text>
  <text x="595" y="605" font-family="'Courier New', monospace" font-size="12" fill="#000000">do / Recalculate asset healthScore</text>
  <text x="595" y="625" font-family="'Courier New', monospace" font-size="12" fill="#000000">do / Close operational alert</text>

  <!-- Transition: Resolved -> Open (Reopen Loop) -->
  <path d="M 580 570 L 325 570 L 325 322" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="555" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Reopen Ticket</text>
  <text x="440" y="568" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">[Defect recurs within 7 days] /</text>
  <text x="440" y="592" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">PUT /api/issues/:id/status (status: 'Open')</text>

  <!-- Transition: Resolved -> Final State (Archive / Delete) -->
  <line x1="870" y1="570" x2="1018" y2="570" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="945" y="546" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Archive / Delete</text>
  <text x="945" y="560" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">[Retention period met] /</text>
  <text x="945" y="590" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#000000" text-anchor="middle">DELETE /api/issues/:id</text>

  <!-- ── Final State (UML Bullseye) ── -->
  <circle cx="1035" cy="570" r="16" fill="none" stroke="#000000" stroke-width="2"/>
  <circle cx="1035" cy="570" r="10" fill="#000000"/>
</svg>"""

# ═══════════════════════════════════════════════════════════════════════════════
# EXECUTION & SELENIUM RENDERING
# ═══════════════════════════════════════════════════════════════════════════════
diagrams = [
    ("use-case", generate_use_case_svg(), 1300, 980),
    ("class-diagram", generate_class_diagram_svg(), 1360, 1020),
    ("sequence", generate_sequence_svg(), 1380, 1040),
    ("activity", generate_activity_svg(), 1120, 1320),
    ("state-machine", generate_state_machine_svg(), 1220, 840),
]

print("Initializing headless Edge browser for diagram generation...")
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--force-device-scale-factor=2")  # 2x Retina / Publication Quality
driver = webdriver.Edge(options=options)

for name, svg_str, win_w, win_h in diagrams:
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 10px;
    }}
    svg {{
      display: block;
      background: #FFFFFF;
    }}
  </style>
</head>
<body>
  {svg_str}
</body>
</html>"""

    html_file = os.path.join(OUTPUT_DIR, f"{name}.html")
    png_file = os.path.join(OUTPUT_DIR, f"{name}.png")

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    driver.set_window_size(win_w, win_h)
    driver.get(f"file:///{html_file.replace(chr(92), '/')}")
    time.sleep(1.0)
    
    svg_element = driver.find_element(By.TAG_NAME, "svg")
    svg_element.screenshot(png_file)
    print(f"[OK] Generated: {png_file} (Size: {os.path.getsize(png_file)} bytes)")

driver.quit()
print("All 5 UML diagrams successfully rendered!")
