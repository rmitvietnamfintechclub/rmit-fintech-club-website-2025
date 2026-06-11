import { useState, useEffect } from "react";

let globalSemester = "";
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
    semesterLabel: semester ? `Semester ${semester.slice(4)} ${semester.slice(0, 4)}` : "", 
  };
};