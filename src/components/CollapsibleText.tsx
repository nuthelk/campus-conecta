import React, { useState, useRef, useEffect } from 'react';

interface CollapsibleTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  text,
  maxLength = 150,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Check if the text length exceeds the limit or if the rendered height is too tall
    if (text.length > maxLength) {
      setShouldCollapse(true);
    } else if (textRef.current) {
      // Also check if the rendered height is greater than expected for short text
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.offsetHeight;
      // If height suggests more than ~3-4 lines, enable collapsing
      if (height > lineHeight * 4) {
        setShouldCollapse(true);
      }
    }
  }, [text, maxLength]);

  const displayText = expanded ? text : text.slice(0, maxLength);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (!shouldCollapse) {
    return <p className={`text-[#1B003A] font-normal text-base ${className}`}>{text}</p>;
  }

  return (
    <div className={className}>
      <p ref={textRef} className="text-[#1B003A] font-normal text-base leading-relaxed">
        {displayText}{!expanded && '...'}
      </p>
      <button
        onClick={toggleExpanded}
        className="mt-2 text-[#6400A9] hover:text-[#4F82C0] font-medium text-sm underline cursor-pointer focus:outline-none"
        aria-expanded={expanded}
      >
        {expanded ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  );
};

export default CollapsibleText;