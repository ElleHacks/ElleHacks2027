import styles from "./Hero.module.css";
import block from "../../assets/Hero/Block.png";
import cat from "../../assets/Hero/Cat.png";
import house from "../../assets/Hero/House.png";
import tree2 from "../../assets/Hero/tree 2.png";
import tree1 from "../../assets/Hero/tree1.png";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.layers} aria-hidden="true">
        <img src={house} alt="" className={`${styles.layer} ${styles.house}`} />
        <img src={block} alt="" className={`${styles.layer} ${styles.block}`} />
        <img src={tree1} alt="" className={`${styles.layer} ${styles.tree1}`} />
        <img src={tree2} alt="" className={`${styles.layer} ${styles.tree2}`} />
        <img src={cat} alt="" className={`${styles.layer} ${styles.cat}`} />
      </div>

      <div className={styles.title}>
        <h1 className={`${styles.heading} text-[#c4ecfd]`}>ElleHacks 2027</h1>
        <p className={styles.meta}>
          January 2027 . In-person event . MLH official Member
        </p>
        <button
          type="button"
          className={`${styles.cta} bg-[#c4ecfd] text-[#273659] transition hover:bg-white`}
        >
          Interested in Participating?
        </button>
      </div>
    </section>
  );
}

export default Hero;