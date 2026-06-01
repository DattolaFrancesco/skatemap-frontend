const API = process.env.NEXT_PUBLIC_API_URL;

export async function getUser(){
  const res = await fetch(`${API}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getAllUserandAdmin(){
  const res = await fetch(`${API}/account/all/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteUser(id){
  const res = await fetch(`${API}/account/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function changeRole(id, value){
  const res = await fetch(`${API}/account/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({roleName: value}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}