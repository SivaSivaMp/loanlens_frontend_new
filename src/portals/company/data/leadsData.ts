export type LeadStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PROPOSAL_SENT"
  | "CONFIRMED"
  | "REJECTED"
  | "CLOSED";
export type LoanType =
  | "HOME"
  | "PERSONAL"
  | "BUSINESS"
  | "VEHICLE"
  | "EDUCATION"
  | "LAP"
  | "GOLD";
export type EmploymentType =
  | "SALARIED"
  | "SELF_EMPLOYED_PROFESSIONAL"
  | "SELF_EMPLOYED_BUSINESS";

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  type: "INFO" | "ASSIGNMENT" | "STATUS_CHANGE" | "PROPOSAL";
  description?: string;
}

export interface TeamAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  rating: number; // 0–100
  activeLeadsCount: number;
  conversionRate: number; // percentage, e.g. 75
  avatar: string;
  isTopPerformer?: boolean;
  phone?: string;
}

export interface Lead {
  id: string;
  customerName: string;
  customerLocation: string;
  loanType: LoanType;
  requiredAmount: number;
  interestedProduct: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  cibilScore: number;
  existingEmi: number;
  customerNote: string;
  internalNotes: string;
  status: LeadStatus;
  fieldAgentId?: string;
  assignedAgentName?: string;
  assignedAgentAvatar?: string;
  createdAt: string;
  relativeTime: string;
  timeline: TimelineEvent[];
}

export const INITIAL_TEAM_AGENTS: TeamAgent[] = [
  {
    id: "ag-1",
    name: "Priya Menon",
    email: "priya.menon@finserve.com",
    role: "Senior Field Agent",
    rating: 87,
    activeLeadsCount: 2,
    conversionRate: 75,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD47XHW6F8te6Yjq14-mTqQcQMMNccwR2LiNJT2_F1KUHAN0DqAhIzoJxVdyLzi7OLJaqq4jo8OeikLsUMT-OwTTAD_GE5fuXXLhxiKocVQxSmEV0h7-watC6n0nR54Pt2_-lDfEms80xVWUu0MsIDKtvXElXdlLLoHn1LoQVl9IY_oolxR6HDo-THZzlPiv-YEit1Ni4G6ODCmCNVsCrDr5KaZAbDJdJrYh13bPMg98vzUETgC6QzY",
    isTopPerformer: true,
    phone: "+91 98450 23145",
  },
  {
    id: "ag-2",
    name: "Anoop Raj",
    email: "anoop.raj@finserve.com",
    role: "Senior Loan Specialist",
    rating: 81,
    activeLeadsCount: 3,
    conversionRate: 77,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCagJFwfjkvkUurBaUPUUA62zdKMpf7zq7q4TLLxrP8EfW1MwDHIIFTdiSTIglmRgWLQd_cDevSfWJy7Qaemm-LyUAHgEP5FM-xprBrZ9fo09qtEbMXnziKLsyqNweGJNIwXXkVXB3_Ix0VNHXOumSmPbW1z1TNSmsPSKjvk6Z5biShtjay3cyhkL6I9XZLpKjXQmvxb85C8B64awa8KUw7wsrT6ro73dOTrI0SDidqoJUPvSbZfnT7",
    phone: "+91 97422 66341",
  },
  {
    id: "ag-3",
    name: "Kavya Srinivasan",
    email: "kavya.s@finserve.com",
    role: "Field Agent",
    rating: 74,
    activeLeadsCount: 1,
    conversionRate: 62,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALYHIq-iEli6ZJEhZeIQMy7--tEUuaaL8rjEZeT9Bt5kFhucUKJsQIxNuPllNCXlmXF8ST6djNm_TM6FO9p0oj7tapRlntQNHyWS6-MULsjrRWp-sd0eNND6FvOseo2s-JI_w1yG8x4yxHTyd57zGcYuckfNf1xlTqv2CXMuxwR_bHbcw1uNl7Y0o0g68Bzleo-cnbjD1sUbXDcasC2es6GGslM4RcO6jFpo8AubjwNTwy-qX4D6i9",
    phone: "+91 99014 55123",
  },
  {
    id: "ag-4",
    name: "Rajesh Nair",
    email: "rajesh.nair@finserve.com",
    role: "Home Loan Specialist",
    rating: 79,
    activeLeadsCount: 4,
    conversionRate: 71,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98840 88219",
  },
  {
    id: "ag-5",
    name: "Sneha Verma",
    email: "sneha.verma@finserve.com",
    role: "Senior Relationship Mgr",
    rating: 84,
    activeLeadsCount: 2,
    conversionRate: 80,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98112 34509",
  },
  {
    id: "ag-6",
    name: "Amit Joshi",
    email: "amit.joshi@finserve.com",
    role: "Junior Loan Officer",
    rating: 68,
    activeLeadsCount: 5,
    conversionRate: 58,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 94432 12908",
  },
  {
    id: "ag-7",
    name: "Divya Rao",
    email: "divya.rao@finserve.com",
    role: "Mortgage Consultant",
    rating: 82,
    activeLeadsCount: 3,
    conversionRate: 76,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98201 44521",
  },
  {
    id: "ag-8",
    name: "Karthik Pillai",
    email: "karthik.p@finserve.com",
    role: "Field Agent",
    rating: 72,
    activeLeadsCount: 2,
    conversionRate: 65,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 99403 77124",
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    customerName: "Rahul Sharma",
    customerLocation: "Bangalore, Karnataka",
    loanType: "HOME",
    requiredAmount: 4800000,
    interestedProduct: "SBI Home Loan",
    monthlyIncome: 80000,
    employmentType: "SALARIED",
    cibilScore: 780,
    existingEmi: 8000,
    customerNote:
      "Looking at a ₹60L property in Whitefield, Bangalore. I have documents ready.",
    internalNotes:
      "Strong profile. SBI or HDFC should work. Assigning to Priya — she has best SBI success rate.",
    status: "PENDING",
    createdAt: "2026-08-08T10:00:00Z",
    relativeTime: "2 hours ago",
    timeline: [
      {
        id: "evt-1",
        title: "Lead received from portal",
        timestamp: "Aug 8, 2026, 10:00 AM",
        type: "INFO",
        description:
          "Customer filled proposal request for ₹48,00,000 SBI Home Loan.",
      },
    ],
  },
  {
    id: "lead-2",
    customerName: "Meera Nair",
    customerLocation: "Kochi, Kerala",
    loanType: "PERSONAL",
    requiredAmount: 1200000,
    interestedProduct: "HDFC Personal Loan",
    monthlyIncome: 65000,
    employmentType: "SALARIED",
    cibilScore: 745,
    existingEmi: 5000,
    customerNote:
      "Need loan for house renovation and travel. Urgent sanction requested.",
    internalNotes:
      "Documents verified. Anoop is following up with customer for salary slips.",
    status: "ASSIGNED",
    fieldAgentId: "ag-2",
    assignedAgentName: "Anoop Raj",
    assignedAgentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCagJFwfjkvkUurBaUPUUA62zdKMpf7zq7q4TLLxrP8EfW1MwDHIIFTdiSTIglmRgWLQd_cDevSfWJy7Qaemm-LyUAHgEP5FM-xprBrZ9fo09qtEbMXnziKLsyqNweGJNIwXXkVXB3_Ix0VNHXOumSmPbW1z1TNSmsPSKjvk6Z5biShtjay3cyhkL6I9XZLpKjXQmvxb85C8B64awa8KUw7wsrT6ro73dOTrI0SDidqoJUPvSbZfnT7",
    createdAt: "2026-08-07T14:30:00Z",
    relativeTime: "1 day ago",
    timeline: [
      {
        id: "evt-2-1",
        title: "Assigned to Anoop Raj",
        timestamp: "Aug 7, 2026, 03:15 PM",
        type: "ASSIGNMENT",
        description:
          "DSA Manager assigned lead based on Personal Loan conversion rank.",
      },
      {
        id: "evt-2-2",
        title: "Lead received from portal",
        timestamp: "Aug 7, 2026, 02:30 PM",
        type: "INFO",
        description:
          "Customer filled proposal request for ₹12,00,000 HDFC Personal Loan.",
      },
    ],
  },
  {
    id: "lead-3",
    customerName: "Vinod Kumar",
    customerLocation: "Chennai, Tamil Nadu",
    loanType: "VEHICLE",
    requiredAmount: 900000,
    interestedProduct: "Axis Car Loan",
    monthlyIncome: 55000,
    employmentType: "SALARIED",
    cibilScore: 720,
    existingEmi: 3000,
    customerNote: "Interested in buying a Maruti Brezza. Need competitive EMI.",
    internalNotes: "CIBIL is decent. Axis or ICICI should work.",
    status: "PENDING",
    createdAt: "2026-08-06T09:00:00Z",
    relativeTime: "2 days ago",
    timeline: [
      {
        id: "evt-3",
        title: "Lead received from portal",
        timestamp: "Aug 6, 2026, 09:00 AM",
        type: "INFO",
        description: "Customer enquired about vehicle loan options.",
      },
    ],
  },
  {
    id: "lead-4",
    customerName: "Anjali Das",
    customerLocation: "Pune, Maharashtra",
    loanType: "BUSINESS",
    requiredAmount: 3500000,
    interestedProduct: "ICICI Business Loan",
    monthlyIncome: 120000,
    employmentType: "SELF_EMPLOYED_BUSINESS",
    cibilScore: 760,
    existingEmi: 15000,
    customerNote: "Working capital needed for expanding my retail chain.",
    internalNotes:
      "High-value lead. Needs quick turnaround. Assigned to Sneha.",
    status: "PROPOSAL_SENT",
    fieldAgentId: "ag-5",
    assignedAgentName: "Sneha Verma",
    assignedAgentAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-05T11:00:00Z",
    relativeTime: "3 days ago",
    timeline: [
      {
        id: "evt-4-1",
        title: "Proposal sent by Sneha Verma",
        timestamp: "Aug 6, 2026, 10:00 AM",
        type: "PROPOSAL",
        description: "ICICI Business Loan proposal at 11.5% sent via portal.",
      },
      {
        id: "evt-4-2",
        title: "Assigned to Sneha Verma",
        timestamp: "Aug 5, 2026, 02:00 PM",
        type: "ASSIGNMENT",
      },
      {
        id: "evt-4-3",
        title: "Lead received from portal",
        timestamp: "Aug 5, 2026, 11:00 AM",
        type: "INFO",
      },
    ],
  },
  {
    id: "lead-5",
    customerName: "Suresh Pillai",
    customerLocation: "Hyderabad, Telangana",
    loanType: "HOME",
    requiredAmount: 6500000,
    interestedProduct: "HDFC Home Loan",
    monthlyIncome: 95000,
    employmentType: "SALARIED",
    cibilScore: 800,
    existingEmi: 12000,
    customerNote: "Buying a flat in Gachibowli. Pre-approved would be ideal.",
    internalNotes: "Excellent CIBIL. Pre-approval possible. Rajesh handling.",
    status: "CONFIRMED",
    fieldAgentId: "ag-4",
    assignedAgentName: "Rajesh Nair",
    assignedAgentAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-03T08:00:00Z",
    relativeTime: "5 days ago",
    timeline: [
      {
        id: "evt-5-1",
        title: "Customer confirmed proposal",
        timestamp: "Aug 7, 2026, 04:00 PM",
        type: "STATUS_CHANGE",
        description: "Customer accepted HDFC proposal at 8.75%.",
      },
      {
        id: "evt-5-2",
        title: "Proposal sent",
        timestamp: "Aug 5, 2026, 11:00 AM",
        type: "PROPOSAL",
      },
      {
        id: "evt-5-3",
        title: "Lead received",
        timestamp: "Aug 3, 2026, 08:00 AM",
        type: "INFO",
      },
    ],
  },
];
