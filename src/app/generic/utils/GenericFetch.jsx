export async function registerSpot(form){
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const url = `http://localhost:3003/spots`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}