export default async function uploadFile(file: File, folder: string) {
  //Get pre-signed URL
  const res = await fetch("api/v1/upload-url", {
    method: "POST",
    headers: {"Content-types":"application/json"},
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folderName: folder
    }),
  });
  
  const { uploadUrl, key } = await res.json();
  console.log(uploadUrl, key);// check the key.
  //Upload to S3 bucket directly
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type},
    body: file,
  });
  //console.log(file.type)// check the type of the file.
  // Save key/URL to your DB if needed
  const fileUrl = `https://d2prwyp3rwi40.cloudfront.net/${key}`; 
  console.log("File uploaded to S3:", fileUrl);
  return fileUrl;
}

