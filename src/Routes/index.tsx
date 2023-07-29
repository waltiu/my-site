import React from "react";
import SuspenseWrapper from "@/Components/Suspense";


const Init = React.lazy(() => import("@/Pages/Init"));
const Desktop = React.lazy(() => import("@/Pages/Desktop"));


const routeConfig = [
  {
    path: "/init",
    element: <Init/>
  },
  {
    path: "/",
    element: <Desktop/>
  }
];

export default routeConfig;
