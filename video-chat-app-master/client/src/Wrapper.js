import App from "./App";
import AnimateSphereBackground from "./background/Animated"
import styles from './background/orb.module.css';

const Wrapper = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.orbCanvas}>
        <AnimateSphereBackground />
      </div>
      <div className={styles.overlay}>
        <App />
      </div>
    </div>
  )
}

export default Wrapper
