
import  { useRef, useEffect } from "react";

const useClickOutsideHook = (handler) => {
  const ref = useRef();

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [ref, handler]);

  return [ref];
};

export default useClickOutsideHook;
