export async function getUser(){
  const url = "http://localhost:3003/account";
  const res = await fetch(url, {
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
  const url = "http://localhost:3003/account/all/users";
  const res = await fetch(url, {
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
  const url = `http://localhost:3003/account/${id}`;
  const res = await fetch(url, {
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
export async function changeRole(id,value){
  const url = `http://localhost:3003/account/${id}`;
  const res = await fetch(url, {
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
