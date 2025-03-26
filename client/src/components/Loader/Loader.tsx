import styles from "./Loader.module.css";

interface Props {
  width?: string;
  height?: string;
}

function Loader({ width = "5rem", height = "5rem" }: Props) {
  return (
    <span
      className={styles.container}
      style={{ "--loader-width": width, "--loader-height": height } as React.CSSProperties}
    ></span>
  );
}

export default Loader;
