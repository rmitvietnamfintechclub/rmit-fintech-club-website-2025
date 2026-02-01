// libs/upload-client.ts
import axios from "axios";

export async function uploadFileToS3(
  file: File, 
  folder: string = "ebmb", 
  customName?: string,
  onProgress?: (percent: number) => void
) {
  const { data } = await axios.post("/api/v1/upload", {
    fileName: file.name,
    fileType: file.type,
    folder: folder,
    customName: customName,
  });

  const { uploadUrl, key } = data;

  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        
        if (onProgress) {
            onProgress(percentCompleted);
        }
      }
    },
  });

  let domain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || "";
  
  // Loại bỏ "http://" hoặc "https://" nếu lỡ nhập vào .env
  domain = domain.replace(/^https?:\/\//, "");
  
  // Loại bỏ dấu "/" ở cuối nếu lỡ nhập vào .env
  domain = domain.replace(/\/$/, "");

  // Ghép lại thành URL chuẩn
  const finalUrl = `https://${domain}/${key}`;
  return finalUrl;
}

export async function deleteFileFromS3(fullUrl: string) {
  if (!fullUrl) return;

  let domain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || "";
  domain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!fullUrl.includes(domain)) return; 

  const key = fullUrl.split(`${domain}/`)[1];

  if (!key) return;

  await axios.delete("/api/v1/upload", {
    data: { key }, 
  });
}