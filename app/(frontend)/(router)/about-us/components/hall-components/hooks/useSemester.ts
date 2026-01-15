import { useState, useEffect } from "react";

const getDefaultSemester = (): string => {
  const today = new Date();
  const month = today.getMonth(); // 0 = Jan, ..., 11 = Dec
  const year = today.getFullYear();

  // 1. Tháng 1 - 2: Đang là cuối Sem C năm ngoái. 
  // -> Hiện HoF của Sem B năm ngoái.
  if (month <= 1) return `${year - 1}B`;

  // 2. Tháng 3 - 6: Đang là Sem A năm nay. 
  // -> Hiện HoF của Sem C năm ngoái (Vừa xong).
  if (month >= 2 && month <= 5) return `${year - 1}C`;

  // 3. Tháng 7 - 10: Đang là Sem B năm nay. 
  // -> Hiện HoF của Sem A năm nay.
  if (month >= 6 && month <= 9) return `${year}A`;

  // 4. Tháng 11 - 12: Đang là đầu Sem C năm nay. 
  // -> Hiện HoF của Sem B năm nay.
  if (month >= 10) return `${year}B`;

  return `${year}A`; // Fallback
};

// --- Phần còn lại giữ nguyên logic Observer ---
let globalSemester = getDefaultSemester();
const subscribers = new Set<(sem: string) => void>();

export const useSemester = () => {
  const [semester, setSemesterState] = useState(globalSemester);

  useEffect(() => {
    const callback = (newSem: string) => setSemesterState(newSem);
    subscribers.add(callback);
    return () => { subscribers.delete(callback); };
  }, []);

  const setSemester = (newSem: string) => {
    globalSemester = newSem;
    subscribers.forEach((cb) => cb(newSem));
  };

  return {
    semester,
    setSemester,
    semesterLabel: `Semester ${semester.slice(4)}`,
  };
};