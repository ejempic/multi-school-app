export interface Student {
  id: number;
  studentId: string;
  name: string;
  grade: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Alumni";
  gpa: number;
  photo: string;
  tenantId?: string; // Optional linkage
}

export const studentsByTenant: Record<string, Student[]> = {
  "gtwfsl": [
    { id: 1, studentId: "STU-2024-001", name: "Emma Watson", grade: "Grade 12", email: "emma.w@school.com", phone: "(555) 123-4567", status: "Active", gpa: 3.8, photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNzY3ODA2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 2, studentId: "STU-2024-002", name: "Liam Johnson", grade: "Grade 11", email: "liam.j@school.com", phone: "(555) 234-5678", status: "Active", gpa: 3.6, photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBtYWxlfGVufDF8fHx8MTc2NzgwNjE4OXww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 3, studentId: "STU-2024-003", name: "Olivia Brown", grade: "Grade 10", email: "olivia.b@school.com", phone: "(555) 345-6789", status: "Active", gpa: 3.9, photo: "https://images.unsplash.com/photo-1705753449583-90daa4d7ad91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmx8ZW58MXx8fHwxNzY3ODA2MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 4, studentId: "STU-2024-004", name: "Noah Davis", grade: "Grade 12", email: "noah.d@school.com", phone: "(555) 456-7890", status: "Active", gpa: 3.7, photo: "https://images.unsplash.com/photo-1624728323853-9e7873077452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveXxlbnwxfHx8fDE3Njc4MDYxODl8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 5, studentId: "STU-2024-005", name: "Ava Wilson", grade: "Grade 11", email: "ava.w@school.com", phone: "(555) 567-8901", status: "Active", gpa: 3.5, photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNzY3ODA2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 6, studentId: "STU-2024-006", name: "Ethan Martinez", grade: "Grade 10", email: "ethan.m@school.com", phone: "(555) 678-9012", status: "Inactive", gpa: 3.4, photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBtYWxlfGVufDF8fHx8MTc2NzgwNjE4OXww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 7, studentId: "STU-2024-007", name: "Sophia Garcia", grade: "Grade 12", email: "sophia.g@school.com", phone: "(555) 789-0123", status: "Active", gpa: 4.0, photo: "https://images.unsplash.com/photo-1705753449583-90daa4d7ad91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmx8ZW58MXx8fHwxNzY3ODA2MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 8, studentId: "STU-2024-008", name: "Mason Lee", grade: "Grade 11", email: "mason.l@school.com", phone: "(555) 890-1234", status: "Active", gpa: 3.3, photo: "https://images.unsplash.com/photo-1624728323853-9e7873077452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveXxlbnwxfHx8fDE3Njc4MDYxODl8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ],
  "saa": [
    { id: 101, studentId: "SAA-2024-001", name: "Zoe Red", grade: "Grade 9", email: "zoe.r@saa.com", phone: "(555) 999-0001", status: "Active", gpa: 3.2, photo: "" },
    { id: 102, studentId: "SAA-2024-002", name: "Alex Blue", grade: "Grade 9", email: "alex.b@saa.com", phone: "(555) 999-0002", status: "Active", gpa: 3.5, photo: "" },
  ],
  "school-c": [
     { id: 201, studentId: "GWA-2024-001", name: "Charlie Green", grade: "Grade 10", email: "charlie.g@greenwood.com", phone: "(555) 888-0001", status: "Active", gpa: 3.9, photo: "" },
  ]
};
