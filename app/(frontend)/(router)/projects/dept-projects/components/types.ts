import * as React from "react";

// --- Accordion Component Types (Unchanged) ---

export type DeptItemBase = {
  value: string;
  label: string;
  color: string;
};

export type DeptItem = DeptItemBase & {
  content?: React.ReactNode;
  renderContent?: (item: DeptItemBase) => React.ReactNode;
};

export type DepartmentAccordionProps = {
  items: DeptItem[];
  defaultValue?: string;
  minTabWidth?: number;
  durationMs?: number;
  className?: string;
};

export type CSSVars = React.CSSProperties & {
  ["--acc-h"]?: string;
  ["--min-tab-w"]?: string;
  ["--acc-dur"]?: string;
};

export type DeptInputItem = DeptItemBase &
  Partial<Pick<DeptItem, "content" | "renderContent">>;

export type SharedHeightOpts = {
  deps?: ReadonlyArray<unknown>;
  clampVh?: number;
};

// --- Data Structure Types (Updated) ---

/**
 * The processed Project object used by React components after mapping.
 */
export type Project = {
  id: string;    
  title: string;
  imageUrl: string;
  slug: string;
  description: string;
};

/**
 * A map of department names to their list of projects.
 */
export type DeptProjectsMap = Record<string, Project[]>;

/**
 * The raw structure of a single project object as returned by the department API.
 */
export type ApiProject = {
  title: string;
  image_url: string;
  slug: string;
  description: string;
};

/**
 * The complete structure of the API response for a department query.
 */
export type ApiResponse = {
  status?: number;
  count?: number;
  data?: {
    department?: string;
    department_description?: string;
    projects?: ApiProject[];
  };
};