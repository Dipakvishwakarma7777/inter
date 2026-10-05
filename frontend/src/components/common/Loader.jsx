export default function Loader({ fullPage = false, text = "Loading..." }) {
  return (
    <div className={`loader-wrap ${fullPage ? "loader-full" : ""}`}>
      <div className="loader" />
      {text && <span>{text}</span>}
    </div>
  );
}
