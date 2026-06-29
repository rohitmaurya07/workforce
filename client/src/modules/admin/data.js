export const employees = [
  { id: 1, name: "Arjun Sharma", role: "Frontend Developer", team: "Engineering", status: "Active", avatar: "AS", tasks: 8, projects: 3, joined: "Jan 2023" },
  { id: 2, name: "Priya Mehta", role: "UI/UX Designer", team: "Design", status: "Active", avatar: "PM", tasks: 5, projects: 2, joined: "Mar 2023" },
  { id: 3, name: "Rohan Verma", role: "Backend Developer", team: "Engineering", status: "On Leave", avatar: "RV", tasks: 3, projects: 4, joined: "Jun 2022" },
  { id: 4, name: "Sneha Kapoor", role: "Product Manager", team: "Product", status: "Active", avatar: "SK", tasks: 12, projects: 5, joined: "Sep 2021" },
  { id: 5, name: "Dev Patel", role: "DevOps Engineer", team: "Engineering", status: "Active", avatar: "DP", tasks: 6, projects: 3, joined: "Feb 2023" },
  { id: 6, name: "Ananya Nair", role: "QA Engineer", team: "QA", status: "Inactive", avatar: "AN", tasks: 4, projects: 2, joined: "Nov 2022" },
];

export const teams = [
  { id: 1, name: "Engineering", lead: "Arjun Sharma", members: 3, projects: 2, color: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Design", lead: "Priya Mehta", members: 2, projects: 2, color: "bg-purple-100 text-purple-700" },
  { id: 3, name: "Product", lead: "Sneha Kapoor", members: 1, projects: 3, color: "bg-emerald-100 text-emerald-700" },
  { id: 4, name: "QA", lead: "Ananya Nair", members: 1, projects: 1, color: "bg-amber-100 text-amber-700" },
];

export const tasks = [
  { id: 1, title: "Redesign Dashboard UI", assignee: "Priya Mehta", project: "WorkOS v2", priority: "High", status: "In Progress", due: "Jun 28" },
  { id: 2, title: "Fix Auth Race Condition", assignee: "Arjun Sharma", project: "CoreApp", priority: "Critical", status: "In Progress", due: "Jun 24" },
  { id: 3, title: "Setup CI/CD Pipeline", assignee: "Dev Patel", project: "Infrastructure", priority: "Medium", status: "Todo", due: "Jul 2" },
  { id: 4, title: "Write API Docs", assignee: "Rohan Verma", project: "CoreApp", priority: "Low", status: "Done", due: "Jun 20" },
  { id: 5, title: "User Testing Session", assignee: "Sneha Kapoor", project: "WorkOS v2", priority: "High", status: "Todo", due: "Jun 30" },
  { id: 6, title: "Performance Audit", assignee: "Ananya Nair", project: "CoreApp", priority: "Medium", status: "Review", due: "Jun 26" },
];

export const projects = [
  { id: 1, name: "WorkOS v2", team: "Engineering + Design", progress: 68, members: 5, status: "On Track", deadline: "Aug 15", tasks: 24 },
  { id: 2, name: "CoreApp", team: "Engineering + QA", progress: 45, members: 4, status: "At Risk", deadline: "Jul 30", tasks: 18 },
  { id: 3, name: "Infrastructure", team: "DevOps", progress: 82, members: 2, status: "On Track", deadline: "Jul 10", tasks: 11 },
  { id: 4, name: "Design System", team: "Design", progress: 30, members: 3, status: "Delayed", deadline: "Sep 1", tasks: 32 },
];


export const avatarColors = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-indigo-500"];

export const statusBadge = (status) => {
  const map = {
    "Active": "bg-emerald-100 text-emerald-700",
    "Inactive": "bg-gray-100 text-gray-500",
    "On Leave": "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Todo": "bg-gray-100 text-gray-600",
    "Done": "bg-emerald-100 text-emerald-700",
    "Review": "bg-purple-100 text-purple-700",
    "On Track": "bg-emerald-100 text-emerald-700",
    "At Risk": "bg-amber-100 text-amber-700",
    "Delayed": "bg-red-100 text-red-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export const priorityBadge = (p) => {
  const map = { Critical: "bg-red-100 text-red-600", High: "bg-orange-100 text-orange-600", Medium: "bg-blue-100 text-blue-600", Low: "bg-gray-100 text-gray-500" };
  return map[p] || "bg-gray-100 text-gray-500";
};


