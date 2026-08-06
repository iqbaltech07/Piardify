export interface ProjectDetailData {
  id: string;
  appName: string;
  appIdea: string;
  formInputs?: string;
  designData?: string;
  createdAt: string;
}

export interface ColorToken {
  token: string;
  hex: string;
  role: string;
}

export interface AccordionSection {
  id: string;
  title: string;
  content: string;
}
