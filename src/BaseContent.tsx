import type { JSX } from "react";
import BreadCrumb from "./BreadCrumb";

function BaseContent({ children }: { children: JSX.Element }) {
  return <>
    <BreadCrumb />
    {children}
  </>;
}

export default BaseContent;
