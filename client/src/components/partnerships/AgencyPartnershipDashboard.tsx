import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  FileCheck, 
  TrendingUp, 
  UserPlus, 
  Calendar,
  Heart,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface PartnerAgency {
  id: number;
  name: string;
  agencyType: string;
  description?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  servicesOffered?: string[];
  specializations?: string[];
  isActive: boolean;
  partnershipLevel: string;
  partnerSince: string;
}

interface AgencyClient {
  id: number;
  clientName: string;
  clientEmail: string;
  specialNeeds?: string[];
  referralDate: string;
  status: string;
  assignedCounselorId?: number;
}

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  completedClients: number;
  totalServices: number;
  pendingServices: number;
  inProgressServices: number;
  completedServices: number;
}

export default function AgencyPartnershipDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewAgencyDialogOpen, setIsNewAgencyDialogOpen] = useState(false);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - in real implementation, this would come from API
  const stats: DashboardStats = {
    totalClients: 127,
    activeClients: 84,
    completedClients: 43,
    totalServices: 312,
    pendingServices: 45,
    inProgressServices: 89,
    completedServices: 178
  };

  const handleRegisterAgency = () => {
    toast({
      title: "Agency Registered",
      description: "The partner agency has been successfully registered.",
    });
    setIsNewAgencyDialogOpen(false);
  };

  const handleReferClient = () => {
    toast({
      title: "Client Referred",
      description: "The client has been successfully referred to MBTQ.dev services.",
    });
    setIsNewClientDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Agency Partnership Portal</h1>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              LGBTQIA+ & Disability Support
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Empowering LGBTQIA and disability service agencies worldwide
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsNewAgencyDialogOpen(true)}
          >
            <Building2 className="h-4 w-4" />
            Register Agency
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={() => setIsNewClientDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Refer Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          trend="+12% this month"
        />
        <StatsCard
          title="Active Cases"
          value={stats.activeClients}
          icon={<Briefcase className="h-5 w-5 text-green-600" />}
          trend="Currently in progress"
        />
        <StatsCard
          title="Services Provided"
          value={stats.totalServices}
          icon={<FileCheck className="h-5 w-5 text-purple-600" />}
          trend="Across all agencies"
        />
        <StatsCard
          title="Success Rate"
          value="87%"
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          trend="Client satisfaction"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:w-full md:grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Globe className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="agencies" className="gap-2">
            <Building2 className="h-4 w-4" />
            Partner Agencies
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Heart className="h-4 w-4" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab stats={stats} />
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <AgenciesTab />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientsTab />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServicesTab />
        </TabsContent>
      </Tabs>

      {/* Register Agency Dialog */}
      <Dialog open={isNewAgencyDialogOpen} onOpenChange={setIsNewAgencyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register Partner Agency</DialogTitle>
            <DialogDescription>
              Register a new LGBTQIA or disability service agency as a MBTQ.dev partner
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="agency-name">Agency Name *</Label>
                <Input id="agency-name" placeholder="LGBTQ Community Center" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agency-type">Agency Type *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="lgbtqia">LGBTQIA Services</option>
                  <option value="disability">Disability Services</option>
                  <option value="workforce">Workforce Development</option>
                  <option value="mixed">Mixed Services</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of the agency and services offered"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Contact Name *</Label>
                <Input id="contact-name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input id="contact-email" type="email" placeholder="contact@agency.org" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" placeholder="(555) 123-4567" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://agency.org" />
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-md">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-pink-900 mb-1">Partnership Benefits</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Access to VR and workforce development programs</li>
                    <li>• PinkSync ASL communication support</li>
                    <li>• Business formation and entrepreneurship services</li>
                    <li>• Dedicated client tracking and support</li>
                    <li>• Global network of LGBTQIA-friendly services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAgencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegisterAgency} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Register Agency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refer Client Dialog */}
      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Refer New Client</DialogTitle>
            <DialogDescription>
              Refer a client to MBTQ.dev VR and workforce services
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client-name">Client Name *</Label>
                <Input id="client-name" placeholder="Jane Smith" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-email">Client Email *</Label>
                <Input id="client-email" type="email" placeholder="jane@example.com" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-phone">Client Phone</Label>
              <Input id="client-phone" placeholder="(555) 987-6543" />
            </div>
            <div className="grid gap-2">
              <Label>Special Needs/Accommodations</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Deaf/HH
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  LGBTQIA+
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Physical Disability
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Cognitive Support
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  ASL Required
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Gender-Affirming Care
                </Badge>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="referral-reason">Referral Reason</Label>
              <Textarea 
                id="referral-reason" 
                placeholder="Describe why this client is being referred and what services they need"
                rows={4}
              />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Available Services</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• VR Business Development & Self-Employment</li>
                    <li>• Workforce Training & Job Placement</li>
                    <li>• Assistive Technology Assessment</li>
                    <li>• Business Formation Support</li>
                    <li>• ASL Communication Services (PinkSync)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewClientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReferClient} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Refer Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  trend: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 rounded-full bg-muted">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partnership Impact</CardTitle>
          <CardDescription>
            Our global network of LGBTQIA and disability service agencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Client Success Rate</span>
                <span className="text-sm font-bold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Services Completion</span>
                <span className="text-sm font-bold">{Math.round((stats.inProgressServices / stats.totalServices) * 100)}%</span>
              </div>
              <Progress value={(stats.inProgressServices / stats.totalServices) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Agency Satisfaction</span>
                <span className="text-sm font-bold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ServiceStatusItem 
              label="Completed Services"
              value={stats.completedServices}
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
              color="bg-green-100 text-green-800"
            />
            <ServiceStatusItem 
              label="In Progress"
              value={stats.inProgressServices}
              icon={<Clock className="h-4 w-4 text-blue-600" />}
              color="bg-blue-100 text-blue-800"
            />
            <ServiceStatusItem 
              label="Pending Review"
              value={stats.pendingServices}
              icon={<AlertCircle className="h-4 w-4 text-yellow-600" />}
              color="bg-yellow-100 text-yellow-800"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActivityItem 
              text="New client referral from Pride Center LA"
              time="2 hours ago"
            />
            <ActivityItem 
              text="Service completed for client #1247"
              time="5 hours ago"
            />
            <ActivityItem 
              text="New agency partnership: Rainbow Services TX"
              time="Yesterday"
            />
            <ActivityItem 
              text="VR counselor assigned to 3 new clients"
              time="2 days ago"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ServiceStatusItem({ label, value, icon, color }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <Badge className={color}>{value}</Badge>
    </div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function AgenciesTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Partner Agencies</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <AgencyCard 
          name="Pride Community Center - Los Angeles"
          type="LGBTQIA Services"
          clients={32}
          services={89}
          status="active"
          specializations={["LGBTQIA+", "Youth Services", "Mental Health"]}
        />
        <AgencyCard 
          name="Deaf Services Network - San Francisco"
          type="Disability Services"
          clients={28}
          services={67}
          status="active"
          specializations={["Deaf/HH", "ASL Services", "VR Support"]}
        />
        <AgencyCard 
          name="Rainbow Employment Services - New York"
          type="Workforce Development"
          clients={45}
          services={112}
          status="active"
          specializations={["Job Training", "LGBTQIA+", "Career Coaching"]}
        />
        <AgencyCard 
          name="Inclusive Futures - Chicago"
          type="Mixed Services"
          clients={22}
          services={44}
          status="active"
          specializations={["Disability", "LGBTQIA+", "Entrepreneurship"]}
        />
      </div>
    </div>
  );
}

function AgencyCard({ name, type, clients, services, status, specializations }: {
  name: string;
  type: string;
  clients: number;
  services: number;
  status: string;
  specializations: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{type}</CardDescription>
          </div>
          <Badge className={status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Clients</span>
            <span className="font-medium">{clients}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Services</span>
            <span className="font-medium">{services}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1">
              {specializations.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

function ClientsTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Referrals</h3>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <ClientRow 
              name="Alex Martinez"
              agency="Pride Community Center - LA"
              status="Active"
              services={3}
              lastUpdate="2 days ago"
            />
            <ClientRow 
              name="Jordan Kim"
              agency="Deaf Services Network - SF"
              status="In Progress"
              services={2}
              lastUpdate="1 week ago"
            />
            <ClientRow 
              name="Taylor Chen"
              agency="Rainbow Employment Services - NY"
              status="Completed"
              services={5}
              lastUpdate="2 weeks ago"
            />
            <ClientRow 
              name="Morgan Davis"
              agency="Inclusive Futures - Chicago"
              status="Active"
              services={1}
              lastUpdate="3 days ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientRow({ name, agency, status, services, lastUpdate }: {
  name: string;
  agency: string;
  status: string;
  services: number;
  lastUpdate: string;
}) {
  const statusColor = 
    status === 'Active' ? 'bg-green-100 text-green-800' :
    status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
    'bg-gray-100 text-gray-800';

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{agency}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{services} services</p>
          <p className="text-xs text-muted-foreground">{lastUpdate}</p>
        </div>
        <Badge className={statusColor}>{status}</Badge>
      </div>
    </div>
  );
}

function ServicesTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service Catalog</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <ServiceCard 
          title="VR Business Development"
          description="Comprehensive VR-funded business development and self-employment services"
          availability="Available for all clients"
        />
        <ServiceCard 
          title="Workforce Training"
          description="Job training and placement services with LGBTQIA-friendly employers"
          availability="Available for job seekers"
        />
        <ServiceCard 
          title="PinkSync ASL Services"
          description="Professional ASL interpretation and communication support"
          availability="Available for deaf/HH clients"
        />
        <ServiceCard 
          title="Assistive Technology"
          description="Technology assessment and accommodation services"
          availability="Available for disabled clients"
        />
        <ServiceCard 
          title="Business Formation"
          description="Entity formation and business registration services"
          availability="Available for entrepreneurs"
        />
        <ServiceCard 
          title="Career Coaching"
          description="One-on-one career development and mentoring"
          availability="Available for all clients"
        />
      </div>
    </div>
  );
}

function ServiceCard({ title, description, availability }: {
  title: string;
  description: string;
  availability: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{availability}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Request Service
        </Button>
      </CardFooter>
    </Card>
  );
}
