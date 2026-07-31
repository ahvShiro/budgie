import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type BuildSupportUrlOptions = {
  email: string;
  body?: string;
  subject?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildSupportUrl({ email, body, subject }: BuildSupportUrlOptions) {
  const params = new URLSearchParams();
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  params.set("to", email);
  return `https://mail.google.com/mail/?view=cm&fs=1&${params.toString}`
}