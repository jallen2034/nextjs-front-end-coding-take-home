import { useEffect, useState } from "react";


const useWindowSize = () => {
  // Initialize windowSize state with default values
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : undefined,
    height: typeof window !== "undefined" ? window.innerHeight : undefined,
  });
  
  useEffect(() => {
    // Define the function to handle window resizing
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add event listener for resize events
    window.addEventListener('resize', handleResize);
    
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return windowSize;
};

export default useWindowSize