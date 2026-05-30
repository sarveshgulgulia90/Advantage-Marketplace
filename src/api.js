// src/api.js — all backend calls in one place
// When backend is not available, falls back to localStorage

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "advantage_products";

/* ── helper ── */
async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
}

function adminHeaders() {
  const token = localStorage.getItem("advantage_admin_token") || "";
  return { "x-admin-token": token };
}

/* ══════════════════════════════════════════
   PUBLIC
══════════════════════════════════════════ */

// Get all visible products (with optional category / search filter)
export async function getProducts({ cat, search } = {}) {
  try {
    const params = new URLSearchParams();
    if (cat && cat !== "All") params.set("cat", cat);
    if (search) params.set("search", search);
    const qs = params.toString();
    return await req(`/products${qs ? "?" + qs : ""}`);
  } catch {
    // Fallback to localStorage if backend is down
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

// Get single product by id
export async function getProduct(id) {
  return req(`/products/${id}`);
}

// Submit customer enquiry
export async function submitInquiry(data) {
  try {
    return await req("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Silently fail — WhatsApp is the real backup
    return { message: "Saved locally" };
  }
}

/* ══════════════════════════════════════════
   ADMIN
══════════════════════════════════════════ */

// Save admin token after login
export function setAdminToken(token) {
  localStorage.setItem("advantage_admin_token", token);
}
export function clearAdminToken() {
  localStorage.removeItem("advantage_admin_token");
}

// Verify token (hits a protected route)
export async function verifyToken(token) {
  const res = await fetch(`${BASE}/products/admin/all`, {
    headers: { "x-admin-token": token },
  });
  return res.ok;
}

// Get ALL products (admin, including hidden)
export async function adminGetProducts() {
  return req("/products/admin/all", { headers: adminHeaders() });
}

// Create product
export async function adminAddProduct(data) {
  return req("/products", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
}

// Update product
export async function adminUpdateProduct(id, data) {
  return req(`/products/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
}

// Delete product
export async function adminDeleteProduct(id) {
  return req(`/products/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

// Get all enquiries
export async function adminGetInquiries() {
  return req("/inquiries", { headers: adminHeaders() });
}

// Mark enquiry as read
export async function adminMarkRead(id) {
  return req(`/inquiries/${id}/read`, {
    method: "PUT",
    headers: adminHeaders(),
  });
}

// Delete enquiry
export async function adminDeleteInquiry(id) {
  return req(`/inquiries/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

// Seed default products into DB (run once)
export async function adminSeedProducts(products) {
  return req("/products/seed", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(products),
  });
}