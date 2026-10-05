// Compressão de imagem no cliente (sem dependência nova): desenha a foto num
// canvas reduzido e exporta JPEG. Protege o free tier do Supabase (storage e
// egress) e mantém o mapa leve. Trata a orientação EXIF via createImageBitmap.
// Fallback: se o browser não decodificar (ex.: HEIC cru), sobe o arquivo original.
const LADO_MAX = 1600;
const QUALIDADE = 0.8;

export async function comprimirImagem(arquivo: File): Promise<Blob> {
  try {
    const fonte = await decodificar(arquivo);
    const escala = Math.min(1, LADO_MAX / Math.max(fonte.width, fonte.height));
    const largura = Math.max(1, Math.round(fonte.width * escala));
    const altura = Math.max(1, Math.round(fonte.height * escala));

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) return arquivo;
    ctx.drawImage(fonte as CanvasImageSource, 0, 0, largura, altura);
    if ('close' in fonte) (fonte as ImageBitmap).close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALIDADE)
    );
    return blob || arquivo;
  } catch {
    // HEIC não decodificável, canvas indisponível, etc.: sobe o original.
    return arquivo;
  }
}

// Usa createImageBitmap com orientação EXIF quando disponível; senão, um <img>.
async function decodificar(arquivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(arquivo, { imageOrientation: 'from-image' } as ImageBitmapOptions);
    } catch {
      /* cai para o <img> abaixo */
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao decodificar a imagem.'));
    };
    img.src = url;
  });
}
