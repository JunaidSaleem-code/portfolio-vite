async function request<T = unknown>(url: string, init: RequestInit = {}): Promise<T | null> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
      if (body?.details) message += ": " + JSON.stringify(body.details);
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return (await res.json()) as T;
}

export const apiList = <T = unknown>(resource: string) => request<T>(`/api/${resource}`);

export const apiCreate = <T = unknown>(resource: string, data: unknown) =>
  request<T>(`/api/${resource}`, { method: "POST", body: JSON.stringify(data) });

export const apiUpdate = <T = unknown>(resource: string, id: string, data: unknown) =>
  request<T>(`/api/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const apiDelete = (resource: string, id: string) =>
  request(`/api/${resource}/${id}`, { method: "DELETE" });

export const apiReorder = (resource: string, ids: string[]) =>
  request(`/api/${resource}/reorder`, { method: "PATCH", body: JSON.stringify({ ids }) });

export const apiGetSetting = <T = unknown>(key: string) => request<T>(`/api/settings/${key}`);

export const apiSaveSetting = <T = unknown>(key: string, data: unknown) =>
  request<T>(`/api/settings/${key}`, { method: "PUT", body: JSON.stringify(data) });

export const apiSignUpload = (folder: string = "portfolio") =>
  request(`/api/upload-signature`, { method: "POST", body: JSON.stringify({ folder }) });

export const apiListCloudinary = (folder: string = "portfolio") =>
  request(`/api/cloudinary/list?folder=${encodeURIComponent(folder)}`);

export const apiGetProfile = () => request(`/api/admin/profile`);

export const apiUpdateProfile = (data: unknown) =>
  request(`/api/admin/profile`, { method: "PATCH", body: JSON.stringify(data) });

export const apiChangePassword = (data: unknown) =>
  request(`/api/admin/password`, { method: "POST", body: JSON.stringify(data) });
