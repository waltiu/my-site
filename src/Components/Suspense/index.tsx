import { ReactNode, Suspense } from "react";

export const SuspenseWrapper = ({children}:{children:ReactNode})=> {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
      </div>
    );
}
  
export default SuspenseWrapper
