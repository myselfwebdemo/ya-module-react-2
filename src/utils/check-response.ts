export default function checkResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Ошибка запроса: ${res.status} ${res.statusText}`));
}
