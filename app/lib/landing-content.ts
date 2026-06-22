export type PlaceholderItem = {
  id: string;
  label: string;
  status: "待确认";
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
  status: "已确认" | "待确认";
};

export const landingContent = {
  courseName: "LLM 技术全景课",
  heroPromise: "建立完整地图",
  format: "内部分享展示页",
  audienceNote: "适合人群在开场中轻量说明；具体描述待确认。",
  valueItems: [
    {
      id: "value-map",
      title: "建立完整地图",
      description: "作为已确认的课程主张，页面优先突出这条价值线。",
      status: "已确认",
    },
    {
      id: "value-02",
      title: "课程价值 02",
      description: "待确认后补充具体价值说明。",
      status: "待确认",
    },
    {
      id: "value-03",
      title: "课程价值 03",
      description: "待确认后补充具体价值说明。",
      status: "待确认",
    },
  ] satisfies ValueItem[],
  outlinePlaceholders: [
    { id: "module-01", label: "模块 01", status: "待确认" },
    { id: "module-02", label: "模块 02", status: "待确认" },
    { id: "module-03", label: "模块 03", status: "待确认" },
    { id: "module-04", label: "模块 04", status: "待确认" },
  ] satisfies PlaceholderItem[],
};
