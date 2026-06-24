import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("chapters/01", "routes/chapter-one.tsx"),
  route("chapters/01/demos/direct", "routes/chapter-one-demo-direct.tsx"),
  route("chapters/01/demos/streaming", "routes/chapter-one-demo-streaming.tsx"),
  route("chapters/01/demos/tool-call", "routes/chapter-one-demo-tool-call.tsx"),
  route("chapters/:chapterId", "routes/chapter.tsx"),
  route("chapters/:chapterId/demos/:demoId", "routes/chapter-demo.tsx"),
] satisfies RouteConfig;
