import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default flatRoutes() satisfies RouteConfig;

// import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// export default [
//     layout("./routes/layout.tsx",[
//         route("/", "./routes/_index.tsx")
//     ])
//     // index("routes/_index.tsx")
// ] satisfies RouteConfig;