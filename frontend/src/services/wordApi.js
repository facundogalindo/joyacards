export async function uploadWordToJson(file, options = {}) {
  const { shuffle = true } = options;

  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const queryParams = shuffle ? "" : "?shuffle=false";

  const maxAttempts = 3;
  const transientStatuses = [502, 503, 504];
  let response = null;
  let responseText = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      response = await fetch(`${apiUrl}/api/word/to-json${queryParams}`, {
        method: "POST",
        body: formData
      });
      responseText = await response.text();

      if (
        transientStatuses.includes(response.status) &&
        attempt < maxAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        continue;
      }

      break;
    } catch {
      if (attempt === maxAttempts) {
        throw new Error(
          "No se pudo conectar con el servidor de conversión después de varios intentos. Puede estar reiniciándose o haber un problema de red/CORS. Probá nuevamente en unos segundos."
        );
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
    }
  }

  let data = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      // Proxy/server error pages are often HTML rather than JSON.
    }
  }

  if (!response.ok) {
    if (data?.message) {
      throw new Error(data.message);
    }

    if (transientStatuses.includes(response.status)) {
      throw new Error(
        `El servidor de conversión no está disponible (HTTP ${response.status}). Esperá un momento y volvé a procesar el archivo.`
      );
    }

    throw new Error(
      `Error al convertir Word a JSON (HTTP ${response.status}). El servidor devolvió una respuesta inesperada.`
    );
  }

  if (!data || typeof data !== "object" || !Array.isArray(data.questions)) {
    throw new Error(
      "El servidor respondió con un formato inesperado. Volvé a intentarlo; si persiste, revisá el servicio de conversión."
    );
  }

  return data;
}
