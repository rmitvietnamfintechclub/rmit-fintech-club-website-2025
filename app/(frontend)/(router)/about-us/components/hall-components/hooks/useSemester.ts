import { useState, useEffect } from "react";

const getDefaultSemester = (): string => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  if (month <= 1) return `${year - 1}B`;
  if (month >= 2 && month <= 5) return `${year - 1}C`;
  if (month >= 6 && month <= 9) return `${year}A`;
  if (month >= 10) return `${year}B`;

  return `${year}A`;
};

export const getAvailableSemesters = (): string[] => {
  const defaultSem = getDefaultSemester();
  const maxYear = parseInt(defaultSem.slice(0, 4));
  const maxLetter = defaultSem.slice(4);
  const letters = ["A", "B", "C"];
  const results: string[] = [];

  for (let y = maxYear; y >= 2025; y--) {
    for (let i = 2; i >= 0; i--) {
      const l = letters[i];
      if (y === maxYear && l > maxLetter) continue; 
      results.push(`${y}${l}`);
    }
  }
  return results;
};

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
    semesterLabel: `Semester ${semester.slice(4)} ${semester.slice(0, 4)}`, 
  };
};