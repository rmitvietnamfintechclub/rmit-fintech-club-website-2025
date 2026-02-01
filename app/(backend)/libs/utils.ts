import { nanoid } from "nanoid";

export function slugify(str: string): string {
  if (!str) return "";
  
  return str
    .normalize("NFD") // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
    .toLowerCase() // Chuyển về chữ thường
    .replace(/đ/g, "d") // Xử lý chữ đ
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^a-z0-9-]/g, ""); // Xóa các ký tự đặc biệt còn lại
}

export function createSeoFilename(originalName: string, customPrefix?: string) {
  const extension = originalName.split(".").pop();
  
  const baseName = customPrefix 
    ? slugify(customPrefix) 
    : slugify(originalName.split(".")[0]);

  return `${baseName}-${nanoid(5)}.${extension}`;
}