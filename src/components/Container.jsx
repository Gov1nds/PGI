export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
}
