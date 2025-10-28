import { useState } from "react";

const getDefaultSemester = (): string => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  if (month >= 10 || month <= 0) return `${year}B`; // Nov–Jan
  if (month >= 6 && month <= 9) return `${year}A`;  // Jul–Oct
  if (month >= 2 && month <= 4) return `${year}C`;  // Mar–May

  return `${year}A`;
};

let globalSemester = getDefaultSemester();
let subscribers: ((sem: string) => void)[] = [];

export const useSemester = () => {
  const [semester, setSemester] = useState(globalSemester);

  const updateSemester = (newSem: string) => {
    globalSemester = newSem;
    subscribers.forEach((cb) => cb(newSem));
  };

  if (!subscribers.includes(setSemester)) {
    subscribers.push(setSemester);
  }

  return {
    semester,
    setSemester: updateSemester,
    semesterLabel: `Semester ${semester.charAt(4)}`,
  };
};
