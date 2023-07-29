import { WindowsOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.left}>
        <WindowsOutlined />
      </div>
      <div className={styles.middle}>
        <WindowsOutlined />
      </div>
      <div className={styles.right}>
        <WindowsOutlined />
      </div>
    </div>
  );
};
export default Footer;
