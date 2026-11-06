import { useInView } from "../../hooks/useInView";

// Fades and floats its content up the first time it scrolls into view.
// Pass `as` to render a heading, list, etc. instead of a div.
function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView(0.15);

  return (
    <Tag
      ref={ref}
      style={{ animationDelay: `${delay}s`, ...style }}
      className={`${
        inView
          ? "animate-[rise-in_0.8s_cubic-bezier(0.2,0.7,0.3,1)_both] motion-reduce:animate-none"
          : "opacity-0 motion-reduce:opacity-100"
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
