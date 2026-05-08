export async function uploadWordToJson(file, options = {}) {
  const { shuffle = true } = options;

  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const queryParams = shuffle ? "" : "?shuffle=false";

  const response = await fetch(`${apiUrl}/api/word/to-json${queryParams}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al convertir Word a JSON");
  }

  return data;
}