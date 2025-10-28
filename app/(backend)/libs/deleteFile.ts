export default async function deleteFile(key: string) {
    // Delete file ở S3
      await fetch(`/api/v1/upload-url`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });

}
