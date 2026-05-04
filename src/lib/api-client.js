async function request(url, init = {}) {
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
  return res.json();
}

export const apiList = (resource) => request(`/api/${resource}`);
export const apiCreate = (resource, data) =>
  request(`/api/${resource}`, { method: "POST", body: JSON.stringify(data) });
export const apiUpdate = (resource, id, data) =>
  request(`/api/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const apiDelete = (resource, id) =>
  request(`/api/${resource}/${id}`, { method: "DELETE" });
export const apiReorder = (resource, ids) =>
  request(`/api/${resource}/reorder`, { method: "PATCH", body: JSON.stringify({ ids }) });
export const apiGetSetting = (key) => request(`/api/settings/${key}`);
export const apiSaveSetting = (key, data) =>
  request(`/api/settings/${key}`, { method: "PUT", body: JSON.stringify(data) });
export const apiSignUpload = (folder = "portfolio") =>
  request(`/api/upload-signature`, { method: "POST", body: JSON.stringify({ folder }) });

export const apiListCloudinary = (folder = "portfolio") =>
  request(`/api/cloudinary/list?folder=${encodeURIComponent(folder)}`);

export const apiGetProfile = () => request(`/api/admin/profile`);
export const apiUpdateProfile = (data) =>
  request(`/api/admin/profile`, { method: "PATCH", body: JSON.stringify(data) });
export const apiChangePassword = (data) =>
  request(`/api/admin/password`, { method: "POST", body: JSON.stringify(data) });
