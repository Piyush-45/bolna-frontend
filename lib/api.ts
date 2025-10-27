// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/calls';

// export async function getPatients() {
//   const res = await fetch(`${API_BASE}/patients`);
//   return res.json();
// }

// export async function createPatient(patientData: any) {
//   const res = await fetch(`${API_BASE}/patients`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(patientData),
//   });
//   return res;
// }

// export async function updatePatient(patientId: number, patientData: any) {
//   const res = await fetch(`${API_BASE}/patients/${patientId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(patientData),
//   });
//   return res;
// }

// export async function deletePatient(patientId: number) {
//   const res = await fetch(`${API_BASE}/patients/${patientId}`, {
//     method: 'DELETE',
//   });
//   return res;
// }

// export async function initiateCall(patientId: number) {
//   const res = await fetch(`${API_BASE}/initiate`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ patient_id: patientId }),
//   });
//   return res.json();
// }

// export async function getPatientCalls(patientId: number) {
//   const res = await fetch(`${API_BASE}/patients/${patientId}/calls`);
//   return res.json();
// }

// export async function getCallTranscript(callId: number) {
//   const res = await fetch(`${API_BASE}/calls/${callId}/transcript`);
//   return res.json();
// }

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Unified API request helper.
 * Automatically attaches JWT token from localStorage.
 */
async function apiRequest(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/signup";
      }
    }
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  if (response.status === 204) return null;

  const data = await response.json();
  console.log(`✅ [API ${path}]`, data);
  return data;
}
/* =======================
   PATIENT API CALLS
   ======================= */
export async function getPatients() {
  return apiRequest("/patients");
}

export async function getPatient(id: number) {
  return apiRequest(`/patients/${id}`);
}

export async function createPatient(patient: any) {
  return apiRequest("/patients", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

export async function deletePatient(id: number) {
  return apiRequest(`/patients/${id}`, { method: "DELETE" });
}

/* =======================
   AUTH API CALLS
   ======================= */

   export async function signup(email: string, password: string, hospital_name: string) {
    const res = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, hospital_name }),
    });

    console.log("✅ Signup API response:", res);

    if (typeof window !== 'undefined' && res?.access_token && res?.user) {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
    } else {
      console.warn("⚠️ Signup response missing user:", res);
    }

    return res;
  }
  export async function login(email: string, password: string) {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log("✅ Login API response:", res);

    if (typeof window !== 'undefined' && res?.access_token && res?.user) {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
    } else {
      console.warn("⚠️ Login response missing user:", res);
    }

    return res;
  }
/** -----------------------
 *  CALL API
 *  ---------------------- */

export async function initiateCall(patientId: number) {
  return apiRequest("/dial", {
    method: "POST",
    body: JSON.stringify({ patient_id: patientId }),
  });
}
/** -----------------------
 *  CALL HISTORY
 *  ---------------------- */

export async function getPatientCalls(patientId: number) {
  return apiRequest(`/patients/${patientId}/calls`);
}

/** -----------------------
 *  CALL DETAILS / TRANSCRIPT
 *  ---------------------- */

export async function getCallTranscript(callId: number) {
  return apiRequest(`/calls/${callId}`);
}
