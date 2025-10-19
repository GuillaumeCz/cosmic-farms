import type { JSX } from "react";
import BreadCrumb from "./BreadCrumb";

import './BaseContent.css';

function BaseContent({ children }: { children: JSX.Element }) {
  return (
    <>
      <BreadCrumb />
      <div className="container">
        {children}
        {/* Map */}
      </div>
    </>
  );
}

export default BaseContent;
